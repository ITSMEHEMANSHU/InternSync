import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../store/AuthContext.jsx';
import { ROUTES, roleDashboard } from '../../constants/routes.js';
import { ROLES } from '../../constants/roles.js';

const ROLE_LABELS = {
  [ROLES.STUDENT]: 'Student',
  [ROLES.FACULTY]: 'Faculty',
  [ROLES.COMPANY]: 'Company',
  [ROLES.ADMIN]: 'Admin',
};

const Header = () => {
  const { user, role, switchRole, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleSwitch = (r) => {
    switchRole(r);
    navigate(roleDashboard(r));
    setOpen(false);
  };

  const initials = user?.name?.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase() || 'U';

  return (
    <header className="fixed top-0 left-0 right-0 h-16 z-50 bg-surface-container-lowest border-b border-outline-variant/40">
      <div className="w-full h-16 px-space-lg flex items-center justify-between gap-space-md">

        <div className="flex items-center gap-space-xs min-w-[200px]">
          <span className="font-headline-sm text-headline-sm font-bold tracking-tight text-on-surface">InternSync</span>
          <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed font-label-sm text-label-sm uppercase tracking-wider font-semibold border border-primary/20">
            Portal
          </span>
        </div>

        <div className="flex-1 max-w-xl mx-auto hidden md:block">
          <div className="relative flex items-center w-full">
            <span className="material-symbols-outlined absolute left-3 text-on-surface-variant text-[18px] pointer-events-none">search</span>
            <input
              type="text"
              placeholder="Quick search students, applications, partners..."
              className="w-full h-9 pl-9 pr-14 rounded-lg bg-surface-container-low border border-outline-variant/60 font-body-sm text-body-sm text-on-surface placeholder:text-on-surface-variant/70 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
            />
            <kbd className="absolute right-2.5 px-1.5 py-0.5 text-[10px] font-semibold text-on-surface-variant bg-surface-container-lowest border border-outline-variant/60 rounded shadow-sm">
              ⌘K
            </kbd>
          </div>
        </div>

        <div className="flex items-center gap-space-sm sm:gap-space-md">
          <div className="hidden lg:inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-surface-container text-on-surface font-label-md text-label-md border border-outline-variant/40">
            <span className="material-symbols-outlined text-[15px] text-secondary">calendar_today</span>
            <span>{user?.academicYear || 'AY 2024-25'}</span>
          </div>

          {role && (
            <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary-fixed/60 border border-primary/20 text-on-primary-fixed-variant font-label-sm text-label-sm font-bold uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              <span>{ROLE_LABELS[role]} View</span>
            </div>
          )}

          <button
            onClick={() => navigate(ROUTES.NOTIFICATIONS)}
            className="relative p-1.5 text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low rounded-lg transition-colors"
          >
            <span className="material-symbols-outlined text-[22px]">notifications</span>
            {user?.notificationCount > 0 && (
              <span className="absolute top-1 right-1 flex items-center justify-center w-4 h-4 bg-error text-on-error text-[10px] font-bold rounded-full">
                {user.notificationCount}
              </span>
            )}
          </button>

          <div className="relative">
            <button onClick={() => setOpen((o) => !o)}>
              {user?.avatar
                ? <img alt="Profile" src={user.avatar} className="w-8 h-8 rounded-full object-cover ring-2 ring-outline-variant/40" />
                : <div className="w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold text-[12px] ring-2 ring-outline-variant/40">{initials}</div>
              }
            </button>

            {open && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
                <div className="absolute right-0 top-10 z-50 w-56 bg-surface-container-lowest rounded-xl shadow-xl border border-outline-variant/40 py-1 overflow-hidden">
                  <div className="px-4 py-3 border-b border-outline-variant/30">
                    <p className="font-label-md text-label-md font-bold text-on-surface">{user?.name}</p>
                    <p className="font-body-xs text-body-xs text-on-surface-variant">{user?.email}</p>
                  </div>

                  <button
                    onClick={() => { navigate(ROUTES.PROFILE); setOpen(false); }}
                    className="w-full flex items-center gap-2 px-4 py-2.5 text-left font-body-md text-body-md text-on-surface hover:bg-surface-container-low transition-colors"
                  >
                    <span className="material-symbols-outlined text-[18px] text-on-surface-variant">person</span>
                    Profile
                  </button>

                  <div className="px-4 py-2 border-t border-outline-variant/20">
                    <p className="font-label-sm text-label-sm text-on-surface-variant mb-1.5 uppercase tracking-wider">Switch Role</p>
                    {Object.values(ROLES).map((r) => (
                      <button
                        key={r}
                        onClick={() => handleSwitch(r)}
                        className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-left font-body-sm text-body-sm transition-colors ${
                          role === r ? 'bg-primary-fixed text-on-primary-fixed font-semibold' : 'text-on-surface hover:bg-surface-container-low'
                        }`}
                      >
                        {ROLE_LABELS[r]}
                        {role === r && <span className="material-symbols-outlined text-[14px] ml-auto">check</span>}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => { logout(); navigate(ROUTES.LOGIN); }}
                    className="w-full flex items-center gap-2 px-4 py-2.5 text-left font-body-md text-body-md text-error hover:bg-error-container/30 transition-colors border-t border-outline-variant/20"
                  >
                    <span className="material-symbols-outlined text-[18px]">logout</span>
                    Logout
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
