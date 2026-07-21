/* Shell: Avatar + Topbar (view-only OCC dashboard) */

const Avatar = ({ person, size = 26, className = "" }) => {
  if (!person) return null;
  const style = { width: size, height: size, fontSize: Math.max(9, size * 0.4) };
  return (
    <span className={`av c${person.color} ${className}`} style={style} title={person.name}>
      {person.short}
    </span>
  );
};

const Topbar = ({ crumbs = [], onToggleNav }) => {
  return (
    <header className="topbar">
      <button className="mobile-menu-btn" onClick={onToggleNav} title="Menu" aria-label="Mở menu">
        <Icon name="panelLeft" size={18} />
      </button>
      <div className="crumb">
        {crumbs.map((c, i) => (
          <React.Fragment key={i}>
            {i > 0 && <span className="sep">/</span>}
            <span className={i === crumbs.length - 1 ? "b" : ""}>
              {i === crumbs.length - 1 ? <b>{c}</b> : c}
            </span>
          </React.Fragment>
        ))}
      </div>

      <div style={{ flex: 1 }} />

      <div className="top-actions">
        <Avatar person={ME} size={30} />
      </div>
    </header>
  );
};

Object.assign(window, { Avatar, Topbar });
