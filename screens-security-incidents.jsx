/* An Ninh — Sự cố: danh sách + chi tiết */

const SecIncidentsListScreen = ({ go }) => {
  const [tab, setTab] = React.useState("open");
  const counts = {
    open: SEC_INCIDENTS.filter(i => i.status === "open" || i.status === "investigating").length,
    resolved: SEC_INCIDENTS.filter(i => i.status === "resolved").length,
    all: SEC_INCIDENTS.length,
  };
  const visible = SEC_INCIDENTS.filter(i => {
    if (tab === "open") return i.status === "open" || i.status === "investigating";
    if (tab === "resolved") return i.status === "resolved";
    return true;
  });

  return (
    <div className="page" style={{ paddingTop: 28 }}>
      <div className="page-head">
        <div>
          <h1>Sự cố</h1>
          <div className="sub">Ghi nhận & xử lý sự cố an ninh, thiết bị, vi phạm</div>
        </div>
        <div className="actions">
          <button className="btn accent"><Icon name="plus" size={14}/> Ghi sự cố mới</button>
        </div>
      </div>

      <div className="card">
        <div className="tabs">
          {[
            { id: "open", label: "Đang xử lý", count: counts.open, urgent: true },
            { id: "resolved", label: "Đã đóng", count: counts.resolved },
            { id: "all", label: "Tất cả", count: counts.all },
          ].map(t => (
            <div key={t.id} className={`tab ${tab === t.id ? "active" : ""}`} onClick={() => setTab(t.id)} style={t.urgent ? { fontWeight: 600 } : {}}>
              {t.urgent && <span style={{ display: "inline-block", width: 6, height: 6, borderRadius: 999, background: "var(--brand-accent)", marginRight: 6, verticalAlign: "middle" }}></span>}
              {t.label}<span className="count">{t.count}</span>
            </div>
          ))}
        </div>

        <div>
          {visible.map((it, idx) => (
            <div key={it.id}
              onClick={() => go("incident-detail", { id: it.id })}
              style={{ display: "grid", gridTemplateColumns: "4px 1fr auto", gap: 16, padding: "16px 20px", borderBottom: idx < visible.length - 1 ? "1px solid var(--line)" : "none", cursor: "pointer" }}
              onMouseEnter={e => e.currentTarget.style.background = "var(--bg-canvas)"}
              onMouseLeave={e => e.currentTarget.style.background = ""}
            >
              <div style={{ background: it.level === "danger" ? "var(--st-danger)" : "var(--st-warning)", borderRadius: 3 }}></div>
              <div style={{ minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6, flexWrap: "wrap" }}>
                  <span className="mono" style={{ fontSize: 11.5, color: "var(--t-tertiary)" }}>{it.id}</span>
                  <span style={{ width: 3, height: 3, borderRadius: 999, background: "var(--t-tertiary)" }}></span>
                  <span style={{ fontSize: 11.5, color: "var(--t-secondary)" }}>{it.category}</span>
                  <span style={{ width: 3, height: 3, borderRadius: 999, background: "var(--t-tertiary)" }}></span>
                  <span style={{ fontSize: 11.5, color: "var(--t-secondary)" }}>{it.location}</span>
                </div>
                <div style={{ fontSize: 14, fontWeight: 600, color: "var(--t-primary)" }}>{it.title}</div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8 }}>
                {it.status === "open" && <span className="badge danger"><span className="pip"></span>Mới</span>}
                {it.status === "investigating" && <span className="badge warning"><span className="pip"></span>Đang xử lý</span>}
                {it.status === "resolved" && <span className="badge success"><span className="pip"></span>Đã đóng</span>}
                <span className="muted" style={{ fontSize: 11.5 }}>{it.reportedAt}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const SecIncidentDetailScreen = ({ go, ctx }) => {
  const id = ctx?.id || SEC_INCIDENTS[0].id;
  const it = SEC_INCIDENTS.find(x => x.id === id) || SEC_INCIDENTS[0];
  const reporter = SEC_OFFICERS.find(o => o.id === it.reportedBy) || SEC_ME;

  return (
    <div className="page" style={{ paddingTop: 24, maxWidth: 1000 }}>
      <div style={{ marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
        <button className="btn ghost btn-sm" onClick={() => go("incidents")}>← Quay lại danh sách</button>
        <div className="muted" style={{ fontSize: 12, marginLeft: 6 }}>Sự cố / <span className="mono">{it.id}</span></div>
      </div>

      <div className="card" style={{ marginBottom: 20 }}>
        <div style={{ padding: "24px 24px 18px" }}>
          <div className="row" style={{ marginBottom: 10, gap: 8, flexWrap: "wrap" }}>
            <span className="tag">{it.id}</span>
            <span className="badge neutral">{it.category}</span>
            {it.status === "open" && <span className="badge danger"><span className="pip"></span>Mới</span>}
            {it.status === "investigating" && <span className="badge warning"><span className="pip"></span>Đang xử lý</span>}
            {it.status === "resolved" && <span className="badge success"><span className="pip"></span>Đã đóng</span>}
          </div>
          <h1 style={{ margin: "0 0 12px", fontSize: 22, fontWeight: 700, letterSpacing: "-0.015em" }}>{it.title}</h1>
          <div className="row" style={{ gap: 24, flexWrap: "wrap", color: "var(--t-secondary)", fontSize: 13 }}>
            <div>Vị trí: <b style={{ color: "var(--t-primary)", fontWeight: 500 }}>{it.location}</b></div>
            <div className="row" style={{ gap: 6 }}>Báo cáo bởi: <Avatar person={reporter} size={20}/> <b style={{ color: "var(--t-primary)", fontWeight: 500 }}>{reporter.name}</b></div>
            <div>Thời gian: <span className="mono" style={{ fontSize: 12, color: "var(--t-primary)" }}>{it.reportedAt}</span></div>
          </div>
        </div>
      </div>

      <div className="card" style={{ marginBottom: 20 }}>
        <div className="card-head"><h3>Mô tả</h3></div>
        <div className="card-body"><p style={{ margin: 0, lineHeight: 1.6 }}>{it.description}</p></div>
      </div>

      <div className="card">
        <div className="card-head"><h3>Nhật ký xử lý</h3></div>
        <div className="tl">
          {it.log.slice().reverse().map((l, i) => {
            const p = SEC_OFFICERS.find(o => o.id === l.by) || SEC_ME;
            return (
              <div key={i} className="tl-item note">
                <div className="tl-icon"><Icon name="edit" size={12}/></div>
                <div className="tl-body">
                  <span className="who">{p.name}</span>
                  <div className="when">{l.at}</div>
                  <div className="quote">"{l.text}"</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

window.SecIncidentsListScreen = SecIncidentsListScreen;
window.SecIncidentDetailScreen = SecIncidentDetailScreen;
