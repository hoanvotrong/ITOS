/* OCC — Operations Command Center
   BOD view: timeline of vessels at buoy berths, tug + crane deployment,
   click any bar to inspect the underlying job-tàu detail. */

const OCC_ROW_H = 38;
// Trên điện thoại, cột tên 256px chiếm gần hết màn hình chỉ chừa được ~2 cột ngày —
// thu hẹp cột tên + cột ngày lại (tính 1 lần lúc tải; xoay ngang màn hình thì tải lại trang).
const OCC_IS_PHONE = typeof window !== "undefined" && window.matchMedia && window.matchMedia("(max-width: 640px)").matches;
const OCC_LEFT_W = OCC_IS_PHONE ? 132 : 256;  // sticky left column

// Timeline hiển thị đúng 1 tháng dương lịch mỗi lần, chọn được tháng nào
// tuỳ theo phạm vi data đã xuất ra (xem scripts/export-occ-data.ps1).
const OCC_DAY_W = OCC_IS_PHONE ? 32 : 36;

const occStatusMeta = {
  in_progress: { label: "Đang khai thác",     cls: "occ-bar-active",   badge: "success" },
  delayed:     { label: "Chậm tiến độ",       cls: "occ-bar-delayed",  badge: "danger" },
  planned:     { label: "Đã lên kế hoạch",    cls: "occ-bar-planned",  badge: "info" },
  completed:   { label: "Đã hoàn thành",      cls: "occ-bar-done",     badge: "neutral" },
};

/* === KPI strip — BOD numbers === */
function OCCKpis() {
  const inOp = OCC_JOBS.filter(j => j.status === "in_progress").length;
  const delayed = OCC_JOBS.filter(j => j.status === "delayed").length;
  const planned = OCC_JOBS.filter(j => j.status === "planned").length;
  const usedBerths = new Set(OCC_JOBS.filter(j => j.status === "in_progress" || j.status === "delayed").map(j => j.berthId)).size;
  const totalBerths = OCC_BERTHS.length;
  const tugsActive = OCC_TUGS.filter(t => t.status === "active").length;
  const tugsTotal = OCC_TUGS.length;
  const cranesActive = OCC_CRANES.filter(c => c.status === "active").length;
  const cranesTotal = OCC_CRANES.length;
  // Sản lượng tháng (tổng MT xếp/dỡ — số khối lượng các job đang & đã hoàn thành)
  const totalMT = OCC_JOBS
    .filter(j => j.status === "in_progress" || j.status === "completed" || j.status === "delayed")
    .reduce((sum, j) => sum + parseInt((j.cargo?.qty || "0").replace(/\D/g, ""), 10), 0);
  const tonnageDisp = (totalMT / 1000).toFixed(0) + " nghìn MT";
  return (
    <div className="kpi-grid kpi-grid-5">
      <div className="kpi">
        <div className="lbl"><span className="swatch" style={{ background: "var(--st-success)" }} /> Đang khai thác</div>
        <div className="val">{inOp}<small>tàu</small></div>
        <div className="delta">
          <Icon name="ship" size={12} /> {planned} đang chờ · {delayed} chậm
        </div>
      </div>
      <div className="kpi">
        <div className="lbl"><span className="swatch" style={{ background: "var(--st-info)" }} /> Sử dụng bến phao</div>
        <div className="val">{usedBerths}<small>/ {totalBerths}</small></div>
        <div className="delta">
          <Icon name="anchor" size={12} /> {Math.round(usedBerths/totalBerths*100)}% công suất
        </div>
      </div>
      <div className="kpi">
        <div className="lbl"><span className="swatch" style={{ background: "var(--brand-accent)" }} /> Tàu lai VNL</div>
        <div className="val">{tugsActive}<small>/ {tugsTotal}</small></div>
        <div className="delta">
          <Icon name="activity" size={12} /> 1 tàu bảo dưỡng định kỳ
        </div>
      </div>
      <div className="kpi">
        <div className="lbl"><span className="swatch" style={{ background: "#7C5BE0" }} /> ICD</div>
        <div className="val">{cranesActive}<small>/ {cranesTotal}</small></div>
        <div className="delta">
          <Icon name="crane" size={12} /> ICD-VNL06 sửa chữa từ 18/05
        </div>
      </div>
      <div className="kpi">
        <div className="lbl"><span className="swatch" style={{ background: "var(--brand-ink)" }} /> Sản lượng tháng</div>
        <div className="val" style={{ fontSize: 24 }}>{tonnageDisp}</div>
        <div className="delta up"><Icon name="arrowUp" size={12}/> +8,2% so tháng trước</div>
      </div>
    </div>
  );
}

/* === Time ruler at top of gantt === */
function OCCRuler({ days, totalDays, dayW }) {
  return (
    <div className="occ-ruler" style={{ width: totalDays * dayW }}>
      {days.map(d => {
        const dt = occColToDate(d);
        return (
          <div key={d} className={`occ-ruler-day ${d === OCC_WINDOW.todayCol ? "today" : ""}`} style={{ width: dayW }}>
            <div className="d-num">{dt.getUTCDate()}{dt.getUTCDate() === 1 ? `/${dt.getUTCMonth() + 1}` : ""}</div>
            <div className="d-dow">{["CN","T2","T3","T4","T5","T6","T7"][dt.getUTCDay()]}</div>
          </div>
        );
      })}
    </div>
  );
}

/* === Gantt section (rows of bars) === */
function GanttSection({ title, sub, icon, rows, jobs, onSelectJob, onOpenRoster, totalDays, win, dayW, headWidth }) {
  const startDay = win.startDay;
  const nowFrac = win.todayCol + win.todayHour / 24;
  // Build bars per row
  const barsFor = (rowId, rowType) => {
    if (rowType === "berth") return jobs.filter(j => j.berthId === rowId);
    if (rowType === "tug") {
      // For tugs: granular OCC_TUG_TASKS is the source of truth.
      // Each task is short (15min-3h); 5-10 per active tug per day.
      const tasks = OCC_TUG_TASKS.filter(t => t.tugId === rowId);
      return tasks.map(t => {
        const linkedJob = t.linkJobId ? OCC_JOBS.find(j => j.id === t.linkJobId) : null;
        const linkedDvhh = t.dvhhId ? OCC_DVHH.find(d => d.id === t.dvhhId) : null;
        return {
          ...t,
          _resFrom: t.from, _resTo: t.to,
          _resRole: OCC_TUG_TASK_TYPES[t.type]?.label || t.type,
          _typeColor: OCC_TUG_TASK_TYPES[t.type]?.color,
          _isTugTask: true,
          _linkedJob: linkedJob,
          _linkedDvhh: linkedDvhh,
          vessel: { name: t.vessel },
          start: t.from, end: t.to,
          progress: t.status === "done" ? 100 : (t.status === "in_progress" ? 50 : 0),
        };
      });
    }
    // For cranes: collect resource bookings from each job
    const bookings = [];
    OCC_JOBS.forEach(job => {
      (job.resources || []).forEach(r => {
        if (r.id === rowId) {
          bookings.push({ ...job, _resFrom: r.from, _resTo: r.to, _resRole: r.role });
        }
      });
    });
    return bookings;
  };

  // For a resource row: figure out what it's doing right now (or next)
  const serviceLineFor = (row, bars) => {
    if (row.type === "berth") return null;
    if (row.statusDot === "maint") {
      return { kind: "maint", text: "Bảo dưỡng định kỳ" };
    }
    const now = bars.find(b => {
      const s = occDayFrac(b._resFrom);
      const e = occDayFrac(b._resTo);
      return s != null && e != null && s <= nowFrac && e >= nowFrac;
    });
    if (now) {
      return {
        kind: "now",
        vessel: now.vessel?.name || now.title,
        role: now._resRole,
        jobId: now._linkedJob?.id || (now._isTugTask ? null : now.id),
        dvhh: now._linkedDvhh || (now._isDVHH ? now : null),
      };
    }
    const upcoming = bars
      .filter(b => occDayFrac(b._resFrom) > nowFrac)
      .sort((a, b) => a._resFrom.localeCompare(b._resFrom))[0];
    if (upcoming) {
      const f = occDayFrac(upcoming._resFrom);
      const col = Math.floor(f);
      const hour = Math.floor((f - col) * 24);
      const minute = Math.round(((f - col) * 24 - hour) * 60);
      const dt = occColToDate(col);
      return {
        kind: "next",
        vessel: upcoming.vessel?.name || upcoming.title,
        when: `${String(dt.getUTCDate()).padStart(2, "0")}/${String(dt.getUTCMonth() + 1).padStart(2, "0")} · ${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`,
        role: upcoming._resRole,
        jobId: upcoming._linkedJob?.id || (upcoming._isTugTask ? null : upcoming.id),
        dvhh: upcoming._linkedDvhh || (upcoming._isDVHH ? upcoming : null),
      };
    }
    return { kind: "free", text: "Sẵn sàng · chưa có lịch" };
  };

  // For tugs: today's task count + total active hours (utilization summary)
  const todayStatsFor = (bars) => {
    const todayBars = bars.filter(b => Math.floor(occDayFrac(b._resFrom)) === win.todayCol);
    const totalHours = todayBars.reduce((sum, b) => {
      const s = occDayFrac(b._resFrom);
      const e = occDayFrac(b._resTo);
      return sum + (e - s) * 24;
    }, 0);
    return { count: todayBars.length, hours: totalHours, todayBars };
  };

  return (
    <div className="occ-gantt-section">
      {/* headWidth = độ rộng vùng nhìn thấy: kết hợp sticky left:0 giúp cả tiêu đề
          nhóm lẫn badge "N đối tượng" (flex-end) luôn nằm trong khung nhìn khi cuộn ngang */}
      <div className="occ-gantt-section-head" style={headWidth ? { width: headWidth } : undefined}>
        <div className="row" style={{ gap: 8 }}>
          <span className="occ-section-icon"><Icon name={icon} size={14}/></span>
          <div>
            <b>{title}</b>
            <span className="muted" style={{ fontSize: 11.5, marginLeft: 6 }}>{sub}</span>
          </div>
        </div>
        <span className="tag">{rows.length} đối tượng</span>
      </div>

      {rows.map((row, idx) => {
        const bars = barsFor(row.id, row.type);
        const svc = serviceLineFor(row, bars);
        const isResource = row.type !== "berth";
        const isTug = row.type === "tug";
        const today = isTug ? todayStatsFor(bars) : null;
        const rowH = isResource ? OCC_ROW_H + 18 : OCC_ROW_H;
        return (
          <div key={row.id} className="occ-gantt-row" style={{ height: rowH }}>
            <div className="occ-gantt-left" style={{ width: OCC_LEFT_W, flex: `0 0 ${OCC_LEFT_W}px` }}>
              <div className="occ-res-label">
                <div className="row" style={{ gap: 6 }}>
                  <b>{row.label}</b>
                  {row.statusDot && <span className={`occ-status-dot ${row.statusDot}`} title={row.statusTitle}></span>}
                  <span className="muted" style={{ fontSize: 10.5 }}>{row.sub}</span>
                </div>
                {/* Tug: today's stats + utilization meter (clickable to open roster) */}
                {isTug && today && today.count > 0 && (
                  <div
                    className="occ-tug-today"
                    onClick={(e) => onOpenRoster(e, row, win.todayCol, today.todayBars)}
                    title="Xem lịch chi tiết hôm nay"
                  >
                    <div className="occ-tug-today-line">
                      <b>{today.count}</b> việc hôm nay
                      <span className="muted"> · {today.hours.toFixed(1)}h</span>
                      <Icon name="chevron" size={10} className="cv"/>
                    </div>
                    <div className="occ-util-meter" title={`${Math.round(today.hours/24*100)}% công suất`}>
                      <div className="occ-util-bar" style={{ width: `${Math.min(100, today.hours/24*100)}%` }}/>
                    </div>
                  </div>
                )}
                {/* Crane / non-busy tug: regular service line */}
                {(!isTug || !today || today.count === 0) && svc && (
                  <div
                    className={`occ-service-line ${svc.kind}`}
                    onClick={() => {
                      if (svc.jobId) onSelectJob(svc.jobId, null);
                      else if (svc.dvhh) onSelectJob(null, svc.dvhh);
                    }}
                    style={{ cursor: (svc.jobId || svc.dvhh) ? "pointer" : "default" }}
                    title={svc.role || ""}
                  >
                    {svc.kind === "now"   && <><span className="dot pulse"></span>→ <b>{svc.vessel}</b></>}
                    {svc.kind === "next"  && <><span className="dot next"></span>Tiếp: <b>{svc.vessel}</b> · <span className="when">{svc.when}</span></>}
                    {svc.kind === "free"  && <><span className="dot free"></span>{svc.text}</>}
                    {svc.kind === "maint" && <><span className="dot maint"></span>{svc.text}</>}
                  </div>
                )}
              </div>
            </div>
            <div className="occ-gantt-track" style={{ width: totalDays * dayW }}>
              {/* Day grid lines + (for tugs) clickable day cells */}
              {Array.from({ length: totalDays }).map((_, i) => {
                const dayNum = startDay + i;
                let dayTasks = null;
                if (isTug) {
                  dayTasks = bars.filter(b => Math.floor(occDayFrac(b._resFrom)) === dayNum);
                }
                return (
                  <div
                    key={i}
                    className={`occ-grid-line ${dayNum === win.todayCol ? "today" : ""} ${isTug && dayTasks?.length > 0 ? "tug-day" : ""}`}
                    style={{ left: i * dayW, width: dayW }}
                    onClick={isTug && dayTasks?.length > 0 ? (e) => onOpenRoster(e, row, dayNum, dayTasks) : undefined}
                  >
                    {isTug && dayTasks && dayTasks.length >= 3 && (
                      <span className="occ-day-count" title={`${dayTasks.length} task — bấm để xem`}>
                        ● {dayTasks.length}
                      </span>
                    )}
                  </div>
                );
              })}
              {/* Maintenance bands */}
              {row.maintenance && row.maintenance.map((m, i) => {
                const fL = (m.startFrac - startDay) * dayW;
                const fW = (m.endFrac - m.startFrac) * dayW;
                if (fL + fW < 0 || fL > totalDays * dayW) return null;
                return <div key={`m${i}`} className="occ-maint-band" style={{ left: fL, width: fW }} title="Bảo dưỡng"></div>;
              })}
              {/* Bars — tính hình học 1 lần cho mỗi bar; các task ngắn (pip) cùng ngày
                  của cùng 1 hàng được GỘP thành 1 điểm đánh dấu duy nhất kèm số đếm,
                  tránh cảnh nhiều pip đè khít lên nhau khi 1 tàu lai có nhiều task/ngày
                  (dữ liệu thật có thể lên tới vài chục task/tháng cho 1 tàu). */}
              {(() => {
                const geo = bars.map((b, i) => {
                  const s = occDayFrac(b._resFrom || b.start);
                  const e = occDayFrac(b._resTo || b.end);
                  if (s == null || e == null) return null;
                  let left = (s - startDay) * dayW;
                  let width = Math.max(4, (e - s) * dayW);
                  if (left + width < 0 || left > totalDays * dayW) return null;
                  // Clip bars that start before the visible window so they don't slip under the sticky left panel
                  const clippedLeft = left < 0;
                  if (clippedLeft) { width += left; left = 0; }
                  // Cắt phần tràn qua NGÀY CUỐI THÁNG đang xem — job kéo dài sang tháng sau
                  // chỉ vẽ tới hết cột ngày cuối, không tràn ra ngoài lưới tháng.
                  const clippedRight = left + width > totalDays * dayW;
                  if (clippedRight) { width = totalDays * dayW - left; }
                  if (width < 3) return null;
                  // Ngưỡng 40px (không phải 14px): bar hẹp hơn mức đó không đủ chỗ hiện tên
                  // tàu (label bị ellipsis về rỗng), chỉ còn khung viền trống (dashed cho status
                  // "planned") trông như lỗi hiển thị — nên gộp về pip/cluster thay vì vẽ dở dang.
                  return { b, i, s, left, width, clippedLeft, clippedRight, isPip: isTug && width < 40 };
                }).filter(Boolean);

                // Pip đã bắt đầu TRƯỚC khu vực đang xem (clippedLeft) thì bỏ hẳn, không kẹp
                // về mép trái rồi cố nhồi vào — nhồi kiểu đó làm nhiều ngày khác nhau (mỗi
                // ngày bị kẹp về cùng 1 vị trí left=0) chồng đè lên nhau thành 1 đống số ở
                // mép trái. Job/DVHH (bar thường) vẫn giữ nguyên kiểu "clip-left" vì đó là
                // 1 việc ĐANG diễn ra kéo dài qua biên, còn pip là các việc rời rạc ngắn hạn.
                const pipsByDay = {};
                geo.filter(g => g.isPip && !g.clippedLeft).forEach(g => {
                  const day = Math.floor(g.s);
                  (pipsByDay[day] = pipsByDay[day] || []).push(g);
                });

                const pipEls = Object.keys(pipsByDay).map(dayKey => {
                  const day = Number(dayKey);
                  const group = pipsByDay[dayKey];
                  const left = Math.min(...group.map(g => g.left));
                  if (group.length === 1) {
                    const g = group[0], b = g.b;
                    return (
                      <div key={`pip${day}`}
                        className={`occ-pip occ-pip-${b.status || "planned"}`}
                        style={{ left: g.left + g.width / 2 - 2, background: b._typeColor }}
                        onClick={(ev) => {
                          ev.stopPropagation();
                          if (b._linkedJob) onSelectJob(b._linkedJob.id, null);
                          else if (b._linkedDvhh) onSelectJob(null, b._linkedDvhh);
                          else onOpenRoster(ev, row, day, bars.filter(x => Math.floor(occDayFrac(x._resFrom)) === day));
                        }}
                        title={`${b.vessel?.name || b.title} · ${b._resRole} (${b._resFrom.slice(11)} → ${b._resTo.slice(11)})`}
                      />
                    );
                  }
                  const anyInProgress = group.some(g => g.b.status === "in_progress");
                  const allDone = group.every(g => g.b.status === "done");
                  const clusterStatus = anyInProgress ? "in_progress" : allDone ? "done" : "planned";
                  return (
                    <div key={`pipc${day}`}
                      className={`occ-pip-cluster occ-pip-${clusterStatus}`}
                      style={{ left }}
                      onClick={(ev) => { ev.stopPropagation(); onOpenRoster(ev, row, day, group.map(g => g.b)); }}
                      title={`${group.length} việc trong ngày — bấm để xem chi tiết`}
                    >{group.length}</div>
                  );
                });

                const barEls = geo.filter(g => !g.isPip).map(({ b, i, left, width, clippedLeft, clippedRight }) => {
                  const meta = occStatusMeta[b.status] || occStatusMeta.planned;
                  const vesselName = b.vessel?.name || b.title;
                  return (
                    <div
                      key={`b${i}`}
                      className={`occ-bar ${meta.cls} ${isResource ? "thin" : ""} ${row.type === "crane" ? "is-crane" : ""} ${row.type === "tug" ? "is-tug" : ""} ${clippedLeft ? "clip-left" : ""} ${clippedRight ? "clip-right" : ""}`}
                      style={{ left, width }}
                      onClick={(ev) => {
                        ev.stopPropagation();
                        if (b._linkedJob) onSelectJob(b._linkedJob.id, null);
                        else if (b._linkedDvhh) onSelectJob(null, b._linkedDvhh);
                        else if (b._isTugTask) onOpenRoster(ev, row, Math.floor(occDayFrac(b._resFrom || b.start)), bars.filter(x => Math.floor(occDayFrac(x._resFrom)) === Math.floor(occDayFrac(b._resFrom || b.start))));
                        else onSelectJob(b._isDVHH ? null : b.id, b._isDVHH ? b : null);
                      }}
                      title={`${vesselName} · ${b._resRole || (b.cargo?.op + " — " + b.cargo?.name)}`}
                    >
                      {b.status === "in_progress" && !isResource && (
                        <div className="occ-bar-progress" style={{ width: `${b.progress}%` }} />
                      )}
                      <div className="occ-bar-label">
                        <b>{vesselName}</b>
                        {!isResource && b.cargo && (
                          <span className="muted">· {b.cargo.qty} · {b.cargo.op}</span>
                        )}
                        {isResource && <span className="muted">· {b._resRole}</span>}
                      </div>
                      {/* Outboard label for narrow resource bars (so vessel name is always readable) */}
                      {isResource && !isTug && width < 80 && (
                        <div className="occ-bar-outboard">
                          <b>{vesselName}</b>
                          <span className="muted">· {b._resRole}</span>
                        </div>
                      )}
                    </div>
                  );
                });

                return <>{barEls}{pipEls}</>;
              })()}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* === Job detail drawer === */
function OCCJobDrawer({ jobId, dvhh, onClose }) {
  const open = !!(jobId || dvhh);
  const job = jobId ? OCC_JOBS.find(j => j.id === jobId) : null;
  const meta = job ? occStatusMeta[job.status] : null;
  const pic = job ? personById(job.pic) : null;
  const berth = job ? OCC_BERTHS.find(b => b.id === job.berthId) : null;

  return (
    <>
      <div className={`drawer-overlay ${open ? "open" : ""}`} onClick={onClose} />
      <div className={`drawer wide ${open ? "open" : ""}`} style={{ width: 680 }}>
        {dvhh && (
          <>
            <div className="drawer-head">
              <div>
                <div className="muted mono" style={{ fontSize: 11 }}>{dvhh.id}</div>
                <h3>{dvhh.title}</h3>
              </div>
              <button className="icon-btn" onClick={onClose}><Icon name="x" size={16}/></button>
            </div>
            <div className="drawer-body" style={{ padding: 20 }}>
              <div className="row" style={{ gap: 8, marginBottom: 14 }}>
                <span className={`badge ${occStatusMeta[dvhh.status].badge}`}><span className="pip"></span>{occStatusMeta[dvhh.status].label}</span>
                <span className="tag">DVHH độc lập</span>
              </div>
              <div className="info-block"><span className="muted">Khách hàng</span><b>{dvhh.customer}</b></div>
              <div className="info-block"><span className="muted">Thời gian</span>
                <span><b>{dvhh.from.slice(11)}</b> → <b>{dvhh.to.slice(11)}</b> ngày {dvhh.from.slice(8,10)}/{dvhh.from.slice(5,7)}</span>
              </div>
              <div className="info-block"><span className="muted">Tàu lai</span>
                <div className="row" style={{ gap: 6, flexWrap: "wrap" }}>
                  {(OCC_DVHH.find(d => d.id === dvhh.id)?.tugs || []).map(t => (
                    <span key={t} className="tag" style={{ background: "var(--brand-accent-bg)", color: "var(--brand-accent)" }}>{t}</span>
                  ))}
                </div>
              </div>
                          </div>
          </>
        )}

        {job && (
          <>
            <div className="drawer-head">
              <div>
                <div className="row" style={{ gap: 6 }}>
                  <span className="mono muted" style={{ fontSize: 11 }}>{job.id}</span>
                  <span className={`badge ${meta.badge}`}><span className="pip"></span>{meta.label}</span>
                </div>
                <h3 style={{ marginTop: 4 }}>{job.vessel.name}</h3>
                <div className="muted" style={{ fontSize: 12, marginTop: 2 }}>
                  {job.vessel.flag} · {job.vessel.type} · {job.vessel.dwt} · LOA {job.vessel.loa} · IMO {job.vessel.imo}
                </div>
              </div>
              <button className="icon-btn" onClick={onClose}><Icon name="x" size={16}/></button>
            </div>

            <div className="drawer-body" style={{ padding: 0, overflowY: "auto" }}>
              {/* Hero: cargo + berth + progress */}
              <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--line)", background: "var(--bg-canvas)" }}>
                <div className="grid-3-eq" style={{ gap: 16 }}>
                  <div>
                    <div className="muted" style={{ fontSize: 10.5, textTransform: "uppercase", letterSpacing: 0.05, fontWeight: 600 }}>Bến phao</div>
                    <div style={{ fontWeight: 600, fontSize: 14, marginTop: 4 }}>{berth?.group}</div>
                    <div className="mono" style={{ fontSize: 12, color: "var(--brand-ink)", fontWeight: 600 }}>{berth?.label}{berth?.cap ? ` · ${berth.cap}` : ""}</div>
                  </div>
                  <div>
                    <div className="muted" style={{ fontSize: 10.5, textTransform: "uppercase", letterSpacing: 0.05, fontWeight: 600 }}>Hàng hoá</div>
                    <div style={{ fontWeight: 600, fontSize: 14, marginTop: 4 }}>{job.cargo.name}</div>
                    <div className="muted" style={{ fontSize: 12 }}>{job.cargo.qty} · {job.cargo.op}</div>
                  </div>
                  {job.contract && (
                    <div>
                      <div className="muted" style={{ fontSize: 10.5, textTransform: "uppercase", letterSpacing: 0.05, fontWeight: 600 }}>Hợp đồng</div>
                      <div style={{ fontWeight: 600, fontSize: 13.5, marginTop: 4, fontFamily: "var(--font-mono)" }}>{job.contract}</div>
                      <div className="muted" style={{ fontSize: 12 }}>Khách hàng đã ký</div>
                    </div>
                  )}
                </div>

                {/* Progress */}
                <div style={{ marginTop: 14 }}>
                  <div className="row between" style={{ marginBottom: 6 }}>
                    <span className="muted" style={{ fontSize: 12 }}>Tiến độ khai thác</span>
                    <b style={{ fontSize: 13, fontFamily: "var(--font-mono)" }}>{job.progress}%</b>
                  </div>
                  <div className={`progress-track ${job.status === "delayed" ? "late" : ""} ${job.status === "completed" ? "done" : ""}`}>
                    <div className="pbar" style={{ width: `${job.progress}%` }}></div>
                  </div>

                  {/* Sản lượng: tổng / đã làm / còn tồn — tách thành 3 ô riêng cho dễ đọc,
                      chỉ hiện khi job thật sự có số liệu làm hàng (ICDUploadingCargo). */}
                  {parseInt((job.qtyTotal || "0").replace(/\D/g, ""), 10) > 0 && (
                    <div className="grid-3-eq" style={{ gap: 8, marginTop: 10 }}>
                      {[
                        { lbl: "Tổng hàng",   val: job.qtyTotal,  color: "var(--t-primary)" },
                        { lbl: "Đã làm",      val: job.qtyFinish, color: "var(--st-success)" },
                        { lbl: "Còn tồn",     val: job.qtyRemain, color: "var(--brand-accent)" },
                      ].map(s => (
                        <div key={s.lbl} style={{ background: "var(--bg-surface)", border: "1px solid var(--line)", borderRadius: 6, padding: "8px 10px" }}>
                          <div className="muted" style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: 0.05, fontWeight: 600 }}>{s.lbl}</div>
                          <div style={{ fontSize: 15, fontWeight: 700, fontFamily: "var(--font-mono)", color: s.color, marginTop: 2 }}>{s.val}</div>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="row between" style={{ marginTop: 8, fontSize: 11.5, color: "var(--t-tertiary)" }}>
                    <span>ETA <b style={{ color: "var(--t-primary)" }}>{job.eta.slice(8,10)}/{job.eta.slice(5,7)} {job.eta.slice(11)}</b></span>
                    <span>ETD <b style={{ color: "var(--t-primary)" }}>{job.etd.slice(8,10)}/{job.etd.slice(5,7)} {job.etd.slice(11)}</b></span>
                  </div>
                </div>
              </div>

              {/* Risks */}
              {job.risks && job.risks.length > 0 && (
                <div style={{ padding: "12px 20px", borderBottom: "1px solid var(--line)" }}>
                  {job.risks.map((r, i) => (
                    <div key={i} className="occ-risk" style={{ borderLeftColor: r.level === "high" ? "var(--st-danger)" : "var(--st-warning)" }}>
                      <Icon name="alert" size={14} style={{ color: r.level === "high" ? "var(--st-danger)" : "var(--st-warning)", marginTop: 1 }}/>
                      <div>
                        <b style={{ fontSize: 12, color: r.level === "high" ? "var(--st-danger)" : "var(--st-warning)", textTransform: "uppercase", letterSpacing: 0.05 }}>
                          {r.level === "high" ? "Rủi ro cao" : "Cảnh báo"}
                        </b>
                        <div style={{ fontSize: 13, marginTop: 2 }}>{r.text}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Customer / PIC */}
              <div style={{ padding: "14px 20px", borderBottom: "1px solid var(--line)" }}>
                <div className="info-block"><span className="muted">Khách hàng</span><b>{job.customer}</b></div>
                <div className="info-block"><span className="muted">Phụ trách</span>
                  <div className="av-inline">
                    <Avatar person={pic} size={24}/>
                    <div>
                      <b>{pic?.name}</b>
                      <div className="muted" style={{ fontSize: 11 }}>{pic?.role}</div>
                    </div>
                  </div>
                </div>
                {job.notes && (
                  <div className="info-block"><span className="muted">Ghi chú điều hành</span><span>{job.notes}</span></div>
                )}
              </div>

              {/* KHAI THÁC — thiết bị khai thác (cẩu nổi/tàu đặt cẩu) + sản lượng từng ca.
                  Tách bạch với dịch vụ hàng hải (tàu lai) ở khối bên dưới. */}
              {job.cargoOps && job.cargoOps.length > 0 && (
                <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--line)" }}>
                  <h4 style={{ margin: "0 0 10px", fontSize: 13, fontWeight: 600 }}>
                    Khai thác — làm hàng
                    <span className="muted" style={{ fontWeight: 500, marginLeft: 6, fontSize: 12 }}>
                      ({job.cargoOps.length} ca · {job.equipment.length} thiết bị)
                    </span>
                  </h4>
                  {job.equipment.length > 0 && (
                    <div className="row" style={{ gap: 6, flexWrap: "wrap", marginBottom: 10 }}>
                      {job.equipment.map(e => (
                        <span key={e} className="tag mono" style={{ background: "#EFEBFB", color: "#7C5BE0" }}>
                          <Icon name="crane" size={11}/> {e}
                        </span>
                      ))}
                    </div>
                  )}
                  <table className="tbl" style={{ fontSize: 12 }}>
                    <thead>
                      <tr><th>Ca làm hàng</th><th>Thiết bị</th><th style={{ textAlign: "right" }}>Sản lượng</th></tr>
                    </thead>
                    <tbody>
                      {job.cargoOps.map((op, i) => (
                        <tr key={i}>
                          <td className="mono" style={{ fontSize: 11.5 }}>
                            {op.from.slice(8,10)}/{op.from.slice(5,7)} {op.from.slice(11)} → {op.to ? `${op.to.slice(8,10)}/${op.to.slice(5,7)} ${op.to.slice(11)}` : "…"}
                          </td>
                          <td className="mono" style={{ fontSize: 11.5, color: "#7C5BE0" }}>{op.device || "—"}</td>
                          <td className="mono" style={{ textAlign: "right", fontWeight: 600 }}>{op.qty}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* DỊCH VỤ HÀNG HẢI (DVHH) — cập/rời/shifting... của job này */}
              {job.services && job.services.filter(s => s.kind === "dvhh").length > 0 && (
                <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--line)" }}>
                  <h4 style={{ margin: "0 0 10px", fontSize: 13, fontWeight: 600 }}>
                    Dịch vụ hàng hải
                    <span className="muted" style={{ fontWeight: 500, marginLeft: 6, fontSize: 12 }}>
                      ({job.services.filter(s => s.kind === "dvhh").length} dịch vụ)
                    </span>
                  </h4>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    {job.services.filter(s => s.kind === "dvhh").map((s, i) => {
                      const m = occStatusMeta[s.status] || occStatusMeta.planned;
                      return (
                        <div key={i} className="row between" style={{ padding: "6px 10px", background: "var(--bg-canvas)", borderRadius: 6 }}>
                          <span style={{ fontSize: 12.5 }}>{s.label || "—"}</span>
                          <span className={`badge ${m.badge}`} style={{ height: 18, fontSize: 10 }}>
                            <span className="pip"></span>{m.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Nhật ký tàu lai — mỗi dòng là 1 LƯỢT hỗ trợ (cùng 1 tàu lai xuất hiện
                  nhiều lần), nên đếm theo lượt chứ không phải theo số thiết bị. */}
              <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--line)" }}>
                <h4 style={{ margin: "0 0 12px", fontSize: 13, fontWeight: 600, letterSpacing: -0.005 }}>
                  Nhật ký tàu lai
                  <span className="muted" style={{ fontWeight: 500, marginLeft: 6, fontSize: 12 }}>({job.resources.length})</span>
                </h4>
                <div className="occ-res-list">
                  {[...job.resources].sort((a, b) => (b.from || "").localeCompare(a.from || "")).map((r, i) => {
                    const typeMeta = {
                      tug:   { lbl: "Tàu lai",  icon: "ship",   tone: "var(--brand-accent)",   bg: "var(--brand-accent-bg)" },
                      crane: { lbl: "ICD",  icon: "crane",  tone: "#7C5BE0",               bg: "#EFEBFB" },
                      barge: { lbl: "Sà lan",   icon: "package",tone: "var(--st-info)",        bg: "var(--st-info-bg)" },
                    }[r.type];
                    return (
                      <div key={i} className="occ-res-row">
                        <div className="occ-res-type" style={{ background: typeMeta.bg, color: typeMeta.tone }}>
                          <Icon name={typeMeta.icon} size={14}/>
                        </div>
                        <div style={{ minWidth: 0, flex: 1 }}>
                          <div className="row" style={{ gap: 8 }}>
                            <b className="mono" style={{ fontSize: 13, color: typeMeta.tone }}>{r.id}</b>
                            <span className="muted" style={{ fontSize: 12 }}>{typeMeta.lbl}</span>
                          </div>
                          <div style={{ fontSize: 12, color: "var(--t-secondary)", marginTop: 2 }}>{r.role}</div>
                        </div>
                        <div style={{ textAlign: "right", fontSize: 11.5, fontFamily: "var(--font-mono)", color: "var(--t-secondary)" }}>
                          <div>{r.from.slice(8,10)}/{r.from.slice(5,7)} {r.from.slice(11)}</div>
                          <div>→ {r.to.slice(8,10)}/{r.to.slice(5,7)} {r.to.slice(11)}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Logs / timeline */}
              {job.logs.length > 0 && (
                <div style={{ padding: "16px 20px 20px" }}>
                  <h4 style={{ margin: "0 0 12px", fontSize: 13, fontWeight: 600 }}>Nhật ký khai thác</h4>
                  <div className="tl" style={{ padding: 0 }}>
                    {job.logs.map((log, i) => {
                      const p = personById(log.by);
                      return (
                        <div key={i} className="tl-item approve">
                          <div className="tl-icon"><Icon name="activity" size={12}/></div>
                          <div className="tl-body">
                            <div className="who">{p?.name} <span className="muted" style={{ fontWeight: 400 }}>· {p?.role}</span></div>
                            <div className="when">{log.at}</div>
                            <div className="quote" style={{ marginTop: 6 }}>{log.text}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
}

/* === Tug daily roster popover — shows all tasks for one tug on one day === */
function TugRoster({ roster, onClose, onSelectJob }) {
  if (!roster) return null;
  const { row, day, tasks, x, y } = roster;
  const rosterDate = occColToDate(day);   // ngày dương lịch thật của cột lưới "day" (day là offset, không phải ngày-trong-tháng)
  // Sort tasks by start time
  const sorted = [...tasks].sort((a, b) => a._resFrom.localeCompare(b._resFrom));
  const totalHours = sorted.reduce((sum, t) => sum + (occDayFrac(t._resTo) - occDayFrac(t._resFrom)) * 24, 0);
  const revenueNum = sorted.reduce((sum, t) => sum + parseInt((t.revenue || "0").replace(/\D/g, ""), 10), 0);
  const revenueDisp = (revenueNum / 1_000_000).toFixed(1) + " tr ₫";

  // Position the popover near the click but stay on screen
  const POP_W = 520;
  const POP_H = Math.min(620, 200 + sorted.length * 76);
  const margin = 16;
  const vw = window.innerWidth || 1400;
  const vh = window.innerHeight || 900;
  const left = Math.min(Math.max(margin, x - POP_W / 2), vw - POP_W - margin);
  const top = Math.min(Math.max(margin, y - 40), vh - POP_H - margin);

  return (
    <>
      <div className="occ-roster-backdrop" onClick={onClose}></div>
      <div className="occ-roster-pop" style={{ left, top, width: POP_W, maxHeight: POP_H }}>
        <div className="occ-roster-head">
          <div>
            <div className="row" style={{ gap: 6 }}>
              <span className="mono" style={{ fontSize: 14, fontWeight: 700, color: "var(--brand-accent)", letterSpacing: "-0.01em" }}>{row.id}</span>
              <span className="badge accent"><span className="pip"></span>Tàu lai DVHH</span>
            </div>
            <h3 style={{ margin: "4px 0 0", fontSize: 15, fontWeight: 600 }}>Lịch điều phối ngày {String(rosterDate.getUTCDate()).padStart(2,"0")}/{String(rosterDate.getUTCMonth()+1).padStart(2,"0")}/{rosterDate.getUTCFullYear()}</h3>
            <div className="muted" style={{ fontSize: 12, marginTop: 4 }}>
              <b>{sorted.length}</b> task · tổng <b>{totalHours.toFixed(1)} giờ khai thác</b>
            </div>
          </div>
          <button className="icon-btn" onClick={onClose}><Icon name="x" size={16}/></button>
        </div>

        {/* Mini day-strip showing all tasks on a 24h horizontal timeline */}
        <div className="occ-roster-strip">
          {Array.from({ length: 25 }).map((_, h) => (
            <span key={h} className="occ-roster-hr" style={{ left: `${h/24*100}%` }}>{String(h).padStart(2,"0")}</span>
          ))}
          {sorted.map(t => {
            const s = (occDayFrac(t._resFrom) - day) * 100;
            const w = ((occDayFrac(t._resTo) - occDayFrac(t._resFrom))) * 100;
            return (
              <div key={t.id}
                className={`occ-roster-strip-bar status-${t.status}`}
                style={{ left: `${s}%`, width: `${w}%`, background: t._typeColor }}
                title={`${t.vessel.name} · ${t._resRole}`}
              />
            );
          })}
          {/* "now" marker if today */}
          {day === OCC_WINDOW.todayCol && (
            <div className="occ-roster-now" style={{ left: `${(OCC_WINDOW.todayHour/24)*100}%` }} title="Hiện tại">
              <span>Hiện tại · {String(Math.floor(OCC_WINDOW.todayHour)).padStart(2,"0")}:{String(Math.round((OCC_WINDOW.todayHour%1)*60)).padStart(2,"0")}</span>
            </div>
          )}
        </div>

        <div className="occ-roster-body">
          {sorted.map((t, i) => {
            const linkedJob = t._linkedJob;
            const linkedDvhh = t._linkedDvhh;
            const clickable = !!(linkedJob || linkedDvhh);
            return (
              <div key={t.id}
                className={`occ-roster-row status-${t.status} ${clickable ? "clickable" : ""}`}
                onClick={() => {
                  if (linkedJob) onSelectJob(linkedJob.id, null);
                  else if (linkedDvhh) onSelectJob(null, linkedDvhh);
                }}
              >
                <div className="occ-roster-time">
                  <b>{t._resFrom.slice(11)}</b>
                  <span className="muted">→ {t._resTo.slice(11)}</span>
                  <div className="occ-roster-dur">{((occDayFrac(t._resTo)-occDayFrac(t._resFrom))*60).toFixed(0)} phút</div>
                </div>
                <div className="occ-roster-type" style={{ background: t._typeColor + "18", color: t._typeColor }}>
                  <Icon name={t.type === "rescue" ? "alert" : t.type === "tow_in" || t.type === "tow_out" ? "ship" : t.type === "shift" ? "arrowRight" : "anchor"} size={11}/>
                  {OCC_TUG_TASK_TYPES[t.type]?.label}
                </div>
                <div className="occ-roster-main">
                  <b>{t.vessel.name}</b>
                  <div className="muted">
                    {t.customer}
                    {t.berth && <span> · phao <b style={{ color: "var(--brand-ink)", fontFamily: "var(--font-mono)" }}>{t.berth}</b></span>}
                    {linkedJob && <span> · job <span className="mono" style={{ color: "var(--brand-ink)" }}>{linkedJob.id}</span></span>}
                  </div>
                </div>
                <div className="occ-roster-end">
                  <span className={`badge ${t.status === "done" ? "success" : t.status === "in_progress" ? "info" : "neutral"}`} style={{ height: 18, fontSize: 10 }}>
                    {t.status === "done" ? "Xong" : t.status === "in_progress" ? "Đang làm" : "Sắp tới"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

/* === Main screen === */
function OCCScreen() {
  const [selected, setSelected] = React.useState(null); // jobId
  const [selectedDvhh, setSelectedDvhh] = React.useState(null);
  const [filter, setFilter] = React.useState("all");   // all | berth | service
  const [roster, setRoster] = React.useState(null);    // tug daily roster popover

  const dayW = OCC_DAY_W;

  // Danh sách các tháng dương lịch thật mà data đã xuất ra bao phủ (dựa theo
  // OCC_WINDOW.refDate .. endDay), để chọn xem đúng 1 tháng cụ thể thay vì cuộn
  // theo cửa sổ ngày cố định.
  const monthOptions = React.useMemo(() => {
    const opts = [];
    const seen = {};
    for (let col = OCC_WINDOW.startDay; col <= OCC_WINDOW.endDay; col++) {
      const d = occColToDate(col);
      const key = `${d.getUTCFullYear()}-${d.getUTCMonth() + 1}`;
      if (!seen[key]) {
        seen[key] = true;
        opts.push({ key, year: d.getUTCFullYear(), month: d.getUTCMonth() + 1 });
      }
    }
    return opts;
  }, []);
  const defaultMonthKey = `${OCC_WINDOW.year}-${OCC_WINDOW.month}`;
  const [selectedMonth, setSelectedMonth] = React.useState(
    monthOptions.some(o => o.key === defaultMonthKey) ? defaultMonthKey : (monthOptions[monthOptions.length - 1]?.key || defaultMonthKey)
  );
  const monthIdx = Math.max(0, monthOptions.findIndex(o => o.key === selectedMonth));
  const { year: selYear, month: selMonthNum } = monthOptions[monthIdx] || { year: OCC_WINDOW.year, month: OCC_WINDOW.month };
  const daysInSelMonth = new Date(Date.UTC(selYear, selMonthNum, 0)).getUTCDate();
  const rawMonthStart = occColForDate(selYear, selMonthNum, 1);
  const rawMonthEnd = occColForDate(selYear, selMonthNum, daysInSelMonth);
  const monthStart = Math.max(OCC_WINDOW.startDay, rawMonthStart);
  const monthEnd = Math.min(OCC_WINDOW.endDay, rawMonthEnd);
  const win = { ...OCC_WINDOW, startDay: monthStart, endDay: monthEnd };
  const canGoPrevMonth = monthIdx > 0;
  const canGoNextMonth = monthIdx < monthOptions.length - 1;
  const days = Array.from({ length: win.endDay - win.startDay + 1 }, (_, i) => win.startDay + i);
  const totalDays = days.length;
  const todayLeft = (win.todayCol + win.todayHour/24 - win.startDay) * dayW;
  const todayInThisMonth = selYear === OCC_WINDOW.year && selMonthNum === OCC_WINDOW.month;

  // ---- Đồng bộ theo cuộn ngang của Gantt (tên tàu trong bar, chip HÔM NAY,
  // ---- độ rộng thanh tiêu đề nhóm) — cập nhật trực tiếp DOM khi scroll để mượt.
  const ganttScrollRef = React.useRef(null);
  const wantScrollToToday = React.useRef(false);
  const [headW, setHeadW] = React.useState(null);   // độ rộng vùng nhìn thấy — để ghim badge "N đối tượng" ở mép phải
  const [todayChip, setTodayChip] = React.useState(null); // null | "left" | "right"

  const centerToday = () => {
    const sc = ganttScrollRef.current;
    if (!sc) return;
    sc.scrollLeft = Math.max(0, todayLeft - (sc.clientWidth - OCC_LEFT_W) / 2);
  };
  const goToToday = () => {
    if (!todayInThisMonth) {
      wantScrollToToday.current = true;
      setSelectedMonth(`${OCC_WINDOW.year}-${OCC_WINDOW.month}`);
      return;
    }
    centerToday();
  };

  React.useEffect(() => {
    const sc = ganttScrollRef.current;
    if (!sc) return;
    const sync = () => {
      const x = sc.scrollLeft;
      // Tên tàu trong bar trượt theo để luôn đọc được khi đầu bar khuất sau cột trái
      sc.querySelectorAll(".occ-bar").forEach(bar => {
        const label = bar.querySelector(".occ-bar-label");
        if (!label) return;
        const bl = parseFloat(bar.style.left) || 0;
        const bw = parseFloat(bar.style.width) || 0;
        if (bw < 100) { label.style.transform = ""; return; }
        const shift = Math.max(0, Math.min(x - bl, bw - 80));
        label.style.transform = shift > 4 ? `translateX(${shift}px)` : "";
      });
      // Chip báo hướng HÔM NAY khi đường hôm nay ngoài vùng nhìn thấy / khác tháng
      let chip = null;
      if (!todayInThisMonth) {
        chip = (OCC_WINDOW.year * 12 + OCC_WINDOW.month) < (selYear * 12 + selMonthNum) ? "left" : "right";
      } else {
        const viewW = sc.clientWidth - OCC_LEFT_W;
        if (todayLeft < x) chip = "left";
        else if (todayLeft > x + viewW) chip = "right";
      }
      setTodayChip(prev => (prev === chip ? prev : chip));
    };
    const onResize = () => { setHeadW(sc.clientWidth); sync(); };
    onResize();
    sc.addEventListener("scroll", sync);
    window.addEventListener("resize", onResize);
    return () => { sc.removeEventListener("scroll", sync); window.removeEventListener("resize", onResize); };
  });

  React.useEffect(() => {
    if (wantScrollToToday.current && todayInThisMonth) {
      wantScrollToToday.current = false;
      centerToday();
    }
  });

  // Build rows for each section
  const berthRows = OCC_BERTHS.map(b => ({
    id: b.id, type: "berth",
    label: b.label,
    sub: b.cap,
  }));
  const tugRows = OCC_TUGS.map(t => ({
    id: t.id, type: "tug",
    label: t.id, sub: t.hp,
    statusDot: t.status === "maintenance" ? "maint" : "ok",
    statusTitle: t.status === "maintenance" ? "Bảo dưỡng định kỳ" : "Sẵn sàng",
    maintenance: t.status === "maintenance" ? [{ startFrac: win.startDay, endFrac: win.endDay+1 }] : null,
  }));
  const craneRows = OCC_CRANES.map(c => ({
    id: c.id, type: "crane",
    label: c.id, sub: c.cap,
    statusDot: c.status === "maintenance" ? "maint" : "ok",
    statusTitle: c.status === "maintenance" ? "Bảo dưỡng" : "Sẵn sàng",
    maintenance: c.status === "maintenance" ? [{ startFrac: win.startDay, endFrac: win.startDay + 5 }] : null,
  }));

  const openJob = (id, dv) => {
    if (dv) { setSelectedDvhh(dv); setSelected(null); }
    else    { setSelected(id);     setSelectedDvhh(null); }
    setRoster(null);
  };

  const openRoster = (ev, row, day, tasks) => {
    setRoster({
      row, day, tasks,
      x: ev?.clientX ?? window.innerWidth / 2,
      y: ev?.clientY ?? 200,
    });
  };

  const showBerths = filter === "all" || filter === "berth";
  const showServices = filter === "all" || filter === "service";

  // Header label for current window — startDay/endDay là cột lưới (offset), phải đổi
  // sang ngày dương lịch thật qua occColToDate vì cửa sổ có thể vắt qua nhiều tháng.
  const winStartDate = occColToDate(win.startDay);
  const winEndDate = occColToDate(win.endDay);
  const fmtDM = dt => `${String(dt.getUTCDate()).padStart(2,"0")}/${String(dt.getUTCMonth()+1).padStart(2,"0")}`;
  const rangeHeader = `${fmtDM(winStartDate)} → ${fmtDM(winEndDate)}/${winEndDate.getUTCFullYear()} · ${totalDays} ngày`;

  return (
    <div className="page" style={{ maxWidth: "none" }}>
      {/* Header */}
      <div className="page-head">
        <div>
          <div className="row" style={{ gap: 8, marginBottom: 4 }}>
            <span className="tag" style={{ background: "var(--bg-rail)", color: "#fff" }}>BOD VIEW</span>
            <span className="muted" style={{ fontSize: 12 }}>Cập nhật lúc {win.todayDate}/{String(win.month).padStart(2,"0")}/{win.year} · {String(Math.floor(win.todayHour)).padStart(2,"0")}:{String(Math.round((win.todayHour % 1) * 60)).padStart(2,"0")}</span>
          </div>
          <h1>OCC — Trung tâm Điều hành Vận hành</h1>
          <div className="sub">Theo dõi tổng thể bến phao, dịch vụ hàng hải, đội tàu lai & cẩu nổi (ICD) trên một timeline thống nhất.</div>
        </div>
        <div className="actions">
          <button className="btn ghost"><Icon name="download" size={14}/> Xuất báo cáo BOD</button>
          <button className="btn"><Icon name="refresh" size={14}/> Làm mới</button>
          <button className="btn primary"><Icon name="radar" size={14}/> Live monitor</button>
        </div>
      </div>

      <OCCKpis/>

      {/* Toolbar */}
      <div className="card" style={{ marginBottom: 16 }}>
        <div className="toolbar" style={{ borderBottom: "none", padding: "12px 16px" }}>
          <div className="seg">
            <button className={filter === "all" ? "on" : ""} onClick={() => setFilter("all")}>
              Tất cả <span className="count">{OCC_JOBS.length + OCC_DVHH.length}</span>
            </button>
            <button className={filter === "berth" ? "on" : ""} onClick={() => setFilter("berth")}>
              <Icon name="anchor" size={12}/> Bến phao <span className="count">{OCC_JOBS.length}</span>
            </button>
            <button className={filter === "service" ? "on" : ""} onClick={() => setFilter("service")}>
              <Icon name="ship" size={12}/> Tàu lai · ICD <span className="count">{OCC_TUGS.length + OCC_CRANES.length}</span>
            </button>
          </div>

          <div className="spacer"></div>

          {/* Legend */}
          <div className="row occ-legend">
            <span className="row" style={{ gap: 5 }}><i className="occ-leg-sw occ-bar-active"></i>Đang khai thác</span>
            <span className="row" style={{ gap: 5 }}><i className="occ-leg-sw occ-bar-delayed"></i>Chậm</span>
            <span className="row" style={{ gap: 5 }}><i className="occ-leg-sw occ-bar-planned"></i>Đã lên KH</span>
            <span className="row" style={{ gap: 5 }}><i className="occ-leg-sw occ-bar-done"></i>Hoàn thành</span>
          </div>

          <div style={{ width: 1, height: 22, background: "var(--line)" }}/>

          {/* Chọn xem đúng 1 tháng dương lịch, trong phạm vi tháng mà data đã xuất ra */}
          <div className="seg-bar">
            <button
              onClick={() => canGoPrevMonth && setSelectedMonth(monthOptions[monthIdx - 1].key)}
              disabled={!canGoPrevMonth}
              title="Tháng trước"
            >
              <Icon name="chevron" size={13} style={{ transform: "rotate(180deg)" }}/>
            </button>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              style={{ border: "none", background: "transparent", font: "inherit", fontSize: 12.5, fontWeight: 500, color: "var(--t-primary)", padding: "5px 6px", cursor: "pointer" }}
            >
              {monthOptions.map(o => (
                <option key={o.key} value={o.key}>Tháng {o.month}/{o.year}</option>
              ))}
            </select>
            <button
              onClick={() => canGoNextMonth && setSelectedMonth(monthOptions[monthIdx + 1].key)}
              disabled={!canGoNextMonth}
              title="Tháng sau"
            >
              <Icon name="chevron" size={13}/>
            </button>
          </div>

        </div>
      </div>

      {/* Gantt */}
      <div className="card occ-gantt-wrap">
        {/* Chip nổi: đường HÔM NAY đang nằm ngoài vùng nhìn thấy — bấm để nhảy về */}
        {todayChip === "left" && (
          <button className="occ-today-chip" style={{ left: OCC_LEFT_W + 10 }} onClick={goToToday}>◀ HÔM NAY</button>
        )}
        {todayChip === "right" && (
          <button className="occ-today-chip right" onClick={goToToday}>HÔM NAY ▶</button>
        )}
        <div className="occ-gantt-scroll" ref={ganttScrollRef}>
          <div className="occ-gantt-inner" style={{ width: OCC_LEFT_W + totalDays * dayW + 1 }}>
            {/* Sticky left header */}
            <div className="occ-gantt-corner" style={{ width: OCC_LEFT_W }}>
              <div>
                <b style={{ fontSize: 11.5, color: "var(--t-secondary)", textTransform: "uppercase", letterSpacing: 0.06 }}>Khai thác</b>
                <div className="muted" style={{ fontSize: 11 }}>{rangeHeader}</div>
              </div>
            </div>
            <div className="occ-ruler-wrap" style={{ width: totalDays * dayW, marginLeft: OCC_LEFT_W }}>
              <OCCRuler days={days} totalDays={totalDays} dayW={dayW}/>
            </div>

            {/* TODAY line — only render if today is in visible range */}
            {win.todayCol >= win.startDay && win.todayCol <= win.endDay && (
              <div className="occ-today-line" style={{ left: OCC_LEFT_W + todayLeft }}>
                <div className="occ-today-pin">HÔM NAY · {String(Math.floor(win.todayHour)).padStart(2,"0")}:{String(Math.round((win.todayHour % 1) * 60)).padStart(2,"0")}</div>
              </div>
            )}

            {showBerths && (
              <GanttSection
                title="Bến phao"
                sub="vessels at buoy berths"
                icon="anchor"
                rows={berthRows}
                jobs={OCC_JOBS}
                totalDays={totalDays}
                win={win}
                dayW={dayW}
                onSelectJob={openJob}
                onOpenRoster={openRoster}
                headWidth={headW}
              />
            )}

            {showServices && (
              <GanttSection
                title="Đội tàu lai — VNL"
                sub="tug deployments"
                icon="ship"
                rows={tugRows}
                jobs={OCC_JOBS}
                totalDays={totalDays}
                win={win}
                dayW={dayW}
                onSelectJob={openJob}
                onOpenRoster={openRoster}
                headWidth={headW}
              />
            )}

            {showServices && (
              <GanttSection
                title="Cẩu bờ - Đội ICD"
                sub="Ship-to-Shore"
                icon="crane"
                rows={craneRows}
                jobs={OCC_JOBS}
                totalDays={totalDays}
                win={win}
                dayW={dayW}
                onSelectJob={openJob}
                onOpenRoster={openRoster}
                headWidth={headW}
              />
            )}
          </div>
        </div>
      </div>

      {/* Bottom split: Active jobs list + Alerts */}
      <div className="grid-main-side-16" style={{ gap: 16, marginTop: 16 }}>
        <div className="card">
          <div className="card-head">
            <div>
              <h3>Job-tàu đang xử lý</h3>
              <div className="muted" style={{ fontSize: 12, marginTop: 2 }}>Sắp xếp theo thời gian bắt đầu</div>
            </div>
            <button className="btn ghost btn-sm">Xem tất cả <Icon name="arrowRight" size={11}/></button>
          </div>
          <div className="tbl-wrap">
            <table className="tbl">
              <thead>
                <tr>
                  <th>Job ID</th>
                  <th>Tàu / Hàng hoá</th>
                  <th>Bến phao</th>
                  <th>Tài nguyên</th>
                  <th>Tiến độ</th>
                  <th>Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {OCC_JOBS.filter(j => j.status !== "completed").slice(0, 6).map(j => {
                  const berth = OCC_BERTHS.find(b => b.id === j.berthId);
                  const tugs = j.resources.filter(r => r.type === "tug").length;
                  const cranes = j.resources.filter(r => r.type === "crane").length;
                  const barges = j.resources.filter(r => r.type === "barge").length;
                  const m = occStatusMeta[j.status];
                  return (
                    <tr key={j.id} onClick={() => openJob(j.id)} style={{ cursor: "pointer" }}>
                      <td className="id">{j.id}</td>
                      <td>
                        <div className="title">{j.vessel.name}</div>
                        <div className="sub">{j.cargo.qty} · {j.cargo.name}</div>
                      </td>
                      <td>
                        <span className="mono" style={{ fontSize: 12, color: "var(--brand-ink)", fontWeight: 600 }}>{berth?.label}</span>
                        <div className="sub">{berth?.group.replace("Bến phao ", "")}</div>
                      </td>
                      <td>
                        <div className="row" style={{ gap: 4 }}>
                          {tugs > 0 && <span className="tag" style={{ background: "var(--brand-accent-bg)", color: "var(--brand-accent)" }}><Icon name="ship" size={10}/> {tugs}</span>}
                          {cranes > 0 && <span className="tag" style={{ background: "#EFEBFB", color: "#7C5BE0" }}><Icon name="crane" size={10}/> {cranes}</span>}
                          {barges > 0 && <span className="tag" style={{ background: "var(--st-info-bg)", color: "var(--st-info)" }}><Icon name="package" size={10}/> {barges}</span>}
                        </div>
                      </td>
                      <td style={{ width: 130 }}>
                        <div className="row" style={{ gap: 6 }}>
                          <div className={`progress-track ${j.status === "delayed" ? "late" : ""}`} style={{ flex: 1, height: 6 }}>
                            <div className="pbar" style={{ width: `${j.progress}%` }}/>
                          </div>
                          <span className="mono" style={{ fontSize: 11, color: "var(--t-secondary)", minWidth: 28, textAlign: "right" }}>{j.progress}%</span>
                        </div>
                      </td>
                      <td><span className={`badge ${m.badge}`}><span className="pip"></span>{m.label}</span></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card">
          <div className="card-head">
            <h3>Cảnh báo & DVHH hôm nay</h3>
            <span className="badge danger"><span className="pip"></span>2 cần chú ý</span>
          </div>
          <div style={{ padding: 14, display: "flex", flexDirection: "column", gap: 10 }}>
            {OCC_JOBS.filter(j => j.risks && j.risks.length > 0).flatMap(j =>
              j.risks.map((r, i) => (
                <div key={`${j.id}-${i}`} className="occ-risk" style={{ borderLeftColor: r.level === "high" ? "var(--st-danger)" : "var(--st-warning)", margin: 0, cursor: "pointer" }} onClick={() => openJob(j.id)}>
                  <Icon name="alert" size={14} style={{ color: r.level === "high" ? "var(--st-danger)" : "var(--st-warning)" }}/>
                  <div>
                    <b style={{ fontSize: 11.5, color: r.level === "high" ? "var(--st-danger)" : "var(--st-warning)", textTransform: "uppercase", letterSpacing: 0.05 }}>
                      {r.level === "high" ? "Rủi ro cao" : "Cảnh báo"} · {j.id.slice(-3)}
                    </b>
                    <div style={{ fontSize: 12.5, marginTop: 3, color: "var(--t-primary)" }}>{j.vessel.name}</div>
                    <div style={{ fontSize: 12, color: "var(--t-secondary)", marginTop: 2 }}>{r.text}</div>
                  </div>
                </div>
              ))
            )}

            <div className="divider"></div>

            <div className="muted" style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: 0.06, fontWeight: 600 }}>DVHH độc lập trong ngày</div>
            {OCC_DVHH.filter(d => d.status !== "completed").map(d => (
              <div key={d.id} className="occ-dvhh-item" onClick={() => openJob(null, { ...d, vessel: { name: d.title }, _resFrom: d.from, _resTo: d.to })}>
                <div className="occ-dvhh-tugs">
                  {d.tugs.map(t => <span key={t} className="mono">{t.replace("DVHH-","")}</span>)}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <b style={{ fontSize: 13, display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{d.title}</b>
                  <div className="muted" style={{ fontSize: 11.5, marginTop: 2, fontFamily: "var(--font-mono)" }}>
                    {d.from.slice(8,10)}/{d.from.slice(5,7)} {d.from.slice(11)} → {d.to.slice(11)} · {d.customer}
                  </div>
                </div>
                <span className={`badge ${occStatusMeta[d.status].badge}`} style={{ height: 18, fontSize: 10.5 }}>
                  {occStatusMeta[d.status].label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <OCCJobDrawer jobId={selected} dvhh={selectedDvhh} onClose={() => { setSelected(null); setSelectedDvhh(null); }}/>
      <TugRoster roster={roster} onClose={() => setRoster(null)} onSelectJob={openJob}/>
    </div>
  );
}

window.OCCScreen = OCCScreen;

/* === OCC Module shell — sub-rail + topbar + main screen === */
function OCCModule() {
  const [view, setView] = React.useState("timeline");
  const [navOpen, setNavOpen] = React.useState(false);
  const [, tick] = React.useState(0);
  const selectView = (v) => { setView(v); setNavOpen(false); };

  // Đồng hồ "hiện tại" (đường kẻ HIỆN TẠI, badge Sắp tới/Đang làm, "Cập nhật lúc")
  // phải chạy theo giờ thật của trình duyệt, không đứng yên tại thời điểm chạy
  // script export — cập nhật OCC_WINDOW.todayCol/todayHour mỗi phút, tính lại từ
  // OCC_WINDOW.refDate (ngày dương lịch thật của cột lưới số 1). Chỉ áp dụng khi
  // "hôm nay" vẫn còn nằm trong cửa sổ data đã xuất (refDate .. refDate+endDay-1),
  // tránh trỏ ra ngoài lưới khi data đã cũ (lúc đó cần chạy lại script export).
  React.useEffect(() => {
    const syncClock = () => {
      const now = new Date();
      const [ry, rmo, rda] = OCC_WINDOW.refDate.split("-").map(Number);
      const refEpoch = Date.UTC(ry, rmo - 1, rda);
      const todayEpoch = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
      const dayOffset = Math.round((todayEpoch - refEpoch) / 86400000);
      const col = dayOffset + 1;
      if (col >= OCC_WINDOW.startDay && col <= OCC_WINDOW.endDay) {
        OCC_WINDOW.todayCol = col;
        OCC_WINDOW.todayDate = now.getDate();
        OCC_WINDOW.month = now.getMonth() + 1;
        OCC_WINDOW.year = now.getFullYear();
        OCC_WINDOW.todayHour = now.getHours() + now.getMinutes() / 60;
        tick(t => t + 1);
      }
    };
    syncClock();
    const id = setInterval(syncClock, 60000);
    return () => clearInterval(id);
  }, []);

  const win = OCC_WINDOW;
  const inOp = OCC_JOBS.filter(j => j.status === "in_progress").length;
  const delayed = OCC_JOBS.filter(j => j.status === "delayed").length;
  const planned = OCC_JOBS.filter(j => j.status === "planned").length;
  const usedBerths = new Set(OCC_JOBS.filter(j => j.status === "in_progress" || j.status === "delayed").map(j => j.berthId)).size;

  return (
    <div className="occ-shell">
      <aside className={`occ-side ${navOpen ? "mobile-open" : ""}`}>
        <div className="occ-side-head">
          <span className="tag">OCC · BOD VIEW</span>
          <h2>Điều hành Vận hành</h2>
          <div className="sub">Bến phao · Tàu lai · ICD · Sà lan</div>
        </div>

        <div className="occ-side-section">Bảng điều khiển</div>
        <div className={`occ-side-item ${view === "timeline" ? "active" : ""}`} onClick={() => selectView("timeline")}>
          <Icon name="activity" size={16}/>
          <span>Timeline</span>
          <span className="count">{inOp + delayed}</span>
        </div>
        <div className={`occ-side-item ${view === "jobs" ? "active" : ""}`} onClick={() => selectView("jobs")}>
          <Icon name="ship" size={16}/>
          <span>Job-tàu</span>
          <span className="count">{OCC_JOBS.length}</span>
        </div>
        <div className={`occ-side-item ${view === "berths" ? "active" : ""}`} onClick={() => selectView("berths")}>
          <Icon name="anchor" size={16}/>
          <span>Bến phao</span>
          <span className="count">{OCC_BERTHS.length}</span>
        </div>

        <div className="occ-side-section">Tài sản khai thác</div>
        <div className={`occ-side-item ${view === "tugs" ? "active" : ""}`} onClick={() => selectView("tugs")}>
          <Icon name="ship" size={16}/>
          <span>Đội tàu lai VNL</span>
          <span className="count">{OCC_TUGS.length}</span>
        </div>
        <div className={`occ-side-item ${view === "cranes" ? "active" : ""}`} onClick={() => selectView("cranes")}>
          <Icon name="crane" size={16}/>
          <span>ICD (Cẩu nổi)</span>
          <span className="count">{OCC_CRANES.length}</span>
        </div>

        <div className="occ-side-section">Báo cáo</div>
        <div className="occ-side-item">
          <Icon name="document" size={16}/>
          <span>Báo cáo ngày</span>
        </div>
        <div className="occ-side-item">
          <Icon name="grid" size={16}/>
          <span>Sản lượng tháng</span>
        </div>

        <div style={{ flex: 1 }}></div>

        <div className="occ-side-stat">
          <div className="lbl">Tàu đang khai thác</div>
          <div className="val">{inOp}<small>tàu</small></div>
          <div className="footer">
            <Icon name="alert" size={12}/> {delayed} chậm · {planned} đang chờ
          </div>
        </div>

        <div className="occ-side-stat" style={{ background: "linear-gradient(135deg, var(--brand-accent), #B53D14)" }}>
          <div className="lbl">Bến phao sử dụng</div>
          <div className="val">{usedBerths}<small>/ {OCC_BERTHS.length}</small></div>
          <div className="footer">
            <Icon name="anchor" size={12}/> {Math.round(usedBerths / OCC_BERTHS.length * 100)}% công suất
          </div>
        </div>

      </aside>
      {navOpen && <div className="rail-backdrop" onClick={() => setNavOpen(false)} />}

      <main style={{ minWidth: 0, overflow: "hidden" }}>
        <Topbar
          crumbs={["Vinalogistics", "OCC — Điều hành Vận hành", { timeline: "Timeline", jobs: "Job-tàu", berths: "Bến phao", tugs: "Đội tàu lai", cranes: "ICD" }[view]]}
          onToggleNav={() => setNavOpen(o => !o)}
        />
        {view === "timeline" && <OCCScreen/>}
        {view === "jobs"     && <OCCJobsView/>}
        {view === "berths"   && <OCCBerthsView/>}
        {view === "tugs"     && <OCCFleetView kind="tug"/>}
        {view === "cranes"   && <OCCFleetView kind="crane"/>}
      </main>
    </div>
  );
}

/* ===== Alternate views ===== */

function OCCJobsView() {
  const [drawerJob, setDrawerJob] = React.useState(null);
  const groups = [
    { label: "Đang khai thác", items: OCC_JOBS.filter(j => j.status === "in_progress" || j.status === "delayed") },
    { label: "Đã lên kế hoạch",  items: OCC_JOBS.filter(j => j.status === "planned") },
    { label: "Hoàn thành",       items: OCC_JOBS.filter(j => j.status === "completed") },
  ];
  return (
    <div className="page" style={{ maxWidth: "none" }}>
      <div className="page-head">
        <div>
          <h1>Job-tàu</h1>
          <div className="sub">Danh sách chi tiết các job đang điều phối, sắp xếp theo trạng thái khai thác.</div>
        </div>
        <div className="actions">
          <button className="btn ghost"><Icon name="filter" size={14}/> Lọc</button>
          <button className="btn"><Icon name="download" size={14}/> Xuất Excel</button>
        </div>
      </div>

      {groups.map(g => (
        <div key={g.label} className="card" style={{ marginBottom: 16 }}>
          <div className="card-head">
            <h3>{g.label} <span className="muted" style={{ fontWeight: 500, marginLeft: 4 }}>({g.items.length})</span></h3>
          </div>
          <div className="tbl-wrap">
            <table className="tbl">
              <thead>
                <tr>
                  <th>Job ID</th>
                  <th>Tàu / Khách hàng</th>
                  <th>Bến phao</th>
                  <th>Hàng hoá</th>
                  <th>Bắt đầu</th>
                  <th>Kết thúc</th>
                  <th>Tài nguyên</th>
                  <th>Tiến độ</th>
                </tr>
              </thead>
              <tbody>
                {g.items.map(j => {
                  const berth = OCC_BERTHS.find(b => b.id === j.berthId);
                  const tugs = j.resources.filter(r => r.type === "tug");
                  const cranes = j.resources.filter(r => r.type === "crane");
                  const barges = j.resources.filter(r => r.type === "barge");
                  return (
                    <tr key={j.id} onClick={() => setDrawerJob(j.id)} style={{ cursor: "pointer" }}>
                      <td className="id">{j.id}</td>
                      <td>
                        <div className="title">{j.vessel.name}</div>
                        <div className="sub">{j.customer}</div>
                      </td>
                      <td>
                        <span className="mono" style={{ color: "var(--brand-ink)", fontWeight: 600 }}>{berth?.label}</span>
                        <div className="sub">{berth?.group.replace("Bến phao ", "")}</div>
                      </td>
                      <td>
                        <div>{j.cargo.qty}</div>
                        <div className="sub">{j.cargo.name} · {j.cargo.op}</div>
                        {parseInt((j.qtyTotal || "0").replace(/\D/g, ""), 10) > 0 && (
                          <div className="sub mono" style={{ fontSize: 10.5 }}>
                            đã làm <b style={{ color: "var(--st-success)" }}>{j.qtyFinish}</b> · còn <b style={{ color: "var(--brand-accent)" }}>{j.qtyRemain}</b>
                          </div>
                        )}
                      </td>
                      <td className="mono" style={{ fontSize: 12 }}>{j.start.slice(8,10)}/{j.start.slice(5,7)} {j.start.slice(11)}</td>
                      <td className="mono" style={{ fontSize: 12 }}>{j.end.slice(8,10)}/{j.end.slice(5,7)} {j.end.slice(11)}</td>
                      <td>
                        <div className="row" style={{ gap: 3, flexWrap: "wrap" }}>
                          {tugs.map((t, i) => <span key={`${t.id}-${i}`} className="tag mono" style={{ background: "var(--brand-accent-bg)", color: "var(--brand-accent)", fontSize: 10, height: 18 }}>{t.id}</span>)}
                          {cranes.map((c, i) => <span key={`${c.id}-${i}`} className="tag mono" style={{ background: "#EFEBFB", color: "#7C5BE0", fontSize: 10, height: 18 }}>{c.id}</span>)}
                          {barges.length > 0 && <span className="tag mono" style={{ background: "var(--st-info-bg)", color: "var(--st-info)", fontSize: 10, height: 18 }}>+{barges.length} sà lan</span>}
                        </div>
                      </td>
                      <td style={{ minWidth: 110 }}>
                        <div className="row" style={{ gap: 6 }}>
                          <div className={`progress-track ${j.status === "delayed" ? "late" : ""} ${j.status === "completed" ? "done" : ""}`} style={{ flex: 1, height: 5 }}>
                            <div className="pbar" style={{ width: `${j.progress}%` }}/>
                          </div>
                          <span className="mono" style={{ fontSize: 11, color: "var(--t-secondary)", minWidth: 28 }}>{j.progress}%</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ))}

      <OCCJobDrawer jobId={drawerJob} dvhh={null} onClose={() => setDrawerJob(null)} />
    </div>
  );
}

function OCCBerthsView() {
  return (
    <div className="page" style={{ maxWidth: "none" }}>
      <div className="page-head">
        <div>
          <h1>Bến phao</h1>
          <div className="sub">Tình trạng sử dụng các bến phao tại Lan Hạ, Hòn Gai, Cát Bà.</div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 14 }}>
        {OCC_BERTHS.map(b => {
          const currentJob = OCC_JOBS.find(j => j.berthId === b.id && (j.status === "in_progress" || j.status === "delayed"));
          const nextJob = OCC_JOBS.find(j => j.berthId === b.id && j.status === "planned");
          const isUsed = !!currentJob;
          return (
            <div key={b.id} className="card" style={{ padding: 16 }}>
              <div className="row between" style={{ marginBottom: 10 }}>
                <div>
                  <div className="muted" style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: 0.05, fontWeight: 600 }}>{b.group}</div>
                  <div style={{ fontSize: 20, fontWeight: 700, fontFamily: "var(--font-mono)", color: "var(--brand-ink)", letterSpacing: "-0.02em", marginTop: 4 }}>{b.label}</div>
                  {b.cap && <div className="muted" style={{ fontSize: 11.5 }}>Sức chứa: {b.cap}</div>}
                </div>
                <span className={`badge ${isUsed ? "success" : "neutral"}`}><span className="pip"></span>{isUsed ? "Đang dùng" : "Trống"}</span>
              </div>
              {currentJob && (
                <div style={{ padding: 10, background: "var(--bg-canvas)", borderRadius: 6, marginTop: 10 }}>
                  <div className="muted" style={{ fontSize: 10.5, textTransform: "uppercase", letterSpacing: 0.05, fontWeight: 600 }}>Tàu hiện tại</div>
                  <div style={{ fontWeight: 600, fontSize: 13.5, marginTop: 4 }}>{currentJob.vessel.name}</div>
                  <div className="muted" style={{ fontSize: 11.5, marginTop: 1 }}>{currentJob.cargo.qty} · {currentJob.cargo.op}</div>
                  <div className="row" style={{ marginTop: 8, gap: 6 }}>
                    <div className={`progress-track ${currentJob.status === "delayed" ? "late" : ""}`} style={{ flex: 1, height: 5 }}>
                      <div className="pbar" style={{ width: `${currentJob.progress}%` }}/>
                    </div>
                    <span className="mono" style={{ fontSize: 11, color: "var(--t-secondary)" }}>{currentJob.progress}%</span>
                  </div>
                </div>
              )}
              {!currentJob && nextJob && (
                <div style={{ padding: 10, background: "var(--bg-canvas)", borderRadius: 6, marginTop: 10, border: "1px dashed var(--line-strong)" }}>
                  <div className="muted" style={{ fontSize: 10.5, textTransform: "uppercase", letterSpacing: 0.05, fontWeight: 600 }}>Tàu sắp đến</div>
                  <div style={{ fontWeight: 600, fontSize: 13.5, marginTop: 4 }}>{nextJob.vessel.name}</div>
                  <div className="muted" style={{ fontSize: 11.5, marginTop: 1, fontFamily: "var(--font-mono)" }}>ETA {nextJob.eta.slice(8,10)}/{nextJob.eta.slice(5,7)} {nextJob.eta.slice(11)}</div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function OCCFleetView({ kind }) {
  const items = kind === "tug" ? OCC_TUGS : OCC_CRANES;
  const title = kind === "tug" ? "Đội tàu lai VNL" : "Đội ICD — Cẩu nổi";
  const sub = kind === "tug"
    ? "Đội tàu lai dịch vụ hàng hải — hỗ trợ cập phao, lai dắt, neo đậu."
    : "ICD — đội cẩu nổi phục vụ xếp/dỡ hàng tại bến phao và chuyển tải sà lan.";
  return (
    <div className="page" style={{ maxWidth: "none" }}>
      <div className="page-head">
        <div>
          <h1>{title}</h1>
          <div className="sub">{sub}</div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 14 }}>
        {(() => {
          const nowStr = `${OCC_WINDOW.year}-${String(OCC_WINDOW.month).padStart(2,"0")}-${String(OCC_WINDOW.todayDate).padStart(2,"0")} ${String(Math.floor(OCC_WINDOW.todayHour)).padStart(2,"0")}:${String(Math.round((OCC_WINDOW.todayHour % 1) * 60)).padStart(2,"0")}`;
          return items.map(it => {
          // Find all bookings for this asset
          const bookings = [];
          OCC_JOBS.forEach(j => {
            j.resources.forEach(r => {
              if (r.id === it.id) bookings.push({ ...r, jobId: j.id, vessel: j.vessel.name, status: j.status });
            });
          });
          if (kind === "tug") {
            OCC_DVHH.forEach(d => { if (d.tugs.includes(it.id)) bookings.push({ id: d.id, role: d.title, from: d.from, to: d.to, vessel: d.title, status: d.status }); });
          }
          bookings.sort((a, b) => a.from.localeCompare(b.from));
          const upcoming = bookings.filter(b => b.from > nowStr);
          const current = bookings.find(b => b.from <= nowStr && b.to >= nowStr);

          return (
            <div key={it.id} className="card" style={{ padding: 14 }}>
              <div className="row between" style={{ marginBottom: 12 }}>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 700, fontFamily: "var(--font-mono)", color: kind === "tug" ? "var(--brand-accent)" : "#7C5BE0", letterSpacing: "-0.01em" }}>{it.id}</div>
                  <div className="muted" style={{ fontSize: 11.5 }}>{kind === "tug" ? it.hp : it.cap}</div>
                </div>
                <span className={`badge ${it.status === "active" ? "success" : "warning"}`}><span className="pip"></span>{it.status === "active" ? "Sẵn sàng" : "Bảo dưỡng"}</span>
              </div>

              {current && (
                <div style={{ padding: 10, background: kind === "tug" ? "var(--brand-accent-bg)" : "#EFEBFB", borderRadius: 6, marginBottom: 8 }}>
                  <div style={{ fontSize: 10.5, textTransform: "uppercase", letterSpacing: 0.05, fontWeight: 700, color: kind === "tug" ? "var(--brand-accent)" : "#7C5BE0" }}>Đang triển khai</div>
                  <div style={{ fontWeight: 600, fontSize: 13, marginTop: 4 }}>{current.vessel}</div>
                  <div className="muted" style={{ fontSize: 11.5, marginTop: 1, fontFamily: "var(--font-mono)" }}>
                    {current.from.slice(8,10)}/{current.from.slice(5,7)} {current.from.slice(11)} → {current.to.slice(8,10)}/{current.to.slice(5,7)} {current.to.slice(11)}
                  </div>
                </div>
              )}

              {it.status === "maintenance" && (
                <div style={{ padding: 10, background: "var(--st-warning-bg)", borderRadius: 6, marginBottom: 8, fontSize: 12, color: "var(--st-warning)" }}>
                  <b>Bảo dưỡng định kỳ</b>
                  <div style={{ marginTop: 2, fontWeight: 400, color: "var(--st-warning)" }}>Dự kiến quay lại {kind === "tug" ? "25/05/2026" : "23/05/2026"}.</div>
                </div>
              )}

              {upcoming.length > 0 && (
                <>
                  <div className="muted" style={{ fontSize: 10.5, textTransform: "uppercase", letterSpacing: 0.05, fontWeight: 700, marginTop: 8, marginBottom: 6 }}>Lịch sắp tới · {upcoming.length}</div>
                  {upcoming.slice(0, 3).map((b, i) => (
                    <div key={i} className="row between" style={{ padding: "6px 0", borderTop: "1px solid var(--line)", fontSize: 12 }}>
                      <div style={{ minWidth: 0 }}>
                        <b style={{ display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{b.vessel}</b>
                        <div className="muted" style={{ fontSize: 10.5, fontFamily: "var(--font-mono)" }}>{b.from.slice(8,10)}/{b.from.slice(5,7)} {b.from.slice(11)}</div>
                      </div>
                    </div>
                  ))}
                </>
              )}

              {bookings.length === 0 && it.status === "active" && (
                <div className="muted" style={{ fontSize: 12, padding: 12, textAlign: "center", border: "1px dashed var(--line-strong)", borderRadius: 6 }}>
                  Chưa có lịch trong 14 ngày tới
                </div>
              )}
            </div>
          );
          });
        })()}
      </div>
    </div>
  );
}

window.OCCModule = OCCModule;