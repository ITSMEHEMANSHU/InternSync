import { useState } from 'react';
import PageHeader from '../../components/weekly-reports/PageHeader.jsx';
import { POLICIES } from '../../data/mockData.js';
import { useToast } from '../../store/ToastContext.jsx';

const AdminPoliciesPage = () => {
  const { toast } = useToast();
  const [policies, setPolicies] = useState(POLICIES);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = (sectionName) => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast.success(`${sectionName} policy settings saved successfully.`);
    }, 500);
  };

  return (
    <div className="flex flex-col w-full space-y-6">
      <PageHeader
        title="Institutional Policies & Thresholds"
        breadcrumb="Admin / Policies"
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Attendance & Compliance Policy */}
        <div className="bg-surface-container-lowest rounded-xl shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-surface-container-high pb-3">
            <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">Attendance & Compliance</h3>
            <span className="material-symbols-outlined text-primary">fact_check</span>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between font-label-md text-label-md font-semibold text-on-surface mb-1">
                <span>Minimum Required Attendance (%)</span>
                <span className="text-primary font-bold">{policies.minAttendance}%</span>
              </div>
              <input
                type="range"
                min="60"
                max="90"
                value={policies.minAttendance}
                onChange={(e) => setPolicies({ ...policies, minAttendance: Number(e.target.value) })}
                className="w-full h-2 bg-surface-container-high rounded-lg cursor-pointer accent-primary"
              />
            </div>

            <div>
              <div className="flex justify-between font-label-md text-label-md font-semibold text-on-surface mb-1">
                <span>Max Allowed Consecutive Late Reports</span>
                <span className="text-primary font-bold">{policies.maxLateReports}</span>
              </div>
              <input
                type="number"
                min="1"
                max="5"
                value={policies.maxLateReports}
                onChange={(e) => setPolicies({ ...policies, maxLateReports: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-surface-container rounded-lg font-body-md text-body-md"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={() => handleSave('Attendance & Compliance')}
              disabled={isSaving}
              className="px-4 py-2 bg-primary text-on-primary font-label-md text-label-md font-bold rounded-lg hover:bg-primary/90"
            >
              Save Policy
            </button>
          </div>
        </div>

        {/* AI & Automation Thresholds */}
        <div className="bg-surface-container-lowest rounded-xl shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-surface-container-high pb-3">
            <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">AI Engine & Risk Engine Controls</h3>
            <span className="material-symbols-outlined text-amber-500">auto_awesome</span>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between font-label-md text-label-md font-semibold text-on-surface mb-1">
                <span>AI Skill Match Automation Level (%)</span>
                <span className="text-amber-600 font-bold">{policies.aiAutomationLevel}%</span>
              </div>
              <input
                type="range"
                min="50"
                max="100"
                value={policies.aiAutomationLevel}
                onChange={(e) => setPolicies({ ...policies, aiAutomationLevel: Number(e.target.value) })}
                className="w-full h-2 bg-surface-container-high rounded-lg cursor-pointer accent-amber-500"
              />
            </div>

            <div>
              <div className="flex justify-between font-label-md text-label-md font-semibold text-on-surface mb-1">
                <span>Auto-Approve Threshold Score</span>
                <span className="text-amber-600 font-bold">{policies.autoApproveThreshold}%</span>
              </div>
              <input
                type="range"
                min="80"
                max="98"
                value={policies.autoApproveThreshold}
                onChange={(e) => setPolicies({ ...policies, autoApproveThreshold: Number(e.target.value) })}
                className="w-full h-2 bg-surface-container-high rounded-lg cursor-pointer accent-amber-500"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={() => handleSave('AI & Automation')}
              disabled={isSaving}
              className="px-4 py-2 bg-primary text-on-primary font-label-md text-label-md font-bold rounded-lg hover:bg-primary/90"
            >
              Save AI Thresholds
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPoliciesPage;
