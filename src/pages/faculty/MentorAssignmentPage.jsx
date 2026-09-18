import { useState } from 'react';
import { useToast } from '../../store/ToastContext.jsx';
import PageHeader from '../../components/weekly-reports/PageHeader.jsx';
import DataTable from '../../components/common/DataTable.jsx';
import StatusBadge from '../../components/common/StatusBadge.jsx';
import { STUDENTS_LIST, MENTORS_LIST } from '../../data/mockData.js';

const MentorAssignmentPage = () => {
  const { toast } = useToast();
  const [selectedMentors, setSelectedMentors] = useState({});

  const unassignedStudents = STUDENTS_LIST.filter(s => !s.mentor);

  const columns = [
    { key: 'student', label: 'Student', sortable: true },
    { key: 'branch', label: 'Branch', sortable: true },
    { key: 'company', label: 'Company', sortable: true },
    { key: 'mentor', label: 'Assign Mentor' },
  ];

  const data = unassignedStudents.map((student, idx) => ({
    student: (
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
    mentor: (
      <select
        value={selectedMentors[student.id] || ''}
        onChange={(e) => setSelectedMentors({ ...selectedMentors, [student.id]: e.target.value })}
        className="px-3 py-2 rounded-lg border border-outline-variant bg-surface-container text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
      >
        <option value="">Select Mentor</option>
        {MENTORS_LIST.map(mentor => (
          <option key={mentor.id} value={mentor.id}>{mentor.name}</option>
        ))}
      </select>
    ),
  }));

  const handleBulkAssign = () => {
    toast.success('Mentors assigned successfully');
  };

  return (
    <div className="flex flex-col w-full">
      <PageHeader
        title="Mentor Assignment"
        breadcrumb="Mentor Assignment"
        badge={<StatusBadge status="Pending" />}
        actions={[
          { label: 'Bulk Assign', onClick: handleBulkAssign, primary: true },
        ]}
      />

      <div className="bg-surface-container-lowest rounded-xl shadow-sm p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-surface-container rounded-lg">
            <p className="font-headline-sm text-headline-sm font-bold text-primary">{unassignedStudents.length}</p>
            <p className="font-label-sm text-label-sm text-on-surface-variant">Unassigned Students</p>
          </div>
          <div className="p-4 bg-surface-container rounded-lg">
            <p className="font-headline-sm text-headline-sm font-bold text-tertiary">{MENTORS_LIST.length}</p>
            <p className="font-label-sm text-label-sm text-on-surface-variant">Available Mentors</p>
          </div>
          <div className="p-4 bg-surface-container rounded-lg">
            <p className="font-headline-sm text-headline-sm font-bold text-secondary">
              {STUDENTS_LIST.filter(s => s.mentor).length}
            </p>
            <p className="font-label-sm text-label-sm text-on-surface-variant">Already Assigned</p>
          </div>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={data}
        sortable
      />

      {unassignedStudents.length === 0 && (
        <div className="bg-surface-container-lowest rounded-xl shadow-sm p-12 text-center">
          <span className="material-symbols-outlined text-6xl text-tertiary mb-4">check_circle</span>
          <p className="font-body-md text-body-md text-on-surface-variant">All students have been assigned mentors</p>
        </div>
      )}
    </div>
  );
};

export default MentorAssignmentPage;