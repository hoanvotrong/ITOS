/* Dashboard screen — Overview for current user */

const Spark = ({ data = [12,18,15,22,19,26,24,30,28,34], color = "var(--brand-accent)", w = 120, h = 36 }) => {
  const max = Math.max(...data), min = Math.min(...data);
  const dx = w / (data.length - 1);
  const pts = data.map((v, i) => [i * dx, h - ((v - min) / (max - min || 1)) * (h - 4) - 2]);
  const path = pts.map((p, i) => (i === 0 ? `M${p[0]},${p[1]}` : `L${p[0]},${p[1]}`)).join(" ");
  const area = `${path} L${w},${h} L0,${h} Z`;
  return (
    <svg width={w} height={h} className="spark">
      <defs>
        <linearGradient id={`sg-${color.replace(/[^a-z0-9]/gi, "")}`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#sg-${color.replace(/[^a-z0-9]/gi, "")})`} />
      <path d={path} stroke={color} strokeWidth="1.5" fill="none" />
    </svg>
  );
};

const DashboardScreen = ({ go }) => {
  const myInbox    = APPROVALS.filter(a => a.status === "current" && a.chain.find(s => s.state === "current")?.person === ME.id);
  const myExecuting = TASKS.filter(t => t.executor === ME.id && t.status !== "done");
  const myLateTasks = TASKS.filter(t => (t.executor === ME.id || t.manager === ME.id) && t.status === "late");
  const myDueSoon   = TASKS.filter(t => (t.executor === ME.id || t.manager === ME.id) && t.status === "doing" && new Date(t.deadline) <= new Date("2026-05-25"));
  const myTasks     = TASKS.filter(t => t.executor === ME.id || t.manager === ME.id).filter(t => t.status === "doing" || t.status === "late");

  // Today's events from real data (date === 20)
  const todayEvents = SCHEDULE_EVENTS.filter(e => e.date === 20).sort((a, b) => a.start.localeCompare(b.start));

  // Hour of day from greeting
  const hour = 9; // simulated "morning"
  const greet = hour < 12 ? "Chào buổi sáng" : hour < 18 ? "Chào buổi chiều" : "Chào buổi tối";

  // Snapshot strip — quick action items
  const todayItems = [
    { kind: "approval", count: myInbox.length,   label: "phiếu chờ duyệt",  color: "#E85D2F", action: () => go("approval"),   urgent: myInbox.length > 0 },
    { kind: "task",     count: myLateTasks.length, label: "task trễ hạn",     color: "#B91C1C", action: () => go("tasks"),     urgent: myLateTasks.length > 0 },
    { kind: "task",     count: myDueSoon.length, label: "task sắp hết hạn",   color: "#D97706", action: () => go("tasks") },
    { kind: "schedule", count: todayEvents.length, label: "sự kiện hôm nay",  color: "#1E5FB7", action: () => go("schedule") },
  ];

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h1>{greet}, {ME.name.split(" ").slice(-1)[0]} 👋</h1>
          <div className="sub">Thứ Tư, 20/05/2026 — Tuần 21 · Quý II/2026</div>
        </div>
        <div className="actions">
          <button className="btn"><Icon name="download" size={14}/> Xuất báo cáo tuần</button>
          <button className="btn accent" onClick={() => go("approval-create")}><Icon name="plus" size={14} /> Tạo phiếu mới</button>
        </div>
      </div>

      {/* Today snapshot strip — what needs my attention right now */}
      <div style={{
        display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12,
        marginBottom: 18, padding: 14, background: "var(--bg-surface)",
        border: "1px solid var(--line)", borderRadius: "var(--r-md)",
      }}>
        {todayItems.map((it, i) => (
          <button
            key={i}
            onClick={it.action}
            style={{
              display: "flex", alignItems: "center", gap: 14, padding: "6px 4px",
              background: "transparent", border: "none", cursor: "pointer",
              textAlign: "left", borderRight: i < 3 ? "1px solid var(--line)" : "none",
            }}
          >
            <div style={{
              width: 44, height: 44, borderRadius: 10,
              background: it.urgent ? it.color : `${it.color}1A`,
              color: it.urgent ? "#fff" : it.color,
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

      {/* KPI strip */}
      <div className="kpi-grid">
        <div className="kpi">
          <div className="lbl"><span className="swatch" style={{ background: "var(--brand-accent)" }}></span>Chờ tôi duyệt</div>
          <div className="val">{myInbox.length} <small>phiếu</small></div>
          <div className="delta down"><Icon name="arrowDown" size={12}/> 2 phiếu so với hôm qua</div>
          <Spark data={[8,7,9,11,10,9,8,9,7,6]} color="var(--brand-accent)" />
        </div>
        <div className="kpi">
          <div className="lbl"><span className="swatch" style={{ background: "var(--st-info)" }}></span>Task của tôi</div>
          <div className="val">{myTasks.length} <small>đang thực hiện</small></div>
          <div className="delta"><Icon name="clock" size={12}/> {myLateTasks.length} quá hạn</div>
          <Spark data={[3,3,4,5,4,5,6,5,5,4]} color="var(--st-info)" />
        </div>
        <div className="kpi">
          <div className="lbl"><span className="swatch" style={{ background: "var(--st-success)" }}></span>Đã duyệt tháng này</div>
          <div className="val">47 <small>phiếu · 8,4 tỷ ₫</small></div>
          <div className="delta up"><Icon name="arrowUp" size={12}/> 18% so với tháng trước</div>
          <Spark data={[20,22,24,28,30,34,38,40,44,47]} color="var(--st-success)" />
        </div>
        <div className="kpi">
          <div className="lbl"><span className="swatch" style={{ background: "var(--st-warning)" }}></span>Thời gian duyệt TB</div>
          <div className="val">1,8 <small>ngày</small></div>
          <div className="delta up"><Icon name="arrowDown" size={12}/> Nhanh hơn 0,4 ngày</div>
          <Spark data={[3,2.8,2.6,2.4,2.5,2.3,2.1,2.0,1.9,1.8]} color="var(--st-warning)" />
        </div>
      </div>

      <div className="widget-grid">
        {/* Inbox — phê duyệt chờ tôi */}
        <div className="card">
          <div className="card-head">
            <div>
              <h3>Phiếu chờ tôi duyệt</h3>
              <div className="sub">{myInbox.length} phiếu · sắp xếp theo ưu tiên & thời hạn</div>
            </div>
            <div className="row" style={{ gap: 8 }}>
              <button className="btn ghost btn-sm" onClick={() => go("approval")}>Xem tất cả <Icon name="chevron" size={12}/></button>
            </div>
          </div>
          <div>
            {myInbox.slice(0, 4).map((a, idx) => {
              const creator = personById(a.creator);
              const prioColor = a.priority === "high" ? "var(--st-danger)"
                              : a.priority === "mid"  ? "var(--st-warning)"
                              : "var(--st-info)";
              return (
                <div
                  key={a.id}
                  onClick={() => go("approval-detail", { id: a.id })}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "4px 1fr auto",
                    gap: 16,
                    padding: "16px 20px 16px 18px",
                    borderBottom: idx < Math.min(3, myInbox.length - 1) ? "1px solid var(--line)" : "none",
                    cursor: "pointer",
                    position: "relative",
                    transition: "background .12s",
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = "var(--bg-canvas)"}
                  onMouseLeave={e => e.currentTarget.style.background = ""}
                >
                  {/* Priority bar */}
                  <div style={{ background: prioColor, borderRadius: 3, alignSelf: "stretch" }}></div>

                  {/* Main content */}
                  <div style={{ minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6, flexWrap: "wrap" }}>
                      <span className="mono" style={{ fontSize: 11.5, color: "var(--t-tertiary)", fontWeight: 500 }}>{a.id}</span>
                      <span style={{ width: 3, height: 3, borderRadius: 999, background: "var(--t-tertiary)" }}></span>
                      <span style={{ fontSize: 11.5, color: "var(--t-secondary)" }}>{a.type}</span>
                      <span style={{ width: 3, height: 3, borderRadius: 999, background: "var(--t-tertiary)" }}></span>
                      <span style={{ fontSize: 11.5, color: "var(--t-secondary)" }}>{a.dept}</span>
                    </div>
                    <div style={{ fontSize: 14, fontWeight: 600, lineHeight: 1.35, marginBottom: 10, color: "var(--t-primary)" }}>
                      {a.title}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 12, color: "var(--t-secondary)", flexWrap: "wrap" }}>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                        <Avatar person={creator} size={18} />
                        {creator.name}
                      </span>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
                        <Icon name="clock" size={12} />
                        Cấp {a.currentStep}/{a.chain.length}
                      </span>
                      <span className={`prio ${a.priority}`} style={{ fontSize: 12 }}>
                        {a.priority === "high" ? "Ưu tiên cao" : a.priority === "mid" ? "Ưu tiên TB" : "Ưu tiên thấp"}
                      </span>
                    </div>
                  </div>

                  {/* Right: amount + action */}
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", justifyContent: "space-between", gap: 10, minWidth: 140 }}>
                    <div style={{ textAlign: "right" }}>
                      <div className="mono" style={{
                        fontSize: a.amount === "—" ? 13 : 15,
                        fontWeight: 600,
                        color: a.amount === "—" ? "var(--t-tertiary)" : "var(--t-primary)",
                        letterSpacing: "-0.01em",
                        fontVariantNumeric: "tabular-nums",
                      }}>{a.amount}</div>
                      <div className="muted" style={{ fontSize: 11, marginTop: 2 }}>
                        {a.createdAt.split(" ")[0].split("-").reverse().join("/")}
                      </div>
                    </div>
                    <div style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 12, color: "var(--brand-accent)", fontWeight: 600 }}>
                      Đến lượt bạn
                      <Icon name="arrowRight" size={12} />
                    </div>
                  </div>
                </div>
              );
            })}
            {myInbox.length === 0 && (
              <div style={{ padding: "40px 20px", textAlign: "center", color: "var(--t-secondary)" }}>
                <Icon name="check" size={28} />
                <div style={{ marginTop: 10, fontWeight: 500 }}>Không còn phiếu nào chờ bạn duyệt</div>
              </div>
            )}
          </div>
        </div>

        {/* Today schedule */}
        <div className="card">
          <div className="card-head">
            <div>
              <h3>Lịch hôm nay</h3>
              <div className="sub">{todayEvents.length} sự kiện · 20/05/2026</div>
            </div>
            <button className="btn ghost btn-sm" onClick={() => go("schedule")}>Xem lịch <Icon name="chevron" size={12}/></button>
          </div>
          <div style={{ padding: "16px 20px 20px" }}>
            {todayEvents.map((e, i) => {
              const toneColor = e.tone === 1 ? "#1E5FB7" : e.tone === 2 ? "var(--brand-accent)" : e.tone === 3 ? "#0E8A6B" : "var(--st-warning)";
              const isPast = parseInt(e.end.split(":")[0]) < 9; // simulated "now = 09:xx"
              return (
                <div
                  key={e.id}
                  style={{ display: "grid", gridTemplateColumns: "70px 1fr", gap: 12, padding: "10px 0", borderBottom: i < todayEvents.length - 1 ? "1px solid var(--line)" : "none", opacity: isPast ? 0.55 : 1, cursor: "pointer" }}
                  onClick={() => go("schedule")}
                >
                  <div className="mono" style={{ fontSize: 12.5, color: "var(--t-secondary)", paddingTop: 2, fontVariantNumeric: "tabular-nums" }}>
                    {e.start}<span style={{ color: "var(--t-tertiary)" }}>–{e.end}</span>
                  </div>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ width: 6, height: 6, borderRadius: 999, background: toneColor }}></span>
                      <b style={{ fontSize: 13.5 }}>{e.title}</b>
                    </div>
                    <div className="muted" style={{ fontSize: 12, marginTop: 3, marginLeft: 14 }}>
                      {e.location}
                      {e.attendees.length > 0 && <> · {e.attendees.length} người</>}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom row */}
      <div className="widget-grid" style={{ marginTop: 20 }}>
        {/* Recent activity */}
        <div className="card">
          <div className="card-head">
            <h3>Hoạt động gần đây</h3>
            <button className="btn ghost btn-sm">Xem tất cả</button>
          </div>
          <div className="tl">
            <div className="tl-item approve">
              <div className="tl-icon"><Icon name="check" size={14}/></div>
              <div className="tl-body">
                <span className="who">Trần Thị Mai</span>
                <span className="what"> đã phê duyệt phiếu </span>
                <b className="mono" style={{ fontSize: 12 }}>PD-2026-0412</b>
                <div className="when">11:02 · 18/05/2026</div>
                <div className="quote">"Đồng ý, ưu tiên thanh toán trước 20/05."</div>
              </div>
            </div>
            <div className="tl-item note">
              <div className="tl-icon"><Icon name="edit" size={12}/></div>
              <div className="tl-body">
                <span className="who">Nguyễn Văn An</span>
                <span className="what"> thêm ý kiến cho task </span>
                <b style={{ fontSize: 13 }}>Hoàn thành phương án khai thác HPH–SGN</b>
                <div className="when">10:24 · 19/05/2026</div>
                <div className="quote">"Ưu tiên đảm bảo chuyến 23/05 không bị ảnh hưởng."</div>
              </div>
            </div>
            <div className="tl-item create">
              <div className="tl-icon"><Icon name="plus" size={12}/></div>
              <div className="tl-body">
                <span className="who">Bùi Đức Khải</span>
                <span className="what"> tạo phiếu </span>
                <b className="mono" style={{ fontSize: 12 }}>PD-2026-0418</b>
                <span className="what"> — Đề xuất sửa chữa lashing VINA STAR</span>
                <div className="when">09:24 · 19/05/2026</div>
              </div>
            </div>
            <div className="tl-item reject">
              <div className="tl-icon"><Icon name="x" size={12}/></div>
              <div className="tl-body">
                <span className="who">Trần Thị Mai</span>
                <span className="what"> từ chối phiếu </span>
                <b className="mono" style={{ fontSize: 12 }}>PD-2026-0410</b>
                <div className="when">08:44 · 17/05/2026</div>
              </div>
            </div>
          </div>
        </div>

        {/* My tasks */}
        <div className="card">
          <div className="card-head">
            <div>
              <h3>Task ưu tiên</h3>
              <div className="sub">Đang thực hiện hoặc trễ hạn</div>
            </div>
            <button className="btn ghost btn-sm" onClick={() => go("tasks")}>Xem dashboard <Icon name="chevron" size={12}/></button>
          </div>
          <div style={{ padding: "0 4px 8px" }}>
            {myTasks.slice(0, 4).map(t => {
              const exec = personById(t.executor);
              const isLate = t.status === "late";
              return (
                <div key={t.id} style={{ padding: "14px 18px", borderBottom: "1px solid var(--line)" }}>
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
                    <div style={{ flex: 1, cursor: "pointer" }} onClick={() => go("tasks-detail", { id: t.id })}>
                      <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 5 }}>
                        <span className="mono" style={{ fontSize: 11, color: "var(--t-tertiary)" }}>{t.id}</span>
                        <span className={`prio ${t.priority}`}>{t.priority === "high" ? "Cao" : t.priority === "mid" ? "TB" : "Thấp"}</span>
                        {isLate && <span className="badge danger"><span className="pip"></span>Trễ hạn</span>}
                      </div>
                      <div style={{ fontWeight: 500, fontSize: 13.5, marginBottom: 4 }}>{t.title}</div>
                      <div className="muted" style={{ fontSize: 12 }}>
                        Hạn: {t.deadline} · Đầu mối: <Avatar person={exec} size={16} /> {exec.name}
                      </div>
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 10 }}>
                    <div style={{ flex: 1, height: 6, borderRadius: 999, background: "var(--bg-sunken)", overflow: "hidden" }}>
                      <div style={{ width: `${t.progress}%`, height: "100%", background: isLate ? "var(--st-danger)" : "var(--brand-ink-3)" }}></div>
                    </div>
                    <span className="mono muted" style={{ fontSize: 11, minWidth: 35, textAlign: "right" }}>{t.progress}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

window.DashboardScreen = DashboardScreen;
