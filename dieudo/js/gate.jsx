/* Điều độ khai thác — Cổng
   · Gate In / Gate Out: kiểm soát cont nhập/xuất qua khu vực giám sát hải quan (cổng bộ + river gate).
     Kiểm tra với: danh sách cont của job + lệnh giao/nhận của hãng tàu.
   · River gate: lịch cập/rời sà lan theo vị trí bến. */

/* ---------- Sổ cont tại cảng ---------- */
/* Sổ cont tại cảng — đối tượng khoá = số cont, nạp từ dd_docs (coll = cont_reg) */
const DD_CONT_REG = DD_BOOT.docs.cont_reg;
const ddReg = (c) => (DD_CONT_REG[c.no] = { ...(DD_CONT_REG[c.no] || {}), ...c });
/* ---------- Lệnh giao/nhận của hãng tàu ---------- */
const DD_SHIP_ORDER_TYPES = {
  booking:  { label: "Booking · lệnh hạ hàng xuất", dir: "in" },
  delivery: { label: "Lệnh giao hàng (EDO)",        dir: "out" },
  empty:    { label: "Lệnh cấp rỗng",               dir: "out" },
  emptyIn:  { label: "Lệnh trả rỗng",               dir: "in" },
};
const DD_SHIP_ORDERS = DD_BOOT.docs.ship_orders;

const DD_GATE_LOG = DD_BOOT.docs.gate_log;
/* River gate: cont lên/xuống sà lan = gate out/in qua đường sông (gọi từ app tally) */
const ddRiverGate = (no, dir, job, by, at, call) => {
  const j = DD_JOBS.find(x => x.id === job) || {};
  const c = DD_CONT_REG[no] || { no };
  const jc = (j.conts || []).find(x => x.no === no) || {};
  ddReg({ no, type: c.type || jc.type || "40GP", fe: c.fe || jc.fe || "F", line: (c.line && c.line !== "—" ? c.line : jc.line || j.line) || "—", customer: c.customer || j.customer, job, seal: jc.seal || c.seal || null, inPort: dir === "in", via: `River gate · ${j.vessel || "sà lan"}`, ...(dir === "in" ? { gateInAt: at, loc: "Chờ xếp bãi", pos: null } : { gateOutAt: at, loc: null, pos: null }) });
  DD_GATE_LOG.unshift({ id: ddNewId("G"), ch: "river", dir, no, truck: j.vessel || "sà lan", at, by, order: null, job, call: call || null, result: "ok", auto: true, seal: jc.seal || null });
};
/* Cổng bộ: tally bấm Gate In / Gate Out trên App Tally (v2.5) */
const ddRoadGate = (no, dir, job, by, at, truck) => {
  const j = DD_JOBS.find(x => x.id === job) || {};
  const c = DD_CONT_REG[no] || { no, type: (j.conts || []).find(x => x.no === no)?.type, fe: (j.conts || []).find(x => x.no === no)?.fe };
  const jc = (j.conts || []).find(x => x.no === no) || {};
  ddReg({ no, type: c.type || "40GP", fe: c.fe || "F", line: (c.line && c.line !== "—" ? c.line : jc.line || j.line) || "—", customer: c.customer || j.customer, job, seal: jc.seal || c.seal || null, inPort: dir === "in", via: "Đường bộ", ...(dir === "in" ? { gateInAt: at, loc: "Chờ xếp bãi", pos: null } : { gateOutAt: at, loc: null, pos: null }) });
  DD_GATE_LOG.unshift({ id: ddNewId("G"), ch: "road", dir, no, truck: truck || "—", at, by, order: null, job, result: "ok", tally: true, seal: jc.seal || null });
  window.ydReindex && ydReindex();
};
const ddGateUndo = (no) => {
  const i = DD_GATE_LOG.findIndex(g => g.no === no && g.result === "ok"); if (i < 0) return;
  const g = DD_GATE_LOG[i]; DD_GATE_LOG.splice(i, 1);
  if (DD_CONT_REG[no]) DD_CONT_REG[no].inPort = g.dir !== "in";
};
const ddRiverGateUndo = (no) => {
  const i = DD_GATE_LOG.findIndex(g => g.no === no && g.ch === "river" && g.result === "ok");
  if (i < 0) return; const g = DD_GATE_LOG[i]; DD_GATE_LOG.splice(i, 1);
  if (DD_CONT_REG[no]) DD_CONT_REG[no].inPort = g.dir !== "in";
};
const DD_CUSTOMS_ST = { cleared: "Đã thông quan", released: "Giải phóng hàng", storage: "Mang hàng về bảo quản", none: "Chưa có tờ khai" };
const ddDwell = (at) => at ? Math.max(0, Math.round((ddD(ddToday()) - ddD(at.slice(0, 10))) / 864e5)) : 0;

/* Thông tin tham chiếu 1 cont tại cổng — chỉ ghi nhận, không kiểm tra / không chặn (chốt 04/11) */
const ddGateCheck = (no, dir) => {
  const c = DD_CONT_REG[no];
  const jobs = DD_JOBS.filter(j => j.kind === "cont" && j.conts.some(x => x.no === no));
  const need = Object.entries(DD_SHIP_ORDER_TYPES).filter(([, v]) => v.dir === dir).map(([k]) => k);
  const orders = DD_SHIP_ORDERS.filter(o => o.conts.includes(no) && need.includes(o.type));
  const items = [];
  const odd = dir === "in" ? !!(c && c.inPort) : !(c && c.inPort);
  items.push({ lv: odd ? "warn" : "info", t: (c && c.inPort ? `Sổ cont: đang ở cảng · ${c.loc || "chưa có vị trí"} · lưu ${ddDwell(c.gateInAt)} ngày` : "Sổ cont: chưa có trong cảng") + (odd ? " — vẫn ghi được, sổ cont cập nhật theo lần ghi này" : "") });
  if (jobs.length) items.push({ lv: "info", t: `Thuộc ${jobs.map(j => `${j.id} (${ddCusShort(j.customer)})`).join(", ")}` });
  if (orders.length) items.push({ lv: "info", t: `Lệnh hãng tàu (tham chiếu): ${orders[0].id} · ${DD_SHIP_ORDER_TYPES[orders[0].type].label} · hạn ${orders[0].validTo}` });
  return { c, jobs, order: orders[0] || null, items, blocked: false, warn: odd };
};

const DdCheck = ({ lv, t }) => {
  const m = { ok: ["var(--st-success)", "✓"], warn: ["var(--st-warning)", "!"], err: ["var(--st-danger)", "✕"], info: ["var(--t-tertiary)", "·"] }[lv];
  return <div style={{ display: "flex", gap: 9, alignItems: "flex-start", fontSize: 12.5, padding: "4px 0" }}><span style={{ width: 18, height: 18, borderRadius: 999, background: m[0], color: "#fff", display: "grid", placeItems: "center", fontSize: 11, fontWeight: 800, flexShrink: 0 }}>{m[1]}</span><span>{t}</span></div>;
};

/* =================== GATE IN / OUT =================== */
const DdGateScreen = ({ go }) => {
  const [, force] = React.useState(0);
  const [dir, setDir] = React.useState("in");
  const [q, setQ] = React.useState("");
  const [no, setNo] = React.useState("");
  const [truck, setTruck] = React.useState("");
  const [seal, setSeal] = React.useState("");
  const [why, setWhy] = React.useState("");
  const [cno, setCno] = React.useState("");
  const [cst, setCst] = React.useState("cleared");
  const [newOrder, setNewOrder] = React.useState(false);
  const [tab, setTab] = React.useState("yard");
  const [yq, setYq] = React.useState("");
  const [toast, flash] = useKdToast();
  const reset = () => { setQ(""); setNo(""); setTruck(""); setSeal(""); setWhy(""); setCno(""); setCst("cleared"); };

  const all = Object.values(DD_CONT_REG);
  const candidates = q.length >= 3 ? all.filter(c => c.no.includes(q.toUpperCase().replace(/\s/g, "")) && (dir === "in" ? !c.inPort : c.inPort)).slice(0, 6) : [];
  const typed = ddContCheck(q);
  const chk = no ? ddGateCheck(no, dir) : null;
  const reg = no && DD_CONT_REG[no];
  const trucks = DD_VEHICLES.filter(v => v.kind === "keo");
  const needCustoms = false; /* tờ khai hải quan: xử lý giai đoạn sau */
  const customsErr = needCustoms && dir === "out" && (!cno.trim() || cst === "none") ? "Cont hàng ra khỏi khu vực giám sát phải có tờ khai đã thông quan / giải phóng hàng / mang về bảo quản" : null;
  const can = chk && truck && !customsErr;

  const confirm = () => {
    const id = ddNewId("G");
    const at = `${ddNow()}`;
    DD_GATE_LOG.unshift({ id, ch: "road", dir, no, truck, at, by: DD_ME.id, order: chk.order?.id || null, job: chk.jobs[0]?.id || null, result: "ok", seal, note: why.trim() || null, customs: cno.trim() ? { no: cno.trim(), st: cst } : null });
    if (dir === "in") {
      ddReg({ no, type: reg?.type || "40GP", fe: reg?.fe || "F", line: reg?.line || chk.order?.line || "—", customer: reg?.customer || chk.order?.customer || null, job: chk.jobs[0]?.id || null, inPort: true, via: "Đường bộ", gateInAt: at, loc: "Chờ xếp bãi", pos: null, planned: false });
      chk.jobs.forEach(j => { const c = j.conts.find(x => x.no === no); if (c) delete c.notInPort; });
    } else {
      DD_CONT_REG[no] = { ...DD_CONT_REG[no], inPort: false, gateOutAt: at, loc: null, pos: null }; window.ydReindex && ydReindex();
    }
    chk.jobs.forEach(j => j.log.unshift({ at, by: DD_ME.id, text: `Gate ${dir === "in" ? "In" : "Out"} ${tlContFmt(no)} · xe ${truck}${why.trim() ? ` · ${why.trim()}` : ""}` }));
    flash(`${dir === "in" ? "Gate In" : "Gate Out"} ${tlContFmt(no)} · ${truck}`); reset(); force(x => x + 1);
  };
  const inPort = all.filter(c => c.inPort);
  const today = DD_GATE_LOG.filter(g => g.at.startsWith(ddToday()));
  const yard = inPort.filter(c => !yq || [c.no, c.line, c.loc, ddCusShort(c.customer || "")].join(" ").toUpperCase().includes(yq.toUpperCase())).sort((a, b) => ddDwell(b.gateInAt) - ddDwell(a.gateInAt)).slice(0, 300);

  return (
    <div className="page" style={{ maxWidth: 1480 }}>
      <div className="page-head">
        <div><h1>Gate In / Gate Out</h1><div className="sub">Ghi nhận cont vào / ra cảng để cập nhật sổ cont và bãi · tally ghi trên App Tally (cổng bộ và kênh sông) · không kiểm tra, không chặn (tờ khai hải quan: giai đoạn sau)</div></div>
      </div>

      <div className="kpi-grid" style={{ marginBottom: 18 }}>
        {[
          { l: "Cont đang ở cảng", v: inPort.length, d: `${inPort.filter(c => c.fe === "F").length} hàng · ${inPort.filter(c => c.fe === "E").length} rỗng`, c: "#0E7490" },
          { l: "Gate In hôm nay", v: today.filter(g => g.dir === "in" && g.result === "ok").length, d: `${today.filter(g => g.dir === "in" && g.result === "ok" && g.ch === "road").length} cổng bộ · ${today.filter(g => g.dir === "in" && g.result === "ok" && g.ch === "river").length} river gate`, c: "#16A34A" },
          { l: "Gate Out hôm nay", v: today.filter(g => g.dir === "out" && g.result === "ok").length, d: `${today.filter(g => g.dir === "out" && g.result === "ok" && g.ch === "road").length} cổng bộ · ${today.filter(g => g.dir === "out" && g.result === "ok" && g.ch === "river").length} river gate`, c: "#1E5FB7" },
          { l: "Chờ xếp bãi", v: inPort.filter(c => !c.pos).length, d: "đã gate in, chưa có vị trí", c: "#D97706" },
        ].map(k => <div key={k.l} className="kpi"><div className="lbl"><span className="swatch" style={{ background: k.c }}></span>{k.l}</div><div className="val">{k.v} <small>cont</small></div><div className="delta">{k.d}</div></div>)}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "460px minmax(0,1fr)", gap: 18, alignItems: "start" }}>
        <div className="card" style={{ position: "sticky", top: 16 }}>
          <div className="card-head"><h3>Ai ghi Gate In / Gate Out</h3></div>
          <div className="card-body" style={{ display: "flex", flexDirection: "column", gap: 10, fontSize: 13, lineHeight: 1.5 }}>
            <div>Gate In / Gate Out do <b>tally</b> ghi trên <b>App Tally</b> (2 nút Gate In / Gate Out trong job container), ở cổng bộ cũng như tại cẩu. Không còn vai trò nhân viên cổng.</div>
            <div style={{ padding: "8px 12px", background: "var(--bg-canvas)", border: "1px solid var(--line)", borderRadius: "var(--r-md)" }}>
              <b>Quy tắc (BR-GATE-11)</b><br/>Gate in: cont vào lưu tại VNL (qua cổng bộ, hoặc dỡ sà lan xuống hạ bãi).<br/>Gate out: cont rời VNL (lên sà lan, hoặc ra cổng bộ).<br/>Xuất thẳng: chỉ có gate out.
            </div>
            <div className="muted" style={{ fontSize: 12 }}>Màn này để KHTH theo dõi sổ cont, nhật ký gate và lệnh hãng tàu (tham chiếu).</div>
            <button className="btn primary" onClick={() => go("dd-tally")}><Icon name="qrcode" size={13}/> Mở App Tally</button>
          </div>
        </div>

        <div style={{ minWidth: 0, display: "flex", flexDirection: "column", gap: 18 }}>
          <div className="card">
            <div className="tabs">
              {[["yard", "Cont đang ở cảng", inPort.length], ["log", "Lịch sử qua cổng hôm nay", today.length], ["orders", "Lệnh hãng tàu", DD_SHIP_ORDERS.length]].map(([k, l, n]) => <div key={k} className={`tab ${tab === k ? "active" : ""}`} onClick={() => setTab(k)}>{l}<span className="count">{n}</span></div>)}
            </div>
            {tab === "yard" && (<>
              <div style={{ padding: "10px 16px" }}><div className="search" style={{ margin: 0, maxWidth: 360 }}><Icon name="search" size={14} className="muted"/><input value={yq} onChange={e => setYq(e.target.value)} placeholder="Tìm số cont, hãng tàu, vị trí, khách hàng…" /></div></div>
              <div className="tbl-wrap" style={{ maxHeight: 520, overflowY: "auto" }}><table className="tbl">
                <thead><tr><th>Số cont</th><th style={{ width: 90 }}>Loại</th><th style={{ width: 90 }}>Hãng</th><th>Khách hàng · Job</th><th style={{ width: 110 }}>Vị trí</th><th style={{ width: 150 }}>Vào cảng</th><th style={{ width: 90, textAlign: "right" }}>Lưu bãi</th></tr></thead>
                <tbody>{yard.map(c => { const d = ddDwell(c.gateInAt); return (
                  <tr key={c.no}>
                    <td className="mono" style={{ fontWeight: 600, fontSize: 12.5 }}>{tlContFmt(c.no)}{c.seal && <div className="muted" style={{ fontSize: 11, fontWeight: 400 }}>seal {c.seal}</div>}</td>
                    <td style={{ fontSize: 12 }}>{c.type} · {c.fe === "F" ? "Hàng" : "Rỗng"}</td>
                    <td style={{ fontSize: 12 }}>{c.line}</td>
                    <td style={{ fontSize: 12 }}>{c.customer ? ddCusShort(c.customer) : "—"}{c.job && <div className="muted mono" style={{ fontSize: 11 }}>{c.job}</div>}</td>
                    <td className="mono" style={{ fontSize: 12 }}>{c.loc}</td>
                    <td style={{ fontSize: 12 }}><span className="mono">{(c.gateInAt || "").slice(0, 5)} {(c.gateInAt || "").slice(-5)}</span><div className="muted" style={{ fontSize: 11 }}>{c.via}</div></td>
                    <td className="mono" style={{ textAlign: "right", color: d >= 10 ? "var(--st-danger)" : d >= 5 ? "var(--st-warning)" : "inherit" }}>{d} ngày</td>
                  </tr>); })}</tbody>
              </table></div>
            </>)}
            {tab === "log" && (
              <div className="tbl-wrap"><table className="tbl">
                <thead><tr><th style={{ width: 64 }}>Giờ</th><th style={{ width: 150 }}>Cổng · Hướng</th><th>Số cont</th><th style={{ width: 120 }}>Xe / sà lan</th><th>Lệnh · Job</th><th style={{ width: 200 }}>Kết quả</th></tr></thead>
                <tbody>{today.map(g => (
                  <tr key={g.id}>
                    <td className="mono" style={{ fontSize: 12 }}>{g.at.slice(-5)}</td>
                    <td><span className={`badge ${g.dir === "in" ? "success" : "accent"}`}>{g.dir === "in" ? "Gate In" : "Gate Out"}</span><div className="muted" style={{ fontSize: 11, marginTop: 2 }}>{g.ch === "river" ? "River gate · tự động" : "Cổng bộ"}</div></td>
                    <td className="mono" style={{ fontWeight: 600, fontSize: 12.5 }}>{tlContFmt(g.no)}{g.seal && <div className="muted" style={{ fontSize: 11, fontWeight: 400 }}>seal {g.seal}</div>}</td>
                    <td className="mono" style={{ fontSize: 12 }}>{g.truck}</td>
                    <td style={{ fontSize: 12 }}>{g.order || "—"}<div className="muted mono" style={{ fontSize: 11 }}>{g.job || ""}</div></td>
                    <td style={{ fontSize: 12 }}>{g.result === "ok" ? <span className="badge success">Đã qua cổng</span> : <><span className="badge danger">Từ chối</span><div className="muted" style={{ fontSize: 11, marginTop: 2 }}>{g.why}</div></>}{g.note && <div className="muted" style={{ fontSize: 11 }}>{g.note}</div>}</td>
                  </tr>))}</tbody>
              </table></div>
            )}
            {tab === "log" && <div style={{ padding: "10px 16px", borderTop: "1px solid var(--line)" }}><button className="btn btn-sm" onClick={() => flash("Đã xuất danh sách cont qua khu vực giám sát (Excel) — gửi hải quan")}><Icon name="download" size={12}/> Xuất danh sách cho hải quan</button></div>}
            {tab === "orders" && <div style={{ padding: "10px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}><span className="muted" style={{ fontSize: 12 }}>Hiện nhập tay theo lệnh / booking hãng tàu gửi qua email.</span><button className="btn btn-sm accent" onClick={() => setNewOrder(true)}><Icon name="plus" size={12}/> Thêm lệnh hãng tàu</button></div>}
            {tab === "orders" && (
              <div className="tbl-wrap"><table className="tbl">
                <thead><tr><th style={{ width: 140 }}>Lệnh</th><th>Loại</th><th style={{ width: 90 }}>Hãng</th><th>Khách hàng · Job</th><th style={{ width: 110 }}>Hạn</th><th style={{ width: 120 }}>Tiến độ</th></tr></thead>
                <tbody>{DD_SHIP_ORDERS.map(o => { const expired = ddD(o.validTo) < ddD(ddToday()); const dirv = DD_SHIP_ORDER_TYPES[o.type].dir; const done = o.conts.filter(n => DD_GATE_LOG.some(g => g.no === n && g.dir === dirv && g.result === "ok")).length; return (
                  <tr key={o.id}>
                    <td className="mono" style={{ fontSize: 12 }}>{o.id}</td>
                    <td style={{ fontSize: 12.5 }}>{DD_SHIP_ORDER_TYPES[o.type].label}<div className="muted" style={{ fontSize: 11 }}>{o.note}</div></td>
                    <td style={{ fontSize: 12 }}>{o.line}</td>
                    <td style={{ fontSize: 12 }}>{o.customer ? ddCusShort(o.customer) : "—"}<div className="muted mono" style={{ fontSize: 11 }}>{o.job || ""}</div></td>
                    <td><span className={`badge ${expired ? "danger" : "neutral"}`}>{expired ? "Hết hạn " : ""}{o.validTo}</span></td>
                    <td className="mono" style={{ fontSize: 12 }}>{done}/{o.conts.length} cont</td>
                  </tr>); })}</tbody>
              </table></div>
            )}
          </div>

        </div>
      </div>
      {newOrder && <DdShipOrderModal onClose={() => setNewOrder(false)} onSave={(m) => { setNewOrder(false); setTab("orders"); force(x => x + 1); flash(m); }} />}
      <KdToast text={toast} />
    </div>
  );
};

/* Nhập tay lệnh giao/nhận của hãng tàu */
const DdShipOrderModal = ({ onClose, onSave }) => {
  const [f, setF] = React.useState({ type: "delivery", id: "", line: "ONE", customer: "", job: "", validTo: ddIso(ddFmt(new Date(ddD(ddToday()).getTime() + 7 * 864e5))), note: "", text: "" });
  const [msg, setMsg] = React.useState("");
  const set = (k, v) => setF(s => ({ ...s, [k]: v }));
  const lines = f.text.split(/\n/).map(x => x.trim()).filter(Boolean).map(x => ddContCheck(x.split(/[\s,;\t]+/)[0]));
  const ok = lines.filter(c => c.ok);
  const jobs = DD_JOBS.filter(j => j.kind === "cont" && (!f.customer || j.customer === f.customer));
  const valid = f.id.trim() && ok.length && ok.length === lines.length && f.validTo;
  const save = () => {
    const o = { id: f.id.trim().toUpperCase(), type: f.type, line: f.line, customer: f.customer || null, validTo: ddFromIso(f.validTo), conts: ok.map(c => c.no), job: f.job || null, note: f.note, manual: true };
    DD_SHIP_ORDERS.unshift(o);
    if (DD_SHIP_ORDER_TYPES[f.type].dir === "in") o.conts.forEach(no => { if (!DD_CONT_REG[no]) ddReg({ no, type: "40GP", fe: f.type === "emptyIn" ? "E" : "F", line: f.line, customer: o.customer, job: o.job, inPort: false, planned: true }); });
    onSave(`Đã thêm lệnh ${o.id} · ${o.conts.length} cont`);
  };
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" style={{ width: 680 }} onClick={e => e.stopPropagation()}>
        <div className="modal-head"><h3>Thêm lệnh hãng tàu</h3><button className="icon-btn" onClick={onClose}><Icon name="x" size={16}/></button></div>
        <div className="modal-body">
          <div className="field-row">
            <div className="field"><label>Loại lệnh</label><select className="select" value={f.type} onChange={e => set("type", e.target.value)}>{Object.entries(DD_SHIP_ORDER_TYPES).map(([k, v]) => <option key={k} value={k}>{v.label} · {v.dir === "in" ? "gate in" : "gate out"}</option>)}</select></div>
            <div className="field"><label>Số lệnh / booking <span className="req">*</span></label><input className="input mono" value={f.id} onChange={e => set("id", e.target.value)} placeholder="VD EDO-ONE-33020" /></div>
          </div>
          <div className="field-row">
            <div className="field"><label>Hãng tàu</label><select className="select" value={f.line} onChange={e => set("line", e.target.value)}>{["ONE", "CMA CGM", "Maersk", "Wan Hai", "MSC", "Evergreen", "COSCO"].map(x => <option key={x}>{x}</option>)}</select></div>
            <div className="field"><label>Hạn lệnh <span className="req">*</span></label><input className="input" type="date" value={f.validTo} onChange={e => set("validTo", e.target.value)} /></div>
          </div>
          <div className="field-row">
            <div className="field"><label>Khách hàng <span className="opt">— từ module KD</span></label><select className="select" value={f.customer} onChange={e => setF(s => ({ ...s, customer: e.target.value, job: "" }))}><option value="">— Không / chưa rõ —</option>{(window.KD_CUSTOMERS || []).map(c => <option key={c.id} value={c.id}>{c.shortName || c.name}</option>)}</select></div>
            <div className="field"><label>Job <span className="opt">— nếu có</span></label><select className="select" value={f.job} onChange={e => set("job", e.target.value)}><option value="">— Không gắn —</option>{jobs.map(j => <option key={j.id} value={j.id}>{j.id} · {ddCusShort(j.customer)}</option>)}</select></div>
          </div>
          <div className="field"><label>Danh sách cont <span className="req">*</span> <span className="opt">— mỗi dòng 1 cont</span></label>
            <textarea className="textarea mono" rows={5} value={f.text} onChange={e => set("text", e.target.value)} style={{ fontSize: 12.5 }} />
            <div className="row" style={{ gap: 8, marginTop: 6, alignItems: "center" }}>
              <label className="btn btn-sm" style={{ cursor: "pointer" }}><Icon name="upload" size={12}/> Nhập từ Excel
                <input type="file" accept=".xlsx,.xls,.csv" style={{ display: "none" }} onChange={e => { const fl = e.target.files[0]; e.target.value = ""; if (!fl) return; ddReadContFile(fl).then(ls => { setF(s => ({ ...s, text: [s.text.trim(), ...ls.map(l => l.split(" ")[0])].filter(Boolean).join("\n") })); setMsg(`Đã đọc ${ls.length} cont`); }).catch(err => setMsg(err.message)); }} />
              </label>
              {lines.length > 0 && <span style={{ fontSize: 12 }}><b>{ok.length}</b> hợp lệ{lines.length > ok.length && <span style={{ color: "var(--st-danger)" }}> · {lines.length - ok.length} lỗi: {lines.filter(c => !c.ok).map(c => c.no || "?").join(", ")}</span>}</span>}
              {msg && <span className="muted" style={{ fontSize: 12 }}>{msg}</span>}
            </div>
          </div>
          <div className="field"><label>Ghi chú</label><input className="input" value={f.note} onChange={e => set("note", e.target.value)} /></div>
        </div>
        <div className="modal-foot"><button className="btn ghost" onClick={onClose}>Huỷ</button><button className="btn primary" disabled={!valid} onClick={save}>Lưu lệnh</button></div>
      </div>
    </div>
  );
};

/* =================== RIVER GATE · LỊCH SÀ LAN =================== */
/* Vị trí bến: danh mục bến dùng chung OCC_BERTHS (bến phao + bến ICD) */
const DD_BERTH_INFO = DD_OCC_BERTHS.map(b => ({ id: b.id, group: b.kind === "icd" ? "Bến ICD · OCC" : "Bến phao · OCC", cap: b.cap }));
const DD_BERTHS = DD_BERTH_INFO.map(b => b.id);
/* Khung lịch sà lan: từ hôm qua, 4 ngày (theo ngày hiện tại GMT+7 lúc mở trang) */
const DD_RV = { start: ddFmt(new Date(ddD(ddToday()).getTime() - 864e5)), days: 4 };
const ddRvH = (d, t) => (ddD(d) - ddD(DD_RV.start)) / 36e5 + Number(t.slice(0, 2)) + Number(t.slice(3, 5)) / 60;
const DD_CALLS = DD_BOOT.docs.calls;
const DD_CALL_STATUS = { planned: ["neutral", "Kế hoạch", "#94A3B8"], working: ["warning", "Đang cập · làm hàng", "#0E7490"], departed: ["success", "Đã rời", "#64748B"] };
const ddCallConflicts = (c, list = DD_CALLS) => {
  const a = ddRvH(...c.eta), b = ddRvH(...c.etd);
  return list.filter(x => x.id !== c.id && (x.berth === c.berth || x.barge === c.barge) && ddRvH(...x.eta) < b && a < ddRvH(...x.etd))
    .map(x => ({ x, kind: x.berth === c.berth ? "berth" : "barge" }));
};

const DdRiverScreen = ({ go, embed, onPick }) => {
  const [, force] = React.useState(0);
  const [sel, setSel] = React.useState(null);
  const [form, setForm] = React.useState(null);
  const [toast, flash] = useKdToast();
  const total = DD_RV.days * 24, PX = 13;
  const now = ddRvH(ddToday(), window.ddVnNow().time);
  const barges = DD_VEHICLES.filter(v => v.kind === "salan").map(v => v.plate);
  const jobsFor = DD_JOBS.filter(j => ["planned", "running"].includes(j.status) && ["bp", "icd"].includes(j.service));
  const allConf = DD_CALLS.filter(c => c.status !== "departed" && ddCallConflicts(c).length);
  const cur = sel && DD_CALLS.find(c => c.id === sel);

  const openNew = (berth, h) => {
    const d = new Date(ddD(DD_RV.start).getTime() + Math.floor((h ?? now + 2)) * 36e5);
    const dd = ddFmt(d), t = `${String(d.getHours()).padStart(2, "0")}:00`;
    const e = new Date(d.getTime() + 12 * 36e5);
    setForm({ id: null, barge: barges[0], berth: berth || DD_BERTHS[0], eta: [dd, t], etd: [ddFmt(e), `${String(e.getHours()).padStart(2, "0")}:00`], job: jobsFor[0]?.id || "", status: "planned" });
  };
  const fConf = form ? ddCallConflicts(form) : [];
  const fOk = form && ddRvH(...form.etd) > ddRvH(...form.eta);
  const save = () => {
    if (form.id) Object.assign(DD_CALLS.find(c => c.id === form.id), form);
    else { const id = ddNewId("SL"); DD_CALLS.push({ ...form, id }); const j = DD_JOBS.find(x => x.id === form.job); if (j) j.log.unshift({ at: ddNow(), by: DD_ME.id, text: `Lên lịch ${form.barge} cập ${form.berth} ${form.eta[0].slice(0, 5)} ${form.eta[1]} → ${form.etd[0].slice(0, 5)} ${form.etd[1]}` }); }
    setForm(null); force(x => x + 1); flash(fConf.length ? "Đã lưu — còn trùng lịch, cần xử lý" : "Đã lưu lịch sà lan");
  };
  const DT = ({ v, on }) => (
    <div className="row" style={{ gap: 6 }}>
      <input className="input" type="date" value={ddIso(v[0])} onChange={e => on([ddFromIso(e.target.value), v[1]])} />
      <input className="input mono" type="time" step="1800" value={v[1]} onChange={e => on([v[0], e.target.value])} style={{ width: 120, flexShrink: 0 }} />
    </div>
  );

  return (
    <div className={embed ? "" : "page"} style={{ maxWidth: 1560, padding: embed ? 14 : undefined }}>
      {embed && <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}><div className="muted" style={{ fontSize: 12.5 }}>Lịch cầu bến công khai cho nhà sà lan · bấm vào lượt để xem chi tiết, mốc thực tế, danh sách xếp/dỡ</div><button className="btn accent btn-sm" onClick={() => openNew()}><Icon name="plus" size={13}/> Lên lịch sà lan</button></div>}
      {!embed && <div className="page-head">
        <div><h1>River gate · Lịch sà lan</h1><div className="sub">Lịch cập / rời sà lan theo vị trí bến (danh mục bến từ OCC) · cảnh báo trùng bến hoặc một sà lan bị xếp hai nơi cùng lúc · cont lên/xuống sà lan tự ghi gate in/out qua river gate</div></div>
        <div className="actions"><button className="btn accent" onClick={() => openNew()}><Icon name="plus" size={14}/> Lên lịch sà lan</button></div>
      </div>}

      {allConf.length > 0 && (
        <div style={{ padding: "10px 14px", borderRadius: "var(--r-sm)", background: "var(--st-danger-bg, #FDECEC)", fontSize: 12.5, marginBottom: 14, display: "flex", gap: 8 }}>
          <Icon name="alert" size={15} style={{ color: "var(--st-danger)" }}/><div><b>{allConf.length} lượt sà lan đang trùng lịch:</b> {allConf.map(c => `${c.barge} (${c.berth})`).join(", ")}</div>
        </div>
      )}

      <div style={{ overflowX: "auto", border: "1px solid var(--line)", borderRadius: "var(--r-md)", background: "var(--bg-surface)" }}>
        <div style={{ display: "grid", gridTemplateColumns: `150px ${total * PX}px`, minWidth: 150 + total * PX }}>
          <div style={{ borderBottom: "1px solid var(--line)", background: "var(--bg-canvas)" }}></div>
          <div style={{ position: "relative", height: 46, borderBottom: "1px solid var(--line)", background: "var(--bg-canvas)" }}>
            {Array.from({ length: DD_RV.days }, (_, d) => { const dt = new Date(ddD(DD_RV.start).getTime() + d * 864e5); return (
              <div key={d} style={{ position: "absolute", left: d * 24 * PX, width: 24 * PX, top: 0, height: 46, borderLeft: "1px solid var(--line)" }}>
                <div style={{ fontSize: 12, fontWeight: 700, padding: "4px 8px", background: ddFmt(dt) === ddToday() ? "var(--st-warning-bg)" : undefined }}>{["CN", "T2", "T3", "T4", "T5", "T6", "T7"][dt.getDay()]} {ddFmt(dt).slice(0, 5)}</div>
                {[0, 6, 12, 18].map(h => <span key={h} className="mono muted" style={{ position: "absolute", left: h * PX + 3, bottom: 3, fontSize: 10 }}>{String(h).padStart(2, "0")}h</span>)}
              </div>); })}
          </div>
          {DD_BERTHS.map(b => (
            <React.Fragment key={b}>
              <div style={{ padding: "12px", borderBottom: "1px solid var(--line)", fontSize: 13, fontWeight: 600, background: "var(--bg-canvas)" }}>{b}<div className="muted" style={{ fontSize: 11, fontWeight: 400 }}>{(DD_BERTH_INFO.find(x => x.id === b) || {}).group}{(DD_BERTH_INFO.find(x => x.id === b) || {}).cap ? ` · ${(DD_BERTH_INFO.find(x => x.id === b) || {}).cap}` : ""}</div></div>
              <div style={{ position: "relative", height: 80, borderBottom: "1px solid var(--line)", cursor: "copy" }}
                onDoubleClick={e => { const r = e.currentTarget.getBoundingClientRect(); openNew(b, (e.clientX - r.left) / PX); }}>
                {Array.from({ length: DD_RV.days * 4 }, (_, k) => <div key={k} style={{ position: "absolute", left: k * 6 * PX, top: 0, bottom: 0, borderLeft: `1px ${k % 4 ? "dashed" : "solid"} var(--line)`, opacity: k % 4 ? .5 : 1 }}></div>)}
                {DD_CALLS.filter(c => c.berth === b).map(c => {
                  const a = ddRvH(...c.eta), z = ddRvH(...c.etd); const conf = c.status !== "departed" && ddCallConflicts(c).length; const st = DD_CALL_STATUS[c.status]; const j = DD_JOBS.find(x => x.id === c.job);
                  return (
                    <div key={c.id} onClick={() => { setSel(c.id); onPick && onPick(c.id); }} title={`${c.barge} · ${c.eta.join(" ")} → ${c.etd.join(" ")}`}
                      style={{ position: "absolute", left: Math.max(0, a) * PX, width: Math.max(18, (Math.min(total, z) - Math.max(0, a)) * PX), top: 9, height: 62, borderRadius: 6, cursor: "pointer", overflow: "hidden",
                        background: c.status === "planned" ? "var(--bg-surface)" : st[2], color: c.status === "planned" ? "var(--t-primary)" : "#fff",
                        border: `2px ${c.status === "planned" ? "dashed" : "solid"} ${conf ? "#DC2626" : st[2]}`, boxShadow: sel === c.id ? "0 0 0 3px rgba(14,116,144,.3)" : "none", padding: "4px 8px", opacity: c.status === "departed" ? .55 : 1 }}>
                      <div style={{ fontSize: 12, fontWeight: 700, whiteSpace: "nowrap" }}>{conf ? "⚠ " : ""}{c.barge}{c.op && c.op !== "vnl" ? " · ngoài" : ""}</div>
                      <div style={{ fontSize: 11, whiteSpace: "nowrap", opacity: .9 }}>{j ? `${ddCusShort(j.customer)} · ${j.kind === "cont" ? (j.contDir === "export" ? "cont xuất" : "cont nhập") : j.cargo}` : "—"}</div>
                      <div className="mono" style={{ fontSize: 10.5, whiteSpace: "nowrap", opacity: .85 }}>{c.eta[1]} → {c.etd[0].slice(0, 5)} {c.etd[1]}</div>
                    </div>);
                })}
                <div style={{ position: "absolute", left: now * PX, top: 0, bottom: 0, width: 2, background: "#DC2626" }}></div>
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>
      <div className="muted" style={{ fontSize: 11.5, margin: "8px 0 18px" }}>Thanh đặc = đang cập / làm hàng · viền đứt = kế hoạch · viền đỏ = trùng lịch · vạch đỏ = hiện tại (02/11 15:40) · nhấp đúp vào hàng bến để lên lịch nhanh.</div>

      {cur && !embed && (() => { const j = DD_JOBS.find(x => x.id === cur.job); const conf = ddCallConflicts(cur); const st = DD_CALL_STATUS[cur.status]; return (
        <div className="card" style={{ maxWidth: 760 }}>
          <div className="card-head"><div><h3><span className="mono">{cur.id}</span> · {cur.barge} · {cur.berth}</h3><div className="sub">{cur.eta.join(" ")} → {cur.etd.join(" ")} · {((ddRvH(...cur.etd) - ddRvH(...cur.eta))).toFixed(0)} giờ</div></div><span className={`badge ${st[0]}`}>{st[1]}</span></div>
          <div className="card-body" style={{ fontSize: 12.5, display: "flex", flexDirection: "column", gap: 8 }}>
            {j && <div>Job: <a style={{ cursor: "pointer", color: "var(--brand-ink)" }} onClick={() => go("dd-job-detail", { id: j.id })}><span className="mono">{j.id}</span></a> · {ddCus(j.customer).name} · {j.kind === "cont" ? `${ddDirLabel(j)} · ${j.conts.length} cont` : `${j.cargo} · ${ddNum(j.plan)} ${ddUnit(j)}`}</div>}
            {conf.map(({ x, kind }) => <div key={x.id} style={{ color: "var(--st-danger)" }}>⚠ {kind === "berth" ? `Trùng bến với ${x.barge}` : `${cur.barge} cùng lúc được xếp ở ${x.berth}`} ({x.eta.join(" ")} → {x.etd.join(" ")})</div>)}
            <div className="row" style={{ gap: 8 }}>
              <button className="btn btn-sm" onClick={() => setForm({ ...cur, eta: [...cur.eta], etd: [...cur.etd] })}><Icon name="edit" size={12}/> Sửa lịch</button>
              <button className="btn btn-sm ghost" onClick={() => setSel(null)}>Đóng</button>
            </div>
          </div>
        </div>); })()}

      {form && (
        <div className="modal-overlay" onClick={() => setForm(null)}>
          <div className="modal" style={{ width: 720 }} onClick={e => e.stopPropagation()}>
            <div className="modal-head"><h3>{form.id ? `Sửa lịch ${form.id}` : "Lên lịch sà lan"}</h3><button className="icon-btn" onClick={() => setForm(null)}><Icon name="x" size={16}/></button></div>
            <div className="modal-body">
              <div className="field-row">
                <div className="field"><label>Sà lan</label><select className="select" value={form.barge} onChange={e => setForm(f => ({ ...f, barge: e.target.value }))}>{barges.map(b => <option key={b}>{b}</option>)}</select></div>
                <div className="field"><label>Vị trí bến</label><select className="select" value={form.berth} onChange={e => setForm(f => ({ ...f, berth: e.target.value }))}>{DD_BERTHS.map(b => <option key={b}>{b}</option>)}</select></div>
              </div>
              <div className="field"><label>Job</label><select className="select" value={form.job} onChange={e => setForm(f => ({ ...f, job: e.target.value }))}>{jobsFor.map(j => <option key={j.id} value={j.id}>{j.id} · {ddCusShort(j.customer)} · {j.kind === "cont" ? ddDirLabel(j) : j.cargo}</option>)}</select></div>
              <div className="field-row">
                <div className="field"><label>Dự kiến cập (ETA)</label><DT v={form.eta} on={v => setForm(f => ({ ...f, eta: v }))} /></div>
                <div className="field"><label>Dự kiến rời (ETD)</label><DT v={form.etd} on={v => setForm(f => ({ ...f, etd: v }))} /></div>
              </div>
              {!fOk && <div style={{ color: "var(--st-danger)", fontSize: 12.5 }}>Giờ rời phải sau giờ cập.</div>}
              {fConf.map(({ x, kind }) => <div key={x.id} style={{ color: "var(--st-danger)", fontSize: 12.5 }}>⚠ {kind === "berth" ? `Trùng bến ${x.berth} với ${x.barge}` : `${form.barge} đã được xếp ở ${x.berth}`} · {x.eta.join(" ")} → {x.etd.join(" ")}</div>)}
            </div>
            <div className="modal-foot">
              <button className="btn ghost" onClick={() => setForm(null)}>Huỷ</button>
              <button className="btn primary" disabled={!fOk} onClick={save}>{fConf.length ? "Vẫn lưu (trùng lịch)" : "Lưu lịch"}</button>
            </div>
          </div>
        </div>
      )}
      <KdToast text={toast} />
    </div>
  );
};

Object.assign(window, { ddRiverGate, ddRiverGateUndo, ddRoadGate, ddGateUndo, DdShipOrderModal, DdGateScreen, DdRiverScreen, DD_CONT_REG, DD_SHIP_ORDERS, DD_GATE_LOG, DD_CALLS });
