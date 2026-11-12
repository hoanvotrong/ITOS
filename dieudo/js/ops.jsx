/* Điều độ khai thác — Sự cố (US-KH-03, FR-DP-03) & Chờ duyệt (US-BP-03, SC-02, BR-KHO-06, BR-KHO-05, D8)
   Nhận dữ liệu do App Tally sinh ra: DD_INCIDENTS, DD_RECORDS, DD_EDIT_REQS */

const DD_INC_STATUS = {
  open:     { label: "Mới",         cls: "danger"  },
  assigned: { label: "Đang xử lý",  cls: "warning" },
  closed:   { label: "Đã đóng",     cls: "success" },
};
/* v61: bỏ mức độ sự cố — loại sự cố "dừng việc" tính thời gian lỗi theo cẩu (DD_STOP_TYPES) */

const ddOpenIncidents = () => DD_INCIDENTS.filter(i => i.status !== "closed").length;

const ddPendingBp = () => DD_RECORDS.filter(r => r.status === "pending");
const ddPendingCount = () => {
  const ca = new Set(ddPendingBp().map(r => r.order)).size;
  return ca + DD_EDIT_REQS.filter(q => q.status === "pending").length + DD_JOBS.filter(j => j.status === "pendingEx").length;
};
const ddLogJob = (jobId, text, by = DD_ME.id) => { const j = DD_JOBS.find(x => x.id === jobId); if (j) j.log.unshift({ at: ddNow(), by, text }); };

/* =================== SỰ CỐ =================== */
const DdIncidentsScreen = ({ go, ctx }) => {
  const [, force] = React.useState(0);
  const [tab, setTab] = React.useState("active");
  const [sel, setSel] = React.useState(ctx?.id || DD_INCIDENTS.find(i => i.status === "open")?.id || DD_INCIDENTS[0]?.id);
  const [toast, flash] = useKdToast();
  const refresh = () => { force(x => x + 1); window.__ddTick?.(); };
  const tabs = [
    { id: "active", label: "Đang mở", f: i => i.status !== "closed" },
    { id: "open", label: "Mới · chưa phân công", f: i => i.status === "open" },
    { id: "assigned", label: "Đang xử lý", f: i => i.status === "assigned" },
    { id: "closed", label: "Đã đóng", f: i => i.status === "closed" },
    { id: "all", label: "Tất cả", f: () => true },
  ];
  const rows = DD_INCIDENTS.filter(tabs.find(t => t.id === tab).f).sort((a, b) => (a.status === "closed") - (b.status === "closed") || (!!(ddIncDown(b) || {}).open) - (!!(ddIncDown(a) || {}).open));
  const inc = DD_INCIDENTS.find(i => i.id === sel);
  const typeOf = (i) => TL_INC_TYPES.find(t => t.id === i.type) || { label: i.type, icon: "alert" };
  const jobOf = (i) => DD_JOBS.find(j => j.id === i.job) || {};
  const closed = DD_INCIDENTS.filter(i => i.status === "closed");
  const kpi = [
    { l: "Đang mở", v: ddOpenIncidents(), c: "#DC2626", d: `${DD_INCIDENTS.filter(i => i.status === "open").length} chưa phân công` },
    { l: "Đang dừng việc", v: DD_INCIDENTS.filter(i => (ddIncDown(i) || {}).open).length, c: "#B91C1C", d: "sự cố dừng việc chưa có bản ghi tiếp theo của cẩu" },
    { l: "Đã đóng", v: closed.length, c: "#16A34A", d: `${DD_INCIDENTS.filter(i => ddIncDown(i)).length} sự cố dừng việc tính thời gian lỗi` },
    { l: "Tổng thời gian lỗi", v: (DD_INCIDENTS.reduce((t, i) => t + ((ddIncDown(i) || {}).mins || 0), 0) / 60).toFixed(1).replace(".", ","), u: "giờ", c: "#B45309", d: "từ lúc báo đến bản ghi tiếp theo của cẩu" },
  ];
  const byType = TL_INC_TYPES.map(t => ({ ...t, n: DD_INCIDENTS.filter(i => i.type === t.id).length })).sort((a, b) => b.n - a.n);
  const bySvc = DD_SERVICES.map(s => ({ ...s, n: DD_INCIDENTS.filter(i => jobOf(i).service === s.id).length })).filter(s => s.n);
  const maxN = Math.max(1, ...byType.map(x => x.n));

  return (
    <div className="page" style={{ maxWidth: 1480 }}>
      <div className="page-head">
        <div><h1>Sự cố</h1><div className="sub">Ticket thay Zalo · tally/tài xế báo từ app → KHTH phân công → người xử lý đóng ticket kèm kết quả — US-KH-03 · FR-DP-03</div></div>
        
      </div>

      <div className="kpi-grid" style={{ marginBottom: 18 }}>
        {kpi.map(k => <div key={k.l} className="kpi"><div className="lbl"><span className="swatch" style={{ background: k.c }}></span>{k.l}</div><div className="val">{k.v} <small>{k.u || "ticket"}</small></div><div className="delta">{k.d}</div></div>)}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) 400px", gap: 18, alignItems: "start" }}>
        <div style={{ minWidth: 0, display: "flex", flexDirection: "column", gap: 18 }}>
          <div className="card">
            <div className="tabs">{tabs.map(t => <div key={t.id} className={`tab ${tab === t.id ? "active" : ""}`} onClick={() => setTab(t.id)}>{t.label}<span className="count">{DD_INCIDENTS.filter(t.f).length}</span></div>)}</div>
            <div className="tbl-wrap"><table className="tbl">
              <thead><tr><th style={{ width: 120 }}>Mã</th><th style={{ minWidth: 240 }}>Sự cố</th><th style={{ width: 150 }}>Job · Vị trí</th><th style={{ width: 150 }}>Thời gian lỗi</th><th style={{ width: 150 }}>Người xử lý</th><th style={{ width: 120 }}>Trạng thái</th></tr></thead>
              <tbody>
                {rows.length === 0 && <tr><td colSpan={6} className="muted" style={{ textAlign: "center", padding: 24 }}>Không có sự cố</td></tr>}
                {rows.map(i => { const t = typeOf(i), j = jobOf(i), dn = ddIncDown(i); return (
                  <tr key={i.id} style={{ cursor: "pointer", background: sel === i.id ? "var(--bg-sunken)" : undefined }} onClick={() => setSel(i.id)}>
                    <td className="mono" style={{ fontSize: 12 }}>{i.id}<div className="muted" style={{ fontSize: 11 }}>{i.at.slice(0, 5)} {i.at.slice(-5)}</div></td>
                    <td><div style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 13, fontWeight: 500 }}><Icon name={t.icon} size={14}/>{t.label}{i.photo && <Icon name="camera" size={12} className="muted"/>}</div><div className="muted" style={{ fontSize: 11.5 }}>{ddPerson(i.by).name}{i.notes.length ? " · " + i.notes.join(", ") : ""}</div></td>
                    <td style={{ fontSize: 12 }}><span className="mono">{i.job}</span><div className="muted" style={{ fontSize: 11 }}>{ddCusShort(j.customer)} · {ddLoc(j)}</div></td>
                    <td style={{ fontSize: 12 }}>{dn ? <><span className={`badge ${dn.open ? "danger" : "warning"}`}>{ddFmtMin(dn.mins)}{dn.open ? " · đang dừng" : ""}</span><div className="muted" style={{ fontSize: 11 }}>{i.eq}</div></> : <span className="muted">Không dừng việc</span>}</td>
                    <td style={{ fontSize: 12.5 }}>{i.assignee ? ddPerson(i.assignee).name : <span style={{ color: "var(--st-danger)" }}>Chưa phân công</span>}</td>
                    <td><span className={`badge ${DD_INC_STATUS[i.status].cls}`}>{DD_INC_STATUS[i.status].label}</span></td>
                  </tr>); })}
              </tbody>
            </table></div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: 18 }}>
            <div className="card">
              <div className="card-head"><div><h3>Thống kê theo loại</h3><div className="sub">7 ngày gần nhất · {DD_INCIDENTS.length} ticket</div></div></div>
              <div className="card-body" style={{ display: "flex", flexDirection: "column", gap: 9 }}>
                {byType.map(t => (
                  <div key={t.id} style={{ display: "grid", gridTemplateColumns: "150px 1fr 28px", gap: 10, alignItems: "center", fontSize: 12.5 }}>
                    <span style={{ display: "flex", gap: 6, alignItems: "center" }}><Icon name={t.icon} size={12}/>{t.label}</span>
                    <div style={{ height: 10, background: "var(--bg-sunken)", borderRadius: 3 }}><div style={{ width: `${t.n / maxN * 100}%`, height: "100%", background: "#0E7490", borderRadius: 3 }}></div></div>
                    <span className="mono" style={{ textAlign: "right" }}>{t.n}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="card">
              <div className="card-head"><h3>Theo dịch vụ</h3></div>
              <div className="card-body" style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {bySvc.map(s => <div key={s.id} style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5, padding: "4px 0", borderBottom: "1px dashed var(--line)" }}><span style={{ display: "flex", gap: 6, alignItems: "center" }}><Icon name={s.icon} size={12}/>{s.label}</span><b className="mono">{s.n}</b></div>)}
              </div>
            </div>
          </div>
        </div>

        <div style={{ position: "sticky", top: 16 }}>{inc && <DdIncidentPanel inc={inc} onChange={(m) => { refresh(); if (m) flash(m); }} go={go} />}</div>
      </div>
      <KdToast text={toast} />
    </div>
  );
};

const DdIncidentPanel = ({ inc, onChange, go }) => {
  const [who, setWho] = React.useState(inc.assignee || "");
  const [result, setResult] = React.useState("");
  const [note, setNote] = React.useState("");
  React.useEffect(() => { setWho(inc.assignee || ""); setResult(""); setNote(""); }, [inc.id]);
  const t = TL_INC_TYPES.find(x => x.id === inc.type) || { label: inc.type, icon: "alert" };
  const j = DD_JOBS.find(x => x.id === inc.job) || {};
  const dn = ddIncDown(inc);
  const add = (text) => inc.log.unshift({ at: ddNow(), by: DD_ME.id, text });
  /* pilot: người xử lý = người dùng Điều độ trong dd_users (KHTH, TP, ĐPVT…), không gồm tài khoản tally ca */
  const pool = DD_PEOPLE.filter(p => !p.acc && p.appRole !== "TALLY").sort((x, y) => (x.appRole === "TAIXE") - (y.appRole === "TAIXE") || x.name.localeCompare(y.name, "vi"));

  return (
    <div className="card">
      <div className="card-head">
        <div><h3 style={{ display: "flex", gap: 8, alignItems: "center" }}><Icon name={t.icon} size={15}/>{t.label}</h3><div className="sub"><span className="mono">{inc.id}</span> · báo lúc {inc.at}</div></div>
        <span className={`badge ${DD_INC_STATUS[inc.status].cls}`}>{DD_INC_STATUS[inc.status].label}</span>
      </div>
      <div className="card-body" style={{ fontSize: 12.5, display: "flex", flexDirection: "column", gap: 12 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px 12px" }}>
          <div><div className="muted" style={{ fontSize: 11 }}>Thời gian lỗi</div>{dn ? <><span className={`badge ${dn.open ? "danger" : "warning"}`}>{ddFmtMin(dn.mins)}</span><div className="muted" style={{ fontSize: 11 }}>{inc.eq} · {dn.fix ? "dữ liệu cũ" : dn.open ? `đang dừng từ ${inc.at.slice(-5)}` : `${inc.at.slice(-5)} → ${dn.end.slice(-5)} (${dn.why})`}</div></> : <span className="muted">Không tính — loại không dừng việc</span>}</div>
          <div><div className="muted" style={{ fontSize: 11 }}>Người báo</div>{ddPerson(inc.by).name}<div className="muted" style={{ fontSize: 11 }}>{ddPerson(inc.by).role}</div></div>
          <div><div className="muted" style={{ fontSize: 11 }}>Job</div><a style={{ cursor: "pointer", color: "var(--brand-ink)" }} onClick={() => go("dd-job-detail", { id: j.id })}><span className="mono">{j.id}</span></a><div className="muted" style={{ fontSize: 11 }}>{ddCusShort(j.customer)} · {j.cargo}</div></div>
          <div><div className="muted" style={{ fontSize: 11 }}>Lệnh ca · Vị trí</div><span className="mono">{inc.order}</span><div className="muted" style={{ fontSize: 11 }}>{ddLoc(j)}</div></div>
        </div>
        {inc.notes.length > 0 && <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>{inc.notes.map(n => <span key={n} className="tag">{n}</span>)}</div>}
        {inc.photo && <DdPhoto path={inc.photo} label="Ảnh hiện trường" height={160} />}

        {inc.missing && inc.status !== "closed" && <DdSupplement inc={inc} onDone={(m) => onChange(m)} />}
        {inc.status === "open" && (
          <div style={{ padding: 12, border: "1px solid var(--line)", borderRadius: "var(--r-md)", background: "var(--bg-canvas)" }}>
            <b>Phân công xử lý</b>
            <select className="select" style={{ marginTop: 8 }} value={who} onChange={e => setWho(e.target.value)}>
              <option value="">— Chọn người xử lý —</option>
              {pool.map(p => <option key={p.id} value={p.id}>{p.name} — {p.role}</option>)}
            </select>
            <div className="muted" style={{ fontSize: 11.5, margin: "6px 0 8px" }}>{pool.length ? "Danh sách lấy từ người dùng Điều độ (dd_users)." : "Chưa có người dùng nào trong dd_users."}</div>
            <button className="btn primary btn-sm" style={{ width: "100%" }} disabled={!who} onClick={() => {
              inc.assignee = who; inc.status = "assigned"; add(`Phân công ${ddPerson(who).name}`);
              ddLogJob(inc.job, `Sự cố ${inc.id} (${t.label}) — phân công ${ddPerson(who).name}`); onChange(`Đã phân công ${ddPerson(who).name}`);
            }}>Phân công</button>
          </div>
        )}
        {inc.status === "assigned" && (
          <div style={{ padding: 12, border: "1px solid var(--line)", borderRadius: "var(--r-md)", background: "var(--bg-canvas)", display: "flex", flexDirection: "column", gap: 8 }}>
            <div>Đang xử lý: <b>{ddPerson(inc.assignee).name}</b></div>
            <div className="row" style={{ gap: 6 }}>
              <select className="select" style={{ flex: 1 }} value={who} onChange={e => setWho(e.target.value)}>{pool.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}</select>
              <button className="btn btn-sm" disabled={who === inc.assignee} onClick={() => { add(`Chuyển xử lý ${ddPerson(inc.assignee).name} → ${ddPerson(who).name}`); inc.assignee = who; onChange("Đã chuyển người xử lý"); }}>Chuyển</button>
            </div>
            <label style={{ fontWeight: 500, marginTop: 4 }}>Kết quả xử lý <span className="req">*</span></label>
            <textarea className="textarea" rows={3} value={result} onChange={e => setResult(e.target.value)} placeholder="VD: Thay cáp gàu ngoạm, cẩu C1 hoạt động lại 16:30" />
            {dn && <div className="muted" style={{ fontSize: 12 }}>Thời gian lỗi hệ thống tự tính: <b>{ddFmtMin(dn.mins)}</b>{dn.open ? " (đang dừng — chốt khi cẩu có bản ghi tiếp theo hoặc kết ca)" : ""}</div>}
            <button className="btn primary btn-sm" disabled={!result.trim()} onClick={() => {
              inc.status = "closed"; inc.result = result.trim(); add(`Đóng: ${inc.result}`);
              ddLogJob(inc.job, `Sự cố ${inc.id} đã xử lý${dn ? ` · thời gian lỗi ${ddFmtMin(dn.mins)}` : ""}`); onChange("Đã đóng sự cố — đã báo tally");
            }}><Icon name="check" size={12}/> Đóng sự cố</button>
          </div>
        )}
        {inc.status === "closed" && (
          <div style={{ padding: 12, borderRadius: "var(--r-md)", background: "var(--st-success-bg)" }}>
            <b>Kết quả:</b> {inc.result}<div className="muted" style={{ marginTop: 4 }}>Người xử lý: {ddPerson(inc.assignee).name}{dn ? ` · thời gian lỗi ${ddFmtMin(dn.mins)}` : ""}</div>
          </div>
        )}

        <div>
          <div className="row" style={{ gap: 6 }}>
            <input className="input" style={{ flex: 1 }} value={note} onChange={e => setNote(e.target.value)} placeholder="Trao đổi / cập nhật tiến độ…" onKeyDown={e => { if (e.key === "Enter" && note.trim()) { add(note.trim()); setNote(""); onChange(); } }} />
            <button className="btn btn-sm" disabled={!note.trim()} onClick={() => { add(note.trim()); setNote(""); onChange(); }}>Gửi</button>
          </div>
          <div style={{ marginTop: 8 }}>
            {inc.log.map((l, k) => <div key={k} style={{ padding: "6px 0", borderTop: k ? "1px dashed var(--line)" : "none" }}>{l.text}<div className="muted" style={{ fontSize: 11 }}>{ddPerson(l.by).name} · <span className="mono">{l.at}</span></div></div>)}
          </div>
        </div>
      </div>
    </div>
  );
};

/* Bổ sung xe / cont vào lệnh ca ngay từ sự cố "không có trong danh sách" */
const DdSupplement = ({ inc, onDone }) => {
  const o = DD_ORDERS.find(x => x.id === inc.order);
  const j = DD_JOBS.find(x => x.id === inc.job);
  /* pilot: biển số tally đã nhập (xe ngoài danh sách) điền sẵn */
  const known = inc.plate && DD_VEHICLES.some(v => v.plate === inc.plate);
  const [plate, setPlate] = React.useState(inc.plate ? (known ? inc.plate : "__new") : "");
  const [newPlate, setNewPlate] = React.useState(inc.plate && !known ? inc.plate : "");
  const [cont, setCont] = React.useState("");
  const [ctype, setCtype] = React.useState("40GP");
  if (!o || !j) return null;
  const kinds = ddVehKinds(j);
  const pool = DD_VEHICLES.filter(v => (kinds.includes(v.kind) || v.plate === inc.plate) && !o.vehicles.includes(v.plate));
  const chk = cont ? ddContCheck(cont) : null;
  const dupCont = chk && chk.ok && j.conts && j.conts.some(c => c.no === chk.no);
  const close = (text) => { inc.status = "closed"; inc.assignee = inc.assignee || DD_ME.id; inc.result = text; inc.downtime = 0; inc.log.unshift({ at: ddNow(), by: DD_ME.id, text: `Đóng: ${text}` }); ddLogJob(j.id, text); };
  const addVeh = () => {
    let p = plate;
    if (p === "__new") { p = newPlate.trim().toUpperCase(); DD_VEHICLES.push({ plate: p, type: kinds[0] === "salan" ? "Sà lan (bổ sung)" : kinds[0] === "keo" ? "Đầu kéo (bổ sung)" : "Xe ben (bổ sung)", kind: kinds[0] || "ben", cap: kinds[0] === "salan" ? 1500 : kinds[0] === "ben" ? 28 : 1 }); }
    o.vehicles.push(p); o.extraVeh = (o.extraVeh || []).filter(v => v.plate !== p); o.log.unshift({ at: ddNow(), by: DD_ME.id, text: `Bổ sung phương tiện ${p} (từ sự cố ${inc.id}) · gửi lại thông báo tally` });
    close(`Bổ sung phương tiện ${p} vào ${o.id}`); onDone(`Đã thêm ${p} vào ${o.id} — tally chọn được ngay`);
  };
  const addCont = () => {
    j.conts.push({ no: chk.no, type: ctype, fe: "F", status: "pending" }); j.plan = j.conts.length;
    close(`Bổ sung cont ${chk.no} (${ctype}) vào danh sách ${j.id}`); onDone(`Đã thêm ${chk.no} vào danh sách cont`);
  };
  return (
    <div style={{ padding: 12, border: "1px solid #F3C9C9", borderRadius: "var(--r-md)", background: "var(--st-danger-bg, #FDECEC)", display: "flex", flexDirection: "column", gap: 8 }}>
      <b>{inc.missing === "cont" ? "Cont không có trong danh sách" : "Phương tiện không có trong danh sách"}</b>
      <div className="muted" style={{ fontSize: 11.5 }}>Bổ sung ngay vào {inc.missing === "cont" ? `danh sách cont của ${j.id}` : `lệnh ${o.id}`}; tally chọn được ngay trên app, sự cố tự đóng.</div>
      {inc.missing === "cont" ? (
        <>
          <div className="row" style={{ gap: 6 }}>
            <input className="input mono" style={{ flex: 1 }} value={cont} onChange={e => setCont(e.target.value.toUpperCase())} placeholder="Số cont, VD TGHU9001005" />
            <select className="select" style={{ width: 86 }} value={ctype} onChange={e => setCtype(e.target.value)}>{DD_CONT_TYPES.map(t => <option key={t}>{t}</option>)}</select>
          </div>
          {chk && <div style={{ fontSize: 11.5, color: chk.ok && !dupCont ? "var(--st-success)" : "var(--st-danger)" }}>{dupCont ? "Đã có trong danh sách" : chk.ok ? "Số cont hợp lệ" : chk.why}</div>}
          <button className="btn btn-sm primary" disabled={!chk || !chk.ok || dupCont} onClick={addCont}>Thêm cont & đóng sự cố</button>
        </>
      ) : (
        <>
          <select className="select" value={plate} onChange={e => setPlate(e.target.value)}>
            <option value="">— Chọn phương tiện —</option>
            {pool.map(v => <option key={v.plate} value={v.plate}>{v.plate} · {v.type}</option>)}
            <option value="__new">+ Phương tiện mới (nhập biển số)</option>
          </select>
          {plate === "__new" && <input className="input mono" value={newPlate} onChange={e => setNewPlate(e.target.value)} placeholder="VD 43C-777.21" />}
          <button className="btn btn-sm primary" disabled={!plate || (plate === "__new" && !newPlate.trim())} onClick={addVeh}>Thêm vào lệnh ca & đóng sự cố</button>
        </>
      )}
    </div>
  );
};

/* =================== CHỜ DUYỆT =================== */
const DdApprovalsScreen = ({ go, ctx }) => {
  const [, force] = React.useState(0);
  const [tab, setTab] = React.useState(ctx?.tab || "bp");
  const [reason, setReason] = React.useState({});
  const [open, setOpen] = React.useState(null);
  const [toast, flash] = useKdToast();
  const refresh = (m) => { force(x => x + 1); if (m) flash(m); setOpen(null); window.__ddTick?.(); };
  const unitOf = (jid) => ddUnit(DD_JOBS.find(j => j.id === jid));

  const bpGroups = Object.values(ddPendingBp().reduce((g, r) => { (g[r.order] = g[r.order] || { order: r.order, job: r.job, recs: [] }).recs.push(r); return g; }, {}));
  const edits = DD_EDIT_REQS.filter(q => q.status === "pending");
  const exJobs = DD_JOBS.filter(j => j.status === "pendingEx");
  const tabs = [
    { id: "bp", label: "Sản lượng ca", n: bpGroups.length, sub: "Gửi lên khi tally kết ca · duyệt theo ca" },
    { id: "edit", label: "Sửa bản ghi tally", n: edits.length, sub: "Bản ghi cũ hơn bản ghi gần nhất" },
    { id: "ex", label: "Ngoại lệ · Trưởng phòng", n: exJobs.length, sub: "Bàn giao KT khi chưa có HĐ (D8) · Trưởng phòng duyệt tại đây" },
  ];
  const Reason = ({ k, ph, onOk, label }) => open === k ? (
    <div className="row" style={{ gap: 6, marginTop: 8 }}>
      <input className="input" style={{ flex: 1 }} autoFocus value={reason[k] || ""} onChange={e => setReason(s => ({ ...s, [k]: e.target.value }))} placeholder={ph} />
      <button className="btn btn-sm ghost" onClick={() => setOpen(null)}>Huỷ</button>
      <button className="btn btn-sm danger" disabled={!(reason[k] || "").trim()} onClick={() => onOk(reason[k].trim())}>{label}</button>
    </div>
  ) : null;

  return (
    <div className="page" style={{ maxWidth: 1320 }}>
      <div className="page-head">
        <div><h1>Chờ duyệt</h1><div className="sub">Hàng chờ của văn phòng điều độ — sản lượng ca gửi lên khi tally kết ca, chỉ tính chính thức sau khi duyệt (US-BP-03 · SC-02)</div></div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 18 }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{ textAlign: "left", padding: "14px 16px", borderRadius: "var(--r-md)", border: `1px solid ${tab === t.id ? "var(--brand-ink)" : "var(--line)"}`, background: tab === t.id ? "var(--bg-sunken)" : "var(--bg-surface)", cursor: "pointer" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}><b style={{ fontSize: 13.5 }}>{t.label}</b><span className={`badge ${t.n ? "warning" : "neutral"}`}>{t.n}</span></div>
            <div className="muted" style={{ fontSize: 11.5, marginTop: 4 }}>{t.sub}</div>
          </button>
        ))}
      </div>

      {tab === "bp" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {bpGroups.length === 0 && <div className="card"><div className="card-body muted" style={{ textAlign: "center", padding: 30 }}>Không còn sản lượng ca chờ duyệt. Sản lượng gửi lên khi tally bấm Kết ca.</div></div>}
          {bpGroups.map(g => { const o = DD_ORDERS.find(x => x.id === g.order) || {}; const j = DD_JOBS.find(x => x.id === g.job); const u = unitOf(j.id); const total = g.recs.reduce((t, r) => t + r.qty, 0);
            const all = DD_RECORDS.filter(r => r.order === g.order && !["void", "returned"].includes(r.status)); const caSum = all.reduce((t, r) => t + r.qty, 0); const okSum = all.filter(r => r.status === "ok").reduce((t, r) => t + r.qty, 0);
            const calls = [...new Set(g.recs.map(r => r.call).filter(Boolean))]; const pct = o.target ? Math.round(caSum / o.target * 100) : 0; return (
            <div key={g.order} className="card">
              <div className="card-head">
                <div><h3><span className="mono">{g.order}</span> · {o.date?.slice(0, 5)} {DD_SHIFTS[(o.shift || 1) - 1].label} · {ddCusShort(j.customer)} · {j.cargo}</h3>
                  <div className="sub">{g.recs.length} mẻ chờ duyệt · <b className="mono">{tlFmt(total)} {u}</b> · tổ: {o.tally?.map(t => ddPerson(t).name).join(", ")} · cách ghi nhận: {DD_MEASURE[ddMeasure(j)]}</div></div>
                <div className="row" style={{ gap: 6 }}>
                  <button className="btn btn-sm" onClick={() => go("dd-job-detail", { id: j.id })}>Mở job</button>
                  <button className="btn btn-sm primary" onClick={() => { const ok = g.recs.filter(r => !r.review); const t = ok.reduce((x, r) => x + r.qty, 0); ok.forEach(r => r.status = "ok"); ddLogJob(j.id, `Duyệt sản lượng ${g.order}: ${tlFmt(t)} ${u}${ok.length < g.recs.length ? ` · ${g.recs.length - ok.length} dòng cần xem lại, chưa duyệt` : ""}`); refresh(`Đã duyệt ${tlFmt(t)} ${u} của ${g.order}`); }}><Icon name="check" size={12}/> Duyệt cả ca{g.recs.some(r => r.review) ? " (trừ dòng cần xem lại)" : ""}</button>
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0,1fr))", gap: 10, padding: "0 18px 12px" }}>
                {[["Mục tiêu ca", `${tlFmt(o.target || 0)} ${u}`, o.equip?.join(", ")], ["Đã ghi trong ca", `${tlFmt(caSum)} ${u}`, `${pct}% mục tiêu · đã duyệt ${tlFmt(okSum)} ${u}`], ["Luỹ kế job", `${tlFmt(j.actual)} / ${tlFmt(j.plan)} ${u}`, `${Math.round(j.actual / j.plan * 100)}% kế hoạch · ${j.from} → ${j.to}`], ["Lượt cập · sà lan", calls.length ? calls.join(", ") : "Chưa có lượt cập", [...new Set(g.recs.map(r => r.plate))].join(", ")]].map(([l, v, d]) => (
                  <div key={l} style={{ border: "1px solid var(--line)", borderRadius: "var(--r-sm)", padding: "8px 12px" }}><div className="muted" style={{ fontSize: 11.5 }}>{l}</div><div className="mono" style={{ fontSize: 14, fontWeight: 600, marginTop: 2 }}>{v}</div><div className="muted" style={{ fontSize: 11 }}>{d}</div></div>))}
              </div>
              <div className="tbl-wrap"><table className="tbl">
                <thead><tr><th style={{ width: 64 }}>Giờ</th><th>Tally</th><th>Sà lan · lượt cập</th><th>Ghi nhận</th><th style={{ width: 110, textAlign: "right" }}>Khối lượng</th><th>Ghi chú</th><th style={{ width: 190 }}></th></tr></thead>
                <tbody>{g.recs.map(r => { const tp = ddVeh(r.plate); const over = u === "tấn" && tp.cap && r.qty > tp.cap * 1.2; const isOpen = open === "rec:" + r.id; return (
                  <React.Fragment key={r.id}>
                  <tr style={{ background: r.review ? "var(--st-danger-bg, #FDECEC)" : over ? "var(--st-warning-bg)" : undefined, cursor: "pointer" }} onClick={() => setOpen(isOpen ? null : "rec:" + r.id)}>
                    <td className="mono" style={{ fontSize: 12 }}>{r.at.slice(-5)}</td>
                    <td style={{ fontSize: 12.5 }}>{ddPerson(r.by).name}</td>
                    <td style={{ fontSize: 12.5 }}><b className="mono">{r.plate}</b><div className="muted mono" style={{ fontSize: 11 }}>{r.call || "chưa có lượt cập"}</div></td>
                    <td style={{ fontSize: 12 }}>{DD_MEASURE[r.meth || ddMeasure(j)]}<div className="muted" style={{ fontSize: 11 }}>{r.src === "auto" ? "Tự động từ cân" : "Nhập tay"}</div></td>
                    <td className="mono" style={{ textAlign: "right" }}>{tlFmt(r.qty)} {u}</td>
                    <td>{r.review && <span className="badge danger">Cần xem lại</span>}{over && <span className="badge warning">Vượt tải {Math.round((r.qty / tp.cap - 1) * 100)}%</span>}{r.offList && <span className="badge warning">Xe ngoài DS</span>}{r.offline && <span className="badge neutral">Nhập offline</span>}{(r.hist || []).length > 0 && <span className="badge accent">Đã sửa {r.hist.length} lần</span>}{r.note && <div className="muted" style={{ fontSize: 11 }}>{r.note}</div>}</td>
                    <td onClick={e => e.stopPropagation()}><div className="row" style={{ gap: 6, justifyContent: "flex-end" }}><button className="btn btn-sm ghost" onClick={() => setOpen(isOpen ? null : "rec:" + r.id)}>{isOpen ? "Ẩn chi tiết" : "Chi tiết"}</button><button className={`btn btn-sm ${r.review ? "" : "ghost"}`} onClick={() => { r.review = !r.review; ddLogJob(r.job, `${r.review ? "Đánh dấu cần xem lại" : "Bỏ đánh dấu xem lại"}: ${r.plate} ${tlFmt(r.qty)} ${u} (${r.at.slice(-5)}) của ${g.order}`); refresh(r.review ? "Đã đánh dấu cần xem lại" : "Đã bỏ đánh dấu"); }}>{r.review ? "✓ Cần xem lại" : "Cần xem lại"}</button></div></td>
                  </tr>
                  {isOpen && <tr><td colSpan={7} style={{ background: "var(--bg-canvas)", padding: "12px 18px" }}>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0,1fr))", gap: "8px 24px", fontSize: 12.5 }}>
                      <div><div className="muted" style={{ fontSize: 11.5 }}>Số gốc tally nhập</div>{r.w1 ? <span className="mono">Lần 1 {tlFmt(r.w1)} − lần 2 {tlFmt(r.w2)} = {tlFmt(r.qty)} {u}</span> : <span className="mono">{(r.meth || ddMeasure(j)) === "hook" ? "Số cân treo đọc" : (r.meth || ddMeasure(j)) === "count" ? "Số đếm" : "Số nhập"}: {tlFmt(r.raw ?? r.qty)} {u}</span>}</div>
                      <div><div className="muted" style={{ fontSize: 11.5 }}>Nguồn số</div>{r.src === "auto" ? "Tự động từ cân, tally xác nhận" : "Tally nhập tay"}</div>
                      <div><div className="muted" style={{ fontSize: 11.5 }}>Ghi lúc · tài khoản</div><span className="mono">{r.at}</span> · {ddPerson(r.by).name}</div>
                      <div><div className="muted" style={{ fontSize: 11.5 }}>Sà lan · tải trọng</div>{r.plate} · {tp.type || "—"}</div>
                      <div><div className="muted" style={{ fontSize: 11.5 }}>Lượt cập</div>{r.call || "Chưa gắn lượt cập"}</div>
                      <div><div className="muted" style={{ fontSize: 11.5 }}>Mạng</div>{r.offline ? `Nhập khi mất mạng · đồng bộ lúc ${r.syncAt || "—"}` : "Có mạng"}</div>
                    </div>
                    <div style={{ marginTop: 10, fontSize: 12.5 }}><div className="muted" style={{ fontSize: 11.5, marginBottom: 4 }}>Lịch sử bản ghi</div>
                      <div><span className="mono">{r.at.slice(-5)}</span> · {ddPerson(r.by).name} tạo bản ghi {tlFmt((r.hist && r.hist.length) ? r.hist[0].from : r.qty)} {u}</div>
                      {(r.hist || []).map((h, i) => <div key={i}><span className="mono">{h.at.slice(-5)}</span> · {ddPerson(/^Tally/.test(h.kind) ? r.by : h.by).name}: {h.kind} · {tlFmt(h.from)} → <b>{tlFmt(h.to)}</b> {u}</div>)}
                      {r.review && <div style={{ color: "var(--st-danger)" }}>KHTH đánh dấu cần xem lại — chưa duyệt</div>}
                    </div>
                  </td></tr>}
                  </React.Fragment>); })}</tbody>
              </table></div>
            </div>); })}
        </div>
      )}

      {tab === "edit" && (
        <div className="card">
          {edits.length === 0 ? <div className="card-body muted" style={{ textAlign: "center", padding: 30 }}>Không có yêu cầu sửa bản ghi.</div> : (
            <div className="tbl-wrap"><table className="tbl">
              <thead><tr><th style={{ width: 100 }}>Yêu cầu</th><th style={{ width: 120 }}>Lệnh</th><th>Tally · bản ghi lúc</th><th style={{ width: 170 }}>Giá trị</th><th style={{ width: 150 }}>Lý do</th><th style={{ width: 230 }}></th></tr></thead>
              <tbody>{edits.map(q => { const r = DD_RECORDS.find(x => x.id === q.record) || {}; const u = unitOf(q.job); return (
                <React.Fragment key={q.id}>
                  <tr>
                    <td className="mono" style={{ fontSize: 12 }}>{q.id}<div className="muted" style={{ fontSize: 11 }}>{q.at.slice(-5)}</div></td>
                    <td className="mono" style={{ fontSize: 12 }}>{q.order}</td>
                    <td style={{ fontSize: 12.5 }}>{ddPerson(q.by).name}<div className="muted" style={{ fontSize: 11 }}>{r.plate} · bản ghi {r.at?.slice(-5)}</div><div className="muted" style={{ fontSize: 11 }}>{DD_MEASURE[r.meth || ddMeasure(DD_JOBS.find(x => x.id === q.job))]} · {r.src === "auto" ? "tự động từ cân" : "nhập tay"}{r.call ? ` · ${r.call}` : ""}</div></td>
                    <td className="mono"><s className="muted">{tlFmt(q.from)}</s> → <b>{tlFmt(q.to)}</b> {u}<div className="muted" style={{ fontSize: 11 }}>chênh {q.to - q.from > 0 ? "+" : ""}{tlFmt(q.to - q.from)} {u}</div></td>
                    <td style={{ fontSize: 12.5 }}>{q.reason}</td>
                    <td><div className="row" style={{ gap: 6, justifyContent: "flex-end" }}>
                      <button className="btn btn-sm" onClick={() => setOpen(q.id)}>Từ chối</button>
                      <button className="btn btn-sm primary" onClick={() => {
                        const j = DD_JOBS.find(x => x.id === q.job); j.actual = Math.round((j.actual - r.qty + q.to) * 100) / 100;
                        r.hist = [...(r.hist || []), { at: ddNow(), by: DD_ME.id, from: r.qty, to: q.to, kind: `KHTH duyệt yêu cầu sửa ${q.id}: ${q.reason}` }]; r.prev = r.qty; r.qty = q.to; r.status = ddRecOpenStatus(DD_ORDERS.find(x => x.id === r.order)); q.status = "approved";
                        ddLogJob(j.id, `Duyệt sửa bản ghi ${q.order}: ${tlFmt(q.from)} → ${tlFmt(q.to)} ${u}`); refresh("Đã duyệt sửa bản ghi");
                      }}>Duyệt sửa</button>
                    </div></td>
                  </tr>
                  {open === q.id && <tr><td colSpan={6}><Reason k={q.id} ph="Lý do từ chối" label="Từ chối" onOk={(why) => { q.status = "rejected"; q.rejectReason = why; r.status = ddRecOpenStatus(DD_ORDERS.find(x => x.id === r.order)); refresh("Đã từ chối — giữ số cũ"); }} /></td></tr>}
                </React.Fragment>); })}</tbody>
            </table></div>
          )}
        </div>
      )}

      {tab === "ex" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ padding: 12, borderRadius: "var(--r-sm)", background: "var(--bg-canvas)", border: "1px dashed var(--line)", fontSize: 12.5 }}>Mục này chỉ <b>Trưởng phòng khai thác ({DD_HEAD.name})</b> duyệt. KHTH xem được để theo dõi.</div>
          {exJobs.length === 0 && <div className="card"><div className="card-body muted" style={{ textAlign: "center", padding: 30 }}>Không có ngoại lệ chờ duyệt. Ngoại lệ phát sinh khi KHTH xin bàn giao Kế toán cho job chưa có HĐ (ở màn chi tiết job), (chạy thử: Trưởng phòng duyệt ngay tại đây, không qua E-Office).</div></div>}
          {exJobs.map(j => (
            <div key={j.id} className="card"><div className="card-body" style={{ display: "flex", gap: 16, alignItems: "center" }}>
              <div style={{ flex: 1, fontSize: 12.5 }}>
                <div><span className="badge danger">Chưa có HĐ</span> <b className="mono">{j.id}</b> · {ddCus(j.customer).name} · {j.cargo} · <span className="mono">{ddQty(j.actual, ddUnit(j))} {ddUnit(j)}</span></div>
                <div className="muted" style={{ marginTop: 4 }}>Xin bàn giao Kế toán khi chưa có HĐ · lý do: {j.exReason}{j.exTicket && <> · phiếu <span className="mono">{j.exTicket}</span> trên E-Office › Phê duyệt</>}</div>
              </div>
              <button className="btn btn-sm" onClick={() => go("dd-job-detail", { id: j.id })}>Xem job</button>
              {ddCan("TP") && <button className="btn btn-sm primary" onClick={() => { j.status = "closed"; j.exApproved = true; j.log.unshift({ at: ddNow(), by: DD_ME.id, text: "Duyệt ngoại lệ — chốt & bàn giao Kế toán khi chưa có HĐ" }); refresh("Đã duyệt ngoại lệ"); }}>Duyệt</button>}
            </div></div>
          ))}
        </div>
      )}
      <KdToast text={toast} />
    </div>
  );
};


/* =================== MÃ TÀI XẾ THEO LỆNH CA (v61) =================== */
const ddCopy = (t) => { try { navigator.clipboard && navigator.clipboard.writeText(t); } catch (e) {} };
const DdOrderCode = ({ o, onChange }) => {
  const [, force] = React.useState(0);
  const [end, setEnd] = React.useState(false);
  const live = ddOrderOpen(o);
  return (
    <div style={{ padding: "10px 12px", borderRadius: "var(--r-sm)", background: "var(--bg-canvas)", border: "1px solid var(--line)", fontSize: 12.5, marginBottom: 10 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
        <span>Mã đăng nhập tài xế của ca</span>
        {live ? <b className="mono" style={{ fontSize: 16, letterSpacing: ".08em" }}>{o.drvCode}</b> : <s className="mono muted">{o.drvCode}</s>}
        {live && <>
          <button className="btn btn-sm" onClick={() => { ddCopy(`Mã đăng nhập web tài xế ${o.id} (${DD_SHIFTS[o.shift - 1].label} ${o.date}): ${o.drvCode}`); onChange && onChange(`Đã sao chép mã ${o.drvCode}`); }}><Icon name="document" size={12}/> Sao chép mã</button>
          <button className="btn btn-sm ghost" onClick={() => { const old = o.drvCode; o.drvCode = ddDrvCode(o.id + Date.now()); (o.log = o.log || []).unshift({ at: ddNow(), by: DD_ME.id, text: `Đổi mã tài xế ${old} → ${o.drvCode} · mã cũ hết hiệu lực` }); force(x => x + 1); onChange && onChange(`Mã mới ${o.drvCode}`); }}>Đổi mã</button>
          <div style={{ flex: 1 }}></div>
          {!end ? <button className="btn btn-sm" onClick={() => setEnd(true)}>■ Kết ca</button>
            : ddShiftUnyarded(o).length ? <span className="row" style={{ gap: 6 }}><span style={{ color: "var(--st-warning)", fontSize: 12 }}>Chưa kết ca được: {ddShiftUnyarded(o).length} cont đã Gate In chưa hạ bãi ({ddShiftUnyarded(o).map(tlContFmt).join(", ")})</span><button className="btn btn-sm ghost" onClick={() => setEnd(false)}>Đóng</button></span>
            : <span className="row" style={{ gap: 6 }}><span className="muted">Kết ca: không ghi thêm, mã hết hiệu lực?</span><button className="btn btn-sm primary" onClick={() => { ddEndShift(o, DD_ME.id); setEnd(false); force(x => x + 1); onChange && onChange(`Đã kết ca ${o.id}`); }}>Xác nhận</button><button className="btn btn-sm ghost" onClick={() => setEnd(false)}>Thôi</button></span>}
        </>}
      </div>
      <div className="muted" style={{ fontSize: 11.5, marginTop: 4 }}>{live ? "Gửi cho nhà xe / tài xế xe ngoài · biển số phải có trong danh sách xe của lệnh này · hết hạn khi kết ca, job hoàn thành / huỷ hoặc đổi mã" : `Đã hết hiệu lực${o.endAt ? ` · kết ca lúc ${o.endAt.slice(-5)} (${ddPerson(o.endBy).name})` : ""}`}</div>
    </div>
  );
};
const DdJobCodes = ({ j, onChange }) => {
  const open = DD_ORDERS.filter(o => o.job === j.id && ddOrderOpen(o)).sort((a, b) => ddD(a.date) - ddD(b.date) || a.shift - b.shift);
  const jobLive = ["planned", "running"].includes(j.status);
  if (!jobLive) return <span className="muted">Hết hiệu lực — job {j.status === "cancelled" ? "đã huỷ" : "đã hoàn thành"}</span>;
  if (!open.length) return <span className="muted">Chưa có lệnh ca đang mở — mã sinh khi gửi lệnh ca</span>;
  return <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>{open.map(o => (
    <div key={o.id} className="row" style={{ gap: 8, alignItems: "center" }}>
      <span style={{ fontSize: 12 }}>{DD_SHIFTS[o.shift - 1].label} · {o.date.slice(0, 5)}</span><b className="mono" style={{ fontSize: 15, letterSpacing: ".08em" }}>{o.drvCode}</b>
      <button className="btn btn-sm ghost" style={{ height: 22, fontSize: 11 }} onClick={() => { ddCopy(o.drvCode); onChange(`Đã sao chép mã ${o.drvCode}`); }}>Sao chép</button>
      <button className="btn btn-sm ghost" style={{ height: 22, fontSize: 11 }} onClick={() => { const old = o.drvCode; o.drvCode = ddDrvCode(o.id + Date.now()); (o.log = o.log || []).unshift({ at: ddNow(), by: DD_ME.id, text: `Đổi mã tài xế ${old} → ${o.drvCode}` }); ddLogJob(j.id, `Đổi mã tài xế ${o.id}: ${old} → ${o.drvCode} · mã cũ hết hiệu lực`); onChange(`Mã mới ${o.drvCode}`); }}>Đổi mã</button>
      <span className="muted mono" style={{ fontSize: 11 }}>{o.id}</span>
    </div>))}<div className="muted" style={{ fontSize: 11.5 }}>Mỗi lệnh ca một mã · hết hạn khi kết ca</div></div>;
};
const DdJobDown = ({ j, go }) => {
  const d = ddJobDown(j.id);
  if (!d.total && !d.open) return <span className="muted">Chưa có sự cố dừng việc</span>;
  return <span><b>{ddFmtMin(d.total)}</b>{d.open ? <span className="badge danger" style={{ marginLeft: 6 }}>{d.open} đang dừng</span> : null}
    <div className="muted" style={{ fontSize: 11.5 }}>{d.byEq.map(x => `${x.eq}: ${ddFmtMin(x.mins)}`).join(" · ")}</div>
    <div className="muted" style={{ fontSize: 11.5 }}>{d.byType.map(x => `${x.label} ${ddFmtMin(x.mins)}`).join(" · ")} · <a style={{ cursor: "pointer", color: "var(--brand-ink)" }} onClick={() => go("dd-crane")}>Hiệu suất cẩu</a></div></span>;
};

/* =================== HIỆU SUẤT CẨU (v61) =================== */
/* Giờ làm của cẩu trong ca = từ bản ghi (hoặc sự cố) đầu tiên của cẩu đến lúc kết ca; ca chưa kết tính đến hiện tại.
   Giờ dừng = hợp các khoảng sự cố dừng việc của cẩu (báo → bản ghi tiếp theo của cẩu / kết ca). */
const ddCraneSegs = (period, jobF) => {
  const minD = ddD(ddToday()).getTime() - (+period - 1) * 864e5;
  const segs = [];
  DD_ORDERS.filter(o => o.status !== "draft" && ddD(o.date).getTime() >= minD && ddD(o.date).getTime() <= ddD(ddToday()).getTime() && (!jobF || o.job === jobF)).forEach(o => {
    const job = DD_JOBS.find(j => j.id === o.job) || {};
    ddCranes(o).forEach(eq => {
      const recs = DD_RECORDS.filter(r => r.order === o.id && r.eq === eq && r.status !== "void");
      const day = (i) => i.at.slice(0, 10) === o.date;
      const incs = DD_INCIDENTS.filter(i => i.order === o.id && i.eq === eq && ddIncDown(i) && day(i) && i.downFix == null);
      if (!recs.length && !incs.length) return;
      const st = Math.min(...recs.map(r => ddMs(r.at)), ...incs.map(i => ddMs(i.at)));
      const en = o.endAt ? ddMs(o.endAt) : ddMs(ddNowAt());
      const work = Math.max(0, (en - st) / 60000);
      const down = Math.min(work, (ddDownByEq(incs, [st, en])[0] || { mins: 0 }).mins);
      const qty = recs.reduce((t, r) => t + (r.qty || 0), 0);
      const byType = {}; incs.forEach(i => { const dn = ddIncDown(i); byType[i.type] = (byType[i.type] || 0) + dn.mins; });
      segs.push({ o, job, eq, unit: ddUnit(job), work, down, net: Math.max(0, work - down), qty, n: recs.length, byType, live: !o.endAt, st, en });
    });
  });
  return segs;
};
const DdCraneScreen = ({ go }) => {
  const [period, setPeriod] = React.useState("7");
  const [jobF, setJobF] = React.useState("");
  const [toast, flash] = useKdToast();
  const segs = ddCraneSegs(period, jobF);
  const cranes = Object.values(segs.reduce((m, x) => { const c = (m[x.eq] = m[x.eq] || { eq: x.eq, ca: 0, work: 0, down: 0, net: 0, qty: {}, byType: {} }); c.ca++; c.work += x.work; c.down += x.down; c.net += x.net; c.qty[x.unit] = (c.qty[x.unit] || 0) + x.qty; Object.entries(x.byType).forEach(([k, v]) => c.byType[k] = (c.byType[k] || 0) + v); return m; }, {})).sort((a, b) => b.work - a.work);
  const tot = cranes.reduce((t, c) => ({ work: t.work + c.work, down: t.down + c.down }), { work: 0, down: 0 });
  const hrs = (m) => (m / 60).toFixed(1).replace(".", ",");
  const qtyStr = (q) => Object.entries(q).map(([u, v]) => `${tlFmt(v, u)} ${u}`).join(" · ");
  const rate = (q, net) => net > 0 ? Object.entries(q).map(([u, v]) => `${tlFmt(Math.round(v / (net / 60) * 10) / 10)} ${u}/giờ`).join(" · ") : "—";
  const tname = (k) => (TL_INC_TYPES.find(t => t.id === k) || {}).label || k;
  const jobsWith = [...new Set(DD_ORDERS.filter(o => ddCranes(o).length).map(o => o.job))];
  return (
    <div className="page" style={{ maxWidth: 1480 }}>
      <div className="page-head">
        <div><h1>Hiệu suất cẩu</h1><div className="sub">Giờ làm = từ bản ghi đầu tiên của cẩu trong ca đến lúc kết ca · giờ dừng = sự cố dừng việc, tính từ lúc báo đến bản ghi tiếp theo của cùng cẩu</div></div>
        <div className="actions"><button className="btn" onClick={() => flash("Đã xuất hiệu suất cẩu (Excel)")}><Icon name="download" size={13}/> Xuất Excel</button></div>
      </div>
      <div className="row" style={{ gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
        <div className="seg-bar">{[["1", "Hôm nay"], ["7", "7 ngày"], ["30", "30 ngày"]].map(([k, l]) => <button key={k} className={period === k ? "on" : ""} onClick={() => setPeriod(k)}>{l}</button>)}</div>
        <select className="select" style={{ width: 300, height: 32 }} value={jobF} onChange={e => setJobF(e.target.value)}><option value="">Tất cả job</option>{jobsWith.map(id => { const j = DD_JOBS.find(x => x.id === id) || {}; return <option key={id} value={id}>{id} · {ddCusShort(j.customer)} · {j.cargo}</option>; })}</select>
      </div>
      <DdKpis items={[
        { l: "Số cẩu có hoạt động", v: cranes.length, u: "cẩu", d: `${segs.length} lượt cẩu × ca` },
        { l: "Giờ làm", v: hrs(tot.work), u: "giờ", d: "bản ghi đầu → kết ca" },
        { l: "Giờ dừng do sự cố", v: hrs(tot.down), u: "giờ", d: tot.work ? `${Math.round(tot.down / tot.work * 100)}% giờ làm` : "—", c: "#DC2626" },
        { l: "Giờ làm thực", v: hrs(tot.work - tot.down), u: "giờ", d: "giờ làm − giờ dừng", c: "#16A34A" },
      ]} />
      <div className="card" style={{ marginBottom: 18 }}>
        <div className="card-head"><h3>Theo cẩu</h3></div>
        <div className="tbl-wrap"><table className="tbl">
          <thead><tr><th>Cẩu</th><th style={{ textAlign: "right" }}>Số ca</th><th style={{ textAlign: "right" }}>Giờ làm</th><th style={{ textAlign: "right" }}>Giờ dừng</th><th style={{ textAlign: "right" }}>Giờ làm thực</th><th>Sản lượng</th><th>Năng suất (/giờ làm thực)</th><th>Dừng theo loại</th></tr></thead>
          <tbody>{cranes.length === 0 && <tr><td colSpan={8} className="muted" style={{ textAlign: "center", padding: 20 }}>Chưa có dữ liệu trong kỳ</td></tr>}
            {cranes.map(c => <tr key={c.eq}><td style={{ fontWeight: 600 }}>{c.eq}</td><td className="mono" style={{ textAlign: "right" }}>{c.ca}</td><td className="mono" style={{ textAlign: "right" }}>{hrs(c.work)}</td><td className="mono" style={{ textAlign: "right", color: c.down ? "var(--st-danger)" : undefined }}>{hrs(c.down)}</td><td className="mono" style={{ textAlign: "right" }}>{hrs(c.net)}</td><td className="mono" style={{ fontSize: 12.5 }}>{qtyStr(c.qty)}</td><td className="mono" style={{ fontSize: 12.5 }}>{rate(c.qty, c.net)}</td><td style={{ fontSize: 12 }}>{Object.entries(c.byType).map(([k, v]) => `${tname(k)} ${ddFmtMin(v)}`).join(" · ") || "—"}</td></tr>)}</tbody>
        </table></div>
      </div>
      <div className="card">
        <div className="card-head"><div><h3>Chi tiết theo ca</h3><div className="sub">Mỗi dòng là một cẩu trong một lệnh ca</div></div></div>
        <div className="tbl-wrap"><table className="tbl">
          <thead><tr><th>Lệnh ca</th><th>Job</th><th>Cẩu</th><th>Từ → đến</th><th style={{ textAlign: "right" }}>Giờ làm</th><th style={{ textAlign: "right" }}>Giờ dừng</th><th style={{ textAlign: "right" }}>Bản ghi</th><th>Sản lượng</th></tr></thead>
          <tbody>{segs.map(x => <tr key={x.o.id + x.eq}><td className="mono" style={{ fontSize: 12 }}>{x.o.id}<div className="muted" style={{ fontSize: 11 }}>{DD_SHIFTS[x.o.shift - 1].label} · {x.o.date.slice(0, 5)}</div></td><td style={{ fontSize: 12 }}><a style={{ cursor: "pointer", color: "var(--brand-ink)" }} onClick={() => go("dd-job-detail", { id: x.job.id })}><span className="mono">{x.job.id}</span></a><div className="muted" style={{ fontSize: 11 }}>{ddCusShort(x.job.customer)} · {x.job.cargo}</div></td><td style={{ fontSize: 12.5 }}>{x.eq}</td><td className="mono" style={{ fontSize: 12 }}>{new Date(x.st).toTimeString().slice(0, 5)} → {x.live ? <span className="badge accent">đang làm</span> : new Date(x.en).toTimeString().slice(0, 5)}</td><td className="mono" style={{ textAlign: "right" }}>{hrs(x.work)}</td><td className="mono" style={{ textAlign: "right", color: x.down ? "var(--st-danger)" : undefined }}>{x.down ? ddFmtMin(x.down) : "—"}</td><td className="mono" style={{ textAlign: "right" }}>{x.n}</td><td className="mono" style={{ fontSize: 12 }}>{tlFmt(x.qty)} {x.unit}</td></tr>)}</tbody>
        </table></div>
      </div>
      <KdToast text={toast} />
    </div>
  );
};

Object.assign(window, { DdOrderCode, DdJobCodes, DdJobDown, DdCraneScreen, ddCraneSegs, DdSupplement, DdIncidentsScreen, DdApprovalsScreen, ddOpenIncidents, ddPendingCount });
