/* Điều độ khai thác — Vận tải (US-VT-01..03 · BR-VT-03 · NFR-04 không GPS) & Báo cáo sản lượng (US-RPT-01) */

const DD_TRANS_TYPES = { cont: "Xuất / nhập cont", empty: "Chuyển rỗng", itt: "ITT (liên cảng)", factory: "Vận chuyển nhà máy" };
const DD_TRANS_ST = { wait: ["neutral", "Chờ thực hiện"], doing: ["warning", "Đang thực hiện"], done: ["success", "Hoàn thành"] };
const DD_TRANS_NEXT = { wait: "doing", doing: "done" };
const ddTransType = (t) => t.type === "cont" ? (t.dir === "in" ? "Nhập cont" : "Xuất cont") : DD_TRANS_TYPES[t.type];
/* pilot: không còn chuyến mẫu — chỉ lệnh vận chuyển thật trong dd_docs (coll = trans) */
const DD_TRANS_PAST = [];
const DD_TRANS = DD_BOOT.docs.trans;

/* =================== VẬN TẢI =================== */
const DdTransportScreen = ({ go }) => {
  const [, force] = React.useState(0);
  const [view, setView] = React.useState("orders");
  const [tab, setTab] = React.useState("all");
  const [form, setForm] = React.useState(null);
  const role = ddCan("DPVT") ? "dpvt" : "khth"; /* theo vai trò người đăng nhập */
  const [rp, setRp] = React.useState({ period: "7", truck: "", driver: "" });
  const [toast, flash] = useKdToast();
  const refresh = (m) => { force(n => n + 1); if (m) flash(m); };
  const canEdit = role === "dpvt";
  const rows = DD_TRANS.filter(t => tab === "all" || t.status === tab);
  const drivers = DD_PEOPLE.filter(p => p.role === "Tài xế");
  const conts = Object.values(window.DD_CONT_REG || {}).filter(c => c.inPort);
  const inJob = form && form.type === "cont" && form.dir === "in" ? (DD_JOBS.find(j => j.id === form.job) || { conts: [] }) : null;
  const inConts = inJob ? (inJob.conts || []).filter(c => ddCDir(c, inJob) === "import" && !c.gin) : [];
  const valid = form && form.from.trim() && form.to.trim() && form.truck && form.driver && (form.cont || form.cargo.trim()) && (!inJob || form.job);
  const save = () => {
    const id = ddNewId("VC");
    DD_TRANS.unshift({ ...form, job: form.job || null, dir: form.type === "cont" ? form.dir : null, id, by: DD_ME.id, plan: `${ddToday()} ${form.time}`, status: "wait", log: [] });
    setForm(null); refresh(`Đã tạo ${id} & gửi tài xế ${ddPerson(form.driver).name}`);
  };
  const byType = Object.entries(DD_TRANS_TYPES).map(([k, l]) => ({ k, l, done: DD_TRANS.filter(t => t.type === k && t.status === "done").length, all: DD_TRANS.filter(t => t.type === k).length }));
  /* Đội xe: xe VNL (đầu kéo, xe ben) */
  const fleet = DD_VEHICLES.filter(v => !v.ext && (v.kind === "keo" || v.kind === "ben")).map(v => { const ts = DD_TRANS.filter(t => t.truck === v.plate); const cur = ts.find(t => t.status === "doing") || ts.filter(t => t.status === "wait").sort((a, b) => a.plan < b.plan ? -1 : 1)[0]; return { v, ts, cur, st: !cur ? "free" : cur.status === "doing" ? "run" : "wait" }; });
  const FLEET_ST = { free: ["success", "Rảnh"], wait: ["neutral", "Có lệnh chờ"], run: ["warning", "Đang chạy"] };
  /* Sản lượng vận chuyển */
  const all = [...DD_TRANS, ...DD_TRANS_PAST];
  const minD = new Date(ddD(ddToday()).getTime() - (+rp.period - 1) * 864e5);
  const inP = all.filter(t => ddD(t.plan.slice(0, 10)) >= minD && (!rp.truck || t.truck === rp.truck) && (!rp.driver || t.driver === rp.driver));
  const repType = Object.entries(DD_TRANS_TYPES).map(([k, l]) => { const ts = inP.filter(t => t.type === k); return { k, l, done: ts.filter(t => t.status === "done").length, open: ts.filter(t => t.status !== "done").length, sub: k === "cont" ? `xuất ${ts.filter(t => t.dir !== "in" && t.status === "done").length} · nhập ${ts.filter(t => t.dir === "in" && t.status === "done").length}` : "" }; });
  const byKey = (key, name) => Object.values(inP.reduce((m, t) => { const k = t[key]; (m[k] = m[k] || { k, name: name(k), done: 0, open: 0 })[t.status === "done" ? "done" : "open"]++; return m; }, {})).sort((a, b) => b.done - a.done);

  return (
    <div className="page" style={{ maxWidth: 1560 }}>
      <div className="page-head">
        <div><h1 style={{ display: "flex", alignItems: "center", gap: 10 }}><Icon name="task" size={20}/>Vận tải</h1><div className="sub">Điều phối vận tải tạo & giao lệnh vận chuyển 4 loại · tài xế cập nhật trạng thái theo đúng thứ tự (BR-VT-03) · không theo dõi GPS (NFR-04)</div></div>
        <div className="actions">
          {canEdit && <button className="btn accent" onClick={() => setForm({ type: "cont", dir: "out", customer: "", job: "", from: "", to: "", cont: "", cargo: "", truck: "", driver: (DD_PEOPLE.find(p => p.appRole === "TAIXE") || {}).id || "", time: window.ddVnNow().time })}><Icon name="plus" size={14}/> Tạo lệnh vận chuyển</button>}
        </div>
      </div>
      <DdKpis items={[
        { l: "Lệnh hôm nay", v: DD_TRANS.length, u: "lệnh", d: `${DD_TRANS.filter(t => t.status === "wait").length} chờ · ${DD_TRANS.filter(t => t.status === "doing").length} đang chạy` },
        { l: "Xe đang chạy / rảnh", v: `${fleet.filter(f => f.st === "run").length}/${fleet.filter(f => f.st === "free").length}`, u: "xe", d: `${fleet.length} xe VNL` },
        { l: "Chuyến hoàn thành", v: `${DD_TRANS.filter(t => t.status === "done").length}/${DD_TRANS.length}`, u: "chuyến", d: byType.filter(x => x.all).map(x => `${x.l.split(" (")[0]} ${x.done}/${x.all}`).join(" · "), c: "#16A34A" },
        { l: "Sự cố vận tải đang mở", v: (window.DD_INCIDENTS || []).filter(i => i.status !== "closed" && DD_TRANS.some(t => t.id === i.order)).length, u: "vụ", d: "tài xế báo từ web tài xế", c: "#DC2626" },
      ]} />
      <div className="tabs" style={{ marginBottom: 14 }}>{[["orders", "Lệnh vận chuyển", DD_TRANS.length], ["fleet", "Đội xe", fleet.length], ["report", "Sản lượng", null]].map(([k, l, n]) => <div key={k} className={`tab ${view === k ? "active" : ""}`} onClick={() => setView(k)}>{l}{n != null && <span className="count">{n}</span>}</div>)}</div>

      {view === "orders" && <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) auto", gap: 24, alignItems: "start" }}>
        <div className="card" style={{ minWidth: 0 }}>
          <DdTabs tab={tab} setTab={setTab} tabs={[["all", "Tất cả", DD_TRANS.length], ...Object.entries(DD_TRANS_ST).map(([k, v]) => [k, v[1], DD_TRANS.filter(t => t.status === k).length])]} />
          <div className="tbl-wrap" style={{ overflowX: "auto" }}><table className="tbl" style={{ minWidth: 930 }}>
            <thead><tr><th style={{ minWidth: 100 }}>Lệnh</th><th style={{ minWidth: 120 }}>Loại</th><th style={{ minWidth: 220 }}>Tuyến</th><th style={{ minWidth: 140 }}>Cont / hàng</th><th style={{ minWidth: 130 }}>Xe · Tài xế</th><th style={{ minWidth: 70 }}>KH</th><th style={{ minWidth: 150 }}>Trạng thái</th></tr></thead>
            <tbody>{rows.map(t => (
              <tr key={t.id}>
                <td className="mono" style={{ fontSize: 12 }}>{t.id}</td>
                <td style={{ fontSize: 12.5 }}>{ddTransType(t)}<div className="muted" style={{ fontSize: 11 }}>{t.customer ? ddCusShort(t.customer) : "—"}{t.job ? <> · <span className="mono">{t.job}</span></> : ""}</div></td>
                <td style={{ fontSize: 12.5 }}>{t.from} → {t.to}</td>
                <td className="mono" style={{ fontSize: 12 }}>{t.cont ? tlContFmt(t.cont) : <span style={{ fontFamily: "inherit" }}>{t.cargo}</span>}</td>
                <td style={{ fontSize: 12 }}><span className="mono">{t.truck}</span><div className="muted" style={{ fontSize: 11 }}>{ddPerson(t.driver).name}</div></td>
                <td className="mono" style={{ fontSize: 12 }}>{t.plan.slice(-5)}</td>
                <td><span className={`badge ${DD_TRANS_ST[t.status][0]}`}>{DD_TRANS_ST[t.status][1]}</span><div className="muted mono" style={{ fontSize: 10.5, marginTop: 3 }}>{t.log.map(([s, at]) => `${s === "doing" ? "chạy" : "xong"} ${at}`).join(" · ")}</div>{(window.DD_INCIDENTS || []).some(i => i.order === t.id && i.status !== "closed") && <span className="badge danger" style={{ marginTop: 3 }}>Có sự cố</span>}</td>
              </tr>))}</tbody>
          </table></div>
        </div>
        <div><DdDriverWeb onChange={() => refresh()} height={720} /></div>
      </div>}

      {view === "fleet" && <div className="card"><div className="tbl-wrap"><table className="tbl">
        <thead><tr><th>Xe</th><th>Loại xe</th><th>Trạng thái</th><th>Lệnh hiện tại</th><th>Tài xế</th><th style={{ textAlign: "right" }}>Lệnh hôm nay</th><th style={{ textAlign: "right" }}>Đã xong</th></tr></thead>
        <tbody>{fleet.map(({ v, ts, cur, st }) => <tr key={v.plate}>
          <td className="mono" style={{ fontWeight: 600 }}>{v.plate}</td><td style={{ fontSize: 12.5 }}>{v.type}</td>
          <td><span className={`badge ${FLEET_ST[st][0]}`}>{FLEET_ST[st][1]}</span></td>
          <td style={{ fontSize: 12.5 }}>{cur ? <><span className="mono">{cur.id}</span> · {ddTransType(cur)}<div className="muted" style={{ fontSize: 11 }}>{cur.from} → {cur.to} · {cur.plan.slice(-5)}</div></> : "—"}</td>
          <td style={{ fontSize: 12.5 }}>{cur ? ddPerson(cur.driver).name : "—"}</td>
          <td className="mono" style={{ textAlign: "right" }}>{ts.length}</td><td className="mono" style={{ textAlign: "right" }}>{ts.filter(t => t.status === "done").length}</td>
        </tr>)}</tbody></table></div></div>}

      {view === "report" && <div className="card">
        <div className="row" style={{ gap: 10, padding: "12px 16px", flexWrap: "wrap", borderBottom: "1px solid var(--line)" }}>
          <div className="seg-bar">{[["1", "Hôm nay"], ["7", "7 ngày"], ["30", "30 ngày"]].map(([k, l]) => <button key={k} className={rp.period === k ? "on" : ""} onClick={() => setRp(r => ({ ...r, period: k }))}>{l}</button>)}</div>
          <select className="select" style={{ width: 180, height: 32 }} value={rp.truck} onChange={e => setRp(r => ({ ...r, truck: e.target.value }))}><option value="">Tất cả xe</option>{fleet.map(f => <option key={f.v.plate} value={f.v.plate}>{f.v.plate}</option>)}</select>
          <select className="select" style={{ width: 180, height: 32 }} value={rp.driver} onChange={e => setRp(r => ({ ...r, driver: e.target.value }))}><option value="">Tất cả tài xế</option>{drivers.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}</select>
          <div style={{ flex: 1 }}></div>
          <button className="btn btn-sm" onClick={() => flash("Đã xuất sản lượng vận chuyển (Excel)")}><Icon name="download" size={12}/> Excel</button><button className="btn btn-sm" onClick={() => flash("Đã xuất sản lượng vận chuyển (PDF)")}><Icon name="download" size={12}/> PDF</button>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0,1fr))", gap: 10, padding: 16 }}>{repType.map(r => <div key={r.k} style={{ border: "1px solid var(--line)", borderRadius: "var(--r-sm)", padding: "10px 12px" }}><div className="muted" style={{ fontSize: 12 }}>{r.l}</div><div className="mono" style={{ fontSize: 20, fontWeight: 700 }}>{r.done} <small style={{ fontSize: 12, fontWeight: 400 }}>chuyến xong</small></div><div className="muted" style={{ fontSize: 11.5 }}>{[r.sub, r.open ? `${r.open} chưa xong` : ""].filter(Boolean).join(" · ") || "—"}</div></div>)}</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, padding: "0 16px 16px" }}>
          {[["Theo xe", byKey("truck", k => k)], ["Theo tài xế", byKey("driver", k => ddPerson(k).name)]].map(([h, list]) => <div key={h}><div style={{ fontSize: 12.5, fontWeight: 600, marginBottom: 6 }}>{h}</div><table className="tbl"><thead><tr><th>{h === "Theo xe" ? "Xe" : "Tài xế"}</th><th style={{ textAlign: "right" }}>Chuyến xong</th><th style={{ textAlign: "right" }}>Chưa xong</th></tr></thead><tbody>{list.map(x => <tr key={x.k}><td className={h === "Theo xe" ? "mono" : ""}>{x.name}</td><td className="mono" style={{ textAlign: "right" }}>{x.done}</td><td className="mono" style={{ textAlign: "right" }}>{x.open}</td></tr>)}</tbody></table></div>)}
        </div>
      </div>}

      {form && (
        <div className="modal-overlay" onClick={() => setForm(null)}>
          <div className="modal" style={{ width: 640 }} onClick={e => e.stopPropagation()}>
            <div className="modal-head"><h3>Tạo lệnh vận chuyển</h3><button className="icon-btn" onClick={() => setForm(null)}><Icon name="x" size={16}/></button></div>
            <div className="modal-body">
              <div className="field"><label>Loại hình</label><div className="seg-bar">{Object.entries(DD_TRANS_TYPES).map(([k, l]) => <button key={k} className={form.type === k ? "on" : ""} onClick={() => setForm(f => ({ ...f, type: k, cont: "" }))}>{l}</button>)}</div></div>
              {form.type === "cont" && <div className="field"><label>Chiều</label><div className="seg-bar"><button className={form.dir === "out" ? "on" : ""} onClick={() => setForm(f => ({ ...f, dir: "out", cont: "" }))}>Xuất · cont đang ở cảng</button><button className={form.dir === "in" ? "on" : ""} onClick={() => setForm(f => ({ ...f, dir: "in", cont: "" }))}>Nhập · kéo cont về VNL</button></div></div>}
              <div className="field-row">
                <div className="field"><label>Điểm đi</label><input className="input" value={form.from} onChange={e => setForm(f => ({ ...f, from: e.target.value }))} placeholder="VD Bãi R1" /></div>
                <div className="field"><label>Điểm đến</label><input className="input" value={form.to} onChange={e => setForm(f => ({ ...f, to: e.target.value }))} placeholder="VD Cảng Tân Vũ" /></div>
              </div>
              <div className="field-row">
                <div className="field"><label>Khách hàng</label><select className="select" value={form.customer || ""} onChange={e => setForm(f => ({ ...f, customer: e.target.value || null, job: "", cont: "" }))}><option value="">—</option>{(window.KD_CUSTOMERS || []).map(c => <option key={c.id} value={c.id}>{c.shortName || c.name}</option>)}</select></div>
                <div className="field"><label>Job điều độ <span className="opt">{inJob ? "— bắt buộc với lệnh nhập cont" : "— tính sản lượng theo job"}</span></label><select className="select" value={form.job || ""} onChange={e => setForm(f => ({ ...f, job: e.target.value, cont: "" }))}><option value="">— Không gắn —</option>{DD_JOBS.filter(j => !["closed", "cancelled"].includes(j.status) && (!form.customer || j.customer === form.customer) && (!inJob || j.kind === "cont")).map(j => <option key={j.id} value={j.id}>{j.id} · {j.cargo}</option>)}</select></div>
              </div>
              <div className="field-row">
                {form.type === "factory"
                  ? <div className="field"><label>Hàng</label><input className="input" value={form.cargo} onChange={e => setForm(f => ({ ...f, cargo: e.target.value }))} placeholder="VD Xi măng bao · 600 bao" /></div>
                  : inJob ? <div className="field"><label>Container <span className="opt">— cont nhập lưu bãi của job, chưa gate in</span></label><select className="select mono" value={form.cont} onChange={e => setForm(f => ({ ...f, cont: e.target.value }))}><option value="">{form.job ? "— Chọn cont —" : "— Chọn job trước —"}</option>{inConts.map(c => <option key={c.no} value={c.no}>{tlContFmt(c.no)} · {c.type}{c.drvTruck ? ` · đã gắn xe ${c.drvTruck}` : ""}</option>)}</select></div>
                  : <div className="field"><label>Container</label><select className="select mono" value={form.cont} onChange={e => setForm(f => ({ ...f, cont: e.target.value }))}><option value="">— Chọn cont đang ở cảng —</option>{conts.map(c => <option key={c.no} value={c.no}>{tlContFmt(c.no)} · {c.loc}</option>)}</select></div>}
              </div>
              <div className="field-row">
                <div className="field"><label>Xe</label><select className="select" value={form.truck} onChange={e => setForm(f => ({ ...f, truck: e.target.value }))}><option value="">—</option>{fleet.filter(f => f.v.kind === (form.type === "factory" ? "ben" : "keo")).map(f => <option key={f.v.plate} value={f.v.plate}>{f.v.plate} · {f.v.type} · {FLEET_ST[f.st][1]}</option>)}</select></div>
                <div className="field"><label>Tài xế</label><select className="select" value={form.driver} onChange={e => setForm(f => ({ ...f, driver: e.target.value }))}>{drivers.map(d => <option key={d.id} value={d.id}>{d.name} · {DD_TRANS.filter(t => t.driver === d.id && t.status !== "done").length} lệnh chưa xong</option>)}</select></div>
              </div>
              <div className="field" style={{ maxWidth: 200 }}><label>Giờ dự kiến</label><input className="input mono" type="time" value={form.time} onChange={e => setForm(f => ({ ...f, time: e.target.value }))} /></div>
            </div>
            <div className="modal-foot"><button className="btn ghost" onClick={() => setForm(null)}>Huỷ</button><button className="btn primary" disabled={!valid} onClick={save}><Icon name="send" size={13}/> Tạo & giao tài xế</button></div>
          </div>
        </div>
      )}
      <KdToast text={toast} />
    </div>
  );
};

const DdDriverPhone = ({ me, onChange, bare }) => {
  const [sel, setSel] = React.useState(null);
  const [msg, setMsg] = React.useState(null);
  const [inc, setInc] = React.useState(null);
  const mine = DD_TRANS.filter(t => t.driver === me.id).sort((a, b) => (a.status === "done") - (b.status === "done") || (a.plan < b.plan ? -1 : 1));
  const t = sel && DD_TRANS.find(x => x.id === sel);
  const step = (x) => {
    const n = DD_TRANS_NEXT[x.status]; if (!n) return;
    x.status = n; x.log.push([n, tlClock(4)]);
    setMsg(n === "doing" ? "Đã bắt đầu chạy" : "Đã hoàn thành lệnh"); clearTimeout(window.__dvT); window.__dvT = setTimeout(() => setMsg(null), 1800);
    onChange(`${x.id}: ${DD_TRANS_ST[n][1]} (tài xế ${me.name})`);
  };
  const inner = (
        !t ? (<>
          <div className="tl-hello"><div style={{ fontSize: 13, opacity: .8 }}>Web tài xế · lệnh vận chuyển</div><div style={{ fontSize: 19, fontWeight: 700 }}>{me.name}</div><div style={{ fontSize: 12.5, opacity: .85 }}>{mine.filter(x => x.status !== "done").length} lệnh chưa hoàn thành</div></div>
          <div className="tl-scroll">
            {mine.map(x => (
              <button key={x.id} className={`tl-card ${x.status === "doing" ? "cur" : ""} ${x.status === "done" ? "done" : ""}`} onClick={() => setSel(x.id)}>
                <div style={{ display: "flex", justifyContent: "space-between" }}><span className="tl-pill">{x.plan.slice(-5)} · {ddTransType(x)}</span>{x.status === "doing" ? <span className="tl-live">● Đang chạy</span> : x.status === "done" ? <span className="tl-muted">✓ Xong</span> : <span className="tl-new">CHỜ</span>}</div>
                <div className="tl-big" style={{ fontSize: 16 }}>{x.from} → {x.to}</div>
                <div className="tl-muted">{x.cont ? tlContFmt(x.cont) : x.cargo} · <b>{x.truck}</b></div>
              </button>))}
          </div>
        </>) : (<>
          <div className="tl-bar"><button className="tl-back" onClick={() => { setSel(null); setInc(null); }}>‹</button><div style={{ flex: 1 }}><div className="tl-title">{t.id}</div><div className="tl-sub">{ddTransType(t)}</div></div><span style={{ width: 36 }}></span></div>
          <div className="tl-scroll">
            <div className="tl-confirm" style={{ textAlign: "left" }}>
              <div className="tl-muted">Tuyến</div><div className="tl-big" style={{ marginTop: 2 }}>{t.from}<br/>↓<br/>{t.to}</div>
              <div className="tl-muted" style={{ marginTop: 8 }}>{t.cont ? "Container" : "Hàng"}</div><div className="mono" style={{ fontSize: 18, fontWeight: 800 }}>{t.cont ? tlContFmt(t.cont) : t.cargo}</div>
              <div style={{ marginTop: 8 }}>Xe <span className="tl-plate">{t.truck}</span></div>
            </div>
            <div className="tl-info">
              {["wait", "doing", "done"].map(s => { const l = t.log.find(([x]) => x === s); const reached = s === "wait" || !!l; return <div key={s}><span>{reached ? "✓" : "○"} {DD_TRANS_ST[s][1]}</span><b>{s === "wait" ? t.plan.slice(-5) + " (KH)" : l ? l[1] : "—"}</b></div>; })}
            </div>
            {DD_TRANS_NEXT[t.status]
              ? <button className="tl-main" style={{ background: t.status === "wait" ? "#0E7490" : "#16A34A" }} onClick={() => step(t)}>{t.status === "wait" ? "BẮT ĐẦU CHẠY" : "HOÀN THÀNH"}<small>Chỉ chuyển sang bước kế tiếp — không bỏ bước</small></button>
              : <div className="tl-note" style={{ background: "#DCFCE7" }}>Lệnh đã hoàn thành.</div>}
            {!inc && t.status !== "done" && <button className="tl-sec" style={{ width: "100%", marginTop: 10, color: "#B91C1C" }} onClick={() => setInc({ type: "", note: "", photo: false })}>⚠ Báo sự cố</button>}
            {inc && <div className="tl-confirm" style={{ textAlign: "left", marginTop: 10, borderColor: "#FCA5A5" }}>
              <div className="tl-muted" style={{ marginBottom: 6 }}>Loại sự cố</div>
              <div className="tl-chips">{TL_INC_TYPES.filter(x => ["equip", "wait", "safety", "cargo", "docs", "weather"].includes(x.id)).map(x => <button key={x.id} className={inc.type === x.id ? "on" : ""} onClick={() => setInc(v => ({ ...v, type: x.id }))}>{x.label}</button>)}</div>
              
              <input style={{ width: "100%", height: 44, marginTop: 8, borderRadius: 10, border: "1.5px solid #CBD5E1", padding: "0 12px", boxSizing: "border-box", fontSize: 15 }} value={inc.note} onChange={e => setInc(v => ({ ...v, note: e.target.value }))} placeholder="Ghi chú nhanh (không bắt buộc)" />
              <button className={`tl-sec ${inc.photo ? "on" : ""}`} style={{ width: "100%", marginTop: 8 }} onClick={() => setInc(v => ({ ...v, photo: !v.photo }))}>{inc.photo ? "✓ Đã chụp 1 ảnh" : "📷 Chụp ảnh"}</button>
              <button className="tl-main" style={{ background: "#DC2626", marginTop: 8 }} disabled={!inc.type} onClick={() => { const id = ddNewId("SC"); DD_INCIDENTS.unshift({ id, order: t.id, job: t.job || null, by: me.id, at: `${ddNow()}`, type: inc.type, notes: [inc.note || `Lệnh ${t.id} · xe ${t.truck}`], photo: inc.photo, status: "open", log: [{ at: `${ddNow()}`, by: me.id, text: `Tài xế báo từ web tài xế · lệnh ${t.id}${inc.photo ? " · 1 ảnh" : ""}` }] }); setInc(null); setMsg(`Đã báo sự cố ${id}`); clearTimeout(window.__dvT); window.__dvT = setTimeout(() => setMsg(null), 1800); onChange(`Tài xế ${me.name} báo sự cố ${id} (${t.id})`); }}>GỬI SỰ CỐ</button>
              <button className="tl-link" style={{ marginTop: 6 }} onClick={() => setInc(null)}>Thôi</button>
            </div>}
          </div>
        </>));
  if (bare) return <>{inner}{msg && <div className="tl-toast">✓ {msg}</div>}</>;
  return (
    <div className="tl-phone" style={{ height: 720 }}>
      <style>{TL_CSS}</style>
      <div className="tl-status"><b>{tlClock()}</b><span>4G ▮▮▮ · 71%</span></div>
      <div className="tl-body">{inner}</div>
      {msg && <div className="tl-toast">✓ {msg}</div>}
    </div>
  );
};

/* =================== WEB TÀI XẾ (v2.5) — tài xế VNL & bên thứ 3 =================== */
/* v61: mã đăng nhập theo lệnh ca — sinh khi gửi lệnh ca, hết hạn khi kết ca / job hoàn thành, huỷ / KHTH đổi mã */
const ddDrvLogin = (plate, code) => {
  const p = plate.toUpperCase().replace(/\s/g, ""), c = code.trim();
  const o = DD_ORDERS.find(x => x.drvCode === c && x.status !== "draft");
  if (!o) return { err: "Mã đăng nhập không đúng" };
  const job = DD_JOBS.find(j => j.id === o.job);
  if (["done", "pendingEx", "closed", "cancelled"].includes(job.status)) return { err: job.status === "cancelled" ? "Mã đã hết hạn — job đã huỷ" : "Mã đã hết hạn — job đã hoàn thành" };
  if (o.status === "done") return { err: `Mã đã hết hạn — ${DD_SHIFTS[o.shift - 1].label} ${o.date.slice(0, 5)} đã kết ca` };
  const plateHit = o.vehicles.find(v => v.replace(/\s/g, "").toUpperCase() === p);
  if (!plateHit) return { err: "Biển số không có trong danh sách xe của lệnh ca" };
  return { job, order: o, plate: plateHit };
};
const ddDrvExpired = (auth) => { if (!auth || auth.kind !== "ext") return null; const o = DD_ORDERS.find(x => x.id === auth.order); if (!o || o.drvCode !== auth.code) return "Mã đã được KHTH đổi — đăng nhập lại bằng mã mới"; const r = ddDrvLogin(auth.plate, auth.code); return r.err || null; };
const DD_UNASSIGN_WHY = ["Chọn nhầm", "Xe hỏng", "Đổi xe"];
const DdDrvCont = ({ job, plate, onChange, back }) => {
  const [q, setQ] = React.useState("");
  const [sel, setSel] = React.useState(null);
  const [photo, setPhoto] = React.useState(false);
  const [msg, setMsg] = React.useState(null);
  const [un, setUn] = React.useState(null);
  const toast = (m) => { setMsg(m); clearTimeout(window.__dwT); window.__dwT = setTimeout(() => setMsg(null), 1800); };
  const open = job.conts.filter(c => !ddContDone(c, job));
  const mine = open.filter(c => c.drvTruck === plate);
  const done = job.conts.filter(c => ddContDone(c, job) && (c.truck === plate || c.drvTruck === plate));
  /* Sức chở: đầu kéo + mooc tối đa 2 TEU — 1 cont 40'/45' hoặc 2 cont 20' */
  const teuOf = (x) => String(x.type || "").startsWith("2") ? 1 : 2;
  const used = mine.reduce((t, x) => t + teuOf(x), 0);
  const full = (x) => used + teuOf(x) > 2;
  const list = open.filter(c => c.drvTruck !== plate && (!q || c.no.includes(q)));
  const c = sel && job.conts.find(x => x.no === sel);
  if (c) return (<>
    <div className="tl-bar"><button className="tl-back" onClick={() => { setSel(null); setPhoto(false); }}>‹</button><div style={{ flex: 1 }}><div className="tl-title">Nhận cont</div><div className="tl-sub">{job.id} · xe {plate}</div></div><span style={{ width: 36 }}></span></div>
    <div className="tl-scroll">
      <div className="tl-confirm"><div className="tl-muted">{c.type} · {c.fe === "F" ? "FCL" : "MTY"} · {DD_DIR_SHORT[ddCDir(c, job)]}{c.dest ? ` · đi ${c.dest}` : ""}</div><div className="mono" style={{ fontSize: 28, fontWeight: 800, margin: "6px 0" }}>{tlContFmt(c.no)}</div><div>gắn vào xe <span className="tl-plate">{plate}</span></div></div>
      <button className={`tl-sec ${photo ? "on" : ""}`} style={{ width: "100%", height: 64 }} onClick={() => setPhoto(!photo)}>{photo ? "✓ Đã chụp ảnh cont trên xe" : "📷 Chụp ảnh cont đã lên xe"}</button>
      <button className="tl-main" disabled={!photo} onClick={() => { c.drvTruck = plate; c.drvPhoto = true; c.drvAt = tlClock(1); (job.log = job.log || []).unshift({ at: `${ddToday()} ${c.drvAt}`, by: plate, text: `Tài xế xe ${plate} nhận ${tlContFmt(c.no)} trên web tài xế (có ảnh)` }); onChange(); toast(`Đã gắn ${tlContFmt(c.no)} vào xe ${plate}`); setSel(null); setPhoto(false); }}>GẮN CONT VÀO XE<small>Tally chỉ cần xác nhận khi Gate In / Gate Out</small></button>
    </div>
    {msg && <div className="tl-toast">✓ {msg}</div>}
  </>);
  return (<>
    <div className="tl-bar">{back ? <button className="tl-back" onClick={back}>‹</button> : <span style={{ width: 36 }}></span>}<div style={{ flex: 1 }}><div className="tl-title">{ddCusShort(job.customer)} · {Object.keys(ddDirCount(job)).length > 1 ? "Cont hỗn hợp" : DD_DIR_SHORT[job.contDir]}</div><div className="tl-sub">{job.id} · xe {plate}</div></div><span style={{ width: 36 }}></span></div>
    <div className="tl-scroll">
      {mine.length > 0 && <div className="tl-muted" style={{ margin: "2px 0 6px" }}>Cont đã gắn vào xe tôi</div>}
      {mine.map(x => <div key={x.no} className="tl-rec" style={{ flexWrap: "wrap" }}><div style={{ flex: 1 }}><b className="mono">{tlContFmt(x.no)}</b><div className="tl-muted">{DD_DIR_SHORT[ddCDir(x, job)]} · {x.drvAt} · có ảnh · chờ tally {ddContGate(x, job) === "in" ? "Gate In" : "Gate Out"}</div></div><button className="tl-link" onClick={() => setUn(un === x.no ? null : x.no)}>Bỏ gắn</button>
        {un === x.no && <div style={{ width: "100%", marginTop: 8 }}><div className="tl-muted" style={{ marginBottom: 6 }}>Lý do bỏ gắn</div><div className="tl-chips">{DD_UNASSIGN_WHY.map(w => <button key={w} onClick={() => {
          (x.drvHist = x.drvHist || []).push({ truck: x.drvTruck, at: x.drvAt, photo: x.drvPhoto, offAt: tlClock(1), why: w });
          (job.log = job.log || []).unshift({ at: `${ddNow()}`, by: plate, text: `Tài xế xe ${plate} bỏ gắn ${tlContFmt(x.no)} · lý do: ${w} (ảnh lúc gắn vẫn lưu)` });
          delete x.drvTruck; delete x.drvPhoto; setUn(null); onChange(); toast("Đã bỏ gắn · đã ghi nhật ký job"); }}>{w}</button>)}</div></div>}</div>)}
      {used >= 2 && <div className="tl-tag warn" style={{ margin: "8px 0 0" }}>Xe đã đủ tải ({mine.length} cont) — chờ tally xác nhận gate, hoặc bỏ gắn trước khi nhận cont khác</div>}
      <div className="tl-muted" style={{ margin: "10px 0 6px" }}>Chọn cont của job ({list.length})</div>
      <div className="tl-search"><span>🔍</span><span className="tl-q">{q || <span style={{ color: "#94A3B8" }}>Số đuôi cont</span>}</span>{q && <button onClick={() => setQ("")}>✕</button>}</div>
      <div className="tl-minipad" style={{ marginBottom: 8 }}>{["1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "⌫"].map(k => <button key={k} onClick={() => setQ(v => k === "⌫" ? v.slice(0, -1) : (v + k).slice(-7))}>{k}</button>)}</div>
      {list.slice(0, 20).map(x => { const other = x.drvTruck && x.drvTruck !== plate; const over = !other && full(x); return (
        <button key={x.no} className="tl-choice" disabled={!!other || over} style={{ opacity: other || over ? .5 : 1 }} onClick={() => setSel(x.no)}>
          <b className="mono">{tlContFmt(x.no)}</b><span className="tl-muted" style={{ textAlign: "right" }}>{x.type} · {DD_DIR_SHORT[ddCDir(x, job)]}{x.dest ? ` · đi ${x.dest}` : ""}{other ? <><br/>xe {x.drvTruck} đã nhận</> : over ? <><br/>vượt sức chở xe</> : null}</span>
        </button>); })}
      {done.length > 0 && <><div className="tl-muted" style={{ margin: "12px 0 6px" }}>Đã xong hôm nay ({done.length})</div>
        {done.map(x => <div key={x.no} className="tl-rec"><div style={{ flex: 1 }}><b className="mono">{tlContFmt(x.no)}</b><div className="tl-muted">{DD_DIR_SHORT[ddCDir(x, job)]} · tally đã xác nhận {ddContGate(x, job) === "in" ? "Gate In" : "Gate Out"}{x.at ? ` lúc ${x.at}` : ""}</div></div><span className="tl-tag" style={{ margin: 0, background: "#DCFCE7", color: "#166534" }}>✓ Xong</span></div>)}</>}
    </div>
    {msg && <div className="tl-toast">✓ {msg}</div>}
  </>);
};
const DdDriverWeb = ({ onChange, height = 760 }) => {
  const [auth, setAuth] = React.useState(null);
  const [tab, setTab] = React.useState("vnl");
  const [f, setF] = React.useState({ drv: "t8", pw: "", truck: "43C-611.08", plate: "", code: "" });
  const [err, setErr] = React.useState("");
  const [view, setView] = React.useState("trans");
  const [jobSel, setJobSel] = React.useState(null);
  const [chg, setChg] = React.useState(null);
  const drivers = DD_PEOPLE.filter(p => p.role === "Tài xế");
  const vnlTrucks = DD_VEHICLES.filter(v => !v.ext && (v.kind === "keo" || v.kind === "ben"));
  const planTrucks = (id) => [...new Set(DD_TRANS.filter(t => t.driver === id && t.status !== "done").sort((a, b) => a.plan < b.plan ? -1 : 1).map(t => t.truck))];
  const pickDrv = (id) => setF(x => ({ ...x, drv: id, truck: planTrucks(id)[0] || x.truck }));
  const pt = planTrucks(f.drv);
  const login = () => {
    setErr("");
    if (tab === "vnl") { if (!f.pw) return setErr("Nhập mật khẩu"); setAuth({ kind: "vnl", id: f.drv, plate: f.truck }); setView("trans"); }
    else { const r = ddDrvLogin(f.plate, f.code); if (r.err) return setErr(r.err); setAuth({ kind: "ext", plate: r.plate, job: r.job.id, order: r.order.id, code: r.order.drvCode }); }
  };
  const myJobs = auth ? DD_JOBS.filter(j => j.kind === "cont" && !["done", "pendingEx", "closed", "cancelled"].includes(j.status) && DD_ORDERS.some(o => o.job === j.id && ddOrderOpen(o) && o.vehicles.includes(auth.plate))) : [];
  let inner;
  if (!auth) inner = (<>
    <div className="tl-hello" style={{ background: "linear-gradient(135deg,#00669B,#004A73)" }}><div style={{ fontSize: 13, opacity: .85 }}>VNL · Web tài xế</div><div style={{ fontSize: 20, fontWeight: 700 }}>Đăng nhập</div><div style={{ fontSize: 12, opacity: .85 }}>Không cần cài ứng dụng</div></div>
    <div className="tl-tabs"><button className={tab === "vnl" ? "on" : ""} onClick={() => { setTab("vnl"); setErr(""); }}>Tài xế VNL</button><button className={tab === "ext" ? "on" : ""} onClick={() => { setTab("ext"); setErr(""); }}>Xe ngoài</button></div>
    <div className="tl-scroll" style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {tab === "vnl" ? (<>
        <label className="tl-muted">Tài khoản nội bộ</label>
        <select className="select" style={{ height: 46, fontSize: 15 }} value={f.drv} onChange={e => pickDrv(e.target.value)}>{drivers.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}</select>
        <input className="input" type="password" style={{ height: 46, fontSize: 15 }} placeholder="Mật khẩu" value={f.pw} onChange={e => setF({ ...f, pw: e.target.value })} />
        <label className="tl-muted">Xe hôm nay</label>
        <select className="select" style={{ height: 46, fontSize: 15 }} value={f.truck} onChange={e => setF({ ...f, truck: e.target.value })}>{vnlTrucks.map(v => <option key={v.plate} value={v.plate}>{v.plate} · {v.type}{pt.includes(v.plate) ? " · theo lệnh hôm nay" : ""}</option>)}</select>
        {pt.length > 0 && !pt.includes(f.truck) && <div className="tl-tag warn" style={{ margin: 0 }}>Lệnh hôm nay giao xe {pt.join(", ")} — chọn xe khác thì báo điều phối vận tải</div>}
      </>) : (<>
        <label className="tl-muted">Biển số xe</label>
        <input className="input mono" style={{ height: 46, fontSize: 17 }} placeholder="VD: 51C-888.21" value={f.plate} onChange={e => setF({ ...f, plate: e.target.value.toUpperCase() })} />
        <label className="tl-muted">Mã đăng nhập của ca (KHTH / nhà xe cung cấp)</label>
        <input className="input mono" style={{ height: 46, fontSize: 20, letterSpacing: ".2em" }} inputMode="numeric" maxLength={6} placeholder="••••••" value={f.code} onChange={e => setF({ ...f, code: e.target.value.replace(/\D/g, "") })} />
        <div className="tl-muted" style={{ fontSize: 11.5 }}>Mỗi ca một mã. Chỉ xe có trong danh sách xe của lệnh ca mới vào được. Mã hết hạn khi kết ca.</div>
      </>)}
      {err && <div className="tl-tag warn" style={{ background: "#FEE2E2", color: "#B91C1C" }}>{err}</div>}
      <button className="tl-main" onClick={login}>ĐĂNG NHẬP</button>
    </div>
  </>);
  else if (auth.kind === "ext" && ddDrvExpired(auth)) { const why = ddDrvExpired(auth); inner = (<div className="tl-scroll" style={{ textAlign: "center", paddingTop: 60 }}><div className="tl-big" style={{ fontSize: 20 }}>Phiên đăng nhập đã hết hạn</div><div className="tl-muted" style={{ margin: "8px 0 16px" }}>{why}</div><button className="tl-main" onClick={() => { setAuth(null); setF(x => ({ ...x, code: "" })); }}>ĐĂNG NHẬP LẠI</button></div>); }
  else if (auth.kind === "ext") { const job = DD_JOBS.find(j => j.id === auth.job); const ord = DD_ORDERS.find(x => x.id === auth.order); inner = chg ? (<>
      <div className="tl-bar"><button className="tl-back" onClick={() => setChg(null)}>‹</button><div style={{ flex: 1 }}><div className="tl-title">Đổi job / đổi ca</div><div className="tl-sub">xe {auth.plate} · đang ở {auth.job} · {ord ? DD_SHIFTS[ord.shift - 1].label : ""}</div></div><span style={{ width: 36 }}></span></div>
      <div className="tl-scroll" style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <label className="tl-muted">Mã đăng nhập của lệnh ca mới</label>
        <input className="input mono" style={{ height: 46, fontSize: 20, letterSpacing: ".2em" }} inputMode="numeric" maxLength={6} placeholder="••••••" value={chg.code} onChange={e => setChg({ code: e.target.value.replace(/\D/g, "") })} />
        <div className="tl-muted" style={{ fontSize: 11.5 }}>Biển số giữ nguyên; xe phải có trong danh sách xe của lệnh ca mới.</div>
        {chg.err && <div className="tl-tag warn" style={{ background: "#FEE2E2", color: "#B91C1C" }}>{chg.err}</div>}
        <button className="tl-main" onClick={() => { const r = ddDrvLogin(auth.plate, chg.code); if (r.err) return setChg(c => ({ ...c, err: r.err })); if (r.order.id === auth.order) return setChg(c => ({ ...c, err: "Đây là mã của lệnh ca đang làm" })); setAuth(a => ({ ...a, job: r.job.id, order: r.order.id, code: r.order.drvCode })); setChg(null); }}>ĐỔI SANG JOB NÀY</button>
      </div></>) : (<><div style={{ padding: "6px 14px 0", textAlign: "right" }}><button className="tl-link" onClick={() => setChg({ code: "" })}>⇄ Đổi job</button></div><DdDrvCont job={job} plate={auth.plate} onChange={onChange} /></>); }
  else {
    const me = ddPerson(auth.id);
    inner = (<>
      <div className="tl-tabs" style={{ paddingTop: 8 }}><button className={view === "trans" ? "on" : ""} onClick={() => { setView("trans"); setJobSel(null); }}>Lệnh vận chuyển</button><button className={view === "cont" ? "on" : ""} onClick={() => setView("cont")}>Nhận cont ({myJobs.length})</button></div>
      {view === "trans" ? <DdDriverPhone me={me} onChange={onChange} bare /> : jobSel ? <DdDrvCont job={DD_JOBS.find(j => j.id === jobSel)} plate={auth.plate} onChange={onChange} back={() => setJobSel(null)} /> : (
        <div className="tl-scroll">
          <div className="tl-muted" style={{ marginBottom: 8 }}>Job container có xe <b>{auth.plate}</b> trong danh sách xe ca này</div>
          {myJobs.length === 0 && <div className="tl-empty">Không có job nào</div>}
          {myJobs.map(j => <button key={j.id} className="tl-card" onClick={() => setJobSel(j.id)}><div className="tl-big" style={{ fontSize: 16 }}>{ddCusShort(j.customer)} · {ddDirLabel(j)}</div><div className="tl-muted">{j.id} · {j.conts.filter(c => !ddContDone(c, j)).length} cont chưa xong</div></button>)}
        </div>)}
    </>);
  }
  return (
    <div className="tl-phone" style={{ height }}>
      <style>{TL_CSS}</style>
      <div className="tl-status"><b>{tlClock()}</b><span>{auth ? <a style={{ color: "#fff", cursor: "pointer", textDecoration: "underline" }} onClick={() => { setAuth(null); setJobSel(null); setF(x => ({ ...x, pw: "", code: "" })); }}>Đăng xuất</a> : "4G ▮▮▮"} · 71%</span></div>
      <div className="tl-body">{inner}</div>
    </div>
  );
};
const DdDriverWebScreen = ({ go }) => {
  const [, force] = React.useState(0);
  const onChange = () => { force(x => x + 1); window.__ddTick?.(); };
  const jobs = DD_JOBS.filter(j => j.kind === "cont" && !["done", "pendingEx", "closed", "cancelled"].includes(j.status));
  return (
    <div className="page" style={{ maxWidth: 1400 }}>
      <div className="page-head"><div><h1>Web tài xế</h1><div className="sub">Xe ngoài đăng nhập bằng biển số + mã lệnh ca · tài xế tự chọn cont của job, gắn vào xe, chụp ảnh · một cont chỉ gắn một xe (BR-GATE-12)</div></div></div>
      <div style={{ display: "grid", gridTemplateColumns: "auto minmax(0,1fr)", gap: 28, alignItems: "start" }}>
        <div className="card" style={{ width: 300 }}><div className="card-head"><h3>Mở web tài xế</h3></div><div className="card-body" style={{ fontSize: 13, lineHeight: 1.6 }}>
          Gửi nhà xe đường dẫn:<div className="mono" style={{ margin: "6px 0", wordBreak: "break-all" }}>{new URL("taixe.html", location.href).href}</div>
          kèm <b>mã của lệnh ca</b> (bảng bên cạnh). Tài xế đăng nhập bằng biển số + mã, không cần tài khoản.
          <div style={{ marginTop: 10 }}><a className="btn btn-sm" href="taixe.html" target="_blank" rel="noopener">Mở trong tab mới</a></div>
        </div></div>
        <div style={{ minWidth: 0, display: "flex", flexDirection: "column", gap: 16 }}>
          <div className="card">
            <div className="card-head"><div><h3>Mã đăng nhập theo lệnh ca</h3><div className="sub">Sinh khi gửi lệnh ca · KHTH sao chép gửi nhà xe · hết hạn khi kết ca</div></div></div>
            <div className="tbl-wrap"><table className="tbl"><thead><tr><th>Job · lệnh ca</th><th>Hướng</th><th>Mã</th><th>Xe được đăng nhập</th><th style={{ textAlign: "right" }}>Cont đã gắn xe</th></tr></thead>
              <tbody>{jobs.flatMap(j => DD_ORDERS.filter(o => o.job === j.id && ddOrderOpen(o)).map(o => { const veh = o.vehicles; return (
                <tr key={o.id}><td><a style={{ cursor: "pointer", color: "var(--brand-ink)" }} onClick={() => go("dd-job-detail", { id: j.id })}><span className="mono">{j.id}</span></a><div className="muted" style={{ fontSize: 11.5 }}>{ddCusShort(j.customer)} · <span className="mono">{o.id}</span> · {DD_SHIFTS[o.shift - 1].label} {o.date.slice(0, 5)}</div></td>
                  <td style={{ fontSize: 12.5 }}>{ddDirLabel(j)}</td><td><b className="mono" style={{ letterSpacing: ".08em" }}>{o.drvCode}</b></td>
                  <td className="mono" style={{ fontSize: 12 }}><DdPlateList plates={veh} max={4} empty="— chưa có lệnh ca" /></td>
                  <td className="mono" style={{ textAlign: "right" }}>{j.conts.filter(c => c.drvTruck).length}</td></tr>); }))}</tbody></table></div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* =================== BÁO CÁO SẢN LƯỢNG =================== */
const DD_DAILY = [
  ["27/10", 1820, 640, 180, 14], ["28/10", 2050, 710, 0, 18], ["29/10", 1960, 520, 220, 22], ["30/10", 2310, 690, 160, 9],
  ["31/10", 1440, 760, 0, 16], ["01/11", 2120, 820, 140, 11],
].map(([d, bp, icd, kho, cont]) => ({ d, bp, icd, kho, cont }));

/* Số liệu hôm nay dùng chung: màn Sản lượng (Điều độ) và OCC (BOD) — D4 */
const ddTodayOutput = () => {
  const recs = (window.DD_RECORDS || []).filter(r => r.status !== "void" && r.status !== "returned" && r.at.startsWith(ddToday()));
  const tOf = (svc) => recs.filter(r => !r.cont && DD_JOBS.find(j => j.id === r.job)?.service === svc && DD_JOBS.find(j => j.id === r.job)?.unit === "tấn").reduce((s, r) => s + r.qty, 0);
  const kho = (ddKhoDb()?.txns || []).filter(t => (t.type === "IN" || t.type === "OUT") && t.date === ddIsoToday()).reduce((s, t) => s + Number(t.qty || 0), 0);
  const trips = DD_TRANS.filter(t => t.status === "done" && t.plan.startsWith(ddToday())).length;
  const inc = (window.DD_INCIDENTS || []).filter(i => i.status !== "closed");
  return { bp: tOf("bp"), icd: tOf("icd"), kho, cont: recs.filter(r => r.cont).length, trips, running: DD_JOBS.filter(j => j.status === "running").length, incidents: inc };
};
/* Sản lượng job Kho = tổng phiếu nhập + xuất gắn job trong ứng dụng Kho */
const ddSyncKhoJobs = () => DD_JOBS.filter(j => j.service === "kho").forEach(j => { const tx = ddKhoTxOfJob(j.id); if (tx.length) j.actual = tx.reduce((s, t) => s + Number(t.qty || 0), 0); });

const DdReportScreen = ({ go }) => {
  ddSyncKhoJobs();
  const [, force] = React.useState(0);
  const [toast, flash] = useKdToast();
  const recs = (window.DD_RECORDS || []).filter(r => r.status !== "void" && r.status !== "returned" && r.at.startsWith(ddToday()));
  const tOf = (svc) => recs.filter(r => !r.cont && DD_JOBS.find(j => j.id === r.job)?.service === svc && DD_JOBS.find(j => j.id === r.job)?.unit === "tấn").reduce((s, r) => s + r.qty, 0);
  /* Kho: lấy từ ứng dụng Quản lý Kho — nhập + xuất trong ngày (tấn) */
  const khoTx = (ddKhoDb()?.txns || []).filter(t => (t.type === "IN" || t.type === "OUT") && t.date === ddIsoToday());
  const khoToday = khoTx.reduce((s, t) => s + Number(t.qty || 0), 0);
  const today = { d: ddToday().slice(0, 5), bp: tOf("bp"), icd: tOf("icd"), kho: khoToday, cont: recs.filter(r => r.cont).length, live: true };
  const days = [...DD_DAILY, today];
  const max = Math.max(...days.map(x => x.bp + x.icd + x.kho));
  const C = { bp: "#1F4E78", icd: "#0E7490", kho: "#B45309" };
  const pendingT = recs.filter(r => r.status === "pending" || r.status === "shift").reduce((s, r) => s + r.qty, 0);
  const unsynced = (window.DD_RECORDS || []).filter(r => r.offline).length;
  const jobs = DD_JOBS.filter(j => j.status !== "closed").sort((a, b) => ({ done: 0, pendingEx: 1, running: 2, planned: 3 }[a.status] - { done: 0, pendingEx: 1, running: 2, planned: 3 }[b.status]));
  const closed = DD_JOBS.filter(j => j.status === "closed");
  const trans = DD_TRANS.filter(t => t.status === "done").length;

  return (
    <div className="page" style={{ maxWidth: 1480 }}>
      <div className="page-head">
        <div><h1>Sản lượng</h1><div className="sub">Dashboard sản lượng toàn phòng theo ngày · đánh dấu số chưa duyệt / chưa đồng bộ · chốt & bàn giao Kế toán · cấp dữ liệu cho OCC (US-RPT-01 · D3 · D4)</div></div>
        <div className="actions"><button className="btn" onClick={() => flash("Đã xuất báo cáo sản lượng (Excel)")}><Icon name="download" size={14}/> Excel</button><button className="btn" onClick={() => flash("Đã xuất báo cáo sản lượng (PDF)")}><Icon name="download" size={14}/> PDF</button></div>
      </div>
      <DdKpis items={[
        { l: "Hàng rời hôm nay", v: tlFmt(today.bp + today.icd + today.kho), u: "tấn", d: `bến phao ${tlFmt(today.bp)} · ICD ${tlFmt(today.icd)} · kho ${tlFmt(today.kho)}` },
        { l: "Container hôm nay", v: today.cont, u: "cont", d: "xuất + nhập bãi qua tally", c: "#0E7490" },
        { l: "Vận tải hoàn thành", v: trans, u: "chuyến", d: `${DD_TRANS.length} lệnh trong ngày`, c: "#16A34A" },
        { l: "Chưa duyệt / chưa đồng bộ", v: tlFmt(pendingT), u: "tấn", d: `${unsynced} bản ghi offline chưa đồng bộ`, c: "#DC2626" },
      ]} />

      <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1.3fr) minmax(0,1fr)", gap: 18, alignItems: "start", marginBottom: 18 }}>
        <div className="card">
          <div className="card-head"><div><h3>Hàng rời theo ngày (tấn)</h3><div className="sub">7 ngày gần nhất · hôm nay cập nhật real-time</div></div>
            <div style={{ display: "flex", gap: 12, fontSize: 12 }}>{[["bp", "Bến phao"], ["icd", "ICD"], ["kho", "Kho"]].map(([k, l]) => <span key={k} style={{ display: "flex", gap: 5, alignItems: "center" }}><span style={{ width: 10, height: 10, borderRadius: 2, background: C[k] }}></span>{l}</span>)}</div></div>
          <div className="card-body">
            <div style={{ display: "flex", alignItems: "flex-end", gap: 14, height: 220, padding: "0 6px", borderBottom: "1px solid var(--line)" }}>
              {days.map(x => { const tot = x.bp + x.icd + x.kho; return (
                <div key={x.d} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                  <span className="mono" style={{ fontSize: 10.5, color: "var(--t-secondary)" }}>{ddQty(tot)}</span>
                  <div style={{ width: "100%", maxWidth: 46, display: "flex", flexDirection: "column-reverse", height: `${tot / max * 180}px`, borderRadius: 4, overflow: "hidden", outline: x.live ? "2px dashed #DC2626" : "none", outlineOffset: 2 }}>
                    {["bp", "icd", "kho"].map(k => <div key={k} title={`${k}: ${ddQty(x[k])} tấn`} style={{ height: `${tot ? x[k] / tot * 100 : 0}%`, background: C[k] }}></div>)}
                  </div>
                </div>); })}
            </div>
            <div style={{ display: "flex", gap: 14, padding: "6px 6px 0" }}>{days.map(x => <div key={x.d} className="mono" style={{ flex: 1, textAlign: "center", fontSize: 11, fontWeight: x.live ? 700 : 400, color: x.live ? "#DC2626" : "var(--t-secondary)" }}>{x.d}{x.live ? " ●" : ""}</div>)}</div>
            <div style={{ display: "flex", gap: 14, padding: "4px 6px 0" }}>{days.map(x => <div key={x.d} className="mono muted" style={{ flex: 1, textAlign: "center", fontSize: 10.5 }}>{x.cont} cont</div>)}</div>
          </div>
        </div>
        <div className="card">
          <div className="card-head"><h3>Bàn giao Kế toán</h3><span className="badge success">{closed.length} job đã chốt</span></div>
          <div className="card-body" style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: 12.5 }}>
            {closed.map(j => <div key={j.id} style={{ display: "flex", justifyContent: "space-between", gap: 8, padding: "6px 0", borderBottom: "1px dashed var(--line)" }}><span><span className="mono">{j.id}</span> · {ddCusShort(j.customer)} · {j.cargo}{j.exApproved && <span className="badge warning" style={{ marginLeft: 6, fontSize: 10 }}>Ngoại lệ chưa HĐ</span>}</span><b className="mono">{ddQty(j.actual, ddUnit(j))} {ddUnit(j)}</b></div>)}
            <div className="muted" style={{ fontSize: 11.5, marginTop: 4 }}>Job đã chốt được đẩy sang Kế toán làm căn cứ đối soát. OCC đọc sản lượng real-time & sự cố đang mở từ màn này cho BOD (D4).</div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-head"><div><h3>Sản lượng theo job</h3><div className="sub">Job hoàn thành cần chốt trước khi bàn giao Kế toán</div></div></div>
        <div className="tbl-wrap"><table className="tbl">
          <thead><tr><th style={{ width: 130 }}>Job</th><th>Khách hàng · Hàng</th><th style={{ width: 110 }}>Dịch vụ</th><th style={{ width: 200 }}>Kế hoạch / thực tế</th><th style={{ width: 150 }}>Chưa duyệt</th><th style={{ width: 120 }}>Hợp đồng</th><th style={{ width: 170 }}>Trạng thái</th><th style={{ width: 110 }}></th></tr></thead>
          <tbody>{jobs.map(j => { const p = (window.DD_RECORDS || []).filter(r => r.job === j.id && (r.status === "pending" || r.status === "shift")).reduce((s, r) => s + r.qty, 0); return (
            <tr key={j.id}>
              <td className="mono" style={{ fontSize: 12 }}>{j.id}</td>
              <td style={{ fontSize: 12.5 }}>{ddCusShort(j.customer)} · {j.kind === "cont" ? ddDirLabel(j) : j.cargo}</td>
              <td style={{ fontSize: 12 }}>{ddSvc(j.service).label}</td>
              <td><DdProgress job={j} /></td>
              <td className="mono" style={{ fontSize: 12, color: p ? "var(--st-warning)" : "var(--t-tertiary)" }}>{p ? `${tlFmt(p)} ${ddUnit(j)}` : "—"}</td>
              <td>{j.contract ? <span className="mono" style={{ fontSize: 12 }}>{j.contract}</span> : <span className="badge danger">Chưa có HĐ</span>}</td>
              <td><DdBadge map={DD_JOB_STATUS} s={j.status} /></td>
              <td>{j.status === "done" && <button className="btn btn-sm primary" onClick={() => go("dd-job-detail", { id: j.id })}>Chốt</button>}</td>
            </tr>); })}</tbody>
        </table></div>
      </div>
      <KdToast text={toast} />
    </div>
  );
};

Object.assign(window, { DD_TRANS_PAST, ddTransType, DdDriverWeb, DdDriverWebScreen, DdTransportScreen, DdReportScreen, DD_TRANS, ddTodayOutput, ddSyncKhoJobs });
