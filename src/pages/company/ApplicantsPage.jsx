import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../../components/weekly-reports/PageHeader.jsx';
import DataTable from '../../components/common/DataTable.jsx';
import StatusBadge from '../../components/common/StatusBadge.jsx';
import AIMatchBadge from '../../components/common/AIMatchBadge.jsx';
import SearchBar from '../../components/common/SearchBar.jsx';
import FilterBar from '../../components/common/FilterBar.jsx';
import { APPLICANTS_LIST } from '../../data/mockData.js';
import { ROUTES } from '../../constants/routes.js';
import { useToast } from '../../store/ToastContext.jsx';
import { useCompanyApplicants } from '../../hooks/useCompanyApplicants.js';

const CompanyApplicantsPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const { applicants: apiApplicants, loading, actingId, updateStatus } =
    useCompanyApplicants(statusFilter);

  // Normalize API data or fallback to mock data if empty
  const rawList =
    apiApplicants && apiApplicants.length > 0
      ? apiApplicants.map((app) => ({
          id: app.id,
          name: app.student?.name || 'Applicant',
          email: app.student?.email || '',
          college: 'Partner Institute',
          branch: app.student?.email ? app.student.email.split('@')[1] || 'Engineering' : 'CS',
          cgpa: '8.5',
          appliedFor: app.internship?.title || 'Internship',
          aiMatch: Math.round(app.ai_match_score || 85),
          appliedAt: app.applied_at
            ? new Date(app.applied_at).toLocaleDateString()
            : 'Recently',
          status: app.status,
        }))
      : APPLICANTS_LIST;

  const filtered = rawList.filter((app) => {
    const matchesSearch =
      app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.college.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.branch.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.appliedFor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleAction = async (id, newStatus) => {
    try {
      if (apiApplicants && apiApplicants.some((a) => a.id === id)) {
        await updateStatus(id, newStatus);
      }
      toast.success(`Applicant status updated to '${newStatus}'`);
    } catch (err) {
      toast.error(err?.message || 'Failed to update status');
    }
  };

  const columns = [
    {
      header: 'Applicant',
      accessor: 'name',
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-primary-fixed/30 flex items-center justify-center font-bold text-primary">
            {row.name.charAt(0)}
          </div>
          <div>
            <span className="font-semibold text-on-surface">{row.name}</span>
            <p className="text-xs text-on-surface-variant">
              {row.college} • {row.branch}
            </p>
          </div>
        </div>
      ),
    },
    {
      header: 'Applied For',
      accessor: 'appliedFor',
    },
    {
      header: 'AI Skill Match',
      accessor: 'aiMatch',
      render: (row) => <AIMatchBadge score={row.aiMatch} />,
    },
    {
      header: 'Applied Date',
      accessor: 'appliedAt',
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (row) => <StatusBadge status={row.status} />,
    },
    {
      header: 'Actions',
      accessor: 'id',
      render: (row) => (
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate(ROUTES.COMPANY.APPLICANT_DETAIL.replace(':id', row.id));
            }}
            className="px-2.5 py-1 text-xs bg-primary text-on-primary rounded font-medium hover:bg-primary/90"
          >
            Review
          </button>
          {row.status === 'pending' && (
            <>
              <button
                disabled={actingId === row.id}
                onClick={(e) => {
                  e.stopPropagation();
                  handleAction(row.id, 'shortlisted');
                }}
                className="px-2 py-1 text-xs bg-surface-container-high rounded text-on-surface hover:bg-surface-container-highest disabled:opacity-50"
              >
                Shortlist
              </button>
              <button
                disabled={actingId === row.id}
                onClick={(e) => {
                  e.stopPropagation();
                  handleAction(row.id, 'approved');
                }}
                className="px-2 py-1 text-xs bg-emerald-600 text-white rounded font-medium hover:bg-emerald-700 disabled:opacity-50"
              >
                Approve
              </button>
            </>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="flex flex-col w-full space-y-6">
      <PageHeader
        title="Applicant Pipeline"
        breadcrumb="Company / Applicants"
        badge={
          <span className="text-xs font-semibold px-2 py-0.5 bg-primary-fixed/40 text-primary rounded-full">
            {filtered.length} Applicants
          </span>
        }
      />

      <div className="bg-surface-container-lowest rounded-xl shadow-sm p-6 space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <SearchBar
            placeholder="Search applicant by name, college, position..."
            value={searchTerm}
            onChange={setSearchTerm}
          />
          <FilterBar
            filters={[
              {
                id: 'status',
                label: 'Status',
                options: [
                  { label: 'All Applicants', value: 'all' },
                  { label: 'Pending', value: 'pending' },
                  { label: 'Shortlisted', value: 'shortlisted' },
                  { label: 'Approved', value: 'approved' },
                  { label: 'Rejected', value: 'rejected' },
                ],
                value: statusFilter,
                onChange: setStatusFilter,
              },
            ]}
          />
        </div>

        <DataTable
          columns={columns}
          data={filtered}
          loading={loading}
          onRowClick={(row) =>
            navigate(ROUTES.COMPANY.APPLICANT_DETAIL.replace(':id', row.id))
          }
        />
      </div>
    </div>
  );
};

export default CompanyApplicantsPage;
