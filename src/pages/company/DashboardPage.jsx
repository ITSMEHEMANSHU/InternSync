import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../../components/weekly-reports/PageHeader.jsx';
import StatCard from '../../components/common/StatCard.jsx';
import StatusBadge from '../../components/common/StatusBadge.jsx';
import BarChartCard from '../../components/common/charts/BarChartCard.jsx';
import LineChartCard from '../../components/common/charts/LineChartCard.jsx';
import AIMatchBadge from '../../components/common/AIMatchBadge.jsx';
import { COMPANY_KPIS, APPLICANTS_LIST, COMPANY_INTERNSHIPS, PLACEMENT_TREND } from '../../data/mockData.js';
import { ROUTES } from '../../constants/routes.js';
import { useToast } from '../../store/ToastContext.jsx';
import { companyService } from '../../services/companyService.js';

const CompanyDashboardPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [stats, setStats] = useState(null);
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const loadDashboardData = async () => {
      try {
        const [statsData, intData] = await Promise.allSettled([
          companyService.getDashboardStats(),
          companyService.getOwnInternships(),
        ]);

        if (isMounted) {
          if (statsData.status === 'fulfilled') setStats(statsData.value);
          if (intData.status === 'fulfilled') setInternships(intData.value || []);
        }
      } catch (err) {
        console.error('Failed to load dashboard metrics', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    loadDashboardData();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleKpiClick = (kpiId) => {
    if (kpiId === 'internships') navigate(ROUTES.COMPANY.INTERNSHIPS);
    else if (kpiId === 'applications') navigate(ROUTES.COMPANY.APPLICANTS);
    else if (kpiId === 'interns') navigate(ROUTES.COMPANY.INTERNS);
    else if (kpiId === 'reviews') navigate(ROUTES.COMPANY.WEEKLY_REVIEW);
  };

  const kpis = [
    {
      id: 'internships',
      label: 'Active Postings',
      value: stats?.active_internships ?? COMPANY_KPIS[0].value,
      trend: '+2 this month',
      trendUp: true,
      icon: 'work',
      iconBg: 'bg-blue-100 text-blue-700',
    },
    {
      id: 'applications',
      label: 'Total Applicants',
      value: stats?.total_applicants ?? COMPANY_KPIS[1].value,
      trend: '+18% vs last month',
      trendUp: true,
      icon: 'description',
      iconBg: 'bg-indigo-100 text-indigo-700',
    },
    {
      id: 'interns',
      label: 'Active Placed Interns',
      value: stats?.active_interns ?? COMPANY_KPIS[2].value,
      trend: '94% Retention',
      trendUp: true,
      icon: 'badge',
      iconBg: 'bg-emerald-100 text-emerald-700',
    },
    {
      id: 'reviews',
      label: 'Pending Reviews',
      value: '4',
      trend: 'Weekly Reports',
      trendUp: true,
      icon: 'rate_review',
      iconBg: 'bg-amber-100 text-amber-700',
    },
  ];

  const recentApplicantsList =
    stats?.recent_applicants && stats.recent_applicants.length > 0
      ? stats.recent_applicants.map((a) => ({
          id: a.id,
          name: a.student?.name || 'Applicant',
          college: 'Partner Institute',
          branch: a.internship?.title || 'Engineering',
          cgpa: '8.5',
          aiMatch: Math.round(a.ai_match_score || 85),
          status: a.status,
        }))
      : APPLICANTS_LIST.slice(0, 4);

  const displayInternships =
    internships && internships.length > 0
      ? internships.slice(0, 4).map((i) => ({
          id: i.id,
          title: i.title,
          status: i.status,
          applications: i.openings ? i.openings * 3 : 5,
          active: i.openings || 1,
        }))
      : COMPANY_INTERNSHIPS;

  return (
    <div className="flex flex-col w-full space-y-6">
      <PageHeader
        title="Company Dashboard"
        breadcrumb="Overview / Live Metrics"
        actions={[
          {
            label: '+ Post New Internship',
            onClick: () => navigate(ROUTES.COMPANY.POST_INTERNSHIP),
            variant: 'primary',
          },
        ]}
      />

      {/* KPI Ribbon */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi) => (
          <div
            key={kpi.id}
            onClick={() => handleKpiClick(kpi.id)}
            className="cursor-pointer transition-transform hover:-translate-y-0.5"
          >
            <StatCard
              icon={kpi.icon}
              label={kpi.label}
              value={kpi.value}
              trend={kpi.trend}
              trendUp={kpi.trendUp}
              iconBg={kpi.iconBg}
            />
          </div>
        ))}
      </div>

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LineChartCard
          title="Application Pipeline Trends"
          data={PLACEMENT_TREND}
          xKey="month"
          lines={[{ key: 'placements', color: '#0284c7', name: 'Applications Received' }]}
        />
        <BarChartCard
          title="Internship Listing Views & Engagement"
          data={displayInternships.map((item) => ({
            name: item.title.split(' ')[0],
            applications: item.applications,
            active: item.active,
          }))}
          xKey="name"
          bars={[
            { key: 'applications', color: '#6366f1', name: 'Applications' },
            { key: 'active', color: '#10b981', name: 'Active Interns' },
          ]}
        />
      </div>

      {/* Main Content Grid: Recent Applicants + Quick Actions Rail */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recent Applicants */}
        <div className="lg:col-span-8 bg-surface-container-lowest rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">Recent Applicants</h3>
            <button
              onClick={() => navigate(ROUTES.COMPANY.APPLICANTS)}
              className="font-label-md text-label-md text-primary font-semibold hover:underline"
            >
              View All Pipeline
            </button>
          </div>
          <div className="divide-y divide-surface-container-high">
            {recentApplicantsList.map((app) => (
              <div
                key={app.id}
                onClick={() => navigate(ROUTES.COMPANY.APPLICANT_DETAIL.replace(':id', app.id))}
                className="py-3 flex items-center justify-between hover:bg-surface-container/50 px-2 rounded-lg cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary-fixed/30 flex items-center justify-center font-bold text-primary">
                    {app.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-title-md text-title-md font-semibold text-on-surface">{app.name}</h4>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      {app.branch} • {app.college}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <AIMatchBadge score={app.aiMatch} />
                  <StatusBadge status={app.status} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Rail: Active Internships & Actions */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-surface-container-lowest rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">Active Internships</h3>
              <button
                onClick={() => navigate(ROUTES.COMPANY.INTERNSHIPS)}
                className="font-label-md text-label-md text-primary font-semibold hover:underline"
              >
                Manage
              </button>
            </div>
            <div className="space-y-3">
              {displayInternships.map((item) => (
                <div key={item.id} className="p-3 bg-surface-container rounded-lg">
                  <div className="flex items-center justify-between">
                    <h4 className="font-title-sm text-title-sm font-semibold text-on-surface">{item.title}</h4>
                    <StatusBadge status={item.status} />
                  </div>
                  <div className="flex items-center justify-between text-body-sm text-on-surface-variant mt-2">
                    <span>{item.applications} Applicants</span>
                    <span className="font-semibold text-primary">{item.active} Active Openings</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-indigo-900 to-slate-900 text-white p-6 rounded-xl shadow-md">
            <div className="flex items-center gap-2 mb-2">
              <span className="material-symbols-outlined text-amber-400">auto_awesome</span>
              <h4 className="font-title-lg text-title-lg font-bold">AI Screening Live</h4>
            </div>
            <p className="font-body-sm text-body-sm text-slate-300 mb-4">
              Our AI engine automatically scores applicant skills and resumes against your posted job specs.
            </p>
            <button
              onClick={() => {
                toast.info('AI Match criteria configured to Auto-Rank.');
              }}
              className="w-full py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-label-md text-label-md font-bold rounded-lg transition-colors"
            >
              Configure Match Sensitivity
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyDashboardPage;
