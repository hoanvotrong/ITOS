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

/* Cẩu bờ dọc tuyến cầu, thứ tự do bên vận hành cung cấp (14/10/2026):
   đánh số BẮT ĐẦU TỪ BL1 — đầu cầu phía NAM, ngay bên phải khu Đất Công an tỉnh —
   rồi chạy dọc bờ lên hướng bắc. Tuyến cầu gồm 2 đoạn nối tiếp: đoạn sà lan
   (307,721)->(604,621) rồi đoạn chính (607,622)->(905,228).
   Thứ tự là thật; KHOẢNG CÁCH chia đều, chưa phải vị trí đo đạc. */
const HT_SHORE_CRANES = ["VNL-01", "VNL-02", "VNL-03", "VNL-05", "VNL-06", "VNL-07", "VNL-08"];

// Đi dọc cả tuyến bờ theo tỉ lệ 0..1, gốc 0 = đầu nam sát Đất Công an tỉnh
const HT_WATERFRONT = [HT_QUAY_BARGE, HT_QUAY_MAIN];
const HT_WF_LEN = HT_WATERFRONT.reduce((a, q) => a + q.L, 0);
const htOnWaterfront = (u, off) => {
  let s = Math.max(0, Math.min(1, u)) * HT_WF_LEN;
  for (const q of HT_WATERFRONT) {
    if (s <= q.L || q === HT_WATERFRONT[HT_WATERFRONT.length - 1]) {
      return { p: htOnQuay(q, s / q.L, off), ang: q.ang };
    }
    s -= q.L;
  }
};
const htCraneT = (i) => 0.06 + (0.88 * i) / (HT_SHORE_CRANES.length - 1);
const htCraneAt = (code) => {
  const i = HT_SHORE_CRANES.indexOf(code);
  return i < 0 ? null : htCraneT(i);
};

/* Bến phao ngoài mặt nước. KHÔNG phải toạ độ hàng hải thật — chỉ là sơ đồ bố trí
   tương đối để thấy tàu nào đang làm hàng ở bến nào. Các vùng được rải đều trên
   một tuyến chéo giữa vùng nước trống, song song với bờ. */
const HT_BUOY_LINE = { a: { x: 320, y: 520 }, b: { x: 845, y: 135 } };
const htBuoyPos = (i, n) => {
  const f = n <= 1 ? 0.5 : i / (n - 1);
  return {
    x: HT_BUOY_LINE.a.x + (HT_BUOY_LINE.b.x - HT_BUOY_LINE.a.x) * f,
    y: HT_BUOY_LINE.a.y + (HT_BUOY_LINE.b.y - HT_BUOY_LINE.a.y) * f,
  };
};
// "VNL-01" -> "VNL01" ; sheet "HT-VNL01-4530" -> "VNL01"
const htOrderKey = (code) => String(code).toUpperCase().replace(/-/g, "");
const htSheetShoreKey = (sheetId) => {
  const p = String(sheetId).toUpperCase().split("-");
  return p.length >= 2 && p[0] === "HT" ? p[1] : null;
};

/* Xe nâng và đầu kéo vẫn KHÔNG vẽ lên sơ đồ: trạng thái thì có thật nhưng vị trí
   thì không có nguồn. Trạng thái xem ở bảng "Thiết bị". */

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
const htHull = (len, beam) => { const h = len / 2, bw = beam / 2; return `M${-h},${-bw} L${h - 12},${-bw} Q${h + 2},0 ${h - 12},${bw} L${-h},${bw} Q${-h - 3},0 ${-h},${-bw} Z`; };
const htDeg = (rad) => rad * 180 / Math.PI;

/* Hai nguồn duy nhất của màn hình. Không còn nhãn "Mô phỏng" — thứ gì chưa có
   nguồn thì không hiển thị chứ không điền số minh hoạ. */
function HTSrc({ plan }) {
  return plan
    ? <span className="badge neutral" title="Số liệu thiết kế theo bản vẽ MB bãi ICD 25/09/2026"><span className="pip"></span>Theo bản vẽ</span>
    : <span className="badge success" title="Lấy từ danh mục thiết bị kỹ thuật, cập nhật mỗi 8 tiếng"><span className="pip"></span>Dữ liệu thật</span>;
}

function HTPortMap({ tilt, onPick, picked, quayVessels, shoreByKey, buoyZones }) {
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

      {/* Bến phao ngoài mặt nước. Vị trí là SƠ ĐỒ BỐ TRÍ tương đối, không phải toạ độ
          hàng hải — dùng để thấy tàu nào đang làm hàng ở bến nào. */}
      <g>
        {buoyZones.map((z, i) => {
          const p = htBuoyPos(i, buoyZones.length);
          const busy = !!z.job;
          return (
            <g key={z.id} className={busy ? "ht-hit" : undefined}
               onClick={busy ? () => onPick({ kind: "bp", id: z.id }) : undefined}>
              <ellipse cx={p.x} cy={p.y} rx={44} ry={25}
                       fill={busy ? "rgba(21,128,61,0.10)" : "none"}
                       stroke={busy ? "var(--ht-ok)" : "var(--ht-dim)"}
                       strokeDasharray={busy ? undefined : "4 3"} strokeWidth={busy ? 1.2 : 0.9} />
              <text x={p.x} y={p.y - 13} className="ht-mlabel" textAnchor="middle">{z.id}</text>
              {busy && (
                <>
                  <g transform={`translate(${p.x} ${p.y + 3}) rotate(-36)`}>
                    <path d={htHull(52, 15)} fill="var(--ht-hull)" stroke="var(--ht-ok)" strokeWidth={1.1} />
                  </g>
                  <text x={p.x} y={p.y + 26} className="ht-mlabel" textAnchor="middle">{z.job.vessel.name}</text>
                </>
              )}
            </g>
          );
        })}
      </g>

      {/* Bến sà lan theo bản vẽ — chưa có nguồn tàu nên chỉ vẽ vị trí trống. */}
      <g>
        {HT_BERTHS.filter(bt => bt.barge).map(bt => {
          const c = htOnQuay(bt.q, bt.t, 13);
          const m = htOnQuay(bt.q, bt.t, -9);
          const deg = htDeg(bt.q.ang);
          return (
            <g key={bt.id}>
              <text x={m.x} y={m.y} className="ht-mlabel" textAnchor="middle" transform={`rotate(${deg} ${m.x} ${m.y})`}>{bt.id}</text>
              <g transform={`translate(${c.x} ${c.y}) rotate(${deg})`}>
                <rect x={-bt.len / 2} y={-6.5} width={bt.len} height={13} rx={3} fill="none" stroke="var(--ht-dim)" strokeDasharray="3 3" />
              </g>
            </g>
          );
        })}
      </g>

      {/* Tàu tại cầu bến — khai báo trong quay-status.jsx. Tàu được vẽ trải đúng
          theo các cẩu bờ đang phục vụ nó. */}
      <g>
        {quayVessels.map((v, i) => {
          const ts = (v.cranes || []).map(htCraneAt).filter(t => t != null);
          if (!ts.length) return null;
          const t0 = Math.min(...ts), t1 = Math.max(...ts);
          const mid = (t0 + t1) / 2;
          const span = Math.max(0.08, t1 - t0 + 0.07) * HT_WF_LEN;
          const c = htOnWaterfront(mid, 20).p;
          const tag = htOnWaterfront(mid, 58).p;
          const deg = htDeg(htOnWaterfront(mid, 0).ang);
          const stroke = v.status === "working" ? "var(--ht-ok)"
                       : v.status === "departing" ? "var(--ht-warn)" : "var(--ht-accent)";
          return (
            <g key={`qv${i}`}>
              <g className="ht-hit" transform={`translate(${c.x} ${c.y}) rotate(${deg})`}
                 onClick={() => onPick({ kind: "ship", id: i })}>
                <path d={htHull(span, 21)} fill="var(--ht-shade)" transform="translate(1.5 2.5)" opacity={0.6} />
                <path d={htHull(span, 19)} fill="var(--ht-hull)" stroke={stroke} strokeWidth={1.3} />
              </g>
              <g className="ht-shiptag" transform={`translate(${tag.x} ${tag.y})`}>
                <rect x={-42} y={-11} width={84} height={21} rx={2} />
                <text x={-38} y={-2}>{v.vessel}</text>
                <text x={-38} y={7} className="t2">{v.berth}{v.cranes && v.cranes.length ? ` · ${v.cranes.join(", ")}` : ""}</text>
              </g>
            </g>
          );
        })}
      </g>

      {/* Cẩu bờ — trạng thái thật từ danh mục kỹ thuật, thứ tự dọc cầu do vận hành cung cấp */}
      <g>
        {HT_SHORE_CRANES.map((code, i) => {
          const e = shoreByKey[htOrderKey(code)];
          const w = htOnWaterfront(htCraneT(i), -2);
          const col = !e ? "var(--ht-dim)"
                    : e.status === "ONLINE" ? "var(--ht-ok)"
                    : e.status === "OFFLINE" ? "var(--ht-crit)" : "var(--ht-dim)";
          return (
            <g key={code} className="ht-hit" transform={`translate(${w.p.x} ${w.p.y}) rotate(${htDeg(w.ang)})`}
               onClick={() => onPick({ kind: "crane", id: code })}>
              <rect x={-5} y={-3} width={10} height={8} rx={1} fill="var(--ht-quay)" stroke={col} strokeWidth={1.3} />
              <line x1={0} y1={0} x2={-6} y2={-30} stroke={col} strokeWidth={1.6} strokeLinecap="round" />
              <text x={0} y={14} className="ht-mlabel" textAnchor="middle" transform={`rotate(${-htDeg(w.ang)})`}>{code}</text>
              {e && e.status === "OFFLINE" && <circle cx={0} cy={0} r={3} className="ht-pulse" />}
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

function HTPickCard({ pick, quayVessels, shoreByKey, buoyZones, onClose }) {
  if (!pick) return null;
  let body = null;

  if (pick.kind === "blk") {
    const b = HT_BLOCKS.find(x => x.id === pick.id);
    if (!b) return null;
    const y = HT_YARDS[b.yard];
    body = <>
      <h3>Block {b.id}</h3><div className="sub">{y.name} · {y.zone} <HTSrc plan /></div>
      <dl>
        <dt>Sức chứa</dt><dd>{htFmt(b.cap)} TEU</dd>
        <dt>Quy mô</dt><dd>{b.rows} hàng · {b.boxes} ô</dd>
        <dt>Đang chứa</dt><dd className="muted">Chưa có nguồn</dd>
      </dl>
    </>;
  } else if (pick.kind === "ship") {
    const v = quayVessels[pick.id];
    if (!v) return null;
    body = <>
      <h3>{v.vessel}</h3>
      <div className="sub">{v.berth}{v.voyage ? ` · ${v.voyage}` : ""} <span className="badge neutral"><span className="pip"></span>Nhập tay</span></div>
      <dl>
        {v.cargo && <><dt>Hàng</dt><dd>{v.cargo}</dd></>}
        {v.cranes && v.cranes.length > 0 && <><dt>Cẩu phục vụ</dt><dd>{v.cranes.join(", ")}</dd></>}
        {v.eta && <><dt>Cập cầu</dt><dd>{v.eta}</dd></>}
        {v.etd && <><dt>Dự kiến rời</dt><dd>{v.etd}</dd></>}
        {v.note && <><dt>Ghi chú</dt><dd>{v.note}</dd></>}
      </dl>
    </>;
  } else if (pick.kind === "bp") {
    const z = buoyZones.find(x => x.id === pick.id);
    if (!z || !z.job) return null;
    const j = z.job;
    body = <>
      <h3>{j.vessel.name}</h3>
      <div className="sub">{z.id} · {j.id} <HTSrc /></div>
      <dl>
        {j.cargo && j.cargo.name && <><dt>Hàng</dt><dd>{j.cargo.name}</dd></>}
        <dt>Sản lượng</dt><dd>{j.qtyFinish} / {j.qtyTotal}</dd>
        <dt>Tiến độ</dt><dd>{j.progress}%</dd>
        {j.equipment && j.equipment.length > 0 && <><dt>Thiết bị</dt><dd>{j.equipment.join(", ")}</dd></>}
        <dt>Vị trí trên sơ đồ</dt><dd className="muted">Sơ đồ bố trí, không phải toạ độ thật</dd>
      </dl>
    </>;
  } else if (pick.kind === "crane") {
    const e = shoreByKey[htOrderKey(pick.id)];
    body = <>
      <h3>Cẩu bờ {pick.id}</h3>
      <div className="sub">{e ? e.id : "Chưa có trong danh mục kỹ thuật"} <HTSrc /></div>
      <dl>
        <dt>Trạng thái</dt>
        <dd>{!e ? <span className="muted">Chưa khai báo</span>
             : e.status === "ONLINE" ? <span className="badge success"><span className="pip"></span>Sẵn sàng</span>
             : e.status === "OFFLINE" ? <span className="badge danger"><span className="pip"></span>Ngừng</span>
             : <span className="muted">{e.status || "Chưa khai báo"}</span>}</dd>
        {e && e.detail && <><dt>Mô tả</dt><dd>{e.detail}</dd></>}
        {e && e.status === "OFFLINE" && htFmtSince(e.offlineSince) && <><dt>Ngừng từ</dt><dd>{htFmtSince(e.offlineSince)}</dd></>}
        <dt>Vị trí</dt><dd className="muted">Thứ tự dọc cầu · khoảng cách chia đều</dd>
      </dl>
    </>;
  }
  if (!body) return null;
  return (
    <div className="ht-pick card">
      <button className="ht-pick-x" type="button" aria-label="Đóng" onClick={onClose}><Icon name="x" size={14} /></button>
      {body}
    </div>
  );
}

function HTPortView({ onClose }) {
  const equip = React.useMemo(htEquipment, []);
  // Cẩu bờ HT-* tra theo mã ngắn ("VNL01") để khớp với thứ tự dọc cầu
  const shoreByKey = React.useMemo(() => {
    const m = {};
    equip.cranes.forEach(e => { const k = htSheetShoreKey(e.id); if (k) m[k] = e; });
    return m;
  }, [equip]);
  const quayVessels = typeof HT_QUAY_VESSELS !== "undefined" ? HT_QUAY_VESSELS : [];

  // Vùng bến phao: gồm các bến đang theo dõi + bất kỳ bến nào đang có tàu làm hàng
  const buoyZones = React.useMemo(() => {
    const jobs = typeof OCC_JOBS === "undefined" ? [] : OCC_JOBS;
    const byBerth = {};
    jobs.filter(occAtBerth)
        .forEach(j => { if (j.berthId && !byBerth[j.berthId]) byBerth[j.berthId] = j; });
    const tracked = (typeof OCC_BERTHS === "undefined" ? [] : OCC_BERTHS).map(b => b.id);
    const ids = Array.from(new Set(tracked.concat(Object.keys(byBerth)))).sort();
    return ids.map(id => ({ id, job: byBerth[id] || null }));
  }, []);
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

  // Tàu đang làm hàng — dữ liệu thật từ DB. Lưu ý: đây là tàu ở BẾN PHAO, hàng
  // chuyển tải về bãi ICD; DB không có bến nào thuộc cầu Hưng Thái nên không
  // thể đặt các tàu này lên Cầu 1-4 của sơ đồ.
  const working = React.useMemo(() => (typeof OCC_JOBS === "undefined" ? [] : OCC_JOBS)
    .filter(occAtBerth)
    .sort((a, b) => (b.progress || 0) - (a.progress || 0)), []);

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
            <HTPortMap tilt={tilt} onPick={setPick} picked={pick && pick.kind === "blk" ? pick.id : null}
                        quayVessels={quayVessels} shoreByKey={shoreByKey} buoyZones={buoyZones} />
          </div>
          <HTPickCard pick={pick} quayVessels={quayVessels} shoreByKey={shoreByKey} buoyZones={buoyZones} onClose={() => setPick(null)} />
        </div>

        <div className="ht-side">
          <div className="card">
            <div className="card-head">
              <h3>Tàu tại cầu bến</h3>
              <span className="badge neutral" title="Khai báo tay trong quay-status.jsx"><span className="pip"></span>Nhập tay</span>
            </div>
            {quayVessels.length ? (
              <div className="ht-list">
                {quayVessels.map((v, i) => (
                  <div key={i} className="ht-berth clickable" onClick={() => setPick({ kind: "ship", id: i })}>
                    <span className="code">{v.berth}</span>
                    <span className="nm">{v.vessel}{v.cargo && <small>{v.cargo}</small>}</span>
                    <span className={`badge ${v.status === "working" ? "success" : v.status === "departing" ? "warning" : "info"}`}>
                      <span className="pip"></span>
                      {v.status === "working" ? "Làm hàng" : v.status === "departing" ? "Chuẩn bị rời" : "Đã cập"}
                    </span>
                    <span className="meta mono">
                      {v.cranes && v.cranes.length ? v.cranes.join(", ") : "—"}{v.etd ? ` · rời ${v.etd}` : ""}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="ht-empty">
                Chưa khai báo tàu nào tại cầu. Module cầu bến của phần mềm (bảng <b>BerthBooking</b>) hiện chưa
                có dữ liệu, nên tàu tại cầu khai báo tay trong <b>quay-status.jsx</b> — thêm một dòng là tàu
                hiện ngay trên sơ đồ, trải đúng theo các cẩu đang phục vụ.
              </div>
            )}
          </div>

          <div className="card">
            <div className="card-head"><h3>Tàu đang làm hàng</h3><HTSrc /></div>
            {working.length ? (
              <div className="ht-list">
                {working.map(j => (
                  <div key={j.id} className="ht-berth">
                    <span className="code">{j.berthId}</span>
                    <span className="nm">
                      {j.vessel.name}
                      {j.equipment && j.equipment.length > 0 && <small>{j.equipment.join(" · ")}</small>}
                    </span>
                    <span className={`badge ${j.status === "delayed" ? "danger" : "success"}`}>
                      <span className="pip"></span>{j.progress}%
                    </span>
                    <div className={`progress-track ${j.status === "delayed" ? "late" : ""}`}>
                      <div className="pbar" style={{ width: `${Math.min(100, j.progress)}%` }} />
                    </div>
                    <span className="meta mono">{j.qtyFinish} / {j.qtyTotal}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="ht-empty">Hiện không có tàu nào đang làm hàng.</div>
            )}
            <div className="ht-empty">
              Đây là tàu neo tại <b>bến phao</b>, hàng chuyển tải bằng sà lan về bãi ICD — không phải tàu cập cầu Hưng Thái.
              Cầu 1–4 và SL 1–3 trên sơ đồ chưa có nguồn dữ liệu tàu.
            </div>
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
