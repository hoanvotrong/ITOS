/* ==========================================================
   Kho Bãi — dữ liệu dùng chung qua Supabase
   - Tải toàn bộ danh mục + sổ giao dịch khi đăng nhập, rồi nghe thay đổi thời gian thực
   - Khu / khách hàng / hàng hóa ghi thẳng vào bảng (cập nhật giao diện trước, lỗi thì tải lại)
   - Phiếu ghi/xóa qua hàm post_txn / delete_txn trên máy chủ (kiểm tra tồn, cấp số phiếu)
   ========================================================== */

const sb = REMOTE ? window.supabase.createClient(window.KHO_CONFIG.supabaseUrl, window.KHO_CONFIG.supabaseAnonKey) : null;

// Chuyển đổi giữa bản ghi trong ứng dụng và cột trong cơ sở dữ liệu
const MAP = {
  customers: {
    table: 'customers',
    from: r => ({ id: r.id, code: r.code, name: r.name, taxCode: r.tax_code, contact: r.contact, phone: r.phone, email: r.email, address: r.address, note: r.note }),
    to: c => ({ id: c.id, code: (c.code || '').trim().toUpperCase(), name: c.name, tax_code: c.taxCode || '', contact: c.contact || '', phone: c.phone || '', email: c.email || '', address: c.address || '', note: c.note || '' }),
  },
  cargos: {
    table: 'cargos',
    from: r => ({ id: r.id, code: r.code, name: r.name, group: r.grp, unit: r.unit, note: r.note }),
    to: g => ({ id: g.id, code: (g.code || '').trim().toUpperCase(), name: g.name, grp: g.group || '', unit: g.unit || 'tấn', note: g.note || '' }),
  },
  zones: {
    table: 'zones',
    from: r => ({
      id: r.id, warehouseId: r.warehouse_id, code: r.code, name: r.name, customerId: r.customer_id || '', cargoId: r.cargo_id || '',
      x: +r.x, y: +r.y, w: +r.w, h: +r.h, capacity: +r.capacity, note: r.note,
    }),
    to: z => ({
      id: z.id, warehouse_id: z.warehouseId, code: z.code, name: z.name || '', customer_id: z.customerId || null, cargo_id: z.cargoId || null,
      x: z.x, y: z.y, w: z.w, h: z.h, capacity: +z.capacity || 0, note: z.note || '',
    }),
  },
  txns: {
    table: 'txns',
    from: r => ({
      id: r.id, no: r.no, type: r.type, date: r.date, customerId: r.customer_id, cargoId: r.cargo_id, zoneId: r.zone_id,
      toZoneId: r.to_zone_id || '', toCustomerId: r.to_customer_id || '', qty: +r.qty, vehicle: r.vehicle, docRef: r.doc_ref,
      note: r.note, createdAt: Date.parse(r.created_at), createdBy: r.created_by,
    }),
  },
};

async function fetchAll(table, order) {
  const rows = [];
  for (let from = 0; ; from += 1000) {
    const { data, error } = await sb.from(table).select('*').order(order).range(from, from + 999);
    if (error) throw error;
    rows.push(...data);
    if (data.length < 1000) return rows;
  }
}

async function fetchDb() {
  const [customers, cargos, zones, txns, counters] = await Promise.all([
    fetchAll('customers', 'code'), fetchAll('cargos', 'code'), fetchAll('zones', 'id'), fetchAll('txns', 'created_at'), fetchAll('counters', 'type'),
  ]);
  return withFixedLayout({
    customers: customers.map(MAP.customers.from),
    cargos: cargos.map(MAP.cargos.from),
    zones: zones.map(MAP.zones.from),
    txns: txns.map(MAP.txns.from),
    seq: { ...emptyDb().seq, ...Object.fromEntries(counters.map(c => [c.type, c.n])) },
  });
}

const errMsg = e => (e && (e.message || e.error_description)) || 'Lỗi kết nối máy chủ';

function useRemoteStore() {
  const [session, setSession] = useState(undefined); // undefined = đang kiểm tra
  const [member, setMember] = useState(null);         // { email, role } | false
  const [db, setDb] = useState(emptyDb);
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState('');
  const dbRef = useRef(db);
  dbRef.current = db;

  useEffect(() => {
    sb.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: sub } = sb.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => sub.subscription.unsubscribe();
  }, []);

  const reload = useCallback(async () => {
    try { setDb(await fetchDb()); setStatus('ready'); setError(''); } catch (e) { setError(errMsg(e)); setStatus('error'); }
  }, []);

  // Sau khi đăng nhập: kiểm tra quyền, tải dữ liệu, nghe thay đổi
  useEffect(() => {
    if (session === undefined) return;
    if (!session) { setStatus('login'); setMember(null); return; }
    let channel = null;
    let cancelled = false;
    (async () => {
      setStatus('loading');
      const email = (session.user.email || '').toLowerCase();
      const { data, error: e } = await sb.from('app_users').select('email, role').eq('email', email).maybeSingle();
      if (cancelled) return;
      if (e) { setError(errMsg(e)); setStatus('error'); return; }
      if (!data) { setMember(false); setStatus('denied'); return; }
      setMember(data);
      await reload();
      if (cancelled) return;

      let subscribedOnce = false;
      channel = sb.channel('kho-db');
      for (const coll of ['customers', 'cargos', 'zones', 'txns']) {
        channel.on('postgres_changes', { event: '*', schema: 'public', table: MAP[coll].table }, payload => {
          setDb(prev => {
            if (payload.eventType === 'DELETE') return { ...prev, [coll]: prev[coll].filter(x => x.id !== payload.old.id) };
            const it = MAP[coll].from(payload.new);
            const exists = prev[coll].some(x => x.id === it.id);
            return { ...prev, [coll]: exists ? prev[coll].map(x => (x.id === it.id ? it : x)) : [...prev[coll], it] };
          });
        });
      }
      channel.on('postgres_changes', { event: '*', schema: 'public', table: 'counters' }, payload => {
        if (payload.new && payload.new.type) setDb(prev => ({ ...prev, seq: { ...prev.seq, [payload.new.type]: payload.new.n } }));
      });
      channel.subscribe(st => {
        // mất kết nối rồi nối lại: tải lại toàn bộ để không sót thay đổi
        if (st === 'SUBSCRIBED') { if (subscribedOnce) reload(); subscribedOnce = true; }
      });
    })();
    return () => { cancelled = true; if (channel) sb.removeChannel(channel); };
  }, [session && session.user && session.user.id]);

  const fail = e => { toast(errMsg(e), 'danger'); reload(); };

  const upsert = (coll, item) => {
    const it = item.id ? item : { ...item, id: uid() };
    const cur = dbRef.current[coll].find(x => x.id === it.id);
    const full = cur ? { ...cur, ...it } : it;
    setDb(prev => {
      const exists = prev[coll].some(x => x.id === it.id);
      return { ...prev, [coll]: exists ? prev[coll].map(x => (x.id === it.id ? full : x)) : [...prev[coll], full] };
    });
    sb.from(MAP[coll].table).upsert(MAP[coll].to(full)).then(({ error: e }) => { if (e) fail(e); });
    return it;
  };

  const remove = (coll, id) => {
    if (coll === 'txns') return deleteTxn(id);
    setDb(prev => ({ ...prev, [coll]: prev[coll].filter(x => x.id !== id) }));
    return sb.from(MAP[coll].table).delete().eq('id', id).then(({ error: e }) => { if (e) fail(e); });
  };

  const draftTxn = fields => {
    const { no } = nextDocNo(dbRef.current, fields.type, fields.date);
    return { ...fields, id: uid(), no, createdAt: Date.now() };
  };

  // Máy chủ cấp số phiếu thật và kiểm tra tồn lần cuối; lỗi → Promise bị từ chối kèm thông báo
  const commitTxn = async t => {
    const { data, error: e } = await sb.rpc('post_txn', { p: t });
    if (e) throw new Error(errMsg(e));
    const saved = MAP.txns.from(data);
    setDb(prev => (prev.txns.some(x => x.id === saved.id) ? prev : { ...prev, txns: [...prev.txns, saved] }));
    return saved;
  };

  const deleteTxn = async id => {
    const { error: e } = await sb.rpc('delete_txn', { p_id: id });
    if (e) throw new Error(errMsg(e));
    setDb(prev => ({ ...prev, txns: prev.txns.filter(x => x.id !== id) }));
  };

  const replaceAll = async next => {
    const { error: e } = await sb.rpc('import_snapshot', { p: next });
    if (e) throw new Error(errMsg(e));
    await reload();
  };

  return {
    mode: 'remote',
    status,
    error,
    user: member ? { email: member.email, role: member.role } : session ? { email: session.user.email, role: null } : null,
    db,
    upsert,
    remove,
    draftTxn,
    commitTxn,
    deleteTxn,
    replaceAll,
    reload,
    signIn: (email, password) => sb.auth.signInWithPassword({ email: email.trim(), password }),
    signOut: () => sb.auth.signOut(),
  };
}

const useWarehouseStore = REMOTE ? useRemoteStore : useLocalStore;

/* ---------- màn hình đăng nhập / trạng thái ---------- */
function LoginScreen({ store }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const submit = async e => {
    e.preventDefault();
    setBusy(true); setErr('');
    const { error: er } = await store.signIn(email, password);
    setBusy(false);
    if (er) setErr(er.message === 'Invalid login credentials' ? 'Sai email hoặc mật khẩu.' : er.message);
  };
  return (
    <div className="gate">
      <form className="gate-card" onSubmit={submit}>
        <div className="brand-mark"><Icon name="stock" size={18} /></div>
        <h1>Quản lý Kho</h1>
        <p className="muted">Đăng nhập để dùng chung dữ liệu kho VNL-02A / VNL-02B.</p>
        <Field label="Email"><input id="login-email" type="email" autoComplete="username" value={email} onChange={e => setEmail(e.target.value)} required autoFocus /></Field>
        <Field label="Mật khẩu"><input id="login-password" type="password" autoComplete="current-password" value={password} onChange={e => setPassword(e.target.value)} required /></Field>
        {err && <p className="field-error">{err}</p>}
        <button type="submit" className="btn btn-primary" disabled={busy}>{busy ? 'Đang đăng nhập…' : 'Đăng nhập'}</button>
        <p className="muted small">Chưa có tài khoản? Liên hệ quản trị viên kho để được cấp.</p>
      </form>
    </div>
  );
}

function GateMessage({ store }) {
  const { status, error, user } = store;
  return (
    <div className="gate">
      <div className="gate-card">
        <div className="brand-mark"><Icon name={status === 'loading' ? 'refresh' : 'alert'} size={18} /></div>
        {status === 'loading' && <React.Fragment><h1>Đang tải dữ liệu…</h1><p className="muted">Đang lấy dữ liệu kho dùng chung.</p></React.Fragment>}
        {status === 'denied' && (
          <React.Fragment>
            <h1>Chưa được cấp quyền</h1>
            <p className="muted">Tài khoản {user?.email} đã đăng nhập nhưng chưa có trong danh sách người dùng kho. Nhờ quản trị viên thêm email này.</p>
          </React.Fragment>
        )}
        {status === 'error' && (
          <React.Fragment>
            <h1>Không tải được dữ liệu</h1>
            <p className="field-error">{error}</p>
            <button type="button" className="btn btn-primary" onClick={store.reload}>Thử lại</button>
          </React.Fragment>
        )}
        {status !== 'loading' && <button type="button" className="btn btn-ghost" onClick={store.signOut}>Đăng xuất</button>}
      </div>
    </div>
  );
}
