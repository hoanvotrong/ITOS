/* App Tally (mobile) — 1 app dùng chung, vai trò theo tài khoản (D5)
   v0.2 (02/11): chưa kết nối trạm cân.
   · Hàng rời: chọn biển số phương tiện → nhập số theo đơn vị tính của kế hoạch → xác nhận
   · Container xuất: chọn số cont → chọn xe đầu kéo → xác nhận
   · Container nhập lưu bãi: chọn số cont → xác nhận */

const TL_INC_TYPES = [
  { id: "equip", label: "Thiết bị hỏng", icon: "settings" }, { id: "weather", label: "Thời tiết", icon: "alert" },
  { id: "cargo", label: "Hàng hư hỏng", icon: "package" }, { id: "safety", label: "An toàn / tai nạn", icon: "shield" },
  { id: "wait", label: "Chờ phương tiện", icon: "clock" }, { id: "scale", label: "Sai lệch số liệu", icon: "flag" },
  { id: "berth", label: "Chờ cầu / bến bận", icon: "anchor" }, { id: "late", label: "Sà lan đến trễ", icon: "ship" }, { id: "docs", label: "Chờ thủ tục / chứng từ", icon: "document" },
];
const TL_INC_NOTES = ["Dừng làm hàng", "Làm chậm", "Cần kỹ thuật", "Cần KHTH xuống hiện trường", "Đã báo trưởng ca", "Cont/xe không có trong danh sách"];

/* Giờ thật GMT+7 (thay đồng hồ giả lập của prototype). Tham số bước cũ bị bỏ qua. */
const tlClock = () => window.ddVnNow().time;
const tlFmt = (n, unit) => ddQty(n, unit); /* sản lượng: luôn 2 chữ số thập phân (trừ số cont) */
const tlContFmt = (no) => `${no.slice(0, 4)} ${no.slice(4, 10)} ${no.slice(10)}`;

/* Dữ liệu nạp từ dd_docs (không còn dữ liệu mẫu) */
const DD_RECORDS = DD_BOOT.docs.records;
const DD_EDIT_REQS = DD_BOOT.docs.edit_reqs;
const DD_INCIDENTS = DD_BOOT.docs.incidents;


/* ===== Sự cố dừng việc · thời gian lỗi theo cẩu · mã tài xế theo lệnh ca (v61, chốt 11/11) ===== */
const DD_STOP_TYPES = ["equip", "weather", "safety", "wait", "berth", "late", "docs"];
TL_INC_TYPES.forEach(t => { t.stop = DD_STOP_TYPES.includes(t.id); });
const ddMs = (at) => { const [d, t = "00:00"] = String(at).split(" "); const [dd, mm, yy] = d.split("/").map(Number); const [h, m] = t.split(":").map(Number); return new Date(yy, mm - 1, dd, h || 0, m || 0).getTime(); };
const ddNowAt = () => window.ddVnNow().at;
const ddCranes = (o) => ((o && o.equip) || []).filter(e => !/^Gàu/i.test(e));
const ddIncStop = (i) => !!(TL_INC_TYPES.find(t => t.id === i.type) || {}).stop && !!i.eq;
/* Thời gian lỗi = từ lúc báo đến bản ghi tiếp theo của cùng cẩu; kết ca trước thì tính đến lúc kết ca */
const ddIncDown = (i) => {
  if (!ddIncStop(i)) return null;
  if (i.downFix != null) return { start: i.at, end: null, why: "dữ liệu cũ", open: false, mins: i.downFix, fix: true };
  const s = ddMs(i.at);
  const nx = DD_RECORDS.filter(r => r.eq === i.eq && r.status !== "void" && ddMs(r.at) > s).sort((a, b) => ddMs(a.at) - ddMs(b.at))[0];
  const o = DD_ORDERS.find(x => x.id === i.order);
  const ke = o && o.endAt && ddMs(o.endAt) > s ? o.endAt : null;
  let end, why;
  if (nx && (!ke || ddMs(nx.at) <= ddMs(ke))) { end = nx.at; why = "bản ghi tiếp theo"; }
  else if (ke) { end = ke; why = "kết ca"; }
  else { end = ddNowAt(); why = "đang dừng"; }
  return { start: i.at, end, why, open: why === "đang dừng", mins: Math.max(0, Math.round((ddMs(end) - s) / 60000)) };
};
const ddUnion = (iv) => { const out = []; [...iv].sort((a, b) => a[0] - b[0]).forEach(x => { const l = out[out.length - 1]; if (l && x[0] <= l[1]) l[1] = Math.max(l[1], x[1]); else out.push([...x]); }); return out; };
const ddDownByEq = (incs, clip) => { const m = {}; incs.forEach(i => { const d = ddIncDown(i); if (!d) return; const e = (m[i.eq] = m[i.eq] || { iv: [], fix: 0 }); if (d.fix) { e.fix += d.mins; return; } let a = ddMs(d.start), b = ddMs(d.end); if (clip) { a = Math.max(a, clip[0]); b = Math.min(b, clip[1]); } if (b > a) e.iv.push([a, b]); }); return Object.entries(m).map(([eq, v]) => ({ eq, mins: Math.round(v.fix + ddUnion(v.iv).reduce((t, x) => t + (x[1] - x[0]) / 60000, 0)) })); };
const ddFmtMin = (m) => { m = Math.round(m || 0); return m >= 60 ? `${Math.floor(m / 60)} giờ${m % 60 ? ` ${m % 60} phút` : ""}` : `${m} phút`; };
const ddJobDown = (jobId) => { const incs = DD_INCIDENTS.filter(i => i.job === jobId); const byEq = ddDownByEq(incs); const byType = TL_INC_TYPES.filter(t => t.stop).map(t => ({ ...t, mins: incs.filter(i => i.type === t.id).reduce((s, i) => s + ((ddIncDown(i) || {}).mins || 0), 0) })).filter(x => x.mins); return { total: byEq.reduce((t, x) => t + x.mins, 0), byEq, byType, open: incs.filter(i => (ddIncDown(i) || {}).open).length }; };
const ddOrderOpen = (o) => ["sent", "running"].includes(o.status);
const ddEndShift = (o, by) => {
  o.status = "done"; o.endAt = ddNowAt(); o.endBy = by;
  /* sản lượng của ca gửi lên Chờ duyệt */
  const recs = DD_RECORDS.filter(r => r.order === o.id && r.status === "shift");
  recs.forEach(r => { r.status = "pending"; r.subAt = o.endAt; });
  (o.log = o.log || []).unshift({ at: o.endAt, by, text: `Kết ca · ${recs.length} bản ghi gửi văn phòng duyệt · mã tài xế ${o.drvCode || "—"} hết hiệu lực` });
  const jj = DD_JOBS.find(x => x.id === o.job); const u = ddUnit(jj);
  ddJobLog(jj, `Kết ca ${o.id} (${DD_SHIFTS[o.shift - 1].label} ${o.date}) · ${recs.length} bản ghi · ${ddQty(recs.reduce((t, r) => t + r.qty, 0), u)} ${u} gửi văn phòng duyệt`, by);
};

const tlMode = (job) => job.kind === "cont" ? "cont" : "bulk";
const TL_CH = { river: "Sà lan (kênh sông)", road: "Cổng bộ" };
const tlSim = (lo, hi) => Math.round((lo + Math.random() * (hi - lo)) * 100) / 100;
const tlNeedApprove = (job) => true; /* pilot (12/11): mọi dịch vụ — sản lượng gửi văn phòng duyệt khi kết ca */
/* Trạng thái bản ghi: "shift" = đang trong ca (chưa gửi duyệt) → kết ca → "pending" (Chờ duyệt) → văn phòng duyệt "ok" */
const ddRecOpenStatus = (o) => o && o.status === "done" ? "pending" : "shift";

/* ============ ĐIỆN THOẠI ============ */
const TlPhone = ({ me, offline, onChange }) => {
  const [st, setSt] = React.useState({ s: "home" });
  const [tab, setTab] = React.useState("today");
  const [pad, setPad] = React.useState("");
  const [w, setW] = React.useState({ f: 1, a: "", b: "", src: "manual" });
  const [yq, setYq] = React.useState("");
  const [q, setQ] = React.useState("");
  const [msg, setMsg] = React.useState(null);
  const [np, setNp] = React.useState({ plate: "", owner: "" }); /* xe ngoài danh sách: tally tự nhập biển */
  const go = (s, extra = {}) => { setSt({ ...extra, s }); };
  const toast = (m) => { setMsg(m); clearTimeout(window.__tlT); window.__tlT = setTimeout(() => setMsg(null), 2000); };
  React.useEffect(() => { setSt({ s: "home" }); }, [me.id]);

  const mine = DD_ORDERS.filter(o => o.tally.includes(me.id) && o.status !== "draft");
  /* pilot: lệnh ngày trước chưa kết ca vẫn hiện để tally kết ca (ca qua nửa đêm) */
  const today = mine.filter(o => o.date === ddToday() || (ddOrderOpen(o) && ddD(o.date) < ddD(ddToday()))).sort((a, b) => ddD(a.date) - ddD(b.date) || a.shift - b.shift);
  const upcoming = mine.filter(o => ddD(o.date) > ddD(ddToday()));
  const o = st.order && DD_ORDERS.find(x => x.id === st.order);
  const job = o && DD_JOBS.find(j => j.id === o.job);
  const mode = job && tlMode(job);
  const recs = o ? DD_RECORDS.filter(r => r.order === o.id && r.status !== "void") : [];
  const myRecs = recs.filter(r => r.by === me.id);
  const caTotal = recs.filter(r => r.status !== "returned").reduce((t, r) => t + r.qty, 0);
  const unit = job ? ddUnit(job) : "";
  const dec = unit !== "cont"; /* mọi đơn vị nhập được 2 chữ số thập phân */

  const openOrder = (ord) => {
    if (!ord.ack.includes(me.id)) { ord.ack.push(me.id); ord.log.unshift({ at: `${ddNow()}`, by: me.id, text: "Tally đã xem lệnh trên app" }); ddJobLog(ord.job, `${me.name} đã xem lệnh ca ${ord.id} trên app`, me.id); onChange(); }
    go("order", { order: ord.id });
  };
  const addRecord = (rec) => {
    const r = { id: ddNewId("R"), order: o.id, call: o.call || null, job: job.id, by: me.id, at: `${ddNow()}`, status: "shift", offline, meth: job.kind === "cont" ? null : ddMeasure(job), raw: rec.qty, eq: o.curEq || ddCranes(o)[0] || null, ...rec };
    DD_RECORDS.push(r);
    job.actual = Math.round((job.actual + r.qty) * 100) / 100;
    if (o.status === "sent") o.status = "running";
    ddJobLog(job, r.cont ? `${o.id} · Gate ${r.gate === "in" ? "In" : "Out"} ${tlContFmt(r.cont)}${r.plate ? ` · xe ${r.plate}` : ""}${r.offList ? " (ngoài DS)" : ""}` : `${o.id} · ghi nhận ${r.plate || ""}: ${tlFmt(r.qty, unit)} ${unit}${r.offList ? " (xe ngoài DS)" : ""}`, me.id);
    window.ddJobTouch?.(job, me.id);
    onChange(); return r;
  };
  /* Xe chưa có trong danh sách lệnh ca: tally tự nhập biển, vẫn ghi nhận sản lượng; tự báo sự cố về KHTH (1 lần / xe / lệnh) */
  const offList = (p) => (o && o.extraVeh || []).some(v => v.plate === p);
  const addOffList = (plate, owner) => {
    if (offList(plate) || o.vehicles.includes(plate)) return;
    const at = ddNow();
    (o.extraVeh = o.extraVeh || []).push({ plate, owner: owner || null, by: me.id, at });
    (o.log = o.log || []).unshift({ at, by: me.id, text: `Tally ghi nhận xe ngoài danh sách ${plate}${owner ? ` · ${owner}` : ""}` });
    const id = ddNewId("SC");
    DD_INCIDENTS.unshift({ id, order: o.id, job: job.id, by: me.id, at, type: "scale", eq: null, plate, missing: "veh", photo: false, status: "open", offline,
      notes: ["Cont/xe không có trong danh sách", `Xe ${plate}${owner ? ` · ${owner}` : ""} — tally đã ghi nhận sản lượng, KHTH kiểm tra / bổ sung vào lệnh ca`],
      log: [{ at, by: me.id, text: "Tự động từ app tally: xe không có trong danh sách lệnh ca" }] });
    ddJobLog(job, `${o.id} · xe ngoài danh sách ${plate}${owner ? ` · ${owner}` : ""} · tự báo sự cố ${id} về KHTH`, me.id);
    onChange();
  };
  const press = (k) => setPad(p => k === "⌫" ? p.slice(0, -1) : k === "," ? (!dec || p.includes(",") || !p ? p : p + ",") : (p.split(",")[1]?.length >= 2 || p.length >= 7 ? p : (p === "0" ? k : p + k)));

  const Bar = ({ title, back, sub }) => (
    <div className="tl-bar">
      {back ? <button className="tl-back" onClick={back}>‹</button> : <span style={{ width: 36 }}></span>}
      <div style={{ flex: 1, minWidth: 0 }}><div className="tl-title">{title}</div>{sub && <div className="tl-sub">{sub}</div>}</div>
      <span style={{ width: 36 }}></span>
    </div>
  );
  const Ctx = () => o ? <div className="tl-ctx"><b>{o.id}</b> · {DD_SHIFTS[o.shift - 1].label} · {ddCusShort(job.customer)} · {job.kind === "cont" ? ddDirLabel(job) : `${job.cargo} (${unit}) · ${DD_MEASURE[ddMeasure(job)]}`}<br/>Tally: {me.name} · tự gắn job/ca/giờ</div> : null;
  const Pad = () => <div className="tl-pad">{["1", "2", "3", "4", "5", "6", "7", "8", "9", dec ? "," : "", "0", "⌫"].map((k, i) => k ? <button key={k} onClick={() => press(k)}>{k}</button> : <span key={i}></span>)}</div>;
  let body;

  /* ---------- HOME ---------- */
  if (st.s === "home") {
    const list = today;
    body = (<>
      <div className="tl-hello">
        <div style={{ fontSize: 13, opacity: .8 }}>Xin chào</div>
        <div style={{ fontSize: 19, fontWeight: 700 }}>{me.name}</div>
        <div style={{ fontSize: 12.5, opacity: .85, marginTop: 2 }}>{me.role} · {window.ddVnNow().weekday} {ddToday()}</div>
      </div>
      <div className="tl-muted" style={{ padding: "10px 16px 0" }}>Ca của tôi · hôm nay ({today.length})</div>
      <div className="tl-scroll">
        {list.length === 0 && <div className="tl-empty">Chưa có lệnh ca nào</div>}
        {list.map(ord => { const j = DD_JOBS.find(x => x.id === ord.job); const isNew = !ord.ack.includes(me.id); const cur = ord.status === "running"; return (
          <button key={ord.id} className={`tl-card ${cur ? "cur" : ""}`} onClick={() => openOrder(ord)}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span className="tl-pill">{DD_SHIFTS[ord.shift - 1].label} · {ord.date.slice(0, 5)}</span>
              {ord.status === "done" ? <span className="tl-muted">Đã kết ca</span> : isNew ? <span className="tl-new">MỚI</span> : cur ? <span className="tl-live">● Đang ca</span> : <span className="tl-muted">Chưa bắt đầu</span>}
            </div>
            <div className="tl-big">{ddCusShort(j.customer)} · {j.kind === "cont" ? `Cont ${Object.keys(ddDirCount(j)).length > 1 ? "hỗn hợp" : DD_DIR_SHORT[j.contDir]}` : j.cargo}</div>
            <div className="tl-muted">{ddSvc(j.service).label} · {ddLoc(j)}</div>
            <div className="tl-muted">Mục tiêu ca: <b>{ddQty(ord.target, ddUnit(j))} {ddUnit(j)}</b></div>
          </button>); })}
      </div>
    </>);
  }

  /* ---------- ORDER ---------- */
  if (st.s === "order" && o) {
    const pct = Math.min(100, Math.round(caTotal / o.target * 100));
    const last = myRecs[myRecs.length - 1];
    const left = job.kind === "cont" ? job.conts.filter(c => c.status !== "done").length : null;
    body = (<>
      <Bar title={`${ddCusShort(job.customer)} · ${DD_SHIFTS[o.shift - 1].label}`} sub={`${o.id} · ${ddSvc(job.service).label}`} back={() => go("home")} />
      <div className="tl-scroll">
        <div className="tl-progress">
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}><span>Sản lượng ca</span><b>{pct}%</b></div>
          <div className="tl-num">{tlFmt(caTotal, unit)} <small>/ {ddQty(o.target, unit)} {unit}</small></div>
          <div className="tl-track"><div style={{ width: pct + "%" }}></div></div>
          <div style={{ fontSize: 12, opacity: .85, marginTop: 6 }}>Lũy kế job: {tlFmt(job.actual, unit)} / {ddQty(job.plan, unit)} {unit}{left != null ? ` · còn ${left} cont` : ""}</div>
        </div>
        {o.note && <div className="tl-note"><b>Chỉ dẫn KHTH:</b> {o.note}</div>}
        {ddCranes(o).length > 0 && <div style={{ margin: "0 0 10px" }}>
          <div className="tl-muted" style={{ marginBottom: 6 }}>Cẩu đang làm {ddCranes(o).length > 1 ? "· bản ghi tự gắn cẩu này" : ""}</div>
          <div className="tl-chips">{ddCranes(o).map(e => { const d = DD_INCIDENTS.find(i => i.order === o.id && i.eq === e && (ddIncDown(i) || {}).open); return <button key={e} className={o.curEq === e ? "on" : ""} disabled={o.status === "done"} onClick={() => { o.curEq = e; onChange(); go("order", { order: o.id }); }}>{e}{d ? " · đang dừng" : ""}</button>; })}</div>
        </div>}
        {o.status === "done" && <div className="tl-note" style={{ background: "#E2E8F0" }}>Ca đã kết lúc {o.endAt.slice(-5)} — không ghi thêm. Mã tài xế của ca đã hết hiệu lực.</div>}
        <div className="tl-info">
          <div><span>{job.kind === "cont" ? "Hướng" : "Hàng"}</span><b>{job.kind === "cont" ? ddDirLabel(job) : `${job.cargo} · ${unit}`}</b></div>
          {job.kind !== "cont" && <div><span>Ghi nhận</span><b>{DD_MEASURE[ddMeasure(job)]}</b></div>}
          <div><span>Vị trí</span><b>{ddLoc(job)}</b></div>
          {o.vehicles.length > 0 && <div><span>Xe của ca</span><b>{o.vehicles.length} xe{o.vehicles.filter(p => ddVeh(p).ext).length ? ` · ${o.vehicles.filter(p => ddVeh(p).ext).length} xe ngoài` : ""}</b></div>}
          <div><span>Thiết bị</span><b>{o.equip.join(", ")}</b></div>
          <div><span>Tài khoản</span><b>{o.tally.map(t => ddPerson(t).name).join(", ")}</b></div>
        </div>
        {o.status === "done" ? null : mode === "bulk" ? (
          <button className="tl-main" onClick={() => { setQ(""); setPad(""); go("veh", { order: o.id }); }}>
            + GHI NHẬN {ddMeasure(job) === "scale" ? "XE QUA CẦU CÂN" : "XE / PHƯƠNG TIỆN"}
            <small>{{ scale: "Chọn xe → nhập lần 1, lần 2 theo phiếu cân", hook: "Chọn sà lan → nhập số cân treo", count: `Chọn phương tiện → nhập số ${unit}`, manual: `Chọn biển số → nhập ${unit}` }[ddMeasure(job)]}</small>
          </button>
        ) : (<>
          <div className="tl-row2" style={{ marginTop: 4 }}>
            <button className="tl-main" style={{ margin: 0, background: "#16A34A" }} onClick={() => { setQ(""); go("cont", { order: o.id, dir: "in" }); }}>GATE IN<small>Cont vào lưu tại VNL</small></button>
            <button className="tl-main" style={{ margin: 0 }} onClick={() => { setQ(""); go("cont", { order: o.id, dir: "out" }); }}>GATE OUT<small>Cont rời VNL</small></button>
          </div>
          <button className="tl-sec" style={{ width: "100%", height: 52, marginTop: 10 }} onClick={() => { setYq(""); go("yard", { order: o.id, tab: "place" }); }}>▦ Bãi cont · hạ bãi / đảo chuyển ({Object.values(window.DD_CONT_REG || {}).filter(c => c.inPort && !c.pos).length} chưa có vị trí)</button>
        </>)}
        <div className="tl-row2">
          <button className="tl-sec" onClick={() => go("records", { order: o.id })}>Bản ghi ca ({recs.length})</button>
          <button className="tl-sec danger" disabled={o.status === "done"} onClick={() => go("inc1", { order: o.id })}>⚠ Báo sự cố</button>
        </div>
        {o.status !== "done" && !st.end && <button className="tl-sec" style={{ width: "100%", marginTop: 8 }} onClick={() => go("order", { order: o.id, end: true })}>■ Kết ca</button>}
        {st.end && <div className="tl-confirm" style={{ marginTop: 8, textAlign: "left" }}>
          <b>Kết ca {DD_SHIFTS[o.shift - 1].label}?</b>
          <div className="tl-muted" style={{ margin: "4px 0 8px" }}>{recs.length} bản ghi · {tlFmt(caTotal, unit)} {unit}. Sau khi kết ca: không ghi thêm vào lệnh này, mã tài xế của ca hết hiệu lực{DD_INCIDENTS.some(i => i.order === o.id && (ddIncDown(i) || {}).open) ? ", sự cố đang dừng tính thời gian lỗi đến lúc kết ca" : ""}.</div>
          <button className="tl-main" style={{ margin: 0 }} onClick={() => { ddEndShift(o, me.id); onChange(); toast(`Đã kết ca ${o.id}`); go("home"); }}>XÁC NHẬN KẾT CA</button>
          <button className="tl-link" style={{ marginTop: 6 }} onClick={() => go("order", { order: o.id })}>Thôi</button>
        </div>}
        {last && (
          <div className="tl-last">
            <div><div className="tl-muted">Bản ghi gần nhất của tôi · {last.at.slice(-5)}</div><b>{last.cont ? `${last.gate === "in" ? "Gate In" : "Gate Out"} ${tlContFmt(last.cont)}` : `${tlFmt(last.qty)} ${unit}`}</b> · {last.cont ? (last.plate || TL_CH[last.ch] || "") : last.plate}</div>
            {last.status !== "editReq" && last.status !== "returned" && (last.cont
              ? <button className="tl-link" onClick={() => undoCont(last)}>Huỷ</button>
              : <button className="tl-link" onClick={() => { setPad(String(last.qty).replace(".", ",")); go("pad", { order: o.id, plate: last.plate, edit: last.id }); }}>Sửa</button>)}
          </div>
        )}
      </div>
    </>);
  }
  function undoCont(r) {
    const c = job.conts.find(x => x.no === r.cont); if (c) { if (r.gate === "in") delete c.gin; else delete c.gout; if (r.gate === ddContGate(c, job)) { c.status = "pending"; delete c.by; delete c.at; delete c.truck; } } window.ddGateUndo?.(r.cont);
    r.status = "void"; job.actual = Math.max(0, job.actual - r.qty); onChange(); toast(`Đã huỷ Gate ${r.gate === "in" ? "In" : "Out"} ${tlContFmt(r.cont)}`);
  }

  /* ---------- BULK: chọn phương tiện ---------- */
  if (st.s === "veh" && o) {
    const trips = (p) => recs.filter(r => r.plate === p);
    body = (<>
      <Bar title="Bước 1/3 · Chọn phương tiện" sub={`Theo danh sách xe của lệnh ca · ca này ${recs.length} chuyến · ${tlFmt(caTotal)} ${unit}`} back={() => go("order", { order: o.id })} />
      <Ctx />
      <div className="tl-scroll">
        {o.vehicles.length === 0 && <div className="tl-empty">Lệnh ca chưa đăng ký phương tiện — báo KHTH.</div>}
        {o.vehicles.map(p => { const v = ddVeh(p); const t = trips(p); return (
          <button key={p} className="tl-choice" onClick={() => { setPad(""); setW({ f: 1, a: "", b: "", src: "manual" }); go(ddMeasure(job) === "scale" ? "w" : "pad", { order: o.id, plate: p, src: "manual" }); }}>
            <div style={{ textAlign: "left" }}><span className="tl-plate">{p}</span><div className="tl-muted" style={{ marginTop: 4 }}>{v.type}</div></div>
            <span className="tl-muted" style={{ textAlign: "right" }}>{t.length} chuyến<br/>{tlFmt(t.reduce((s, r) => s + r.qty, 0))} {unit}</span>
          </button>); })}
        {(o.extraVeh || []).map(({ plate: p, owner }) => { const t = trips(p); return (
          <button key={p} className="tl-choice" onClick={() => { setPad(""); setW({ f: 1, a: "", b: "", src: "manual" }); go(ddMeasure(job) === "scale" ? "w" : "pad", { order: o.id, plate: p, src: "manual" }); }}>
            <div style={{ textAlign: "left" }}><span className="tl-plate">{p}</span><div className="tl-muted" style={{ marginTop: 4, color: "#B45309" }}>Ngoài danh sách{owner ? ` · ${owner}` : ""} · đã báo KHTH</div></div>
            <span className="tl-muted" style={{ textAlign: "right" }}>{t.length} chuyến<br/>{tlFmt(t.reduce((s, r) => s + r.qty, 0))} {unit}</span>
          </button>); })}
        <button className="tl-sec danger" style={{ width: "100%" }} onClick={() => { setNp({ plate: "", owner: "" }); go("vehNew", { order: o.id, next: "bulk" }); }}>+ Xe không có trong danh sách · nhập biển số</button>
      </div>
    </>);
  }

  /* ---------- Xe ngoài danh sách: tally nhập biển số ---------- */
  if (st.s === "vehNew" && o) {
    const plate = np.plate.toUpperCase().replace(/s+/g, " ").trim();
    const known = [...o.vehicles, ...(o.extraVeh || []).map(v => v.plate)].find(v => v.replace(/[s.-]/g, "") === plate.replace(/[s.-]/g, ""));
    const ok = plate.replace(/[s.-]/g, "").length >= 5;
    const next = () => {
      const p = known || plate;
      if (!known) addOffList(p, np.owner.trim());
      if (st.next === "cont") go("contOk", { ...st.back, truck: p });
      else { setPad(""); setW({ f: 1, a: "", b: "", src: "manual" }); go(ddMeasure(job) === "scale" ? "w" : "pad", { order: o.id, plate: p, src: "manual" }); }
    };
    body = (<>
      <Bar title="Xe ngoài danh sách" sub="Nhập biển số · vẫn ghi nhận sản lượng" back={() => st.next === "cont" ? go("truck", st.back) : go("veh", { order: o.id })} />
      <Ctx />
      <div className="tl-scroll" style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <div className="tl-tag warn" style={{ margin: 0 }}>Xe chưa có trong lệnh ca. Ghi nhận bình thường; hệ thống tự báo sự cố về KHTH để kiểm tra.</div>
        <label className="tl-muted">Biển số xe</label>
        <input className="input mono" style={{ height: 52, fontSize: 20 }} autoCapitalize="characters" placeholder="VD: 43C-123.45" value={np.plate} onChange={e => setNp(x => ({ ...x, plate: e.target.value.toUpperCase() }))} />
        <label className="tl-muted">Nhà xe / ghi chú (không bắt buộc)</label>
        <input className="input" style={{ height: 46, fontSize: 15 }} placeholder="VD: Vận tải Minh Phát" value={np.owner} onChange={e => setNp(x => ({ ...x, owner: e.target.value }))} />
        {known && <div className="tl-tag" style={{ margin: 0 }}>Xe {known} đã có trong lệnh ca — dùng luôn, không báo sự cố.</div>}
        <button className="tl-main" disabled={!ok} onClick={next}>TIẾP TỤC GHI NHẬN<small>{known ? "Xe có trong danh sách" : "Tự báo sự cố \"Xe không có trong danh sách\" về KHTH"}</small></button>
      </div>
    </>);
  }

  /* ---------- BULK: nhập số ---------- */
  if (st.s === "pad" && o) {
    const v = Number(pad.replace(",", ".")) || 0;
    const veh = ddVeh(st.plate);
    const over = unit === "tấn" && veh.cap && v > veh.cap * 1.2;
    body = (<>
      <Bar title={st.edit ? "Sửa bản ghi gần nhất" : st.req ? "Xin sửa bản ghi" : "Bước 2/3 · Nhập khối lượng"} back={() => go(st.edit || st.req ? "order" : "veh", { order: o.id })} />
      <Ctx />
      <div className="tl-padwrap">
        <div className="tl-padtype"><span className="tl-plate" style={{ fontSize: 14 }}>{st.plate}</span> · {veh.type}{unit === "tấn" && veh.cap ? ` · tải ${ddQty(veh.cap)} tấn` : ""}</div>
        <div className="tl-display">{pad || "0"}<small> {unit}</small></div>
        {false && ddMeasure(job) === "hook" && !st.edit && !st.req && <button className="tl-sec" style={{ width: "100%", marginBottom: 8 }} onClick={() => { setPad(String(tlSim(18, 26)).replace(".", ",")); go("pad", { ...st, src: "auto" }); }}>⚖ Lấy số từ cân treo <span style={{ opacity: .7 }}>(giả lập — chưa kết nối)</span></button>}
        {st.src === "auto" && <div className="tl-tag" style={{ margin: "0 0 8px" }}>Số lấy từ cân treo · tally xác nhận</div>}
        <Pad />
        <button className="tl-main" disabled={!v} onClick={() => go(over ? "warn" : "confirm", { ...st, qty: v, src: st.src || "manual" })}>TIẾP TỤC</button>
      </div>
    </>);
  }
  /* ---------- BULK: qua cầu cân — nhập lần 1, lần 2 theo phiếu cân ---------- */
  if (st.s === "w" && o) {
    const veh = ddVeh(st.plate);
    const pressW = (k) => setW(x => { const key = x.f === 1 ? "a" : "b"; const p = x[key]; const n = k === "⌫" ? p.slice(0, -1) : k === "," ? (p.includes(",") || !p ? p : p + ",") : (p.split(",")[1]?.length >= 2 || p.length >= 6 ? p : (p === "0" ? k : p + k)); return { ...x, [key]: n, src: "manual" }; });
    const a = Number(w.a.replace(",", ".")) || 0, b = Number(w.b.replace(",", ".")) || 0, net = Math.round((a - b) * 100) / 100;
    const bad = a && b && b >= a;
    const over = veh.cap && net > veh.cap * 1.2;
    body = (<>
      <Bar title="Bước 2/3 · Số cân theo phiếu" sub={`${st.plate} · ${veh.type}`} back={() => go("veh", { order: o.id })} />
      <Ctx />
      <div className="tl-padwrap">
        <div className="tl-row2" style={{ marginBottom: 8 }}>
          {[[1, "Lần 1 · xe có hàng", w.a], [2, "Lần 2 · xe rỗng", w.b]].map(([k, l, v]) => (
            <button key={k} className={`tl-sec ${w.f === k ? "on" : ""}`} style={{ height: 64, textAlign: "left", padding: "6px 10px", border: w.f === k ? "2px solid #0E7490" : undefined }} onClick={() => setW(x => ({ ...x, f: k }))}>
              <div style={{ fontSize: 11, opacity: .75 }}>{l}</div><div style={{ fontSize: 22, fontWeight: 800 }}>{v || "—"} <small style={{ fontSize: 12 }}>tấn</small></div>
            </button>))}
        </div>
        <div className="tl-display" style={{ fontSize: 30 }}>{bad ? <span style={{ color: "#DC2626", fontSize: 15 }}>Lần 2 phải nhỏ hơn lần 1</span> : a && b ? <>{tlFmt(net)}<small> tấn hàng</small></> : <small style={{ fontSize: 14 }}>Hàng = lần 1 − lần 2</small>}</div>
        {false && <button className="tl-sec" style={{ width: "100%", marginBottom: 8 }} onClick={() => { const bi = tlSim(13, 15); const tong = Math.round((bi + tlSim(22, 27)) * 100) / 100; setW({ f: 2, a: String(tong).replace(".", ","), b: String(bi).replace(".", ","), src: "auto" }); }}>⚖ Lấy số từ phần mềm cầu cân <span style={{ opacity: .7 }}>(giả lập — chưa kết nối)</span></button>}
        {w.src === "auto" && <div className="tl-tag" style={{ margin: "0 0 8px" }}>Số lấy từ cầu cân · tally xác nhận</div>}
        <div className="tl-pad">{["1", "2", "3", "4", "5", "6", "7", "8", "9", ",", "0", "⌫"].map(k => <button key={k} onClick={() => pressW(k)}>{k}</button>)}</div>
        <button className="tl-main" disabled={!a || !b || bad} onClick={() => go(over ? "warn" : "confirm", { ...st, qty: net, w1: a, w2: b, src: w.src })}>TIẾP TỤC</button>
      </div>
    </>);
  }
  if (st.s === "warn" && o) {
    const veh = ddVeh(st.plate);
    body = (<>
      <Bar title="Số liệu bất thường" back={() => go("pad", st)} />
      <div className="tl-scroll" style={{ textAlign: "center" }}>
        <div className="tl-warnicon">!</div>
        <div className="tl-big" style={{ fontSize: 30 }}>{tlFmt(st.qty)} {unit}</div>
        <p style={{ fontSize: 14, lineHeight: 1.5, margin: "8px 4px 18px" }}>Vượt <b>{Math.round((st.qty / veh.cap - 1) * 100)}%</b> so với tải trọng {veh.type} ({tlFmt(veh.cap)} tấn). Ngưỡng cảnh báo 20% (BR-BP-04).</p>
        <button className="tl-main" style={{ background: "#B45309" }} onClick={() => go("confirm", { ...st, abnormal: true })}>SỐ NÀY ĐÚNG, TIẾP TỤC</button>
        <button className="tl-sec" style={{ width: "100%", marginTop: 10 }} onClick={() => go(st.w1 ? "w" : "pad", st)}>Nhập lại</button>
      </div>
    </>);
  }
  if (st.s === "confirm" && o) {
    const target = st.edit && DD_RECORDS.find(r => r.id === st.edit);
    const save = () => {
      if (st.edit) {
        job.actual = Math.round((job.actual - target.qty + st.qty) * 100) / 100;
        target.hist = [...(target.hist || []), { at: `${ddNow()}`, by: me.id, from: target.qty, to: st.qty, kind: "Tally sửa bản ghi gần nhất" }];
        ddJobLog(job, `${o.id} · sửa bản ghi ${target.plate || ""}: ${tlFmt(target.qty, unit)} → ${tlFmt(st.qty, unit)} ${unit}`, me.id);
        target.prev = target.qty; target.qty = st.qty; target.edited = true; if (st.abnormal) target.abnormal = true;
        onChange(); toast("Đã sửa bản ghi gần nhất"); go("order", { order: o.id });
      } else if (st.req) {
        const r = DD_RECORDS.find(x => x.id === st.req);
        DD_EDIT_REQS.unshift({ id: ddNewId("YC"), record: r.id, order: o.id, job: job.id, by: me.id, at: `${ddNow()}`, from: r.qty, to: st.qty, reason: st.reason, status: "pending" });
        r.status = "editReq"; ddJobLog(job, `${o.id} · xin sửa bản ghi ${r.plate || ""}: ${tlFmt(r.qty, unit)} → ${tlFmt(st.qty, unit)} ${unit} · lý do: ${st.reason}`, me.id); onChange(); toast("Đã gửi yêu cầu sửa cho văn phòng"); go("records", { order: o.id });
      } else {
        addRecord({ plate: st.plate, qty: st.qty, src: st.src || "manual", ...(offList(st.plate) ? { offList: true } : {}), ...(st.w1 ? { w1: st.w1, w2: st.w2 } : {}), ...(st.abnormal ? { abnormal: true } : {}) });
        toast(`Đã ghi ${st.plate}: ${tlFmt(st.qty)} ${unit}${offline ? " · chờ đồng bộ" : ""}`); go("veh", { order: o.id });
      }
    };
    body = (<>
      <Bar title={st.edit ? "Xác nhận sửa" : st.req ? "Xác nhận yêu cầu sửa" : "Bước 3/3 · Xác nhận"} back={() => go(st.w1 ? "w" : "pad", st)} />
      <div className="tl-scroll">
        <div className="tl-confirm">
          <span className="tl-plate" style={{ fontSize: 20 }}>{st.plate}</span>
          <div className="tl-big" style={{ fontSize: 40 }}>{tlFmt(st.qty)} <small style={{ fontSize: 18 }}>{unit}</small></div>
          {target && <div className="tl-muted">Trước: {tlFmt(target.qty)} {unit}</div>}
          {st.w1 && <div className="tl-muted">Lần 1 {tlFmt(st.w1)} − lần 2 {tlFmt(st.w2)} tấn</div>}
          {!st.edit && !st.req && <div className="tl-tag" style={{ background: st.src === "auto" ? "#DCFCE7" : undefined }}>{st.src === "auto" ? "Số tự động từ cân" : ddMeasure(job) === "scale" || ddMeasure(job) === "hook" ? "Nhập tay theo phiếu cân" : "Nhập tay"}</div>}
          {st.abnormal && <div className="tl-tag warn">Bất thường · đã xác nhận lại</div>}
          {!st.req && <div className="tl-tag">Sản lượng gửi văn phòng duyệt khi kết ca</div>}
        </div>
        <div className="tl-info">
          <div><span>Hàng</span><b>{job.cargo}</b></div>
          <div><span>Lệnh · Ca</span><b>{o.id} · {DD_SHIFTS[o.shift - 1].label}</b></div>
          <div><span>Thời gian</span><b>{ddNow()}</b></div>
          <div><span>Tally</span><b>{me.name}</b></div>
          {offline && <div><span>Mạng</span><b style={{ color: "#B45309" }}>Mất kết nối — lưu trên máy</b></div>}
        </div>
        {st.req && (
          <div style={{ margin: "4px 0 12px" }}>
            <div className="tl-muted" style={{ marginBottom: 6 }}>Lý do sửa</div>
            <div className="tl-chips">{["Nhập nhầm số", "Nhầm phương tiện", "Đo lại", "Ghi trùng"].map(x => <button key={x} className={st.reason === x ? "on" : ""} onClick={() => go("confirm", { ...st, reason: x })}>{x}</button>)}</div>
          </div>
        )}
        <button className="tl-main" disabled={st.req && !st.reason} onClick={save}>{st.req ? "GỬI YÊU CẦU SỬA" : st.edit ? "LƯU THAY ĐỔI" : "XÁC NHẬN SẢN LƯỢNG"}</button>
      </div>
    </>);
  }

  /* ---------- CONT: Gate In / Gate Out (v2.5) ---------- */
  const defCh = (dir, c) => dir === "out" ? (c && ddCDir(c, job) === "import" ? "road" : "river") : (o.call || job.vessel?.startsWith("SL") ? "river" : "road");
  if (st.s === "cont" && o) {
    const isIn = st.dir === "in";
    /* Gate In chỉ hiện cont hướng nhập lưu bãi; Gate Out hiện cont xuất thẳng / xuất bãi (BR-DD-11) */
    const pend = job.conts.filter(c => isIn ? ddCDir(c, job) === "import" && !c.gin : ddCDir(c, job) !== "import" && !c.gout);
    const digits = (p) => (p || "").replace(/\D/g, "");
    const shown = pend.filter(c => !q || c.no.includes(q) || digits(c.drvTruck).includes(q)).sort((a, b) => (!!b.drvTruck) - (!!a.drvTruck));
    const nAtt = pend.filter(c => c.drvTruck).length;
    body = (<>
      <Bar title={`${isIn ? "Gate In" : "Gate Out"} · chọn cont`} sub={`${pend.length} cont chưa ${isIn ? "gate in" : "gate out"} · ${ddDirLabel(job)}`} back={() => go("order", { order: o.id })} />
      <Ctx />
      <div style={{ padding: "10px 12px 0" }}>
        <div className="tl-search">
          <span>🔍</span><span className="tl-q">{q || <span style={{ color: "#94A3B8" }}>Số đuôi cont hoặc số biển xe</span>}</span>
          {q && <button onClick={() => setQ("")}>✕</button>}
        </div>
        <div className="tl-minipad">{["1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "⌫"].map(k => <button key={k} onClick={() => setQ(v => k === "⌫" ? v.slice(0, -1) : (v + k).slice(-7))}>{k}</button>)}</div>
      </div>
      <div className="tl-scroll">
        {nAtt > 0 && !q && <div className="tl-muted" style={{ margin: "0 0 6px" }}>{nAtt} cont tài xế đã gắn xe — xếp lên đầu</div>}
        {shown.length === 0 && <div className="tl-empty">Không có cont khớp</div>}
        {shown.map(c => { const reg = window.DD_CONT_REG && DD_CONT_REG[c.no]; return (
          <button key={c.no} className="tl-choice" style={{ minHeight: 62 }} onClick={() => go(c.drvTruck ? "contOk" : "truck", { order: o.id, dir: st.dir, cont: c.no, truck: c.drvTruck || null, ch: defCh(st.dir, c) })}>
            <b className="mono" style={{ fontSize: 18, letterSpacing: ".02em" }}>{c.no.slice(0, 4)} <span style={{ color: "#0E7490" }}>{c.no.slice(4, 10)}</span> {c.no.slice(10)}</b>
            <span className="tl-muted" style={{ textAlign: "right" }}>{c.type} · {c.fe === "F" ? "Hàng" : "Rỗng"}<br/><span style={{ color: "#334155" }}>{DD_DIR_SHORT[ddCDir(c, job)]}</span>
              {c.drvTruck && <><br/><b style={{ color: "#16A34A" }}>xe {c.drvTruck}</b></>}
              {!isIn && reg?.loc && <><br/><b style={{ color: "#0E7490" }}>{reg.loc}</b></>}</span>
          </button>); })}
        <button className="tl-sec danger" style={{ width: "100%" }} onClick={() => go("inc2", { order: o.id, type: "scale", notes: ["Cont/xe không có trong danh sách"], level: "mid", missing: "cont" })}>Cont không có trong danh sách → báo KHTH</button>
      </div>
    </>);
  }
  if (st.s === "truck" && o) {
    body = (<>
      <Bar title="Chọn xe" sub={`${tlContFmt(st.cont)} · tài xế chưa gắn xe trên web`} back={() => go("cont", { order: o.id, dir: st.dir })} />
      <Ctx />
      <div className="tl-scroll">
        {o.vehicles.map(p => { const v = ddVeh(p); const n = recs.filter(r => r.plate === p).length; return (
          <button key={p} className="tl-choice" onClick={() => go("contOk", { ...st, truck: p })}>
            <div style={{ textAlign: "left" }}><span className="tl-plate">{p}</span><div className="tl-muted" style={{ marginTop: 4 }}>{v.type}</div></div>
            <span className="tl-muted">{n} cont</span>
          </button>); })}
        {(o.extraVeh || []).map(({ plate: p, owner }) => { const n = recs.filter(r => r.plate === p).length; return (
          <button key={p} className="tl-choice" onClick={() => go("contOk", { ...st, truck: p })}>
            <div style={{ textAlign: "left" }}><span className="tl-plate">{p}</span><div className="tl-muted" style={{ marginTop: 4, color: "#B45309" }}>Ngoài danh sách{owner ? ` · ${owner}` : ""} · đã báo KHTH</div></div>
            <span className="tl-muted">{n} cont</span>
          </button>); })}
        {o.vehicles.length === 0 && !(o.extraVeh || []).length && <div className="tl-empty">Lệnh ca chưa có xe.</div>}
        <button className="tl-sec danger" style={{ width: "100%" }} onClick={() => { setNp({ plate: "", owner: "" }); go("vehNew", { order: o.id, next: "cont", back: { ...st, s: undefined } }); }}>+ Xe không có trong danh sách · nhập biển số</button>
      </div>
    </>);
  }
  if (st.s === "contOk" && o) {
    const c = job.conts.find(x => x.no === st.cont);
    const isIn = st.dir === "in";
    const reg = window.DD_CONT_REG && DD_CONT_REG[c.no];
    const warn = isIn ? reg?.inPort : !reg?.inPort && ddCDir(c, job) !== "direct";
    const primary = st.dir === ddContGate(c, job);
    const fcl = c.fe === "F";
    const sealV = (st.seal ?? c.seal ?? "").toUpperCase().replace(/\s/g, "");
    const sealDiff = fcl && c.seal && sealV && sealV !== c.seal;
    body = (<>
      <Bar title={`Xác nhận ${isIn ? "Gate In" : "Gate Out"}`} back={() => go("cont", { order: o.id, dir: st.dir })} />
      <div className="tl-scroll">
        <div className="tl-confirm" style={{ borderColor: isIn ? "#86EFAC" : undefined }}>
          <div className="tl-muted">{c.type} · {c.fe === "F" ? "FCL" : "MTY"} · {DD_DIR_SHORT[ddCDir(c, job)]}{c.dest ? ` · đi ${c.dest}` : ""}</div>
          <div className="mono" style={{ fontSize: 30, fontWeight: 800, margin: "6px 0", letterSpacing: ".02em" }}>{tlContFmt(c.no)}</div>
          <div className="tl-tag" style={{ background: isIn ? "#DCFCE7" : "#DBEAFE", color: isIn ? "#166534" : "#1E3A8A" }}>{isIn ? "GATE IN · vào lưu tại VNL" : "GATE OUT · rời VNL"}</div>
          {st.truck && <div style={{ marginTop: 6 }}>xe <span className="tl-plate">{st.truck}</span>{c.drvTruck === st.truck ? <span className="tl-muted"> · tài xế đã gắn{c.drvPhoto ? " · có ảnh" : ""}</span> : null}</div>}
          {warn && <div className="tl-tag warn">{isIn ? "Sổ cont: cont đang ở cảng — vẫn ghi được" : "Sổ cont: cont chưa có trong cảng — vẫn ghi được"}</div>}
        </div>
        {fcl && (<>
          <div className="tl-muted" style={{ margin: "2px 0 6px" }}>Số seal trên cont (FCL) — bắt buộc</div>
          <input className="mono" style={{ width: "100%", height: 52, fontSize: 20, fontWeight: 700, letterSpacing: ".06em", borderRadius: 12, border: `2px solid ${sealDiff ? "#F59E0B" : sealV ? "#CBD5E1" : "#FCA5A5"}`, padding: "0 14px", boxSizing: "border-box", textTransform: "uppercase" }} value={sealV} placeholder="Nhập số seal" onChange={e => setSt(x => ({ ...x, seal: e.target.value }))} />
          <div className="tl-muted" style={{ margin: "4px 0 10px", fontSize: 12.5 }}>{c.seal ? <>Kế hoạch: <b className="mono">{c.seal}</b> — đối chiếu với seal trên cửa cont, sai thì sửa</> : "Kế hoạch chưa có seal — nhập theo seal trên cửa cont"}</div>
          {sealDiff && <div className="tl-tag warn" style={{ marginBottom: 10 }}>Khác kế hoạch ({c.seal}) — vẫn ghi, hệ thống báo KHTH</div>}
        </>)}
        <div className="tl-muted" style={{ margin: "2px 0 6px" }}>Kênh</div>
        <div className="tl-chips">{Object.entries(TL_CH).map(([k, l]) => <button key={k} className={st.ch === k ? "on" : ""} onClick={() => go("contOk", { ...st, ch: k })}>{l}</button>)}</div>
        <div className="tl-info" style={{ marginTop: 10 }}>
          <div><span>Lệnh · Ca</span><b>{o.id} · {DD_SHIFTS[o.shift - 1].label}</b></div>
          {st.ch === "river" && o.call && <div><span>Lượt cập</span><b>{o.call}</b></div>}
          <div><span>Thời gian</span><b>{ddNow()}</b></div>
          <div><span>Tally</span><b>{me.name}</b></div>
          {isIn && <div><span>Sau đó</span><b>Vào "chưa có vị trí" trong Bãi cont</b></div>}
          {offline && <div><span>Mạng</span><b style={{ color: "#B45309" }}>Mất kết nối — lưu trên máy</b></div>}
        </div>
        <button className="tl-main" style={{ background: isIn ? "#16A34A" : undefined }} disabled={fcl && !sealV} onClick={() => {
          const r = addRecord({ ...(offList(st.truck) ? { offList: true } : {}), cont: c.no, plate: st.truck || null, qty: primary ? 1 : 0, gate: st.dir, ch: st.ch, seal: fcl ? sealV : null });
          if (fcl) {
            if (sealDiff) {
              c.sealPlan = c.seal; c.sealMismatch = true;
              (job.log = job.log || []).unshift({ at: r.at, by: me.id, text: `Seal lệch kế hoạch ${tlContFmt(c.no)}: kế hoạch ${c.seal}, tally ghi ${sealV} (${isIn ? "Gate In" : "Gate Out"})` });
              DD_INCIDENTS.unshift({ id: ddNewId("SC"), order: o.id, job: job.id, by: me.id, at: r.at, type: "scale", notes: [`Seal ${tlContFmt(c.no)}: kế hoạch ${c.seal}, thực tế ${sealV}`], photo: false, status: "open", offline, log: [{ at: r.at, by: me.id, text: "Hệ thống tạo khi tally ghi seal khác kế hoạch" }] });
            } else if (!c.seal) (job.log = job.log || []).unshift({ at: r.at, by: me.id, text: `Tally ghi seal ${tlContFmt(c.no)}: ${sealV}` });
            c.seal = sealV; c.sealBy = me.id; c.sealAt = r.at;
          }
          if (isIn) c.gin = true; else c.gout = true;
          if (primary) Object.assign(c, { status: "done", by: me.id, at: r.at.slice(-5), truck: st.truck || null });
          if (!isIn) { delete c.drvTruck; }
          if (st.ch === "river") window.ddRiverGate?.(c.no, st.dir, job.id, me.id, r.at, o.call); else window.ddRoadGate?.(c.no, st.dir, job.id, me.id, r.at, st.truck);
          window.ddJobTouch?.(job, me.id);
          onChange(); toast(`${isIn ? "Gate In" : "Gate Out"} ${tlContFmt(c.no)} · ${TL_CH[st.ch]}`); setQ(""); go("cont", { order: o.id, dir: st.dir });
        }}>XÁC NHẬN {isIn ? "GATE IN" : "GATE OUT"}</button>
      </div>
    </>);
  }

  /* ---------- BÃI CONT: hạ bãi (chọn vị trí → chọn cont) · đảo chuyển ---------- */
  const YDOK = typeof YD_BLK !== "undefined";
  const tlProbe = (b) => YD_REEFER.includes(b) ? { type: "40RF", fe: "F" } : b[0] === "E" ? { type: "40GP", fe: "E" } : { type: "40GP", fe: "F" }; /* dò ô trống vừa cả cont 40' */
  if (st.s === "yard" && o) {
    const R = Object.values(window.DD_CONT_REG || {});
    const pending = R.filter(c => c.inPort && !c.pos);
    const placed = R.filter(c => c.inPort && c.pos && (!yq || c.no.includes(yq)));
    body = (<>
      <Bar title="Bãi cont" sub="Hạ bãi · đảo chuyển" back={() => go("order", { order: o.id })} />
      <div className="tl-tabs">
        <button className={st.tab === "place" ? "on" : ""} onClick={() => go("yard", { ...st, tab: "place" })}>Hạ bãi ({pending.length})</button>
        <button className={st.tab === "move" ? "on" : ""} onClick={() => go("yard", { ...st, tab: "move" })}>Đảo chuyển</button>
      </div>
      <div className="tl-scroll">
        {st.tab === "place" ? (<>
          <div className="tl-note">Chọn <b>vị trí</b> trước, sau đó chọn cont trong danh sách "chưa có vị trí" (đã gate in) và bấm Xác nhận hạ bãi.</div>
          <button className="tl-main" disabled={!pending.length || !YDOK} onClick={() => go("ypos", { order: o.id, mode: "place", b: null })}>CHỌN VỊ TRÍ HẠ BÃI<small>{pending.length} cont đang chờ</small></button>
          {pending.slice(0, 12).map(c => <div key={c.no} className="tl-rec"><div style={{ flex: 1 }}><b className="mono">{tlContFmt(c.no)}</b><div className="tl-muted">{c.type} · {c.fe === "F" ? "Hàng" : "Rỗng"} · {c.line} · gate in {(c.gateInAt || "").slice(-5)}</div></div></div>)}
        </>) : (<>
          <div className="tl-search"><span>🔍</span><span className="tl-q">{yq || <span style={{ color: "#94A3B8" }}>Số đuôi cont cần đảo chuyển</span>}</span>{yq && <button onClick={() => setYq("")}>✕</button>}</div>
          <div className="tl-minipad" style={{ marginBottom: 8 }}>{["1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "⌫"].map(k => <button key={k} onClick={() => setYq(v => k === "⌫" ? v.slice(0, -1) : (v + k).slice(-7))}>{k}</button>)}</div>
          {yq.length < 3 ? <div className="tl-empty">Gõ ít nhất 3 số đuôi</div> : placed.slice(0, 10).map(c => { const top = YDOK ? ydBlocked(c) : null; return (
            <button key={c.no} className="tl-choice" disabled={!!top} style={{ opacity: top ? .55 : 1 }} onClick={() => go("ypos", { order: o.id, mode: "move", cont: c.no, b: null })}>
              <b className="mono">{tlContFmt(c.no)}</b><span className="tl-muted" style={{ textAlign: "right" }}><b style={{ color: "#0E7490" }}>{c.loc}</b>{top ? <><br/>bị đè bởi {tlContFmt(top)}</> : null}</span>
            </button>); })}
        </>)}
      </div>
    </>);
  }
  if (st.s === "ypos" && o && YDOK) {
    const mv = st.mode === "move" && DD_CONT_REG[st.cont];
    const zones = ["A", "B", "C", "D", "E"];
    const z = st.z || (mv ? mv.pos.b[0] : "C");
    const blk = st.b && YD_BLK[st.b];
    const p = { bay: st.bay || 1, lane: st.lane || 1, tier: st.tier || 1 };
    const occ = blk && ydAt(st.b, p.bay, p.lane, p.tier);
    const why = mv && blk ? ydCheck(mv, st.b, p.bay, p.lane, p.tier) : null;
    const step = (k, d, max) => go("ypos", { ...st, ...p, [k]: Math.min(max, Math.max(1, p[k] + d)) });
    const Stepper = ({ k, l, max }) => <div style={{ textAlign: "center" }}><div className="tl-muted">{l}</div><div style={{ display: "flex", alignItems: "center", gap: 3, justifyContent: "center" }}><button className="tl-sec" style={{ width: 32, height: 38, padding: 0, minWidth: 0 }} onClick={() => step(k, -1, max)}>−</button><b style={{ fontSize: 20, minWidth: 24 }}>{p[k]}</b><button className="tl-sec" style={{ width: 32, height: 38, padding: 0, minWidth: 0 }} onClick={() => step(k, 1, max)}>+</button></div></div>;
    body = (<>
      <Bar title={mv ? `Đảo chuyển ${tlContFmt(mv.no)}` : "Hạ bãi · Bước 1/2 · Vị trí"} sub={mv ? `Đang ở ${mv.loc}` : "Chọn khu → block → hàng / cột / tầng"} back={() => go("yard", { order: o.id, tab: mv ? "move" : "place" })} />
      <div className="tl-scroll">
        <div className="tl-chips">{zones.map(k => <button key={k} className={z === k ? "on" : ""} onClick={() => go("ypos", { ...st, z: k, b: null })}>Khu {k}</button>)}</div>
        <div className="tl-chips" style={{ marginTop: 8 }}>{YD_BLOCKS.filter(b => b.yard === z).map(b => <button key={b.id} className={st.b === b.id ? "on" : ""} onClick={() => { const f = ydFirstFree(mv || tlProbe(b.id), b.id) || { bay: 1, lane: 1, tier: 1 }; go("ypos", { ...st, z, b: b.id, bay: f.bay, lane: f.lane, tier: f.tier }); }}>{b.id}</button>)}</div>
        {st.b && <div className="tl-muted" style={{ marginTop: 6, fontSize: 12 }}>Đã nhảy tới ô trống đầu tiên của {st.b}; chỉnh hàng / cột / tầng nếu cần.</div>}
        {blk && (<>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6, margin: "14px 0 8px" }}>
            <Stepper k="bay" l="Hàng" max={blk.rows} /><Stepper k="lane" l="Cột" max={YD_LANES} /><Stepper k="tier" l="Tầng" max={YD_TIERS} />
          </div>
          <div className="tl-confirm" style={{ padding: 10 }}><div className="tl-muted">Vị trí</div><div className="mono" style={{ fontSize: 24, fontWeight: 800 }}>{ydLocStr({ b: st.b, ...p })}</div>
            <div className="tl-muted">{ydKind(st.b)} · {occ ? `đang có ${tlContFmt(occ)}` : "ô trống"}{!mv && !occ && ydCheck(tlProbe(st.b), st.b, p.bay, p.lane, p.tier) ? " · chỉ vừa cont 20'" : ""}</div>{why && <div className="tl-tag warn">{why}</div>}</div>
          {mv
            ? <button className="tl-main" disabled={!!why} onClick={() => { ydPlace(mv, { b: st.b, ...p }, me.id, "Đảo chuyển (tally)"); onChange(); toast(`${tlContFmt(mv.no)} → ${mv.loc}`); go("yard", { order: o.id, tab: "move" }); }}>XÁC NHẬN ĐẢO CHUYỂN</button>
            : <button className="tl-main" disabled={!!occ} onClick={() => go("ycont", { ...st, ...p })}>TIẾP · CHỌN CONT</button>}
        </>)}
      </div>
    </>);
  }
  if (st.s === "ycont" && o && YDOK) {
    const pos = { b: st.b, bay: st.bay, lane: st.lane, tier: st.tier };
    const pending = Object.values(DD_CONT_REG).filter(c => c.inPort && !c.pos);
    body = (<>
      <Bar title="Hạ bãi · Bước 2/2 · Chọn cont" sub={`Vị trí ${ydLocStr(pos)}`} back={() => go("ypos", st)} />
      <div className="tl-scroll">
        {pending.length === 0 && <div className="tl-empty">Không còn cont chưa có vị trí</div>}
        {pending.map(c => { const why = ydCheck(c, pos.b, pos.bay, pos.lane, pos.tier); return (
          <div key={c.no} className="tl-rec" style={{ opacity: why ? .55 : 1 }}>
            <div style={{ flex: 1, minWidth: 0 }}><b className="mono">{tlContFmt(c.no)}</b><div className="tl-muted">{c.type} · {c.fe === "F" ? "Hàng" : "Rỗng"} · {c.line}{why ? ` · ${why}` : ""}</div></div>
            <button className="tl-link" disabled={!!why} onClick={() => { ydPlace(c, pos, me.id, "Hạ bãi (tally)"); onChange(); toast(`Đã hạ bãi ${tlContFmt(c.no)} → ${c.loc}`); go("yard", { order: o.id, tab: "place" }); }}>{why ? "—" : "Xác nhận hạ bãi"}</button>
          </div>); })}
      </div>
    </>);
  }

  /* ---------- RECORDS ---------- */
  if (st.s === "records" && o) {
    const lastMine = myRecs[myRecs.length - 1];
    body = (<>
      <Bar title="Bản ghi ca" sub={`${o.id} · ${recs.length} bản ghi · ${tlFmt(caTotal, unit)} ${unit}`} back={() => go("order", { order: o.id })} />
      <div className="tl-scroll">
        {recs.length === 0 && <div className="tl-empty">Chưa có bản ghi</div>}
        {[...recs].reverse().map(r => { const mineR = r.by === me.id; const isLast = r === lastMine; return (
          <div key={r.id} className="tl-rec">
            <div style={{ flex: 1, minWidth: 0 }}>
              <div>{r.cont ? <><b className="mono">{tlContFmt(r.cont)}</b> <span className="tl-muted">· Gate {r.gate === "in" ? "In" : "Out"}</span></> : <b>{tlFmt(r.qty)} {unit}</b>} <span className="tl-muted">· {r.plate || (r.cont ? "—" : "")}{r.w1 ? ` · ${tlFmt(r.w1)} − ${tlFmt(r.w2)}` : ""}{r.src === "auto" ? " · từ cân" : ""}</span>{r.prev != null && <span className="tl-muted"> (sửa từ {tlFmt(r.prev)})</span>}</div>
              <div className="tl-muted">{r.at.slice(-5)} · {ddPerson(r.by).name}{r.offline ? " · chưa đồng bộ" : ""}</div>
            </div>
            {r.status === "returned" ? <span className="tl-tag warn" style={{ margin: 0, background: "#FEE2E2", color: "#B91C1C" }}>VP trả lại</span>
              : r.status === "editReq" ? <span className="tl-tag warn" style={{ margin: 0 }}>Chờ duyệt sửa</span>
              : !mineR ? null
              : isLast ? (r.cont ? <button className="tl-link" onClick={() => undoCont(r)}>Huỷ</button> : <button className="tl-link" onClick={() => { setPad(String(r.qty).replace(".", ",")); go("pad", { order: o.id, plate: r.plate, edit: r.id }); }}>Sửa</button>)
              : r.cont ? null
              : <button className="tl-link" onClick={() => { setPad(""); go("pad", { order: o.id, plate: r.plate, req: r.id }); }}>Xin sửa</button>}
          </div>); })}
        <div className="tl-muted" style={{ padding: "10px 4px", fontSize: 12 }}>Bản ghi gần nhất của mình sửa / huỷ được ngay. Bản ghi hàng rời cũ hơn phải gửi văn phòng duyệt.</div>
      </div>
    </>);
  }

  /* ---------- SỰ CỐ ---------- */
  if (st.s === "inc1" && o) {
    body = (<>
      <Bar title="Báo sự cố · Bước 1/3" sub="Chọn loại sự cố" back={() => go("order", { order: o.id })} />
      <div className="tl-scroll"><div className="tl-grid">
        {TL_INC_TYPES.map(t => <button key={t.id} onClick={() => go("inc2", { order: o.id, type: t.id })}><Icon name={t.icon} size={22}/>{t.label}</button>)}
      </div></div>
    </>);
  }
  if (st.s === "inc2" && o) {
    body = (<>
      <Bar title="Báo sự cố · Bước 2/3" sub={TL_INC_TYPES.find(t => t.id === st.type).label} back={() => go("inc1", { order: o.id })} />
      <div className="tl-scroll">
        {TL_INC_TYPES.find(t => t.id === st.type).stop && ddCranes(o).length > 0 && (<>
          <div className="tl-tag warn" style={{ margin: "0 0 10px" }}>Sự cố dừng việc — hệ thống tính thời gian lỗi đến bản ghi tiếp theo của cẩu</div>
          <div className="tl-muted" style={{ marginBottom: 8 }}>Cẩu bị dừng</div>
          <div className="tl-chips">{ddCranes(o).map(e => <button key={e} className={(st.eq || o.curEq) === e ? "on" : ""} onClick={() => go("inc2", { ...st, eq: e })}>{e}</button>)}</div>
        </>)}
        <div className="tl-muted" style={{ margin: "16px 0 8px" }}>Tình trạng (chọn nhiều)</div>
        <div className="tl-chips">{TL_INC_NOTES.map(x => { const on = (st.notes || []).includes(x); return <button key={x} className={on ? "on" : ""} onClick={() => go("inc2", { ...st, notes: on ? st.notes.filter(y => y !== x) : [...(st.notes || []), x] })}>{x}</button>; })}</div>
        <DdPhotoBtn className={`tl-sec ${st.photo ? "on" : ""}`} style={{ width: "100%", marginTop: 16, height: 56 }} file={st.photo} onPick={f => go("inc2", { ...st, photo: f })} label="📷 Chụp ảnh hiện trường" done="✓ Đã chụp 1 ảnh · chụp lại" />
        <button className="tl-main" onClick={() => go("inc3", st)}>TIẾP TỤC</button>
      </div>
    </>);
  }
  if (st.s === "inc3" && o) {
    const t = TL_INC_TYPES.find(x => x.id === st.type);
    body = (<>
      <Bar title="Báo sự cố · Xác nhận" back={() => go("inc2", st)} />
      <div className="tl-scroll">
        <div className="tl-confirm" style={{ borderColor: "#FCA5A5" }}><Icon name={t.icon} size={26}/><div className="tl-big">{t.label}</div><div className="tl-muted">{t.stop && ddCranes(o).length ? `Dừng việc · ${st.eq || o.curEq || ddCranes(o)[0]}` : "Không tính thời gian dừng"}{st.photo ? " · 1 ảnh" : ""}</div>{(st.notes || []).length > 0 && <div style={{ fontSize: 13, marginTop: 6 }}>{st.notes.join(" · ")}</div>}</div>
        <div className="tl-info"><div><span>Lệnh · Ca</span><b>{o.id} · {DD_SHIFTS[o.shift - 1].label}</b></div><div><span>Vị trí</span><b>{ddLoc(job)}</b></div><div><span>Người báo</span><b>{me.name} · {ddNow()}</b></div></div>
        <button className="tl-main" style={{ background: "#DC2626" }} onClick={() => {
          const id = ddNewId("SC");
          DD_INCIDENTS.unshift({ id, order: o.id, job: job.id, by: me.id, at: `${ddNow()}`, type: st.type, eq: t.stop ? (st.eq || o.curEq || ddCranes(o)[0] || null) : null, notes: st.notes || [], photo: !!st.photo, status: "open", offline, missing: st.missing, log: [{ at: `${ddNow()}`, by: me.id, text: `Báo từ app tally${st.photo ? " · 1 ảnh" : ""}` }] });
          /* pilot: ảnh thật lưu Storage dieudo-photos, phần tử giữ đường dẫn */
          if (st.photo) { const inc = DD_INCIDENTS.find(x => x.id === id); DD_SYNC.uploadPhoto(st.photo, `incident/${id}`).then(path => { inc.photo = path; onChange(); }); }
          ddJobLog(job, `${o.id} · báo sự cố ${id}: ${t.label}${st.photo ? " · có ảnh" : ""}`, me.id);
          onChange(); toast(`Đã gửi ${id} tới KHTH`); go("order", { order: o.id });
        }}>GỬI SỰ CỐ</button>
      </div>
    </>);
  }

  return (
    <div className="tl-phone">
      <style>{TL_CSS}</style>
      <div className="tl-status"><b>{tlClock()}</b><span><DdSyncBadge dark /> · <a style={{ color: "#fff", cursor: "pointer", textDecoration: "underline" }} onClick={() => DD_SYNC.signOut()}>Đăng xuất</a></span></div>
      {offline && <div className="tl-offline">Đang offline — bản ghi lưu trên máy, tự đồng bộ khi có mạng</div>}
      <div className="tl-body">{body}</div>
      {msg && <div className="tl-toast">✓ {msg}</div>}
    </div>
  );
};

const TL_CSS = `
.tl-phone{width:390px;height:800px;border-radius:44px;background:#0B1220;padding:12px;box-shadow:0 30px 60px rgba(15,23,42,.35);position:relative;flex-shrink:0}
.tl-phone>*{font-family:inherit}
.tl-status{height:30px;display:flex;justify-content:space-between;align-items:center;padding:0 22px;color:#fff;font-size:12.5px;background:#0E7490;border-radius:32px 32px 0 0}
.tl-offline{background:#B45309;color:#fff;font-size:11.5px;padding:5px 14px;text-align:center}
.tl-body{background:#F1F5F9;height:calc(100% - 30px);border-radius:0 0 32px 32px;overflow:hidden;display:flex;flex-direction:column;position:relative}
.tl-offline+.tl-body{height:calc(100% - 56px)}
.tl-hello{background:#0E7490;color:#fff;padding:14px 18px 18px}
.tl-tabs{display:flex;gap:6px;padding:10px 12px 0}
.tl-tabs button{flex:1;height:42px;border-radius:10px;border:0;background:#E2E8F0;font-size:14px;font-weight:600;color:#334155;cursor:pointer}
.tl-tabs button.on{background:#0F172A;color:#fff}
.tl-scroll{flex:1;overflow-y:auto;padding:12px;display:flex;flex-direction:column;gap:10px}
.tl-card{display:block;width:100%;text-align:left;background:#fff;border:2px solid #E2E8F0;border-radius:16px;padding:14px;cursor:pointer;font:inherit;color:#0F172A}
.tl-card.cur{border-color:#0E7490}
.tl-card.done{opacity:.6;cursor:default}
.tl-pill{font-size:12px;font-weight:700;background:#E0F2FE;color:#075985;padding:3px 9px;border-radius:999px}
.tl-new{font-size:11px;font-weight:800;background:#DC2626;color:#fff;padding:3px 8px;border-radius:999px;letter-spacing:.04em}
.tl-live{font-size:12px;font-weight:700;color:#0E7490}
.tl-big{font-size:18px;font-weight:700;margin:8px 0 4px;color:#0F172A}
.tl-muted{font-size:13px;color:#64748B}
.tl-empty{text-align:center;color:#94A3B8;padding:40px 0;font-size:14px}
.tl-bar{display:flex;align-items:center;gap:6px;background:#fff;padding:10px 8px;border-bottom:1px solid #E2E8F0}
.tl-back{width:36px;height:36px;border-radius:10px;border:0;background:#F1F5F9;font-size:24px;line-height:1;cursor:pointer}
.tl-title{font-size:16px;font-weight:700;text-align:center;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.tl-sub{font-size:11.5px;color:#64748B;text-align:center}
.tl-ctx{background:#E0F2FE;color:#075985;font-size:11.5px;padding:7px 14px;line-height:1.45}
.tl-progress{background:#0F172A;color:#fff;border-radius:16px;padding:14px}
.tl-num{font-size:30px;font-weight:800;margin:4px 0}
.tl-num small{font-size:14px;font-weight:500;opacity:.75}
.tl-track{height:8px;background:rgba(255,255,255,.18);border-radius:4px;overflow:hidden}
.tl-track div{height:100%;background:#22D3EE}
.tl-note{background:#FEF9C3;border-radius:12px;padding:10px 12px;font-size:13px;line-height:1.45}
.tl-info{background:#fff;border-radius:14px;padding:4px 12px}
.tl-info>div{display:flex;justify-content:space-between;gap:10px;padding:8px 0;border-bottom:1px solid #F1F5F9;font-size:13px}
.tl-info>div:last-child{border:0}
.tl-info span{color:#64748B;flex-shrink:0}
.tl-info b{text-align:right;font-weight:600}
.tl-main{width:100%;min-height:64px;border:0;border-radius:16px;background:#0E7490;color:#fff;font-size:17px;font-weight:800;letter-spacing:.02em;cursor:pointer;display:flex;flex-direction:column;align-items:center;justify-content:center;margin-top:4px}
.tl-main small{font-size:12px;font-weight:500;opacity:.85;letter-spacing:0}
.tl-main:disabled{background:#94A3B8;cursor:not-allowed}
.tl-row2{display:grid;grid-template-columns:1fr 1fr;gap:8px}
.tl-row3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px}
.tl-row3 button{height:58px;border-radius:12px;border:2px solid #E2E8F0;background:#fff;font-weight:700;font-size:13px;cursor:pointer;color:var(--c)}
.tl-row3 button.on{background:var(--c);color:#fff;border-color:var(--c)}
.tl-sec{height:52px;border-radius:14px;border:2px solid #CBD5E1;background:#fff;font-size:14px;font-weight:700;color:#0F172A;cursor:pointer}
.tl-sec.on{border-color:#0E7490;background:#E0F2FE}
.tl-sec.danger{color:#B91C1C;border-color:#FCA5A5}
.tl-sec.danger.on{background:#FEE2E2}
.tl-last{display:flex;align-items:center;gap:10px;background:#fff;border-radius:14px;padding:10px 12px;font-size:14px}
.tl-last>div{flex:1}
.tl-link{border:0;background:#E0F2FE;color:#075985;font-weight:700;border-radius:10px;padding:10px 14px;cursor:pointer;font-size:13px}
.tl-choice{width:100%;min-height:72px;background:#fff;border:2px solid #E2E8F0;border-radius:16px;display:flex;justify-content:space-between;align-items:center;padding:0 16px;font-size:16px;cursor:pointer;color:#0F172A}
.tl-choice:active{border-color:#0E7490}
.tl-padwrap{flex:1;display:flex;flex-direction:column;padding:12px;gap:10px}
.tl-padtype{text-align:center;font-size:13px;color:#64748B}
.tl-display{background:#fff;border-radius:16px;text-align:right;font-size:44px;font-weight:800;padding:12px 18px;font-variant-numeric:tabular-nums;color:#0F172A}
.tl-display small{font-size:16px;font-weight:500;color:#64748B}
.tl-pad{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;flex:1}
.tl-pad button{border:0;border-radius:14px;background:#fff;font-size:26px;font-weight:700;cursor:pointer;color:#0F172A;box-shadow:0 1px 0 #CBD5E1}
.tl-pad button:active{background:#E0F2FE}
.tl-warnicon{width:64px;height:64px;border-radius:50%;background:#FEF3C7;color:#B45309;font-size:36px;font-weight:900;display:grid;place-items:center;margin:16px auto 4px}
.tl-confirm{background:#fff;border:2px solid #0E7490;border-radius:18px;padding:18px;text-align:center}
.tl-tag{display:inline-block;margin-top:8px;font-size:11.5px;font-weight:700;padding:4px 9px;border-radius:999px;background:#E0F2FE;color:#075985}
.tl-tag.warn{background:#FEF3C7;color:#92400E}
.tl-chips{display:flex;flex-wrap:wrap;gap:8px}
.tl-chips button{min-height:42px;padding:0 14px;border-radius:999px;border:2px solid #CBD5E1;background:#fff;font-size:13.5px;font-weight:600;cursor:pointer;color:#0F172A}
.tl-chips button.on{background:#0F172A;color:#fff;border-color:#0F172A}
.tl-rec{display:flex;align-items:center;gap:10px;background:#fff;border-radius:12px;padding:10px 12px;font-size:14px}
.tl-plate{font-family:var(--font-mono,monospace);font-weight:800;font-size:17px;letter-spacing:.03em;background:#FEF3C7;border:2px solid #0F172A;border-radius:6px;padding:1px 8px;display:inline-block}
.tl-lock{background:#F1F5F9;border-radius:12px;padding:12px;font-size:28px;font-weight:800;margin-top:8px;display:flex;flex-direction:column}
.tl-lock small{font-size:11.5px;font-weight:500;color:#64748B;margin-top:4px}
.tl-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.tl-grid button{height:96px;border-radius:16px;border:2px solid #E2E8F0;background:#fff;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;font-size:14px;font-weight:700;cursor:pointer;color:#0F172A}
.tl-grid button.on{border-color:#DC2626}
.tl-toast{position:absolute;left:50%;bottom:26px;transform:translateX(-50%);background:#0F172A;color:#fff;padding:10px 16px;border-radius:999px;font-size:13px;font-weight:600;white-space:nowrap;z-index:5}
.tl-search{display:flex;align-items:center;gap:8px;background:#fff;border-radius:12px;padding:8px 12px;font-size:16px;border:2px solid #E2E8F0}
.tl-search .tl-q{flex:1;font-family:var(--font-mono,monospace);font-weight:700;letter-spacing:.06em}
.tl-search button{border:0;background:#F1F5F9;border-radius:8px;width:28px;height:28px;cursor:pointer}
.tl-minipad{display:grid;grid-template-columns:repeat(11,1fr);gap:4px;margin-top:6px}
.tl-minipad button{height:34px;border:0;border-radius:8px;background:#fff;font-weight:700;font-size:15px;cursor:pointer;color:#0F172A;box-shadow:0 1px 0 #CBD5E1}
`;

/* ============ MÀN DEMO: ĐIỆN THOẠI + PHÍA VĂN PHÒNG ============ */
const DdTallyScreen = ({ go }) => {
  /* pilot: màn theo dõi phía văn phòng — app tally thật chạy trên điện thoại (tally.html) */
  const myOrders = DD_ORDERS.filter(o => o.date === ddToday() && o.status !== "draft");
  const jobs = [...new Set(myOrders.map(o => o.job))].map(id => DD_JOBS.find(j => j.id === id));
  const recent = DD_RECORDS.filter(r => r.status !== "void").sort((a, b) => a.at < b.at ? 1 : -1).slice(0, 8);
  const recState = (r) => r.offline ? ["warning", "Chưa đồng bộ"] : r.status === "editReq" ? ["warning", "Xin sửa · chờ VP"] : r.status === "returned" ? ["danger", "VP trả lại"] : r.status === "shift" ? ["neutral", "Trong ca"] : r.status === "pending" ? ["accent", "Chờ VP duyệt"] : ["success", DD_JOBS.find(j => j.id === r.job)?.service === "bp" ? "VP đã duyệt" : "Đã ghi nhận"];

  return (
    <div className="page" style={{ maxWidth: 1400 }}>
      <div className="page-head">
        <div>
          <h1>App Tally (mobile)</h1>
          <div className="sub">1 app dùng chung, tài khoản ca × dịch vụ · hàng rời: qua cầu cân (lần 1 − lần 2) / cân treo / đếm · job cont: Gate In / Gate Out · Bãi cont: hạ bãi, đảo chuyển · cân chưa kết nối: nhập theo phiếu</div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "300px minmax(0,1fr)", gap: 28, alignItems: "start" }}>
        <div className="card"><div className="card-head"><h3>Mở App Tally</h3></div><div className="card-body" style={{ fontSize: 13, lineHeight: 1.6 }}>
          Tally mở trên điện thoại:<div className="mono" style={{ margin: "6px 0", wordBreak: "break-all" }}>{new URL("tally.html", location.href).href}</div>
          Đăng nhập bằng <b>tài khoản ca × dịch vụ</b> (VD Tally Ca 1 · ICD). Bản ghi mất mạng lưu trên máy, tự đồng bộ khi có mạng.
          <div style={{ marginTop: 10 }}><a className="btn btn-sm" href="tally.html" target="_blank" rel="noopener">Mở trong tab mới</a></div>
        </div></div>


        <div style={{ minWidth: 0, display: "flex", flexDirection: "column", gap: 16 }}>
          <div className="card">
            <div className="card-head"><div><h3>Tài khoản tally ca</h3><div className="sub">Theo ca × dịch vụ · bản ghi, sự cố ghi theo tài khoản ca · khoá / đặt lại mật khẩu: quản trị viên trên Supabase</div></div></div>
            <div className="tbl-wrap"><table className="tbl"><thead><tr><th>Tài khoản</th><th>Tên đăng nhập</th><th>Ca</th><th style={{ textAlign: "right" }}>Lệnh hôm nay</th></tr></thead>
              <tbody>{DD_TALLY_ACCS.map(a => <tr key={a.id}><td style={{ fontSize: 12.5 }}><b>{a.name}</b></td><td className="mono" style={{ fontSize: 12 }}>{a.login}</td><td className="mono" style={{ fontSize: 12 }}>{DD_SHIFTS[a.shift - 1].label}</td><td className="mono" style={{ textAlign: "right" }}>{DD_ORDERS.filter(o => o.tally.includes(a.id) && o.date === ddToday() && o.status !== "draft").length}</td>
</tr>)}</tbody></table></div>
          </div>
          <div className="card">
            <div className="card-head"><div><h3>Văn phòng thấy gì</h3><div className="sub">Cập nhật ngay sau mỗi lần tally bấm xác nhận (BRD 7.5)</div></div><span className="badge accent">Real-time</span></div>
            <div className="card-body" style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {jobs.length === 0 && <div className="muted" style={{ fontSize: 12.5 }}>Hôm nay chưa có lệnh ca đã gửi.</div>}
              {jobs.map(j => (
                <div key={j.id} style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) 220px", gap: 16, alignItems: "center" }}>
                  <div><span className="mono" style={{ fontSize: 12 }}>{j.id}</span> · <b style={{ fontWeight: 600 }}>{ddCusShort(j.customer)}</b> · {j.kind === "cont" ? ddDirLabel(j) : `${j.cargo} (${j.unit})`}<div className="muted" style={{ fontSize: 11.5 }}>{ddSvc(j.service).label} · {ddLoc(j)}{j.service === "bp" ? " · sản lượng chờ VP duyệt (US-BP-03)" : ""}</div></div>
                  <DdProgress job={j} />
                </div>
              ))}
              <button className="btn btn-sm" style={{ alignSelf: "flex-start" }} onClick={() => go("dd-shifts")}>Mở Lệnh làm việc ca</button>
            </div>
          </div>

          <div className="card">
            <div className="card-head"><h3>Bản ghi tally mới nhất</h3><span className="muted" style={{ fontSize: 12 }}>{DD_RECORDS.filter(r => r.status !== "void").length} bản ghi hôm nay</span></div>
            <div className="tbl-wrap"><table className="tbl">
              <thead><tr><th style={{ width: 64 }}>Giờ</th><th style={{ width: 106 }}>Lệnh</th><th>Tally</th><th>Cont · Phương tiện</th><th style={{ width: 110, textAlign: "right" }}>Khối lượng</th><th style={{ width: 150 }}>Trạng thái</th></tr></thead>
              <tbody>{recent.map(r => { const [c, l] = recState(r); const j = DD_JOBS.find(x => x.id === r.job); return (
                <tr key={r.id}>
                  <td className="mono" style={{ fontSize: 12 }}>{r.at.slice(-5)}</td>
                  <td className="mono" style={{ fontSize: 12 }}>{r.order}</td>
                  <td style={{ fontSize: 12.5 }}>{ddPerson(r.by).name}{r.abnormal && <span className="badge warning" style={{ marginLeft: 6, fontSize: 10.5 }}>Bất thường</span>}</td>
                  <td className="mono" style={{ fontSize: 12 }}>{r.cont ? tlContFmt(r.cont) : ""}{r.cont && r.plate ? " → " : ""}{r.plate || (r.cont ? "hạ bãi" : "")}</td>
                  <td className="mono" style={{ textAlign: "right" }}>{r.cont ? "1 cont" : `${tlFmt(r.qty)} ${ddUnit(j)}`}{r.prev != null && <div className="muted" style={{ fontSize: 10.5 }}>sửa từ {tlFmt(r.prev)}</div>}</td>
                  <td><span className={`badge ${c}`}>{l}</span></td>
                </tr>); })}</tbody>
            </table></div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div className="card">
              <div className="card-head"><h3>Yêu cầu sửa bản ghi</h3><span className="badge neutral">{DD_EDIT_REQS.length}</span></div>
              <div className="card-body" style={{ fontSize: 12.5 }}>
                {DD_EDIT_REQS.length === 0 && <div className="muted">Chưa có. Trên app: Bản ghi ca → “Xin sửa” ở bản ghi cũ.</div>}
                {DD_EDIT_REQS.map(q => <div key={q.id} style={{ padding: "6px 0", borderTop: "1px solid var(--line)" }}><b>{tlFmt(q.from)} → {tlFmt(q.to)}</b> · {q.reason}<div className="muted" style={{ fontSize: 11.5 }}>{ddPerson(q.by).name} · {q.order} · {q.at.slice(-5)} · chờ duyệt</div></div>)}
              </div>
            </div>
            <div className="card">
              <div className="card-head"><h3>Sự cố từ hiện trường</h3><span className="badge danger">{DD_INCIDENTS.filter(i => i.status === "open").length} mở</span></div>
              <div className="card-body" style={{ fontSize: 12.5 }}>
                {DD_INCIDENTS.map(i => { const t = TL_INC_TYPES.find(x => x.id === i.type); return (
                  <div key={i.id} style={{ padding: "6px 0", borderTop: "1px solid var(--line)" }}>
                    <span className="mono" style={{ fontSize: 11.5 }}>{i.id}</span> · <b>{t.label}</b> {ddIncDown(i) && <span className="badge warning" style={{ fontSize: 10.5 }}>Dừng {ddFmtMin(ddIncDown(i).mins)}{ddIncDown(i).open ? " · đang dừng" : ""}</span>}
                    <div className="muted" style={{ fontSize: 11.5 }}>{ddPerson(i.by).name} · {i.order} · {i.at.slice(-5)}{i.notes.length ? ` · ${i.notes.join(", ")}` : ""}{i.photo ? " · 1 ảnh" : ""}</div>
                  </div>); })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

Object.assign(window, { DdTallyScreen, DD_RECORDS, DD_EDIT_REQS, DD_INCIDENTS, TL_INC_TYPES, tlFmt, tlContFmt });
