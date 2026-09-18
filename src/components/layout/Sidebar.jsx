import { NavLink } from 'react-router-dom';
import { useAuth } from '../../store/AuthContext.jsx';
import { NAV_CONFIG } from '../../constants/navItems.js';

const Sidebar = () => {
  const { role } = useAuth();
  const items = NAV_CONFIG[role] || [];

  return (
    <aside className="fixed top-16 left-0 bottom-0 w-60 bg-surface-container-lowest border-r border-outline-variant/40 z-40 flex flex-col justify-between overflow-y-auto">
      <div className="py-space-md">
        <div className="px-space-md pb-space-sm font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant/70 font-semibold">
          Workspace Navigation
        </div>
        <nav className="flex flex-col gap-1 px-space-sm">
          {items.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center justify-between w-full px-3 py-2 rounded-lg transition-colors text-left ${
                  isActive
                    ? 'bg-primary-container text-on-primary font-semibold shadow-sm'
                    : 'text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface'
                }`
              }
            >
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                <span className="font-body-md text-body-md">{item.label}</span>
              </div>
              {item.badge && (
                <span className={`px-1.5 py-0.5 rounded text-[10px] font-label-sm font-bold ${item.badge.cls}`}>
                  {item.badge.text}
                </span>
              )}
              {item.count && (
                <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-surface-container-high text-on-surface">
                  {item.count}
                </span>
              )}
              {item.dot && <span className="w-2 h-2 rounded-full bg-tertiary-container" />}
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="p-space-md border-t border-outline-variant/30">
        <div className="p-3 rounded-xl bg-gradient-to-br from-surface-container-low to-surface-container border border-outline-variant/40 shadow-sm">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="material-symbols-outlined text-primary text-[18px]">neurology</span>
            <span className="text-[13px] font-bold text-on-surface">AI Engine Active</span>
          </div>
          <p className="font-body-xs text-body-xs text-on-surface-variant leading-tight">
            Real-time matching, resume OCR verification & engagement monitor running.
          </p>
          <div className="mt-2.5 flex items-center gap-1.5 text-[11px] font-semibold text-tertiary">
            <span className="w-1.5 h-1.5 rounded-full bg-tertiary-fixed-dim animate-ping" />
            <span>Live Monitoring</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
