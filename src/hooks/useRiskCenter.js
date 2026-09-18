import { useState, useEffect, useCallback } from 'react';
import { facultyService } from '../services/facultyService.js';

export const useRiskCenter = () => {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCases = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await facultyService.getRiskCases();
      setCases(data || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch risk cases');
      setCases([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCases();
  }, [fetchCases]);

  const resolve = useCallback(async (id) => {
    setCases((prev) => prev.filter((c) => c.id !== id));
    return true;
  }, []);

  const byRisk = (level) => cases.filter((c) => c.risk === level);

  return { cases, loading, error, reload: fetchCases, resolve, high: byRisk('high'), medium: byRisk('medium'), low: byRisk('low') };
};

