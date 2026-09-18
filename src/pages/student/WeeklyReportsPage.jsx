import { useWeeklyReports, TABS } from '../../hooks/useWeeklyReports.js';
import PageHeader from '../../components/weekly-reports/PageHeader.jsx';
import KpiRibbon from '../../components/weekly-reports/KpiRibbon.jsx';
import TabSwitcher from '../../components/weekly-reports/TabSwitcher.jsx';
import ActiveSubmission from '../../components/weekly-reports/ActiveSubmission.jsx';
import ReportsArchive from '../../components/weekly-reports/ReportsArchive.jsx';
import CompetencyIndex from '../../components/weekly-reports/CompetencyIndex.jsx';
import MentorGovernance from '../../components/weekly-reports/MentorGovernance.jsx';
import AicteGuidelines from '../../components/weekly-reports/AicteGuidelines.jsx';

const WeeklyReportsPage = () => {
  const {
    activeTab, setActiveTab,
    draftContent, setDraftContent,
    isSaving, isSubmitting,
    handleSaveDraft, handleSubmit,
    draft, reports, kpiMetrics, competencySkills,
  } = useWeeklyReports();

  return (
    <div className="flex flex-col w-full">
      <PageHeader
        weekNumber={draft.weekNumber}
        onExport={() => {}}
        onDraftNew={() => setActiveTab(TABS.ACTIVE)}
      />

      <KpiRibbon metrics={kpiMetrics} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-start">
        {/* Left main column */}
        <div className="lg:col-span-8 flex flex-col gap-space-lg">
          <TabSwitcher activeTab={activeTab} onTabChange={setActiveTab} />

          {activeTab === TABS.ACTIVE && (
            <ActiveSubmission
              draft={draft}
              draftContent={draftContent}
              setDraftContent={setDraftContent}
              isSaving={isSaving}
              isSubmitting={isSubmitting}
              onSave={handleSaveDraft}
              onSubmit={handleSubmit}
            />
          )}

          {activeTab === TABS.HISTORY && (
            <ReportsArchive reports={reports} />
          )}

          {activeTab === TABS.AI_AUDIT && (
            <div className="bg-surface-container-lowest rounded-xl shadow-sm p-space-lg">
              <div className="flex items-center gap-2 mb-4">
                <span className="material-symbols-outlined text-primary text-[22px]">psychology</span>
                <h2 className="font-headline-md text-headline-md font-bold text-on-surface">AI Competency Audit</h2>
              </div>
              <CompetencyIndex skills={competencySkills} />
            </div>
          )}
        </div>

        {/* Right context rail */}
        <div className="lg:col-span-4 flex flex-col gap-space-lg">
          <CompetencyIndex skills={competencySkills} />
          <MentorGovernance />
          <AicteGuidelines />
        </div>
      </div>
    </div>
  );
};

export default WeeklyReportsPage;
