/* Điều độ khai thác — Bãi container: sơ đồ bãi ICD VNL
   Sơ đồ vẽ lại từ bản vẽ "MB BÃI ICD 25.09.2026 - PA2" (repo ITOS, screens-hungthai.jsx):
   5 khu A–E, 81 block, sức chứa thiết kế 12.386 TEU.
   Vị trí cont: Block – Hàng (bay) – Cột (1..4) – Tầng (1..4). Cont 40' chiếm 2 hàng liền nhau.
   Giả định cần xác nhận: 4 cột × tối đa 4 tầng mỗi hàng; block lạnh B1–B3; khu E chỉ cont rỗng.
   Hệ thống là nơi ghi vị trí chính (phương án A) — xếp bãi, đảo chuyển ghi tại đây. */

const YD_YARDS = {
  A: { name: "Bãi 1", zone: "Khu A", cap: 1080 },
  B: { name: "Bãi 2", zone: "Khu B", cap: 1060 },
  C: { name: "Bãi 3", zone: "Khu C", cap: 3578 },
  D: { name: "Bãi 4", zone: "Khu D", cap: 5746 },
  E: { name: "Bãi depot", zone: "Khu E", cap: 922 },
};
const YD_LANES = 4, YD_TIERS = 4;
const YD_REEFER = ["B1", "B2", "B3"];

const YD_BLOCKS = (() => {
  const out = [];
  const add = (id, yard, x, y, w, h, rows, boxes, rot) => out.push({ id, yard, x, y, w, h, rows, boxes, cap: boxes * 2, rot });
  [[20,77],[21,81],[22,85],[22,85],[22,85],[22,85],[23,89],[24,93],[25,97],[26,101],[26,101],[27,105],[28,109],[29,113],[30,117]]
    .forEach((r, i) => { const yb = 535 - i * 16.3; add("D" + (i + 1), "D", 912, yb - 14.5, 67 + 26 * i / 14, 14.5, r[0], r[1]); });
  const dLx = [766, 751, 772, 760, 769, 778, 791, 800, 809];
  [[39,153],[44,173],[37,145],[41,161],[38,149],[35,137],[31,121],[28,109],[25,97]]
    .forEach((r, i) => { const yb = 535 - i * 16.25; add("D" + (16 + i), "D", dLx[i], yb - 14.5, 886 - dLx[i], 14.5, r[0], r[1]); });
  const dSx = [852, 852, 843, 852, 862];
  [[11,41],[11,41],[14,53],[11,41],[8,29]]
    .forEach((r, i) => { const yb = 388 - i * 16.2; add("D" + (25 + i), "D", dSx[i], yb - 14.5, 886 - dSx[i], 14.5, r[0], r[1]); });
  for (let i = 0; i < 11; i++) { const yb = 760 - i * 16.2; add("C" + (11 + i), "C", 713, yb - 14.5, 82, 14.5, 25, 97); }
  const cLx = [642.5, 642.5, 614, 614, 614, 614, 614];
  [[17,65],[17,65],[26,101],[26,101],[26,101],[21,81],[26,101]]
    .forEach((r, i) => { const yb = 760 - i * 16.1; add("C" + (i + 1), "C", cLx[i], yb - 14.5, (i === 5 ? 679 : 695) - cLx[i], 14.5, r[0], r[1]); });
  add("C8", "C", 655, 631, 40, 14.5, 13, 49);
  add("C9", "C", 664, 615, 31, 14.5, 10, 37);
  add("C10", "C", 675, 598.5, 20, 14.5, 6, 21);
  const bTop = [689, 692, 698, 704, 704, 713, 716, 723, 729, 735];
  [[21,81],[20,77],[18,69],[16,61],[16,61],[13,49],[12,45],[10,37],[8,29],[6,21]]
    .forEach((r, i) => add("B" + (i + 1), "B", 539 - i * 16.2, bTop[i], 15, 754 - bTop[i], r[0], r[1]));
  for (let i = 0; i < 6; i++) {
    add("A" + (7 + i), "A", 315 - i * 16.3, 763, 15, 36, 12, 45);
    add("A" + (1 + i), "A", 315 - i * 16.3, 818, 15, 37, 12, 45);
  }
  for (let i = 0; i < 9; i++) {
    const cx = 933.6 + i * 8.04, cy = 222.9 - i * 13.4, w = i === 8 ? 32 : 43;
    add("E" + (i + 1), "E", cx - w / 2, cy - 6, w, 12, i === 8 ? 10 : 14, i === 8 ? 37 : 53, { cx, cy, a: 31 });
  }
  return out;
})();
const YD_BLK = Object.fromEntries(YD_BLOCKS.map(b => [b.id, b]));
const ydKind = (b) => YD_REEFER.includes(b) ? "Lạnh" : b && b[0] === "E" ? "Rỗng (depot)" : "Hàng khô / tổng hợp";

const ydLine = (a, b) => ({ A: a, ang: Math.atan2(b.y - a.y, b.x - a.x), L: Math.hypot(b.x - a.x, b.y - a.y) });
const YD_QUAY_MAIN = ydLine({ x: 607, y: 622 }, { x: 905, y: 228 });
const YD_QUAY_BARGE = ydLine({ x: 307, y: 721 }, { x: 604, y: 621 });
const ydOnQuay = (q, t, off) => { const ux = Math.cos(q.ang), uy = Math.sin(q.ang); return { x: q.A.x + ux * t * q.L + uy * off, y: q.A.y + uy * t * q.L - ux * off }; };
const YD_BERTHS = [
  { id: "Cầu 1", q: YD_QUAY_MAIN, t: 0.21 }, { id: "Cầu 2", q: YD_QUAY_MAIN, t: 0.44 }, { id: "Cầu 3", q: YD_QUAY_MAIN, t: 0.66 }, { id: "Cầu 4", q: YD_QUAY_MAIN, t: 0.88 },
  { id: "SL 1", q: YD_QUAY_BARGE, t: 0.2 }, { id: "SL 2", q: YD_QUAY_BARGE, t: 0.5 }, { id: "SL 3", q: YD_QUAY_BARGE, t: 0.8 },
];
const ydDeg = (r) => r * 180 / Math.PI;

/* ---------- Vị trí & chỉ mục ô ---------- */
const ydLen = (c) => (c.type || "").startsWith("4") ? 2 : 1;
const ydTeu = (c) => ydLen(c);
const ydPad = (n) => String(n).padStart(2, "0");
const ydLocStr = (p) => p ? `${p.b}-${ydPad(p.bay)}-${p.lane}-${p.tier}` : null;
let YD_IDX = null;
const ydInYard = () => Object.values(window.DD_CONT_REG || {}).filter(c => c.inPort && c.pos);
const ydReindex = () => {
  YD_IDX = new Map();
  ydInYard().forEach(c => { for (let k = 0; k < ydLen(c); k++) YD_IDX.set(`${c.pos.b}|${c.pos.bay + k}|${c.pos.lane}|${c.pos.tier}`, c.no); });
  return YD_IDX;
};
const ydAt = (b, bay, lane, tier) => (YD_IDX || ydReindex()).get(`${b}|${bay}|${lane}|${tier}`);

/* Kiểm tra xếp cont c vào ô (b, bay, lane, tier) — trả về lý do nếu không hợp lệ */
const ydCheck = (c, b, bay, lane, tier) => {
  const blk = YD_BLK[b]; if (!blk) return "Block không tồn tại";
  const L = ydLen(c);
  if (bay < 1 || bay + L - 1 > blk.rows) return L === 2 ? "Cont 40' cần 2 hàng liền nhau" : "Ngoài phạm vi block";
  if (tier > YD_TIERS) return `Vượt ${YD_TIERS} tầng`;
  const rf = (c.type || "").includes("RF");
  if (rf && !YD_REEFER.includes(b)) return "Cont lạnh phải xếp block có ổ cắm (B1–B3)";
  if (!rf && YD_REEFER.includes(b)) return "Block lạnh chỉ dành cho cont lạnh";
  if (b[0] === "E" && c.fe !== "E") return "Khu depot chỉ nhận cont rỗng";
  for (let k = 0; k < L; k++) {
    const o = ydAt(b, bay + k, lane, tier); if (o && o !== c.no) return "Ô đã có cont";
    if (tier > 1) { const u = ydAt(b, bay + k, lane, tier - 1); if (!u || u === c.no) return "Tầng dưới chưa có cont đỡ"; }
  }
  return null;
};
const ydBlocked = (c) => { if (!c.pos) return null; for (let k = 0; k < ydLen(c); k++) { const t = ydAt(c.pos.b, c.pos.bay + k, c.pos.lane, c.pos.tier + 1); if (t) return t; } return null; };
const ydFirstFree = (c, b) => {
  const blk = YD_BLK[b]; if (!blk) return null;
  for (let tier = 1; tier <= YD_TIERS; tier++) for (let bay = 1; bay <= blk.rows; bay++) for (let lane = 1; lane <= YD_LANES; lane++)
    if (!ydCheck(c, b, bay, lane, tier)) return { b, bay, lane, tier };
  return null;
};
const ydBlockTeu = (b) => ydInYard().filter(c => c.pos.b === b).reduce((s, c) => s + ydTeu(c), 0);

/* Gợi ý block: đúng loại khu, ưu tiên block đang có cùng hãng tàu, còn chỗ, ít đầy */
const ydSuggest = (c, n = 3) => {
  const all = ydInYard();
  return YD_BLOCKS.map(b => {
    const inB = all.filter(x => x.pos.b === b.id);
    const teu = inB.reduce((s, x) => s + ydTeu(x), 0), pct = teu / b.cap;
    const same = inB.filter(x => x.line === c.line).length, sameFe = inB.filter(x => x.fe === c.fe).length;
    const slot = ydFirstFree(c, b.id);
    return { b: b.id, slot, pct, same, score: slot ? (same * 3 + sameFe * 0.5 - pct * 60) : -1e9 };
  }).filter(x => x.slot).sort((a, b) => b.score - a.score).slice(0, n);
};

const ydPlace = (c, pos, by, note) => {
  const from = c.pos ? ydLocStr(c.pos) : "Chờ xếp bãi";
  c.pos = { ...pos }; c.loc = ydLocStr(pos);
  c.moves = c.moves || []; c.moves.unshift({ at: ddNow(), by, from, to: c.loc, note: note || null });
  if (c.job) ddJobLog(c.job, `${from === "Chờ xếp bãi" ? "Hạ bãi" : "Đảo chuyển"} ${tlContFmt(c.no)} → ${c.loc}${note ? ` · ${note}` : ""}`, by);
  ydReindex();
};

/* ---------- Sơ đồ ---------- */
const ydHeat = (pct) => pct <= 0 ? "#E6ECF2" : pct < 0.4 ? "#BFE3D0" : pct < 0.65 ? "#7CC8A4" : pct < 0.85 ? "#F2C063" : "#E5735C";
/* Khung nhìn theo khu (zoom) */
const ydZoneBox = (k) => {
  if (!k) return "185 60 890 840";
  const bs = YD_BLOCKS.filter(b => b.yard === k).map(b => b.rot ? { x: b.rot.cx - 25, y: b.rot.cy - 25, w: 50, h: 50 } : b);
  const x0 = Math.min(...bs.map(b => b.x)) - 30, y0 = Math.min(...bs.map(b => b.y)) - 30, x1 = Math.max(...bs.map(b => b.x + b.w)) + 30, y1 = Math.max(...bs.map(b => b.y + b.h)) + 30;
  const w = Math.max(x1 - x0, 200), h = Math.max(y1 - y0, 200); return `${x0} ${y0} ${w} ${h}`;
};
function YdMap({ stats, pick, onPick, focus, hl, view }) {
  const ql = (q, w) => (
    <g transform={`translate(${q.A.x} ${q.A.y}) rotate(${ydDeg(q.ang)})`}><rect x={-4} y={-3} width={q.L + 8} height={w} fill="#C9D3DD" /><line x1={-4} y1={-3} x2={q.L + 4} y2={-3} stroke="#0E7490" strokeWidth={1.2} opacity={0.5} /></g>
  );
  const bld = (x, y, w, h, l, s) => (<g><rect x={x} y={y} width={w} height={h} rx={5} fill="#DCE3EA" stroke="#B4C0CC" /><text x={x + w / 2} y={y + h / 2 + 2} className="yd-z" textAnchor="middle">{l}</text>{s && <text x={x + w / 2} y={y + h / 2 + 14} className="yd-m" textAnchor="middle">{s}</text>}</g>);
  return (
    <svg viewBox={ydZoneBox(view)} preserveAspectRatio="xMidYMid meet" style={{ width: "100%", height: 620, display: "block", background: "#D7E7F2" }} role="img" aria-label="Sơ đồ bãi container VNL">
      <style>{`.yd-z{font:700 10px Manrope,system-ui,sans-serif;fill:#3E4C5A;letter-spacing:.04em}.yd-m{font:500 7.5px Manrope,system-ui,sans-serif;fill:#5B6878}.yd-b{font:700 5.6px 'Geist Mono',ui-monospace,monospace;fill:#22313F;pointer-events:none}.yd-blk{cursor:pointer}.yd-blk:hover rect.f{stroke:#0F172A;stroke-width:.9}@keyframes ydp{0%{opacity:1}50%{opacity:.25}100%{opacity:1}}.yd-pulse{animation:ydp 1s infinite}`}</style>
      {Array.from({ length: 14 }, (_, i) => <path key={i} d={`M150,${120 + i * 48} q 120 -20 240 0 t 240 0`} stroke="#BFD6E6" strokeWidth={0.7} fill="none" />)}
      <polygon points="200,758 307,721 604,621 607,622 905,228 1003,92 1012,98 1010,560 1000,890 200,890" fill="#F1F3EE" stroke="#C9CFC4" />
      <polygon points="200,890 1014,890 1014,1200 200,1200" fill="#F1F3EE" />
      <rect x={1014} y={-300} width={46} height={1500} fill="#E3E6E9" /><rect x={1060} y={-300} width={440} height={1500} fill="#F1F3EE" />
      <text x={1052} y={720} className="yd-z" transform="rotate(-90 1052 720)" style={{ fontSize: 11 }}>TỈNH LỘ 965</text>
      <g fill="#E3E6E9"><rect x={740} y={546} width={272} height={28} /><rect x={205} y={864} width={800} height={22} /><rect x={338} y={755} width={18} height={120} /><rect x={600} y={762} width={400} height={14} /><rect x={982} y={540} width={22} height={340} /></g>
      <text x={780} y={565} className="yd-m">Đường C2</text><text x={430} y={880} className="yd-m">Đường C1</text>
      {ql(YD_QUAY_MAIN, 14)}{ql(YD_QUAY_BARGE, 12)}
      {YD_BERTHS.map(bt => { const m = ydOnQuay(bt.q, bt.t, -10); return <text key={bt.id} x={m.x} y={m.y} className="yd-m" textAnchor="middle" transform={`rotate(${ydDeg(bt.q.ang)} ${m.x} ${m.y})`}>{bt.id}</text>; })}
      {bld(357, 778, 208, 84, "KHO SỐ 2", "10.140 m²")}{bld(595, 782, 335, 84, "KHO SỐ 1", "17.225 m²")}
      <rect x={946} y={780} width={34} height={74} rx={2} fill="#DCE3EA" stroke="#B4C0CC" /><text x={963} y={822} className="yd-m" textAnchor="middle" transform="rotate(-90 963 822)">Văn phòng</text>
      <text x={955} y={543} className="yd-m" textAnchor="middle">Cổng Đường C2</text><text x={990} y={900} className="yd-m" textAnchor="end">Cổng Đường C1</text>
      {[["KHU D · BÃI 4", 820, 288], ["KHU C · BÃI 3", 615, 578], ["KHU B · BÃI 2", 415, 684], ["KHU A · BÃI 1", 232, 757], ["KHU E · DEPOT", 880, 140]].map(z => <text key={z[0]} x={z[1]} y={z[2]} className="yd-z">{z[0]}</text>)}
      {YD_BLOCKS.map(b => {
        let x = b.x, y = b.y, tf; if (b.rot) { tf = `translate(${b.rot.cx} ${b.rot.cy}) rotate(${b.rot.a})`; x = -b.w / 2; y = -b.h / 2; }
        const st = stats[b.id] || { pct: 0, hit: 0 };
        const fill = hl ? (st.hit ? `rgba(14,116,144,${0.35 + Math.min(0.6, st.hit / 12)})` : "#E6ECF2") : ydHeat(st.pct);
        const vertical = b.h > b.w * 1.4, sel = pick === b.id, foc = focus === b.id;
        return (
          <g key={b.id} className="yd-blk" onClick={() => onPick(b.id)}><g transform={tf}>
            <rect className="f" x={x} y={y} width={b.w} height={b.h} rx={0.8} fill={fill} stroke={sel ? "#0F172A" : YD_REEFER.includes(b.id) ? "#2563EB" : "none"} strokeWidth={sel ? 1.6 : 0.8} strokeDasharray={YD_REEFER.includes(b.id) && !sel ? "2 1.4" : undefined} />
            {foc && <rect className="yd-pulse" x={x - 2} y={y - 2} width={b.w + 4} height={b.h + 4} fill="none" stroke="#DC2626" strokeWidth={1.8} rx={2} />}
            <text className="yd-b" textAnchor="middle" x={x + b.w / 2} y={y + b.h / 2 + 2} transform={vertical ? `rotate(-90 ${x + b.w / 2} ${y + b.h / 2})` : undefined}>{b.id}</text>
          </g></g>);
      })}
    </svg>
  );
}

/* ---------- Mặt cắt block: hàng × cột, theo tầng ---------- */
const YD_LINE_COL = { Maersk: "#3B82F6", ONE: "#EC4899", "CMA CGM": "#1E3A8A", "Wan Hai": "#F97316", Evergreen: "#16A34A", COSCO: "#0EA5E9", MSC: "#A16207", "Yang Ming": "#7C3AED" };
function YdBayView({ b, tier, setTier, sel, onCont, placing, onSlot, hlFn }) {
  const blk = YD_BLK[b]; ydReindex();
  const cell = 26;
  return (
    <div>
      <div className="row" style={{ gap: 6, marginBottom: 8, alignItems: "center" }}>
        <span className="muted" style={{ fontSize: 12 }}>Tầng</span>
        {Array.from({ length: YD_TIERS }, (_, i) => i + 1).map(t => <button key={t} className={`btn btn-sm ${tier === t ? "primary" : ""}`} style={{ minWidth: 32 }} onClick={() => setTier(t)}>{t}</button>)}
        <span className="muted" style={{ fontSize: 11.5, marginLeft: "auto" }}>Hàng 01–{ydPad(blk.rows)} · cột 1–{YD_LANES}</span>
      </div>
      <div style={{ overflowX: "auto", paddingBottom: 6 }}>
        <div style={{ display: "grid", gridTemplateColumns: `28px repeat(${blk.rows}, ${cell}px)`, gap: 2, width: "max-content" }}>
          <div></div>{Array.from({ length: blk.rows }, (_, i) => <div key={i} className="mono muted" style={{ fontSize: 9.5, textAlign: "center" }}>{ydPad(i + 1)}</div>)}
          {Array.from({ length: YD_LANES }, (_, li) => li + 1).map(lane => (
            <React.Fragment key={lane}>
              <div className="mono muted" style={{ fontSize: 10, alignSelf: "center" }}>C{lane}</div>
              {Array.from({ length: blk.rows }, (_, bi) => bi + 1).map(bay => {
                const no = ydAt(b, bay, lane, tier); const c = no && DD_CONT_REG[no];
                const head = c && c.pos.bay === bay;
                const why = placing && !no ? ydCheck(placing, b, bay, lane, tier) : "x";
                const ok = placing && !no && !why;
                const isSel = c && sel === c.no;
                const bg = c ? (YD_LINE_COL[c.line] || "#64748B") : ok ? "#BBF7D0" : "#F1F5F9";
                const dim = c && hlFn && !hlFn(c);
                return (
                  <div key={bay} title={c ? `${tlContFmt(c.no)} · ${c.type} · ${c.fe === "F" ? "Hàng" : "Rỗng"} · ${c.line}` : ok ? "Chọn ô này" : placing ? why : `${b}-${ydPad(bay)}-${lane}-${tier} · trống`}
                    onClick={() => c ? onCont(c.no) : ok && onSlot({ b, bay, lane, tier })}
                    style={{ height: cell, borderRadius: 3, background: bg, opacity: dim ? 0.25 : 1, cursor: c || ok ? "pointer" : "default",
                      outline: isSel ? "2px solid #DC2626" : ok ? "1px dashed #16A34A" : "none", outlineOffset: -1,
                      color: "#fff", fontSize: 8.5, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Geist Mono',monospace" }}>
                    {c ? (head ? (c.type.startsWith("4") ? "40" : "20") + (c.fe === "E" ? "E" : "") : "·") : ""}
                  </div>);
              })}
            </React.Fragment>
          ))}
        </div>
      </div>
      <div className="row" style={{ gap: 10, flexWrap: "wrap", marginTop: 6, fontSize: 11 }}>
        {Object.entries(YD_LINE_COL).map(([l, col]) => <span key={l} style={{ display: "inline-flex", alignItems: "center", gap: 4 }}><i style={{ width: 9, height: 9, borderRadius: 2, background: col, display: "inline-block" }}></i>{l}</span>)}
        {placing && <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}><i style={{ width: 9, height: 9, borderRadius: 2, background: "#BBF7D0", border: "1px dashed #16A34A", display: "inline-block" }}></i>Ô hợp lệ</span>}
      </div>
    </div>
  );
}

/* ---------- Màn Bãi container ---------- */
const DdYardMapScreen = ({ go }) => {
  const [, force] = React.useState(0);
  const refresh = () => force(n => n + 1);
  const [toast, flash] = useKdToast();
  const [tab, setTab] = React.useState("map");
  const [pick, setPick] = React.useState("C3");
  const [tier, setTier] = React.useState(1);
  const [sel, setSel] = React.useState(null);
  const [placing, setPlacing] = React.useState(null);
  const [vas, setVas] = React.useState(true);
  const [q, setQ] = React.useState("");
  const [focus, setFocus] = React.useState(null);
  const [view, setView] = React.useState("");
  const [f, setF] = React.useState({ line: "", customer: "", fe: "", kind: "", dwell: 0, job: "" });
  ydReindex();
  const inYard = ydInYard();
  const pending = Object.values(DD_CONT_REG).filter(c => c.inPort && !c.pos);
  const hlOn = f.line || f.customer || f.fe || f.kind || f.dwell || f.job;
  const hlFn = hlOn ? (c) => (!f.line || c.line === f.line) && (!f.customer || c.customer === f.customer) && (!f.fe || c.fe === f.fe) && (!f.kind || (f.kind === "rf" ? c.type.includes("RF") : !c.type.includes("RF"))) && (!f.dwell || ddDwell(c.gateInAt) >= f.dwell) && (!f.job || c.job === f.job) : null;
  const stats = {}; YD_BLOCKS.forEach(b => stats[b.id] = { teu: 0, n: 0, hit: 0 });
  inYard.forEach(c => { const s = stats[c.pos.b]; if (!s) return; s.teu += ydTeu(c); s.n++; if (hlFn && hlFn(c)) s.hit++; });
  YD_BLOCKS.forEach(b => stats[b.id].pct = stats[b.id].teu / b.cap);
  const zone = Object.entries(YD_YARDS).map(([k, y]) => { const teu = YD_BLOCKS.filter(b => b.yard === k).reduce((s, b) => s + stats[b.id].teu, 0); return { k, ...y, teu, pct: teu / y.cap }; });
  const totTeu = zone.reduce((s, z) => s + z.teu, 0), totCap = zone.reduce((s, z) => s + z.cap, 0);
  const long10 = inYard.filter(c => ddDwell(c.gateInAt) >= 10).length;
  const lines = [...new Set(inYard.map(c => c.line))].sort();
  const jobs = DD_JOBS.filter(j => j.kind === "cont");
  const selC = sel && DD_CONT_REG[sel];

  const find = () => {
    const k = q.toUpperCase().replace(/\s/g, ""); if (k.length < 4) return;
    const c = Object.values(DD_CONT_REG).find(x => x.inPort && x.no.includes(k));
    if (!c) return flash("Không tìm thấy cont đang ở cảng");
    if (!c.pos) { setTab("pending"); setSel(c.no); return flash("Cont đang chờ xếp bãi"); }
    setTab("map"); setPick(c.pos.b); setTier(c.pos.tier); setSel(c.no); setFocus(c.pos.b); setView(YD_BLK[c.pos.b].yard); setTimeout(() => setFocus(null), 4000);
  };
  const startPlace = (c, b) => { setPlacing(c); setSel(c.no); const s = ydSuggest(c, 1)[0]; const blk = b || (s && s.b); if (blk) { setPick(blk); setView(YD_BLK[blk].yard); setTier((ydFirstFree(c, blk) || { tier: 1 }).tier); } setTab("map"); };
  const doPlace = (pos) => {
    const c = placing; const moving = !!c.pos;
    ydPlace(c, pos, DD_ME.id, moving ? "Đảo chuyển" : "Hạ bãi");
    if (moving && vas && c.customer) { const ct = ddActiveContracts(c.customer)[0]; DD_VAS.unshift({ id: ddNewId("DV"), no: c.no, customer: c.customer, type: "Xếp dỡ / đảo chuyển", qty: 1, unit: "lượt", at: ddNow(), by: DD_ME.id, contract: ct ? ct.id : null }); }
    setPlacing(null); setTier(pos.tier); refresh(); flash(`${tlContFmt(c.no)} → ${c.loc}${moving && vas && c.customer ? " · đã ghi dịch vụ đảo chuyển" : ""}`);
  };

  const Kpi = ({ l, v, d, c }) => <div className="card" style={{ padding: "10px 14px" }}><div className="muted" style={{ fontSize: 11.5 }}>{l}</div><div style={{ fontSize: 20, fontWeight: 700, color: c }}>{v}</div><div className="muted" style={{ fontSize: 11 }}>{d}</div></div>;
  const blk = YD_BLK[pick];

  return (
    <div className="page" style={{ maxWidth: 1560 }}>
      <div className="page-head">
        <div><h1 style={{ display: "flex", alignItems: "center", gap: 10 }}><Icon name="grid" size={20}/>Bãi container</h1><div className="sub">Sơ đồ bãi ICD VNL theo bản vẽ MB BÃI ICD 25.09.2026 · xem, tìm cont (hạ bãi, đảo chuyển do tally làm trên App Tally) · cont · hệ thống là nơi ghi vị trí chính</div></div>
        <div className="actions">
          <div className="search" style={{ margin: 0, width: 260 }}><Icon name="search" size={14} className="muted"/><input value={q} onChange={e => setQ(e.target.value)} onKeyDown={e => e.key === "Enter" && find()} placeholder="Tìm số cont (≥ 4 ký tự), Enter" /></div>
          <button className="btn" onClick={find}>Tìm</button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.3fr repeat(5, 1fr) 1fr", gap: 10, marginBottom: 14 }}>
        <Kpi l="Toàn bãi" v={`${Math.round(totTeu / totCap * 100)}%`} d={`${ddNum(totTeu)} / ${ddNum(totCap)} TEU · ${ddNum(inYard.length)} cont`} />
        {zone.map(z => <Kpi key={z.k} l={`${z.zone} · ${z.name}`} v={`${Math.round(z.pct * 100)}%`} d={`${ddNum(z.teu)} / ${ddNum(z.cap)} TEU`} c={z.pct > 0.85 ? "var(--st-danger)" : z.pct > 0.65 ? "var(--st-warning)" : undefined} />)}
        <Kpi l="Chờ xếp bãi · lưu ≥10 ngày" v={`${pending.length} · ${long10}`} d="cont" c={pending.length ? "var(--st-warning)" : undefined} />
      </div>

      {placing && (
        <div style={{ padding: "10px 14px", borderRadius: "var(--r-sm)", background: "#ECFDF5", border: "1px solid #A7F3D0", display: "flex", gap: 12, alignItems: "center", marginBottom: 12, fontSize: 13 }}>
          <b>{placing.pos ? "Đảo chuyển" : "Hạ bãi"} {tlContFmt(placing.no)}</b><span className="muted">{placing.type} · {placing.fe === "F" ? "Hàng" : "Rỗng"} · {placing.line}</span>
          <span>Gợi ý: {ydSuggest(placing).map(s => <button key={s.b} className={`btn btn-sm ${pick === s.b ? "primary" : ""}`} style={{ marginLeft: 4 }} onClick={() => { setPick(s.b); setTier(s.slot.tier); }}>{s.b} · {Math.round(s.pct * 100)}%{s.same ? ` · ${s.same} cont ${placing.line}` : ""}</button>)}</span>
          <span className="muted">→ chọn ô xanh ở mặt cắt bên phải, hoặc bấm block khác trên sơ đồ</span>
          {placing.pos && <label style={{ display: "flex", gap: 5, alignItems: "center", marginLeft: "auto" }}><input type="checkbox" checked={vas} onChange={e => setVas(e.target.checked)} />Ghi dịch vụ đảo chuyển cho KH</label>}
          <button className="btn btn-sm ghost" style={{ marginLeft: placing.pos ? 0 : "auto" }} onClick={() => setPlacing(null)}>Huỷ</button>
        </div>
      )}

      <div className="card">
        <DdTabs tab={tab} setTab={setTab} tabs={[["map", "Sơ đồ bãi", YD_BLOCKS.length], ["pending", "Chờ xếp bãi", pending.length], ["vas", "Dịch vụ cộng thêm", DD_VAS.length]]} />
        {tab === "map" && (
          <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) 470px", minHeight: 640 }}>
            <div style={{ borderRight: "1px solid var(--line)", display: "flex", flexDirection: "column" }}>
              <div className="row" style={{ gap: 8, padding: "10px 12px", flexWrap: "wrap", borderBottom: "1px solid var(--line)" }}>
                <span className="muted" style={{ fontSize: 12 }}>Làm nổi bật:</span>
                <select className="select" style={{ height: 30, fontSize: 12, width: 120 }} value={f.line} onChange={e => setF(s => ({ ...s, line: e.target.value }))}><option value="">Hãng tàu</option>{lines.map(l => <option key={l}>{l}</option>)}</select>
                <select className="select" style={{ height: 30, fontSize: 12, width: 150 }} value={f.customer} onChange={e => setF(s => ({ ...s, customer: e.target.value }))}><option value="">Khách hàng</option>{(window.KD_CUSTOMERS || []).map(c => <option key={c.id} value={c.id}>{c.shortName || c.name}</option>)}</select>
                <select className="select" style={{ height: 30, fontSize: 12, width: 100 }} value={f.fe} onChange={e => setF(s => ({ ...s, fe: e.target.value }))}><option value="">F/E</option><option value="F">Hàng</option><option value="E">Rỗng</option></select>
                <select className="select" style={{ height: 30, fontSize: 12, width: 110 }} value={f.kind} onChange={e => setF(s => ({ ...s, kind: e.target.value }))}><option value="">Loại cont</option><option value="rf">Cont lạnh</option><option value="dry">Cont khô</option></select>
                <select className="select" style={{ height: 30, fontSize: 12, width: 120 }} value={f.dwell} onChange={e => setF(s => ({ ...s, dwell: Number(e.target.value) }))}><option value={0}>Ngày lưu</option><option value={5}>≥ 5 ngày</option><option value={10}>≥ 10 ngày</option></select>
                <select className="select" style={{ height: 30, fontSize: 12, width: 140 }} value={f.job} onChange={e => setF(s => ({ ...s, job: e.target.value }))}><option value="">Job</option>{jobs.map(j => <option key={j.id} value={j.id}>{j.id}</option>)}</select>
                {hlOn && <button className="btn btn-sm ghost" onClick={() => setF({ line: "", customer: "", fe: "", kind: "", dwell: 0, job: "" })}>Bỏ lọc</button>}
                {hlOn && <span style={{ fontSize: 12, fontWeight: 600 }}>{inYard.filter(hlFn).length} cont khớp</span>}
              </div>
              <div style={{ position: "relative" }}>
                <div className="row" style={{ position: "absolute", top: 8, left: 8, gap: 4, zIndex: 2, flexWrap: "wrap" }}>
                  {[["", "Toàn bãi"], ...Object.entries(YD_YARDS).map(([k, y]) => [k, y.zone])].map(([k, l]) => <button key={l} className={`btn btn-sm ${view === k ? "primary" : ""}`} style={{ background: view === k ? undefined : "rgba(255,255,255,.92)" }} onClick={() => setView(k)}>{l}</button>)}
                </div>
                <YdMap stats={stats} pick={pick} onPick={(b) => { setPick(b); setTier(1); if (!placing) setSel(null); }} focus={focus} hl={hlOn} view={view} />
              </div>
              <div className="row" style={{ gap: 12, padding: "8px 12px", fontSize: 11, borderTop: "1px solid var(--line)", flexWrap: "wrap" }}>
                {hlOn ? <span className="muted">Màu đậm = nhiều cont khớp bộ lọc</span> : [["#E6ECF2", "Trống"], ["#BFE3D0", "< 40%"], ["#7CC8A4", "40–65%"], ["#F2C063", "65–85%"], ["#E5735C", "> 85%"]].map(([c, l]) => <span key={l} style={{ display: "inline-flex", gap: 4, alignItems: "center" }}><i style={{ width: 10, height: 10, background: c, borderRadius: 2, display: "inline-block" }}></i>{l}</span>)}
                <span style={{ display: "inline-flex", gap: 4, alignItems: "center" }}><i style={{ width: 10, height: 10, border: "1px dashed #2563EB", borderRadius: 2, display: "inline-block" }}></i>Block lạnh (B1–B3, giả định)</span>
              </div>
            </div>
            <div style={{ padding: 14, display: "flex", flexDirection: "column", gap: 12, overflowY: "auto", maxHeight: 760 }}>
              {blk && (<>
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                    <h3 style={{ margin: 0, fontSize: 18 }} className="mono">Block {blk.id}</h3>
                    <span className="muted" style={{ fontSize: 12 }}>{YD_YARDS[blk.yard].zone} · {ydKind(blk.id)}</span>
                  </div>
                  <div style={{ fontSize: 12.5, marginTop: 4 }}><b>{stats[blk.id].teu}</b> / {blk.cap} TEU · {stats[blk.id].n} cont · {Math.round(stats[blk.id].pct * 100)}% · {blk.rows} hàng</div>
                  <div style={{ height: 6, background: "var(--bg-sunken)", borderRadius: 3, marginTop: 6 }}><div style={{ width: Math.min(100, stats[blk.id].pct * 100) + "%", height: "100%", borderRadius: 3, background: ydHeat(stats[blk.id].pct) }}></div></div>
                </div>
                <YdBayView b={blk.id} tier={tier} setTier={setTier} sel={sel} onCont={(no) => { if (!placing) setSel(no); }} placing={placing} onSlot={doPlace} hlFn={hlFn} />
              </>)}
              {selC && !placing && (
                <div className="card" style={{ padding: 14, background: "var(--bg-canvas)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}><b className="mono" style={{ fontSize: 16 }}>{tlContFmt(selC.no)}</b><button className="icon-btn" onClick={() => setSel(null)}><Icon name="x" size={14}/></button></div>
                  <div style={{ display: "grid", gridTemplateColumns: "110px 1fr", gap: "4px 10px", fontSize: 12.5, marginTop: 8 }}>
                    <span className="muted">Vị trí</span><b className="mono">{selC.loc || "Chờ xếp bãi"}</b>
                    <span className="muted">Loại · F/E</span><span>{selC.type} · {selC.fe === "F" ? "Hàng" : "Rỗng"}</span>
                    <span className="muted">Hãng tàu</span><span>{selC.line}</span>
                    <span className="muted">Khách hàng</span><span>{selC.customer ? ddCus(selC.customer).name : "—"}</span>
                    <span className="muted">Job</span><span className="mono">{selC.job || "—"}</span>
                    <span className="muted">Vào bãi</span><span>{selC.gateInAt || "—"} · {selC.via || ""}</span>
                    <span className="muted">Số ngày lưu</span><span style={{ color: ddDwell(selC.gateInAt) >= 10 ? "var(--st-danger)" : ddDwell(selC.gateInAt) >= 5 ? "var(--st-warning)" : undefined, fontWeight: 600 }}>{ddDwell(selC.gateInAt)} ngày</span>
                    <span className="muted">Lệnh hãng tàu</span><span className="mono">{(window.DD_SHIP_ORDERS || []).filter(o => o.conts.includes(selC.no)).map(o => o.id).join(", ") || "—"}</span>
                    <span className="muted">Dịch vụ</span><span>{DD_VAS.filter(v => v.no === selC.no).map(v => `${v.type} ×${v.qty}`).join(", ") || "—"}</span>
                  </div>
                  <div className="row" style={{ gap: 8, marginTop: 10 }}>
                    <span className="muted" style={{ fontSize: 11.5 }}>Đảo chuyển: tally làm trên App Tally › Bãi cont</span>
                    {ydBlocked(selC) && <span style={{ fontSize: 11.5, color: "var(--st-warning)" }}>Có cont đè phía trên: {tlContFmt(ydBlocked(selC))}</span>}
                  </div>
                  <div className="muted" style={{ fontSize: 11.5, marginTop: 10, marginBottom: 4 }}>Lịch sử di chuyển</div>
                  {(selC.moves || []).slice(0, 6).map((m, i) => <div key={i} style={{ fontSize: 12, display: "flex", gap: 8 }}><span className="mono muted" style={{ width: 110 }}>{m.at}</span><span>{m.from} → <b className="mono">{m.to}</b>{m.note ? ` · ${m.note}` : ""}</span></div>)}
                </div>
              )}
            </div>
          </div>
        )}
        {tab === "pending" && (
          <div className="tbl-wrap"><table className="tbl">
            <thead><tr><th>Số cont</th><th style={{ width: 110 }}>Loại</th><th style={{ width: 100 }}>Hãng</th><th>Khách hàng · Job</th><th style={{ width: 160 }}>Vào cảng</th><th style={{ width: 200 }}>Gợi ý block</th><th style={{ width: 110 }}></th></tr></thead>
            <tbody>
              {pending.length === 0 && <tr><td colSpan={7} className="muted" style={{ textAlign: "center", padding: 24 }}>Không có cont chờ xếp bãi</td></tr>}
              {pending.map(c => <tr key={c.no} style={{ background: sel === c.no ? "var(--st-warning-bg)" : undefined }}>
                <td className="mono" style={{ fontWeight: 600 }}>{tlContFmt(c.no)}</td><td style={{ fontSize: 12 }}>{c.type} · {c.fe === "F" ? "Hàng" : "Rỗng"}</td><td style={{ fontSize: 12 }}>{c.line}</td>
                <td style={{ fontSize: 12 }}>{c.customer ? ddCusShort(c.customer) : "—"}<div className="muted mono" style={{ fontSize: 11 }}>{c.job || ""}</div></td>
                <td style={{ fontSize: 12 }}>{c.gateInAt}<div className="muted" style={{ fontSize: 11 }}>{c.via}</div></td>
                <td style={{ fontSize: 12 }}>{ydSuggest(c).map(s => s.b).join(" · ") || <span style={{ color: "var(--st-danger)" }}>Hết chỗ phù hợp</span>}</td>
                <td><span className="muted" style={{ fontSize: 11.5 }}>Tally hạ bãi trên App Tally</span></td></tr>)}
            </tbody></table></div>
        )}
        {tab === "vas" && <DdYardScreen go={go} embed />}
      </div>
      <div className="muted" style={{ fontSize: 11.5, marginTop: 8 }}>Sức chứa theo bản vẽ thiết kế. Giả định cần xác nhận: mỗi hàng 4 cột, tối đa 4 tầng; block lạnh B1–B3; khu E chỉ cont rỗng (OI-KT-20…22). Dữ liệu cont nền là mẫu để minh hoạ.</div>
      <KdToast text={toast} />
    </div>
  );
};

Object.assign(window, { DdYardMapScreen, YD_BLOCKS, ydReindex, ydLocStr, ydSuggest, ydInYard });
