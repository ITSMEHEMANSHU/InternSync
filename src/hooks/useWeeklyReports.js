import { useState, useEffect, useCallback } from 'react';
import { reportService } from '../services/reportService.js';
import { ACTIVE_DRAFT, EVALUATED_REPORTS, KPI_METRICS, COMPETENCY_SKILLS } from '../constants/mockData';

const TABS = {
  ACTIVE: 'active',
  HISTORY: 'history',
  AI_AUDIT: 'ai-audit',
};

export { TABS };

export const useWeeklyReports = () => {
  const [activeTab, setActiveTab] = useState(TABS.ACTIVE);
  const [draftContent, setDraftContent] = useState(ACTIVE_DRAFT.content);
  const [isSaving, setIsSaving] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reports, setReports] = useState(EVALUATED_REPORTS);
  const [activeReport, setActiveReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchReports = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await reportService.getMy();
      if (Array.isArray(data) && data.length > 0) {
        setReports(data);
        const draft = data.find((r) => r.status === 'draft') || data[0];
        setActiveReport(draft);
        if (draft?.summary) {
          setDraftContent(draft.summary);
        }
      }
    } catch (err) {
      setError(err?.message || 'Failed to fetch weekly reports');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  const handleSaveDraft = useCallback(async () => {
    setIsSaving(true);
    let saved;
    try {
      saved = await reportService.saveDraft({
        week_number: activeReport?.week_number || 1,
        summary: draftContent,
        hours_logged: 40,
      });
      if (saved) {
        setActiveReport(saved);
      }
    } catch {
      /* fallback */
    }
    setIsSaving(false);
    return saved;
  }, [activeReport, draftContent]);

  const handleSubmit = useCallback(async () => {
    setIsSubmitting(true);
    let result;
    try {
      const reportId = activeReport?.id;
      if (reportId) {
        result = await reportService.submit(reportId);
      }
    } catch {
      /* fallback */
    }
    setIsSubmitting(false);
    return result;
  }, [activeReport]);

  return {
    activeTab,
    setActiveTab,
    draftContent,
    setDraftContent,
    isSaving,
    isSubmitting,
    handleSaveDraft,
    handleSubmit,
    loading,
    error,
    reload: fetchReports,
    draft: activeReport || ACTIVE_DRAFT,
    reports,
    kpiMetrics: KPI_METRICS,
    competencySkills: COMPETENCY_SKILLS,
  };
};
