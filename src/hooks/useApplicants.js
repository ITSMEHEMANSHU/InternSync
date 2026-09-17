import { useState, useEffect, useCallback } from 'react';
import { APPLICANTS_LIST } from '../data/mockData.js';

export const useApplicants = () => {
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [acting, setActing] = useState(null);

  useEffect(() => {
    // TODO: companyService.getApplicants(companyId)
    const t = setTimeout(() => { setApplicants(APPLICANTS_LIST); setLoading(false); }, 450);
    return () => clearTimeout(t);
  }, []);

  const updateStatus = useCallback(async (id, status) => {
    setActing(id);
    // TODO: companyService.updateApplicant(id, { status })
    await new Promise((r) => setTimeout(r, 700));
    setApplicants((prev) => prev.map((a) => a.id === id ? { ...a, status } : a));
    setActing(null);
    return true;
  }, []);

  return { applicants, loading, acting, updateStatus };
};
