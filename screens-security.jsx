/* An Ninh (Security) module — Tổng quan dashboard */

const SecTrafficChart = ({ data }) => {
  const max = Math.max(...data.map(d => d.people + 0), ...data.map(d => d.vehicles + 0), 1);
  const totalPeople = data.reduce((s, d) => s + d.people, 0);
  const totalVehicles = data.reduce((s, d) => s + d.vehicles, 0);
  return (
    <div className="card">
      <div className="card-head">
        <div>
          <h3>Lưu lượng ra/vào hôm nay</h3>
          <div className="sub">Theo giờ · 06:00 – 18:00</div>
        </div>
        <div style={{ display: "flex", gap: 18, fontSize: 12.5 }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
            <span style={{ width: 8, height: 8, borderRadius: 2, background: "#1E5FB7" }}></span>
            Người: <b>{totalPeople}</b>
          </span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
            <span style={{ width: 8, height: 8, borderRadius: 2, background: "#16A34A" }}></span>
            Xe: <b>{totalVehicles}</b>
          </span>
          <span style={{ color: "var(--t-tertiary)" }}>|</span>
          <span>Tổng: <b>{totalPeople + totalVehicles}</b></span>
        </div>
      </div>
      <div className="card-body">
        <div style={{ display: "flex", alignItems: "flex-end", gap: 10, height: 180, padding: "0 4px" }}>
          {data.map((d, i) => (
            <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
              <div style={{ display: "flex", alignItems: "flex-end", gap: 3, height: 140 }}>
                <div title={`Người: ${d.people}`} style={{
                  width: 10, borderRadius: "3px 3px 0 0", background: "#1E5FB7",
                  height: `${Math.max(4, (d.people / max) * 140)}px`,
                }}></div>
                <div title={`Xe: ${d.vehicles}`} style={{
                  width: 10, borderRadius: "3px 3px 0 0", background: "#16A34A",
                  height: `${Math.max(4, (d.vehicles / max) * 140)}px`,
                }}></div>
              </div>
              <span className="mono" style={{ fontSize: 10.5, color: "var(--t-tertiary)" }}>{d.h}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const SecuritySpark = ({ data, color }) => <Spark data={data} color={color} />;

const SecurityDashboard = ({ go = () => {} }) => {
  const [quickOpen, setQuickOpen] = React.useState(false);

  const alertCards = [
    { count: SEC_PENDING.length, label: "phiếu chờ duyệt", color: "#E85D2F", urgent: true, go: "approval" },
    { count: 2, label: "sự cố mới",       color: "#B91C1C", urgent: true, go: "incidents" },
    { count: 1, label: "camera offline",  color: "#B45309", urgent: true, go: "dashboard" },
    { count: 3, label: "xe quá giờ",      color: "#B45309", urgent: true, go: "incidents" },
  ];

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h1>Chào buổi sáng, Tuấn 👋</h1>
          <div className="sub">Thứ Ba, 08/07/2026 — Tuần 28 · Sprint 7/18</div>
        </div>
        <div className="actions" style={{ position: "relative" }}>
          <button className="btn"><Icon name="download" size={14}/> Xuất báo cáo tuần</button>
          <button className="btn accent" onClick={() => setQuickOpen(v => !v)}>
            <Icon name="plus" size={14} /> Tạo nhanh <Icon name="chevronDown" size={12}/>
          </button>
          {quickOpen && (
            <>
              <div style={{ position: "fixed", inset: 0, zIndex: 9 }} onClick={() => setQuickOpen(false)} />
              <div style={{
                position: "absolute", top: "calc(100% + 6px)", right: 0, zIndex: 10,
                background: "var(--bg-surface)", border: "1px solid var(--line)",
                borderRadius: "var(--r-md)", boxShadow: "var(--sh-3)", minWidth: 200, overflow: "hidden",
              }}>
                {["Đăng ký người", "Đăng ký xe", "Ghi sự cố"].map((label, i) => (
                  <div key={label}
                    onClick={() => setQuickOpen(false)}
                    style={{
                      padding: "10px 16px", fontSize: 13.5, cursor: "pointer",
                      borderBottom: i < 2 ? "1px solid var(--line)" : "none",
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = "var(--bg-canvas)"}
                    onMouseLeave={e => e.currentTarget.style.background = ""}
                  >{label}</div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Row 1 — alert cards */}
      <div className="today-strip" style={{
        marginBottom: 18, padding: 14, background: "var(--bg-surface)",
        border: "1px solid var(--line)", borderRadius: "var(--r-md)",
      }}>
        {alertCards.map((it, i) => (
          <button
            key={i}
            onClick={() => go(it.go)}
            style={{
              display: "flex", alignItems: "center", gap: 14, padding: "6px 4px",
              background: "transparent", border: "none", cursor: "pointer",
              textAlign: "left", borderRight: i < 3 ? "1px solid var(--line)" : "none",
            }}
          >
            <div style={{
              width: 44, height: 44, borderRadius: 10,
              background: it.color, color: "#fff",
              display: "grid", placeItems: "center",
              fontSize: 18, fontWeight: 700, fontVariantNumeric: "tabular-nums",
              flexShrink: 0,
            }}>{it.count}</div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: "var(--t-primary)" }}>{it.label}</div>
              <div className="muted" style={{ fontSize: 11, marginTop: 2, display: "flex", alignItems: "center", gap: 4 }}>
                Xem chi tiết <Icon name="arrowRight" size={10}/>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Row 2 — stat cards */}
      <div className="kpi-grid">
        <div className="kpi">
          <div className="lbl"><span className="swatch" style={{ background: "#1E5FB7" }}></span>Người trong cảng</div>
          <div className="val">{SEC_STATS.peopleIn.value} <small>{SEC_STATS.peopleIn.unit}</small></div>
          <div className="delta up"><Icon name="arrowUp" size={12}/> {SEC_STATS.peopleIn.delta}</div>
          <SecuritySpark data={[120,132,140,148,150,152,149,153,151,156]} color="#1E5FB7" />
        </div>
        <div className="kpi">
          <div className="lbl"><span className="swatch" style={{ background: "#16A34A" }}></span>Xe trong cảng</div>
          <div className="val">{SEC_STATS.vehiclesIn.value} <small>xe</small></div>
          <div className="delta">{SEC_STATS.vehiclesIn.breakdown}</div>
          <SecuritySpark data={[16,18,17,20,19,21,20,22,21,23]} color="#16A34A" />
        </div>
        <div className="kpi">
          <div className="lbl"><span className="swatch" style={{ background: "#E85D2F" }}></span>Ra/vào hôm nay</div>
          <div className="val">{SEC_STATS.today.value} <small>lượt</small></div>
          <div className="delta">{SEC_STATS.today.breakdown}</div>
          <SecuritySpark data={[210,240,260,255,270,290,300,310,325,342]} color="#E85D2F" />
        </div>
        <div className="kpi">
          <div className="lbl"><span className="swatch" style={{ background: "#7C5BE0" }}></span>LPR accuracy</div>
          <div className="val">{SEC_STATS.lpr.value} <small>{SEC_STATS.lpr.unit}</small></div>
          <div className="delta up"><Icon name="arrowUp" size={12}/> {SEC_STATS.lpr.delta}</div>
          <SecuritySpark data={[93.1,93.8,94.2,94.9,95.0,95.4,95.8,95.9,96.0,96.2]} color="#7C5BE0" />
        </div>
      </div>

      {/* Row 3 — pending approvals (60%) + alerts (40%) */}
      <div className="widget-grid widget-grid-wide">
        <div className="card">
          <div className="card-head">
            <div>
              <h3>Chờ duyệt gần nhất</h3>
              <div className="sub">{SEC_PENDING.length} phiếu · sắp xếp theo thời gian</div>
            </div>
            <button className="btn ghost btn-sm" onClick={() => go("approval")}>Xem tất cả <Icon name="chevron" size={12}/></button>
          </div>
          <div>
            {SEC_PENDING.slice(0, 3).map((p, idx) => (
              <button
                key={p.id}
                style={{
                  padding: "16px 20px",
                  borderBottom: idx < 2 ? "1px solid var(--line)" : "none",
                  cursor: "pointer",
                  background: "transparent", border: "none", textAlign: "left", width: "100%", fontFamily: "inherit",
                }}
                onClick={() => go("approval-detail", { id: p.id })}
                onMouseEnter={e => e.currentTarget.style.background = "var(--bg-canvas)"}
                onMouseLeave={e => e.currentTarget.style.background = ""}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8, flexWrap: "wrap" }}>
                  <span className={`tag ${p.source === "external" ? "src-external" : "src-internal"}`}>
                    {p.source === "external" ? "🌍 External" : `🏢 ${p.dept}`}
                  </span>
                  <span style={{ fontSize: 11.5, color: "var(--t-secondary)", whiteSpace: "nowrap" }}>{p.kind}</span>
                  <span style={{ width: 3, height: 3, borderRadius: 999, background: "var(--t-tertiary)", flexShrink: 0 }}></span>
                  <span style={{ fontSize: 11.5, color: "var(--t-secondary)", whiteSpace: "nowrap" }}>{p.sub}</span>
                </div>
                <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4, color: "var(--t-primary)" }}>
                  {p.name}{p.org ? ` — ${p.org}` : ""}
                </div>
                <div className="muted" style={{ fontSize: 12, marginBottom: 10 }}>
                  {p.idNo && <>CCCD: {p.idNo} · </>}
                  {p.driver && <>Tài xế: {p.driver} · </>}
                  {p.mode}{p.date ? ` · ${p.date}` : ""}
                </div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span className="muted" style={{ fontSize: 11.5, display: "inline-flex", alignItems: "center", gap: 5 }}>
                    <Icon name="clock" size={12}/> {p.when}
                  </span>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 12, color: "var(--brand-accent)", fontWeight: 600 }}>
                    Đến lượt bạn <Icon name="arrowRight" size={12} />
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="card-head">
            <div>
              <h3>Cảnh báo</h3>
              <div className="sub">{SEC_ALERTS.length} cảnh báo chưa xử lý</div>
            </div>
            <button className="btn ghost btn-sm" onClick={() => go("incidents")}>Xem tất cả <Icon name="chevron" size={12}/></button>
          </div>
          <div style={{ padding: "4px 0 8px" }}>
            {SEC_ALERTS.map((a, i) => (
              <div key={a.id} style={{
                display: "flex", alignItems: "center", gap: 10,
                padding: "12px 20px",
                borderBottom: i < SEC_ALERTS.length - 1 ? "1px solid var(--line)" : "none",
              }}>
                <span style={{ fontSize: 13 }}>{a.icon}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 500, color: "var(--t-primary)" }}>{a.text}</div>
                </div>
                <span className={`badge ${a.level === "danger" ? "danger" : "warning"}`} style={{ flexShrink: 0 }}>
                  {a.meta}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 4 — traffic chart */}
      <div style={{ marginTop: 20 }}>
        <SecTrafficChart data={SEC_TRAFFIC} />
      </div>
    </div>
  );
};

/* Security module rail — same visual system as the E-Office Rail, own nav set */
const SecurityRail = ({ active = "dashboard", onNav, mobileOpen = false }) => {
  const items = [
    { id: "dashboard",     label: "Tổng quan",       icon: "home",     count: null },
    { id: "approval",      label: "Phê duyệt",       icon: "approval", count: SEC_APPROVALS.filter(a => a.status === "current").length, urgent: true },
    { id: "person-list",   label: "Đăng ký người",   icon: "users",    count: PERSON_REGS.filter(r => r.status === "pending").length || null },
    { id: "vehicle-list",  label: "Đăng ký xe",      icon: "crane",    count: VEHICLE_REGS.filter(r => r.status === "pending").length || null },
    { id: "training",      label: "Đào tạo an ninh", icon: "document", count: null },
    { id: "lookup",        label: "Tra cứu lịch sử", icon: "search",   count: null },
    { id: "people",        label: "Xe trong cảng",   icon: "anchor",   count: null },
    { id: "incidents",     label: "Sự cố",           icon: "alert",    count: SEC_INCIDENTS.filter(i => i.status !== "resolved").length, urgent: true },
    { id: "reports",       label: "Báo cáo",         icon: "activity", count: null },
  ];
  const manage = [
    { id: "blacklist", label: "Blacklist xe", icon: "flag" },
    { id: "cameras",   label: "Camera LPR",   icon: "activity" },
    { id: "audit",     label: "Audit Trail",  icon: "clock" },
  ];
  const tools = [
    { id: "settings",  label: "Cài đặt",  icon: "settings" },
    { id: "help",      label: "Trợ giúp", icon: "help" },
  ];
  return (
    <aside className="rail" data-mobile-open={mobileOpen ? "1" : "0"}>
      <div className="rail-brand">
        <div className="mark">V</div>
        <div className="wordmark">
          <b>Vinalogistics</b>
          <span>TTOS · An Ninh</span>
        </div>
      </div>

      <div className="rail-module" title="Đổi module">
        <div>
          <div className="mod-name">An Ninh</div>
          <div className="mod-sub">Phase 1 · v0.1</div>
        </div>
        <Icon name="chevronDown" size={16} />
      </div>

      <div className="rail-section-label">Làm việc</div>
      <nav className="rail-nav">
        {items.map(it => (
          <div key={it.id} className={`rail-item ${active === it.id ? "active" : ""} ${it.urgent && it.count > 0 ? "urgent" : ""}`} title={it.label} onClick={() => onNav?.(it.id)}>
            <Icon name={it.icon} size={18} />
            <span>{it.label}</span>
            {it.count != null && <span className="count">{it.count}</span>}
          </div>
        ))}
      </nav>

      <div className="rail-section-label">Quản lý</div>
      <nav className="rail-nav" style={{ flex: "none" }}>
        {manage.map(it => (
          <div key={it.id} className={`rail-item ${active === it.id ? "active" : ""}`} title={it.label} onClick={() => onNav?.(it.id)}>
            <Icon name={it.icon} size={18} />
            <span>{it.label}</span>
          </div>
        ))}
      </nav>

      <div style={{ flex: 1 }} />
      <div className="rail-section-label">Khác</div>
      <nav className="rail-nav" style={{ flex: "none" }}>
        {tools.map(it => (
          <div key={it.id} className={`rail-item ${active === it.id ? "active" : ""}`} title={it.label} onClick={() => onNav?.(it.id)}>
            <Icon name={it.icon} size={18} />
            <span>{it.label}</span>
          </div>
        ))}
      </nav>

      <div className="rail-foot">
        <Avatar person={ME} size={32} />
        <div className="who">
          <b>{ME.name}</b>
          <span>{ME.role}</span>
        </div>
        <Icon name="chevronDown" size={14} className="muted" />
      </div>
    </aside>
  );
};

/* Security module shell — Rail + Topbar + router across sub-screens */
const SecurityModule = ({ onBack }) => {
  const [route, setRoute] = React.useState({ screen: "dashboard", ctx: {} });
  const [navOpen, setNavOpen] = React.useState(false);
  const go = (screen, ctx = {}) => { setRoute({ screen, ctx }); setNavOpen(false); };

  const activeRail = route.screen.replace(/-detail$|-create$/, "").replace("incident", "incidents").replace("person", "person-list").replace("vehicle", "vehicle-list");

  const crumbLabels = {
    dashboard: "Tổng quan",
    approval: "Phê duyệt",
    "approval-detail": "Phê duyệt",
    "approval-create": "Phê duyệt",
    "person-list": "Đăng ký người",
    "person-detail": "Đăng ký người",
    "person-create": "Đăng ký người",
    "vehicle-list": "Đăng ký xe",
    "vehicle-create": "Đăng ký xe",
    training: "Đào tạo an ninh",
    lookup: "Tra cứu lịch sử",
    people: "Xe trong cảng",
    incidents: "Sự cố",
    "incident-detail": "Sự cố",
    reports: "Báo cáo",
    blacklist: "Blacklist xe",
    cameras: "Camera LPR",
    audit: "Audit Trail",
    settings: "Cài đặt",
    help: "Trợ giúp",
  };
  const crumbs = ["Vinalogistics", "An Ninh", crumbLabels[route.screen] || "Tổng quan"];
  if (route.screen === "approval-detail") crumbs.push(route.ctx.id);
  if (route.screen === "approval-create") crumbs.push("Đăng ký người/xe");
  if (route.screen === "person-detail") crumbs.push(route.ctx.id);
  if (route.screen === "person-create") crumbs.push("Tạo mới");
  if (route.screen === "vehicle-create") crumbs.push("Tạo mới");
  if (route.screen === "incident-detail") crumbs.push(route.ctx.id);

  return (
    <div className="shell" data-rail="expanded">
      <SecurityRail active={activeRail} onNav={(id) => go(id)} mobileOpen={navOpen} />
      {navOpen && <div className="rail-backdrop" onClick={() => setNavOpen(false)} />}
      <main style={{ minWidth: 0 }}>
        <Topbar crumbs={crumbs} onToggleNav={() => setNavOpen(o => !o)} />
        {route.screen === "dashboard"        && <SecurityDashboard go={go} />}
        {route.screen === "approval"         && <SecApprovalListScreen go={go} />}
        {route.screen === "approval-detail"  && <SecApprovalDetailScreen go={go} ctx={route.ctx} />}
        {route.screen === "approval-create"  && <SecCreateScreen go={go} />}
        {route.screen === "person-list"      && <PersonRegListScreen go={go} />}
        {route.screen === "person-detail"    && <PersonRegDetailScreen go={go} ctx={route.ctx} />}
        {route.screen === "person-create"    && <PersonRegCreateScreen go={go} />}
        {route.screen === "vehicle-list"      && <VehicleRegListScreen go={go} />}
        {route.screen === "vehicle-create"    && <VehicleRegCreateScreen go={go} />}
        {route.screen === "training"         && <SecComingSoon title="Đào tạo an ninh" note="Lên lịch đào tạo, QR điểm danh và cấp chứng nhận cho khách/nhà thầu — sẽ có ở đợt tiếp theo." />}
        {route.screen === "lookup"           && <SecComingSoon title="Tra cứu lịch sử" note="Tra cứu nhanh theo CCCD hoặc biển số để xem toàn bộ lịch sử ra/vào — sẽ có ở đợt tiếp theo." />}
        {route.screen === "people"           && <SecPresenceScreen />}
        {route.screen === "incidents"        && <SecIncidentsListScreen go={go} />}
        {route.screen === "incident-detail"  && <SecIncidentDetailScreen go={go} ctx={route.ctx} />}
        {route.screen === "reports"          && <SecReportsScreen />}
        {route.screen === "blacklist"        && <SecComingSoon title="Blacklist xe" note="Danh sách xe bị cấm vào cảng, tự động từ chối tại cổng — sẽ có ở đợt tiếp theo." />}
        {route.screen === "cameras"          && <SecComingSoon title="Camera LPR" note="Trạng thái từng camera nhận diện biển số, uptime và cấu hình — sẽ có ở đợt tiếp theo." />}
        {route.screen === "audit"            && <SecComingSoon title="Audit Trail" note="Nhật ký toàn bộ thao tác tạo/sửa/duyệt/thu hồi trong module An Ninh — sẽ có ở đợt tiếp theo." />}
        {route.screen === "settings"         && <SecComingSoon title="Cài đặt" note="Cấu hình thời gian lưu cảng tối đa, ngưỡng LPR và chính sách lưu trữ — sẽ có ở đợt tiếp theo." />}
        {route.screen === "help"             && <SecComingSoon title="Trợ giúp" note="Tài liệu hướng dẫn sử dụng module An Ninh — sẽ có ở đợt tiếp theo." />}
      </main>
    </div>
  );
};

window.SecurityDashboard = SecurityDashboard;
window.SecurityModule = SecurityModule;
