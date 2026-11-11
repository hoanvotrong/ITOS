/* App Tally (pilot) — chỉ render TlPhone toàn màn hình cho tài khoản ca đang đăng nhập.
   Mất mạng: bản ghi đánh dấu "chưa đồng bộ", lưu trên máy (sync.js) và tự gửi khi có mạng. */
const DdTallyApp = () => {
  const [, force] = React.useState(0);
  const [online, setOnline] = React.useState(navigator.onLine);
  React.useEffect(() => {
    const on = () => setOnline(true), off = () => setOnline(false);
    window.addEventListener("online", on); window.addEventListener("offline", off);
    window.__ddTick = () => force(x => x + 1);
    const un = DD_SYNC.onChange(() => force(x => x + 1));
    /* đồng hồ trên thanh trạng thái + thời gian dừng "đang dừng" */
    const t = setInterval(() => force(x => x + 1), 30000);
    return () => { window.removeEventListener("online", on); window.removeEventListener("offline", off); un(); clearInterval(t); };
  }, []);
  const onChange = () => { force(x => x + 1); DD_SYNC.schedule(); };
  if (!DD_ME) return <div className="dd-gate"><div className="dd-gate-card"><h1>Tài khoản ca chưa gắn đúng</h1><p className="muted">dd_users.tally_acc của tài khoản này không hợp lệ. Liên hệ quản trị viên.</p></div></div>;
  return <div className="dd-full"><TlPhone me={DD_ME} offline={!online} onChange={onChange} /></div>;
};
window.DdTallyApp = DdTallyApp;
