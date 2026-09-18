import { useState } from 'react';
import { useToast } from '../../store/ToastContext.jsx';
import PageHeader from '../../components/weekly-reports/PageHeader.jsx';
import Tabs from '../../components/common/Tabs.jsx';
import RiskIndicator from '../../components/common/RiskIndicator.jsx';
import StatusBadge from '../../components/common/StatusBadge.jsx';
import { useRiskCenter } from '../../hooks/useRiskCenter.js';

const TABS = {
  HIGH: 'high',
  MEDIUM: 'medium',
  LOW: 'low',
};

const RiskCenterPage = () => {
  const { toast } = useToast();
  const { cases, loading, resolve, reload } = useRiskCenter();
  const [activeTab, setActiveTab] = useState(TABS.HIGH);

  const getRiskLevel = (c) => c.risk_level || c.risk || 'medium';

  const highCases = cases.filter(c => getRiskLevel(c) === 'high');
  const mediumCases = cases.filter(c => getRiskLevel(c) === 'medium');
  const lowCases = cases.filter(c => getRiskLevel(c) === 'low');

  const tabs = [
    { id: TABS.HIGH, label: 'High Risk', count: highCases.length },
    { id: TABS.MEDIUM, label: 'Medium Risk', count: mediumCases.length },
    { id: TABS.LOW, label: 'Low Risk', count: lowCases.length },
  ];

  const filteredCases = cases.filter(c => getRiskLevel(c) === activeTab);

  const handleSendAlert = () => {
    toast.success('Alert sent to student');
  };

  const handleScheduleMeeting = () => {
    toast.info('Meeting scheduled with student');
  };

  const handleMarkResolved = async (id) => {
    await resolve(id);
    toast.success('Risk case marked as resolved');
  };

  return (
    <div className="flex flex-col w-full">
      <PageHeader
        title="Risk Center"
        breadcrumb="Risk Center"
        badge={<StatusBadge status="Active" />}
        actions={[
          { label: 'Export Report', primary: false, onClick: reload },
        ]}
      />

      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {loading ? (
        <div className="p-8 text-center text-on-surface-variant font-body-md">
          Loading Risk Center Cases...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCases.map((risk) => {
            const studentName = risk.student_name || risk.studentName || 'Student';
            const company = risk.company || 'Assigned Internship';
            const riskLevel = getRiskLevel(risk);
            const factors = risk.issue ? [risk.issue] : (risk.factors || ['Attendance drop']);

            return (
              <div key={risk.id} className="bg-surface-container-lowest rounded-xl shadow-sm p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface mb-1">{studentName}</h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">{company}</p>
                  </div>
                  <RiskIndicator level={riskLevel} factors={[]} />
                </div>

                <div className="mb-4">
                  <p className="font-label-sm text-label-sm text-on-surface-variant mb-2">Risk Factors</p>
                  <div className="flex flex-wrap gap-2">
                    {factors.map((factor, idx) => (
                      <span key={idx} className="px-2 py-1 bg-error-container/10 text-error font-label-sm text-label-sm rounded">
                        {factor}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between mb-4 p-3 bg-surface-container rounded-lg">
                  <span className="font-label-sm text-label-sm text-on-surface-variant">Attendance Status</span>
                  <span className="font-headline-sm text-headline-sm font-bold text-error">{risk.attendance || '70%'}</span>
                </div>

                <div className="mb-4">
                  <p className="font-label-sm text-label-sm text-on-surface-variant mb-1">Status / Issue</p>
                  <p className="font-body-md text-body-md text-on-surface">{risk.issue || 'Requires review'}</p>
                </div>

                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => handleSendAlert(risk.id)}
                    className="w-full px-4 py-2 bg-error-container text-on-error-container font-label-sm text-label-sm font-semibold rounded-lg hover:bg-error-container/80"
                  >
                    Send Alert
                  </button>
                  <button
                    onClick={() => handleScheduleMeeting(risk.id)}
                    className="w-full px-4 py-2 bg-secondary-container text-on-secondary-container font-label-sm text-label-sm font-semibold rounded-lg hover:bg-secondary-container/80"
                  >
                    Schedule Meeting
                  </button>
                  <button
                    onClick={() => handleMarkResolved(risk.id)}
                    className="w-full px-4 py-2 bg-tertiary-container text-on-tertiary-container font-label-sm text-label-sm font-semibold rounded-lg hover:bg-tertiary-container/80"
                  >
                    Mark Resolved
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {!loading && filteredCases.length === 0 && (
        <div className="bg-surface-container-lowest rounded-xl shadow-sm p-12 text-center">
          <span className="material-symbols-outlined text-6xl text-tertiary mb-4">check_circle</span>
          <p className="font-body-md text-body-md text-on-surface-variant">No {activeTab} risk cases</p>
        </div>
      )}
    </div>
  );
};

export default RiskCenterPage;