/* Shell: Sidebar (rail) + Topbar + Drawer */

const Avatar = ({ person, size = 26, className = "" }) => {
  if (!person) return null;
  const style = { width: size, height: size, fontSize: Math.max(9, size * 0.4) };
  return (
    <span className={`av c${person.color} ${className}`} style={style} title={person.name}>
      {person.short}
    </span>
  );
};

const Rail = ({ active, onNav, mode = "expanded", module = "eoffice", mobileOpen = false }) => {
  const mini = mode === "mini";
  // Counts derived from data so they stay in sync with ME
  const inboxCount = APPROVALS.filter(a => a.status === "current" && a.chain.find(s => s.state === "current")?.person === ME.id).length;
  const myTaskCount = TASKS.filter(t => (t.executor === ME.id || t.manager === ME.id) && (t.status === "doing" || t.status === "late")).length;
  const unreadNotif = NOTIFICATIONS.filter(n => n.unread).length;
  const items = [
    { id: "dashboard",     label: "Tổng quan",  icon: "home",     count: null },
    { id: "approval",      label: "Phê duyệt",  icon: "approval", count: inboxCount, urgent: inboxCount > 0, sectionTop: true },
    { id: "documents",     label: "Văn bản",    icon: "document", count: null },
    { id: "tasks",         label: "Công việc",  icon: "task",     count: myTaskCount },
    { id: "schedule",      label: "Lịch",       icon: "schedule", count: null },
    { id: "notifications", label: "Thông báo",  icon: "bell",     count: unreadNotif },
  ];
  const tools = [
    { id: "directory", label: "Danh bạ",          icon: "users" },
    { id: "settings",  label: "Cài đặt",          icon: "settings" },
    { id: "help",      label: "Trợ giúp",         icon: "help" },
  ];
  return (
    <aside className="rail" data-mini={mini ? "1" : "0"} data-mobile-open={mobileOpen ? "1" : "0"}>
      <div className="rail-brand">
        <div className="mark">V</div>
        {!mini && (
          <div className="wordmark">
            <b>Vinalogistics</b>
            <span>TTOS · E-Office</span>
          </div>
        )}
      </div>

      <div className="rail-module" title="Đổi module">
        {!mini && (
          <div>
            <div className="mod-name">E-Office</div>
            <div className="mod-sub">Phase 1 · v0.4</div>
          </div>
        )}
        {mini && <Icon name="layers" size={18} />}
        {!mini && <Icon name="chevronDown" size={16} />}
      </div>

      {!mini && <div className="rail-section-label">Làm việc</div>}
      <nav className="rail-nav">
        {items.map(it => (
          <div
            key={it.id}
            className={`rail-item ${active === it.id ? "active" : ""} ${it.urgent ? "urgent" : ""}`}
            onClick={() => onNav(it.id)}
            title={it.label}
          >
            <Icon name={it.icon} size={18} />
            <span>{it.label}</span>
            {it.count != null && <span className="count">{it.count}</span>}
          </div>
        ))}
      </nav>

      <div style={{ flex: 1 }} />
      {!mini && <div className="rail-section-label">Khác</div>}
      <nav className="rail-nav" style={{ flex: "none" }}>
        {tools.map(it => (
          <div key={it.id} className="rail-item" title={it.label}>
            <Icon name={it.icon} size={18} />
            <span>{it.label}</span>
          </div>
        ))}
      </nav>

      <div className="rail-foot">
        <Avatar person={ME} size={32} />
        {!mini && (
          <div className="who">
            <b>{ME.name}</b>
            <span>{ME.role}</span>
          </div>
        )}
        {!mini && <Icon name="chevronDown" size={14} className="muted" />}
      </div>
    </aside>
  );
};

const Topbar = ({ crumbs = [], onOpenNotif, onOpenCreate, onToggleNav }) => {
  return (
    <header className="topbar">
      <button className="mobile-menu-btn" onClick={onToggleNav} title="Menu" aria-label="Mở menu">
        <Icon name="panelLeft" size={18} />
      </button>
      <div className="crumb">
        {crumbs.map((c, i) => (
          <React.Fragment key={i}>
            {i > 0 && <span className="sep">/</span>}
            <span className={i === crumbs.length - 1 ? "b" : ""}>
              {i === crumbs.length - 1 ? <b>{c}</b> : c}
            </span>
          </React.Fragment>
        ))}
      </div>

      <div className="search" onClick={() => window.__openCmdPalette?.()} style={{ cursor: "pointer" }}>
        <Icon name="search" size={16} />
        <input placeholder="Tìm phiếu, văn bản, task, người… (gõ ID hoặc từ khoá)" readOnly style={{ cursor: "pointer" }} />
        <kbd>⌘K</kbd>
      </div>

      <div className="top-actions">
        <button className="btn ghost btn-sm topbar-quick-btn">
          <Icon name="plus" size={14} />
          Tạo nhanh
        </button>
        <button className="icon-btn" title="Thông báo" onClick={onOpenNotif}>
          <Icon name="bell" size={18} />
          <span className="dot"></span>
        </button>
        <button className="icon-btn" title="Cài đặt">
          <Icon name="settings" size={18} />
        </button>
        <div style={{ width: 1, height: 24, background: "var(--line)" }} />
        <Avatar person={ME} size={30} />
      </div>
    </header>
  );
};

/* Notification drawer */
const NotifDrawer = ({ open, onClose, onNavigate }) => {
  const [tab, setTab] = React.useState("all");
  const [items, setItems] = React.useState(NOTIFICATIONS);
  const [toast, setToast] = React.useState(null);
  const flash = (msg) => {
    setToast(msg);
    clearTimeout(window.__notifToastT);
    window.__notifToastT = setTimeout(() => setToast(null), 1800);
  };
  const filtered = items.filter(n =>
    tab === "all" ? true :
    tab === "unread" ? n.unread :
    tab === "approval" ? n.type === "approval" :
    tab === "task" ? n.type === "task" : true
  );
  const markRead = (id) => setItems(arr => arr.map(n => n.id === id ? { ...n, unread: false } : n));
  const markAllRead = () => setItems(arr => arr.map(n => ({ ...n, unread: false })));
  const openItem = (n) => {
    markRead(n.id);
    if (n.link) {
      onNavigate?.(n.link.screen, n.link.ctx);
      onClose();
    }
  };
  const quickApprove = (n, decision) => {
    markRead(n.id);
    flash(decision === "approve" ? "Đã phê duyệt phiếu" : "Đã từ chối phiếu");
    // Soften the unread state & remove the actionable flag
    setItems(arr => arr.map(x => x.id === n.id ? { ...x, actionable: false, _resolved: decision } : x));
  };
  return (
    <>
      <div className={`drawer-overlay ${open ? "open" : ""}`} onClick={onClose} />
      <div className={`drawer ${open ? "open" : ""}`}>
        <div className="drawer-head">
          <div>
            <h3>Thông báo</h3>
            <div className="muted" style={{ fontSize: 12, marginTop: 2 }}>
              {items.filter(n => n.unread).length} chưa đọc
            </div>
          </div>
          <div className="row" style={{ gap: 6 }}>
            <button className="btn ghost btn-sm" onClick={markAllRead}>Đánh dấu tất cả đã đọc</button>
            <button className="icon-btn" onClick={onClose}><Icon name="x" size={16} /></button>
          </div>
        </div>
        <div className="tabs">
          {[
            { id: "all", label: "Tất cả", count: items.length },
            { id: "unread", label: "Chưa đọc", count: items.filter(n => n.unread).length },
            { id: "approval", label: "Phê duyệt", count: items.filter(n => n.type === "approval").length },
            { id: "task", label: "Task", count: items.filter(n => n.type === "task").length },
          ].map(t => (
            <div key={t.id} className={`tab ${tab === t.id ? "active" : ""}`} onClick={() => setTab(t.id)}>
              {t.label} <span className="count">{t.count}</span>
            </div>
          ))}
        </div>
        <div className="drawer-body">
          {filtered.map(n => {
            const actor = personById(n.actor);
            const renderText = txt => {
              const parts = txt.split(/(\*\*[^*]+\*\*)/g);
              return parts.map((p, i) =>
                p.startsWith("**")
                  ? <b key={i}>{p.replace(/\*\*/g, "")}</b>
                  : <React.Fragment key={i}>{p}</React.Fragment>
              );
            };
            const isApprovalAction = n.type === "approval" && n.actionable;
            return (
              <div
                key={n.id}
                className={`notif-item ${n.unread ? "unread" : ""}`}
                style={{ position: "relative", cursor: n.link ? "pointer" : "default" }}
                onClick={(e) => {
                  if (e.target.closest("button")) return;
                  openItem(n);
                }}
              >
                <Avatar person={actor} size={32} />
                <div className="body">
                  <div className="title"><b>{actor.name}</b> {renderText(" " + n.text)}</div>
                  <div className="sub">
                    {n.type === "approval" && "Phê duyệt"}
                    {n.type === "task" && "Công việc"}
                    {n.type === "schedule" && "Lịch"}
                    {n.type === "doc" && "Văn bản"}
                    {n._resolved === "approve" && <span style={{ marginLeft: 8, color: "var(--st-success)", fontWeight: 600 }}>· đã duyệt</span>}
                    {n._resolved === "reject" && <span style={{ marginLeft: 8, color: "var(--st-danger)", fontWeight: 600 }}>· đã từ chối</span>}
                  </div>
                  {isApprovalAction && (
                    <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
                      <button
                        className="btn btn-sm primary"
                        style={{ height: 26, fontSize: 11.5, padding: "0 10px" }}
                        onClick={(e) => { e.stopPropagation(); quickApprove(n, "approve"); }}
                      >
                        <Icon name="check" size={11}/> Duyệt nhanh
                      </button>
                      <button
                        className="btn btn-sm ghost"
                        style={{ height: 26, fontSize: 11.5, padding: "0 10px" }}
                        onClick={(e) => { e.stopPropagation(); quickApprove(n, "reject"); }}
                      >
                        <Icon name="x" size={11}/> Từ chối
                      </button>
                      <button
                        className="btn btn-sm ghost"
                        style={{ height: 26, fontSize: 11.5, padding: "0 10px", marginLeft: "auto" }}
                        onClick={(e) => { e.stopPropagation(); openItem(n); }}
                      >
                        Mở phiếu <Icon name="arrowRight" size={10}/>
                      </button>
                    </div>
                  )}
                </div>
                <div className="when">{n.when}</div>
              </div>
            );
          })}
          {filtered.length === 0 && (
            <div style={{ padding: "40px 20px", textAlign: "center", color: "var(--t-secondary)" }}>
              <Icon name="check" size={24}/>
              <div style={{ marginTop: 8, fontSize: 13 }}>Không có thông báo</div>
            </div>
          )}
        </div>
        {toast && (
          <div style={{
            position: "absolute", bottom: 18, left: "50%", transform: "translateX(-50%)",
            background: "var(--brand-ink)", color: "#fff", padding: "8px 14px",
            borderRadius: 999, fontSize: 12, fontWeight: 500, boxShadow: "0 6px 20px rgba(0,0,0,.2)",
            display: "flex", alignItems: "center", gap: 6,
          }}>
            <Icon name="check" size={11}/> {toast}
          </div>
        )}
      </div>
    </>
  );
};

/* === TopNav — horizontal nav variation === */
const TopNav = ({ active, onNav, onOpenNotif }) => {
  const inboxCount = APPROVALS.filter(a => a.status === "current" && a.chain.find(s => s.state === "current")?.person === ME.id).length;
  const myTaskCount = TASKS.filter(t => (t.executor === ME.id || t.manager === ME.id) && (t.status === "doing" || t.status === "late")).length;
  const unreadNotif = NOTIFICATIONS.filter(n => n.unread).length;
  const items = [
    { id: "dashboard",     label: "Tổng quan",  icon: "home" },
    { id: "approval",      label: "Phê duyệt",  icon: "approval", count: inboxCount, urgent: inboxCount > 0 },
    { id: "documents",     label: "Văn bản",    icon: "document" },
    { id: "tasks",         label: "Công việc",  icon: "task", count: myTaskCount },
    { id: "schedule",      label: "Lịch",       icon: "schedule" },
    { id: "notifications", label: "Thông báo",  icon: "bell", count: unreadNotif },
  ];
  return (
    <header className="top-nav">
      <div className="brand">
        <div className="mark">V</div>
        <div>
          <b>Vinalogistics</b>
          <span>· E-Office</span>
        </div>
      </div>

      <nav>
        {items.map(it => (
          <div
            key={it.id}
            className={`nav-item ${active === it.id ? "active" : ""} ${it.urgent ? "urgent" : ""}`}
            onClick={() => onNav(it.id)}
          >
            <Icon name={it.icon} size={15} />
            <span>{it.label}</span>
            {it.count != null && <span className="count">{it.count}</span>}
          </div>
        ))}
      </nav>

      <div className="right">
        <div className="search" style={{ flex: "0 0 280px", margin: 0 }}>
          <Icon name="search" size={14} />
          <input placeholder="Tìm phiếu, văn bản, task…" style={{ height: 34, background: "rgba(255,255,255,0.08)", color: "#fff", borderColor: "rgba(255,255,255,0.12)" }} />
        </div>
        <div className="ic-btn-light" onClick={onOpenNotif}>
          <Icon name="bell" size={16} />
          <span className="dot"></span>
        </div>
        <div className="ic-btn-light">
          <Icon name="settings" size={16} />
        </div>
        <div className="me">
          <Avatar person={ME} size={28} />
          <div>
            <b>{ME.name.split(" ").slice(-2).join(" ")}</b>
            <span>{ME.role}</span>
          </div>
        </div>
      </div>
    </header>
  );
};

/* === Sub-rail (module navigation) for dual layout === */
const SubRail = ({ active, onNav }) => {
  const inboxCount = APPROVALS.filter(a => a.status === "current" && a.chain.find(s => s.state === "current")?.person === ME.id).length;
  const myTaskCount = TASKS.filter(t => (t.executor === ME.id || t.manager === ME.id) && (t.status === "doing" || t.status === "late")).length;
  const unreadNotif = NOTIFICATIONS.filter(n => n.unread).length;
  const items = [
    { id: "dashboard",     label: "Tổng quan",  icon: "home",     count: null },
    { id: "approval",      label: "Phê duyệt",  icon: "approval", count: inboxCount },
    { id: "documents",     label: "Văn bản",    icon: "document", count: null },
    { id: "tasks",         label: "Công việc",  icon: "task",     count: myTaskCount },
    { id: "schedule",      label: "Lịch",       icon: "schedule", count: null },
    { id: "notifications", label: "Thông báo",  icon: "bell",     count: unreadNotif },
  ];
  return (
    <aside className="sub-rail">
      <div className="sub-head">
        <div>
          <h4>E-Office</h4>
          <div className="muted" style={{ fontSize: 11, marginTop: 2 }}>Phase 1 · v0.4</div>
        </div>
        <button className="icon-btn" style={{ width: 26, height: 26 }}>
          <Icon name="chevronDown" size={14}/>
        </button>
      </div>
      <div className="sub-section">Làm việc</div>
      {items.map(it => (
        <div
          key={it.id}
          className={`sub-item ${active === it.id ? "active" : ""}`}
          onClick={() => onNav(it.id)}
        >
          <Icon name={it.icon} size={16} />
          <span>{it.label}</span>
          {it.count != null && <span className="count">{it.count}</span>}
        </div>
      ))}
      <div className="sub-section">Phòng ban</div>
      {[
        { label: "Khai thác", count: 12 },
        { label: "Hàng hải", count: 8 },
        { label: "Kinh doanh", count: 5 },
        { label: "KTVT", count: 3 },
        { label: "QHSE", count: 2 },
      ].map(d => (
        <div key={d.label} className="sub-item" style={{ fontSize: 12.5, color: "var(--t-secondary)" }}>
          <span style={{ width: 6, height: 6, borderRadius: 2, background: "var(--line-strong)" }}></span>
          <span>{d.label}</span>
          <span className="count">{d.count}</span>
        </div>
      ))}
      <div style={{ flex: 1 }}></div>
      <div className="sub-item" style={{ marginTop: 12 }}>
        <Icon name="help" size={16}/> <span>Trợ giúp</span>
      </div>
    </aside>
  );
};

Object.assign(window, { Rail, Topbar, NotifDrawer, Avatar, TopNav, SubRail, TTOSShell });

/* ============================================================
 * TTOS Shell — outer module navigator.
 * E-Office is one of N modules in the TTOS suite.
 * Renders an icon rail on the far left + an optional "module
 * launcher" overlay when the user clicks the apps button.
 * ============================================================ */
const TTOSShell = ({ children }) => {
  const [moduleId, setModuleId] = React.useState("eoffice");
  const [launcherOpen, setLauncherOpen] = React.useState(false);
  const current = MODULES.find(m => m.id === moduleId) || MODULES[0];

  return (
    <div className="ttos-root" data-module={moduleId}>
      {/* Far-left TTOS module rail */}
      <aside className="ttos-rail">
        <div className="ttos-brand" title="TTOS — Trans-Trade Operating System">
          <div className="t-mark">T</div>
        </div>

        <button
          className="ttos-launcher-btn"
          onClick={() => setLauncherOpen(true)}
          title="Tất cả ứng dụng (⌘.) "
        >
          <Icon name="grid" size={16}/>
        </button>

        <div className="ttos-modules">
          {MODULES.map(m => (
            <button
              key={m.id}
              className={`ttos-mod ${moduleId === m.id ? "active" : ""} ${!m.active ? "disabled" : ""}`}
              onClick={() => { if (m.active) setModuleId(m.id); else setLauncherOpen(true); }}
              title={`${m.label}${m.active ? "" : " — " + m.status}`}
              style={{ "--mod-color": m.color }}
            >
              <Icon name={m.icon} size={16}/>
              {!m.active && <span className="lock-pip"></span>}
              {moduleId === m.id && <span className="active-bar" style={{ background: m.color }}></span>}
            </button>
          ))}
        </div>

        <div style={{ flex: 1 }}></div>

        <button className="ttos-mod" title="Trợ giúp"><Icon name="help" size={16}/></button>
        <button className="ttos-mod" title="Tài khoản">
          <Avatar person={ME} size={22} />
        </button>
      </aside>

      {/* Body — renders current module */}
      <div className="ttos-body">
        {moduleId === "eoffice" ? children :
         moduleId === "occ"     ? <OCCModule onBack={() => setModuleId("eoffice")} /> :
         moduleId === "anninh"  ? <SecurityModule onBack={() => setModuleId("eoffice")} /> : (
          <ModuleComingSoon module={current} onBack={() => setModuleId("eoffice")} onOpenLauncher={() => setLauncherOpen(true)} />
        )}
      </div>

      {/* App launcher overlay */}
      {launcherOpen && (
        <div className="ttos-launcher-overlay" onClick={() => setLauncherOpen(false)}>
          <div className="ttos-launcher" onClick={e => e.stopPropagation()}>
            <div className="ttos-launcher-head">
              <div>
                <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, letterSpacing: "-0.02em" }}>TTOS Suite</h2>
                <div className="muted" style={{ fontSize: 12, marginTop: 4 }}>Trans-Trade Operating System · Vinalogistics · 7 mô-đun</div>
              </div>
              <button className="icon-btn" onClick={() => setLauncherOpen(false)}><Icon name="x" size={18}/></button>
            </div>

            <div className="ttos-app-grid">
              {MODULES.map(m => (
                <button
                  key={m.id}
                  className={`ttos-app ${moduleId === m.id ? "current" : ""} ${!m.active ? "soon" : ""}`}
                  onClick={() => { if (m.active) { setModuleId(m.id); setLauncherOpen(false); } }}
                  style={{ "--mod-color": m.color }}
                >
                  <div className="ttos-app-icon" style={{ background: m.color }}>
                    <Icon name={m.icon} size={22}/>
                  </div>
                  <div className="ttos-app-body">
                    <div className="ttos-app-name">
                      {m.label}
                      {moduleId === m.id && <span className="ttos-app-badge live">Đang dùng</span>}
                      {!m.active && <span className="ttos-app-badge soon">{m.status}</span>}
                    </div>
                    <div className="ttos-app-desc">{m.desc}</div>
                  </div>
                </button>
              ))}
            </div>

            <div className="ttos-launcher-foot">
              <span><kbd>⌘.</kbd> để mở/đóng panel này</span>
              <span style={{ marginLeft: "auto" }}>v1.0 · Phase 1 đã ra mắt</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const ModuleComingSoon = ({ module, onBack, onOpenLauncher }) => (
  <div style={{ display: "grid", placeItems: "center", minHeight: "100vh", background: "var(--bg-canvas)", padding: 40 }}>
    <div style={{ maxWidth: 480, textAlign: "center" }}>
      <div style={{ width: 72, height: 72, borderRadius: 18, background: module.color, color: "#fff", display: "grid", placeItems: "center", margin: "0 auto 20px", boxShadow: `0 12px 32px ${module.color}40` }}>
        <Icon name={module.icon} size={32}/>
      </div>
      <h1 style={{ fontSize: 28, fontWeight: 700, letterSpacing: "-0.02em", margin: "0 0 8px" }}>{module.label}</h1>
      <div className="muted" style={{ fontSize: 14, marginBottom: 20 }}>{module.desc}</div>
      <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "8px 16px", background: "var(--bg-surface)", border: "1px solid var(--line)", borderRadius: 999, fontSize: 13, fontWeight: 600, color: module.color }}>
        <span style={{ width: 8, height: 8, borderRadius: 999, background: module.color, animation: "pulse 1.6s infinite" }}></span>
        Mô-đun sẽ ra mắt · {module.status}
      </div>
      <p style={{ fontSize: 13.5, color: "var(--t-secondary)", lineHeight: 1.6, marginTop: 24 }}>
        Hiện tại bạn đang xem bản preview của bộ TTOS Suite — toàn bộ {MODULES.length} mô-đun được tích hợp trên một nền tảng dùng chung tài khoản, phân quyền, danh bạ và quy trình duyệt. <b>E-Office</b> là mô-đun đầu tiên ra mắt.
      </p>
      <div style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: 24 }}>
        <button className="btn ghost" onClick={onOpenLauncher}>Xem tất cả mô-đun</button>
        <button className="btn primary" onClick={onBack}><Icon name="approval" size={14}/> Quay lại E-Office</button>
      </div>
    </div>
  </div>
);
