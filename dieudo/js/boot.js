/* ==========================================================
   Điều độ khai thác (pilot) — khởi động trang
   1. Giờ GMT+7 dùng chung: js/time.js (nạp trước file này)
   2. Đăng nhập Supabase Auth (cùng project / cấu hình với /warehouse: ../warehouse/config.js)
   3. Kiểm tra quyền trong bảng dd_users + vai trò được mở trang
   4. Nạp danh mục + dữ liệu (dd_catalog, dd_docs) vào window.DD_BOOT
   5. Chạy các file .jsx của module theo thứ tự (Babel standalone), rồi gắn trang
   Trang khai báo trước: window.DD_PAGE = { roles: [...], scripts: [...], title, mount() }
   ========================================================== */
(function () {
  'use strict';

  /* ---------- tiện ích giao diện khởi động (DOM thuần, trước khi có React) ---------- */
  const root = () => document.getElementById('root');
  const esc = (t) => String(t == null ? '' : t).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const screen = (html) => { root().innerHTML = `<div class="dd-gate"><div class="dd-gate-card">${html}</div></div>`; };
  const fail = (title, msg, withLogout) => {
    screen(`<h1>${esc(title)}</h1><p class="muted">${esc(msg)}</p>${withLogout ? '<button class="btn" id="dd-out">Đăng xuất</button>' : '<button class="btn" onclick="location.reload()">Tải lại</button>'}`);
    const b = document.getElementById('dd-out'); if (b) b.onclick = () => window.DD_SB.auth.signOut().then(() => location.reload());
  };

  const cfg = window.KHO_CONFIG || {};
  if (!cfg.supabaseUrl || !cfg.supabaseAnonKey || !window.supabase) {
    document.addEventListener('DOMContentLoaded', () => fail('Chưa cấu hình Supabase', 'Thiếu ../warehouse/config.js hoặc thư viện supabase-js.'));
    return;
  }
  const sb = window.DD_SB = window.supabase.createClient(cfg.supabaseUrl, cfg.supabaseAnonKey);
  const PAGE = window.DD_PAGE;

  /* ---------- 2. Đăng nhập ---------- */
  function loginScreen(errMsg) {
    screen(`
      <div class="dd-gate-mark">V</div>
      <h1>${esc(PAGE.title)}</h1>
      <p class="muted">Vinalogistics · Điều độ khai thác · bản chạy thử</p>
      <form id="dd-login" autocomplete="on">
        <label class="dd-f">Email<input class="input" id="dd-email" type="email" autocomplete="username" required autofocus></label>
        <label class="dd-f">Mật khẩu<input class="input" id="dd-pw" type="password" autocomplete="current-password" required></label>
        <p class="dd-err" id="dd-err">${esc(errMsg || '')}</p>
        <button class="btn primary" type="submit" id="dd-go" style="width:100%;height:42px">Đăng nhập</button>
      </form>
      <p class="muted" style="font-size:12px;margin-top:12px">${esc(PAGE.loginHint || 'Chưa có tài khoản? Liên hệ quản trị viên.')}</p>`);
    document.getElementById('dd-login').onsubmit = async (e) => {
      e.preventDefault();
      const btn = document.getElementById('dd-go'); btn.disabled = true; btn.textContent = 'Đang đăng nhập…';
      const { error } = await sb.auth.signInWithPassword({ email: document.getElementById('dd-email').value.trim(), password: document.getElementById('dd-pw').value });
      if (error) { loginScreen(error.message === 'Invalid login credentials' ? 'Sai email hoặc mật khẩu.' : error.message); return; }
      start();
    };
  }

  /* ---------- 4. Nạp dữ liệu (phân trang 1000 dòng) ---------- */
  async function fetchAll(table, cols) {
    const out = []; const N = 1000;
    for (let from = 0; ; from += N) {
      const { data, error } = await sb.from(table).select(cols).range(from, from + N - 1);
      if (error) throw error;
      out.push(...data); if (data.length < N) return out;
    }
  }

  /* ---------- 5. Chạy các file .jsx theo thứ tự ---------- */
  function loadScripts(list) {
    return new Promise((resolve, reject) => {
      window.__ddScriptsDone = resolve;
      /* lỗi khi chạy mã module → hiện màn lỗi thay vì treo ở "Đang tải" */
      window.addEventListener('error', (ev) => reject(ev.error || new Error(ev.message)), { once: true });
      list.concat(['__done__']).forEach(src => {
        const s = document.createElement('script'); s.type = 'text/babel';
        if (src === '__done__') s.text = 'window.__ddScriptsDone();'; else s.src = src + (src.includes('?') ? '' : `?v=${window.DD_VER || ''}`);
        document.body.appendChild(s);
      });
      window.Babel.transformScriptTags();
    });
  }

  async function start() {
    screen('<p class="muted">Đang tải dữ liệu…</p>');
    try {
      const { data: { session } } = await sb.auth.getSession();
      if (!session) return loginScreen();
      const email = (session.user.email || '').toLowerCase();
      /* 3. quyền: phải có trong dd_users (RLS chỉ cho thành viên đọc) */
      const users = await fetchAll('dd_users', 'email,name,short,role,tally_acc,color,active');
      const me = users.find(u => u.email === email && u.active);
      if (!me) return fail('Chưa được cấp quyền', `Tài khoản ${email} chưa có trong danh sách người dùng Điều độ (dd_users). Liên hệ quản trị viên.`, true);
      if (PAGE.roles && !PAGE.roles.includes(me.role)) return fail('Không đúng trang', PAGE.wrongRole ? PAGE.wrongRole(me.role) : `Vai trò ${me.role} không dùng trang này.`, true);

      const [catRows, docRows] = await Promise.all([fetchAll('dd_catalog', 'kind,id,data'), fetchAll('dd_docs', 'coll,id,data,updated_at')]);
      window.DD_BOOT = window.DD_SYNC.prepare({ me, users, catRows, docRows });
      await loadScripts(PAGE.scripts);
      window.DD_SYNC.start();
      root().innerHTML = '';
      PAGE.mount();
    } catch (e) {
      console.error(e);
      fail('Không tải được dữ liệu', (e && e.message) || String(e));
    }
  }

  sb.auth.onAuthStateChange((ev) => { if (ev === 'SIGNED_OUT') location.reload(); });
  document.addEventListener('DOMContentLoaded', start);
})();
