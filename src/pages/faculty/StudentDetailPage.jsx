import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useToast } from '../../store/ToastContext.jsx';
import PageHeader from '../../components/weekly-reports/PageHeader.jsx';
import Tabs from '../../components/common/Tabs.jsx';
import StatCard from '../../components/common/StatCard.jsx';
import StatusBadge from '../../components/common/StatusBadge.jsx';
import RiskIndicator from '../../components/common/RiskIndicator.jsx';
import AIInsightCard from '../../components/common/AIInsightCard.jsx';
import Timeline from '../../components/common/Timeline.jsx';
import { STUDENTS_LIST } from '../../data/mockData.js';

const TABS = {
  OVERVIEW: 'overview',
  ATTENDANCE: 'attendance',
  REPORTS: 'reports',
  TASKS: 'tasks',
  RISK: 'risk',
};

const StudentDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState(TABS.OVERVIEW);

  const student = STUDENTS_LIST.find(s => s.id === id) || STUDENTS_LIST[0];

  const tabs = [
    { id: TABS.OVERVIEW, label: 'Overview' },
    { id: TABS.ATTENDANCE, label: 'Attendance' },
    { id: TABS.REPORTS, label: 'Reports' },
    { id: TABS.TASKS, label: 'Tasks' },
    { id: TABS.RISK, label: 'Risk Analysis' },
  ];

  const handleAddIntervention = () => {
    toast.success('Intervention note added successfully');
  };

  return (
    <div className="flex flex-col w-full">
      <PageHeader
        title={student.name}
        breadcrumb={`Students / ${student.name}`}
        badge={<StatusBadge status={student.status} />}
        actions={[
          { label: 'Back', onClick: () => navigate(-1) },
          { label: 'Send Alert', onClick: () => toast.info('Alert sent to student') },
        ]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left main column */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

          {activeTab === TABS.OVERVIEW && (
            <div className="bg-surface-container-lowest rounded-xl shadow-sm p-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div>
                  <p className="font-label-sm text-label-sm text-on-surface-variant mb-1">Branch</p>
                  <p className="font-body-md text-body-md font-semibold text-on-surface">{student.branch}</p>
                </div>
                <div>
                  <p className="font-label-sm text-label-sm text-on-surface-variant mb-1">Semester</p>
                  <p className="font-body-md text-body-md font-semibold text-on-surface">{student.semester}</p>
                </div>
                <div>
                  <p className="font-label-sm text-label-sm text-on-surface-variant mb-1">Company</p>
                  <p className="font-body-md text-body-md font-semibold text-on-surface">{student.company || 'Not Placed'}</p>
                </div>
                <div>
                  <p className="font-label-sm text-label-sm text-on-surface-variant mb-1">Mentor</p>
                  <p className="font-body-md text-body-md font-semibold text-on-surface">{student.mentor || 'Not Assigned'}</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 bg-surface-container rounded-lg text-center">
                  <p className="font-headline-sm text-headline-sm font-bold text-primary">{student.progress}%</p>
                  <p className="font-label-sm text-label-sm text-on-surface-variant">Progress</p>
                </div>
                <div className="p-4 bg-surface-container rounded-lg text-center">
                  <p className="font-headline-sm text-headline-sm font-bold text-tertiary">{student.attendance}%</p>
                  <p className="font-label-sm text-label-sm text-on-surface-variant">Attendance</p>
                </div>
                <div className="p-4 bg-surface-container rounded-lg text-center">
                  <RiskIndicator level={student.risk} factors={[]} />
                </div>
              </div>
            </div>
          )}

          {activeTab === TABS.RISK && (
            <div className="space-y-4">
              <AIInsightCard
                title="Risk Analysis"
                insight={`Student shows ${student.risk} risk level based on attendance patterns and report submission frequency. ${student.risk === 'high' ? 'Immediate intervention recommended.' : 'Continue monitoring.'}`}
              />
              <div className="bg-surface-container-lowest rounded-xl shadow-sm p-6">
                <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface mb-4">Add Intervention Note</h3>
                <textarea
                  rows={4}
                  placeholder="Describe the intervention steps taken..."
                  className="w-full px-4 py-3 rounded-lg border border-outline-variant bg-surface-container text-on-surface focus:outline-none focus:ring-2 focus:ring-primary resize-none mb-4"
                />
                <button
                  onClick={handleAddIntervention}
                  className="px-4 py-2 bg-primary text-on-primary font-label-md text-label-md font-semibold rounded-lg hover:bg-primary/90"
                >
                  Add Note
                </button>
              </div>
              <div className="bg-surface-container-lowest rounded-xl shadow-sm p-6">
                <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface mb-4">Intervention Timeline</h3>
                <Timeline
                  steps={[
                    { label: 'Risk Flagged', status: 'completed', date: '2024-11-01', icon: 'warning' },
                    { label: 'First Contact', status: 'completed', date: '2024-11-03', icon: 'call' },
                    { label: 'Mentor Meeting', status: 'pending', date: null, icon: 'groups' },
                    { label: 'Resolution', status: 'pending', date: null, icon: 'check_circle' },
                  ]}
                />
              </div>
            </div>
          )}

          {activeTab !== TABS.OVERVIEW && activeTab !== TABS.RISK && (
            <div className="bg-surface-container-lowest rounded-xl shadow-sm p-6">
              <div className="text-center py-12">
                <span className="material-symbols-outlined text-6xl text-on-surface-variant/30 mb-4">construction</span>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} view coming soon
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Right sidebar */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <StatCard
            icon="schedule"
            label="Last Report"
            value={student.lastReport || 'N/A'}
            iconBg="bg-secondary-fixed/50 text-secondary"
            trend="Submission date"
          />
          <StatCard
            icon="badge"
            label="Current Role"
            value={student.role || 'Not Assigned'}
            iconBg="bg-tertiary-fixed/60 text-tertiary"
            trend="Internship position"
          />
        </div>
      </div>
    </div>
  );
};

export default StudentDetailPage;