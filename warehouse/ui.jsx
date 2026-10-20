/* ==========================================================
   Kho Bãi — thành phần giao diện dùng chung
   ========================================================== */

const ICONS = {
  dashboard: ['M3 3h7v9H3z', 'M14 3h7v5h-7z', 'M14 12h7v9h-7z', 'M3 16h7v5H3z'],
  map: ['M3 3h18v18H3z', 'M3 10h18', 'M10 21V10', 'M15 3v7'],
  in: ['M12 3v12', 'M7 10l5 5 5-5', 'M5 21h14'],
  out: ['M12 15V3', 'M7 8l5-5 5 5', 'M5 21h14'],
  transfer: ['M7 7h13', 'M16 3l4 4-4 4', 'M17 17H4', 'M8 13l-4 4 4 4'],
  stock: ['M12 2l9 5-9 5-9-5 9-5z', 'M3 12l9 5 9-5', 'M3 17l9 5 9-5'],
  users: ['M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2', 'M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z', 'M22 21v-2a4 4 0 0 0-3-3.87', 'M16 3.13a4 4 0 0 1 0 7.75'],
  report: ['M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z', 'M14 2v6h6', 'M8 13h8', 'M8 17h8', 'M8 9h2'],
  box: ['M21 8l-9-5-9 5v8l9 5 9-5z', 'M3 8l9 5 9-5', 'M12 13v8'],
  db: ['M12 8c4.97 0 9-1.34 9-3s-4.03-3-9-3-9 1.34-9 3 4.03 3 9 3z', 'M3 5v14c0 1.66 4.03 3 9 3s9-1.34 9-3V5', 'M3 12c0 1.66 4.03 3 9 3s9-1.34 9-3'],
  plus: ['M12 5v14', 'M5 12h14'],
  edit: ['M12 20h9', 'M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z'],
  trash: ['M3 6h18', 'M8 6V4h8v2', 'M19 6l-1 14H6L5 6'],
  print: ['M6 9V2h12v7', 'M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2', 'M6 14h12v8H6z'],
  download: ['M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4', 'M7 10l5 5 5-5', 'M12 15V3'],
  upload: ['M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4', 'M17 8l-5-5-5 5', 'M12 3v12'],
  search: ['M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16z', 'M21 21l-4.35-4.35'],
  x: ['M18 6L6 18', 'M6 6l12 12'],
  check: ['M20 6L9 17l-5-5'],
  alert: ['M12 9v4', 'M12 17h.01', 'M10.3 3.9L1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z'],
  refresh: ['M23 4v6h-6', 'M1 20v-6h6', 'M3.5 9a9 9 0 0 1 14.9-3.4L23 10', 'M1 14l4.6 4.4A9 9 0 0 0 20.5 15'],
  clipboard: ['M9 2h6v4H9z', 'M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2', 'M9 14l2 2 4-4'],
  arrowRight: ['M5 12h14', 'M13 6l6 6-6 6'],
};

function Icon({ name, size = 16 }) {
  const paths = ICONS[name] || [];
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {paths.map((d, i) => <path key={i} d={d} />)}
    </svg>
  );
}

function Button({ icon, children, variant = 'default', size, className = '', ...rest }) {
  return (
    <button type="button" className={`btn btn-${variant} ${size ? 'btn-' + size : ''} ${className}`} {...rest}>
      {icon && <Icon name={icon} size={size === 'sm' ? 14 : 16} />}
      {children && <span>{children}</span>}
    </button>
  );
}

function Badge({ tone = 'neutral', children }) {
  return <span className={`badge badge-${tone}`}>{children}</span>;
}

function TxnBadge({ type }) {
  const t = TXN_TYPES[type];
  return t ? <Badge tone={t.tone}>{t.short}</Badge> : null;
}

function Card({ title, actions, children, className = '', pad = true }) {
  return (
    <section className={`card ${className}`}>
      {(title || actions) && (
        <header className="card-head">
          {title && <h3>{title}</h3>}
          {actions && <div className="card-actions">{actions}</div>}
        </header>
      )}
      <div className={pad ? 'card-body' : ''}>{children}</div>
    </section>
  );
}

function Field({ label, required, hint, error, children, span }) {
  return (
    <label className={`field ${span ? 'span-' + span : ''} ${error ? 'has-error' : ''}`}>
      <span className="field-label">{label}{required && <b> *</b>}</span>
      {children}
      {error ? <small className="field-error">{error}</small> : hint ? <small className="field-hint">{hint}</small> : null}
    </label>
  );
}

function Select({ value, onChange, options, placeholder, ...rest }) {
  return (
    <select value={value ?? ''} onChange={e => onChange(e.target.value)} {...rest}>
      {placeholder !== undefined && <option value="">{placeholder}</option>}
      {options.map(o => <option key={o.value} value={o.value} disabled={o.disabled}>{o.label}</option>)}
    </select>
  );
}

function SearchBox({ value, onChange, placeholder = 'Tìm kiếm…' }) {
  return (
    <div className="search-box">
      <Icon name="search" size={15} />
      <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} />
    </div>
  );
}

function Modal({ title, onClose, children, footer, width = 560, className = '' }) {
  useEffect(() => {
    const h = e => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [onClose]);
  return (
    <div className="modal-backdrop" onMouseDown={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className={`modal ${className}`} style={{ maxWidth: width }} role="dialog" aria-label={title}>
        <header className="modal-head">
          <h3>{title}</h3>
          <button type="button" className="icon-btn" onClick={onClose} aria-label="Đóng"><Icon name="x" /></button>
        </header>
        <div className="modal-body">{children}</div>
        {footer && <footer className="modal-foot">{footer}</footer>}
      </div>
    </div>
  );
}

function Empty({ icon = 'box', title, children }) {
  return (
    <div className="empty">
      <Icon name={icon} size={28} />
      <strong>{title}</strong>
      {children && <p>{children}</p>}
    </div>
  );
}

function Kpi({ label, value, unit, sub, tone }) {
  return (
    <div className={`kpi ${tone ? 'kpi-' + tone : ''}`}>
      <span className="kpi-label">{label}</span>
      <span className="kpi-value">{value}{unit && <small> {unit}</small>}</span>
      {sub && <span className="kpi-sub">{sub}</span>}
    </div>
  );
}

function FillBar({ value, max }) {
  const pct = max > 0 ? Math.min(100, (value / max) * 100) : 0;
  const tone = pct >= 90 ? 'danger' : pct >= 70 ? 'warning' : 'success';
  return <div className="fillbar"><div className={`fillbar-in fill-${tone}`} style={{ width: pct + '%' }} /></div>;
}

/* ---------- thông báo nhanh ---------- */
function toast(message, tone = 'success') {
  window.dispatchEvent(new CustomEvent('app-toast', { detail: { message, tone, id: uid() } }));
}

function ToastHost() {
  const [items, setItems] = useState([]);
  useEffect(() => {
    const h = e => {
      const it = e.detail;
      setItems(xs => [...xs, it]);
      setTimeout(() => setItems(xs => xs.filter(x => x.id !== it.id)), 3800);
    };
    window.addEventListener('app-toast', h);
    return () => window.removeEventListener('app-toast', h);
  }, []);
  return (
    <div className="toasts" aria-live="polite">
      {items.map(t => (
        <div key={t.id} className={`toast toast-${t.tone}`}>
          <Icon name={t.tone === 'success' ? 'check' : 'alert'} />
          <span>{t.message}</span>
        </div>
      ))}
    </div>
  );
}

/* ---------- in ấn ---------- */
// Chỉ phần tử có class "print-area" được in (xem @media print trong styles.css)
function printArea() { window.print(); }

function PageHeader({ title, subtitle, actions }) {
  return (
    <div className="page-head">
      <div>
        <h1>{title}</h1>
        {subtitle && <p>{subtitle}</p>}
      </div>
      {actions && <div className="page-actions">{actions}</div>}
    </div>
  );
}
