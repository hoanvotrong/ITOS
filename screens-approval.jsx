/* Approval screens — list + detail */

const ApprovalListScreen = ({ go }) => {
  const [tab, setTab] = React.useState("inbox");
  const [selected, setSelected] = React.useState([]);
  const [bulkAction, setBulkAction] = React.useState(null); // {action, comment}
  const [bulkComment, setBulkComment] = React.useState("");
  const [toast, setToast] = React.useState(null);
  const flash = (msg) => { setToast(msg); clearTimeout(window.__apTostT); window.__apTostT = setTimeout(() => setToast(null), 2000); };
  const counts = {
    inbox:    APPROVALS.filter(a => a.status === "current" && a.chain.find(s => s.state === "current")?.person === ME.id).length,
    waiting:  APPROVALS.filter(a => a.status === "waiting" || (a.status === "current" && a.chain.find(s => s.state === "current")?.person !== ME.id)).length,
    sent:     APPROVALS.filter(a => a.creator === ME.id).length,
    cc:       APPROVALS.filter(a => a.watchers.includes(ME.id)).length,
    all:      APPROVALS.length,
  };

  const visible = APPROVALS.filter(a => {
    if (tab === "inbox")   return a.status === "current" && a.chain.find(s => s.state === "current")?.person === ME.id;
    if (tab === "waiting") return a.status === "waiting" || (a.status === "current" && a.chain.find(s => s.state === "current")?.person !== ME.id);
    if (tab === "sent")    return a.creator === ME.id;
    if (tab === "cc")      return a.watchers.includes(ME.id);
    if (tab === "drafts")  return a.status === "draft";
    if (tab === "archive") return a.status === "approved" || a.status === "rejected";
    return true;
  });

  // Reset selection when tab changes
  React.useEffect(() => setSelected([]), [tab]);

  const isInbox = tab === "inbox";
  const toggleSel = (id, e) => {
    e?.stopPropagation();
    setSelected(arr => arr.includes(id) ? arr.filter(x => x !== id) : [...arr, id]);
  };
  const toggleAll = () => {
    if (selected.length === visible.length) setSelected([]);
    else setSelected(visible.map(v => v.id));
  };
  const performBulk = (action) => {
    flash(
      action === "approve" ? `Đã phê duyệt ${selected.length} phiếu` :
      action === "reject"  ? `Đã từ chối ${selected.length} phiếu` :
      `Đã chuyển ${selected.length} phiếu sang chờ bổ sung`
    );
    setSelected([]);
    setBulkAction(null);
    setBulkComment("");
  };

  return (
    <div className="page" style={{ paddingTop: 28 }}>
      <div className="page-head">
        <div>
          <h1>Phê duyệt</h1>
          <div className="sub">Quản lý phiếu trình duyệt theo chuỗi cấp · {ME.role}</div>
        </div>
        <div className="actions">
          <button className="btn"><Icon name="filter" size={14}/> Bộ lọc nâng cao</button>
          <button className="btn"><Icon name="download" size={14}/> Xuất Excel</button>
          <button className="btn accent" onClick={() => go("approval-create")}><Icon name="plus" size={14}/> Tạo phiếu trình duyệt</button>
        </div>
      </div>

      <div className="card">
        {/* Tabs */}
        <div className="tabs">
          {[
            { id: "inbox",   label: "Chờ tôi duyệt",   count: counts.inbox,   urgent: true },
            { id: "waiting", label: "Đang chờ cấp khác", count: counts.waiting },
            { id: "sent",    label: "Tôi đã gửi",       count: counts.sent },
            { id: "cc",      label: "Theo dõi (CC)",    count: counts.cc },
            { id: "drafts",  label: "Bản nháp",         count: 1 },
            { id: "archive", label: "Lưu trữ",          count: 2 },
          ].map(t => (
            <div
              key={t.id}
              className={`tab ${tab === t.id ? "active" : ""}`}
              onClick={() => setTab(t.id)}
              style={t.urgent ? { fontWeight: 600 } : {}}
            >
              {t.urgent && <span style={{ display: "inline-block", width: 6, height: 6, borderRadius: 999, background: "var(--brand-accent)", marginRight: 6, verticalAlign: "middle" }}></span>}
              {t.label}
              <span className="count">{t.count}</span>
            </div>
          ))}
        </div>

        {/* Bulk action bar — only on inbox tab when items selected */}
        {isInbox && selected.length > 0 && (
          <div style={{
            display: "flex", alignItems: "center", gap: 12,
            padding: "10px 20px", background: "var(--brand-accent-bg)",
            borderTop: "1px solid var(--line)", borderBottom: "1px solid var(--line)",
          }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: "var(--brand-accent)" }}>
              Đã chọn {selected.length} phiếu
            </span>
            <button className="btn btn-sm ghost" onClick={() => setSelected([])}>Bỏ chọn</button>
            <div style={{ flex: 1 }}></div>
            <button className="btn btn-sm" onClick={() => setBulkAction("request")}>
              <Icon name="refresh" size={12}/> Yêu cầu bổ sung
            </button>
            <button className="btn btn-sm danger" onClick={() => setBulkAction("reject")}>
              <Icon name="x" size={12}/> Từ chối
            </button>
            <button className="btn btn-sm primary" onClick={() => setBulkAction("approve")}>
              <Icon name="check" size={12}/> Duyệt {selected.length} phiếu
            </button>
          </div>
        )}

        <div className="toolbar">
          <div className="seg-bar">
            <button className="on">Tất cả</button>
            <button>Đề xuất chi phí</button>
            <button>Hợp đồng</button>
            <button>Mua sắm</button>
            <button>Khác</button>
          </div>
          <div className="filt-chip set">
            <span className="label">Phòng ban:</span> Tất cả <Icon name="chevronDown" size={12} />
          </div>
          <div className="filt-chip">
            <span className="label">Ưu tiên:</span> Tất cả <Icon name="chevronDown" size={12} />
          </div>
          <div className="filt-chip">
            <span className="label">Mức tiền:</span> Bất kỳ <Icon name="chevronDown" size={12} />
          </div>
          <div className="filt-chip">
            <Icon name="plus" size={12}/> Thêm bộ lọc
          </div>
          <div className="spacer"></div>
          <div className="muted" style={{ fontSize: 12 }}>
            Hiển thị <b>{visible.length}</b> / {APPROVALS.length} phiếu
          </div>
          <button className="icon-btn"><Icon name="refresh" size={16}/></button>
          <button className="icon-btn"><Icon name="settings" size={16}/></button>
        </div>

        {/* Table */}
        <div className="tbl-wrap">
          <table className="tbl">
            <thead>
              <tr>
                <th style={isInbox ? { width: 36 } : { display: "none" }}>
                  {isInbox && (
                    <input
                      type="checkbox"
                      checked={visible.length > 0 && selected.length === visible.length}
                      ref={el => { if (el) el.indeterminate = selected.length > 0 && selected.length < visible.length; }}
                      onChange={toggleAll}
                      style={{ cursor: "pointer" }}
                    />
                  )}
                </th>
                <th>Tiêu đề phiếu</th>
                <th style={{ width: 180 }}>Người tạo</th>
                <th style={{ width: 150, textAlign: "right" }}>Số tiền</th>
                <th style={{ width: 100 }}>Ưu tiên</th>
                <th style={{ width: 180 }}>Tiến độ duyệt</th>
                <th style={{ width: 140 }}>Trạng thái</th>
                <th style={{ width: 40 }}></th>
              </tr>
            </thead>
            <tbody>
              {visible.map((a, i) => {
                const creator = personById(a.creator);
                const isMine = a.chain.find(s => s.state === "current")?.person === ME.id;
                const totalSteps = a.chain.length || 1;
                const isRejected = a.status === "rejected";
                const isApproved = a.status === "approved";

                return (
                  <tr key={a.id} onClick={() => go("approval-detail", { id: a.id })} style={{ cursor: "pointer", background: selected.includes(a.id) ? "var(--brand-accent-bg)" : undefined }}>
                    <td style={isInbox ? {} : { display: "none" }} onClick={(e) => e.stopPropagation()}>
                      {isInbox && (
                        <input
                          type="checkbox"
                          checked={selected.includes(a.id)}
                          onChange={(e) => toggleSel(a.id, e)}
                          style={{ cursor: "pointer" }}
                        />
                      )}
                    </td>
                    <td style={{ paddingTop: 12, paddingBottom: 12 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                        <span className="mono" style={{ fontSize: 11.5, color: "var(--brand-ink)", fontWeight: 500 }}>{a.id}</span>
                        <span style={{ width: 3, height: 3, borderRadius: 999, background: "var(--t-tertiary)" }}></span>
                        <span className="muted" style={{ fontSize: 11.5 }}>{a.type}</span>
                        <span style={{ width: 3, height: 3, borderRadius: 999, background: "var(--t-tertiary)" }}></span>
                        <span className="muted" style={{ fontSize: 11.5 }}>{a.dept}</span>
                      </div>
                      <div style={{ fontSize: 13.5, fontWeight: 500, color: "var(--t-primary)", lineHeight: 1.4 }}>
                        {a.title}
                      </div>
                      <div className="muted" style={{ fontSize: 11.5, marginTop: 3, fontFamily: "var(--font-mono)" }}>
                        Tạo {a.createdAt.split(" ")[0].split("-").reverse().join("/")} · {a.createdAt.split(" ")[1]}
                      </div>
                    </td>
                    <td>
                      <div className="av-inline">
                        <Avatar person={creator} size={24} />
                        <div style={{ minWidth: 0 }}>
                          <div style={{ fontSize: 12.5, fontWeight: 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: 140 }}>{creator.name}</div>
                          <div className="muted" style={{ fontSize: 11, marginTop: 1 }}>{creator.role}</div>
                        </div>
                      </div>
                    </td>
                    <td className="mono" style={{ fontSize: 13, fontWeight: 600, fontVariantNumeric: "tabular-nums", color: a.amount === "—" ? "var(--t-tertiary)" : "var(--t-primary)", letterSpacing: "-0.005em", textAlign: "right" }}>{a.amount}</td>
                    <td><span className={`prio ${a.priority}`}>{a.priority === "high" ? "Cao" : a.priority === "mid" ? "TB" : "Thấp"}</span></td>
                    <td>
                      <ChainMini chain={a.chain} />
                    </td>
                    <td>
                      {isMine && <span className="badge accent"><span className="pip"></span>Đến lượt bạn</span>}
                      {!isMine && a.status === "current" && <span className="badge info"><span className="pip"></span>Cấp {a.currentStep}/{totalSteps}</span>}
                      {a.status === "waiting" && <span className="badge info"><span className="pip"></span>Đang chờ</span>}
                      {isApproved && <span className="badge success"><span className="pip"></span>Đã duyệt</span>}
                      {isRejected && <span className="badge danger"><span className="pip"></span>Từ chối</span>}
                      {a.status === "draft" && <span className="badge neutral"><span className="pip"></span>Nháp</span>}
                    </td>
                    <td><button className="icon-btn" onClick={e => e.stopPropagation()}><Icon name="moreV" size={16}/></button></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div style={{ padding: "12px 20px", borderTop: "1px solid var(--line)", display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 12.5, color: "var(--t-secondary)" }}>
          <div>1–{visible.length} của {visible.length}</div>
          <div className="row" style={{ gap: 8 }}>
            <button className="btn btn-sm ghost" disabled>Trước</button>
            <button className="btn btn-sm">Sau</button>
          </div>
        </div>
      </div>

      {/* Bulk action modal */}
      {bulkAction && (
        <div
          onClick={() => { setBulkAction(null); setBulkComment(""); }}
          style={{ position: "fixed", inset: 0, background: "rgba(15,18,22,0.55)", backdropFilter: "blur(3px)", zIndex: 900, display: "grid", placeItems: "center" }}
        >
          <div onClick={e => e.stopPropagation()} style={{ width: "min(520px, 92vw)", maxHeight: "88vh", background: "var(--bg-surface)", borderRadius: 12, boxShadow: "0 30px 80px rgba(0,0,0,0.35)", overflow: "hidden", display: "flex", flexDirection: "column" }}>
            <div style={{ padding: "18px 22px", borderBottom: "1px solid var(--line)" }}>
              <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>
                {bulkAction === "approve" ? `Duyệt ${selected.length} phiếu cùng lúc` :
                 bulkAction === "reject"  ? `Từ chối ${selected.length} phiếu` :
                                            `Yêu cầu bổ sung ${selected.length} phiếu`}
              </h3>
              <div className="muted" style={{ fontSize: 12, marginTop: 4 }}>
                {bulkAction === "approve"
                  ? "Hành động này sẽ phiếu được chuyển sang cấp tiếp theo. Không thể hoàn tác."
                  : "Vui lòng ghi rõ lý do để người tạo nắm được."}
              </div>
            </div>
            <div style={{ padding: "16px 22px" }}>
              <div className="muted" style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: 0.05, fontWeight: 600, marginBottom: 8 }}>Phiếu được chọn</div>
              <div style={{ maxHeight: 140, overflowY: "auto", border: "1px solid var(--line)", borderRadius: 6, padding: 8, marginBottom: 14 }}>
                {selected.map(id => {
                  const a = APPROVALS.find(x => x.id === id);
                  return (
                    <div key={id} style={{ display: "flex", alignItems: "center", gap: 8, padding: "4px 6px", fontSize: 12.5 }}>
                      <span className="mono" style={{ fontSize: 11, color: "var(--t-tertiary)", flexShrink: 0 }}>{id}</span>
                      <span style={{ flex: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{a?.title}</span>
                      <span className="mono muted" style={{ fontSize: 11 }}>{a?.amount}</span>
                    </div>
                  );
                })}
              </div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 500, marginBottom: 6 }}>
                Ý kiến {bulkAction === "approve" ? "(tuỳ chọn)" : <span style={{ color: "var(--st-danger)" }}>(bắt buộc)</span>}
              </label>
              <textarea
                value={bulkComment}
                onChange={e => setBulkComment(e.target.value)}
                placeholder={bulkAction === "approve" ? "Ý kiến áp dụng cho tất cả phiếu…" : "Lý do áp dụng cho tất cả phiếu…"}
                rows={3}
                style={{ width: "100%", border: "1px solid var(--line)", borderRadius: 6, padding: "8px 10px", fontSize: 13, fontFamily: "inherit", resize: "vertical", outline: "none", background: "var(--bg-canvas)" }}
              />
            </div>
            <div style={{ padding: "12px 22px", borderTop: "1px solid var(--line)", display: "flex", justifyContent: "flex-end", gap: 8 }}>
              <button className="btn ghost" onClick={() => { setBulkAction(null); setBulkComment(""); }}>Huỷ</button>
              <button
                className={`btn ${bulkAction === "approve" ? "primary" : bulkAction === "reject" ? "danger" : ""}`}
                disabled={bulkAction !== "approve" && !bulkComment.trim()}
                onClick={() => performBulk(bulkAction)}
              >
                {bulkAction === "approve" ? <><Icon name="check" size={13}/> Xác nhận duyệt</> :
                 bulkAction === "reject"  ? <><Icon name="x" size={13}/> Xác nhận từ chối</> :
                                            <><Icon name="refresh" size={13}/> Yêu cầu bổ sung</>}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div style={{
          position: "fixed", bottom: 28, left: "50%", transform: "translateX(-50%)",
          background: "var(--brand-ink)", color: "#fff", padding: "10px 18px",
          borderRadius: 999, fontSize: 13, fontWeight: 500, boxShadow: "0 8px 24px rgba(0,0,0,.22)",
          display: "flex", alignItems: "center", gap: 8, zIndex: 9999,
        }}>
          <Icon name="check" size={12}/> {toast}
        </div>
      )}
    </div>
  );
};

/* Mini chain visualization — pips */
const ChainMini = ({ chain }) => {
  if (!chain.length) return <span className="muted" style={{ fontSize: 12 }}>—</span>;
  return (
    <div className="row" style={{ gap: 3 }}>
      {chain.map((s, i) => {
        const cls = s.state === "approved" ? "done" : s.state === "rejected" ? "rej" : s.state === "current" ? "cur" : "pend";
        const bg = s.state === "approved" ? "var(--st-success)"
                 : s.state === "rejected" ? "var(--st-danger)"
                 : s.state === "current"  ? "var(--brand-accent)"
                 : "var(--line-strong)";
        return (
          <div key={i} title={`Cấp ${s.stepNo} · ${s.role}`} style={{ display: "flex", alignItems: "center", gap: 3 }}>
            <span style={{ width: 14, height: 14, borderRadius: 999, background: bg, display: "inline-grid", placeItems: "center", color: "#fff", fontSize: 9, fontWeight: 600, fontFamily: "var(--font-mono)" }}>
              {s.state === "approved" ? "✓" : s.state === "rejected" ? "✕" : s.stepNo}
            </span>
            {i < chain.length - 1 && <span style={{ width: 10, height: 2, background: s.state === "approved" ? "var(--st-success)" : "var(--line-strong)" }}></span>}
          </div>
        );
      })}
    </div>
  );
};

/* ===== Approval detail ===== */
const ApprovalDetailScreen = ({ go, ctx }) => {
  const id = ctx?.id || "PD-2026-0418";
  const a = APPROVALS.find(x => x.id === id) || APPROVALS[0];
  const creator = personById(a.creator);
  const isMine = a.chain.find(s => s.state === "current")?.person === ME.id;
  const [comment, setComment] = React.useState("");
  const [delegateOpen, setDelegateOpen] = React.useState(false);
  const [delegateTo, setDelegateTo] = React.useState(null);
  const [delegateReason, setDelegateReason] = React.useState("");
  const [comments, setComments] = React.useState([
    { by: "u11", at: "19/05 10:45", text: "Phiếu này khớp với ngân sách sửa chữa Q2. Đã đối soát với báo cáo T4." },
    { by: "u7",  at: "19/05 14:20", text: "Bổ sung báo giá từ 3 nhà cung cấp đính kèm. Đề nghị ưu tiên NCC đầu tiên." },
  ]);
  const [newComment, setNewComment] = React.useState("");
  const [toast, setToast] = React.useState(null);
  const flash = (msg) => { setToast(msg); clearTimeout(window.__apdToast); window.__apdToast = setTimeout(() => setToast(null), 2000); };

  const addComment = () => {
    const t = newComment.trim();
    if (!t) return;
    setComments(arr => [...arr, { by: ME.id, at: "20/05 vừa xong", text: t }]);
    setNewComment("");
    flash("Đã đăng bình luận");
  };
  const confirmDelegate = () => {
    if (!delegateTo) return;
    const p = personById(delegateTo);
    flash(`Đã uỷ quyền cho ${p.name}`);
    setDelegateOpen(false);
    setDelegateTo(null);
    setDelegateReason("");
  };

  return (
    <div className="page" style={{ paddingTop: 24, maxWidth: 1320 }}>
      {/* Breadcrumb / back */}
      <div style={{ marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
        <button className="btn ghost btn-sm" onClick={() => go("approval")}>
          <Icon name="chevron" size={12} className="ic" />
          <span style={{ transform: "scaleX(-1)", display: "inline-block" }}>›</span> Quay lại danh sách
        </button>
        <div className="muted" style={{ fontSize: 12, marginLeft: 6 }}>
          Phê duyệt / <span className="mono">{a.id}</span>
        </div>
      </div>

      <div className="detail-grid-360" style={{ gap: 24 }}>
        {/* Main column */}
        <div>
          {/* Title block */}
          <div className="card" style={{ marginBottom: 20 }}>
            <div style={{ padding: "24px 24px 18px" }}>
              <div className="row" style={{ marginBottom: 10, gap: 8, flexWrap: "wrap" }}>
                <span className="tag">{a.id}</span>
                <span className="badge neutral">{a.type}</span>
                <span className={`prio ${a.priority}`}>{a.priority === "high" ? "Ưu tiên cao" : a.priority === "mid" ? "Ưu tiên TB" : "Ưu tiên thấp"}</span>
                {isMine && <span className="badge accent"><span className="pip"></span>Đến lượt bạn duyệt</span>}
              </div>
              <h1 style={{ margin: "0 0 12px", fontSize: 22, fontWeight: 700, letterSpacing: "-0.015em" }}>{a.title}</h1>
              <div className="row" style={{ gap: 24, flexWrap: "wrap", color: "var(--t-secondary)", fontSize: 13 }}>
                <div className="row" style={{ gap: 6 }}>
                  <Icon name="user" size={14} />
                  Người tạo: <Avatar person={creator} size={20} /> <b style={{ color: "var(--t-primary)", fontWeight: 500 }}>{creator.name}</b>
                </div>
                <div>Phòng: <b style={{ color: "var(--t-primary)", fontWeight: 500 }}>{a.dept}</b></div>
                <div>Tạo lúc: <span className="mono" style={{ fontSize: 12, color: "var(--t-primary)" }}>{a.createdAt}</span></div>
              </div>
            </div>

            {/* Chuỗi duyệt */}
            <div style={{ borderTop: "1px solid var(--line)", paddingTop: 6 }}>
              <div style={{ padding: "16px 24px 4px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 13 }}>Chuỗi phê duyệt</div>
                  <div className="muted" style={{ fontSize: 12, marginTop: 2 }}>Cấp {a.currentStep}/{a.chain.length} · {a.chain.filter(s => s.state === "approved").length} đã duyệt</div>
                </div>
                <button className="btn ghost btn-sm"><Icon name="eye" size={12}/> Xem nhật ký đầy đủ</button>
              </div>
              <div className="chain">
                {a.chain.map(s => {
                  const p = personById(s.person);
                  return (
                    <div key={s.stepNo} className={`chain-step ${s.state === "approved" ? "done" : s.state === "current" ? "current" : s.state === "rejected" ? "done" : "pending"}`}>
                      <div className="step-num">Cấp {s.stepNo}</div>
                      <div className="row" style={{ marginBottom: 8 }}>
                        <Avatar person={p} size={28} />
                        <div>
                          <div className="step-name">{p.name}</div>
                          <div className="step-role">{s.role}</div>
                        </div>
                      </div>
                      <div className="step-state">
                        {s.state === "approved" && (
                          <span className="badge success"><Icon name="check" size={11}/> Đã duyệt · {s.at?.split(" ")[1]}</span>
                        )}
                        {s.state === "rejected" && (
                          <span className="badge danger"><Icon name="x" size={11}/> Từ chối · {s.at?.split(" ")[1]}</span>
                        )}
                        {s.state === "current" && (
                          <span className="badge accent"><span className="pip"></span> Đang chờ duyệt</span>
                        )}
                        {s.state === "pending" && (
                          <span className="badge neutral"><span className="pip"></span> Chờ đến lượt</span>
                        )}
                      </div>
                      {s.note && (
                        <div style={{ marginTop: 8, fontSize: 11.5, color: "var(--t-secondary)", borderTop: "1px dashed var(--line)", paddingTop: 8, fontStyle: "italic" }}>
                          "{s.note}"
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Action panel — only if mine */}
          {isMine && (
            <div className="card" style={{ marginBottom: 20, borderColor: "var(--brand-accent)", boxShadow: "0 0 0 4px var(--brand-accent-bg)" }}>
              <div style={{ padding: "20px 24px" }}>
                <div className="row" style={{ marginBottom: 14 }}>
                  <Icon name="sparkle" size={18} className="ic" style={{ color: "var(--brand-accent)" }}/>
                  <b style={{ fontSize: 14 }}>Quyết định của bạn</b>
                  <div className="spacer"></div>
                  <span className="muted" style={{ fontSize: 12 }}>Cấp {a.currentStep}/{a.chain.length} — {a.chain[a.currentStep - 1]?.role}</span>
                </div>
                <textarea
                  value={comment}
                  onChange={e => setComment(e.target.value)}
                  placeholder="Ý kiến / lý do (tuỳ chọn cho Duyệt, bắt buộc cho Từ chối hoặc Yêu cầu bổ sung)…"
                  style={{
                    width: "100%", minHeight: 80,
                    border: "1px solid var(--line)",
                    borderRadius: "var(--r-sm)",
                    padding: "10px 12px",
                    fontFamily: "inherit", fontSize: 13,
                    outline: "none", resize: "vertical",
                    background: "var(--bg-canvas)",
                  }}
                />
                <div className="row" style={{ marginTop: 14, justifyContent: "space-between" }}>
                  <div className="row" style={{ gap: 8 }}>
                    <button className="btn btn-sm ghost"><Icon name="paperclip" size={14}/> Đính kèm</button>
                    <button className="btn btn-sm ghost"><Icon name="users" size={14}/> @ Tag người</button>
                  </div>
                  <div className="row" style={{ gap: 8 }}>
                    <button className="btn danger" onClick={() => flash("Đã từ chối phiếu")}><Icon name="x" size={14}/> Từ chối</button>
                    <button className="btn" onClick={() => flash("Đã gửi yêu cầu bổ sung")}><Icon name="refresh" size={14}/> Yêu cầu bổ sung</button>
                    <button className="btn" onClick={() => setDelegateOpen(true)}><Icon name="users" size={14}/> Uỷ quyền</button>
                    <button className="btn accent" onClick={() => flash("Đã phê duyệt & chuyển cấp tiếp theo")}><Icon name="check" size={14}/> Phê duyệt & chuyển cấp tiếp theo</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Description */}
          <div className="card" style={{ marginBottom: 20 }}>
            <div className="card-head">
              <h3>Nội dung phiếu</h3>
              <div className="muted" style={{ fontSize: 12 }}>Cập nhật lần cuối {a.createdAt.split(" ")[0]}</div>
            </div>
            <div className="card-body">
              <p style={{ margin: "0 0 16px", lineHeight: 1.6 }}>{a.description}</p>
              <div className="stat-3-grid" style={{ padding: 14, background: "var(--bg-canvas)", borderRadius: "var(--r-sm)", border: "1px solid var(--line)" }}>
                <div>
                  <div className="muted" style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: 0.04, fontWeight: 600 }}>Tổng chi phí</div>
                  <div style={{ fontSize: 18, fontWeight: 700, marginTop: 4, fontFamily: "var(--font-mono)", letterSpacing: "-0.01em" }}>{a.amount}</div>
                </div>
                <div>
                  <div className="muted" style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: 0.04, fontWeight: 600 }}>Hạng mục</div>
                  <div style={{ fontSize: 14, fontWeight: 500, marginTop: 4 }}>{a.type}</div>
                </div>
                <div>
                  <div className="muted" style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: 0.04, fontWeight: 600 }}>Phòng đề xuất</div>
                  <div style={{ fontSize: 14, fontWeight: 500, marginTop: 4 }}>{a.dept}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Attachments */}
          {a.files.length > 0 && (
            <div className="card" style={{ marginBottom: 20 }}>
              <div className="card-head">
                <h3>Tài liệu đính kèm <span className="muted" style={{ fontWeight: 500, fontSize: 12, marginLeft: 6 }}>({a.files.length})</span></h3>
                <button className="btn ghost btn-sm"><Icon name="download" size={12}/> Tải tất cả</button>
              </div>
              <div className="card-body">
                <div className="row wrap" style={{ gap: 10 }}>
                  {a.files.map((f, i) => (
                    <div key={i} className="file-chip">
                      <div className={`ftype ${f.type}`}>{f.type.toUpperCase()}</div>
                      <div>
                        <div>{f.name}</div>
                      </div>
                      <span className="meta">{f.size}</span>
                      <button className="icon-btn" style={{ width: 24, height: 24 }}><Icon name="download" size={13}/></button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Timeline */}
          <div className="card" style={{ marginBottom: 20 }}>
            <div className="card-head">
              <h3>Nhật ký phê duyệt</h3>
              <div className="muted" style={{ fontSize: 12 }}>Tất cả thay đổi đều được ghi lại</div>
            </div>
            <div className="tl">
              {a.chain.filter(s => s.state === "approved" || s.state === "rejected").reverse().map(s => {
                const p = personById(s.person);
                return (
                  <div key={s.stepNo} className={`tl-item ${s.state === "rejected" ? "reject" : "approve"}`}>
                    <div className="tl-icon">{s.state === "rejected" ? <Icon name="x" size={12}/> : <Icon name="check" size={12}/>}</div>
                    <div className="tl-body">
                      <span className="who">{p.name}</span>
                      <span className="what"> {s.state === "rejected" ? "đã từ chối" : "đã phê duyệt"} (Cấp {s.stepNo} · {s.role})</span>
                      <div className="when">{s.at}</div>
                      {s.note && <div className="quote">"{s.note}"</div>}
                    </div>
                  </div>
                );
              })}
              <div className="tl-item create">
                <div className="tl-icon"><Icon name="plus" size={12}/></div>
                <div className="tl-body">
                  <span className="who">{creator.name}</span>
                  <span className="what"> tạo phiếu trình duyệt {a.chain.length} cấp</span>
                  <div className="when">{a.createdAt}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Comments thread */}
          <div className="card">
            <div className="card-head">
              <h3>Trao đổi <span className="muted" style={{ fontWeight: 500, fontSize: 12, marginLeft: 6 }}>({comments.length})</span></h3>
              <div className="muted" style={{ fontSize: 12 }}>Bình luận nội bộ — không ảnh hưởng đến luồng duyệt</div>
            </div>
            <div style={{ padding: "16px 24px 0" }}>
              {comments.map((c, i) => {
                const p = personById(c.by);
                const isMe = c.by === ME.id;
                return (
                  <div key={i} style={{ display: "flex", gap: 12, padding: "12px 0", borderBottom: i < comments.length - 1 ? "1px solid var(--line)" : "none" }}>
                    <Avatar person={p} size={32} />
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 4 }}>
                        <b style={{ fontSize: 13 }}>{p.name}</b>
                        <span className="muted" style={{ fontSize: 11 }}>{p.role}</span>
                        <span className="muted mono" style={{ fontSize: 11, marginLeft: "auto" }}>{c.at}</span>
                      </div>
                      <div style={{ fontSize: 13.5, lineHeight: 1.55, color: "var(--t-primary)" }}>{c.text}</div>
                      <div className="row" style={{ gap: 12, marginTop: 6 }}>
                        <button className="btn ghost btn-sm" style={{ height: 22, padding: "0 6px", fontSize: 11 }} onClick={() => flash("Đã reply")}><Icon name="refresh" size={10}/> Reply</button>
                        {!isMe && <button className="btn ghost btn-sm" style={{ height: 22, padding: "0 6px", fontSize: 11 }} onClick={() => flash("Đã like")}>👍</button>}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div style={{ padding: "14px 24px 18px", borderTop: "1px solid var(--line)", background: "var(--bg-canvas)" }}>
              <div style={{ display: "flex", gap: 12 }}>
                <Avatar person={ME} size={32} />
                <div style={{ flex: 1 }}>
                  <textarea
                    value={newComment}
                    onChange={e => setNewComment(e.target.value)}
                    placeholder="Viết bình luận (gắn @ để tag người)…"
                    rows={2}
                    style={{ width: "100%", border: "1px solid var(--line)", borderRadius: 6, padding: "8px 10px", fontSize: 13, fontFamily: "inherit", resize: "vertical", outline: "none", background: "var(--bg-surface)" }}
                  />
                  <div className="row between" style={{ marginTop: 8 }}>
                    <div className="row" style={{ gap: 6 }}>
                      <button className="btn btn-sm ghost" style={{ height: 26, fontSize: 11.5 }} onClick={() => flash("Đính kèm")}><Icon name="paperclip" size={11}/></button>
                      <button className="btn btn-sm ghost" style={{ height: 26, fontSize: 11.5 }} onClick={() => setNewComment(s => s + "@")}>@</button>
                    </div>
                    <button className="btn btn-sm primary" disabled={!newComment.trim()} onClick={addComment}>
                      <Icon name="send" size={11}/> Đăng bình luận
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Side column */}
        <aside style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div className="card">
            <div className="card-head"><h3>Thông tin nhanh</h3></div>
            <div className="card-body" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <InfoRow label="Trạng thái" value={
                a.status === "current" ? <span className="badge accent"><span className="pip"></span>Đang duyệt — Cấp {a.currentStep}</span>
                  : a.status === "approved" ? <span className="badge success"><span className="pip"></span>Hoàn tất</span>
                  : a.status === "rejected" ? <span className="badge danger"><span className="pip"></span>Đã từ chối</span>
                  : <span className="badge neutral">Bản nháp</span>
              }/>
              <InfoRow label="Mức ưu tiên" value={<span className={`prio ${a.priority}`}>{a.priority === "high" ? "Cao" : a.priority === "mid" ? "Trung bình" : "Thấp"}</span>} />
              <InfoRow label="Thời hạn duyệt" value={<span className="mono" style={{ fontSize: 12 }}>22/05/2026 · còn 2 ngày</span>} />
              <InfoRow label="SLA trung bình" value={<span style={{ fontSize: 13 }}><b>1,2 ngày</b> <span className="muted">trên 4 cấp</span></span>} />
            </div>
          </div>

          <div className="card">
            <div className="card-head">
              <h3>Người theo dõi</h3>
              <button className="btn ghost btn-sm"><Icon name="plus" size={12}/></button>
            </div>
            <div className="card-body" style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {a.watchers.length === 0 && <div className="muted" style={{ fontSize: 12 }}>Chưa có watcher</div>}
              {a.watchers.map(w => {
                const p = personById(w);
                return (
                  <div key={w} className="av-inline">
                    <Avatar person={p} size={26} />
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 500 }}>{p.name}</div>
                      <div className="muted" style={{ fontSize: 11 }}>{p.role}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="card">
            <div className="card-head"><h3>Phiếu liên quan</h3></div>
            <div className="card-body" style={{ display: "flex", flexDirection: "column", gap: 0 }}>
              {[
                { id: "PD-2026-0395", title: "Sửa chữa lashing VINA STAR (T4)", status: "approved" },
                { id: "PD-2026-0360", title: "Bảo dưỡng định kỳ VINA STAR", status: "approved" },
              ].map(r => (
                <div key={r.id} style={{ display: "flex", flexDirection: "column", padding: "8px 0", borderBottom: "1px solid var(--line)" }}>
                  <span className="mono" style={{ fontSize: 11, color: "var(--t-tertiary)" }}>{r.id}</span>
                  <span style={{ fontSize: 13 }}>{r.title}</span>
                  <span className="badge success" style={{ alignSelf: "flex-start", marginTop: 4 }}><span className="pip"></span>Đã duyệt</span>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>

      {/* Delegate modal */}
      {delegateOpen && (
        <div onClick={() => setDelegateOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(15,18,22,0.55)", backdropFilter: "blur(3px)", zIndex: 900, display: "grid", placeItems: "center" }}>
          <div onClick={e => e.stopPropagation()} style={{ width: "min(480px, 92vw)", maxHeight: "88vh", background: "var(--bg-surface)", borderRadius: 12, boxShadow: "0 30px 80px rgba(0,0,0,0.35)", overflow: "hidden", display: "flex", flexDirection: "column" }}>
            <div style={{ padding: "18px 22px", borderBottom: "1px solid var(--line)" }}>
              <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>Uỷ quyền cho người khác</h3>
              <div className="muted" style={{ fontSize: 12, marginTop: 4 }}>
                Phiếu này sẽ được chuyển sang người bạn chọn để duyệt thay (phù hợp khi bạn đi công tác).
              </div>
            </div>
            <div style={{ padding: "16px 22px" }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 500, marginBottom: 8 }}>Chọn người nhận uỷ quyền</label>
              <div className="people-pick-grid" style={{ gap: 8, maxHeight: 180, overflowY: "auto", marginBottom: 14 }}>
                {PEOPLE.filter(p => p.id !== ME.id && (p.dept === ME.dept || p.role.includes("GĐ") || p.role.includes("TGD") || p.role.includes("TGĐ"))).map(p => (
                  <button
                    key={p.id}
                    onClick={() => setDelegateTo(p.id)}
                    style={{
                      display: "flex", alignItems: "center", gap: 10, padding: "8px 10px",
                      background: delegateTo === p.id ? "var(--brand-accent-bg)" : "transparent",
                      border: `1px solid ${delegateTo === p.id ? "var(--brand-accent)" : "var(--line)"}`,
                      borderRadius: 6, cursor: "pointer", textAlign: "left", fontFamily: "inherit",
                    }}
                  >
                    <Avatar person={p} size={28}/>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.name}</div>
                      <div className="muted" style={{ fontSize: 11, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.role}</div>
                    </div>
                  </button>
                ))}
              </div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 500, marginBottom: 6 }}>Lý do uỷ quyền <span style={{ color: "var(--st-danger)" }}>*</span></label>
              <textarea
                value={delegateReason}
                onChange={e => setDelegateReason(e.target.value)}
                placeholder="VD: Đi công tác Nha Trang 21-23/05, nhờ chị Mai duyệt thay…"
                rows={2}
                style={{ width: "100%", border: "1px solid var(--line)", borderRadius: 6, padding: "8px 10px", fontSize: 13, fontFamily: "inherit", resize: "vertical", outline: "none", background: "var(--bg-canvas)" }}
              />
            </div>
            <div style={{ padding: "12px 22px", borderTop: "1px solid var(--line)", display: "flex", justifyContent: "flex-end", gap: 8 }}>
              <button className="btn ghost" onClick={() => setDelegateOpen(false)}>Huỷ</button>
              <button className="btn primary" disabled={!delegateTo || !delegateReason.trim()} onClick={confirmDelegate}>
                <Icon name="check" size={13}/> Xác nhận uỷ quyền
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div style={{ position: "fixed", bottom: 28, left: "50%", transform: "translateX(-50%)", background: "var(--brand-ink)", color: "#fff", padding: "10px 18px", borderRadius: 999, fontSize: 13, fontWeight: 500, boxShadow: "0 8px 24px rgba(0,0,0,.22)", display: "flex", alignItems: "center", gap: 8, zIndex: 9999 }}>
          <Icon name="check" size={12}/> {toast}
        </div>
      )}
    </div>
  );
};

const InfoRow = ({ label, value }) => (
  <div className="row between">
    <span className="muted" style={{ fontSize: 12 }}>{label}</span>
    {value}
  </div>
);

Object.assign(window, { ApprovalListScreen, ApprovalDetailScreen });
