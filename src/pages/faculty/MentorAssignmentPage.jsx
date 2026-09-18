import { useState } from 'react';
import { useToast } from '../../store/ToastContext.jsx';
import PageHeader from '../../components/weekly-reports/PageHeader.jsx';
import DataTable from '../../components/common/DataTable.jsx';
import StatusBadge from '../../components/common/StatusBadge.jsx';
import { useFacultyStudents } from '../../hooks/useFacultyStudents.js';
import { facultyService } from '../../services/facultyService.js';

const MENTORS_LIST = [
  { id: 'm1', name: 'Dr. Sarah Jenkins' },
  { id: 'm2', name: 'Prof. Alex Mercer' },
  { id: 'm3', name: 'Dr. Michael Chen' },
];

const MentorAssignmentPage = () => {
  const { toast } = useToast();
  const { students, loading, reload } = useFacultyStudents();
  const [selectedMentors, setSelectedMentors] = useState({});

  const columns = [
    { key: 'student', label: 'Student', sortable: true },
    { key: 'branch', label: 'Branch', sortable: true },
    { key: 'company', label: 'Company', sortable: true },
    { key: 'mentor', label: 'Assign Mentor' },
  ];

  const data = students.map((student) => {
    const sName = student.name || student.email || 'Student';
    const sId = student.id;

    return {
      student: (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary-container rounded-full flex items-center justify-center">
            <span className="font-label-md text-label-md font-bold text-primary">
              {sName.split(' ').map(n => n[0]).join('').slice(0, 2)}
            </span>
          </div>
          <div>
            <p className="font-body-md text-body-md font-semibold text-on-surface">{sName}</p>
            <p className="font-label-sm text-label-sm text-on-surface-variant">{student.email || sId}</p>
          </div>
        </div>
      ),
      branch: student.branch || student.department || 'CSE',
      company: student.company || 'Not Placed',
      mentor: (
        <select
          value={selectedMentors[sId] || ''}
          onChange={(e) => setSelectedMentors({ ...selectedMentors, [sId]: e.target.value })}
          className="px-3 py-2 rounded-lg border border-outline-variant bg-surface-container text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="">Select Mentor</option>
          {MENTORS_LIST.map(mentor => (
            <option key={mentor.id} value={mentor.id}>{mentor.name}</option>
          ))}
        </select>
      ),
    };
  });

  const handleBulkAssign = async () => {
    const studentIds = Object.keys(selectedMentors).filter(id => selectedMentors[id]);
    if (studentIds.length === 0) {
      toast.info('Please select at least one mentor before assigning.');
      return;
    }
    try {
      for (const sid of studentIds) {
        await facultyService.assignMentor(sid, { mentorId: selectedMentors[sid] });
      }
      toast.success('Mentors assigned successfully');
      reload();
    } catch {
      toast.error('Failed to assign mentors');
    }
  };

  return (
    <div className="flex flex-col w-full">
      <PageHeader
        title="Mentor Assignment"
        breadcrumb="Mentor Assignment"
        badge={<StatusBadge status="Active" />}
        actions={[
          { label: 'Bulk Assign', onClick: handleBulkAssign, primary: true },
        ]}
      />

      <div className="bg-surface-container-lowest rounded-xl shadow-sm p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-surface-container rounded-lg">
            <p className="font-headline-sm text-headline-sm font-bold text-primary">{students.length}</p>
            <p className="font-label-sm text-label-sm text-on-surface-variant">Total Students</p>
          </div>
          <div className="p-4 bg-surface-container rounded-lg">
            <p className="font-headline-sm text-headline-sm font-bold text-tertiary">{MENTORS_LIST.length}</p>
            <p className="font-label-sm text-label-sm text-on-surface-variant">Available Mentors</p>
          </div>
          <div className="p-4 bg-surface-container rounded-lg">
            <p className="font-headline-sm text-headline-sm font-bold text-secondary">
              {Object.keys(selectedMentors).length}
            </p>
            <p className="font-label-sm text-label-sm text-on-surface-variant">Assigned Selected</p>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="p-8 text-center text-on-surface-variant font-body-md">Loading Students...</div>
      ) : (
        <DataTable
          columns={columns}
          data={data}
          sortable
        />
      )}

      {!loading && students.length === 0 && (
        <div className="bg-surface-container-lowest rounded-xl shadow-sm p-12 text-center">
          <span className="material-symbols-outlined text-6xl text-tertiary mb-4">check_circle</span>
          <p className="font-body-md text-body-md text-on-surface-variant">All students have been assigned mentors</p>
        </div>
      )}
    </div>
  );
};

export default MentorAssignmentPage;