import PageHeader from '../../components/weekly-reports/PageHeader.jsx';
import ProgressRing from '../../components/common/ProgressRing.jsx';
import RiskIndicator from '../../components/common/RiskIndicator.jsx';
import StatusBadge from '../../components/common/StatusBadge.jsx';
import { useFacultyMonitoring } from '../../hooks/useFacultyMonitoring.js';

const MonitoringPage = () => {
  const { monitoring, loading, reload } = useFacultyMonitoring();

  return (
    <div className="flex flex-col w-full">
      <PageHeader
        title="Student Monitoring"
        breadcrumb="Monitoring"
        badge={<StatusBadge status="Active" />}
        actions={[
          { label: 'Refresh Data', primary: false, onClick: reload },
        ]}
      />

      {loading ? (
        <div className="p-8 text-center text-on-surface-variant font-body-md">
          Loading Monitoring Data...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {monitoring.map((item) => {
            const studentName = item.student_name || 'Student Candidate';
            const companyName = item.company_name || 'Partner Company';
            const progress = item.progress ?? 85;
            const attendance = item.attendance_rate || '95%';
            const lastReport = item.last_active || 'Today';

            return (
              <div key={item.id} className="bg-surface-container-lowest rounded-xl shadow-sm p-6">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-14 h-14 bg-primary-container rounded-full flex items-center justify-center">
                    <span className="font-label-lg text-label-lg font-bold text-primary">
                      {studentName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface mb-1">{studentName}</h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">{companyName}</p>
                  </div>
                  <RiskIndicator level={item.risk || 'low'} factors={[]} />
                </div>

                <div className="flex items-center justify-center mb-4">
                  <ProgressRing value={progress} size={100} color="primary" label="Progress" />
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="text-center p-3 bg-surface-container rounded-lg">
                    <p className="font-headline-sm text-headline-sm font-bold text-tertiary">{attendance}</p>
                    <p className="font-label-sm text-label-sm text-on-surface-variant">Attendance</p>
                  </div>
                  <div className="text-center p-3 bg-surface-container rounded-lg">
                    <p className="font-headline-sm text-headline-sm font-bold text-secondary">{lastReport}</p>
                    <p className="font-label-sm text-label-sm text-on-surface-variant">Last Active</p>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="font-label-sm text-label-sm text-on-surface-variant">
                    {item.role || 'Engineering Intern'}
                  </span>
                  <StatusBadge status={item.status || 'active'} />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {!loading && monitoring.length === 0 && (
        <div className="bg-surface-container-lowest rounded-xl shadow-sm p-12 text-center">
          <span className="material-symbols-outlined text-6xl text-on-surface-variant/30 mb-4">person_off</span>
          <p className="font-body-md text-body-md text-on-surface-variant">No active students to monitor</p>
        </div>
      )}
    </div>
  );
};

export default MonitoringPage;