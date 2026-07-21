/* Command Palette — ⌘K / Ctrl+K global search across modules */

function CommandPalette({ go, onOpenNotif }) {
  const [open, setOpen] = React.useState(false);
  const [q, setQ] = React.useState("");
  const [cursor, setCursor] = React.useState(0);
  const inputRef = React.useRef(null);

  // Register listener for ⌘K / Ctrl+K and "/" + close on Esc
  React.useEffect(() => {
    const onKey = (e) => {
      const isCmdK = (e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k";
      if (isCmdK) {
        e.preventDefault();
        setOpen(o => !o);
        setQ("");
        setCursor(0);
        return;
      }
      // Slash to open palette when not in input
      if (e.key === "/" && document.activeElement?.tagName !== "INPUT" && document.activeElement?.tagName !== "TEXTAREA") {
        e.preventDefault();
        setOpen(true);
        setQ("");
        setCursor(0);
      }
      if (e.key === "Escape" && open) setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    // Expose programmatic open
    window.__openCmdPalette = () => { setOpen(true); setQ(""); setCursor(0); };
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  React.useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 10);
  }, [open]);

  // Build searchable index
  const results = React.useMemo(() => {
    const norm = (s) => (s || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    const Q = norm(q.trim());

    // Quick actions (always visible at top when q is empty)
    const actions = [
      { kind: "action", id: "a-new-approval", title: "Tạo phiếu phê duyệt mới", sub: "Phê duyệt", icon: "plus",     go: () => go("approval-create") },
      { kind: "action", id: "a-new-task",     title: "Giao nhiệm vụ mới",        sub: "Công việc", icon: "plus",     go: () => go("tasks-create") },
      { kind: "action", id: "a-inbox",        title: "Mở Inbox phê duyệt",        sub: "Phê duyệt", icon: "approval", go: () => go("approval") },
      { kind: "action", id: "a-my-tasks",     title: "Công việc của tôi",         sub: "Công việc", icon: "task",     go: () => go("tasks") },
      { kind: "action", id: "a-schedule",     title: "Mở lịch",                   sub: "Lịch",      icon: "schedule", go: () => go("schedule") },
      { kind: "action", id: "a-notif",        title: "Mở thông báo",              sub: "Thông báo", icon: "bell",     go: () => { onOpenNotif?.(); } },
      { kind: "action", id: "a-dashboard",    title: "Tổng quan",                 sub: "Trang chủ", icon: "home",     go: () => go("dashboard") },
    ];

    if (!Q) {
      // Recent / suggested
      const recent = [
        { kind: "approval", id: "PD-2026-0418", title: "Đề xuất chi phí sửa chữa lashing VINA STAR", sub: "Phê duyệt · Đang chờ bạn",  icon: "approval", go: () => go("approval-detail", { id: "PD-2026-0418" }) },
        { kind: "task",     id: "TK-088",        title: "Hoàn thành phương án khai thác tuyến HPH–SGN", sub: "Task · Đang thực hiện", icon: "task",     go: () => go("tasks-detail", { id: "TK-088" }) },
      ];
      return [
        { group: "Tác vụ nhanh", items: actions.slice(0, 4) },
        { group: "Gần đây",      items: recent },
        { group: "Tác vụ khác",  items: actions.slice(4) },
      ];
    }

    const matches = (s) => norm(s).includes(Q);

    const approvals = APPROVALS
      .filter(a => matches(a.title) || matches(a.id) || matches(a.type) || matches(a.dept))
      .slice(0, 6)
      .map(a => ({
        kind: "approval", id: a.id,
        title: a.title,
        sub: `${a.id} · ${a.type} · ${a.dept}`,
        icon: "approval",
        meta: a.status === "current" ? "Đang duyệt" : a.status === "approved" ? "Đã duyệt" : a.status === "rejected" ? "Từ chối" : "Nháp",
        go: () => go("approval-detail", { id: a.id }),
      }));

    const tasks = TASKS
      .filter(t => matches(t.title) || matches(t.id) || matches(t.department))
      .slice(0, 6)
      .map(t => ({
        kind: "task", id: t.id,
        title: t.title,
        sub: `${t.id} · ${t.department} · ${t.progress}%`,
        icon: "task",
        meta: t.status === "late" ? "Trễ hạn" : t.status === "done" ? "Hoàn thành" : "Đang thực hiện",
        go: () => go("tasks-detail", { id: t.id }),
      }));

    const docs = DOCUMENTS
      .filter(d => matches(d.name) || matches(d.id) || matches(d.category))
      .slice(0, 5)
      .map(d => ({
        kind: "doc", id: d.id,
        title: d.name,
        sub: `${d.id} · ${d.category} · ${d.dept}`,
        icon: "document",
        meta: d.type.toUpperCase(),
        go: () => go("documents"),
      }));

    const people = PEOPLE
      .filter(p => matches(p.name) || matches(p.role) || matches(p.dept) || matches(p.short))
      .slice(0, 5)
      .map(p => ({
        kind: "person", id: p.id,
        title: p.name,
        sub: `${p.role} · ${p.dept}`,
        icon: "user",
        person: p,
        go: () => go("directory"),
      }));

    const filteredActions = actions
      .filter(a => matches(a.title) || matches(a.sub))
      .slice(0, 4);

    return [
      filteredActions.length ? { group: "Tác vụ",     items: filteredActions } : null,
      approvals.length       ? { group: "Phê duyệt", items: approvals }       : null,
      tasks.length           ? { group: "Công việc", items: tasks }           : null,
      docs.length            ? { group: "Văn bản",   items: docs }            : null,
      people.length          ? { group: "Người",     items: people }          : null,
    ].filter(Boolean);
  }, [q]);

  // Flatten for keyboard nav
  const flat = React.useMemo(() => results.flatMap(g => g.items), [results]);

  React.useEffect(() => { setCursor(0); }, [q]);

  const onKeyDown = (e) => {
    if (e.key === "ArrowDown") { e.preventDefault(); setCursor(c => Math.min(c + 1, flat.length - 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setCursor(c => Math.max(c - 1, 0)); }
    else if (e.key === "Enter") {
      e.preventDefault();
      const it = flat[cursor];
      if (it) { it.go(); setOpen(false); }
    }
  };

  if (!open) return null;

  let runningIdx = -1;

  return (
    <div
      onClick={() => setOpen(false)}
      style={{
        position: "fixed", inset: 0, background: "rgba(15, 18, 22, 0.55)",
        backdropFilter: "blur(4px)", zIndex: 1000,
        display: "flex", alignItems: "flex-start", justifyContent: "center",
        paddingTop: "12vh", animation: "fade-in .12s ease-out",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "min(640px, 92vw)", maxHeight: "70vh",
          background: "var(--bg-surface)", borderRadius: 12,
          boxShadow: "0 30px 80px rgba(0,0,0,0.35), 0 0 0 1px var(--line)",
          overflow: "hidden", display: "flex", flexDirection: "column",
          animation: "slide-down .14s ease-out",
        }}
      >
        {/* Input row */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "16px 18px", borderBottom: "1px solid var(--line)" }}>
          <Icon name="search" size={18} className="ic muted"/>
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Tìm phiếu, task, văn bản, người, hoặc gõ lệnh…"
            style={{
              flex: 1, height: 28, border: "none", outline: "none",
              background: "transparent", fontSize: 16, color: "var(--t-primary)",
              fontFamily: "inherit",
            }}
          />
          <kbd style={{ padding: "3px 8px", fontSize: 11, background: "var(--bg-sunken)", border: "1px solid var(--line)", borderRadius: 4, fontFamily: "var(--font-mono)", color: "var(--t-tertiary)" }}>Esc</kbd>
        </div>

        {/* Results */}
        <div style={{ flex: 1, overflowY: "auto", padding: "8px 0" }}>
          {results.length === 0 && (
            <div style={{ padding: "40px 20px", textAlign: "center", color: "var(--t-secondary)" }}>
              <Icon name="search" size={28} />
              <div style={{ marginTop: 10, fontSize: 14, fontWeight: 500 }}>Không tìm thấy kết quả</div>
              <div style={{ fontSize: 12, color: "var(--t-tertiary)", marginTop: 4 }}>Thử từ khoá khác hoặc bấm Esc để đóng</div>
            </div>
          )}
          {results.map((group) => (
            <div key={group.group} style={{ marginBottom: 4 }}>
              <div style={{
                fontSize: 10.5, fontWeight: 700, color: "var(--t-tertiary)",
                textTransform: "uppercase", letterSpacing: 0.08,
                padding: "10px 18px 6px",
              }}>{group.group}</div>
              {group.items.map(it => {
                runningIdx++;
                const active = runningIdx === cursor;
                return (
                  <div
                    key={it.kind + it.id}
                    onMouseEnter={() => setCursor(runningIdx)}
                    onClick={() => { it.go(); setOpen(false); }}
                    style={{
                      display: "flex", alignItems: "center", gap: 12,
                      padding: "9px 18px", cursor: "pointer",
                      background: active ? "var(--brand-accent-bg)" : "transparent",
                      borderLeft: active ? "3px solid var(--brand-accent)" : "3px solid transparent",
                    }}
                  >
                    {it.person ? (
                      <Avatar person={it.person} size={26} />
                    ) : (
                      <div style={{
                        width: 26, height: 26, borderRadius: 6,
                        background: active ? "var(--brand-accent)" : "var(--bg-sunken)",
                        color: active ? "#fff" : "var(--t-secondary)",
                        display: "grid", placeItems: "center", flexShrink: 0,
                      }}>
                        <Icon name={it.icon} size={14} />
                      </div>
                    )}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13.5, fontWeight: 500, color: "var(--t-primary)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {it.title}
                      </div>
                      <div className="muted" style={{ fontSize: 11.5, marginTop: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {it.sub}
                      </div>
                    </div>
                    {it.meta && (
                      <span style={{
                        fontSize: 10.5, padding: "2px 8px", borderRadius: 999,
                        background: "var(--bg-sunken)", color: "var(--t-secondary)",
                        fontWeight: 600, flexShrink: 0,
                      }}>{it.meta}</span>
                    )}
                    {active && <Icon name="arrowRight" size={12} className="ic muted" />}
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {/* Footer hints */}
        <div style={{
          display: "flex", alignItems: "center", gap: 16,
          padding: "8px 18px", borderTop: "1px solid var(--line)",
          fontSize: 11, color: "var(--t-tertiary)", background: "var(--bg-canvas)",
        }}>
          <span><kbd style={{ padding: "1px 5px", border: "1px solid var(--line)", borderRadius: 3, fontFamily: "var(--font-mono)" }}>↑↓</kbd> điều hướng</span>
          <span><kbd style={{ padding: "1px 5px", border: "1px solid var(--line)", borderRadius: 3, fontFamily: "var(--font-mono)" }}>↵</kbd> chọn</span>
          <span><kbd style={{ padding: "1px 5px", border: "1px solid var(--line)", borderRadius: 3, fontFamily: "var(--font-mono)" }}>Esc</kbd> đóng</span>
          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 6 }}>
            <span>TTOS · E-Office</span>
          </div>
        </div>
      </div>
    </div>
  );
}

window.CommandPalette = CommandPalette;
