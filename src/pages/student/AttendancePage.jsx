import { useState } from 'react';
import { useToast } from '../../store/ToastContext.jsx';
import PageHeader from '../../components/weekly-reports/PageHeader.jsx';
import StatCard from '../../components/common/StatCard.jsx';
import ProgressRing from '../../components/common/ProgressRing.jsx';
import StatusBadge from '../../components/common/StatusBadge.jsx';
import { ATTENDANCE_DATA } from '../../data/mockData.js';

const AttendancePage = () => {
  const { toast } = useToast();
  const [isMarking, setIsMarking] = useState(false);
  const [viewMode, setViewMode] = useState('calendar'); // calendar | table

  const handleMarkAttendance = () => {
    setIsMarking(true);
    setTimeout(() => {
      setIsMarking(false);
      toast.success('Attendance marked as Present for today');
    }, 500);
  };

  const today = new Date().toISOString().split('T')[0];
  const isTodayMarked = ATTENDANCE_DATA.days.some(d => d.date === today);

  return (
    <div className="flex flex-col w-full">
      <PageHeader
        title="Attendance"
        breadcrumb="My Internship / Attendance"
        badge={<StatusBadge status="Active" />}
        actions={[
          { 
            label: isTodayMarked ? 'Already Marked' : 'Mark Today Present', 
            onClick: handleMarkAttendance, 
            loading: isMarking, 
            primary: true,
            disabled: isTodayMarked
          },
        ]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-start">
        {/* Left main column */}
        <div className="lg:col-span-8 flex flex-col gap-space-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">
              {ATTENDANCE_DATA.month}
            </h3>
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode('calendar')}
                className={`px-3 py-1.5 rounded-lg font-label-sm text-label-sm font-semibold transition-colors ${
                  viewMode === 'calendar' 
                    ? 'bg-primary-container text-on-primary' 
                    : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
                }`}
              >
                Calendar
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`px-3 py-1.5 rounded-lg font-label-sm text-label-sm font-semibold transition-colors ${
                  viewMode === 'table' 
                    ? 'bg-primary-container text-on-primary' 
                    : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
                }`}
              >
                Table
              </button>
            </div>
          </div>

          {viewMode === 'calendar' ? (
            <div className="bg-surface-container-lowest rounded-xl shadow-sm p-space-lg">
              <div className="grid grid-cols-7 gap-2 mb-4">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, idx) => (
                  <div key={idx} className="text-center font-label-sm text-label-sm font-semibold text-on-surface-variant py-2">
                    {day}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-2">
                {ATTENDANCE_DATA.days.map((day, idx) => {
                  const date = new Date(day.date);
                  const dayNum = date.getDate();
                  const statusColors = {
                    present: 'bg-tertiary-container text-on-tertiary-container',
                    absent: 'bg-error-container text-on-error-container',
                    leave: 'bg-secondary-container text-on-secondary-container',
                  };
                  return (
                    <div
                      key={idx}
                      className={`aspect-square flex items-center justify-center rounded-lg font-label-md text-label-md font-semibold ${statusColors[day.status]}`}
                    >
                      {dayNum}
                    </div>
                  );
                })}
              </div>
              <div className="flex items-center justify-center gap-6 mt-6 pt-4 border-t border-outline-variant/30">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-tertiary-container" />
                  <span className="font-label-sm text-label-sm text-on-surface-variant">Present</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-error-container" />
                  <span className="font-label-sm text-label-sm text-on-surface-variant">Absent</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-secondary-container" />
                  <span className="font-label-sm text-label-sm text-on-surface-variant">Leave</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden">
              <table className="w-full">
                <thead className="bg-surface-container">
                  <tr>
                    <th className="px-4 py-3 text-left font-label-sm text-label-sm font-semibold text-on-surface-variant">Date</th>
                    <th className="px-4 py-3 text-left font-label-sm text-label-sm font-semibold text-on-surface-variant">Day</th>
                    <th className="px-4 py-3 text-left font-label-sm text-label-sm font-semibold text-on-surface-variant">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {ATTENDANCE_DATA.days.map((day, idx) => (
                    <tr key={idx} className="border-t border-outline-variant/20">
                      <td className="px-4 py-3 font-body-md text-body-md text-on-surface">{day.date}</td>
                      <td className="px-4 py-3 font-body-md text-body-md text-on-surface">
                        {new Date(day.date).toLocaleDateString('en-US', { weekday: 'long' })}
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={day.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Right sidebar */}
        <div className="lg:col-span-4 flex flex-col gap-space-lg">
          <div className="bg-surface-container-lowest rounded-xl shadow-sm p-space-lg">
            <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface mb-4">Attendance Summary</h3>
            <div className="flex justify-center mb-6">
              <ProgressRing value={ATTENDANCE_DATA.percent} size={160} color="primary" label="Attendance" />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <p className="font-headline-sm text-headline-sm font-bold text-tertiary">{ATTENDANCE_DATA.present}</p>
                <p className="font-label-sm text-label-sm text-on-surface-variant">Present</p>
              </div>
              <div className="text-center">
                <p className="font-headline-sm text-headline-sm font-bold text-error">{ATTENDANCE_DATA.absent}</p>
                <p className="font-label-sm text-label-sm text-on-surface-variant">Absent</p>
              </div>
              <div className="text-center">
                <p className="font-headline-sm text-headline-sm font-bold text-secondary">{ATTENDANCE_DATA.leave}</p>
                <p className="font-label-sm text-label-sm text-on-surface-variant">Leave</p>
              </div>
            </div>
          </div>

          <StatCard
            icon="verified"
            label="Required Attendance"
            value="75%"
            iconBg="bg-tertiary-fixed/60 text-tertiary"
            trend={`${ATTENDANCE_DATA.percent >= 75 ? 'Above threshold' : 'Below threshold'}`}
            trendUp={ATTENDANCE_DATA.percent >= 75}
          />
        </div>
      </div>
    </div>
  );
};

export default AttendancePage;