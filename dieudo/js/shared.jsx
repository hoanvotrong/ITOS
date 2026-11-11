/* Điều độ khai thác (pilot) — thành phần dùng chung thay cho phần ngoài module của prototype
   · Avatar, Topbar (từ appshell.jsx) · KdToast, useKdToast (từ kd/customers.jsx) · KdStepper (từ kd/draft.jsx)
   · Danh mục khách hàng: dd_catalog (kind = customer) thay dữ liệu PTKD mẫu
   · PTKD (hợp đồng, báo giá) chưa kết nối trong pilot → danh sách rỗng, job gắn nhãn "Chưa có HĐ" */

window.KD_CUSTOMERS = DD_BOOT.catalog.customer;
window.KD_CONTRACTS = [];
window.KD_QUOTES = [];
const KD_CONTRACT_STATUS = {};
const kdShortMoney = (v) => (v || 0).toLocaleString("vi-VN");

/* Mã phần tử không trùng giữa các thiết bị: TIỀN TỐ-ddmm-HHmm-xxx (GMT+7) */
const ddNewId = (prefix) => {
  const n = window.ddVnNow();
  const a = new Uint32Array(1); crypto.getRandomValues(a);
  return `${prefix}-${n.date.slice(0, 2)}${n.date.slice(3, 5)}-${n.time.replace(":", "")}-${a[0].toString(36).slice(-3).toUpperCase()}`;
};

const Avatar = ({ person, size = 26, className = "" }) => {
  if (!person) return null;
  const style = { width: size, height: size, fontSize: Math.max(9, size * 0.4) };
  return <span className={`av c${person.color || 0} ${className}`} style={style} title={person.name}>{person.short}</span>;
};

/* Trạng thái đồng bộ: Đã đồng bộ / Đang lưu / N chờ đồng bộ (mất mạng) */
const DdSyncBadge = ({ dark }) => {
  const [, force] = React.useState(0);
  React.useEffect(() => DD_SYNC.onStatus(() => force(x => x + 1)), []);
  const st = DD_SYNC.status();
  const txt = !st.online ? `✕ Mất mạng${st.pending ? ` · ${st.pending} chờ đồng bộ` : ""}` : st.pending ? `⟳ Đang lưu ${st.pending}` : st.error ? "⚠ Lỗi đồng bộ — thử lại" : "✓ Đã đồng bộ";
  const color = dark ? "#fff" : !st.online || st.error ? "var(--st-warning)" : st.pending ? "var(--t-secondary)" : "var(--st-success)";
  return <span title={st.error || ""} style={{ color, fontSize: 12, whiteSpace: "nowrap" }}>{txt}</span>;
};

const Topbar = ({ crumbs = [] }) => (
  <header className="topbar">
    <div className="crumb">
      {crumbs.map((c, i) => (
        <React.Fragment key={i}>
          {i > 0 && <span className="sep">/</span>}
          <span className={i === crumbs.length - 1 ? "b" : ""}>{i === crumbs.length - 1 ? <b>{c}</b> : c}</span>
        </React.Fragment>
      ))}
    </div>
    <div style={{ flex: 1 }}></div>
    <div className="top-actions" style={{ display: "flex", alignItems: "center", gap: 14 }}>
      <span className="badge warning">Chạy thử</span>
      <DdSyncBadge />
      <span style={{ fontSize: 12.5 }}><b>{DD_ME.name}</b> <span className="muted">· {DD_ME.role}</span></span>
      <button className="btn ghost btn-sm" onClick={() => DD_SYNC.signOut()}>Đăng xuất</button>
    </div>
  </header>
);

const KdToast = ({ text }) => text ? (
  <div style={{ position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)", background: "var(--brand-ink)", color: "#fff", padding: "10px 16px", borderRadius: 999, fontSize: 12.5, fontWeight: 500, boxShadow: "0 8px 24px rgba(0,0,0,.22)", display: "flex", alignItems: "center", gap: 7, zIndex: 90 }}>
    <Icon name="check" size={12}/> {text}
  </div>
) : null;
const useKdToast = () => {
  const [toast, setToast] = React.useState(null);
  const flash = (m) => { setToast(m); clearTimeout(window.__kdToastT); window.__kdToastT = setTimeout(() => setToast(null), 2200); };
  return [toast, flash];
};

const KdStepper = ({ steps, current, onPick }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 0 }}>
    {steps.map((s, i) => {
      const done = i < current, on = i === current;
      return (
        <React.Fragment key={s}>
          <button onClick={() => onPick && onPick(i)} disabled={!onPick || i > current}
            style={{ display: "flex", alignItems: "center", gap: 8, background: "none", border: 0, padding: 0, cursor: onPick && i <= current ? "pointer" : "default" }}>
            <span style={{ width: 24, height: 24, borderRadius: 999, display: "grid", placeItems: "center", fontSize: 12, fontWeight: 700, flexShrink: 0,
              background: done ? "var(--st-success)" : on ? "var(--brand-accent)" : "var(--bg-sunken)", color: done || on ? "#fff" : "var(--t-tertiary)" }}>
              {done ? <Icon name="check" size={12}/> : i + 1}
            </span>
            <span style={{ fontSize: 13, fontWeight: on ? 600 : 500, color: on ? "var(--t-primary)" : "var(--t-secondary)", whiteSpace: "nowrap" }}>{s}</span>
          </button>
          {i < steps.length - 1 && <span style={{ flex: 1, minWidth: 24, height: 2, margin: "0 12px", background: done ? "var(--st-success)" : "var(--line)", borderRadius: 2 }}></span>}
        </React.Fragment>
      );
    })}
  </div>
);

/* Nút chụp ảnh thật: mở camera sau trên điện thoại (capture="environment"), trả về File */
const DdPhotoBtn = ({ file, onPick, label, done, className, style }) => {
  const ref = React.useRef(null);
  return (<>
    <button type="button" className={className} style={style} onClick={() => ref.current && ref.current.click()}>{file ? done : label}</button>
    <input ref={ref} type="file" accept="image/*" capture="environment" style={{ display: "none" }} onChange={e => { const f = e.target.files && e.target.files[0]; if (f) onPick(f); e.target.value = ""; }} />
  </>);
};

/* Xem ảnh đã lưu (bucket private → đường dẫn ký tạm 1 giờ). path === true: ảnh chưa tải lên xong */
const DdPhoto = ({ path, label = "Ảnh", inline, height = 140 }) => {
  const [url, setUrl] = React.useState(null);
  const [err, setErr] = React.useState(null);
  React.useEffect(() => { if (typeof path === "string") DD_SYNC.photoUrl(path).then(setUrl, e => setErr(e.message || "Không mở được ảnh")); }, [path]);
  if (typeof path !== "string") return <span className="muted" style={{ fontSize: 11.5 }}>{inline ? label : `${label} · đang tải lên…`}</span>;
  if (inline) return url ? <a href={url} target="_blank" rel="noopener" title="Xem ảnh">{label}</a> : <span className="muted">{label}</span>;
  return (
    <div style={{ borderRadius: 8, overflow: "hidden", background: "var(--bg-sunken)", minHeight: 60, display: "grid", placeItems: "center" }}>
      {url ? <a href={url} target="_blank" rel="noopener"><img src={url} alt={label} style={{ maxHeight: height, maxWidth: "100%", display: "block" }} /></a>
        : <span className="muted" style={{ fontSize: 12 }}>{err || `${label} · đang mở…`}</span>}
    </div>
  );
};

Object.assign(window, { Avatar, Topbar, KdToast, useKdToast, KdStepper, DdPhotoBtn, DdPhoto, DdSyncBadge, ddNewId });
