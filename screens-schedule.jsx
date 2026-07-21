/* Schedule module — Day / Week / Month + filters + modals */

const CALENDARS = [
  { id: "personal", label: "Lịch của tôi",     color: "#1E5FB7" },
  { id: "company",  label: "Lịch công ty",     color: "#0E2A47" },
  { id: "ops",      label: "Khai thác",        color: "#E85D2F" },
  { id: "training", label: "Đào tạo",          color: "#B45309" },
];

// Helper: convert "HH:MM" to fractional hour
const toFrac = (t) => {
  const [h, m] = t.split(":").map(Number);
  return h + m / 60;
};

const HOUR_HEIGHT = 48;   // px per hour in week/day view
const DAY_START = 6;
const DAY_END = 21;
const HOURS = Array.from({ length: DAY_END - DAY_START }, (_, i) => DAY_START + i);

const today = 20; // current "day" in May 2026
const dayOfWeekVN = ["CN","T2","T3","T4","T5","T6","T7"];

/* ===== Mini calendar ===== */
function MiniCalendar({ selectedDate, onPick }) {
  // May 2026 layout — May 1 is Friday (idx 5 / mon-start = 4)
  const monthStartIdx = 4;
  const cells = [];
  for (let i = 0; i < monthStartIdx; i++) cells.push({ d: 30 - (monthStartIdx - 1 - i), other: true });
  for (let d = 1; d <= 31; d++) cells.push({ d, other: false });
  while (cells.length < 42) {
    const start = cells[cells.length - 1].d + 1;
    cells.push({ d: cells.length - 35 - monthStartIdx - 31 + start + 1, other: true });
  }
  const dows = ["T2","T3","T4","T5","T6","T7","CN"];
  const datesWithEvents = new Set(SCHEDULE_EVENTS.map(e => e.date));
  return (
    <div className="mini-cal">
      <div className="mini-cal-head">
        <b>Tháng 5 · 2026</b>
        <div style={{ display: "flex", gap: 2 }}>
          <button className="icon-btn" style={{ width: 24, height: 24 }}><Icon name="chevron" size={12} style={{ transform: "rotate(180deg)" }}/></button>
          <button className="icon-btn" style={{ width: 24, height: 24 }}><Icon name="chevron" size={12}/></button>
        </div>
      </div>
      <div className="mini-cal-grid">
        {dows.map(d => <div key={d} className="dow">{d}</div>)}
        {cells.map((c, i) => (
          <div
            key={i}
            className={`d ${c.other ? "other" : ""} ${c.d === today && !c.other ? "today" : ""} ${c.d === selectedDate && !c.other ? "selected" : ""} ${!c.other && datesWithEvents.has(c.d) ? "has" : ""}`}
            onClick={() => !c.other && onPick(c.d)}
          >
            {c.d}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ===== Calendar filters ===== */
function CalFilters({ enabled, onToggle }) {
  return (
    <div className="card" style={{ padding: "12px 14px" }}>
      <div style={{ fontSize: 10.5, color: "var(--t-secondary)", textTransform: "uppercase", letterSpacing: 0.05, fontWeight: 600, marginBottom: 8 }}>Lịch</div>
      <div className="cal-filters">
        {CALENDARS.map(c => {
          const isOn = enabled.includes(c.id);
          const count = SCHEDULE_EVENTS.filter(e => e.cal === c.id).length;
          return (
            <div
              key={c.id}
              className={`cal-filter ${isOn ? "" : "off"}`}
              onClick={() => onToggle(c.id)}
              style={{ color: c.color }}
            >
              <span className="sw"></span>
              <span style={{ color: "var(--t-primary)" }}>{c.label}</span>
              <span className="ct">{count}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ===== Month view ===== */
function MonthView({ events, onClickEvent, onClickDate, selectedDate }) {
  const monthStartIdx = 4;
  const cells = [];
  for (let i = 0; i < monthStartIdx; i++) cells.push({ d: 30 - (monthStartIdx - 1 - i), other: true });
  for (let d = 1; d <= 31; d++) cells.push({ d, other: false });
  while (cells.length < 42) {
    const start = cells[cells.length - 1].d + 1;
    cells.push({ d: cells.length - 35 - monthStartIdx - 31 + start + 1, other: true });
  }
  const dows = ["T2","T3","T4","T5","T6","T7","CN"];
  return (
    <div className="cal-grid">
      {dows.map(d => <div key={d} className="cal-dow">{d}</div>)}
      {cells.map((c, i) => {
        const evs = c.other ? [] : events.filter(e => e.date === c.d);
        return (
          <div
            key={i}
            className={`cal-cell ${c.other ? "other" : ""} ${c.d === today && !c.other ? "today" : ""}`}
            onClick={() => !c.other && onClickDate(c.d)}
            style={{ cursor: c.other ? "default" : "pointer", minHeight: 110 }}
          >
            <div className="d">{c.d}</div>
            {evs.slice(0, 3).map((e, j) => (
              <div
                key={j}
                className={`ev tone-${e.tone}`}
                title={e.title}
                onClick={(ev) => { ev.stopPropagation(); onClickEvent(e); }}
              >
                <b style={{ fontWeight: 600 }}>{e.start}</b> {e.title}
              </div>
            ))}
            {evs.length > 3 && (
              <div className="muted" style={{ fontSize: 10, marginTop: 2, fontWeight: 500 }}>+{evs.length - 3} sự kiện khác</div>
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ===== Week view ===== */
function WeekView({ events, onClickEvent, onCreateAtSlot, weekStart }) {
  // weekStart is the day-of-month (Monday) — for May 2026 Monday May 18..24 etc.
  const days = Array.from({ length: 7 }, (_, i) => weekStart + i);
  const dowLabels = ["T2","T3","T4","T5","T6","T7","CN"];

  return (
    <div style={{ overflowX: "auto" }}>
      <div className="week-grid">
        {/* Header row */}
        <div className="week-time-label head"></div>
        {days.map((d, i) => (
          <div key={i} className={`week-day-head ${d === today ? "today" : ""}`}>
            <div className="dow">{dowLabels[i]}</div>
            <div className="dn">{d}</div>
          </div>
        ))}

        {/* Hour rows */}
        {HOURS.map(h => (
          <React.Fragment key={h}>
            <div className="week-time-label" style={{ height: HOUR_HEIGHT }}>{String(h).padStart(2, "0")}:00</div>
            {days.map((d, di) => (
              <div
                key={di}
                className={`week-cell ${d === today && h === Math.floor(toFrac("10:30")) ? "now-line" : ""}`}
                style={{ height: HOUR_HEIGHT }}
                onClick={() => onCreateAtSlot(d, h)}
              ></div>
            ))}
          </React.Fragment>
        ))}

        {/* Events absolutely positioned in each day column */}
        {days.map((d, di) => (
          <div
            key={`col-${di}`}
            className="week-col"
            style={{
              gridColumn: di + 2,
              gridRow: `2 / ${2 + HOURS.length}`,
              position: "relative",
            }}
          >
            {events.filter(e => e.date === d).map(e => {
              const top = (toFrac(e.start) - DAY_START) * HOUR_HEIGHT;
              const height = Math.max(28, (toFrac(e.end) - toFrac(e.start)) * HOUR_HEIGHT - 2);
              return (
                <div
                  key={e.id}
                  className={`week-event tone-${e.tone}`}
                  style={{ top, height }}
                  onClick={(evt) => { evt.stopPropagation(); onClickEvent(e); }}
                >
                  <b>{e.title}</b>
                  <div className="ev-time">{e.start}–{e.end}</div>
                  {height > 64 && e.attendees.length > 0 && (
                    <div className="ev-attendees avstack">
                      {e.attendees.slice(0, 4).map(a => <Avatar key={a} person={personById(a)} size={18} />)}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ===== Day view ===== */
function DayView({ events, onClickEvent, onCreateAtSlot, day }) {
  const evs = events.filter(e => e.date === day);

  return (
    <div>
      <div className="week-grid day">
        <div className="week-time-label head"></div>
        <div className={`week-day-head ${day === today ? "today" : ""}`}>
          <div className="dow">{dayOfWeekVN[(day + 4) % 7]} · 20 Tháng 5 2026</div>
          <div className="dn">{day}</div>
        </div>

        {HOURS.map(h => (
          <React.Fragment key={h}>
            <div className="week-time-label" style={{ height: HOUR_HEIGHT }}>{String(h).padStart(2, "0")}:00</div>
            <div
              className={`week-cell ${day === today && h === 10 ? "now-line" : ""}`}
              style={{ height: HOUR_HEIGHT }}
              onClick={() => onCreateAtSlot(day, h)}
            ></div>
          </React.Fragment>
        ))}

        <div
          className="week-col"
          style={{
            gridColumn: 2,
            gridRow: `2 / ${2 + HOURS.length}`,
            position: "relative",
          }}
        >
          {evs.map(e => {
            const top = (toFrac(e.start) - DAY_START) * HOUR_HEIGHT;
            const height = Math.max(36, (toFrac(e.end) - toFrac(e.start)) * HOUR_HEIGHT - 2);
            return (
              <div
                key={e.id}
                className={`week-event tone-${e.tone}`}
                style={{ top, height, padding: "8px 12px" }}
                onClick={() => onClickEvent(e)}
              >
                <b style={{ fontSize: 13 }}>{e.title}</b>
                <div className="ev-time" style={{ fontSize: 11.5, marginTop: 4 }}>
                  {e.start}–{e.end} · {e.location}
                </div>
                {height > 60 && (
                  <div className="ev-attendees" style={{ marginTop: 6, display: "flex", alignItems: "center", gap: 6 }}>
                    <div className="avstack">
                      {e.attendees.slice(0, 5).map(a => <Avatar key={a} person={personById(a)} size={20} />)}
                    </div>
                    {e.attendees.length > 5 && <span className="muted" style={{ fontSize: 11 }}>+{e.attendees.length - 5}</span>}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ===== Event detail modal ===== */
function EventDetailModal({ event, onClose, onEdit }) {
  if (!event) return null;
  const cal = CALENDARS.find(c => c.id === event.cal);
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-head">
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ width: 8, height: 8, borderRadius: 2, background: cal.color }}></span>
            <span style={{ fontSize: 11, color: "var(--t-secondary)", textTransform: "uppercase", letterSpacing: 0.04, fontWeight: 600 }}>{cal.label}</span>
          </div>
          <div className="row" style={{ gap: 4 }}>
            <button className="icon-btn"><Icon name="edit" size={14}/></button>
            <button className="icon-btn"><Icon name="trash" size={14}/></button>
            <button className="icon-btn" onClick={onClose}><Icon name="x" size={14}/></button>
          </div>
        </div>
        <div className="modal-body">
          <h2 style={{ fontSize: 18, fontWeight: 700, margin: "0 0 16px", letterSpacing: "-0.01em", lineHeight: 1.3 }}>{event.title}</h2>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 12, fontSize: 13 }}>
              <Icon name="clock" size={16} className="ic" style={{ color: "var(--t-secondary)", marginTop: 1 }}/>
              <div>
                <div style={{ fontWeight: 500 }}>{event.allDay ? "Cả ngày" : `${event.start}–${event.end}`}</div>
                <div className="muted" style={{ fontSize: 12, marginTop: 2 }}>Thứ 4, {event.date}/05/2026</div>
              </div>
            </div>
            {event.location && (
              <div style={{ display: "flex", alignItems: "flex-start", gap: 12, fontSize: 13 }}>
                <Icon name="flag" size={16} className="ic" style={{ color: "var(--t-secondary)", marginTop: 1 }}/>
                <div>{event.location}</div>
              </div>
            )}
            {event.desc && (
              <div style={{ display: "flex", alignItems: "flex-start", gap: 12, fontSize: 13 }}>
                <Icon name="document" size={16} className="ic" style={{ color: "var(--t-secondary)", marginTop: 1 }}/>
                <div>{event.desc}</div>
              </div>
            )}
            <div style={{ display: "flex", alignItems: "flex-start", gap: 12, fontSize: 13 }}>
              <Icon name="users" size={16} className="ic" style={{ color: "var(--t-secondary)", marginTop: 1 }}/>
              <div style={{ flex: 1 }}>
                <div className="muted" style={{ fontSize: 11, marginBottom: 6 }}>{event.attendees.length} người tham gia</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {event.attendees.map(a => {
                    const p = personById(a);
                    return (
                      <div key={a} className="av-inline">
                        <Avatar person={p} size={22} />
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 13, fontWeight: 500 }}>{p.name}</div>
                          <div className="muted" style={{ fontSize: 11 }}>{p.role}</div>
                        </div>
                        <span className="badge success" style={{ fontSize: 10 }}><Icon name="check" size={9}/>Có mặt</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 12, fontSize: 13 }}>
              <Icon name="bell" size={16} className="ic" style={{ color: "var(--t-secondary)", marginTop: 1 }}/>
              <div>Nhắc trước 15 phút</div>
            </div>
          </div>
        </div>
        <div className="modal-foot">
          <button className="btn ghost" onClick={onClose}>Đóng</button>
          <button className="btn"><Icon name="x" size={12}/> Vắng mặt</button>
          <button className="btn primary"><Icon name="check" size={12}/> Tham gia</button>
        </div>
      </div>
    </div>
  );
}

/* ===== Create event modal ===== */
function CreateEventModal({ open, onClose, initialDate, initialHour }) {
  if (!open) return null;
  const [form, setForm] = React.useState({
    title: "",
    cal: "personal",
    date: initialDate || today,
    start: initialHour ? `${String(initialHour).padStart(2, "0")}:00` : "09:00",
    end:   initialHour ? `${String(initialHour + 1).padStart(2, "0")}:00` : "10:00",
    location: "",
    desc: "",
    attendees: [],
    remind: "15",
  });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal wide" onClick={e => e.stopPropagation()}>
        <div className="modal-head">
          <h3>Tạo sự kiện mới</h3>
          <button className="icon-btn" onClick={onClose}><Icon name="x" size={14}/></button>
        </div>
        <div className="modal-body">
          <div className="field">
            <input
              className="input"
              autoFocus
              placeholder="Tiêu đề sự kiện"
              value={form.title}
              onChange={e => set("title", e.target.value)}
              style={{ fontSize: 16, fontWeight: 500, height: 44 }}
            />
          </div>

          <div className="field">
            <label>Lịch</label>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {CALENDARS.map(c => (
                <button
                  key={c.id}
                  className="btn btn-sm"
                  onClick={() => set("cal", c.id)}
                  style={{
                    borderColor: form.cal === c.id ? c.color : "var(--line-strong)",
                    background: form.cal === c.id ? `color-mix(in srgb, ${c.color} 10%, transparent)` : "var(--bg-surface)",
                    color: form.cal === c.id ? c.color : "var(--t-primary)",
                  }}
                >
                  <span style={{ width: 8, height: 8, borderRadius: 2, background: c.color }}></span>
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          <div className="field-row">
            <div className="field">
              <label>Ngày</label>
              <input className="input" type="text" value={`${form.date}/05/2026`} readOnly style={{ fontFamily: "var(--font-mono)" }}/>
            </div>
            <div className="field">
              <label>Giờ bắt đầu</label>
              <input className="input" type="time" value={form.start} onChange={e => set("start", e.target.value)} />
            </div>
            <div className="field">
              <label>Giờ kết thúc</label>
              <input className="input" type="time" value={form.end} onChange={e => set("end", e.target.value)} />
            </div>
          </div>

          <div className="field">
            <label>Địa điểm</label>
            <input
              className="input"
              placeholder="VD: P. họp lớn / VP Petrolimex / Online (Teams)"
              value={form.location}
              onChange={e => set("location", e.target.value)}
            />
          </div>

          <div className="field">
            <label>Người tham gia</label>
            <div className="watcher-chips">
              {form.attendees.map(w => {
                const p = personById(w);
                return (
                  <span key={w} className="watcher-chip">
                    <Avatar person={p} size={20} />
                    <span>{p.name}</span>
                    <button onClick={() => set("attendees", form.attendees.filter(x => x !== w))}>
                      <Icon name="x" size={11}/>
                    </button>
                  </span>
                );
              })}
              <input
                className="watcher-input"
                placeholder="Gõ tên để thêm…"
                list="people-list"
                onChange={e => {
                  const v = e.target.value;
                  const p = PEOPLE.find(x => x.name.toLowerCase().includes(v.toLowerCase()));
                  if (p && !form.attendees.includes(p.id)) {
                    set("attendees", [...form.attendees, p.id]);
                    e.target.value = "";
                  }
                }}
              />
              <datalist id="people-list">
                {PEOPLE.map(p => <option key={p.id} value={p.name} />)}
              </datalist>
            </div>
            <div className="hint">Thường dùng: {PEOPLE.slice(0, 5).map(p => p.short).join(" · ")}</div>
          </div>

          <div className="field-row">
            <div className="field">
              <label>Mô tả</label>
              <textarea
                className="textarea"
                rows={3}
                placeholder="Nội dung, agenda, link tài liệu…"
                value={form.desc}
                onChange={e => set("desc", e.target.value)}
              />
            </div>
          </div>

          <div className="field">
            <label>Nhắc trước</label>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {["5","15","30","60"].map(m => (
                <button
                  key={m}
                  className={`btn btn-sm ${form.remind === m ? "primary" : ""}`}
                  onClick={() => set("remind", m)}
                >{m} phút</button>
              ))}
              <button className={`btn btn-sm ${form.remind === "1440" ? "primary" : ""}`} onClick={() => set("remind", "1440")}>1 ngày trước</button>
            </div>
          </div>
        </div>
        <div className="modal-foot">
          <button className="btn ghost" onClick={onClose}>Huỷ</button>
          <button className="btn primary" disabled={!form.title.trim()}>
            <Icon name="check" size={12}/> Tạo sự kiện
          </button>
        </div>
      </div>
    </div>
  );
}

/* ===== Main schedule screen ===== */
function NewScheduleScreen() {
  const [view, setView] = React.useState("week");          // day | week | month
  const [enabled, setEnabled] = React.useState(["personal","company","ops","training"]);
  const [selectedDate, setSelectedDate] = React.useState(today);
  const [eventDetail, setEventDetail] = React.useState(null);
  const [createOpen, setCreateOpen] = React.useState(false);
  const [createInit, setCreateInit] = React.useState({ date: today, hour: 9 });

  const filteredEvents = SCHEDULE_EVENTS.filter(e => enabled.includes(e.cal));

  // For week view: find the Monday of week containing selectedDate.
  // May 2026: 18=Mon, 19=Tue ... so weekStart = selectedDate - (dayIdx)
  const dayOfWeek = (d) => {
    // May 1, 2026 is Friday (idx 5). So day d offset = (d - 1 + 5) % 7
    return (d - 1 + 5) % 7;
  };
  const monIdx = (d) => {
    const dow = dayOfWeek(d);
    return d - ((dow + 6) % 7); // shift so Mon = 0
  };
  const weekStart = monIdx(selectedDate);

  const openCreate = (date, hour) => {
    setCreateInit({ date: date || today, hour: hour || 9 });
    setCreateOpen(true);
  };

  const onClickDate = (d) => {
    setSelectedDate(d);
    setView("day");
  };

  return (
    <div className="page" style={{ paddingTop: 28 }}>
      <div className="page-head">
        <div>
          <h1>Lịch</h1>
          <div className="sub">Lịch cá nhân & lịch công ty · Tháng 5 / 2026 · Tuần 21</div>
        </div>
        <div className="actions">
          <div className="seg-bar">
            <button className={view === "day" ? "on" : ""} onClick={() => setView("day")}>Ngày</button>
            <button className={view === "week" ? "on" : ""} onClick={() => setView("week")}>Tuần</button>
            <button className={view === "month" ? "on" : ""} onClick={() => setView("month")}>Tháng</button>
          </div>
          <button className="btn accent" onClick={() => openCreate()}><Icon name="plus" size={14}/> Tạo sự kiện</button>
        </div>
      </div>

      <div className="cal-shell">
        {/* Left sidebar */}
        <aside style={{ display: "flex", flexDirection: "column", gap: 14, position: "sticky", top: 80 }}>
          <MiniCalendar selectedDate={selectedDate} onPick={setSelectedDate} />
          <CalFilters
            enabled={enabled}
            onToggle={(id) => setEnabled(en => en.includes(id) ? en.filter(x => x !== id) : [...en, id])}
          />
          <div className="card" style={{ padding: "12px 14px" }}>
            <div style={{ fontSize: 10.5, color: "var(--t-secondary)", textTransform: "uppercase", letterSpacing: 0.05, fontWeight: 600, marginBottom: 8 }}>Sắp tới</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {filteredEvents.filter(e => e.date >= today).slice(0, 4).map(e => (
                <div
                  key={e.id}
                  onClick={() => setEventDetail(e)}
                  style={{ display: "grid", gridTemplateColumns: "30px 1fr", gap: 8, cursor: "pointer", padding: "4px 0", borderBottom: "1px solid var(--line)" }}
                >
                  <div style={{ textAlign: "center" }}>
                    <div className="mono" style={{ fontSize: 9, color: "var(--t-tertiary)", textTransform: "uppercase" }}>T5</div>
                    <div className="mono" style={{ fontSize: 13, fontWeight: 600, lineHeight: 1.1 }}>{e.date}</div>
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 12.5, fontWeight: 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{e.title}</div>
                    <div className="muted" style={{ fontSize: 10.5 }}>{e.start}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* Main calendar */}
        <div className="card">
          {/* Toolbar */}
          <div className="toolbar" style={{ borderBottom: "1px solid var(--line)" }}>
            <button className="icon-btn" onClick={() => setSelectedDate(d => Math.max(1, d - (view === "week" ? 7 : 1)))}>
              <Icon name="chevron" size={16} style={{ transform: "rotate(180deg)" }}/>
            </button>
            <b style={{ fontSize: 15, minWidth: 160 }}>
              {view === "month" && "Tháng 5 · 2026"}
              {view === "week" && `Tuần: ${weekStart}–${weekStart + 6} / 5`}
              {view === "day" && `${selectedDate} Tháng 5, 2026 · ${dayOfWeekVN[(selectedDate + 4) % 7]}`}
            </b>
            <button className="icon-btn" onClick={() => setSelectedDate(d => Math.min(31, d + (view === "week" ? 7 : 1)))}>
              <Icon name="chevron" size={16}/>
            </button>
            <button className="btn btn-sm ghost" onClick={() => setSelectedDate(today)}>Hôm nay</button>
            <div className="spacer"></div>
            <div className="row" style={{ gap: 12, fontSize: 11, color: "var(--t-secondary)", flexWrap: "wrap" }}>
              {CALENDARS.filter(c => enabled.includes(c.id)).map(c => (
                <span key={c.id} className="row" style={{ gap: 5 }}>
                  <span style={{ width: 8, height: 8, borderRadius: 2, background: c.color }}></span>
                  {c.label}
                </span>
              ))}
            </div>
          </div>

          {view === "month" && (
            <MonthView
              events={filteredEvents}
              onClickEvent={setEventDetail}
              onClickDate={onClickDate}
              selectedDate={selectedDate}
            />
          )}
          {view === "week" && (
            <WeekView
              events={filteredEvents}
              weekStart={weekStart}
              onClickEvent={setEventDetail}
              onCreateAtSlot={openCreate}
            />
          )}
          {view === "day" && (
            <DayView
              events={filteredEvents}
              day={selectedDate}
              onClickEvent={setEventDetail}
              onCreateAtSlot={openCreate}
            />
          )}
        </div>
      </div>

      <EventDetailModal event={eventDetail} onClose={() => setEventDetail(null)} />
      <CreateEventModal open={createOpen} onClose={() => setCreateOpen(false)} initialDate={createInit.date} initialHour={createInit.hour} />
    </div>
  );
}

// Override the existing ScheduleScreen
window.ScheduleScreen = NewScheduleScreen;
