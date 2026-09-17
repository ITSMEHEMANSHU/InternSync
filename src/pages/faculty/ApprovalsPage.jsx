import { useNavigate } from 'react-router-dom';
import { useFacultyApprovals } from '../../hooks/useFacultyApprovals.js';
import { ROUTES } from '../../constants/routes.js';
import DataTable from '../../components/common/DataTable.jsx';
import StatusBadge from '../../components/common/StatusBadge.jsx';

const COLUMNS = [
  {
    key: 'student',
    label: 'Student',
    render: (row) => row.student?.name ?? '—',
  },
  {
    key: 'title',
    label: 'Role',
    render: (row) => row.internship?.title ?? '—',
  },
  {
    key: 'company',
    label: 'Company',
    render: (row) => row.company?.name ?? '—',
  },
  {
    key: 'applied_at',
    label: 'Applied On',
    render: (row) =>
      row.applied_at ? new Date(row.applied_at).toLocaleDateString('en-IN') : '—',
  },
  {
    key: 'status',
    label: 'Status',
    render: (row) => <StatusBadge status={row.status} />,
  },
];

const ApprovalsPage = () => {
  const { approvals, loading, error } = useFacultyApprovals();
  const navigate = useNavigate();

  return (
    <div className="flex flex-col w-full gap-space-lg">
      <div>
        <h1 className="font-headline-xl text-headline-xl font-bold text-on-surface">
          Pending Approvals
        </h1>
        <p className="font-body-md text-body-md text-on-surface-variant mt-1">
          Review and approve student internship applications
        </p>
      </div>

      <DataTable
        columns={COLUMNS}
        data={approvals}
        loading={loading}
        onRowClick={(row) =>
          navigate(ROUTES.FACULTY.APPROVAL_DETAIL.replace(':id', row.id))
        }
        emptyIcon="check_circle"
        emptyTitle={error ? 'Could not load approvals' : 'No pending approvals'}
        emptyDescription={error || 'All caught up.'}
      />
    </div>
  );
};

export default ApprovalsPage;