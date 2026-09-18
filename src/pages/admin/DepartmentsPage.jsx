import { useEffect, useState } from 'react';
import { adminService } from '../../services/adminService.js';
import { useInstitutes } from '../../hooks/useInstitutes.js';
import { useToast } from '../../store/ToastContext.jsx';
import DataTable from '../../components/common/DataTable.jsx';
import EmptyState from '../../components/common/EmptyState.jsx';
import Modal from '../../components/common/Modal.jsx';
import SearchableSelect from '../../components/common/SearchableSelect.jsx';

const DepartmentsPage = () => {
  const { toast } = useToast();
  const { institutes } = useInstitutes();
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({
    name: '',
    code: '',
    description: '',
    institute_id: '',
  });

  const load = async () => {
    setLoading(true);
    try {
      const data = await adminService.getDepartments();
      setDepartments(Array.isArray(data) ? data : []);
    } catch (err) {
      toast.error(err?.message || 'Failed to load departments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleCreate = async () => {
    if (!form.name.trim()) {
      toast.error('Name is required');
      return;
    }
    setCreating(true);
    try {
      const payload = {
        name: form.name.trim(),
        code: form.code.trim() || null,
        description: form.description.trim() || null,
        institute_id: form.institute_id || null,
      };
      await adminService.createDepartment(payload);
      toast.success('Department created');
      setOpen(false);
      setForm({ name: '', code: '', description: '', institute_id: '' });
      load();
    } catch (err) {
      toast.error(err?.message || 'Failed to create');
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this department?')) return;
    try {
      await adminService.deleteDepartment(id);
      toast.success('Deleted');
      load();
    } catch (err) {
      toast.error(err?.message || 'Failed to delete');
    }
  };

  const columns = [
    { key: 'name', label: 'Name', sortable: true },
    {
      key: 'code',
      label: 'Code',
      render: (r) => r.code || '—',
    },
    {
      key: 'institute_name',
      label: 'Institute',
      render: (r) => r.institute_name || '—',
    },
    {
      key: 'user_count',
      label: 'Users',
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (r) => (
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleDelete(r.id);
          }}
          className="px-3 py-1 rounded bg-error text-on-error text-xs font-semibold hover:opacity-90"
        >
          Delete
        </button>
      ),
    },
  ];

  return (
    <div className="flex flex-col w-full gap-space-lg">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-headline-xl font-bold text-on-surface">
            Departments
          </h1>
          <p className="font-body-md text-on-surface-variant mt-1">
            Manage academic departments across institutes
          </p>
        </div>
        <button
          onClick={() => setOpen(true)}
          className="px-4 py-2 rounded-lg bg-primary text-on-primary font-label-md font-semibold hover:opacity-90"
        >
          + Add Department
        </button>
      </div>

      {!loading && departments.length === 0 ? (
        <EmptyState
          icon="account_tree"
          title="No departments yet"
          description="Create your first department to organize faculty and students."
          action={{
            label: 'Add Department',
            icon: 'add_circle',
            onClick: () => setOpen(true),
          }}
        />
      ) : (
        <DataTable columns={columns} data={departments} loading={loading} />
      )}

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Add Department"
        footer={
          <>
            <button
              onClick={() => setOpen(false)}
              className="px-4 py-2 bg-surface-container text-on-surface font-label-md font-semibold rounded-lg"
            >
              Cancel
            </button>
            <button
              onClick={handleCreate}
              disabled={creating}
              className="px-4 py-2 bg-primary text-on-primary font-label-md font-semibold rounded-lg disabled:opacity-60"
            >
              {creating ? 'Creating…' : 'Create'}
            </button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block font-label-md font-semibold text-on-surface mb-2">
              Name *
            </label>
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Computer Science & Engineering"
              className="w-full px-4 py-3 rounded-lg border border-outline-variant bg-surface-container"
            />
          </div>

          <div>
            <label className="block font-label-md font-semibold text-on-surface mb-2">
              Code
            </label>
            <input
              value={form.code}
              onChange={(e) => setForm({ ...form, code: e.target.value })}
              placeholder="CSE"
              className="w-full px-4 py-3 rounded-lg border border-outline-variant bg-surface-container"
            />
          </div>

          <div>
            <label className="block font-label-md font-semibold text-on-surface mb-2">
              Institute (optional)
            </label>
            <SearchableSelect
              options={[
                { value: '', label: '— None —' },
                ...institutes.map((i) => ({
                  value: i.id,
                  label: i.name,
                  sublabel: [i.city, i.state].filter(Boolean).join(', '),
                })),
              ]}
              value={form.institute_id}
              onChange={(v) => setForm({ ...form, institute_id: v })}
              placeholder="Select institute (optional)"
            />
          </div>

          <div>
            <label className="block font-label-md font-semibold text-on-surface mb-2">
              Description
            </label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={3}
              className="w-full px-4 py-3 rounded-lg border border-outline-variant bg-surface-container resize-none"
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default DepartmentsPage;