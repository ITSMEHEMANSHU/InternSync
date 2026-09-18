import { useNavigate } from 'react-router-dom';
import { useCompanyInternships } from '../../hooks/useCompanyInternships.js';
import { useToast } from '../../store/ToastContext.jsx';
import { ROUTES } from '../../constants/routes.js';
import DataTable from '../../components/common/DataTable.jsx';
import StatusBadge from '../../components/common/StatusBadge.jsx';
import EmptyState from '../../components/common/EmptyState.jsx';

const ManageInternshipsPage = () => {
  const { internships, loading, error, acting, submit, remove, close } =
    useCompanyInternships();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (id) => {
    try {
      await submit(id);
      toast.success('Submitted for faculty approval');
    } catch (err) {
      toast.error(err?.message || 'Submit failed');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this internship? This cannot be undone.')) return;
    try {
      await remove(id);
      toast.success('Deleted');
    } catch (err) {
      toast.error(err?.message || 'Delete failed');
    }
  };

  const handleClose = async (id) => {
    if (!confirm('Close this internship? Students will no longer see it.'))
      return;
    try {
      await close(id);
      toast.success('Closed');
    } catch (err) {
      toast.error(err?.message || 'Close failed');
    }
  };

  const columns = [
    {
      key: 'title',
      label: 'Title',
      render: (r) => (
        <div>
          <p className="font-semibold text-on-surface">{r.title}</p>
          {r.location && (
            <p className="text-xs text-on-surface-variant">{r.location}</p>
          )}
        </div>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (r) => <StatusBadge status={r.status} />,
    },
    {
      key: 'stipend',
      label: 'Stipend',
      render: (r) =>
        r.stipend ? `₹${r.stipend.toLocaleString('en-IN')}/mo` : '—',
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
        <div className="flex gap-2 flex-wrap">
          {(r.status === 'draft' || r.status === 'rejected') && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleSubmit(r.id);
                }}
                disabled={acting === r.id}
                className="px-3 py-1 rounded bg-primary text-on-primary text-xs font-semibold hover:opacity-90"
              >
                Submit
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(r.id);
                }}
                disabled={acting === r.id}
                className="px-3 py-1 rounded bg-error text-on-error text-xs font-semibold hover:opacity-90"
              >
                Delete
              </button>
            </>
          )}

          {r.status === 'pending_approval' && (
            <>
              <span className="text-xs text-secondary font-semibold px-2 py-1">
                Awaiting faculty
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(r.id);
                }}
                className="px-3 py-1 rounded bg-error text-on-error text-xs font-semibold hover:opacity-90"
              >
                Withdraw
              </button>
            </>
          )}

          {r.status === 'open' && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleClose(r.id);
              }}
              className="px-3 py-1 rounded bg-surface-container text-on-surface text-xs font-semibold hover:bg-surface-container-high"
            >
              Close
            </button>
          )}

          {r.status === 'rejected' && r.rejection_reason && (
            <span
              className="text-xs text-error"
              title={r.rejection_reason}
            >
              {r.rejection_reason.slice(0, 30)}
              {r.rejection_reason.length > 30 ? '…' : ''}
            </span>
          )}

          {r.status === 'closed' && (
            <span className="text-xs text-on-surface-variant font-semibold">
              Closed
            </span>
          )}

          {r.status === 'archived' && (
            <span className="text-xs text-on-surface-variant font-semibold">
              Archived
            </span>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="flex flex-col w-full gap-space-lg">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-headline-xl font-bold text-on-surface">
            Manage Internships
          </h1>
          <p className="font-body-md text-on-surface-variant mt-1">
            Create, submit, and manage your internship postings
          </p>
        </div>
        <button
          onClick={() => navigate(ROUTES.COMPANY.POST_INTERNSHIP)}
          className="px-4 py-2 rounded-lg bg-primary text-on-primary font-label-md font-semibold hover:opacity-90"
        >
          + Post Internship
        </button>
      </div>

      {!loading && !error && internships.length === 0 ? (
        <EmptyState
          icon="work"
          title="No internships yet"
          description="Post your first internship to get started."
          action={{
            label: 'Post Internship',
            icon: 'add_circle',
            onClick: () => navigate(ROUTES.COMPANY.POST_INTERNSHIP),
          }}
        />
      ) : (
        <DataTable
          columns={columns}
          data={internships}
          loading={loading}
          emptyIcon="work"
          emptyTitle={error ? 'Could not load' : 'No internships'}
          emptyDescription={error || ''}
        />
      )}
    </div>
  );
};

export default ManageInternshipsPage;