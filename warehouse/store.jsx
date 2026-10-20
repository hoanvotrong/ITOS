/* ==========================================================
   Kho Bãi — lớp dữ liệu
   - Tồn kho KHÔNG lưu trực tiếp, luôn tính lại từ sổ giao dịch (txns)
   - Mỗi giao dịch sinh ra các "bút toán" (customer, cargo, zone, ±qty)
   ========================================================== */

const { useState, useEffect, useMemo, useRef, useCallback } = React;

const STORAGE_KEY = 'kho-bai.v2';
const EPS = 0.0005;

const TXN_TYPES = {
  IN:       { label: 'Nhập kho',          short: 'Nhập',    prefix: 'PN', tone: 'success', doc: 'PHIẾU NHẬP KHO' },
  OUT:      { label: 'Xuất kho',          short: 'Xuất',    prefix: 'PX', tone: 'danger',  doc: 'PHIẾU XUẤT KHO' },
  TRANSFER: { label: 'Chuyển kho',        short: 'Chuyển',  prefix: 'PC', tone: 'info',    doc: 'PHIẾU CHUYỂN KHO' },
  ADJUST:   { label: 'Điều chỉnh kiểm kê', short: 'Kiểm kê', prefix: 'KK', tone: 'warning', doc: 'BIÊN BẢN ĐIỀU CHỈNH KIỂM KÊ' },
};

// Kho (warehouse) có kích thước thật theo mét, chia N gian bằng nhau, cửa ở cạnh dưới.
// Khu xếp hàng (zone) nằm trong 1 kho, toạ độ x/y/w/h tính bằng mét từ góc trên-trái kho.

/* ---------- tiện ích ---------- */
const uid = () => Math.random().toString(36).slice(2, 9) + Date.now().toString(36).slice(-4);
const pad = (n, l = 2) => String(n).padStart(l, '0');
const toISO = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const todayISO = () => toISO(new Date());
const addDays = (iso, n) => { const d = new Date(iso + 'T00:00:00'); d.setDate(d.getDate() + n); return toISO(d); };
const monthStart = iso => iso.slice(0, 8) + '01';
const fmtDate = iso => (iso ? iso.split('-').reverse().join('/') : '');
const round3 = n => Math.round(n * 1000) / 1000;
const fmtQty = (n, digits = 2) =>
  (Math.abs(n) < EPS ? 0 : n).toLocaleString('vi-VN', { maximumFractionDigits: digits, minimumFractionDigits: 0 });
const byId = arr => Object.fromEntries(arr.map(x => [x.id, x]));
const fmtM = n => (+n || 0).toLocaleString('vi-VN', { maximumFractionDigits: 2 });

// "VNL-02A · A-01"
const zoneLabel = (z, lk) => (z ? `${lk.wh[z.warehouseId]?.code || '?'} · ${z.code}` : '—');

// Màu nhận diện khách hàng trên sơ đồ (theo thứ tự khách hàng)
const CUST_COLORS = ['#1F6FB2', '#C2410C', '#15803D', '#7C3AED', '#BE185D', '#0E7490', '#A16207', '#4D7C0F', '#4338CA', '#9F1239'];
const custColor = (lk, customerId) => {
  const i = Object.keys(lk.cust).indexOf(customerId);
  return i < 0 ? '#1F4E8C' : CUST_COLORS[i % CUST_COLORS.length];
};

// Các gian mà khu xếp hàng chiếm, vd "Gian 2–3"
function zoneBays(z, wh) {
  if (!z || !wh || !wh.bays) return '';
  const bw = wh.length / wh.bays;
  const a = clampNum(Math.floor(z.x / bw) + 1, 1, wh.bays);
  const b = clampNum(Math.ceil((z.x + z.w) / bw - 1e-6), 1, wh.bays);
  return a === b ? `Gian ${a}` : `Gian ${a}–${b}`;
}
const clampNum = (v, a, b) => Math.max(a, Math.min(b, v));
const norm = s => (s || '').toString().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').toLowerCase();

/* ---------- sổ cái ---------- */
// Mỗi giao dịch → danh sách bút toán [customerId, cargoId, zoneId, delta]
function txnEffects(t) {
  switch (t.type) {
    case 'IN':     return [[t.customerId, t.cargoId, t.zoneId, +t.qty]];
    case 'OUT':    return [[t.customerId, t.cargoId, t.zoneId, -t.qty]];
    case 'ADJUST': return [[t.customerId, t.cargoId, t.zoneId, +t.qty]]; // qty có dấu
    case 'TRANSFER': return [
      [t.customerId, t.cargoId, t.zoneId, -t.qty],
      [t.toCustomerId || t.customerId, t.cargoId, t.toZoneId || t.zoneId, +t.qty],
    ];
    default: return [];
  }
}

const skey = (c, g, z) => `${c}|${g}|${z}`;
const splitKey = k => { const [customerId, cargoId, zoneId] = k.split('|'); return { customerId, cargoId, zoneId }; };

const sortTxns = txns =>
  [...txns].sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : (a.createdAt || 0) - (b.createdAt || 0)));

// Tồn kho tại 1 thời điểm: asOf = tính đến hết ngày; before = trước ngày
function computeStock(txns, { asOf, before } = {}) {
  const m = new Map();
  for (const t of txns) {
    if (asOf && t.date > asOf) continue;
    if (before && t.date >= before) continue;
    for (const [c, g, z, d] of txnEffects(t)) {
      const k = skey(c, g, z);
      m.set(k, round3((m.get(k) || 0) + d));
    }
  }
  return m;
}

const stockRows = map =>
  [...map.entries()].filter(([, q]) => Math.abs(q) > EPS).map(([k, qty]) => ({ ...splitKey(k), qty }));

function zoneLoads(stockMap) {
  const m = new Map();
  for (const [k, q] of stockMap) {
    const { zoneId } = splitKey(k);
    m.set(zoneId, round3((m.get(zoneId) || 0) + q));
  }
  return m;
}

// Duyệt sổ theo thứ tự thời gian, báo lỗi nếu có lúc tồn âm
function validateLedger(txns) {
  const m = new Map();
  for (const t of sortTxns(txns)) {
    for (const [c, g, z, d] of txnEffects(t)) {
      const k = skey(c, g, z);
      const v = round3((m.get(k) || 0) + d);
      m.set(k, v);
      if (v < -EPS) return { ok: false, txn: t, ...splitKey(k), balance: v };
    }
  }
  return { ok: true };
}

/* ---------- lưu trữ ---------- */
function emptyDb() {
  return { version: 2, warehouses: [], zones: [], customers: [], cargos: [], txns: [], seq: { IN: 0, OUT: 0, TRANSFER: 0, ADJUST: 0 } };
}

function loadDb() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const db = JSON.parse(raw);
    if (!db || !Array.isArray(db.txns) || !Array.isArray(db.warehouses)) return null;
    return { ...emptyDb(), ...db };
  } catch (e) { return null; }
}

function saveDb(db) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(db)); } catch (e) { /* bộ nhớ đầy / bị chặn */ }
}

function nextDocNo(db, type, date) {
  const n = (db.seq[type] || 0) + 1;
  return { no: `${TXN_TYPES[type].prefix}${date.slice(2, 4)}${date.slice(5, 7)}-${pad(n, 4)}`, n };
}

function useWarehouseStore() {
  const [db, setDb] = useState(() => loadDb() || seedDb());
  useEffect(() => { saveDb(db); }, [db]);

  const upsert = (coll, item) => {
    const it = item.id ? item : { ...item, id: uid() };
    setDb(prev => {
      const list = prev[coll];
      const exists = list.some(x => x.id === it.id);
      return { ...prev, [coll]: exists ? list.map(x => (x.id === it.id ? { ...x, ...it } : x)) : [...list, it] };
    });
    return it;
  };
  const remove = (coll, id) => setDb(prev => ({ ...prev, [coll]: prev[coll].filter(x => x.id !== id) }));

  // Tạo bản ghi giao dịch hoàn chỉnh (chưa lưu) để kiểm tra trước khi ghi sổ
  const draftTxn = fields => {
    const { no } = nextDocNo(db, fields.type, fields.date);
    return { ...fields, id: uid(), no, createdAt: Date.now() };
  };
  const commitTxn = t => setDb(prev => ({
    ...prev,
    txns: [...prev.txns, t],
    seq: { ...prev.seq, [t.type]: (prev.seq[t.type] || 0) + 1 },
  }));

  return {
    db,
    upsert,
    remove,
    draftTxn,
    commitTxn,
    replaceAll: next => setDb({ ...emptyDb(), ...next }),
  };
}

/* ---------- dữ liệu mẫu ---------- */
function mulberry32(a) {
  return function () {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function seedDb() {
  const rnd = mulberry32(20261020);
  const pick = arr => arr[Math.floor(rnd() * arr.length)];
  const between = (a, b) => a + rnd() * (b - a);

  const warehouses = [
    {
      id: 'w_02a', code: 'VNL-02A', name: 'Kho VNL-02A', length: 83.14, width: 64, bays: 8, loadRate: 2.5, note: '',
      doors: [{ id: 'd1', label: 'C/A D1', x: 16, w: 19 }, { id: 'd2', label: 'C/A D2', x: 53, w: 12 }],
    },
    {
      id: 'w_02b', code: 'VNL-02B', name: 'Kho VNL-02B', length: 72, width: 64, bays: 7, loadRate: 2.5, note: '',
      doors: [{ id: 'd1', label: 'C/A D1', x: 15, w: 13 }, { id: 'd2', label: 'C/A D2', x: 43, w: 12 }],
    },
  ];
  // Khu xếp hàng — chừa lối đi 6 m dọc cạnh cửa và 4 m giữa 2 dãy
  // cust: khu dành riêng cho khách hàng; để trống = khu dùng chung
  const Z = (wid, code, x, y, w, h, cust = '') => ({
    id: `z_${wid}_${code.toLowerCase()}`, warehouseId: 'w_' + wid, code, name: '', customerId: cust ? 'c_' + cust : '', cargoId: '',
    x, y, w, h, capacity: w * h * 2.5, note: '',
  });
  const zones = [
    Z('02a', 'A-01', 1, 2, 19, 26, 'kh001'), Z('02a', 'A-02', 22, 2, 19, 26), Z('02a', 'A-03', 43, 2, 19, 26, 'kh001'), Z('02a', 'A-04', 64, 2, 18, 26),
    Z('02a', 'A-05', 1, 32, 30, 24, 'kh003'), Z('02a', 'A-06', 33, 32, 24, 24, 'kh004'), Z('02a', 'A-07', 59, 32, 23, 24, 'kh005'),
    Z('02b', 'B-01', 1, 2, 22, 26, 'kh002'), Z('02b', 'B-02', 25, 2, 22, 26), Z('02b', 'B-03', 49, 2, 22, 26, 'kh004'),
    Z('02b', 'B-04', 1, 32, 34, 24, 'kh002'), Z('02b', 'B-05', 37, 32, 34, 24, 'kh006'),
  ];

  const C = (code, name, taxCode, contact, phone, address) => ({ id: 'c_' + code.toLowerCase(), code, name, taxCode, contact, phone, email: '', address, note: 'Dữ liệu mẫu' });
  const customers = [
    C('KH001', 'Công ty CP Năng lượng Phương Nam', '0310000001', 'Nguyễn Văn An', '0901 000 001', 'KCN Hiệp Phước, TP.HCM'),
    C('KH002', 'Công ty TNHH Lâm sản An Phát', '0310000002', 'Trần Thị Bình', '0901 000 002', 'Bình Dương'),
    C('KH003', 'Công ty CP Xi măng Hòa Bình Mới', '0310000003', 'Lê Quốc Cường', '0901 000 003', 'Đồng Nai'),
    C('KH004', 'Công ty TNHH Phân bón Đồng Xanh', '0310000004', 'Phạm Minh Đức', '0901 000 004', 'Long An'),
    C('KH005', 'Công ty CP Thép Việt Tiến', '0310000005', 'Võ Thu Hà', '0901 000 005', 'Bà Rịa - Vũng Tàu'),
    C('KH006', 'Công ty TNHH Thương mại Sao Mai', '0310000006', 'Đỗ Gia Huy', '0901 000 006', 'Cần Thơ'),
  ];

  const G = (code, name, group) => ({ id: 'g_' + code.toLowerCase(), code, name, group, unit: 'tấn', note: '' });
  const cargos = [
    G('TC', 'Than cám', 'Than'),
    G('TCU', 'Than cục', 'Than'),
    G('VNG', 'Viên nén gỗ', 'Lâm sản'),
    G('DG', 'Dăm gỗ', 'Lâm sản'),
    G('CLK', 'Clinker', 'Vật liệu xây dựng'),
    G('PB', 'Phân bón bao', 'Hàng bao'),
    G('TCT', 'Thép cuộn', 'Sắt thép'),
  ];

  // khách → [loại hàng, các bãi ưu tiên, khoảng khối lượng nhập]
  const plan = {
    c_kh001: [['g_tc', ['z_02a_a-01', 'z_02a_a-02'], [250, 600]], ['g_tcu', ['z_02a_a-03'], [150, 400]]],
    c_kh002: [['g_vng', ['z_02b_b-01', 'z_02b_b-02'], [150, 450]], ['g_dg', ['z_02b_b-04'], [200, 500]]],
    c_kh003: [['g_clk', ['z_02a_a-05', 'z_02a_a-04'], [250, 600]]],
    c_kh004: [['g_pb', ['z_02b_b-03', 'z_02a_a-06'], [40, 160]]],
    c_kh005: [['g_tct', ['z_02a_a-07'], [60, 250]]],
    c_kh006: [['g_tc', ['z_02a_a-04', 'z_02a_a-02'], [200, 500]], ['g_vng', ['z_02b_b-05'], [100, 350]]],
  };

  const cap = byId(zones);
  const stock = new Map();
  const load = new Map();
  const get = (m, k) => m.get(k) || 0;
  const txns = [];
  const seq = { IN: 0, OUT: 0, TRANSFER: 0, ADJUST: 0 };
  let clock = Date.now() - 70 * 86400000;
  const plates = () => `${pick(['51C', '61C', '72C', '50H', '60C'])}-${Math.floor(between(100, 999))}.${pad(Math.floor(between(0, 99)))}`;
  const barge = () => `${pick(['Sà lan', 'Tàu'])} ${pick(['SG', 'BD', 'ĐN', 'VT'])}-${Math.floor(between(1000, 9999))}`;

  const push = (t) => {
    seq[t.type] += 1;
    clock += Math.floor(between(20, 400)) * 60000;
    txns.push({
      id: uid(), no: `${TXN_TYPES[t.type].prefix}${t.date.slice(2, 4)}${t.date.slice(5, 7)}-${pad(seq[t.type], 4)}`,
      createdAt: clock, vehicle: '', docRef: '', note: '', toZoneId: '', toCustomerId: '', ...t,
    });
    for (const [c, g, z, d] of txnEffects(t)) {
      stock.set(skey(c, g, z), round3(get(stock, skey(c, g, z)) + d));
      load.set(z, round3(get(load, z) + d));
    }
  };

  const today = todayISO();
  for (let back = 60; back >= 0; back--) {
    const date = addDays(today, -back);
    const events = 2 + Math.floor(rnd() * 3);
    for (let e = 0; e < events; e++) {
      const custId = pick(Object.keys(plan));
      const [cargoId, zonesPref, [lo, hi]] = pick(plan[custId]);
      const held = zonesPref.filter(z => get(stock, skey(custId, cargoId, z)) > 1);
      const r = rnd();
      if (r < 0.45 || held.length === 0) {
        const zoneId = pick(zonesPref);
        const room = cap[zoneId].capacity * 0.8 - get(load, zoneId);
        const qty = Math.min(round3(Math.round(between(lo, hi) * 10) / 10), Math.floor(room));
        if (qty < lo / 3) continue;
        push({ type: 'IN', date, customerId: custId, cargoId, zoneId, qty, vehicle: lo >= 150 ? barge() : plates(), docRef: `BL/${pad(Math.floor(between(1, 9999)), 4)}` });
      } else if (r < 0.9) {
        const zoneId = pick(held);
        const have = get(stock, skey(custId, cargoId, zoneId));
        const qty = round3(Math.round(Math.min(have, between(lo * 0.2, hi * 0.6)) * 10) / 10);
        if (qty <= 0) continue;
        push({ type: 'OUT', date, customerId: custId, cargoId, zoneId, qty, vehicle: plates(), docRef: `LXH-${pad(Math.floor(between(1, 9999)), 4)}` });
      } else {
        const zoneId = pick(held);
        const others = zonesPref.filter(z => z !== zoneId);
        if (!others.length) continue;
        const toZoneId = pick(others);
        const have = get(stock, skey(custId, cargoId, zoneId));
        const room = cap[toZoneId].capacity - get(load, toZoneId);
        const qty = round3(Math.floor(Math.min(have * 0.5, room)));
        if (qty <= 0) continue;
        push({ type: 'TRANSFER', date, customerId: custId, cargoId, zoneId, toZoneId, toCustomerId: custId, qty, note: 'Dồn khu xếp hàng' });
      }
    }
  }

  return { version: 2, warehouses, zones, customers, cargos, txns, seq };
}

/* ---------- xuất Excel ---------- */
// sheets: [{ name, rows: Array<Array<any>>, cols?: number[] }]
function exportXlsx(filename, sheets) {
  if (window.XLSX) {
    const wb = XLSX.utils.book_new();
    for (const s of sheets) {
      const ws = XLSX.utils.aoa_to_sheet(s.rows);
      if (s.cols) ws['!cols'] = s.cols.map(w => ({ wch: w }));
      XLSX.utils.book_append_sheet(wb, ws, s.name.slice(0, 31));
    }
    XLSX.writeFile(wb, `${filename}.xlsx`);
    return;
  }
  // dự phòng khi không tải được thư viện: CSV của sheet đầu tiên
  const esc = v => { const s = v == null ? '' : String(v); return /[",\n;]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s; };
  const csv = '﻿' + sheets[0].rows.map(r => r.map(esc).join(',')).join('\n');
  downloadBlob(new Blob([csv], { type: 'text/csv;charset=utf-8' }), `${filename}.csv`);
}

function downloadBlob(blob, filename) {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 500);
}
