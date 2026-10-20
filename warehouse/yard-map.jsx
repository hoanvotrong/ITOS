/* ==========================================================
   Kho Bãi — sơ đồ kho (SVG, theo mẫu kho VNL: kho chia gian,
   cửa ở cạnh dưới, khu xếp hàng tính theo mét, kéo-thả được)
   ========================================================== */

const S = 10;          // 1 mét = 10 đơn vị viewBox
const GAP = 60;        // khoảng cách giữa 2 kho
const Y_BODY = 84;     // mép trên thân kho
const RIGHT_M = 36;    // lề phải để ghi chiều rộng kho
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const r1 = v => Math.round(v * 10) / 10;
const rectsOverlap = (a, b) => a.x < b.x + b.w - 1e-6 && b.x < a.x + a.w - 1e-6 && a.y < b.y + b.h - 1e-6 && b.y < a.y + a.h - 1e-6;

function zoneTone(z, load) {
  const pct = z.capacity > 0 ? load / z.capacity : 0;
  if (load <= EPS) return 'z-empty';
  if (pct >= 0.9) return 'z-danger';
  if (pct >= 0.7) return 'z-warn';
  return 'z-ok';
}

function WarehouseMap({ warehouses, zones, loads, stock, lk, selectedId, onSelect, selectedWhId, onSelectWh, editable = false, onCommit, compact = false, zoom = 1 }) {
  const svgRef = useRef(null);
  const [drag, setDrag] = useState(null);

  // vị trí gốc (ox) của từng kho, xếp ngang như bản vẽ
  const layout = [];
  let ox = 0;
  for (const w of warehouses) { layout.push({ wh: w, ox }); ox += w.length * S + RIGHT_M + GAP; }
  const W = Math.max(ox - GAP, 100);
  const maxWidth = Math.max(10, ...warehouses.map(w => w.width));
  const H = Y_BODY + maxWidth * S + 48;
  const oxOf = Object.fromEntries(layout.map(l => [l.wh.id, l.ox]));

  // khách hàng đang có hàng trong từng khu
  const occupants = useMemo(() => {
    const m = {};
    for (const r of stockRows(stock)) {
      if (r.qty <= EPS) continue;
      (m[r.zoneId] = m[r.zoneId] || new Set()).add(r.customerId);
    }
    return m;
  }, [stock]);

  const toMeters = (e, whId) => {
    const svg = svgRef.current;
    const pt = svg.createSVGPoint();
    pt.x = e.clientX; pt.y = e.clientY;
    const p = pt.matrixTransform(svg.getScreenCTM().inverse());
    return { x: (p.x - oxOf[whId]) / S, y: (p.y - Y_BODY) / S };
  };

  const onDown = (e, z, mode) => {
    e.stopPropagation();
    onSelect && onSelect(z.id);
    if (!editable) return;
    e.preventDefault();
    svgRef.current.setPointerCapture(e.pointerId);
    setDrag({ id: z.id, mode, start: toMeters(e, z.warehouseId), orig: z, draft: z });
  };

  const onMove = e => {
    if (!drag) return;
    const o = drag.orig;
    const wh = lk.wh[o.warehouseId];
    const c = toMeters(e, o.warehouseId);
    const dx = Math.round(c.x - drag.start.x);
    const dy = Math.round(c.y - drag.start.y);
    const next = drag.mode === 'move'
      ? { ...o, x: r1(clamp(o.x + dx, 0, wh.length - o.w)), y: r1(clamp(o.y + dy, 0, wh.width - o.h)) }
      : { ...o, w: r1(clamp(o.w + dx, 2, wh.length - o.x)), h: r1(clamp(o.h + dy, 2, wh.width - o.y)) };
    if (zones.some(other => other.id !== next.id && other.warehouseId === next.warehouseId && rectsOverlap(other, next))) return;
    const d = drag.draft;
    if (next.x !== d.x || next.y !== d.y || next.w !== d.w || next.h !== d.h) setDrag({ ...drag, draft: next });
  };

  const onUp = () => {
    if (!drag) return;
    const d = drag.draft, o = drag.orig;
    if (d.x !== o.x || d.y !== o.y || d.w !== o.w || d.h !== o.h) onCommit && onCommit(d);
    setDrag(null);
  };

  return (
    <svg
      ref={svgRef}
      className={`yard ${editable ? 'is-editing' : ''} ${compact ? 'is-compact' : ''}`}
      viewBox={`-10 0 ${W + 20} ${H}`}
      style={{ width: `${zoom * 100}%` }}
      onPointerMove={onMove}
      onPointerUp={onUp}
      onPointerCancel={onUp}
      role="img"
      aria-label="Sơ đồ kho"
    >
      <defs>
        <pattern id="grid-1m" width={S} height={S} patternUnits="userSpaceOnUse">
          <path d={`M ${S} 0 L 0 0 0 ${S}`} fill="none" className="wh-grid" />
        </pattern>
      </defs>
      <rect x="-10" y="0" width={W + 20} height={H} className="yard-bg" onPointerDown={() => { onSelect && onSelect(null); }} />

      {layout.map(({ wh, ox }) => {
        const L = wh.length * S, D = wh.width * S;
        const bw = L / Math.max(1, wh.bays);
        const bays = Array.from({ length: Math.max(1, wh.bays) }, (_, i) => i);
        const bottom = Y_BODY + D;
        const doors = [...(wh.doors || [])].sort((a, b) => a.x - b.x);
        // các đoạn tường cạnh dưới (trừ chỗ cửa)
        const walls = [];
        let cur = 0;
        for (const d of doors) { if (d.x * S > cur) walls.push([cur, d.x * S]); cur = Math.max(cur, (d.x + d.w) * S); }
        if (cur < L) walls.push([cur, L]);
        const whSel = selectedWhId === wh.id;

        return (
          <g key={wh.id} transform={`translate(${ox},0)`} className={`wh ${whSel ? 'is-sel' : ''}`}>
            {/* tiêu đề */}
            <text x="0" y="22" className="wh-title" onPointerDown={e => { e.stopPropagation(); onSelectWh && onSelectWh(wh.id); onSelect && onSelect(null); }}>KHO {wh.code}</text>
            {!compact && (
              <text x={L} y="20" textAnchor="end" className="wh-dim">
                {fmtM(wh.length)} m x {fmtM(wh.width)} m = {fmtM(wh.length * wh.width)} m², {wh.bays} gian
              </text>
            )}
            <text x={L / 2} y="40" textAnchor="middle" className="wh-measure">{fmtM(wh.length)} m</text>
            <path d={`M0 48 V44 H${L} V48`} className="wh-measure-line" />

            {/* đầu gian */}
            {bays.map(i => (
              <g key={i}>
                <rect x={i * bw} y="52" width={bw} height="28" className="wh-bayhead" />
                <text x={i * bw + bw / 2} y="64" textAnchor="middle" className="wh-baylabel">Gian {i + 1}</text>
                {!compact && <text x={i * bw + bw / 2} y="76" textAnchor="middle" className="wh-baywidth">{fmtM(wh.length / wh.bays)} m</text>}
              </g>
            ))}

            {/* thân kho */}
            <rect
              x="0" y={Y_BODY} width={L} height={D} className="wh-body"
              onPointerDown={e => { e.stopPropagation(); onSelectWh && onSelectWh(wh.id); onSelect && onSelect(null); }}
            />
            {!compact && <rect x="0" y={Y_BODY} width={L} height={D} fill="url(#grid-1m)" pointerEvents="none" />}
            {bays.slice(1).map(i => <line key={i} x1={i * bw} y1={Y_BODY} x2={i * bw} y2={bottom} className="wh-bayline" />)}
            <path d={`M0 ${bottom} V${Y_BODY} H${L} V${bottom}`} className="wh-wall" />
            {walls.map(([a, b], i) => <line key={i} x1={a} y1={bottom} x2={b} y2={bottom} className="wh-wall" />)}
            {doors.map(d => (
              <g key={d.id}>
                <line x1={d.x * S} y1={bottom} x2={(d.x + d.w) * S} y2={bottom} className="wh-door" />
                <line x1={d.x * S} y1={bottom - 8} x2={d.x * S} y2={bottom} className="wh-wall" />
                <line x1={(d.x + d.w) * S} y1={bottom - 8} x2={(d.x + d.w) * S} y2={bottom} className="wh-wall" />
                <text x={(d.x + d.w / 2) * S} y={bottom + 16} textAnchor="middle" className="wh-doorlabel">{d.label}</text>
              </g>
            ))}
            {!compact && (
              <text transform={`translate(${L + 18},${Y_BODY + D / 2}) rotate(90)`} textAnchor="middle" className="wh-measure">{fmtM(wh.width)} m</text>
            )}

            {/* chân gian */}
            {bays.map(i => (
              <g key={i}>
                <rect x={i * bw} y={bottom + 24} width={bw} height="18" className="wh-bayhead" />
                <text x={i * bw + bw / 2} y={bottom + 37} textAnchor="middle" className="wh-baylabel">Gian {i + 1}</text>
              </g>
            ))}

            {/* khu xếp hàng */}
            {zones.filter(z => z.warehouseId === wh.id).map(z0 => {
              const z = drag && drag.id === z0.id ? drag.draft : z0;
              const load = loads.get(z.id) || 0;
              const pct = z.capacity > 0 ? Math.min(1, Math.max(0, load / z.capacity)) : 0;
              const x = z.x * S, y = Y_BODY + z.y * S, w = z.w * S, h = z.h * S;
              const sel = z.id === selectedId;
              const occ = [...(occupants[z.id] || [])].map(cid => lk.cust[cid]?.code || '?');
              const roomy = h >= 110 && w >= 110;
              return (
                <g key={z.id} className={`zone ${zoneTone(z, load)} ${sel ? 'is-sel' : ''}`} onPointerDown={e => onDown(e, z0, 'move')}>
                  <svg x={x} y={y} width={w} height={h} overflow="hidden">
                    <rect x="1.5" y="1.5" width={w - 3} height={h - 3} rx="4" className="zone-rect" />
                    {pct > 0 && <rect x="1.5" y={1.5 + (h - 3) * (1 - pct)} width={w - 3} height={(h - 3) * pct} rx="3" className="zone-level" />}
                    <text x="10" y="24" className="zone-code">{z.code}</text>
                    {roomy && z.name && <text x="10" y="42" className="zone-name">{z.name}</text>}
                    {roomy && occ.length > 0 && (
                      <text x="10" y={z.name ? 60 : 44} className="zone-name">{occ.slice(0, 2).join(', ')}{occ.length > 2 ? ` +${occ.length - 2}` : ''}</text>
                    )}
                    {roomy ? (
                      <React.Fragment>
                        <text x="10" y={h - 28} className="zone-load">{fmtQty(load, 0)} t</text>
                        <text x="10" y={h - 11} className="zone-cap">/ {fmtQty(z.capacity, 0)} t · {Math.round(pct * 100)}%</text>
                      </React.Fragment>
                    ) : (
                      <text x="10" y={h - 10} className="zone-cap">{fmtQty(load, 0)} t</text>
                    )}
                  </svg>
                  {editable && sel && (
                    <rect x={x + w - 16} y={y + h - 16} width="14" height="14" rx="2" className="zone-handle" onPointerDown={e => onDown(e, z0, 'resize')} />
                  )}
                </g>
              );
            })}
          </g>
        );
      })}
    </svg>
  );
}

function YardLegend() {
  return (
    <div className="legend">
      <span><i className="lg z-empty" />Trống</span>
      <span><i className="lg z-ok" />&lt; 70%</span>
      <span><i className="lg z-warn" />70–90%</span>
      <span><i className="lg z-danger" />≥ 90%</span>
      <span><i className="lg lg-door" />Cửa</span>
    </div>
  );
}

/* ---------- Màn hình Sơ đồ kho ---------- */
function LayoutScreen({ db, store, stock, loads, lk, params, nav }) {
  const [edit, setEdit] = useState(false);
  const [sel, setSel] = useState(params.zoneId || null);
  const initialWh = params.zoneId ? lk.zone[params.zoneId]?.warehouseId : null;
  const [tab, setTab] = useState(initialWh || 'all');
  const [whSel, setWhSel] = useState(initialWh || db.warehouses[0]?.id || null);
  const [zoom, setZoom] = useState(1);

  const zone = db.zones.find(z => z.id === sel) || null;
  const visible = tab === 'all' ? db.warehouses : db.warehouses.filter(w => w.id === tab);
  const activeWh = lk.wh[zone ? zone.warehouseId : (tab !== 'all' ? tab : whSel)] || null;

  const totalCap = db.zones.reduce((s, z) => s + (+z.capacity || 0), 0);
  const totalLoad = db.zones.reduce((s, z) => s + (loads.get(z.id) || 0), 0);

  const selectZone = id => {
    setSel(id);
    if (id) setWhSel(lk.zone[id]?.warehouseId || whSel);
  };

  const addZone = () => {
    const wh = activeWh;
    if (!wh) { toast('Hãy tạo kho trước.', 'danger'); return; }
    const w = 10, h = 10;
    const mine = db.zones.filter(z => z.warehouseId === wh.id);
    for (let y = 1; y + h <= wh.width; y++) {
      for (let x = 1; x + w <= wh.length; x++) {
        const cand = { x, y, w, h };
        if (!mine.some(o => rectsOverlap(o, cand))) {
          const prefix = wh.code.slice(-1);
          const z = store.upsert('zones', {
            warehouseId: wh.id, code: `${prefix}-${pad(mine.length + 1)}`, name: '', note: '',
            capacity: r1(w * h * (wh.loadRate || 0)), ...cand,
          });
          setSel(z.id);
          return;
        }
      }
    }
    toast(`Kho ${wh.code} không còn chỗ trống 10×10 m.`, 'danger');
  };

  const addWarehouse = () => {
    const n = db.warehouses.length + 1;
    const wh = store.upsert('warehouses', {
      code: `KHO-${pad(n)}`, name: `Kho mới ${n}`, length: 60, width: 40, bays: 6, loadRate: 2.5, note: '',
      doors: [{ id: uid(), label: 'C/A D1', x: 20, w: 10 }],
    });
    setTab(wh.id); setWhSel(wh.id); setSel(null); setEdit(true);
  };

  return (
    <div className="page">
      <PageHeader
        title="Sơ đồ kho"
        subtitle={`${db.warehouses.length} kho · ${db.zones.length} khu xếp hàng · đang chứa ${fmtQty(totalLoad, 0)} / ${fmtQty(totalCap, 0)} tấn (${totalCap ? Math.round((totalLoad / totalCap) * 100) : 0}%)`}
        actions={
          <React.Fragment>
            {edit && <Button icon="plus" onClick={addWarehouse}>Thêm kho</Button>}
            {edit && <Button icon="plus" onClick={addZone} disabled={!activeWh}>Thêm khu xếp hàng{activeWh ? ` (${activeWh.code})` : ''}</Button>}
            <Button icon={edit ? 'check' : 'edit'} variant={edit ? 'primary' : 'default'} onClick={() => setEdit(!edit)}>
              {edit ? 'Xong chỉnh sửa' : 'Chỉnh sửa sơ đồ'}
            </Button>
          </React.Fragment>
        }
      />
      <div className="tabs">
        <button type="button" className={tab === 'all' ? 'active' : ''} onClick={() => setTab('all')}>Tất cả kho</button>
        {db.warehouses.map(w => (
          <button type="button" key={w.id} className={tab === w.id ? 'active' : ''} onClick={() => { setTab(w.id); setWhSel(w.id); }}>{w.code}</button>
        ))}
      </div>
      <div className="layout-grid">
        <Card className="map-card" pad={false}>
          <div className="map-wrap">
            {visible.length ? (
              <WarehouseMap
                warehouses={visible} zones={db.zones} loads={loads} stock={stock} lk={lk}
                selectedId={sel} onSelect={selectZone}
                selectedWhId={activeWh?.id} onSelectWh={setWhSel}
                editable={edit} onCommit={z => store.upsert('zones', z)} zoom={zoom}
              />
            ) : <Empty icon="map" title="Chưa có kho nào">Bật "Chỉnh sửa sơ đồ" rồi bấm "Thêm kho".</Empty>}
          </div>
          <div className="map-foot">
            <YardLegend />
            <div className="zoom">
              <Button size="sm" onClick={() => setZoom(z => Math.max(1, z - 0.5))} disabled={zoom <= 1}>−</Button>
              <span>{Math.round(zoom * 100)}%</span>
              <Button size="sm" onClick={() => setZoom(z => Math.min(3, z + 0.5))} disabled={zoom >= 3}>+</Button>
            </div>
            {edit && <span className="muted small">Kéo khu để di chuyển (bước 1 m) · kéo góc phải-dưới để đổi kích thước</span>}
          </div>
        </Card>
        <div className="side-panel">
          {zone && edit && <ZoneEditor key={zone.id} zone={zone} db={db} store={store} lk={lk} onDeleted={() => setSel(null)} />}
          {zone && !edit && <ZoneInspector zone={zone} stock={stock} loads={loads} lk={lk} nav={nav} />}
          {!zone && activeWh && edit && <WarehouseEditor key={activeWh.id} wh={activeWh} db={db} store={store} onDeleted={() => { setTab('all'); setWhSel(null); }} />}
          {!zone && activeWh && !edit && <WarehouseInspector wh={activeWh} db={db} loads={loads} onPickZone={selectZone} />}
          {!zone && !activeWh && (
            <Card title="Chi tiết">
              <Empty icon="map" title="Chọn một kho hoặc khu xếp hàng" />
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

function WarehouseInspector({ wh, db, loads, onPickZone }) {
  const zs = db.zones.filter(z => z.warehouseId === wh.id).sort((a, b) => a.code.localeCompare(b.code));
  const cap = zs.reduce((s, z) => s + (+z.capacity || 0), 0);
  const load = zs.reduce((s, z) => s + (loads.get(z.id) || 0), 0);
  const used = zs.reduce((s, z) => s + z.w * z.h, 0);
  return (
    <Card title={`Kho ${wh.code}`}>
      <dl className="dl">
        <dt>Kích thước</dt><dd>{fmtM(wh.length)} × {fmtM(wh.width)} m</dd>
        <dt>Diện tích</dt><dd>{fmtM(wh.length * wh.width)} m²</dd>
        <dt>Số gian</dt><dd>{wh.bays} gian × {fmtM(wh.length / wh.bays)} m</dd>
        <dt>Diện tích xếp hàng</dt><dd>{fmtM(used)} m² ({Math.round((used / (wh.length * wh.width)) * 100)}%)</dd>
        <dt>Định mức</dt><dd>{fmtM(wh.loadRate)} tấn/m²</dd>
      </dl>
      <div className="zone-load-box">
        <div><strong>{fmtQty(load, 0)}</strong> / {fmtQty(cap, 0)} tấn</div>
        <FillBar value={load} max={cap} />
      </div>
      <div className="zone-list">
        {zs.map(z => (
          <button type="button" key={z.id} className="zone-list-row" onClick={() => onPickZone(z.id)}>
            <span><strong>{z.code}</strong> <span className="muted small">{zoneBays(z, wh)}</span></span>
            <span>{fmtQty(loads.get(z.id) || 0, 0)} / {fmtQty(z.capacity, 0)} t</span>
          </button>
        ))}
      </div>
    </Card>
  );
}

function ZoneInspector({ zone, stock, loads, lk, nav }) {
  const wh = lk.wh[zone.warehouseId];
  const rows = stockRows(stock).filter(r => r.zoneId === zone.id && r.qty > EPS);
  const byCust = {};
  rows.forEach(r => { (byCust[r.customerId] = byCust[r.customerId] || []).push(r); });
  const load = loads.get(zone.id) || 0;

  return (
    <Card title={`Khu ${zoneLabel(zone, lk)}`}>
      <div className="zone-meta">
        <Badge tone="info">{zoneBays(zone, wh)}</Badge>
        <span className="muted">{fmtM(zone.w)} × {fmtM(zone.h)} m = {fmtM(zone.w * zone.h)} m²</span>
      </div>
      {zone.name && <p className="muted">{zone.name}</p>}
      <div className="zone-load-box">
        <div><strong>{fmtQty(load, 1)}</strong> / {fmtQty(zone.capacity, 0)} tấn</div>
        <FillBar value={load} max={zone.capacity} />
        <span className="muted">Còn trống {fmtQty(Math.max(0, zone.capacity - load), 1)} tấn</span>
      </div>
      {rows.length === 0 && <Empty title="Khu đang trống" />}
      {Object.entries(byCust).map(([cid, rs]) => (
        <div key={cid} className="zone-cust">
          <div className="zone-cust-name">{lk.cust[cid]?.name || '—'}</div>
          {rs.map(r => (
            <div key={r.cargoId} className="zone-cust-row">
              <span>{lk.cargo[r.cargoId]?.name}</span>
              <strong>{fmtQty(r.qty)} t</strong>
            </div>
          ))}
        </div>
      ))}
      <div className="btn-col">
        <Button icon="in" variant="primary" onClick={() => nav('in', { zoneId: zone.id })}>Nhập vào khu này</Button>
        <Button icon="out" onClick={() => nav('out', { zoneId: zone.id })} disabled={!rows.length}>Xuất từ khu này</Button>
        <Button icon="transfer" onClick={() => nav('transfer', { zoneId: zone.id })} disabled={!rows.length}>Chuyển từ khu này</Button>
        <Button icon="stock" variant="ghost" onClick={() => nav('stock', { zoneId: zone.id })}>Xem bảng tồn</Button>
      </div>
    </Card>
  );
}

function ZoneEditor({ zone, db, store, lk, onDeleted }) {
  const wh = lk.wh[zone.warehouseId];
  const set = patch => store.upsert('zones', { ...zone, ...patch });
  const dupCode = db.zones.some(z => z.id !== zone.id && z.warehouseId === zone.warehouseId && z.code.trim().toLowerCase() === zone.code.trim().toLowerCase());
  const used = db.txns.some(t => t.zoneId === zone.id || t.toZoneId === zone.id);
  const suggested = r1(zone.w * zone.h * (wh?.loadRate || 0));

  // đổi toạ độ/kích thước bằng ô nhập: chỉ áp dụng nếu nằm trong kho và không chồng khu khác
  const setGeom = (k, v) => {
    const next = { ...zone, [k]: r1(Math.max(k === 'w' || k === 'h' ? 1 : 0, +v || 0)) };
    if (next.x + next.w > wh.length + 1e-6 || next.y + next.h > wh.width + 1e-6) { toast('Vượt ra ngoài kích thước kho.', 'danger'); return; }
    if (db.zones.some(o => o.id !== zone.id && o.warehouseId === zone.warehouseId && rectsOverlap(o, next))) { toast('Chồng lên khu xếp hàng khác.', 'danger'); return; }
    store.upsert('zones', next);
  };

  const del = () => {
    if (used) { toast('Khu đã có giao dịch, không thể xóa (để giữ lịch sử).', 'danger'); return; }
    if (!confirm(`Xóa khu ${zone.code}?`)) return;
    store.remove('zones', zone.id);
    onDeleted();
  };

  return (
    <Card title={`Sửa khu xếp hàng · ${wh?.code}`}>
      <div className="form-grid">
        <Field label="Mã khu" required error={dupCode ? 'Mã bị trùng trong kho' : null}>
          <input value={zone.code} onChange={e => set({ code: e.target.value.toUpperCase() })} />
        </Field>
        <Field label="Vị trí gian">
          <input value={zoneBays(zone, wh)} readOnly />
        </Field>
        <Field label="Tên / mô tả" span={2}>
          <input value={zone.name || ''} onChange={e => set({ name: e.target.value })} placeholder="VD: Đống than cám tàu ABC" />
        </Field>
        <Field label="X (m)"><input type="number" step="0.5" value={zone.x} onChange={e => setGeom('x', e.target.value)} /></Field>
        <Field label="Y (m)"><input type="number" step="0.5" value={zone.y} onChange={e => setGeom('y', e.target.value)} /></Field>
        <Field label="Dài (m)"><input type="number" step="0.5" value={zone.w} onChange={e => setGeom('w', e.target.value)} /></Field>
        <Field label="Rộng (m)"><input type="number" step="0.5" value={zone.h} onChange={e => setGeom('h', e.target.value)} /></Field>
        <Field label="Sức chứa (tấn)" span={2} hint={`Theo định mức ${fmtM(wh?.loadRate)} t/m²: ${fmtQty(suggested, 1)} tấn`}>
          <div className="input-row">
            <input type="number" min="0" step="10" value={zone.capacity} onChange={e => set({ capacity: Math.max(0, +e.target.value || 0) })} />
            <Button size="sm" onClick={() => set({ capacity: suggested })}>Theo định mức</Button>
          </div>
        </Field>
        <Field label="Ghi chú" span={2}>
          <textarea rows="2" value={zone.note || ''} onChange={e => set({ note: e.target.value })} />
        </Field>
      </div>
      <Button icon="trash" variant="danger-ghost" onClick={del}>Xóa khu</Button>
    </Card>
  );
}

function WarehouseEditor({ wh, db, store, onDeleted }) {
  const set = patch => store.upsert('warehouses', { ...wh, ...patch });
  const num = (v, min = 0) => Math.max(min, +v || 0);
  const zs = db.zones.filter(z => z.warehouseId === wh.id);
  const outside = zs.filter(z => z.x + z.w > wh.length + 1e-6 || z.y + z.h > wh.width + 1e-6);
  const setDoor = (id, patch) => set({ doors: wh.doors.map(d => (d.id === id ? { ...d, ...patch } : d)) });

  const del = () => {
    if (zs.length) { toast('Kho còn khu xếp hàng, hãy xóa các khu trước.', 'danger'); return; }
    if (!confirm(`Xóa kho ${wh.code}?`)) return;
    store.remove('warehouses', wh.id);
    onDeleted();
  };

  return (
    <Card title={`Sửa kho ${wh.code}`}>
      <div className="form-grid">
        <Field label="Mã kho" required><input value={wh.code} onChange={e => set({ code: e.target.value.toUpperCase() })} /></Field>
        <Field label="Tên kho"><input value={wh.name} onChange={e => set({ name: e.target.value })} /></Field>
        <Field label="Chiều dài (m)"><input type="number" step="0.01" min="5" value={wh.length} onChange={e => set({ length: num(e.target.value, 5) })} /></Field>
        <Field label="Chiều rộng (m)"><input type="number" step="0.01" min="5" value={wh.width} onChange={e => set({ width: num(e.target.value, 5) })} /></Field>
        <Field label="Số gian"><input type="number" min="1" max="30" value={wh.bays} onChange={e => set({ bays: Math.round(num(e.target.value, 1)) })} /></Field>
        <Field label="Định mức (tấn/m²)"><input type="number" step="0.1" min="0" value={wh.loadRate} onChange={e => set({ loadRate: num(e.target.value) })} /></Field>
      </div>
      <p className="muted small">{fmtM(wh.length * wh.width)} m² · mỗi gian {fmtM(wh.length / wh.bays)} m</p>
      {outside.length > 0 && <p className="field-error">Có {outside.length} khu nằm ngoài kích thước kho: {outside.map(z => z.code).join(', ')}</p>}

      <h4 className="sub-head">Cửa ra vào (cạnh dưới)</h4>
      {wh.doors.map(d => (
        <div key={d.id} className="door-row">
          <input value={d.label} onChange={e => setDoor(d.id, { label: e.target.value })} aria-label="Tên cửa" />
          <label>Từ <input type="number" step="0.5" value={d.x} onChange={e => setDoor(d.id, { x: clamp(num(e.target.value), 0, wh.length) })} /> m</label>
          <label>Rộng <input type="number" step="0.5" value={d.w} onChange={e => setDoor(d.id, { w: clamp(num(e.target.value, 1), 1, wh.length) })} /> m</label>
          <button type="button" className="icon-btn" onClick={() => set({ doors: wh.doors.filter(x => x.id !== d.id) })} aria-label="Xóa cửa"><Icon name="trash" size={14} /></button>
        </div>
      ))}
      <Button size="sm" icon="plus" onClick={() => set({ doors: [...wh.doors, { id: uid(), label: `C/A D${wh.doors.length + 1}`, x: 0, w: 8 }] })}>Thêm cửa</Button>
      <div className="divider" />
      <Button icon="trash" variant="danger-ghost" onClick={del}>Xóa kho</Button>
    </Card>
  );
}
