/* An Ninh — Đăng ký xe: Danh sách + form tạo mới */

const VehicleRegListScreen = ({ go }) => {
  const [tab, setTab] = React.useState("active");
  const counts = {
    active: VEHICLE_REGS.filter(r => r.status === "active").length,
    pending: VEHICLE_REGS.filter(r => r.status === "pending").length,
    expired: VEHICLE_REGS.filter(r => r.status === "expired").length,
    rejected: VEHICLE_REGS.filter(r => r.status === "rejected").length,
  };
  const visible = VEHICLE_REGS.filter(r => r.status === tab);

  return (
    <div className="page" style={{ paddingTop: 28 }}>
      <div className="page-head">
        <div>
          <h1>Đăng ký xe ra/vào cảng</h1>
          <div className="sub">Quản lý xe ra vào — thường & ưu tiên</div>
        </div>
        <div className="actions">
          <button className="btn"><Icon name="download" size={14}/> Export</button>
          <button className="btn accent" onClick={() => go("vehicle-create")}><Icon name="plus" size={14}/> Đăng ký mới</button>
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
          <div className="filt-chip set"><span className="label">Loại xe:</span> Tất cả <Icon name="chevronDown" size={12} /></div>
          <div className="filt-chip set"><span className="label">Phân loại:</span> Tất cả <Icon name="chevronDown" size={12} /></div>
          <div className="filt-chip set"><span className="label">Nguồn:</span> Tất cả <Icon name="chevronDown" size={12} /></div>
          <div className="spacer"></div>
          <div className="muted" style={{ fontSize: 12 }}>Hiển thị <b>{visible.length}</b> / {VEHICLE_REGS.length}</div>
        </div>

        <div className="tbl-wrap">
          <table className="tbl">
            <thead>
              <tr>
                <th style={{ width: 90 }}>Mã</th>
                <th style={{ width: 110 }}>Biển số</th>
                <th style={{ width: 120 }}>Loại xe</th>
                <th style={{ width: 110 }}>Phân loại</th>
                <th style={{ width: 150 }}>Tài xế</th>
                <th>Đơn vị</th>
                <th style={{ width: 140 }}>Nguồn</th>
                <th style={{ width: 90 }}>Loại ĐK</th>
                <th style={{ width: 130 }}>Hiệu lực</th>
                <th style={{ width: 110 }}>Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {visible.map(r => {
                const st = STATUS_BADGE[r.status];
                return (
                  <tr key={r.id} style={{ cursor: "default" }}>
                    <td className="mono" style={{ fontSize: 12 }}>{r.id}</td>
                    <td className="mono" style={{ fontSize: 13, fontWeight: 600 }}>{r.plate}</td>
                    <td style={{ fontSize: 13 }}>{r.vtype}{r.container ? ` · ${r.container}` : ""}</td>
                    <td>
                      <span className={`tag ${r.priority === "priority" ? "priority-high" : "priority-normal"}`}>
                        {r.priority === "priority" ? "🔵 ƯU TIÊN" : "⚪ THƯỜNG"}
                      </span>
                    </td>
                    <td style={{ fontSize: 13 }}>{r.driver}</td>
                    <td style={{ fontSize: 12.5 }}>{r.org}</td>
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

function VehicleRegCreateScreen({ go }) {
  const [vtype, setVtype] = React.useState("Xe tải");
  const [priority, setPriority] = React.useState("normal");
  const [mode, setMode] = React.useState("ONE_TIME");
  const [form, setForm] = React.useState({ plate: "", container: "", driver: "", driverId: "", phone: "", org: "", purpose: "Giao hàng" });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const canPriority = SEC_ME.id === "s1"; // only đội trưởng ATCL
  const valid = form.plate.trim() && form.driver.trim() && form.phone.trim() && form.org.trim();

  return (
    <div className="page" style={{ paddingTop: 24, maxWidth: 1200, paddingBottom: 0 }}>
      <div style={{ marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
        <button className="btn ghost btn-sm" onClick={() => go("vehicle-list")}>← Quay lại danh sách</button>
        <div className="muted" style={{ fontSize: 12, marginLeft: 6 }}>Đăng ký xe / <span style={{ color: "var(--t-primary)", fontWeight: 500 }}>Tạo mới</span></div>
      </div>

      <div className="card">
        <div className="card-head"><h3>Tạo đăng ký xe ra/vào cảng</h3></div>
        <div className="card-body form-2col-grid" style={{ gap: 24 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div className="field">
              <label>Biển số xe <span className="req">*</span></label>
              <input className="input" placeholder="VD: 51H-12345" value={form.plate} onChange={e => set("plate", e.target.value)} />
            </div>
            <div className="field">
              <label>Loại xe <span className="req">*</span></label>
              <select className="select" value={vtype} onChange={e => setVtype(e.target.value)}>
                {["Xe con", "Xe tải", "Xe container", "Xe chuyên dụng"].map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            {vtype === "Xe container" && (
              <div className="field">
                <label>Số container</label>
                <input className="input" placeholder="VD: MSKU1234567" value={form.container} onChange={e => set("container", e.target.value)} />
              </div>
            )}
            <div className="field">
              <label>Phân loại <span className="req">*</span></label>
              <div className="priority-radio">
                <label className={`low ${priority === "normal" ? "on" : ""}`}>
                  <input type="radio" checked={priority === "normal"} onChange={() => setPriority("normal")} /> Thường
                </label>
                <label
                  className={`high ${priority === "priority" ? "on" : ""}`}
                  title={!canPriority ? "Chỉ Trưởng phòng ATCL (Anh Đức) có quyền gán xe ưu tiên" : ""}
                  style={!canPriority ? { opacity: 0.5, cursor: "not-allowed" } : {}}
                >
                  <input type="radio" disabled={!canPriority} checked={priority === "priority"} onChange={() => canPriority && setPriority("priority")} /> Ưu tiên
                </label>
              </div>
              <div className="muted" style={{ fontSize: 11.5, marginTop: 6 }}>Xe ưu tiên: BGĐ, đối tác chiến lược — barrier mở tự động khi LPR match.</div>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div className="field">
              <label>Họ tên tài xế <span className="req">*</span></label>
              <input className="input" placeholder="VD: Trần Văn B" value={form.driver} onChange={e => set("driver", e.target.value)} />
            </div>
            <div className="field">
              <label>CCCD tài xế</label>
              <input className="input" placeholder="9 hoặc 12 chữ số" value={form.driverId} onChange={e => set("driverId", e.target.value)} />
            </div>
            <div className="field">
              <label>Số điện thoại <span className="req">*</span></label>
              <input className="input" placeholder="09xx xxx xxx" value={form.phone} onChange={e => set("phone", e.target.value)} />
            </div>
          </div>

          <div className="field-row" style={{ gridColumn: "1 / -1" }}>
            <div className="field">
              <label>Đơn vị / Công ty <span className="req">*</span></label>
              <input className="input" placeholder="VD: Cty Vận tải Miền Nam" value={form.org} onChange={e => set("org", e.target.value)} />
            </div>
            <div className="field">
              <label>Mục đích <span className="req">*</span></label>
              <select className="select" value={form.purpose} onChange={e => set("purpose", e.target.value)}>
                {["Giao hàng", "Nhận hàng", "Công tác", "Sửa chữa", "Khác"].map(o => <option key={o}>{o}</option>)}
              </select>
            </div>
          </div>

          <div style={{ gridColumn: "1 / -1", borderTop: "1px solid var(--line)", paddingTop: 18 }}>
            <label style={{ fontSize: 12.5, fontWeight: 600, display: "block", marginBottom: 8 }}>Loại đăng ký <span className="req">*</span></label>
            <div className="priority-radio" style={{ marginBottom: 8 }}>
              <label className={`low ${mode === "ONE_TIME" ? "on" : ""}`}><input type="radio" checked={mode === "ONE_TIME"} onChange={() => setMode("ONE_TIME")} /> Một lần</label>
              <label className={`mid ${mode === "RECURRING" ? "on" : ""}`}><input type="radio" checked={mode === "RECURRING"} onChange={() => setMode("RECURRING")} /> Định kỳ</label>
              <label className={`high ${mode === "PERMANENT" ? "on" : ""}`}><input type="radio" checked={mode === "PERMANENT"} onChange={() => setMode("PERMANENT")} /> Dài hạn</label>
            </div>
            {mode === "RECURRING" && (
              <div style={{ padding: 14, background: "var(--bg-canvas)", borderRadius: "var(--r-sm)", border: "1px solid var(--line)", marginBottom: 10 }}>
                <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 8 }}>Ngày trong tuần</div>
                <div className="row wrap" style={{ gap: 8, marginBottom: 12 }}>
                  {["T2","T3","T4","T5","T6","T7","CN"].map(d => (
                    <label key={d} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12.5 }}>
                      <input type="checkbox" defaultChecked={["T2","T3","T4","T5","T6"].includes(d)} /> {d}
                    </label>
                  ))}
                </div>
                <div className="field-row">
                  <div className="field"><label>Từ giờ</label><input className="input" placeholder="06:00" /></div>
                  <div className="field"><label>Đến giờ</label><input className="input" placeholder="18:00" /></div>
                </div>
              </div>
            )}
            <div className="muted" style={{ fontSize: 11.5 }}>
              {mode === "PERMANENT" ? "Dài hạn: cần Trưởng phòng ATCL phê duyệt." : "Tự động kích hoạt, hết hạn khi xe ra (nếu Một lần)."}
            </div>
          </div>

          <div className="field-row" style={{ gridColumn: "1 / -1" }}>
            <div className="field"><label>Thời gian hiệu lực — Từ ngày</label><input className="input" placeholder="dd/mm/yyyy" /></div>
            <div className="field"><label>Đến ngày</label><input className="input" placeholder="dd/mm/yyyy" /></div>
          </div>
          <div className="field" style={{ gridColumn: "1 / -1" }}>
            <label>Ghi chú</label>
            <textarea className="textarea" rows={3} placeholder="Ghi chú thêm (tuỳ chọn)…" />
          </div>
        </div>
      </div>

      <div className="form-actions">
        <div className="summary">
          {valid ? "Phiếu sẵn sàng gửi đăng ký." : <span style={{ color: "var(--st-danger)" }}>⚠ Vui lòng nhập đủ thông tin bắt buộc</span>}
        </div>
        <div className="actions">
          <button className="btn ghost" onClick={() => go("vehicle-list")}>Huỷ</button>
          <button className="btn">Lưu nháp</button>
          <button className="btn primary" disabled={!valid}><Icon name="send" size={14}/> Gửi đăng ký</button>
        </div>
      </div>
    </div>
  );
}

window.VehicleRegListScreen = VehicleRegListScreen;
window.VehicleRegCreateScreen = VehicleRegCreateScreen;
