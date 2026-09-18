import { useState } from 'react';
import { useToast } from '../../store/ToastContext.jsx';
import PageHeader from '../../components/weekly-reports/PageHeader.jsx';
import BarChartCard from '../../components/common/charts/BarChartCard.jsx';
import LineChartCard from '../../components/common/charts/LineChartCard.jsx';
import DonutChartCard from '../../components/common/charts/DonutChartCard.jsx';

const AnalyticsPage = () => {
  const { toast } = useToast();
  const [dateRange, setDateRange] = useState('6m');

  const placementData = [
    { month: 'Jun', placements: 8 },
    { month: 'Jul', placements: 12 },
    { month: 'Aug', placements: 18 },
    { month: 'Sep', placements: 24 },
    { month: 'Oct', placements: 30 },
    { month: 'Nov', placements: 36 },
  ];

  const companyData = [
    { name: 'Zoho', value: 12 },
    { name: 'TCS', value: 10 },
    { name: 'Infosys', value: 8 },
    { name: 'Wipro', value: 6 },
    { name: 'Others', value: 4 },
  ];

  const attendanceData = [
    { week: 'W1', percent: 85 },
    { week: 'W2', percent: 88 },
    { week: 'W3', percent: 82 },
    { week: 'W4', percent: 90 },
    { week: 'W5', percent: 87 },
    { week: 'W6', percent: 92 },
  ];

  const branchData = [
    { name: 'CSE', value: 18 },
    { name: 'ECE', value: 12 },
    { name: 'IT', value: 10 },
    { name: 'Mech', value: 8 },
  ];

  const handleExport = (format) => {
    toast.success(`Report exported as ${format.toUpperCase()}`);
  };

  return (
    <div className="flex flex-col w-full">
      <PageHeader
        title="Analytics"
        breadcrumb="Analytics"
        actions={[
          { label: 'Export CSV', onClick: () => handleExport('csv'), primary: false },
          { label: 'Export PDF', onClick: () => handleExport('pdf'), primary: true },
        ]}
      />

      <div className="flex items-center gap-4 mb-6">
        <label className="font-label-md text-label-md text-on-surface">Date Range:</label>
        <select
          value={dateRange}
          onChange={(e) => setDateRange(e.target.value)}
          className="px-4 py-2 rounded-lg border border-outline-variant bg-surface-container text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="1m">Last 1 Month</option>
          <option value="3m">Last 3 Months</option>
          <option value="6m">Last 6 Months</option>
          <option value="1y">Last 1 Year</option>
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BarChartCard
          title="Placement Trend"
          data={placementData}
          dataKey="placements"
          xKey="month"
          color="#6366f1"
        />
        <DonutChartCard
          title="Company Distribution"
          data={companyData}
          dataKey="value"
          nameKey="name"
        />
        <LineChartCard
          title="Attendance Trend"
          data={attendanceData}
          dataKey="percent"
          xKey="week"
          color="#10b981"
        />
        <DonutChartCard
          title="Branch Distribution"
          data={branchData}
          dataKey="value"
          nameKey="name"
        />
      </div>
    </div>
  );
};

export default AnalyticsPage;