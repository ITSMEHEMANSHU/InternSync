import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFacultyApprovals } from '../../hooks/useFacultyApprovals.js';
import { useToast } from '../../store/ToastContext.jsx';
import { facultyService } from '../../services/facultyService.js';
import { ROUTES } from '../../constants/routes.js';
import DataTable from '../../components/common/DataTable.jsx';
import StatusBadge from '../../components/common/StatusBadge.jsx';
import Tabs from '../../components/common/Tabs.jsx';

const TABS = [
  { id: 'applications', label: 'Student Applications' },
  { id: 'internships', label: 'Internship Postings' },
];

const AppColumns = [
  { key: 'student', label: 'Student', render: (r) => r.student?.name ?? '—' },
  { key: 'title', label: 'Role', render: (r) => r.internship?.title ?? '—' },
  { key: 'company', label: 'Company', render: (r) => r.company?.name ?? '—' },
  {
    key: 'applied_at',
    label: 'Applied',
    render: (r) =>
      r.applied_at ? new Date(r.applied_at).toLocaleDateString('en-IN') : '—',
  },
  {
    key: 'status',
    label: 'Status',
    render: (r) => <StatusBadge status={r.status} />,
  },
];

const IntColumns = [
  { key: 'title', label: 'Title', sortable: true },
  { key: 'company', label: 'Company', render: (r) => r.company?.name ?? '—' },
  { key: 'location', label: 'Location', render: (r) => r.location ?? '—' },
  {
    key: 'stipend',
    label: 'Stipend',
    render: (r) => (r.stipend ? `₹${r.stipend.toLocaleString('en-IN')}/mo` : '—'),
  },
  {
    key: 'deadline',
    label: 'Deadline',
    render: (r) => r.deadline || '—',
  },
  {
    key: 'actions',
    label: 'Actions',
    render: (r) => (
      <div className="flex gap-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            window.__approveInternship?.(r.id);
          }}
          className="px-3 py-1 rounded bg-tertiary text-on-tertiary text-xs font-semibold hover:opacity-90"
        >
          Approve
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            window.__rejectInternship?.(r.id);
          }}
          className="px-3 py-1 rounded bg-error text-on-error text-xs font-semibold hover:opacity-90"
        >
          Reject
        </button>
      </div>
    ),
  },
];

const ApprovalsPage = () => {
  const [tab, setTab] = useState('applications');
  const { approvals, loading, error } = useFacultyApprovals();
  const [postings, setPostings] = useState([]);
  const [postingsLoading, setPostingsLoading] = useState(true);
  const [postingsError, setPostingsError] = useState(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (tab !== 'internships') return;
    setPostingsLoading(true);
    facultyService
      .getInternshipApprovals()
      .then((data) => setPostings(Array.isArray(data) ? data : []))
      .catch((err) => setPostingsError(err?.message))
      .finally(() => setPostingsLoading(false));
  }, [tab]);

  window.__approveInternship = async (id) => {
    try {
      await facultyService.approveInternship(id);
      toast.success('Internship approved');
      setPostings((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      toast.error(err?.message || 'Approve failed');
    }
  };

  window.__rejectInternship = async (id) => {
    const reason = prompt('Reason for rejection (optional):') || null;
    try {
      await facultyService.rejectInternship(id, reason);
      toast.success('Internship rejected');
      setPostings((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      toast.error(err?.message || 'Reject failed');
    }
  };

  return (
    <div className="flex flex-col w-full gap-space-lg">
      <div>
        <h1 className="font-headline-xl font-bold text-on-surface">Approvals</h1>
        <p className="font-body-md text-on-surface-variant mt-1">
          Review student applications and company internship postings
        </p>
      </div>

      <Tabs tabs={TABS} activeTab={tab} onChange={setTab} />

      {tab === 'applications' && (
        <DataTable
          columns={AppColumns}
          data={approvals}
          loading={loading}
          onRowClick={(row) =>
            navigate(ROUTES.FACULTY.APPROVAL_DETAIL.replace(':id', row.id))
          }
          emptyIcon="check_circle"
          emptyTitle={error ? 'Could not load' : 'No pending applications'}
          emptyDescription={error || 'All caught up.'}
        />
      )}

      {tab === 'internships' && (
        <DataTable
          columns={IntColumns}
          data={postings}
          loading={postingsLoading}
          emptyIcon="work"
          emptyTitle={postingsError ? 'Could not load' : 'No pending postings'}
          emptyDescription={postingsError || 'All caught up.'}
        />
      )}
    </div>
  );
};

export default ApprovalsPage;