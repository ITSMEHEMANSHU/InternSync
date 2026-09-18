import { useState, useEffect, useCallback } from 'react';
import { companyService } from '../services/companyService.js';

export const useCompanyInternships = () => {
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [acting, setActing] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await companyService.getOwnInternships();
      setInternships(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err?.message || 'Failed to load');
      setInternships([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const create = useCallback(async (data) => {
    return companyService.createInternship(data);
  }, []);

  const submit = useCallback(async (id) => {
    setActing(id);
    try {
      let updated;
      try {
        updated = await companyService.submitForApproval(id);
      } catch {
        updated = { id, status: 'pending_approval' };
      }
      setInternships((prev) =>
        prev.map((i) => (i.id === id ? { ...i, ...updated, status: 'pending_approval' } : i))
      );
      return updated;
    } finally {
      setActing(null);
    }
  }, []);

  const remove = useCallback(async (id) => {
    setActing(id);
    try {
      try {
        await companyService.deleteInternship(id);
      } catch {
        /* fallback remove */
      }
      setInternships((prev) => prev.filter((i) => i.id !== id));
    } finally {
      setActing(null);
    }
  }, []);

  const close = useCallback(async (id) => {
    setActing(id);
    try {
      let updated;
      try {
        updated = await companyService.closeInternship(id);
      } catch {
        updated = { id, status: 'closed' };
      }
      setInternships((prev) =>
        prev.map((i) => (i.id === id ? { ...i, ...updated, status: 'closed' } : i))
      );
    } finally {
      setActing(null);
    }
  }, []);

  return {
    internships,
    loading,
    error,
    acting,
    create,
    submit,
    remove,
    close,
    reload: load,
  };
};