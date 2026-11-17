/* App kiểm kê kho vật tư — quét QR trên part, ghi vào Kho → Tủ → Tầng.
   · Quét mã → nhập số lượng (mặc định 1) → Lưu. Trong 1 đợt, mỗi mã chỉ 1 lượt ở mỗi vị trí (tủ, tầng):
     quét lại cùng mã ở cùng vị trí → báo đã có, cho sửa số lượng. Cùng mã ở vị trí khác vẫn ghi được.
   · Tem QR của tầng: "VT-LOC|<mã kho>|<mã tủ>|<tầng>" — quét để đổi vị trí đang đứng.
   · Nhiều người dùng chung dữ liệu (Supabase Realtime). Mất sóng: lượt quét giữ trên máy, có sóng tự gửi.
   · Chế độ CHẠY THỬ (config.js để trống): dữ liệu lưu trên máy, các tab cùng trình duyệt thấy nhau. */
(() => {
  "use strict";
  const C = window.VT_CONFIG || {};
  const DEMO = !C.SUPABASE_URL || !C.SUPABASE_ANON_KEY;
  const LOC_PREFIX = "VT-LOC|";
  const $ = (s, el = document) => el.querySelector(s);
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const lsGet = (k, d) => { try { const v = localStorage.getItem(k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } };
  const lsSet = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} };
  const uid = () => (crypto.randomUUID ? crypto.randomUUID() : "id-" + Date.now() + "-" + Math.random().toString(16).slice(2));
  const fmtT = (iso) => new Date(iso).toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh", hour: "2-digit", minute: "2-digit", day: "2-digit", month: "2-digit" });
  const today = () => new Date().toLocaleDateString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh", day: "2-digit", month: "2-digit", year: "numeric" });
  const normCode = (t) => String(t || "").trim();

  const S = {
    user: null, khos: [], tus: [], dots: [], scans: [],
    dotId: lsGet("vt_dot", null), loc: lsGet("vt_loc", null), queue: lsGet("vt_queue", []),
    tab: "scan", khoSel: null, dsView: "code", q: "", online: navigator.onLine, conflicts: [],
    sheet: null, /* bảng nhập số lượng đang mở: { code, kho_id, tu_id, tang, exId } */
  };
  const qn = (s) => Number(s.qty) || 1;
  const sumQ = (arr) => arr.reduce((a, s) => a + qn(s), 0);
  const sameLoc = (a, b) => a.tu_id === b.tu_id && a.tang === b.tang;

  /* ================= LƯU TRỮ ================= */
  const Demo = (() => {
    const K = "vt_demo_db";
    const bc = "BroadcastChannel" in window ? new BroadcastChannel("vt_demo") : null;
    const db = () => lsGet(K, null) || { khos: [{ id: "KHO1", name: "Kho 1", sort: 1 }, { id: "KHO2", name: "Kho 2", sort: 2 }, { id: "KHO3", name: "Kho 3", sort: 3 }], tus: [], dots: [], scans: [] };
    const save = (d) => { lsSet(K, d); bc && bc.postMessage("chg"); };
    return {
      async init(onChange) { bc && (bc.onmessage = () => onChange()); window.addEventListener("storage", (e) => e.key === K && onChange()); },
      async loadAll(dotId) { const d = db(); return { khos: d.khos, tus: d.tus, dots: d.dots, scans: d.scans.filter((s) => s.dot_id === dotId) }; },
      async addTu(t) { const d = db(); if (d.tus.some((x) => x.kho_id === t.kho_id && x.code === t.code)) throw new Error("Mã tủ đã có trong kho này"); d.tus.push({ ...t, id: uid(), created_at: new Date().toISOString() }); save(d); },
      async addDot(name) { const d = db(); const x = { id: uid(), name, status: "open", created_at: new Date().toISOString() }; d.dots.push(x); save(d); return x; },
      async closeDot(id) { const d = db(); const x = d.dots.find((y) => y.id === id); x.status = "closed"; x.closed_at = new Date().toISOString(); save(d); },
      async insertScan(r) { const d = db(); if (d.scans.some((s) => s.client_id === r.client_id)) return { ok: true }; if (d.scans.some((s) => s.dot_id === r.dot_id && s.code === r.code && s.tu_id === r.tu_id && s.tang === r.tang && !s.deleted)) return { dup: true }; d.scans.push({ ...r, id: uid() }); save(d); return { ok: true }; },
      async updateQty(clientId, qty) { const d = db(); const s = d.scans.find((x) => x.client_id === clientId); if (s) { s.qty = qty; save(d); } },
      async deleteScan(clientId, by) { const d = db(); const s = d.scans.find((x) => x.client_id === clientId); if (s) { s.deleted = true; s.deleted_by_name = by; s.deleted_at = new Date().toISOString(); save(d); } },
    };
  })();

  const Sb = (() => {
    let sb = null, ch = null;
    return {
      client() { return sb || (sb = window.supabase.createClient(C.SUPABASE_URL, C.SUPABASE_ANON_KEY)); },
      async init(onChange) {
        const c = this.client();
        if (ch) c.removeChannel(ch);
        ch = c.channel("vt_rt")
          .on("postgres_changes", { event: "*", schema: "public", table: "vt_scan" }, onChange)
          .on("postgres_changes", { event: "*", schema: "public", table: "vt_tu" }, onChange)
          .on("postgres_changes", { event: "*", schema: "public", table: "vt_dot" }, onChange)
          .subscribe();
      },
      async loadAll(dotId) {
        const c = this.client();
        const [k, t, d] = await Promise.all([c.from("vt_kho").select("*").order("sort"), c.from("vt_tu").select("*").order("code"), c.from("vt_dot").select("*").order("created_at", { ascending: false })]);
        let scans = [];
        if (dotId) { for (let from = 0; ; from += 1000) { const r = await c.from("vt_scan").select("*").eq("dot_id", dotId).order("at").range(from, from + 999); if (r.error) throw r.error; scans = scans.concat(r.data); if (r.data.length < 1000) break; } }
        for (const r of [k, t, d]) if (r.error) throw r.error;
        return { khos: k.data, tus: t.data, dots: d.data, scans };
      },
      async addTu(t) { const r = await this.client().from("vt_tu").insert(t); if (r.error) throw new Error(r.error.code === "23505" ? "Mã tủ đã có trong kho này" : r.error.message); },
      async addDot(name) { const r = await this.client().from("vt_dot").insert({ name }).select().single(); if (r.error) throw r.error; return r.data; },
      async closeDot(id) { const r = await this.client().from("vt_dot").update({ status: "closed", closed_at: new Date().toISOString() }).eq("id", id); if (r.error) throw r.error; },
      async insertScan(row) {
        const r = await this.client().from("vt_scan").insert(row);
        if (!r.error) return { ok: true };
        if (r.error.code === "23505") return /client_id/.test(r.error.message) ? { ok: true } : { dup: true };
        throw r.error;
      },
      async updateQty(clientId, qty) { const r = await this.client().from("vt_scan").update({ qty }).eq("client_id", clientId); if (r.error) throw r.error; },
      async deleteScan(clientId) { const r = await this.client().from("vt_scan").update({ deleted: true, deleted_by: S.user.id, deleted_at: new Date().toISOString() }).eq("client_id", clientId); if (r.error) throw r.error; },
    };
  })();
  const Store = DEMO ? Demo : Sb;

  /* ================= TIỆN ÍCH NGHIỆP VỤ ================= */
  const kho = (id) => S.khos.find((k) => k.id === id) || { id, name: id };
  const tu = (id) => S.tus.find((t) => t.id === id) || { id, code: "?", so_tang: 0 };
  const locText = (l) => (l ? `${kho(l.kho_id).name} · Tủ ${tu(l.tu_id).code} · Tầng ${l.tang}` : "");
  const live = () => S.scans.filter((s) => !s.deleted);
  const dot = () => S.dots.find((d) => d.id === S.dotId);
  const atLoc = (l) => live().filter((s) => s.tu_id === l.tu_id && s.tang === l.tang);

  /* tiếng bíp + rung */
  let actx = null;
  const beep = (ok) => {
    try {
      actx = actx || new (window.AudioContext || window.webkitAudioContext)();
      const tone = (f, t0, d) => { const o = actx.createOscillator(), g = actx.createGain(); o.frequency.value = f; o.connect(g); g.connect(actx.destination); g.gain.value = 0.15; o.start(actx.currentTime + t0); o.stop(actx.currentTime + t0 + d); };
      if (ok) tone(1200, 0, 0.09); else { tone(300, 0, 0.15); tone(300, 0.22, 0.15); }
    } catch (e) {}
    try { navigator.vibrate && navigator.vibrate(ok ? 40 : [80, 60, 80]); } catch (e) {}
  };
  const flash = (kind, html) => { const el = $("#flash"); if (!el) return; el.className = "flash " + kind; el.innerHTML = html; el.classList.remove("hide"); clearTimeout(flash.t); flash.t = setTimeout(() => el.classList.add("hide"), kind === "bad" ? 6000 : 2500); };

  /* ================= QUÉT ================= */
  let lastText = "", lastAt = 0;
  async function onScanText(raw) {
    const text = normCode(raw);
    if (!text) return;
    const now = Date.now();
    if (text === lastText && now - lastAt < 2500) return; /* camera đọc lặp cùng một tem */
    lastText = text; lastAt = now;
    if (S.sheet) { /* đang nhập số lượng: không nhận tem khác cho đến khi Lưu / Huỷ */
      if (text !== S.sheet.code) flash("info", "Đang nhập số lượng — bấm Lưu hoặc Huỷ trước khi quét tem khác");
      return;
    }
    if (text.startsWith(LOC_PREFIX)) return setLocFromQr(text);
    await addScan(text);
  }
  function setLocFromQr(text) {
    const [, khoId, tuCode, tang] = text.split("|");
    const t = S.tus.find((x) => x.kho_id === khoId && x.code === tuCode);
    const n = Number(tang);
    if (!t || !(n >= 1 && n <= t.so_tang)) { beep(false); return flash("bad", `Tem vị trí không khớp tủ nào: ${esc(text)}`); }
    S.loc = { kho_id: khoId, tu_id: t.id, tang: n }; lsSet("vt_loc", S.loc);
    beep(true); flash("info", `Vị trí: ${esc(locText(S.loc))}`); renderScan();
  }
  async function addScan(code) {
    const d = dot();
    if (!d || d.status !== "open") { beep(false); return flash("bad", "Chưa có đợt kiểm kê đang mở — vào tab Đợt để tạo"); }
    if (!S.loc) { beep(false); return flash("bad", "Chưa chọn vị trí — quét tem tầng hoặc chọn ở tab Vị trí"); }
    const ex = live().find((s) => s.code === code && sameLoc(s, S.loc));
    beep(!ex); /* bíp kép khi mã đã có ở vị trí này */
    openSheet({ code, kho_id: S.loc.kho_id, tu_id: S.loc.tu_id, tang: S.loc.tang, exId: ex ? ex.client_id : null });
  }

  /* bảng nhập số lượng (hiện ngay sau khi quét) */
  function openSheet(sh) {
    S.sheet = sh;
    const ex = sh.exId && S.scans.find((s) => s.client_id === sh.exId);
    const others = live().filter((s) => s.code === sh.code && !sameLoc(s, sh));
    $("#flash").classList.add("hide");
    $("#sheet").innerHTML = `<div class="sheet-card">
      <div class="mut">Mã vật tư</div><div class="sheet-code mono">${esc(sh.code)}</div>
      <div class="mut" style="margin-bottom:8px">${esc(locText(sh))}</div>
      ${ex ? `<div class="sheet-warn">Mã này ĐÃ CÓ ở vị trí này: <b>${qn(ex)} cái</b> · ${fmtT(ex.at)}${ex.by_name ? " · " + esc(ex.by_name) : ""}<br>Sửa số lượng bên dưới nếu cần.</div>` : ""}
      ${others.length ? `<div class="mut" style="margin-bottom:8px">Mã này còn ở: ${others.map((s) => `${esc(locText(s))} (${qn(s)})`).join(" · ")}</div>` : ""}
      <label class="f" for="qty">Số lượng</label>
      <div class="qty"><button class="btn sec" data-act="qty-step" data-d="-1" aria-label="Bớt 1">−</button><input id="qty" type="number" inputmode="numeric" min="1" max="100000" value="${ex ? qn(ex) : 1}" enterkeyhint="done"><button class="btn sec" data-act="qty-step" data-d="1" aria-label="Thêm 1">+</button></div>
      <div class="row" style="margin-top:12px"><button class="btn sec" style="flex:1" data-act="sheet-cancel">Huỷ</button><button class="btn" style="flex:2" data-act="sheet-save">${ex ? "Cập nhật" : "Lưu"}</button></div>
    </div>`;
    $("#sheet").classList.remove("hide");
    const q = $("#qty");
    q.addEventListener("focus", () => q.select());
    q.addEventListener("keydown", (e) => { if (e.key === "Enter") { e.preventDefault(); saveSheet(); } });
  }
  function closeSheet() { S.sheet = null; $("#sheet").classList.add("hide"); $("#sheet").innerHTML = ""; lastText = ""; }
  async function saveSheet() {
    const sh = S.sheet; if (!sh) return;
    const n = Math.floor(Number($("#qty").value));
    if (!(n >= 1 && n <= 100000)) { $("#qty").focus(); return flash("bad", "Số lượng phải từ 1 trở lên"); }
    if (sh.exId) {
      const ok = await setQty(sh.exId, n);
      if (!ok) return; /* giữ bảng mở để thử lại */
      closeSheet(); beep(true);
      flash("ok", `<span class="mono">${esc(sh.code)}</span> = ${n} cái · tầng này ${sumQ(atLoc(sh))} cái`);
    } else {
      const d = dot();
      if (!d || d.status !== "open") { closeSheet(); return flash("bad", "Đợt kiểm kê đã đóng"); }
      const row = { client_id: uid(), dot_id: d.id, code: sh.code, kho_id: sh.kho_id, tu_id: sh.tu_id, tang: sh.tang, qty: n, by_name: S.user.name, at: new Date().toISOString() };
      S.scans.push({ ...row, pending: true });
      S.queue.push(row); lsSet("vt_queue", S.queue);
      closeSheet();
      flash("ok", `+${n} <span class="mono">${esc(sh.code)}</span> · tầng này ${sumQ(atLoc(sh))} cái`);
      flush();
    }
    renderAll();
  }
  /* sửa số lượng: lượt chưa gửi → sửa trên máy; đã gửi → cần có sóng */
  async function setQty(clientId, n) {
    const s = S.scans.find((x) => x.client_id === clientId);
    const qr = S.queue.find((r) => r.client_id === clientId);
    if (qr) { qr.qty = n; lsSet("vt_queue", S.queue); if (s) s.qty = n; return true; }
    try { await Store.updateQty(clientId, n); if (s) s.qty = n; return true; }
    catch (e) { beep(false); flash("bad", "Chưa sửa được số lượng (mất sóng?) — thử lại khi có sóng"); return false; }
  }
  let flushing = false;
  async function flush() {
    if (flushing || !S.queue.length) return;
    flushing = true;
    try {
      while (S.queue.length) {
        const row = S.queue[0];
        let r;
        try { r = await Store.insertScan(row); } catch (e) { S.online = false; renderHeader(); break; }
        S.online = true;
        S.queue.shift(); lsSet("vt_queue", S.queue);
        const s = S.scans.find((x) => x.client_id === row.client_id);
        if (r.dup) { /* máy khác đã quét mã này trước khi máy này gửi lên */
          S.scans = S.scans.filter((x) => x.client_id !== row.client_id);
          S.conflicts.push(row); onRemote(); beep(false); flash("bad", `TRÙNG với máy khác — <span class="mono">${esc(row.code)}</span> đã được ghi ở ${esc(locText(row))}; lượt ${qn(row)} cái này không được tính. Quét lại để sửa số lượng.`);
        } else if (s) delete s.pending;
      }
    } finally { flushing = false; renderHeader(); renderScan(); }
  }
  async function undo(clientId) {
    const qi = S.queue.findIndex((r) => r.client_id === clientId);
    if (qi >= 0) { S.queue.splice(qi, 1); lsSet("vt_queue", S.queue); S.scans = S.scans.filter((s) => s.client_id !== clientId); }
    else { await Store.deleteScan(clientId, S.user.name); const s = S.scans.find((x) => x.client_id === clientId); if (s) s.deleted = true; }
    flash("info", "Đã hoàn tác 1 lượt quét"); renderAll();
  }

  /* camera */
  let cam = null, camOn = false;
  async function startCam() {
    if (camOn) return;
    try {
      $("#reader").classList.remove("hide");
      cam = cam || new Html5Qrcode("reader", { verbose: false });
      await cam.start({ facingMode: "environment" }, { fps: 12, qrbox: (w, h) => { const s = Math.floor(Math.min(w, h) * 0.7); return { width: s, height: s }; } }, (t) => onScanText(t), () => {});
      camOn = true; renderScan();
    } catch (e) { $("#reader").classList.add("hide"); flash("bad", "Không mở được camera: " + esc(e.message || e) + ". Có thể nhập mã bằng tay bên dưới."); }
  }
  async function stopCam() { if (cam && camOn) { try { await cam.stop(); } catch (e) {} camOn = false; } }

  /* ================= GIAO DIỆN ================= */
  function shell() {
    $("#app").innerHTML = `
      <header><div><b>Kiểm kê vật tư</b><br><small id="hdot"></small></div><span class="sp"></span><span id="net"></span><button id="who"></button></header>
      <main>
        <section id="tab-scan">
          <div id="locbar"></div>
          <div id="reader"></div>
          <div class="row" style="margin:8px 0 12px"><button class="btn" id="camBtn" style="flex:1;min-height:56px;font-size:17px"></button></div>
          <div class="card"><label class="f" for="manual">Nhập mã bằng tay (tem hỏng)</label><div class="row"><input id="manual" class="mono" placeholder="VD: VT-000123" autocomplete="off" autocorrect="off" autocapitalize="characters" spellcheck="false" enterkeyhint="done"><button class="btn" id="manualBtn">Thêm</button></div></div>
          <div id="recent"></div>
        </section>
        <section id="tab-other" class="hide"></section>
      </main>
      <div id="flash" class="flash hide" role="status" aria-live="polite"></div>
      <div id="sheet" class="sheet hide" role="dialog" aria-label="Nhập số lượng"></div>
      <nav>${[["scan", "Quét"], ["loc", "Vị trí"], ["ds", "Danh sách"], ["dot", "Đợt"]].map(([k, l]) => `<button data-tab="${k}">${l}</button>`).join("")}</nav>`;
    $("nav").addEventListener("click", (e) => { const b = e.target.closest("[data-tab]"); if (b) setTab(b.dataset.tab); });
    $("#camBtn").onclick = () => (camOn ? stopCam().then(renderScan) : startCam());
    $("#manualBtn").onclick = () => { const v = $("#manual").value; $("#manual").value = ""; lastText = ""; onScanText(v); };
    $("#manual").addEventListener("keydown", (e) => { if (e.key === "Enter") $("#manualBtn").click(); });
    $("#who").onclick = logout;
    $("#flash").onclick = () => $("#flash").classList.add("hide"); /* chạm để ẩn thông báo */
    document.body.addEventListener("click", onAct);
  }
  function setTab(t) {
    S.tab = t;
    if (t !== "scan") stopCam();
    $("#tab-scan").classList.toggle("hide", t !== "scan");
    $("#tab-other").classList.toggle("hide", t === "scan");
    renderAll();
  }
  function renderHeader() {
    const d = dot();
    $("#hdot").textContent = d ? `${d.name}${d.status === "closed" ? " · đã đóng" : ""}` : "Chưa chọn đợt";
    $("#net").textContent = DEMO ? "Chạy thử" : S.queue.length ? `Chờ gửi ${S.queue.length}` : S.online ? "Đã đồng bộ" : "Mất sóng";
    $("#who").textContent = (S.user && S.user.name ? S.user.name.split("@")[0] : "") + (DEMO ? "" : " · Thoát");
    document.querySelectorAll("nav button").forEach((b) => b.classList.toggle("on", b.dataset.tab === S.tab));
  }
  function renderScan() {
    const d = dot();
    $("#locbar").innerHTML = !d || d.status !== "open"
      ? `<div class="loc none"><div class="sp">Chưa có đợt kiểm kê đang mở</div><button class="btn sm" data-act="go-dot">Tạo / chọn đợt</button></div>`
      : S.loc
        ? `<div class="loc"><div class="sp"><span class="mut">Đang ghi vào</span><br><b>${esc(locText(S.loc))}</b><br><span class="mut">Tầng này: ${sumQ(atLoc(S.loc))} cái · cả đợt: ${sumQ(live())} cái</span></div><button class="btn sm sec" data-act="go-loc">Đổi</button></div>`
        : `<div class="loc none"><div class="sp"><b>Chưa chọn vị trí</b><br><span class="mut">Quét tem QR của tầng, hoặc chọn ở tab Vị trí</span></div><button class="btn sm" data-act="go-loc">Chọn</button></div>`;
    $("#camBtn").textContent = camOn ? "Tắt camera" : "Bật camera quét";
    $("#reader").classList.toggle("hide", !camOn);
    const mine = S.scans.filter((s) => !s.deleted && s.by_name === S.user.name).slice(-6).reverse();
    $("#recent").innerHTML = mine.length ? `<div class="card list"><h3>Lượt quét gần nhất của tôi</h3>${mine.map((s, i) => `<div class="it"><div style="flex:1"><b class="mono">${esc(s.code)}</b> <span class="pill">× ${qn(s)}</span>${s.pending ? ' <span class="tag">chờ gửi</span>' : ""}<div class="mut">${esc(locText(s))} · ${fmtT(s.at)}</div></div><button class="btn sm sec" data-act="edit-qty" data-id="${s.client_id}">Sửa SL</button>${i === 0 ? `<button class="btn sm bad" data-act="undo" data-id="${s.client_id}">Hoàn tác</button>` : ""}</div>`).join("")}</div>` : "";
  }
  function renderOther() {
    const el = $("#tab-other");
    if (S.tab === "loc") el.innerHTML = viewLoc();
    if (S.tab === "ds") el.innerHTML = viewDs();
    if (S.tab === "dot") el.innerHTML = viewDot();
    const q = $("#dsq"); if (q) { q.value = S.q; q.oninput = () => { S.q = q.value; const p = q.selectionStart; renderOther(); const n = $("#dsq"); n.focus(); n.setSelectionRange(p, p); }; }
  }
  function renderAll() { if (!S.user) return; renderHeader(); renderScan(); if (S.tab !== "scan") renderOther(); }

  function viewLoc() {
    const k = S.khoSel || (S.loc && S.loc.kho_id) || (S.khos[0] && S.khos[0].id);
    S.khoSel = k;
    const tus = S.tus.filter((t) => t.kho_id === k).sort((a, b) => a.code.localeCompare(b.code, "vi", { numeric: true }));
    const cnt = (t, n) => sumQ(live().filter((s) => s.tu_id === t.id && s.tang === n));
    return `
      <div class="card"><div class="row" style="flex-wrap:wrap">${S.khos.map((x) => `<button class="btn sm ${x.id === k ? "" : "sec"}" data-act="kho" data-id="${x.id}">${esc(x.name)}</button>`).join("")}</div></div>
      <div class="card"><h3>Thêm tủ vào ${esc(kho(k).name)}</h3>
        <div class="row"><div style="flex:1.4"><label class="f" for="tuCode">Mã tủ</label><input id="tuCode" placeholder="VD: A01" autocomplete="off" autocorrect="off" autocapitalize="characters" spellcheck="false"></div><div style="flex:1"><label class="f" for="tuN">Số tầng</label><input id="tuN" type="number" inputmode="numeric" min="1" max="30" placeholder="1–30"></div></div>
        <label class="f" for="tuName" style="margin-top:8px">Tên tủ (không bắt buộc)</label><input id="tuName" placeholder="VD: Tủ phụ tùng cẩu" autocomplete="off">
        <button class="btn" style="margin-top:8px;width:100%" data-act="add-tu">Thêm tủ</button></div>
      <div class="card list"><div class="row"><h3 style="flex:1">Tủ trong ${esc(kho(k).name)} (${tus.length})</h3>${tus.length ? `<button class="btn sm sec" data-act="print" data-kho="${k}">In tem tầng cả kho</button>` : ""}</div>
        ${tus.length ? tus.map((t) => `<div class="it" style="display:block"><div class="row"><b style="flex:1">Tủ ${esc(t.code)}${t.name ? ` · ${esc(t.name)}` : ""}</b><span class="mut">${t.so_tang} tầng</span><button class="btn sm sec" data-act="print" data-tu="${t.id}">In tem</button></div>
          <div class="grid3" style="margin-top:6px">${Array.from({ length: t.so_tang }, (_, i) => i + 1).map((n) => { const on = S.loc && S.loc.tu_id === t.id && S.loc.tang === n; return `<button class="btn sm ${on ? "" : "sec"}" data-act="set-loc" data-tu="${t.id}" data-n="${n}">Tầng ${n} · ${cnt(t, n)}</button>`; }).join("")}</div></div>`).join("") : '<div class="mut">Chưa có tủ. Thêm tủ ở trên.</div>'}
      </div>`;
  }
  function viewDs() {
    const q = S.q.trim().toUpperCase();
    const rows = live().filter((s) => !q || s.code.toUpperCase().includes(q) || `${kho(s.kho_id).name} ${tu(s.tu_id).code}`.toUpperCase().includes(q));
    let body = "";
    if (S.dsView === "code") {
      const g = {}; rows.forEach((s) => (g[s.code] = g[s.code] || []).push(s));
      const keys = Object.keys(g).sort();
      body = keys.length ? keys.map((c) => `<div class="it"><div style="flex:1"><b class="mono">${esc(c)}</b><div class="mut">${g[c].map((s) => `${esc(locText(s))} (${qn(s)})`).join(" · ")}</div></div><span class="pill">${sumQ(g[c])} cái</span></div>`).join("") : '<div class="mut">Không có dữ liệu</div>';
    } else {
      const g = {}; rows.forEach((s) => { const k = `${s.tu_id}|${s.tang}`; (g[k] = g[k] || []).push(s); });
      const keys = Object.keys(g).sort((a, b) => locText(g[a][0]).localeCompare(locText(g[b][0]), "vi", { numeric: true }));
      body = keys.length ? keys.map((k) => `<div class="it" style="display:block"><div class="row"><b style="flex:1">${esc(locText(g[k][0]))}</b><span class="pill">${sumQ(g[k])} cái</span></div>${g[k].map((s) => `<div class="row" style="padding:6px 0 0 8px"><div style="flex:1"><span class="mono"><b>${esc(s.code)}</b></span> <span class="pill">× ${qn(s)}</span><div class="mut">${fmtT(s.at)} · ${esc(s.by_name || "")}</div></div><button class="btn sm sec" data-act="edit-qty" data-id="${s.client_id}">Sửa SL</button>${s.pending ? "" : `<button class="btn sm sec" data-act="del" data-id="${s.client_id}">Xoá</button>`}</div>`).join("")}</div>`).join("") : '<div class="mut">Không có dữ liệu</div>';
    }
    return `<div class="card"><div class="row"><button class="btn sm ${S.dsView === "code" ? "" : "sec"}" data-act="dsv" data-v="code">Theo mã</button><button class="btn sm ${S.dsView === "loc" ? "" : "sec"}" data-act="dsv" data-v="loc">Theo vị trí</button><span style="flex:1"></span><span class="mut">${sumQ(live())} cái · ${new Set(live().map((s) => s.code)).size} mã</span></div>
      <input id="dsq" type="search" style="margin-top:8px" placeholder="Tìm mã / kho / tủ" autocomplete="off" autocorrect="off" autocapitalize="characters" spellcheck="false" enterkeyhint="search"></div><div class="card list">${body}</div>
      ${S.conflicts.length ? `<div class="card"><h3>Lượt quét bị từ chối vì trùng máy khác (${S.conflicts.length})</h3>${S.conflicts.map((r) => `<div class="mut mono">${esc(r.code)} · ${esc(locText(r))} · ${fmtT(r.at)}</div>`).join("")}</div>` : ""}`;
  }
  function viewDot() {
    const d = dot();
    return `<div class="card"><h3>Đợt kiểm kê mới</h3><div class="row"><input id="dotName" value="Kiểm kê ${today()}"><button class="btn" data-act="add-dot">Tạo</button></div></div>
      ${d ? `<div class="card"><div class="row"><div style="flex:1"><b>${esc(d.name)}</b><div class="mut">${d.status === "open" ? "Đang mở" : "Đã đóng"} · ${sumQ(live())} cái · ${new Set(live().map((s) => s.code)).size} mã</div></div></div>
        <div class="row" style="margin-top:10px"><button class="btn" style="flex:1" data-act="export">Xuất Excel</button>${d.status === "open" ? '<button class="btn sec" data-act="close-dot">Đóng đợt</button>' : ""}</div></div>` : ""}
      <div class="card list"><h3>Các đợt</h3>${S.dots.length ? S.dots.slice().sort((a, b) => (a.created_at < b.created_at ? 1 : -1)).map((x) => `<div class="it"><div style="flex:1"><b>${esc(x.name)}</b><div class="mut">${x.status === "open" ? "Đang mở" : "Đã đóng"} · ${fmtT(x.created_at)}</div></div><button class="btn sm ${x.id === S.dotId ? "" : "sec"}" data-act="pick-dot" data-id="${x.id}">${x.id === S.dotId ? "Đang chọn" : "Chọn"}</button></div>`).join("") : '<div class="mut">Chưa có đợt nào</div>'}</div>`;
  }

  /* in tem QR cho tầng */
  function printLabels(tuList) {
    const items = tuList.flatMap((t) => Array.from({ length: t.so_tang }, (_, i) => ({ t, n: i + 1 })));
    const html = items.map(({ t, n }) => { const qr = qrcode(0, "M"); qr.addData(`${LOC_PREFIX}${t.kho_id}|${t.code}|${n}`); qr.make(); return `<div class="label">${qr.createSvgTag({ cellSize: 4, margin: 4, scalable: true })}<b>${esc(kho(t.kho_id).name)} · Tủ ${esc(t.code)}</b><span style="font-size:15pt;font-weight:800">TẦNG ${n}</span></div>`; }).join("");
    const w = window.open("", "_blank");
    if (!w) return flash("bad", "Trình duyệt chặn cửa sổ in — cho phép popup rồi thử lại");
    w.document.write(`<!doctype html><html><head><meta charset="utf-8"><title>Tem tầng</title><style>body{font-family:Arial,sans-serif;margin:8mm}.labels{display:grid;grid-template-columns:repeat(3,1fr);gap:4mm}.label{border:1px dashed #94A3B8;border-radius:2mm;padding:3mm;text-align:center;break-inside:avoid}.label svg{width:34mm;height:34mm}.label b{display:block;font-size:11pt}</style></head><body><div class="labels">${html}</div><script>setTimeout(function(){window.print()},300)<\/script></body></html>`);
    w.document.close();
  }

  /* xuất Excel */
  function exportXlsx() {
    const d = dot(); const L = live();
    const byCode = {}; L.forEach((s) => (byCode[s.code] = byCode[s.code] || []).push(s));
    const s1 = [["Mã vật tư", "Số lượng", "Vị trí"]].concat(Object.keys(byCode).sort().map((c) => [c, sumQ(byCode[c]), byCode[c].map((s) => `${locText(s)} (${qn(s)})`).join("; ")]));
    const byLoc = {}; L.forEach((s) => { const k = `${s.kho_id}|${tu(s.tu_id).code}|${s.tang}|${s.code}`; byLoc[k] = (byLoc[k] || 0) + qn(s); });
    const s2 = [["Kho", "Tủ", "Tầng", "Mã vật tư", "Số lượng"]].concat(Object.keys(byLoc).sort((a, b) => a.localeCompare(b, "vi", { numeric: true })).map((k) => { const [kh, t, n, c] = k.split("|"); return [kho(kh).name, t, Number(n), c, byLoc[k]]; }));
    const s3 = [["Thời gian", "Mã vật tư", "Số lượng", "Kho", "Tủ", "Tầng", "Người quét", "Trạng thái"]].concat(S.scans.slice().sort((a, b) => (a.at < b.at ? -1 : 1)).map((s) => [fmtT(s.at), s.code, qn(s), kho(s.kho_id).name, tu(s.tu_id).code, s.tang, s.by_name || "", s.deleted ? "Đã xoá / hoàn tác" : s.pending ? "Chờ gửi" : "Hợp lệ"]));
    const wb = XLSX.utils.book_new();
    [[s1, "Tong hop theo ma"], [s2, "Theo vi tri"], [s3, "Nhat ky quet"]].forEach(([a, n]) => { const ws = XLSX.utils.aoa_to_sheet(a); ws["!cols"] = a[0].map((h, i) => ({ wch: i === 2 && n.startsWith("Tong") ? 60 : 16 })); XLSX.utils.book_append_sheet(wb, ws, n); });
    XLSX.writeFile(wb, `KiemKe_${(d ? d.name : "vat_tu").replace(/[^\p{L}\p{N}]+/gu, "_")}.xlsx`);
  }

  /* hành động */
  async function onAct(e) {
    const b = e.target.closest("[data-act]"); if (!b) return;
    const a = b.dataset.act;
    try {
      if (a === "go-dot") setTab("dot");
      if (a === "go-loc") setTab("loc");
      if (a === "kho") { S.khoSel = b.dataset.id; renderOther(); }
      if (a === "set-loc") { const t = tu(b.dataset.tu); S.loc = { kho_id: t.kho_id, tu_id: t.id, tang: Number(b.dataset.n) }; lsSet("vt_loc", S.loc); setTab("scan"); flash("info", `Vị trí: ${esc(locText(S.loc))}`); }
      if (a === "add-tu") {
        const code = $("#tuCode").value.trim().toUpperCase(), name = $("#tuName").value.trim(), n = Number($("#tuN").value);
        if (!code || /[|]/.test(code)) return flash("bad", "Nhập mã tủ (không chứa ký tự |)");
        if (!(n >= 1 && n <= 30)) return flash("bad", "Số tầng từ 1 đến 30");
        await Store.addTu({ kho_id: S.khoSel, code, name: name || null, so_tang: n }); await reload();
      }
      if (a === "print") printLabels(b.dataset.tu ? [tu(b.dataset.tu)] : S.tus.filter((t) => t.kho_id === b.dataset.kho).sort((x, y) => x.code.localeCompare(y.code, "vi", { numeric: true })));
      if (a === "add-dot") { const n = $("#dotName").value.trim(); if (!n) return; const d = await Store.addDot(n); S.dotId = d.id; lsSet("vt_dot", S.dotId); await reload(); }
      if (a === "pick-dot") { S.dotId = b.dataset.id; lsSet("vt_dot", S.dotId); await reload(); }
      if (a === "close-dot") { if (!confirm("Đóng đợt kiểm kê? Sau khi đóng không quét thêm vào đợt này.")) return; await Store.closeDot(S.dotId); await reload(); }
      if (a === "export") exportXlsx();
      if (a === "dsv") { S.dsView = b.dataset.v; renderOther(); }
      if (a === "qty-step") { const q = $("#qty"); q.value = Math.max(1, (Math.floor(Number(q.value)) || 0) + Number(b.dataset.d)); }
      if (a === "sheet-save") await saveSheet();
      if (a === "sheet-cancel") closeSheet();
      if (a === "edit-qty") { const s = S.scans.find((x) => x.client_id === b.dataset.id); if (s && !S.sheet) openSheet({ code: s.code, kho_id: s.kho_id, tu_id: s.tu_id, tang: s.tang, exId: s.client_id }); }
      if (a === "undo") await undo(b.dataset.id);
      if (a === "del") { if (!confirm("Xoá lượt quét này? (đánh dấu đã xoá, vẫn còn trong nhật ký)")) return; await undo(b.dataset.id); }
    } catch (err) { flash("bad", esc(err.message || err)); }
  }

  /* ================= TẢI DỮ LIỆU / ĐĂNG NHẬP ================= */
  async function reload() {
    const d = await Store.loadAll(S.dotId);
    S.khos = d.khos; S.tus = d.tus; S.dots = d.dots;
    if (!S.dots.some((x) => x.id === S.dotId)) { const o = S.dots.find((x) => x.status === "open"); S.dotId = o ? o.id : null; lsSet("vt_dot", S.dotId); if (S.dotId) return reload(); }
    const pend = S.queue.filter((r) => r.dot_id === S.dotId && !d.scans.some((s) => s.client_id === r.client_id)).map((r) => ({ ...r, pending: true }));
    S.scans = d.scans.concat(pend);
    if (S.loc && !S.tus.some((t) => t.id === S.loc.tu_id)) { S.loc = null; lsSet("vt_loc", null); }
    renderAll();
  }
  let rt = null;
  const onRemote = () => { clearTimeout(rt); rt = setTimeout(() => reload().catch(() => {}), 400); };
  async function start(user) {
    S.user = user;
    shell(); await Store.init(onRemote); await reload(); setTab("scan");
    window.addEventListener("online", () => { S.online = true; flush(); reload().catch(() => {}); });
    window.addEventListener("offline", () => { S.online = false; renderHeader(); });
    setInterval(flush, 8000); flush();
  }
  async function logout() {
    if (DEMO) { const n = prompt("Tên người quét", S.user.name); if (n && n.trim()) { S.user.name = n.trim(); lsSet("vt_demo_user", S.user); renderAll(); } return; }
    if (S.queue.length && !confirm(`Còn ${S.queue.length} lượt quét chưa gửi. Vẫn đăng xuất?`)) return;
    await stopCam(); await Sb.client().auth.signOut(); location.reload();
  }
  function loginView(msg) {
    $("#app").innerHTML = `<header><b>Kiểm kê vật tư</b></header><main><div class="card" style="margin-top:24px">
      ${DEMO ? `<h3>Chế độ chạy thử</h3><p class="mut">Dữ liệu lưu trên máy này. Điền Supabase vào config.js để dùng chung.</p><input id="lname" placeholder="Tên người quét"><button class="btn" style="width:100%;margin-top:10px" id="lbtn">Bắt đầu</button>`
      : `<h3>Đăng nhập</h3><p class="mut">Dùng tài khoản giống app Quản lý Kho.</p><input id="lemail" type="email" placeholder="Email" autocomplete="username"><input id="lpw" type="password" placeholder="Mật khẩu" style="margin-top:8px" autocomplete="current-password"><button class="btn" style="width:100%;margin-top:10px" id="lbtn">Đăng nhập</button>`}
      <div class="mut" style="color:var(--bad);margin-top:8px">${esc(msg || "")}</div></div></main>`;
    $("#lbtn").onclick = async () => {
      if (DEMO) { const n = $("#lname").value.trim(); if (!n) return; const u = { id: "demo", name: n }; lsSet("vt_demo_user", u); return start(u); }
      const r = await Sb.client().auth.signInWithPassword({ email: $("#lemail").value.trim(), password: $("#lpw").value });
      if (r.error) return loginView("Sai email hoặc mật khẩu");
      startMember(r.data.user);
    };
  }
  /* Giống /warehouse: chỉ email có trong app_users mới được dùng (RLS các bảng vt_* dùng is_member()). */
  async function startMember(user) {
    const email = (user.email || "").toLowerCase();
    const r = await Sb.client().from("app_users").select("email").eq("email", email).maybeSingle();
    if (r.error) return loginView("Không kiểm tra được quyền: " + r.error.message);
    if (!r.data) { await Sb.client().auth.signOut(); return loginView(`Tài khoản ${email} chưa được cấp quyền (chưa có trong app_users). Liên hệ quản trị.`); }
    start({ id: user.id, name: user.email });
  }
  (async () => {
    if (DEMO) { const u = lsGet("vt_demo_user", null); return u ? start(u) : loginView(); }
    const { data } = await Sb.client().auth.getSession();
    if (data && data.session) startMember(data.session.user); else loginView();
  })();
  window.__vt = { S, onScanText, flush }; /* để kiểm thử */
})();
