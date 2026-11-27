/* Điều độ khai thác — Bãi container (phần hoàn thiện)
   · Danh sách cont trong bãi: lọc, chọn nhiều, xuất Excel
   · Lịch sử di chuyển 1 cont: gate in/out, hạ bãi, đảo chuyển, lệnh luân chuyển, dịch vụ
   · Luân chuyển nhiều cont: đảo chuyển ngay (trong bãi) hoặc tạo LỆNH LUÂN CHUYỂN (giữa các khu, có xe kéo) — tally / KHTH xác nhận từng cont
   · Báo cáo tồn bãi: theo khu, block, hãng tàu, khách hàng, thời gian lưu bãi — xuất Excel nhiều sheet
   Dữ liệu: cont_reg (vị trí + moves), gate_log, yard_moves (lệnh luân chuyển). */

const DD_YARD_MOVES = DD_BOOT.docs.yard_moves;
const ydKey = (at) => at ? `${at.slice(6, 10)}${at.slice(3, 5)}${at.slice(0, 2)}${at.slice(11)}` : "";
const ydSize = (c) => (c.type || "").startsWith("45") ? "45" : (c.type || "").startsWith("4") ? "40" : "20";
const ydFeTxt = (fe) => fe === "E" ? "Rỗng" : "Hàng";
const ydIsRf = (c) => (c.type || "").includes("RF");
const ydCanMove = () => ddCan("KHTH", "TP");
/* Thông tin cont trong danh sách job (booking, tình trạng, seal) */
const ydJobCont = (c) => { const j = c.job && DD_JOBS.find(x => x.id === c.job); return (j && (j.conts || []).find(x => x.no === c.no)) || {}; };
const ydOpenLc = (no) => DD_YARD_MOVES.find(l => l.status === "open" && l.items.some(i => i.no === no && !i.to && !i.skip));
const ydStamp = () => { const n = window.ddVnNow(); return `${n.date.replace(/\//g, "-")}_${n.time.replace(":", "")}`; };

/* Kế hoạch chuyển nhiều cont vào các block đích. Làm thử trên chỉ mục ô (cont tầng trên chuyển trước),
   xong trả lại vị trí cũ. Trả về [{ c, from, pos } | { c, from, err }] theo thứ tự thực hiện. */
const ydPlan = (list, targets) => {
  const saved = list.map(c => [c, c.pos]);
  const out = [];
  const order = [...list].sort((a, b) => (b.pos ? b.pos.tier : 0) - (a.pos ? a.pos.tier : 0) || String(ydLocStr(a.pos) || "").localeCompare(String(ydLocStr(b.pos) || "")));
  try {
    order.forEach(c => {
      ydReindex();
      const old = c.pos, from = old ? ydLocStr(old, c) : "Chờ xếp bãi";
      const top = old && ydBlocked(c);
      if (top) { out.push({ c, from, err: list.some(x => x.no === top) ? `Bị cont ${tlContFmt(top)} đè — cont đó cũng không chuyển được` : `Bị cont ${tlContFmt(top)} đè (chưa có trong danh sách chuyển)` }); return; }
      c.pos = null; ydReindex(); /* nhấc cont lên: ô cũ trống */
      const slot = ydFindSlot(c, targets, old); /* ưu tiên ô không có cảnh báo quy tắc */
      if (!slot) { c.pos = old; out.push({ c, from, err: "Block đích hết chỗ phù hợp (theo quy tắc xếp bãi)" }); return; }
      const pos = { b: slot.b, bay: slot.bay, lane: slot.lane, tier: slot.tier };
      c.pos = pos; out.push({ c, from, pos, warn: slot.warn });
    });
  } finally { saved.forEach(([c, p]) => { c.pos = p; }); ydReindex(); }
  return out;
};

const ydVas = (c, by) => {
  if (!c.customer || typeof DD_VAS === "undefined") return;
  const ct = ddActiveContracts(c.customer)[0];
  DD_VAS.unshift({ id: ddNewId("DV"), no: c.no, customer: c.customer, type: "Xếp dỡ / đảo chuyển", qty: 1, unit: "lượt", at: ddNow(), by, contract: ct ? ct.id : null });
};

/* Xác nhận đã chuyển 1 cont của lệnh luân chuyển — trả về lý do nếu không làm được */
const ydLcDo = (lc, no, by) => {
  const it = lc.items.find(x => x.no === no); const c = DD_CONT_REG[no];
  if (!it || it.to || it.skip) return "Cont này đã xử lý";
  if (lc.status !== "open") return "Lệnh không còn mở";
  if (!c || !c.inPort) return "Cont không còn trong cảng";
  ydReindex();
  const top = c.pos && ydBlocked(c); if (top) return `Bị cont ${tlContFmt(top)} đè — chuyển cont đó trước`;
  let pos = it.plan && !ydCheck(c, it.plan.b, it.plan.bay, it.plan.lane, it.plan.tier) ? it.plan : null;
  if (!pos) { const p = ydPlan([c], lc.toBlocks)[0]; if (!p || !p.pos) return "Block đích hết chỗ phù hợp"; pos = p.pos; }
  ydPlace(c, pos, by, `Luân chuyển ${lc.id}${lc.truck ? ` · xe ${lc.truck}` : ""}`);
  if (lc.vas) ydVas(c, by);
  Object.assign(it, { to: c.loc, at: ddNow(), by });
  lc.log.unshift({ at: ddNow(), by, text: `${tlContFmt(no)}: ${it.from} → ${c.loc}` });
  if (lc.items.every(x => x.to || x.skip)) { lc.status = "done"; lc.doneAt = ddNow(); lc.log.unshift({ at: ddNow(), by, text: "Hoàn thành lệnh" }); }
  return null;
};
const ydLcTarget = (lc) => lc.toBlocks.length <= 4 ? lc.toBlocks.join(", ") : `${YD_YARDS[lc.toZone] ? YD_YARDS[lc.toZone].zone : lc.toZone} (${lc.toBlocks.length} block)`;

/* ---------- Xuất Excel ---------- */
const ydSheet = (X, title, sub, head, rows, widths) => {
  const ws = X.utils.aoa_to_sheet([[title], [sub], [], head, ...rows]);
  ws["!cols"] = (widths || head.map(() => 14)).map(w => ({ wch: w }));
  return ws;
};
const YD_LIST_HEAD = ["STT", "Số cont", "Loại", "Cỡ", "Hàng/Rỗng", "Hãng tàu", "Khách hàng", "Job", "Mã booking", "Số seal", "Tình trạng cont", "Trạng thái", "Khu", "Block", "Hàng", "Cột", "Tầng", "Vị trí", "Vào bãi", "Số ngày lưu", "Qua", "Lệnh luân chuyển"];
const YD_LIST_W = [5, 14, 7, 5, 9, 11, 22, 15, 15, 12, 16, 12, 6, 7, 6, 5, 5, 13, 17, 10, 22, 18];
const ydListRow = (c, i) => {
  const jc = ydJobCont(c), p = c.pos, lc = ydOpenLc(c.no);
  return [i + 1, c.no, c.type || "", ydSize(c), ydFeTxt(c.fe), c.line || "", c.customer ? ddCus(c.customer).name : "", c.job || "", jc.booking || "", c.seal || jc.seal || "", jc.cond || "",
    p ? "Trong bãi" : "Chờ xếp bãi", p ? (YD_BLK[p.b] || {}).yard || "" : "", p ? p.b : "", p ? ydPad(ydBayNo(p.bay, ydLen(c))) : "", p ? p.lane : "", p ? p.tier : "", c.loc || "", c.gateInAt || "", ddDwell(c.gateInAt), c.via || "", lc ? lc.id : ""];
};
const ydExportList = (rows, filterTxt) => ddLoadXlsx().then(X => {
  const wb = X.utils.book_new();
  X.utils.book_append_sheet(wb, ydSheet(X, "DANH SÁCH CONT TRONG BÃI · ICD VNL", `Xuất lúc ${ddNow()} · ${rows.length} cont · ${filterTxt || "không lọc"}`, YD_LIST_HEAD, rows.map(ydListRow), YD_LIST_W), "Danh sách cont");
  X.writeFile(wb, `Cont_trong_bai_${ydStamp()}.xlsx`);
});

/* Xuất SƠ ĐỒ BÃI ra Excel: mỗi block 1 sheet, vẽ lưới hàng × cột cho từng tầng (tầng cao ở trên, như nhìn mặt cắt),
   ô ghi số cont + loại (cont 40'/45' gộp 2 ô). Kèm sheet tổng hợp block và danh sách cont của phạm vi xuất.
   scope: { blocks: [...], name, hlFn?, filterTxt? } — hlFn: chỉ đánh dấu cont khớp bộ lọc đang làm nổi bật */
const ydExportMap = ({ blocks, name, hlFn, filterTxt }) => ddLoadXlsx().then(X => {
  ydReindex();
  const wb = X.utils.book_new();
  const inYard = ydInYard().filter(c => blocks.includes(c.pos.b));
  const used = blocks.filter(b => inYard.some(c => c.pos.b === b));
  const sheetBlocks = blocks.length === 1 ? blocks : used; /* 1 block: xuất cả khi trống */
  const sub = `Xuất lúc ${ddNow()} · ${inYard.length} cont · ${inYard.reduce((s, c) => s + ydTeu(c), 0)} TEU${filterTxt ? ` · đánh dấu (*) cont khớp lọc: ${filterTxt}` : ""}`;
  /* Sheet tổng hợp */
  const sum = blocks.map(b => { const cs = inYard.filter(c => c.pos.b === b), teu = cs.reduce((s, c) => s + ydTeu(c), 0); return [b, YD_BLK[b].yard, ydKind(b), YD_BLK[b].rows, YD_BLK[b].cap, teu, YD_BLK[b].cap ? `${Math.round(teu / YD_BLK[b].cap * 100)}%` : "", cs.length, cs.filter(c => c.fe !== "E").length, cs.filter(c => c.fe === "E").length, cs.length ? Math.max(...cs.map(c => c.pos.tier)) : 0]; });
  X.utils.book_append_sheet(wb, ydSheet(X, `SƠ ĐỒ BÃI · ${name.toUpperCase()}`, sub, ["Block", "Khu", "Loại block", "Số hàng", "Sức chứa TEU", "TEU", "% lấp đầy", "Số cont", "Hàng", "Rỗng", "Tầng cao nhất"], sum, [8, 6, 20, 8, 12, 8, 10, 8, 7, 7, 12]), "Tổng hợp");
  /* Mỗi block 1 sheet */
  sheetBlocks.forEach(b => {
    const blk = YD_BLK[b], cs = inYard.filter(c => c.pos.b === b), teu = cs.reduce((s, c) => s + ydTeu(c), 0);
    const top = Math.max(1, ...cs.map(c => c.pos.tier));
    const aoa = [[`BLOCK ${b} · ${YD_YARDS[blk.yard].zone} · ${ydKind(b)}`], [`${cs.length} cont · ${teu}/${blk.cap} TEU (${Math.round(teu / blk.cap * 100)}%) · ${blk.rows} hàng × ${YD_LANES} cột · xuất lúc ${ddNow()}${filterTxt ? ` · (*) = khớp lọc: ${filterTxt}` : ""}`], []];
    const merges = [];
    for (let tier = top; tier >= 1; tier--) {
      aoa.push([`TẦNG ${tier}`]);
      aoa.push(["Cột \\ Hàng", ...Array.from({ length: blk.rows }, (_, i) => ydPad(ydBayNo(i + 1)))]);
      for (let lane = 1; lane <= YD_LANES; lane++) {
        const r = aoa.length, row = [`C${lane}`];
        for (let bay = 1; bay <= blk.rows; bay++) {
          const no = ydAt(b, bay, lane, tier), c = no && DD_CONT_REG[no];
          if (!c) { row.push(""); continue; }
          if (c.pos.bay !== bay) { row.push(""); continue; } /* ô thứ 2 của cont 40'/45' — đã gộp */
          row.push(`${hlFn && hlFn(c) ? "* " : ""}${c.no} · ${c.type}${c.fe === "E" ? " · E" : ""} · ${c.line || ""}`);
          if (ydLen(c) === 2) merges.push({ s: { r, c: bay }, e: { r, c: bay + 1 } });
        }
        aoa.push(row);
      }
      aoa.push([]);
    }
    aoa.push(["Ghi chú: mỗi ô = 1 vị trí 20'; cont 40'/45' gộp 2 ô; E = rỗng; vị trí đọc Block-Hàng-Cột-Tầng (VD " + b + "-01-1-1)."]);
    const ws = X.utils.aoa_to_sheet(aoa);
    ws["!merges"] = merges;
    ws["!cols"] = [{ wch: 11 }, ...Array.from({ length: blk.rows }, () => ({ wch: 17 }))];
    X.utils.book_append_sheet(wb, ws, b);
  });
  /* Danh sách cont của phạm vi */
  const list = [...inYard].sort((a, b) => a.pos.b.localeCompare(b.pos.b, "en", { numeric: true }) || a.pos.bay - b.pos.bay || a.pos.lane - b.pos.lane || a.pos.tier - b.pos.tier);
  X.utils.book_append_sheet(wb, ydSheet(X, `DANH SÁCH CONT · ${name.toUpperCase()}`, sub, YD_LIST_HEAD, list.map(ydListRow), YD_LIST_W), "Danh sách cont");
  X.writeFile(wb, `So_do_bai_${name.replace(/[^\wÀ-ỹ]+/g, "_")}_${ydStamp()}.xlsx`);
  return { sheets: wb.SheetNames.length, conts: inYard.length };
});

/* =================== LỊCH SỬ DI CHUYỂN 1 CONT =================== */
const ydHistory = (no) => {
  const ev = [];
  (typeof DD_GATE_LOG !== "undefined" ? DD_GATE_LOG : []).filter(g => g.no === no).forEach(g => ev.push({ at: g.at, kind: g.dir === "in" ? "Gate In" : "Gate Out", col: g.dir === "in" ? "#0E7490" : "#7C3AED", by: g.by,
    text: `${g.ch === "river" ? "River gate" : "Cổng bộ"} · ${g.truck || "—"}${g.seal ? ` · seal ${g.seal}` : ""}${g.job ? ` · ${g.job}` : ""}${g.result && g.result !== "ok" ? ` · ${g.result}` : ""}${g.note ? ` · ${g.note}` : ""}` }));
  const c = DD_CONT_REG[no];
  ((c && c.moves) || []).forEach(m => ev.push({ at: m.at, kind: m.from === "Chờ xếp bãi" ? "Hạ bãi" : /^Luân chuyển/.test(m.note || "") ? "Luân chuyển" : "Đảo chuyển", col: m.from === "Chờ xếp bãi" ? "#16A34A" : "#D97706", by: m.by, text: `${m.from} → ${m.to}${m.note ? ` · ${m.note}` : ""}` }));
  DD_YARD_MOVES.filter(l => l.items.some(i => i.no === no)).forEach(l => ev.push({ at: l.at, kind: "Lệnh luân chuyển", col: "#64748B", by: l.by, text: `${l.id} · đích ${ydLcTarget(l)}${l.truck ? ` · xe ${l.truck}` : ""}${l.status === "cancelled" ? " · đã huỷ" : ""}` }));
  (typeof DD_VAS !== "undefined" ? DD_VAS : []).filter(v => v.no === no).forEach(v => ev.push({ at: v.at, kind: "Dịch vụ", col: "#0F766E", by: v.by, text: `${v.type} × ${v.qty} ${v.unit}` }));
  return ev.sort((a, b) => ydKey(b.at).localeCompare(ydKey(a.at)));
};

const DdContHistory = ({ no, onClose, onLocate }) => {
  const c = DD_CONT_REG[no] || { no };
  const jc = ydJobCont(c);
  const ev = ydHistory(no);
  const nMove = ((c.moves) || []).filter(m => m.from !== "Chờ xếp bãi").length;
  const lc = ydOpenLc(no);
  const exportOne = () => ddLoadXlsx().then(X => {
    const wb = X.utils.book_new();
    X.utils.book_append_sheet(wb, ydSheet(X, `LỊCH SỬ CONT ${tlContFmt(no)}`, `Xuất lúc ${ddNow()} · ${c.type || ""} · ${c.line || ""} · ${c.inPort ? `đang ở ${c.loc || "chờ xếp bãi"}` : "đã ra khỏi cảng"}`,
      ["Thời gian", "Sự kiện", "Chi tiết", "Người thực hiện"], ev.map(e => [e.at, e.kind, e.text, ddPerson(e.by).name]), [17, 16, 70, 20]), "Lịch sử");
    X.writeFile(wb, `Lich_su_${no}_${ydStamp()}.xlsx`);
  });
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" style={{ maxWidth: 820 }} onClick={e => e.stopPropagation()}>
        <div className="modal-head"><h3>Lịch sử cont <span className="mono">{tlContFmt(no)}</span></h3><button className="icon-btn" onClick={onClose}><Icon name="x" size={14}/></button></div>
        <div className="modal-body">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "8px 14px", fontSize: 12.5, marginBottom: 14 }}>
            {[["Trạng thái", c.inPort ? (c.pos ? "Trong bãi" : "Chờ xếp bãi") : c.gateOutAt ? "Đã ra cảng" : "—"], ["Vị trí", c.loc || "—"], ["Loại · F/E", `${c.type || "—"} · ${ydFeTxt(c.fe)}`], ["Hãng tàu", c.line || "—"],
              ["Khách hàng", c.customer ? ddCusShort(c.customer) : "—"], ["Job", c.job || "—"], ["Booking · seal", `${jc.booking || "—"} · ${c.seal || jc.seal || "—"}`], ["Tình trạng", jc.cond || "—"],
              ["Vào bãi", c.gateInAt || "—"], ["Ra cảng", c.gateOutAt || "—"], ["Ngày lưu", c.inPort ? `${ddDwell(c.gateInAt)} ngày` : "—"], ["Số lần đảo chuyển", nMove]].map(([l, v]) => (
              <div key={l}><div className="muted" style={{ fontSize: 11 }}>{l}</div><div style={{ fontWeight: 600 }} className={/Vị trí|Job/.test(l) ? "mono" : ""}>{v}</div></div>))}
          </div>
          {lc && <div className="badge warning" style={{ marginBottom: 10 }}>Đang trong lệnh luân chuyển {lc.id} → {ydLcTarget(lc)}</div>}
          {ev.length === 0 ? <div className="muted" style={{ textAlign: "center", padding: 20 }}>Chưa có sự kiện nào được ghi cho cont này.</div> : (
            <div style={{ borderLeft: "2px solid var(--line)", marginLeft: 6, paddingLeft: 14 }}>
              {ev.map((e, i) => (
                <div key={i} style={{ position: "relative", padding: "6px 0 10px" }}>
                  <i style={{ position: "absolute", left: -21, top: 10, width: 10, height: 10, borderRadius: 99, background: e.col, display: "block" }}></i>
                  <div style={{ fontSize: 12.5 }}><b style={{ color: e.col }}>{e.kind}</b> · {e.text}</div>
                  <div className="muted" style={{ fontSize: 11 }}><span className="mono">{e.at}</span> · {ddPerson(e.by).name}</div>
                </div>))}
            </div>)}
        </div>
        <div className="modal-foot">
          <button className="btn" onClick={exportOne}><Icon name="download" size={13}/> Xuất Excel</button>
          {c.inPort && c.pos && onLocate && <button className="btn" onClick={() => { onLocate(c); onClose(); }}>Xem trên sơ đồ</button>}
          <button className="btn primary" onClick={onClose}>Đóng</button>
        </div>
      </div>
    </div>
  );
};

/* =================== LUÂN CHUYỂN NHIỀU CONT =================== */
const DdYardMoveModal = ({ conts, onClose, onDone }) => {
  const z0 = (conts.find(c => c.pos) || {}).pos;
  const [mode, setMode] = React.useState("order");
  const [zone, setZone] = React.useState(z0 ? YD_BLK[z0.b].yard : "C");
  const [blocks, setBlocks] = React.useState([]);
  const [truck, setTruck] = React.useState("");
  const [note, setNote] = React.useState("");
  const [vas, setVas] = React.useState(true);
  const zoneBlocks = YD_BLOCKS.filter(b => b.yard === zone).map(b => b.id).sort((a, b) => a.localeCompare(b, "en", { numeric: true }));
  const targets = blocks.length ? blocks : zoneBlocks;
  const plan = React.useMemo(() => ydPlan(conts, targets), [conts, targets.join(",")]);
  const ok = plan.filter(p => p.pos), bad = plan.filter(p => p.err);
  const tractors = (typeof DD_VEHICLES !== "undefined" ? DD_VEHICLES : []).filter(v => v && v.plate && !v.ext);
  const toggle = (b) => setBlocks(s => s.includes(b) ? s.filter(x => x !== b) : [...s, b]);
  const save = () => {
    if (!ok.length) return;
    if (mode === "now") {
      ok.forEach(p => { ydPlace(p.c, p.pos, DD_ME.id, `Luân chuyển hàng loạt${note.trim() ? ` · ${note.trim()}` : ""}`); if (vas) ydVas(p.c, DD_ME.id); });
      onDone(`Đã chuyển ${ok.length} cont vào ${[...new Set(ok.map(p => p.pos.b))].join(", ")}`);
    } else {
      const id = ddNewId("LC");
      DD_YARD_MOVES.unshift({ id, at: ddNow(), by: DD_ME.id, toZone: zone, toBlocks: [...new Set(ok.map(p => p.pos.b)), ...targets.filter(b => !ok.some(p => p.pos.b === b))].slice(0, 40),
        truck: truck.trim() || null, note: note.trim() || null, vas, status: "open",
        items: ok.map(p => ({ no: p.c.no, from: p.from, plan: p.pos, to: null, at: null, by: null })),
        log: [{ at: ddNow(), by: DD_ME.id, text: `Tạo lệnh: ${ok.length} cont → ${zone}${truck.trim() ? ` · xe ${truck.trim()}` : ""}` }] });
      onDone(`Đã tạo lệnh luân chuyển ${id} · ${ok.length} cont`);
    }
  };
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" style={{ maxWidth: 900 }} onClick={e => e.stopPropagation()}>
        <div className="modal-head"><h3>Luân chuyển {conts.length} cont</h3><button className="icon-btn" onClick={onClose}><Icon name="x" size={14}/></button></div>
        <div className="modal-body">
          <div className="row" style={{ gap: 8, marginBottom: 12 }}>
            {[["order", "Tạo lệnh luân chuyển", "Giao tally / xe kéo thực hiện, xác nhận từng cont — dùng khi chuyển giữa các khu"], ["now", "Đảo chuyển ngay", "Ghi vị trí mới ngay bây giờ (cont đã được chuyển xong ngoài hiện trường)"]].map(([k, l, d]) => (
              <button key={k} onClick={() => setMode(k)} style={{ flex: 1, textAlign: "left", padding: "10px 12px", borderRadius: "var(--r-md)", cursor: "pointer", border: `1px solid ${mode === k ? "var(--brand-ink)" : "var(--line)"}`, background: mode === k ? "var(--bg-canvas)" : "var(--bg-surface)" }}>
                <b style={{ fontSize: 13 }}>{l}</b><div className="muted" style={{ fontSize: 11.5, marginTop: 2 }}>{d}</div></button>))}
          </div>
          <div className="field"><label>Khu đích</label>
            <div className="row" style={{ gap: 6, flexWrap: "wrap" }}>{Object.entries(YD_YARDS).map(([k, y]) => <button key={k} className={`btn btn-sm ${zone === k ? "primary" : ""}`} onClick={() => { setZone(k); setBlocks([]); }}>{y.zone} · {y.name}</button>)}</div>
          </div>
          <div className="field"><label>Block đích <span className="opt">— không chọn: hệ thống xếp lần lượt vào các block của khu</span></label>
            <div className="row" style={{ gap: 4, flexWrap: "wrap" }}>{zoneBlocks.map(b => { const pct = ydBlockTeu(b) / YD_BLK[b].cap; return <button key={b} className={`btn btn-sm ${blocks.includes(b) ? "primary" : ""}`} style={{ minWidth: 56 }} title={`${Math.round(pct * 100)}% · ${ydKind(b)}`} onClick={() => toggle(b)}>{b} <span className="muted" style={{ fontSize: 10.5, marginLeft: 3, color: blocks.includes(b) ? "#fff" : undefined }}>{Math.round(pct * 100)}%</span></button>; })}</div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: mode === "order" ? "1fr 2fr" : "2fr", gap: 12 }}>
            {mode === "order" && <div className="field"><label>Xe kéo <span className="opt">— không bắt buộc</span></label>
              <input className="input" list="yd-tractors" value={truck} onChange={e => setTruck(e.target.value.toUpperCase())} placeholder="Biển số xe kéo" />
              <datalist id="yd-tractors">{tractors.map(v => <option key={v.plate} value={v.plate} />)}</datalist></div>}
            <div className="field"><label>Ghi chú <span className="opt">— lý do luân chuyển</span></label><input className="input" value={note} onChange={e => setNote(e.target.value)} placeholder="VD: dồn bãi khu C cho tàu mới" /></div>
          </div>
          <label style={{ display: "flex", gap: 6, alignItems: "center", fontSize: 12.5, marginBottom: 10 }}><input type="checkbox" checked={vas} onChange={e => setVas(e.target.checked)} />Ghi dịch vụ đảo chuyển cho khách hàng (mỗi cont 1 lượt)</label>
          <div className="tbl-wrap" style={{ maxHeight: 300, overflowY: "auto", border: "1px solid var(--line)", borderRadius: "var(--r-sm)" }}><table className="tbl">
            <thead><tr><th style={{ width: 36 }}>#</th><th>Số cont</th><th style={{ width: 110 }}>Loại</th><th style={{ width: 130 }}>Từ</th><th>Đến (dự kiến)</th></tr></thead>
            <tbody>{plan.map((p, i) => <tr key={p.c.no} style={{ background: p.err ? "var(--st-danger-bg, #FEF2F2)" : undefined }}>
              <td className="muted">{p.pos ? ok.indexOf(p) + 1 : "—"}</td><td className="mono" style={{ fontWeight: 600 }}>{tlContFmt(p.c.no)}</td><td style={{ fontSize: 12 }}>{p.c.type} · {ydFeTxt(p.c.fe)}</td>
              <td className="mono" style={{ fontSize: 12 }}>{p.from}</td>
              <td style={{ fontSize: 12 }}>{p.pos ? <><b className="mono">{ydLocStr(p.pos, p.c)}</b>{p.warn && p.warn.length > 0 && <div style={{ color: "var(--st-warning)", fontSize: 11 }}>⚠ {p.warn.join("; ")}</div>}</> : <span style={{ color: "var(--st-danger)" }}>{p.err}</span>}</td></tr>)}</tbody>
          </table></div>
          <div className="muted" style={{ fontSize: 11.5, marginTop: 8 }}>Thứ tự # = thứ tự chuyển (cont tầng trên đi trước). {mode === "order" ? "Vị trí dự kiến được giữ khi xác nhận nếu ô còn trống; nếu đã bị chiếm, hệ thống tự chọn ô trống khác trong block đích." : ""}</div>
        </div>
        <div className="modal-foot">
          {bad.length > 0 && <span style={{ fontSize: 12, color: "var(--st-danger)", marginRight: "auto" }}>{bad.length} cont không chuyển được — sẽ bỏ qua</span>}
          <button className="btn ghost" onClick={onClose}>Huỷ</button>
          <button className="btn primary" disabled={!ok.length} onClick={save}>{mode === "now" ? `Chuyển ngay ${ok.length} cont` : `Tạo lệnh · ${ok.length} cont`}</button>
        </div>
      </div>
    </div>
  );
};

/* =================== TAB DANH SÁCH CONT =================== */
const YD_F0 = { q: "", st: "all", zone: "", block: "", line: "", customer: "", job: "", fe: "", size: "", kind: "", dwell: 0, sort: "loc" };
const DdYardList = ({ onLocate, onHistory, onMove, flash }) => {
  const [f, setF] = React.useState(YD_F0);
  const [selSet, setSelSet] = React.useState(() => new Set());
  const [limit, setLimit] = React.useState(200);
  const set = (k) => (e) => { const v = e.target.value; setF(s => ({ ...s, [k]: k === "dwell" ? Number(v) : v, ...(k === "zone" ? { block: "" } : {}) })); };
  const all = Object.values(DD_CONT_REG).filter(c => c.inPort);
  const qk = f.q.toUpperCase().replace(/[\s.-]/g, "");
  const rows = all.filter(c => {
    if (f.st === "yard" && !c.pos) return false; if (f.st === "pending" && c.pos) return false; if (f.st === "lc" && !ydOpenLc(c.no)) return false;
    if (f.zone && (!c.pos || YD_BLK[c.pos.b].yard !== f.zone)) return false; if (f.block && (!c.pos || c.pos.b !== f.block)) return false;
    if (f.line && c.line !== f.line) return false; if (f.customer && c.customer !== f.customer) return false; if (f.job && c.job !== f.job) return false;
    if (f.fe && c.fe !== f.fe) return false; if (f.size && ydSize(c) !== f.size) return false; if (f.kind && (f.kind === "rf") !== ydIsRf(c)) return false;
    if (f.dwell && ddDwell(c.gateInAt) < f.dwell) return false;
    if (qk) { const jc = ydJobCont(c); if (![c.no, jc.booking, c.seal || jc.seal].some(x => x && String(x).toUpperCase().replace(/[\s.-]/g, "").includes(qk))) return false; }
    return true;
  }).sort((a, b) => f.sort === "dwell" ? ddDwell(b.gateInAt) - ddDwell(a.gateInAt) : f.sort === "in" ? ydKey(b.gateInAt).localeCompare(ydKey(a.gateInAt)) : f.sort === "no" ? a.no.localeCompare(b.no)
    : (!!b.pos - !!a.pos) || (a.pos && b.pos ? a.pos.b.localeCompare(b.pos.b, "en", { numeric: true }) || a.pos.bay - b.pos.bay || a.pos.lane - b.pos.lane || a.pos.tier - b.pos.tier : 0));
  const lines = [...new Set(all.map(c => c.line).filter(Boolean))].sort();
  const cusIds = [...new Set(all.map(c => c.customer).filter(Boolean))];
  const jobIds = [...new Set(all.map(c => c.job).filter(Boolean))].sort();
  const blocksOfZone = YD_BLOCKS.filter(b => !f.zone || b.yard === f.zone).map(b => b.id).sort((a, b) => a.localeCompare(b, "en", { numeric: true }));
  const selRows = rows.filter(c => selSet.has(c.no));
  const toggle = (no) => setSelSet(s => { const n = new Set(s); n.has(no) ? n.delete(no) : n.add(no); return n; });
  const canSel = (c) => ydCanMove() && !ydOpenLc(c.no);
  const allSel = rows.length > 0 && rows.filter(canSel).every(c => selSet.has(c.no));
  const filterTxt = [f.st !== "all" && { yard: "trong bãi", pending: "chờ xếp bãi", lc: "đang có lệnh luân chuyển" }[f.st], f.zone && `khu ${f.zone}`, f.block && `block ${f.block}`, f.line && `hãng ${f.line}`, f.customer && `KH ${ddCusShort(f.customer)}`, f.job && f.job, f.fe && ydFeTxt(f.fe), f.size && `${f.size}'`, f.kind && (f.kind === "rf" ? "cont lạnh" : "cont khô"), f.dwell && `lưu ≥ ${f.dwell} ngày`, f.q && `tìm "${f.q}"`].filter(Boolean).join(" · ");
  const teu = rows.reduce((s, c) => s + ydTeu(c), 0);
  const S = { height: 30, fontSize: 12 };
  return (
    <div>
      <div className="row" style={{ gap: 6, padding: "10px 12px", flexWrap: "wrap", borderBottom: "1px solid var(--line)", alignItems: "center" }}>
        <div className="search" style={{ margin: 0, width: 210 }}><Icon name="search" size={13} className="muted"/><input value={f.q} onChange={set("q")} placeholder="Số cont / booking / seal" /></div>
        <select className="select" style={{ ...S, width: 130 }} value={f.st} onChange={set("st")}><option value="all">Tất cả ở cảng</option><option value="yard">Trong bãi</option><option value="pending">Chờ xếp bãi</option><option value="lc">Có lệnh luân chuyển</option></select>
        <select className="select" style={{ ...S, width: 92 }} value={f.zone} onChange={set("zone")}><option value="">Khu</option>{Object.entries(YD_YARDS).map(([k, y]) => <option key={k} value={k}>{y.zone}</option>)}</select>
        <select className="select" style={{ ...S, width: 92 }} value={f.block} onChange={set("block")}><option value="">Block</option>{blocksOfZone.map(b => <option key={b}>{b}</option>)}</select>
        <select className="select" style={{ ...S, width: 110 }} value={f.line} onChange={set("line")}><option value="">Hãng tàu</option>{lines.map(l => <option key={l}>{l}</option>)}</select>
        <select className="select" style={{ ...S, width: 140 }} value={f.customer} onChange={set("customer")}><option value="">Khách hàng</option>{cusIds.map(id => <option key={id} value={id}>{ddCusShort(id)}</option>)}</select>
        <select className="select" style={{ ...S, width: 140 }} value={f.job} onChange={set("job")}><option value="">Job</option>{jobIds.map(j => <option key={j}>{j}</option>)}</select>
        <select className="select" style={{ ...S, width: 84 }} value={f.fe} onChange={set("fe")}><option value="">F/E</option><option value="F">Hàng</option><option value="E">Rỗng</option></select>
        <select className="select" style={{ ...S, width: 76 }} value={f.size} onChange={set("size")}><option value="">Cỡ</option><option value="20">20'</option><option value="40">40'</option><option value="45">45'</option></select>
        <select className="select" style={{ ...S, width: 96 }} value={f.kind} onChange={set("kind")}><option value="">Khô/lạnh</option><option value="dry">Cont khô</option><option value="rf">Cont lạnh</option></select>
        <select className="select" style={{ ...S, width: 108 }} value={f.dwell} onChange={set("dwell")}><option value={0}>Ngày lưu</option>{[5, 10, 20, 30].map(n => <option key={n} value={n}>≥ {n} ngày</option>)}</select>
        <select className="select" style={{ ...S, width: 130 }} value={f.sort} onChange={set("sort")}><option value="loc">Xếp theo vị trí</option><option value="dwell">Lưu lâu nhất</option><option value="in">Vào bãi mới nhất</option><option value="no">Số cont</option></select>
        {filterTxt && <button className="btn btn-sm ghost" onClick={() => setF(YD_F0)}>Bỏ lọc</button>}
      </div>
      <div className="row" style={{ gap: 10, padding: "8px 12px", alignItems: "center", borderBottom: "1px solid var(--line)", background: "var(--bg-canvas)" }}>
        <span style={{ fontSize: 12.5 }}><b>{ddNum(rows.length)}</b> cont · {ddNum(teu)} TEU{filterTxt ? <span className="muted"> · {filterTxt}</span> : null}</span>
        <span style={{ marginLeft: "auto" }}></span>
        {ydCanMove() && selRows.length > 0 && <><span style={{ fontSize: 12.5 }}>Đã chọn <b>{selRows.length}</b></span><button className="btn btn-sm ghost" onClick={() => setSelSet(new Set())}>Bỏ chọn</button>
          <button className="btn btn-sm accent" onClick={() => onMove(selRows, () => setSelSet(new Set()))}>Luân chuyển {selRows.length} cont</button></>}
        <button className="btn btn-sm" disabled={!rows.length} onClick={() => ydExportList(rows, filterTxt).then(() => flash(`Đã xuất ${rows.length} cont ra Excel`), e => flash(e.message))}><Icon name="download" size={13}/> Xuất Excel ({ddNum(rows.length)})</button>
      </div>
      <div className="tbl-wrap"><table className="tbl">
        <thead><tr>
          {ydCanMove() && <th style={{ width: 34 }}><input type="checkbox" checked={allSel} onChange={() => setSelSet(allSel ? new Set() : new Set(rows.filter(canSel).map(c => c.no)))} title="Chọn tất cả cont đang lọc" /></th>}
          <th>Số cont</th><th style={{ width: 110 }}>Loại</th><th style={{ width: 90 }}>Hãng</th><th>Khách hàng · Job</th><th style={{ width: 150 }}>Booking · seal</th><th style={{ width: 120 }}>Vị trí</th><th style={{ width: 140 }}>Vào bãi</th><th style={{ width: 80 }}>Ngày lưu</th><th style={{ width: 120 }}></th></tr></thead>
        <tbody>
          {rows.length === 0 && <tr><td colSpan={10} className="muted" style={{ textAlign: "center", padding: 26 }}>Không có cont khớp bộ lọc</td></tr>}
          {rows.slice(0, limit).map(c => { const jc = ydJobCont(c), lc = ydOpenLc(c.no), d = ddDwell(c.gateInAt); return (
            <tr key={c.no} style={{ background: selSet.has(c.no) ? "var(--st-info-bg, #EFF6FF)" : undefined }}>
              {ydCanMove() && <td><input type="checkbox" disabled={!canSel(c)} checked={selSet.has(c.no)} onChange={() => toggle(c.no)} title={lc ? `Đang trong lệnh ${lc.id}` : ""} /></td>}
              <td><button className="mono" style={{ fontWeight: 700, background: "none", border: 0, padding: 0, cursor: "pointer", color: "var(--brand-ink)" }} onClick={() => onHistory(c.no)}>{tlContFmt(c.no)}</button>{ydIsRf(c) && <span className="badge info" style={{ marginLeft: 6 }}>lạnh</span>}</td>
              <td style={{ fontSize: 12 }}>{c.type} · {ydFeTxt(c.fe)}</td><td style={{ fontSize: 12 }}>{c.line}</td>
              <td style={{ fontSize: 12 }}>{c.customer ? ddCusShort(c.customer) : "—"}<div className="muted mono" style={{ fontSize: 11 }}>{c.job || ""}</div></td>
              <td style={{ fontSize: 11.5 }} className="mono">{jc.booking || "—"}<div className="muted">{c.seal || jc.seal || ""}</div></td>
              <td>{c.pos ? <b className="mono" style={{ fontSize: 12.5 }}>{c.loc}</b> : <span className="badge warning">Chờ xếp bãi</span>}{lc && <div style={{ fontSize: 11, color: "var(--st-warning)" }}>{lc.id} → {ydLcTarget(lc)}</div>}</td>
              <td style={{ fontSize: 12 }}>{c.gateInAt || "—"}<div className="muted" style={{ fontSize: 11 }}>{c.via || ""}</div></td>
              <td style={{ fontWeight: 600, color: d >= 10 ? "var(--st-danger)" : d >= 5 ? "var(--st-warning)" : undefined }}>{d} ngày</td>
              <td><div className="row" style={{ gap: 4, justifyContent: "flex-end" }}>
                <button className="btn btn-sm ghost" onClick={() => onHistory(c.no)}>Lịch sử</button>
                {c.pos && <button className="btn btn-sm ghost" onClick={() => onLocate(c)}>Sơ đồ</button>}</div></td>
            </tr>); })}
        </tbody>
      </table></div>
      {rows.length > limit && <div style={{ textAlign: "center", padding: 12 }}><span className="muted" style={{ fontSize: 12 }}>Đang hiện {limit} / {ddNum(rows.length)} cont · </span><button className="btn btn-sm" onClick={() => setLimit(l => l + 500)}>Hiện thêm 500</button> <span className="muted" style={{ fontSize: 12 }}>hoặc Xuất Excel để có đủ danh sách</span></div>}
    </div>
  );
};

/* =================== TAB LỆNH LUÂN CHUYỂN =================== */
const YD_LC_ST = { open: ["warning", "Đang thực hiện"], done: ["success", "Hoàn thành"], cancelled: ["neutral", "Đã huỷ"] };
const DdYardLcList = ({ flash, refresh, onHistory }) => {
  const [open, setOpen] = React.useState(() => (DD_YARD_MOVES.find(l => l.status === "open") || {}).id || null);
  const [st, setSt] = React.useState("open");
  const list = DD_YARD_MOVES.filter(l => st === "all" || l.status === st);
  const doOne = (lc, no) => { const why = ydLcDo(lc, no, DD_ME.id); flash(why || `${tlContFmt(no)} → ${DD_CONT_REG[no].loc}`); refresh(); };
  const doAll = (lc) => { let n = 0, err = null; lc.items.filter(i => !i.to && !i.skip).forEach(i => { const w = ydLcDo(lc, i.no, DD_ME.id); if (w) err = err || `${tlContFmt(i.no)}: ${w}`; else n++; }); flash(`Đã xác nhận ${n} cont${err ? ` · còn lỗi — ${err}` : ""}`); refresh(); };
  const skip = (lc, it) => { it.skip = true; lc.log.unshift({ at: ddNow(), by: DD_ME.id, text: `Bỏ ${tlContFmt(it.no)} khỏi lệnh` }); if (lc.items.every(x => x.to || x.skip)) { lc.status = "done"; lc.doneAt = ddNow(); } refresh(); };
  const cancel = (lc) => { if (!window.confirm(`Huỷ lệnh ${lc.id}? Cont chưa chuyển giữ nguyên vị trí.`)) return; lc.status = "cancelled"; lc.log.unshift({ at: ddNow(), by: DD_ME.id, text: "Huỷ lệnh" }); flash(`Đã huỷ ${lc.id}`); refresh(); };
  const exportLc = (lc) => ddLoadXlsx().then(X => {
    const wb = X.utils.book_new();
    X.utils.book_append_sheet(wb, ydSheet(X, `LỆNH LUÂN CHUYỂN ${lc.id}`, `Tạo ${lc.at} bởi ${ddPerson(lc.by).name} · đích ${ydLcTarget(lc)}${lc.truck ? ` · xe kéo ${lc.truck}` : ""}${lc.note ? ` · ${lc.note}` : ""}`,
      ["STT", "Số cont", "Loại", "Hàng/Rỗng", "Hãng", "Từ vị trí", "Đến (dự kiến)", "Đã chuyển tới", "Lúc", "Người xác nhận"],
      lc.items.map((it, i) => { const c = DD_CONT_REG[it.no] || {}; return [i + 1, it.no, c.type || "", ydFeTxt(c.fe), c.line || "", it.from, it.plan ? ydLocStr(it.plan, c) : "", it.skip ? "Bỏ qua" : it.to || "", it.at || "", it.by ? ddPerson(it.by).name : ""]; }),
      [5, 14, 8, 10, 11, 13, 14, 14, 17, 18]), "Lệnh luân chuyển");
    X.writeFile(wb, `${lc.id}.xlsx`);
  });
  return (
    <div>
      <div className="row" style={{ gap: 6, padding: "10px 12px", borderBottom: "1px solid var(--line)", alignItems: "center" }}>
        {[["open", "Đang thực hiện"], ["done", "Hoàn thành"], ["cancelled", "Đã huỷ"], ["all", "Tất cả"]].map(([k, l]) => <button key={k} className={`btn btn-sm ${st === k ? "primary" : ""}`} onClick={() => setSt(k)}>{l} ({k === "all" ? DD_YARD_MOVES.length : DD_YARD_MOVES.filter(x => x.status === k).length})</button>)}
        <span className="muted" style={{ fontSize: 12, marginLeft: "auto" }}>Tạo lệnh: tab Danh sách cont → chọn cont → Luân chuyển. Tally xác nhận trên App Tally › Bãi cont › Lệnh LC.</span>
      </div>
      {list.length === 0 && <div className="muted" style={{ textAlign: "center", padding: 30 }}>Không có lệnh luân chuyển.</div>}
      {list.map(lc => { const done = lc.items.filter(i => i.to).length, skipped = lc.items.filter(i => i.skip).length, isOpen = open === lc.id; return (
        <div key={lc.id} style={{ borderBottom: "1px solid var(--line)" }}>
          <div className="row" style={{ gap: 12, padding: "12px 14px", alignItems: "center", cursor: "pointer" }} onClick={() => setOpen(isOpen ? null : lc.id)}>
            <b className="mono">{lc.id}</b><span className={`badge ${YD_LC_ST[lc.status][0]}`}>{YD_LC_ST[lc.status][1]}</span>
            <span style={{ fontSize: 12.5 }}>→ <b>{ydLcTarget(lc)}</b>{lc.truck ? <> · xe <b className="mono">{lc.truck}</b></> : null}{lc.note ? <span className="muted"> · {lc.note}</span> : null}</span>
            <span className="muted" style={{ fontSize: 12, marginLeft: "auto" }}>{lc.at} · {ddPerson(lc.by).name}</span>
            <span style={{ fontSize: 12.5, fontWeight: 600, width: 90, textAlign: "right" }}>{done}/{lc.items.length - skipped} cont</span>
            <div style={{ width: 90, height: 6, background: "var(--bg-sunken)", borderRadius: 3 }}><div style={{ width: `${(done / Math.max(1, lc.items.length - skipped)) * 100}%`, height: "100%", background: "var(--st-success)", borderRadius: 3 }}></div></div>
          </div>
          {isOpen && (
            <div style={{ padding: "0 14px 14px" }}>
              <div className="row" style={{ gap: 6, marginBottom: 8 }}>
                {lc.status === "open" && ydCanMove() && <button className="btn btn-sm primary" onClick={() => doAll(lc)}>Xác nhận đã chuyển tất cả còn lại</button>}
                <button className="btn btn-sm" onClick={() => exportLc(lc)}><Icon name="download" size={13}/> Xuất phiếu Excel</button>
                {lc.status === "open" && ydCanMove() && <button className="btn btn-sm ghost" style={{ marginLeft: "auto", color: "var(--st-danger)" }} onClick={() => cancel(lc)}>Huỷ lệnh</button>}
              </div>
              <div className="tbl-wrap"><table className="tbl">
                <thead><tr><th style={{ width: 36 }}>#</th><th>Số cont</th><th style={{ width: 110 }}>Loại</th><th style={{ width: 120 }}>Từ</th><th style={{ width: 130 }}>Đến (dự kiến)</th><th>Đã chuyển</th><th style={{ width: 200 }}></th></tr></thead>
                <tbody>{lc.items.map((it, i) => { const c = DD_CONT_REG[it.no] || {}; const top = !it.to && !it.skip && c.pos ? (ydReindex(), ydBlocked(c)) : null; return (
                  <tr key={it.no}>
                    <td className="muted">{i + 1}</td>
                    <td><button className="mono" style={{ fontWeight: 700, background: "none", border: 0, padding: 0, cursor: "pointer" }} onClick={() => onHistory(it.no)}>{tlContFmt(it.no)}</button></td>
                    <td style={{ fontSize: 12 }}>{c.type} · {ydFeTxt(c.fe)}</td><td className="mono" style={{ fontSize: 12 }}>{it.from}</td><td className="mono" style={{ fontSize: 12 }}>{it.plan ? ydLocStr(it.plan, c) : "—"}</td>
                    <td style={{ fontSize: 12 }}>{it.skip ? <span className="muted">Bỏ qua</span> : it.to ? <><b className="mono">{it.to}</b><div className="muted" style={{ fontSize: 11 }}>{it.at} · {ddPerson(it.by).name}</div></> : top ? <span style={{ color: "var(--st-warning)" }}>Bị {tlContFmt(top)} đè</span> : <span className="muted">Chưa chuyển</span>}</td>
                    <td>{lc.status === "open" && !it.to && !it.skip && ydCanMove() && <div className="row" style={{ gap: 4, justifyContent: "flex-end" }}>
                      <button className="btn btn-sm ghost" onClick={() => skip(lc, it)}>Bỏ qua</button>
                      <button className="btn btn-sm primary" disabled={!!top} onClick={() => doOne(lc, it.no)}>Đã chuyển</button></div>}</td>
                  </tr>); })}</tbody>
              </table></div>
              <div className="muted" style={{ fontSize: 11.5, marginTop: 8 }}>{lc.log.slice(0, 5).map((l, i) => <div key={i}>{l.at} · {ddPerson(l.by).name} · {l.text}</div>)}</div>
            </div>)}
        </div>); })}
    </div>
  );
};

/* =================== TAB BÁO CÁO TỒN BÃI =================== */
const ydGroup = (list, keyFn) => {
  const m = new Map();
  list.forEach(c => { const k = keyFn(c); const g = m.get(k) || { k, n: 0, teu: 0, s20: 0, s40: 0, s45: 0, F: 0, E: 0, rf: 0, dwell: 0 }; g.n++; g.teu += ydTeu(c); g["s" + ydSize(c)]++; g[c.fe === "E" ? "E" : "F"]++; if (ydIsRf(c)) g.rf++; g.dwell += ddDwell(c.gateInAt); m.set(k, g); });
  return [...m.values()];
};
const YD_BUCKETS = [[0, 4, "0–4 ngày"], [5, 9, "5–9 ngày"], [10, 19, "10–19 ngày"], [20, 29, "20–29 ngày"], [30, 1e9, "≥ 30 ngày"]];
const DdYardReport = ({ onHistory, flash }) => {
  const [longN, setLongN] = React.useState(10);
  const inYard = ydInYard();
  const pending = Object.values(DD_CONT_REG).filter(c => c.inPort && !c.pos);
  const byZone = Object.entries(YD_YARDS).map(([k, y]) => { const g = ydGroup(inYard.filter(c => YD_BLK[c.pos.b].yard === k), () => k)[0] || { n: 0, teu: 0, s20: 0, s40: 0, s45: 0, F: 0, E: 0, rf: 0 }; return { ...g, k, label: `${y.zone} · ${y.name}`, cap: y.cap, nb: YD_BLOCKS.filter(b => b.yard === k).length }; });
  const byBlock = YD_BLOCKS.map(b => { const g = ydGroup(inYard.filter(c => c.pos.b === b.id), () => b.id)[0] || { n: 0, teu: 0, s20: 0, s40: 0, s45: 0, F: 0, E: 0, rf: 0 }; return { ...g, k: b.id, zone: b.yard, cap: b.cap, kind: ydKind(b.id) }; });
  const byLine = ydGroup(inYard, c => c.line || "—").sort((a, b) => b.teu - a.teu);
  const byCus = ydGroup(inYard, c => c.customer ? ddCusShort(c.customer) : "(chưa rõ khách)").sort((a, b) => b.teu - a.teu);
  const buckets = YD_BUCKETS.map(([a, b, l]) => ({ l, n: inYard.filter(c => { const d = ddDwell(c.gateInAt); return d >= a && d <= b; }).length }));
  const longList = inYard.filter(c => ddDwell(c.gateInAt) >= longN).sort((a, b) => ddDwell(b.gateInAt) - ddDwell(a.gateInAt));
  const tot = { n: inYard.length, teu: inYard.reduce((s, c) => s + ydTeu(c), 0), cap: YD_BLOCKS.reduce((s, b) => s + b.cap, 0) };
  const pct = (a, b) => b ? `${Math.round(a / b * 100)}%` : "—";
  const avgDwell = inYard.length ? (inYard.reduce((s, c) => s + ddDwell(c.gateInAt), 0) / inYard.length).toFixed(1) : "0";
  const G_HEAD = ["Số cont", "TEU", "20'", "40'", "45'", "Hàng", "Rỗng", "Lạnh"];
  const gRow = (g) => [g.n, g.teu, g.s20, g.s40, g.s45, g.F, g.E, g.rf];
  const exportAll = () => ddLoadXlsx().then(X => {
    const wb = X.utils.book_new(), sub = `Thời điểm ${ddNow()} · ${tot.n} cont trong bãi · ${tot.teu}/${tot.cap} TEU (${pct(tot.teu, tot.cap)}) · ${pending.length} cont chờ xếp bãi`;
    X.utils.book_append_sheet(wb, ydSheet(X, "TỒN BÃI THEO KHU", sub, ["Khu", "Số block", "Sức chứa TEU", "% lấp đầy", ...G_HEAD], [...byZone.map(z => [z.label, z.nb, z.cap, pct(z.teu, z.cap), ...gRow(z)]), ["Tổng", YD_BLOCKS.length, tot.cap, pct(tot.teu, tot.cap), ...gRow(ydGroup(inYard, () => 1)[0] || { n: 0, teu: 0, s20: 0, s40: 0, s45: 0, F: 0, E: 0, rf: 0 })]], [22, 9, 12, 10, 9, 8, 6, 6, 6, 7, 7, 7]), "Theo khu");
    X.utils.book_append_sheet(wb, ydSheet(X, "TỒN BÃI THEO BLOCK", sub, ["Block", "Khu", "Loại block", "Sức chứa TEU", "% lấp đầy", ...G_HEAD], byBlock.map(b => [b.k, b.zone, b.kind, b.cap, pct(b.teu, b.cap), ...gRow(b)]), [8, 6, 20, 12, 10, 9, 8, 6, 6, 6, 7, 7, 7]), "Theo block");
    X.utils.book_append_sheet(wb, ydSheet(X, "TỒN BÃI THEO HÃNG TÀU", sub, ["Hãng tàu", ...G_HEAD, "Lưu TB (ngày)"], byLine.map(g => [g.k, ...gRow(g), +(g.dwell / g.n).toFixed(1)]), [16, 9, 8, 6, 6, 6, 7, 7, 7, 12]), "Theo hãng tàu");
    X.utils.book_append_sheet(wb, ydSheet(X, "TỒN BÃI THEO KHÁCH HÀNG", sub, ["Khách hàng", ...G_HEAD, "Lưu TB (ngày)"], byCus.map(g => [g.k, ...gRow(g), +(g.dwell / g.n).toFixed(1)]), [28, 9, 8, 6, 6, 6, 7, 7, 7, 12]), "Theo khách hàng");
    X.utils.book_append_sheet(wb, ydSheet(X, `CONT LƯU BÃI ≥ ${longN} NGÀY`, sub, YD_LIST_HEAD, longList.map(ydListRow), YD_LIST_W), "Lưu bãi lâu");
    X.utils.book_append_sheet(wb, ydSheet(X, "DANH SÁCH CONT Ở CẢNG", sub, YD_LIST_HEAD, [...inYard, ...pending].map(ydListRow), YD_LIST_W), "Danh sách cont");
    X.writeFile(wb, `Bao_cao_ton_bai_${ydStamp()}.xlsx`);
  });
  const Tbl = ({ head, rows, first }) => (
    <div className="tbl-wrap"><table className="tbl"><thead><tr><th>{first}</th>{head.map(h => <th key={h} style={{ textAlign: "right" }}>{h}</th>)}</tr></thead>
      <tbody>{rows.map((r, i) => <tr key={i}>{r.map((v, j) => <td key={j} style={{ textAlign: j ? "right" : "left", fontSize: 12.5, fontWeight: j === 0 ? 600 : undefined }} className={j ? "mono" : ""}>{v}</td>)}</tr>)}</tbody></table></div>
  );
  const Card = ({ title, children, extra }) => <div className="card" style={{ marginBottom: 14 }}><div className="card-head"><h3>{title}</h3>{extra}</div>{children}</div>;
  return (
    <div style={{ padding: 14 }}>
      <div className="row" style={{ gap: 10, marginBottom: 14, alignItems: "center", flexWrap: "wrap" }}>
        {[["Cont trong bãi", ddNum(tot.n)], ["TEU · lấp đầy", `${ddNum(tot.teu)} · ${pct(tot.teu, tot.cap)}`], ["Chờ xếp bãi", ddNum(pending.length)], ["Lưu bãi TB", `${avgDwell} ngày`], [`Lưu ≥ ${longN} ngày`, ddNum(longList.length)]].map(([l, v]) => (
          <div key={l} className="card" style={{ padding: "10px 14px", minWidth: 140 }}><div className="muted" style={{ fontSize: 11.5 }}>{l}</div><div style={{ fontSize: 19, fontWeight: 700 }}>{v}</div></div>))}
        <button className="btn primary" style={{ marginLeft: "auto" }} onClick={() => exportAll().then(() => flash("Đã xuất báo cáo tồn bãi"), e => flash(e.message))}><Icon name="download" size={13}/> Xuất báo cáo Excel (6 sheet)</button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(380px, 1fr))", gap: 14 }}>
        <Card title="Tồn bãi theo khu"><Tbl first="Khu" head={["Sức chứa", "TEU", "%", "Cont", "20'", "40'", "45'", "Hàng", "Rỗng"]} rows={byZone.map(z => [z.label, ddNum(z.cap), ddNum(z.teu), pct(z.teu, z.cap), z.n, z.s20, z.s40, z.s45, z.F, z.E])} /></Card>
        <Card title="Thời gian lưu bãi">
          <div style={{ padding: "10px 14px" }}>{buckets.map(b => <div key={b.l} className="row" style={{ gap: 8, alignItems: "center", marginBottom: 6, fontSize: 12.5 }}>
            <span style={{ width: 90 }}>{b.l}</span><div style={{ flex: 1, height: 10, background: "var(--bg-sunken)", borderRadius: 3 }}><div style={{ width: `${tot.n ? b.n / tot.n * 100 : 0}%`, height: "100%", borderRadius: 3, background: /10|20|30/.test(b.l) ? "#E5735C" : /5–9/.test(b.l) ? "#F2C063" : "#7CC8A4" }}></div></div><b className="mono" style={{ width: 40, textAlign: "right" }}>{b.n}</b></div>)}</div>
        </Card>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(380px, 1fr))", gap: 14 }}>
        <Card title="Theo hãng tàu"><Tbl first="Hãng" head={["Cont", "TEU", "20'", "40'", "45'", "Hàng", "Rỗng", "Lưu TB"]} rows={byLine.map(g => [g.k, g.n, g.teu, g.s20, g.s40, g.s45, g.F, g.E, `${(g.dwell / g.n).toFixed(1)} ng`])} /></Card>
        <Card title="Theo khách hàng"><Tbl first="Khách hàng" head={["Cont", "TEU", "Hàng", "Rỗng", "Lưu TB"]} rows={byCus.map(g => [g.k, g.n, g.teu, g.F, g.E, `${(g.dwell / g.n).toFixed(1)} ng`])} /></Card>
      </div>
      <Card title="Block đầy nhất"><Tbl first="Block" head={["Khu", "Sức chứa", "TEU", "%", "Cont", "Hàng", "Rỗng"]} rows={byBlock.filter(b => b.n).sort((a, b) => b.teu / b.cap - a.teu / a.cap).slice(0, 12).map(b => [b.k, b.zone, b.cap, b.teu, pct(b.teu, b.cap), b.n, b.F, b.E])} /></Card>
      <Card title={`Cont lưu bãi ≥ ${longN} ngày (${longList.length})`} extra={<select className="select" style={{ height: 28, fontSize: 12, width: 110 }} value={longN} onChange={e => setLongN(Number(e.target.value))}>{[5, 10, 20, 30, 60].map(n => <option key={n} value={n}>≥ {n} ngày</option>)}</select>}>
        <div className="tbl-wrap"><table className="tbl"><thead><tr><th>Số cont</th><th>Loại</th><th>Hãng</th><th>Khách hàng · Job</th><th>Vị trí</th><th>Vào bãi</th><th style={{ textAlign: "right" }}>Ngày lưu</th></tr></thead>
          <tbody>{longList.length === 0 && <tr><td colSpan={7} className="muted" style={{ textAlign: "center", padding: 18 }}>Không có cont lưu bãi từ {longN} ngày</td></tr>}
            {longList.slice(0, 100).map(c => <tr key={c.no}><td><button className="mono" style={{ fontWeight: 700, background: "none", border: 0, padding: 0, cursor: "pointer" }} onClick={() => onHistory(c.no)}>{tlContFmt(c.no)}</button></td><td style={{ fontSize: 12 }}>{c.type} · {ydFeTxt(c.fe)}</td><td style={{ fontSize: 12 }}>{c.line}</td>
              <td style={{ fontSize: 12 }}>{c.customer ? ddCusShort(c.customer) : "—"}<div className="muted mono" style={{ fontSize: 11 }}>{c.job || ""}</div></td><td className="mono" style={{ fontSize: 12 }}>{c.loc}</td><td style={{ fontSize: 12 }}>{c.gateInAt}</td><td className="mono" style={{ textAlign: "right", fontWeight: 700, color: "var(--st-danger)" }}>{ddDwell(c.gateInAt)}</td></tr>)}</tbody></table></div>
        {longList.length > 100 && <div className="muted" style={{ fontSize: 12, padding: 10, textAlign: "center" }}>Hiện 100 / {longList.length} — xuất Excel để có đủ</div>}
      </Card>
    </div>
  );
};


/* =================== TAB QUY TẮC XẾP BÃI ===================
   KHTH / TP chọn chế độ từng quy tắc (Chặn / Cảnh báo / Tắt) + ngưỡng đầy block.
   Cont đang nằm sai quy tắc KHÔNG bị chuyển tự động — chỉ liệt kê để xử lý dần. */
const YD_MODE_BADGE = { block: "danger", warn: "warning", off: "neutral" };
const DdYardRules = ({ flash, refresh, onLocate }) => {
  const [, force] = React.useState(0);
  const can = ydCanMove();
  const cfg = ydRuleCfg();
  const [pct, setPct] = React.useState(String(ydFillPct()));
  const [only, setOnly] = React.useState("");
  const save = (modes, fillPct, text) => {
    const cur = DD_YARD_RULES.cfg || {};
    DD_YARD_RULES.cfg = { modes: { ...(cur.modes || {}), ...modes }, fillPct: fillPct != null ? fillPct : (cur.fillPct || 85), at: ddNow(), by: DD_ME.id, log: [{ at: ddNow(), by: DD_ME.id, text }, ...(cur.log || [])].slice(0, 50) };
    ydReindex(); force(n => n + 1); refresh && refresh(); flash(`Đã lưu: ${text}`);
  };
  const setMode = (r, m) => { if (m !== ydMode(r.id)) save({ [r.id]: m }, null, `${r.code} ${r.name} → ${YD_RULE_MODES[m]}`); };
  const savePct = () => { const n = Math.round(Number(pct)); if (!(n >= 50 && n <= 100)) return flash("Ngưỡng đầy block phải từ 50 đến 100%"); if (n !== ydFillPct()) save({}, n, `Ngưỡng đầy block → ${n}%`); };
  const reset = () => { if (window.confirm("Đưa tất cả quy tắc về mặc định?")) save(Object.fromEntries(YD_RULES.map(r => [r.id, r.def])), 85, "Đưa về mặc định"); };
  const audit = ydAudit();
  const cnt = (id) => audit.filter(a => a.v.some(x => x.id === id)).length;
  const rows = only ? audit.filter(a => a.v.some(x => x.id === only)) : audit;
  const exportAudit = () => ddLoadXlsx().then(X => {
    const wb = X.utils.book_new();
    X.utils.book_append_sheet(wb, ydSheet(X, "CONT ĐANG NẰM SAI QUY TẮC XẾP BÃI", `Xuất lúc ${ddNow()} · ${rows.length} cont${only ? ` · lọc ${YD_RULES.find(r => r.id === only).code}` : ""}`,
      ["STT", "Số cont", "Loại", "Hàng/Rỗng", "Hãng tàu", "Job", "Vị trí", "Quy tắc", "Chế độ", "Chi tiết"],
      rows.flatMap((a, i) => a.v.map((x, k) => [k ? "" : i + 1, k ? "" : a.c.no, k ? "" : a.c.type, k ? "" : ydFeTxt(a.c.fe), k ? "" : a.c.line || "", k ? "" : a.c.job || "", k ? "" : a.c.loc, YD_RULES.find(r => r.id === x.id).code, YD_RULE_MODES[x.mode], x.msg])),
      [5, 14, 7, 9, 11, 15, 13, 8, 10, 50]), "Sai quy tắc");
    X.writeFile(wb, `Cont_sai_quy_tac_${ydStamp()}.xlsx`);
  }).catch(e => flash(e.message || "Không xuất được"));
  return (
    <div style={{ padding: 14, display: "flex", flexDirection: "column", gap: 14 }}>
      <div className="row" style={{ gap: 10, alignItems: "center", flexWrap: "wrap" }}>
        <div style={{ fontSize: 13 }}><b>Chặn</b> = không cho xếp vào ô vi phạm · <b>Cảnh báo</b> = ô tô vàng, hỏi lại trước khi xếp và ghi vào lịch sử cont · <b>Tắt</b> = bỏ qua</div>
        {can ? <button className="btn btn-sm ghost" style={{ marginLeft: "auto" }} onClick={reset}>Đưa về mặc định</button> : <span className="muted" style={{ marginLeft: "auto", fontSize: 12 }}>Chỉ KHTH / TP được chỉnh</span>}
      </div>
      <div className="tbl-wrap"><table className="tbl">
        <thead><tr><th style={{ width: 60 }}>Mã</th><th style={{ width: 230 }}>Quy tắc</th><th>Nội dung</th><th style={{ width: 250 }}>Chế độ</th><th style={{ width: 110 }}>Cont đang sai</th></tr></thead>
        <tbody>{YD_RULES.map(r => { const m = ydMode(r.id), n = cnt(r.id); return (
          <tr key={r.id}>
            <td className="mono" style={{ fontWeight: 700 }}>{r.code}</td>
            <td style={{ fontWeight: 600 }}>{r.name}</td>
            <td style={{ fontSize: 12.5 }}>{r.desc}{r.num && <div className="row" style={{ gap: 6, alignItems: "center", marginTop: 6 }}><span className="muted">Ngưỡng đầy:</span>
              {can ? <><input className="input" style={{ width: 64, height: 28 }} inputMode="numeric" value={pct} onChange={e => setPct(e.target.value.replace(/\D/g, ""))} onKeyDown={e => e.key === "Enter" && savePct()} />%<button className="btn btn-sm" onClick={savePct}>Lưu</button></> : <b>{ydFillPct()}%</b>}</div>}</td>
            <td>{can ? <div className="row" style={{ gap: 4 }}>{Object.entries(YD_RULE_MODES).map(([k, l]) => <button key={k} className={`btn btn-sm ${m === k ? (k === "block" ? "danger" : k === "warn" ? "accent" : "primary") : "ghost"}`} style={m === k ? { fontWeight: 700 } : undefined} onClick={() => setMode(r, k)}>{l}</button>)}</div>
              : <span className={`badge ${YD_MODE_BADGE[m]}`}>{YD_RULE_MODES[m]}</span>}{m !== r.def && <div className="muted" style={{ fontSize: 11, marginTop: 3 }}>Mặc định: {YD_RULE_MODES[r.def]}</div>}</td>
            <td>{m === "off" ? <span className="muted">—</span> : n ? <button className="btn btn-sm ghost" style={{ color: "var(--st-warning)", fontWeight: 700 }} onClick={() => setOnly(only === r.id ? "" : r.id)}>{n} cont</button> : <span style={{ color: "var(--st-success)" }}>0</span>}</td>
          </tr>); })}</tbody>
      </table></div>
      <div className="muted" style={{ fontSize: 12 }}>Đã bỏ theo chốt 27/11: cont lạnh chỉ ở B1–B3 · khu E chỉ nhận rỗng · số tầng theo hàng/rỗng · khu riêng cont IMO. Chờ quyết: khu riêng cont hỏng / bị giữ / chờ kiểm hoá (B8). Chưa làm: nặng dưới nhẹ trên (C6) — cont chưa có dữ liệu trọng lượng VGM.{cfg.at ? ` · Lần chỉnh gần nhất: ${cfg.at} · ${ddPerson(cfg.by).name}` : ""}</div>

      <div className="card" style={{ padding: 0 }}>
        <div className="row" style={{ gap: 10, padding: "10px 14px", alignItems: "center", flexWrap: "wrap", borderBottom: "1px solid var(--line)" }}>
          <b>Cont đang nằm sai quy tắc</b><span className="muted" style={{ fontSize: 12 }}>{rows.length} cont{only ? ` · lọc ${YD_RULES.find(r => r.id === only).code}` : ""} · không tự chuyển, xử lý dần bằng đảo chuyển / luân chuyển</span>
          {only && <button className="btn btn-sm ghost" onClick={() => setOnly("")}>Bỏ lọc</button>}
          <button className="btn btn-sm" style={{ marginLeft: "auto" }} disabled={!rows.length} onClick={exportAudit}><Icon name="download" size={13}/> Xuất Excel</button>
        </div>
        <div className="tbl-wrap" style={{ maxHeight: 420, overflowY: "auto" }}><table className="tbl">
          <thead><tr><th style={{ width: 130 }}>Số cont</th><th style={{ width: 120 }}>Vị trí</th><th style={{ width: 120 }}>Loại</th><th style={{ width: 100 }}>Hãng</th><th>Vi phạm</th><th style={{ width: 110 }}></th></tr></thead>
          <tbody>
            {rows.length === 0 && <tr><td colSpan={6} className="muted" style={{ textAlign: "center", padding: 20 }}>Không có cont nào nằm sai quy tắc đang bật</td></tr>}
            {rows.slice(0, 300).map(a => <tr key={a.c.no}>
              <td className="mono" style={{ fontWeight: 600 }}>{tlContFmt(a.c.no)}</td><td className="mono" style={{ fontSize: 12.5 }}>{a.c.loc}</td>
              <td style={{ fontSize: 12 }}>{a.c.type} · {ydFeTxt(a.c.fe)}</td><td style={{ fontSize: 12 }}>{a.c.line}</td>
              <td style={{ fontSize: 12 }}>{a.v.map(x => <div key={x.id}><span className={`badge ${YD_MODE_BADGE[x.mode]}`} style={{ marginRight: 6 }}>{YD_RULES.find(r => r.id === x.id).code}</span>{x.msg}</div>)}</td>
              <td><button className="btn btn-sm ghost" onClick={() => onLocate(a.c)}>Xem trên sơ đồ</button></td></tr>)}
          </tbody></table></div>
        {rows.length > 300 && <div className="muted" style={{ textAlign: "center", padding: 10, fontSize: 12 }}>Đang hiện 300 / {rows.length} cont — xuất Excel để xem đủ</div>}
      </div>
      {(cfg.log || []).length > 0 && <div style={{ fontSize: 12 }}><div className="muted" style={{ marginBottom: 4 }}>Lịch sử chỉnh quy tắc</div>{cfg.log.slice(0, 8).map((l, i) => <div key={i} style={{ display: "flex", gap: 8 }}><span className="mono muted" style={{ width: 110 }}>{l.at}</span><span style={{ width: 140 }}>{ddPerson(l.by).name}</span><span>{l.text}</span></div>)}</div>}
    </div>
  );
};

Object.assign(window, { DD_YARD_MOVES, DdYardRules, ydExportMap, ydPlan, ydLcDo, ydLcTarget, ydHistory, DdContHistory, DdYardMoveModal, DdYardList, DdYardLcList, DdYardReport });
