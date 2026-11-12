/* Web tài xế xe ngoài (pilot) — theo DdDriverWeb / DdDrvCont của prototype v61 (vt.jsx), tab "Xe ngoài".
   · Không tài khoản: biển số + mã của lệnh ca (BR-VT-04). Khoá anon chỉ gọi 3 hàm RPC, không đọc bảng.
   · Gắn cont (BR-GATE-12, 2 TEU / xe) bắt buộc ảnh thật — lưu Storage dieudo-photos/driver/ (chỉ được tải lên).
   · Bỏ gắn (BR-GATE-14): chỉ trước khi tally xác nhận gate, bắt buộc lý do.
   · Mỗi 15 giây hỏi lại máy chủ: tally đã gate / kết ca / KHTH đổi mã → cập nhật hoặc báo hết phiên. */

const sbAnon = window.supabase.createClient(window.KHO_CONFIG.supabaseUrl, window.KHO_CONFIG.supabaseAnonKey, { auth: { persistSession: false, autoRefreshToken: false } });
const DD_SHIFT_LABEL = { 1: "Ca 1", 2: "Ca 2" };
const DD_DIR_SHORT = { direct: "xuất thẳng", export: "xuất bãi", import: "nhập lưu bãi" };
const DD_UNASSIGN_WHY = ["Chọn nhầm", "Xe hỏng", "Đổi xe"];
const tlContFmt = (no) => `${no.slice(0, 4)} ${no.slice(4, 10)} ${no.slice(10)}`;
const ddCDir = (c, j) => c.dir || j.contDir;
const ddContGate = (c, j) => ddCDir(c, j) === "import" ? "in" : "out";
const ddContDone = (c, j) => ddContGate(c, j) === "in" ? !!c.gin : !!c.gout;
const ddDirCount = (j) => { const m = {}; (j.conts || []).forEach(c => { const d = ddCDir(c, j); m[d] = (m[d] || 0) + 1; }); return m; };
const SKEY = "dd-taixe-session";
const rpc = async (fn, args) => {
  const { data, error } = await sbAnon.rpc(fn, args);
  if (error) return { err: navigator.onLine ? "Lỗi máy chủ — thử lại" : "Mất mạng — thử lại khi có sóng", net: true };
  return data || { err: "Lỗi máy chủ — thử lại", net: true };
};
const rnd = () => { const a = new Uint32Array(2); crypto.getRandomValues(a); return a[0].toString(36) + a[1].toString(36); };

/* Danh sách cont của job — giữ giao diện DdDrvCont, thao tác gọi RPC */
const DrvCont = ({ view, auth, onView, back }) => {
  const job = view.job, plate = auth.plate;
  const [q, setQ] = React.useState("");
  const [sel, setSel] = React.useState(null);
  const [photo, setPhoto] = React.useState(null);
  const [busy, setBusy] = React.useState(false);
  const [msg, setMsg] = React.useState(null);
  const [err, setErr] = React.useState(null);
  const [un, setUn] = React.useState(null);
  const toast = (m) => { setMsg(m); clearTimeout(window.__dwT); window.__dwT = setTimeout(() => setMsg(null), 1800); };
  const open = job.conts.filter(c => !ddContDone(c, job) && !c.closedAs);
  const mine = open.filter(c => c.drvTruck === plate);
  const done = job.conts.filter(c => ddContDone(c, job) && (c.truck === plate || c.drvTruck === plate));
  const teuOf = (x) => String(x.type || "").startsWith("2") ? 1 : 2;
  const used = mine.reduce((t, x) => t + teuOf(x), 0);
  const full = (x) => used + teuOf(x) > 2;
  const qk = q.toUpperCase().replace(/[\s.\-]/g, ""); /* số cont: bỏ khoảng trắng, chấm, gạch */ const list = open.filter(c => c.drvTruck !== plate && (!qk || c.no.includes(qk)));
  const c = sel && job.conts.find(x => x.no === sel);

  const attach = async () => {
    setBusy(true); setErr(null);
    try {
      const blob = await DD_SYNC.shrink(photo);
      const path = `driver/${job.id}-${c.no}-${rnd()}.jpg`;
      const up = await sbAnon.storage.from("dieudo-photos").upload(path, blob, { contentType: "image/jpeg" });
      if (up.error) { setErr(navigator.onLine ? `Không tải được ảnh: ${up.error.message}` : "Mất mạng — chưa gửi được ảnh, thử lại"); return; }
      const r = await rpc("dd_driver_attach", { p_plate: auth.plate, p_code: auth.code, p_cont: c.no, p_photo: path });
      if (r.err) { setErr(r.err); if (!r.net) onView(null, r.err); return; }
      onView(r); toast(`Đã gắn ${tlContFmt(c.no)} vào xe ${plate}`); setSel(null); setPhoto(null);
    } finally { setBusy(false); }
  };
  const unassign = async (x, w) => {
    setBusy(true);
    const r = await rpc("dd_driver_unassign", { p_plate: auth.plate, p_code: auth.code, p_cont: x.no, p_reason: w });
    setBusy(false); setUn(null);
    if (r.err) { toast(r.err); return; }
    onView(r); toast("Đã bỏ gắn · đã ghi nhật ký job");
  };

  if (c) return (<>
    <div className="tl-bar"><button className="tl-back" onClick={() => { setSel(null); setPhoto(null); setErr(null); }}>‹</button><div style={{ flex: 1 }}><div className="tl-title">Nhận cont</div><div className="tl-sub">{job.id} · xe {plate}</div></div><span style={{ width: 36 }}></span></div>
    <div className="tl-scroll">
      <div className="tl-confirm"><div className="tl-muted">{c.type} · {c.fe === "F" ? "FCL" : "MTY"} · {DD_DIR_SHORT[ddCDir(c, job)]}{c.dest ? ` · đi ${c.dest}` : ""}</div><div className="mono" style={{ fontSize: 28, fontWeight: 800, margin: "6px 0" }}>{tlContFmt(c.no)}</div><div>gắn vào xe <span className="tl-plate">{plate}</span></div></div>
      <DdPhotoBtn className={`tl-sec ${photo ? "on" : ""}`} style={{ width: "100%", height: 64 }} file={photo} onPick={setPhoto} label="📷 Chụp ảnh cont đã lên xe" done="✓ Đã chụp ảnh cont trên xe · chụp lại" />
      {err && <div className="tl-tag warn" style={{ background: "#FEE2E2", color: "#B91C1C", margin: 0 }}>{err}</div>}
      <button className="tl-main" disabled={!photo || busy} onClick={attach}>{busy ? "ĐANG GỬI…" : "GẮN CONT VÀO XE"}<small>Tally chỉ cần xác nhận khi Gate In / Gate Out</small></button>
    </div>
    {msg && <div className="tl-toast">✓ {msg}</div>}
  </>);
  return (<>
    <div className="tl-bar">{back ? <button className="tl-back" onClick={back}>‹</button> : <span style={{ width: 36 }}></span>}<div style={{ flex: 1 }}><div className="tl-title">{job.customerName || job.customer} · {Object.keys(ddDirCount(job)).length > 1 ? "Cont hỗn hợp" : DD_DIR_SHORT[job.contDir]}</div><div className="tl-sub">{job.id} · xe {plate}</div></div><span style={{ width: 36 }}></span></div>
    <div className="tl-scroll">
      {mine.length > 0 && <div className="tl-muted" style={{ margin: "2px 0 6px" }}>Cont đã gắn vào xe tôi</div>}
      {mine.map(x => <div key={x.no} className="tl-rec" style={{ flexWrap: "wrap" }}><div style={{ flex: 1 }}><b className="mono">{tlContFmt(x.no)}</b><div className="tl-muted">{DD_DIR_SHORT[ddCDir(x, job)]} · {x.drvAt} · có ảnh · chờ tally {ddContGate(x, job) === "in" ? "Gate In" : "Gate Out"}</div></div><button className="tl-link" onClick={() => setUn(un === x.no ? null : x.no)}>Bỏ gắn</button>
        {un === x.no && <div style={{ width: "100%", marginTop: 8 }}><div className="tl-muted" style={{ marginBottom: 6 }}>Lý do bỏ gắn</div><div className="tl-chips">{DD_UNASSIGN_WHY.map(w => <button key={w} disabled={busy} onClick={() => unassign(x, w)}>{w}</button>)}</div></div>}</div>)}
      {used >= 2 && <div className="tl-tag warn" style={{ margin: "8px 0 0" }}>Xe đã đủ tải ({mine.length} cont) — chờ tally xác nhận gate, hoặc bỏ gắn trước khi nhận cont khác</div>}
      <div className="tl-muted" style={{ margin: "10px 0 6px" }}>Chọn cont của job ({list.length})</div>
      <div className="tl-search"><span>🔍</span><input className="tl-qin" inputMode="search" autoCapitalize="characters" autoComplete="off" placeholder="Số cont (VD 812300)" value={q} onChange={e => setQ(e.target.value.toUpperCase())} />{q && <button onClick={() => setQ("")}>✕</button>}</div>
      {list.slice(0, 20).map(x => { const other = x.drvTruck && x.drvTruck !== plate; const over = !other && full(x); return (
        <button key={x.no} className="tl-choice" disabled={!!other || over} style={{ opacity: other || over ? .5 : 1 }} onClick={() => setSel(x.no)}>
          <b className="mono">{tlContFmt(x.no)}</b><span className="tl-muted" style={{ textAlign: "right" }}>{x.type} · {DD_DIR_SHORT[ddCDir(x, job)]}{x.dest ? ` · đi ${x.dest}` : ""}{other ? <><br/>xe {x.drvTruck} đã nhận</> : over ? <><br/>vượt sức chở xe</> : null}</span>
        </button>); })}
      {done.length > 0 && <><div className="tl-muted" style={{ margin: "12px 0 6px" }}>Đã xong hôm nay ({done.length})</div>
        {done.map(x => <div key={x.no} className="tl-rec"><div style={{ flex: 1 }}><b className="mono">{tlContFmt(x.no)}</b><div className="tl-muted">{DD_DIR_SHORT[ddCDir(x, job)]} · tally đã xác nhận {ddContGate(x, job) === "in" ? "Gate In" : "Gate Out"}{x.at ? ` lúc ${x.at}` : ""}</div></div><span className="tl-tag" style={{ margin: 0, background: "#DCFCE7", color: "#166534" }}>✓ Xong</span></div>)}</>}
    </div>
    {msg && <div className="tl-toast">✓ {msg}</div>}
  </>);
};

/* Nút chụp ảnh thật (giống shared.jsx — trang tài xế không nạp shared.jsx) */
const DdPhotoBtn = ({ file, onPick, label, done, className, style }) => {
  const ref = React.useRef(null);
  return (<>
    <button type="button" className={className} style={style} onClick={() => ref.current && ref.current.click()}>{file ? done : label}</button>
    <input ref={ref} type="file" accept="image/*" capture="environment" style={{ display: "none" }} onChange={e => { const f = e.target.files && e.target.files[0]; if (f) onPick(f); e.target.value = ""; }} />
  </>);
};

const DriverApp = () => {
  const saved = (() => { try { return JSON.parse(localStorage.getItem(SKEY)); } catch (e) { return null; } })();
  const [auth, setAuth] = React.useState(saved);          /* { plate, code } */
  const [view, setView] = React.useState(null);           /* { order, job, plate } từ máy chủ */
  const [expired, setExpired] = React.useState(null);
  const [f, setF] = React.useState({ plate: saved ? saved.plate : "", code: "" });
  const [err, setErr] = React.useState("");
  const [busy, setBusy] = React.useState(false);
  const [chg, setChg] = React.useState(null);
  const [, tick] = React.useState(0);
  const save = (a) => { try { a ? localStorage.setItem(SKEY, JSON.stringify(a)) : localStorage.removeItem(SKEY); } catch (e) {} };
  const logout = () => { setAuth(null); setView(null); setExpired(null); setChg(null); save(null); setF(x => ({ ...x, code: "" })); };
  const onView = (v, why) => { if (v) setView(v); else { setExpired(why); } };

  /* phiên lưu trên máy: kiểm tra lại khi mở trang, rồi hỏi lại máy chủ mỗi 15 giây */
  React.useEffect(() => {
    if (!auth || expired) return; /* hết phiên: dừng hỏi (mỗi lần sai mã bị tính vào giới hạn thử) */
    let stop = false;
    const poll = async () => {
      const r = await rpc("dd_driver_login", { p_plate: auth.plate, p_code: auth.code });
      if (stop) return;
      if (r.err && !r.net) { setExpired(r.err); return; }
      if (!r.err) setView(r);
    };
    poll(); const t = setInterval(poll, 15000);
    const c = setInterval(() => tick(x => x + 1), 30000);
    return () => { stop = true; clearInterval(t); clearInterval(c); };
  }, [auth && auth.plate, auth && auth.code, !!expired]);

  const login = async () => {
    setErr(""); setBusy(true);
    const r = await rpc("dd_driver_login", { p_plate: f.plate, p_code: f.code });
    setBusy(false);
    if (r.err) return setErr(r.err);
    const a = { plate: r.plate, code: f.code.trim() }; setAuth(a); save(a); setView(r); setExpired(null);
  };
  const change = async () => {
    const r = await rpc("dd_driver_login", { p_plate: auth.plate, p_code: chg.code });
    if (r.err) return setChg(c => ({ ...c, err: r.err }));
    if (view && r.order.id === view.order.id) return setChg(c => ({ ...c, err: "Đây là mã của lệnh ca đang làm" }));
    const a = { plate: r.plate, code: chg.code.trim() }; setAuth(a); save(a); setView(r); setChg(null);
  };

  let inner;
  if (!auth) inner = (<>
    <div className="tl-hello" style={{ background: "linear-gradient(135deg,#00669B,#004A73)" }}><div style={{ fontSize: 13, opacity: .85 }}>VNL · Web tài xế</div><div style={{ fontSize: 20, fontWeight: 700 }}>Đăng nhập · Xe ngoài</div><div style={{ fontSize: 12, opacity: .85 }}>Không cần cài ứng dụng</div></div>
    <div className="tl-scroll" style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <label className="tl-muted">Biển số xe</label>
      <input className="input mono" style={{ height: 46, fontSize: 17 }} placeholder="VD: 51C-888.21" autoCapitalize="characters" value={f.plate} onChange={e => setF({ ...f, plate: e.target.value.toUpperCase() })} />
      <label className="tl-muted">Mã đăng nhập của ca (KHTH / nhà xe cung cấp)</label>
      <input className="input mono" style={{ height: 46, fontSize: 20, letterSpacing: ".2em" }} inputMode="numeric" maxLength={6} placeholder="••••••" value={f.code} onChange={e => setF({ ...f, code: e.target.value.replace(/\D/g, "") })} />
      <div className="tl-muted" style={{ fontSize: 11.5 }}>Mỗi ca một mã. Chỉ xe có trong danh sách xe của lệnh ca mới vào được. Mã hết hạn khi kết ca.</div>
      {err && <div className="tl-tag warn" style={{ background: "#FEE2E2", color: "#B91C1C" }}>{err}</div>}
      <button className="tl-main" disabled={busy || !f.plate.trim() || f.code.length !== 6} onClick={login}>{busy ? "ĐANG KIỂM TRA…" : "ĐĂNG NHẬP"}</button>
    </div>
  </>);
  else if (expired) inner = (<div className="tl-scroll" style={{ textAlign: "center", paddingTop: 60 }}><div className="tl-big" style={{ fontSize: 20 }}>Phiên đăng nhập đã hết hạn</div><div className="tl-muted" style={{ margin: "8px 0 16px" }}>{expired}</div><button className="tl-main" onClick={logout}>ĐĂNG NHẬP LẠI</button></div>);
  else if (!view) inner = <div className="tl-scroll" style={{ textAlign: "center", paddingTop: 60 }}><div className="tl-muted">Đang tải…</div></div>;
  else inner = chg ? (<>
    <div className="tl-bar"><button className="tl-back" onClick={() => setChg(null)}>‹</button><div style={{ flex: 1 }}><div className="tl-title">Đổi job / đổi ca</div><div className="tl-sub">xe {auth.plate} · đang ở {view.job.id} · {DD_SHIFT_LABEL[view.order.shift] || ""}</div></div><span style={{ width: 36 }}></span></div>
    <div className="tl-scroll" style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <label className="tl-muted">Mã đăng nhập của lệnh ca mới</label>
      <input className="input mono" style={{ height: 46, fontSize: 20, letterSpacing: ".2em" }} inputMode="numeric" maxLength={6} placeholder="••••••" value={chg.code} onChange={e => setChg({ code: e.target.value.replace(/\D/g, "") })} />
      <div className="tl-muted" style={{ fontSize: 11.5 }}>Biển số giữ nguyên; xe phải có trong danh sách xe của lệnh ca mới.</div>
      {chg.err && <div className="tl-tag warn" style={{ background: "#FEE2E2", color: "#B91C1C" }}>{chg.err}</div>}
      <button className="tl-main" disabled={chg.code.length !== 6} onClick={change}>ĐỔI SANG JOB NÀY</button>
    </div></>) : (<><div style={{ padding: "6px 14px 0", textAlign: "right" }}><button className="tl-link" onClick={() => setChg({ code: "" })}>⇄ Đổi job</button></div><DrvCont view={view} auth={auth} onView={onView} /></>);

  return (
    <div className="dd-full"><div className="tl-phone">
      <div className="tl-status" style={{ background: "#00669B" }}><b>{window.ddVnNow().time}</b><span>{auth ? <a style={{ color: "#fff", cursor: "pointer", textDecoration: "underline" }} onClick={logout}>Đăng xuất</a> : "Vinalogistics"}</span></div>
      <div className="tl-body">{inner}</div>
    </div></div>
  );
};

ReactDOM.createRoot(document.getElementById("root")).render(<DriverApp />);
