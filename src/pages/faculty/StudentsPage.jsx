import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../../components/weekly-reports/PageHeader.jsx';
import SearchBar from '../../components/common/SearchBar.jsx';
import FilterBar from '../../components/common/FilterBar.jsx';
import DataTable from '../../components/common/DataTable.jsx';
import RiskIndicator from '../../components/common/RiskIndicator.jsx';
import StatusBadge from '../../components/common/StatusBadge.jsx';
import { useFacultyStudents } from '../../hooks/useFacultyStudents.js';

const StudentsPage = () => {
  const navigate = useNavigate();
  const { students, loading, search, setSearch } = useFacultyStudents();
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
    { key: 'status', label: 'Status', options: ['active', 'pending'] },
    { key: 'risk', label: 'Risk Level', options: ['low', 'medium', 'high'] },
  ];

  const filteredStudents = students.filter(student => {
    if (selectedFilters.branch && (student.branch || student.department) !== selectedFilters.branch) {
      return false;
    }
    if (selectedFilters.risk && (student.risk || 'low') !== selectedFilters.risk) {
      return false;
    }
    return true;
  });

  const data = filteredStudents.map((student) => {
    const studentName = student.name || student.email || 'Student';
    const studentId = student.id || student._id;
    const progress = student.progress ?? 75;
    const attendanceVal = student.attendance ? (typeof student.attendance === 'number' ? `${student.attendance}%` : student.attendance) : '94%';
    const riskLevel = student.risk || 'low';

    return {
      id: studentId,
      name: (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary-container rounded-full flex items-center justify-center">
            <span className="font-label-md text-label-md font-bold text-primary">
              {studentName.split(' ').map(n => n[0]).join('').slice(0, 2)}
            </span>
          </div>
          <div>
            <p className="font-body-md text-body-md font-semibold text-on-surface">{studentName}</p>
            <p className="font-label-sm text-label-sm text-on-surface-variant">{student.email || studentId}</p>
          </div>
        </div>
      ),
      branch: student.branch || student.department || 'CSE',
      company: student.company || 'Not Placed',
      progress: (
        <div className="flex items-center gap-2">
          <div className="w-24 bg-surface-container rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full" 
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="font-label-sm text-label-sm text-on-surface">{progress}%</span>
        </div>
      ),
      attendance: attendanceVal,
      risk: <RiskIndicator level={riskLevel} factors={[]} />,
      actions: (
        <button
          onClick={() => navigate(`/faculty/students/${studentId}`)}
          className="px-3 py-1.5 bg-primary-container text-on-primary font-label-sm text-label-sm font-semibold rounded-lg hover:bg-primary-container/80"
        >
          View
        </button>
      ),
    };
  });

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
            value={search}
            onChange={setSearch}
          />
          <FilterBar
            filters={filters}
            selectedFilters={selectedFilters}
            onFilterChange={setSelectedFilters}
          />
        </div>

        {loading ? (
          <div className="p-8 text-center text-on-surface-variant font-body-md">
            Loading Students...
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={data}
            sortable
            pagination
            onRowClick={(row) => {
              const item = filteredStudents[row.index];
              if (item) navigate(`/faculty/students/${item.id}`);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default StudentsPage;