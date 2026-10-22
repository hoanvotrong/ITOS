// Gộp nhiều file sao lưu (kho-bai-backup-*.json) của người test thành 1 file để nạp lên dữ liệu dùng chung.
//
//   node warehouse/tools/merge-backups.mjs "D:\Dự án ITOS\data-gom" ["D:\Dự án ITOS\data-gom\merged.json"]
//
// Quy tắc gộp:
//   - Khách hàng, hàng hóa: trùng MÃ thì coi là một (giữ bản đầu tiên, báo nếu khác tên).
//   - Khu xếp hàng: trùng kho + mã + vị trí thì coi là một; trùng mã nhưng khác vị trí thì đổi mã (thêm hậu tố).
//     Khu chồng lấn nhau được liệt kê để xử lý tay.
//   - Phiếu: trùng id (cùng một phiếu có trong nhiều file) chỉ giữ một; đánh số lại theo thứ tự ngày,
//     số phiếu cũ được ghi vào ghi chú để tra lại.
//   - Cuối cùng kiểm tra sổ: báo lô nào bị âm tồn (máy chủ sẽ từ chối nạp nếu còn).
// Dữ liệu khách hàng là dữ liệu thật: để thư mục dữ liệu NGOÀI repo (repo đang công khai).

import fs from 'node:fs';
import path from 'node:path';

const [dir, outArg] = process.argv.slice(2);
if (!dir) {
  console.error('Cách dùng: node merge-backups.mjs <thư mục chứa file .json> [file kết quả]');
  process.exit(1);
}
const out = outArg || path.join(dir, 'merged.json');
const reportPath = out.replace(/\.json$/i, '') + '-report.txt';

const PREFIX = { IN: 'PN', OUT: 'PX', TRANSFER: 'PC', ADJUST: 'KK' };
const pad = (n, l = 2) => String(n).padStart(l, '0');
const round3 = n => Math.round(n * 1000) / 1000;
const report = [];
const say = s => report.push(s);

const files = fs.readdirSync(dir)
  .filter(f => f.toLowerCase().endsWith('.json') && path.resolve(dir, f) !== path.resolve(out))
  .sort();
if (!files.length) { console.error(`Không có file .json trong ${dir}`); process.exit(1); }

const customers = [], cargos = [], zones = [], txns = [];
const byCode = { customers: new Map(), cargos: new Map() };
const usedIds = { customers: new Set(), cargos: new Set(), zones: new Set() };
const seenTxn = new Set();
const newId = () => Math.random().toString(36).slice(2, 9) + Date.now().toString(36).slice(-4);

say(`GỘP ${files.length} FILE SAO LƯU — ${new Date().toLocaleString('vi-VN')}`);
say('');

for (const file of files) {
  let db;
  try { db = JSON.parse(fs.readFileSync(path.join(dir, file), 'utf8')); }
  catch (e) { say(`! Bỏ qua ${file}: không đọc được JSON (${e.message})`); continue; }
  if (!Array.isArray(db.txns) || !Array.isArray(db.zones)) { say(`! Bỏ qua ${file}: không phải file sao lưu của ứng dụng kho`); continue; }
  const tag = file.replace(/\.json$/i, '');
  say(`• ${file}: ${db.zones.length} khu, ${(db.customers || []).length} khách hàng, ${db.txns.length} phiếu`);
  const idMap = { customers: {}, cargos: {}, zones: {} };

  // khách hàng / hàng hóa: gộp theo mã
  for (const coll of ['customers', 'cargos']) {
    for (const it of db[coll] || []) {
      const code = (it.code || '').trim().toUpperCase();
      const found = byCode[coll].get(code);
      if (found) {
        idMap[coll][it.id] = found.id;
        if ((found.name || '').trim() !== (it.name || '').trim()) {
          say(`  ? ${coll === 'customers' ? 'Khách hàng' : 'Hàng hóa'} ${code}: "${it.name}" (${file}) khác "${found.name}" — giữ "${found.name}"`);
        }
        continue;
      }
      const id = usedIds[coll].has(it.id) ? newId() : it.id;
      const rec = { ...it, id, code };
      usedIds[coll].add(id);
      byCode[coll].set(code, rec);
      (coll === 'customers' ? customers : cargos).push(rec);
      idMap[coll][it.id] = id;
    }
  }

  // khu xếp hàng: gộp khi trùng kho + mã + vị trí
  for (const z of db.zones) {
    const same = zones.find(o => o.warehouseId === z.warehouseId && o.code === z.code);
    const customerId = z.customerId ? idMap.customers[z.customerId] || '' : '';
    const cargoId = z.cargoId ? idMap.cargos[z.cargoId] || '' : '';
    if (same && same.x === z.x && same.y === z.y && same.w === z.w && same.h === z.h) {
      idMap.zones[z.id] = same.id;
      if ((same.customerId || '') !== customerId) say(`  ? Khu ${z.code}: gán khách khác nhau giữa các file — giữ theo file đầu`);
      continue;
    }
    let code = z.code;
    if (same) {
      let n = 2;
      while (zones.some(o => o.warehouseId === z.warehouseId && o.code === `${z.code}-${n}`)) n++;
      code = `${z.code}-${n}`;
      say(`  ? Khu ${z.code} trong ${file} khác vị trí với khu cùng mã — đổi thành ${code}`);
    }
    const id = usedIds.zones.has(z.id) ? newId() : z.id;
    usedIds.zones.add(id);
    zones.push({ ...z, id, code, customerId, cargoId });
    idMap.zones[z.id] = id;
  }

  // phiếu
  for (const t of db.txns) {
    if (seenTxn.has(t.id)) continue; // cùng một phiếu đã có ở file trước
    seenTxn.add(t.id);
    txns.push({
      ...t,
      customerId: idMap.customers[t.customerId],
      cargoId: idMap.cargos[t.cargoId],
      zoneId: idMap.zones[t.zoneId],
      toZoneId: t.toZoneId ? idMap.zones[t.toZoneId] : '',
      toCustomerId: t.toCustomerId ? idMap.customers[t.toCustomerId] : '',
      note: [t.note, `[gốc: ${t.no} · ${tag}]`].filter(Boolean).join(' '),
    });
  }
}

// phiếu tham chiếu tới khách / hàng / khu không tồn tại
const broken = txns.filter(t => !t.customerId || !t.cargoId || !t.zoneId);
if (broken.length) say(`! ${broken.length} phiếu tham chiếu khách/hàng/khu không có trong file — đã loại bỏ: ${broken.map(t => t.no).join(', ')}`);
const good = txns.filter(t => t.customerId && t.cargoId && t.zoneId);

// đánh số lại theo thứ tự thời gian
good.sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : (a.createdAt || 0) - (b.createdAt || 0)));
const seq = { IN: 0, OUT: 0, TRANSFER: 0, ADJUST: 0 };
for (const t of good) {
  seq[t.type] += 1;
  t.no = `${PREFIX[t.type]}${t.date.slice(2, 4)}${t.date.slice(5, 7)}-${pad(seq[t.type], 4)}`;
}

// khu chồng lấn
const overlap = (a, b) => a.x < b.x + b.w && b.x < a.x + a.w && a.y < b.y + b.h && b.y < a.y + a.h;
for (let i = 0; i < zones.length; i++) {
  for (let j = i + 1; j < zones.length; j++) {
    if (zones[i].warehouseId === zones[j].warehouseId && overlap(zones[i], zones[j])) {
      say(`! Khu ${zones[i].code} và ${zones[j].code} (${zones[i].warehouseId === 'w_02a' ? 'VNL-02A' : 'VNL-02B'}) chồng lên nhau — sửa trên sơ đồ sau khi nạp`);
    }
  }
}

// kiểm tra sổ
const bal = new Map();
const effects = t => t.type === 'TRANSFER'
  ? [[t.customerId, t.cargoId, t.zoneId, -t.qty], [t.toCustomerId || t.customerId, t.cargoId, t.toZoneId || t.zoneId, +t.qty]]
  : [[t.customerId, t.cargoId, t.zoneId, t.type === 'OUT' ? -t.qty : +t.qty]];
let negative = 0;
for (const t of good) {
  for (const [c, g, z, d] of effects(t)) {
    const k = `${c}|${g}|${z}`;
    const v = round3((bal.get(k) || 0) + d);
    bal.set(k, v);
    if (v < -0.0005 && negative++ < 20) {
      const cust = customers.find(x => x.id === c)?.code, zone = zones.find(x => x.id === z)?.code, cg = cargos.find(x => x.id === g)?.name;
      say(`! Âm tồn: ${cg} của ${cust} tại khu ${zone} còn ${v} t sau phiếu ${t.no} ngày ${t.date}`);
    }
  }
}

const merged = { version: 3, customers, cargos, zones, txns: good, seq };
fs.writeFileSync(out, JSON.stringify(merged, null, 2), 'utf8');

say('');
say(`KẾT QUẢ: ${customers.length} khách hàng, ${cargos.length} hàng hóa, ${zones.length} khu, ${good.length} phiếu`);
say(negative ? `CHƯA NẠP ĐƯỢC: còn ${negative} chỗ âm tồn — sửa dữ liệu nguồn rồi gộp lại.` : 'Sổ hợp lệ, có thể nạp lên (Sao lưu dữ liệu → Khôi phục từ file).');
say(`File gộp: ${out}`);
fs.writeFileSync(reportPath, report.join('\n') + '\n', 'utf8');
console.log(report.join('\n'));
console.log(`Báo cáo: ${reportPath}`);
process.exit(negative ? 2 : 0);
