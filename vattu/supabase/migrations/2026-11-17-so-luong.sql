-- Kiểm kê vật tư · thêm SỐ LƯỢNG cho lượt quét (17/11/2026)
-- Trước: mỗi lượt quét = 1 cái, mỗi mã chỉ 1 lượt trong cả đợt.
-- Sau:   mỗi lượt quét ghi số lượng (qty); chặn trùng theo mã + vị trí (tủ, tầng),
--        nên cùng mã ở tủ / tầng khác vẫn ghi được.
-- Chạy được nhiều lần.

alter table public.vt_scan add column if not exists qty int not null default 1;

do $$ begin
  alter table public.vt_scan add constraint vt_scan_qty_chk check (qty between 1 and 100000);
exception when duplicate_object then null; end $$;

drop index if exists public.vt_scan_dot_code_uq;
create unique index if not exists vt_scan_dot_code_loc_uq
  on public.vt_scan (dot_id, code, tu_id, tang) where not deleted;
