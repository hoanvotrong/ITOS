-- ==========================================================
-- Module Điều độ khai thác — bản chạy thử (pilot) · Supabase / PostgreSQL
-- Dùng CHUNG project Supabase với /warehouse (Kho). Chạy toàn bộ file trong SQL Editor.
-- Chạy lại được (create or replace / if not exists).
--
-- Khác gói bàn giao (supabase_dieudo.sql):
--   * Thêm bảng dd_users (giống app_users của Kho). Chỉ email có trong dd_users mới đọc/ghi
--     dữ liệu Điều độ — tài khoản Kho không tự động thấy dữ liệu Điều độ và ngược lại.
--   * Vai trò lấy từ dd_users.role, KHÔNG lấy từ user_metadata (người dùng tự sửa được
--     user_metadata qua supabase.auth.updateUser, sẽ tự nâng quyền được).
--   * Hàm web tài xế trả lỗi dạng { err } thay vì raise, để ghi được lượt nhập sai mã
--     và khoá 15 phút sau 10 lần sai.
--   * Thời gian trong dữ liệu ghi dạng ISO UTC; giao diện hiển thị GMT+7.
-- ==========================================================

-- 0. Người dùng Điều độ ---------------------------------------
create table if not exists public.dd_users (
  email      text primary key,                 -- chữ thường, trùng email tài khoản Supabase Auth
  name       text not null,
  short      text not null default '',
  role       text not null check (role in ('KHTH', 'TP', 'TALLY', 'DPVT', 'TAIXE')),
  tally_acc  text,                             -- chỉ với role TALLY: tc-icd-1 | tc-icd-2 | tc-bp-1 | tc-bp-2
  color      int  not null default 0,
  active     boolean not null default true,
  created_at timestamptz not null default now(),
  check (role <> 'TALLY' or tally_acc in ('tc-icd-1', 'tc-icd-2', 'tc-bp-1', 'tc-bp-2'))
);

create or replace function public.dd_email() returns text
language sql stable as $$ select lower(coalesce(auth.jwt() ->> 'email', '')) $$;

create or replace function public.dd_role() returns text
language sql stable security definer set search_path = public as $$
  select role from dd_users where email = dd_email() and active
$$;

-- 1. Dữ liệu nghiệp vụ: mỗi phần tử của các mảng toàn cục trong prototype là 1 dòng
create table if not exists public.dd_docs (
  coll        text        not null,          -- jobs | orders | records | edit_reqs | incidents | trans | cont_reg | gate_log | calls | ship_orders
  id          text        not null,
  data        jsonb       not null,
  updated_at  timestamptz not null default now(),
  updated_by  text,                          -- email người ghi (hoặc 'driver:<biển số>')
  primary key (coll, id)
);
create index if not exists dd_docs_coll_idx on public.dd_docs (coll);

-- 2. Danh mục: khách hàng, bến, xe, thiết bị / cẩu, hãng tàu
create table if not exists public.dd_catalog (
  kind  text not null check (kind in ('customer', 'berth', 'vehicle', 'equip', 'line', 'contract')),
  id    text not null,
  data  jsonb not null,
  primary key (kind, id)
);

-- Máy chủ tự đóng dấu người ghi / giờ ghi (không tin giá trị trình duyệt gửi lên)
create or replace function public.dd_stamp() returns trigger
language plpgsql as $$
begin
  new.updated_at := now();
  if auth.role() = 'authenticated' then new.updated_by := dd_email(); end if;
  return new;
end $$;
drop trigger if exists dd_docs_stamp on public.dd_docs;
create trigger dd_docs_stamp before insert or update on public.dd_docs
  for each row execute function public.dd_stamp();

-- 3. RLS --------------------------------------------------------
alter table public.dd_users   enable row level security;
alter table public.dd_docs    enable row level security;
alter table public.dd_catalog enable row level security;

drop policy if exists dd_users_read on public.dd_users;
create policy dd_users_read on public.dd_users
  for select to authenticated using (dd_role() is not null);
-- Thêm / sửa người dùng: chỉ qua SQL Editor (quản trị viên), không có policy ghi.

drop policy if exists dd_docs_rw on public.dd_docs;
create policy dd_docs_rw on public.dd_docs
  for all to authenticated using (dd_role() is not null) with check (dd_role() is not null);

drop policy if exists dd_catalog_read on public.dd_catalog;
create policy dd_catalog_read on public.dd_catalog
  for select to authenticated using (dd_role() is not null);

-- Bảng đã tạo trước khi có hợp đồng: mở rộng ràng buộc kind
alter table public.dd_catalog drop constraint if exists dd_catalog_kind_check;
alter table public.dd_catalog add constraint dd_catalog_kind_check check (kind in ('customer', 'berth', 'vehicle', 'equip', 'line', 'contract'));

-- KHTH / TP sửa danh mục (xe mới trong lệnh ca tự thêm vào danh mục — BR-DD-08)
drop policy if exists dd_catalog_write on public.dd_catalog;
create policy dd_catalog_write on public.dd_catalog
  for all to authenticated
  using (dd_role() in ('KHTH', 'TP'))
  with check (dd_role() in ('KHTH', 'TP'));

-- anon (tài xế xe ngoài) KHÔNG đọc bảng — chỉ gọi 3 hàm ở mục 5
revoke all on public.dd_users, public.dd_docs, public.dd_catalog from anon;

-- 4. Realtime cho đồng bộ nhiều thiết bị (Realtime vẫn tuân theo RLS)
do $$ begin
  alter publication supabase_realtime add table public.dd_docs;
exception when duplicate_object then null; end $$;

-- 5. Web tài xế xe ngoài (BR-VT-04, BR-GATE-12, BR-GATE-14) — security definer
create table if not exists public.dd_driver_fails (
  plate text not null,
  at    timestamptz not null default now()
);
create index if not exists dd_driver_fails_at_idx on public.dd_driver_fails (at);
alter table public.dd_driver_fails enable row level security;   -- không policy: chỉ hàm security definer ghi
revoke all on public.dd_driver_fails from anon, authenticated;

create or replace function public.dd_iso_now() returns text
language sql stable as $$ select to_char(now() at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS"Z"') $$;

-- Phần job tài xế được xem: chỉ thông tin cần để chọn cont (không có nhật ký, ghi chú, HĐ…)
create or replace function public.dd_driver_view(o jsonb, j jsonb) returns jsonb
language sql stable security definer set search_path = public as $$
  select jsonb_build_object(
    'order', jsonb_build_object('id', o->>'id', 'shift', o->'shift', 'date', o->>'date', 'drvCode', o->>'drvCode', 'status', o->>'status'),
    'job', jsonb_build_object(
      'id', j->>'id', 'customer', j->>'customer', 'kind', j->>'kind', 'service', j->>'service', 'contDir', j->>'contDir', 'status', j->>'status',
      'customerName', (select coalesce(nullif(data->>'shortName', ''), data->>'name') from dd_catalog where kind = 'customer' and id = j->>'customer'),
      'conts', coalesce((select jsonb_agg(jsonb_strip_nulls(jsonb_build_object(
          'no', c->>'no', 'type', c->>'type', 'fe', c->>'fe', 'dir', c->>'dir', 'dest', c->>'dest', 'status', c->>'status',
          'gin', c->'gin', 'gout', c->'gout', 'closedAs', c->>'closedAs', 'truck', c->>'truck', 'at', c->>'at',
          'drvTruck', c->>'drvTruck', 'drvAt', c->>'drvAt')))
        from jsonb_array_elements(j->'conts') c), '[]'::jsonb)))
$$;

create or replace function public.dd_plate_key(p text) returns text
language sql immutable as $$ select upper(regexp_replace(coalesce(p, ''), '[[:space:].-]', '', 'g')) $$;

-- Kiểm tra biển số + mã ca. Trả về { order, job } (bản đầy đủ, dùng nội bộ) hoặc { err }
create or replace function public.dd_driver_check(p_plate text, p_code text)
returns jsonb language plpgsql security definer set search_path = public as $$
-- Biển số so khớp bỏ qua khoảng trắng, dấu chấm, gạch ngang (pilot: tài xế gõ "51C 888.21" vẫn khớp "51C-888.21")
declare o jsonb; j jsonb; v_plate text := dd_plate_key(p_plate);
begin
  if (select count(*) from dd_driver_fails f where f.plate = v_plate and f.at > now() - interval '15 minutes') >= 10
     or (select count(*) from dd_driver_fails f where f.at > now() - interval '1 minute') >= 60 then
    return jsonb_build_object('err', 'Nhập sai quá nhiều lần — thử lại sau 15 phút');
  end if;
  select data into o from dd_docs where coll = 'orders' and data->>'drvCode' = trim(coalesce(p_code, '')) and data->>'status' not in ('draft', 'cancelled') limit 1;
  if o is null then
    insert into dd_driver_fails (plate) values (v_plate);
    return jsonb_build_object('err', 'Mã đăng nhập không đúng');
  end if;
  select data into j from dd_docs where coll = 'jobs' and id = o->>'job';
  if j is null then return jsonb_build_object('err', 'Mã đăng nhập không đúng'); end if;
  if j->>'status' in ('done', 'pendingEx', 'closed', 'cancelled') then
    return jsonb_build_object('err', case when j->>'status' = 'cancelled' then 'Mã đã hết hạn — job đã huỷ' else 'Mã đã hết hạn — job đã hoàn thành' end);
  end if;
  if o->>'status' = 'done' then
    return jsonb_build_object('err', 'Mã đã hết hạn — ' || case when o->>'shift' = '2' then 'Ca 2' else 'Ca 1' end || ' ' || left(o->>'date', 5) || ' đã kết ca');
  end if;
  if not exists (select 1 from jsonb_array_elements_text(o->'vehicles') v where dd_plate_key(v) = v_plate) then
    insert into dd_driver_fails (plate) values (v_plate);
    return jsonb_build_object('err', 'Biển số không có trong danh sách xe của lệnh ca');
  end if;
  return jsonb_build_object('order', o, 'job', j,
    'plate', (select v from jsonb_array_elements_text(o->'vehicles') v where dd_plate_key(v) = v_plate limit 1));
end $$;

create or replace function public.dd_driver_login(p_plate text, p_code text)
returns jsonb language plpgsql security definer set search_path = public as $$
declare r jsonb;
begin
  r := dd_driver_check(p_plate, p_code);
  if r ? 'err' then return r; end if;
  return dd_driver_view(r->'order', r->'job') || jsonb_build_object('plate', r->>'plate');
end $$;

-- Gắn cont vào xe: 1 cont chỉ 1 xe; xe tối đa 2 TEU (20' = 1, 40'/45' = 2); bắt buộc có ảnh
create or replace function public.dd_driver_attach(p_plate text, p_code text, p_cont text, p_photo text)
returns jsonb language plpgsql security definer set search_path = public as $$
declare r jsonb; j jsonb; c jsonb; i int; used int := 0; teu int; plate text; n int;
begin
  r := dd_driver_check(p_plate, p_code);
  if r ? 'err' then return r; end if;
  plate := r->>'plate';
  if coalesce(p_photo, '') !~ '^driver/[A-Za-z0-9._-]+$' then return jsonb_build_object('err', 'Thiếu ảnh cont trên xe'); end if;
  select data into j from dd_docs where coll = 'jobs' and id = r->'order'->>'job' for update;
  n := coalesce(jsonb_array_length(j->'conts'), 0);
  for i in 0 .. n - 1 loop
    c := j->'conts'->i;
    if c->>'drvTruck' = plate and not dd_cont_done(c, j) then
      used := used + case when left(c->>'type', 1) = '2' then 1 else 2 end;
    end if;
  end loop;
  for i in 0 .. n - 1 loop
    c := j->'conts'->i;
    if c->>'no' = p_cont then
      if dd_cont_done(c, j) or c->>'closedAs' is not null then return jsonb_build_object('err', 'Cont đã xong'); end if;
      if c->>'drvTruck' = plate then return jsonb_build_object('err', 'Cont đã gắn vào xe này'); end if;
      if c->>'drvTruck' is not null then return jsonb_build_object('err', 'Cont đã gắn xe khác'); end if;
      teu := case when left(c->>'type', 1) = '2' then 1 else 2 end;
      if used + teu > 2 then return jsonb_build_object('err', 'Vượt sức chở xe'); end if;
      j := jsonb_set(j, array['conts', i::text], c || jsonb_build_object('drvTruck', plate, 'drvPhoto', p_photo,
             'drvAt', to_char(now() at time zone 'Asia/Ho_Chi_Minh', 'HH24:MI')));
      j := jsonb_set(j, '{log}', jsonb_build_array(jsonb_build_object('at', dd_iso_now(), 'by', plate,
             'text', 'Tài xế xe ' || plate || ' nhận ' || p_cont || ' trên web tài xế (có ảnh)')) || coalesce(j->'log', '[]'::jsonb));
      update dd_docs set data = j, updated_by = 'driver:' || plate where coll = 'jobs' and id = j->>'id';
      return dd_driver_view(r->'order', j) || jsonb_build_object('plate', plate);
    end if;
  end loop;
  return jsonb_build_object('err', 'Cont không có trong job');
end $$;

-- Cont đã xong theo hướng: nhập lưu bãi = Gate In, còn lại = Gate Out (ddContDone)
create or replace function public.dd_cont_done(c jsonb, j jsonb) returns boolean
language sql immutable as $$
  select case when coalesce(c->>'dir', j->>'contDir') = 'import' then coalesce((c->>'gin')::boolean, false)
              else coalesce((c->>'gout')::boolean, false) end
$$;

-- Bỏ gắn: chỉ cont của xe mình, trước khi tally xác nhận gate; bắt buộc lý do; giữ lịch sử + ảnh
create or replace function public.dd_driver_unassign(p_plate text, p_code text, p_cont text, p_reason text)
returns jsonb language plpgsql security definer set search_path = public as $$
declare r jsonb; j jsonb; c jsonb; i int; plate text;
begin
  if p_reason not in ('Chọn nhầm', 'Xe hỏng', 'Đổi xe') then return jsonb_build_object('err', 'Lý do không hợp lệ'); end if;
  r := dd_driver_check(p_plate, p_code);
  if r ? 'err' then return r; end if;
  plate := r->>'plate';
  select data into j from dd_docs where coll = 'jobs' and id = r->'order'->>'job' for update;
  for i in 0 .. coalesce(jsonb_array_length(j->'conts'), 0) - 1 loop
    c := j->'conts'->i;
    if c->>'no' = p_cont then
      if c->>'drvTruck' is distinct from plate then return jsonb_build_object('err', 'Cont không gắn với xe này'); end if;
      if dd_cont_done(c, j) then return jsonb_build_object('err', 'Tally đã xác nhận gate — không bỏ gắn được'); end if;
      c := (c - 'drvTruck' - 'drvPhoto') || jsonb_build_object('drvHist', coalesce(c->'drvHist', '[]'::jsonb) ||
            jsonb_build_array(jsonb_build_object('truck', plate, 'at', c->>'drvAt', 'photo', c->>'drvPhoto', 'why', p_reason,
              'offAt', to_char(now() at time zone 'Asia/Ho_Chi_Minh', 'HH24:MI'))));
      j := jsonb_set(j, array['conts', i::text], c);
      j := jsonb_set(j, '{log}', jsonb_build_array(jsonb_build_object('at', dd_iso_now(), 'by', plate,
            'text', 'Tài xế xe ' || plate || ' bỏ gắn ' || p_cont || ' · lý do: ' || p_reason || ' (ảnh lúc gắn vẫn lưu)')) || coalesce(j->'log', '[]'::jsonb));
      update dd_docs set data = j, updated_by = 'driver:' || plate where coll = 'jobs' and id = j->>'id';
      return dd_driver_view(r->'order', j) || jsonb_build_object('plate', plate);
    end if;
  end loop;
  return jsonb_build_object('err', 'Cont không có trong job');
end $$;

revoke all on function public.dd_driver_check(text, text) from public, anon, authenticated;
revoke all on function public.dd_driver_view(jsonb, jsonb) from public, anon;
grant execute on function public.dd_driver_login(text, text)                   to anon, authenticated;
grant execute on function public.dd_driver_attach(text, text, text, text)      to anon, authenticated;
grant execute on function public.dd_driver_unassign(text, text, text, text)    to anon, authenticated;

-- 6. Ảnh: bucket private 'dieudo-photos' (tối đa 8 MB, chỉ ảnh) --------------
--    * Người dùng Điều độ (dd_users) đọc / ghi mọi ảnh.
--    * Tài xế xe ngoài (anon) chỉ được TẢI LÊN vào thư mục driver/, không đọc / liệt kê / xoá được.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('dieudo-photos', 'dieudo-photos', false, 8388608, array['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif'])
on conflict (id) do update set public = false, file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists dd_photos_member_read on storage.objects;
create policy dd_photos_member_read on storage.objects for select to authenticated
  using (bucket_id = 'dieudo-photos' and public.dd_role() is not null);

drop policy if exists dd_photos_member_write on storage.objects;
create policy dd_photos_member_write on storage.objects for insert to authenticated
  with check (bucket_id = 'dieudo-photos' and public.dd_role() is not null);

drop policy if exists dd_photos_driver_upload on storage.objects;
create policy dd_photos_driver_upload on storage.objects for insert to anon
  with check (bucket_id = 'dieudo-photos' and name like 'driver/%');

-- 7. Thêm người dùng (sau khi tạo tài khoản ở Authentication → Users, tick Auto Confirm User)
-- insert into dd_users (email, name, short, role) values ('khth1@congty.vn', 'Nguyễn Văn A', 'NVA', 'KHTH');
-- insert into dd_users (email, name, short, role) values ('truongphong@congty.vn', 'Trần Văn B', 'TVB', 'TP');
-- insert into dd_users (email, name, short, role, tally_acc) values ('tally-ca1-icd@congty.vn', 'Tally Ca 1 · ICD', 'C1', 'TALLY', 'tc-icd-1');
-- insert into dd_users (email, name, short, role, tally_acc) values ('tally-ca2-icd@congty.vn', 'Tally Ca 2 · ICD', 'C2', 'TALLY', 'tc-icd-2');
