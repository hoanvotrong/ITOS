/* Tasks (BOD Dashboard), Documents, Schedule */

/* ===== Tasks — BOD Dashboard ===== */
const TasksScreen = ({ go }) => {
  const [scope, setScope] = React.useState("mine"); // mine | all
  const [view, setView] = React.useState("table"); // table | kanban | timeline
  const [filter, setFilter] = React.useState("all");
  const [myBucket, setMyBucket] = React.useState("executing"); // executing | supervising | watching | done
  const [showAnalytics, setShowAnalytics] = React.useState(true);

  // My-tasks role-based buckets
  const myExecuting   = TASKS.filter(t => t.executor === ME.id && t.status !== "done");
  const mySupervising = TASKS.filter(t => t.manager  === ME.id && t.executor !== ME.id && t.status !== "done");
  const myWatching    = TASKS.filter(t => (t.watchers || []).includes(ME.id) && t.executor !== ME.id && t.manager !== ME.id);
  const myDone        = TASKS.filter(t => (t.executor === ME.id || t.manager === ME.id) && t.status === "done");
  const myLate        = TASKS.filter(t => (t.executor === ME.id || t.manager === ME.id) && t.status === "late");
  const myDueSoon     = TASKS.filter(t => (t.executor === ME.id || t.manager === ME.id) && t.status === "doing" && new Date(t.deadline) <= new Date("2026-05-25"));

  const counts = scope === "all" ? {
    all: TASKS.length,
    pending: TASKS.filter((t) => t.status === "pending").length,
    doing: TASKS.filter((t) => t.status === "doing").length,
    done: TASKS.filter((t) => t.status === "done").length,
    late: TASKS.filter((t) => t.status === "late").length
  } : null;

  let visible;
  if (scope === "all") {
    visible = TASKS.filter((t) => filter === "all" || t.status === filter);
  } else {
    if      (myBucket === "executing")   visible = myExecuting;
    else if (myBucket === "supervising") visible = mySupervising;
    else if (myBucket === "watching")    visible = myWatching;
    else                                 visible = myDone;
  }

  const myBuckets = [
    { id: "executing",   label: "Tôi thực hiện",  count: myExecuting.length,   icon: "user",     hint: "Bạn là đầu mối" },
    { id: "supervising", label: "Tôi chỉ đạo",     count: mySupervising.length, icon: "users",    hint: "Bạn là người chỉ đạo" },
    { id: "watching",    label: "Tôi theo dõi",    count: myWatching.length,    icon: "eye",      hint: "Bạn là watcher" },
    { id: "done",        label: "Đã hoàn thành",   count: myDone.length,        icon: "check",    hint: "Liên quan đến bạn" },
  ];

  return (
    <div className="page" style={{ paddingTop: 28 }}>
      <div className="page-head">
        <div>
          <h1>{scope === "mine" ? "Công việc của tôi" : "Công việc — Dashboard BOD"}</h1>
          <div className="sub">
            {scope === "mine"
              ? <>Nhiệm vụ liên quan đến <b>{ME.name}</b> · {ME.role}</>
              : "Theo dõi nhiệm vụ theo phân cấp BOD → Người chỉ đạo → Đầu mối thực hiện"}
          </div>
        </div>
        <div className="actions">
          {scope === "all" && (
            <button className="btn ghost btn-sm" onClick={() => setShowAnalytics(s => !s)}>
              <Icon name={showAnalytics ? "eye" : "grid"} size={14}/>
              {showAnalytics ? "Ẩn phân tích" : "Hiện phân tích"}
            </button>
          )}
          <button className="btn"><Icon name="filter" size={14} /> Bộ lọc</button>
          <button className="btn"><Icon name="download" size={14} /> Xuất Excel</button>
          <button className="btn accent" onClick={() => go("tasks-create")}><Icon name="plus" size={14} /> Giao nhiệm vụ mới</button>
        </div>
      </div>

      {/* Scope toggle */}
      <div style={{
        display: "inline-flex", padding: 4, background: "var(--bg-sunken)",
        borderRadius: "var(--r-md)", border: "1px solid var(--line)", marginBottom: 18,
      }}>
        {[
          { id: "mine", label: "Của tôi",          count: myExecuting.length + mySupervising.length + myWatching.length, icon: "user" },
          { id: "all",  label: "Toàn công ty (BOD)", count: TASKS.length, icon: "grid" },
        ].map(s => (
          <button
            key={s.id}
            onClick={() => { setScope(s.id); setFilter("all"); }}
            style={{
              padding: "8px 16px", borderRadius: "calc(var(--r-md) - 4px)",
              border: "none", fontSize: 13, fontWeight: 600,
              display: "flex", alignItems: "center", gap: 8,
              background: scope === s.id ? "var(--bg-surface)" : "transparent",
              color: scope === s.id ? "var(--brand-ink)" : "var(--t-secondary)",
              boxShadow: scope === s.id ? "var(--sh-1)" : "none",
              cursor: "pointer", transition: "all .15s",
            }}
          >
            <Icon name={s.icon} size={14}/>
            {s.label}
            <span style={{
              padding: "1px 7px", borderRadius: 999, fontSize: 11, fontWeight: 600,
              background: scope === s.id ? "var(--brand-accent-bg)" : "var(--bg-canvas)",
              color: scope === s.id ? "var(--brand-accent)" : "var(--t-tertiary)",
              fontVariantNumeric: "tabular-nums",
            }}>{s.count}</span>
          </button>
        ))}
      </div>

      {/* === MY TASKS MODE === */}
      {scope === "mine" && (
        <>
          {/* Personal summary cards */}
          <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr 1fr 1fr", gap: 12, marginBottom: 18 }}>
            <div className="card" style={{
              padding: "16px 18px", borderLeft: myLate.length > 0 ? "3px solid var(--st-danger)" : "3px solid var(--st-success)",
              background: myLate.length > 0 ? "linear-gradient(180deg, rgba(185,28,28,0.04), transparent)" : "var(--bg-surface)"
            }}>
              <div className="muted" style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: 0.05, fontWeight: 600, marginBottom: 8 }}>
                Tình hình của bạn hôm nay
              </div>
              {myLate.length > 0 ? (
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span style={{ fontSize: 28, fontWeight: 700, color: "var(--st-danger)", fontVariantNumeric: "tabular-nums" }}>{myLate.length}</span>
                  <div style={{ fontSize: 13, lineHeight: 1.4 }}>
                    nhiệm vụ <b>trễ hạn</b><br/>
                    <span className="muted" style={{ fontSize: 12 }}>cần xử lý ưu tiên</span>
                  </div>
                </div>
              ) : (
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span style={{ fontSize: 28, color: "var(--st-success)" }}><Icon name="check" size={26}/></span>
                  <div style={{ fontSize: 13, lineHeight: 1.4 }}>
                    Không có nhiệm vụ trễ hạn<br/>
                    <span className="muted" style={{ fontSize: 12 }}>tiếp tục giữ phong độ 💪</span>
                  </div>
                </div>
              )}
            </div>
            <div className="card" style={{ padding: "16px 18px" }}>
              <div className="muted" style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: 0.05, fontWeight: 600, marginBottom: 8 }}>Đang thực hiện</div>
              <div style={{ fontSize: 28, fontWeight: 700, fontVariantNumeric: "tabular-nums", letterSpacing: "-0.025em" }}>
                {myExecuting.length}
              </div>
              <div className="muted" style={{ fontSize: 11, marginTop: 4 }}>bạn là đầu mối</div>
            </div>
            <div className="card" style={{ padding: "16px 18px" }}>
              <div className="muted" style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: 0.05, fontWeight: 600, marginBottom: 8 }}>Cần chỉ đạo</div>
              <div style={{ fontSize: 28, fontWeight: 700, fontVariantNumeric: "tabular-nums", letterSpacing: "-0.025em" }}>
                {mySupervising.length}
              </div>
              <div className="muted" style={{ fontSize: 11, marginTop: 4 }}>cần giám sát tiến độ</div>
            </div>
            <div className="card" style={{ padding: "16px 18px", background: myDueSoon.length > 0 ? "linear-gradient(180deg, rgba(217,119,6,0.05), transparent)" : "var(--bg-surface)" }}>
              <div className="muted" style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: 0.05, fontWeight: 600, marginBottom: 8 }}>Sắp hết hạn</div>
              <div style={{ fontSize: 28, fontWeight: 700, fontVariantNumeric: "tabular-nums", letterSpacing: "-0.025em", color: myDueSoon.length > 0 ? "#D97706" : "var(--t-primary)" }}>
                {myDueSoon.length}
              </div>
              <div className="muted" style={{ fontSize: 11, marginTop: 4 }}>trong 5 ngày tới</div>
            </div>
          </div>

          {/* My buckets — segmented tabs */}
          <div style={{
            display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 0,
            background: "var(--bg-surface)", border: "1px solid var(--line)",
            borderRadius: "var(--r-md)", overflow: "hidden", marginBottom: 16,
          }}>
            {myBuckets.map(b => (
              <button
                key={b.id}
                onClick={() => setMyBucket(b.id)}
                style={{
                  border: "none", background: myBucket === b.id ? "var(--brand-accent-bg)" : "transparent",
                  padding: "14px 16px", textAlign: "left", cursor: "pointer",
                  borderBottom: myBucket === b.id ? "3px solid var(--brand-accent)" : "3px solid transparent",
                  display: "flex", flexDirection: "column", gap: 6,
                  transition: "all .15s",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <Icon name={b.icon} size={14}/>
                  <span style={{ fontSize: 13, fontWeight: 600, color: myBucket === b.id ? "var(--brand-accent)" : "var(--t-primary)" }}>
                    {b.label}
                  </span>
                  <span style={{
                    marginLeft: "auto", fontSize: 11, fontWeight: 700, padding: "2px 8px",
                    borderRadius: 999, background: myBucket === b.id ? "var(--brand-accent)" : "var(--bg-sunken)",
                    color: myBucket === b.id ? "#fff" : "var(--t-secondary)",
                    fontVariantNumeric: "tabular-nums",
                  }}>{b.count}</span>
                </div>
                <div className="muted" style={{ fontSize: 11 }}>{b.hint}</div>
              </button>
            ))}
          </div>
        </>
      )}

      {/* === ALL / BOD MODE === */}
      {scope === "all" && (
        <>
          {showAnalytics && <TaskAnalytics />}

          {/* Status pills */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 12, marginBottom: 20 }}>
            {[
            { id: "all", label: "Tổng nhiệm vụ", val: counts.all, color: "var(--brand-ink)" },
            { id: "pending", label: "Chưa bắt đầu", val: counts.pending, color: "var(--t-secondary)" },
            { id: "doing", label: "Đang thực hiện", val: counts.doing, color: "var(--st-info)" },
            { id: "late", label: "Trễ hạn", val: counts.late, color: "var(--st-danger)", warning: true },
            { id: "done", label: "Hoàn thành", val: counts.done, color: "var(--st-success)" }].
            map((c) =>
            <div
              key={c.id}
              onClick={() => setFilter(c.id)}
              style={{
                background: "var(--bg-surface)",
                border: `1px solid ${filter === c.id ? c.color : "var(--line)"}`,
                borderRadius: "var(--r-md)",
                padding: "14px 18px",
                cursor: "pointer",
                position: "relative",
                boxShadow: filter === c.id ? `0 0 0 3px ${c.color}22` : "none"
              }}>

                <div style={{ fontSize: 11, color: "var(--t-secondary)", textTransform: "uppercase", letterSpacing: 0.06, fontWeight: 600, marginBottom: 6 }}>
                  {c.label}
                </div>
                <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                  <span style={{ fontSize: 28, fontWeight: 700, color: c.color, fontVariantNumeric: "tabular-nums", letterSpacing: "-0.025em" }}>{c.val}</span>
                  {c.warning && <span className="badge danger" style={{ marginLeft: 4 }}><span className="pip"></span>Cần xử lý</span>}
                </div>
              </div>
            )}
          </div>
        </>
      )}

      <div className="card">
        <div className="toolbar">
          <div className="seg-bar">
            <button className={view === "table" ? "on" : ""} onClick={() => setView("table")}>
              <Icon name="list" size={14} /> Bảng
            </button>
            <button className={view === "kanban" ? "on" : ""} onClick={() => setView("kanban")}>
              <Icon name="grid" size={14} /> Kanban
            </button>
            <button className={view === "timeline" ? "on" : ""} onClick={() => setView("timeline")}>
              <Icon name="schedule" size={14} /> Timeline
            </button>
          </div>
          <div className="filt-chip set">
            <span className="label">Phòng:</span> Tất cả <Icon name="chevronDown" size={12} />
          </div>
          <div className="filt-chip">
            <span className="label">Ưu tiên:</span> Tất cả <Icon name="chevronDown" size={12} />
          </div>
          <div className="filt-chip">
            <span className="label">Đầu mối:</span> Mọi người <Icon name="chevronDown" size={12} />
          </div>
          <div className="filt-chip">
            <span className="label">Hạn:</span> Tất cả <Icon name="chevronDown" size={12} />
          </div>
          <div className="spacer"></div>
          <div className="search" style={{ maxWidth: 220, margin: 0 }}>
            <Icon name="search" size={14} />
            <input placeholder="Tìm nhiệm vụ…" style={{ height: 30, paddingLeft: 32, fontSize: 12.5 }} />
          </div>
        </div>

        {view === "table" &&
        <div className="tbl-wrap">
            <table className="tbl">
              <thead>
                <tr>
                  <th style={{ width: 50 }}>STT</th>
                  <th style={{ width: 90 }}>Mã</th>
                  <th style={{ width: "200px" }}>Nhiệm vụ</th>
                  <th style={{ width: "4px" }}>Ưu tiên</th>
                  <th style={{ width: 110 }}>Bắt đầu</th>
                  <th style={{ width: 110 }}>Hạn</th>
                  <th style={{ width: 150 }}>Đầu mối</th>
                  <th style={{ width: 150 }}>Chỉ đạo</th>
                  <th style={{ width: 160 }}>Tiến độ</th>
                  <th style={{ width: 140 }}>Tình trạng</th>
                  <th style={{ width: 180 }}>Ý kiến TGĐ</th>
                </tr>
              </thead>
              <tbody>
                {visible.map((t) => {
                const exec = personById(t.executor);
                const mgr = personById(t.manager);
                return (
                  <tr key={t.id} style={{ cursor: "pointer" }} onClick={() => go("tasks-detail", { id: t.id })}>
                      <td className="num mono muted">{String(t.no).padStart(2, "0")}</td>
                      <td className="id">{t.id}</td>
                      <td>
                        <div className="title">{t.title}</div>
                        <div className="sub">{t.department}</div>
                      </td>
                      <td><span className={`prio ${t.priority}`}>{t.priority === "high" ? "Cao" : t.priority === "mid" ? "TB" : "Thấp"}</span></td>
                      <td className="mono" style={{ fontSize: 12, color: "var(--t-secondary)" }}>{t.startDate.split("-").reverse().join("/")}</td>
                      <td className="mono" style={{ fontSize: 12, color: t.status === "late" ? "var(--st-danger)" : "var(--t-secondary)", fontWeight: t.status === "late" ? 600 : 400 }}>{t.deadline.split("-").reverse().join("/")}</td>
                      <td>
                        <div className="av-inline">
                          <Avatar person={exec} size={22} />
                          <span style={{ fontSize: 12.5 }}>{exec.name.split(" ").slice(-2).join(" ")}</span>
                        </div>
                      </td>
                      <td>
                        <div className="av-inline">
                          <Avatar person={mgr} size={22} />
                          <span style={{ fontSize: 12.5 }}>{mgr.name.split(" ").slice(-2).join(" ")}</span>
                        </div>
                      </td>
                      <td>
                        <div className="row" style={{ gap: 8 }}>
                          <div style={{ flex: 1, height: 6, borderRadius: 999, background: "var(--bg-sunken)", overflow: "hidden" }}>
                            <div style={{ width: `${t.progress}%`, height: "100%", background: t.status === "late" ? "var(--st-danger)" : t.status === "done" ? "var(--st-success)" : "var(--brand-ink-3)" }}></div>
                          </div>
                          <span className="mono muted" style={{ fontSize: 11, minWidth: 30, textAlign: "right" }}>{t.progress}%</span>
                        </div>
                      </td>
                      <td>
                        {t.status === "doing" && <span className="badge info"><span className="pip"></span>Đang thực hiện</span>}
                        {t.status === "done" && <span className="badge success"><Icon name="check" size={10} />Hoàn thành</span>}
                        {t.status === "late" && <span className="badge danger"><span className="pip"></span>Trễ hạn</span>}
                        {t.status === "pending" && <span className="badge neutral"><span className="pip"></span>Chưa bắt đầu</span>}
                      </td>
                      <td>
                        {t.bodNote ?
                      <span style={{ fontSize: 12, color: "var(--t-secondary)", fontStyle: "italic", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                            "{t.bodNote}"
                          </span> :

                      <span className="muted" style={{ fontSize: 12 }}>—</span>
                      }
                      </td>
                    </tr>);

              })}
              </tbody>
            </table>
          </div>
        }

        {view === "kanban" && <KanbanBoard tasks={visible} />}
        {view === "timeline" && <GanttTimeline tasks={visible} go={go} />}
      </div>
    </div>);

};

const KanbanBoard = ({ tasks }) => {
  const cols = [
  { id: "pending", label: "Chưa bắt đầu", tone: "neutral" },
  { id: "doing", label: "Đang thực hiện", tone: "info" },
  { id: "late", label: "Trễ hạn", tone: "danger" },
  { id: "done", label: "Hoàn thành", tone: "success" }];

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, padding: 20, background: "var(--bg-canvas)" }}>
      {cols.map((c) => {
        const items = tasks.filter((t) => t.status === c.id);
        return (
          <div key={c.id} style={{ background: "var(--bg-page)", borderRadius: "var(--r-md)", border: "1px solid var(--line)", display: "flex", flexDirection: "column" }}>
            <div style={{ padding: "10px 12px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid var(--line)" }}>
              <div className="row" style={{ gap: 8 }}>
                <span className={`badge ${c.tone}`}><span className="pip"></span>{c.label}</span>
                <span className="muted" style={{ fontSize: 12 }}>{items.length}</span>
              </div>
              <button className="icon-btn" style={{ width: 26, height: 26 }}><Icon name="plus" size={14} /></button>
            </div>
            <div style={{ padding: 10, display: "flex", flexDirection: "column", gap: 10 }}>
              {items.map((t) => {
                const exec = personById(t.executor);
                return (
                  <div key={t.id} style={{ background: "var(--bg-surface)", border: "1px solid var(--line)", borderRadius: "var(--r-sm)", padding: 12, boxShadow: "var(--sh-1)", cursor: "pointer" }} onClick={() => window.__openTask?.(t.id)}>
                    <div className="row" style={{ justifyContent: "space-between", marginBottom: 6 }}>
                      <span className="mono" style={{ fontSize: 11, color: "var(--t-tertiary)" }}>{t.id}</span>
                      <span className={`prio ${t.priority}`}></span>
                    </div>
                    <div style={{ fontSize: 13, fontWeight: 500, lineHeight: 1.35, marginBottom: 10 }}>{t.title}</div>
                    <div className="row" style={{ gap: 8, marginBottom: 10 }}>
                      <div style={{ flex: 1, height: 4, borderRadius: 999, background: "var(--bg-sunken)" }}>
                        <div style={{ width: `${t.progress}%`, height: "100%", background: c.id === "late" ? "var(--st-danger)" : c.id === "done" ? "var(--st-success)" : "var(--brand-ink-3)", borderRadius: 999 }}></div>
                      </div>
                      <span className="mono muted" style={{ fontSize: 11 }}>{t.progress}%</span>
                    </div>
                    <div className="row between">
                      <Avatar person={exec} size={22} />
                      <span className="mono" style={{ fontSize: 11, color: c.id === "late" ? "var(--st-danger)" : "var(--t-tertiary)" }}>
                        {t.deadline.split("-").slice(1).reverse().join("/")}
                      </span>
                    </div>
                  </div>);

              })}
            </div>
          </div>);

      })}
    </div>);

};

/* ===== Documents ===== */
const DocumentsScreen = ({ go }) => {
  const [view, setView] = React.useState("grid");
  const [cat, setCat] = React.useState("Tất cả");
  const cats = ["Tất cả", "Quy chế", "Mẫu biểu", "Báo cáo", "Hướng dẫn", "Danh mục", "Quy trình", "Mua sắm"];
  const visible = DOCUMENTS.filter((d) => cat === "Tất cả" || d.category === cat);

  return (
    <div className="page" style={{ paddingTop: 28 }}>
      <div className="page-head">
        <div>
          <h1>Văn bản</h1>
          <div className="sub">Kho tài liệu nội bộ · phân loại theo phòng ban & loại</div>
        </div>
        <div className="actions">
          <button className="btn"><Icon name="folder" size={14} /> Tạo thư mục</button>
          <button className="btn accent"><Icon name="upload" size={14} /> Tải lên tài liệu</button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "240px 1fr", gap: 20 }}>
        {/* Categories sidebar */}
        <aside className="card">
          <div className="card-head"><h3>Phân loại</h3></div>
          <div style={{ padding: "6px 0" }}>
            {cats.map((c) =>
            <div
              key={c}
              onClick={() => setCat(c)}
              style={{
                padding: "8px 16px",
                fontSize: 13,
                cursor: "pointer",
                background: cat === c ? "var(--brand-accent-bg)" : "transparent",
                color: cat === c ? "var(--brand-accent)" : "var(--t-primary)",
                fontWeight: cat === c ? 600 : 400,
                borderLeft: cat === c ? "3px solid var(--brand-accent)" : "3px solid transparent",
                display: "flex", justifyContent: "space-between", alignItems: "center"
              }}>

                {c}
                <span className="muted" style={{ fontSize: 11 }}>
                  {c === "Tất cả" ? DOCUMENTS.length : DOCUMENTS.filter((d) => d.category === c).length}
                </span>
              </div>
            )}
          </div>
          <div className="divider"></div>
          <div className="card-head" style={{ borderTop: "1px solid var(--line)", borderBottom: "1px solid var(--line)" }}><h3>Phòng ban</h3></div>
          <div style={{ padding: "6px 0" }}>
            {["BOD", "Kinh doanh", "Khai thác", "Hàng hải", "QHSE", "KTVT"].map((d) =>
            <div key={d} style={{ padding: "7px 16px", fontSize: 13, cursor: "pointer", display: "flex", justifyContent: "space-between" }}>
                <span>{d}</span>
                <span className="muted" style={{ fontSize: 11 }}>{DOCUMENTS.filter((x) => x.dept === d).length}</span>
              </div>
            )}
          </div>
        </aside>

        <div className="card">
          <div className="toolbar">
            <div className="seg-bar">
              <button className={view === "grid" ? "on" : ""} onClick={() => setView("grid")}><Icon name="grid" size={14} /> Lưới</button>
              <button className={view === "list" ? "on" : ""} onClick={() => setView("list")}><Icon name="list" size={14} /> Danh sách</button>
            </div>
            <div className="filt-chip"><span className="label">Loại file:</span> Tất cả <Icon name="chevronDown" size={12} /></div>
            <div className="filt-chip"><span className="label">Cập nhật:</span> Bất kỳ <Icon name="chevronDown" size={12} /></div>
            <div className="spacer"></div>
            <div className="search" style={{ maxWidth: 220, margin: 0 }}>
              <Icon name="search" size={14} />
              <input placeholder="Tìm tài liệu…" style={{ height: 30, paddingLeft: 32, fontSize: 12.5 }} />
            </div>
          </div>

          {view === "grid" &&
          <div className="doc-grid">
              {visible.map((d) =>
            <div key={d.id} className="doc-card">
                  <div className={`ftype ${d.type}`}>{d.type.toUpperCase()}</div>
                  <div className="doc-title">{d.name}</div>
                  <div className="doc-meta">{d.size} · {d.updated.split("-").reverse().join("/")}</div>
                  <div className="doc-foot">
                    <div className="av-inline">
                      <Avatar person={personById(d.owner)} size={20} />
                      <span style={{ fontSize: 11, color: "var(--t-tertiary)" }}>{personById(d.owner).name.split(" ").slice(-2).join(" ")}</span>
                    </div>
                    <button className="icon-btn" style={{ width: 24, height: 24 }}><Icon name="moreV" size={14} /></button>
                  </div>
                </div>
            )}
            </div>
          }

          {view === "list" &&
          <div className="tbl-wrap">
              <table className="tbl">
                <thead>
                  <tr>
                    <th style={{ width: 36 }}></th>
                    <th>Tên tài liệu</th>
                    <th style={{ width: 130 }}>Phân loại</th>
                    <th style={{ width: 120 }}>Phòng</th>
                    <th style={{ width: 160 }}>Sở hữu</th>
                    <th style={{ width: 90 }}>Kích thước</th>
                    <th style={{ width: 110 }}>Cập nhật</th>
                    <th style={{ width: 36 }}></th>
                  </tr>
                </thead>
                <tbody>
                  {visible.map((d) =>
                <tr key={d.id} style={{ cursor: "pointer" }}>
                      <td>
                        <div className={`ftype ${d.type}`} style={{ width: 24, height: 28, borderRadius: 3, fontSize: 8.5, color: "#fff", display: "grid", placeItems: "center", fontWeight: 700, fontFamily: "var(--font-mono)", background: d.type === "pdf" ? "#D03A2C" : d.type === "docx" ? "#2563EB" : d.type === "xlsx" ? "#16A34A" : "#7C5BE0" }}>
                          {d.type.toUpperCase()}
                        </div>
                      </td>
                      <td>
                        <div className="title">{d.name}</div>
                        <div className="sub mono">{d.id}</div>
                      </td>
                      <td><span className="tag" style={{ background: "transparent", border: "1px solid var(--line)" }}>{d.category}</span></td>
                      <td className="muted" style={{ fontSize: 12.5 }}>{d.dept}</td>
                      <td>
                        <div className="av-inline">
                          <Avatar person={personById(d.owner)} size={22} />
                          <span style={{ fontSize: 12.5 }}>{personById(d.owner).name}</span>
                        </div>
                      </td>
                      <td className="muted mono" style={{ fontSize: 12 }}>{d.size}</td>
                      <td className="muted mono" style={{ fontSize: 12 }}>{d.updated.split("-").reverse().join("/")}</td>
                      <td><button className="icon-btn"><Icon name="moreV" size={14} /></button></td>
                    </tr>
                )}
                </tbody>
              </table>
            </div>
          }
        </div>
      </div>
    </div>);

};

/* ===== Schedule ===== */
const ScheduleScreen = () => {
  // build month grid for May 2026; May 1, 2026 is a Friday (day index 5, Mon-start: 4)
  // Mon-start week. May 1 (Fri) -> idx 4. So days before: 4 (Apr 27,28,29,30).
  const monthStartIdx = 4; // 0=Mon
  const monthDays = 31;
  const cells = [];
  // prev month tail
  for (let i = 0; i < monthStartIdx; i++) {
    cells.push({ d: 30 - (monthStartIdx - 1 - i), other: true });
  }
  for (let d = 1; d <= monthDays; d++) cells.push({ d, other: false });
  while (cells.length < 35) cells.push({ d: cells.length - monthStartIdx - monthDays + 1, other: true });
  if (cells.length < 42) {
    const start = cells[cells.length - 1].d + 1;
    while (cells.length < 42) cells.push({ d: cells.length - 35 - monthStartIdx - monthDays + start + 1, other: true });
  }

  const dows = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];
  const today = 20;

  return (
    <div className="page" style={{ paddingTop: 28 }}>
      <div className="page-head">
        <div>
          <h1>Lịch</h1>
          <div className="sub">Lịch cá nhân & lịch công ty · Tháng 5 / 2026</div>
        </div>
        <div className="actions">
          <div className="seg-bar">
            <button>Ngày</button>
            <button>Tuần</button>
            <button className="on">Tháng</button>
          </div>
          <button className="btn accent"><Icon name="plus" size={14} /> Tạo sự kiện</button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 20 }}>
        <div className="card">
          <div className="toolbar" style={{ borderBottom: "1px solid var(--line)" }}>
            <button className="icon-btn"><Icon name="chevron" size={16} style={{ transform: "rotate(180deg)" }} /></button>
            <b style={{ fontSize: 16 }}>Tháng 5 · 2026</b>
            <button className="icon-btn"><Icon name="chevron" size={16} /></button>
            <button className="btn btn-sm ghost">Hôm nay</button>
            <div className="spacer"></div>
            <div className="row" style={{ gap: 10, fontSize: 12, color: "var(--t-secondary)" }}>
              <span className="row" style={{ gap: 5 }}><span style={{ width: 8, height: 8, borderRadius: 2, background: "#1E5FB7" }}></span>Họp</span>
              <span className="row" style={{ gap: 5 }}><span style={{ width: 8, height: 8, borderRadius: 2, background: "var(--brand-accent)" }}></span>Khai thác</span>
              <span className="row" style={{ gap: 5 }}><span style={{ width: 8, height: 8, borderRadius: 2, background: "var(--st-success)" }}></span>Vận hành</span>
              <span className="row" style={{ gap: 5 }}><span style={{ width: 8, height: 8, borderRadius: 2, background: "var(--st-warning)" }}></span>Đào tạo</span>
            </div>
          </div>
          <div className="cal-grid">
            {dows.map((d) => <div key={d} className="cal-dow">{d}</div>)}
            {cells.map((c, i) => {
              const events = c.other ? [] : SCHEDULE_EVENTS.filter((e) => e.date === c.d);
              return (
                <div key={i} className={`cal-cell ${c.other ? "other" : ""} ${c.d === today && !c.other ? "today" : ""}`}>
                  <div className="d">{c.d}</div>
                  {events.slice(0, 3).map((e, j) =>
                  <div key={j} className={`ev tone-${e.tone}`} title={e.title}>
                      <b style={{ fontWeight: 600 }}>{e.time}</b> {e.title}
                    </div>
                  )}
                  {events.length > 3 && <div className="muted" style={{ fontSize: 10, marginTop: 2 }}>+{events.length - 3} khác</div>}
                </div>);

            })}
          </div>
        </div>

        {/* Today / upcoming sidebar */}
        <aside style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div className="card">
            <div className="card-head">
              <div>
                <h3>Hôm nay · 20/05</h3>
                <div className="sub">3 sự kiện</div>
              </div>
            </div>
            <div style={{ padding: "12px 20px 16px", display: "flex", flexDirection: "column", gap: 14 }}>
              {SCHEDULE_EVENTS.filter((e) => e.date === 20).map((e, i) =>
              <div key={i} style={{ display: "grid", gridTemplateColumns: "60px 4px 1fr", gap: 10 }}>
                  <div className="mono" style={{ fontSize: 12, color: "var(--t-secondary)", paddingTop: 2, textAlign: "right" }}>{e.time}</div>
                  <div style={{ background: e.tone === 1 ? "#1E5FB7" : e.tone === 2 ? "var(--brand-accent)" : e.tone === 3 ? "var(--st-success)" : "var(--st-warning)", borderRadius: 2 }}></div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 500 }}>{e.title}</div>
                    <div className="muted" style={{ fontSize: 11, marginTop: 4 }}>
                      <div className="avstack">
                        {e.attendees.map((a) => <Avatar key={a} person={personById(a)} size={20} />)}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="card">
            <div className="card-head"><h3>Sắp tới</h3></div>
            <div style={{ padding: "10px 0" }}>
              {SCHEDULE_EVENTS.filter((e) => e.date > 20).slice(0, 5).map((e, i) =>
              <div key={i} style={{ padding: "10px 20px", display: "grid", gridTemplateColumns: "40px 1fr", gap: 10, borderBottom: i < 4 ? "1px solid var(--line)" : "none" }}>
                  <div style={{ textAlign: "center" }}>
                    <div className="mono" style={{ fontSize: 9, color: "var(--t-tertiary)", textTransform: "uppercase" }}>Th5</div>
                    <div className="mono" style={{ fontSize: 16, fontWeight: 600, lineHeight: 1.1 }}>{e.date}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 500 }}>{e.title}</div>
                    <div className="muted" style={{ fontSize: 11, marginTop: 2 }}>{e.time}</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </aside>
      </div>
    </div>);

};

/* ===== Notifications (full page) ===== */
const NotificationsScreen = () => {
  return (
    <div className="page" style={{ paddingTop: 28 }}>
      <div className="page-head">
        <div>
          <h1>Thông báo</h1>
          <div className="sub">{NOTIFICATIONS.filter((n) => n.unread).length} chưa đọc · {NOTIFICATIONS.length} tổng cộng</div>
        </div>
        <div className="actions">
          <button className="btn"><Icon name="check" size={14} /> Đánh dấu tất cả đã đọc</button>
          <button className="btn"><Icon name="settings" size={14} /> Tuỳ chỉnh thông báo</button>
        </div>
      </div>

      <div className="card">
        <div className="tabs">
          <div className="tab active">Tất cả <span className="count">{NOTIFICATIONS.length}</span></div>
          <div className="tab">Phê duyệt <span className="count">3</span></div>
          <div className="tab">Công việc <span className="count">2</span></div>
          <div className="tab">Lịch <span className="count">1</span></div>
          <div className="tab">Văn bản <span className="count">1</span></div>
        </div>
        <div>
          {NOTIFICATIONS.map((n) => {
            const actor = personById(n.actor);
            const renderText = (txt) => {
              const parts = txt.split(/(\*\*[^*]+\*\*)/g);
              return parts.map((p, i) =>
              p.startsWith("**") ?
              <b key={i}>{p.replace(/\*\*/g, "")}</b> :
              <React.Fragment key={i}>{p}</React.Fragment>
              );
            };
            return (
              <div key={n.id} className={`notif-item ${n.unread ? "unread" : ""}`} style={{ position: "relative" }}>
                <Avatar person={actor} size={32} />
                <div className="body">
                  <div className="title"><b>{actor.name}</b> {renderText(" " + n.text)}</div>
                  <div className="sub">
                    {n.type === "approval" && "Phê duyệt"}
                    {n.type === "task" && "Công việc"}
                    {n.type === "schedule" && "Lịch"}
                    {n.type === "doc" && "Văn bản"}
                    {" · "}
                    {actor.dept}
                  </div>
                </div>
                <div className="when">{n.when}</div>
              </div>);

          })}
        </div>
      </div>
    </div>);

};

/* ===== Task detail drawer ===== */
const TaskDetailDrawer = ({ open, taskId, onClose }) => {
  const task = TASKS.find(t => t.id === taskId);
  if (!task) return null;

  const exec = personById(task.executor);
  const mgr = personById(task.manager);
  const isLate = task.status === "late";
  const isDone = task.status === "done";

  return (
    <>
      <div className={`drawer-overlay ${open ? "open" : ""}`} onClick={onClose} />
      <div className={`drawer wide ${open ? "open" : ""}`}>
        <div className="drawer-head">
          <div>
            <div className="row" style={{ gap: 8, marginBottom: 6 }}>
              <span className="mono" style={{ fontSize: 11.5, color: "var(--t-tertiary)" }}>{task.id}</span>
              <span className={`prio ${task.priority}`}>{task.priority === "high" ? "Ưu tiên cao" : task.priority === "mid" ? "Ưu tiên TB" : "Ưu tiên thấp"}</span>
              {isLate && <span className="badge danger"><span className="pip"></span>Trễ hạn</span>}
              {isDone && <span className="badge success"><Icon name="check" size={10}/>Hoàn thành</span>}
              {task.status === "doing" && <span className="badge info"><span className="pip"></span>Đang thực hiện</span>}
              {task.status === "pending" && <span className="badge neutral"><span className="pip"></span>Chưa bắt đầu</span>}
            </div>
            <h3 style={{ fontSize: 16, fontWeight: 600, lineHeight: 1.35, margin: 0 }}>{task.title}</h3>
          </div>
          <button className="icon-btn" onClick={onClose}><Icon name="x" size={16}/></button>
        </div>
        <div className="drawer-body" style={{ padding: "0 20px 24px" }}>
          {/* Description */}
          {task.desc && (
            <div style={{ padding: "16px 0", borderBottom: "1px solid var(--line)" }}>
              <div className="muted" style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: 0.05, fontWeight: 600, marginBottom: 8 }}>Mô tả</div>
              <div style={{ fontSize: 13.5, lineHeight: 1.55 }}>{task.desc}</div>
            </div>
          )}

          {/* Progress */}
          <div style={{ padding: "16px 0", borderBottom: "1px solid var(--line)" }}>
            <div className="row between" style={{ marginBottom: 8 }}>
              <div className="muted" style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: 0.05, fontWeight: 600 }}>Tiến độ</div>
              <div className="mono" style={{ fontSize: 13, fontWeight: 600 }}>{task.progress}%</div>
            </div>
            <div className={`progress-track ${isLate ? "late" : isDone ? "done" : ""}`}>
              <div className="pbar" style={{ width: `${task.progress}%` }}></div>
            </div>
            {task.note && (
              <div style={{ fontSize: 12.5, color: "var(--t-secondary)", marginTop: 10, fontStyle: "italic" }}>
                "{task.note}"
              </div>
            )}
          </div>

          {/* Info */}
          <div style={{ padding: "8px 0", borderBottom: "1px solid var(--line)" }}>
            <div className="info-block">
              <div className="info-lbl">Đầu mối</div>
              <div className="av-inline">
                <Avatar person={exec} size={24} />
                <div>
                  <div style={{ fontSize: 13, fontWeight: 500 }}>{exec.name}</div>
                  <div className="muted" style={{ fontSize: 11 }}>{exec.role}</div>
                </div>
              </div>
            </div>
            <div className="info-block">
              <div className="info-lbl">Người chỉ đạo</div>
              <div className="av-inline">
                <Avatar person={mgr} size={24} />
                <div>
                  <div style={{ fontSize: 13, fontWeight: 500 }}>{mgr.name}</div>
                  <div className="muted" style={{ fontSize: 11 }}>{mgr.role}</div>
                </div>
              </div>
            </div>
            <div className="info-block">
              <div className="info-lbl">Bắt đầu</div>
              <div className="mono">{task.startDate.split("-").reverse().join("/")}</div>
            </div>
            <div className="info-block">
              <div className="info-lbl">Hạn hoàn thành</div>
              <div className="mono" style={{ color: isLate ? "var(--st-danger)" : "var(--t-primary)", fontWeight: isLate ? 600 : 500 }}>
                {task.deadline.split("-").reverse().join("/")}
                {isLate && <span style={{ marginLeft: 8, fontSize: 11, color: "var(--st-danger)" }}>· trễ 1 ngày</span>}
              </div>
            </div>
            <div className="info-block">
              <div className="info-lbl">Phòng ban</div>
              <div>{task.department}</div>
            </div>
          </div>

          {/* BOD note */}
          {task.bodNote && (
            <div style={{ padding: "16px 0", borderBottom: "1px solid var(--line)" }}>
              <div className="muted" style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: 0.05, fontWeight: 600, marginBottom: 8 }}>Ý kiến TGĐ</div>
              <div style={{ padding: 12, background: "var(--brand-accent-bg)", borderLeft: "3px solid var(--brand-accent)", borderRadius: "0 6px 6px 0", fontSize: 13, fontStyle: "italic" }}>
                "{task.bodNote}"
                <div className="muted" style={{ fontSize: 11, marginTop: 6, fontStyle: "normal", display: "flex", alignItems: "center", gap: 6 }}>
                  — <Avatar person={personById("u1")} size={18}/> Nguyễn Văn An, TGĐ
                </div>
              </div>
            </div>
          )}

          {/* Activity log */}
          <div style={{ padding: "16px 0" }}>
            <div className="row between" style={{ marginBottom: 12 }}>
              <div className="muted" style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: 0.05, fontWeight: 600 }}>
                Nhật ký cập nhật · {task.logs.length} mục
              </div>
              <button className="btn ghost btn-sm"><Icon name="paperclip" size={12}/> Đính kèm</button>
            </div>

            {/* Add new log */}
            <div style={{ marginBottom: 18 }}>
              <textarea
                className="log-input"
                placeholder="Cập nhật tiến độ mới (kèm file nếu cần)…"
              />
              <div className="row" style={{ justifyContent: "flex-end", marginTop: 8, gap: 8 }}>
                <button className="btn btn-sm ghost">Lưu nháp</button>
                <button className="btn btn-sm primary"><Icon name="send" size={12}/> Cập nhật</button>
              </div>
            </div>

            {/* Existing logs */}
            <div className="tl" style={{ padding: 0 }}>
              {task.logs.map((l, i) => {
                const author = personById(l.by);
                return (
                  <div key={i} className="tl-item note">
                    <div className="tl-icon"><Icon name="edit" size={11}/></div>
                    <div className="tl-body">
                      <span className="who">{author.name}</span>
                      <span className="what"> cập nhật tiến độ</span>
                      <div className="when">{l.at}</div>
                      <div className="quote">{l.text}</div>
                    </div>
                  </div>
                );
              })}
              <div className="tl-item create">
                <div className="tl-icon"><Icon name="plus" size={11}/></div>
                <div className="tl-body">
                  <span className="who">Phạm Minh Tuấn</span>
                  <span className="what"> tạo nhiệm vụ và giao cho </span>
                  <b>{exec.name}</b>
                  <div className="when">{task.startDate.split("-").reverse().join("/")} · 08:30</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

Object.assign(window, { TasksScreen, DocumentsScreen, ScheduleScreen, NotificationsScreen, TaskDetailDrawer });
