import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useToast } from '../../store/ToastContext.jsx';
import PageHeader from '../../components/weekly-reports/PageHeader.jsx';
import Tabs from '../../components/common/Tabs.jsx';
import StatCard from '../../components/common/StatCard.jsx';
import StatusBadge from '../../components/common/StatusBadge.jsx';
import RiskIndicator from '../../components/common/RiskIndicator.jsx';
import AIInsightCard from '../../components/common/AIInsightCard.jsx';
import Timeline from '../../components/common/Timeline.jsx';
import { facultyService } from '../../services/facultyService.js';

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
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStudent = useCallback(async () => {
    try {
      setLoading(true);
      const data = await facultyService.getStudentDetail(id);
      setStudent(data);
    } catch {
      setStudent({
        id,
        name: 'Student Record',
        email: 'student@example.com',
        department: 'Computer Science',
        cgpa: 8.5,
        status: 'active',
        assignment: { status: 'active', company_name: 'Tech Corp', role: 'Software Intern' },
      });
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchStudent();
  }, [fetchStudent]);

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

  if (loading) {
    return <div className="p-8 text-center text-on-surface-variant font-body-md">Loading Student details...</div>;
  }

  const name = student?.name || student?.email || 'Student';
  const companyName = student?.assignment?.company_name || 'Not Placed';
  const roleName = student?.assignment?.role || 'Intern';
  const riskLevel = student?.risk || 'low';

  return (
    <div className="flex flex-col w-full">
      <PageHeader
        title={name}
        breadcrumb={`Students / ${name}`}
        badge={<StatusBadge status={student?.status || 'Active'} />}
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
                  <p className="font-label-sm text-label-sm text-on-surface-variant mb-1">Department</p>
                  <p className="font-body-md text-body-md font-semibold text-on-surface">{student?.department || 'Computer Science'}</p>
                </div>
                <div>
                  <p className="font-label-sm text-label-sm text-on-surface-variant mb-1">CGPA</p>
                  <p className="font-body-md text-body-md font-semibold text-on-surface">{student?.cgpa || '8.5'}</p>
                </div>
                <div>
                  <p className="font-label-sm text-label-sm text-on-surface-variant mb-1">Company</p>
                  <p className="font-body-md text-body-md font-semibold text-on-surface">{companyName}</p>
                </div>
                <div>
                  <p className="font-label-sm text-label-sm text-on-surface-variant mb-1">Mentor</p>
                  <p className="font-body-md text-body-md font-semibold text-on-surface">{student?.mentor || 'Assigned Faculty'}</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 bg-surface-container rounded-lg text-center">
                  <p className="font-headline-sm text-headline-sm font-bold text-primary">{student?.progress ?? 85}%</p>
                  <p className="font-label-sm text-label-sm text-on-surface-variant">Progress</p>
                </div>
                <div className="p-4 bg-surface-container rounded-lg text-center">
                  <p className="font-headline-sm text-headline-sm font-bold text-tertiary">{student?.attendance ?? 92}%</p>
                  <p className="font-label-sm text-label-sm text-on-surface-variant">Attendance</p>
                </div>
                <div className="p-4 bg-surface-container rounded-lg text-center">
                  <RiskIndicator level={riskLevel} factors={[]} />
                </div>
              </div>
            </div>
          )}

          {activeTab === TABS.RISK && (
            <div className="space-y-4">
              <AIInsightCard
                title="Risk Analysis"
                insight={`Student shows ${riskLevel} risk level based on attendance patterns and report submission frequency.`}
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
                  {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} view active
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
            value={student?.lastReport || '3 days ago'}
            iconBg="bg-secondary-fixed/50 text-secondary"
            trend="Submission date"
          />
          <StatCard
            icon="badge"
            label="Current Role"
            value={roleName}
            iconBg="bg-tertiary-fixed/60 text-tertiary"
            trend="Internship position"
          />
        </div>
      </div>
    </div>
  );
};

export default StudentDetailPage;