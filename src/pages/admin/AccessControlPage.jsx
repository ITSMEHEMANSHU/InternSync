import { useState } from 'react';
import PageHeader from '../../components/weekly-reports/PageHeader.jsx';
import { useToast } from '../../store/ToastContext.jsx';

const INITIAL_MATRIX = {
  viewDashboard: { student: true, faculty: true, company: true, admin: true },
  submitWeeklyReport: { student: true, faculty: false, company: false, admin: true },
  approveApplications: { student: false, faculty: true, company: true, admin: true },
  verifyDocuments: { student: false, faculty: true, company: false, admin: true },
  postInternships: { student: false, faculty: false, company: true, admin: true },
  manageUsers: { student: false, faculty: false, company: false, admin: true },
  viewAuditLogs: { student: false, faculty: false, company: false, admin: true },
};

const PERMISSION_LABELS = {
  viewDashboard: 'View Domain Dashboard',
  submitWeeklyReport: 'Submit Weekly & Final Reports',
  approveApplications: 'Approve Internship Applications',
  verifyDocuments: 'Verify Student NOC & Offer Letters',
  postInternships: 'Post & Edit Internship Listings',
  manageUsers: 'Manage System Users & Roles',
  viewAuditLogs: 'Access System Audit Logs & Monitoring',
};

const AdminAccessControlPage = () => {
  const { toast } = useToast();
  const [matrix, setMatrix] = useState(INITIAL_MATRIX);
  const [isSaving, setIsSaving] = useState(false);

  const togglePermission = (permKey, roleKey) => {
    setMatrix({
      ...matrix,
      [permKey]: {
        ...matrix[permKey],
        [roleKey]: !matrix[permKey][roleKey],
      },
    });
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast.success('Access control matrix saved successfully!');
    }, 500);
  };

  return (
    <div className="flex flex-col w-full space-y-6">
      <PageHeader
        title="Role & Permission Matrix"
        breadcrumb="Admin / Access Control"
        actions={[
          {
            label: 'Save Permissions',
            onClick: handleSave,
            variant: 'primary',
          },
        ]}
      />

      <div className="bg-surface-container-lowest rounded-xl shadow-sm p-6 space-y-4">
        <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface mb-2">
          RBAC (Role-Based Access Control) Matrix
        </h3>
        <p className="font-body-md text-body-md text-on-surface-variant">
          Configure feature permissions and endpoint authorization levels per user role.
        </p>

        <div className="overflow-x-auto pt-2">
          <table className="w-full text-left border-collapse font-body-md text-body-md">
            <thead>
              <tr className="border-b border-surface-container-high bg-surface-container/50">
                <th className="p-3 font-title-sm text-title-sm font-bold text-on-surface">Permission Name</th>
                <th className="p-3 text-center font-title-sm text-title-sm font-bold text-primary">Student</th>
                <th className="p-3 text-center font-title-sm text-title-sm font-bold text-secondary">Faculty</th>
                <th className="p-3 text-center font-title-sm text-title-sm font-bold text-tertiary">Company</th>
                <th className="p-3 text-center font-title-sm text-title-sm font-bold text-on-surface font-extrabold">Admin</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container-high">
              {Object.keys(matrix).map((permKey) => (
                <tr key={permKey} className="hover:bg-surface-container/30">
                  <td className="p-3 font-medium text-on-surface">{PERMISSION_LABELS[permKey]}</td>
                  {['student', 'faculty', 'company', 'admin'].map((roleKey) => (
                    <td key={roleKey} className="p-3 text-center">
                      <input
                        type="checkbox"
                        checked={matrix[permKey][roleKey]}
                        onChange={() => togglePermission(permKey, roleKey)}
                        disabled={roleKey === 'admin'}
                        className="w-5 h-5 text-primary rounded cursor-pointer disabled:opacity-60"
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-end pt-4">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-6 py-2.5 bg-primary text-on-primary font-label-md text-label-md font-bold rounded-lg hover:bg-primary/90 transition-colors"
          >
            {isSaving ? 'Updating RBAC...' : 'Save RBAC Configuration'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminAccessControlPage;
