import { useAdminDashboard } from '../../hooks/useAdminDashboard.js';
import StatCard from '../../components/common/StatCard.jsx';
import Skeleton from '../../components/common/Skeleton.jsx';
import LineChartCard from "../../components/common/charts/LineChartCard.jsx";
import DonutChartCard from "../../components/common/charts/DonutChartCard.jsx";

const DashboardPage = () => {
  const { data, loading, error } = useAdminDashboard();

  if (loading) return <Skeleton variant="card" count={4} />;
  if (error) return <div className="text-error p-4">Failed: {error}</div>;

  const roleColors = {
    student: '#3525cd',
    faculty: '#006591',
    company: '#005338',
    admin: '#ba1a1a',
  };

  const donutData = (data.role_distribution || []).map((r) => ({
    name: r.role.charAt(0).toUpperCase() + r.role.slice(1),
    value: r.count,
  }));

  return (
    <div className="flex flex-col w-full gap-space-lg">
      <div>
        <h1 className="font-headline-xl font-bold text-on-surface">Admin Dashboard</h1>
        <p className="font-body-md text-on-surface-variant mt-1">
          Platform overview — live data from your database
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-space-md">
        <StatCard
          icon="group"
          label="Total Users"
          value={data.total_users.toLocaleString()}
          iconBg="bg-primary-fixed/60 text-primary"
          trend={`${data.pending_users} pending`}
        />
        <StatCard
          icon="work"
          label="Active Internships"
          value={data.active_internships.toLocaleString()}
          iconBg="bg-tertiary-fixed/60 text-tertiary"
          trend="Open postings"
        />
        <StatCard
          icon="verified"
          label="Verified Companies"
          value={data.verified_companies.toLocaleString()}
          iconBg="bg-secondary-fixed/50 text-secondary"
          trend={`${data.pending_companies} pending`}
        />
        <StatCard
          icon="pending_actions"
          label="Pending Approvals"
          value={(data.pending_users + data.pending_companies).toString()}
          iconBg="bg-error-container/60 text-error"
          trend="Users + companies"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-space-lg">
        <div className="lg:col-span-2">
          <LineChartCard
            title="User Registration (6 months)"
            data={data.monthly_signups}
            dataKey="count"
            xKey="month"
            height={280}
          />
        </div>
        <div className="lg:col-span-1">
          <DonutChartCard title="Role Distribution" data={donutData} height={280} />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;