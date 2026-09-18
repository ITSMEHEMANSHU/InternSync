import { useNavigate } from 'react-router-dom';
import { useDashboard } from '../../hooks/useDashboard.js';
import { useAuth } from '../../store/AuthContext.jsx';
import { ROUTES } from '../../constants/routes.js';
import StatCard from '../../components/common/StatCard.jsx';
import Skeleton from '../../components/common/Skeleton.jsx';
import Stepper from '../../components/common/Stepper.jsx';
import AIMatchBadge from '../../components/common/AIMatchBadge.jsx';

const LIFECYCLE = ['Profile', 'Applied', 'Approved', 'Joined', 'Reports', 'Certificate'];

const DashboardPage = () => {
  const { user } = useAuth();
  const { data, loading } = useDashboard();
  const navigate = useNavigate();

  const NAV_MAP = {
    applications: ROUTES.STUDENT.APPLICATIONS,
    tasks: ROUTES.STUDENT.TASKS,
    attendance: ROUTES.STUDENT.ATTENDANCE,
    reports: ROUTES.STUDENT.WEEKLY_REPORTS,
  };

  return (
    <div className="flex flex-col w-full gap-space-lg">
      {/* Welcome */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-space-lg bg-gradient-to-r from-primary-fixed/40 to-secondary-fixed/20 rounded-xl border border-primary/10">
        <div>
          <h1 className="font-headline-xl text-headline-xl font-bold text-on-surface">
            Welcome back, {user?.name?.split(' ')[0]} 👋
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant mt-1">
            Your internship at Zoho Corp is progressing well. Week 8 report due Friday.
          </p>
        </div>
        <button
          onClick={() => navigate(ROUTES.STUDENT.PROFILE)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-on-primary font-label-md text-label-md font-semibold hover:opacity-90 transition-all shrink-0"
        >
          <span className="material-symbols-outlined text-[18px]">edit</span>
          Complete Profile
        </button>
      </div>

      {/* KPIs */}
      {loading ? <Skeleton variant="card" count={4} /> : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-space-md">
          {data.kpis.map((k) => (
            <StatCard
              key={k.id}
              icon={k.icon}
              label={k.label}
              value={k.value}
              trend={k.trend}
              trendUp={k.trendUp}
              iconBg={k.iconBg}
              onClick={() => navigate(NAV_MAP[k.id] || '#')}
            />
          ))}
        </div>
      )}

      {/* Lifecycle */}
      <div className="p-space-lg bg-surface-container-lowest rounded-xl shadow-sm">
        <h2 className="font-headline-sm text-headline-sm font-bold text-on-surface mb-6">Internship Lifecycle</h2>
        <Stepper steps={LIFECYCLE} currentStep={3} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg">
        {/* AI Top Matches */}
        <div className="lg:col-span-8 flex flex-col gap-space-md">
          <div className="flex items-center justify-between">
            <h2 className="font-headline-md text-headline-md font-bold text-on-surface">Top AI Matches for You</h2>
            <button onClick={() => navigate(ROUTES.STUDENT.INTERNSHIPS)} className="text-primary font-label-md text-label-md font-semibold hover:underline flex items-center gap-1">
              View all <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </button>
          </div>
          {loading ? <Skeleton variant="row" count={3} /> : (
            <div className="flex flex-col gap-3">
              {data.topMatches.map((i) => (
                <div
                  key={i.id}
                  onClick={() => navigate(ROUTES.STUDENT.INTERNSHIPS)}
                  className="flex items-center gap-4 p-4 bg-surface-container-lowest rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer"
                >
                  <div className="w-10 h-10 rounded-lg bg-primary-fixed flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[20px] text-primary">business</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-headline-sm text-headline-sm font-bold text-on-surface truncate">{i.title}</p>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">{i.company} · {i.location} · ₹{i.stipend?.toLocaleString('en-IN')}/mo</p>
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {i.skills.slice(0, 3).map((s) => (
                        <span key={s} className="px-2 py-0.5 rounded text-[10px] font-semibold bg-surface-container text-on-surface">{s}</span>
                      ))}
                    </div>
                  </div>
                  <AIMatchBadge percent={i.aiMatch} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Deadlines */}
        <div className="lg:col-span-4 flex flex-col gap-space-md">
          <h2 className="font-headline-md text-headline-md font-bold text-on-surface">Upcoming Deadlines</h2>
          <div className="flex flex-col gap-3">
            {[
              { label: 'Week 8 Report', due: 'Fri, Nov 15', icon: 'description', urgent: true },
              { label: 'Redis Pooling Task', due: 'Thu, Nov 14', icon: 'task_alt', urgent: true },
              { label: 'Unit Tests Task', due: 'Mon, Nov 18', icon: 'task_alt', urgent: false },
            ].map((d) => (
              <div key={d.label} className={`flex items-center gap-3 p-3 rounded-xl ${d.urgent ? 'bg-error-container/30 border border-error/20' : 'bg-surface-container-lowest shadow-sm'}`}>
                <span className={`material-symbols-outlined text-[20px] ${d.urgent ? 'text-error' : 'text-on-surface-variant'}`}>{d.icon}</span>
                <div className="flex-1">
                  <p className="font-label-md text-label-md font-semibold text-on-surface">{d.label}</p>
                  <p className="font-body-xs text-body-xs text-on-surface-variant">{d.due}</p>
                </div>
                {d.urgent && <span className="w-2 h-2 rounded-full bg-error" />}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
