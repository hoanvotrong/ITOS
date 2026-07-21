/* Main app — router + tweaks */

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "accent": "navy",
  "density": "cozy",
  "rail": "expanded"
}/*EDITMODE-END*/;

const ACCENT_PALETTES = {
  navy:     ["#0E2A47","#E85D2F","#FCEEE7"],
  forest:   ["#103929","#D97706","#FBF1DC"],
  charcoal: ["#1F2329","#2563EB","#E5EEFB"],
  royal:    ["#1E1B4B","#C68A2F","#FAF1DC"],
  vinared:  ["#8B1018","#DAA520","#FBF4DD"],
  mono:     ["#0F172A","#635BFF","#EEEDFF"],
  sage:     ["#1F3D34","#C9612F","#FBEEE3"],
  dark:     ["#0B0F17","#0EA5E9","#F59E0B"],
};
const ACCENT_KEYS = Object.keys(ACCENT_PALETTES);

function App() {
  const [route, setRoute] = React.useState({ screen: "dashboard", ctx: {} });
  const [drawer, setDrawer] = React.useState(false);
  const [taskDrawer, setTaskDrawer] = React.useState(null);
  const [tweaks, setTweak] = useTweaks(TWEAK_DEFAULTS);

  // Apply accent/density to document root
  React.useEffect(() => {
    document.documentElement.dataset.accent = tweaks.accent;
    document.documentElement.dataset.density = tweaks.density;
  }, [tweaks.accent, tweaks.density]);

  const go = (screen, ctx = {}) => {
    setRoute({ screen, ctx });
    window.scrollTo({ top: 0, behavior: "instant" });
  };

  const crumbsByScreen = {
    dashboard:         ["Vinalogistics", "E-Office", "Tổng quan"],
    approval:          ["Vinalogistics", "E-Office", "Phê duyệt"],
    "approval-detail": ["Vinalogistics", "E-Office", "Phê duyệt", route.ctx?.id || "Chi tiết"],
    "approval-create": ["Vinalogistics", "E-Office", "Phê duyệt", "Tạo phiếu mới"],
    documents:         ["Vinalogistics", "E-Office", "Văn bản"],
    tasks:             ["Vinalogistics", "E-Office", "Công việc"],
    "tasks-detail":    ["Vinalogistics", "E-Office", "Công việc", route.ctx?.id || "Chi tiết"],
    "tasks-create":    ["Vinalogistics", "E-Office", "Công việc", "Giao nhiệm vụ mới"],
    schedule:          ["Vinalogistics", "E-Office", "Lịch"],
    notifications:     ["Vinalogistics", "E-Office", "Thông báo"],
  };
  const activeRail = route.screen.replace(/-detail$|-create$/, "");

  // Allow children to open a task drawer via global handler
  window.__openTask = (id) => setTaskDrawer(id);
  // Allow children to navigate to full task detail page
  window.__goTaskDetail = (id) => setRoute({ screen: "tasks-detail", ctx: { id } });

  // For TweakColor: value is the palette array. Derive key from it.
  const currentPalette = ACCENT_PALETTES[tweaks.accent] || ACCENT_PALETTES.navy;
  const onPalettePick = arr => {
    const found = ACCENT_KEYS.find(k => ACCENT_PALETTES[k][0] === arr[0]) || "navy";
    setTweak("accent", found);
  };

  const railMode = tweaks.rail;   // expanded | mini | top | dual

  return (
    <div
      className="shell"
      data-rail={railMode}
      data-screen-label={`E-Office / ${route.screen}`}
    >
      {railMode === "top" && (
        <TopNav active={activeRail} onNav={(id) => go(id)} onOpenNotif={() => setDrawer(true)} />
      )}
      {(railMode === "expanded" || railMode === "mini" || railMode === "dual") && (
        <Rail
          active={activeRail}
          mode={railMode === "mini" || railMode === "dual" ? "mini" : "expanded"}
          onNav={(id) => go(id)}
        />
      )}
      {railMode === "dual" && (
        <SubRail active={activeRail} onNav={(id) => go(id)} />
      )}

      <main style={{ minWidth: 0 }}>
        {railMode !== "top" && (
          <Topbar
            crumbs={crumbsByScreen[route.screen] || ["E-Office"]}
            onOpenNotif={() => setDrawer(true)}
          />
        )}
        {route.screen === "dashboard"        && <DashboardScreen go={go} />}
        {route.screen === "approval"         && <ApprovalListScreen go={go} />}
        {route.screen === "approval-detail"  && <ApprovalDetailScreen go={go} ctx={route.ctx} />}
        {route.screen === "approval-create"  && <CreateApprovalScreen go={go} />}
        {route.screen === "documents"        && <DocumentsScreen go={go} />}
        {route.screen === "tasks"            && <TasksScreen go={go} />}
        {route.screen === "tasks-create"     && <CreateTaskScreen go={go} />}
        {route.screen === "tasks-detail"     && <TaskDetailPage go={go} ctx={route.ctx} />}
        {route.screen === "schedule"         && <ScheduleScreen />}
        {route.screen === "notifications"    && <NotificationsScreen />}
      </main>

      <NotifDrawer open={drawer} onClose={() => setDrawer(false)} onNavigate={go} />
      <TaskDetailDrawer open={!!taskDrawer} taskId={taskDrawer} onClose={() => setTaskDrawer(null)} />
      <CommandPalette go={go} onOpenNotif={() => setDrawer(true)} />

      <TweaksPanel title="Tweaks">
        <TweakSection label="Bảng màu" />
        <TweakColor
          label="Bộ phối màu"
          value={currentPalette}
          onChange={onPalettePick}
          options={Object.values(ACCENT_PALETTES)}
        />

        <TweakSection label="Hiển thị" />
        <TweakRadio
          label="Mật độ"
          value={tweaks.density}
          onChange={v => setTweak("density", v)}
          options={["cozy", "compact"]}
        />
        <TweakRadio
          label="Sidebar"
          value={tweaks.rail}
          onChange={v => setTweak("rail", v)}
          options={["expanded", "mini", "top", "dual"]}
        />

        <TweakSection label="Điều hướng nhanh" />
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <TweakButton label="Tổng quan" onClick={() => go("dashboard")} />
          <TweakButton label="Phê duyệt — Danh sách" onClick={() => go("approval")} />
          <TweakButton label="Phê duyệt — Tạo phiếu mới" onClick={() => go("approval-create")} />
          <TweakButton label="Phê duyệt — Chi tiết" onClick={() => go("approval-detail", { id: "PD-2026-0418" })} />
          <TweakButton label="Công việc — Dashboard BOD" onClick={() => go("tasks")} />
          <TweakButton label="Công việc — Giao nhiệm vụ" onClick={() => go("tasks-create")} />
          <TweakButton label="Công việc — Chi tiết task" onClick={() => go("tasks-detail", { id: "TK-088" })} />
          <TweakButton label="Văn bản" onClick={() => go("documents")} />
          <TweakButton label="Lịch" onClick={() => go("schedule")} />
          <TweakButton label="Thông báo" onClick={() => go("notifications")} secondary />
        </div>
      </TweaksPanel>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <TTOSShell>
    <App />
  </TTOSShell>
);
