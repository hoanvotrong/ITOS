/* OCC — Cảng Hưng Thái (bãi ICD)
   Bản đồ điều hành cho BOD: tàu tại cầu, mật độ bãi, xe chờ ở cổng, thiết bị.

   NGUỒN DỮ LIỆU — màn hình này KHÔNG có số liệu mô phỏng. Chỉ hai nguồn:
   • Sơ đồ bãi (vị trí, số hàng, số ô từng block, sức chứa, kho, đường, cầu
     bến): vẽ lại từ bản vẽ "MB BÃI ICD 25.09.2026 - PA2". Số ô × 2 = TEU,
     khớp bảng sức chứa của bản vẽ (Bãi 1 1.080 · Bãi 2 1.060 · Bãi 3 3.578 ·
     Bãi 4 5.746 · Depot 922). Đây là số liệu THIẾT KẾ, không phải tồn thực tế.
   • Trạng thái thiết bị (cẩu bờ, xe nâng, đầu kéo, cổng, cân): DỮ LIỆU THẬT
     từ OCC_EQUIPMENT (Google Sheet kỹ thuật, data.jsx tự sinh mỗi 8 tiếng).

   CHƯA CÓ NGUỒN nên KHÔNG hiển thị: tồn bãi thực tế theo block, tàu tại cầu,
   hàng xe ở cổng, mật độ kho, và VỊ TRÍ từng thiết bị trên sơ đồ. Khi có
   nguồn thật thì bổ sung, tuyệt đối không điền số minh hoạ vào chỗ trống.

   File này KHÔNG phụ thuộc thứ tự nạp ngoài việc phải đứng sau data.jsx và
   trước screens-operations.jsx. Mọi tên toàn cục đều có tiền tố HT_/ht để
   không đụng tên với các file .jsx khác (classic script dùng chung scope). */

/* ===== 1. Sơ đồ bãi (từ bản vẽ, hệ toạ độ SVG 1300 × 920) ===== */
const HT_YARDS = {
  A: { name: "Bãi 1",     zone: "Khu A", cap: 1080 },
  B: { name: "Bãi 2",     zone: "Khu B", cap: 1060 },
  C: { name: "Bãi 3",     zone: "Khu C", cap: 3578 },
  D: { name: "Bãi 4",     zone: "Khu D", cap: 5746 },
  E: { name: "Bãi depot", zone: "Khu E", cap: 922  },
};
const HT_WAREHOUSES = [
  { id: "K1", name: "Kho số 1", area: "17.225 m²" },
  { id: "K2", name: "Kho số 2", area: "10.140 m²" },
];
const HT_YARD_TOTAL = 12386;

const HT_BLOCKS = (() => {
  const out = [];
  const add = (id, yard, x, y, w, h, rows, boxes, rot) => out.push({ id, yard, x, y, w, h, rows, boxes, cap: boxes * 2, rot });
  // Khu D — dãy phải D1..D15 (rộng dần), dãy trái D16..D24, đầu dãy D25..D29
  [[20,77],[21,81],[22,85],[22,85],[22,85],[22,85],[23,89],[24,93],[25,97],[26,101],[26,101],[27,105],[28,109],[29,113],[30,117]]
    .forEach((r, i) => { const yb = 535 - i * 16.3; add("D" + (i + 1), "D", 912, yb - 14.5, 67 + 26 * i / 14, 14.5, r[0], r[1]); });
  const dLx = [766, 751, 772, 760, 769, 778, 791, 800, 809];
  [[39,153],[44,173],[37,145],[41,161],[38,149],[35,137],[31,121],[28,109],[25,97]]
    .forEach((r, i) => { const yb = 535 - i * 16.25; add("D" + (16 + i), "D", dLx[i], yb - 14.5, 886 - dLx[i], 14.5, r[0], r[1]); });
  const dSx = [852, 852, 843, 852, 862];
  [[11,41],[11,41],[14,53],[11,41],[8,29]]
    .forEach((r, i) => { const yb = 388 - i * 16.2; add("D" + (25 + i), "D", dSx[i], yb - 14.5, 886 - dSx[i], 14.5, r[0], r[1]); });
  // Khu C — dãy phải C11..C21, dãy trái C1..C7, đầu dãy C8..C10
  for (let i = 0; i < 11; i++) { const yb = 760 - i * 16.2; add("C" + (11 + i), "C", 713, yb - 14.5, 82, 14.5, 25, 97); }
  const cLx = [642.5, 642.5, 614, 614, 614, 614, 614];
  [[17,65],[17,65],[26,101],[26,101],[26,101],[21,81],[26,101]]
    .forEach((r, i) => { const yb = 760 - i * 16.1; add("C" + (i + 1), "C", cLx[i], yb - 14.5, (i === 5 ? 679 : 695) - cLx[i], 14.5, r[0], r[1]); });
  add("C8", "C", 655, 631, 40, 14.5, 13, 49);
  add("C9", "C", 664, 615, 31, 14.5, 10, 37);
  add("C10", "C", 675, 598.5, 20, 14.5, 6, 21);
  // Khu B — B1..B9 theo bản vẽ; block cuối chưa có tên trên bản vẽ → tạm đặt B10 (21 ô cho khớp 1.060 TEU)
  const bTop = [689, 692, 698, 704, 704, 713, 716, 723, 729, 735];
  [[21,81],[20,77],[18,69],[16,61],[16,61],[13,49],[12,45],[10,37],[8,29],[6,21]]
    .forEach((r, i) => add("B" + (i + 1), "B", 539 - i * 16.2, bTop[i], 15, 754 - bTop[i], r[0], r[1]));
  // Khu A — hai dãy 6 block
  for (let i = 0; i < 6; i++) {
    add("A" + (7 + i), "A", 315 - i * 16.3, 763, 15, 36, 12, 45);
    add("A" + (1 + i), "A", 315 - i * 16.3, 818, 15, 37, 12, 45);
  }
  // Khu E — depot, các block xoay 31°
  for (let i = 0; i < 9; i++) {
    const cx = 933.6 + i * 8.04, cy = 222.9 - i * 13.4, w = i === 8 ? 32 : 43;
    add("E" + (i + 1), "E", cx - w / 2, cy - 6, w, 12, i === 8 ? 10 : 14, i === 8 ? 37 : 53, { cx, cy, a: 31 });
  }
  return out;
})();

// Hai tuyến cầu bến: cầu chính TD-TG-02 và bến sà lan phía nam
const htLine = (a, b) => ({ A: a, ang: Math.atan2(b.y - a.y, b.x - a.x), L: Math.hypot(b.x - a.x, b.y - a.y) });
const HT_QUAY_MAIN  = htLine({ x: 607, y: 622 }, { x: 905, y: 228 });
const HT_QUAY_BARGE = htLine({ x: 307, y: 721 }, { x: 604, y: 621 });
const htOnQuay = (q, t, off) => {
  const ux = Math.cos(q.ang), uy = Math.sin(q.ang);
  return { x: q.A.x + ux * t * q.L + uy * off, y: q.A.y + uy * t * q.L - ux * off };
};

const HT_BERTHS = [
  { id: "Cầu 1", q: HT_QUAY_MAIN,  t: 0.21, len: 96 },
  { id: "Cầu 2", q: HT_QUAY_MAIN,  t: 0.44, len: 88 },
  { id: "Cầu 3", q: HT_QUAY_MAIN,  t: 0.66, len: 100 },
  { id: "Cầu 4", q: HT_QUAY_MAIN,  t: 0.88, len: 80 },
  { id: "SL 1",  q: HT_QUAY_BARGE, t: 0.20, len: 52, barge: true },
  { id: "SL 2",  q: HT_QUAY_BARGE, t: 0.50, len: 52, barge: true },
  { id: "SL 3",  q: HT_QUAY_BARGE, t: 0.80, len: 52, barge: true },
];

/* Trước đây có HT_CRANE_SLOTS / HT_FORKLIFT_SPOTS / HT_ROUTES để vẽ cẩu, xe nâng
   và đầu kéo chạy trên sơ đồ. Toạ độ đó là GÁN TẠM — hệ thống không biết thiết bị
   nào đang đứng ở đâu — nên đã bỏ. Muốn vẽ lại thì cần nguồn vị trí thật. */

/* ===== 2. Thiết bị — DỮ LIỆU THẬT từ OCC_EQUIPMENT ===== */
const htFmtSince = (s) => (s && /^\d{4}\/\d{2}\/\d{2}$/.test(s) ? `${s.slice(8, 10)}/${s.slice(5, 7)}/${s.slice(0, 4)}` : "");

function htEquipment() {
  const eq = typeof OCC_EQUIPMENT !== "undefined" ? OCC_EQUIPMENT : [];
  const cranes = eq.filter(e => /^HT-/i.test(e.id) && (e.category || "").startsWith("5."));
  const forklifts = eq.filter(e => (e.category || "").startsWith("9."));
  const trucks = eq.filter(e => (e.category || "").startsWith("7."));
  const gates = eq.filter(e => /^Gate/i.test(e.id));
  const scales = eq.filter(e => (e.category || "").startsWith("14."));
  return { cranes, forklifts, trucks, gates, scales };
}

/* ===== 3. Giao diện ===== */
const htFmt = (n) => Math.round(n).toLocaleString("vi-VN");
const htDeg = (rad) => rad * 180 / Math.PI;

/* Hai nguồn duy nhất của màn hình. Không còn nhãn "Mô phỏng" — thứ gì chưa có
   nguồn thì không hiển thị chứ không điền số minh hoạ. */
function HTSrc({ plan }) {
  return plan
    ? <span className="badge neutral" title="Số liệu thiết kế theo bản vẽ MB bãi ICD 25/09/2026"><span className="pip"></span>Theo bản vẽ</span>
    : <span className="badge success" title="Lấy từ danh mục thiết bị kỹ thuật, cập nhật mỗi 8 tiếng"><span className="pip"></span>Dữ liệu thật</span>;
}

function HTPortMap({ tilt, onPick, picked }) {
  // Block tô một màu: hệ thống chưa biết block nào đang chứa bao nhiêu container.
  const blockFace = (b) => ({
    fill: "var(--ht-d0)",
    stroke: picked === b.id ? "var(--ht-fg)" : "none",
    strokeWidth: picked === b.id ? 1.4 : 0,
  });

  const ql = (q, w) => (
    <g transform={`translate(${q.A.x} ${q.A.y}) rotate(${htDeg(q.ang)})`}>
      <rect x={-4} y={-3} width={q.L + 8} height={w} fill="var(--ht-quay)" />
      <line x1={-4} y1={-3} x2={q.L + 4} y2={-3} stroke="var(--ht-accent)" strokeWidth={1.2} opacity={0.55} />
    </g>
  );

  const building = (x, y, w, h, label, sub) => (
    <g>
      <rect x={x + 2} y={y + 3} width={w} height={h} rx={5} fill="var(--ht-shade)" opacity={0.6} />
      <rect x={x} y={y} width={w} height={h} rx={5} fill="var(--ht-bld)" stroke="var(--ht-bld-line)" />
      {Array.from({ length: 9 }, (_, i) => <line key={i} x1={x + (i + 1) * w / 10} y1={y + 4} x2={x + (i + 1) * w / 10} y2={y + h - 4} stroke="var(--ht-bld-rib)" strokeWidth={0.8} />)}
      <text x={x + w / 2} y={y + h / 2 + 2} className="ht-zlabel" textAnchor="middle">{label}</text>
      {sub && <text x={x + w / 2} y={y + h / 2 + 14} className="ht-mlabel" textAnchor="middle">{sub}</text>}
    </g>
  );

  return (
    <svg className={`ht-map ${tilt ? "tilt" : ""}`} viewBox="185 60 890 840" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Sơ đồ bãi container cảng Hưng Thái">
      <defs>
        <pattern id="htHatch" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <rect width="6" height="6" fill="var(--ht-lane)" /><line x1="0" y1="0" x2="0" y2="6" stroke="var(--ht-lane-2)" strokeWidth="2" />
        </pattern>
      </defs>
      {/* Mặt nước, đất, đường */}
      <rect x={-300} y={-300} width={1800} height={1500} fill="var(--ht-water)" />
      {Array.from({ length: 14 }, (_, i) => <path key={i} d={`M150,${120 + i * 48} q 120 -20 240 0 t 240 0`} stroke="var(--ht-water-line)" strokeWidth={0.7} fill="none" opacity={0.6} />)}
      <polygon points="200,758 307,721 604,621 607,622 905,228 1003,92 1012,98 1010,560 1000,890 200,890" fill="var(--ht-land)" stroke="var(--ht-land-edge)" />
      <polygon points="200,890 1014,890 1014,1200 200,1200" fill="var(--ht-land)" />
      <rect x={1060} y={-300} width={440} height={1500} fill="var(--ht-land)" />
      <rect x={1014} y={-300} width={46} height={1500} fill="var(--ht-road)" />
      <line x1={1037} y1={-300} x2={1037} y2={1200} stroke="var(--ht-dim)" strokeDasharray="8 8" strokeWidth={0.8} />
      <text x={1052} y={720} className="ht-zlabel" transform="rotate(-90 1052 720)" style={{ fontSize: 11 }}>TỈNH LỘ 965</text>
      <polygon points="201,720 298,687 308,721 209,748" fill="url(#htHatch)" opacity={0.5} />
      <text x={228} y={725} className="ht-mlabel" transform="rotate(-18 228 725)">Đất Công an tỉnh</text>
      <g fill="var(--ht-road)">
        <rect x={740} y={546} width={272} height={28} /><rect x={205} y={864} width={800} height={22} />
        <rect x={338} y={755} width={18} height={120} /><rect x={600} y={762} width={400} height={14} />
        <rect x={982} y={540} width={22} height={340} />
      </g>
      <text x={780} y={565} className="ht-mlabel">Đường C2</text>
      <text x={430} y={880} className="ht-mlabel">Đường C1</text>
      {[[887,292,24,246],[695,583,18,180],[225,757,100,104]].map((r, i) => <rect key={i} x={r[0]} y={r[1]} width={r[2]} height={r[3]} fill="url(#htHatch)" opacity={0.75} />)}
      <polygon points="915,250 960,175 1000,105 1008,112 975,230 940,295" fill="url(#htHatch)" opacity={0.55} />
      {ql(HT_QUAY_MAIN, 14)}{ql(HT_QUAY_BARGE, 12)}
      {building(357, 778, 208, 84, "KHO SỐ 2", "10.140 m²")}
      {building(595, 782, 335, 84, "KHO SỐ 1", "17.225 m²")}
      <rect x={946} y={780} width={34} height={74} rx={2} fill="var(--ht-bld)" stroke="var(--ht-bld-line)" />
      <text x={963} y={822} className="ht-mlabel" textAnchor="middle" transform="rotate(-90 963 822)">Văn phòng</text>
      <text x={1000} y={300} className="ht-mlabel" textAnchor="middle" transform="rotate(-80 1000 300)">Khu sửa/rửa cont</text>
      {[["KHU D · BÃI 4", 820, 288], ["KHU C · BÃI 3", 615, 578], ["KHU B · BÃI 2", 415, 684], ["KHU A · BÃI 1", 232, 757], ["KHU E · DEPOT", 880, 140]]
        .map(z => <text key={z[0]} x={z[1]} y={z[2]} className="ht-zlabel">{z[0]}</text>)}

      {/* Block bãi */}
      <g>
        {HT_BLOCKS.map(b => {
          let x = b.x, y = b.y, tf;
          if (b.rot) { tf = `translate(${b.rot.cx} ${b.rot.cy}) rotate(${b.rot.a})`; x = -b.w / 2; y = -b.h / 2; }
          const vertical = b.h > b.w * 1.4;
          const f = blockFace(b);
          return (
            <g key={b.id} className="ht-blk" tabIndex={0} onClick={() => onPick({ kind: "blk", id: b.id })}
               onKeyDown={e => { if (e.key === "Enter") onPick({ kind: "blk", id: b.id }); }}>
              <g transform={tf}>
                <rect x={x + 1.3} y={y + 2} width={b.w} height={b.h} fill="var(--ht-shade)" opacity={0.75} />
                <rect x={x} y={y} width={b.w} height={b.h} rx={0.8} fill={f.fill} stroke={f.stroke} strokeWidth={f.strokeWidth} />
                <text className="ht-blabel" textAnchor="middle" x={x + b.w / 2} y={y + b.h / 2 + 2.3}
                      transform={vertical ? `rotate(-90 ${x + b.w / 2} ${y + b.h / 2})` : undefined}>{b.id}</text>
              </g>
            </g>
          );
        })}
      </g>

      {/* Cầu bến theo bản vẽ. Hệ thống chưa có nguồn tàu nào đang cập cầu Hưng Thái,
          nên chỉ vẽ vị trí cầu, không vẽ tàu. */}
      <g>
        {HT_BERTHS.map(bt => {
          const beam = bt.barge ? 13 : 20;
          const c = htOnQuay(bt.q, bt.t, bt.barge ? 13 : 19);
          const m = htOnQuay(bt.q, bt.t, -9);
          const deg = htDeg(bt.q.ang);
          return (
            <g key={bt.id}>
              <text x={m.x} y={m.y} className="ht-mlabel" textAnchor="middle" transform={`rotate(${deg} ${m.x} ${m.y})`}>{bt.id}</text>
              <g transform={`translate(${c.x} ${c.y}) rotate(${deg})`}>
                <rect x={-bt.len / 2} y={-beam / 2} width={bt.len} height={beam} rx={3} fill="none" stroke="var(--ht-dim)" strokeDasharray="3 3" />
              </g>
            </g>
          );
        })}
      </g>

      {/* Cổng theo bản vẽ. Số xe đang chờ chưa có nguồn nên không vẽ hàng xe. */}
      <g>
        {[0, 1, 2, 3].map(i => <g key={i}>
          <line x1={925} y1={549 + i * 7} x2={985} y2={549 + i * 7} stroke="var(--ht-dim)" strokeWidth={0.5} strokeDasharray="3 2" />
        </g>)}
        <text x={955} y={543} className="ht-mlabel" textAnchor="middle">Cổng Đường C2</text>
        <text x={990} y={900} className="ht-mlabel" textAnchor="end">Cổng Đường C1</text>
      </g>

      {/* Không vẽ cẩu / xe nâng / đầu kéo lên sơ đồ: trạng thái thì có thật nhưng
          VỊ TRÍ thì không có nguồn. Trạng thái xem ở bảng "Thiết bị" bên dưới. */}
    </svg>
  );
}

function HTPickCard({ pick, onClose }) {
  if (!pick) return null;
  const b = HT_BLOCKS.find(x => x.id === pick);
  if (!b) return null;
  const y = HT_YARDS[b.yard];
  const body = <>
    <h3>Block {b.id}</h3><div className="sub">{y.name} · {y.zone} <HTSrc plan /></div>
    <dl>
      <dt>Sức chứa</dt><dd>{htFmt(b.cap)} TEU</dd>
      <dt>Quy mô</dt><dd>{b.rows} hàng · {b.boxes} ô</dd>
      <dt>Đang chứa</dt><dd className="muted">Chưa có nguồn</dd>
    </dl>
  </>;
  return (
    <div className="ht-pick card">
      <button className="ht-pick-x" type="button" aria-label="Đóng" onClick={onClose}><Icon name="x" size={14} /></button>
      {body}
    </div>
  );
}

function HTPortView({ onClose }) {
  const equip = React.useMemo(htEquipment, []);
  const [tilt, setTilt] = React.useState(true);
  const [pick, setPick] = React.useState(null);
  const stageRef = React.useRef(null);

  const toggleFull = () => {
    const el = stageRef.current; if (!el) return;
    try {
      const p = document.fullscreenElement ? document.exitFullscreen() : el.requestFullscreen();
      if (p && p.catch) p.catch(() => {});
    } catch (e) { /* trình duyệt không hỗ trợ — bỏ qua */ }
  };

  const on = (arr) => arr.filter(e => e.status === "ONLINE").length;
  const offOf = (arr) => arr.filter(e => e.status === "OFFLINE");

  // Cảnh báo: chỉ thiết bị đang ngừng — dữ liệu thật, không suy đoán thêm
  const alerts = [...equip.cranes, ...equip.forklifts, ...equip.trucks, ...equip.gates, ...equip.scales]
    .filter(e => e.status === "OFFLINE")
    .map(e => ({ text: <><b>{e.name}</b> ({e.id}) đang ngừng{htFmtSince(e.offlineSince) ? ` từ ${htFmtSince(e.offlineSince)}` : ""}</> }));

  const equipRows = [
    { label: "Cẩu bờ Hưng Thái", items: equip.cranes },
    { label: "Xe nâng", items: equip.forklifts },
    { label: "Xe đầu kéo", items: equip.trucks },
    { label: "Cổng cảng", items: equip.gates },
    { label: "Cầu cân", items: equip.scales },
  ];

  return (
    <div className="page ht-page" style={{ maxWidth: "none" }}>
      <div className="page-head">
        <div>
          <h1>{onClose ? "Live monitor · Cảng Hưng Thái" : "Cảng Hưng Thái"}</h1>
          <div className="sub">Sơ đồ bãi ICD theo bản vẽ MB bãi 25/09/2026 · tàu tại cầu, mật độ bãi, cổng và thiết bị.</div>
        </div>
        <div className="actions">
          <button className="btn btn-sm" type="button" onClick={() => setTilt(t => !t)} aria-pressed={tilt}>
            <Icon name="layers" size={14} /> {tilt ? "Mặt bằng" : "Phối cảnh"}
          </button>
          <button className="btn btn-sm" type="button" onClick={toggleFull}>
            <Icon name="grid" size={14} /> Toàn màn hình
          </button>
          {onClose && (
            <button className="btn btn-sm primary" type="button" onClick={onClose}>
              <Icon name="x" size={14} /> Đóng
            </button>
          )}
        </div>
      </div>

      <div className="ht-notice">
        <Icon name="alert" size={14} />
        <span>Màn hình chỉ hiển thị <b>trạng thái thiết bị</b> (dữ liệu thật, làm mới mỗi 8 tiếng) và <b>sức chứa thiết kế theo bản vẽ</b>. Tồn bãi thực tế, tàu tại cầu và hàng xe ở cổng <b>chưa có nguồn dữ liệu</b> nên không hiển thị.</span>
      </div>

      <div className="kpi-grid kpi-grid-5">
        <div className="kpi">
          <div className="lbl"><span className="swatch" style={{ background: "#7C5BE0" }} /> Cẩu bờ Hưng Thái</div>
          <div className="val">{on(equip.cranes)}<small>/ {equip.cranes.length}</small></div>
          <div className={`delta ${offOf(equip.cranes).length ? "down" : "up"}`}>
            {offOf(equip.cranes).length ? `${offOf(equip.cranes).map(e => e.id).join(", ")} đang ngừng` : "Tất cả sẵn sàng"} · <HTSrc />
          </div>
        </div>
        <div className="kpi">
          <div className="lbl"><span className="swatch" style={{ background: "var(--brand-ink)" }} /> Xe nâng</div>
          <div className="val">{on(equip.forklifts)}<small>/ {equip.forklifts.length}</small></div>
          <div className={`delta ${offOf(equip.forklifts).length ? "down" : "up"}`}>
            {offOf(equip.forklifts).length ? `${offOf(equip.forklifts).length} xe đang ngừng` : "Tất cả sẵn sàng"} · <HTSrc />
          </div>
        </div>
        <div className="kpi">
          <div className="lbl"><span className="swatch" style={{ background: "var(--brand-accent)" }} /> Xe đầu kéo</div>
          <div className="val">{on(equip.trucks)}<small>/ {equip.trucks.length}</small></div>
          <div className={`delta ${offOf(equip.trucks).length ? "down" : "up"}`}>
            {offOf(equip.trucks).length ? `${offOf(equip.trucks).length} xe đang ngừng` : "Tất cả sẵn sàng"} · <HTSrc />
          </div>
        </div>
        <div className="kpi">
          <div className="lbl"><span className="swatch" style={{ background: "var(--st-success)" }} /> Cổng & cầu cân</div>
          <div className="val">{on(equip.gates) + on(equip.scales)}<small>/ {equip.gates.length + equip.scales.length}</small></div>
          <div className="delta">{equip.gates.length} cổng · {equip.scales.length} cân · <HTSrc /></div>
        </div>
        <div className="kpi">
          <div className="lbl"><span className="swatch" style={{ background: "var(--st-info)" }} /> Sức chứa bãi</div>
          <div className="val">{htFmt(HT_YARD_TOTAL)}<small>TEU</small></div>
          <div className="delta">{HT_BLOCKS.length} block · 5 bãi · <HTSrc plan /></div>
        </div>
      </div>

      <div className="ht-grid">
        <div className="card ht-mapcard" ref={stageRef}>
          <div className="ht-maptools">
            <span className="ht-hint">Mặt bằng theo bản vẽ MB bãi ICD 25/09/2026 — chạm vào block để xem sức chứa</span>
          </div>
          <div className="ht-stage">
            <HTPortMap tilt={tilt} onPick={p => setPick(p.id)} picked={pick} />
          </div>
          <HTPickCard pick={pick} onClose={() => setPick(null)} />
        </div>

        <div className="ht-side">
          <div className="card">
            <div className="card-head"><h3>Cầu bến</h3><HTSrc plan /></div>
            <div className="ht-list">
              {HT_BERTHS.map(b => (
                <div key={b.id} className="ht-berth">
                  <span className="code">{b.id}</span>
                  <span className="nm muted">{b.barge ? "Bến sà lan" : "Cầu chính"}</span>
                  <span className="badge neutral">Chưa có nguồn</span>
                </div>
              ))}
            </div>
            <div className="ht-empty">Hệ thống chưa quản lý tàu cập cầu Hưng Thái. Khi có nguồn sẽ hiện tàu, tiến độ làm hàng và ETD tại đây.</div>
          </div>

          <div className="card">
            <div className="card-head"><h3>Sức chứa theo bãi</h3><HTSrc plan /></div>
            <div className="ht-list">
              {Object.keys(HT_YARDS).map(k => {
                const y = HT_YARDS[k];
                const blocks = HT_BLOCKS.filter(b => b.yard === k);
                return (
                  <div key={k} className="ht-yard">
                    <div><b>{y.name}</b><small>{y.zone} · {blocks.length} block</small></div>
                    <span className="mono">{htFmt(y.cap)} TEU</span>
                  </div>
                );
              })}
              {HT_WAREHOUSES.map(w => (
                <div key={w.id} className="ht-yard">
                  <div><b>{w.name}</b><small>Kho hàng</small></div>
                  <span className="mono">{w.area}</span>
                </div>
              ))}
            </div>
            <div className="ht-empty">Số liệu thiết kế theo bản vẽ. Tồn thực tế từng bãi chưa có nguồn.</div>
          </div>
        </div>
      </div>

      <div className="ht-grid-2">
        <div className="card">
          <div className="card-head"><h3>Thiết bị</h3><HTSrc /></div>
          <div className="ht-table-wrap">
            <table className="ht-table">
              <thead><tr><th>Nhóm</th><th>Sẵn sàng</th><th>Ngừng</th><th>Chưa khai báo</th><th>Đang ngừng</th></tr></thead>
              <tbody>
                {equipRows.map(r => {
                  const off = r.items.filter(e => e.status === "OFFLINE");
                  const na = r.items.filter(e => e.status !== "ONLINE" && e.status !== "OFFLINE");
                  return (
                    <tr key={r.label}>
                      <td>{r.label}</td>
                      <td className="mono">{on(r.items)}</td>
                      <td className={`mono ${off.length ? "crit" : "muted"}`}>{off.length}</td>
                      <td className="mono muted">{na.length}</td>
                      <td className="ht-offlist">{off.length ? off.map(e => e.name + (e.detail && e.detail !== e.name ? ` (${e.detail})` : "")).join(", ") : <span className="muted">—</span>}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card">
          <div className="card-head"><h3>Thiết bị đang ngừng</h3><HTSrc /></div>
          {alerts.length ? (
            <ul className="ht-alerts">
              {alerts.map((a, i) => <li key={i} className="sev3"><span>{a.text}</span></li>)}
            </ul>
          ) : (
            <div className="ht-empty">Không có thiết bị nào đang ngừng.</div>
          )}
        </div>
      </div>
    </div>
  );
}

/* Live monitor — mở từ nút "Live monitor" trên màn hình Timeline (screens-operations.jsx).
   Lớp phủ toàn trang, đóng bằng nút Đóng hoặc phím Esc; khoá cuộn trang nền khi đang mở. */
function HTLiveMonitor({ onClose }) {
  React.useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape" && !document.fullscreenElement) onClose(); };
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => { window.removeEventListener("keydown", onKey); document.body.style.overflow = prev; };
  }, [onClose]);
  return (
    <div className="ht-live" role="dialog" aria-modal="true" aria-label="Live monitor cảng Hưng Thái">
      <HTPortView onClose={onClose} />
    </div>
  );
}

Object.assign(window, { HTPortView, HTLiveMonitor });
