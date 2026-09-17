import { useState, useEffect, useCallback } from 'react';
import { facultyService } from '../services/api.js';

export const useFacultyApprovals = () => {
  const [approvals, setApprovals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [acting, setActing] = useState(null);

  const load = useCallback(() => {
    setLoading(true);
    setError(null);
    facultyService
      .getApprovals()
      .then((data) => setApprovals(Array.isArray(data) ? data : []))
      .catch((err) => {
        setError(err?.message || 'Failed to load approvals');
        setApprovals([]);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const approve = useCallback(async (id) => {
    setActing(id);
    try {
      await facultyService.approve(id);
      setApprovals((prev) => prev.filter((a) => a.id !== id));
    } finally {
      setActing(null);
    }
  }, []);

  const reject = useCallback(async (id, reason) => {
    setActing(id);
    try {
      await facultyService.reject(id, reason);
      setApprovals((prev) => prev.filter((a) => a.id !== id));
    } finally {
      setActing(null);
    }
  }, []);

  return { approvals, loading, error, acting, approve, reject, reload: load };
};