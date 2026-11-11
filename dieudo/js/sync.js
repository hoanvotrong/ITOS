/* ==========================================================
   Điều độ khai thác (pilot) — lớp đồng bộ Supabase
   Prototype giữ trạng thái trong các mảng / đối tượng toàn cục (DD_JOBS, DD_ORDERS…) và sửa trực tiếp.
   Lớp này KHÔNG đổi cách đó, chỉ thêm:
   · Nạp: mỗi dòng dd_docs (coll, id, data) → một phần tử mảng (trước khi chạy mã module).
   · Ghi: sau mỗi thao tác (click / nhập / __ddTick) và mỗi 4 giây, so sánh JSON chuẩn hoá của từng
     phần tử với lần đồng bộ trước → upsert phần tử đổi, xoá phần tử mất.
   · Realtime: thiết bị khác ghi → cập nhật phần tử tại chỗ (giữ tham chiếu) → vẽ lại.
   · Mất mạng: thay đổi chưa lưu giữ trong localStorage, tự gửi lại khi có mạng / mở lại trang.
   · Xung đột: bản ghi sau thắng (cả phần tử). Xem README.
   · Thời gian: trong mã dạng "dd/mm/yyyy HH:mm" GMT+7; trong CSDL đổi sang ISO UTC.
   ========================================================== */
(function () {
  'use strict';

  /* Nhóm dữ liệu (coll) → cách xếp khi nạp: 'asc' = cũ trước (mã dùng push), 'desc' = mới trước (unshift) */
  const COLLS = { jobs: 'desc', orders: 'asc', records: 'asc', edit_reqs: 'desc', incidents: 'desc', trans: 'desc', cont_reg: 'map', gate_log: 'desc', calls: 'asc', ship_orders: 'desc' };
  const CAT_KINDS = ['customer', 'berth', 'vehicle', 'equip', 'line'];
  const ISO_RE = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2}(\.\d+)?)?Z$/;
  const AT_RE = /^\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}$/;

  const deep = (v, f) => Array.isArray(v) ? v.map(x => deep(x, f)) : v && typeof v === 'object' ? Object.fromEntries(Object.entries(v).filter(([, x]) => x !== undefined).map(([k, x]) => [k, deep(x, f)])) : f(v);
  const toWire = (v) => deep(v, x => typeof x === 'string' && AT_RE.test(x) ? window.ddAtToIso(x) : x);
  const fromWire = (v) => deep(v, x => typeof x === 'string' && ISO_RE.test(x) ? window.ddIsoToAt(x) : x);
  /* JSON chuẩn hoá (khoá xếp thứ tự) — jsonb trên máy chủ đổi thứ tự khoá */
  const canon = (v) => Array.isArray(v) ? `[${v.map(canon).join(',')}]` : v && typeof v === 'object' ? `{${Object.keys(v).filter(k => v[k] !== undefined && typeof v[k] !== 'function').sort().map(k => `${JSON.stringify(k)}:${canon(v[k])}`).join(',')}}` : JSON.stringify(v === undefined ? null : v);

  let B = null;            // DD_BOOT
  let snap = new Map();    // "coll|id" → canon(toWire(data)) của bản đã có trên máy chủ
  let catSnap = new Map(); // "kind|id" → canon(data)
  let canCatalog = false;
  const st = { online: navigator.onLine, pending: 0, error: null };
  const statusFns = new Set(), changeFns = new Set();
  const notifyStatus = () => statusFns.forEach(f => { try { f(); } catch (e) {} });
  const PKEY = () => `dd-pending:${B.me.email}`;
  const readPending = () => { try { return JSON.parse(localStorage.getItem(PKEY())) || {}; } catch (e) { return {}; } };
  const writePending = (p) => { try { Object.keys(p).length ? localStorage.setItem(PKEY(), JSON.stringify(p)) : localStorage.removeItem(PKEY()); } catch (e) {} };

  const keyOf = (coll, el) => coll === 'cont_reg' ? null : el && el.id;
  const ordOf = (el) => el && el._o || 0;
  const place = (coll, el) => {
    const arr = B.docs[coll];
    if (COLLS[coll] === 'asc') arr.push(el); else arr.unshift(el);
  };

  /* ---------- nạp ban đầu ---------- */
  function prepare({ me, users, catRows, docRows }) {
    B = { me, users, catalog: {}, docs: {} };
    CAT_KINDS.forEach(k => { B.catalog[k] = []; });
    catRows.forEach(r => { if (!B.catalog[r.kind]) return; B.catalog[r.kind].push(r.kind === 'line' ? (r.data.name || r.id) : r.data); catSnap.set(`${r.kind}|${r.id}`, canon(r.data)); });
    Object.keys(COLLS).forEach(c => { B.docs[c] = COLLS[c] === 'map' ? {} : []; });
    docRows.forEach(r => {
      if (!(r.coll in COLLS)) return;
      const el = fromWire(r.data);
      if (COLLS[r.coll] === 'map') B.docs[r.coll][r.id] = el; else B.docs[r.coll].push(el);
      snap.set(`${r.coll}|${r.id}`, canon(r.data));
    });
    Object.keys(COLLS).forEach(c => { if (COLLS[c] === 'asc') B.docs[c].sort((a, b) => ordOf(a) - ordOf(b)); else if (COLLS[c] === 'desc') B.docs[c].sort((a, b) => ordOf(b) - ordOf(a)); });
    /* thay đổi chưa gửi được từ lần trước (mất mạng / đóng trang) */
    const pend = readPending();
    Object.entries(pend).forEach(([k, v]) => {
      const [coll, id] = k.split('|'); if (!(coll in COLLS)) return;
      if (COLLS[coll] === 'map') { if (v === null) delete B.docs[coll][id]; else B.docs[coll][id] = fromWire(v); return; }
      const arr = B.docs[coll]; const i = arr.findIndex(x => x.id === id);
      if (v === null) { if (i >= 0) arr.splice(i, 1); return; }
      const el = fromWire(v); if (i >= 0) arr[i] = el; else place(coll, el);
    });
    canCatalog = ['KHTH', 'TP'].includes(me.role);
    return B;
  }

  /* ---------- trạng thái hiện tại → bản ghi cần gửi ---------- */
  function collect() {
    const cur = new Map(), rows = [], dels = [];
    Object.keys(COLLS).forEach(coll => {
      const src = B.docs[coll];
      const entries = COLLS[coll] === 'map' ? Object.entries(src) : src.map(el => [keyOf(coll, el), el]);
      const now = Date.now();
      entries.forEach(([id, el]) => {
        if (!id || !el || typeof el !== 'object') return;
        if (COLLS[coll] !== 'map' && !el._o) el._o = now; /* thứ tự tạo — để xếp lại khi nạp */
        const w = toWire(el), c = canon(w), k = `${coll}|${id}`;
        cur.set(k, c);
        if (snap.get(k) !== c) rows.push({ coll, id: String(id), data: w, _k: k, _c: c });
      });
    });
    snap.forEach((_, k) => { if (!cur.has(k)) dels.push(k); });
    return { rows, dels };
  }
  function collectCatalog() {
    if (!canCatalog) return [];
    const out = [];
    const veh = (window.DD_VEHICLES || B.catalog.vehicle).filter(v => v && v.plate).map(v => ['vehicle', v.plate, v]);
    const lines = (window.DD_LINES_REF || B.catalog.line).filter(Boolean).map(n => ['line', n, { name: n }]);
    [...veh, ...lines].forEach(([kind, id, data]) => { const c = canon(data), k = `${kind}|${id}`; if (catSnap.get(k) !== c) out.push({ kind, id, data: JSON.parse(JSON.stringify(data)), _k: k, _c: c }); });
    return out;
  }

  /* ---------- gửi lên ---------- */
  let flushing = false, again = false, timer = null, retryT = null;
  async function flush() {
    if (!B) return;
    if (flushing) { again = true; return; }
    const { rows, dels } = collect();
    const cats = collectCatalog();
    st.pending = rows.length + dels.length + cats.length;
    if (!st.pending) { if (st.error) { st.error = null; } notifyStatus(); return; }
    notifyStatus();
    flushing = true;
    try {
      for (let i = 0; i < rows.length; i += 200) {
        const part = rows.slice(i, i + 200);
        const { error } = await window.DD_SB.from('dd_docs').upsert(part.map(r => ({ coll: r.coll, id: r.id, data: r.data })));
        if (error) throw error;
        part.forEach(r => snap.set(r._k, r._c));
      }
      const byColl = {}; dels.forEach(k => { const [c, id] = k.split('|'); (byColl[c] = byColl[c] || []).push(id); });
      for (const [coll, ids] of Object.entries(byColl)) {
        const { error } = await window.DD_SB.from('dd_docs').delete().eq('coll', coll).in('id', ids);
        if (error) throw error;
        ids.forEach(id => snap.delete(`${coll}|${id}`));
      }
      if (cats.length) {
        const { error } = await window.DD_SB.from('dd_catalog').upsert(cats.map(r => ({ kind: r.kind, id: r.id, data: r.data })));
        if (error) throw error;
        cats.forEach(r => catSnap.set(r._k, r._c));
      }
      writePending({});
      st.error = null; st.online = true;
      /* bản ghi / sự cố tạo lúc mất mạng: đánh dấu đã đồng bộ (giữ dấu vết offline) */
      let marked = false;
      ['records', 'incidents'].forEach(c => B.docs[c].forEach(x => { if (x.offline) { x.offline = false; x.syncAt = window.ddVnNow().time; marked = true; } }));
      if (marked) { again = true; rerender(); }
    } catch (e) {
      console.warn('[dd-sync]', e);
      const p = {}; rows.forEach(r => { p[r._k] = r.data; }); dels.forEach(k => { p[k] = null; });
      writePending(p);
      st.error = navigator.onLine ? (e.message || String(e)) : null; st.online = navigator.onLine;
      clearTimeout(retryT); retryT = setTimeout(flush, 5000);
    } finally {
      flushing = false;
      const { rows: r2, dels: d2 } = collect(); st.pending = r2.length + d2.length;
      notifyStatus();
      if (again) { again = false; schedule(); }
    }
  }
  function schedule(ms) { clearTimeout(timer); timer = setTimeout(flush, ms == null ? 400 : ms); }

  /* ---------- nhận từ thiết bị khác ---------- */
  function rerender() { changeFns.forEach(f => { try { f(); } catch (e) { console.error(e); } }); window.__ddTick && window.__ddTick(true); }
  function applyRemote(ev) {
    const row = ev.new && ev.new.coll ? ev.new : ev.old; if (!row || !(row.coll in COLLS)) return;
    const coll = row.coll, id = row.id, k = `${coll}|${id}`, mode = COLLS[coll];
    if (ev.eventType === 'DELETE') {
      if (!snap.has(k)) return; snap.delete(k);
      if (mode === 'map') delete B.docs[coll][id]; else { const i = B.docs[coll].findIndex(x => x.id === id); if (i >= 0) B.docs[coll].splice(i, 1); }
      return rerender();
    }
    const c = canon(row.data);
    if (snap.get(k) === c) return;                 /* chính thiết bị này vừa ghi */
    const local = mode === 'map' ? B.docs[coll][id] : B.docs[coll].find(x => x.id === id);
    const localDirty = local && snap.has(k) && canon(toWire(local)) !== snap.get(k);
    snap.set(k, c);
    if (localDirty) { schedule(); return; }        /* máy này có sửa chưa gửi → gửi đè (bản sau thắng) */
    const el = fromWire(row.data);
    if (mode === 'map') B.docs[coll][id] = el;
    else if (local) { Object.keys(local).forEach(x => delete local[x]); Object.assign(local, el); } /* giữ tham chiếu cho màn đang mở */
    else place(coll, el);
    rerender();
  }

  /* ---------- ảnh: Storage bucket private 'dieudo-photos' ---------- */
  const photoQueue = [];
  async function shrink(file) {
    try {
      const bmp = await createImageBitmap(file);
      const k = Math.min(1, 1600 / Math.max(bmp.width, bmp.height));
      const cv = document.createElement('canvas'); cv.width = Math.round(bmp.width * k); cv.height = Math.round(bmp.height * k);
      cv.getContext('2d').drawImage(bmp, 0, 0, cv.width, cv.height);
      return await new Promise(r => cv.toBlob(b => r(b || file), 'image/jpeg', 0.8));
    } catch (e) { return file; }
  }
  function rnd() { const a = new Uint32Array(2); crypto.getRandomValues(a); return a[0].toString(36) + a[1].toString(36); }
  async function putPhoto(item) {
    const blob = item.blob || (item.blob = await shrink(item.file));
    const { error } = await (item.client || window.DD_SB).storage.from('dieudo-photos').upload(item.path, blob, { contentType: 'image/jpeg', upsert: false });
    if (error && !/exists/i.test(error.message)) throw error;
    return item.path;
  }
  function uploadPhoto(file, prefix, client) {
    const item = { file, path: `${prefix.replace(/[^A-Za-z0-9/_-]/g, '_')}-${rnd()}.jpg`, client };
    return new Promise((resolve) => {
      item.done = resolve;
      putPhoto(item).then(resolve, (e) => { console.warn('[dd-photo]', e); photoQueue.push(item); });
    });
  }
  async function retryPhotos() {
    for (const item of photoQueue.splice(0)) { try { item.done(await putPhoto(item)); } catch (e) { photoQueue.push(item); } }
  }
  const urlCache = new Map();
  async function photoUrl(path) {
    const hit = urlCache.get(path); if (hit && hit.exp > Date.now()) return hit.url;
    const { data, error } = await window.DD_SB.storage.from('dieudo-photos').createSignedUrl(path, 3600);
    if (error) throw error;
    urlCache.set(path, { url: data.signedUrl, exp: Date.now() + 3300e3 });
    return data.signedUrl;
  }

  /* ---------- chạy ---------- */
  function start() {
    /* mọi thao tác người dùng → hẹn gửi (so sánh nên an toàn khi không có gì đổi) */
    ['click', 'change', 'input', 'keyup', 'touchend'].forEach(t => document.addEventListener(t, () => schedule(), true));
    setInterval(() => { if (!flushing) flush(); }, 4000);
    setInterval(retryPhotos, 15000);
    window.addEventListener('online', () => { st.online = true; notifyStatus(); flush(); retryPhotos(); });
    window.addEventListener('offline', () => { st.online = false; notifyStatus(); });
    window.DD_SB.channel('dd_docs').on('postgres_changes', { event: '*', schema: 'public', table: 'dd_docs' }, applyRemote).subscribe();
    schedule(50);
  }

  window.DD_SYNC = {
    prepare, start, flush: () => flush(), schedule,
    status: () => ({ ...st }),
    onStatus: (f) => { statusFns.add(f); return () => statusFns.delete(f); },
    onChange: (f) => { changeFns.add(f); return () => changeFns.delete(f); },
    uploadPhoto, photoUrl, shrink,
    signOut: async () => { await flush(); await window.DD_SB.auth.signOut(); location.reload(); },
    _debug: { snap: () => snap, collect: () => collect() },
  };
})();
