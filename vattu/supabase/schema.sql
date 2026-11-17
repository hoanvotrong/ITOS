-- App kiểm kê kho vật tư (quét QR) · Supabase / PostgreSQL
-- Dùng chung project + đăng nhập với /warehouse. Chạy trên SQL Editor của Supabase.
-- Thời gian lưu UTC (timestamptz), app hiển thị GMT+7.

create extension if not exists pgcrypto;

-- Kho (Kho 1, 2, 3 có sẵn; thêm được)
create table if not exists public.vt_kho (
  id    text primary key,                -- KHO1, KHO2, KHO3
  name  text not null,
  sort  int  not null default 0
);
insert into public.vt_kho (id, name, sort) values ('KHO1','Kho 1',1),('KHO2','Kho 2',2),('KHO3','Kho 3',3)
on conflict (id) do nothing;

-- Tủ trong kho; tầng = 1..so_tang
create table if not exists public.vt_tu (
  id          uuid primary key default gen_random_uuid(),
  kho_id      text not null references public.vt_kho(id),
  code        text not null,             -- mã tủ do người dùng đặt, VD A01
  name        text,
  so_tang     int  not null check (so_tang between 1 and 30),
  created_by  uuid default auth.uid(),
  created_at  timestamptz not null default now(),
  unique (kho_id, code)
);

-- Đợt kiểm kê (phạm vi kiểm tra quét trùng)
create table if not exists public.vt_dot (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  status      text not null default 'open' check (status in ('open','closed')),
  created_by  uuid default auth.uid(),
  created_at  timestamptz not null default now(),
  closed_at   timestamptz
);

-- Lượt quét: mỗi lượt = 1 cái
create table if not exists public.vt_scan (
  id          uuid primary key default gen_random_uuid(),
  client_id   text not null unique,      -- sinh trên máy, chống gửi lặp khi mất mạng
  dot_id      uuid not null references public.vt_dot(id),
  code        text not null,             -- nội dung QR = mã vật tư
  kho_id      text not null references public.vt_kho(id),
  tu_id       uuid not null references public.vt_tu(id),
  tang        int  not null,
  qty         int  not null default 1 constraint vt_scan_qty_chk check (qty between 1 and 100000),  -- số lượng
  by_uid      uuid default auth.uid(),
  by_name     text,
  at          timestamptz not null default now(),
  deleted     boolean not null default false,
  deleted_by  uuid,
  deleted_at  timestamptz
);
create index if not exists vt_scan_dot_idx on public.vt_scan (dot_id);
-- Chặn quét trùng: trong 1 đợt, mỗi mã chỉ 1 lượt còn hiệu lực ở mỗi vị trí (tủ, tầng).
-- Cùng mã ở vị trí khác vẫn ghi được; số cái ghi ở cột qty.
create unique index if not exists vt_scan_dot_code_loc_uq on public.vt_scan (dot_id, code, tu_id, tang) where not deleted;

-- RLS: giống Kho — chỉ email có trong app_users (hàm is_member() tạo trong
-- warehouse/supabase/schema.sql) mới đọc / ghi. Xoá = đánh dấu deleted (không xoá cứng).
do $$ begin
  if to_regprocedure('public.is_member()') is null then
    raise exception 'Chưa có hàm public.is_member(): chạy warehouse/supabase/schema.sql trước.';
  end if;
end $$;
alter table public.vt_kho  enable row level security;
alter table public.vt_tu   enable row level security;
alter table public.vt_dot  enable row level security;
alter table public.vt_scan enable row level security;

do $$ declare t text; begin
  foreach t in array array['vt_kho','vt_tu','vt_dot','vt_scan'] loop
    execute format('drop policy if exists %1$s_read on public.%1$s', t);
    execute format('create policy %1$s_read on public.%1$s for select to authenticated using (public.is_member())', t);
    execute format('drop policy if exists %1$s_ins on public.%1$s', t);
    execute format('create policy %1$s_ins on public.%1$s for insert to authenticated with check (public.is_member())', t);
    execute format('drop policy if exists %1$s_upd on public.%1$s', t);
    execute format('create policy %1$s_upd on public.%1$s for update to authenticated using (public.is_member()) with check (public.is_member())', t);
  end loop;
end $$;
revoke delete on public.vt_kho, public.vt_tu, public.vt_dot, public.vt_scan from authenticated;
revoke all on public.vt_kho, public.vt_tu, public.vt_dot, public.vt_scan from anon;

-- Realtime: nhiều điện thoại thấy nhau ngay
do $$ begin alter publication supabase_realtime add table public.vt_scan; exception when duplicate_object then null; end $$;
do $$ begin alter publication supabase_realtime add table public.vt_tu;   exception when duplicate_object then null; end $$;
do $$ begin alter publication supabase_realtime add table public.vt_dot;  exception when duplicate_object then null; end $$;
