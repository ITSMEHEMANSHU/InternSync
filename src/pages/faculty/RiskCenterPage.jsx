import { useState } from 'react';
import { useToast } from '../../store/ToastContext.jsx';
import PageHeader from '../../components/weekly-reports/PageHeader.jsx';
import Tabs from '../../components/common/Tabs.jsx';
import RiskIndicator from '../../components/common/RiskIndicator.jsx';
import StatusBadge from '../../components/common/StatusBadge.jsx';
import { RISK_CASES } from '../../data/mockData.js';

const TABS = {
  HIGH: 'high',
  MEDIUM: 'medium',
  LOW: 'low',
};

const RiskCenterPage = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState(TABS.HIGH);

  const tabs = [
    { id: TABS.HIGH, label: 'High Risk', count: RISK_CASES.filter(r => r.risk === 'high').length },
    { id: TABS.MEDIUM, label: 'Medium Risk', count: RISK_CASES.filter(r => r.risk === 'medium').length },
    { id: TABS.LOW, label: 'Low Risk', count: RISK_CASES.filter(r => r.risk === 'low').length },
  ];

  const filteredCases = RISK_CASES.filter(risk => risk.risk === activeTab);

  const handleSendAlert = (id) => {
    toast.success('Alert sent to student');
  };

  const handleScheduleMeeting = (id) => {
    toast.info('Meeting scheduled with student');
  };

  const handleMarkResolved = (id) => {
    toast.success('Risk case marked as resolved');
  };

  return (
    <div className="flex flex-col w-full">
      <PageHeader
        title="Risk Center"
        breadcrumb="Risk Center"
        badge={<StatusBadge status="Active" />}
        actions={[
          { label: 'Export Report', primary: false },
        ]}
      />

      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCases.map((risk) => (
          <div key={risk.id} className="bg-surface-container-lowest rounded-xl shadow-sm p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface mb-1">{risk.studentName}</h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant">{risk.company || 'Not Placed'}</p>
              </div>
              <RiskIndicator level={risk.risk} factors={[]} />
            </div>

            <div className="mb-4">
              <p className="font-label-sm text-label-sm text-on-surface-variant mb-2">Risk Factors</p>
              <div className="flex flex-wrap gap-2">
                {risk.factors.map((factor, idx) => (
                  <span key={idx} className="px-2 py-1 bg-error-container/10 text-error font-label-sm text-label-sm rounded">
                    {factor}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between mb-4 p-3 bg-surface-container rounded-lg">
              <span className="font-label-sm text-label-sm text-on-surface-variant">Days Inactive</span>
              <span className="font-headline-sm text-headline-sm font-bold text-error">{risk.daysInactive}</span>
            </div>

            <div className="mb-4">
              <p className="font-label-sm text-label-sm text-on-surface-variant mb-1">Last Activity</p>
              <p className="font-body-md text-body-md text-on-surface">{risk.lastActivity}</p>
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
        ))}
      </div>

      {filteredCases.length === 0 && (
        <div className="bg-surface-container-lowest rounded-xl shadow-sm p-12 text-center">
          <span className="material-symbols-outlined text-6xl text-tertiary mb-4">check_circle</span>
          <p className="font-body-md text-body-md text-on-surface-variant">No {activeTab} risk cases</p>
        </div>
      )}
    </div>
  );
};

export default RiskCenterPage;