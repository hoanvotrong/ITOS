/* ==========================================================
   Kho Bãi — Tổng quan · Nhập · Xuất · Chuyển · Tồn kho
   ========================================================== */

const customerOptions = db => [...db.customers].sort((a, b) => a.code.localeCompare(b.code)).map(c => ({ value: c.id, label: `${c.code} · ${c.name}` }));
const cargoOptions = db => [...db.cargos].sort((a, b) => a.code.localeCompare(b.code)).map(g => ({ value: g.id, label: `${g.code} · ${g.name}` }));
const warehouseOptions = db => db.warehouses.map(w => ({ value: w.id, label: `Kho ${w.code}` }));

// customerId: đưa các khu dành cho khách hàng này lên nhóm đầu, đánh dấu khu của khách khác
function ZoneSelect({ value, onChange, db, lk, loads, placeholder = '— Chọn khu xếp hàng —', filter, showRoom = true, customerId, ...rest }) {
  const opt = z => {
    const w = lk.wh[z.warehouseId];
    const owner = z.customerId && z.customerId !== customerId ? ` · khu của ${lk.cust[z.customerId]?.code}` : '';
    return (
      <option key={z.id} value={z.id}>
        {customerId && z.customerId === customerId ? `${w?.code} · ` : ''}{z.code} · {zoneBays(z, w)}
        {showRoom ? ` · trống ${fmtQty(Math.max(0, z.capacity - (loads.get(z.id) || 0)), 0)} t` : ''}{owner}
      </option>
    );
  };
  const base = db.zones.filter(z => !filter || filter(z)).sort((a, b) => a.code.localeCompare(b.code));
  const own = customerId ? base.filter(z => z.customerId === customerId) : [];
  return (
    <select value={value || ''} onChange={e => onChange(e.target.value)} {...rest}>
      <option value="">{placeholder}</option>
      {own.length > 0 && <optgroup label={`Khu của ${lk.cust[customerId]?.code}`}>{own.map(opt)}</optgroup>}
      {db.warehouses.map(w => {
        const zs = base.filter(z => z.warehouseId === w.id && !own.includes(z));
        if (!zs.length) return null;
        return <optgroup key={w.id} label={`Kho ${w.code}`}>{zs.map(opt)}</optgroup>;
      })}
    </select>
  );
}

// khu của khách hàng còn trống nhiều nhất
function bestOwnZone(db, loads, customerId) {
  const own = db.zones.filter(z => z.customerId === customerId);
  own.sort((a, b) => (b.capacity - (loads.get(b.id) || 0)) - (a.capacity - (loads.get(a.id) || 0)));
  return own[0]?.id || '';
}

/* ---------------- Tổng quan ---------------- */
function DashboardScreen({ db, stock, loads, lk, nav }) {
  const today = todayISO();
  const week = addDays(today, -6);
  const rows = stockRows(stock).filter(r => r.qty > EPS);
  const total = rows.reduce((s, r) => s + r.qty, 0);
  const cap = db.zones.reduce((s, z) => s + (+z.capacity || 0), 0);
  const sumBy = (type, from) => db.txns.filter(t => t.type === type && t.date >= from && t.date <= today).reduce((s, t) => s + t.qty, 0);
  const custHolding = new Set(rows.map(r => r.customerId));

  const topCust = Object.entries(rows.reduce((m, r) => ({ ...m, [r.customerId]: (m[r.customerId] || 0) + r.qty }), {}))
    .sort((a, b) => b[1] - a[1]).slice(0, 6);
  const byCargo = Object.entries(rows.reduce((m, r) => ({ ...m, [r.cargoId]: (m[r.cargoId] || 0) + r.qty }), {}))
    .sort((a, b) => b[1] - a[1]);
  const maxCust = Math.max(1, ...topCust.map(x => x[1]));
  const maxCargo = Math.max(1, ...byCargo.map(x => x[1]));

  const days = Array.from({ length: 14 }, (_, i) => addDays(today, i - 13));
  const series = days.map(d => ({
    d,
    in: db.txns.filter(t => t.type === 'IN' && t.date === d).reduce((s, t) => s + t.qty, 0),
    out: db.txns.filter(t => t.type === 'OUT' && t.date === d).reduce((s, t) => s + t.qty, 0),
  }));
  const recent = sortTxns(db.txns).reverse().slice(0, 8);

  return (
    <div className="page">
      <PageHeader title="Tổng quan kho" subtitle={`Số liệu đến ngày ${fmtDate(today)}`} actions={
        <React.Fragment>
          <Button icon="in" variant="primary" onClick={() => nav('in')}>Nhập kho</Button>
          <Button icon="out" onClick={() => nav('out')}>Xuất kho</Button>
        </React.Fragment>
      } />
      <div className="kpis">
        <Kpi label="Tổng tồn hiện tại" value={fmtQty(total, 0)} unit="tấn" sub={`${rows.length} lô hàng`} />
        <Kpi label="Sử dụng sức chứa" value={cap ? Math.round((total / cap) * 100) : 0} unit="%" sub={`trên ${fmtQty(cap, 0)} tấn`} tone={cap && total / cap >= 0.85 ? 'danger' : undefined} />
        <Kpi label="Nhập hôm nay" value={fmtQty(sumBy('IN', today), 0)} unit="tấn" sub={`7 ngày: ${fmtQty(sumBy('IN', week), 0)} t`} tone="success" />
        <Kpi label="Xuất hôm nay" value={fmtQty(sumBy('OUT', today), 0)} unit="tấn" sub={`7 ngày: ${fmtQty(sumBy('OUT', week), 0)} t`} tone="danger" />
        <Kpi label="Khách hàng đang lưu hàng" value={custHolding.size} sub={`/ ${db.customers.length} khách hàng`} />
      </div>

      <div className="dash-grid">
        <Card title="Sơ đồ kho" className="span-2" actions={<Button size="sm" variant="ghost" icon="map" onClick={() => nav('layout')}>Mở sơ đồ</Button>} pad={false}>
          <div className="map-wrap">
            <WarehouseMap warehouses={db.warehouses} zones={db.zones} loads={loads} stock={stock} lk={lk} compact onSelect={id => id && nav('layout', { zoneId: id })} />
          </div>
          <div className="map-foot"><YardLegend /></div>
        </Card>

        <Card title="Nhập / xuất 14 ngày (tấn)" className="span-2">
          <InOutChart series={series} />
        </Card>

        <Card title="Khách hàng tồn nhiều nhất">
          {topCust.length === 0 && <Empty title="Chưa có hàng tồn" />}
          {topCust.map(([cid, q]) => (
            <button type="button" key={cid} className="hbar" onClick={() => nav('report', { customerId: cid })}>
              <span className="hbar-label">{lk.cust[cid]?.name}</span>
              <span className="hbar-track"><span style={{ width: (q / maxCust) * 100 + '%' }} /></span>
              <span className="hbar-val">{fmtQty(q, 0)} t</span>
            </button>
          ))}
        </Card>

        <Card title="Tồn theo loại hàng">
          {byCargo.map(([gid, q]) => (
            <div key={gid} className="hbar">
              <span className="hbar-label">{lk.cargo[gid]?.name}</span>
              <span className="hbar-track alt"><span style={{ width: (q / maxCargo) * 100 + '%' }} /></span>
              <span className="hbar-val">{fmtQty(q, 0)} t</span>
            </div>
          ))}
        </Card>

        <Card title="Giao dịch gần đây" className="span-2" pad={false}>
          <TxnTable txns={recent} lk={lk} compact />
        </Card>
      </div>
    </div>
  );
}

function InOutChart({ series }) {
  const W = 720, H = 200, P = { l: 44, r: 8, t: 10, b: 26 };
  const max = Math.max(1, ...series.map(s => Math.max(s.in, s.out)));
  const nice = Math.pow(10, Math.floor(Math.log10(max)));
  const top = Math.ceil(max / nice) * nice;
  const bw = (W - P.l - P.r) / series.length;
  const y = v => P.t + (H - P.t - P.b) * (1 - v / top);
  const ticks = [0, top / 2, top];
  return (
    <div className="chart">
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Biểu đồ nhập xuất 14 ngày">
        {ticks.map(t => (
          <g key={t}>
            <line x1={P.l} x2={W - P.r} y1={y(t)} y2={y(t)} className="chart-grid" />
            <text x={P.l - 6} y={y(t) + 4} textAnchor="end" className="chart-axis">{fmtQty(t, 0)}</text>
          </g>
        ))}
        {series.map((s, i) => {
          const x = P.l + i * bw;
          const w = Math.max(3, bw / 2 - 3);
          return (
            <g key={s.d}>
              <rect x={x + bw / 2 - w - 1} y={y(s.in)} width={w} height={y(0) - y(s.in)} rx="2" className="bar-in"><title>{`${fmtDate(s.d)} · Nhập ${fmtQty(s.in)} t`}</title></rect>
              <rect x={x + bw / 2 + 1} y={y(s.out)} width={w} height={y(0) - y(s.out)} rx="2" className="bar-out"><title>{`${fmtDate(s.d)} · Xuất ${fmtQty(s.out)} t`}</title></rect>
              {i % 2 === 1 && <text x={x + bw / 2} y={H - 8} textAnchor="middle" className="chart-axis">{s.d.slice(8)}/{s.d.slice(5, 7)}</text>}
            </g>
          );
        })}
      </svg>
      <div className="legend"><span><i className="lg bar-in" />Nhập</span><span><i className="lg bar-out" />Xuất</span></div>
    </div>
  );
}

/* ---------------- Bảng giao dịch ---------------- */
function TxnTable({ txns, lk, compact, onPrint, onDelete }) {
  if (!txns.length) return <Empty icon="report" title="Chưa có giao dịch" />;
  return (
    <div className="table-wrap">
      <table className="table">
        <thead>
          <tr>
            <th>Số phiếu</th><th>Ngày</th>{compact && <th>Loại</th>}<th>Khách hàng</th><th>Hàng hóa</th><th>Khu</th>
            <th className="num">Số lượng (t)</th>{!compact && <th>Phương tiện</th>}{!compact && <th>Chứng từ</th>}{!compact && <th />}
          </tr>
        </thead>
        <tbody>
          {txns.map(t => (
            <tr key={t.id}>
              <td className="mono">{t.no}</td>
              <td>{fmtDate(t.date)}</td>
              {compact && <td><TxnBadge type={t.type} /></td>}
              <td>
                {lk.cust[t.customerId]?.name || '—'}
                {t.type === 'TRANSFER' && t.toCustomerId && t.toCustomerId !== t.customerId && (
                  <div className="muted small">→ {lk.cust[t.toCustomerId]?.name}</div>
                )}
              </td>
              <td>{lk.cargo[t.cargoId]?.name || '—'}</td>
              <td className="nowrap">
                {zoneLabel(lk.zone[t.zoneId], lk)}
                {t.type === 'TRANSFER' && t.toZoneId && t.toZoneId !== t.zoneId && <span className="muted"> → {zoneLabel(lk.zone[t.toZoneId], lk)}</span>}
              </td>
              <td className={`num strong ${t.type === 'OUT' || (t.type === 'ADJUST' && t.qty < 0) ? 'neg' : ''}`}>
                {t.type === 'ADJUST' && t.qty > 0 ? '+' : ''}{fmtQty(t.qty)}
              </td>
              {!compact && <td>{t.vehicle}</td>}
              {!compact && <td>{t.docRef}</td>}
              {!compact && (
                <td className="actions">
                  {onPrint && <button type="button" className="icon-btn" title="In phiếu" onClick={() => onPrint(t)}><Icon name="print" size={15} /></button>}
                  {onDelete && <button type="button" className="icon-btn danger" title="Xóa" onClick={() => onDelete(t)}><Icon name="trash" size={15} /></button>}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function deleteTxn(t, db, store, lk) {
  const v = validateLedger(db.txns.filter(x => x.id !== t.id));
  if (!v.ok) {
    toast(`Không thể xóa ${t.no}: tồn của ${lk.cargo[v.cargoId]?.name} tại ${zoneLabel(lk.zone[v.zoneId], lk)} sẽ âm vào ngày ${fmtDate(v.txn.date)} (phiếu ${v.txn.no}).`, 'danger');
    return;
  }
  if (!confirm(`Xóa phiếu ${t.no}? Tồn kho sẽ được tính lại.`)) return;
  store.remove('txns', t.id);
  toast(`Đã xóa phiếu ${t.no}`);
}

/* ---------------- Nhập / Xuất / Chuyển ---------------- */
function TxnScreen({ type, db, store, stock, loads, lk, params, nav }) {
  const meta = TXN_TYPES[type];
  const blank = () => ({
    date: todayISO(), customerId: params.customerId || '', cargoId: '', zoneId: params.zoneId || '',
    toZoneId: '', toCustomerId: '', qty: '', vehicle: '', docRef: '', note: '',
  });
  const [f, setF] = useState(blank);
  const [err, setErr] = useState({});
  const [printing, setPrinting] = useState(null);
  const [q, setQ] = useState('');
  const [fc, setFc] = useState('');
  const [from, setFrom] = useState(addDays(todayISO(), -30));
  const [to, setTo] = useState(todayISO());
  const [limit, setLimit] = useState(50);

  useEffect(() => { setF(blank()); setErr({}); }, [type, params.zoneId, params.customerId]);
  const set = patch => setF(x => ({ ...x, ...patch }));

  const available = f.customerId && f.cargoId && f.zoneId ? stock.get(skey(f.customerId, f.cargoId, f.zoneId)) || 0 : 0;
  const lots = type === 'IN' ? [] : stockRows(stock)
    .filter(r => r.qty > EPS && (!f.customerId || r.customerId === f.customerId) && (!f.zoneId || f.customerId || r.zoneId === f.zoneId))
    .sort((a, b) => (lk.cust[a.customerId]?.code || '').localeCompare(lk.cust[b.customerId]?.code || '') || b.qty - a.qty);

  const submit = () => {
    const e = {};
    const qty = round3(+f.qty);
    if (!f.date) e.date = 'Bắt buộc';
    if (!f.customerId) e.customerId = 'Chọn khách hàng';
    if (!f.cargoId) e.cargoId = 'Chọn hàng hóa';
    if (!f.zoneId) e.zoneId = 'Chọn khu';
    if (!(qty > 0)) e.qty = 'Số lượng phải > 0';
    if (type === 'TRANSFER') {
      if (!f.toZoneId) e.toZoneId = 'Chọn khu đến';
      else if (f.toZoneId === f.zoneId && (!f.toCustomerId || f.toCustomerId === f.customerId)) e.toZoneId = 'Khu đến hoặc chủ hàng mới phải khác';
    }
    if (type !== 'IN' && !e.qty && qty > available + EPS) e.qty = `Vượt tồn hiện có (${fmtQty(available)} t)`;
    setErr(e);
    if (Object.keys(e).length) return;

    const t = store.draftTxn({
      type, date: f.date, customerId: f.customerId, cargoId: f.cargoId, zoneId: f.zoneId,
      toZoneId: type === 'TRANSFER' ? f.toZoneId : '',
      toCustomerId: type === 'TRANSFER' ? (f.toCustomerId || f.customerId) : '',
      qty, vehicle: f.vehicle.trim(), docRef: f.docRef.trim(), note: f.note.trim(),
    });
    const v = validateLedger([...db.txns, t]);
    if (!v.ok) {
      setErr({ qty: `Không đủ tồn tại ngày ${fmtDate(v.txn.date)} (${zoneLabel(lk.zone[v.zoneId], lk)}), thiếu ${fmtQty(-v.balance)} t. Kiểm tra lại ngày chứng từ.` });
      return;
    }
    const dest = type === 'IN' ? f.zoneId : type === 'TRANSFER' && f.toZoneId !== f.zoneId ? f.toZoneId : null;
    if (dest) {
      const z = lk.zone[dest];
      const holder = type === 'TRANSFER' ? (f.toCustomerId || f.customerId) : f.customerId;
      if (z.customerId && z.customerId !== holder &&
        !confirm(`Khu ${zoneLabel(z, lk)} đang dành cho ${lk.cust[z.customerId]?.name}. Vẫn để hàng của ${lk.cust[holder]?.name} vào khu này?`)) return;
      const after = (loads.get(dest) || 0) + qty;
      if (z.capacity > 0 && after > z.capacity + EPS &&
        !confirm(`Khu ${zoneLabel(z, lk)} sẽ vượt sức chứa: ${fmtQty(after)} / ${fmtQty(z.capacity)} tấn. Vẫn ghi phiếu?`)) return;
    }
    store.commitTxn(t);
    toast(`Đã ghi ${meta.label.toLowerCase()} · ${t.no}`);
    setPrinting(t);
    setF({ ...blank(), date: f.date, customerId: f.customerId });
  };

  const list = sortTxns(db.txns.filter(t => t.type === type && t.date >= from && t.date <= to && (!fc || t.customerId === fc || t.toCustomerId === fc)))
    .reverse()
    .filter(t => !q || norm([t.no, t.vehicle, t.docRef, t.note, lk.cust[t.customerId]?.name, lk.cargo[t.cargoId]?.name].join(' ')).includes(norm(q)));
  const listTotal = list.reduce((s, t) => s + t.qty, 0);

  const exportList = () => exportXlsx(`${meta.prefix}_${from}_${to}`, [{
    name: meta.label,
    cols: [16, 12, 36, 18, 20, 20, 14, 18, 16, 24],
    rows: [
      [`DANH SÁCH ${meta.label.toUpperCase()} từ ${fmtDate(from)} đến ${fmtDate(to)}`],
      [],
      ['Số phiếu', 'Ngày', 'Khách hàng', 'Hàng hóa', 'Từ khu', 'Đến khu', 'Số lượng (t)', 'Phương tiện', 'Chứng từ', 'Ghi chú'],
      ...list.map(t => [t.no, fmtDate(t.date), lk.cust[t.customerId]?.name, lk.cargo[t.cargoId]?.name, zoneLabel(lk.zone[t.zoneId], lk),
        t.toZoneId ? zoneLabel(lk.zone[t.toZoneId], lk) : '', t.qty, t.vehicle, t.docRef, t.note]),
      ['', '', '', '', '', 'Tổng cộng', round3(listTotal)],
    ],
  }]);

  const icon = type === 'IN' ? 'in' : type === 'OUT' ? 'out' : 'transfer';

  return (
    <div className="page">
      <PageHeader title={meta.label} subtitle={
        type === 'IN' ? 'Ghi nhận hàng vào kho theo khách hàng và khu xếp hàng'
          : type === 'OUT' ? 'Xuất hàng khỏi kho — chỉ xuất được trong phạm vi tồn của khách hàng'
            : 'Chuyển hàng giữa các khu/kho, hoặc sang tên chủ hàng'
      } />
      <div className="txn-grid">
        <Card title={`Lập ${meta.doc.toLowerCase()}`}>
          <div className="form-grid">
            <Field label="Ngày chứng từ" required error={err.date}>
              <input type="date" value={f.date} max={todayISO()} onChange={e => set({ date: e.target.value })} />
            </Field>
            <Field label="Số phiếu (tự động)">
              <input value={nextDocNo(db, type, f.date || todayISO()).no} readOnly className="mono" />
            </Field>
            <Field label="Khách hàng (chủ hàng)" required error={err.customerId} span={2}>
              <Select value={f.customerId} options={customerOptions(db)} placeholder="— Chọn khách hàng —"
                onChange={v => {
                  const patch = { customerId: v };
                  // nhập kho: tự chọn khu dành cho khách nếu chưa chọn khu, hoặc khu đang chọn thuộc khách khác
                  const cur = lk.zone[f.zoneId];
                  if (type === 'IN' && v && (!cur || (cur.customerId && cur.customerId !== v))) patch.zoneId = bestOwnZone(db, loads, v) || f.zoneId;
                  set(patch);
                }} />
            </Field>
            <Field label="Hàng hóa" required error={err.cargoId}>
              <Select value={f.cargoId} onChange={v => set({ cargoId: v })} options={cargoOptions(db)} placeholder="— Chọn hàng —" />
            </Field>
            <Field label={type === 'IN' ? 'Nhập vào khu' : 'Từ khu'} required error={err.zoneId}
              hint={type !== 'IN' && f.customerId && f.cargoId && f.zoneId ? `Tồn khả dụng: ${fmtQty(available)} t` : null}>
              <ZoneSelect value={f.zoneId} onChange={v => set({ zoneId: v })} db={db} lk={lk} loads={loads} showRoom={type === 'IN'} customerId={type === 'IN' ? f.customerId : ''} />
            </Field>
            {type === 'TRANSFER' && (
              <React.Fragment>
                <Field label="Đến khu" required error={err.toZoneId}>
                  <ZoneSelect value={f.toZoneId} onChange={v => set({ toZoneId: v })} db={db} lk={lk} loads={loads} customerId={f.toCustomerId || f.customerId} />
                </Field>
                <Field label="Chủ hàng mới (nếu sang tên)" hint="Để trống nếu giữ nguyên chủ hàng">
                  <Select value={f.toCustomerId} onChange={v => set({ toCustomerId: v })} options={customerOptions(db).filter(o => o.value !== f.customerId)} placeholder="— Giữ nguyên —" />
                </Field>
              </React.Fragment>
            )}
            <Field label="Số lượng (tấn)" required error={err.qty}>
              <div className="input-row">
                <input type="number" min="0" step="0.001" value={f.qty} onChange={e => set({ qty: e.target.value })} placeholder="0" />
                {type !== 'IN' && available > 0 && <Button size="sm" onClick={() => set({ qty: String(available) })}>Tất cả</Button>}
              </div>
            </Field>
            <Field label={type === 'IN' ? 'Phương tiện (sà lan / xe)' : 'Phương tiện nhận hàng'}>
              <input value={f.vehicle} onChange={e => set({ vehicle: e.target.value })} placeholder={type === 'IN' ? 'VD: Sà lan SG-1234' : 'VD: 51C-123.45'} />
            </Field>
            <Field label="Chứng từ tham chiếu">
              <input value={f.docRef} onChange={e => set({ docRef: e.target.value })} placeholder="B/L, lệnh xuất hàng…" />
            </Field>
            <Field label="Ghi chú">
              <input value={f.note} onChange={e => set({ note: e.target.value })} />
            </Field>
          </div>
          <div className="form-actions">
            <Button variant="ghost" onClick={() => { setF(blank()); setErr({}); }}>Làm lại</Button>
            <Button icon={icon} variant="primary" onClick={submit}>Ghi {meta.short.toLowerCase()}</Button>
          </div>
        </Card>

        {type !== 'IN' && (
          <Card title="Lô hàng đang tồn" actions={f.zoneId || f.customerId ? <Button size="sm" variant="ghost" onClick={() => set({ zoneId: '', customerId: '' })}>Bỏ lọc</Button> : null} pad={false}>
            {lots.length === 0 ? <Empty title="Không có lô hàng phù hợp">Chọn khách hàng hoặc khu khác.</Empty> : (
              <div className="table-wrap tall">
                <table className="table selectable">
                  <thead><tr><th>Khách hàng</th><th>Hàng</th><th>Khu</th><th className="num">Tồn (t)</th></tr></thead>
                  <tbody>
                    {lots.map(r => {
                      const on = r.customerId === f.customerId && r.cargoId === f.cargoId && r.zoneId === f.zoneId;
                      return (
                        <tr key={skey(r.customerId, r.cargoId, r.zoneId)} className={on ? 'is-on' : ''}
                          onClick={() => set({ customerId: r.customerId, cargoId: r.cargoId, zoneId: r.zoneId })}>
                          <td>{lk.cust[r.customerId]?.code} <span className="muted small">{lk.cust[r.customerId]?.name}</span></td>
                          <td>{lk.cargo[r.cargoId]?.name}</td>
                          <td className="nowrap">{zoneLabel(lk.zone[r.zoneId], lk)}</td>
                          <td className="num strong">{fmtQty(r.qty)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        )}
      </div>

      <Card title={`Sổ ${meta.label.toLowerCase()}`} pad={false} actions={<Button size="sm" icon="download" onClick={exportList}>Xuất Excel</Button>}>
        <div className="filters">
          <SearchBox value={q} onChange={setQ} placeholder="Số phiếu, phương tiện, chứng từ…" />
          <Select value={fc} onChange={setFc} options={customerOptions(db)} placeholder="Tất cả khách hàng" />
          <label className="inline">Từ <input type="date" value={from} onChange={e => setFrom(e.target.value)} /></label>
          <label className="inline">Đến <input type="date" value={to} onChange={e => setTo(e.target.value)} /></label>
          <span className="muted">{list.length} phiếu · {fmtQty(listTotal)} tấn</span>
        </div>
        <TxnTable txns={list.slice(0, limit)} lk={lk} onPrint={setPrinting} onDelete={t => deleteTxn(t, db, store, lk)} />
        {list.length > limit && <div className="more"><Button size="sm" onClick={() => setLimit(limit + 100)}>Xem thêm ({list.length - limit})</Button></div>}
      </Card>

      {printing && <PrintTxn txn={printing} lk={lk} onClose={() => setPrinting(null)} />}
    </div>
  );
}

function PrintTxn({ txn: t, lk, onClose }) {
  const meta = TXN_TYPES[t.type];
  const c = lk.cust[t.customerId];
  const z = lk.zone[t.zoneId];
  const tz = t.toZoneId ? lk.zone[t.toZoneId] : null;
  const where = zz => (zz ? `${zoneLabel(zz, lk)} (${zoneBays(zz, lk.wh[zz.warehouseId])})` : '—');
  return (
    <Modal title={`Phiếu ${t.no}`} onClose={onClose} width={760} footer={
      <React.Fragment>
        <Button onClick={onClose}>Đóng</Button>
        <Button icon="print" variant="primary" onClick={printArea}>In phiếu</Button>
      </React.Fragment>
    }>
      <div className="print-area voucher">
        <div className="voucher-top">
          <div><strong>ĐƠN VỊ QUẢN LÝ KHO</strong><div className="small">Hệ thống quản lý kho bãi</div></div>
          <div className="right small">Số: <strong className="mono">{t.no}</strong><br />Ngày: {fmtDate(t.date)}</div>
        </div>
        <h2>{meta.doc}</h2>
        <table className="voucher-table">
          <tbody>
            <tr><th>Khách hàng</th><td colSpan="3">{c?.name} {c?.taxCode && <span className="muted">· MST {c.taxCode}</span>}</td></tr>
            {t.type === 'TRANSFER' && t.toCustomerId && t.toCustomerId !== t.customerId && (
              <tr><th>Chủ hàng mới</th><td colSpan="3">{lk.cust[t.toCustomerId]?.name}</td></tr>
            )}
            <tr><th>Hàng hóa</th><td>{lk.cargo[t.cargoId]?.name}</td><th>Số lượng</th><td className="strong">{t.type === 'ADJUST' && t.qty > 0 ? '+' : ''}{fmtQty(t.qty, 3)} tấn</td></tr>
            <tr><th>{t.type === 'IN' ? 'Nhập vào' : t.type === 'TRANSFER' ? 'Từ khu' : 'Vị trí'}</th><td colSpan="3">{where(z)}</td></tr>
            {tz && <tr><th>Đến khu</th><td colSpan="3">{where(tz)}</td></tr>}
            <tr><th>Phương tiện</th><td>{t.vehicle || '—'}</td><th>Chứng từ</th><td>{t.docRef || '—'}</td></tr>
            <tr><th>Ghi chú</th><td colSpan="3">{t.note || '—'}</td></tr>
          </tbody>
        </table>
        <div className="signs">
          <div><strong>Người lập phiếu</strong><span>(Ký, ghi rõ họ tên)</span></div>
          <div><strong>Thủ kho</strong><span>(Ký, ghi rõ họ tên)</span></div>
          <div><strong>{t.type === 'OUT' ? 'Người nhận hàng' : 'Đại diện khách hàng'}</strong><span>(Ký, ghi rõ họ tên)</span></div>
        </div>
      </div>
    </Modal>
  );
}

/* ---------------- Tồn kho ---------------- */
const GROUPS = {
  detail: 'Chi tiết từng lô',
  customer: 'Theo khách hàng',
  cargo: 'Theo hàng hóa',
  warehouse: 'Theo kho',
  zone: 'Theo khu xếp hàng',
};

function StockScreen({ db, store, lk, params, nav }) {
  const today = todayISO();
  const [asOf, setAsOf] = useState(today);
  const [fc, setFc] = useState(params.customerId || '');
  const [fg, setFg] = useState('');
  const [fw, setFw] = useState(params.zoneId ? lk.zone[params.zoneId]?.warehouseId || '' : '');
  const [fz, setFz] = useState(params.zoneId || '');
  const [group, setGroup] = useState('detail');
  const [counting, setCounting] = useState(null);

  const map = useMemo(() => computeStock(db.txns, { asOf }), [db.txns, asOf]);
  const rows = stockRows(map).filter(r => r.qty > EPS
    && (!fc || r.customerId === fc) && (!fg || r.cargoId === fg)
    && (!fz || r.zoneId === fz) && (!fw || lk.zone[r.zoneId]?.warehouseId === fw));
  const total = rows.reduce((s, r) => s + r.qty, 0);

  const keyOf = {
    customer: r => r.customerId, cargo: r => r.cargoId, zone: r => r.zoneId, warehouse: r => lk.zone[r.zoneId]?.warehouseId,
  };
  const labelOf = {
    customer: k => lk.cust[k]?.name, cargo: k => lk.cargo[k]?.name, zone: k => zoneLabel(lk.zone[k], lk), warehouse: k => `Kho ${lk.wh[k]?.code}`,
  };
  const grouped = group === 'detail' ? null : Object.entries(rows.reduce((m, r) => {
    const k = keyOf[group](r);
    m[k] = m[k] || { qty: 0, lots: 0 };
    m[k].qty += r.qty; m[k].lots += 1;
    return m;
  }, {})).map(([k, v]) => ({ k, label: labelOf[group](k), ...v })).sort((a, b) => b.qty - a.qty);

  const detailRows = [...rows].sort((a, b) =>
    (lk.cust[a.customerId]?.code || '').localeCompare(lk.cust[b.customerId]?.code || '') ||
    (lk.cargo[a.cargoId]?.code || '').localeCompare(lk.cargo[b.cargoId]?.code || '') ||
    zoneLabel(lk.zone[a.zoneId], lk).localeCompare(zoneLabel(lk.zone[b.zoneId], lk)));

  const exportStock = () => {
    const head = [`BÁO CÁO TỒN KHO đến ngày ${fmtDate(asOf)}`];
    const sheet = group === 'detail'
      ? [head, [], ['Mã KH', 'Khách hàng', 'Hàng hóa', 'Kho', 'Khu', 'Gian', 'Tồn (tấn)'],
        ...detailRows.map(r => {
          const z = lk.zone[r.zoneId];
          return [lk.cust[r.customerId]?.code, lk.cust[r.customerId]?.name, lk.cargo[r.cargoId]?.name, lk.wh[z?.warehouseId]?.code, z?.code, zoneBays(z, lk.wh[z?.warehouseId]), r.qty];
        }),
        ['', '', '', '', '', 'Tổng cộng', round3(total)]]
      : [head, [], [GROUPS[group], 'Số lô', 'Tồn (tấn)'], ...grouped.map(g => [g.label, g.lots, round3(g.qty)]), ['Tổng cộng', '', round3(total)]];
    exportXlsx(`TonKho_${asOf}`, [{ name: 'Tồn kho', rows: sheet, cols: group === 'detail' ? [10, 38, 20, 12, 10, 12, 14] : [40, 10, 14] }]);
  };

  return (
    <div className="page">
      <PageHeader title="Tồn kho" subtitle="Tồn được tính từ sổ nhập – xuất – chuyển – kiểm kê, có thể xem lại tại bất kỳ ngày nào" actions={
        <React.Fragment>
          <Button icon="download" onClick={exportStock}>Xuất Excel</Button>
        </React.Fragment>
      } />
      <Card pad={false}>
        <div className="filters">
          <label className="inline">Đến ngày <input type="date" value={asOf} max={today} onChange={e => setAsOf(e.target.value || today)} /></label>
          <Select value={fc} onChange={setFc} options={customerOptions(db)} placeholder="Tất cả khách hàng" />
          <Select value={fg} onChange={setFg} options={cargoOptions(db)} placeholder="Tất cả hàng hóa" />
          <Select value={fw} onChange={v => { setFw(v); setFz(''); }} options={warehouseOptions(db)} placeholder="Tất cả kho" />
          <ZoneSelect value={fz} onChange={setFz} db={db} lk={lk} loads={new Map()} showRoom={false} placeholder="Tất cả khu" filter={z => !fw || z.warehouseId === fw} />
          <Select value={group} onChange={setGroup} options={Object.entries(GROUPS).map(([value, label]) => ({ value, label }))} />
        </div>
        <div className="summary-strip">
          <span>Tổng tồn: <strong>{fmtQty(total)} tấn</strong></span>
          <span>{rows.length} lô hàng</span>
          {asOf !== today && <Badge tone="warning">Đang xem số liệu quá khứ</Badge>}
        </div>
        {rows.length === 0 ? <Empty icon="stock" title="Không có hàng tồn theo bộ lọc" /> : group === 'detail' ? (
          <div className="table-wrap">
            <table className="table">
              <thead><tr><th>Khách hàng</th><th>Hàng hóa</th><th>Kho</th><th>Khu</th><th>Gian</th><th className="num">Tồn (tấn)</th><th /></tr></thead>
              <tbody>
                {detailRows.map(r => {
                  const z = lk.zone[r.zoneId];
                  return (
                    <tr key={skey(r.customerId, r.cargoId, r.zoneId)}>
                      <td><button type="button" className="link" onClick={() => nav('report', { customerId: r.customerId })}>{lk.cust[r.customerId]?.name}</button></td>
                      <td>{lk.cargo[r.cargoId]?.name}</td>
                      <td>{lk.wh[z?.warehouseId]?.code}</td>
                      <td><button type="button" className="link" onClick={() => nav('layout', { zoneId: r.zoneId })}>{z?.code}</button></td>
                      <td className="muted">{zoneBays(z, lk.wh[z?.warehouseId])}</td>
                      <td className="num strong">{fmtQty(r.qty)}</td>
                      <td className="actions">
                        {asOf === today && <Button size="sm" variant="ghost" icon="clipboard" onClick={() => setCounting(r)}>Kiểm kê</Button>}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot><tr><td colSpan="5">Tổng cộng</td><td className="num">{fmtQty(total)}</td><td /></tr></tfoot>
            </table>
          </div>
        ) : (
          <div className="table-wrap">
            <table className="table">
              <thead><tr><th>{GROUPS[group]}</th><th className="num">Số lô</th><th className="num">Tồn (tấn)</th><th className="num">Tỷ trọng</th></tr></thead>
              <tbody>
                {grouped.map(g => (
                  <tr key={g.k}>
                    <td>{g.label}</td>
                    <td className="num">{g.lots}</td>
                    <td className="num strong">{fmtQty(g.qty)}</td>
                    <td className="num"><span className="pct-cell"><span style={{ width: (g.qty / total) * 100 + '%' }} /></span>{Math.round((g.qty / total) * 100)}%</td>
                  </tr>
                ))}
              </tbody>
              <tfoot><tr><td>Tổng cộng</td><td className="num">{rows.length}</td><td className="num">{fmtQty(total)}</td><td /></tr></tfoot>
            </table>
          </div>
        )}
      </Card>
      {counting && <CountModal lot={counting} db={db} store={store} lk={lk} onClose={() => setCounting(null)} />}
    </div>
  );
}

function CountModal({ lot, db, store, lk, onClose }) {
  const [actual, setActual] = useState(String(lot.qty));
  const [note, setNote] = useState('');
  const diff = round3((+actual || 0) - lot.qty);
  const save = () => {
    if (actual === '' || +actual < 0) { toast('Nhập số lượng thực tế ≥ 0', 'danger'); return; }
    if (Math.abs(diff) < EPS) { toast('Số liệu khớp, không cần điều chỉnh.'); onClose(); return; }
    const t = store.draftTxn({ type: 'ADJUST', date: todayISO(), customerId: lot.customerId, cargoId: lot.cargoId, zoneId: lot.zoneId, toZoneId: '', toCustomerId: '', qty: diff, vehicle: '', docRef: '', note: note || 'Điều chỉnh theo kiểm kê' });
    const v = validateLedger([...db.txns, t]);
    if (!v.ok) { toast('Điều chỉnh làm tồn âm tại một thời điểm, kiểm tra lại.', 'danger'); return; }
    store.commitTxn(t);
    toast(`Đã ghi biên bản kiểm kê ${t.no} (${diff > 0 ? '+' : ''}${fmtQty(diff)} t)`);
    onClose();
  };
  return (
    <Modal title="Kiểm kê lô hàng" onClose={onClose} width={480} footer={
      <React.Fragment><Button onClick={onClose}>Hủy</Button><Button variant="primary" icon="check" onClick={save}>Ghi điều chỉnh</Button></React.Fragment>
    }>
      <dl className="dl">
        <dt>Khách hàng</dt><dd>{lk.cust[lot.customerId]?.name}</dd>
        <dt>Hàng hóa</dt><dd>{lk.cargo[lot.cargoId]?.name}</dd>
        <dt>Khu</dt><dd>{zoneLabel(lk.zone[lot.zoneId], lk)}</dd>
        <dt>Tồn sổ sách</dt><dd className="strong">{fmtQty(lot.qty, 3)} t</dd>
      </dl>
      <div className="form-grid">
        <Field label="Tồn thực tế (tấn)" required hint={`Chênh lệch: ${diff > 0 ? '+' : ''}${fmtQty(diff, 3)} t`}>
          <input type="number" min="0" step="0.001" value={actual} onChange={e => setActual(e.target.value)} autoFocus />
        </Field>
        <Field label="Lý do">
          <input value={note} onChange={e => setNote(e.target.value)} placeholder="Hao hụt, đo lại thể tích…" />
        </Field>
      </div>
    </Modal>
  );
}
