/* An Ninh — Đăng ký người: Danh sách + Chi tiết */

const STATUS_BADGE = {
  active:   { cls: "success", label: "ACTIVE" },
  pending:  { cls: "warning", label: "PENDING" },
  expired:  { cls: "neutral", label: "EXPIRED" },
  rejected: { cls: "danger",  label: "REJECTED" },
};

const PersonRegListScreen = ({ go }) => {
  const [tab, setTab] = React.useState("active");
  const counts = {
    active: PERSON_REGS.filter(r => r.status === "active").length,
    pending: PERSON_REGS.filter(r => r.status === "pending").length,
    expired: PERSON_REGS.filter(r => r.status === "expired").length,
    rejected: PERSON_REGS.filter(r => r.status === "rejected").length,
  };
  const visible = PERSON_REGS.filter(r => r.status === tab);

  return (
    <div className="page" style={{ paddingTop: 28 }}>
      <div className="page-head">
        <div>
          <h1>Đăng ký người ra/vào cảng</h1>
          <div className="sub">Quản lý người ra vào — khách, nhà thầu, tài xế</div>
        </div>
        <div className="actions">
          <button className="btn"><Icon name="download" size={14}/> Export</button>
          <button className="btn accent" onClick={() => go("person-create")}><Icon name="plus" size={14}/> Đăng ký mới</button>
        </div>
      </div>

      <div className="card">
        <div className="tabs">
          {[
            { id: "active",   label: "Đang hoạt động", count: counts.active },
            { id: "pending",  label: "Chờ duyệt",       count: counts.pending, urgent: true },
            { id: "expired",  label: "Đã hết hạn",      count: counts.expired },
            { id: "rejected", label: "Từ chối",         count: counts.rejected },
          ].map(t => (
            <div key={t.id} className={`tab ${tab === t.id ? "active" : ""}`} onClick={() => setTab(t.id)} style={t.urgent ? { fontWeight: 600 } : {}}>
              {t.urgent && <span style={{ display: "inline-block", width: 6, height: 6, borderRadius: 999, background: "var(--brand-accent)", marginRight: 6, verticalAlign: "middle" }}></span>}
              {t.label}<span className="count">{t.count}</span>
            </div>
          ))}
        </div>

        <div className="toolbar">
          <div className="filt-chip set"><span className="label">Loại:</span> Tất cả <Icon name="chevronDown" size={12} /></div>
          <div className="filt-chip set"><span className="label">Nguồn:</span> Tất cả <Icon name="chevronDown" size={12} /></div>
          <div className="filt-chip set"><span className="label">Loại ĐK:</span> Tất cả <Icon name="chevronDown" size={12} /></div>
          <div className="spacer"></div>
          <div className="muted" style={{ fontSize: 12 }}>Hiển thị <b>{visible.length}</b> / {PERSON_REGS.length}</div>
        </div>

        <div className="tbl-wrap">
          <table className="tbl">
            <thead>
              <tr>
                <th style={{ width: 90 }}>Mã</th>
                <th style={{ width: 170 }}>Họ tên</th>
                <th style={{ width: 140 }}>CCCD</th>
                <th style={{ width: 200 }}>Đơn vị</th>
                <th style={{ width: 90 }}>Loại</th>
                <th style={{ width: 140 }}>Nguồn</th>
                <th style={{ width: 100 }}>Loại ĐK</th>
                <th style={{ width: 130 }}>Hiệu lực</th>
                <th style={{ width: 110 }}>Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {visible.map(r => {
                const st = STATUS_BADGE[r.status];
                return (
                  <tr key={r.id} onClick={() => go("person-detail", { id: r.id })} style={{ cursor: "pointer" }}>
                    <td className="mono" style={{ fontSize: 12 }}>{r.id}</td>
                    <td style={{ fontSize: 13.5, fontWeight: 500, whiteSpace: "nowrap" }}>{r.name}</td>
                    <td className="mono" style={{ fontSize: 12 }}>{r.idNo}</td>
                    <td style={{ fontSize: 12.5 }}>{r.org}</td>
                    <td style={{ fontSize: 13 }}>{r.kind}</td>
                    <td>
                      <span className={`tag ${r.source === "external" ? "src-external" : "src-internal"}`}>
                        {r.source === "external" ? "🌍 External" : `🏢 ${r.dept}`}
                      </span>
                    </td>
                    <td style={{ fontSize: 12 }}>{r.mode === "ONE_TIME" ? "Một lần" : r.mode === "RECURRING" ? "Định kỳ" : "Dài hạn"}</td>
                    <td className="mono" style={{ fontSize: 11.5 }}>{r.validFrom}{r.validTo !== r.validFrom ? ` – ${r.validTo}` : ""}</td>
                    <td><span className={`badge ${st.cls}`}><span className="pip"></span>{st.label}</span></td>
                  </tr>
                );
              })}
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

const PersonRegDetailScreen = ({ go, ctx }) => {
  const id = ctx?.id || PERSON_REGS[0].id;
  const r = PERSON_REGS.find(x => x.id === id) || PERSON_REGS[0];
  const st = STATUS_BADGE[r.status];

  return (
    <div className="page" style={{ paddingTop: 24, maxWidth: 1320 }}>
      <div style={{ marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
        <button className="btn ghost btn-sm" onClick={() => go("person-list")}>← Quay lại danh sách</button>
        <div className="muted" style={{ fontSize: 12, marginLeft: 6 }}>Đăng ký người / <span className="mono">{r.id}</span></div>
      </div>

      <div className="card" style={{ marginBottom: 20 }}>
        <div style={{ padding: "24px 24px 18px", display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16 }}>
          <div>
            <div className="row" style={{ marginBottom: 10, gap: 8, flexWrap: "wrap" }}>
              <span style={{ fontSize: 20, fontWeight: 700 }}>{r.id}</span>
              <span className={`badge ${st.cls}`}><span className="pip"></span>{st.label}</span>
            </div>
            <div className="row" style={{ gap: 8, flexWrap: "wrap" }}>
              <span className={`tag ${r.source === "external" ? "src-external" : "src-internal"}`}>
                {r.source === "external" ? "🌍 External" : `🏢 ${r.dept}`}
              </span>
              <span className="badge neutral">{r.kind}</span>
              <span className="badge neutral">{r.mode === "ONE_TIME" ? "Một lần" : r.mode === "RECURRING" ? "Định kỳ" : "Dài hạn"}</span>
            </div>
          </div>
          <div className="row" style={{ gap: 8 }}>
            <button className="btn">Sửa</button>
            <button className="btn danger">Thu hồi</button>
            <button className="btn">Gia hạn</button>
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: 24 }}>
        <div>
          <div className="card" style={{ marginBottom: 20 }}>
            <div className="card-head"><h3>Thông tin cá nhân</h3></div>
            <div className="card-body" style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "12px 20px", fontSize: 13.5 }}>
              <span className="muted">Họ tên</span><span style={{ fontWeight: 500 }}>{r.name}</span>
              <span className="muted">CCCD</span><span className="mono">{r.idNo}</span>
              <span className="muted">Ngày sinh</span><span>{r.dob}</span>
              <span className="muted">Số điện thoại</span><span className="mono">{r.phone}</span>
            </div>
          </div>

          <div className="card" style={{ marginBottom: 20 }}>
            <div className="card-head"><h3>Thông tin đăng ký</h3></div>
            <div className="card-body" style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "12px 20px", fontSize: 13.5 }}>
              <span className="muted">Đơn vị</span><span>{r.org}</span>
              <span className="muted">Loại</span><span>{r.kind}</span>
              <span className="muted">Mục đích</span><span>{r.purpose}</span>
              <span className="muted">Người liên hệ</span><span>{personById(r.contact).name} ({personById(r.contact).dept})</span>
              <span className="muted">Loại đăng ký</span><span>{r.mode === "ONE_TIME" ? "Một lần (ONE_TIME)" : r.mode === "RECURRING" ? `Định kỳ (${(r.days||[]).join(", ")}, ${r.hours})` : "Dài hạn (PERMANENT)"}</span>
              <span className="muted">Hiệu lực</span><span className="mono">{r.validFrom} — {r.validTo}</span>
              {r.reason && <><span className="muted">Lý do từ chối</span><span style={{ color: "var(--st-danger)" }}>{r.reason}</span></>}
            </div>
          </div>

          <div className="card" style={{ marginBottom: 20 }}>
            <div className="card-head"><h3>Đào tạo an ninh</h3></div>
            <div className="card-body" style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "12px 20px", fontSize: 13.5 }}>
              <span className="muted">Trạng thái</span><span>{r.training.done ? "✅ Đã hoàn thành" : "⏳ Chưa hoàn thành"}</span>
              {r.training.done && <>
                <span className="muted">Buổi</span><span>{r.training.code} — {r.training.date}</span>
                <span className="muted">Hết hạn</span><span>{r.training.expire}</span>
              </>}
            </div>
          </div>

          {r.history.length > 0 && (
            <div className="card">
              <div className="card-head"><h3>Lịch sử ra/vào gần nhất</h3></div>
              <div className="tbl-wrap">
                <table className="tbl">
                  <thead><tr><th>Ngày</th><th>Giờ vào</th><th>Giờ ra</th><th>Cổng</th><th>Thời gian lưu</th><th>Bảo vệ</th></tr></thead>
                  <tbody>
                    {r.history.map((h, i) => (
                      <tr key={i}>
                        <td className="mono" style={{ fontSize: 12 }}>{h.date}</td>
                        <td className="mono" style={{ fontSize: 12 }}>{h.in}</td>
                        <td className="mono" style={{ fontSize: 12 }}>{h.out || "—"}</td>
                        <td style={{ fontSize: 13 }}>{h.gate}</td>
                        <td style={{ fontSize: 13 }}>{h.dur}</td>
                        <td style={{ fontSize: 13 }}>{h.guard}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        <aside>
          <div className="card">
            <div className="card-head"><h3>Lịch sử trạng thái</h3></div>
            <div className="tl">
              {r.timeline.map((t, i) => (
                <div key={i} className="tl-item note">
                  <div className="tl-icon">{t.icon}</div>
                  <div className="tl-body">
                    <div className="when">{t.at}</div>
                    <div className="quote">{t.text}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

window.PersonRegListScreen = PersonRegListScreen;
window.PersonRegDetailScreen = PersonRegDetailScreen;
