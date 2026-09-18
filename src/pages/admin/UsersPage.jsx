import { useAdminUsers } from '../../hooks/useAdminUsers.js';
import { useToast } from '../../store/ToastContext.jsx';
import DataTable from '../../components/common/DataTable.jsx';
import StatusBadge from '../../components/common/StatusBadge.jsx';
import SearchBar from '../../components/common/SearchBar.jsx';

const ROLE_OPTIONS = [
  { value: 'all', label: 'All Roles' },
  { value: 'student', label: 'Students' },
  { value: 'faculty', label: 'Faculty' },
  { value: 'company', label: 'Companies' },
  { value: 'admin', label: 'Admins' },
];

const STATUS_OPTIONS = [
  { value: 'all', label: 'All Status' },
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Pending' },
  { value: 'suspended', label: 'Suspended' },
];

const UsersPage = () => {
  const {
    users, loading, error, approve, reject,
    search, setSearch,
    roleFilter, setRoleFilter,
    statusFilter, setStatusFilter,
  } = useAdminUsers();
  const { toast } = useToast();

  const columns = [
    {
      key: 'name',
      label: 'User Name',
      render: (row) => (
        <div>
          <p className="font-semibold text-on-surface">{row.name || '—'}</p>
          <p className="text-xs text-on-surface-variant">{row.email}</p>
        </div>
      ),
    },
    {
      key: 'role',
      label: 'Role',
      render: (row) => (
        <span className="px-2 py-0.5 rounded-full bg-surface-container text-xs font-semibold uppercase">
          {row.role}
        </span>
      ),
    },
    {
      key: 'institute',
      label: 'Institute',
      render: (row) => row.institute || '—',
    },
    {
      key: 'status',
      label: 'Status',
      render: (row) => <StatusBadge status={row.status} />,
    },
    {
      key: 'created_at',
      label: 'Joined',
      render: (row) =>
        row.created_at
          ? new Date(row.created_at).toLocaleDateString('en-IN')
          : '—',
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (row) => {
        if (row.status === 'active') {
          return <span className="text-xs text-on-surface-variant">—</span>;
        }
        if (row.status === 'suspended') {
          return (
            <span className="text-xs text-error font-semibold">Suspended</span>
          );
        }
        return (
          <div className="flex gap-2">
            <button
              onClick={async (e) => {
                e.stopPropagation();
                try {
                  await approve(row.id);
                  toast.success(`${row.name} approved`);
                } catch (err) {
                  toast.error(err?.message || 'Approve failed');
                }
              }}
              className="px-3 py-1 rounded bg-tertiary text-on-tertiary text-xs font-semibold hover:opacity-90"
            >
              Approve
            </button>
            <button
              onClick={async (e) => {
                e.stopPropagation();
                try {
                  await reject(row.id);
                  toast.success(`${row.name} rejected`);
                } catch (err) {
                  toast.error(err?.message || 'Reject failed');
                }
              }}
              className="px-3 py-1 rounded bg-error text-on-error text-xs font-semibold hover:opacity-90"
            >
              Reject
            </button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="flex flex-col w-full gap-space-lg">
      <div>
        <h1 className="font-headline-xl font-bold text-on-surface">
          User Management
        </h1>
        <p className="font-body-md text-on-surface-variant mt-1">
          Approve, reject, and manage all platform users
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 items-center">
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Search by name or email…"
          className="flex-1"
        />
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="h-9 px-3 rounded-lg border border-outline-variant/60 bg-surface-container-low text-sm"
        >
          {ROLE_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="h-9 px-3 rounded-lg border border-outline-variant/60 bg-surface-container-low text-sm"
        >
          {STATUS_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>

      <DataTable
        columns={columns}
        data={users}
        loading={loading}
        emptyIcon="group_off"
        emptyTitle={error ? 'Could not load users' : 'No users found'}
        emptyDescription={error || 'Try adjusting filters.'}
      />
    </div>
  );
};

export default UsersPage;