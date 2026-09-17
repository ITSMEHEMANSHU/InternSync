import { useNavigate } from 'react-router-dom';
import { useApplications } from '../../hooks/useApplications.js';
import { ROUTES } from '../../constants/routes.js';
import Tabs from '../../components/common/Tabs.jsx';
import StatusBadge from '../../components/common/StatusBadge.jsx';
import DataTable from '../../components/common/DataTable.jsx';
import EmptyState from '../../components/common/EmptyState.jsx';

const TABS = [
  { id: 'all', label: 'All' },
  { id: 'pending', label: 'Pending' },
  { id: 'approved', label: 'Approved' },
  { id: 'shortlisted', label: 'Shortlisted' },
  { id: 'rejected', label: 'Rejected' },
];

const COLUMNS = [
  { key: 'title', label: 'Role', sortable: true },
  { key: 'company', label: 'Company', sortable: true },
  { key: 'appliedAt', label: 'Applied On', sortable: true },
  { key: 'stage', label: 'Stage' },
  { key: 'status', label: 'Status', render: (v) => <StatusBadge status={v} /> },
];

const ApplicationsPage = () => {
  const { applications, loading, activeTab, setActiveTab } = useApplications();
  const navigate = useNavigate();

  return (
    <div className="flex flex-col w-full gap-space-lg">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-headline-xl text-headline-xl font-bold text-on-surface">My Applications</h1>
          <p className="font-body-md text-body-md text-on-surface-variant mt-1">Track all your internship applications</p>
        </div>
        <button onClick={() => navigate(ROUTES.STUDENT.INTERNSHIPS)} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary-container text-on-primary font-label-md text-label-md font-semibold hover:opacity-95 transition-all">
          <span className="material-symbols-outlined text-[18px]">add_circle</span>
          Browse Internships
        </button>
      </div>

      <Tabs tabs={TABS} activeTab={activeTab} onChange={setActiveTab} />

      <DataTable
        columns={COLUMNS}
        data={applications}
        loading={loading}
        onRowClick={(row) => navigate(ROUTES.STUDENT.APPLICATIONS)}
        emptyIcon="send"
        emptyTitle="No applications yet"
        emptyDescription="Start applying to internships to see them here."
        emptyAction={{ label: 'Browse Internships', icon: 'search', onClick: () => navigate(ROUTES.STUDENT.INTERNSHIPS) }}
      />
    </div>
  );
};

export default ApplicationsPage;
