/* An Ninh — Phê duyệt: danh sách + chi tiết phiếu đăng ký người/xe */

const SecApprovalListScreen = ({ go }) => {
  const [tab, setTab] = React.useState("inbox");
  const counts = {
    inbox:   SEC_APPROVALS.filter(a => a.status === "current").length,
    sent:    SEC_APPROVALS.length,
    archive: SEC_APPROVALS.filter(a => a.status === "approved" || a.status === "rejected").length,
    all:     SEC_APPROVALS.length,
  };
  const visible = SEC_APPROVALS.filter(a => {
    if (tab === "inbox")   return a.status === "current";
    if (tab === "archive") return a.status === "approved" || a.status === "rejected";
    return true;
  });

  return (
    <div className="page" style={{ paddingTop: 28 }}>
      <div className="page-head">
        <div>
          <h1>Phê duyệt</h1>
          <div className="sub">Đăng ký người & xe ra vào cảng · {SEC_ME.role}</div>
        </div>
        <div className="actions">
          <button className="btn"><Icon name="download" size={14}/> Xuất Excel</button>
          <button className="btn accent" onClick={() => go("approval-create")}><Icon name="plus" size={14}/> Đăng ký người/xe</button>
        </div>
      </div>

      <div className="card">
        <div className="tabs">
          {[
            { id: "inbox",   label: "Chờ duyệt", count: counts.inbox, urgent: true },
            { id: "archive", label: "Đã xử lý",  count: counts.archive },
            { id: "all",     label: "Tất cả",    count: counts.all },
          ].map(t => (
            <div key={t.id} className={`tab ${tab === t.id ? "active" : ""}`} onClick={() => setTab(t.id)} style={t.urgent ? { fontWeight: 600 } : {}}>
              {t.urgent && <span style={{ display: "inline-block", width: 6, height: 6, borderRadius: 999, background: "var(--brand-accent)", marginRight: 6, verticalAlign: "middle" }}></span>}
              {t.label}<span className="count">{t.count}</span>
            </div>
          ))}
        </div>

        <div className="toolbar">
          <div className="seg-bar">
            <button className="on">Tất cả</button>
            <button>Người</button>
            <button>Xe</button>
          </div>
          <div className="filt-chip set"><span className="label">Nguồn:</span> Tất cả <Icon name="chevronDown" size={12} /></div>
          <div className="spacer"></div>
          <div className="muted" style={{ fontSize: 12 }}>Hiển thị <b>{visible.length}</b> / {SEC_APPROVALS.length} phiếu</div>
        </div>

        <div className="tbl-wrap">
          <table className="tbl">
            <thead>
              <tr>
                <th style={{ minWidth: 260 }}>Đối tượng</th>
                <th style={{ width: 150 }}>Loại</th>
                <th style={{ width: 160 }}>Nguồn</th>
                <th style={{ width: 140 }}>Hiệu lực</th>
                <th style={{ width: 140 }}>Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {visible.map(a => (
                <tr key={a.id} onClick={() => go("approval-detail", { id: a.id })} style={{ cursor: "pointer" }}>
                  <td style={{ paddingTop: 12, paddingBottom: 12 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                      <span className="mono" style={{ fontSize: 11.5, color: "var(--brand-ink)", fontWeight: 500 }}>{a.id}</span>
                      {a.kind === "vehicle" && (
                        <span className={`tag ${a.priority === "priority" ? "priority-high" : "priority-normal"}`}>
                          {a.priority === "priority" ? "Ưu tiên" : "Thường"}
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: 13.5, fontWeight: 500, color: "var(--t-primary)" }}>
                      {a.name}{a.org ? ` — ${a.org}` : ""}
                    </div>
                    <div className="muted" style={{ fontSize: 11.5, marginTop: 3 }}>{a.purpose}</div>
                  </td>
                  <td style={{ fontSize: 13 }}>{a.kind === "person" ? "Đăng ký người" : "Đăng ký xe"} · {a.sub}</td>
                  <td>
                    <span className={`tag ${a.source === "external" ? "src-external" : "src-internal"}`}>
                      {a.source === "external" ? "🌍 External" : `🏢 ${a.dept}`}
                    </span>
                  </td>
                  <td className="mono" style={{ fontSize: 12 }}>{a.mode}</td>
                  <td>
                    {a.status === "current" && <span className="badge accent"><span className="pip"></span>Chờ duyệt</span>}
                    {a.status === "approved" && <span className="badge success"><span className="pip"></span>Đã duyệt</span>}
                    {a.status === "rejected" && <span className="badge danger"><span className="pip"></span>Từ chối</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{ padding: "12px 20px", borderTop: "1px solid var(--line)", fontSize: 12.5, color: "var(--t-secondary)" }}>
          1–{visible.length} của {visible.length}
        </div>
      </div>
    </div>
  );
};

const SecApprovalDetailScreen = ({ go, ctx }) => {
  const id = ctx?.id || SEC_APPROVALS[0].id;
  const a = SEC_APPROVALS.find(x => x.id === id) || SEC_APPROVALS[0];
  const [comment, setComment] = React.useState("");
  const [toast, setToast] = React.useState(null);
  const flash = (msg) => { setToast(msg); clearTimeout(window.__saToast); window.__saToast = setTimeout(() => setToast(null), 2000); };
  const isCurrent = a.status === "current";

  return (
    <div className="page" style={{ paddingTop: 24, maxWidth: 1320 }}>
      <div style={{ marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
        <button className="btn ghost btn-sm" onClick={() => go("approval")}>← Quay lại danh sách</button>
        <div className="muted" style={{ fontSize: 12, marginLeft: 6 }}>Phê duyệt / <span className="mono">{a.id}</span></div>
      </div>

      <div className="detail-grid-360" style={{ gap: 24 }}>
        <div>
          <div className="card" style={{ marginBottom: 20 }}>
            <div style={{ padding: "24px 24px 18px" }}>
              <div className="row" style={{ marginBottom: 10, gap: 8, flexWrap: "wrap" }}>
                <span className="tag">{a.id}</span>
                <span className="badge neutral">{a.kind === "person" ? "Đăng ký người" : "Đăng ký xe"} · {a.sub}</span>
                <span className={`tag ${a.source === "external" ? "src-external" : "src-internal"}`}>
                  {a.source === "external" ? "🌍 External" : `🏢 ${a.dept}`}
                </span>
                {a.kind === "vehicle" && (
                  <span className={`tag ${a.priority === "priority" ? "priority-high" : "priority-normal"}`}>
                    {a.priority === "priority" ? "Xe ưu tiên" : "Xe thường"}
                  </span>
                )}
                {isCurrent && <span className="badge accent"><span className="pip"></span>Chờ bạn duyệt</span>}
              </div>
              <h1 style={{ margin: "0 0 12px", fontSize: 22, fontWeight: 700, letterSpacing: "-0.015em" }}>
                {a.name}{a.org ? ` — ${a.org}` : ""}
              </h1>
              <div className="row" style={{ gap: 24, flexWrap: "wrap", color: "var(--t-secondary)", fontSize: 13 }}>
                {a.idNo && <div>CCCD/CMND: <b style={{ color: "var(--t-primary)", fontWeight: 500 }}>{a.idNo}</b></div>}
                {a.vehicleType && <div>Loại xe: <b style={{ color: "var(--t-primary)", fontWeight: 500 }}>{a.vehicleType}</b></div>}
                {a.driver && <div>Tài xế: <b style={{ color: "var(--t-primary)", fontWeight: 500 }}>{a.driver}</b></div>}
                <div>Tạo lúc: <span className="mono" style={{ fontSize: 12, color: "var(--t-primary)" }}>{a.createdAt}</span></div>
              </div>
            </div>

            <div style={{ borderTop: "1px solid var(--line)", paddingTop: 6 }}>
              <div style={{ padding: "16px 24px 4px" }}>
                <div style={{ fontWeight: 600, fontSize: 13 }}>Xác nhận duyệt</div>
                <div className="muted" style={{ fontSize: 12, marginTop: 2 }}>Cấp {a.currentStep}/{a.chain.length}</div>
              </div>
              <div className="chain">
                {a.chain.map(s => {
                  const p = SEC_OFFICERS.find(o => o.id === s.person) || SEC_ME;
                  return (
                    <div key={s.stepNo} className={`chain-step ${s.state === "approved" ? "done" : s.state === "current" ? "current" : s.state === "rejected" ? "done" : "pending"}`}>
                      <div className="step-num">Cấp {s.stepNo}</div>
                      <div className="row" style={{ marginBottom: 8 }}>
                        <Avatar person={p} size={28} />
                        <div>
                          <div className="step-name">{p.name}</div>
                          <div className="step-role">{s.role}</div>
                        </div>
                      </div>
                      <div className="step-state">
                        {s.state === "approved" && <span className="badge success"><Icon name="check" size={11}/> Đã duyệt · {s.at?.split(" ")[1]}</span>}
                        {s.state === "rejected" && <span className="badge danger"><Icon name="x" size={11}/> Từ chối · {s.at?.split(" ")[1]}</span>}
                        {s.state === "current" && <span className="badge accent"><span className="pip"></span> Đang chờ duyệt</span>}
                      </div>
                      {s.note && (
                        <div style={{ marginTop: 8, fontSize: 11.5, color: "var(--t-secondary)", borderTop: "1px dashed var(--line)", paddingTop: 8, fontStyle: "italic" }}>"{s.note}"</div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {isCurrent && (
            <div className="card" style={{ marginBottom: 20, borderColor: "var(--brand-accent)", boxShadow: "0 0 0 4px var(--brand-accent-bg)" }}>
              <div style={{ padding: "20px 24px" }}>
                <div className="row" style={{ marginBottom: 14 }}>
                  <Icon name="sparkle" size={18} className="ic" style={{ color: "var(--brand-accent)" }}/>
                  <b style={{ fontSize: 14 }}>Quyết định của bạn</b>
                </div>
                <textarea
                  value={comment}
                  onChange={e => setComment(e.target.value)}
                  placeholder="Ý kiến / lý do (bắt buộc nếu từ chối)…"
                  style={{ width: "100%", minHeight: 72, border: "1px solid var(--line)", borderRadius: "var(--r-sm)", padding: "10px 12px", fontFamily: "inherit", fontSize: 13, outline: "none", resize: "vertical", background: "var(--bg-canvas)" }}
                />
                <div className="row" style={{ marginTop: 14, justifyContent: "flex-end", gap: 8 }}>
                  <button className="btn danger" onClick={() => flash("Đã từ chối phiếu")}><Icon name="x" size={14}/> Từ chối</button>
                  <button className="btn accent" onClick={() => flash("Đã phê duyệt")}><Icon name="check" size={14}/> Phê duyệt</button>
                </div>
              </div>
            </div>
          )}

          <div className="card">
            <div className="card-head"><h3>Chi tiết đăng ký</h3></div>
            <div className="card-body">
              <p style={{ margin: "0 0 16px", lineHeight: 1.6 }}>{a.purpose}</p>
              <div className="stat-3-grid" style={{ padding: 14, background: "var(--bg-canvas)", borderRadius: "var(--r-sm)", border: "1px solid var(--line)" }}>
                <div>
                  <div className="muted" style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: 0.04, fontWeight: 600 }}>Hiệu lực từ</div>
                  <div style={{ fontSize: 14, fontWeight: 500, marginTop: 4 }} className="mono">{a.validFrom}</div>
                </div>
                <div>
                  <div className="muted" style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: 0.04, fontWeight: 600 }}>Hiệu lực đến</div>
                  <div style={{ fontSize: 14, fontWeight: 500, marginTop: 4 }} className="mono">{a.validTo}</div>
                </div>
                <div>
                  <div className="muted" style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: 0.04, fontWeight: 600 }}>Hình thức</div>
                  <div style={{ fontSize: 14, fontWeight: 500, marginTop: 4 }}>{a.mode}</div>
                </div>
              </div>
            </div>
          </div>

          {a.files.length > 0 && (
            <div className="card" style={{ marginTop: 20 }}>
              <div className="card-head"><h3>Tài liệu đính kèm <span className="muted" style={{ fontWeight: 500, fontSize: 12, marginLeft: 6 }}>({a.files.length})</span></h3></div>
              <div className="card-body">
                <div className="row wrap" style={{ gap: 10 }}>
                  {a.files.map((f, i) => (
                    <div key={i} className="file-chip">
                      <div className={`ftype ${f.type}`}>{f.type.toUpperCase()}</div>
                      <div><div>{f.name}</div></div>
                      <span className="meta">{f.size}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        <aside style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div className="card">
            <div className="card-head"><h3>Thông tin nhanh</h3></div>
            <div className="card-body" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <InfoRow label="Trạng thái" value={
                a.status === "current" ? <span className="badge accent"><span className="pip"></span>Chờ duyệt</span>
                  : a.status === "approved" ? <span className="badge success"><span className="pip"></span>Đã duyệt</span>
                  : <span className="badge danger"><span className="pip"></span>Từ chối</span>
              }/>
              {a.host && <InfoRow label="Người bảo lãnh" value={<span style={{ fontSize: 13 }}>{personById(a.host).name}</span>} />}
            </div>
          </div>
        </aside>
      </div>

      {toast && (
        <div style={{ position: "fixed", bottom: 28, left: "50%", transform: "translateX(-50%)", background: "var(--brand-ink)", color: "#fff", padding: "10px 18px", borderRadius: 999, fontSize: 13, fontWeight: 500, boxShadow: "0 8px 24px rgba(0,0,0,.22)", display: "flex", alignItems: "center", gap: 8, zIndex: 9999 }}>
          <Icon name="check" size={12}/> {toast}
        </div>
      )}
    </div>
  );
};

window.SecApprovalListScreen = SecApprovalListScreen;
window.SecApprovalDetailScreen = SecApprovalDetailScreen;
