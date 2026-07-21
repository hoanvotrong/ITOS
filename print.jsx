/* Print build — renders every E-Office screen as a separate landscape page. */

const PRINT_PAGES = [
  { screen: "dashboard",        label: "Tổng quan",                  crumbs: ["Vinalogistics", "E-Office", "Tổng quan"] },
  { screen: "approval",         label: "Phê duyệt — Danh sách",      crumbs: ["Vinalogistics", "E-Office", "Phê duyệt"] },
  { screen: "approval-detail",  label: "Phê duyệt — Chi tiết phiếu", crumbs: ["Vinalogistics", "E-Office", "Phê duyệt", "PD-2026-0418"], ctx: { id: "PD-2026-0418" } },
  { screen: "approval-create",  label: "Phê duyệt — Tạo phiếu mới",  crumbs: ["Vinalogistics", "E-Office", "Phê duyệt", "Tạo phiếu mới"] },
  { screen: "documents",        label: "Văn bản",                    crumbs: ["Vinalogistics", "E-Office", "Văn bản"] },
  { screen: "tasks",            label: "Công việc — Dashboard BOD",  crumbs: ["Vinalogistics", "E-Office", "Công việc"] },
  { screen: "tasks-detail",     label: "Công việc — Chi tiết task",  crumbs: ["Vinalogistics", "E-Office", "Công việc", "TK-088"], ctx: { id: "TK-088" } },
  { screen: "tasks-create",     label: "Công việc — Giao nhiệm vụ",  crumbs: ["Vinalogistics", "E-Office", "Công việc", "Giao nhiệm vụ mới"] },
  { screen: "schedule",         label: "Lịch",                       crumbs: ["Vinalogistics", "E-Office", "Lịch"] },
  { screen: "notifications",    label: "Thông báo",                  crumbs: ["Vinalogistics", "E-Office", "Thông báo"] },
];

function PrintScreen({ screen, ctx }) {
  const go = () => {};
  switch (screen) {
    case "dashboard":       return <DashboardScreen go={go} />;
    case "approval":        return <ApprovalListScreen go={go} />;
    case "approval-detail": return <ApprovalDetailScreen go={go} ctx={ctx} />;
    case "approval-create": return <CreateApprovalScreen go={go} />;
    case "documents":       return <DocumentsScreen go={go} />;
    case "tasks":           return <TasksScreen go={go} />;
    case "tasks-detail":    return <TaskDetailPage go={go} ctx={ctx} />;
    case "tasks-create":    return <CreateTaskScreen go={go} />;
    case "schedule":        return <ScheduleScreen />;
    case "notifications":   return <NotificationsScreen />;
    default: return null;
  }
}

function PrintPage({ page, idx, total }) {
  const active = page.screen.replace(/-detail$|-create$/, "");
  return (
    <div className="print-page" data-screen-label={page.label}>
      <TTOSShell>
        <div className="shell" data-rail="expanded">
          <Rail active={active} mode="expanded" onNav={() => {}} />
          <main style={{ minWidth: 0 }}>
            <Topbar crumbs={page.crumbs} onOpenNotif={() => {}} />
            <PrintScreen screen={page.screen} ctx={page.ctx} />
          </main>
        </div>
      </TTOSShell>
      <div className="print-footer">
        <span><b>{page.label}</b></span>
        <span>TTOS · E-Office · Vinalogistics</span>
        <span>{String(idx + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}</span>
      </div>
    </div>
  );
}

function PrintApp() {
  React.useEffect(() => {
    document.documentElement.dataset.accent = "navy";
    document.documentElement.dataset.density = "cozy";
  }, []);
  return (
    <>
      {PRINT_PAGES.map((p, i) => (
        <PrintPage key={p.screen} page={p} idx={i} total={PRINT_PAGES.length} />
      ))}
    </>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<PrintApp />);

/* Auto-print once fonts and layout settle. */
(async () => {
  try { await (document.fonts && document.fonts.ready); } catch (e) {}
  // Give React + Babel time to fully render all 10 screens.
  setTimeout(() => {
    if (!window.__printedOnce) {
      window.__printedOnce = true;
      window.print();
    }
  }, 1500);
})();
