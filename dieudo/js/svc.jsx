/* Điều độ khai thác — Màn theo dịch vụ
   · Bến phao / ICD: tổng quan job, ca hôm nay, bản ghi tally, lịch sà lan
   · Kho: nhập / xuất / tồn 3 kho (US-KHO-01, 03, 04 · BR-KHO-05) — chưa kết nối trạm cân
   · Depot: dữ liệu EDI đối tác, hình thức nhập/cấp rỗng, sửa chữa (US-DEP-01..03)
   · Bãi container: vị trí cont, dịch vụ cộng thêm, sử dụng bãi (US-BAI-01..03) */

const DdKpis = ({ items }) => (
  <div className="kpi-grid" style={{ marginBottom: 18 }}>
    {items.map(k => <div key={k.l} className="kpi"><div className="lbl"><span className="swatch" style={{ background: k.c || "#0E7490" }}></span>{k.l}</div><div className="val">{k.v} <small>{k.u || ""}</small></div><div className="delta">{k.d || ""}</div></div>)}
  </div>
);
const DdTabs = ({ tabs, tab, setTab }) => (
  <div className="tabs">{tabs.map(([k, l, n]) => <div key={k} className={`tab ${tab === k ? "active" : ""}`} onClick={() => setTab(k)}>{l}{n != null && <span className="count">{n}</span>}</div>)}</div>
);

/* =================== BẾN PHAO / ICD =================== */
const DdServiceScreen = ({ svc, go }) => {
  const s = ddSvc(svc);
  const jobs = DD_JOBS.filter(j => j.service === svc && j.status !== "closed");
  const running = jobs.filter(j => j.status === "running");
  const orders = DD_ORDERS.filter(o => o.date === ddToday() && jobs.some(j => j.id === o.job)).sort((a, b) => a.shift - b.shift);
  const recs = (window.DD_RECORDS || []).filter(r => r.status !== "void" && jobs.some(j => j.id === r.job) && r.at.startsWith(ddToday()));
  const berths = svc === "bp" ? DD_OCC_BERTHS.filter(b => b.kind !== "icd").map(b => b.id) : DD_ICD_BERTHS;
  const calls = (window.DD_CALLS || []).filter(c => berths.includes(c.berth) && c.status !== "departed");
  const tons = recs.filter(r => !r.cont && DD_JOBS.find(j => j.id === r.job)?.unit === "tấn").reduce((t, r) => t + r.qty, 0);
  const conts = recs.filter(r => r.cont).length;
  const pend = recs.filter(r => r.status === "pending").length;
  const incs = (window.DD_INCIDENTS || []).filter(i => i.status !== "closed" && jobs.some(j => j.id === i.job));

  return (
    <div className="page" style={{ maxWidth: 1480 }}>
      <div className="page-head">
        <div><h1 style={{ display: "flex", alignItems: "center", gap: 10 }}><Icon name={s.icon} size={20}/>{s.label}</h1><div className="sub">Theo dõi dịch vụ trong ngày {ddToday()} · số liệu cập nhật từ app tally</div></div>
        <div className="actions">
          <button className="btn" onClick={() => go("dd-shifts")}><Icon name="schedule" size={14}/> Lệnh làm việc ca</button>
          <button className="btn accent" onClick={() => go("dd-job-new")}><Icon name="plus" size={14}/> Tạo kế hoạch job</button>
        </div>
      </div>
      <DdKpis items={[
        { l: "Job đang thực hiện", v: running.length, u: "job", d: `${jobs.length - running.length} job kế hoạch / chờ chốt` },
        { l: "Sản lượng hôm nay", v: svc === "icd" ? `${tlFmt(tons)}` : tlFmt(tons), u: "tấn", d: svc === "icd" ? `+ ${conts} cont` : `${recs.length} chuyến sà lan`, c: "#16A34A" },
        { l: svc === "bp" ? "Chờ VP duyệt" : "Lệnh ca hôm nay", v: svc === "bp" ? pend : orders.length, u: svc === "bp" ? "bản ghi" : "lệnh", d: svc === "bp" ? "US-BP-03" : `${orders.filter(o => o.status === "running").length} đang làm`, c: "#B45309" },
        { l: "Sự cố đang mở", v: incs.length, u: "ticket", d: incs.filter(i => (ddIncDown(i) || {}).open).length + " đang dừng việc", c: "#DC2626" },
      ]} />

      <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1.4fr) minmax(0,1fr)", gap: 18, alignItems: "start" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 18, minWidth: 0 }}>
          <div className="card">
            <div className="card-head"><h3>Job đang mở</h3><span className="muted" style={{ fontSize: 12 }}>{jobs.length} job</span></div>
            <div className="tbl-wrap"><table className="tbl">
              <thead><tr><th style={{ width: 130 }}>Job</th><th>Khách hàng · Hàng</th><th style={{ width: 110 }}>Vị trí</th><th style={{ width: 200 }}>Tiến độ</th><th style={{ width: 150 }}>Trạng thái</th></tr></thead>
              <tbody>{jobs.map(j => (
                <tr key={j.id} style={{ cursor: "pointer" }} onClick={() => go("dd-job-detail", { id: j.id })}>
                  <td className="mono" style={{ fontSize: 12 }}>{j.id}</td>
                  <td><div style={{ fontSize: 13, fontWeight: 500 }}>{ddCusShort(j.customer)} {!j.contract && <span className="badge danger" style={{ fontSize: 10 }}>Chưa có HĐ</span>}</div><div className="muted" style={{ fontSize: 11.5 }}>{j.kind === "cont" ? ddDirLabel(j) : j.cargo}</div></td>
                  <td className="mono" style={{ fontSize: 12 }}>{ddLoc(j)}</td>
                  <td><DdProgress job={j} /></td>
                  <td><DdBadge map={DD_JOB_STATUS} s={j.status} /></td>
                </tr>))}</tbody>
            </table></div>
          </div>
          <div className="card">
            <div className="card-head"><h3>Bản ghi tally hôm nay</h3><span className="muted" style={{ fontSize: 12 }}>{recs.length} bản ghi</span></div>
            <div className="tbl-wrap" style={{ maxHeight: 320, overflowY: "auto" }}><table className="tbl">
              <thead><tr><th style={{ width: 64 }}>Giờ</th><th style={{ width: 106 }}>Lệnh</th><th>Tally</th><th>Cont / phương tiện</th><th style={{ width: 110, textAlign: "right" }}>Khối lượng</th></tr></thead>
              <tbody>{[...recs].sort((a, b) => a.at < b.at ? 1 : -1).map(r => { const j = DD_JOBS.find(x => x.id === r.job); return (
                <tr key={r.id}><td className="mono" style={{ fontSize: 12 }}>{r.at.slice(-5)}</td><td className="mono" style={{ fontSize: 12 }}>{r.order}</td><td style={{ fontSize: 12.5 }}>{ddPerson(r.by).name}</td>
                  <td className="mono" style={{ fontSize: 12 }}>{r.cont ? tlContFmt(r.cont) : ""}{r.cont && r.plate ? " → " : ""}{r.plate || (r.cont ? "hạ bãi" : "")}</td>
                  <td className="mono" style={{ textAlign: "right" }}>{r.cont ? "1 cont" : `${tlFmt(r.qty)} ${ddUnit(j)}`}</td></tr>); })}</tbody>
            </table></div>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 18, minWidth: 0 }}>
          <div className="card">
            <div className="card-head"><h3>Ca hôm nay</h3><button className="btn btn-sm" onClick={() => go("dd-shifts")}>Mở lịch ca</button></div>
            <div className="card-body" style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {orders.length === 0 && <div className="muted" style={{ fontSize: 12.5 }}>Không có lệnh ca hôm nay.</div>}
              {orders.map(o => { const j = DD_JOBS.find(x => x.id === o.job); const done = (window.DD_RECORDS || []).filter(r => r.order === o.id && r.status !== "void" && r.status !== "returned").reduce((t, r) => t + r.qty, 0); const pct = Math.min(100, Math.round(done / o.target * 100)); return (
                <div key={o.id} style={{ padding: "8px 10px", border: "1px solid var(--line)", borderRadius: 6 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5 }}><b>{DD_SHIFTS[o.shift - 1].label} · {ddCusShort(j.customer)}</b><DdBadge map={DD_ORDER_STATUS} s={o.status} /></div>
                  <div className="muted" style={{ fontSize: 11.5 }}><span className="mono">{o.id}</span> · {o.tally.map(t => ddPerson(t).short).join(", ")} · {(o.vehicles || []).join(", ") || "—"}</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 5 }}><div style={{ flex: 1, height: 5, background: "var(--bg-sunken)", borderRadius: 3 }}><div style={{ width: pct + "%", height: "100%", background: "var(--brand-ink)", borderRadius: 3 }}></div></div><span className="mono" style={{ fontSize: 11 }}>{tlFmt(done)}/{ddNum(o.target)} {ddUnit(j)}</span></div>
                </div>); })}
            </div>
          </div>
          <div className="card">
            <div className="card-head"><h3>Sà lan tại bến</h3><button className="btn btn-sm" onClick={() => go("dd-river")}>River gate</button></div>
            <div className="card-body" style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {calls.length === 0 && <div className="muted" style={{ fontSize: 12.5 }}>Không có lịch sà lan.</div>}
              {calls.map(c => <div key={c.id} style={{ display: "flex", justifyContent: "space-between", gap: 8, fontSize: 12.5, padding: "5px 0", borderBottom: "1px dashed var(--line)" }}><span><b className="mono">{c.berth}</b> · {c.barge}</span><span className="muted mono" style={{ fontSize: 11.5 }}>{c.status === "working" ? "đang làm · rời " : "ETA "}{c.status === "working" ? `${c.etd[0].slice(0, 5)} ${c.etd[1]}` : `${c.eta[0].slice(0, 5)} ${c.eta[1]}`}</span></div>)}
            </div>
          </div>
          {incs.length > 0 && <div className="card"><div className="card-head"><h3>Sự cố đang mở</h3><button className="btn btn-sm" onClick={() => go("dd-incidents")}>Xem</button></div>
            <div className="card-body">{incs.map(i => <div key={i.id} style={{ fontSize: 12.5, padding: "4px 0" }}><span className="mono">{i.id}</span> · {(TL_INC_TYPES.find(t => t.id === i.type) || {}).label} · <span className="muted">{i.job}</span></div>)}</div></div>}
        </div>
      </div>
    </div>
  );
};

/* =================== KHO =================== */
const DD_WAREHOUSES = [
  { id: "Kho 1", owner: "VNL", area: "6.000 m²", note: "Hàng bao, phuy" },
  { id: "Kho 2", owner: "VNL", area: "8.500 m²", note: "Xi măng, clinker bao" },
  { id: "Kho 3", owner: "Đối tác", area: "5.000 m²", note: "Đối tác quản lý — số liệu nhập tay (OQ #4)" },
];
const DD_STOCK = []; /* pilot: Kho dùng /warehouse — không có tồn mẫu */
const DD_WH_TX = [];
const ddStockOf = (kho, customer, cargo) => DD_STOCK.find(x => x.kho === kho && x.customer === customer && x.cargo === cargo);

/* =================== DEPOT (EDI) =================== */
const DD_DEPOT = []; /* pilot: không làm Depot */
const DD_REPAIRS = [];
const DD_REPAIR_ST = { survey: ["warning", "Chờ giám định"], approved: ["accent", "Hãng duyệt sửa"], repair: ["warning", "Đang sửa"], done: ["success", "Hoàn thành"] };
const DD_DEP_MODE = { truck: "Truck", barge: "Sà lan + ICD" };

/* =================== BÃI CONTAINER =================== */
const DD_VAS_TYPES = ["Nâng hạ", "Vận chuyển nội bãi", "Xếp dỡ / đảo chuyển", "Cắm điện cont lạnh", "Kiểm hoá"];
const DD_VAS = []; /* pilot: dịch vụ GTGT bãi chưa lưu CSDL */
const DD_BLOCKS = [{ id: "R1", cap: 60, kind: "Lạnh" }, { id: "R2", cap: 40, kind: "Lạnh" }, { id: "B3", cap: 120, kind: "Hàng khô" }, { id: "E1", cap: 150, kind: "Rỗng" }, { id: "E2", cap: 150, kind: "Rỗng" }];

const DdYardScreen = ({ go, embed }) => {
  const [, force] = React.useState(0);
  const [tab, setTab] = React.useState(embed ? "vas" : "pos");
  const [q, setQ] = React.useState("");
  const [form, setForm] = React.useState(null);
  const [toast, flash] = useKdToast();
  const inPort = Object.values(window.DD_CONT_REG || {}).filter(c => c.inPort);
  const rows = inPort.filter(c => !q || [c.no, c.loc, c.line, ddCusShort(c.customer || "")].join(" ").toUpperCase().includes(q.toUpperCase()));
  const used = (b) => inPort.filter(c => (c.loc || "").startsWith(b + "-")).length + ({ R1: 14, R2: 9, B3: 61, E1: 88, E2: 52 }[b] || 0);
  const save = () => {
    const c = window.DD_CONT_REG[form.no];
    const ct = ddActiveContracts(c?.customer || "")[0];
    DD_VAS.unshift({ id: ddNewId("DV"), no: form.no, customer: c?.customer, type: form.type, qty: form.qty, unit: form.type === "Cắm điện cont lạnh" ? "ngày" : "lượt", at: `${ddNow()}`, by: DD_ME.id, contract: ct ? ct.id : null });
    setForm(null); force(n => n + 1); flash("Đã ghi nhận dịch vụ cộng thêm");
  };
  return (
    <div className={embed ? "" : "page"} style={{ maxWidth: 1480 }}>
      {embed && <div style={{ padding: "10px 16px", display: "flex", justifyContent: "flex-end" }}><button className="btn accent btn-sm" onClick={() => setForm({ no: rows[0]?.no || "", type: DD_VAS_TYPES[0], qty: 1 })}><Icon name="plus" size={13}/> Ghi dịch vụ cộng thêm</button></div>}
      {!embed && <div className="page-head">
        <div><h1 style={{ display: "flex", alignItems: "center", gap: 10 }}><Icon name="grid" size={20}/>Bãi container</h1><div className="sub">Vị trí cont đồng bộ từ CMS (EDI) · dịch vụ cộng thêm theo hợp đồng thuê bãi · báo cáo sử dụng bãi (US-BAI-01..03)</div></div>
        <div className="actions"><button className="btn accent" onClick={() => setForm({ no: rows[0]?.no || "", type: DD_VAS_TYPES[0], qty: 1 })}><Icon name="plus" size={14}/> Ghi dịch vụ cộng thêm</button></div>
      </div>}
      {!embed && <div style={{ display: "grid", gridTemplateColumns: `repeat(${DD_BLOCKS.length}, 1fr)`, gap: 12, marginBottom: 18 }}>
        {DD_BLOCKS.map(b => { const u = used(b.id); const pct = Math.round(u / b.cap * 100); return (
          <div key={b.id} className="card" style={{ padding: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}><b style={{ fontSize: 16 }} className="mono">{b.id}</b><span className="muted" style={{ fontSize: 11.5 }}>{b.kind}</span></div>
            <div className="mono" style={{ fontSize: 13, marginTop: 6 }}>{u}/{b.cap} TEU</div>
            <div style={{ height: 6, background: "var(--bg-sunken)", borderRadius: 3, marginTop: 6 }}><div style={{ width: pct + "%", height: "100%", borderRadius: 3, background: pct > 85 ? "var(--st-danger)" : pct > 65 ? "var(--st-warning)" : "#0E7490" }}></div></div>
            <div className="muted" style={{ fontSize: 11, marginTop: 4 }}>{pct}% công suất</div>
          </div>); })}
      </div>}
      <div className={embed ? "" : "card"}>
        {!embed && <DdTabs tab={tab} setTab={setTab} tabs={[["pos", "Vị trí cont (CMS)", inPort.length], ["vas", "Dịch vụ cộng thêm", DD_VAS.length]]} />}
        {tab === "pos" && (<>
          <div style={{ padding: "10px 16px" }}><div className="search" style={{ margin: 0, maxWidth: 360 }}><Icon name="search" size={14} className="muted"/><input value={q} onChange={e => setQ(e.target.value)} placeholder="Tìm số cont, vị trí, hãng, khách hàng…" /></div></div>
          <div className="tbl-wrap" style={{ maxHeight: 460, overflowY: "auto" }}><table className="tbl">
            <thead><tr><th>Số cont</th><th style={{ width: 120 }}>Vị trí (block-bay-tier)</th><th style={{ width: 100 }}>Loại</th><th style={{ width: 90 }}>Hãng</th><th>Khách hàng</th><th style={{ width: 90, textAlign: "right" }}>Lưu bãi</th><th style={{ width: 120 }}></th></tr></thead>
            <tbody>{rows.map(c => (
              <tr key={c.no}><td className="mono" style={{ fontWeight: 600, fontSize: 12.5 }}>{tlContFmt(c.no)}</td><td className="mono" style={{ fontSize: 12.5 }}>{c.loc}</td><td style={{ fontSize: 12 }}>{c.type} · {c.fe === "F" ? "Hàng" : "Rỗng"}</td><td style={{ fontSize: 12 }}>{c.line}</td><td style={{ fontSize: 12 }}>{c.customer ? ddCusShort(c.customer) : "—"}</td>
                <td className="mono" style={{ textAlign: "right" }}>{ddDwell(c.gateInAt)} ngày</td>
                <td><button className="btn btn-sm ghost" onClick={() => setForm({ no: c.no, type: c.type.includes("RF") ? "Cắm điện cont lạnh" : DD_VAS_TYPES[0], qty: 1 })}>+ Dịch vụ</button></td></tr>))}</tbody>
          </table></div>
        </>)}
        {tab === "vas" && (
          <div className="tbl-wrap"><table className="tbl">
            <thead><tr><th style={{ width: 110 }}>Mã</th><th>Số cont</th><th>Dịch vụ</th><th style={{ width: 90, textAlign: "right" }}>SL</th><th>Khách hàng · HĐ</th><th style={{ width: 110 }}>Thời gian</th></tr></thead>
            <tbody>{DD_VAS.map(v => <tr key={v.id}><td className="mono" style={{ fontSize: 12 }}>{v.id}</td><td className="mono" style={{ fontWeight: 600, fontSize: 12.5 }}>{tlContFmt(v.no)}</td><td style={{ fontSize: 12.5 }}>{v.type}</td><td className="mono" style={{ textAlign: "right" }}>{v.qty} {v.unit}</td>
              <td style={{ fontSize: 12 }}>{v.customer ? ddCusShort(v.customer) : "—"}{v.contract ? <div className="muted mono" style={{ fontSize: 11 }}>{v.contract}</div> : <div style={{ fontSize: 11, color: "var(--st-danger)" }}>Chưa có HĐ thuê bãi</div>}</td>
              <td className="mono" style={{ fontSize: 12 }}>{v.at.slice(0, 5)} {v.at.slice(-5)}</td></tr>)}</tbody>
          </table></div>
        )}
      </div>
      {!embed && <div className="muted" style={{ fontSize: 11.5, marginTop: 8 }}>Vị trí cont hiện lấy từ sổ cont của Gate In/Out; khi kết nối CMS sẽ đồng bộ vị trí thực (giao thức còn mở — OQ #2).</div>}

      {form && (
        <div className="modal-overlay" onClick={() => setForm(null)}>
          <div className="modal" style={{ width: 520 }} onClick={e => e.stopPropagation()}>
            <div className="modal-head"><h3>Ghi dịch vụ cộng thêm</h3><button className="icon-btn" onClick={() => setForm(null)}><Icon name="x" size={16}/></button></div>
            <div className="modal-body">
              <div className="field"><label>Container</label><select className="select mono" value={form.no} onChange={e => setForm(f => ({ ...f, no: e.target.value }))}>{inPort.slice(0, 400).map(c => <option key={c.no} value={c.no}>{tlContFmt(c.no)} · {c.loc} · {c.customer ? ddCusShort(c.customer) : c.line}</option>)}</select></div>
              <div className="field-row">
                <div className="field"><label>Dịch vụ</label><select className="select" value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}>{DD_VAS_TYPES.map(t => <option key={t}>{t}</option>)}</select></div>
                <div className="field"><label>Số lượng ({form.type === "Cắm điện cont lạnh" ? "ngày" : "lượt"})</label><input className="input mono" value={form.qty} onChange={e => setForm(f => ({ ...f, qty: Number(e.target.value.replace(/\D/g, "")) || 0 }))} /></div>
              </div>
              {(() => { const c = window.DD_CONT_REG[form.no]; const ct = c && ddActiveContracts(c.customer || "")[0]; return <div className="muted" style={{ fontSize: 12 }}>{ct ? `Tính theo ${ct.id} · ${ct.title}` : "Khách hàng chưa có HĐ thuê bãi đang hiệu lực — vẫn ghi nhận, KD bổ sung sau."}</div>; })()}
            </div>
            <div className="modal-foot"><button className="btn ghost" onClick={() => setForm(null)}>Huỷ</button><button className="btn primary" disabled={!form.no || !form.qty} onClick={save}>Lưu</button></div>
          </div>
        </div>
      )}
      <KdToast text={toast} />
    </div>
  );
};

Object.assign(window, { DdServiceScreen, DdYardScreen, DD_WH_TX, DD_STOCK, DdKpis, DdTabs });
