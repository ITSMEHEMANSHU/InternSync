import PageHeader from '../../components/weekly-reports/PageHeader.jsx';
import StatCard from '../../components/common/StatCard.jsx';
import ProgressRing from '../../components/common/ProgressRing.jsx';
import RiskIndicator from '../../components/common/RiskIndicator.jsx';
import StatusBadge from '../../components/common/StatusBadge.jsx';
import { STUDENTS_LIST } from '../../data/mockData.js';

const MonitoringPage = () => {
  const activeStudents = STUDENTS_LIST.filter(s => s.status === 'active');

  return (
    <div className="flex flex-col w-full">
      <PageHeader
        title="Student Monitoring"
        breadcrumb="Monitoring"
        badge={<StatusBadge status="Active" />}
        actions={[
          { label: 'Refresh Data', primary: false },
        ]}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {activeStudents.map((student) => (
          <div key={student.id} className="bg-surface-container-lowest rounded-xl shadow-sm p-6">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-14 h-14 bg-primary-container rounded-full flex items-center justify-center">
                <span className="font-label-lg text-label-lg font-bold text-primary">
                  {student.name.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
              <div className="flex-1">
                <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface mb-1">{student.name}</h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant">{student.company}</p>
              </div>
              <RiskIndicator level={student.risk} factors={[]} />
            </div>

            <div className="flex items-center justify-center mb-4">
              <ProgressRing value={student.progress} size={100} color="primary" label="Progress" />
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="text-center p-3 bg-surface-container rounded-lg">
                <p className="font-headline-sm text-headline-sm font-bold text-tertiary">{student.attendance}%</p>
                <p className="font-label-sm text-label-sm text-on-surface-variant">Attendance</p>
              </div>
              <div className="text-center p-3 bg-surface-container rounded-lg">
                <p className="font-headline-sm text-headline-sm font-bold text-secondary">{student.lastReport || 'N/A'}</p>
                <p className="font-label-sm text-label-sm text-on-surface-variant">Last Report</p>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="font-label-sm text-label-sm text-on-surface-variant">
                {student.branch} • Sem {student.semester}
              </span>
              <StatusBadge status={student.status} />
            </div>
          </div>
        ))}
      </div>

      {activeStudents.length === 0 && (
        <div className="bg-surface-container-lowest rounded-xl shadow-sm p-12 text-center">
          <span className="material-symbols-outlined text-6xl text-on-surface-variant/30 mb-4">person_off</span>
          <p className="font-body-md text-body-md text-on-surface-variant">No active students to monitor</p>
        </div>
      )}
    </div>
  );
};

export default MonitoringPage;