import { useState } from 'react';
import { useToast } from '../../store/ToastContext.jsx';
import PageHeader from '../../components/weekly-reports/PageHeader.jsx';
import SearchBar from '../../components/common/SearchBar.jsx';
import FilterBar from '../../components/common/FilterBar.jsx';
import DataTable from '../../components/common/DataTable.jsx';
import StatusBadge from '../../components/common/StatusBadge.jsx';
import AIMatchBadge from '../../components/common/AIMatchBadge.jsx';
import { WEEKLY_KPI_METRICS, EVALUATED_REPORTS } from '../../data/mockData.js';

const ReportsPage = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilters, setSelectedFilters] = useState({});

  const columns = [
    { key: 'student', label: 'Student', sortable: true },
    { key: 'week', label: 'Week', sortable: true },
    { key: 'company', label: 'Company', sortable: true },
    { key: 'score', label: 'Score', sortable: true },
    { key: 'status', label: 'Status' },
    { key: 'actions', label: 'Actions' },
  ];

  const filters = [
    { key: 'status', label: 'Status', options: ['pending', 'evaluated', 'approved'] },
    { key: 'week', label: 'Week', options: ['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7', 'W8'] },
  ];

  const mockReports = [
    { id: 'RPT-001', student: 'Aarav Sharma', week: 'W7', company: 'Zoho Corp', score: 9.6, status: 'evaluated' },
    { id: 'RPT-002', student: 'Priya Patel', week: 'W7', company: 'TCS', score: 8.8, status: 'evaluated' },
    { id: 'RPT-003', student: 'Rohan Verma', week: 'W6', company: 'Infosys', score: null, status: 'pending' },
    { id: 'RPT-004', student: 'Sneha Reddy', week: 'W7', company: 'Wipro', score: 9.2, status: 'evaluated' },
  ];

  const filteredReports = mockReports.filter(report => {
    if (searchQuery && !report.student.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    if (selectedFilters.status && report.status !== selectedFilters.status) {
      return false;
    }
    return true;
  });

  const data = filteredReports.map(report => ({
    student: report.student,
    week: report.week,
    company: report.company,
    score: report.score ? (
      <div className="flex items-center gap-2">
        <span className="font-body-md text-body-md font-semibold text-primary">{report.score}</span>
        <AIMatchBadge match={Math.round(report.score * 10)} />
      </div>
    ) : '-',
    status: <StatusBadge status={report.status} />,
    actions: (
      <button
        onClick={() => toast.info('Opening report details...')}
        className="px-3 py-1.5 bg-primary-container text-on-primary font-label-sm text-label-sm font-semibold rounded-lg hover:bg-primary-container/80"
      >
        Review
      </button>
    ),
  }));

  return (
    <div className="flex flex-col w-full">
      <PageHeader
        title="Weekly Reports"
        breadcrumb="Reports"
        badge={<StatusBadge status="In Progress" />}
        actions={[
          { label: 'Export CSV', primary: false },
          { label: 'Compare View', primary: true },
        ]}
      />

      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-4">
          <SearchBar
            placeholder="Search reports..."
            value={searchQuery}
            onChange={setSearchQuery}
          />
          <FilterBar
            filters={filters}
            selectedFilters={selectedFilters}
            onFilterChange={setSelectedFilters}
          />
        </div>

        <DataTable
          columns={columns}
          data={data}
          sortable
          pagination
        />
      </div>
    </div>
  );
};

export default ReportsPage;