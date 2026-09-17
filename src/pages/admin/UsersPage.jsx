import { useState } from 'react';
import PageHeader from '../../components/weekly-reports/PageHeader.jsx';
import DataTable from '../../components/common/DataTable.jsx';
import StatusBadge from '../../components/common/StatusBadge.jsx';
import SearchBar from '../../components/common/SearchBar.jsx';
import FilterBar from '../../components/common/FilterBar.jsx';
import Modal from '../../components/common/Modal.jsx';
import { USERS_LIST } from '../../data/mockData.js';
import { useToast } from '../../store/ToastContext.jsx';

const AdminUsersPage = () => {
  const { toast } = useToast();
  const [users, setUsers] = useState(USERS_LIST);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [selectedUser, setSelectedUser] = useState(null);
  const [editRole, setEditRole] = useState('student');

  const filtered = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleToggleStatus = (userId) => {
    setUsers(
      users.map((u) =>
        u.id === userId ? { ...u, status: u.status === 'active' ? 'inactive' : 'active' } : u
      )
    );
    toast.success('User status updated');
  };

  const handleSaveRole = () => {
    setUsers(users.map((u) => (u.id === selectedUser.id ? { ...u, role: editRole } : u)));
    toast.success(`Role updated to ${editRole} for ${selectedUser.name}`);
    setSelectedUser(null);
  };

  const columns = [
    {
      header: 'User Name',
      accessor: 'name',
      render: (row) => (
        <div>
          <span className="font-semibold text-on-surface">{row.name}</span>
          <p className="text-xs text-on-surface-variant">{row.email}</p>
        </div>
      ),
    },
    {
      header: 'Role',
      accessor: 'role',
      render: (row) => (
        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-surface-container-high text-primary">
          {row.role}
        </span>
      ),
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (row) => <StatusBadge status={row.status} />,
    },
    {
      header: 'Joined Date',
      accessor: 'joined',
    },
    {
      header: 'Actions',
      accessor: 'id',
      render: (row) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setSelectedUser(row);
              setEditRole(row.role);
            }}
            className="px-2.5 py-1 text-xs bg-surface-container-high rounded text-on-surface hover:bg-surface-container-highest font-medium"
          >
            Edit Role
          </button>
          <button
            onClick={() => handleToggleStatus(row.id)}
            className={`px-2.5 py-1 text-xs rounded font-medium ${
              row.status === 'active'
                ? 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                : 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
            }`}
          >
            {row.status === 'active' ? 'Deactivate' : 'Activate'}
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="flex flex-col w-full space-y-6">
      <PageHeader
        title="User Management"
        breadcrumb="Admin / Users"
        badge={<span className="text-xs font-semibold px-2.5 py-0.5 bg-primary-fixed/40 text-primary rounded-full">{users.length} Total Users</span>}
      />

      <div className="bg-surface-container-lowest rounded-xl shadow-sm p-6 space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <SearchBar placeholder="Search by name or email..." value={searchTerm} onChange={setSearchTerm} />
          <FilterBar
            filters={[
              {
                id: 'role',
                label: 'Role',
                options: [
                  { label: 'All Roles', value: 'all' },
                  { label: 'Student', value: 'student' },
                  { label: 'Faculty', value: 'faculty' },
                  { label: 'Company', value: 'company' },
                  { label: 'Admin', value: 'admin' },
                ],
                value: roleFilter,
                onChange: setRoleFilter,
              },
            ]}
          />
        </div>

        <DataTable columns={columns} data={filtered} />
      </div>

      {/* Edit Role Modal */}
      {selectedUser && (
        <Modal
          open={Boolean(selectedUser)}
          onClose={() => setSelectedUser(null)}
          title="Edit User Role"
          footer={
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setSelectedUser(null)}
                className="px-4 py-2 border rounded-lg font-label-md text-label-md text-on-surface-variant"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveRole}
                className="px-6 py-2 bg-primary text-on-primary font-label-md text-label-md font-bold rounded-lg hover:bg-primary/90"
              >
                Save Changes
              </button>
            </div>
          }
        >
          <div className="space-y-4">
            <p className="font-body-md text-body-md text-on-surface">
              Change role access for <strong className="font-bold">{selectedUser.name}</strong> ({selectedUser.email}):
            </p>
            <div>
              <label className="block font-label-md text-label-md text-on-surface mb-1 font-semibold">Select Role</label>
              <select
                value={editRole}
                onChange={(e) => setEditRole(e.target.value)}
                className="w-full px-3 py-2 bg-surface-container rounded-lg font-body-md text-body-md font-semibold text-on-surface"
              >
                <option value="student">Student</option>
                <option value="faculty">Faculty Mentor</option>
                <option value="company">Company Partner</option>
                <option value="admin">System Admin</option>
              </select>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default AdminUsersPage;
