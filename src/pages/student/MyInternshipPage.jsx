import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../constants/routes.js';
import Tabs from '../../components/common/Tabs.jsx';
import StatusBadge from '../../components/common/StatusBadge.jsx';

const TABS = [
  { id: 'overview', label: 'Overview', icon: 'dashboard' },
  { id: 'attendance', label: 'Attendance', icon: 'event_available' },
  { id: 'tasks', label: 'Tasks', icon: 'task_alt' },
  { id: 'reports', label: 'Reports', icon: 'description' },
];

const MyInternshipPage = () => {
  const [tab, setTab] = useState('overview');
  const navigate = useNavigate();

  return (
    <div className="flex flex-col w-full gap-space-lg">
      {/* Header */}
      <div className="p-space-lg bg-surface-container-lowest rounded-xl shadow-sm relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-secondary to-primary-container" />
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary-fixed flex items-center justify-center">
              <span className="material-symbols-outlined text-[24px] text-primary">business</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-headline-md text-headline-md font-bold text-on-surface">Zoho Corporation</h1>
                <StatusBadge status="active" />
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant">Backend Engineer Intern · Jun 2024 – Nov 2024</p>
              <p className="font-body-xs text-body-xs text-on-surface-variant mt-0.5">Mentor: Rajesh Iyer · Chennai, Tamil Nadu</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => navigate(ROUTES.STUDENT.ATTENDANCE)} className="px-3 py-2 rounded-lg bg-surface-container-low text-on-surface font-label-md text-label-md hover:bg-surface-container transition-all flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px]">event_available</span>
              Mark Attendance
            </button>
            <button onClick={() => navigate(ROUTES.STUDENT.WEEKLY_REPORTS)} className="px-3 py-2 rounded-lg bg-primary text-on-primary font-label-md text-label-md font-semibold hover:opacity-90 transition-all flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px]">description</span>
              Submit Report
            </button>
          </div>
        </div>
      </div>

      <Tabs tabs={TABS} activeTab={tab} onChange={setTab} />

      {tab === 'overview' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-space-md">
          {[
            { label: 'Attendance', value: '92%', icon: 'event_available', iconBg: 'bg-tertiary-fixed/60 text-tertiary' },
            { label: 'Tasks Completed', value: '2 / 5', icon: 'task_alt', iconBg: 'bg-primary-fixed/60 text-primary' },
            { label: 'Reports Filed', value: '7 / 8', icon: 'description', iconBg: 'bg-secondary-fixed/50 text-secondary' },
            { label: 'Overall Score', value: '9.4 / 10', icon: 'grade', iconBg: 'bg-tertiary-fixed/60 text-tertiary' },
          ].map((s) => (
            <div key={s.label} className="p-space-md bg-surface-container-lowest rounded-xl shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="font-label-md text-label-md text-on-surface-variant">{s.label}</span>
                <span className={`p-1.5 rounded-lg ${s.iconBg}`}><span className="material-symbols-outlined text-[18px]">{s.icon}</span></span>
              </div>
              <span className="font-numeric-metric text-numeric-metric text-on-surface">{s.value}</span>
            </div>
          ))}
        </div>
      )}

      {tab === 'attendance' && (
        <div className="bg-surface-container-lowest rounded-xl shadow-sm p-space-lg text-center">
          <p className="font-body-md text-body-md text-on-surface-variant mb-4">View full attendance calendar</p>
          <button onClick={() => navigate(ROUTES.STUDENT.ATTENDANCE)} className="px-4 py-2 rounded-lg bg-primary text-on-primary font-label-md text-label-md font-semibold hover:opacity-90 transition-all">
            Go to Attendance Page
          </button>
        </div>
      )}

      {tab === 'tasks' && (
        <div className="bg-surface-container-lowest rounded-xl shadow-sm p-space-lg text-center">
          <p className="font-body-md text-body-md text-on-surface-variant mb-4">View and manage your tasks</p>
          <button onClick={() => navigate(ROUTES.STUDENT.TASKS)} className="px-4 py-2 rounded-lg bg-primary text-on-primary font-label-md text-label-md font-semibold hover:opacity-90 transition-all">
            Go to Tasks Page
          </button>
        </div>
      )}

      {tab === 'reports' && (
        <div className="bg-surface-container-lowest rounded-xl shadow-sm p-space-lg text-center">
          <p className="font-body-md text-body-md text-on-surface-variant mb-4">Submit and view weekly reports</p>
          <button onClick={() => navigate(ROUTES.STUDENT.WEEKLY_REPORTS)} className="px-4 py-2 rounded-lg bg-primary text-on-primary font-label-md text-label-md font-semibold hover:opacity-90 transition-all">
            Go to Reports Page
          </button>
        </div>
      )}
    </div>
  );
};

export default MyInternshipPage;
