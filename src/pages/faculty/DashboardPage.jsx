import PageHeader from '../../components/weekly-reports/PageHeader.jsx';
import StatCard from '../../components/common/StatCard.jsx';
import RiskIndicator from '../../components/common/RiskIndicator.jsx';
import BarChartCard from '../../components/common/charts/BarChartCard.jsx';
import LineChartCard from '../../components/common/charts/LineChartCard.jsx';
import DonutChartCard from '../../components/common/charts/DonutChartCard.jsx';
import { useFacultyDashboard } from '../../hooks/useFacultyDashboard.js';
import { useFacultyApprovals } from '../../hooks/useFacultyApprovals.js';
import { useRiskCenter } from '../../hooks/useRiskCenter.js';

const FacultyDashboardPage = () => {
  const { stats, loading: statsLoading } = useFacultyDashboard();
  const { approvals, loading: approvalsLoading } = useFacultyApprovals();
  const { cases: riskCases, loading: riskLoading } = useRiskCenter();

  const kpis = [
    {
      id: 'kpi-1',
      label: 'Total Students',
      value: stats?.total_students ?? 48,
      icon: 'school',
      iconBg: 'bg-primary-container text-on-primary-container',
      trend: '+12%',
      trendUp: true,
    },
    {
      id: 'kpi-2',
      label: 'Active Internships',
      value: stats?.active_internships ?? 36,
      icon: 'work',
      iconBg: 'bg-tertiary-container text-on-tertiary-container',
      trend: '+8%',
      trendUp: true,
    },
    {
      id: 'kpi-3',
      label: 'Pending Approvals',
      value: approvals?.length ?? (stats?.pending_approvals ?? 4),
      icon: 'pending_actions',
      iconBg: 'bg-secondary-container text-on-secondary-container',
      trend: 'Action required',
      trendUp: false,
    },
    {
      id: 'kpi-4',
      label: 'Risk Alerts',
      value: riskCases?.length ?? (stats?.risk_alerts ?? 2),
      icon: 'warning',
      iconBg: 'bg-error-container text-on-error-container',
      trend: 'Attention needed',
      trendUp: false,
    },
  ];

  const placementData = [
    { month: 'Jun', placements: 8 },
    { month: 'Jul', placements: 12 },
    { month: 'Aug', placements: 18 },
    { month: 'Sep', placements: 24 },
    { month: 'Oct', placements: 30 },
    { month: 'Nov', placements: 36 },
  ];

  const roleData = [
    { name: 'Placed', value: stats?.active_internships ?? 36 },
    { name: 'In Progress', value: 8 },
    { name: 'Pending', value: approvals?.length ?? 4 },
  ];

  const attendanceData = [
    { week: 'W1', percent: 85 },
    { week: 'W2', percent: 88 },
    { week: 'W3', percent: 82 },
    { week: 'W4', percent: 90 },
    { week: 'W5', percent: 87 },
    { week: 'W6', percent: 92 },
  ];

  if (statsLoading && approvalsLoading && riskLoading) {
    return (
      <div className="p-8 text-center text-on-surface-variant font-body-md">
        Loading Faculty Dashboard...
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full">
      <PageHeader
        title="Faculty Dashboard"
        breadcrumb="Overview"
        actions={[
          { label: 'View All Students', primary: true },
        ]}
      />

      {/* KPI Ribbon */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {kpis.map((kpi) => (
          <StatCard
            key={kpi.id}
            icon={kpi.icon}
            label={kpi.label}
            value={kpi.value}
            iconBg={kpi.iconBg}
            trend={kpi.trend}
            trendUp={kpi.trendUp}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left main column */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          {/* Risk Alerts Panel */}
          <div className="bg-surface-container-lowest rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">Risk Alerts</h3>
              <span className="px-2 py-1 bg-error-container text-on-error-container text-xs font-label-sm font-bold rounded">
                {riskCases.length} Active
              </span>
            </div>
            <div className="space-y-3">
              {riskCases.length === 0 ? (
                <p className="text-body-sm text-on-surface-variant">No high-risk students reported.</p>
              ) : (
                riskCases.slice(0, 3).map((risk) => (
                  <div key={risk.id} className="flex items-center justify-between p-4 bg-surface-container rounded-lg">
                    <div className="flex items-center gap-3">
                      <RiskIndicator level={risk.risk_level || risk.risk || 'medium'} factors={risk.issue ? [risk.issue] : (risk.factors || [])} />
                      <div>
                        <p className="font-body-md text-body-md font-semibold text-on-surface">{risk.student_name || risk.studentName}</p>
                        <p className="font-label-sm text-label-sm text-on-surface-variant">{risk.company}</p>
                      </div>
                    </div>
                    <span className="font-label-sm text-label-sm text-error font-semibold">
                      {risk.attendance ? `Attendance ${risk.attendance}` : `${risk.daysInactive || 3}d inactive`}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Pending Approvals Panel */}
          <div className="bg-surface-container-lowest rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">Pending Approvals</h3>
              <span className="px-2 py-1 bg-secondary-container text-on-secondary-container text-xs font-label-sm font-bold rounded">
                {approvals.length} Pending
              </span>
            </div>
            <div className="space-y-3">
              {approvals.length === 0 ? (
                <p className="text-body-sm text-on-surface-variant">No pending approval requests.</p>
              ) : (
                approvals.slice(0, 3).map((approval) => (
                  <div key={approval.id} className="flex items-center justify-between p-4 bg-surface-container rounded-lg">
                    <div>
                      <p className="font-body-md text-body-md font-semibold text-on-surface">{approval.student?.name || approval.studentName || 'Student Application'}</p>
                      <p className="font-label-sm text-label-sm text-on-surface-variant">{approval.type || 'Internship NOC Request'}</p>
                    </div>
                    <span className="font-label-sm text-label-sm text-on-surface-variant">
                      {approval.applied_at ? new Date(approval.applied_at).toLocaleDateString() : (approval.submittedAt || 'Today')}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <BarChartCard
              title="Placement Trend"
              data={placementData}
              dataKey="placements"
              xKey="month"
              color="#6366f1"
            />
            <DonutChartCard
              title="Internship Status"
              data={roleData}
              dataKey="value"
              nameKey="name"
            />
          </div>
        </div>

        {/* Right sidebar */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <LineChartCard
            title="Attendance Trend"
            data={attendanceData}
            dataKey="percent"
            xKey="week"
            color="#10b981"
          />
        </div>
      </div>
    </div>
  );
};

export default FacultyDashboardPage;