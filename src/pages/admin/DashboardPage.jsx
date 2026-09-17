import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../../components/weekly-reports/PageHeader.jsx';
import StatCard from '../../components/common/StatCard.jsx';
import LineChartCard from '../../components/common/charts/LineChartCard.jsx';
import DonutChartCard from '../../components/common/charts/DonutChartCard.jsx';
import DataTable from '../../components/common/DataTable.jsx';
import StatusBadge from '../../components/common/StatusBadge.jsx';
import { ADMIN_KPIS, ROLE_DISTRIBUTION, AUDIT_LOGS, PLACEMENT_TREND } from '../../data/mockData.js';
import { ROUTES } from '../../constants/routes.js';
import { useToast } from '../../store/ToastContext.jsx';

const AdminDashboardPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const auditColumns = [
    { header: 'Timestamp', accessor: 'timestamp' },
    { header: 'Actor', accessor: 'actor', render: (r) => <span className="font-semibold text-on-surface">{r.actor}</span> },
    { header: 'Action', accessor: 'action', render: (r) => <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-surface-container-high text-primary">{r.action}</span> },
    { header: 'Entity', accessor: 'entity' },
    { header: 'IP Address', accessor: 'ip', render: (r) => <span className="font-mono text-xs text-on-surface-variant">{r.ip}</span> },
  ];

  const handleKpiClick = (id) => {
    if (id === 'users') navigate(ROUTES.ADMIN.USERS);
    else if (id === 'companies') navigate(ROUTES.ADMIN.COMPANY_VERIFICATION);
    else if (id === 'health') navigate(ROUTES.ADMIN.SYSTEM_MONITORING);
  };

  return (
    <div className="flex flex-col w-full space-y-6">
      <PageHeader
        title="Admin Control Center"
        breadcrumb="System Admin / Overview"
        actions={[
          {
            label: 'System Health',
            onClick: () => navigate(ROUTES.ADMIN.SYSTEM_MONITORING),
            variant: 'outline',
          },
          {
            label: '+ New User',
            onClick: () => navigate(ROUTES.ADMIN.USERS),
            variant: 'primary',
          },
        ]}
      />

      {/* KPI Ribbon */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {ADMIN_KPIS.map((kpi) => (
          <div key={kpi.id} onClick={() => handleKpiClick(kpi.id)} className="cursor-pointer transition-transform hover:-translate-y-0.5">
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

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8">
          <LineChartCard
            title="User Registration & Platform Growth"
            data={PLACEMENT_TREND}
            xKey="month"
            lines={[{ key: 'placements', color: '#6366f1', name: 'Active Registrations' }]}
          />
        </div>
        <div className="lg:col-span-4">
          <DonutChartCard
            title="User Role Distribution"
            data={ROLE_DISTRIBUTION}
          />
        </div>
      </div>

      {/* Recent Audit Logs */}
      <div className="bg-surface-container-lowest rounded-xl shadow-sm p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">Recent System Audit Activity</h3>
          <button
            onClick={() => navigate(ROUTES.ADMIN.AUDIT_LOGS)}
            className="font-label-md text-label-md text-primary font-semibold hover:underline"
          >
            View Full Audit Logs
          </button>
        </div>
        <DataTable columns={auditColumns} data={AUDIT_LOGS} />
      </div>
    </div>
  );
};

export default AdminDashboardPage;
