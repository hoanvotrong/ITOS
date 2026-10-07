/* OCC — Cảng Hưng Thái (bãi ICD)
   Bản đồ điều hành cho BOD: tàu tại cầu, mật độ bãi, xe chờ ở cổng, thiết bị.

   NGUỒN DỮ LIỆU — đọc kỹ trước khi sửa:
   • Sơ đồ bãi (vị trí, số hàng, số ô từng block): vẽ lại từ bản vẽ
     "MB BÃI ICD 25.09.2026 - PA2". Số ô × 2 = TEU, khớp đúng bảng sức chứa
     của bản vẽ (Bãi 1 1.080 · Bãi 2 1.060 · Bãi 3 3.578 · Bãi 4 5.746 · Depot 922).
   • Trạng thái thiết bị (cẩu bờ, xe nâng, đầu kéo, cổng): DỮ LIỆU THẬT từ
     OCC_EQUIPMENT (Google Sheet kỹ thuật, data.jsx tự sinh mỗi 8 tiếng).
   • Mật độ bãi, tàu tại cầu, hàng xe ở cổng, vị trí thiết bị trên sơ đồ:
     MÔ PHỎNG — ETVNL chưa có nguồn cho các mục này. Toàn bộ phần mô phỏng
     gom trong htCreateSim() bên dưới; khi có nguồn thật, thay hàm đó bằng
     dữ liệu export, giao diện không phải sửa.

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
const htQuayT = (q, p) => ((p.x - q.A.x) * Math.cos(q.ang) + (p.y - q.A.y) * Math.sin(q.ang)) / q.L;

const HT_BERTHS = [
  { id: "Cầu 1", q: HT_QUAY_MAIN,  t: 0.21, len: 96 },
  { id: "Cầu 2", q: HT_QUAY_MAIN,  t: 0.44, len: 88 },
  { id: "Cầu 3", q: HT_QUAY_MAIN,  t: 0.66, len: 100 },
  { id: "Cầu 4", q: HT_QUAY_MAIN,  t: 0.88, len: 80 },
  { id: "SL 1",  q: HT_QUAY_BARGE, t: 0.20, len: 52, barge: true },
  { id: "SL 2",  q: HT_QUAY_BARGE, t: 0.50, len: 52, barge: true },
  { id: "SL 3",  q: HT_QUAY_BARGE, t: 0.80, len: 52, barge: true },
];

// Vị trí cẩu trên bản vẽ (5 cẩu ở cầu chính, 3 cẩu ở bến sà lan). Gán cẩu bờ HT
// theo thứ tự mã vào các vị trí này — LÀ GÁN TẠM, chưa có dữ liệu cẩu nào đứng ở đâu.
const HT_CRANE_SLOTS = [
  { q: HT_QUAY_MAIN,  p: { x: 669.6, y: 533.6 } },
  { q: HT_QUAY_MAIN,  p: { x: 697.5, y: 490.4 } },
  { q: HT_QUAY_MAIN,  p: { x: 741.8, y: 421.8 } },
  { q: HT_QUAY_MAIN,  p: { x: 770.4, y: 378.2 } },
  { q: HT_QUAY_MAIN,  p: { x: 835.0, y: 278.2 } },
  { q: HT_QUAY_BARGE, p: { x: 342.9, y: 703.2 } },
  { q: HT_QUAY_BARGE, p: { x: 451.8, y: 669.3 } },
  { q: HT_QUAY_BARGE, p: { x: 558.9, y: 631.8 } },
].map(s => ({ ...s, t: htQuayT(s.q, s.p) }));

// Vị trí đứng tạm của xe nâng trên sơ đồ (gán theo thứ tự)
const HT_FORKLIFT_SPOTS = [[899,330],[899,452],[899,512],[704,622],[704,708],[480,762],[300,810],[350,812],[958,262],[985,212],[270,808],[960,300],[640,600],[820,600],[600,740]];

// Tuyến chạy của đầu kéo nội bộ
const HT_ROUTES = [
  [[990,560],[899,560],[899,300],[878,262],[652,566],[704,582],[704,768],[990,768],[992,560]],
  [[990,768],[620,770],[380,766],[347,766],[347,874],[990,874],[992,768]],
  [[704,768],[560,768],[330,745],[312,724],[600,628],[650,580],[704,582]],
].map(pts => {
  const lens = [0];
  for (let i = 1; i < pts.length; i++) lens.push(lens[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
  return { pts, lens, total: lens[lens.length - 1] };
});
const htPosOn = (r, s) => {
  s = ((s % r.total) + r.total) % r.total;
  let i = 1; while (r.lens[i] < s) i++;
  const f = (s - r.lens[i - 1]) / (r.lens[i] - r.lens[i - 1]);
  const a = r.pts[i - 1], b = r.pts[i];
  return [a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f];
};

/* ===== 2. Thiết bị — DỮ LIỆU THẬT từ OCC_EQUIPMENT ===== */
const htEquipStatus = (e) =>
  e.status === "ONLINE"  ? { key: "on",  label: "Sẵn sàng", badge: "success" } :
  e.status === "OFFLINE" ? { key: "off", label: "Ngừng",    badge: "danger"  } :
                           { key: "na",  label: "Chưa khai báo", badge: "neutral" };
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

/* ===== 3. MÔ PHỎNG — thay khối này khi có nguồn thật ===== */
function htCreateSim() {
  let seed = 20261006;
  const rnd = () => { seed = (seed * 1664525 + 1013904223) % 4294967296; return seed / 4294967296; };
  const mean = { A: 0.66, B: 0.58, C: 0.74, D: 0.82, E: 0.86 };
  const occ = {};
  HT_BLOCKS.forEach(b => { occ[b.id] = Math.max(0.18, Math.min(0.93, mean[b.yard] + (rnd() - 0.5) * 0.3)); });
  occ.D17 = 0.963; occ.D19 = 0.918; occ.C14 = 0.905; occ.E3 = 0.95;
  const ships = {
    "Cầu 1": { name: "HT GLORY",      voy: "V.2641N", plan: 420, done: 268, rate: 32, etd: "18:30", st: "work" },
    "Cầu 2": { name: "SÔNG ĐÀ 08",    voy: "V.118S",  plan: 260, done: 236, rate: 28, etd: "15:45", st: "work" },
    "Cầu 3": { name: "PACIFIC PEARL", voy: "V.0939W", plan: 510, done: 96,  rate: 14, planRate: 30, etd: "23:00", st: "work" },
    "Cầu 4": { name: "ĐÔNG DƯƠNG 15", voy: "V.207N",  plan: 180, done: 0,   rate: 0,  etd: "21:15", st: "prep", prepT: 0 },
    "SL 1":  { name: "Sà lan HT-01",  voy: "",        plan: 120, done: 64,  rate: 18, etd: "16:20", st: "work" },
    "SL 2":  null,
    "SL 3":  { name: "Sà lan HT-03",  voy: "",        plan: 90,  done: 30,  rate: 16, etd: "17:10", st: "work" },
  };
  const waiting = [{ name: "MINH PHÁT 36", voy: "V.0412S", plan: 240, eta: "16:30" }];
  const now = new Date(), hrs = now.getHours() + now.getMinutes() / 60;
  const gate = { queue: 17, inToday: Math.round(hrs * 31), outToday: Math.round(hrs * 29), inside: 46 };
  const whOcc = { K1: 0.71, K2: 0.54 };

  const step = () => {
    Object.keys(ships).forEach(k => {
      const s = ships[k]; if (!s) return;
      if (s.st === "work" && rnd() < s.rate / 55) s.done++;
      if (s.st === "work" && s.done >= s.plan) { s.st = "done"; s.doneT = 0; }
      if (s.st === "done" && ++s.doneT > 25) {
        if (!k.startsWith("SL") && waiting.length) {
          const w = waiting.shift();
          ships[k] = { name: w.name, voy: w.voy, plan: w.plan, done: 0, rate: 0, etd: "02:30", st: "prep", prepT: 0 };
          waiting.push({ name: "TRƯỜNG HẢI 09", voy: "V.311N", plan: 300, eta: "22:00" });
        } else ships[k] = null;
        return;
      }
      if (s.st === "prep" && ++s.prepT > 20) { s.st = "work"; s.rate = 26 + Math.round(rnd() * 8); }
      if (s.st === "work" && !s.planRate && rnd() < 0.15) s.rate = Math.max(18, Math.min(40, s.rate + Math.round(rnd() * 4 - 2)));
    });
    const h = new Date().getHours();
    const target = h < 6 ? 6 : h < 9 ? 14 : h < 17 ? 17 : h < 21 ? 12 : 8;
    gate.queue = Math.max(0, Math.min(34, gate.queue + Math.round((target - gate.queue) * 0.15 + rnd() * 3 - 1.5)));
    if (rnd() < 0.6) { gate.inToday++; gate.inside++; }
    if (rnd() < 0.55 && gate.inside > 20) { gate.outToday++; gate.inside--; }
    for (let i = 0; i < 3; i++) {
      const b = HT_BLOCKS[Math.floor(rnd() * HT_BLOCKS.length)];
      if (b.id === "D17") continue;
      occ[b.id] = Math.max(0.15, Math.min(0.96, occ[b.id] + (rnd() - 0.5) * 0.04));
    }
  };
  return { occ, ships, waiting, gate, whOcc, step, rnd };
}

/* ===== 4. Giao diện ===== */
const htFmt = (n) => Math.round(n).toLocaleString("vi-VN");
const htOccColor = (p) => p < 0.4 ? "var(--ht-d0)" : p < 0.6 ? "var(--ht-d1)" : p < 0.75 ? "var(--ht-d2)" : p < 0.88 ? "var(--ht-d3)" : "var(--ht-d4)";
const htHull = (len, beam) => { const h = len / 2, bw = beam / 2; return `M${-h},${-bw} L${h - 12},${-bw} Q${h + 2},0 ${h - 12},${bw} L${-h},${bw} Q${-h - 3},0 ${-h},${-bw} Z`; };
const htDeg = (rad) => rad * 180 / Math.PI;

function HTSrc({ real }) {
  return real
    ? <span className="badge success" title="Lấy từ danh mục thiết bị kỹ thuật, cập nhật mỗi 8 tiếng"><span className="pip"></span>Dữ liệu thật</span>
    : <span className="badge warning" title="Chưa có nguồn dữ liệu — số liệu minh hoạ"><span className="pip"></span>Mô phỏng</span>;
}

function HTPortMap({ sim, equip, tilt, layers, onPick, picked }) {
  const truckRefs = React.useRef([]);
  const trucksOn = equip.trucks.filter(t => t.status === "ONLINE");
  const trucksOff = equip.trucks.filter(t => t.status !== "ONLINE");

  // Đầu kéo chạy bằng rAF, cập nhật thẳng thuộc tính transform — không render lại React mỗi khung hình
  React.useEffect(() => {
    const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const st = trucksOn.map((t, i) => ({ r: HT_ROUTES[i % HT_ROUTES.length], s: (i * 137) % 900, v: 14 + (i * 7) % 9 }));
    let raf = 0, last = performance.now();
    const frame = (now) => {
      const dt = Math.min(0.1, (now - last) / 1000); last = now;
      st.forEach((o, i) => {
        if (!reduce) o.s += o.v * dt;
        const el = truckRefs.current[i];
        if (el) { const p = htPosOn(o.r, o.s); el.setAttribute("transform", `translate(${p[0].toFixed(1)} ${p[1].toFixed(1)})`); }
      });
      if (!reduce) raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [trucksOn.length]);

  const blockFace = (b) => {
    const p = sim.occ[b.id], crit = p >= 0.95, warn = p >= 0.9;
    return {
      fill: layers.yard ? htOccColor(p) : "var(--ht-d0)",
      stroke: layers.yard && (crit || warn) ? (crit ? "var(--ht-crit)" : "var(--ht-warn)") : (picked === b.id ? "var(--ht-fg)" : "none"),
      strokeWidth: crit || warn || picked === b.id ? 1.4 : 0,
    };
  };

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
              {layers.yard && sim.occ[b.id] >= 0.95 && (
                <circle className="ht-pulse" cx={b.rot ? b.rot.cx : b.x + b.w / 2} cy={b.rot ? b.rot.cy : b.y + b.h / 2} r={3} />
              )}
            </g>
          );
        })}
      </g>

      {/* Tàu tại cầu */}
      {layers.ships && <g>
        {HT_BERTHS.map(bt => {
          const s = sim.ships[bt.id], beam = bt.barge ? 13 : 20;
          const c = htOnQuay(bt.q, bt.t, bt.barge ? 13 : 19);
          const m = htOnQuay(bt.q, bt.t, -9);
          const tag = htOnQuay(bt.q, bt.t, bt.barge ? 42 : 56);
          const deg = htDeg(bt.q.ang);
          const bays = bt.barge ? 5 : 9, bw = (bt.len - 24) / bays;
          const frac = s && s.plan ? s.done / s.plan : 0, doneBays = Math.floor(frac * bays);
          const tw = bt.barge ? 62 : 80;
          return (
            <g key={bt.id}>
              <text x={m.x} y={m.y} className="ht-mlabel" textAnchor="middle" transform={`rotate(${deg} ${m.x} ${m.y})`}>{bt.id}</text>
              <g className="ht-hit" transform={`translate(${c.x} ${c.y}) rotate(${deg})`} onClick={() => s && onPick({ kind: "ship", id: bt.id })}>
                {!s && <rect x={-bt.len / 2} y={-beam / 2} width={bt.len} height={beam} rx={3} fill="none" stroke="var(--ht-dim)" strokeDasharray="3 3" />}
                {s && <>
                  <path d={htHull(bt.len + 2, beam + 2)} fill="var(--ht-shade)" transform="translate(1.5 2.5)" opacity={0.6} />
                  <path d={htHull(bt.len, beam)} fill="var(--ht-hull)" stroke={s.st === "work" ? "var(--ht-ok)" : s.st === "done" ? "var(--ht-dim)" : "var(--ht-accent)"} strokeWidth={1.2} />
                  {Array.from({ length: bays }, (_, i) => (
                    <rect key={i} x={-bt.len / 2 + 4 + i * bw} y={-beam / 2 + 3} width={bw - 1.4} height={beam - 6} rx={0.6}
                          fill={i < doneBays ? "var(--ht-bay-done)" : "var(--ht-bay)"} opacity={i < doneBays ? 0.35 : 1} />
                  ))}
                  {!bt.barge && <rect x={bt.len / 2 - 20} y={-beam / 2 + 2} width={7} height={beam - 4} fill="var(--ht-bridge)" />}
                </>}
              </g>
              {s && (
                <g className="ht-shiptag" transform={`translate(${tag.x} ${tag.y})`}>
                  <rect x={-tw / 2} y={-11} width={tw} height={21} rx={2} />
                  <text x={-tw / 2 + 4} y={-2}>{s.name}</text>
                  <text x={-tw / 2 + 4} y={7} className="t2">{s.st === "prep" ? "Chuẩn bị làm hàng" : s.st === "done" ? "Hoàn tất" : `${Math.round(frac * 100)}% · ${s.rate} m/h`}</text>
                </g>
              )}
            </g>
          );
        })}
        {sim.waiting[0] && <>
          <g className="ht-hit" transform={`translate(520 360) rotate(${htDeg(HT_QUAY_MAIN.ang)})`} onClick={() => onPick({ kind: "wait" })}>
            <path d={htHull(86, 19)} fill="none" stroke="var(--ht-warn)" strokeDasharray="4 3" strokeWidth={1.1} />
          </g>
          <g className="ht-shiptag" transform="translate(470 318)">
            <rect x={-40} y={-11} width={80} height={21} rx={2} />
            <text x={-36} y={-2}>{sim.waiting[0].name}</text>
            <text x={-36} y={7} className="t2">Chờ cầu · ETA {sim.waiting[0].eta}</text>
          </g>
          <text x={470} y={405} className="ht-mlabel" textAnchor="middle">Vùng neo chờ</text>
        </>}
      </g>}

      {/* Cổng + hàng xe chờ */}
      {layers.gate && <g>
        {[0, 1, 2, 3].map(i => <g key={i}>
          <line x1={925} y1={549 + i * 7} x2={985} y2={549 + i * 7} stroke="var(--ht-dim)" strokeWidth={0.5} strokeDasharray="3 2" />
          <rect x={952} y={550 + i * 7} width={5} height={5} fill="var(--ht-ok)" />
        </g>)}
        <text x={955} y={543} className="ht-mlabel" textAnchor="middle">Cổng Đường C2</text>
        <text x={990} y={900} className="ht-mlabel" textAnchor="end">Cổng Đường C1</text>
        {Array.from({ length: Math.min(sim.gate.queue, 30) }, (_, i) => (
          <rect key={i} x={1022} y={582 + i * 10} width={6} height={8} rx={1} fill={i < 6 ? "var(--ht-warn)" : "var(--ht-hull)"} opacity={i < 6 ? 0.95 : 0.7} />
        ))}
      </g>}

      {/* Thiết bị — trạng thái thật, vị trí gán tạm */}
      {layers.equip && <g>
        {equip.cranes.slice(0, HT_CRANE_SLOTS.length).map((e, i) => {
          const sl = HT_CRANE_SLOTS[i], p = htOnQuay(sl.q, sl.t, -2), stt = htEquipStatus(e);
          const col = stt.key === "on" ? "var(--ht-ok)" : stt.key === "off" ? "var(--ht-crit)" : "var(--ht-dim)";
          return (
            <g key={e.id} className="ht-hit" transform={`translate(${p.x} ${p.y}) rotate(${htDeg(sl.q.ang)})`} onClick={() => onPick({ kind: "eq", id: e.id })}>
              <rect x={-5} y={-3} width={10} height={8} rx={1} fill="var(--ht-quay)" stroke={col} strokeWidth={1.2} />
              <line x1={0} y1={0} x2={-6} y2={-30} stroke={col} strokeWidth={1.6} strokeLinecap="round" />
              {stt.key === "off" && <circle cx={0} cy={0} r={3} className="ht-pulse" />}
            </g>
          );
        })}
        {equip.forklifts.slice(0, HT_FORKLIFT_SPOTS.length).map((e, i) => {
          const [x, y] = HT_FORKLIFT_SPOTS[i], stt = htEquipStatus(e);
          const col = stt.key === "on" ? "var(--ht-ok)" : stt.key === "off" ? "var(--ht-crit)" : "var(--ht-dim)";
          return (
            <g key={e.id} className="ht-hit" transform={`translate(${x} ${y})`} onClick={() => onPick({ kind: "eq", id: e.id })}>
              <rect x={-3.4} y={-3.4} width={6.8} height={6.8} rx={1.2} transform="rotate(45)" fill={col} stroke="var(--ht-water)" strokeWidth={1} />
            </g>
          );
        })}
        {trucksOn.map((e, i) => (
          <g key={e.id} ref={el => (truckRefs.current[i] = el)} className="ht-hit" onClick={() => onPick({ kind: "eq", id: e.id })}>
            <rect x={-2.6} y={-1.7} width={5.2} height={3.4} rx={0.8} fill="var(--ht-hull)" />
          </g>
        ))}
        {trucksOff.map((e, i) => (
          <g key={e.id} className="ht-hit" transform={`translate(${966 + (i % 4) * 7} ${872 + Math.floor(i / 4) * 6})`} onClick={() => onPick({ kind: "eq", id: e.id })}>
            <rect x={-2.6} y={-1.7} width={5.2} height={3.4} rx={0.8} fill="var(--ht-crit)" />
          </g>
        ))}
      </g>}
    </svg>
  );
}

function HTPickCard({ pick, sim, equip, onClose }) {
  if (!pick) return null;
  let body = null;
  if (pick.kind === "blk") {
    const b = HT_BLOCKS.find(x => x.id === pick.id), y = HT_YARDS[b.yard], p = sim.occ[b.id];
    body = <>
      <h3>Block {b.id}</h3><div className="sub">{y.name} · {y.zone} <HTSrc /></div>
      <dl>
        <dt>Lấp đầy</dt><dd className={p >= 0.95 ? "crit" : p >= 0.9 ? "warn" : ""}>{Math.round(p * 100)}%</dd>
        <dt>Đang chứa</dt><dd>{htFmt(b.cap * p)} / {htFmt(b.cap)} TEU</dd>
        <dt>Quy mô (bản vẽ)</dt><dd>{b.rows} hàng · {b.boxes} ô</dd>
      </dl>
    </>;
  } else if (pick.kind === "ship") {
    const s = sim.ships[pick.id]; if (!s) return null;
    body = <>
      <h3>{s.name}</h3><div className="sub">{pick.id}{s.voy ? " · " + s.voy : ""} <HTSrc /></div>
      <dl>
        <dt>Tiến độ</dt><dd>{htFmt(s.done)} / {htFmt(s.plan)} move</dd>
        <dt>Năng suất</dt><dd>{s.rate} move/giờ{s.planRate ? ` (KH ${s.planRate})` : ""}</dd>
        <dt>Dự kiến rời</dt><dd>{s.etd}</dd>
      </dl>
    </>;
  } else if (pick.kind === "wait") {
    const w = sim.waiting[0]; if (!w) return null;
    body = <>
      <h3>{w.name}</h3><div className="sub">Vùng neo · {w.voy} <HTSrc /></div>
      <dl><dt>Dự kiến cập</dt><dd>{w.eta}</dd><dt>Kế hoạch</dt><dd>{w.plan} move</dd></dl>
    </>;
  } else if (pick.kind === "eq") {
    const all = [...equip.cranes, ...equip.forklifts, ...equip.trucks];
    const e = all.find(x => x.id === pick.id); if (!e) return null;
    const stt = htEquipStatus(e);
    body = <>
      <h3>{e.name}</h3><div className="sub">{e.id} <HTSrc real /></div>
      <dl>
        <dt>Trạng thái</dt><dd><span className={`badge ${stt.badge}`}><span className="pip"></span>{stt.label}</span></dd>
        {e.detail && e.detail !== e.name && <><dt>Mô tả</dt><dd>{e.detail}</dd></>}
        {stt.key === "off" && htFmtSince(e.offlineSince) && <><dt>Ngừng từ</dt><dd>{htFmtSince(e.offlineSince)}</dd></>}
        <dt>Vị trí trên sơ đồ</dt><dd className="muted">Gán tạm</dd>
      </dl>
    </>;
  }
  return (
    <div className="ht-pick card">
      <button className="ht-pick-x" type="button" aria-label="Đóng" onClick={onClose}><Icon name="x" size={14} /></button>
      {body}
    </div>
  );
}

function HTPortView({ onClose }) {
  const simRef = React.useRef(null);
  if (!simRef.current) simRef.current = htCreateSim();
  const sim = simRef.current;
  const equip = React.useMemo(htEquipment, []);
  const [, setTick] = React.useState(0);
  const [tilt, setTilt] = React.useState(true);
  const [layers, setLayers] = React.useState({ yard: true, ships: true, gate: true, equip: true });
  const [pick, setPick] = React.useState(null);
  const stageRef = React.useRef(null);

  React.useEffect(() => {
    const id = setInterval(() => { sim.step(); setTick(t => t + 1); }, 3000);
    return () => clearInterval(id);
  }, []);

  const toggleFull = () => {
    const el = stageRef.current; if (!el) return;
    try {
      const p = document.fullscreenElement ? document.exitFullscreen() : el.requestFullscreen();
      if (p && p.catch) p.catch(() => {});
    } catch (e) { /* trình duyệt không hỗ trợ — bỏ qua */ }
  };

  // Tổng hợp
  const yardUsed = (k) => HT_BLOCKS.filter(b => b.yard === k).reduce((a, b) => a + b.cap * sim.occ[b.id], 0);
  const totalUsed = Object.keys(HT_YARDS).reduce((a, k) => a + yardUsed(k), 0);
  const mainBerths = HT_BERTHS.filter(b => !b.barge);
  const working = mainBerths.filter(b => sim.ships[b.id] && sim.ships[b.id].st === "work");
  const bargeWorking = HT_BERTHS.filter(b => b.barge && sim.ships[b.id] && sim.ships[b.id].st === "work").length;
  const avgRate = working.length ? working.reduce((a, b) => a + sim.ships[b.id].rate, 0) / working.length : 0;
  const waitMin = Math.round(sim.gate.queue * 1.6 + 3);
  const on = (arr) => arr.filter(e => e.status === "ONLINE").length;

  // Cảnh báo: thiết bị ngừng (thật) trước, rồi các cảnh báo mô phỏng
  const alerts = [];
  [...equip.cranes, ...equip.forklifts, ...equip.trucks, ...equip.gates, ...equip.scales]
    .filter(e => e.status === "OFFLINE")
    .forEach(e => alerts.push({ sev: 3, real: true, text: <><b>{e.name}</b> ({e.id}) đang ngừng{htFmtSince(e.offlineSince) ? ` từ ${htFmtSince(e.offlineSince)}` : ""}</> }));
  mainBerths.forEach(b => { const s = sim.ships[b.id]; if (s && s.planRate && s.st === "work" && s.rate < s.planRate * 0.7) alerts.push({ sev: 3, text: <><b>{s.name}</b> ({b.id}) đạt {s.rate}/{s.planRate} move/giờ, nguy cơ trễ ETD {s.etd}</> }); });
  HT_BLOCKS.filter(b => sim.occ[b.id] >= 0.9).sort((a, b) => sim.occ[b.id] - sim.occ[a.id]).slice(0, 4)
    .forEach(b => alerts.push({ sev: sim.occ[b.id] >= 0.95 ? 3 : 2, text: <><b>{HT_YARDS[b.yard].name} · {b.id}</b> lấp đầy {Math.round(sim.occ[b.id] * 100)}%</> }));
  if (sim.gate.queue > 15) alerts.push({ sev: 2, text: <><b>Cổng</b>: {sim.gate.queue} xe chờ, chờ trung bình {waitMin} phút</> });
  alerts.sort((a, b) => (b.real ? 1 : 0) - (a.real ? 1 : 0) || b.sev - a.sev);

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
        <span><b>Trạng thái thiết bị</b> là dữ liệu thật từ danh mục thiết bị kỹ thuật. <b>Mật độ bãi, tàu tại cầu và hàng xe ở cổng</b> đang là số liệu mô phỏng vì hệ thống chưa có nguồn cho các mục này.</span>
      </div>

      <div className="kpi-grid kpi-grid-5">
        <div className="kpi">
          <div className="lbl"><span className="swatch" style={{ background: "var(--st-info)" }} /> Tồn bãi</div>
          <div className="val">{htFmt(totalUsed)}<small>/ {htFmt(HT_YARD_TOTAL)} TEU</small></div>
          <div className="delta">{Math.round(totalUsed / HT_YARD_TOTAL * 100)}% sức chứa · <HTSrc /></div>
        </div>
        <div className="kpi">
          <div className="lbl"><span className="swatch" style={{ background: "var(--st-success)" }} /> Tàu làm hàng</div>
          <div className="val">{working.length}<small>/ 4 cầu</small></div>
          <div className="delta">+{bargeWorking} sà lan · {sim.waiting.length} chờ cầu · <HTSrc /></div>
        </div>
        <div className="kpi">
          <div className="lbl"><span className="swatch" style={{ background: "var(--brand-accent)" }} /> Xe chờ ở cổng</div>
          <div className="val">{sim.gate.queue}<small>xe</small></div>
          <div className="delta">Chờ TB {waitMin} phút · <HTSrc /></div>
        </div>
        <div className="kpi">
          <div className="lbl"><span className="swatch" style={{ background: "#7C5BE0" }} /> Cẩu bờ sẵn sàng</div>
          <div className="val">{on(equip.cranes)}<small>/ {equip.cranes.length}</small></div>
          <div className={`delta ${on(equip.cranes) < equip.cranes.length ? "down" : "up"}`}>
            {equip.cranes.length - on(equip.cranes) > 0 ? `${equip.cranes.length - on(equip.cranes)} cẩu đang ngừng` : "Tất cả sẵn sàng"} · <HTSrc real />
          </div>
        </div>
        <div className="kpi">
          <div className="lbl"><span className="swatch" style={{ background: "var(--brand-ink)" }} /> Xe nâng · đầu kéo</div>
          <div className="val">{on(equip.forklifts)}<small>/ {equip.forklifts.length}</small>&nbsp;·&nbsp;{on(equip.trucks)}<small>/ {equip.trucks.length}</small></div>
          <div className="delta">Đang sẵn sàng · <HTSrc real /></div>
        </div>
      </div>

      <div className="ht-grid">
        <div className="card ht-mapcard" ref={stageRef}>
          <div className="ht-maptools" role="group" aria-label="Lớp hiển thị">
            {[["yard", "Mật độ bãi"], ["ships", "Tàu"], ["gate", "Cổng & xe"], ["equip", "Thiết bị"]].map(([k, l]) => (
              <button key={k} type="button" className="ht-chip" aria-pressed={layers[k]} onClick={() => setLayers(s => ({ ...s, [k]: !s[k] }))}>
                <i></i>{l}
              </button>
            ))}
            <span className="ht-hint">Chạm vào block, tàu hoặc thiết bị để xem chi tiết</span>
          </div>
          <div className="ht-stage">
            <HTPortMap sim={sim} equip={equip} tilt={tilt} layers={layers} onPick={setPick} picked={pick && pick.kind === "blk" ? pick.id : null} />
          </div>
          <div className="ht-legend">
            <span><i className="ht-sw"></i>Lấp đầy 0 → 100%</span>
            <span><i className="ht-dot" style={{ background: "var(--ht-ok)" }}></i>Sẵn sàng</span>
            <span><i className="ht-dot" style={{ background: "var(--ht-crit)" }}></i>Ngừng / quá tải</span>
            <span><i className="ht-dot" style={{ background: "var(--ht-warn)" }}></i>Trên 90%</span>
          </div>
          <HTPickCard pick={pick} sim={sim} equip={equip} onClose={() => setPick(null)} />
        </div>

        <div className="ht-side">
          <div className="card">
            <div className="card-head"><h3>Cầu tàu</h3><HTSrc /></div>
            <div className="ht-list">
              {HT_BERTHS.map(b => {
                const s = sim.ships[b.id];
                if (!s) return (
                  <div key={b.id} className="ht-berth"><span className="code">{b.id}</span><span className="nm muted">Trống</span><span className="badge neutral">Trống</span></div>
                );
                const pct = s.plan ? s.done / s.plan * 100 : 0, slow = s.planRate && s.rate < s.planRate * 0.7;
                const badge = s.st === "work" ? (slow ? ["danger", "Chậm"] : ["success", "Làm hàng"]) : s.st === "prep" ? ["info", "Chuẩn bị"] : ["neutral", "Hoàn tất"];
                return (
                  <div key={b.id} className="ht-berth clickable" onClick={() => setPick({ kind: "ship", id: b.id })}>
                    <span className="code">{b.id}</span>
                    <span className="nm">{s.name}{s.voy && <small>{s.voy}</small>}</span>
                    <span className={`badge ${badge[0]}`}><span className="pip"></span>{badge[1]}</span>
                    <div className={`progress-track ${slow ? "late" : ""}`}><div className="pbar" style={{ width: `${pct}%` }} /></div>
                    <span className="meta mono">{htFmt(s.done)}/{htFmt(s.plan)} move · {s.rate} m/h · rời {s.etd}</span>
                  </div>
                );
              })}
              {sim.waiting.map(w => (
                <div key={w.name} className="ht-berth"><span className="code">Neo</span><span className="nm">{w.name}<small>{w.voy}</small></span><span className="badge warning"><span className="pip"></span>Chờ cầu</span>
                  <span className="meta mono">ETA {w.eta} · {w.plan} move</span></div>
              ))}
            </div>
          </div>

          <div className="card">
            <div className="card-head"><h3>Mật độ theo bãi</h3><HTSrc /></div>
            <div className="ht-list">
              {Object.keys(HT_YARDS).map(k => {
                const y = HT_YARDS[k], p = yardUsed(k) / y.cap;
                return (
                  <div key={k} className="ht-yard">
                    <div><b>{y.name}</b><small>{y.zone} · {htFmt(y.cap)} TEU</small></div>
                    <div className={`progress-track ${p >= 0.9 ? "late" : ""}`}><div className="pbar" style={{ width: `${p * 100}%` }} /></div>
                    <span className="mono">{Math.round(p * 100)}%</span>
                  </div>
                );
              })}
              {HT_WAREHOUSES.map(w => (
                <div key={w.id} className="ht-yard">
                  <div><b>{w.name}</b><small>{w.area}</small></div>
                  <div className="progress-track"><div className="pbar" style={{ width: `${sim.whOcc[w.id] * 100}%` }} /></div>
                  <span className="mono">{Math.round(sim.whOcc[w.id] * 100)}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="ht-grid-2">
        <div className="card">
          <div className="card-head"><h3>Thiết bị</h3><HTSrc real /></div>
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
          <div className="card-head"><h3>Cổng & cảnh báo</h3><span className="sub mono">Xe trong cảng: {sim.gate.inside} · Vào {htFmt(sim.gate.inToday)} · Ra {htFmt(sim.gate.outToday)}</span></div>
          <ul className="ht-alerts">
            {alerts.slice(0, 8).map((a, i) => (
              <li key={i} className={`sev${a.sev}`}>
                <span>{a.text}</span>
                {a.real ? <span className="badge success">Thật</span> : <span className="badge warning">Mô phỏng</span>}
              </li>
            ))}
          </ul>
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
