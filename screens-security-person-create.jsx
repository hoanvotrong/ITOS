/* An Ninh — Đăng ký người: form tạo mới */

function PersonRegCreateScreen({ go }) {
  const [mode, setMode] = React.useState("ONE_TIME");
  const [form, setForm] = React.useState({ name: "", idNo: "", org: "", kind: "Khách", purpose: "Giao hàng", contact: "" });
  const [idErr, setIdErr] = React.useState("");
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const checkId = (v) => {
    set("idNo", v);
    if (v && !/^\d{9}$|^\d{12}$/.test(v.replace(/\s/g, ""))) setIdErr("CCCD phải có 9 hoặc 12 chữ số");
    else setIdErr("");
  };

  const valid = form.name.trim() && form.idNo.trim() && !idErr && form.org.trim() && form.purpose.trim();

  return (
    <div className="page" style={{ paddingTop: 24, maxWidth: 1200, paddingBottom: 0 }}>
      <div style={{ marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
        <button className="btn ghost btn-sm" onClick={() => go("person-list")}>← Quay lại danh sách</button>
        <div className="muted" style={{ fontSize: 12, marginLeft: 6 }}>Đăng ký người / <span style={{ color: "var(--t-primary)", fontWeight: 500 }}>Tạo mới</span></div>
      </div>

      <div className="card">
        <div className="card-head"><h3>Tạo đăng ký người ra/vào cảng</h3></div>
        <div className="card-body" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div className="field">
              <label>Họ tên <span className="req">*</span></label>
              <input className="input" placeholder="VD: Nguyễn Văn An" value={form.name} onChange={e => set("name", e.target.value)} />
            </div>
            <div className="field">
              <label>Số CCCD/CMND <span className="req">*</span></label>
              <input className="input" placeholder="9 hoặc 12 chữ số" value={form.idNo} onChange={e => checkId(e.target.value)} style={idErr ? { borderColor: "var(--st-danger)" } : {}} />
              {idErr && <div style={{ fontSize: 11.5, color: "var(--st-danger)", marginTop: 4 }}>{idErr}</div>}
            </div>
            <div className="field">
              <label>Ngày sinh</label>
              <input className="input" placeholder="dd/mm/yyyy" />
            </div>
            <div className="field">
              <label>Số điện thoại</label>
              <input className="input" placeholder="09xx xxx xxx" />
            </div>
            <div className="field">
              <label>Ảnh chân dung</label>
              <div className="dropzone">
                <div className="dz-icon"><Icon name="upload" size={20}/></div>
                <b>Kéo thả ảnh vào đây hoặc bấm để chọn</b>
                <div className="dz-sub">JPG · PNG</div>
              </div>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div className="field">
              <label>Đơn vị / Công ty <span className="req">*</span></label>
              <input className="input" placeholder="VD: Công ty Petrolimex" value={form.org} onChange={e => set("org", e.target.value)} />
            </div>
            <div className="field">
              <label>Loại <span className="req">*</span></label>
              <div className="priority-radio">
                {["Khách", "Nhà thầu", "Tài xế"].map(k => (
                  <label key={k} className={`low ${form.kind === k ? "on" : ""}`}>
                    <input type="radio" checked={form.kind === k} onChange={() => set("kind", k)} /> {k}
                  </label>
                ))}
              </div>
            </div>
            <div className="field">
              <label>Mục đích vào cảng <span className="req">*</span></label>
              <select className="select" value={form.purpose} onChange={e => set("purpose", e.target.value)}>
                {["Giao hàng", "Nhận hàng", "Công tác", "Sửa chữa", "Khác"].map(o => <option key={o}>{o}</option>)}
              </select>
            </div>
            <div className="field">
              <label>Người liên hệ trong VNL</label>
              <select className="select" value={form.contact} onChange={e => set("contact", e.target.value)}>
                <option value="">— Chọn người liên hệ —</option>
                {PEOPLE.map(p => <option key={p.id} value={p.id}>{p.name} · {p.role}</option>)}
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
            <div className="muted" style={{ fontSize: 11.5 }}>Một lần & Định kỳ: tự động kích hoạt. Dài hạn: cần Trưởng phòng ATCL phê duyệt.</div>
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
          <button className="btn ghost" onClick={() => go("person-list")}>Huỷ</button>
          <button className="btn">Lưu nháp</button>
          <button className="btn primary" disabled={!valid}><Icon name="send" size={14}/> Gửi đăng ký</button>
        </div>
      </div>
    </div>
  );
}

window.PersonRegCreateScreen = PersonRegCreateScreen;
