import { useState, useEffect, useCallback } from 'react';
import { RISK_CASES } from '../data/mockData.js';

export const useRiskCenter = () => {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: facultyService.getRiskCases(facultyId)
    const t = setTimeout(() => { setCases(RISK_CASES); setLoading(false); }, 450);
    return () => clearTimeout(t);
  }, []);

  const resolve = useCallback(async (id) => {
    await new Promise((r) => setTimeout(r, 600));
    setCases((prev) => prev.filter((c) => c.id !== id));
    return true;
  }, []);

  const byRisk = (level) => cases.filter((c) => c.risk === level);

  return { cases, loading, resolve, high: byRisk('high'), medium: byRisk('medium'), low: byRisk('low') };
};
