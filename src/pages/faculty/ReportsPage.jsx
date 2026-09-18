import { useState } from 'react';
import { useToast } from '../../store/ToastContext.jsx';
import PageHeader from '../../components/weekly-reports/PageHeader.jsx';
import SearchBar from '../../components/common/SearchBar.jsx';
import FilterBar from '../../components/common/FilterBar.jsx';
import DataTable from '../../components/common/DataTable.jsx';
import StatusBadge from '../../components/common/StatusBadge.jsx';
import AIMatchBadge from '../../components/common/AIMatchBadge.jsx';
import { useWeeklyReports } from '../../hooks/useWeeklyReports.js';

const ReportsPage = () => {
  const { toast } = useToast();
  const { reports, loading, reload } = useWeeklyReports();
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
    { key: 'status', label: 'Status', options: ['pending', 'evaluated', 'submitted', 'approved'] },
    { key: 'week', label: 'Week', options: ['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7', 'W8'] },
  ];

  const filteredReports = reports.filter(report => {
    const studentName = report.student_name || report.student || 'Student';
    if (searchQuery && !studentName.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    if (selectedFilters.status && report.status !== selectedFilters.status) {
      return false;
    }
    return true;
  });

  const data = filteredReports.map(report => {
    const sName = report.student_name || report.student || 'Student';
    const weekNum = report.week_number ? `W${report.week_number}` : (report.week || 'W1');
    const compName = report.company || 'Assigned Internship';
    const scoreVal = report.score ?? (report.kpis ? 9.0 : null);

    return {
      student: sName,
      week: weekNum,
      company: compName,
      score: scoreVal ? (
        <div className="flex items-center gap-2">
          <span className="font-body-md text-body-md font-semibold text-primary">{scoreVal}</span>
          <AIMatchBadge match={Math.round(scoreVal * 10)} />
        </div>
      ) : '-',
      status: <StatusBadge status={report.status || 'submitted'} />,
      actions: (
        <button
          onClick={() => toast.info(`Reviewing report for ${sName} (${weekNum})`)}
          className="px-3 py-1.5 bg-primary-container text-on-primary font-label-sm text-label-sm font-semibold rounded-lg hover:bg-primary-container/80"
        >
          Review
        </button>
      ),
    };
  });

  return (
    <div className="flex flex-col w-full">
      <PageHeader
        title="Weekly Reports"
        breadcrumb="Reports"
        badge={<StatusBadge status="Active" />}
        actions={[
          { label: 'Export CSV', primary: false, onClick: reload },
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

        {loading ? (
          <div className="p-8 text-center text-on-surface-variant font-body-md">Loading Reports...</div>
        ) : (
          <DataTable
            columns={columns}
            data={data}
            sortable
            pagination
          />
        )}
      </div>
    </div>
  );
};

export default ReportsPage;