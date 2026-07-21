/* An Ninh — Tạo phiếu: Đăng ký người / Đăng ký xe */

function SecCreateScreen({ go }) {
  const [kind, setKind] = React.useState("person"); // person | vehicle
  const [form, setForm] = React.useState({
    name: "", org: "", idNo: "", purpose: "", host: null,
    mode: "ONE_TIME", validFrom: "", validTo: "",
    plate: "", vehicleType: "Xe tải", driver: "", priority: "normal",
  });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const valid = kind === "person"
    ? form.name.trim() && form.idNo.trim() && form.purpose.trim()
    : form.plate.trim() && form.driver.trim() && form.purpose.trim();

  return (
    <div className="page" style={{ paddingTop: 24, maxWidth: 1320, paddingBottom: 0 }}>
      <div style={{ marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
        <button className="btn ghost btn-sm" onClick={() => go("approval")}>← Quay lại danh sách</button>
        <div className="muted" style={{ fontSize: 12, marginLeft: 6 }}>
          Phê duyệt / <span style={{ color: "var(--t-primary)", fontWeight: 500 }}>Đăng ký người/xe</span>
        </div>
      </div>

      <div className="page-head" style={{ marginBottom: 18 }}>
        <div>
          <h1>Đăng ký người/xe mới</h1>
          <div className="sub">Điền thông tin để gửi đi phê duyệt trước khi cấp quyền ra vào cảng</div>
        </div>
      </div>

      <div className="form-grid">
        <div>
          <div className="form-section">
            <div className="sec-head">
              <div className="step-no">1</div>
              <h4>Loại đăng ký</h4>
              <span className="sec-sub">Bắt buộc</span>
            </div>
            <div className="sec-body">
              <div className="priority-radio">
                <label className={`low ${kind === "person" ? "on" : ""}`}>
                  <input type="radio" checked={kind === "person"} onChange={() => setKind("person")} />
                  Đăng ký người
                </label>
                <label className={`mid ${kind === "vehicle" ? "on" : ""}`}>
                  <input type="radio" checked={kind === "vehicle"} onChange={() => setKind("vehicle")} />
                  Đăng ký xe
                </label>
              </div>
            </div>
          </div>

          {kind === "person" ? (
            <div className="form-section">
              <div className="sec-head">
                <div className="step-no">2</div>
                <h4>Thông tin người</h4>
                <span className="sec-sub">Bắt buộc</span>
              </div>
              <div className="sec-body">
                <div className="field-row three">
                  <div className="field">
                    <label>Họ và tên <span className="req">*</span></label>
                    <input className="input" placeholder="VD: Nguyễn Văn An" value={form.name} onChange={e => set("name", e.target.value)} />
                  </div>
                  <div className="field">
                    <label>CCCD/CMND <span className="req">*</span></label>
                    <input className="input" placeholder="079xxxxxxxxx" value={form.idNo} onChange={e => set("idNo", e.target.value)} />
                  </div>
                  <div className="field">
                    <label>Đơn vị / Công ty</label>
                    <input className="input" placeholder="VD: Công ty Petrolimex" value={form.org} onChange={e => set("org", e.target.value)} />
                  </div>
                </div>
                <div className="field-row">
                  <div className="field">
                    <label>Hình thức <span className="req">*</span></label>
                    <select className="select" value={form.mode} onChange={e => set("mode", e.target.value)}>
                      <option value="ONE_TIME">ONE_TIME — một lần</option>
                      <option value="PERMANENT">PERMANENT — dài hạn</option>
                    </select>
                  </div>
                  <div className="field">
                    <label>Người bảo lãnh</label>
                    <select className="select" value={form.host || ""} onChange={e => set("host", e.target.value || null)}>
                      <option value="">— Chọn người bảo lãnh —</option>
                      {PEOPLE.map(p => <option key={p.id} value={p.id}>{p.name} · {p.role}</option>)}
                    </select>
                  </div>
                </div>
                <div className="field-row">
                  <div className="field">
                    <label>Hiệu lực từ</label>
                    <input className="input" placeholder="dd/mm/yyyy hh:mm" value={form.validFrom} onChange={e => set("validFrom", e.target.value)} />
                  </div>
                  <div className="field">
                    <label>Hiệu lực đến</label>
                    <input className="input" placeholder="dd/mm/yyyy hh:mm" value={form.validTo} onChange={e => set("validTo", e.target.value)} />
                  </div>
                </div>
                <div className="field">
                  <label>Mục đích ra vào <span className="req">*</span></label>
                  <textarea className="textarea" rows={3} placeholder="VD: Làm việc với P. Kinh doanh…" value={form.purpose} onChange={e => set("purpose", e.target.value)} />
                </div>
              </div>
            </div>
          ) : (
            <div className="form-section">
              <div className="sec-head">
                <div className="step-no">2</div>
                <h4>Thông tin xe</h4>
                <span className="sec-sub">Bắt buộc</span>
              </div>
              <div className="sec-body">
                <div className="field-row three">
                  <div className="field">
                    <label>Biển số <span className="req">*</span></label>
                    <input className="input" placeholder="VD: 51H-99887" value={form.plate} onChange={e => set("plate", e.target.value)} />
                  </div>
                  <div className="field">
                    <label>Loại xe</label>
                    <select className="select" value={form.vehicleType} onChange={e => set("vehicleType", e.target.value)}>
                      {["Xe con", "Xe tải", "Xe container", "Xe khách"].map(t => <option key={t}>{t}</option>)}
                    </select>
                  </div>
                  <div className="field">
                    <label>Tài xế <span className="req">*</span></label>
                    <input className="input" placeholder="VD: Trần Văn B" value={form.driver} onChange={e => set("driver", e.target.value)} />
                  </div>
                </div>
                <div className="field-row">
                  <div className="field">
                    <label>Đơn vị vận tải</label>
                    <input className="input" placeholder="VD: Cty Vận tải Miền Nam" value={form.org} onChange={e => set("org", e.target.value)} />
                  </div>
                  <div className="field">
                    <label>Mức ưu tiên</label>
                    <div className="priority-radio">
                      <label className={`low ${form.priority === "normal" ? "on" : ""}`}>
                        <input type="radio" checked={form.priority === "normal"} onChange={() => set("priority", "normal")} /> Xe thường
                      </label>
                      <label className={`high ${form.priority === "priority" ? "on" : ""}`}>
                        <input type="radio" checked={form.priority === "priority"} onChange={() => set("priority", "priority")} /> Xe ưu tiên
                      </label>
                    </div>
                  </div>
                </div>
                <div className="field-row">
                  <div className="field">
                    <label>Hình thức</label>
                    <select className="select" value={form.mode} onChange={e => set("mode", e.target.value)}>
                      <option value="ONE_TIME">ONE_TIME — một lần</option>
                      <option value="Dài hạn">Dài hạn — permanent</option>
                    </select>
                  </div>
                  <div className="field">
                    <label>Hiệu lực đến</label>
                    <input className="input" placeholder="dd/mm/yyyy" value={form.validTo} onChange={e => set("validTo", e.target.value)} />
                  </div>
                </div>
                <div className="field">
                  <label>Mục đích ra vào <span className="req">*</span></label>
                  <textarea className="textarea" rows={3} placeholder="VD: Vận chuyển hàng hoá vào kho Đình Vũ…" value={form.purpose} onChange={e => set("purpose", e.target.value)} />
                </div>
              </div>
            </div>
          )}

          <div className="form-section">
            <div className="sec-head">
              <div className="step-no">3</div>
              <h4>Tài liệu đính kèm</h4>
              <span className="sec-sub">CCCD / Giấy phép lưu hành — tuỳ chọn</span>
            </div>
            <div className="sec-body">
              <div className="dropzone">
                <div className="dz-icon"><Icon name="upload" size={20}/></div>
                <b>Kéo thả file vào đây hoặc bấm để chọn</b>
                <div className="dz-sub">Hỗ trợ PDF · JPG · PNG</div>
              </div>
            </div>
          </div>
        </div>

        <aside>
          <div className="preview-card">
            <div className="pv-head"><Icon name="eye" size={14}/><b>Xem trước phiếu</b><span className="live">Live</span></div>
            <div className="pv-body">
              <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 8, flexWrap: "wrap" }}>
                <span className="tag">AN-2026-0513 (dự kiến)</span>
                <span className="badge neutral">{kind === "person" ? "Đăng ký người" : "Đăng ký xe"}</span>
              </div>
              <div style={{ fontSize: 15, fontWeight: 700, letterSpacing: "-0.01em", lineHeight: 1.35, marginBottom: 10, color: (kind === "person" ? form.name : form.plate) ? "var(--t-primary)" : "var(--t-tertiary)" }}>
                {kind === "person" ? (form.name || "Tên người đăng ký…") : (form.plate || "Biển số xe…")}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "10px 14px", fontSize: 12.5 }}>
                <span className="muted">Hình thức</span><span>{form.mode}</span>
                {kind === "person" && <><span className="muted">Đơn vị</span><span>{form.org || "—"}</span></>}
                {kind === "vehicle" && <><span className="muted">Tài xế</span><span>{form.driver || "—"}</span></>}
                {kind === "vehicle" && <><span className="muted">Ưu tiên</span><span>{form.priority === "priority" ? "Xe ưu tiên" : "Xe thường"}</span></>}
              </div>
            </div>
          </div>
        </aside>
      </div>

      <div className="form-actions">
        <div className="summary">
          {valid ? <>Phiếu sẵn sàng gửi phê duyệt.</> : <span style={{ color: "var(--st-danger)" }}>⚠ Vui lòng nhập đủ thông tin bắt buộc</span>}
        </div>
        <div className="actions">
          <button className="btn ghost" onClick={() => go("approval")}>Huỷ</button>
          <button className="btn primary" disabled={!valid}><Icon name="send" size={14}/> Gửi phiếu đăng ký</button>
        </div>
      </div>
    </div>
  );
}

window.SecCreateScreen = SecCreateScreen;
