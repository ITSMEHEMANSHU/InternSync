import { useState } from 'react';
import PageHeader from '../../components/weekly-reports/PageHeader.jsx';
import DataTable from '../../components/common/DataTable.jsx';
import Modal from '../../components/common/Modal.jsx';
import { DEPARTMENTS } from '../../data/mockData.js';
import { useToast } from '../../store/ToastContext.jsx';

const AdminDepartmentsPage = () => {
  const { toast } = useToast();
  const [departments, setDepartments] = useState(DEPARTMENTS);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newDep, setNewDep] = useState({ name: '', code: '', students: 50, faculty: 5 });

  const handleAddDepartment = (e) => {
    e.preventDefault();
    if (!newDep.name || !newDep.code) return;
    const created = {
      id: `DEP-00${departments.length + 1}`,
      ...newDep,
    };
    setDepartments([...departments, created]);
    toast.success(`Department ${newDep.name} added successfully!`);
    setIsAddOpen(false);
    setNewDep({ name: '', code: '', students: 50, faculty: 5 });
  };

  const columns = [
    { header: 'Department Name', accessor: 'name', render: (r) => <span className="font-semibold text-on-surface">{r.name}</span> },
    { header: 'Branch Code', accessor: 'code', render: (r) => <span className="font-mono text-xs font-bold px-2 py-0.5 bg-surface-container-high rounded text-primary">{r.code}</span> },
    { header: 'Enrolled Students', accessor: 'students', render: (r) => <span className="font-semibold text-on-surface">{r.students}</span> },
    { header: 'Faculty Mentors', accessor: 'faculty', render: (r) => <span className="font-semibold text-tertiary">{r.faculty}</span> },
    {
      header: 'Actions',
      accessor: 'id',
      render: (r) => (
        <button
          onClick={() => toast.info(`Editing ${r.name}...`)}
          className="px-2.5 py-1 text-xs bg-surface-container-high rounded text-on-surface hover:bg-surface-container-highest font-medium"
        >
          Manage Semesters
        </button>
      ),
    },
  ];

  return (
    <div className="flex flex-col w-full space-y-6">
      <PageHeader
        title="Departments & Academic Structure"
        breadcrumb="Admin / Departments"
        actions={[
          {
            label: '+ Add Department',
            onClick: () => setIsAddOpen(true),
            variant: 'primary',
          },
        ]}
      />

      {/* Academic Year Banner */}
      <div className="bg-surface-container-lowest rounded-xl shadow-sm p-6 flex flex-col sm:flex-row items-center justify-between gap-4 border-l-4 border-primary">
        <div>
          <h3 className="font-title-lg text-title-lg font-bold text-on-surface">Active Academic Year: AY 2024–2025</h3>
          <p className="font-body-sm text-body-sm text-on-surface-variant">Semester 8 Internship Batch active until May 2025.</p>
        </div>
        <button
          onClick={() => toast.info('Academic year settings panel opened.')}
          className="px-4 py-2 border rounded-lg font-label-md text-label-md text-primary font-bold hover:bg-surface-container"
        >
          Configure Academic Terms
        </button>
      </div>

      <div className="bg-surface-container-lowest rounded-xl shadow-sm p-6 space-y-4">
        <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">Registered Departments</h3>
        <DataTable columns={columns} data={departments} />
      </div>

      {/* Add Department Modal */}
      {isAddOpen && (
        <Modal
          open={isAddOpen}
          onClose={() => setIsAddOpen(false)}
          title="Add New Department"
          footer={
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsAddOpen(false)}
                className="px-4 py-2 border rounded-lg font-label-md text-label-md text-on-surface-variant"
              >
                Cancel
              </button>
              <button
                onClick={handleAddDepartment}
                className="px-6 py-2 bg-primary text-on-primary font-label-md text-label-md font-bold rounded-lg hover:bg-primary/90"
              >
                Add Department
              </button>
            </div>
          }
        >
          <form onSubmit={handleAddDepartment} className="space-y-4">
            <div>
              <label className="block font-label-md text-label-md text-on-surface mb-1 font-semibold">Department Name</label>
              <input
                type="text"
                placeholder="e.g. Artificial Intelligence & Data Science"
                value={newDep.name}
                onChange={(e) => setNewDep({ ...newDep, name: e.target.value })}
                required
                className="w-full px-3 py-2 bg-surface-container rounded-lg border border-transparent focus:border-primary font-body-md text-body-md"
              />
            </div>
            <div>
              <label className="block font-label-md text-label-md text-on-surface mb-1 font-semibold">Department Code</label>
              <input
                type="text"
                placeholder="e.g. AI-DS"
                value={newDep.code}
                onChange={(e) => setNewDep({ ...newDep, code: e.target.value })}
                required
                className="w-full px-3 py-2 bg-surface-container rounded-lg border border-transparent focus:border-primary font-body-md text-body-md"
              />
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default AdminDepartmentsPage;
