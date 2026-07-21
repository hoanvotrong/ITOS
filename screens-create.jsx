/* Create approval form — full page with live preview */

const APPROVAL_TYPES = [
  "Đề xuất chi phí",
  "Hợp đồng",
  "Mua sắm",
  "Thanh toán",
  "Đào tạo",
  "Sửa chữa",
  "Đề xuất nhân sự",
  "Khác",
];

const DEPTS = ["Khai thác", "Hàng hải", "Kinh doanh", "KTVT", "QHSE", "Tài chính", "Hành chính"];

function PersonPicker({ value, onPick, placeholder = "Chọn người duyệt…", excludeIds = [] }) {
  const [open, setOpen] = React.useState(false);
  const [q, setQ] = React.useState("");
  const ref = React.useRef(null);

  React.useEffect(() => {
    const onDoc = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const filtered = PEOPLE.filter(p =>
    !excludeIds.includes(p.id) &&
    (p.name.toLowerCase().includes(q.toLowerCase()) || p.role.toLowerCase().includes(q.toLowerCase()))
  );

  const person = value ? personById(value) : null;

  return (
    <div style={{ position: "relative", flex: 1 }} ref={ref}>
      <div
        className={`person-pick ${value ? "" : "empty"}`}
        onClick={() => setOpen(o => !o)}
      >
        {person ? (
          <>
            <Avatar person={person} size={28} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 500 }}>{person.name}</div>
              <div className="muted" style={{ fontSize: 11 }}>{person.role}</div>
            </div>
          </>
        ) : (
          <>
            <Icon name="user" size={16} />
            <span style={{ fontSize: 13 }}>{placeholder}</span>
          </>
        )}
        <Icon name="chevronDown" size={14} />
      </div>

      {open && (
        <div className="popover" style={{ top: "calc(100% + 4px)", left: 0, right: 0 }}>
          <div className="pop-search">
            <input
              autoFocus
              value={q}
              onChange={e => setQ(e.target.value)}
              placeholder="Tìm theo tên, chức vụ…"
            />
          </div>
          {filtered.length === 0 && <div className="muted" style={{ padding: 16, fontSize: 12, textAlign: "center" }}>Không tìm thấy</div>}
          {filtered.map(p => (
            <div key={p.id} className="pop-item" onClick={() => { onPick(p.id); setOpen(false); setQ(""); }}>
              <Avatar person={p} size={28} />
              <div>
                <div className="pop-name">{p.name}</div>
                <div className="pop-role">{p.role} · {p.dept}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function CreateApprovalScreen({ go }) {
  const [form, setForm] = React.useState({
    title: "",
    type: "Đề xuất chi phí",
    dept: ME.dept,
    priority: "mid",
    description: "",
    amount: "",
    hasAmount: true,
    chain: [
      { person: ME.id, role: ME.role },
      { person: "u3", role: "GĐ Khai thác" },
      { person: "u1", role: "TGĐ" },
    ],
    watchers: ["u11"],
    files: [
      { name: "ĐeXuat_DraftV1.docx", size: "62 KB", type: "docx", progress: 100 },
    ],
  });

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const formatAmount = (v) => {
    if (!v) return "";
    const num = parseInt(v.toString().replace(/\D/g, ""), 10);
    if (isNaN(num)) return "";
    return num.toLocaleString("vi-VN");
  };
  const amountDisplay = formatAmount(form.amount);

  const addStep = () => set("chain", [...form.chain, { person: null, role: "" }]);
  const removeStep = (i) => {
    if (form.chain.length <= 1) return;
    set("chain", form.chain.filter((_, idx) => idx !== i));
  };
  const moveStep = (i, dir) => {
    const j = i + dir;
    if (j < 0 || j >= form.chain.length) return;
    const arr = [...form.chain];
    [arr[i], arr[j]] = [arr[j], arr[i]];
    set("chain", arr);
  };
  const setStep = (i, k, v) => {
    const arr = [...form.chain];
    arr[i] = { ...arr[i], [k]: v };
    if (k === "person" && v) {
      arr[i].role = personById(v).role;
    }
    set("chain", arr);
  };

  const validSteps = form.chain.filter(s => s.person).length;
  const valid = form.title.trim().length > 0 && validSteps >= 1;

  return (
    <div className="page" style={{ paddingTop: 24, maxWidth: 1320, paddingBottom: 0 }}>
      {/* Back */}
      <div style={{ marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
        <button className="btn ghost btn-sm" onClick={() => go("approval")}>
          ← Quay lại danh sách
        </button>
        <div className="muted" style={{ fontSize: 12, marginLeft: 6 }}>
          Phê duyệt / <span style={{ color: "var(--t-primary)", fontWeight: 500 }}>Tạo phiếu mới</span>
        </div>
      </div>

      <div className="page-head" style={{ marginBottom: 18 }}>
        <div>
          <h1>Tạo phiếu trình duyệt</h1>
          <div className="sub">Soạn phiếu, chọn chuỗi cấp duyệt và đính kèm tài liệu</div>
        </div>
      </div>

      <div className="form-grid">
        <div>
          {/* Section 1 — General */}
          <div className="form-section">
            <div className="sec-head">
              <div className="step-no">1</div>
              <h4>Thông tin chung</h4>
              <span className="sec-sub">Bắt buộc</span>
            </div>
            <div className="sec-body">
              <div className="field">
                <label>Tiêu đề phiếu <span className="req">*</span></label>
                <input
                  className="input"
                  placeholder="VD: Đề xuất sửa chữa hệ thống lashing tàu VINA STAR"
                  value={form.title}
                  onChange={e => set("title", e.target.value)}
                />
                <div className="hint">Tiêu đề ngắn gọn, rõ ràng để người duyệt hình dung được nội dung</div>
              </div>

              <div className="field-row three">
                <div className="field">
                  <label>Loại phiếu <span className="req">*</span></label>
                  <select className="select" value={form.type} onChange={e => set("type", e.target.value)}>
                    {APPROVAL_TYPES.map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div className="field">
                  <label>Phòng ban đề xuất</label>
                  <select className="select" value={form.dept} onChange={e => set("dept", e.target.value)}>
                    {DEPTS.map(d => <option key={d}>{d}</option>)}
                  </select>
                </div>
                <div className="field">
                  <label>Thời hạn duyệt <span className="opt">(tuỳ chọn)</span></label>
                  <input className="input" type="text" placeholder="dd/mm/yyyy" defaultValue="22/05/2026" />
                </div>
              </div>

              <div className="field">
                <label>Mức ưu tiên <span className="req">*</span></label>
                <div className="priority-radio">
                  {["low","mid","high"].map(p => (
                    <label key={p} className={`${p} ${form.priority === p ? "on" : ""}`}>
                      <input type="radio" checked={form.priority === p} onChange={() => set("priority", p)} />
                      {p === "high" ? "Cao — cần xử lý trong 24h" : p === "mid" ? "Trung bình — trong 3 ngày" : "Thấp — không gấp"}
                    </label>
                  ))}
                </div>
              </div>

              <div className="field">
                <label>Nội dung / Mô tả <span className="req">*</span></label>
                <textarea
                  className="textarea"
                  rows={5}
                  placeholder="Trình bày bối cảnh, lý do đề xuất, kết quả mong đợi…"
                  value={form.description}
                  onChange={e => set("description", e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Section 2 — Chi phí */}
          <div className="form-section">
            <div className="sec-head">
              <div className="step-no">2</div>
              <h4>Chi phí</h4>
              <span className="sec-sub">Tuỳ phiếu có hoặc không</span>
            </div>
            <div className="sec-body">
              <div style={{ marginBottom: 12 }}>
                <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "var(--t-secondary)", cursor: "pointer" }}>
                  <input type="checkbox" checked={form.hasAmount} onChange={e => set("hasAmount", e.target.checked)} />
                  Phiếu này có liên quan đến chi phí
                </label>
              </div>
              {form.hasAmount && (
                <div className="field-row">
                  <div className="field">
                    <label>Số tiền <span className="req">*</span></label>
                    <div className="input-wrap">
                      <span className="prefix">VND</span>
                      <input
                        className="input with-prefix"
                        placeholder="0"
                        value={amountDisplay}
                        onChange={e => set("amount", e.target.value.replace(/\D/g, ""))}
                        style={{ fontFamily: "var(--font-mono)", letterSpacing: "-0.005em", fontWeight: 500 }}
                      />
                    </div>
                    {form.amount && (
                      <div className="hint" style={{ color: "var(--t-secondary)" }}>
                        {readVNNumber(parseInt(form.amount || "0", 10))} đồng
                      </div>
                    )}
                  </div>
                  <div className="field">
                    <label>Nguồn ngân sách</label>
                    <select className="select" defaultValue="Q2-2026">
                      <option>Q2-2026 · Khai thác</option>
                      <option>Q2-2026 · Đầu tư</option>
                      <option>Q2-2026 · Bảo trì</option>
                      <option>Khác</option>
                    </select>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Section 3 — Tài liệu */}
          <div className="form-section">
            <div className="sec-head">
              <div className="step-no">3</div>
              <h4>Tài liệu đính kèm</h4>
              <span className="sec-sub">PDF, Word, Excel, ảnh · tối đa 20 MB / file</span>
            </div>
            <div className="sec-body">
              <div className="dropzone">
                <div className="dz-icon"><Icon name="upload" size={20}/></div>
                <b>Kéo thả file vào đây hoặc bấm để chọn</b>
                <div className="dz-sub">Hỗ trợ PDF · DOCX · XLSX · JPG · PNG</div>
              </div>

              {form.files.length > 0 && (
                <div className="file-list">
                  {form.files.map((f, i) => (
                    <div key={i} className="file-row">
                      <div className={`ftype ${f.type}`} style={{
                        background: f.type === "pdf" ? "#D03A2C" : f.type === "docx" ? "#2563EB" : f.type === "xlsx" ? "#16A34A" : "#7C5BE0"
                      }}>{f.type.toUpperCase()}</div>
                      <div>
                        <div className="fname">{f.name}</div>
                        <div className="fmeta">{f.size} · Đã tải lên</div>
                      </div>
                      <div className="progress"><div className="bar" style={{ width: `${f.progress}%` }}></div></div>
                      <button className="icon-btn" style={{ width: 28, height: 28 }} onClick={() => set("files", form.files.filter((_, j) => j !== i))}>
                        <Icon name="trash" size={14}/>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Section 4 — Chuỗi duyệt */}
          <div className="form-section">
            <div className="sec-head">
              <div className="step-no">4</div>
              <h4>Chuỗi phê duyệt</h4>
              <span className="sec-sub">{form.chain.length} cấp · tối thiểu 1 cấp</span>
            </div>
            <div className="sec-body">
              <div className="chain-builder">
                {form.chain.map((step, i) => (
                  <div key={i} className="cb-step">
                    <div className="step-num">{i + 1}</div>
                    <PersonPicker
                      value={step.person}
                      onPick={(id) => setStep(i, "person", id)}
                      excludeIds={form.chain.map(s => s.person).filter((p, j) => p && j !== i)}
                      placeholder={`Chọn người duyệt cấp ${i + 1}…`}
                    />
                    <div className="reorder">
                      <button onClick={() => moveStep(i, -1)} disabled={i === 0} title="Lên">
                        <Icon name="arrowUp" size={10}/>
                      </button>
                      <button onClick={() => moveStep(i, 1)} disabled={i === form.chain.length - 1} title="Xuống">
                        <Icon name="arrowDown" size={10}/>
                      </button>
                    </div>
                    <button className="remove-step" onClick={() => removeStep(i)} title="Xoá cấp">
                      <Icon name="trash" size={14}/>
                    </button>
                  </div>
                ))}
                <button className="cb-add" onClick={addStep}>
                  <Icon name="plus" size={14}/> Thêm cấp duyệt
                </button>
              </div>

              <div style={{ marginTop: 18, padding: 12, background: "var(--st-info-bg)", borderRadius: "var(--r-sm)", display: "flex", gap: 10, fontSize: 12.5, color: "var(--t-primary)" }}>
                <Icon name="help" size={16} className="ic" style={{ color: "var(--st-info)", flexShrink: 0, marginTop: 1 }}/>
                <div>
                  <b>Gợi ý:</b> Với phiếu trên 500 triệu, hệ thống đề xuất tối thiểu 4 cấp (Trưởng phòng → Giám đốc → Phó TGĐ → TGĐ).
                  Bạn có thể bấm <b>Áp dụng mẫu</b> để tự động chèn chuỗi chuẩn theo loại phiếu.
                </div>
              </div>
            </div>
          </div>

          {/* Section 5 — Watchers */}
          <div className="form-section">
            <div className="sec-head">
              <div className="step-no">5</div>
              <h4>Người theo dõi (CC)</h4>
              <span className="sec-sub">Tuỳ chọn · nhận notification, không cần action</span>
            </div>
            <div className="sec-body">
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
                <input className="watcher-input" placeholder="Gõ tên để thêm watcher…" />
              </div>
              <div className="hint" style={{ marginTop: 6 }}>Watcher sẽ nhận thông báo tại mỗi bước thay đổi trạng thái phiếu.</div>
            </div>
          </div>
        </div>

        {/* Preview side */}
        <aside>
          <div className="preview-card">
            <div className="pv-head">
              <Icon name="eye" size={14}/>
              <b>Xem trước phiếu</b>
              <span className="live">Live</span>
            </div>
            <div className="pv-body">
              <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 8, flexWrap: "wrap" }}>
                <span className="tag">PD-2026-0419 (dự kiến)</span>
                <span className={`prio ${form.priority}`} style={{ fontSize: 11 }}>
                  {form.priority === "high" ? "Cao" : form.priority === "mid" ? "TB" : "Thấp"}
                </span>
              </div>
              <div style={{ fontSize: 15, fontWeight: 700, letterSpacing: "-0.01em", lineHeight: 1.35, marginBottom: 10, color: form.title ? "var(--t-primary)" : "var(--t-tertiary)" }}>
                {form.title || "Tiêu đề phiếu sẽ hiện ở đây…"}
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "10px 14px", fontSize: 12.5, marginBottom: 14 }}>
                <span className="muted">Loại</span><span>{form.type}</span>
                <span className="muted">Phòng</span><span>{form.dept}</span>
                {form.hasAmount && form.amount && (
                  <>
                    <span className="muted">Số tiền</span>
                    <span className="mono" style={{ fontWeight: 600, color: "var(--brand-ink)" }}>{amountDisplay} ₫</span>
                  </>
                )}
                <span className="muted">Đính kèm</span><span>{form.files.length} tài liệu</span>
                <span className="muted">Watcher</span><span>{form.watchers.length} người</span>
              </div>

              <div className="divider"></div>
              <div style={{ fontSize: 11, color: "var(--t-tertiary)", textTransform: "uppercase", letterSpacing: 0.06, fontWeight: 600, marginBottom: 10 }}>
                Chuỗi duyệt ({validSteps} cấp)
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {form.chain.map((s, i) => {
                  const p = s.person ? personById(s.person) : null;
                  return (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "6px 0" }}>
                      <span style={{ width: 22, height: 22, borderRadius: 999, background: "var(--bg-sunken)", color: "var(--t-secondary)", display: "grid", placeItems: "center", fontWeight: 600, fontSize: 11, fontFamily: "var(--font-mono)", flexShrink: 0 }}>
                        {i + 1}
                      </span>
                      {p ? (
                        <>
                          <Avatar person={p} size={22} />
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: 12.5, fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.name}</div>
                            <div className="muted" style={{ fontSize: 10.5 }}>{p.role}</div>
                          </div>
                        </>
                      ) : (
                        <span className="muted" style={{ fontSize: 12, fontStyle: "italic" }}>Chưa chọn</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* Sticky action bar */}
      <div className="form-actions">
        <div className="summary">
          {valid
            ? <>Phiếu sẵn sàng gửi: <b>{validSteps} cấp duyệt</b> · <b>{form.files.length} tài liệu</b> · <b>{form.watchers.length} watcher</b></>
            : <span style={{ color: "var(--st-danger)" }}>⚠ Vui lòng nhập tiêu đề và chọn ít nhất 1 người duyệt</span>
          }
        </div>
        <div className="actions">
          <button className="btn ghost" onClick={() => go("approval")}>Huỷ</button>
          <button className="btn"><Icon name="download" size={14}/> Lưu nháp</button>
          <button className="btn primary" disabled={!valid}><Icon name="send" size={14}/> Gửi phiếu trình duyệt</button>
        </div>
      </div>
    </div>
  );
}

function readVNNumber(n) {
  if (!n) return "không";
  if (n >= 1e9) return `${(n / 1e9).toFixed(n % 1e9 === 0 ? 0 : 2)} tỷ`;
  if (n >= 1e6) return `${(n / 1e6).toFixed(n % 1e6 === 0 ? 0 : 2)} triệu`;
  if (n >= 1e3) return `${(n / 1e3).toFixed(0)} nghìn`;
  return n.toString();
}

window.CreateApprovalScreen = CreateApprovalScreen;
