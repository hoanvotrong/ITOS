/* Module Điều độ khai thác (DD) — Vinalogistics TTOS · bản chạy thử (pilot)
   Port từ prototype TTOS v61 (11/11/2026). Dữ liệu nạp từ Supabase qua boot.js (window.DD_BOOT) trước khi chạy file này.
   Nguồn: BRD Khai Thác v2.6 */

/* ================= NGƯỜI DÙNG · DANH MỤC (từ Supabase) ================= */
/* Ngày hiện tại GMT+7 — gọi hàm mỗi lần dùng (ca đêm có thể qua ngày) */
const ddToday = () => window.ddVnNow().date;
const DD_ROLE_LABEL = { KHTH: "KHTH", TP: "Trưởng phòng Khai thác", DPVT: "Điều phối vận tải", TAIXE: "Tài xế", TALLY: "Tài khoản tally ca" };
const DD_PEOPLE = DD_BOOT.users.filter(u => u.role !== "TALLY").map(u => ({ id: u.email, name: u.name, short: u.short || u.name.split(" ").map(w => w[0]).join("").slice(-3).toUpperCase(), role: DD_ROLE_LABEL[u.role] || u.role, appRole: u.role, color: u.color || 0 }));

const DD_SERVICES = [
  { id: "bp",   label: "Bến phao",       icon: "anchor",  unit: "tấn" },
  { id: "icd",  label: "ICD",            icon: "crane",   unit: "TEU" },
  { id: "kho",  label: "Kho",            icon: "package", unit: "tấn", hidden: true }, /* pilot: Kho dùng /warehouse riêng */
  { id: "dep",  label: "Depot",          icon: "layers",  unit: "TEU", hidden: true }, /* tạm ẩn 03/11 */
  { id: "bai",  label: "Bãi container",  icon: "grid",    unit: "TEU" },
  { id: "vt",   label: "Vận tải",        icon: "task",    unit: "chuyến" },
];
const ddSvc = (id) => DD_SERVICES.find(s => s.id === id) || DD_SERVICES[0];
const DD_SERVICES_ON = DD_SERVICES.filter(s => !s.hidden);
const DD_SERVICES_NEW = DD_SERVICES_ON.filter(s => ["bp", "icd"].includes(s.id)); /* tạo job: tạm bỏ Kho, Bãi container, Vận tải (11/11) */
const ddUnit = (j) => !j ? "" : j.kind === "cont" ? "cont" : (j.unit || "tấn");
const DD_UNITS = ["tấn", "m³", "bao", "kiện", "phuy", "cuộn", "tấm", "chiếc", "chuyến"];
/* Cách ghi nhận hàng rời (v2.5) */
const DD_MEASURE = { scale: "Qua cầu cân", count: "Đếm (cuộn, tấm…)", hook: "Cân treo (cẩu nổi)", manual: "Nhập tay" };
const ddMeasureOpts = (svc, unit) => unit === "tấn" ? (svc === "bp" ? ["hook", "manual"] : ["scale", "manual"]) : ddDecUnit(unit) ? ["manual"] : ["count", "manual"];
const ddMeasure = (j) => j.measure || ddMeasureOpts(j.service, j.unit || "tấn")[0];
/* Mã tài xế: 6 số ngẫu nhiên, không trùng mã của lệnh ca nào còn mở (DD_ORDERS khai báo phía dưới, chỉ gọi lúc chạy) */
const ddDrvCode = () => {
  const used = new Set(DD_ORDERS.filter(o => !["done", "cancelled"].includes(o.status) && o.drvCode).map(o => o.drvCode));
  const rnd = () => { const a = new Uint32Array(1); crypto.getRandomValues(a); return String(100000 + (a[0] % 900000)); };
  let c = rnd(); while (used.has(c)) c = rnd(); return c;
};
const ddDecUnit = (u) => u === "tấn" || u === "m³";
/* Số container theo ISO 6346 — kiểm tra số kiểm tra (check digit) */
const ddContCheck = (s) => {
  const v = "0123456789A?BCDEFGHIJK?LMNOPQRSTU?VWXYZ";
  const n = (s || "").toUpperCase().replace(/[^A-Z0-9]/g, "");
  if (!/^[A-Z]{4}\d{7}$/.test(n)) return { no: n, ok: false, why: "Sai định dạng (4 chữ + 7 số)" };
  let sum = 0; for (let i = 0; i < 10; i++) sum += v.indexOf(n[i]) * Math.pow(2, i);
  const cd = sum % 11 % 10;
  return cd === Number(n[10]) ? { no: n, ok: true } : { no: n, ok: false, why: `Sai số kiểm tra (đúng là ${cd})` };
};
const ddMakeCont = (prefix, base) => { const v = "0123456789A?BCDEFGHIJK?LMNOPQRSTU?VWXYZ"; const b = prefix + String(base).padStart(6, "0"); let sum = 0; for (let i = 0; i < 10; i++) sum += v.indexOf(b[i]) * Math.pow(2, i); return b + (sum % 11 % 10); };
const DD_CONT_TYPES = ["20GP", "40GP", "40HC", "20RF", "40RF"];
const DD_ISO_MAP = { "22G1": "20GP", "22G0": "20GP", "42G1": "40GP", "42G0": "40GP", "45G1": "40HC", "4EG1": "40HC", "40HQ": "40HC", "40HC": "40HC", "22R1": "20RF", "45R1": "40RF", "42R1": "40RF", "40RH": "40RF", "40RF": "40RF", "20RF": "20RF", "20GP": "20GP", "40GP": "40GP", "20DC": "20GP", "40DC": "40GP" };
/* Đọc danh sách cont từ Excel (.xlsx/.xls) hoặc CSV: tìm ô có số cont, loại (ISO/viết tắt) và F/E trên cùng dòng */
const ddReadContFile = (file) => new Promise((resolve, reject) => {
  const fromRows = (rows) => {
    const out = [];
    const hi = rows.findIndex(r => (r || []).some(c => /container/i.test(ddNoAcc(c))));
    if (hi >= 0) { const map = {}; rows[hi].forEach((h, i) => { const k = ddHeadKey(h); if (k && map[k] === undefined) map[k] = i; });
      rows.slice(hi + 1).forEach(r => { const g = (k) => map[k] === undefined ? "" : String(r[map[k]] ?? "").trim(); const no = g("no").toUpperCase().replace(/[\s-]/g, ""); if (!/^[A-Z]{4}\d{7}$/.test(no)) return;
        out.push(ddContRow({ no, iso: g("iso") || (g("size") ? g("size") + "GP" : ""), fe: g("fe").toUpperCase(), wt: g("wt"), dest: g("dest"), line: g("line"), seal: g("seal") })); });
      return resolve(out); }
    rows.forEach(row => {
      const cells = row.map(c => String(c ?? "").trim().toUpperCase());
      const no = cells.map(c => c.replace(/[\s-]/g, "")).find(c => /^[A-Z]{4}\d{7}$/.test(c));
      if (!no) return;
      const tp = cells.map(c => DD_ISO_MAP[c.replace(/['\s]/g, "")]).find(Boolean) || "";
      const fe = cells.find(c => ["F", "E", "FULL", "EMPTY", "HÀNG", "RỖNG", "FCL", "MT"].includes(c));
      const dr = cells.map(ddDirToken).find(Boolean);
      const ln = cells.filter(c => c !== no).map(c => ddLineFrom(c)).find(Boolean);
      out.push([no, tp, fe ? (["E", "EMPTY", "RỖNG", "MT"].includes(fe) ? "E" : "F") : "", dr ? { direct: "XT", export: "XB", import: "NB" }[dr] : "", ln || ""].filter(Boolean).join(" "));
    });
    resolve(out);
  };
  const rd = new FileReader();
  if (/\.(csv|txt)$/i.test(file.name)) { rd.onload = () => fromRows(String(rd.result).split(/\r?\n/).map(l => l.split(/[,;\t]/))); rd.readAsText(file); return; }
  const parse = () => { rd.onload = () => { try { const wb = window.XLSX.read(rd.result, { type: "array" }); const ws = wb.Sheets[wb.SheetNames[0]]; fromRows(window.XLSX.utils.sheet_to_json(ws, { header: 1, raw: false })); } catch (e) { reject(e); } }; rd.readAsArrayBuffer(file); };
  if (window.XLSX) return parse();
  const sc = document.createElement("script"); sc.src = "https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js"; sc.onload = parse; sc.onerror = () => reject(new Error("Không tải được bộ đọc Excel")); document.head.appendChild(sc);
});
const DD_CONT_DIR = { direct: "Xuất thẳng (xe → sà lan)", export: "Xuất bãi (bãi → sà lan / ra cổng)", import: "Nhập lưu bãi" };
const ddPrimaryGate = (j) => j.contDir === "import" ? "in" : "out";
/* v2.5: hướng theo từng cont — một job có thể vừa nhập lưu bãi vừa xuất thẳng */
const DD_DIR_SHORT = { direct: "xuất thẳng", export: "xuất bãi", import: "nhập lưu bãi" };
const DD_DIR_ORDER = ["direct", "import", "export"];
const DD_DIR_HINT = { direct: "Xe → sà lan, không hạ bãi. Tally bấm Gate Out khi cont lên sà lan.", import: "Tally bấm Gate In (cổng bộ hoặc dỡ sà lan), rồi hạ bãi. Bắt buộc có hãng tàu.", export: "Cont đã ở bãi. Tally bấm Gate Out khi lên sà lan hoặc ra cổng." };
/* Tiến độ theo hướng: tổng = max(số cont trong danh sách, số dự kiến) */
const ddDirProgress = (j) => DD_DIR_ORDER.map(k => { const cs = (j.conts || []).filter(c => ddCDir(c, j) === k && !c.closedAs); const exp = (j.expectDir || {})[k] || 0; return { k, done: cs.filter(c => ddContDone(c, j)).length, n: cs.length, total: Math.max(cs.length, exp), exp }; }).filter(x => x.total > 0);
const ddCDir = (c, j) => c.dir || j.contDir;
const ddContGate = (c, j) => ddCDir(c, j) === "import" ? "in" : "out";
const ddContDone = (c, j) => ddContGate(c, j) === "in" ? !!c.gin : !!c.gout;
const ddDirCount = (j) => { const m = {}; (j.conts || []).forEach(c => { const d = ddCDir(c, j); m[d] = (m[d] || 0) + 1; }); return m; };
const ddDirLabel = (j) => { const m = ddDirCount(j); const ks = Object.keys(m); if (ks.length <= 1) return DD_CONT_DIR[ks[0] || j.contDir]; return "Hỗn hợp: " + ["import", "direct", "export"].filter(k => m[k]).map(k => `${m[k]} ${DD_DIR_SHORT[k]}`).join(" · "); };
/* Hãng tàu (v2.5) — danh mục dùng chung với lệnh hãng tàu */
/* Hãng tàu (dd_catalog, kind = line) — hãng mới nhập trong job tự thêm vào danh mục */
const DD_LINES = DD_BOOT.catalog.line;
const DD_LINE_CODE = { MAEU: "Maersk", MSK: "Maersk", MAERSK: "Maersk", ONE: "ONE", CMA: "CMA CGM", CMDU: "CMA CGM", MSC: "MSC", MSCU: "MSC", COSCO: "COSCO", COS: "COSCO", EMC: "Evergreen", EVERGREEN: "Evergreen", WHL: "Wan Hai", "WAN HAI": "Wan Hai", YML: "Yang Ming", "YANG MING": "Yang Ming", HLC: "Hapag-Lloyd", HAPAG: "Hapag-Lloyd", TSL: "TS Lines" };
const ddLineFrom = (line) => { const U = line.toUpperCase(); const full = DD_LINES.find(n => U.includes(n.toUpperCase())); if (full) return full; const tk = U.split(/[\s,;\t]+/).find(t => DD_LINE_CODE[t]); return tk ? DD_LINE_CODE[tk] : null; };
const ddDirToken = (t) => ({ XT: "direct", "XUẤT THẲNG": "direct", "XUAT THANG": "direct", XB: "export", "XUẤT BÃI": "export", NB: "import", "NHẬP BÃI": "import", "LƯU BÃI": "import", "NHẬP LƯU BÃI": "import" })[t] || null;
/* Danh sách cont theo mẫu KHTH: STT · Mã Container · Mã ISO · Loại Cont · Hiện trạng · Khối lượng · Cảng đích ICD · Hãng Conts · Số seal · Thời gian · Số xe · Ghi chú */
Object.assign(DD_ISO_MAP, { "45GP": "40HC", "42GP": "40GP", "22GP": "20GP", "45RT": "40RF", "22RT": "20RF", "45R0": "40RF", "22R0": "20RF" });
const DD_FE_TOKEN = { F: "F", FULL: "F", FCL: "F", LADEN: "F", "HÀNG": "F", E: "E", MTY: "E", EMPTY: "E", MT: "E", "RỖNG": "E" };
const DD_CONT_TPL = ["STT", "Mã Container", "Mã ISO", "Loại Cont", "Hiện trạng", "Khối lượng", "Cảng đích ICD", "Hãng Conts", "Số seal", "Thời gian", "Số xe", "Ghi chú"];
const ddNoAcc = (t) => String(t || "").normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/đ/g, "d").replace(/Đ/g, "D").toLowerCase();
const ddHeadKey = (h) => { const t = ddNoAcc(h); if (/container/.test(t)) return "no"; if (/iso/.test(t)) return "iso"; if (/seal/.test(t)) return "seal"; if (/hien trang|status/.test(t)) return "fe"; if (/khoi luong|weight/.test(t)) return "wt"; if (/cang dich|icd|pod/.test(t)) return "dest"; if (/hang/.test(t)) return "line"; if (/loai|class|size/.test(t)) return "size"; if (/so xe|plate/.test(t)) return "plate"; if (/ghi chu|remark/.test(t)) return "note"; if (/thoi gian|time/.test(t)) return "time"; return null; };
/* Chuẩn hoá 1 dòng để đưa vào ô danh sách */
const ddContRow = (o) => [o.no, o.iso, o.fe, o.wt ? String(o.wt).replace(",", ".") + "T" : "", o.dest ? "CĐ:" + o.dest : "", o.line, o.seal ? "SEAL:" + o.seal : ""].filter(Boolean).join(" ");
/* Đọc 1 dòng: dán từ Excel (cột cách nhau bằng tab, theo mẫu) hoặc dòng đã chuẩn hoá */
const ddParseCont = (raw) => {
  const o = {};
  if (raw.includes("\t")) {
    const c = raw.split("\t").map(x => x.trim());
    const i = c.findIndex(x => /^[A-Z]{4}\d{7}$/i.test(x.replace(/[\s-]/g, "")));
    if (i >= 0) { const r = c.slice(i); Object.assign(o, { no: r[0], iso: r[1], size: r[2], fe: r[3], wt: r[4], dest: r[5], line: r[6] }); if (r.length >= 11 || r.length === 8) o.seal = r[7]; }
  } else {
    raw.split(/[\s,;]+/).filter(Boolean).forEach(tk => { const U = tk.toUpperCase();
      if (!o.no && /^[A-Z]{4}\d{7}$/.test(U)) o.no = U;
      else if (/^SEAL:/.test(U)) o.seal = tk.slice(5);
      else if (/^CĐ:|^CD:/.test(U)) o.dest = tk.slice(3);
      else if (/^\d+([.,]\d+)?T$/.test(U)) o.wt = U.slice(0, -1);
      else if (DD_ISO_MAP[U] || DD_CONT_TYPES.includes(U)) o.iso = U;
      else if (DD_FE_TOKEN[U]) o.fe = U; });
    o.line = ddLineFrom(raw.replace(/SEAL:\S+|CĐ:\S+|CD:\S+/gi, "").slice(11)) || "";
  }
  if (!o.no) { const m = raw.toUpperCase().replace(/[\s-]/g, " ").match(/[A-Z]{4}\d{7}/); o.no = m ? m[0] : raw.trim().split(/[\s\t]+/)[0]; }
  const U = (x) => String(x || "").trim().toUpperCase();
  return { no: U(o.no).replace(/[\s-]/g, ""), iso: U(o.iso), type: DD_ISO_MAP[U(o.iso)] || (DD_CONT_TYPES.includes(U(o.iso)) ? U(o.iso) : null), fe: DD_FE_TOKEN[U(o.fe)] || null, wt: o.wt ? Number(String(o.wt).replace(",", ".")) || null : null, dest: U(o.dest) || null, line: o.line ? (ddLineFrom(o.line) || String(o.line).trim()) : null, seal: o.seal ? String(o.seal).trim() : null, dirTok: raw.includes("\t") ? null : raw.toUpperCase().split(/[\s,;]+/).map(ddDirToken).find(Boolean) || null };
};
const ddIsHeaderLine = (l) => /container|stt|mã iso/i.test(l) && !/[A-Z]{4}\d{7}/.test(l.toUpperCase().replace(/[\s-]/g, ""));
/* Tải file mẫu (.xlsx) theo mẫu danh sách cont */
const ddLoadXlsx = () => new Promise((ok, no) => { if (window.XLSX) return ok(window.XLSX); const sc = document.createElement("script"); sc.src = "https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js"; sc.onload = () => ok(window.XLSX); sc.onerror = () => no(new Error("Không tải được bộ tạo Excel")); document.head.appendChild(sc); });
const ddContTemplate = () => ddLoadXlsx().then(X => { const ws = X.utils.aoa_to_sheet([DD_CONT_TPL, [1, "TRHU4570844", "45GP", 40, "MTY", 4, "DNP", "ONE", "", "", "", ""], [2, "TCNU5995768", "45GP", 40, "FCL", 24.5, "DNP", "ONE", "ONE1234567", "", "", ""]]); ws["!cols"] = DD_CONT_TPL.map((h, i) => ({ wch: i === 1 ? 16 : 12 })); const wb = X.utils.book_new(); X.utils.book_append_sheet(wb, ws, "Danh sach cont"); X.writeFile(wb, "Mau_danh_sach_cont.xlsx"); });
const DD_SHIFTS = [
  { id: 1, label: "Ca 1" },
  { id: 2, label: "Ca 2" }, /* 2 ca, không quy định giờ (chốt 11/11) */
];
/* Tài khoản tally theo ca × dịch vụ (chốt 04/11): app Tally đăng nhập bằng tài khoản ca, không theo từng người.
   Dùng được trên thiết bị công ty hoặc cá nhân. Bản ghi / sự cố ghi theo tài khoản ca. */
const DD_TALLY_SVC = { bp: "Bến phao", icd: "ICD" };
const DD_TALLY_ACCS = Object.keys(DD_TALLY_SVC).flatMap(svc => DD_SHIFTS.map(s => ({ id: `tc-${svc}-${s.id}`, name: `Tally ${s.label} · ${DD_TALLY_SVC[svc]}`, short: `C${s.id}`, role: "Tài khoản tally ca", svc, shift: s.id, acc: true, login: (DD_BOOT.users.find(u => u.tally_acc === `tc-${svc}-${s.id}`) || {}).email || "— chưa tạo tài khoản", active: !!DD_BOOT.users.find(u => u.tally_acc === `tc-${svc}-${s.id}` && u.active), color: svc === "bp" ? 3 : 0 })));
DD_PEOPLE.push(...DD_TALLY_ACCS);
const ddTallySvc = (j) => j && j.service === "bp" ? "bp" : "icd";
const ddTallyAcc = (j, shift) => `tc-${ddTallySvc(j)}-${shift}`;
/* Người đăng nhập: tally đăng nhập bằng tài khoản ca (BR-DD-10) → dùng chính tài khoản ca làm "người" ghi */
const DD_ME = DD_BOOT.me.role === "TALLY" ? DD_TALLY_ACCS.find(a => a.id === DD_BOOT.me.tally_acc) : DD_PEOPLE.find(p => p.id === DD_BOOT.me.email);
const DD_ROLE = DD_BOOT.me.role; /* KHTH | TP | TALLY | DPVT | TAIXE */
const ddCan = (...roles) => roles.includes(DD_ROLE);
const DD_HEAD = DD_PEOPLE.find(p => p.appRole === "TP") || { id: "tp", name: "Trưởng phòng Khai thác", short: "TP", color: 1 };
const ddPerson = (id) => DD_PEOPLE.find(p => p.id === id) || { id, name: id, short: String(id || "?").slice(0, 3).toUpperCase(), color: 0 };
/* Danh mục bến (dd_catalog, kind = berth): { id, kind: "icd" | "bp", name } */
const DD_OCC_BERTHS = DD_BOOT.catalog.berth;
/* Danh mục bến dùng chung với OCC: bến phao + bến ICD */
const DD_ICD_BERTHS = DD_OCC_BERTHS.filter(b => b.kind === "icd").map(b => b.id);
/* Kho: theo ứng dụng Quản lý Kho (VNL-02A, VNL-02B) + kho đối tác */
const DD_KHO_SITES = ["VNL-02A", "VNL-02B", "Kho đối tác"];
const DD_YARD_SITES = ["Bãi container", "Depot rỗng"];
const DD_LOCATIONS = [...DD_OCC_BERTHS.map(b => b.id), ...DD_KHO_SITES, ...DD_YARD_SITES];
/* Vị trí theo dịch vụ: bến phao / bến ICD lấy từ danh mục bến dùng chung với OCC */
const ddLocOptions = (svc) => svc === "bp" ? DD_OCC_BERTHS.filter(b => b.kind !== "icd").map(b => b.id) : svc === "icd" ? DD_ICD_BERTHS : svc === "kho" ? DD_KHO_SITES : DD_YARD_SITES;
const ddLoc = (j) => !j ? "" : j.yard ? `${j.location} · ${j.yard}` : j.location;
/* Dữ liệu ứng dụng Quản lý Kho (cùng nơi lưu với iframe Kho) */
const DD_KHO_KEY = "ttos-kho-demo.v2";
const ddKhoDb = () => { try { return JSON.parse(localStorage.getItem(DD_KHO_KEY)) || null; } catch (e) { return null; } };
const ddKhoCargos = () => (ddKhoDb()?.cargos || []).map(c => c.name);
const ddIsoToday = () => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`; };
const ddKhoTxOfJob = (id) => (ddKhoDb()?.txns || []).filter(t => t.jobId === id && (t.type === "IN" || t.type === "OUT"));
/* Phương tiện đăng ký: xe ben (hàng rời), đầu kéo (cont xuất), sà lan (bến phao) */
/* Danh mục xe (dd_catalog, kind = vehicle) — xe mới trong lệnh ca tự thêm (BR-DD-08), đồng bộ lên danh mục */
const DD_VEHICLES = DD_BOOT.catalog.vehicle;
/* v2.5: danh sách xe của ca do KHTH đưa vào (gõ / dán / Excel), không chọn từ danh mục */
const ddVehParse = (text) => { const seen = new Set(); return text.split(/\n/).map(l => l.trim()).filter(Boolean).map(l => { const [p, ...rest] = l.split(/\s*[·|\t;]\s*|\s{2,}/); const plate = (p || "").toUpperCase().replace(/\s+/g, " ").trim(); return { plate, owner: rest.join(" ").trim() }; }).filter(x => x.plate && !seen.has(x.plate) && seen.add(x.plate)); };
const ddVehLine = (p) => { const v = DD_VEHICLES.find(x => x.plate === p); return v && v.owner ? `${p} · ${v.owner}` : p; };
const ddVehRegister = (list, kind) => list.forEach(({ plate, owner }) => { const v = DD_VEHICLES.find(x => x.plate === plate); if (!v) DD_VEHICLES.push({ plate, type: owner ? `Xe ngoài · ${owner}` : { salan: "Sà lan", keo: "Đầu kéo", ben: "Xe ben" }[kind] || "Xe", kind: kind || "ben", cap: 0, ext: !!owner, owner: owner || null }); else if (owner && !v.owner) { v.owner = owner; v.ext = true; } });
const ddReadPlateFile = (file) => new Promise((resolve, reject) => {
  const fromRows = (rows) => resolve(rows.map(r => r.map(c => String(c ?? "").trim()).filter(Boolean)).filter(r => r.length && /\d/.test(r[0]) && !/biển|bien|plate/i.test(r[0])).map(r => r.slice(0, 2).join(" · ")).join("\n"));
  const rd = new FileReader();
  if (/\.(csv|txt)$/i.test(file.name)) { rd.onload = () => fromRows(String(rd.result).split(/\r?\n/).map(l => l.split(/[,;\t]/))); rd.readAsText(file); return; }
  const parse = () => { rd.onload = () => { try { const wb = window.XLSX.read(rd.result, { type: "array" }); fromRows(window.XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]], { header: 1, raw: false })); } catch (e) { reject(e); } }; rd.readAsArrayBuffer(file); };
  if (window.XLSX) return parse();
  const sc = document.createElement("script"); sc.src = "https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js"; sc.onload = parse; sc.onerror = () => reject(new Error("Không tải được bộ đọc Excel")); document.head.appendChild(sc);
});
const ddVeh = (plate) => DD_VEHICLES.find(v => v.plate === plate) || { plate, type: "Ngoài danh sách", cap: 0 };
const ddVehKinds = (j) => !j ? [] : j.kind === "cont" ? ["keo"] : j.service === "bp" ? ["salan"] : ["ben"];
/* Thiết bị: cẩu bờ ICD lấy từ danh mục cẩu của OCC (dùng chung) */
/* Thiết bị / cẩu (dd_catalog, kind = equip). Tên bắt đầu "Gàu" không tính là cẩu */
const DD_EQUIP = DD_BOOT.catalog.equip.map(e => e.name || e.id);

const DD_JOB_STATUS = {
  planned:  { label: "Kế hoạch",              cls: "neutral" },
  running:  { label: "Đang thực hiện",        cls: "accent"  },
  done:     { label: "Hoàn thành · chờ chốt", cls: "warning" },
  pendingEx:{ label: "Chờ TP duyệt ngoại lệ", cls: "warning" },
  closed:   { label: "Đã chốt · bàn giao KT", cls: "success" },
  cancelled:{ label: "Đã huỷ",                cls: "danger"  },
};
const DD_ORDER_STATUS = {
  draft:   { label: "Nháp",           cls: "neutral" },
  sent:    { label: "Đã gửi tally",   cls: "accent"  },
  running: { label: "Đang làm",       cls: "warning" },
  done:    { label: "Xong ca",        cls: "success" },
  cancelled: { label: "Đã huỷ",       cls: "neutral" },
};

const ddConts = (prefix, base, n, type, fe, done) => Array.from({ length: n }, (_, i) => ({ no: ddMakeCont(prefix, base + i * 7), type, fe, status: i < done ? "done" : "pending" }));
/* Dữ liệu nghiệp vụ nạp từ bảng dd_docs (không còn dữ liệu mẫu). Mảng giữ nguyên tham chiếu — sync.js cập nhật tại chỗ. */
const DD_JOBS = DD_BOOT.docs.jobs;
const DD_ORDERS = DD_BOOT.docs.orders;

/* Giờ thật GMT+7 dạng dd/mm/yyyy HH:mm (lưu xuống CSDL đổi sang ISO UTC — xem sync.js) */
const ddNow = () => window.ddVnNow().at;
/* v2.6 — vòng đời job: bắt đầu ở ghi nhận đầu tiên của tally; job cont tự hoàn thành khi mọi cont xong (BR-DD-17, 19) */
const ddJobTouch = (j, by) => {
  if (!j) return;
  j.log = j.log || [];
  if (j.status === "planned") { j.status = "running"; j.log.unshift({ at: ddNow(), by: by || j.owner, text: "Bắt đầu thực hiện (ghi nhận đầu tiên của tally)" }); }
  if (j.status === "running" && j.kind === "cont" && j.conts.length && j.conts.every(c => ddContDone(c, j))) { j.status = "done"; j.log.unshift({ at: ddNow(), by: by || j.owner, text: "Tự chuyển Hoàn thành: tất cả cont đã xong · mã tài xế hết hiệu lực" }); }
};
const ddJobHasRec = (j) => (j.actual || 0) > 0 || (j.conts || []).some(c => c.gin || c.gout);
/* Cont đang thuộc job khác chưa xong (BR-DD-14) */
const ddContBusy = (no, dir, exceptId) => {
  for (const j of DD_JOBS) {
    if (j.id === exceptId || j.kind !== "cont" || ["closed", "cancelled"].includes(j.status)) continue;
    const c = j.conts.find(x => x.no === no); if (!c || c.closedAs) continue;
    if (dir === "export" && ddCDir(c, j) === "import" && c.gin) continue;
    if (ddContDone(c, j) && ddCDir(c, j) !== "import") continue;
    return j.id;
  }
  return null;
};
const ddD = (s) => { const [d, m, y] = s.split("/").map(Number); return new Date(y, m - 1, d); };
const ddFmt = (dt) => `${String(dt.getDate()).padStart(2, "0")}/${String(dt.getMonth() + 1).padStart(2, "0")}/${dt.getFullYear()}`;
const ddIso = (s) => s.split("/").reverse().join("-");
const ddFromIso = (s) => s ? s.split("-").reverse().join("/") : "";
const ddCus = (id) => (window.KD_CUSTOMERS || []).find(c => c.id === id) || { id, name: id };
const ddCusShort = (id) => { const c = ddCus(id); return c.shortName || c.name; };
const ddActiveContracts = (cid) => (window.KD_CONTRACTS || []).filter(k => k.customer === cid && ["active", "expiring"].includes(k.status));
const ddAcceptedQuotes = (cid) => (window.KD_QUOTES || []).filter(q => q.customer === cid && q.state === "accepted");
const ddNum = (n) => (n || 0).toLocaleString("vi-VN");
const ddNoContractJobs = () => DD_JOBS.filter(j => !j.contract && !["closed", "cancelled"].includes(j.status));
/* JOB-yyyy-nnnn theo năm hiện tại (GMT+7) */
const ddNextJobId = () => { const y = ddToday().slice(-4); const ns = DD_JOBS.filter(j => j.id.startsWith(`JOB-${y}-`)).map(j => Number(j.id.slice(-4)) || 0); return `JOB-${y}-${String((ns.length ? Math.max(...ns) : 0) + 1).padStart(4, "0")}`; };

/* ================= THÀNH PHẦN CHUNG ================= */
const DdBadge = ({ map, s }) => { const v = map[s] || { label: s, cls: "neutral" }; return <span className={`badge ${v.cls}`}>{v.label}</span>; };
const DdNoHd = ({ job }) => (
  <span className="badge danger" title={job.quote ? `Căn cứ tạm: ${job.quote}` : "Chưa có căn cứ tạm"}>Chưa có HĐ</span>
);
const DdProgress = ({ job }) => {
  const pct = Math.min(100, Math.round((job.actual / job.plan) * 100) || 0);
  return (
    <div style={{ minWidth: 0 }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12 }}>
        <span className="mono">{ddNum(job.actual)}/{ddNum(job.plan)} {ddUnit(job)}</span>
        <span className="muted mono">{pct}%</span>
      </div>
      <div style={{ height: 5, background: "var(--bg-sunken)", borderRadius: 3, marginTop: 4, overflow: "hidden" }}>
        <div style={{ width: `${pct}%`, height: "100%", background: pct >= 100 ? "var(--st-success)" : "var(--brand-ink)" }}></div>
      </div>
    </div>
  );
};
const DdBox = ({ title, sub, right, children }) => (
  <div className="card" style={{ marginBottom: 16 }}>
    <div className="card-head"><div><h3>{title}</h3>{sub && <div className="sub">{sub}</div>}</div>{right}</div>
    <div className="card-body">{children}</div>
  </div>
);
const DdComingSoon = ({ title, note }) => (
  <div className="page">
    <div className="page-head"><div><h1>{title}</h1><div className="sub">Module Điều độ khai thác</div></div></div>
    <div className="card"><div className="card-body" style={{ padding: 40, textAlign: "center" }}>
      <Icon name="settings" size={26} className="muted"/>
      <div style={{ fontSize: 14, fontWeight: 600, marginTop: 10 }}>{title}</div>
      <p className="muted" style={{ fontSize: 13, maxWidth: 480, margin: "8px auto 0", lineHeight: 1.6 }}>{note}</p>
    </div></div>
  </div>
);

/* ================= KẾ HOẠCH JOB — DANH SÁCH ================= */
const DdJobsScreen = ({ go, ctx }) => {
  const [tab, setTab] = React.useState(ctx?.tab || "active");
  const [svc, setSvc] = React.useState("all");
  const [toast, flash] = useKdToast();
  React.useEffect(() => { if (ctx?.toast) flash(ctx.toast); }, []);
  const tabs = [
    { id: "active", label: "Đang mở", f: j => !["closed", "cancelled"].includes(j.status) },
    { id: "running", label: "Đang thực hiện", f: j => j.status === "running" },
    { id: "planned", label: "Kế hoạch", f: j => j.status === "planned" },
    { id: "nohd", label: "Chưa có HĐ", f: j => !j.contract && j.status !== "closed" },
    { id: "done", label: "Chờ chốt", f: j => j.status === "done" || j.status === "pendingEx" },
    { id: "closed", label: "Đã chốt", f: j => j.status === "closed" },
    { id: "cancelled", label: "Đã huỷ", f: j => j.status === "cancelled" },
  ];
  const rows = DD_JOBS.filter(tabs.find(t => t.id === tab).f).filter(j => svc === "all" || j.service === svc);
  const kpi = [
    { l: "Đang thực hiện", v: DD_JOBS.filter(j => j.status === "running").length, d: "job có ca đang chạy", c: "#1E5FB7" },
    { l: "Kế hoạch sắp tới", v: DD_JOBS.filter(j => j.status === "planned").length, d: "chưa bắt đầu", c: "#64748B" },
    { l: "Chưa có hợp đồng", v: ddNoContractJobs().length, d: "đã báo NV KD bổ sung (D8)", c: "#DC2626" },
    { l: "Chờ chốt sản lượng", v: DD_JOBS.filter(j => j.status === "done" || j.status === "pendingEx").length, d: "trước khi bàn giao Kế toán", c: "#B45309" },
  ];

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h1>Kế hoạch job</h1>
          <div className="sub">KHTH tạo kế hoạch job · khách hàng & hợp đồng tra cứu từ module Kinh doanh — US-KH-01 (sửa theo D1, D7, D8)</div>
        </div>
        <div className="actions">
          <button className="btn accent" onClick={() => go("dd-job-new")}><Icon name="plus" size={14}/> Tạo kế hoạch job</button>
        </div>
      </div>

      <div className="kpi-grid" style={{ marginBottom: 18 }}>
        {kpi.map(k => (
          <div key={k.l} className="kpi">
            <div className="lbl"><span className="swatch" style={{ background: k.c }}></span>{k.l}</div>
            <div className="val">{k.v} <small>job</small></div>
            <div className="delta">{k.d}</div>
          </div>
        ))}
      </div>

      <div className="card">
        <div className="tabs">
          {tabs.map(t => (
            <div key={t.id} className={`tab ${tab === t.id ? "active" : ""}`} onClick={() => setTab(t.id)}>
              {t.label}<span className="count">{DD_JOBS.filter(t.f).length}</span>
            </div>
          ))}
        </div>
        <div className="toolbar" style={{ display: "flex", gap: 8, padding: "10px 16px", alignItems: "center", flexWrap: "wrap" }}>
          <div className="seg-bar">
            <button className={svc === "all" ? "on" : ""} onClick={() => setSvc("all")}>Tất cả dịch vụ</button>
            {DD_SERVICES_ON.map(s => <button key={s.id} className={svc === s.id ? "on" : ""} onClick={() => setSvc(s.id)}>{s.label}</button>)}
          </div>
        </div>
        <div className="tbl-wrap">
          <table className="tbl">
            <thead><tr>
              <th style={{ width: 150 }}>Mã job</th><th style={{ minWidth: 230 }}>Khách hàng · Hàng</th><th style={{ width: 130 }}>Dịch vụ</th>
              <th style={{ width: 170 }}>Thời gian · Vị trí</th><th style={{ width: 190 }}>Sản lượng</th><th style={{ width: 160 }}>Hợp đồng</th><th style={{ width: 170 }}>Trạng thái</th>
            </tr></thead>
            <tbody>
              {rows.length === 0 && <tr><td colSpan={7} className="muted" style={{ textAlign: "center", padding: 24 }}>Không có job nào</td></tr>}
              {rows.map(j => (
                <tr key={j.id} style={{ cursor: "pointer" }} onClick={() => go("dd-job-detail", { id: j.id })}>
                  <td className="mono" style={{ fontSize: 12 }}>{j.id}<div className="muted" style={{ fontSize: 11, marginTop: 2 }}>KHTH: {ddPerson(j.owner).short}</div></td>
                  <td><div style={{ fontSize: 13, fontWeight: 500 }}>{ddCus(j.customer).name}</div><div className="muted" style={{ fontSize: 11.5 }}>{j.kind === "cont" ? `${ddDirLabel(j)} · ${j.conts.length} cont` : `${j.cargo} · ${j.unit}`}</div></td>
                  <td style={{ fontSize: 12.5 }}><span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}><Icon name={ddSvc(j.service).icon} size={13}/>{ddSvc(j.service).label}</span></td>
                  <td style={{ fontSize: 12 }}><span className="mono">{j.from.slice(0, 5)} → {j.to.slice(0, 5)}</span><div className="muted" style={{ fontSize: 11.5 }}>{ddLoc(j)}</div></td>
                  <td><DdProgress job={j} /></td>
                  <td>{j.contract ? <span className="mono" style={{ fontSize: 12 }}>{j.contract}</span> : <><DdNoHd job={j} />{j.quote && <div className="muted" style={{ fontSize: 11, marginTop: 3 }}>tạm: {j.quote}</div>}</>}</td>
                  <td><DdBadge map={DD_JOB_STATUS} s={j.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <KdToast text={toast} />
    </div>
  );
};

/* ================= TẠO KẾ HOẠCH JOB ================= */
const DdJobNewScreen = ({ go }) => {
  const [f, setF] = React.useState({ customer: "", contract: "", quote: "", service: "bp", kind: "bulk", unit: "tấn", contDir: "export", measure: "", line: "", lines: {}, groups: [{ dir: "direct", text: "", exp: 0, line: "", dest: "" }], contType: "40GP", contFe: "F", cargo: "", plan: 0, from: ddIso(ddToday()), to: ddIso(ddFmt(new Date(ddD(ddToday()).getTime() + 4 * 864e5))), location: ddLocOptions("bp")[0] || "", yard: "", vessel: "", owner: DD_ME.id, note: "" });
  const [q, setQ] = React.useState("");
  const [toast, flash] = useKdToast();
  const set = (k, v) => setF(s => ({ ...s, [k]: v }));
  const cus = f.customer ? ddCus(f.customer) : null;
  const contracts = cus ? ddActiveContracts(cus.id) : [];
  const quotes = cus ? ddAcceptedQuotes(cus.id) : [];
  const otherContracts = cus ? (window.KD_CONTRACTS || []).filter(k => k.customer === cus.id && !["active", "expiring"].includes(k.status)) : [];
  const kdOwner = cus ? (window.kdPerson ? kdPerson(cus.owner) : { name: cus.owner }) : null;
  const list = (window.KD_CUSTOMERS || []).filter(c => !q.trim() || [c.id, c.name, c.shortName, c.taxCode].join(" ").toLowerCase().includes(q.toLowerCase()));
  const fromD = f.from ? ddFromIso(f.from) : "", toD = f.to ? ddFromIso(f.to) : "";
  const dup = cus && f.from && f.to ? DD_JOBS.filter(j => j.customer === cus.id && j.service === f.service && !["closed", "cancelled"].includes(j.status) && ddD(j.from) <= ddD(toD) && ddD(fromD) <= ddD(j.to)) : [];
  const lines = f.groups.flatMap(g => g.text.split(/\n/).map(x => x.replace(/\r/g, "").replace(/^ +| +$/g, "")).filter(x => x.trim()).map(line => ({ line, sec: g.dir, g })));
  const expDir = {}; f.groups.forEach(g => { expDir[g.dir] = (expDir[g.dir] || 0) + (+g.exp || 0); });
  const expSum = Object.values(expDir).reduce((t, v) => t + v, 0);
  const setG = (i, patch) => setF(s => ({ ...s, groups: s.groups.map((g, k) => k === i ? { ...g, ...patch } : g) }));
  const freeDirs = DD_DIR_ORDER.filter(k => !f.groups.some(g => g.dir === k));
  const parsed = lines.filter(({ line }) => !ddIsHeaderLine(line)).map(({ line, sec, g }) => { const p = ddParseCont(line); const c = ddContCheck(p.no); const type = p.type || f.contType; const fe = p.fe || f.contFe; const dir = (f.dirs || {})[c.no] || p.dirTok || sec; const ln = (f.lines || {})[c.no] ?? (p.line || (g.line || "").trim()); const seal = (f.seals || {})[c.no] ?? (p.seal || ""); const dest = (f.dests || {})[c.no] ?? (p.dest || (dir !== "import" ? (g.dest || "").trim().toUpperCase() : "") || ""); const r = { ...c, type, iso: p.iso, fe, wt: p.wt, dest, seal, dir, line: ln }; if (!r.ok && /^Sai số kiểm tra/.test(r.why || "")) { r.ok = true; r.warn = r.why; r.why = null; } const busy = r.ok && ddContBusy(r.no, dir); if (busy) { r.ok = false; r.why = `Đang thuộc ${busy}`; } if (r.ok && dir === "import" && !ln) { r.ok = false; r.why = "Thiếu hãng tàu (cont nhập lưu bãi)"; r.noLine = true; } if (r.ok && dir !== "import" && !dest) { r.ok = false; r.why = "Thiếu cảng đích (cont xuất)"; r.noDest = true; } if (r.ok && fe === "F" && !seal) { r.noSeal = true; } return r; });
  const dirCnt = {}; parsed.filter(c => c.ok).forEach(c => dirCnt[c.dir] = (dirCnt[c.dir] || 0) + 1);
  parsed.forEach((c, i) => { if (c.ok && parsed.findIndex(x => x.no === c.no) !== i) { c.ok = false; c.why = "Trùng trong danh sách"; } });
  const goodConts = parsed.filter(c => c.ok);
  const teu = goodConts.reduce((t, c) => t + (c.type.startsWith("4") ? 2 : 1), 0);
  const isCont = f.kind === "cont";
  const qtyOk = isCont ? (parsed.length === 0 ? expSum > 0 : goodConts.length === parsed.length) : f.cargo.trim() && f.plan > 0;
  const minFrom = new Date(ddD(ddToday()).getTime() - 3 * 864e5);
  const fromTooOld = f.from && ddD(fromD) < minFrom;
  const valid = cus && qtyOk && f.from && f.to && ddD(fromD) <= ddD(toD) && !fromTooOld;

  const save = () => {
    const id = ddNextJobId();
    const job = { id, customer: cus.id, contract: f.contract || null, quote: f.contract ? null : (f.quote || null), service: f.service, kind: f.kind,
      ...(isCont ? { contDir: (goodConts.length ? DD_DIR_ORDER.slice().sort((a, b) => (dirCnt[b] || 0) - (dirCnt[a] || 0))[0] : DD_DIR_ORDER.slice().sort((a, b) => (expDir[b] || 0) - (expDir[a] || 0))[0]), conts: goodConts.map(c => ({ no: c.no, type: c.type, iso: c.iso || null, fe: c.fe, wt: c.wt || null, dest: c.dest || null, seal: c.seal || null, dir: c.dir, line: c.line || null, status: "pending", warn: c.warn || null })), expect: goodConts.length ? null : expSum, expectDir: goodConts.length ? null : { direct: expDir.direct || 0, import: expDir.import || 0, export: expDir.export || 0 }, line: null, cargo: f.cargo.trim() || ((Object.keys(dirCnt).length > 1 || DD_DIR_ORDER.filter(k => expDir[k]).length > 1) ? "Container hỗn hợp" : (dirCnt.import || expDir.import) ? "Container nhập lưu bãi" : (dirCnt.direct || expDir.direct) ? "Container xuất thẳng" : "Container xuất bãi"), plan: goodConts.length || expSum }
        : { cargo: f.cargo, unit: f.unit, plan: f.plan, measure: ddMeasureOpts(f.service, f.unit)[0] }), actual: 0,
      from: fromD, to: toD, location: f.location, yard: f.yard.trim(), vessel: f.vessel || "—", owner: f.owner, status: "planned", note: f.note,
      kdNotify: null };
    job.log = [{ at: ddNow(), by: DD_ME.id, text: "Tạo kế hoạch job" }];
    if (!job.contract) job.log.unshift({ at: ddNow(), by: DD_ME.id, text: `Gắn nhãn “Chưa có HĐ”${job.quote ? ` · căn cứ tạm ${job.quote}` : ""}` });
    if (job.conts) job.conts.forEach(c => { if (c.line && !DD_LINES.includes(c.line)) DD_LINES.push(c.line); });
    DD_JOBS.unshift(job);
    go("dd-job-detail", { id, toast: `${job.contract ? `Đã tạo ${id}` : `Đã tạo ${id} · gắn nhãn Chưa có HĐ`} · mã tài xế sinh khi gửi lệnh ca` });
  };

  return (
    <div className="page" style={{ paddingTop: 20, maxWidth: 1240 }}>
      <div style={{ marginBottom: 14, display: "flex", alignItems: "center", gap: 8 }}>
        <button className="btn ghost btn-sm" onClick={() => go("dd-jobs")}>← Kế hoạch job</button>
        <div className="muted" style={{ fontSize: 12, marginLeft: 6 }}>Kế hoạch job / Tạo mới</div>
      </div>
      <h1 style={{ margin: "0 0 16px", fontSize: 21, fontWeight: 700 }}>Tạo kế hoạch job</h1>

      <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) 360px", gap: 18, alignItems: "start" }}>
        <div style={{ minWidth: 0 }}>
          <DdBox title="1. Khách hàng & căn cứ" sub="Tra cứu từ module Kinh doanh — chỉ xem, không sửa hồ sơ tại đây">
            <div className="field"><label>Khách hàng <span className="req">*</span></label>
              {!cus ? (
                <>
                  <div className="search" style={{ margin: "0 0 8px" }}><Icon name="search" size={14} className="muted"/><input value={q} onChange={e => setQ(e.target.value)} placeholder="Tìm theo tên, tên viết tắt, MST, mã KH…" /></div>
                  <div style={{ border: "1px solid var(--line)", borderRadius: "var(--r-sm)", maxHeight: 260, overflowY: "auto" }}>
                    {list.map(c => { const n = ddActiveContracts(c.id).length; return (
                      <div key={c.id} onClick={() => setF(s => ({ ...s, customer: c.id, contract: ddActiveContracts(c.id).length === 1 ? ddActiveContracts(c.id)[0].id : "", quote: "" }))}
                        style={{ padding: "9px 12px", borderBottom: "1px solid var(--line)", cursor: "pointer", display: "flex", gap: 10, alignItems: "center" }}>
                        <span className="mono muted" style={{ fontSize: 11.5, width: 64 }}>{c.id}</span>
                        <div style={{ flex: 1, minWidth: 0 }}><div style={{ fontSize: 13, fontWeight: 500 }}>{c.name}</div><div className="muted" style={{ fontSize: 11.5 }}>{c.shortName || "—"} · MST {c.taxCode || "—"}</div></div>
                        {n ? <span className="badge success" style={{ fontSize: 10.5 }}>{n} HĐ hiệu lực</span> : <span className="badge neutral" style={{ fontSize: 10.5 }}>Chưa có HĐ</span>}
                      </div>); })}
                  </div>
                  <div className="muted" style={{ fontSize: 11.5, marginTop: 6 }}>Không thấy KH? Khách hàng mới phải được NV KD tạo ở module Kinh doanh trước.</div>
                </>
              ) : (
                <div style={{ padding: 12, border: "1px solid var(--line)", borderRadius: "var(--r-md)", background: "var(--bg-canvas)", display: "flex", gap: 12, alignItems: "flex-start" }}>
                  <div style={{ flex: 1, fontSize: 12.5, lineHeight: 1.65 }}>
                    <div className="row" style={{ gap: 6 }}><span className="tag">{cus.id}</span>{cus.shortName && <span className="tag">{cus.shortName}</span>}</div>
                    <b style={{ fontSize: 14 }}>{cus.name}</b>
                    <div className="muted">MST {cus.taxCode || "—"} · {cus.address}</div>
                    
                  </div>
                  <button className="btn btn-sm" onClick={() => setF(s => ({ ...s, customer: "", contract: "", quote: "" }))}>Đổi KH</button>
                </div>
              )}
            </div>

            {cus && (
              <>
                <div className="field" style={{ marginTop: 14 }}><label>Hợp đồng <span className="opt">— không bắt buộc (D7)</span></label>
                  <select className="select" value={f.contract} onChange={e => set("contract", e.target.value)}>
                    <option value="">{contracts.length ? "— Chưa gắn hợp đồng —" : "KH chưa có hợp đồng đang hiệu lực"}</option>
                    {contracts.map(k => <option key={k.id} value={k.id}>{k.id} · {k.title} · {k.from} → {k.to}</option>)}
                  </select>
                  {otherContracts.length > 0 && <div className="muted" style={{ fontSize: 11.5, marginTop: 5 }}>Không chọn được: {otherContracts.map(k => `${k.id} (${(KD_CONTRACT_STATUS[k.status] || {}).label || k.status})`).join(", ")}</div>}
                </div>
                {!f.contract && (
                  <div style={{ marginTop: 12, padding: 12, borderRadius: "var(--r-md)", border: "1px solid #F3C9C9", background: "var(--st-danger-bg, #FDECEC)", fontSize: 12.5, lineHeight: 1.6 }}>
                    <b>Job sẽ gắn nhãn “Chưa có HĐ” (D8).</b> Job vẫn chạy bình thường. <span className="muted">(Chạy thử: chưa kết nối PTKD — không tự báo NV KD.)</span>
                    Khi chốt sản lượng bàn giao Kế toán, job phải đã gắn HĐ, nếu không cần Trưởng phòng khai thác duyệt ngoại lệ.
                    <div className="field" style={{ marginTop: 10, marginBottom: 0 }}><label>Căn cứ tạm <span className="opt">— báo giá KH đã chấp nhận</span></label>
                      <select className="select" value={f.quote} onChange={e => set("quote", e.target.value)}>
                        <option value="">{quotes.length ? "— Không gắn —" : "KH chưa có báo giá đã chấp nhận"}</option>
                        {quotes.map(x => <option key={x.id} value={x.id}>{x.id} · {x.serviceDesc || "Báo giá"} · {kdShortMoney(x.value)}</option>)}
                      </select>
                    </div>
                  </div>
                )}
              </>
            )}
          </DdBox>

          <DdBox title="2. Nội dung job">
            <div className="field"><label>Dịch vụ</label>
              <div className="seg-bar" style={{ flexWrap: "wrap" }}>
                {DD_SERVICES_NEW.filter(s => !isCont || s.id === "icd").map(s => <button key={s.id} className={f.service === s.id ? "on" : ""} onClick={() => setF(x => ({ ...x, service: s.id, location: ddLocOptions(s.id)[0] }))}><Icon name={s.icon} size={12}/> {s.label}</button>)}
              </div>
            </div>
            <div className="field"><label>Loại hàng hoá</label>
              <div className="seg-bar">
                <button className={!isCont ? "on" : ""} onClick={() => set("kind", "bulk")}>Hàng rời / bao kiện</button>
                <button className={isCont ? "on" : ""} onClick={() => setF(s => ({ ...s, kind: "cont", service: "icd", location: s.service === "icd" ? s.location : ddLocOptions("icd")[0] }))}>Container</button>
              </div>
            </div>
            {!isCont ? (
              <div style={{ display: "grid", gridTemplateColumns: "1.4fr 0.8fr 1fr", gap: 12 }}>
                <div className="field"><label>Tên hàng <span className="req">*</span></label><input className="input" list="dd-kho-cargos" value={f.cargo} onChange={e => set("cargo", e.target.value)} placeholder={f.service === "kho" ? "Chọn theo danh mục hàng hóa của Kho" : "VD: Clinker rời, thép cuộn, xi măng bao"} />{f.service === "kho" && <datalist id="dd-kho-cargos">{ddKhoCargos().map(c => <option key={c} value={c} />)}</datalist>}</div>
                <div className="field"><label>Đơn vị tính <span className="req">*</span></label><select className="select" value={f.unit} onChange={e => set("unit", e.target.value)}>{(f.service === "kho" ? ["tấn"] : DD_UNITS).map(u => <option key={u}>{u}</option>)}</select>{f.service === "kho" && <div className="muted" style={{ fontSize: 11, marginTop: 3 }}>Kho quản lý theo tấn</div>}</div>
                <div className="field"><label>Khối lượng kế hoạch ({f.unit}) <span className="req">*</span></label><input className="input mono" value={f.plan ? ddNum(f.plan) : ""} onChange={e => set("plan", Number(e.target.value.replace(/\D/g, "")) || 0)} placeholder="0" /></div>
                <div className="muted" style={{ gridColumn: "1 / -1", fontSize: 12 }}>Cách ghi nhận tại hiện trường: <b>{DD_MEASURE[ddMeasureOpts(f.service, f.unit)[0]]}</b> — hệ thống tự gán theo dịch vụ và đơn vị tính; cân chưa kết nối thì tally nhập tay.</div>
              </div>
            ) : (
              <>
                <div className="field-row">
                  <div className="field"><label>Mô tả hàng <span className="opt">— không bắt buộc</span></label><input className="input" value={f.cargo} onChange={e => set("cargo", e.target.value)} placeholder="VD: Container lạnh hàng thuỷ sản" /></div>
                </div>
                <div className="field"><label>Danh sách số container <span className="opt">— nhập từ file Excel của hãng tàu, hoặc dán mỗi dòng 1 cont kèm loại & F/E, rồi chọn hướng cho danh sách. Có thêm hướng khác thì bấm "Thêm danh sách cho hướng khác"</span></label>
                  {f.groups.map((g, i) => { const n = parsed.filter(c => c.ok && c.dir === g.dir).length; const opts = DD_DIR_ORDER.filter(k => k === g.dir || !f.groups.some(x => x.dir === k)); return (
                    <div key={i} style={{ border: "1px solid var(--line)", borderRadius: "var(--r-sm)", padding: 12, marginBottom: 10, background: "var(--bg-canvas)" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                        <b style={{ fontSize: 13 }}>Danh sách {i + 1}{g.text.trim() ? ` · ${n} cont` : ""}</b>
                        {f.groups.length > 1 && <button className="btn btn-sm ghost" onClick={() => setF(s => ({ ...s, groups: s.groups.filter((_, k) => k !== i) }))}>Bỏ danh sách này</button>}
                      </div>
                      <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr)", gap: 12, alignItems: "start" }}>
                        <div>
                          <textarea className="textarea mono" rows={7} value={g.text} onChange={e => setG(i, { text: e.target.value })} placeholder={"Dán các dòng copy từ file Excel danh sách cont (theo mẫu), hoặc mỗi dòng 1 số cont"} style={{ fontSize: 12.5 }} />
                          <label className="btn btn-sm" style={{ cursor: "pointer", marginTop: 6 }}><Icon name="upload" size={12}/> Nhập từ Excel
                            <input type="file" accept=".xlsx,.xls,.csv" style={{ display: "none" }} onChange={e => { const fl = e.target.files[0]; e.target.value = ""; if (!fl) return;
                              ddReadContFile(fl).then(ls => { setF(s => ({ ...s, groups: s.groups.map((x, k) => k === i ? { ...x, text: [x.text.trim(), ...ls].filter(Boolean).join("\n") } : x) })); flash(ls.length ? `Đã đọc ${ls.length} cont từ ${fl.name}` : `Không tìm thấy số cont trong ${fl.name}`); }).catch(err => flash(err.message)); }} />
                          </label>
                        </div>
                        <div>
                          <div style={{ fontSize: 12.5, fontWeight: 600, marginBottom: 6 }}>Hướng của danh sách này</div>
                          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>{opts.map(k => (
                            <button key={k} onClick={() => setG(i, { dir: k })} style={{ textAlign: "left", padding: "8px 10px", borderRadius: "var(--r-sm)", cursor: "pointer", border: `1.5px solid ${g.dir === k ? "var(--brand-ink)" : "var(--line)"}`, background: g.dir === k ? "var(--bg-surface)" : "transparent" }}>
                              <b style={{ fontSize: 12.5 }}>{g.dir === k ? "● " : "○ "}{DD_CONT_DIR[k]}</b><div className="muted" style={{ fontSize: 11 }}>{DD_DIR_HINT[k]}</div></button>))}</div>
                          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 10 }}>
                    <div><div style={{ fontSize: 12, fontWeight: 600, marginBottom: 3 }}>Hãng tàu của danh sách {g.dir === "import" ? <span className="req">*</span> : <span className="opt">— không bắt buộc</span>}</div><input className="input" list="dd-lines" style={{ height: 32 }} value={g.line || ""} onChange={e => setG(i, { line: e.target.value })} placeholder="Chọn hoặc gõ hãng" /></div>
                    <div><div style={{ fontSize: 12, fontWeight: 600, marginBottom: 3 }}>Cảng đích của danh sách {g.dir !== "import" ? <span className="req">*</span> : <span className="opt">— bổ sung sau được</span>}</div><input className="input" style={{ height: 32 }} value={g.dest || ""} onChange={e => setG(i, { dest: e.target.value })} placeholder="VD: DNP" /></div>
                  </div>
                  <div className="muted" style={{ fontSize: 11, marginTop: 3 }}>Cột hãng tàu / cảng đích trong file, hoặc ô sửa từng cont ở bảng kiểm tra, sẽ ghi đè.</div>
                  {!g.text.trim() && <div className="row" style={{ gap: 6, marginTop: 8, fontSize: 12 }}><span className="muted">Chưa có danh sách? Số cont dự kiến</span><input className="input" type="number" min="0" style={{ width: 80, height: 28 }} value={g.exp || ""} onChange={e => setG(i, { exp: +e.target.value })} placeholder="0" /></div>}
                        </div>
                      </div>
                    </div>); })}
                  <datalist id="dd-lines">{DD_LINES.map(l => <option key={l} value={l} />)}</datalist>
                  {freeDirs.length > 0 && <button className="btn btn-sm" onClick={() => setF(s => ({ ...s, groups: [...s.groups, { dir: freeDirs[0], text: "", exp: 0, line: "", dest: "" }] }))}><Icon name="plus" size={12}/> Thêm danh sách cho hướng khác</button>}
                  <div className="row" style={{ gap: 8, marginTop: 8, flexWrap: "wrap" }}>
                    <button className="btn btn-sm" onClick={() => ddContTemplate().then(() => flash("Đã tải Mau_danh_sach_cont.xlsx")).catch(e => flash(e.message))}><Icon name="download" size={12}/> Tải file mẫu</button>
                    <span className="muted" style={{ fontSize: 11.5 }}>Loại & hiện trạng mặc định khi dòng không ghi:</span>
                    <select className="select" style={{ width: 90, height: 28, fontSize: 12 }} value={f.contType} onChange={e => set("contType", e.target.value)}>{DD_CONT_TYPES.map(t => <option key={t}>{t}</option>)}</select>
                    <select className="select" style={{ width: 70, height: 28, fontSize: 12 }} value={f.contFe} onChange={e => set("contFe", e.target.value)}><option value="F">FCL</option><option value="E">MTY</option></select>
                    <button className="btn btn-sm ghost" onClick={() => setF(s => ({ ...s, groups: [{ dir: "direct", exp: 0, line: "", dest: "", text: Array.from({ length: 50 }, (_, i) => ddMakeCont("TGHU", 910000 + i * 7) + " 40HC F").join("\n") }, { dir: "import", exp: 0, line: "", dest: "", text: Array.from({ length: 50 }, (_, i) => ddMakeCont("TGHU", 920000 + i * 7) + " 40HC F").join("\n") }] }))}>Dán mẫu 50 xuất thẳng + 50 lưu bãi</button>
                    {parsed.length === 0 && expSum > 0 && <span style={{ fontSize: 12.5 }}>Dự kiến <b>{expSum}</b> cont · {DD_DIR_ORDER.filter(k => expDir[k]).map(k => `${expDir[k]} ${DD_DIR_SHORT[k]}`).join(" · ")} — bổ sung danh sách trước khi gửi lệnh ca</span>}
                  </div>
                  {parsed.length > 0 && (<>
                    <div style={{ fontSize: 12.5, margin: "10px 0 6px" }}><b>{goodConts.length}</b> cont hợp lệ · {teu} TEU · {DD_DIR_ORDER.filter(k => dirCnt[k]).map(k => `${dirCnt[k]} ${DD_DIR_SHORT[k]}`).join(" · ")}{parsed.some(c => c.noSeal) && <span style={{ color: "var(--st-warning)" }}> · {parsed.filter(c => c.noSeal).length} cont FCL chưa có seal (tạo được, bổ sung ở chi tiết job)</span>}{parsed.length > goodConts.length && <span style={{ color: "var(--st-danger)" }}> · {parsed.length - goodConts.length} dòng lỗi, sửa trước khi tạo</span>}</div>
                    <div style={{ border: "1px solid var(--line)", borderRadius: "var(--r-sm)", maxHeight: 260, overflow: "auto" }}>
                      <table className="tbl"><thead><tr><th>Số cont</th><th>ISO · loại</th><th>Hiện trạng</th><th style={{ textAlign: "right" }}>KL (t)</th><th>Cảng đích</th><th>Hãng tàu</th><th>Số seal</th><th>Hướng</th><th>Kiểm tra</th></tr></thead>
                        <tbody>{parsed.map((c, i) => <tr key={i}><td className="mono" style={{ fontSize: 12 }}>{c.no || "—"}</td><td style={{ fontSize: 12 }}>{c.iso && c.iso !== c.type ? `${c.iso} · ` : ""}{c.type}</td><td style={{ fontSize: 12 }}>{c.fe === "E" ? "MTY · rỗng" : "FCL · có hàng"}</td><td className="mono" style={{ fontSize: 12, textAlign: "right" }}>{c.wt ?? "—"}</td><td><input className="input mono" style={{ height: 26, fontSize: 11.5, width: 72, borderColor: c.noDest ? "var(--st-danger)" : undefined }} value={c.dest || ""} placeholder={c.dir === "import" ? "—" : "bắt buộc"} onChange={e => setF(s => ({ ...s, dests: { ...(s.dests || {}), [c.no]: e.target.value.toUpperCase() } }))} /></td>

                          <td><input className="input" list="dd-lines" style={{ height: 26, fontSize: 11.5, width: 110, borderColor: c.noLine ? "var(--st-danger)" : undefined }} value={c.line || ""} placeholder={c.dir === "import" ? "bắt buộc" : "—"} onChange={e => setF(s => ({ ...s, lines: { ...(s.lines || {}), [c.no]: e.target.value } }))} /></td>
                          <td><input className="input mono" style={{ height: 26, fontSize: 11.5, width: 110, borderColor: c.noSeal ? "var(--st-warning)" : undefined }} value={c.seal || ""} placeholder={c.fe === "F" ? "cont FCL cần seal" : "—"} onChange={e => setF(s => ({ ...s, seals: { ...(s.seals || {}), [c.no]: e.target.value } }))} /></td>
                          <td><select className="select" style={{ height: 26, fontSize: 11.5, width: 120 }} value={c.dir} onChange={e => setF(s => ({ ...s, dirs: { ...(s.dirs || {}), [c.no]: e.target.value } }))}>{DD_DIR_ORDER.map(k => <option key={k} value={k}>{DD_DIR_SHORT[k]}</option>)}</select></td>
                          <td>{c.ok ? (c.warn ? <span className="badge warning" title={c.warn}>{c.warn} · vẫn nhận</span> : c.noSeal ? <span className="badge warning">FCL chưa có seal · bổ sung sau</span> : <span className="badge success">Hợp lệ</span>) : <span className="badge danger" title={c.why}>{c.why}</span>}</td></tr>)}</tbody></table>
                    </div>
                  </>)}
                </div>
              </>
            )}
            <div className="field-row">
              <div className="field"><label>Từ ngày <span className="req">*</span></label><input className="input" type="date" value={f.from} onChange={e => set("from", e.target.value)} style={{ borderColor: fromTooOld ? "var(--st-danger)" : undefined }} />{fromTooOld && <div style={{ fontSize: 11.5, color: "var(--st-danger)", marginTop: 4 }}>Chỉ lùi tối đa 3 ngày so với hôm nay (nhập bù)</div>}</div>
              <div className="field"><label>Đến ngày <span className="req">*</span></label><input className="input" type="date" value={f.to} onChange={e => set("to", e.target.value)} /></div>
            </div>
            <div className="field-row">
              <div className="field"><label>{f.service === "bp" || f.service === "icd" ? "Bến" : f.service === "kho" ? "Kho" : "Bãi / depot"} <span className="req">*</span> <span className="opt">{f.service === "bp" || f.service === "icd" ? "— danh mục dùng chung OCC" : ""}</span></label><select className="select" value={f.location} onChange={e => set("location", e.target.value)}>{ddLocOptions(f.service).map(x => <option key={x}>{x}</option>)}</select></div>
              <div className="field"><label>Vị trí chi tiết <span className="opt">— bãi / khu, nếu có</span></label><input className="input" value={f.yard} onChange={e => set("yard", e.target.value)} placeholder={f.service === "kho" ? "VD: Khu A-02" : "VD: Bãi lạnh R2"} /></div>
            </div>
            <div className="field-row">
              <div className="field"><label>Tàu / phương tiện của KH</label><input className="input" value={f.vessel} onChange={e => set("vessel", e.target.value)} placeholder="VD: MV Nam Kim 06" /></div>
              <div className="field"></div>
            </div>
            <div className="field-row">
              <div className="field"><label>KHTH phụ trách</label><select className="select" value={f.owner} onChange={e => set("owner", e.target.value)}>{DD_PEOPLE.filter(p => p.role === "KHTH").map(p => <option key={p.id} value={p.id}>{p.name}</option>)}</select></div>
              <div className="field"><label>Ghi chú</label><input className="input" value={f.note} onChange={e => set("note", e.target.value)} /></div>
            </div>
          </DdBox>
        </div>

        <div style={{ position: "sticky", top: 16 }}>
          <DdBox title="Kiểm tra trước khi tạo">
            {[
              { ok: !!cus, t: "Đã chọn khách hàng từ module KD" },
              { ok: !!qtyOk, t: isCont ? "Danh sách container hợp lệ" : "Có tên hàng, đơn vị tính & khối lượng" },
              { ok: !!f.from && !!f.to && (!fromD || !toD || ddD(fromD) <= ddD(toD)), t: "Thời gian hợp lệ" },
            ].map(c => (
              <div key={c.t} style={{ display: "flex", gap: 9, alignItems: "center", padding: "5px 0", fontSize: 12.5 }}>
                <span style={{ width: 18, height: 18, borderRadius: 999, display: "grid", placeItems: "center", background: c.ok ? "var(--st-success-bg)" : "var(--bg-sunken)", color: c.ok ? "var(--st-success)" : "var(--t-tertiary)" }}><Icon name="check" size={10}/></span>{c.t}
              </div>
            ))}
            {cus && <div style={{ display: "flex", gap: 9, alignItems: "center", padding: "5px 0", fontSize: 12.5 }}>
              <span style={{ width: 18, height: 18, borderRadius: 999, display: "grid", placeItems: "center", background: f.contract ? "var(--st-success-bg)" : "var(--st-warning-bg)", color: f.contract ? "var(--st-success)" : "var(--st-warning)" }}><Icon name={f.contract ? "check" : "alert"} size={10}/></span>
              {f.contract ? `Gắn ${f.contract}` : "Chưa có HĐ — sẽ báo NV KD"}
            </div>}
            {dup.length > 0 && (
              <div style={{ marginTop: 10, padding: "9px 11px", borderRadius: "var(--r-sm)", background: "var(--st-warning-bg)", fontSize: 12, lineHeight: 1.55 }}>
                <b>Có thể trùng job:</b> {dup.map(j => `${j.id} (${j.from.slice(0, 5)}–${j.to.slice(0, 5)})`).join(", ")} cùng KH, cùng dịch vụ, trùng thời gian. Kiểm tra lại trước khi tạo.
              </div>
            )}
            <button className="btn primary" style={{ width: "100%", marginTop: 14 }} disabled={!valid} onClick={save}><Icon name="check" size={13}/> Tạo kế hoạch job</button>
            <div className="muted" style={{ fontSize: 11.5, marginTop: 8 }}>Sau khi tạo, KHTH ra lệnh làm việc ca cho job ở màn Lệnh làm việc ca.</div>
          </DdBox>
        </div>
      </div>
      <KdToast text={toast} />
    </div>
  );
};

/* ================= CHI TIẾT JOB ================= */
const DdJobDetailScreen = ({ go, ctx }) => {
  const j = DD_JOBS.find(x => x.id === ctx?.id) || DD_JOBS[0];
  const [, force] = React.useState(0);
  const [pick, setPick] = React.useState("");
  const [exMode, setExMode] = React.useState(false);
  const [exReason, setExReason] = React.useState("");
  const [orderModal, setOrderModal] = React.useState(null);
  const [toast, flash] = useKdToast();
  React.useEffect(() => { if (ctx?.toast) flash(ctx.toast); }, []);
  const refresh = () => force(x => x + 1);
  const log = (text, by = DD_ME.id) => j.log.unshift({ at: ddNow(), by, text });
  const cus = ddCus(j.customer);
  const ct = j.contract && (window.KD_CONTRACTS || []).find(k => k.id === j.contract);
  const contracts = ddActiveContracts(j.customer);
  const kdOwner = window.kdPerson ? kdPerson(j.kdNotify?.to || cus.owner) : { name: "NV KD" };
  const orders = DD_ORDERS.filter(o => o.job === j.id).sort((a, b) => ddD(b.date) - ddD(a.date) || b.shift - a.shift);
  const step = { planned: 0, running: 1, done: 2, pendingEx: 2, closed: 4, cancelled: 0 }[j.status];
  const [panel, setPanel] = React.useState(null);
  const [why, setWhy] = React.useState("");
  const [closeAs, setCloseAs] = React.useState("Khách huỷ");
  const [extTo, setExtTo] = React.useState("");
  const [addText, setAddText] = React.useState("");
  const [addDir, setAddDir] = React.useState(null);
  const live = ["planned", "running"].includes(j.status);
  const hasRec = ddJobHasRec(j);
  const overdue = live && ddD(j.to) < ddD(ddToday());
  const left = j.kind === "cont" ? j.conts.filter(c => !ddContDone(c, j) && !c.closedAs) : [];
  const addParsed = addText.split(/\n/).map(x => x.replace(/\r/g, "")).filter(x => x.trim() && !ddIsHeaderLine(x)).map(line => { const sec = addDir || j.contDir; const p = ddParseCont(line); const c = ddContCheck(p.no); if (!c.ok && /^Sai số kiểm tra/.test(c.why || "")) { c.ok = true; c.warn = c.why; } const dir = p.dirTok || sec; if (c.ok && j.conts.some(x => x.no === c.no)) { c.ok = false; c.why = "Đã có trong job"; } const busy = c.ok && ddContBusy(c.no, dir, j.id); if (busy) { c.ok = false; c.why = `Đang thuộc ${busy}`; } if (c.ok && dir !== "import" && !p.dest) { c.ok = false; c.why = "Thiếu cảng đích (cont xuất)"; } return { ...c, dir, type: p.type || "40GP", iso: p.iso, fe: p.fe || "F", wt: p.wt, dest: p.dest, seal: p.seal, line: p.line }; });

  const info = [
    { l: "Khách hàng", v: <span><b style={{ fontWeight: 500 }}>{cus.name}</b><div className="muted" style={{ fontSize: 11.5 }}>NV KD: {kdOwner.name}</div></span> },
    { l: "Dịch vụ", v: <span style={{ display: "inline-flex", gap: 6, alignItems: "center" }}><Icon name={ddSvc(j.service).icon} size={13}/>{ddSvc(j.service).label}</span> },
    { l: j.kind === "cont" ? "Container" : "Hàng · đơn vị", v: j.kind === "cont" ? (j.conts.length ? `${ddDirLabel(j)} · ${j.conts.length} cont` : `Dự kiến ${ddDirProgress(j).map(x => `${x.total} ${DD_DIR_SHORT[x.k]}`).join(" · ") || (j.expect || j.plan) + " cont"} · chưa có danh sách`) : `${j.cargo} · ${ddUnit(j)} · ${DD_MEASURE[ddMeasure(j)]}` },
    { l: "Mã đăng nhập tài xế", v: <DdJobCodes j={j} onChange={(m) => { refresh(); if (m) flash(m); }} /> },
    { l: "Thời gian dừng do sự cố", v: <DdJobDown j={j} go={go} /> },
    { l: "Thời gian", v: <span className="mono">{j.from} → {j.to}</span> },
    { l: "Vị trí", v: ddLoc(j) },
    { l: "Tàu / phương tiện KH", v: j.vessel },
    { l: "KHTH phụ trách", v: ddPerson(j.owner).name },
    { l: "Ghi chú", v: j.note || "—" },
  ];
  const jCalls = (window.DD_CALLS || []).filter(c => c.job === j.id);
  if (jCalls.length) info.push({ l: "Lượt cập sà lan", v: <span className="mono" style={{ fontSize: 12 }}>{jCalls.map(c => `${c.id} (${c.barge}, ${c.berth})`).join(" · ")}</span> });
  const khoTx = ddKhoTxOfJob(j.id);
  if (khoTx.length) info.push({ l: "Phiếu kho gắn job", v: <span><span className="mono">{khoTx.map(t => t.no).join(", ")}</span><div className="muted" style={{ fontSize: 11.5 }}>Nhập {tlFmt(khoTx.filter(t => t.type === "IN").reduce((x, t) => x + t.qty, 0))} t · Xuất {tlFmt(khoTx.filter(t => t.type === "OUT").reduce((x, t) => x + t.qty, 0))} t — từ ứng dụng Kho</div></span> });

  return (
    <div className="page" style={{ paddingTop: 24, maxWidth: 1320 }}>
      <div style={{ marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
        <button className="btn ghost btn-sm" onClick={() => go("dd-jobs")}>← Kế hoạch job</button>
        <div className="muted" style={{ fontSize: 12, marginLeft: 6 }}>Kế hoạch job / <span className="mono">{j.id}</span></div>
      </div>

      <div className="card" style={{ marginBottom: 18 }}>
        <div style={{ padding: "20px 24px 16px" }}>
          <div className="row" style={{ gap: 8, marginBottom: 8, flexWrap: "wrap" }}>
            <span className="tag">{j.id}</span><DdBadge map={DD_JOB_STATUS} s={j.status} />{!j.contract && <DdNoHd job={j} />}
            <div style={{ flex: 1 }}></div>
            {j.status === "planned" && <span className="muted" style={{ fontSize: 11.5 }}>Tự chuyển Đang thực hiện khi tally ghi nhận lần đầu</span>}
            {live && <button className="btn btn-sm" onClick={() => { setPanel(panel === "ext" ? null : "ext"); setExtTo(""); }}><Icon name="schedule" size={12}/> Gia hạn</button>}
            {j.status === "running" && j.kind !== "cont" && <button className="btn btn-sm" onClick={() => { j.status = "done"; log("Đánh dấu hoàn thành · mã tài xế hết hiệu lực"); refresh(); flash("Job hoàn thành — chờ chốt sản lượng"); }}><Icon name="check" size={12}/> Đánh dấu hoàn thành</button>}
            {j.status === "running" && j.kind === "cont" && left.length > 0 && <button className="btn btn-sm" onClick={() => { setPanel(panel === "early" ? null : "early"); setWhy(""); }}><Icon name="check" size={12}/> Đóng sớm</button>}
            {live && <button className="btn btn-sm" style={{ color: "var(--st-danger)" }} disabled={hasRec} title={hasRec ? "Job đã có ghi nhận của tally — chỉ Trưởng phòng được huỷ" : ""} onClick={() => { setPanel(panel === "cancel" ? null : "cancel"); setWhy(""); }}><Icon name="x" size={12}/> Huỷ job</button>}
          </div>
          <h1 style={{ margin: "0 0 14px", fontSize: 21, fontWeight: 700 }}>{ddCusShort(j.customer)} · {j.cargo}</h1>
          {j.status === "cancelled" && <div className="notice danger" style={{ marginBottom: 12, padding: "10px 12px", borderRadius: 8, background: "var(--st-danger-bg)", fontSize: 12.5 }}>Job đã huỷ{j.cancelReason ? ` · lý do: ${j.cancelReason}` : ""}. Lệnh ca chưa làm đã huỷ, mã tài xế hết hiệu lực.</div>}
          {overdue && panel !== "ext" && <div style={{ marginBottom: 12, padding: "10px 12px", borderRadius: 8, background: "var(--st-warning-bg)", fontSize: 12.5 }}>Đã quá ngày kết thúc kế hoạch ({j.to}). KHTH gia hạn hoặc {j.kind === "cont" ? "đóng sớm" : "đánh dấu hoàn thành"} — hệ thống nhắc mỗi ngày, không tự gia hạn.</div>}
          {panel && (
            <div style={{ marginBottom: 14, padding: 12, border: "1px solid var(--line)", borderRadius: 8, background: "var(--bg-canvas)", fontSize: 12.5 }}>
              {panel === "ext" && <div className="row" style={{ gap: 8, flexWrap: "wrap" }}><b>Gia hạn đến ngày</b><input className="input" type="date" style={{ width: 160, height: 30 }} value={extTo} onChange={e => setExtTo(e.target.value)} />
                <button className="btn primary btn-sm" disabled={!extTo || ddD(ddFromIso(extTo)) <= ddD(j.to)} onClick={() => { const nt = ddFromIso(extTo); log(`Gia hạn: ${j.to} → ${nt}`); j.to = nt; setPanel(null); refresh(); flash(`Đã gia hạn đến ${nt}`); }}>Lưu</button><button className="btn btn-sm ghost" onClick={() => setPanel(null)}>Thôi</button></div>}
              {panel === "early" && <div><b>Đóng sớm job</b> · còn {left.length} cont chưa làm<div className="row" style={{ gap: 8, marginTop: 8, flexWrap: "wrap" }}>
                <span>Lý do cho cont còn lại</span><select className="select" style={{ width: 170, height: 30 }} value={closeAs} onChange={e => setCloseAs(e.target.value)}><option>Khách huỷ</option><option>Chuyển job khác</option></select>
                <input className="input" style={{ flex: 1, minWidth: 180, height: 30 }} value={why} onChange={e => setWhy(e.target.value)} placeholder="Ghi chú (bắt buộc)" />
                <button className="btn primary btn-sm" disabled={!why.trim()} onClick={() => { left.forEach(c => c.closedAs = closeAs); j.status = "done"; log(`Đóng sớm · ${left.length} cont "${closeAs}": ${why.trim()} · mã tài xế hết hiệu lực`); setPanel(null); refresh(); flash("Đã đóng sớm — chờ chốt sản lượng"); }}>Đóng sớm</button></div></div>}
              {panel === "cancel" && <div><b>Huỷ job</b> · lệnh ca chưa làm sẽ huỷ, mã tài xế hết hiệu lực ngay<div className="row" style={{ gap: 8, marginTop: 8 }}>
                <input className="input" style={{ flex: 1, height: 30 }} value={why} onChange={e => setWhy(e.target.value)} placeholder="Lý do huỷ (bắt buộc)" />
                <button className="btn btn-sm" style={{ background: "var(--st-danger)", color: "#fff" }} disabled={!why.trim()} onClick={() => { j.status = "cancelled"; j.cancelReason = why.trim(); const os = orders.filter(o => o.status !== "done"); os.forEach(o => { o.status = "cancelled"; o.log.unshift({ at: ddNow(), by: DD_ME.id, text: `Huỷ theo job ${j.id}` }); }); log(`Huỷ job: ${why.trim()} · huỷ ${os.length} lệnh ca · mã tài xế hết hiệu lực`); setPanel(null); refresh(); flash(`Đã huỷ ${j.id}`); }}>Xác nhận huỷ</button></div></div>}
            </div>
          )}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px 18px", fontSize: 13 }}>
            {info.map(x => <div key={x.l} style={{ minWidth: 0 }}><div className="muted" style={{ fontSize: 11.5 }}>{x.l}</div><div style={{ marginTop: 3 }}>{x.v}</div></div>)}
          </div>
        </div>
        <div style={{ borderTop: "1px solid var(--line)", padding: "14px 24px", display: "grid", gridTemplateColumns: "minmax(0,1fr) 300px", gap: 24, alignItems: "center" }}>
          <KdStepper steps={["Kế hoạch", "Đang thực hiện", "Hoàn thành", "Chốt & bàn giao KT"]} current={step} />
          <DdProgress job={j} />
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) 360px", gap: 20, alignItems: "start" }}>
        <div style={{ minWidth: 0 }}>
          <div className="card" style={{ marginBottom: 18 }}>
            <div className="card-head">
              <div><h3>Lệnh làm việc ca</h3><div className="sub">{orders.length} lệnh · sản lượng thực tế cập nhật từ app tally</div></div>
              {["planned", "running"].includes(j.status) && <button className="btn btn-sm accent" onClick={() => setOrderModal({ job: j.id })}><Icon name="plus" size={13}/> Tạo lệnh ca</button>}
            </div>
            {orders.length === 0 ? <div className="muted" style={{ padding: "24px", textAlign: "center", fontSize: 13 }}>Chưa có lệnh ca nào cho job này.</div> : (
              <div className="tbl-wrap"><table className="tbl">
                <thead><tr><th style={{ width: 110 }}>Lệnh</th><th style={{ width: 130 }}>Ngày · Ca</th><th>Tổ tally</th><th>Thiết bị · Phương tiện</th><th style={{ width: 100, textAlign: "right" }}>Mục tiêu</th><th style={{ width: 130 }}>Trạng thái</th></tr></thead>
                <tbody>
                  {orders.map(o => (
                    <tr key={o.id} style={{ cursor: "pointer" }} onClick={() => setOrderModal({ id: o.id })}>
                      <td className="mono" style={{ fontSize: 12 }}>{o.id}</td>
                      <td style={{ fontSize: 12.5 }}><span className="mono">{o.date.slice(0, 5)}</span> · {DD_SHIFTS[o.shift - 1].label}</td>
                      <td><div style={{ display: "flex" }}>{o.tally.map((t, i) => <span key={t} style={{ marginLeft: i ? -6 : 0 }}><Avatar person={ddPerson(t)} size={22} /></span>)}</div></td>
                      <td style={{ fontSize: 12 }}>{o.equip.join(", ")}<div className="muted" style={{ fontSize: 11 }}>{(o.vehicles || []).join(", ") || "—"}</div></td>
                      <td className="mono" style={{ textAlign: "right", fontSize: 12 }}>{ddNum(o.target)}</td>
                      <td><DdBadge map={DD_ORDER_STATUS} s={o.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table></div>
            )}
          </div>

          {j.kind === "cont" && (
            <div className="card" style={{ marginBottom: 18 }}>
              <div className="card-head"><div><h3>Danh sách container</h3><div className="sub">Nhập: xong khi gate in · xuất: xong khi gate out · KHTH đổi được hướng cont chưa gate</div></div></div>
              <div style={{ display: "flex", gap: 10, padding: "0 16px 12px", flexWrap: "wrap" }}>{ddDirProgress(j).map(x => <div key={x.k} style={{ flex: "1 1 180px", border: "1px solid var(--line)", borderRadius: "var(--r-sm)", padding: "8px 12px" }}><div style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5 }}><b>{DD_CONT_DIR[x.k]}</b><span className="mono">{x.done}/{x.total}</span></div><div style={{ height: 5, background: "var(--bg-sunken)", borderRadius: 3, marginTop: 6, overflow: "hidden" }}><div style={{ width: `${x.total ? Math.round(x.done / x.total * 100) : 0}%`, height: "100%", background: "var(--brand-ink)" }}></div></div>{x.exp > x.n && <div className="muted" style={{ fontSize: 11, marginTop: 4 }}>còn thiếu {x.exp - x.n} cont trong danh sách</div>}</div>)}</div>
              <div className="tbl-wrap" style={{ maxHeight: 320, overflowY: "auto" }}><table className="tbl">
                <thead><tr><th>Số cont</th><th style={{ width: 80 }}>Loại</th><th style={{ width: 54 }}>F/E</th><th style={{ width: 74 }}>Cảng đích</th><th style={{ width: 118 }}>Hướng</th><th>Xe</th><th style={{ width: 96 }}>Gate · tally</th><th style={{ width: 104 }}>Trạng thái</th></tr></thead>
                <tbody>{j.conts.map(c => (
                  <tr key={c.no}>
                    <td className="mono" style={{ fontSize: 12.5, fontWeight: 600 }}>{c.no.slice(0, 4)} {c.no.slice(4, 10)} {c.no.slice(10)}{c.fe === "F" && live && !c.gin && !c.gout ? <input className="input mono" style={{ display: "block", marginTop: 3, height: 24, fontSize: 11, width: 118, fontWeight: 400, borderColor: c.seal ? undefined : "var(--st-warning)" }} defaultValue={c.seal || ""} placeholder="số seal (FCL)" onBlur={e => { const v = e.target.value.trim().toUpperCase(); if (v === (c.seal || "")) return; log(`Seal ${c.no}: ${c.seal || "—"} → ${v || "—"}`); c.seal = v || null; refresh(); }} /> : c.seal && <div className="muted" style={{ fontSize: 11, fontWeight: 400 }}>seal {c.seal}</div>}{c.sealMismatch && <div style={{ fontSize: 11, fontWeight: 400, color: "var(--st-warning)" }}>khác kế hoạch ({c.sealPlan})</div>}</td><td style={{ fontSize: 12 }}>{c.type}<div className="muted" style={{ fontSize: 11 }}>{c.line || j.line || "—"}</div></td><td style={{ fontSize: 12 }}>{c.fe === "F" ? "FCL" : "MTY"}{c.wt ? <div className="muted mono" style={{ fontSize: 11 }}>{c.wt} t</div> : null}</td>
                    <td>{live && !c.gout ? <input className="input mono" style={{ height: 26, fontSize: 11.5, width: 60, borderColor: ddCDir(c, j) !== "import" && !c.dest ? "var(--st-danger)" : undefined }} defaultValue={c.dest || ""} placeholder={ddCDir(c, j) === "import" ? "thêm sau" : "bắt buộc"} onBlur={e => { const v = e.target.value.trim().toUpperCase(); if (v === (c.dest || "")) return; log(`Cảng đích ${c.no}: ${c.dest || "—"} → ${v || "—"}`); c.dest = v || null; refresh(); }} /> : <span className="mono" style={{ fontSize: 12 }}>{c.dest || "—"}</span>}</td>
                    <td>{c.gin || c.gout || j.status === "closed" ? <span style={{ fontSize: 12 }}>{DD_DIR_SHORT[ddCDir(c, j)]}</span> : <select className="select" style={{ height: 26, fontSize: 11.5, width: 108 }} disabled={!live} value={ddCDir(c, j)} onChange={e => { const from = ddCDir(c, j); c.dir = e.target.value; (j.log = j.log || []).unshift({ at: ddNow(), by: DD_ME.id, text: `Đổi hướng ${c.no}: ${DD_DIR_SHORT[from]} → ${DD_DIR_SHORT[c.dir]}` }); force(x => x + 1); }}>{Object.entries(DD_DIR_SHORT).map(([k, l]) => <option key={k} value={k}>{l}</option>)}</select>}</td>
                    <td className="mono" style={{ fontSize: 12 }}>{c.truck || c.drvTruck || "—"}{c.drvPhoto ? <> <DdPhoto path={c.drvPhoto} inline label="📷" /></> : ""}</td>
                    <td style={{ fontSize: 11.5 }}>{[c.gin && "In ✓", c.gout && "Out ✓"].filter(Boolean).join(" · ") || "—"}{c.by && <div className="muted" style={{ fontSize: 11 }}>{ddPerson(c.by).short} · {c.at}</div>}</td>
                    <td>{c.closedAs ? <span className="badge neutral">{c.closedAs}</span> : c.status === "done" ? <span className="badge success">{ddContGate(c, j) === "in" ? "Đã gate in" : "Đã gate out"}</span> : c.notInPort ? <span className="badge warning">Chưa gate in</span> : <span className="badge neutral">Chờ</span>}</td>
                  </tr>))}</tbody>
              </table></div>
              {!j.conts.length && <div className="muted" style={{ padding: "12px 16px", fontSize: 12.5 }}>Chưa có danh sách cont (dự kiến {j.expect || j.plan} cont). Bổ sung trước khi gửi lệnh ca.</div>}
              {live && <div style={{ padding: "12px 16px", borderTop: "1px solid var(--line)" }}>
                <div style={{ fontSize: 12.5, fontWeight: 600, marginBottom: 6 }}>Thêm cont vào job</div>
                <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr)", gap: 12, alignItems: "start" }}>
                  <textarea className="textarea mono" rows={3} style={{ fontSize: 12 }} value={addText} onChange={e => setAddText(e.target.value)} placeholder="Mỗi dòng 1 cont" />
                  <div><div className="muted" style={{ fontSize: 11.5, marginBottom: 4 }}>Hướng của các cont thêm</div><div className="seg-bar">{DD_DIR_ORDER.map(k => <button key={k} className={(addDir || j.contDir) === k ? "on" : ""} onClick={() => setAddDir(k)}>{DD_DIR_SHORT[k]}</button>)}</div></div>
                </div>
                {addParsed.length > 0 && <div style={{ fontSize: 12, marginTop: 6 }}>{addParsed.map((c, i) => <span key={i} style={{ marginRight: 12 }}><span className="mono">{c.no}</span> {c.ok ? <span style={{ color: c.warn ? "var(--st-warning)" : "var(--st-success)" }}>{c.warn ? "cảnh báo số kiểm tra" : "hợp lệ"} · {DD_DIR_SHORT[c.dir]}</span> : <span style={{ color: "var(--st-danger)" }}>{c.why}</span>}</span>)}</div>}
                <button className="btn primary btn-sm" style={{ marginTop: 8 }} disabled={!addParsed.length || addParsed.some(c => !c.ok)} onClick={() => { addParsed.forEach(c => j.conts.push({ no: c.no, type: c.type, iso: c.iso || null, fe: c.fe, wt: c.wt || null, dest: c.dest || null, seal: c.seal || null, dir: c.dir, line: c.line || j.line || null, status: "pending", warn: c.warn || null })); j.plan = Math.max(j.conts.length, j.expect || 0); log(`Thêm ${addParsed.length} cont: ${DD_DIR_ORDER.map(k => [k, addParsed.filter(c => c.dir === k).length]).filter(x => x[1]).map(([k, n]) => `${n} ${DD_DIR_SHORT[k]}`).join(", ")}`); setAddText(""); refresh(); flash(`Đã thêm ${addParsed.length} cont`); }}>Thêm {addParsed.length || ""} cont</button>
              </div>}
            </div>
          )}

          <div className="card">
            <div className="card-head"><h3>Nhật ký job</h3></div>
            <div className="card-body">
              {j.log.map((l, i) => (
                <div key={i} style={{ padding: "8px 0", borderTop: i ? "1px solid var(--line)" : "none" }}>
                  <div style={{ fontSize: 12.5 }}>{l.text}</div>
                  <div className="muted" style={{ fontSize: 11 }}>{ddPerson(l.by).name} · <span className="mono">{l.at}</span></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div className="card">
            <div className="card-head"><h3>Hợp đồng</h3>{j.contract ? <span className="badge success">Đã gắn</span> : <DdNoHd job={j} />}</div>
            <div className="card-body" style={{ fontSize: 12.5, lineHeight: 1.6 }}>
              {ct ? (
                <>
                  <span className="mono">{ct.id}</span><div style={{ fontWeight: 500 }}>{ct.title}</div>
                  <div className="muted">Hiệu lực {ct.from} → {ct.to} · {(KD_CONTRACT_STATUS[ct.status] || {}).label}</div>
                  <div className="muted" style={{ fontSize: 11.5, marginTop: 6 }}>Tra cứu từ module Kinh doanh.</div>
                </>
              ) : (
                <>
                  <div>Job đang chạy khi chưa có hợp đồng.{j.quote && <> Căn cứ tạm: <span className="mono">{j.quote}</span> (báo giá KH đã chấp nhận).</>}</div>
                  {j.kdNotify && <div className="muted" style={{ marginTop: 6 }}>Đã báo <b>{kdOwner.name}</b> lúc {j.kdNotify.at}{j.kdNotify.times > 1 ? ` · đã nhắc ${j.kdNotify.times} lần` : ""}.</div>}
                  <div className="field" style={{ marginTop: 10, marginBottom: 8 }}><label>Gắn hợp đồng đang hiệu lực</label>
                    <select className="select" value={pick} onChange={e => setPick(e.target.value)}>
                      <option value="">{contracts.length ? "— Chọn hợp đồng —" : "KD chưa lưu hợp đồng nào"}</option>
                      {contracts.map(k => <option key={k.id} value={k.id}>{k.id} · {k.title}</option>)}
                    </select>
                  </div>
                  <div className="row" style={{ gap: 8 }}>
                    <button className="btn btn-sm" style={{ flex: 1 }} onClick={() => { j.kdNotify = { to: j.kdNotify?.to || cus.owner, at: ddNow(), times: (j.kdNotify?.times || 0) + 1 }; log(`Nhắc NV KD ${kdOwner.name} bổ sung HĐ`); refresh(); flash(`Đã nhắc ${kdOwner.name}`); }}><Icon name="bell" size={12}/> Nhắc NV KD</button>
                    <button className="btn btn-sm primary" style={{ flex: 1 }} disabled={!pick} onClick={() => { j.contract = pick; log(`Gắn hợp đồng ${pick} — bỏ nhãn Chưa có HĐ`); setPick(""); refresh(); flash(`Đã gắn ${pick}`); }}>Gắn HĐ</button>
                  </div>
                </>
              )}
            </div>
          </div>

          {["done", "pendingEx", "closed"].includes(j.status) && (
            <div className="card">
              <div className="card-head"><h3>Chốt sản lượng</h3><DdBadge map={DD_JOB_STATUS} s={j.status} /></div>
              <div className="card-body" style={{ fontSize: 12.5, lineHeight: 1.6 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}><span className="muted">Sản lượng thực tế</span><b className="mono">{ddNum(j.actual)} {ddUnit(j)}</b></div>
                {j.kind === "cont" && (() => { const rows = DD_DIR_ORDER.map(k => { const cs = j.conts.filter(c => ddCDir(c, j) === k && !c.closedAs && ddContDone(c, j)); return { k, n: cs.length, teu: cs.reduce((t, c) => t + (String(c.type).startsWith("4") ? 2 : 1), 0), wt: cs.reduce((t, c) => t + (c.wt || 0), 0), fcl: cs.filter(c => c.fe === "F").length }; }).filter(r => r.n); return rows.length ? (
                  <div style={{ marginBottom: 10, border: "1px solid var(--line)", borderRadius: "var(--r-sm)" }}><div className="muted" style={{ fontSize: 11.5, padding: "6px 10px", borderBottom: "1px solid var(--line)" }}>Bàn giao theo hướng</div>
                    {rows.map(r => <div key={r.k} style={{ padding: "6px 10px", borderTop: "1px dashed var(--line)" }}><div style={{ display: "flex", justifyContent: "space-between" }}><b>{DD_DIR_SHORT[r.k]}</b><span className="mono">{r.n} cont · {r.teu} TEU</span></div><div className="muted" style={{ display: "flex", justifyContent: "space-between", fontSize: 11.5 }}><span>{r.fcl} FCL · {r.n - r.fcl} MTY</span><span className="mono">{ddNum(Math.round(r.wt * 10) / 10)} t</span></div></div>)}</div>) : null; })()}
                {j.kind === "cont" && j.conts.some(c => c.closedAs) && <div className="muted" style={{ fontSize: 11.5, marginBottom: 8 }}>Không tính {j.conts.filter(c => c.closedAs).length} cont đóng sớm.</div>}
                {j.status === "done" && j.contract && (
                  <button className="btn primary" style={{ width: "100%" }} onClick={() => { j.status = "closed"; log("Chốt sản lượng & bàn giao Kế toán"); refresh(); flash("Đã chốt & bàn giao Kế toán"); }}><Icon name="check" size={13}/> Chốt & bàn giao Kế toán</button>
                )}
                {j.status === "done" && !j.contract && !exMode && (
                  <>
                    <div style={{ padding: "8px 10px", borderRadius: "var(--r-sm)", background: "var(--st-danger-bg, #FDECEC)", marginBottom: 10 }}>Chưa gắn hợp đồng nên chưa bàn giao Kế toán được. Gắn HĐ ở khung trên, hoặc xin Trưởng phòng duyệt ngoại lệ.</div>
                    <button className="btn primary" style={{ width: "100%" }} disabled>Chốt & bàn giao Kế toán</button>
                    <button className="btn" style={{ width: "100%", marginTop: 8 }} onClick={() => setExMode(true)}>Xin Trưởng phòng duyệt ngoại lệ</button>
                  </>
                )}
                {exMode && (
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    <label style={{ fontWeight: 500 }}>Lý do bàn giao khi chưa có HĐ <span className="req">*</span></label>
                    <textarea className="textarea" rows={3} value={exReason} onChange={e => setExReason(e.target.value)} placeholder="VD: KH yêu cầu xuất hoá đơn trong tháng; HĐ khung đang chờ KH ký." />
                    <div className="row" style={{ gap: 8, justifyContent: "flex-end" }}>
                      <button className="btn ghost btn-sm" onClick={() => setExMode(false)}>Huỷ</button>
                      <button className="btn primary btn-sm" disabled={!exReason.trim()} onClick={() => { j.status = "pendingEx"; j.exReason = exReason.trim(); j.exAt = ddNow(); log(`Xin ${DD_HEAD.name} duyệt ngoại lệ: ${exReason.trim()}`); setExMode(false); refresh(); flash(`Đã gửi ${DD_HEAD.name} duyệt`); }}>Gửi duyệt</button>
                    </div>
                  </div>
                )}
                {j.status === "pendingEx" && (
                  <>
                    <div>Đang chờ <b>{DD_HEAD.name}</b> duyệt ngoại lệ.<div className="muted">Lý do: {j.exReason}</div></div>
                    {ddCan("TP") ? <button className="btn primary btn-sm" style={{ width: "100%", marginTop: 10 }} onClick={() => { j.status = "closed"; j.exApproved = true; log("Duyệt ngoại lệ — chốt & bàn giao Kế toán khi chưa có HĐ", DD_ME.id); refresh(); flash("Đã duyệt — đã bàn giao Kế toán"); }}>Duyệt ngoại lệ</button> : <div className="muted" style={{ marginTop: 8 }}>Trưởng phòng duyệt ở màn Chờ duyệt › Ngoại lệ.</div>}
                  </>
                )}
                {j.status === "closed" && <div style={{ color: "var(--st-success)" }}><Icon name="check" size={12}/> Đã bàn giao Kế toán{j.exApproved ? " (ngoại lệ, chưa có HĐ)" : ""}.</div>}
              </div>
            </div>
          )}
        </div>
      </div>

      {orderModal && <DdOrderModal init={orderModal} onClose={() => setOrderModal(null)} onSaved={(m) => { setOrderModal(null); refresh(); flash(m); }} />}
      <KdToast text={toast} />
    </div>
  );
};

/* ================= LỆNH LÀM VIỆC CA — FORM ================= */
const DdOrderModal = ({ init, onClose, onSaved }) => {
  const existing = init.id && DD_ORDERS.find(o => o.id === init.id);
  const openJobs = DD_JOBS.filter(j => ["planned", "running"].includes(j.status) || (existing && j.id === existing.job));
  const [f, setF] = React.useState(existing ? { ...existing, tally: [...existing.tally], equip: [...existing.equip], vehicles: [...(existing.vehicles || [])] } : {
    job: init.job || openJobs[0]?.id || "", date: init.date || ddToday(), shift: init.shift || (init.date ? 1 : 2), tally: [ddTallyAcc(DD_JOBS.find(j => j.id === (init.job || openJobs[0]?.id)), init.shift || (init.date ? 1 : 2))], equip: [], vehicles: [], target: 0, note: "", status: "draft", ack: [],
  });
  const [reason, setReason] = React.useState("");
  const [vText, setVText] = React.useState(() => (existing?.vehicles || []).map(ddVehLine).join("\n"));
  const set = (k, v) => setF(s => ({ ...s, [k]: v }));
  const setVeh = (t) => { setVText(t); setF(s => ({ ...s, vehicles: ddVehParse(t).map(x => x.plate) })); };
  const job = DD_JOBS.find(j => j.id === f.job);
  const svc = job ? job.service : "bp";
  const tallyPool = DD_TALLY_ACCS.filter(p => p.svc === ddTallySvc(job) && p.active);
  const others = DD_TALLY_ACCS.filter(p => !tallyPool.includes(p) && p.active);
  const week = Array.from({ length: 7 }, (_, i) => { const d = ddD(ddToday()); d.setDate(d.getDate() + i); return ddFmt(d); }); /* hôm nay + 6 ngày */
  if (init.date && !week.includes(init.date)) week.unshift(init.date); /* sửa lệnh của ngày đã qua */
  const busy = f.tally.filter(t => (DD_PEOPLE.find(p => p.id === t) || {}).shift && ddPerson(t).shift !== f.shift); /* tài khoản khác ca với lệnh */
  const sentEdit = existing && existing.status !== "draft";
  const changed = existing && JSON.stringify({ ...existing, log: 0, ack: 0, status: 0 }) !== JSON.stringify({ ...f, log: 0, ack: 0, status: 0 });
  const noConts = job && job.kind === "cont" && !job.conts.length;
  const valid = job && f.tally.length > 0 && f.target > 0 && (!sentEdit || !changed || reason.trim());
  const toggle = (k, v) => set(k, f[k].includes(v) ? f[k].filter(x => x !== v) : [...f[k], v]);
  const locked = existing && existing.status === "done";

  const diff = () => {
    const out = [];
    if (existing.date !== f.date || existing.shift !== f.shift) out.push(`ngày/ca ${existing.date.slice(0, 5)} ${DD_SHIFTS[existing.shift - 1].label} → ${f.date.slice(0, 5)} ${DD_SHIFTS[f.shift - 1].label}`);
    const add = f.tally.filter(t => !existing.tally.includes(t)), rm = existing.tally.filter(t => !f.tally.includes(t));
    if (add.length || rm.length) out.push(`tally ${rm.map(t => "−" + ddPerson(t).short).concat(add.map(t => "+" + ddPerson(t).short)).join(" ")}`);
    if (existing.target !== f.target) out.push(`mục tiêu ${ddNum(existing.target)} → ${ddNum(f.target)}`);
    if (JSON.stringify(existing.equip) !== JSON.stringify(f.equip)) out.push("thiết bị");
    if (JSON.stringify(existing.vehicles) !== JSON.stringify(f.vehicles)) out.push(`phương tiện ${f.vehicles.join(", ") || "—"}`);
    if (existing.note !== f.note) out.push("chỉ dẫn");
    return out.join("; ");
  };
  const save = (send) => {
    ddVehRegister(ddVehParse(vText), ddVehKinds(job)[0]);
    if (existing) {
      const d = diff();
      Object.assign(existing, { ...f, status: send && existing.status === "draft" ? "sent" : existing.status });
      if (existing.status !== "draft" && !existing.drvCode) existing.drvCode = ddDrvCode(existing.id + Date.now());
      if (sentEdit && d) { existing.ack = []; existing.log.unshift({ at: ddNow(), by: DD_ME.id, text: `Sửa: ${d} · lý do: ${reason.trim()} · gửi lại thông báo tally` }); onSaved(`Đã sửa ${existing.id} & gửi lại thông báo tally`); return; }
      existing.log.unshift({ at: ddNow(), by: DD_ME.id, text: send ? `Gửi thông báo tài khoản ${f.tally.map(t => ddPerson(t).name).join(", ")}` : "Lưu nháp" });
      onSaved(send ? `Đã gửi ${existing.id} cho ${f.tally.map(t => ddPerson(t).name).join(", ")}` : "Đã lưu nháp");
      return;
    }
    const pre = `LV-${f.date.slice(0, 2)}${f.date.slice(3, 5)}${f.date.slice(-2)}-`; /* pilot: thêm 2 số năm để không trùng giữa các năm */
    const n = Math.max(0, ...DD_ORDERS.filter(o => o.id.startsWith(pre)).map(o => Number(o.id.slice(pre.length)) || 0)) + 1;
    const id = `${pre}${String(n).padStart(2, "0")}`;
    DD_ORDERS.push({ ...f, id, curEq: ddCranes(f)[0] || null, status: send ? "sent" : "draft", drvCode: send ? ddDrvCode(id + Date.now()) : null, ack: [], log: [{ at: ddNow(), by: DD_ME.id, text: send ? `Tạo lệnh & gửi tài khoản ${f.tally.map(t => ddPerson(t).name).join(", ")}` : "Tạo nháp" }] });
    /* v2.6: gửi lệnh ca không chuyển trạng thái job; job bắt đầu ở ghi nhận đầu tiên của tally (BR-DD-17) */
    onSaved(send ? `Đã tạo ${id} & gửi ${f.tally.map(t => ddPerson(t).name).join(", ")}` : `Đã lưu nháp ${id}`);
  };

  const Chip = ({ on, onClick, children, warn }) => (
    <button onClick={onClick} disabled={locked} style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 10px 4px 5px", borderRadius: 999, fontSize: 12.5, cursor: "pointer",
      border: `1px solid ${on ? (warn ? "var(--st-warning)" : "var(--brand-ink)") : "var(--line)"}`, background: on ? (warn ? "var(--st-warning-bg)" : "var(--bg-sunken)") : "var(--bg-surface)", fontWeight: on ? 600 : 400 }}>{children}</button>
  );

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" style={{ width: 760, maxHeight: "92vh", display: "flex", flexDirection: "column" }} onClick={e => e.stopPropagation()}>
        <div className="modal-head">
          <h3>{existing ? <>Lệnh ca <span className="mono">{existing.id}</span> <DdBadge map={DD_ORDER_STATUS} s={existing.status} /></> : "Tạo lệnh làm việc ca"}</h3>
          <button className="icon-btn" onClick={onClose}><Icon name="x" size={16}/></button>
        </div>
        <div className="modal-body" style={{ overflowY: "auto", display: "grid", gridTemplateColumns: "minmax(0,1fr)", gap: 2 }}>
          <div className="field"><label>Job <span className="req">*</span></label>
            <select className="select" value={f.job} disabled={!!existing || locked} onChange={e => { setVText(""); setF(s => ({ ...s, job: e.target.value, tally: [ddTallyAcc(DD_JOBS.find(j => j.id === e.target.value), s.shift)], vehicles: [] })); }}>
              {openJobs.map(j => <option key={j.id} value={j.id}>{j.id} · {ddCusShort(j.customer)} · {j.cargo} · {ddSvc(j.service).label}{j.contract ? "" : " · CHƯA CÓ HĐ"}</option>)}
            </select>
            {job && <div className="muted" style={{ fontSize: 11.5, marginTop: 4 }}>{ddLoc(job)} · {job.from} → {job.to} · còn lại {ddNum(Math.max(0, job.plan - job.actual))} {ddUnit(job)}</div>}
          </div>
          {job && (window.DD_CALLS || []).some(c => c.job === job.id && c.status !== "departed") && (
            <div className="field"><label>Lượt cập sà lan <span className="opt">— từ River gate; tự thêm cẩu và sà lan của lượt</span></label>
              <select className="select" value={f.call || ""} disabled={locked} onChange={e => { const c = DD_CALLS.find(x => x.id === e.target.value); setF(s => ({ ...s, call: e.target.value || null, equip: c ? [...new Set([...s.equip, ...(c.cranes || [])])] : s.equip, vehicles: c && ddVehKinds(job).includes("salan") ? [...new Set([...s.vehicles, c.barge])] : s.vehicles })); }}>
                <option value="">— Không gắn —</option>
                {DD_CALLS.filter(c => c.job === job.id && c.status !== "departed").map(c => <option key={c.id} value={c.id}>{c.id} · {c.barge} · {c.berth} · {c.eta[0].slice(0, 5)} {c.eta[1]} → {c.etd[0].slice(0, 5)} {c.etd[1]}</option>)}
              </select>
            </div>
          )}
          {job && job.kind === "cont" && !f.call && job.conts.some(c => ddCDir(c, job) !== "import" && !c.gout) && (
            <div style={{ fontSize: 12, padding: "8px 10px", marginBottom: 10, borderRadius: "var(--r-sm)", background: "var(--st-warning-bg)", border: "1px solid #F5D9A8" }}>
              <Icon name="alert" size={12}/> <b>Chưa gắn lượt cập sà lan.</b> Job có cont xuất lên sà lan; vẫn gửi được lệnh. Gate Out kênh sông sẽ vào mục "Chưa có lượt cập" ở River gate để KHTH gắn sau.
            </div>)}
          <div className="field-row">
            <div className="field"><label>Ngày</label>
              <select className="select" value={f.date} disabled={locked} onChange={e => set("date", e.target.value)}>{week.map(d => <option key={d} value={d}>{["CN", "T2", "T3", "T4", "T5", "T6", "T7"][ddD(d).getDay()]} · {d}</option>)}</select>
            </div>
            <div className="field"><label>Ca</label>
              <div className="seg-bar">{DD_SHIFTS.map(s => <button key={s.id} disabled={locked} className={f.shift === s.id ? "on" : ""} onClick={() => setF(x => ({ ...x, shift: s.id, tally: [ddTallyAcc(job, s.id), ...x.tally.filter(t => !t.startsWith(`tc-${ddTallySvc(job)}-`))] }))}>{s.label}</button>)}</div>
            </div>
          </div>
          <div className="field"><label>Tài khoản tally ca <span className="req">*</span> <span className="opt">— tự chọn theo ca & dịch vụ; người trực ca đăng nhập tài khoản này trên máy công ty hoặc máy cá nhân</span></label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {tallyPool.map(p => <Chip key={p.id} on={f.tally.includes(p.id)} warn={busy.includes(p.id)} onClick={() => toggle("tally", p.id)}><Avatar person={p} size={20} />{p.name}</Chip>)}
            </div>
            <details style={{ marginTop: 6 }}><summary className="muted" style={{ fontSize: 11.5, cursor: "pointer" }}>Giao thêm cho tài khoản ca khác</summary>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 6 }}>{others.map(p => <Chip key={p.id} on={f.tally.includes(p.id)} warn={busy.includes(p.id)} onClick={() => toggle("tally", p.id)}><Avatar person={p} size={20} />{p.name} <span className="muted" style={{ fontSize: 11 }}>· {p.role.replace("Tally · ", "")}</span></Chip>)}</div>
            </details>
            {busy.length > 0 && <div style={{ fontSize: 12, marginTop: 6, color: "var(--st-warning)" }}><Icon name="alert" size={12}/> {busy.map(t => ddPerson(t).name).join(", ")} không cùng ca với lệnh này.</div>}
          </div>
          {job && (() => { const vl = ddVehParse(vText); return (
            <div className="field"><label>Danh sách xe của ca <span className="opt">— nhà xe / KHTH cung cấp trước ca; mỗi dòng một biển số, có thể kèm tên nhà xe sau dấu "·"</span></label>
              <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr)", gap: 10, alignItems: "start" }}>
                <div>
                  <textarea className="textarea mono" rows={5} disabled={locked} value={vText} onChange={e => setVeh(e.target.value)} placeholder={job.service === "bp" ? "SL VNL-01\nSL HẢI ÂU 18 · Hải Âu" : "51C-888.21 · Vận tải Minh Phát\n43C-611.08"} style={{ fontSize: 12.5 }} />
                  <div className="row" style={{ gap: 8, marginTop: 6 }}>
                    <label className="btn btn-sm" style={{ cursor: locked ? "default" : "pointer" }}><Icon name="upload" size={12}/> Nhập từ Excel
                      <input type="file" accept=".xlsx,.xls,.csv,.txt" hidden disabled={locked} onChange={async e => { const file = e.target.files[0]; if (!file) return; try { const t = await ddReadPlateFile(file); setVeh([vText.trim(), t].filter(Boolean).join("\n")); } catch (er) { alert(er.message); } e.target.value = ""; }} /></label>
                    <span className="muted" style={{ fontSize: 11.5 }}>Cột 1: biển số · cột 2: nhà xe (nếu có)</span>
                  </div>
                </div>
                <div style={{ border: "1px solid var(--line)", borderRadius: "var(--r-sm)", padding: 8, minHeight: 96, maxHeight: 160, overflowY: "auto", fontSize: 12 }}>
                  {vl.length === 0 ? <div className="muted">Chưa có xe. Xe trong danh sách này mới đăng nhập được web tài xế (xe ngoài) và hiện trên app tally.</div> : <>
                    <div style={{ marginBottom: 6 }}><b>{vl.length}</b> xe · {vl.filter(x => x.owner || ddVeh(x.plate).ext).length} xe ngoài</div>
                    {vl.map(x => { const v = DD_VEHICLES.find(y => y.plate === x.plate); return <div key={x.plate} style={{ display: "flex", justifyContent: "space-between", padding: "3px 0", borderTop: "1px solid var(--line)" }}><b className="mono">{x.plate}</b><span className="muted">{x.owner || v?.owner || (v ? v.type : "xe mới")}</span></div>; })}
                  </>}
                </div>
              </div>
            </div>); })()}
          <div className="field"><label>Thiết bị</label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>{DD_EQUIP.map(x => <Chip key={x} on={f.equip.includes(x)} onClick={() => toggle("equip", x)}><span style={{ width: 5 }}></span>{x}</Chip>)}</div>
          </div>
          <div className="field-row">
            <div className="field"><label>Mục tiêu sản lượng ca ({ddUnit(job)}) <span className="req">*</span></label>
              <input className="input mono" disabled={locked} value={f.target ? ddNum(f.target) : ""} onChange={e => set("target", Number(e.target.value.replace(/\D/g, "")) || 0)} placeholder="0" />
            </div>
          </div>
          <div className="field"><label>Chỉ dẫn cho tally</label><input className="input" disabled={locked} value={f.note} onChange={e => set("note", e.target.value)} placeholder="VD: Ưu tiên hầm 2; cắm điện cont lạnh ngay khi hạ bãi" /></div>

          {existing && existing.status !== "draft" && <DdOrderCode o={existing} onChange={onSaved} />}
          {existing && existing.status !== "draft" && (
            <div style={{ padding: "10px 12px", borderRadius: "var(--r-sm)", background: "var(--bg-canvas)", border: "1px solid var(--line)", fontSize: 12.5 }}>
              <b>Tài khoản ca đã xem lệnh: {existing.ack.length}/{existing.tally.length}</b>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 6 }}>
                {existing.tally.map(t => <span key={t} className={`badge ${existing.ack.includes(t) ? "success" : "neutral"}`}>{existing.ack.includes(t) ? "✓" : "…"} {ddPerson(t).name}</span>)}
              </div>
            </div>
          )}
          {sentEdit && changed && !locked && (
            <div className="field" style={{ marginTop: 10 }}><label>Lý do thay đổi <span className="req">*</span> <span className="opt">— ghi log & gửi lại thông báo tally</span></label>
              <input className="input" value={reason} onChange={e => setReason(e.target.value)} placeholder="VD: TVL nghỉ ốm, thay bằng NVS" />
            </div>
          )}
          {existing && (
            <div style={{ marginTop: 10 }}>
              <div className="muted" style={{ fontSize: 11.5, fontWeight: 600, textTransform: "uppercase", letterSpacing: ".04em", marginBottom: 4 }}>Lịch sử thay đổi</div>
              {existing.log.map((l, i) => <div key={i} style={{ fontSize: 12, padding: "4px 0", borderTop: i ? "1px dashed var(--line)" : "none" }}>{l.text} <span className="muted">· {ddPerson(l.by).short} · <span className="mono">{l.at}</span></span></div>)}
            </div>
          )}
        </div>
        <div className="modal-foot">
          {locked ? <button className="btn" onClick={onClose}>Đóng</button> : <>
            <button className="btn ghost" onClick={onClose}>Huỷ</button>
            {(!existing || existing.status === "draft") && <button className="btn" disabled={!job} onClick={() => save(false)}>Lưu nháp</button>}
            {(!existing || existing.status === "draft")
              ? <button className="btn primary" disabled={!valid || noConts} title={noConts ? "Job chưa có danh sách cont — bổ sung ở chi tiết job trước khi gửi" : ""} onClick={() => save(true)}><Icon name="send" size={13}/> Lưu & gửi tally</button>
              : <button className="btn primary" disabled={!valid || !changed} onClick={() => save(true)}><Icon name="send" size={13}/> Lưu & gửi lại thông báo</button>}
          </>}
        </div>
      </div>
    </div>
  );
};

/* ================= LỆNH LÀM VIỆC CA — BẢNG TUẦN ================= */
const DdShiftsScreen = ({ go }) => {
  const [, force] = React.useState(0);
  const [svc, setSvc] = React.useState("all");
  const [modal, setModal] = React.useState(null);
  const [toast, flash] = useKdToast();
  const mon = (() => { const d = ddD(ddToday()); d.setDate(d.getDate() - (d.getDay() + 6) % 7); return d; })(); /* thứ Hai tuần hiện tại */
  const week = Array.from({ length: 7 }, (_, i) => { const d = new Date(mon); d.setDate(d.getDate() + i); return ddFmt(d); });
  const dow = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];
  const orders = DD_ORDERS.filter(o => svc === "all" || DD_JOBS.find(j => j.id === o.job)?.service === svc);
  const inWeek = orders.filter(o => week.includes(o.date));
  const stats = [
    { l: "Lệnh trong tuần", v: inWeek.length },
    { l: "Nháp chưa gửi", v: inWeek.filter(o => o.status === "draft").length, warn: true },
    { l: "Tally chưa xem lệnh", v: inWeek.filter(o => o.status === "sent").reduce((s, o) => s + o.tally.length - o.ack.length, 0), warn: true },
    { l: "Đang làm", v: inWeek.filter(o => o.status === "running").length },
    { l: "Ngày trước chưa kết ca", v: orders.filter(o => ddOrderOpen(o) && ddD(o.date) < ddD(ddToday())).length, warn: true },
  ];

  return (
    <div className="page" style={{ maxWidth: 1560 }}>
      <div className="page-head">
        <div>
          <h1>Lệnh làm việc ca</h1>
          <div className="sub">Tuần {week[0].slice(0, 5)} – {week[6]} · gửi lệnh tới app tally, sửa lệnh đã gửi phải ghi lý do — US-KH-02 · SC-03 · SC-07</div>
        </div>
        <div className="actions">
          <div className="seg-bar"><button>‹</button><button className="on">Tuần này</button><button>›</button></div>
          <button className="btn accent" onClick={() => setModal({})}><Icon name="plus" size={14}/> Tạo lệnh ca</button>
        </div>
      </div>

      <div style={{ display: "flex", gap: 22, marginBottom: 14, padding: "12px 18px", background: "var(--bg-surface)", border: "1px solid var(--line)", borderRadius: "var(--r-md)", flexWrap: "wrap", alignItems: "center" }}>
        {stats.map(s => <div key={s.l}><div className="muted" style={{ fontSize: 11.5 }}>{s.l}</div><div style={{ fontSize: 18, fontWeight: 700, color: s.warn && s.v ? "var(--st-warning)" : "inherit" }}>{s.v}</div></div>)}
        <div style={{ flex: 1 }}></div>
        <div className="seg-bar">
          <button className={svc === "all" ? "on" : ""} onClick={() => setSvc("all")}>Tất cả</button>
          {DD_SERVICES_ON.map(s => <button key={s.id} className={svc === s.id ? "on" : ""} onClick={() => setSvc(s.id)}>{s.label}</button>)}
        </div>
      </div>

      <div style={{ overflowX: "auto", border: "1px solid var(--line)", borderRadius: "var(--r-md)", background: "var(--bg-surface)" }}>
        <div style={{ display: "grid", gridTemplateColumns: "110px repeat(7, minmax(170px, 1fr))", minWidth: 1300 }}>
          <div style={{ padding: 10, borderBottom: "1px solid var(--line)", background: "var(--bg-canvas)" }}></div>
          {week.map((d, i) => (
            <div key={d} style={{ padding: "10px 12px", borderBottom: "1px solid var(--line)", borderLeft: "1px solid var(--line)", background: d === ddToday() ? "var(--st-warning-bg)" : "var(--bg-canvas)" }}>
              <div style={{ fontSize: 12.5, fontWeight: 700 }}>{dow[i]} <span className="mono" style={{ fontWeight: 500 }}>{d.slice(0, 5)}</span></div>
              {d === ddToday() && <div style={{ fontSize: 11, color: "var(--st-warning)" }}>Hôm nay</div>}
            </div>
          ))}
          {DD_SHIFTS.map(s => (
            <React.Fragment key={s.id}>
              <div style={{ padding: "10px 12px", borderBottom: "1px solid var(--line)", background: "var(--bg-canvas)" }}>
                <div style={{ fontSize: 13, fontWeight: 700 }}>{s.label}</div>
              </div>
              {week.map(d => {
                const cell = orders.filter(o => o.date === d && o.shift === s.id);
                return (
                  <div key={d} style={{ padding: 8, borderBottom: "1px solid var(--line)", borderLeft: "1px solid var(--line)", minHeight: 120, display: "flex", flexDirection: "column", gap: 6 }}>
                    {cell.map(o => { const j = DD_JOBS.find(x => x.id === o.job) || {}; return (
                      <div key={o.id} onClick={() => setModal({ id: o.id })} style={{ cursor: "pointer", padding: "7px 9px", borderRadius: 6, border: "1px solid var(--line)", borderLeft: `3px solid ${o.status === "draft" ? "var(--t-tertiary)" : o.status === "done" ? "var(--st-success)" : o.status === "running" ? "var(--st-warning)" : "var(--brand-ink)"}`, background: o.status === "draft" ? "var(--bg-canvas)" : "var(--bg-surface)", borderStyle: o.status === "draft" ? "dashed" : "solid" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", gap: 4, alignItems: "center" }}>
                          <span className="mono" style={{ fontSize: 10.5, color: "var(--t-tertiary)" }}>{o.id}</span>
                          <Icon name={ddSvc(j.service).icon} size={11}/>
                        </div>
                        <div style={{ fontSize: 12, fontWeight: 600, marginTop: 2 }}>{ddCusShort(j.customer)} {!j.contract && <span style={{ color: "var(--st-danger)", fontSize: 10.5 }}>· chưa HĐ</span>}</div>
                        <div className="muted" style={{ fontSize: 11 }}>{j.cargo} · {ddNum(o.target)} {ddUnit(j)}</div>
                        <div style={{ display: "flex", alignItems: "center", marginTop: 5 }}>
                          {o.tally.map((t, i) => <span key={t} style={{ marginLeft: i ? -5 : 0, opacity: o.status === "sent" && !o.ack.includes(t) ? 0.45 : 1 }}><Avatar person={ddPerson(t)} size={18} /></span>)}
                          <span style={{ marginLeft: "auto", fontSize: 10.5 }} className={`badge ${DD_ORDER_STATUS[o.status].cls}`}>{o.status === "sent" ? `Đã xem ${o.ack.length}/${o.tally.length}` : DD_ORDER_STATUS[o.status].label}</span>
                        </div>
                      </div>); })}
                    <button className="btn ghost btn-sm" style={{ marginTop: "auto", fontSize: 11.5, color: "var(--t-tertiary)" }} onClick={() => setModal({ date: d, shift: s.id })}>+ Lệnh</button>
                  </div>
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </div>
      <div className="muted" style={{ fontSize: 11.5, marginTop: 8 }}>Ảnh đại diện mờ = tally chưa mở lệnh trên app · thẻ viền đứt = nháp chưa gửi.</div>

      {modal && <DdOrderModal init={modal} onClose={() => setModal(null)} onSaved={(m) => { setModal(null); force(x => x + 1); flash(m); }} />}
      <KdToast text={toast} />
    </div>
  );
};

/* ================= SHELL MODULE ================= */
const DdRail = ({ active, onNav }) => {
  const groups = [
    { label: "Điều phối", items: [
      { id: "dd-jobs", label: "Kế hoạch job", icon: "task", count: ddNoContractJobs().length, urgent: true, title: "Số job chưa có HĐ" },
      { id: "dd-shifts", label: "Lệnh làm việc ca", icon: "schedule", count: DD_ORDERS.filter(o => o.status === "draft").length },
      { id: "dd-incidents", label: "Sự cố", icon: "alert", count: (window.ddOpenIncidents ? ddOpenIncidents() : 0), urgent: true },
      { id: "dd-approvals", label: "Chờ duyệt", icon: "approval", count: (window.ddPendingCount ? ddPendingCount() : 0), urgent: true },
    ] },
    { label: "Dịch vụ", items: DD_SERVICES_ON.flatMap(s => s.id === "kho"
      ? [{ id: "dd-svc-kho", label: s.label, icon: s.icon, parent: true }, ...(active.startsWith("dd-svc-kho") ? (window.DD_KHO_NAV || []).map(n => ({ id: "dd-svc-kho:" + n.id, label: n.label, sub: true })) : [])]
      : [{ id: "dd-svc-" + s.id, label: s.label, icon: s.icon }]) },
    { label: "Cổng", items: [{ id: "dd-gate", label: "Gate In / Out", icon: "flag" }, { id: "dd-river", label: "River gate", icon: "ship" }] },
    { label: "Hiện trường", items: [{ id: "dd-tally", label: "App Tally (mobile)", icon: "qrcode" }, { id: "dd-driver", label: "Web tài xế", icon: "task" }] },
    { label: "Báo cáo", items: [{ id: "dd-report", label: "Sản lượng", icon: "activity" }, { id: "dd-crane", label: "Hiệu suất cẩu", icon: "crane" }] },
  ];
  return (
    <aside className="rail">
      <div className="rail-brand"><div className="mark">V</div><div className="wordmark"><b>Vinalogistics</b><span>TTOS · Điều độ khai thác</span></div></div>
      <div className="rail-module"><div><div className="mod-name">Điều độ khai thác</div><div className="mod-sub">BRD KT v2.6 · draft</div></div><Icon name="chevronDown" size={16} /></div>
      <div className="rail-scroll" style={{ flex: 1, minHeight: 0, overflowY: "auto", overflowX: "hidden", display: "flex", flexDirection: "column", scrollbarWidth: "none", msOverflowStyle: "none" }}>
      <style>{".rail-scroll::-webkit-scrollbar{display:none}"}</style>
      {groups.map(g => (
        <React.Fragment key={g.label}>
          <div className="rail-section-label">{g.label}</div>
          <nav className="rail-nav" style={{ flex: "none" }}>
            {g.items.map(it => (
              it.sub ? (
                <div key={it.id} className={`rail-item ${active === it.id ? "active" : ""}`} title={it.label} onClick={() => onNav(it.id)} style={{ paddingLeft: 44, fontSize: 12.5, minHeight: 30 }}>
                  <span>{it.label}</span>
                </div>
              ) : (
              <div key={it.id} className={`rail-item ${active === it.id || (it.parent && active.startsWith(it.id + ":")) ? "active" : ""} ${it.urgent && it.count > 0 ? "urgent" : ""}`} title={it.title || it.label} onClick={() => onNav(it.parent ? it.id + ":dashboard" : it.id)}>
                <Icon name={it.icon} size={18} /><span>{it.label}</span>{it.count ? <span className="count">{it.count}</span> : null}
                {it.parent && <span style={{ marginLeft: "auto", opacity: .6, fontSize: 11 }}>{active.startsWith(it.id) ? "▾" : "▸"}</span>}
              </div>)
            ))}
          </nav>
        </React.Fragment>
      ))}
      </div>
      <div className="rail-foot" style={{ flexShrink: 0 }}><Avatar person={DD_ME} size={32} /><div className="who"><b>{DD_ME.name}</b><span>{DD_ME.role}</span></div></div>
    </aside>
  );
};

const DdModule = ({ onBack }) => {
  window.ddSyncKhoJobs && ddSyncKhoJobs();
  const [route, setRoute] = React.useState(() => { const p = window.__ttosPending; if (p && p.mod === "dieudo") { window.__ttosPending = null; return { screen: p.screen, ctx: p.ctx }; } return { screen: "dd-jobs", ctx: {} }; });
  const go = (screen, ctx = {}) => {
    if (screen.startsWith("dd-svc-kho")) { const sub = screen.split(":")[1] || "dashboard"; return setRoute({ screen: "dd-svc-kho", ctx: { sub } }); }
    setRoute({ screen, ctx });
  };
  window.__ddKhoRoute = (sub) => setRoute(r => r.screen === "dd-svc-kho" && r.ctx.sub !== sub ? { screen: "dd-svc-kho", ctx: { sub } } : r);
  const [, tick] = React.useState(0);
  window.__ddTick = () => tick(x => x + 1);
  const active = route.screen === "dd-job-new" || route.screen === "dd-job-detail" ? "dd-jobs" : route.screen === "dd-svc-kho" ? "dd-svc-kho:" + (route.ctx.sub || "dashboard") : route.screen;
  const labels = { "dd-jobs": "Kế hoạch job", "dd-job-new": "Tạo kế hoạch job", "dd-job-detail": "Kế hoạch job", "dd-shifts": "Lệnh làm việc ca",
    "dd-incidents": "Sự cố", "dd-approvals": "Chờ duyệt", "dd-report": "Sản lượng", "dd-crane": "Hiệu suất cẩu", "dd-tally": "App Tally (mobile)", "dd-driver": "Web tài xế", "dd-gate": "Gate In / Out", "dd-river": "River gate" };
  DD_SERVICES.forEach(s => labels["dd-svc-" + s.id] = s.label);
  const crumbs = ["Vinalogistics", "Điều độ khai thác", labels[route.screen]];
  if (route.screen === "dd-svc-kho") crumbs.push(((window.DD_KHO_NAV || []).find(n => n.id === route.ctx.sub) || {}).label || "Tổng quan");
  if (route.ctx?.id) crumbs.push(route.ctx.id);
  const soon = {};

  return (
    <div className="shell" data-rail="expanded" data-screen-label={`Điều độ / ${route.screen}`}>
      <DdRail active={active} onNav={(id) => go(id)} />
      <main style={{ minWidth: 0 }}>
        <Topbar crumbs={crumbs} />
        {route.screen === "dd-jobs" && <DdJobsScreen go={go} ctx={route.ctx} key={JSON.stringify(route.ctx)} />}
        {route.screen === "dd-job-new" && <DdJobNewScreen go={go} />}
        {route.screen === "dd-job-detail" && <DdJobDetailScreen go={go} ctx={route.ctx} key={route.ctx?.id} />}
        {route.screen === "dd-shifts" && <DdShiftsScreen go={go} />}
        {route.screen === "dd-tally" && <DdTallyScreen go={go} />}
        {route.screen === "dd-driver" && <DdDriverWebScreen go={go} />}
        {route.screen === "dd-gate" && <DdGateScreen go={go} />}
        {route.screen === "dd-river" && (window.DdRiverGateScreen ? <DdRiverGateScreen go={go} /> : <DdRiverScreen go={go} />)}
        {route.screen === "dd-svc-bp" && <DdServiceScreen svc="bp" go={go} key="bp" />}
        {route.screen === "dd-svc-icd" && <DdServiceScreen svc="icd" go={go} key="icd" />}
        {route.screen === "dd-svc-kho" && <DdKhoEmbedScreen sub={route.ctx.sub || "dashboard"} />}
        {route.screen === "dd-svc-bai" && (window.DdYardMapScreen ? <DdYardMapScreen go={go} /> : <DdYardScreen go={go} />)}
        {route.screen === "dd-svc-vt" && <DdTransportScreen go={go} />}
        {route.screen === "dd-report" && <DdReportScreen go={go} />}
        {route.screen === "dd-crane" && <DdCraneScreen go={go} />}
        {route.screen === "dd-incidents" && <DdIncidentsScreen go={go} ctx={route.ctx} />}
        {route.screen === "dd-approvals" && <DdApprovalsScreen go={go} ctx={route.ctx} />}
        {soon[route.screen] && <DdComingSoon title={labels[route.screen]} note={soon[route.screen]} />}
      </main>
    </div>
  );
};

Object.assign(window, { ddParseCont, ddContRow, ddContTemplate, DD_CONT_TPL, ddDirProgress, DD_DIR_ORDER, ddJobTouch, ddContBusy, ddJobHasRec, DD_TALLY_ACCS, ddTallyAcc, ddTallySvc, ddLoc, ddKhoDb, ddKhoTxOfJob, ddIsoToday, DD_KHO_KEY, ddUnit, DdModule, DD_JOBS, DD_ORDERS, DD_PEOPLE, ddPerson, ddSvc, ddCus, ddNoContractJobs, ddActiveContracts, DD_JOB_STATUS, ddNow });
