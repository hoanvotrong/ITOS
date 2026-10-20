/* ==========================================================
   Kho Bãi — sơ đồ kho (SVG, theo mẫu kho VNL: kho chia gian,
   cửa ở cạnh dưới, khu xếp hàng tính theo mét, kéo-thả được)
   ========================================================== */

const S = 10;          // 1 mét = 10 đơn vị viewBox
const SIDE_M = 44;     // lề trái/phải để ghi chiều rộng kho (2 kho đặt liền tường, như bản vẽ)
const Y_BODY = 82;     // mép trên thân kho
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

function WarehouseMap({ warehouses, zones, loads, stock, lk, selectedId, onSelect, selectedWhId, onSelectWh, editable = false, onCommit, onCreate, compact = false, zoom = 1 }) {
  const svgRef = useRef(null);
  const [drag, setDrag] = useState(null);
  const [draw, setDraw] = useState(null); // kéo vùng chọn để tạo khu mới

  // vị trí gốc (ox) của từng kho, xếp ngang như bản vẽ
  const layout = [];
  let ox = 0;
  for (const w of warehouses) { layout.push({ wh: w, ox }); ox += w.length * S; }
  const W = Math.max(ox, 100);
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

  // góc vùng chọn bám theo vạch lưới 1 m, giới hạn trong thân kho
  const snapIn = (e, wh) => {
    const m = toMeters(e, wh.id);
    return { x: clamp(Math.round(m.x), 0, wh.length), y: clamp(Math.round(m.y), 0, wh.width) };
  };
  const drawRect = d => {
    const x = Math.min(d.sx, d.cx), y = Math.min(d.sy, d.cy);
    const r = { warehouseId: d.whId, x, y, w: r1(Math.max(d.sx, d.cx) - x), h: r1(Math.max(d.sy, d.cy) - y) };
    const overlap = zones.some(o => o.warehouseId === d.whId && rectsOverlap(o, r));
    return { ...r, overlap, ok: r.w >= 2 && r.h >= 2 && !overlap };
  };

  const onBodyDown = (e, wh) => {
    e.stopPropagation();
    onSelectWh && onSelectWh(wh.id);
    onSelect && onSelect(null);
    if (!editable || !onCreate) return;
    e.preventDefault();
    svgRef.current.setPointerCapture(e.pointerId);
    const p = snapIn(e, wh);
    setDraw({ whId: wh.id, sx: p.x, sy: p.y, cx: p.x, cy: p.y });
  };

  const onMove = e => {
    if (draw) {
      const p = snapIn(e, lk.wh[draw.whId]);
      if (p.x !== draw.cx || p.y !== draw.cy) setDraw({ ...draw, cx: p.x, cy: p.y });
      return;
    }
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
    if (draw) {
      const r = drawRect(draw);
      setDraw(null);
      if (r.ok) onCreate({ warehouseId: r.warehouseId, x: r.x, y: r.y, w: r.w, h: r.h });
      else if (r.overlap) toast('Vùng chọn chồng lên khu đã có, hãy chọn vùng trống.', 'danger');
      else if (r.w > 0 || r.h > 0) toast('Vùng chọn quá nhỏ (tối thiểu 2 × 2 m).', 'danger');
      return;
    }
    if (!drag) return;
    const d = drag.draft, o = drag.orig;
    if (d.x !== o.x || d.y !== o.y || d.w !== o.w || d.h !== o.h) onCommit && onCommit(d);
    setDrag(null);
  };

  return (
    <svg
      ref={svgRef}
      className={`yard ${editable ? 'is-editing' : ''} ${compact ? 'is-compact' : ''}`}
      viewBox={`${-SIDE_M} 0 ${W + 2 * SIDE_M} ${H}`}
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
      <rect x={-SIDE_M} y="0" width={W + 2 * SIDE_M} height={H} className="yard-bg" onPointerDown={() => { onSelect && onSelect(null); }} />

      {layout.map(({ wh, ox }, wi) => {
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
            <text x="8" y="22" className="wh-title" onPointerDown={e => { e.stopPropagation(); onSelectWh && onSelectWh(wh.id); onSelect && onSelect(null); }}>KHO {wh.code}</text>
            {!compact && (
              <text x={L - 16} y="20" textAnchor="end" className="wh-dim">
                {fmtM(wh.length)} m x {fmtM(wh.width)} m = {fmtM(wh.length * wh.width)} m², {wh.bays} gian
              </text>
            )}
            <text x={L / 2} y="38" textAnchor="middle" className="wh-measure">{wh.length} m</text>
            <path d={`M2 50 V44 H${L - 2} V50`} className="wh-measure-line" />

            {/* đầu gian: hàng tên gian + hàng bề rộng gian */}
            {bays.map(i => (
              <g key={i}>
                <rect x={i * bw} y="52" width={bw} height="14" className="wh-bayhead" />
                <rect x={i * bw} y="66" width={bw} height="14" className="wh-baywidth-cell" />
                <text x={i * bw + bw / 2} y="62.5" textAnchor="middle" className="wh-baylabel">Gian {i + 1}</text>
                <text x={i * bw + bw / 2} y="76" textAnchor="middle" className="wh-baywidth">{(wh.length / wh.bays).toFixed(2)} m</text>
              </g>
            ))}

            {/* thân kho */}
            <rect x="0" y={Y_BODY} width={L} height={D} className={`wh-body ${editable && onCreate ? 'can-draw' : ''}`} onPointerDown={e => onBodyDown(e, wh)} />
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
            {/* chiều rộng kho: bên trái kho đầu, bên phải kho cuối */}
            {wi === 0 && (
              <g>
                <path d={`M-8 ${Y_BODY + 2} H-16 V${bottom - 2} H-8`} className="wh-measure-line" />
                <text transform={`translate(-24,${Y_BODY + D / 2}) rotate(-90)`} textAnchor="middle" className="wh-measure">{wh.width} m</text>
              </g>
            )}
            {wi === layout.length - 1 && (
              <g>
                <path d={`M${L + 8} ${Y_BODY + 2} H${L + 16} V${bottom - 2} H${L + 8}`} className="wh-measure-line" />
                <text transform={`translate(${L + 24},${Y_BODY + D / 2}) rotate(90)`} textAnchor="middle" className="wh-measure">{wh.width} m</text>
              </g>
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
              const owner = z.customerId ? lk.cust[z.customerId] : null;
              const color = owner ? custColor(lk, owner.id) : null;
              // dòng phụ: khu của khách → tên khách; khu dùng chung → các khách đang có hàng
              const lines = [
                owner ? owner.name : occ.length ? `Dùng chung: ${occ.slice(0, 2).join(', ')}${occ.length > 2 ? ` +${occ.length - 2}` : ''}` : 'Dùng chung',
                z.name || (z.cargoId ? lk.cargo[z.cargoId]?.name : ''),
              ].filter(Boolean);
              return (
                <g key={z.id} className={`zone ${zoneTone(z, load)} ${owner ? 'is-owned' : ''} ${sel ? 'is-sel' : ''}`} onPointerDown={e => onDown(e, z0, 'move')}>
                  <svg x={x} y={y} width={w} height={h} overflow="hidden">
                    <rect x="1.5" y="1.5" width={w - 3} height={h - 3} rx="4" className="zone-rect" stroke={color || undefined} />
                    {pct > 0 && <rect x="1.5" y={1.5 + (h - 3) * (1 - pct)} width={w - 3} height={(h - 3) * pct} rx="3" className="zone-level" />}
                    {owner && <rect x="1.5" y="1.5" width={w - 3} height="32" rx="4" fill={color} className="zone-band" />}
                    <text x="10" y="24" className={`zone-code ${owner ? 'on-band' : ''}`}>
                      {z.code}{owner && <tspan className="zone-owner"> · {owner.code}</tspan>}
                    </text>
                    {roomy && lines.map((t, i) => <text key={i} x="10" y={(owner ? 52 : 44) + i * 17} className="zone-name">{t}</text>)}
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

            {/* vùng đang kéo chọn */}
            {draw && draw.whId === wh.id && (() => {
              const r = drawRect(draw);
              if (r.w <= 0 && r.h <= 0) return null;
              return (
                <g pointerEvents="none">
                  <rect x={r.x * S} y={Y_BODY + r.y * S} width={r.w * S} height={r.h * S} className={`zone-draft ${r.ok ? '' : 'bad'}`} />
                  <text x={r.x * S + 8} y={Y_BODY + r.y * S + (r.y < 2 ? 20 : -8)} className="zone-draft-label">
                    {fmtM(r.w)} × {fmtM(r.h)} m = {fmtM(r.w * r.h)} m²{r.overlap ? ' · chồng khu khác' : ''}
                  </text>
                </g>
              );
            })()}
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

  const [creating, setCreating] = useState(null); // vùng vừa kéo chọn, chờ gán khách hàng

  const owners = [...new Set(db.zones.map(z => z.customerId).filter(Boolean))].filter(id => lk.cust[id])
    .sort((a, b) => lk.cust[a].code.localeCompare(lk.cust[b].code));

  return (
    <div className="page">
      <PageHeader
        title="Sơ đồ kho"
        subtitle={`${db.warehouses.length} kho · ${db.zones.length} khu xếp hàng · đang chứa ${fmtQty(totalLoad, 0)} / ${fmtQty(totalCap, 0)} tấn (${totalCap ? Math.round((totalLoad / totalCap) * 100) : 0}%)`}
        actions={
          <React.Fragment>
            {!edit && <Button icon="plus" variant="primary" onClick={() => setEdit(true)}>Tạo khu cho khách hàng</Button>}
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
      {edit && (
        <div className="hint-bar">
          <Icon name="map" />
          <span><strong>Kéo chuột trên vùng trống của kho</strong> để chọn vùng và tạo khu xếp hàng cho khách hàng (bám lưới 1 m).
            Kéo khu có sẵn để di chuyển, kéo góc phải-dưới để đổi kích thước.</span>
        </div>
      )}
      <div className="layout-grid">
        <Card className="map-card" pad={false}>
          <div className="map-wrap">
            {visible.length ? (
              <WarehouseMap
                warehouses={visible} zones={db.zones} loads={loads} stock={stock} lk={lk}
                selectedId={sel} onSelect={selectZone}
                selectedWhId={activeWh?.id} onSelectWh={setWhSel}
                editable={edit} onCommit={z => store.upsert('zones', z)} onCreate={setCreating} zoom={zoom}
              />
            ) : <Empty icon="map" title="Chưa có kho" />}
          </div>
          <div className="map-foot">
            <YardLegend />
            <div className="zoom">
              <Button size="sm" onClick={() => setZoom(z => Math.max(1, z - 0.5))} disabled={zoom <= 1}>−</Button>
              <span>{Math.round(zoom * 100)}%</span>
              <Button size="sm" onClick={() => setZoom(z => Math.min(3, z + 0.5))} disabled={zoom >= 3}>+</Button>
            </div>
          </div>
          {owners.length > 0 && (
            <div className="cust-legend">
              <span className="muted small">Khu theo khách hàng:</span>
              {owners.map(id => (
                <span key={id}><i style={{ background: custColor(lk, id) }} />{lk.cust[id].code} · {lk.cust[id].name}</span>
              ))}
            </div>
          )}
        </Card>
        <div className="side-panel">
          {zone && edit && <ZoneEditor key={zone.id} zone={zone} db={db} store={store} lk={lk} onDeleted={() => setSel(null)} />}
          {zone && !edit && <ZoneInspector zone={zone} stock={stock} loads={loads} lk={lk} nav={nav} />}
          {!zone && activeWh && <WarehouseInspector wh={activeWh} db={db} loads={loads} lk={lk} onPickZone={selectZone} />}
          {!zone && !activeWh && (
            <Card title="Chi tiết">
              <Empty icon="map" title="Chọn một kho hoặc khu xếp hàng" />
            </Card>
          )}
        </div>
      </div>
      {creating && (
        <CreateZoneModal
          rect={creating} db={db} store={store} lk={lk}
          onClose={() => setCreating(null)}
          onCreated={id => { setCreating(null); setSel(id); }}
        />
      )}
    </div>
  );
}

function nextZoneCode(db, wh) {
  const prefix = wh.code.slice(-1);
  const nums = db.zones.filter(z => z.warehouseId === wh.id).map(z => +((z.code.match(/(\d+)$/) || [0, 0])[1]));
  return `${prefix}-${pad(Math.max(0, ...nums) + 1)}`;
}

function CreateZoneModal({ rect, db, store, lk, onClose, onCreated }) {
  const wh = lk.wh[rect.warehouseId];
  const area = rect.w * rect.h;
  const [f, setF] = useState(() => ({ code: nextZoneCode(db, wh), customerId: '', cargoId: '', name: '', capacity: r1(area * (wh.loadRate || 0)) }));
  const [err, setErr] = useState({});
  const set = patch => setF(x => ({ ...x, ...patch }));

  const save = () => {
    const code = f.code.trim().toUpperCase();
    const e = {};
    if (!code) e.code = 'Bắt buộc';
    else if (db.zones.some(z => z.warehouseId === wh.id && z.code.toUpperCase() === code)) e.code = 'Mã đã có trong kho này';
    setErr(e);
    if (Object.keys(e).length) return;
    const z = store.upsert('zones', { ...rect, ...f, code, name: f.name.trim(), capacity: Math.max(0, +f.capacity || 0), note: '' });
    toast(`Đã tạo khu ${wh.code} · ${code}${f.customerId ? ' cho ' + lk.cust[f.customerId].name : ''}`);
    onCreated(z.id);
  };

  return (
    <Modal title="Tạo khu xếp hàng" onClose={onClose} width={560} footer={
      <React.Fragment><Button onClick={onClose}>Hủy</Button><Button variant="primary" icon="check" onClick={save}>Tạo khu</Button></React.Fragment>
    }>
      <div className="zone-preview">
        <strong>Kho {wh.code} · {zoneBays(rect, wh)}</strong>
        <span>{fmtM(rect.w)} × {fmtM(rect.h)} m = {fmtM(area)} m² · vị trí ({fmtM(rect.x)}, {fmtM(rect.y)}) m</span>
      </div>
      <div className="form-grid">
        <Field label="Khách hàng sử dụng khu" span={2} hint="Để trống nếu là khu dùng chung cho nhiều khách hàng">
          <Select value={f.customerId} onChange={v => set({ customerId: v })} options={customerOptions(db)} placeholder="— Khu dùng chung —" autoFocus />
        </Field>
        <Field label="Mã khu" required error={err.code}>
          <input value={f.code} onChange={e => set({ code: e.target.value })} />
        </Field>
        <Field label="Hàng hóa dự kiến">
          <Select value={f.cargoId} onChange={v => set({ cargoId: v })} options={cargoOptions(db)} placeholder="— Chưa xác định —" />
        </Field>
        <Field label="Sức chứa (tấn)" hint={`Định mức ${fmtM(wh.loadRate)} t/m² × ${fmtM(area)} m²`}>
          <input type="number" min="0" step="10" value={f.capacity} onChange={e => set({ capacity: e.target.value })} />
        </Field>
        <Field label="Tên / mô tả">
          <input value={f.name} onChange={e => set({ name: e.target.value })} placeholder="VD: Hàng tàu ABC, HĐ 12/2026" />
        </Field>
      </div>
    </Modal>
  );
}

function WarehouseInspector({ wh, db, loads, lk, onPickZone }) {
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
            <span>
              <i className="dot" style={{ background: z.customerId ? custColor(lk, z.customerId) : 'transparent' }} />
              <strong>{z.code}</strong> <span className="muted small">{z.customerId ? lk.cust[z.customerId]?.code : 'Dùng chung'} · {zoneBays(z, wh)}</span>
            </span>
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
      <div className="zone-owner-box" style={zone.customerId ? { borderLeftColor: custColor(lk, zone.customerId) } : null}>
        <span className="muted small">{zone.customerId ? 'Khu dành cho khách hàng' : 'Khu dùng chung'}</span>
        {zone.customerId && <strong>{lk.cust[zone.customerId]?.name}</strong>}
        {(zone.cargoId || zone.name) && <span className="small">{[zone.cargoId && lk.cargo[zone.cargoId]?.name, zone.name].filter(Boolean).join(' · ')}</span>}
      </div>
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
        <Button icon="in" variant="primary" onClick={() => nav('in', { zoneId: zone.id, ...(zone.customerId ? { customerId: zone.customerId } : {}) })}>Nhập vào khu này</Button>
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
        <Field label="Khách hàng sử dụng khu" span={2} hint="Để trống = khu dùng chung">
          <Select value={zone.customerId || ''} onChange={v => set({ customerId: v })} options={customerOptions(db)} placeholder="— Khu dùng chung —" />
        </Field>
        <Field label="Hàng hóa dự kiến">
          <Select value={zone.cargoId || ''} onChange={v => set({ cargoId: v })} options={cargoOptions(db)} placeholder="— Chưa xác định —" />
        </Field>
        <Field label="Tên / mô tả">
          <input value={zone.name || ''} onChange={e => set({ name: e.target.value })} placeholder="VD: Hàng tàu ABC" />
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
