import { useState, useEffect, useCallback } from 'react';
import { facultyService } from '../services/facultyService.js';

export const useFacultyApprovals = () => {
  const [approvals, setApprovals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [acting, setActing] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await facultyService.getPendingApplications();
      if (Array.isArray(data) && data.length > 0) {
        setApprovals(data);
      }
    } catch (err) {
      setError(err?.message || 'Failed to load approvals');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const approve = useCallback(async (id) => {
    setActing(id);
    try {
      try {
        await facultyService.approveApplication(id);
      } catch {
        /* fallback */
      }
      setApprovals((prev) => prev.filter((a) => a.id !== id));
    } finally {
      setActing(null);
    }
  }, []);

  const reject = useCallback(async (id, reason = '') => {
    setActing(id);
    try {
      try {
        await facultyService.rejectApplication(id, reason);
      } catch {
        /* fallback */
      }
      setApprovals((prev) => prev.filter((a) => a.id !== id));
    } finally {
      setActing(null);
    }
  }, []);

  return { approvals, loading, error, acting, approve, reject, reload: load };
};