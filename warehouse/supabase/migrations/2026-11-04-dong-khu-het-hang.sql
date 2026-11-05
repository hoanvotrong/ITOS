-- Cập nhật 04/11/2026: khu hết hàng tự đóng (ẩn khỏi sơ đồ, giữ lịch sử).
-- Chạy một lần trên cơ sở dữ liệu đã cài schema.sql trước ngày này. Không xóa dữ liệu.

-- Khu hết hàng sau một phiếu xuất/chuyển đi được "đóng": ẩn khỏi sơ đồ nhưng giữ lại để tra lịch sử phiếu
alter table zones add column if not exists archived_at timestamptz;

-- Đồng bộ trạng thái đóng/mở của khu theo tồn hiện tại:
-- còn hàng → mở lại; hết hàng và p_allow_close → đóng (chỉ khi hàng vừa được lấy ra khỏi khu)
create or replace function sync_zone_state(p_zone text, p_allow_close boolean) returns void
language plpgsql security definer set search_path = public as $$
declare v_load numeric;
begin
  if p_zone is null then return; end if;
  select coalesce(sum(delta), 0) into v_load from txn_effects where zone_id = p_zone;
  if v_load > 0.0005 then
    update zones set archived_at = null where id = p_zone and archived_at is not null;
  elsif p_allow_close then
    update zones set archived_at = now() where id = p_zone and archived_at is null;
  end if;
end;
$$;

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

  -- khu nguồn hết hàng sau phiếu xuất/chuyển/kiểm kê → đóng; khu đích có hàng → mở lại nếu đang đóng
  perform sync_zone_state(v.zone_id, v_type <> 'IN');
  if v.to_zone_id is not null and v.to_zone_id <> v.zone_id then perform sync_zone_state(v.to_zone_id, false); end if;

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

  -- xóa một phiếu xuất làm khu có hàng trở lại → mở lại khu (không tự đóng khi xóa phiếu)
  perform sync_zone_state(v.zone_id, false);
  perform sync_zone_state(v.to_zone_id, false);
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

  insert into zones (id, warehouse_id, code, name, customer_id, cargo_id, x, y, w, h, capacity, note, archived_at)
  select x.id, x."warehouseId", x.code, coalesce(x.name, ''), nullif(x."customerId", ''), nullif(x."cargoId", ''),
         x.x, x.y, x.w, x.h, coalesce(x.capacity, 0), coalesce(x.note, ''), nullif(x."archivedAt", '')::timestamptz
    from jsonb_to_recordset(coalesce(p -> 'zones', '[]')) as x(id text, "warehouseId" text, code text, name text,
         "customerId" text, "cargoId" text, x numeric, y numeric, w numeric, h numeric, capacity numeric, note text,
         "archivedAt" text);

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

revoke all on function sync_zone_state(text, boolean) from public, anon, authenticated;
