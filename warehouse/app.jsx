/* ==========================================================
   Kho Bãi — khung ứng dụng & điều hướng
   ========================================================== */

const NAV = [
  { group: 'Vận hành' },
  { id: 'dashboard', label: 'Tổng quan', icon: 'dashboard' },
  { id: 'layout', label: 'Sơ đồ kho', icon: 'map' },
  { id: 'in', label: 'Nhập kho', icon: 'in' },
  { id: 'out', label: 'Xuất kho', icon: 'out' },
  { id: 'transfer', label: 'Chuyển kho', icon: 'transfer' },
  { id: 'stock', label: 'Tồn kho', icon: 'stock' },
  { group: 'Khách hàng' },
  { id: 'customers', label: 'Danh sách khách hàng', icon: 'users' },
  { id: 'report', label: 'Báo cáo theo khách hàng', icon: 'report' },
  { group: 'Hệ thống' },
  { id: 'cargos', label: 'Danh mục hàng hóa', icon: 'box' },
  { id: 'data', label: 'Sao lưu dữ liệu', icon: 'db' },
];

function readHash() {
  const [screen, query] = location.hash.replace(/^#\/?/, '').split('?');
  const params = Object.fromEntries(new URLSearchParams(query || ''));
  return { screen: NAV.some(n => n.id === screen) ? screen : 'dashboard', params };
}

function App() {
  const store = useWarehouseStore();
  const { db } = store;
  const [route, setRoute] = useState(readHash);
  const [navOpen, setNavOpen] = useState(false);

  useEffect(() => {
    const h = () => setRoute(readHash());
    window.addEventListener('hashchange', h);
    return () => window.removeEventListener('hashchange', h);
  }, []);

  const nav = (screen, params = {}) => {
    const qs = new URLSearchParams(params).toString();
    location.hash = `/${screen}${qs ? '?' + qs : ''}`;
    setNavOpen(false);
    window.scrollTo(0, 0);
  };

  const lk = useMemo(() => ({ cust: byId(db.customers), cargo: byId(db.cargos), zone: byId(db.zones), wh: byId(db.warehouses) }), [db.customers, db.cargos, db.zones, db.warehouses]);
  const stock = useMemo(() => computeStock(db.txns), [db.txns]);
  const loads = useMemo(() => zoneLoads(stock), [stock]);

  if (store.status === 'login') return <React.Fragment><LoginScreen store={store} /><ToastHost /></React.Fragment>;
  if (store.status !== 'ready') return <React.Fragment><GateMessage store={store} /><ToastHost /></React.Fragment>;

  const props = { db, store, stock, loads, lk, params: route.params, nav };
  const key = route.screen + JSON.stringify(route.params);
  let screen;
  switch (route.screen) {
    case 'layout': screen = <LayoutScreen key={key} {...props} />; break;
    case 'in': screen = <TxnScreen key="in" type="IN" {...props} />; break;
    case 'out': screen = <TxnScreen key="out" type="OUT" {...props} />; break;
    case 'transfer': screen = <TxnScreen key="tr" type="TRANSFER" {...props} />; break;
    case 'stock': screen = <StockScreen key={key} {...props} />; break;
    case 'customers': screen = <CustomersScreen {...props} />; break;
    case 'report': screen = <ReportScreen {...props} />; break;
    case 'cargos': screen = <CargosScreen {...props} />; break;
    case 'data': screen = <DataScreen {...props} />; break;
    default: screen = <DashboardScreen {...props} />;
  }

  return (
    <div className={`app ${navOpen ? 'nav-open' : ''}`}>
      <aside className="rail">
        <div className="brand">
          <div className="brand-mark"><Icon name="stock" size={18} /></div>
          <div>
            <strong>Quản lý Kho</strong>
            <span>Kho bãi hàng rời</span>
          </div>
          <button type="button" className="icon-btn rail-close" onClick={() => setNavOpen(false)} aria-label="Đóng menu"><Icon name="x" /></button>
        </div>
        <nav>
          {NAV.map((n, i) => n.group
            ? <div key={i} className="nav-group">{n.group}</div>
            : (
              <button type="button" key={n.id} className={`nav-item ${route.screen === n.id ? 'active' : ''}`} onClick={() => nav(n.id)}>
                <Icon name={n.icon} size={17} />
                <span>{n.label}</span>
              </button>
            ))}
        </nav>
        {store.mode === 'remote' ? (
          <div className="rail-foot rail-user">
            <span><i className="live-dot" />Dữ liệu dùng chung · {store.user?.role === 'admin' ? 'Quản trị' : 'Nhân viên'}</span>
            <strong title={store.user?.email}>{store.user?.email}</strong>
            <button type="button" className="link" onClick={store.signOut}>Đăng xuất</button>
          </div>
        ) : (
          <div className="rail-foot">Dữ liệu lưu trên trình duyệt · {fmtDate(todayISO())}</div>
        )}
      </aside>
      <div className="scrim" onClick={() => setNavOpen(false)} />
      <main className="main">
        <div className="topbar">
          <button type="button" className="icon-btn" onClick={() => setNavOpen(true)} aria-label="Mở menu">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M3 6h18M3 12h18M3 18h18" /></svg>
          </button>
          <strong>{NAV.find(n => n.id === route.screen)?.label}</strong>
        </div>
        {screen}
      </main>
      <ToastHost />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
