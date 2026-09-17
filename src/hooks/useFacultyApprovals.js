import { useState, useEffect, useCallback } from 'react';
import { APPROVALS_LIST } from '../data/mockData.js';

export const useFacultyApprovals = () => {
  const [approvals, setApprovals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [acting, setActing] = useState(null);

  useEffect(() => {
    // TODO: facultyService.getApprovals(facultyId)
    const t = setTimeout(() => { setApprovals(APPROVALS_LIST); setLoading(false); }, 450);
    return () => clearTimeout(t);
  }, []);

  const approve = useCallback(async (id) => {
    setActing(id);
    // TODO: facultyService.approve(id, {})
    await new Promise((r) => setTimeout(r, 700));
    setApprovals((prev) => prev.map((a) => a.id === id ? { ...a, status: 'approved' } : a));
    setActing(null);
    return true;
  }, []);

  const reject = useCallback(async (id) => {
    setActing(id);
    // TODO: facultyService.reject(id, {})
    await new Promise((r) => setTimeout(r, 700));
    setApprovals((prev) => prev.map((a) => a.id === id ? { ...a, status: 'rejected' } : a));
    setActing(null);
    return true;
  }, []);

  return { approvals, loading, acting, approve, reject };
};
