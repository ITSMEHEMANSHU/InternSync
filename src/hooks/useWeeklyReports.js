import { useState, useCallback } from 'react';
import { ACTIVE_DRAFT, EVALUATED_REPORTS, KPI_METRICS, COMPETENCY_SKILLS } from '../constants/mockData';

// TODO: swap mock data with real API calls:
// import { weeklyReportsService } from '../services/api';

const TABS = {
  ACTIVE: 'active',
  HISTORY: 'history',
  AI_AUDIT: 'ai-audit',
};

export { TABS };

export const useWeeklyReports = () => {
  const [activeTab, setActiveTab] = useState(TABS.ACTIVE);
  const [draftContent, setDraftContent] = useState(ACTIVE_DRAFT.content);
  const [isSaving, setIsSaving]     = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSaveDraft = useCallback(async () => {
    setIsSaving(true);
    // TODO: await weeklyReportsService.saveDraft(studentId, { content: draftContent });
    await new Promise((r) => setTimeout(r, 700));
    setIsSaving(false);
  }, [draftContent]);

  const handleSubmit = useCallback(async () => {
    setIsSubmitting(true);
    // TODO: await weeklyReportsService.submit(studentId, draft.weekNumber, { content: draftContent });
    await new Promise((r) => setTimeout(r, 1000));
    setIsSubmitting(false);
  }, [draftContent]);

  return {
    activeTab, setActiveTab,
    draftContent, setDraftContent,
    isSaving, isSubmitting,
    handleSaveDraft, handleSubmit,
    draft: ACTIVE_DRAFT,
    reports: EVALUATED_REPORTS,
    kpiMetrics: KPI_METRICS,
    competencySkills: COMPETENCY_SKILLS,
  };
};
