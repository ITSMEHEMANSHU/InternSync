import { useAdminCompanies } from '../../hooks/useAdminCompanies.js';
import { useToast } from '../../store/ToastContext.jsx';
import DataTable from '../../components/common/DataTable.jsx';
import FilterBar from '../../components/common/FilterBar.jsx';
import StatusBadge from '../../components/common/StatusBadge.jsx';

const FILTERS = [
  { key: 'filter', value: 'pending', label: 'Pending' },
  { key: 'filter', value: 'verified', label: 'Verified' },
  { key: 'filter', value: 'all', label: 'All' },
];

const COLUMNS = [
  { key: 'name', label: 'Company', sortable: true },
  { key: 'industry', label: 'Industry' },
  { key: 'location', label: 'Location' },
  { key: 'hr_spoc_name', label: 'HR Name' },
  { key: 'hr_spoc_email', label: 'HR Email' },
  {
    key: 'verified',
    label: 'Status',
    render: (row) => (
      <StatusBadge status={row.verified ? 'verified' : 'pending'} />
    ),
  },
  {
    key: 'actions',
    label: 'Actions',
    render: (row) =>
      row.verified ? (
        <span className="text-xs text-on-surface-variant">—</span>
      ) : (
        <div className="flex gap-2">
          <button
            onClick={() => window.__verifyCompany?.(row.id)}
            className="px-2 py-1 rounded bg-tertiary text-on-tertiary text-xs font-semibold"
          >
            Verify
          </button>
          <button
            onClick={() => window.__rejectCompany?.(row.id)}
            className="px-2 py-1 rounded bg-error text-on-error text-xs font-semibold"
          >
            Reject
          </button>
        </div>
      ),
  },
];

const CompanyVerificationPage = () => {
  const { companies, loading, error, verify, reject, filter, setFilter } =
    useAdminCompanies();
  const { toast } = useToast();

  window.__verifyCompany = async (id) => {
    try {
      await verify(id);
      toast.success('Company verified');
    } catch (err) {
      toast.error(err?.message || 'Failed to verify');
    }
  };
  window.__rejectCompany = async (id) => {
    try {
      await reject(id);
      toast.success('Company rejected');
    } catch (err) {
      toast.error(err?.message || 'Failed to reject');
    }
  };

  return (
    <div className="flex flex-col w-full gap-space-lg">
      <div>
        <h1 className="font-headline-xl font-bold text-on-surface">
          Company Verification
        </h1>
        <p className="font-body-md text-on-surface-variant mt-1">
          Review and verify registered companies before they can post internships
        </p>
      </div>

      <FilterBar
        filters={FILTERS}
        activeFilters={{ filter }}
        onChange={(_, v) => setFilter(v)}
        onClear={() => setFilter('pending')}
      />

      <DataTable
        columns={COLUMNS}
        data={companies}
        loading={loading}
        emptyIcon="business"
        emptyTitle={error ? 'Could not load companies' : 'No companies to review'}
        emptyDescription={error || 'All caught up.'}
      />
    </div>
  );
};

export default CompanyVerificationPage;