/* Điều độ khai thác — River gate (theo hướng RiverGate của Cofano)
   · Kế hoạch cầu bến: lịch bến × giờ (DD_CALLS, dùng chung với OCC)
   · Lượt cập: giờ dự kiến / thực tế (đến – cập cầu – rời), danh sách cont xếp / dỡ của từng lượt
   · Đăng ký lượt cập: nhà sà lan (VNL hoặc bên ngoài) chọn khung giờ trống → KHTH duyệt / đổi giờ / từ chối
   · Thông báo cho nhà sà lan khi lịch thay đổi · Báo cáo: chờ cầu, làm hàng, đúng giờ · Màn thuyền trưởng */

const RV_OPERATORS = [
  { id: "vnl", name: "Vinalogistics (đội sà lan VNL)", short: "VNL", internal: true, contact: "Phòng Khai thác" },
  { id: "op1", name: "Cty TNHH Vận tải thủy Hải Âu", short: "Hải Âu", internal: false, contact: "Ông Trần Văn Hải · 0905 221 330" },
  { id: "op2", name: "Cty CP Sà lan Phú An", short: "Phú An", internal: false, contact: "Bà Lê Thị An · 0913 448 902" },
  { id: "op3", name: "HTX Vận tải thủy Minh Phát", short: "Minh Phát", internal: false, contact: "Ông Phạm Minh · 0988 610 225" },
];
const rvOp = (id) => RV_OPERATORS.find(o => o.id === id) || RV_OPERATORS[0];
const rvBargeOp = (b) => /VNL/.test(b) ? "vnl" : /HẢI ÂU/.test(b) ? "op1" : /PHÚ AN/.test(b) ? "op2" : /MINH PHÁT/.test(b) ? "op3" : "vnl";
/* Giờ hiện tại GMT+7 [dd/mm/yyyy, HH:mm] (thay mốc cố định 02/11 15:40 của prototype) */
const rvNow = () => [ddToday(), window.ddVnNow().time];
const rvH = (v) => v ? ddRvH(v[0], v[1]) : null;
const rvFromH = (h) => { const d = new Date(ddD(DD_RV.start).getTime() + Math.round(h * 2) / 2 * 36e5); return [ddFmt(d), `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`]; };
const rvFmt = (v) => v ? `${v[0].slice(0, 5)} ${v[1]}` : "—";
const rvHrs = (a, b) => (a && b) ? Math.max(0, rvH(b) - rvH(a)) : null;
const rvNum = (n) => n == null ? "—" : (Math.round(n * 10) / 10).toLocaleString("vi-VN");

/* Bổ sung dữ liệu cho lượt cập hiện có */
(() => {
  DD_CALLS.forEach(c => {
    c.op = c.op || rvBargeOp(c.barge);
    c.voyage = c.voyage || `${c.barge.replace("SL ", "")}/${c.eta[0].slice(0, 2)}${c.eta[0].slice(3, 5)}`;
    c.notices = c.notices || [];
    c.src = c.src || "khth";
  });
})();

/* ---------- Liên kết với tính năng đã có ----------
   · Cẩu: danh mục cẩu bờ dùng chung với OCC (OCC_CRANES) + cẩu nổi trong danh mục thiết bị
   · Danh sách cont: lấy từ danh sách cont của Kế hoạch job (đã nhập Excel khi tạo job) — lượt cập chỉ chọn cont nào đi lượt này
   · Kiểm tra sẵn sàng: dùng lại bộ kiểm tra của Gate In/Out (sổ cont tại cảng, danh sách job, lệnh hãng tàu)
   · Lệnh ca ↔ lượt cập ↔ bản ghi tally ↔ nhật ký gate (kênh river gate)
   · Nguyên nhân chờ / trễ: ghi thành Sự cố (module Sự cố), gắn mã lượt cập */
const RV_CUTOFF_H = 6;          /* chốt danh sách cont trước giờ cập dự kiến (giả định) */
const RV_RATE_CONT = 18;        /* cont/giờ/cẩu (giả định) */
const RV_RATE_BULK = 150;       /* tấn/giờ/cẩu (giả định) */
const rvCranePool = (berth) => (berth || "").startsWith("BP") || (berth || "").startsWith("VNL-BOU") ? ["Cẩu nổi VNL-C1", "Cẩu nổi VNL-C2"] : (typeof OCC_CRANES !== "undefined" ? OCC_CRANES.map(c => c.id) : []);
const rvCraneDown = (id) => (typeof OCC_CRANES !== "undefined" ? OCC_CRANES : []).find(c => c.id === id && c.status !== "active");
const rvCraneClash = (c, crane) => DD_CALLS.filter(x => x.id !== c.id && x.status !== "departed" && (x.cranes || []).includes(crane) && rvH(x.atb || x.eta) < rvH(c.atd || c.etd) && rvH(c.atb || c.eta) < rvH(x.atd || x.etd));
const rvCallOf = (i) => i.call || (DD_ORDERS.find(o => o.id === i.order) || {}).call || null;
const rvIncOf = (c) => DD_INCIDENTS.filter(i => rvCallOf(i) === c.id);
const rvContsOf = (c) => (c.conts || []).map(no => { const j = DD_JOBS.find(x => x.id === c.job); const jc = j && j.conts && j.conts.find(x => x.no === no); return jc || { no, type: (DD_CONT_REG[no] || {}).type || "40GP", fe: (DD_CONT_REG[no] || {}).fe || "F", status: "pending", extra: true }; });
const rvDir = (c) => { const j = DD_JOBS.find(x => x.id === c.job); return j && j.kind === "cont" ? (j.contDir === "import" ? "in" : "out") : null; };
const rvCutoff = (c) => rvH(c.eta) - RV_CUTOFF_H;
const rvLocked = (c) => rvH(rvNow()) >= rvCutoff(c) && !c.unlock;
const rvTeu = (nos) => nos.reduce((s, no) => s + (((DD_CONT_REG[no] || {}).type || "40").startsWith("4") ? 2 : 1), 0);
const rvEstimate = (c) => {
  const j = DD_JOBS.find(x => x.id === c.job); const k = Math.max(1, (c.cranes || []).length);
  if (j && j.kind === "cont") { const n = rvContsOf(c).filter(x => x.status !== "done").length; return { n, unit: "cont", h: n / (k * RV_RATE_CONT) + (c.status === "working" ? 0.5 : 1) }; }
  if (j) { const n = Math.max(0, j.plan - j.actual); return { n, unit: ddUnit(j), h: Math.min(n / (k * RV_RATE_BULK), 72) + (c.status === "working" ? 0.5 : 1) }; }
  return null;
};
const rvEstBase = (c) => c.status === "working" ? Math.max(rvH(rvNow()), rvH(c.atb || c.eta)) : rvH(c.atb || c.eta);
const rvActualRate = (c) => {
  if (!c.atb) return null; const hrs = Math.max(0.25, rvH(c.atd || rvNow()) - rvH(c.atb)); const k = Math.max(1, (c.cranes || []).length);
  const recs = DD_RECORDS.filter(r => r.call === c.id && r.status !== "void");
  const done = recs.filter(r => r.cont).length || rvContsOf(c).filter(x => x.status === "done").length;
  return done ? { v: done / hrs / k, unit: "cont/giờ/cẩu" } : recs.length ? { v: recs.reduce((s, r) => s + (r.qty || 0), 0) / hrs / k, unit: "tấn/giờ/cẩu" } : null;
};

/* Lịch sử lượt cập đã rời (cho báo cáo) */
const RV_HISTORY = []; /* pilot: không có lịch sử mẫu */

/* Đăng ký lượt cập từ nhà sà lan */
const RV_REQS = []; /* pilot: chưa có cổng đối tác — không có đăng ký từ nhà sà lan */
const RV_REQ_ST = { pending: ["warning", "Chờ duyệt"], approved: ["success", "Đã duyệt"], counter: ["accent", "Đề xuất giờ khác"], rejected: ["danger", "Từ chối"], declined: ["neutral", "Đối tác không đồng ý giờ"], cancelled: ["neutral", "Đối tác đã huỷ"] };

/* Khung giờ trống của một bến (bước 30 phút) trong cửa sổ lịch */
const rvFreeSlots = (berth, durH, fromH, n = 4, ignore) => {
  const busy = DD_CALLS.filter(c => c.berth === berth && c.status !== "departed" && c.id !== ignore).map(c => [rvH(c.atb || c.eta), rvH(c.atd || c.etd)]).sort((a, b) => a[0] - b[0]);
  const out = []; let t = Math.max(fromH, rvH(rvNow())); t = Math.ceil(t * 2) / 2; const end = DD_RV.days * 24 + 48;
  while (t + durH <= end && out.length < n) {
    const hit = busy.find(([a, b]) => a < t + durH && t < b);
    if (hit) { t = Math.ceil(hit[1] * 2) / 2; continue; }
    out.push([t, t + durH]); t += durH + 2;
  }
  return out;
};

const RV_NOTICES = [];
const rvNotify = (c, text, to) => { const n = { at: ddNow(), call: c.id || c, to: to || rvOp(c.op).name, text }; (c.notices = c.notices || []).unshift(n); RV_NOTICES.unshift(n); };

/* Danh sách cont xếp / dỡ của một lượt cập (từ job gắn với lượt) */
const rvLists = (c) => {
  const j = DD_JOBS.find(x => x.id === c.job);
  if (!j) return { dis: [], load: [], bulk: null, j };
  if (j.kind !== "cont") return { dis: [], load: [], bulk: `${j.cargo} · ${ddQty(j.actual)}/${ddQty(j.plan)} ${ddUnit(j)}`, j };
  const cs = rvContsOf(c);
  const isIn = (x) => { const jc = (j.conts || []).find(y => y.no === (x.no || x)); return (jc ? ddCDir(jc, j) : j.contDir) === "import"; };
  return { dis: cs.filter(isIn), load: cs.filter(x => !isIn(x)), bulk: null, j };
};

const RvPhone = ({ children }) => (
  <div style={{ width: 340, border: "10px solid #0F172A", borderRadius: 34, overflow: "hidden", background: "#F8FAFC", boxShadow: "0 10px 30px rgba(15,23,42,.18)" }}>
    <div style={{ height: 26, background: "#0E7490", color: "#fff", fontSize: 11.5, display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 18px" }}><span>15:40</span><span>RiverGate · Thuyền trưởng</span></div>
    <div style={{ minHeight: 520, maxHeight: 560, overflowY: "auto" }}>{children}</div>
  </div>
);

/* ===== Màn River gate ===== */
const DdRiverGateScreen = ({ go }) => {
  const [, force] = React.useState(0);
  const refresh = (m) => { force(x => x + 1); if (m) flash(m); };
  const [toast, flash] = useKdToast();
  const [tab, setTab] = React.useState("plan");
  const [sel, setSel] = React.useState(null);
  const [portal, setPortal] = React.useState(null);
  const [counter, setCounter] = React.useState(null);
  const [rej, setRej] = React.useState(null);
  const [capBarge, setCapBarge] = React.useState("SL VNL-C08");

  const calls = [...DD_CALLS].sort((a, b) => rvH(a.eta) - rvH(b.eta));
  const pend = RV_REQS.filter(r => r.status === "pending");
  const cur = sel && DD_CALLS.find(c => c.id === sel);

  /* Duyệt đăng ký → tạo lượt cập */
  const approve = (r, slot) => {
    if (!DD_VEHICLES.find(v => v.plate === r.barge)) DD_VEHICLES.push({ plate: r.barge, type: `Sà lan ngoài · ${rvOp(r.op).name}`, kind: "salan", cap: 1500, ext: true });
    const eta = slot ? rvFromH(slot[0]) : r.eta, etd = slot ? rvFromH(slot[1]) : r.etd;
    const job = (r.job && DD_JOBS.find(j => j.id === r.job)) || DD_JOBS.find(j => j.customer === r.customer && ["planned", "running"].includes(j.status) && ["bp", "icd"].includes(j.service) && (r.berth.startsWith("BP") ? j.service === "bp" : j.service === "icd"));
    const id = ddNewId("SL");
    const c = { id, barge: r.barge, berth: r.berth, eta, etd, job: job ? job.id : null, status: "planned", op: r.op, voyage: `${r.barge.replace("SL ", "")}/${eta[0].slice(0, 2)}${eta[0].slice(3, 5)}`, notices: [], src: r.id, cranes: [], conts: r.list && r.list.length ? [...r.list] : (job && job.kind === "cont" ? job.conts.filter(x => x.status !== "done" && !DD_CALLS.some(y => (y.conts || []).includes(x.no))).map(x => x.no) : null) };
    const free = rvCranePool(r.berth).find(k => !rvCraneDown(k) && !rvCraneClash(c, k).length); if (free) c.cranes = [free];
    DD_CALLS.push(c);
    r.status = slot ? "counter" : "approved"; r.call = id; r.slot = slot ? [eta, etd] : null;
    rvNotify(c, slot ? `Đề xuất giờ khác cho ${r.id}: cập ${r.berth} ${rvFmt(eta)} → ${rvFmt(etd)} (thay cho ${rvFmt(r.eta)})` : `Đã duyệt ${r.id}: cập ${r.berth} ${rvFmt(eta)} → ${rvFmt(etd)}`);
    if (job) job.log.unshift({ at: ddNow(), by: DD_ME.id, text: `Lượt cập ${id} (${r.barge}) từ đăng ký ${r.id}` });
    setCounter(null); refresh(slot ? `Đã đề xuất giờ mới cho ${rvOp(r.op).name}` : `Đã duyệt · tạo lượt cập ${id}`);
  };
  const reject = (r, why) => { r.status = "rejected"; r.why = why; rvNotify({ id: r.id, op: r.op }, `Từ chối ${r.id}: ${why}`, rvOp(r.op).name); setRej(null); refresh("Đã từ chối và báo nhà sà lan"); };

  /* Ghi mốc thực tế — chờ cầu > 1 giờ hoặc đến lệch > 2 giờ thì ghi nguyên nhân thành Sự cố */
  const [cause, setCause] = React.useState(null);
  const [pick, setPick] = React.useState(null);
  const mark = (c, k, skip) => {
    c[k] = [...rvNow()]; if (k === "atb") c.status = "working"; if (k === "atd") c.status = "departed";
    rvNotify(c, { ata: `${c.barge} đã đến khu neo chờ ${c.berth}`, atb: `${c.barge} đã cập ${c.berth}, bắt đầu làm hàng`, atd: `${c.barge} đã rời ${c.berth}` }[k]);
    const late = k === "ata" ? rvH(c.ata) - rvH(c.eta) : 0, wait = k === "atb" ? rvH(c.atb) - rvH(c.ata) : 0;
    if (!skip && late > 2) setCause({ c, kind: "late", hrs: late, type: "late" });
    else if (!skip && wait > 1) setCause({ c, kind: "wait", hrs: wait, type: "berth" });
    refresh("Đã ghi mốc thực tế");
  };
  const saveCause = () => {
    const { c, hrs, type, note } = cause; const o = DD_ORDERS.find(x => x.call === c.id);
    const id = ddNewId("SC");
    DD_INCIDENTS.unshift({ id, order: o ? o.id : "—", job: c.job, call: c.id, by: DD_ME.id, at: ddNow(), type, eq: o ? (ddCranes(o)[0] || null) : null, notes: ["Làm chậm"], photo: false, status: "closed", assignee: DD_ME.id, downtime: Math.round(hrs * 60), result: note || (TL_INC_TYPES.find(t => t.id === type) || {}).label,
      log: [{ at: ddNow(), by: DD_ME.id, text: `Tạo từ River gate · ${cause.kind === "late" ? "đến trễ" : "chờ cầu"} ${rvNum(hrs)} giờ · lượt ${c.id}` }] });
    setCause(null); refresh(`Đã ghi nguyên nhân vào Sự cố ${id}`);
  };
  const setCranes = (c, crane) => { c.cranes = (c.cranes || []).includes(crane) ? c.cranes.filter(x => x !== crane) : [...(c.cranes || []), crane]; refresh(); };
  const applyEtd = (c) => { const e = rvEstimate(c); if (!e) return; const from = rvEstBase(c); const old = rvFmt(c.etd); c.etd = rvFromH(Math.ceil((from + e.h) * 2) / 2); rvNotify(c, `Giờ rời dự kiến ${c.id} cập nhật theo ước tính làm hàng: ${old} ⇒ ${rvFmt(c.etd)}`); refresh("Đã cập nhật giờ rời và báo nhà sà lan"); };
  /* Đổi giờ lượt cập → báo nhà sà lan */
  const shift = (c, slot) => {
    const old = `${rvFmt(c.eta)} → ${rvFmt(c.etd)}`; c.eta = rvFromH(slot[0]); c.etd = rvFromH(slot[1]);
    rvNotify(c, `Lịch ${c.id} thay đổi: ${old} ⇒ ${rvFmt(c.eta)} → ${rvFmt(c.etd)} tại ${c.berth}`); refresh(`Đã đổi giờ và báo ${rvOp(c.op).name}`);
  };

  /* Báo cáo */
  const hist = [...RV_HISTORY, ...DD_CALLS.filter(c => c.atd && c.ata && c.atb).map(c => ({ op: c.op, berth: c.berth, barge: c.barge, etaH: rvH(c.eta), ataH: rvH(c.ata), atbH: rvH(c.atb), atdH: rvH(c.atd) }))];
  const agg = (rows) => { const n = rows.length || 1; const wait = rows.reduce((s, x) => s + (x.atbH - x.ataH), 0) / n, work = rows.reduce((s, x) => s + (x.atdH - x.atbH), 0) / n, ontime = rows.filter(x => Math.abs(x.ataH - x.etaH) <= 2).length / n; return { n: rows.length, wait, work, ontime }; };
  const all = agg(hist);

  const CallCard = ({ c }) => {
    const L = rvLists(c); const st = DD_CALL_STATUS[c.status]; const op = rvOp(c.op);
    const done = (xs) => xs.filter(x => x.status === "done").length;
    const dir = rvDir(c); const locked = rvLocked(c); const est = rvEstimate(c); const rate = rvActualRate(c);
    const barge = DD_VEHICLES.find(v => v.plate === c.barge);
    const teu = rvTeu(c.conts || []); const over = barge && barge.cap && barge.cap < 200 && teu > barge.cap;
    const orders = DD_ORDERS.filter(o => o.call === c.id); const recs = DD_RECORDS.filter(r => r.call === c.id);
    const gates = (window.DD_GATE_LOG || []).filter(g => g.call === c.id || (g.ch === "river" && g.job === c.job && (c.conts || []).includes(g.no)));
    const incs = rvIncOf(c);
    /* sẵn sàng: dùng sổ cont tại cảng (Gate In/Out) + vị trí bãi (Bãi container) + danh sách cont của job */
    const chk = (no) => { const reg = DD_CONT_REG[no]; const inJob = L.j && L.j.conts && L.j.conts.some(x => x.no === no);
      if (dir === "out") { if (!reg || !reg.inPort) return ["var(--st-danger)", "Chưa có trong cảng"]; if (!reg.pos) return ["var(--st-warning)", "Chờ xếp bãi"]; return inJob ? ["var(--st-success)", `Sẵn sàng · ${reg.loc}`] : ["var(--st-warning)", `Không thuộc job · ${reg.loc}`]; }
      if (reg && reg.inPort) return ["var(--st-danger)", "Đã có trong cảng"]; return inJob ? ["var(--st-success)", "Sẵn sàng dỡ"] : ["var(--st-warning)", "Không thuộc job"]; };
    const notReady = (c.conts || []).filter(no => { const x = rvContsOf(c).find(y => y.no === no); return x && x.status !== "done" && chk(no)[0] === "var(--st-danger)"; });
    return (
      <div className="card" style={{ marginTop: 14 }}>
        <div className="card-head"><div><h3><span className="mono">{c.id}</span> · {c.barge} · {c.berth}</h3><div className="sub">Chuyến {c.voyage} · {op.name}{c.src !== "khth" ? ` · từ đăng ký ${c.src}` : ""}</div></div><span className={`badge ${st[0]}`}>{st[1]}</span></div>
        <div className="card-body" style={{ display: "grid", gridTemplateColumns: "1.1fr 1.25fr 1fr", gap: 18, fontSize: 12.5 }}>
          <div>
            <div className="muted" style={{ fontSize: 11.5, marginBottom: 4 }}>Mốc thời gian</div>
            <table className="tbl" style={{ fontSize: 12 }}><thead><tr><th></th><th>Dự kiến</th><th>Thực tế</th></tr></thead><tbody>
              <tr><td>Đến khu neo</td><td className="mono">{rvFmt(c.eta)}</td><td className="mono">{c.ata ? rvFmt(c.ata) : <button className="btn btn-sm" onClick={() => mark(c, "ata")}>Ghi đến</button>}</td></tr>
              <tr><td>Cập cầu</td><td className="mono">—</td><td className="mono">{c.atb ? rvFmt(c.atb) : <button className="btn btn-sm" disabled={!c.ata} onClick={() => mark(c, "atb")}>Cập cầu</button>}</td></tr>
              <tr><td>Rời cầu</td><td className="mono">{rvFmt(c.etd)}</td><td className="mono">{c.atd ? rvFmt(c.atd) : <button className="btn btn-sm" disabled={!c.atb} onClick={() => mark(c, "atd")}>Rời cầu</button>}</td></tr>
            </tbody></table>
            <div style={{ marginTop: 6 }}>Chờ cầu: <b>{rvNum(rvHrs(c.ata, c.atb))} giờ</b> · Làm hàng: <b>{rvNum(rvHrs(c.atb, c.atd || (c.atb ? rvNow() : null)))} giờ</b>{c.ata && Math.abs(rvH(c.ata) - rvH(c.eta)) > 2 ? <span style={{ color: "var(--st-warning)" }}> · đến lệch {rvNum(rvH(c.ata) - rvH(c.eta))} giờ</span> : null}</div>
            <div className="muted" style={{ fontSize: 11.5, margin: "12px 0 4px" }}>Cẩu phục vụ <span style={{ fontWeight: 400 }}>— danh mục cẩu dùng chung với OCC</span></div>
            <div className="row" style={{ gap: 5, flexWrap: "wrap" }}>{rvCranePool(c.berth).map(k => { const on = (c.cranes || []).includes(k); const down = rvCraneDown(k); const clash = on && rvCraneClash(c, k); return (
              <button key={k} className={`btn btn-sm ${on ? "primary" : ""}`} disabled={!!down || c.status === "departed"} title={down ? "Đang bảo dưỡng" : clash && clash.length ? `Trùng với ${clash.map(x => x.id).join(", ")}` : ""} onClick={() => setCranes(c, k)} style={clash && clash.length ? { outline: "2px solid #DC2626" } : undefined}>{k}{down ? " · BD" : ""}</button>); })}</div>
            {(c.cranes || []).some(k => rvCraneClash(c, k).length) && <div style={{ color: "var(--st-danger)", fontSize: 12, marginTop: 4 }}>⚠ {(c.cranes || []).filter(k => rvCraneClash(c, k).length).map(k => `${k} đã phân cho ${rvCraneClash(c, k).map(x => x.id).join(", ")}`).join(" · ")}</div>}
            {est && <div style={{ marginTop: 8, padding: "8px 10px", background: "var(--bg-canvas)", borderRadius: 6 }}>
              Ước tính {c.status === "working" ? "phần còn lại" : "làm hàng"}: <b>{ddQty(est.n, est.unit)} {est.unit}</b> / ({Math.max(1, (c.cranes || []).length)} cẩu × {est.unit === "cont" ? `${RV_RATE_CONT} cont` : `${RV_RATE_BULK} tấn`}/giờ) ≈ <b>{rvNum(est.h)} giờ</b> → rời khoảng <b className="mono">{rvFmt(rvFromH(Math.ceil((rvEstBase(c) + est.h) * 2) / 2))}</b>
              {c.status !== "departed" && Math.abs(rvEstBase(c) + est.h - rvH(c.etd)) > 1 && <button className="btn btn-sm" style={{ marginLeft: 6 }} onClick={() => applyEtd(c)}>Áp dụng giờ rời</button>}
              {rate && <div className="muted" style={{ marginTop: 3 }}>Năng suất thực tế: <b style={{ color: "var(--t-primary)" }}>{rvNum(rate.v)} {rate.unit}</b></div>}
            </div>}
            {c.status === "planned" && <div style={{ marginTop: 8 }}><div className="muted" style={{ fontSize: 11.5 }}>Đổi sang khung giờ trống ({c.berth}):</div>{rvFreeSlots(c.berth, rvH(c.etd) - rvH(c.eta), 0, 3, c.id).map(s => <button key={s[0]} className="btn btn-sm" style={{ margin: "4px 4px 0 0" }} onClick={() => shift(c, s)}>{rvFmt(rvFromH(s[0]))}</button>)}</div>}
          </div>
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <div className="muted" style={{ fontSize: 11.5 }}>Danh sách {dir === "in" ? "dỡ xuống bãi" : dir === "out" ? "xếp lên sà lan" : "hàng"} {L.j ? <a style={{ cursor: "pointer", color: "var(--brand-ink)" }} onClick={() => go("dd-job-detail", { id: L.j.id })}>· từ {L.j.id}</a> : "· chưa gắn job"}</div>
              {dir && <span style={{ fontSize: 11.5, color: locked ? "var(--st-danger)" : "var(--t-tertiary)" }}>{locked ? `Đã chốt (${rvFmt(rvFromH(rvCutoff(c)))})` : `Chốt lúc ${rvFmt(rvFromH(rvCutoff(c)))}`}</span>}
            </div>
            {L.bulk && <div style={{ marginTop: 4 }}>Hàng rời: <b>{L.bulk}</b></div>}
            {dir && <div style={{ marginTop: 4 }}><b>{done(rvContsOf(c))}/{(c.conts || []).length} cont</b> đã làm · {teu} TEU{barge && barge.cap < 200 ? ` / sức chở ${barge.cap} TEU` : ""}{over && <span style={{ color: "var(--st-danger)" }}> · vượt sức chở</span>}
              {(!locked || c.unlock) && c.status !== "departed" && <button className="btn btn-sm" style={{ marginLeft: 6 }} onClick={() => setPick({ c, sel: [...(c.conts || [])] })}>Chọn cont từ job</button>}
              {locked && c.status !== "departed" && <button className="btn btn-sm ghost" style={{ marginLeft: 6 }} onClick={() => { c.unlock = true; rvNotify(c, `KHTH mở lại danh sách cont ${c.id} sau giờ chốt`); refresh("Đã mở lại danh sách"); }}>Mở lại (KHTH)</button>}
            </div>}
            {notReady.length > 0 && <div style={{ color: "var(--st-danger)", fontSize: 12, marginTop: 4 }}>⚠ {notReady.length} cont chưa sẵn sàng (kiểm tra theo Gate In/Out)</div>}
            {dir && <div style={{ maxHeight: 170, overflowY: "auto", marginTop: 6, border: "1px solid var(--line)", borderRadius: 6 }}>{rvContsOf(c).slice(0, 60).map(x => { const [col, t] = x.status === "done" ? ["var(--st-success)", "Đã làm"] : chk(x.no); const reg = DD_CONT_REG[x.no]; return (
              <div key={x.no} style={{ fontSize: 11.5, display: "grid", gridTemplateColumns: "118px 46px 1fr", gap: 6, padding: "3px 8px", borderBottom: "1px dashed var(--line)" }}><span className="mono">{tlContFmt(x.no)}</span><span className="mono muted">{x.type}</span><span style={{ color: col, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }} title={t}>{t}</span></div>); })}</div>}
            <div className="muted" style={{ fontSize: 11.5, margin: "12px 0 4px" }}>Lệnh ca · tally · cổng sông</div>
            <div>{orders.length ? orders.map(o => <span key={o.id} className="mono" style={{ marginRight: 8 }}>{o.id} ({DD_SHIFTS[o.shift - 1].label}, {DD_ORDER_STATUS[o.status].label})</span>) : <span className="muted">Chưa có lệnh ca gắn lượt này — chọn lượt cập khi lập lệnh ca</span>}</div>
            <div style={{ marginTop: 3 }}>{recs.length} bản ghi tally · {gates.length} lượt qua cổng sông (gate {dir === "in" ? "in" : "out"})</div>
          </div>
          <div>
            <div className="muted" style={{ fontSize: 11.5, marginBottom: 4 }}>Chờ / trễ / sự cố trong lượt <span style={{ fontWeight: 400 }}>— từ module Sự cố</span></div>
            {incs.length === 0 && <div className="muted">Không có</div>}
            {incs.map(i => <div key={i.id} style={{ fontSize: 12, padding: "3px 0", borderBottom: "1px dashed var(--line)" }}><a style={{ cursor: "pointer", color: "var(--brand-ink)" }} className="mono" onClick={() => go("dd-incidents")}>{i.id}</a> · {(TL_INC_TYPES.find(t => t.id === i.type) || { label: i.type }).label}{i.downtime ? ` · ${i.downtime} phút` : ""}{i.result ? <div className="muted">{i.result}</div> : null}</div>)}
            {c.status !== "departed" && <button className="btn btn-sm ghost" style={{ marginTop: 6 }} onClick={() => setCause({ c, kind: "wait", hrs: rvHrs(c.ata, c.atb) || 0, type: "berth" })}>+ Ghi nguyên nhân chờ / trễ</button>}
            <div className="muted" style={{ fontSize: 11.5, margin: "12px 0 4px" }}>Thông báo đã gửi · {op.contact}</div>
            {(c.notices || []).length === 0 && <div className="muted">Chưa có</div>}
            {(c.notices || []).slice(0, 5).map((n, i) => <div key={i} style={{ fontSize: 12, padding: "3px 0", borderBottom: "1px dashed var(--line)" }}><span className="mono muted">{n.at.slice(0, 5)} {n.at.slice(-5)}</span> · {n.text}</div>)}
          </div>
        </div>
      </div>);
  };

  return (
    <div className="page" style={{ maxWidth: 1560 }}>
      <div className="page-head">
        <div><h1>River gate</h1><div className="sub">Kế hoạch cầu bến & lượt cập sà lan · đăng ký lượt cập từ nhà sà lan · thông báo · báo cáo chờ cầu / làm hàng / đúng giờ · cont lên/xuống sà lan tự ghi gate in/out</div></div>
        
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 10, marginBottom: 14 }}>
        {[["Lượt cập đang làm hàng", DD_CALLS.filter(c => c.status === "working").length, "lượt"], ["Kế hoạch sắp tới", DD_CALLS.filter(c => c.status === "planned").length, "lượt"], ["Đăng ký chờ duyệt", pend.length, "yêu cầu", pend.length ? "var(--st-warning)" : undefined], ["Chờ cầu trung bình", rvNum(all.wait), "giờ / lượt"], ["Sà lan đến đúng giờ (±2h)", Math.round(all.ontime * 100) + "%", `${all.n} lượt gần đây`]].map(([l, v, d, col]) => (
          <div key={l} className="card" style={{ padding: "10px 14px" }}><div className="muted" style={{ fontSize: 11.5 }}>{l}</div><div style={{ fontSize: 20, fontWeight: 700, color: col }}>{v}</div><div className="muted" style={{ fontSize: 11 }}>{d}</div></div>))}
      </div>

      <div className="card">
        <DdTabs tab={tab} setTab={setTab} tabs={[["plan", "Kế hoạch cầu bến", DD_CALLS.filter(c => c.status !== "departed").length], ["calls", "Lượt cập", DD_CALLS.length], ["report", "Báo cáo", all.n], ["notice", "Thông báo", RV_NOTICES.length], ["captain", "Màn thuyền trưởng", ""], ["nocall", "Chưa có lượt cập", DD_GATE_LOG.filter(g => g.ch === "river" && !g.call && g.result === "ok").length]]} />
        <div style={{ padding: tab === "plan" ? 0 : 14 }}>
          {tab === "plan" && <DdRiverScreen go={go} embed onPick={(id) => setSel(id)} />}
          {tab === "calls" && (
            <div className="tbl-wrap"><table className="tbl">
              <thead><tr><th>Lượt</th><th>Sà lan · chuyến</th><th>Nhà sà lan</th><th>Bến</th><th>Dự kiến đến → rời</th><th>Đến · cập · rời (thực tế)</th><th style={{ textAlign: "right" }}>Chờ cầu</th><th>Xếp / dỡ</th><th>Trạng thái</th></tr></thead>
              <tbody>{calls.map(c => { const L = rvLists(c); const st = DD_CALL_STATUS[c.status]; return (
                <tr key={c.id} style={{ cursor: "pointer", background: sel === c.id ? "var(--st-info-bg, #EEF4FB)" : undefined }} onClick={() => setSel(c.id)}>
                  <td className="mono" style={{ fontSize: 12 }}>{c.id}</td><td style={{ fontSize: 12.5 }}><b>{c.barge}</b><div className="muted mono" style={{ fontSize: 11 }}>{c.voyage}</div></td>
                  <td style={{ fontSize: 12, whiteSpace: "nowrap" }}>{rvOp(c.op).short}{rvOp(c.op).internal ? "" : " · ngoài"}</td><td className="mono">{c.berth}</td>
                  <td className="mono" style={{ fontSize: 12 }}>{rvFmt(c.eta)} → {rvFmt(c.etd)}</td>
                  <td className="mono" style={{ fontSize: 12 }}>{rvFmt(c.ata)} · {rvFmt(c.atb)} · {rvFmt(c.atd)}</td>
                  <td className="mono" style={{ textAlign: "right" }}>{rvNum(rvHrs(c.ata, c.atb))} h</td>
                  <td style={{ fontSize: 12 }}>{L.bulk ? "Hàng rời" : `${L.load.length ? `xếp ${L.load.length}` : ""}${L.dis.length ? `dỡ ${L.dis.length}` : ""}` || "—"}</td>
                  <td><span className={`badge ${st[0]}`}>{st[1]}</span></td></tr>); })}</tbody></table></div>
          )}
          {tab === "reqs" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <div className="muted" style={{ fontSize: 12.5 }}>Nhà sà lan (VNL và bên ngoài) xem khung giờ trống của bến rồi đăng ký. KHTH duyệt, đề xuất giờ khác hoặc từ chối; nhà sà lan nhận thông báo. Sà lan bên ngoài được thêm vào danh mục phương tiện khi duyệt (BR-DD-08).</div>
              {RV_REQS.map(r => { const st = RV_REQ_ST[r.status]; const conf = ddCallConflicts({ ...r, id: "x" }).filter(x => x.x.status !== "departed"); const dur = rvH(r.etd) - rvH(r.eta); const alt = rvFreeSlots(r.berth, dur, rvH(r.eta), 3); return (
                <div key={r.id} className="card" style={{ padding: 14 }}>
                  <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                    <div style={{ flex: 1, fontSize: 12.5 }}>
                      <div><span className={`badge ${st[0]}`}>{st[1]}</span> <b className="mono">{r.id}</b> · <b>{r.barge}</b> · {rvOp(r.op).name}{rvOp(r.op).internal ? "" : <span className="badge neutral" style={{ marginLeft: 6 }}>Bên ngoài</span>}</div>
                      <div style={{ marginTop: 4 }}>Xin cập <b className="mono">{r.berth}</b> · <span className="mono">{rvFmt(r.eta)} → {rvFmt(r.etd)}</span> ({rvNum(dur)} giờ) · Chủ hàng: {r.customer ? ddCusShort(r.customer) : (r.owner || "—")}{r.ref ? ` · ${r.ref}` : ""}{r.src === "portal" ? " · gửi qua Cổng đối tác" : ""} · {r.bulk || `dỡ ${r.dis} · xếp ${r.load} cont`}{r.list && r.list.length ? ` · kèm danh sách ${r.list.length} số cont` : ""}</div>
                      <div className="muted" style={{ marginTop: 2 }}>Gửi {r.at}{r.note ? ` · ${r.note}` : ""}{r.call ? ` · lượt cập ${r.call}` : ""}{r.why ? ` · lý do: ${r.why}` : ""}</div>
                      {r.status === "pending" && <div className="row" style={{ gap: 6, marginTop: 6, alignItems: "center" }}><span className="muted">Gắn job:</span><select className="select" style={{ height: 28, fontSize: 12, maxWidth: 360 }} value={r.job || ""} onChange={e => { r.job = e.target.value || null; refresh(); }}><option value="">— Tự khớp theo khách hàng —</option>{DD_JOBS.filter(j => ["planned", "running"].includes(j.status) && ["bp", "icd"].includes(j.service)).map(j => <option key={j.id} value={j.id}>{j.id} · {ddCusShort(j.customer)} · {j.cargo}</option>)}</select></div>}
                      {r.status === "pending" && conf.length > 0 && <div style={{ color: "var(--st-danger)", marginTop: 4 }}>⚠ Trùng bến với {conf.map(x => `${x.x.barge} (${rvFmt(x.x.eta)} → ${rvFmt(x.x.etd)})`).join(", ")}</div>}
                      {r.status === "pending" && counter === r.id && <div style={{ marginTop: 8 }}>Khung giờ trống gần nhất tại {r.berth}: {alt.map(s => <button key={s[0]} className="btn btn-sm" style={{ marginRight: 6 }} onClick={() => approve(r, s)}>{rvFmt(rvFromH(s[0]))} → {rvFmt(rvFromH(s[1]))}</button>)}</div>}
                      {r.status === "pending" && rej === r.id && <div className="row" style={{ gap: 6, marginTop: 8 }}><input id={`rj-${r.id}`} className="input" style={{ flex: 1 }} placeholder="Lý do từ chối" /><button className="btn btn-sm danger" onClick={() => { const v = document.getElementById(`rj-${r.id}`).value.trim(); if (v) reject(r, v); }}>Từ chối</button></div>}
                    </div>
                    {r.status === "pending" && <div className="row" style={{ gap: 6 }}>
                      <button className="btn btn-sm ghost" onClick={() => setRej(rej === r.id ? null : r.id)}>Từ chối</button>
                      <button className="btn btn-sm" onClick={() => setCounter(counter === r.id ? null : r.id)}>Đề xuất giờ khác</button>
                      <button className="btn btn-sm primary" disabled={conf.length > 0} title={conf.length ? "Trùng bến — đề xuất giờ khác" : ""} onClick={() => approve(r)}>Duyệt</button>
                    </div>}
                  </div>
                </div>); })}
            </div>
          )}
          {tab === "report" && (() => {
            const byOp = RV_OPERATORS.map(o => ({ o, ...agg(hist.filter(x => x.op === o.id)) })).filter(x => x.n);
            const byB = [...new Set(hist.map(x => x.berth))].sort().map(b => ({ b, ...agg(hist.filter(x => x.berth === b)) }));
            return (<div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div><h3 style={{ marginTop: 0 }}>Theo nhà sà lan</h3><table className="tbl"><thead><tr><th>Nhà sà lan</th><th style={{ textAlign: "right" }}>Lượt</th><th style={{ textAlign: "right" }}>Đúng giờ</th><th style={{ textAlign: "right" }}>Chờ cầu TB</th><th style={{ textAlign: "right" }}>Làm hàng TB</th></tr></thead>
                <tbody>{byOp.map(x => <tr key={x.o.id}><td style={{ fontSize: 12.5 }}>{x.o.name}</td><td className="mono" style={{ textAlign: "right" }}>{x.n}</td><td className="mono" style={{ textAlign: "right", color: x.ontime < 0.7 ? "var(--st-danger)" : undefined }}>{Math.round(x.ontime * 100)}%</td><td className="mono" style={{ textAlign: "right" }}>{rvNum(x.wait)} h</td><td className="mono" style={{ textAlign: "right" }}>{rvNum(x.work)} h</td></tr>)}</tbody></table></div>
              <div><h3 style={{ marginTop: 0 }}>Theo bến</h3><table className="tbl"><thead><tr><th>Bến</th><th style={{ textAlign: "right" }}>Lượt</th><th style={{ textAlign: "right" }}>Chờ cầu TB</th><th style={{ textAlign: "right" }}>Làm hàng TB</th><th>Chờ cầu</th></tr></thead>
                <tbody>{byB.map(x => <tr key={x.b}><td className="mono">{x.b}</td><td className="mono" style={{ textAlign: "right" }}>{x.n}</td><td className="mono" style={{ textAlign: "right" }}>{rvNum(x.wait)} h</td><td className="mono" style={{ textAlign: "right" }}>{rvNum(x.work)} h</td><td><div style={{ height: 8, width: Math.min(140, x.wait * 30), background: x.wait > 2.5 ? "#E5735C" : "#0E7490", borderRadius: 3 }}></div></td></tr>)}</tbody></table></div>
              {(() => { const li = DD_INCIDENTS.filter(i => rvCallOf(i)); const by = TL_INC_TYPES.map(t => ({ t, n: li.filter(i => i.type === t.id).length, m: li.filter(i => i.type === t.id).reduce((s, i) => s + (i.downtime || 0), 0) })).filter(x => x.n).sort((a, b) => b.m - a.m); return (
                <div style={{ gridColumn: "1 / -1" }}><h3 style={{ margin: "4px 0 8px" }}>Nguyên nhân chờ / trễ <span className="muted" style={{ fontSize: 12, fontWeight: 400 }}>— sự cố gắn với lượt cập</span></h3>
                  <table className="tbl"><thead><tr><th>Nguyên nhân</th><th style={{ textAlign: "right" }}>Số lần</th><th style={{ textAlign: "right" }}>Tổng thời gian</th><th></th></tr></thead>
                  <tbody>{by.length === 0 && <tr><td colSpan={4} className="muted">Chưa có</td></tr>}{by.map(x => <tr key={x.t.id}><td>{x.t.label}</td><td className="mono" style={{ textAlign: "right" }}>{x.n}</td><td className="mono" style={{ textAlign: "right" }}>{rvNum(x.m / 60)} giờ</td><td><div style={{ height: 8, width: Math.min(200, x.m / 2), background: ["late"].includes(x.t.id) ? "#F59E0B" : "#0E7490", borderRadius: 3 }}></div></td></tr>)}</tbody></table>
                  <div className="muted" style={{ fontSize: 11.5, marginTop: 4 }}>"Sà lan đến trễ" thuộc phía nhà sà lan; "Chờ cầu / bến bận", "Thiết bị hỏng" thuộc phía cảng.</div></div>); })()}
              <div className="muted" style={{ fontSize: 11.5, gridColumn: "1 / -1" }}>Chờ cầu = cập cầu − đến khu neo · Làm hàng = rời cầu − cập cầu · Đúng giờ = đến lệch dự kiến không quá 2 giờ. Lịch sử 20–31/10 là dữ liệu mẫu.</div>
            </div>);
          })()}
          {tab === "notice" && (
            <div className="tbl-wrap"><table className="tbl"><thead><tr><th style={{ width: 130 }}>Thời gian</th><th style={{ width: 110 }}>Lượt / đăng ký</th><th style={{ width: 260 }}>Gửi tới</th><th>Nội dung</th></tr></thead>
              <tbody>{RV_NOTICES.length === 0 && <tr><td colSpan={4} className="muted" style={{ textAlign: "center", padding: 24 }}>Chưa có thông báo. Duyệt đăng ký, đổi giờ hoặc ghi mốc thực tế sẽ tự gửi thông báo cho nhà sà lan.</td></tr>}
                {RV_NOTICES.map((n, i) => <tr key={i}><td className="mono" style={{ fontSize: 12 }}>{n.at}</td><td className="mono" style={{ fontSize: 12 }}>{n.call}</td><td style={{ fontSize: 12 }}>{n.to}</td><td style={{ fontSize: 12.5 }}>{n.text}</td></tr>)}</tbody></table></div>
          )}
          {tab === "acc" && window.DdPartnerAccounts && <DdPartnerAccounts flash={flash} />}
          {tab === "nocall" && (() => { const rows = DD_GATE_LOG.filter(g => g.ch === "river" && !g.call && g.result === "ok"); return (<>
            <div className="muted" style={{ fontSize: 12.5, marginBottom: 10 }}>Gate In / Gate Out kênh sông mà lệnh ca chưa gắn lượt cập. Chọn lượt cập để gắn: cont được thêm vào danh sách của lượt, báo cáo River gate tự cộng lại.</div>
            {rows.length === 0 ? <div className="muted" style={{ fontSize: 12.5 }}>Không có bản ghi nào.</div> : (
            <div className="tbl-wrap"><table className="tbl"><thead><tr><th>Giờ</th><th>Cont</th><th>Chiều</th><th>Job</th><th>Tally</th><th style={{ width: 320 }}>Gắn lượt cập</th></tr></thead>
              <tbody>{rows.map(g => { const opts = DD_CALLS.filter(c => c.status !== "departed" || c.job === g.job); return (
                <tr key={g.id}><td className="mono" style={{ fontSize: 12 }}>{g.at.slice(-5)}</td><td className="mono" style={{ fontSize: 12 }}>{tlContFmt(g.no)}</td><td>{g.dir === "in" ? "Gate In" : "Gate Out"}</td><td className="mono" style={{ fontSize: 12 }}>{g.job}</td><td style={{ fontSize: 12 }}>{ddPerson(g.by).name}</td>
                  <td><select className="select" style={{ height: 30, fontSize: 12 }} value="" onChange={e => { const c = DD_CALLS.find(x => x.id === e.target.value); if (!c) return; g.call = c.id; c.conts = c.conts || []; if (!c.conts.includes(g.no)) c.conts.push(g.no); (DD_RECORDS.find(r => r.cont === g.no && !r.call) || {}).call = c.id; force(x => x + 1); flash(`Đã gắn ${tlContFmt(g.no)} vào ${c.id}`); }}>
                    <option value="">— Chọn lượt cập —</option>{opts.sort((a, b) => (b.job === g.job) - (a.job === g.job)).map(c => <option key={c.id} value={c.id}>{c.id} · {c.barge} · {c.berth}{c.job === g.job ? " · cùng job" : ""}</option>)}</select></td></tr>); })}</tbody></table></div>)}
          </>); })()}
          {tab === "captain" && (() => {
            const mine = calls.filter(c => c.barge === capBarge); const bs = [...new Set(DD_CALLS.map(c => c.barge))];
            return (<div style={{ display: "flex", gap: 24, alignItems: "flex-start" }}>
              <RvPhone>
                <div style={{ padding: 14 }}>
                  <select className="select" value={capBarge} onChange={e => setCapBarge(e.target.value)} style={{ width: "100%", marginBottom: 10 }}>{bs.map(b => <option key={b}>{b}</option>)}</select>
                  <div style={{ fontSize: 12, color: "#64748B", marginBottom: 6 }}>Vòng quay của tôi · {rvOp(rvBargeOp(capBarge)).name}</div>
                  {mine.length === 0 && <div style={{ fontSize: 13, color: "#64748B" }}>Chưa có lượt cập</div>}
                  {mine.map(c => { const st = DD_CALL_STATUS[c.status]; const L = rvLists(c); return (
                    <div key={c.id} style={{ background: "#fff", borderRadius: 12, padding: 12, marginBottom: 10, border: "1px solid #E2E8F0" }}>
                      <div style={{ display: "flex", justifyContent: "space-between" }}><b style={{ fontSize: 15 }}>{c.berth}</b><span className={`badge ${st[0]}`}>{st[1]}</span></div>
                      <div style={{ fontSize: 12.5, marginTop: 4 }}>Cập {rvFmt(c.eta)} → rời {rvFmt(c.etd)}</div>
                      <div style={{ fontSize: 12, color: "#64748B" }}>{L.bulk || `${L.dis.length ? `Dỡ ${L.dis.length} cont` : ""}${L.load.length ? `Xếp ${L.load.length} cont` : ""}` || "—"}</div>
                      {c.notices && c.notices[0] && <div style={{ fontSize: 11.5, marginTop: 6, background: "#FEF3C7", padding: "4px 8px", borderRadius: 6 }}>{c.notices[0].text}</div>}
                      {c.status === "planned" && !c.ata && <button className="btn primary" style={{ width: "100%", marginTop: 8 }} onClick={() => mark(c, "ata")}>Báo đã đến khu neo</button>}
                    </div>); })}
                </div>
              </RvPhone>
              <div className="muted" style={{ fontSize: 12.5, maxWidth: 420 }}>Thuyền trưởng xem lịch các lượt cập của sà lan mình, thông báo đổi giờ mới nhất, và bấm "Báo đã đến khu neo" khi tới nơi. Mốc đến này được dùng để tính thời gian chờ cầu.</div>
            </div>);
          })()}
        </div>
      </div>
      {cur && tab !== "captain" && tab !== "reqs" && <CallCard c={cur} />}

      {portal && (() => {
        const slots = rvFreeSlots(portal.berth, portal.dur, 0, 6);
        return (
        <div className="modal-overlay" onClick={() => setPortal(null)}>
          <div className="modal" style={{ width: 720 }} onClick={e => e.stopPropagation()}>
            <div className="modal-head"><h3>Cổng nhà sà lan · Đăng ký lượt cập</h3><button className="icon-btn" onClick={() => setPortal(null)}><Icon name="x" size={16}/></button></div>
            <div className="modal-body">
              <div className="muted" style={{ fontSize: 12, marginBottom: 8 }}>Màn mô phỏng phía nhà sà lan: xem lịch bến công khai và khung giờ còn trống, chọn giờ rồi gửi đăng ký.</div>
              <div className="field-row">
                <div className="field"><label>Nhà sà lan</label><select className="select" value={portal.op} onChange={e => setPortal(p => ({ ...p, op: e.target.value }))}>{RV_OPERATORS.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}</select></div>
                <div className="field"><label>Sà lan</label><input className="input" value={portal.barge} onChange={e => setPortal(p => ({ ...p, barge: e.target.value.toUpperCase() }))} /></div>
              </div>
              <div className="field-row">
                <div className="field"><label>Bến</label><select className="select" value={portal.berth} onChange={e => setPortal(p => ({ ...p, berth: e.target.value, slot: null }))}>{DD_BERTHS.map(b => <option key={b}>{b}</option>)}</select></div>
                <div className="field"><label>Thời gian làm hàng dự kiến (giờ)</label><input className="input mono" value={portal.dur} onChange={e => setPortal(p => ({ ...p, dur: Math.max(1, Number(e.target.value.replace(/\D/g, "")) || 1), slot: null }))} /></div>
              </div>
              <div className="field"><label>Khung giờ trống tại {portal.berth}</label><div className="row" style={{ gap: 6, flexWrap: "wrap" }}>{slots.map(s => <button key={s[0]} className={`btn btn-sm ${portal.slot && portal.slot[0] === s[0] ? "primary" : ""}`} onClick={() => setPortal(p => ({ ...p, slot: s }))}>{rvFmt(rvFromH(s[0]))} → {rvFmt(rvFromH(s[1]))}</button>)}</div></div>
              <div className="field-row">
                <div className="field"><label>Khách hàng / chủ hàng</label><select className="select" value={portal.customer} onChange={e => setPortal(p => ({ ...p, customer: e.target.value }))}>{(window.KD_CUSTOMERS || []).map(c => <option key={c.id} value={c.id}>{c.shortName || c.name}</option>)}</select></div>
                <div className="field"><label>Cont dỡ · cont xếp</label><div className="row" style={{ gap: 6 }}><input className="input mono" value={portal.dis} onChange={e => setPortal(p => ({ ...p, dis: Number(e.target.value.replace(/\D/g, "")) || 0 }))} /><input className="input mono" value={portal.load} onChange={e => setPortal(p => ({ ...p, load: Number(e.target.value.replace(/\D/g, "")) || 0 }))} /></div></div>
              </div>
              <div className="field"><label>Danh sách số cont <span className="opt">— dán từ Excel, mỗi dòng 1 cont; đối chiếu với danh sách cont của job khi duyệt</span></label><textarea className="textarea mono" rows={3} value={portal.list || ""} onChange={e => setPortal(p => ({ ...p, list: e.target.value }))} placeholder="TGHU8123009&#10;SEGU5041104" />{portal.list && (() => { const xs = portal.list.split(/\s+/).filter(Boolean).map(ddContCheck); return <div style={{ fontSize: 12, marginTop: 4 }}>{xs.filter(x => x.ok).length} số cont hợp lệ{xs.some(x => !x.ok) ? <span style={{ color: "var(--st-danger)" }}> · {xs.filter(x => !x.ok).length} dòng sai</span> : ""}</div>; })()}</div>
              <div className="field"><label>Ghi chú / hàng rời</label><input className="input" value={portal.note} onChange={e => setPortal(p => ({ ...p, note: e.target.value }))} placeholder="VD: hàng rời clinker 1.200 tấn; danh sách cont gửi kèm Excel" /></div>
            </div>
            <div className="modal-foot"><button className="btn ghost" onClick={() => setPortal(null)}>Huỷ</button><button className="btn primary" disabled={!portal.slot || !portal.barge.trim()} onClick={() => {
              const id = ddNewId("DK");
              RV_REQS.unshift({ id, op: portal.op, barge: portal.barge.trim(), berth: portal.berth, eta: rvFromH(portal.slot[0]), etd: rvFromH(portal.slot[1]), customer: portal.customer, dis: portal.dis, load: portal.load, bulk: null, note: portal.note, at: ddNow(), status: "pending", list: (portal.list || "").split(/\s+/).filter(Boolean).map(ddContCheck).filter(x => x.ok).map(x => x.no) });
              setPortal(null); setTab("reqs"); refresh(`Đã gửi đăng ký ${id} · chờ KHTH duyệt`);
            }}>Gửi đăng ký</button></div>
          </div>
        </div>); })()}
      {cause && (
        <div className="modal-overlay" onClick={() => setCause(null)}>
          <div className="modal" style={{ width: 560 }} onClick={e => e.stopPropagation()}>
            <div className="modal-head"><h3>Nguyên nhân {cause.kind === "late" ? "sà lan đến trễ" : "chờ cầu"} · {cause.c.id}</h3><button className="icon-btn" onClick={() => setCause(null)}><Icon name="x" size={16}/></button></div>
            <div className="modal-body">
              <div style={{ fontSize: 13, marginBottom: 10 }}>{cause.c.barge} {cause.kind === "late" ? "đến lệch dự kiến" : "chờ cầu"} <b>{rvNum(cause.hrs)} giờ</b>. Nguyên nhân được ghi thành <b>Sự cố</b> (module Sự cố) và gắn với lượt cập này để báo cáo.</div>
              <div className="field"><label>Nguyên nhân</label><div className="row" style={{ gap: 6, flexWrap: "wrap" }}>{TL_INC_TYPES.map(t => <button key={t.id} className={`btn btn-sm ${cause.type === t.id ? "primary" : ""}`} onClick={() => setCause(x => ({ ...x, type: t.id }))}>{t.label}</button>)}</div></div>
              <div className="field"><label>Ghi chú</label><input className="input" value={cause.note || ""} onChange={e => setCause(x => ({ ...x, note: e.target.value }))} placeholder="VD: BP-09 còn tàu lai làm hàng" /></div>
              {rvIncOf(cause.c).length > 0 && <div className="muted" style={{ fontSize: 12 }}>Lượt này đã có: {rvIncOf(cause.c).map(i => `${i.id} (${(TL_INC_TYPES.find(t => t.id === i.type) || {}).label})`).join(", ")}</div>}
            </div>
            <div className="modal-foot"><button className="btn ghost" onClick={() => setCause(null)}>Bỏ qua</button><button className="btn primary" onClick={saveCause}>Ghi vào Sự cố</button></div>
          </div>
        </div>
      )}
      {pick && (() => { const c = pick.c; const j = DD_JOBS.find(x => x.id === c.job); const pool = (j && j.conts || []).filter(x => !DD_CALLS.some(y => y.id !== c.id && (y.conts || []).includes(x.no))); const teu = rvTeu(pick.sel); const barge = DD_VEHICLES.find(v => v.plate === c.barge); return (
        <div className="modal-overlay" onClick={() => setPick(null)}>
          <div className="modal" style={{ width: 640 }} onClick={e => e.stopPropagation()}>
            <div className="modal-head"><h3>Chọn cont cho lượt {c.id} · từ {c.job}</h3><button className="icon-btn" onClick={() => setPick(null)}><Icon name="x" size={16}/></button></div>
            <div className="modal-body">
              <div className="muted" style={{ fontSize: 12, marginBottom: 8 }}>Danh sách cont đã nhập khi tạo kế hoạch job. Cont đã gắn lượt cập khác không hiện ở đây.</div>
              <div className="row" style={{ gap: 8, marginBottom: 6, flexWrap: "wrap" }}><button className="btn btn-sm" onClick={() => setPick(p => ({ ...p, sel: pool.filter(x => x.status !== "done").map(x => x.no) }))}>Chọn tất cả cont chưa làm</button><button className="btn btn-sm ghost" onClick={() => setPick(p => ({ ...p, sel: [] }))}>Bỏ chọn</button>{[...new Set(pool.filter(x => x.status !== "done" && x.dest).map(x => x.dest))].map(d => <button key={d} className="btn btn-sm" onClick={() => setPick(p => ({ ...p, sel: [...new Set([...p.sel, ...pool.filter(x => x.status !== "done" && x.dest === d).map(x => x.no)])] }))}>+ Cảng đích {d} ({pool.filter(x => x.status !== "done" && x.dest === d).length})</button>)}<span style={{ marginLeft: "auto", fontSize: 12.5 }}><b>{pick.sel.length}</b> cont · {teu} TEU{barge && barge.cap < 200 ? ` / ${barge.cap} TEU` : ""}{barge && barge.cap < 200 && teu > barge.cap ? <span style={{ color: "var(--st-danger)" }}> · vượt sức chở</span> : ""}</span></div>
              <div style={{ maxHeight: 320, overflowY: "auto", border: "1px solid var(--line)", borderRadius: 6 }}>{pool.map(x => <label key={x.no} style={{ display: "flex", gap: 8, padding: "4px 10px", borderBottom: "1px dashed var(--line)", fontSize: 12.5, alignItems: "center" }}><input type="checkbox" checked={pick.sel.includes(x.no)} onChange={() => setPick(p => ({ ...p, sel: p.sel.includes(x.no) ? p.sel.filter(y => y !== x.no) : [...p.sel, x.no] }))} /><span className="mono">{tlContFmt(x.no)}</span><span className="muted">{x.type} · {x.fe === "F" ? "FCL" : "MTY"} · {DD_DIR_SHORT[ddCDir(x, j)]}{x.dest ? ` · đi ${x.dest}` : ""}{x.seal ? ` · seal ${x.seal}` : ""}</span>{x.status === "done" && <span className="badge success" style={{ marginLeft: "auto" }}>Đã làm</span>}</label>)}</div>
            </div>
            <div className="modal-foot"><button className="btn ghost" onClick={() => setPick(null)}>Huỷ</button><button className="btn primary" onClick={() => { c.conts = [...pick.sel]; rvNotify(c, `Cập nhật danh sách cont ${c.id}: ${pick.sel.length} cont`); setPick(null); refresh("Đã cập nhật danh sách cont của lượt"); }}>Lưu</button></div>
          </div>
        </div>); })()}
      <KdToast text={toast} />
    </div>
  );
};

Object.assign(window, { DdRiverGateScreen, RV_REQS, RV_OPERATORS, RV_NOTICES, rvFreeSlots });
