/* ==========================================================
   Kho Bãi — Khách hàng · Báo cáo theo khách hàng · Danh mục · Dữ liệu
   ========================================================== */

/* ---------------- Khách hàng ---------------- */
function CustomersScreen({ db, store, stock, nav }) {
  const [q, setQ] = useState('');
  const [editing, setEditing] = useState(null);

  const held = {};
  for (const r of stockRows(stock)) {
    if (r.qty <= EPS) continue;
    held[r.customerId] = held[r.customerId] || { qty: 0, lots: 0 };
    held[r.customerId].qty += r.qty; held[r.customerId].lots += 1;
  }
  const list = [...db.customers]
    .filter(c => !q || norm([c.code, c.name, c.taxCode, c.contact, c.phone].join(' ')).includes(norm(q)))
    .sort((a, b) => a.code.localeCompare(b.code));

  const nextCode = () => {
    const nums = db.customers.map(c => +(c.code.match(/\d+$/) || [0])[0]);
    return `KH${pad(Math.max(0, ...nums) + 1, 3)}`;
  };

  const del = c => {
    if (db.txns.some(t => t.customerId === c.id || t.toCustomerId === c.id)) {
      toast('Khách hàng đã phát sinh giao dịch, không thể xóa.', 'danger');
      return;
    }
    if (confirm(`Xóa khách hàng ${c.name}?`)) { store.remove('customers', c.id); toast('Đã xóa khách hàng'); }
  };

  return (
    <div className="page">
      <PageHeader title="Khách hàng" subtitle={`${db.customers.length} khách hàng · ${Object.keys(held).length} đang lưu hàng`}
        actions={<Button icon="plus" variant="primary" onClick={() => setEditing({ code: nextCode(), name: '', taxCode: '', contact: '', phone: '', email: '', address: '', note: '' })}>Thêm khách hàng</Button>} />
      <Card pad={false}>
        <div className="filters"><SearchBox value={q} onChange={setQ} placeholder="Tìm mã, tên, MST, liên hệ…" /></div>
        {list.length === 0 ? <Empty icon="users" title="Không có khách hàng" /> : (
          <div className="table-wrap">
            <table className="table">
              <thead><tr><th>Mã</th><th>Tên khách hàng</th><th>MST</th><th>Liên hệ</th><th>Điện thoại</th><th className="num">Tồn hiện tại (t)</th><th className="num">Số lô</th><th /></tr></thead>
              <tbody>
                {list.map(c => (
                  <tr key={c.id}>
                    <td className="mono">{c.code}</td>
                    <td><strong>{c.name}</strong>{c.address && <div className="muted small">{c.address}</div>}</td>
                    <td className="mono">{c.taxCode}</td>
                    <td>{c.contact}</td>
                    <td className="nowrap">{c.phone}</td>
                    <td className="num strong">{held[c.id] ? fmtQty(held[c.id].qty) : '—'}</td>
                    <td className="num">{held[c.id]?.lots || '—'}</td>
                    <td className="actions">
                      <Button size="sm" variant="ghost" icon="report" onClick={() => nav('report', { customerId: c.id })}>Báo cáo</Button>
                      <button type="button" className="icon-btn" title="Sửa" onClick={() => setEditing(c)}><Icon name="edit" size={15} /></button>
                      <button type="button" className="icon-btn danger" title="Xóa" onClick={() => del(c)}><Icon name="trash" size={15} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
      {editing && <CustomerForm initial={editing} db={db} store={store} onClose={() => setEditing(null)} />}
    </div>
  );
}

function CustomerForm({ initial, db, store, onClose }) {
  const [f, setF] = useState(initial);
  const [err, setErr] = useState({});
  const set = patch => setF(x => ({ ...x, ...patch }));
  const save = () => {
    const e = {};
    if (!f.code.trim()) e.code = 'Bắt buộc';
    else if (db.customers.some(c => c.id !== f.id && c.code.trim().toLowerCase() === f.code.trim().toLowerCase())) e.code = 'Mã đã tồn tại';
    if (!f.name.trim()) e.name = 'Bắt buộc';
    setErr(e);
    if (Object.keys(e).length) return;
    store.upsert('customers', { ...f, code: f.code.trim().toUpperCase(), name: f.name.trim() });
    toast(f.id ? 'Đã cập nhật khách hàng' : 'Đã thêm khách hàng');
    onClose();
  };
  return (
    <Modal title={f.id ? 'Sửa khách hàng' : 'Thêm khách hàng'} onClose={onClose} width={620} footer={
      <React.Fragment><Button onClick={onClose}>Hủy</Button><Button variant="primary" icon="check" onClick={save}>Lưu</Button></React.Fragment>
    }>
      <div className="form-grid">
        <Field label="Mã khách hàng" required error={err.code}><input value={f.code} onChange={e => set({ code: e.target.value })} /></Field>
        <Field label="Mã số thuế"><input value={f.taxCode} onChange={e => set({ taxCode: e.target.value })} /></Field>
        <Field label="Tên khách hàng" required error={err.name} span={2}><input value={f.name} onChange={e => set({ name: e.target.value })} autoFocus /></Field>
        <Field label="Người liên hệ"><input value={f.contact} onChange={e => set({ contact: e.target.value })} /></Field>
        <Field label="Điện thoại"><input value={f.phone} onChange={e => set({ phone: e.target.value })} /></Field>
        <Field label="Email" span={2}><input type="email" value={f.email} onChange={e => set({ email: e.target.value })} /></Field>
        <Field label="Địa chỉ" span={2}><input value={f.address} onChange={e => set({ address: e.target.value })} /></Field>
        <Field label="Ghi chú" span={2}><textarea rows="2" value={f.note} onChange={e => set({ note: e.target.value })} /></Field>
      </div>
    </Modal>
  );
}

/* ---------------- Báo cáo theo khách hàng ---------------- */
// Xuất – nhập – tồn trong kỳ, kèm tấn·ngày lưu kho để tính phí
function buildCustomerReport(db, customerId, from, to) {
  const opening = computeStock(db.txns, { before: from });
  const rows = {};
  const ensure = (c, g, z) => {
    const k = skey(c, g, z);
    return rows[k] = rows[k] || { customerId: c, cargoId: g, zoneId: z, open: 0, in: 0, out: 0, tin: 0, tout: 0, adj: 0, close: 0, tonDays: 0, daily: {} };
  };
  for (const [k, q] of opening) {
    const { customerId: c, cargoId: g, zoneId: z } = splitKey(k);
    if ((customerId && c !== customerId) || Math.abs(q) < EPS) continue;
    ensure(c, g, z).open = q;
  }
  const ledger = [];
  for (const t of sortTxns(db.txns.filter(t => t.date >= from && t.date <= to))) {
    for (const [c, g, z, d] of txnEffects(t)) {
      if (customerId && c !== customerId) continue;
      const r = ensure(c, g, z);
      if (t.type === 'IN') r.in += d;
      else if (t.type === 'OUT') r.out += -d;
      else if (t.type === 'ADJUST') r.adj += d;
      else if (d > 0) r.tin += d; else r.tout += -d;
      r.daily[t.date] = (r.daily[t.date] || 0) + d;
      ledger.push({ t, customerId: c, cargoId: g, zoneId: z, d });
    }
  }
  const days = [];
  for (let d = from; d <= to; d = addDays(d, 1)) days.push(d);
  for (const r of Object.values(rows)) {
    r.close = round3(r.open + r.in - r.out + r.tin - r.tout + r.adj);
    let bal = r.open;
    for (const d of days) { bal += r.daily[d] || 0; r.tonDays += Math.max(0, bal); }
    r.tonDays = round3(r.tonDays);
  }
  return { rows: Object.values(rows), ledger, days: days.length };
}

const REPORT_COLS = ['open', 'in', 'out', 'tin', 'tout', 'adj', 'close', 'tonDays'];
const REPORT_HEAD = ['Tồn đầu kỳ', 'Nhập', 'Xuất', 'Chuyển đến', 'Chuyển đi', 'Kiểm kê ±', 'Tồn cuối kỳ', 'Tấn·ngày'];

function ReportScreen({ db, lk, params }) {
  const today = todayISO();
  const [cid, setCid] = useState(params.customerId || db.customers[0]?.id || '');
  const [from, setFrom] = useState(monthStart(today));
  const [to, setTo] = useState(today);
  const [byZone, setByZone] = useState(true);
  const [rate, setRate] = useState('');

  useEffect(() => { if (params.customerId) setCid(params.customerId); }, [params.customerId]);

  const valid = from && to && from <= to;
  const rep = useMemo(() => (valid ? buildCustomerReport(db, cid, from, to) : { rows: [], ledger: [], days: 0 }), [db, cid, from, to, valid]);
  const cust = lk.cust[cid];
  const price = +rate || 0;

  // gộp theo nhóm hiển thị
  const groupKey = r => [cid ? '' : r.customerId, r.cargoId, byZone ? r.zoneId : ''].join('|');
  const groups = Object.values(rep.rows.reduce((m, r) => {
    const k = groupKey(r);
    const g = m[k] = m[k] || { customerId: r.customerId, cargoId: r.cargoId, zoneId: byZone ? r.zoneId : '', ...Object.fromEntries(REPORT_COLS.map(c => [c, 0])) };
    REPORT_COLS.forEach(c => { g[c] += r[c]; });
    return m;
  }, {})).filter(g => REPORT_COLS.some(c => Math.abs(g[c]) > EPS))
    .sort((a, b) =>
      (lk.cust[a.customerId]?.code || '').localeCompare(lk.cust[b.customerId]?.code || '') ||
      (lk.cargo[a.cargoId]?.code || '').localeCompare(lk.cargo[b.cargoId]?.code || '') ||
      zoneLabel(lk.zone[a.zoneId], lk).localeCompare(zoneLabel(lk.zone[b.zoneId], lk)));
  const totals = Object.fromEntries(REPORT_COLS.map(c => [c, groups.reduce((s, g) => s + g[c], 0)]));

  // sổ chi tiết: lũy kế theo từng loại hàng
  const running = {};
  rep.rows.forEach(r => { running[r.cargoId] = (running[r.cargoId] || 0) + r.open; });
  const ledger = cid ? rep.ledger.map(e => {
    running[e.cargoId] = round3((running[e.cargoId] || 0) + e.d);
    return { ...e, bal: running[e.cargoId] };
  }) : [];

  const setPreset = p => {
    if (p === 'month') { setFrom(monthStart(today)); setTo(today); }
    if (p === 'last') { const end = addDays(monthStart(today), -1); setFrom(monthStart(end)); setTo(end); }
    if (p === '30') { setFrom(addDays(today, -29)); setTo(today); }
    if (p === 'year') { setFrom(today.slice(0, 4) + '-01-01'); setTo(today); }
  };

  const labelCols = [...(cid ? [] : ['Khách hàng']), 'Hàng hóa', ...(byZone ? ['Kho · Khu'] : [])];
  const labelVals = g => [...(cid ? [] : [lk.cust[g.customerId]?.name]), lk.cargo[g.cargoId]?.name, ...(byZone ? [zoneLabel(lk.zone[g.zoneId], lk)] : [])];

  const doExport = () => {
    const title = `BÁO CÁO XUẤT – NHẬP – TỒN KHO${cust ? ' · ' + cust.name.toUpperCase() : ' · TẤT CẢ KHÁCH HÀNG'}`;
    const info = [[title], [`Kỳ báo cáo: ${fmtDate(from)} – ${fmtDate(to)} (${rep.days} ngày)`], ...(cust ? [[`Mã KH: ${cust.code}`, `MST: ${cust.taxCode || ''}`]] : []), []];
    const head = [...labelCols, ...REPORT_HEAD, ...(price ? ['Phí lưu kho (đ)'] : [])];
    const body = groups.map(g => [...labelVals(g), ...REPORT_COLS.map(c => round3(g[c])), ...(price ? [Math.round(g.tonDays * price)] : [])]);
    const foot = [...labelCols.map((_, i) => (i === 0 ? 'Tổng cộng' : '')), ...REPORT_COLS.map(c => round3(totals[c])), ...(price ? [Math.round(totals.tonDays * price)] : [])];
    const sheets = [{ name: 'Tổng hợp', rows: [...info, head, ...body, foot], cols: [...labelCols.map(() => 26), ...REPORT_HEAD.map(() => 13), 16] }];
    if (cid) {
      sheets.push({
        name: 'Chi tiết',
        cols: [12, 16, 12, 18, 18, 12, 12, 14, 18, 18, 24],
        rows: [...info, ['Ngày', 'Số phiếu', 'Loại', 'Hàng hóa', 'Kho · Khu', 'Nhập (+)', 'Xuất (−)', 'Tồn theo hàng', 'Phương tiện', 'Chứng từ', 'Ghi chú'],
          ...ledger.map(e => [fmtDate(e.t.date), e.t.no, TXN_TYPES[e.t.type].short, lk.cargo[e.cargoId]?.name, zoneLabel(lk.zone[e.zoneId], lk),
            e.d > 0 ? round3(e.d) : '', e.d < 0 ? round3(-e.d) : '', e.bal, e.t.vehicle, e.t.docRef, e.t.note])],
      });
    }
    exportXlsx(`BaoCao_${cust ? cust.code : 'TatCa'}_${from}_${to}`, sheets);
  };

  return (
    <div className="page">
      <PageHeader title="Báo cáo theo khách hàng" subtitle="Xuất – nhập – tồn, chi tiết giao dịch và tấn·ngày lưu kho để tính phí"
        actions={
          <React.Fragment>
            <Button icon="download" onClick={doExport} disabled={!valid}>Xuất Excel</Button>
            <Button icon="print" onClick={printArea} disabled={!valid}>In báo cáo</Button>
          </React.Fragment>
        } />
      <Card pad={false}>
        <div className="filters">
          <Select value={cid} onChange={setCid} options={customerOptions(db)} placeholder="Tất cả khách hàng" />
          <label className="inline">Từ <input type="date" value={from} onChange={e => setFrom(e.target.value)} /></label>
          <label className="inline">Đến <input type="date" value={to} max={today} onChange={e => setTo(e.target.value)} /></label>
          <div className="seg">
            <button type="button" onClick={() => setPreset('month')}>Tháng này</button>
            <button type="button" onClick={() => setPreset('last')}>Tháng trước</button>
            <button type="button" onClick={() => setPreset('30')}>30 ngày</button>
            <button type="button" onClick={() => setPreset('year')}>Năm nay</button>
          </div>
          <label className="inline check"><input type="checkbox" checked={byZone} onChange={e => setByZone(e.target.checked)} /> Chi tiết theo khu</label>
          <label className="inline">Đơn giá lưu kho <input type="number" min="0" step="100" value={rate} onChange={e => setRate(e.target.value)} placeholder="đ/tấn/ngày" className="w-120" /></label>
        </div>
      </Card>

      {!valid ? <Card><Empty icon="alert" title="Khoảng thời gian không hợp lệ" /></Card> : (
        <div className="print-area report">
          <div className="report-head">
            <h2>BÁO CÁO XUẤT – NHẬP – TỒN KHO</h2>
            <p>Kỳ báo cáo: <strong>{fmtDate(from)} – {fmtDate(to)}</strong> ({rep.days} ngày)</p>
            {cust ? (
              <dl className="dl inline-dl">
                <dt>Khách hàng</dt><dd><strong>{cust.name}</strong> ({cust.code})</dd>
                {cust.taxCode && <React.Fragment><dt>MST</dt><dd>{cust.taxCode}</dd></React.Fragment>}
                {cust.address && <React.Fragment><dt>Địa chỉ</dt><dd>{cust.address}</dd></React.Fragment>}
                {cust.contact && <React.Fragment><dt>Liên hệ</dt><dd>{cust.contact} {cust.phone && `· ${cust.phone}`}</dd></React.Fragment>}
              </dl>
            ) : <p>Tất cả khách hàng</p>}
          </div>

          <div className="kpis kpis-sm">
            <Kpi label="Tồn đầu kỳ" value={fmtQty(totals.open)} unit="t" />
            <Kpi label="Nhập trong kỳ" value={fmtQty(totals.in)} unit="t" tone="success" />
            <Kpi label="Xuất trong kỳ" value={fmtQty(totals.out)} unit="t" tone="danger" />
            <Kpi label="Tồn cuối kỳ" value={fmtQty(totals.close)} unit="t" />
            <Kpi label="Tấn·ngày lưu kho" value={fmtQty(totals.tonDays, 0)} sub={price ? `Phí: ${Math.round(totals.tonDays * price).toLocaleString('vi-VN')} đ` : 'Nhập đơn giá để tính phí'} />
          </div>

          <Card title="Tổng hợp" pad={false}>
            {groups.length === 0 ? <Empty icon="report" title="Không có số liệu trong kỳ" /> : (
              <div className="table-wrap">
                <table className="table report-table">
                  <thead>
                    <tr>{labelCols.map(c => <th key={c}>{c}</th>)}{REPORT_HEAD.map(c => <th key={c} className="num">{c}</th>)}{price > 0 && <th className="num">Phí lưu kho (đ)</th>}</tr>
                  </thead>
                  <tbody>
                    {groups.map((g, i) => (
                      <tr key={i}>
                        {labelVals(g).map((v, j) => <td key={j}>{v}</td>)}
                        {REPORT_COLS.map(c => <td key={c} className={`num ${c === 'close' ? 'strong' : ''}`}>{Math.abs(g[c]) > EPS ? fmtQty(g[c]) : '–'}</td>)}
                        {price > 0 && <td className="num">{Math.round(g.tonDays * price).toLocaleString('vi-VN')}</td>}
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan={labelCols.length}>Tổng cộng</td>
                      {REPORT_COLS.map(c => <td key={c} className="num">{fmtQty(totals[c])}</td>)}
                      {price > 0 && <td className="num">{Math.round(totals.tonDays * price).toLocaleString('vi-VN')}</td>}
                    </tr>
                  </tfoot>
                </table>
              </div>
            )}
          </Card>

          {cid && (
            <Card title={`Chi tiết giao dịch (${ledger.length})`} pad={false}>
              {ledger.length === 0 ? <Empty icon="report" title="Không phát sinh giao dịch trong kỳ" /> : (
                <div className="table-wrap">
                  <table className="table">
                    <thead><tr><th>Ngày</th><th>Số phiếu</th><th>Loại</th><th>Hàng hóa</th><th>Kho · Khu</th><th className="num">Nhập (+)</th><th className="num">Xuất (−)</th><th className="num">Tồn theo hàng</th><th>Phương tiện</th><th>Chứng từ / ghi chú</th></tr></thead>
                    <tbody>
                      {ledger.map((e, i) => (
                        <tr key={i}>
                          <td className="nowrap">{fmtDate(e.t.date)}</td>
                          <td className="mono">{e.t.no}</td>
                          <td><TxnBadge type={e.t.type} /></td>
                          <td>{lk.cargo[e.cargoId]?.name}</td>
                          <td className="nowrap">{zoneLabel(lk.zone[e.zoneId], lk)}</td>
                          <td className="num">{e.d > 0 ? fmtQty(e.d) : ''}</td>
                          <td className="num neg">{e.d < 0 ? fmtQty(-e.d) : ''}</td>
                          <td className="num strong">{fmtQty(e.bal)}</td>
                          <td>{e.t.vehicle}</td>
                          <td className="muted">{[e.t.docRef, e.t.note].filter(Boolean).join(' · ')}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Card>
          )}
          <div className="signs print-only">
            <div><strong>Người lập</strong><span>(Ký, ghi rõ họ tên)</span></div>
            <div><strong>Thủ kho</strong><span>(Ký, ghi rõ họ tên)</span></div>
            <div><strong>Xác nhận của khách hàng</strong><span>(Ký, ghi rõ họ tên)</span></div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------------- Danh mục hàng hóa ---------------- */
function CargosScreen({ db, store, stock }) {
  const [editing, setEditing] = useState(null);
  const held = {};
  for (const r of stockRows(stock)) if (r.qty > EPS) held[r.cargoId] = (held[r.cargoId] || 0) + r.qty;
  const list = [...db.cargos].sort((a, b) => a.code.localeCompare(b.code));

  const del = g => {
    if (db.txns.some(t => t.cargoId === g.id)) { toast('Hàng hóa đã phát sinh giao dịch, không thể xóa.', 'danger'); return; }
    if (confirm(`Xóa ${g.name}?`)) store.remove('cargos', g.id);
  };

  return (
    <div className="page">
      <PageHeader title="Danh mục hàng hóa" subtitle={`${db.cargos.length} loại hàng`}
        actions={<Button icon="plus" variant="primary" onClick={() => setEditing({ code: '', name: '', group: '', unit: 'tấn', note: '' })}>Thêm hàng hóa</Button>} />
      <Card pad={false}>
        <div className="table-wrap">
          <table className="table">
            <thead><tr><th>Mã</th><th>Tên hàng</th><th>Nhóm</th><th>ĐVT</th><th className="num">Tồn hiện tại</th><th>Ghi chú</th><th /></tr></thead>
            <tbody>
              {list.map(g => (
                <tr key={g.id}>
                  <td className="mono">{g.code}</td>
                  <td><strong>{g.name}</strong></td>
                  <td>{g.group}</td>
                  <td>{g.unit}</td>
                  <td className="num strong">{held[g.id] ? fmtQty(held[g.id]) : '—'}</td>
                  <td className="muted">{g.note}</td>
                  <td className="actions">
                    <button type="button" className="icon-btn" title="Sửa" onClick={() => setEditing(g)}><Icon name="edit" size={15} /></button>
                    <button type="button" className="icon-btn danger" title="Xóa" onClick={() => del(g)}><Icon name="trash" size={15} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
      {editing && <CargoForm initial={editing} db={db} store={store} onClose={() => setEditing(null)} />}
    </div>
  );
}

function CargoForm({ initial, db, store, onClose }) {
  const [f, setF] = useState(initial);
  const [err, setErr] = useState({});
  const set = patch => setF(x => ({ ...x, ...patch }));
  const save = () => {
    const e = {};
    if (!f.code.trim()) e.code = 'Bắt buộc';
    else if (db.cargos.some(g => g.id !== f.id && g.code.trim().toLowerCase() === f.code.trim().toLowerCase())) e.code = 'Mã đã tồn tại';
    if (!f.name.trim()) e.name = 'Bắt buộc';
    setErr(e);
    if (Object.keys(e).length) return;
    store.upsert('cargos', { ...f, code: f.code.trim().toUpperCase(), name: f.name.trim() });
    onClose();
  };
  return (
    <Modal title={f.id ? 'Sửa hàng hóa' : 'Thêm hàng hóa'} onClose={onClose} footer={
      <React.Fragment><Button onClick={onClose}>Hủy</Button><Button variant="primary" icon="check" onClick={save}>Lưu</Button></React.Fragment>
    }>
      <div className="form-grid">
        <Field label="Mã hàng" required error={err.code}><input value={f.code} onChange={e => set({ code: e.target.value })} autoFocus /></Field>
        <Field label="Đơn vị tính" hint="Số lượng trong hệ thống tính theo tấn"><input value={f.unit} readOnly /></Field>
        <Field label="Tên hàng" required error={err.name} span={2}><input value={f.name} onChange={e => set({ name: e.target.value })} /></Field>
        <Field label="Nhóm hàng" span={2}><input value={f.group} onChange={e => set({ group: e.target.value })} placeholder="Than, Lâm sản, Hàng bao…" /></Field>
        <Field label="Ghi chú" span={2}><input value={f.note} onChange={e => set({ note: e.target.value })} /></Field>
      </div>
    </Modal>
  );
}

/* ---------------- Dữ liệu ---------------- */
function DataScreen({ db, store }) {
  const fileRef = useRef(null);
  const [busy, setBusy] = useState(false);
  const remote = store.mode === 'remote';
  // chế độ dùng chung: chỉ quản trị viên được thay toàn bộ dữ liệu
  const canReplace = !remote || store.user?.role === 'admin';

  const backup = () => {
    downloadBlob(new Blob([JSON.stringify(db, null, 2)], { type: 'application/json' }), `kho-bai-backup-${todayISO()}.json`);
  };
  const replace = async (next, done) => {
    setBusy(true);
    try { await store.replaceAll(next); toast(done); } catch (e) { toast(e.message, 'danger'); } finally { setBusy(false); }
  };
  const restore = e => {
    const file = e.target.files[0];
    e.target.value = '';
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      let next;
      try {
        next = JSON.parse(reader.result);
        if (!Array.isArray(next.zones) || !Array.isArray(next.txns)) throw new Error('Sai cấu trúc');
        const v = validateLedger(next.txns);
        if (!v.ok) throw new Error(`Sổ giao dịch bị âm tồn tại phiếu ${v.txn.no}`);
      } catch (err) {
        toast(`Không đọc được file: ${err.message}`, 'danger');
        return;
      }
      const msg = `Khôi phục ${next.zones.length} khu, ${next.txns.length} giao dịch, ${(next.customers || []).length} khách hàng?` +
        (remote ? ' Dữ liệu dùng chung của TẤT CẢ người dùng sẽ bị thay thế.' : ' Dữ liệu hiện tại sẽ bị thay thế.');
      if (confirm(msg)) replace(next, 'Đã khôi phục dữ liệu');
    };
    reader.readAsText(file);
  };
  const reset = () => {
    if (confirm('Đưa về trạng thái ban đầu? Toàn bộ khu xếp hàng, giao dịch, khách hàng sẽ bị thay bằng dữ liệu ban đầu.')) replace(seedDb(), 'Đã khôi phục trạng thái ban đầu');
  };
  const wipe = () => {
    if (!confirm('Xóa toàn bộ giao dịch, khách hàng, hàng hóa? Các khu xếp hàng được giữ lại (bỏ gán khách hàng).')) return;
    replace({ ...emptyDb(), zones: db.zones.map(z => ({ ...z, customerId: '', cargoId: '' })) }, 'Đã xóa dữ liệu nghiệp vụ');
  };
  // Giao dịch gắn với khu xếp hàng nên phải xóa cùng; giữ khách hàng và danh mục hàng
  const wipeLayout = () => {
    if (!confirm(`Xóa toàn bộ ${db.zones.length} khu xếp hàng và ${db.txns.length} giao dịch (tồn kho về 0)? Khách hàng và danh mục hàng hóa được giữ lại.`)) return;
    replace({ ...emptyDb(), customers: db.customers, cargos: db.cargos }, 'Đã xóa các khu xếp hàng. Vào "Sơ đồ kho" và kéo chọn vùng để tạo khu mới.');
  };

  return (
    <div className="page">
      <PageHeader title="Sao lưu dữ liệu" subtitle={remote
        ? 'Dữ liệu dùng chung lưu trên máy chủ, mọi người dùng thấy cùng một số liệu.'
        : 'Bản thử nghiệm lưu dữ liệu trong trình duyệt này (localStorage). Hãy sao lưu định kỳ.'} />
      <div className="kpis">
        <Kpi label="Kho" value={db.warehouses.length} sub={`${db.zones.length} khu xếp hàng`} />
        <Kpi label="Khách hàng" value={db.customers.length} />
        <Kpi label="Hàng hóa" value={db.cargos.length} />
        <Kpi label="Giao dịch" value={db.txns.length} />
      </div>
      <div className="data-grid">
        <Card title="Sao lưu & khôi phục">
          <p className="muted">Tải về toàn bộ dữ liệu dạng JSON để lưu trữ{canReplace ? ', hoặc khôi phục từ một file sao lưu / file đã gộp' : ''}.</p>
          <div className="btn-row">
            <Button icon="download" variant="primary" onClick={backup}>Tải bản sao lưu</Button>
            {canReplace && <Button icon="upload" onClick={() => fileRef.current.click()} disabled={busy}>Khôi phục từ file</Button>}
            <input ref={fileRef} type="file" accept="application/json,.json" hidden onChange={restore} />
          </div>
        </Card>
        {canReplace ? (
          <Card title="Làm mới dữ liệu">
            <p className="muted">Dùng khi bắt đầu nhập liệu thật. "Xóa các khu xếp hàng" đưa 2 kho về mặt bằng trống (xóa cả giao dịch) để kéo chọn lại từ đầu.</p>
            <div className="btn-row">
              <Button icon="refresh" onClick={reset} disabled={busy}>Khôi phục ban đầu</Button>
              <Button icon="trash" variant="danger-ghost" onClick={wipe} disabled={busy}>Xóa dữ liệu nghiệp vụ</Button>
              <Button icon="map" variant="danger-ghost" onClick={wipeLayout} disabled={busy}>Xóa các khu xếp hàng</Button>
            </div>
          </Card>
        ) : (
          <Card title="Làm mới dữ liệu">
            <p className="muted">Chỉ quản trị viên được khôi phục hoặc xóa toàn bộ dữ liệu dùng chung.</p>
          </Card>
        )}
      </div>
    </div>
  );
}
