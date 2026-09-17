import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../../components/weekly-reports/PageHeader.jsx';
import DataTable from '../../components/common/DataTable.jsx';
import StatusBadge from '../../components/common/StatusBadge.jsx';
import FilterBar from '../../components/common/FilterBar.jsx';
import SearchBar from '../../components/common/SearchBar.jsx';
import { COMPANY_INTERNSHIPS } from '../../data/mockData.js';
import { ROUTES } from '../../constants/routes.js';
import { useToast } from '../../store/ToastContext.jsx';

const CompanyManageInternshipsPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filtered = COMPANY_INTERNSHIPS.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const columns = [
    {
      header: 'Internship Title',
      accessor: 'title',
      render: (row) => (
        <div>
          <span className="font-semibold text-on-surface">{row.title}</span>
          <p className="text-xs text-on-surface-variant">Posted on {row.posted}</p>
        </div>
      ),
    },
    {
      header: 'Applicants',
      accessor: 'applications',
      render: (row) => <span className="font-bold text-primary">{row.applications}</span>,
    },
    {
      header: 'Active Interns',
      accessor: 'active',
      render: (row) => <span className="font-semibold text-emerald-600">{row.active}</span>,
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (row) => <StatusBadge status={row.status} />,
    },
    {
      header: 'Deadline',
      accessor: 'deadline',
    },
    {
      header: 'Actions',
      accessor: 'id',
      render: (row) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate(ROUTES.COMPANY.APPLICANTS)}
            className="px-2.5 py-1 text-xs bg-surface-container-high rounded text-on-surface hover:bg-surface-container-highest font-medium"
          >
            View Applicants
          </button>
          <button
            onClick={() => toast.info(`Status for ${row.title} updated`)}
            className="px-2.5 py-1 text-xs bg-primary-fixed/30 text-primary rounded font-medium hover:bg-primary-fixed/50"
          >
            Edit
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="flex flex-col w-full space-y-6">
      <PageHeader
        title="Manage Internships"
        breadcrumb="Company / Internships"
        actions={[
          {
            label: '+ Post Internship',
            onClick: () => navigate(ROUTES.COMPANY.POST_INTERNSHIP),
            variant: 'primary',
          },
        ]}
      />

      <div className="bg-surface-container-lowest rounded-xl shadow-sm p-6 space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <SearchBar placeholder="Search listings..." value={searchTerm} onChange={setSearchTerm} />
          <FilterBar
            filters={[
              {
                id: 'status',
                label: 'Status',
                options: [
                  { label: 'All Statuses', value: 'all' },
                  { label: 'Active', value: 'active' },
                  { label: 'Draft', value: 'draft' },
                  { label: 'Closed', value: 'closed' },
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
          onRowClick={(row) => navigate(ROUTES.COMPANY.APPLICANTS)}
        />
      </div>
    </div>
  );
};

export default CompanyManageInternshipsPage;
