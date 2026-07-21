/* Task module — Create form + Detail page + Analytics + Timeline view */

/* ===== Donut chart (SVG, simple) ===== */
function DonutChart({ segments, size = 140, thickness = 22 }) {
  const r = (size - thickness) / 2;
  const cx = size / 2;
  const cy = size / 2;
  const c = 2 * Math.PI * r;
  const total = segments.reduce((s, x) => s + x.value, 0) || 1;
  let acc = 0;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: "rotate(-90deg)" }}>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="var(--bg-sunken)" strokeWidth={thickness} />
      {segments.map((s, i) => {
        const frac = s.value / total;
        const dash = frac * c;
        const offset = -acc * c;
        acc += frac;
        return (
          <circle
            key={i}
            cx={cx} cy={cy} r={r}
            fill="none"
            stroke={s.color}
            strokeWidth={thickness}
            strokeDasharray={`${dash} ${c - dash}`}
            strokeDashoffset={offset}
            style={{ transition: "stroke-dasharray .3s" }}
          />
        );
      })}
    </svg>
  );
}

/* ===== Bar chart (horizontal mini) ===== */
function MiniBar({ segments, max, height = 8 }) {
  const total = segments.reduce((s, x) => s + x.value, 0);
  return (
    <div className="workload-bar" style={{ height }}>
      {segments.map((s, i) => (
        <span
          key={i}
          className="seg"
          style={{ width: `${(s.value / max) * 100}%`, background: s.color }}
          title={`${s.label}: ${s.value}`}
        />
      ))}
    </div>
  );
}

/* ===== Task Analytics widgets ===== */
function TaskAnalytics() {
  const byStatus = [
    { id: "doing",   label: "Đang thực hiện", value: TASKS.filter(t => t.status === "doing").length,   color: "#1E5FB7" },
    { id: "done",    label: "Hoàn thành",     value: TASKS.filter(t => t.status === "done").length,    color: "#16A34A" },
    { id: "late",    label: "Trễ hạn",        value: TASKS.filter(t => t.status === "late").length,    color: "#B91C1C" },
    { id: "pending", label: "Chưa bắt đầu",   value: TASKS.filter(t => t.status === "pending").length, color: "#8A8A82" },
  ];
  const completionRate = Math.round((byStatus[1].value / TASKS.length) * 100);

  // Workload by person (top 5)
  const workload = PEOPLE.map(p => {
    const tasks = TASKS.filter(t => t.executor === p.id);
    return {
      person: p,
      doing: tasks.filter(t => t.status === "doing").length,
      done:  tasks.filter(t => t.status === "done").length,
      late:  tasks.filter(t => t.status === "late").length,
      pending: tasks.filter(t => t.status === "pending").length,
      total: tasks.length,
    };
  }).filter(w => w.total > 0).sort((a, b) => b.total - a.total).slice(0, 5);
  const maxWorkload = Math.max(...workload.map(w => w.total), 1);

  return (
    <div style={{ display: "grid", gridTemplateColumns: "320px 1fr 1.1fr", gap: 16, marginBottom: 20 }}>
      {/* Donut */}
      <div className="card">
        <div className="card-head">
          <h3>Phân bổ tình trạng</h3>
          <span className="muted" style={{ fontSize: 11 }}>Tổng {TASKS.length}</span>
        </div>
        <div style={{ padding: "18px 20px 22px", display: "flex", gap: 18, alignItems: "center" }}>
          <div style={{ position: "relative" }}>
            <DonutChart segments={byStatus} size={140} thickness={20} />
            <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", lineHeight: 1.1 }}>
              <div style={{ textAlign: "center" }}>
                <div className="mono" style={{ fontSize: 24, fontWeight: 700, letterSpacing: "-0.025em" }}>{completionRate}<span style={{ fontSize: 13, color: "var(--t-tertiary)" }}>%</span></div>
                <div className="muted" style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: 0.04, fontWeight: 600 }}>Hoàn thành</div>
              </div>
            </div>
          </div>
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 9 }}>
            {byStatus.map(s => (
              <div key={s.id} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12.5 }}>
                <span style={{ width: 10, height: 10, borderRadius: 3, background: s.color, flexShrink: 0 }}></span>
                <span style={{ flex: 1, color: "var(--t-secondary)" }}>{s.label}</span>
                <span className="mono" style={{ fontWeight: 600, fontVariantNumeric: "tabular-nums" }}>{s.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Workload */}
      <div className="card">
        <div className="card-head">
          <h3>Khối lượng công việc</h3>
          <span className="muted" style={{ fontSize: 11 }}>Theo đầu mối · top 5</span>
        </div>
        <div style={{ padding: "12px 20px 16px" }}>
          {workload.map(w => {
            const segs = [
              { label: "Hoàn thành",   value: w.done,    color: "#16A34A" },
              { label: "Đang thực hiện", value: w.doing,  color: "#1E5FB7" },
              { label: "Trễ hạn",       value: w.late,   color: "#B91C1C" },
              { label: "Chưa BĐ",       value: w.pending, color: "#C2C2BB" },
            ];
            return (
              <div key={w.person.id} className="workload-row">
                <Avatar person={w.person} size={26} />
                <div>
                  <div style={{ fontSize: 12.5, fontWeight: 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{w.person.name.split(" ").slice(-2).join(" ")}</div>
                  <div className="muted" style={{ fontSize: 10.5, marginTop: 1 }}>{w.person.dept}</div>
                </div>
                <MiniBar segments={segs} max={maxWorkload} />
                <span className="mono" style={{ fontSize: 12, fontWeight: 600, textAlign: "right" }}>{w.total}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Completion trend */}
      <div className="card">
        <div className="card-head">
          <div>
            <h3>Xu hướng hoàn thành 14 ngày</h3>
            <div className="sub">07/05 — 20/05</div>
          </div>
          <span className="badge success"><Icon name="arrowUp" size={10}/> +24%</span>
        </div>
        <div style={{ padding: "12px 20px 18px" }}>
          <TrendChart />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginTop: 14, paddingTop: 14, borderTop: "1px solid var(--line)" }}>
            <div>
              <div className="muted" style={{ fontSize: 10.5, textTransform: "uppercase", fontWeight: 600, letterSpacing: 0.05 }}>Hoàn thành</div>
              <div style={{ fontSize: 18, fontWeight: 700, marginTop: 2, color: "var(--st-success)", fontVariantNumeric: "tabular-nums" }}>23<small style={{ fontSize: 11, color: "var(--t-tertiary)", fontWeight: 500, marginLeft: 4 }}>nv</small></div>
            </div>
            <div>
              <div className="muted" style={{ fontSize: 10.5, textTransform: "uppercase", fontWeight: 600, letterSpacing: 0.05 }}>Mới giao</div>
              <div style={{ fontSize: 18, fontWeight: 700, marginTop: 2, color: "var(--st-info)", fontVariantNumeric: "tabular-nums" }}>18</div>
            </div>
            <div>
              <div className="muted" style={{ fontSize: 10.5, textTransform: "uppercase", fontWeight: 600, letterSpacing: 0.05 }}>TG TB</div>
              <div style={{ fontSize: 18, fontWeight: 700, marginTop: 2, fontVariantNumeric: "tabular-nums" }}>5,2<small style={{ fontSize: 11, color: "var(--t-tertiary)", fontWeight: 500, marginLeft: 4 }}>ngày</small></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function TrendChart() {
  const data = [
    { d: 7, done: 1, new: 2 },
    { d: 8, done: 2, new: 1 },
    { d: 9, done: 1, new: 3 },
    { d: 10, done: 3, new: 2 },
    { d: 11, done: 0, new: 2 },
    { d: 12, done: 2, new: 1 },
    { d: 13, done: 3, new: 2 },
    { d: 14, done: 2, new: 1 },
    { d: 15, done: 1, new: 0 },
    { d: 16, done: 3, new: 3 },
    { d: 17, done: 2, new: 1 },
    { d: 18, done: 2, new: 0 },
    { d: 19, done: 1, new: 1 },
    { d: 20, done: 0, new: 0 },
  ];
  const w = 320, h = 80;
  const maxV = Math.max(...data.flatMap(d => [d.done, d.new]), 1);
  const dx = w / (data.length - 1);
  const yOf = v => h - (v / maxV) * (h - 4);
  const linePath = key => data.map((d, i) => `${i === 0 ? "M" : "L"}${i * dx},${yOf(d[key])}`).join(" ");
  const areaPath = key => `${linePath(key)} L${w},${h} L0,${h} Z`;
  return (
    <svg width="100%" viewBox={`0 0 ${w} ${h + 16}`} preserveAspectRatio="none" style={{ height: 96 }}>
      <defs>
        <linearGradient id="tg-done" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#16A34A" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#16A34A" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={areaPath("done")} fill="url(#tg-done)" />
      <path d={linePath("done")} stroke="#16A34A" strokeWidth="1.8" fill="none" />
      <path d={linePath("new")} stroke="#1E5FB7" strokeWidth="1.4" fill="none" strokeDasharray="3 2" />
      {/* labels */}
      <text x={0} y={h + 12} fontSize="9" fill="var(--t-tertiary)" textAnchor="start">07/05</text>
      <text x={w / 2} y={h + 12} fontSize="9" fill="var(--t-tertiary)" textAnchor="middle">14/05</text>
      <text x={w} y={h + 12} fontSize="9" fill="var(--t-tertiary)" textAnchor="end">20/05</text>
    </svg>
  );
}

/* ===== Gantt timeline view ===== */
function GanttTimeline({ tasks, go }) {
  // 14-day window centered on May 20, 2026 — show May 13 to May 26
  const startDay = new Date("2026-05-13T00:00:00");
  const endDay = new Date("2026-05-26T00:00:00");
  const days = [];
  for (let d = new Date(startDay); d <= endDay; d.setDate(d.getDate() + 1)) {
    days.push(new Date(d));
  }
  const today = new Date("2026-05-20T00:00:00");
  const todayIdx = days.findIndex(d => d.toDateString() === today.toDateString());

  // Build columns CSS string
  const colTemplate = `repeat(${days.length}, minmax(64px, 1fr))`;

  const dayOfWeekVN = ["CN","T2","T3","T4","T5","T6","T7"];

  const dateToIdx = dateStr => {
    const d = new Date(dateStr + "T00:00:00");
    return Math.round((d - startDay) / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="gantt-wrap">
      <div className="gantt-grid">
        {/* Side */}
        <div className="gantt-side">
          <div className="g-side-head">Nhiệm vụ</div>
          {tasks.map(t => (
            <div key={t.id} className="g-side-row" onClick={() => window.__openTask?.(t.id)}>
              <div className="gtitle">{t.title}</div>
              <div className="gmeta">{t.id} · {t.department}</div>
            </div>
          ))}
        </div>

        {/* Track */}
        <div className="gantt-track">
          {/* Header */}
          <div className="gantt-head-row" style={{ gridTemplateColumns: colTemplate }}>
            {days.map((d, i) => {
              const dow = d.getDay();
              const weekend = dow === 0 || dow === 6;
              const isToday = i === todayIdx;
              return (
                <div key={i} className={`gantt-head-cell ${weekend ? "weekend" : ""} ${isToday ? "today" : ""}`}>
                  <span className="dow">{dayOfWeekVN[dow]}</span>
                  <span className="dn">{d.getDate()}</span>
                </div>
              );
            })}
          </div>

          {/* Rows */}
          {tasks.map(t => {
            const startIdx = Math.max(0, dateToIdx(t.startDate));
            const endIdx = Math.min(days.length - 1, dateToIdx(t.deadline));
            const span = endIdx - startIdx + 1;
            const offPct = (startIdx / days.length) * 100;
            const wPct = (span / days.length) * 100;
            return (
              <div key={t.id} className="gantt-row" style={{ gridTemplateColumns: colTemplate }}>
                {days.map((d, i) => {
                  const dow = d.getDay();
                  const weekend = dow === 0 || dow === 6;
                  return <div key={i} className={`g-cell ${weekend ? "weekend" : ""}`}></div>;
                })}
                {span > 0 && startIdx <= days.length - 1 && endIdx >= 0 && (
                  <div
                    className={`gantt-bar ${t.status}`}
                    style={{ left: `calc(${offPct}% + 2px)`, width: `calc(${wPct}% - 4px)` }}
                    title={`${t.title} · ${t.progress}%`}
                    onClick={() => window.__openTask?.(t.id)}
                  >
                    <div className="gb-fill" style={{ width: `${t.progress}%` }}></div>
                    <span style={{ position: "relative", zIndex: 1, overflow: "hidden", textOverflow: "ellipsis" }}>
                      {personById(t.executor).short} · {t.progress}%
                    </span>
                  </div>
                )}
              </div>
            );
          })}

          {/* Today line */}
          {todayIdx >= 0 && (
            <div
              className="gantt-today-line"
              style={{ left: `${((todayIdx + 0.5) / days.length) * 100}%`, top: 30, bottom: 0 }}
            />
          )}
        </div>
      </div>
    </div>
  );
}

/* ===== Create Task screen ================================ */
const TASK_TEMPLATES = [
  "Báo cáo định kỳ",
  "Khảo sát hiện trạng",
  "Triển khai dự án",
  "Đào tạo nhân sự",
  "Tự do",
];

function CreateTaskScreen({ go }) {
  const [form, setForm] = React.useState({
    title: "",
    desc: "",
    priority: "mid",
    startDate: "2026-05-22",
    deadline: "2026-06-05",
    manager: "u3",
    executor: "u8",
    department: "Khai thác",
    watchers: ["u11"],
    files: [],
    initialNote: "",
  });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const exec = form.executor ? personById(form.executor) : null;
  const mgr  = form.manager  ? personById(form.manager)  : null;

  // Duration in days
  const durDays = Math.round(
    (new Date(form.deadline + "T00:00:00") - new Date(form.startDate + "T00:00:00")) / (1000*60*60*24)
  );
  const valid = form.title.trim().length > 0 && form.executor && form.manager && form.startDate && form.deadline;

  return (
    <div className="page" style={{ paddingTop: 24, maxWidth: 1320, paddingBottom: 0 }}>
      <div style={{ marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
        <button className="btn ghost btn-sm" onClick={() => go("tasks")}>← Quay lại</button>
        <div className="muted" style={{ fontSize: 12, marginLeft: 6 }}>
          Công việc / <span style={{ color: "var(--t-primary)", fontWeight: 500 }}>Giao nhiệm vụ mới</span>
        </div>
      </div>

      <div className="page-head" style={{ marginBottom: 18 }}>
        <div>
          <h1>Giao nhiệm vụ mới</h1>
          <div className="sub">BOD tạo nhiệm vụ và gán cho Người chỉ đạo + Đầu mối thực hiện</div>
        </div>
      </div>

      <div className="form-grid">
        <div>
          {/* 1. Thông tin */}
          <div className="form-section">
            <div className="sec-head">
              <div className="step-no">1</div>
              <h4>Thông tin nhiệm vụ</h4>
              <span className="sec-sub">Bắt buộc</span>
            </div>
            <div className="sec-body">
              <div className="field">
                <label>Tiêu đề nhiệm vụ <span className="req">*</span></label>
                <input
                  className="input"
                  placeholder="VD: Hoàn thành phương án khai thác tuyến HPH–SGN tháng 6"
                  value={form.title}
                  onChange={e => set("title", e.target.value)}
                />
              </div>

              <div className="field">
                <label>Mô tả chi tiết yêu cầu & kỳ vọng <span className="req">*</span></label>
                <textarea
                  className="textarea"
                  rows={5}
                  placeholder="Mô tả nội dung cụ thể, kết quả mong đợi, các bên liên quan, tài liệu tham khảo…"
                  value={form.desc}
                  onChange={e => set("desc", e.target.value)}
                />
              </div>

              <div className="field-row">
                <div className="field">
                  <label>Phòng ban phụ trách</label>
                  <select className="select" value={form.department} onChange={e => set("department", e.target.value)}>
                    {["Khai thác","Hàng hải","Kinh doanh","KTVT","QHSE","Tài chính","Hành chính"].map(d => <option key={d}>{d}</option>)}
                  </select>
                </div>
                <div className="field">
                  <label>Mẫu nhiệm vụ <span className="opt">(tuỳ chọn)</span></label>
                  <select className="select" defaultValue="Tự do">
                    {TASK_TEMPLATES.map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
              </div>

              <div className="field">
                <label>Mức ưu tiên <span className="req">*</span></label>
                <div className="priority-radio">
                  {["low","mid","high"].map(p => (
                    <label key={p} className={`${p} ${form.priority === p ? "on" : ""}`}>
                      <input type="radio" checked={form.priority === p} onChange={() => set("priority", p)} />
                      {p === "high" ? "Cao" : p === "mid" ? "Trung bình" : "Thấp"}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 2. Thời gian */}
          <div className="form-section">
            <div className="sec-head">
              <div className="step-no">2</div>
              <h4>Thời gian</h4>
              <span className="sec-sub">{durDays > 0 ? `${durDays} ngày` : "—"}</span>
            </div>
            <div className="sec-body">
              <div className="field-row">
                <div className="field">
                  <label>Ngày bắt đầu <span className="req">*</span></label>
                  <input className="input" type="date" value={form.startDate} onChange={e => set("startDate", e.target.value)} />
                </div>
                <div className="field">
                  <label>Thời hạn hoàn thành <span className="req">*</span></label>
                  <input className="input" type="date" value={form.deadline} onChange={e => set("deadline", e.target.value)} />
                </div>
              </div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 10 }}>
                {[7, 14, 30, 60].map(d => (
                  <button
                    key={d}
                    className="btn btn-sm ghost"
                    style={{ height: 26, fontSize: 11.5 }}
                    onClick={() => {
                      const s = new Date(form.startDate + "T00:00:00");
                      s.setDate(s.getDate() + d);
                      set("deadline", s.toISOString().slice(0, 10));
                    }}
                  >+{d} ngày</button>
                ))}
              </div>
            </div>
          </div>

          {/* 3. Người thực hiện */}
          <div className="form-section">
            <div className="sec-head">
              <div className="step-no">3</div>
              <h4>Phân công</h4>
              <span className="sec-sub">Người chỉ đạo & Đầu mối thực hiện</span>
            </div>
            <div className="sec-body">
              <div className="field">
                <label>Người chỉ đạo (Manager) <span className="req">*</span></label>
                <div style={{ display: "flex" }}>
                  <PersonPicker
                    value={form.manager}
                    onPick={(id) => set("manager", id)}
                    placeholder="Chọn Manager giám sát…"
                  />
                </div>
                <div className="hint">Người giám sát tiến độ, không nhất thiết phải tự thực hiện</div>
              </div>

              <div className="field">
                <label>Đầu mối thực hiện (Executor) <span className="req">*</span></label>
                <div style={{ display: "flex" }}>
                  <PersonPicker
                    value={form.executor}
                    onPick={(id) => set("executor", id)}
                    placeholder="Chọn người trực tiếp thực hiện…"
                  />
                </div>
                <div className="hint">Người trực tiếp cập nhật nhật ký tiến độ</div>
              </div>

              <div className="field">
                <label>Người theo dõi <span className="opt">(CC)</span></label>
                <div className="watcher-chips">
                  {form.watchers.map(w => {
                    const p = personById(w);
                    return (
                      <span key={w} className="watcher-chip">
                        <Avatar person={p} size={20} />
                        <span>{p.name}</span>
                        <button onClick={() => set("watchers", form.watchers.filter(x => x !== w))}>
                          <Icon name="x" size={11}/>
                        </button>
                      </span>
                    );
                  })}
                  <input className="watcher-input" placeholder="Gõ tên để thêm…" />
                </div>
              </div>
            </div>
          </div>

          {/* 4. Ghi chú & file */}
          <div className="form-section">
            <div className="sec-head">
              <div className="step-no">4</div>
              <h4>Ghi chú & Tài liệu</h4>
              <span className="sec-sub">Tuỳ chọn</span>
            </div>
            <div className="sec-body">
              <div className="field">
                <label>Ý kiến TGĐ / Ghi chú khi giao việc <span className="opt">(hiển thị nổi bật)</span></label>
                <textarea
                  className="textarea"
                  rows={3}
                  placeholder="Ưu tiên đảm bảo X, lưu ý Y, báo cáo định kỳ…"
                  value={form.initialNote}
                  onChange={e => set("initialNote", e.target.value)}
                />
              </div>
              <div className="dropzone">
                <div className="dz-icon"><Icon name="upload" size={18}/></div>
                <b>Đính kèm tài liệu tham khảo</b>
                <div className="dz-sub">PDF, DOCX, XLSX… tối đa 20 MB</div>
              </div>
            </div>
          </div>
        </div>

        {/* Preview */}
        <aside>
          <div className="preview-card">
            <div className="pv-head">
              <Icon name="eye" size={14}/>
              <b>Xem trước nhiệm vụ</b>
              <span className="live">Live</span>
            </div>
            <div className="pv-body">
              <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 8, flexWrap: "wrap" }}>
                <span className="tag">TK-089 (dự kiến)</span>
                <span className={`prio ${form.priority}`} style={{ fontSize: 11 }}>
                  {form.priority === "high" ? "Cao" : form.priority === "mid" ? "TB" : "Thấp"}
                </span>
                <span className="badge neutral"><span className="pip"></span>Chưa bắt đầu</span>
              </div>
              <div style={{ fontSize: 15, fontWeight: 700, letterSpacing: "-0.01em", lineHeight: 1.35, marginBottom: 12, color: form.title ? "var(--t-primary)" : "var(--t-tertiary)" }}>
                {form.title || "Tiêu đề nhiệm vụ sẽ hiện ở đây…"}
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "10px 14px", fontSize: 12.5 }}>
                <span className="muted">Bắt đầu</span><span className="mono">{form.startDate.split("-").reverse().join("/")}</span>
                <span className="muted">Hạn</span><span className="mono">{form.deadline.split("-").reverse().join("/")}</span>
                <span className="muted">Thời lượng</span><span>{durDays} ngày</span>
                <span className="muted">Phòng ban</span><span>{form.department}</span>
              </div>

              <div className="divider"></div>
              <div className="muted" style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: 0.05, fontWeight: 600, marginBottom: 10 }}>Phân công</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {mgr && (
                  <div className="av-inline">
                    <Avatar person={mgr} size={26} />
                    <div>
                      <div style={{ fontSize: 12.5, fontWeight: 500 }}>{mgr.name}</div>
                      <div className="muted" style={{ fontSize: 10.5 }}>Người chỉ đạo · {mgr.role}</div>
                    </div>
                  </div>
                )}
                {exec && (
                  <div className="av-inline">
                    <Avatar person={exec} size={26} />
                    <div>
                      <div style={{ fontSize: 12.5, fontWeight: 500 }}>{exec.name}</div>
                      <div className="muted" style={{ fontSize: 10.5 }}>Đầu mối · {exec.role}</div>
                    </div>
                  </div>
                )}
              </div>

              {form.initialNote && (
                <>
                  <div className="divider"></div>
                  <div style={{ padding: 10, background: "var(--brand-accent-bg)", borderLeft: "3px solid var(--brand-accent)", borderRadius: "0 6px 6px 0", fontSize: 12, fontStyle: "italic" }}>
                    "{form.initialNote}"
                  </div>
                </>
              )}
            </div>
          </div>
        </aside>
      </div>

      <div className="form-actions">
        <div className="summary">
          {valid
            ? <>Sẵn sàng: giao cho <b>{exec?.name}</b> · giám sát bởi <b>{mgr?.name}</b> · {durDays} ngày</>
            : <span style={{ color: "var(--st-danger)" }}>⚠ Vui lòng nhập tiêu đề, chọn người chỉ đạo và đầu mối thực hiện</span>
          }
        </div>
        <div className="actions">
          <button className="btn ghost" onClick={() => go("tasks")}>Huỷ</button>
          <button className="btn"><Icon name="download" size={14}/> Lưu nháp</button>
          <button className="btn primary" disabled={!valid}><Icon name="send" size={14}/> Giao nhiệm vụ</button>
        </div>
      </div>
    </div>
  );
}

/* ===== Task Detail full page ============================= */
function TaskDetailPage({ go, ctx }) {
  const id = ctx?.id || "TK-088";
  const baseTask = TASKS.find(t => t.id === id) || TASKS[0];

  // Local working copy so the detail page is actually usable
  const [task, setTask] = React.useState(baseTask);
  React.useEffect(() => { setTask(baseTask); }, [baseTask.id]);

  const exec = personById(task.executor);
  const mgr = personById(task.manager);
  const [tab, setTab] = React.useState("overview");
  const [newLog, setNewLog] = React.useState("");
  const [editingProgress, setEditingProgress] = React.useState(false);
  const [editingTitle, setEditingTitle] = React.useState(false);
  const [draftTitle, setDraftTitle] = React.useState(task.title);
  const [watchers, setWatchers] = React.useState(["u11"]);
  const [files, setFiles] = React.useState([
    { name: "PhuongAnKhaiThac_T06_v3.xlsx", type: "xlsx", size: "218 KB" },
    { name: "LichTau_VinaOcean_T6.pdf", type: "pdf", size: "1.4 MB" },
  ]);
  const [toast, setToast] = React.useState(null);
  const flash = (msg) => {
    setToast(msg);
    clearTimeout(window.__taskToastT);
    window.__taskToastT = setTimeout(() => setToast(null), 2200);
  };

  const isLate = task.status === "late";
  const isDone = task.status === "done";

  const updateStatus = (s) => {
    setTask(prev => ({
      ...prev,
      status: s,
      progress: s === "done" ? 100 : (s === "pending" ? 0 : prev.progress),
      logs: [
        { by: prev.executor, at: "20/05/2026 · vừa xong", text:
          s === "done" ? "Đã đặt trạng thái Hoàn thành." :
          s === "doing" ? "Đặt trạng thái Đang thực hiện." :
          "Đặt trạng thái Chưa bắt đầu." },
        ...prev.logs,
      ],
    }));
    flash(s === "done" ? "Đã đánh dấu hoàn thành" : "Đã cập nhật trạng thái");
  };
  const updateProgress = (p) => {
    const v = Math.max(0, Math.min(100, Math.round(p)));
    setTask(prev => ({
      ...prev,
      progress: v,
      status: v === 100 ? "done" : (v === 0 ? "pending" : (prev.status === "late" ? "late" : "doing")),
    }));
  };
  const addLog = () => {
    const text = newLog.trim();
    if (!text) return;
    setTask(prev => ({
      ...prev,
      note: text,
      logs: [{ by: prev.executor, at: "20/05/2026 · vừa xong", text }, ...prev.logs],
    }));
    setNewLog("");
    flash("Đã đăng cập nhật");
  };
  const saveTitle = () => {
    const t = draftTitle.trim();
    if (t) setTask(prev => ({ ...prev, title: t }));
    setEditingTitle(false);
  };
  const removeWatcher = (uid) => setWatchers(w => w.filter(x => x !== uid));
  const addWatcher = () => {
    const candidates = PEOPLE.filter(p => !watchers.includes(p.id) && p.id !== task.executor && p.id !== task.manager);
    if (candidates.length) {
      setWatchers(w => [...w, candidates[0].id]);
      flash(`Đã thêm ${candidates[0].name}`);
    }
  };
  const onPickFile = () => {
    const inp = document.createElement("input");
    inp.type = "file";
    inp.onchange = e => {
      const f = e.target.files?.[0];
      if (!f) return;
      const ext = (f.name.split(".").pop() || "").toLowerCase();
      const type = ["pdf","docx","xlsx","pptx"].includes(ext) ? ext : "doc";
      const kb = f.size / 1024;
      const size = kb > 1024 ? `${(kb/1024).toFixed(1)} MB` : `${Math.round(kb)} KB`;
      setFiles(arr => [...arr, { name: f.name, type, size }]);
      flash(`Đã đính kèm ${f.name}`);
    };
    inp.click();
  };

  return (
    <div className="page" style={{ paddingTop: 24, maxWidth: 1320 }}>
      <div style={{ marginBottom: 14, display: "flex", alignItems: "center", gap: 8 }}>
        <button className="btn ghost btn-sm" onClick={() => go("tasks")}>← Quay lại</button>
        <div className="muted" style={{ fontSize: 12, marginLeft: 6 }}>
          Công việc / <span className="mono" style={{ color: "var(--t-primary)" }}>{task.id}</span>
        </div>
        <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
          <button className="btn btn-sm ghost" onClick={() => { setDraftTitle(task.title); setEditingTitle(true); }}><Icon name="edit" size={12}/> Chỉnh sửa</button>
          <button className="btn btn-sm ghost" onClick={() => flash("Đang xuất PDF…")}><Icon name="download" size={12}/> Xuất PDF</button>
          <button className="btn btn-sm" onClick={() => flash("Thao tác khác")}><Icon name="moreV" size={12}/></button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 24 }}>
        <div>
          {/* Title block */}
          <div className="card" style={{ marginBottom: 18 }}>
            <div style={{ padding: "22px 24px 18px" }}>
              <div className="row" style={{ gap: 8, marginBottom: 10, flexWrap: "wrap" }}>
                <span className="tag">{task.id}</span>
                <span className={`prio ${task.priority}`}>{task.priority === "high" ? "Ưu tiên cao" : task.priority === "mid" ? "Ưu tiên TB" : "Ưu tiên thấp"}</span>
                {isLate && <span className="badge danger"><span className="pip"></span>Trễ hạn 1 ngày</span>}
                {isDone && <span className="badge success"><Icon name="check" size={10}/>Hoàn thành</span>}
                {task.status === "doing" && <span className="badge info"><span className="pip"></span>Đang thực hiện</span>}
                {task.status === "pending" && <span className="badge neutral"><span className="pip"></span>Chưa bắt đầu</span>}
                <span className="muted" style={{ fontSize: 12, marginLeft: 4 }}>· {task.department}</span>
              </div>
              {editingTitle ? (
                <div style={{ display: "flex", gap: 8, margin: "0 0 16px" }}>
                  <input
                    className="input"
                    value={draftTitle}
                    onChange={e => setDraftTitle(e.target.value)}
                    onKeyDown={e => { if (e.key === "Enter") saveTitle(); if (e.key === "Escape") setEditingTitle(false); }}
                    autoFocus
                    style={{ fontSize: 18, fontWeight: 600 }}
                  />
                  <button className="btn btn-sm primary" onClick={saveTitle}>Lưu</button>
                  <button className="btn btn-sm ghost" onClick={() => setEditingTitle(false)}>Huỷ</button>
                </div>
              ) : (
                <h1
                  style={{ margin: "0 0 16px", fontSize: 22, fontWeight: 700, letterSpacing: "-0.015em", lineHeight: 1.3, cursor: "text" }}
                  onDoubleClick={() => { setDraftTitle(task.title); setEditingTitle(true); }}
                  title="Bấm đúp để chỉnh sửa"
                >{task.title}</h1>
              )}

              {/* Progress */}
              <div style={{ display: "flex", gap: 16, alignItems: "center", padding: "14px 16px", background: "var(--bg-canvas)", borderRadius: "var(--r-sm)", border: "1px solid var(--line)" }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 6 }}>
                    <span className="muted" style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: 0.05, fontWeight: 600 }}>Tiến độ</span>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      {editingProgress ? (
                        <>
                          <input
                            type="number" min={0} max={100}
                            value={task.progress}
                            onChange={e => updateProgress(parseInt(e.target.value || "0", 10))}
                            onBlur={() => setEditingProgress(false)}
                            onKeyDown={e => { if (e.key === "Enter") setEditingProgress(false); }}
                            autoFocus
                            className="input"
                            style={{ width: 60, height: 26, fontSize: 13, padding: "0 6px", textAlign: "right", fontFamily: "var(--font-mono)" }}
                          />
                          <span className="muted" style={{ fontSize: 12 }}>%</span>
                        </>
                      ) : (
                        <span
                          className="mono"
                          style={{ fontSize: 17, fontWeight: 700, fontVariantNumeric: "tabular-nums", cursor: "pointer" }}
                          onClick={() => setEditingProgress(true)}
                          title="Bấm để sửa"
                        >{task.progress}%</span>
                      )}
                    </div>
                  </div>
                  <input
                    type="range" min={0} max={100} step={5}
                    value={task.progress}
                    onChange={e => updateProgress(parseInt(e.target.value, 10))}
                    style={{ width: "100%", accentColor: isLate ? "var(--st-danger)" : isDone ? "var(--st-success)" : "var(--brand-ink-3)" }}
                  />
                </div>
                <div style={{ width: 1, height: 36, background: "var(--line)" }}></div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button
                    className="btn btn-sm"
                    onClick={() => updateStatus("doing")}
                    style={task.status === "doing" ? { borderColor: "var(--st-info)", color: "var(--st-info)", background: "var(--bg-canvas)" } : {}}
                  >Đang thực hiện</button>
                  <button
                    className="btn btn-sm"
                    onClick={() => updateStatus("done")}
                    style={task.status === "done" ? { borderColor: "var(--st-success)", color: "var(--st-success)", background: "var(--bg-canvas)" } : {}}
                  ><Icon name="check" size={12}/> Hoàn thành</button>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="tabs" style={{ borderTop: "1px solid var(--line)" }}>
              <div className={`tab ${tab === "overview" ? "active" : ""}`} onClick={() => setTab("overview")}>Tổng quan</div>
              <div className={`tab ${tab === "log" ? "active" : ""}`} onClick={() => setTab("log")}>Nhật ký <span className="count">{task.logs.length}</span></div>
              <div className={`tab ${tab === "files" ? "active" : ""}`} onClick={() => setTab("files")}>Tài liệu <span className="count">{files.length}</span></div>
              <div className={`tab ${tab === "linked" ? "active" : ""}`} onClick={() => setTab("linked")}>Liên quan</div>
            </div>

            {/* Tab content */}
            {tab === "overview" && (
              <div style={{ padding: "20px 24px" }}>
                <div style={{ fontSize: 11, color: "var(--t-secondary)", textTransform: "uppercase", letterSpacing: 0.05, fontWeight: 600, marginBottom: 10 }}>Mô tả nhiệm vụ</div>
                <p style={{ margin: "0 0 22px", lineHeight: 1.65, fontSize: 14 }}>{task.desc || "Chưa có mô tả chi tiết."}</p>

                {task.note && (
                  <>
                    <div style={{ fontSize: 11, color: "var(--t-secondary)", textTransform: "uppercase", letterSpacing: 0.05, fontWeight: 600, marginBottom: 10 }}>Cập nhật mới nhất</div>
                    <div style={{ padding: 14, background: "var(--bg-canvas)", borderLeft: "3px solid var(--brand-ink-3)", borderRadius: "0 6px 6px 0", fontSize: 13.5, marginBottom: 22 }}>
                      {task.note}
                      <div className="muted" style={{ fontSize: 11, marginTop: 6, display: "flex", alignItems: "center", gap: 6 }}>
                        bởi <Avatar person={exec} size={18}/> {exec.name}
                      </div>
                    </div>
                  </>
                )}

                {task.bodNote && (
                  <>
                    <div style={{ fontSize: 11, color: "var(--t-secondary)", textTransform: "uppercase", letterSpacing: 0.05, fontWeight: 600, marginBottom: 10 }}>Ý kiến TGĐ</div>
                    <div style={{ padding: 14, background: "var(--brand-accent-bg)", borderLeft: "3px solid var(--brand-accent)", borderRadius: "0 6px 6px 0", fontSize: 14, fontStyle: "italic", color: "var(--t-primary)" }}>
                      "{task.bodNote}"
                      <div className="muted" style={{ fontSize: 11, marginTop: 8, fontStyle: "normal", display: "flex", alignItems: "center", gap: 6 }}>
                        — <Avatar person={personById("u1")} size={18}/> Nguyễn Văn An, TGĐ
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}

            {tab === "log" && (
              <div style={{ padding: "16px 24px 24px" }}>
                <div style={{ marginBottom: 20 }}>
                  <textarea
                    className="log-input"
                    placeholder="Cập nhật tiến độ mới (gắn @ để tag người khác)…"
                    value={newLog}
                    onChange={e => setNewLog(e.target.value)}
                  />
                  <div className="row between" style={{ marginTop: 8 }}>
                    <div className="row" style={{ gap: 8 }}>
                      <button className="btn btn-sm ghost" onClick={onPickFile}><Icon name="paperclip" size={12}/> Đính kèm</button>
                      <button className="btn btn-sm ghost" onClick={() => setNewLog(s => s + " @")}><Icon name="users" size={12}/> @ Tag</button>
                    </div>
                    <button className="btn btn-sm primary" onClick={addLog} disabled={!newLog.trim()}><Icon name="send" size={12}/> Cập nhật</button>
                  </div>
                </div>

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
                  <div className="tl-item approve">
                    <div className="tl-icon"><Icon name="user" size={11}/></div>
                    <div className="tl-body">
                      <span className="who">{exec.name}</span>
                      <span className="what"> nhận nhiệm vụ và đặt trạng thái </span>
                      <b>Đang thực hiện</b>
                      <div className="when">{task.startDate.split("-").reverse().join("/")} · 09:15</div>
                    </div>
                  </div>
                  <div className="tl-item create">
                    <div className="tl-icon"><Icon name="plus" size={11}/></div>
                    <div className="tl-body">
                      <span className="who">{mgr.name}</span>
                      <span className="what"> tạo nhiệm vụ và giao cho </span>
                      <b>{exec.name}</b>
                      <div className="when">{task.startDate.split("-").reverse().join("/")} · 08:30</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {tab === "files" && (
              <div style={{ padding: "20px 24px" }}>
                <div className="row wrap" style={{ gap: 10 }}>
                  {files.map((f, i) => (
                    <div key={i} className="file-chip">
                      <div className={`ftype ${f.type}`}>{f.type.toUpperCase()}</div>
                      <div><div>{f.name}</div></div>
                      <span className="meta">{f.size}</span>
                      <button className="icon-btn" style={{ width: 24, height: 24 }} onClick={() => flash(`Tải xuống ${f.name}`)}><Icon name="download" size={13}/></button>
                      <button className="icon-btn" style={{ width: 24, height: 24 }} onClick={() => { setFiles(arr => arr.filter((_, j) => j !== i)); flash("Đã xoá tài liệu"); }} title="Xoá"><Icon name="x" size={12}/></button>
                    </div>
                  ))}
                </div>
                <button className="btn ghost btn-sm" style={{ marginTop: 14 }} onClick={onPickFile}><Icon name="upload" size={12}/> Tải lên thêm</button>
              </div>
            )}

            {tab === "linked" && (
              <div style={{ padding: "20px 24px" }}>
                {[
                  { id: "PD-2026-0417", title: "Hợp đồng thuê tàu VINA OCEAN tuyến HPH–DAD", kind: "Phiếu phê duyệt" },
                  { id: "TK-087", title: "Đàm phán gia hạn HĐ với KH Petrolimex", kind: "Nhiệm vụ" },
                ].map(r => (
                  <div key={r.id} style={{ padding: "12px 0", borderBottom: "1px solid var(--line)", display: "flex", alignItems: "center", gap: 12, cursor: "pointer" }}>
                    <span style={{ width: 28, height: 28, borderRadius: 6, background: "var(--bg-sunken)", display: "grid", placeItems: "center", color: "var(--t-secondary)" }}>
                      <Icon name={r.kind === "Phiếu phê duyệt" ? "approval" : "task"} size={14}/>
                    </span>
                    <div style={{ flex: 1 }}>
                      <div className="row" style={{ gap: 6, marginBottom: 2 }}>
                        <span className="mono" style={{ fontSize: 11, color: "var(--t-tertiary)" }}>{r.id}</span>
                        <span style={{ width: 3, height: 3, borderRadius: 999, background: "var(--t-tertiary)" }}></span>
                        <span className="muted" style={{ fontSize: 11 }}>{r.kind}</span>
                      </div>
                      <div style={{ fontSize: 13, fontWeight: 500 }}>{r.title}</div>
                    </div>
                    <Icon name="chevron" size={14} className="ic muted"/>
                  </div>
                ))}
                <button className="btn ghost btn-sm" style={{ marginTop: 14 }} onClick={() => flash("Đã mở hộp thoại liên kết")}><Icon name="plus" size={12}/> Liên kết phiếu / nhiệm vụ</button>
              </div>
            )}
          </div>
        </div>

        {/* Side */}
        <aside style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div className="card">
            <div className="card-head"><h3>Phân công</h3></div>
            <div className="card-body" style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div>
                <div className="muted" style={{ fontSize: 10.5, textTransform: "uppercase", letterSpacing: 0.05, fontWeight: 600, marginBottom: 6 }}>Đầu mối thực hiện</div>
                <div className="av-inline">
                  <Avatar person={exec} size={32} />
                  <div>
                    <div style={{ fontSize: 13.5, fontWeight: 600 }}>{exec.name}</div>
                    <div className="muted" style={{ fontSize: 11 }}>{exec.role}</div>
                  </div>
                </div>
              </div>
              <div>
                <div className="muted" style={{ fontSize: 10.5, textTransform: "uppercase", letterSpacing: 0.05, fontWeight: 600, marginBottom: 6 }}>Người chỉ đạo</div>
                <div className="av-inline">
                  <Avatar person={mgr} size={32} />
                  <div>
                    <div style={{ fontSize: 13.5, fontWeight: 600 }}>{mgr.name}</div>
                    <div className="muted" style={{ fontSize: 11 }}>{mgr.role}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-head"><h3>Thời gian</h3></div>
            <div className="card-body">
              <div className="info-block">
                <div className="info-lbl">Bắt đầu</div>
                <div className="mono">{task.startDate.split("-").reverse().join("/")}</div>
              </div>
              <div className="info-block">
                <div className="info-lbl">Hạn</div>
                <div className="mono" style={{ color: isLate ? "var(--st-danger)" : "var(--t-primary)", fontWeight: isLate ? 600 : 500 }}>
                  {task.deadline.split("-").reverse().join("/")}
                  {isLate && <span style={{ marginLeft: 8, fontSize: 11, color: "var(--st-danger)" }}>· trễ 1 ngày</span>}
                </div>
              </div>
              <div className="info-block">
                <div className="info-lbl">Thời lượng</div>
                <div>
                  {Math.round((new Date(task.deadline) - new Date(task.startDate)) / (1000*60*60*24))} ngày
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-head"><h3>Người theo dõi</h3></div>
            <div className="card-body" style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {watchers.map(uid => {
                const p = personById(uid);
                return (
                  <div key={uid} className="av-inline" style={{ gap: 10 }}>
                    <Avatar person={p} size={26} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 500 }}>{p.name}</div>
                      <div className="muted" style={{ fontSize: 11 }}>{p.role}</div>
                    </div>
                    <button className="icon-btn" style={{ width: 22, height: 22 }} onClick={() => removeWatcher(uid)} title="Xoá"><Icon name="x" size={11}/></button>
                  </div>
                );
              })}
              {watchers.length === 0 && (
                <div className="muted" style={{ fontSize: 12, fontStyle: "italic" }}>Chưa có người theo dõi</div>
              )}
              <button className="btn btn-sm ghost" style={{ alignSelf: "flex-start" }} onClick={addWatcher}>
                <Icon name="plus" size={12}/> Thêm watcher
              </button>
            </div>
          </div>
        </aside>
      </div>

      {toast && (
        <div
          style={{
            position: "fixed", bottom: 28, left: "50%", transform: "translateX(-50%)",
            background: "var(--brand-ink)", color: "#fff", padding: "10px 18px",
            borderRadius: 999, fontSize: 13, fontWeight: 500, boxShadow: "0 8px 24px rgba(0,0,0,.22)",
            display: "flex", alignItems: "center", gap: 8, zIndex: 9999,
            animation: "toast-in .18s ease-out",
          }}
        >
          <Icon name="check" size={12}/> {toast}
        </div>
      )}
    </div>
  );
}

Object.assign(window, { CreateTaskScreen, TaskDetailPage, TaskAnalytics, GanttTimeline });
