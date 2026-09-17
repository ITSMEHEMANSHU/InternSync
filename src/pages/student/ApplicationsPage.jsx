import { useNavigate } from 'react-router-dom';
import { useApplications } from '../../hooks/useApplications.js';
import { ROUTES } from '../../constants/routes.js';
import Tabs from '../../components/common/Tabs.jsx';
import StatusBadge from '../../components/common/StatusBadge.jsx';
import DataTable from '../../components/common/DataTable.jsx';

const TABS = [
  { id: 'all', label: 'All' },
  { id: 'pending', label: 'Pending' },
  { id: 'under_review', label: 'Under Review' },
  { id: 'approved', label: 'Approved' },
  { id: 'shortlisted', label: 'Shortlisted' },
  { id: 'rejected', label: 'Rejected' },
];

const COLUMNS = [
  {
    key: 'title',
    label: 'Role',
    sortable: true,
    render: (row) => row.internship?.title ?? '—',
  },
  {
    key: 'company',
    label: 'Company',
    sortable: true,
    render: (row) => row.company?.name ?? '—',
  },
  {
    key: 'applied_at',
    label: 'Applied On',
    sortable: true,
    render: (row) =>
      row.applied_at ? new Date(row.applied_at).toLocaleDateString('en-IN') : '—',
  },
  {
    key: 'stage',
    label: 'Stage',
    render: (row) => row.stage ?? '—',
  },
  {
    key: 'status',
    label: 'Status',
    render: (row) => <StatusBadge status={row.status} />,
  },
];

const ApplicationsPage = () => {
  const { applications, loading, error, activeTab, setActiveTab } = useApplications();
  const navigate = useNavigate();

  return (
    <div className="flex flex-col w-full gap-space-lg">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-headline-xl text-headline-xl font-bold text-on-surface">
            My Applications
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant mt-1">
            Track all your internship applications
          </p>
        </div>
        <button
          onClick={() => navigate(ROUTES.STUDENT.INTERNSHIPS)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary-container text-on-primary font-label-md text-label-md font-semibold hover:opacity-95 transition-all"
        >
          <span className="material-symbols-outlined text-[18px]">add_circle</span>
          Browse Internships
        </button>
      </div>

      <Tabs tabs={TABS} activeTab={activeTab} onChange={setActiveTab} />

      <DataTable
        columns={COLUMNS}
        data={applications}
        loading={loading}
        onRowClick={(row) =>
          navigate(ROUTES.STUDENT.APPLICATION_DETAIL.replace(':id', row.id))
        }
        emptyIcon="send"
        emptyTitle={error ? 'Could not load applications' : 'No applications yet'}
        emptyDescription={
          error ||
          'Start applying to internships to see them here.'
        }
        emptyAction={{
          label: 'Browse Internships',
          icon: 'search',
          onClick: () => navigate(ROUTES.STUDENT.INTERNSHIPS),
        }}
      />
    </div>
  );
};

export default ApplicationsPage;