import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../../components/weekly-reports/PageHeader.jsx';
import SearchBar from '../../components/common/SearchBar.jsx';
import FilterBar from '../../components/common/FilterBar.jsx';
import DataTable from '../../components/common/DataTable.jsx';
import RiskIndicator from '../../components/common/RiskIndicator.jsx';
import StatusBadge from '../../components/common/StatusBadge.jsx';
import { STUDENTS_LIST } from '../../data/mockData.js';

const StudentsPage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilters, setSelectedFilters] = useState({});

  const columns = [
    { key: 'name', label: 'Student', sortable: true },
    { key: 'branch', label: 'Branch', sortable: true },
    { key: 'company', label: 'Company', sortable: true },
    { key: 'progress', label: 'Progress', sortable: true },
    { key: 'attendance', label: 'Attendance', sortable: true },
    { key: 'risk', label: 'Risk Level' },
    { key: 'actions', label: 'Actions' },
  ];

  const filters = [
    { key: 'branch', label: 'Branch', options: ['CSE', 'ECE', 'IT', 'Mech'] },
    { key: 'semester', label: 'Semester', options: ['6', '7', '8'] },
    { key: 'status', label: 'Status', options: ['active', 'pending'] },
    { key: 'risk', label: 'Risk Level', options: ['low', 'medium', 'high'] },
  ];

  const filteredStudents = STUDENTS_LIST.filter(student => {
    if (searchQuery && !student.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    if (selectedFilters.branch && student.branch !== selectedFilters.branch) {
      return false;
    }
    if (selectedFilters.risk && student.risk !== selectedFilters.risk) {
      return false;
    }
    return true;
  });

  const data = filteredStudents.map(student => ({
    name: (
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-primary-container rounded-full flex items-center justify-center">
          <span className="font-label-md text-label-md font-bold text-primary">
            {student.name.split(' ').map(n => n[0]).join('')}
          </span>
        </div>
        <div>
          <p className="font-body-md text-body-md font-semibold text-on-surface">{student.name}</p>
          <p className="font-label-sm text-label-sm text-on-surface-variant">{student.id}</p>
        </div>
      </div>
    ),
    branch: student.branch,
    company: student.company || 'Not Placed',
    progress: (
      <div className="flex items-center gap-2">
        <div className="w-24 bg-surface-container rounded-full h-2">
          <div 
            className="bg-primary h-2 rounded-full" 
            style={{ width: `${student.progress}%` }}
          />
        </div>
        <span className="font-label-sm text-label-sm text-on-surface">{student.progress}%</span>
      </div>
    ),
    attendance: `${student.attendance}%`,
    risk: <RiskIndicator level={student.risk} factors={[]} />,
    actions: (
      <button
        onClick={() => navigate(`/faculty/students/${student.id}`)}
        className="px-3 py-1.5 bg-primary-container text-on-primary font-label-sm text-label-sm font-semibold rounded-lg hover:bg-primary-container/80"
      >
        View
      </button>
    ),
  }));

  return (
    <div className="flex flex-col w-full">
      <PageHeader
        title="Students"
        breadcrumb="Students"
        badge={<StatusBadge status="Active" />}
        actions={[
          { label: 'Export CSV', primary: false },
          { label: 'Bulk Assign', primary: true },
        ]}
      />

      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-4">
          <SearchBar
            placeholder="Search students..."
            value={searchQuery}
            onChange={setSearchQuery}
          />
          <FilterBar
            filters={filters}
            selectedFilters={selectedFilters}
            onFilterChange={setSelectedFilters}
          />
        </div>

        <DataTable
          columns={columns}
          data={data}
          sortable
          pagination
          onRowClick={(row) => navigate(`/faculty/students/${STUDENTS_LIST[row.index].id}`)}
        />
      </div>
    </div>
  );
};

export default StudentsPage;