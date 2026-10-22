-- ==========================================================
-- Kho Bãi — cơ sở dữ liệu dùng chung trên Supabase
-- Chạy toàn bộ file này một lần trong Supabase → SQL Editor.
-- Chạy lại cũng được (các lệnh đều viết dạng "create or replace / if not exists").
--
-- Nguyên tắc:
--   * Tồn kho luôn tính từ sổ giao dịch (txns), giống bản chạy trên trình duyệt.
--   * Phiếu chỉ được ghi/xóa qua hàm post_txn / delete_txn: hàm khóa sổ, cấp số
--     phiếu và từ chối nếu làm tồn của lô nào đó âm tại bất kỳ thời điểm nào.
--   * Chỉ email có trong bảng app_users mới đọc/ghi được dữ liệu.
-- ==========================================================

-- ---------- người dùng được phép ----------
create table if not exists app_users (
  email      text primary key,
  role       text not null default 'staff' check (role in ('staff', 'admin')),
  created_at timestamptz not null default now()
);

create or replace function current_email() returns text
language sql stable as $$ select lower(coalesce(auth.jwt() ->> 'email', '')) $$;

create or replace function is_member() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from app_users where email = current_email())
$$;

create or replace function is_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from app_users where email = current_email() and role = 'admin')
$$;

-- ---------- danh mục ----------
create table if not exists customers (
  id        text primary key,
  code      text not null unique,
  name      text not null,
  tax_code  text not null default '',
  contact   text not null default '',
  phone     text not null default '',
  email     text not null default '',
  address   text not null default '',
  note      text not null default ''
);

create table if not exists cargos (
  id     text primary key,
  code   text not null unique,
  name   text not null,
  grp    text not null default '',
  unit   text not null default 'tấn',
  note   text not null default ''
);

-- Khu xếp hàng trong kho (mặt bằng kho VNL-02A/02B cố định trong code: w_02a, w_02b)
create table if not exists zones (
  id           text primary key,
  warehouse_id text not null,
  code         text not null,
  name         text not null default '',
  customer_id  text references customers (id) on delete set null,
  cargo_id     text references cargos (id) on delete set null,
  x            numeric not null,
  y            numeric not null,
  w            numeric not null check (w > 0),
  h            numeric not null check (h > 0),
  capacity     numeric not null default 0,
  note         text not null default '',
  unique (warehouse_id, code)
);

-- ---------- sổ giao dịch ----------
create table if not exists txns (
  id             text primary key,
  no             text not null unique,
  type           text not null check (type in ('IN', 'OUT', 'TRANSFER', 'ADJUST')),
  date           date not null,
  customer_id    text not null references customers (id),
  cargo_id       text not null references cargos (id),
  zone_id        text not null references zones (id),
  to_zone_id     text references zones (id),
  to_customer_id text references customers (id),
  qty            numeric(14, 3) not null,
  vehicle        text not null default '',
  doc_ref        text not null default '',
  note           text not null default '',
  created_at     timestamptz not null default now(),
  created_by     text not null default ''
);
create index if not exists txns_date_idx on txns (date, created_at);
create index if not exists txns_customer_idx on txns (customer_id);

-- Bộ đếm số phiếu theo loại
create table if not exists counters (
  type text primary key,
  n    integer not null default 0
);

-- Mỗi phiếu → các bút toán (khách, hàng, khu, ±số lượng)
-- security_invoker: view tuân theo quyền (RLS) của người gọi, không lộ dữ liệu qua API
create or replace view txn_effects with (security_invoker = true) as
  select t.id as txn_id, t.date, t.created_at, t.customer_id, t.cargo_id, t.zone_id,
         case when t.type in ('IN', 'ADJUST') then t.qty else -t.qty end as delta
    from txns t
  union all
  select t.id, t.date, t.created_at, coalesce(t.to_customer_id, t.customer_id), t.cargo_id, coalesce(t.to_zone_id, t.zone_id), t.qty
    from txns t
   where t.type = 'TRANSFER';

-- Tìm thời điểm đầu tiên tồn của một lô bị âm. p_keys = 'khách|hàng|khu'; null = kiểm tra mọi lô.
create or replace function ledger_check(p_keys text[])
returns table (txn_id text, customer_id text, cargo_id text, zone_id text, date date, balance numeric)
language sql stable security definer set search_path = public as $$
  select s.txn_id, s.customer_id, s.cargo_id, s.zone_id, s.date, s.bal
    from (
      select e.*, sum(e.delta) over (
               partition by e.customer_id, e.cargo_id, e.zone_id
               order by e.date, e.created_at, e.txn_id
               rows unbounded preceding) as bal
        from txn_effects e
       where p_keys is null or (e.customer_id || '|' || e.cargo_id || '|' || e.zone_id) = any (p_keys)
    ) s
   where s.bal < -0.0005
   order by s.date, s.created_at
   limit 1
$$;

create or replace function lot_label(p_customer text, p_cargo text, p_zone text) returns text
language sql stable security definer set search_path = public as $$
  select coalesce((select name from cargos where id = p_cargo), '?') || ' của ' ||
         coalesce((select name from customers where id = p_customer), '?') || ' tại khu ' ||
         coalesce((select code from zones where id = p_zone), '?')
$$;

-- Khóa sổ: mọi thao tác ghi sổ chạy tuần tự (khối lượng ghi nhỏ nên đủ dùng)
create or replace function lock_ledger() returns void
language sql as $$ select pg_advisory_xact_lock(4242) $$;

-- ---------- ghi phiếu ----------
create or replace function post_txn(p jsonb) returns txns
language plpgsql security definer set search_path = public as $$
declare
  v      txns;
  v_type text    := p ->> 'type';
  v_qty  numeric := round((p ->> 'qty')::numeric, 3);
  v_date date    := (p ->> 'date')::date;
  v_n    integer;
  v_bad  record;
begin
  if not is_member() then
    raise exception 'Tài khoản % chưa được cấp quyền dùng hệ thống kho.', current_email();
  end if;
  if v_type not in ('IN', 'OUT', 'TRANSFER', 'ADJUST') then raise exception 'Loại phiếu không hợp lệ.'; end if;
  if v_qty is null or (v_type <> 'ADJUST' and v_qty <= 0) or v_qty = 0 then raise exception 'Số lượng không hợp lệ.'; end if;
  if v_date is null or v_date > current_date + 1 then raise exception 'Ngày chứng từ không hợp lệ.'; end if;
  if v_type = 'TRANSFER' then
    if coalesce(p ->> 'toZoneId', '') = '' then raise exception 'Chưa chọn khu đến.'; end if;
    if p ->> 'toZoneId' = p ->> 'zoneId'
       and coalesce(nullif(p ->> 'toCustomerId', ''), p ->> 'customerId') = p ->> 'customerId' then
      raise exception 'Khu đến hoặc chủ hàng mới phải khác.';
    end if;
  end if;

  perform lock_ledger();

  insert into counters (type, n) values (v_type, 1)
  on conflict (type) do update set n = counters.n + 1
  returning n into v_n;

  insert into txns (id, no, type, date, customer_id, cargo_id, zone_id, to_zone_id, to_customer_id,
                    qty, vehicle, doc_ref, note, created_by)
  values (
    coalesce(nullif(p ->> 'id', ''), gen_random_uuid()::text),
    (case v_type when 'IN' then 'PN' when 'OUT' then 'PX' when 'TRANSFER' then 'PC' else 'KK' end)
      || to_char(v_date, 'YYMM') || '-' || lpad(v_n::text, 4, '0'),
    v_type, v_date, p ->> 'customerId', p ->> 'cargoId', p ->> 'zoneId',
    case when v_type = 'TRANSFER' then p ->> 'toZoneId' end,
    case when v_type = 'TRANSFER' then coalesce(nullif(p ->> 'toCustomerId', ''), p ->> 'customerId') end,
    v_qty, coalesce(p ->> 'vehicle', ''), coalesce(p ->> 'docRef', ''), coalesce(p ->> 'note', ''), current_email()
  )
  returning * into v;

  select * into v_bad from ledger_check(array[
    v.customer_id || '|' || v.cargo_id || '|' || v.zone_id,
    coalesce(v.to_customer_id, v.customer_id) || '|' || v.cargo_id || '|' || coalesce(v.to_zone_id, v.zone_id)
  ]);
  if found then
    raise exception 'Không đủ tồn: % sẽ thiếu % tấn vào ngày %. Kiểm tra lại số lượng hoặc ngày chứng từ (có thể người khác vừa xuất lô này).',
      lot_label(v_bad.customer_id, v_bad.cargo_id, v_bad.zone_id), trim_scale(round(-v_bad.balance, 3)), to_char(v_bad.date, 'DD/MM/YYYY');
  end if;

  return v;
end;
$$;

-- ---------- xóa phiếu ----------
create or replace function delete_txn(p_id text) returns void
language plpgsql security definer set search_path = public as $$
declare
  v     txns;
  v_bad record;
begin
  if not is_member() then raise exception 'Tài khoản chưa được cấp quyền.'; end if;
  perform lock_ledger();
  select * into v from txns where id = p_id;
  if not found then raise exception 'Không tìm thấy phiếu (có thể đã bị xóa).'; end if;

  delete from txns where id = p_id;

  select * into v_bad from ledger_check(array[
    v.customer_id || '|' || v.cargo_id || '|' || v.zone_id,
    coalesce(v.to_customer_id, v.customer_id) || '|' || v.cargo_id || '|' || coalesce(v.to_zone_id, v.zone_id)
  ]);
  if found then
    raise exception 'Không thể xóa phiếu %: % sẽ âm % tấn vào ngày %.',
      v.no, lot_label(v_bad.customer_id, v_bad.cargo_id, v_bad.zone_id), trim_scale(round(-v_bad.balance, 3)), to_char(v_bad.date, 'DD/MM/YYYY');
  end if;
end;
$$;

-- ---------- thay toàn bộ dữ liệu (khôi phục / gộp dữ liệu) — chỉ quản trị ----------
-- p có dạng giống file sao lưu của ứng dụng: { customers, cargos, zones, txns }
create or replace function import_snapshot(p jsonb) returns jsonb
language plpgsql security definer set search_path = public as $$
declare
  v_bad record;
begin
  if not is_admin() then raise exception 'Chỉ quản trị viên được thay toàn bộ dữ liệu.'; end if;
  perform lock_ledger();

  delete from txns where true;
  delete from zones where true;
  delete from customers where true;
  delete from cargos where true;
  delete from counters where true;

  insert into customers (id, code, name, tax_code, contact, phone, email, address, note)
  select x.id, upper(trim(x.code)), x.name, coalesce(x."taxCode", ''), coalesce(x.contact, ''), coalesce(x.phone, ''),
         coalesce(x.email, ''), coalesce(x.address, ''), coalesce(x.note, '')
    from jsonb_to_recordset(coalesce(p -> 'customers', '[]')) as x(id text, code text, name text, "taxCode" text,
         contact text, phone text, email text, address text, note text);

  insert into cargos (id, code, name, grp, unit, note)
  select x.id, upper(trim(x.code)), x.name, coalesce(x."group", ''), coalesce(x.unit, 'tấn'), coalesce(x.note, '')
    from jsonb_to_recordset(coalesce(p -> 'cargos', '[]')) as x(id text, code text, name text, "group" text, unit text, note text);

  insert into zones (id, warehouse_id, code, name, customer_id, cargo_id, x, y, w, h, capacity, note)
  select x.id, x."warehouseId", x.code, coalesce(x.name, ''), nullif(x."customerId", ''), nullif(x."cargoId", ''),
         x.x, x.y, x.w, x.h, coalesce(x.capacity, 0), coalesce(x.note, '')
    from jsonb_to_recordset(coalesce(p -> 'zones', '[]')) as x(id text, "warehouseId" text, code text, name text,
         "customerId" text, "cargoId" text, x numeric, y numeric, w numeric, h numeric, capacity numeric, note text);

  insert into txns (id, no, type, date, customer_id, cargo_id, zone_id, to_zone_id, to_customer_id,
                    qty, vehicle, doc_ref, note, created_at, created_by)
  select x.id, x.no, x.type, x.date, x."customerId", x."cargoId", x."zoneId",
         nullif(x."toZoneId", ''), nullif(x."toCustomerId", ''), x.qty,
         coalesce(x.vehicle, ''), coalesce(x."docRef", ''), coalesce(x.note, ''),
         coalesce(to_timestamp(x."createdAt" / 1000.0), now()), coalesce(x."createdBy", current_email())
    from jsonb_to_recordset(coalesce(p -> 'txns', '[]')) as x(id text, no text, type text, date date,
         "customerId" text, "cargoId" text, "zoneId" text, "toZoneId" text, "toCustomerId" text, qty numeric,
         vehicle text, "docRef" text, note text, "createdAt" double precision, "createdBy" text);

  insert into counters (type, n)
  select type, max(((regexp_match(no, '(\d+)$'))[1])::int) from txns group by type;

  select * into v_bad from ledger_check(null);
  if found then
    raise exception 'Dữ liệu nhập vào làm tồn âm: % thiếu % tấn ngày %.',
      lot_label(v_bad.customer_id, v_bad.cargo_id, v_bad.zone_id), trim_scale(round(-v_bad.balance, 3)), to_char(v_bad.date, 'DD/MM/YYYY');
  end if;

  return jsonb_build_object(
    'customers', (select count(*) from customers), 'cargos', (select count(*) from cargos),
    'zones', (select count(*) from zones), 'txns', (select count(*) from txns));
end;
$$;

-- ---------- phân quyền ----------
alter table app_users enable row level security;
alter table customers enable row level security;
alter table cargos    enable row level security;
alter table zones     enable row level security;
alter table txns      enable row level security;
alter table counters  enable row level security;

drop policy if exists "own row" on app_users;
create policy "own row" on app_users for select to authenticated using (email = current_email());

drop policy if exists "members" on customers;
create policy "members" on customers for all to authenticated using (is_member()) with check (is_member());
drop policy if exists "members" on cargos;
create policy "members" on cargos for all to authenticated using (is_member()) with check (is_member());
drop policy if exists "members" on zones;
create policy "members" on zones for all to authenticated using (is_member()) with check (is_member());

-- Phiếu và bộ đếm: chỉ đọc trực tiếp; ghi/xóa phải qua post_txn / delete_txn
drop policy if exists "members read" on txns;
create policy "members read" on txns for select to authenticated using (is_member());
drop policy if exists "members read" on counters;
create policy "members read" on counters for select to authenticated using (is_member());

revoke all on function post_txn(jsonb), delete_txn(text), import_snapshot(jsonb) from public, anon;
grant execute on function post_txn(jsonb), delete_txn(text), import_snapshot(jsonb) to authenticated;
-- hàm nội bộ: chỉ được gọi bên trong các hàm ghi sổ
revoke all on function ledger_check(text[]), lot_label(text, text, text), lock_ledger() from public, anon, authenticated;

-- ---------- cập nhật thời gian thực ----------
do $$
declare t text;
begin
  foreach t in array array['customers', 'cargos', 'zones', 'txns', 'counters'] loop
    if not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and tablename = t) then
      execute format('alter publication supabase_realtime add table %I', t);
    end if;
  end loop;
end $$;

-- ---------- quản trị viên đầu tiên ----------
-- Thay email bên dưới bằng email của bạn rồi chạy (đổi 'admin' thành 'staff' cho người dùng thường):
-- insert into app_users (email, role) values ('ban@congty.vn', 'admin') on conflict (email) do update set role = excluded.role;
