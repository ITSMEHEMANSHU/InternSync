import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../store/AuthContext.jsx';
import { ROLES } from '../../constants/roles.js';
import { roleDashboard } from '../../constants/routes.js';

const DEMO_ROLES = [
  { role: ROLES.STUDENT,  label: 'Student',  icon: 'school',           desc: 'Aarav Sharma · CSE Sem 8' },
  { role: ROLES.FACULTY,  label: 'Faculty',  icon: 'supervisor_account',desc: 'Dr. Meenakshi · HoD CSE' },
  { role: ROLES.COMPANY,  label: 'Company',  icon: 'business',          desc: 'Rajesh Iyer · Zoho Corp' },
  { role: ROLES.ADMIN,    label: 'Admin',    icon: 'admin_panel_settings',desc: 'Suresh Kumar · Admin' },
];

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleDemo = (role) => {
    login(role);
    navigate(roleDashboard(role));
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary to-secondary flex-col items-center justify-center p-12 text-on-primary">
        <div className="max-w-md text-center">
          <div className="w-16 h-16 rounded-2xl bg-on-primary/20 flex items-center justify-center mx-auto mb-6">
            <span className="material-symbols-outlined text-[36px]">sync_alt</span>
          </div>
          <h1 className="font-headline-xl text-headline-xl font-bold mb-4">InternSync Portal</h1>
          <p className="font-body-lg text-body-lg opacity-80 leading-relaxed">
            AICTE-compliant internship management platform with AI-powered matching, real-time monitoring, and dual-mentor evaluation.
          </p>
          <div className="mt-8 grid grid-cols-2 gap-3">
            {['AI Match Engine', 'OCR Verification', 'Risk Monitoring', 'AICTE Compliance'].map((f) => (
              <div key={f} className="flex items-center gap-2 bg-on-primary/10 rounded-lg px-3 py-2">
                <span className="material-symbols-outlined text-[16px]">check_circle</span>
                <span className="font-label-md text-label-md">{f}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h2 className="font-headline-lg text-headline-lg font-bold text-on-surface">Welcome back</h2>
            <p className="font-body-md text-body-md text-on-surface-variant mt-1">Sign in to your InternSync account</p>
          </div>

          <form className="flex flex-col gap-4 mb-6" onSubmit={(e) => e.preventDefault()}>
            <div className="flex flex-col gap-1.5">
              <label className="font-label-md text-label-md font-semibold text-on-surface">Email</label>
              <input type="email" placeholder="you@institution.edu" className="h-10 px-3 rounded-lg border border-outline-variant/60 bg-surface-container-low font-body-md text-body-md focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="font-label-md text-label-md font-semibold text-on-surface">Password</label>
              <input type="password" placeholder="••••••••" className="h-10 px-3 rounded-lg border border-outline-variant/60 bg-surface-container-low font-body-md text-body-md focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" />
            </div>
            <button type="submit" className="h-10 rounded-lg bg-primary text-on-primary font-label-md text-label-md font-semibold hover:opacity-90 transition-all">
              Sign In
            </button>
          </form>

          {/* Demo switcher */}
          <div className="border-t border-outline-variant/40 pt-6">
            <p className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold mb-3 text-center">
              Demo — Click to enter as role
            </p>
            <div className="grid grid-cols-2 gap-3">
              {DEMO_ROLES.map(({ role, label, icon, desc }) => (
                <button
                  key={role}
                  onClick={() => handleDemo(role)}
                  className="flex flex-col items-start gap-1 p-3 rounded-xl border border-outline-variant/60 bg-surface-container-lowest hover:border-primary hover:bg-primary-fixed/20 transition-all text-left"
                >
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px] text-primary">{icon}</span>
                    <span className="font-label-md text-label-md font-bold text-on-surface">{label}</span>
                  </div>
                  <span className="font-body-xs text-body-xs text-on-surface-variant">{desc}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
