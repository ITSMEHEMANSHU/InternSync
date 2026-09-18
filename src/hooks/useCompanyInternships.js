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
      const updated = await companyService.submitForApproval(id);
      setInternships((prev) => prev.map((i) => (i.id === id ? updated : i)));
    } finally {
      setActing(null);
    }
  }, []);

  const remove = useCallback(async (id) => {
    setActing(id);
    try {
      await companyService.deleteInternship(id);
      setInternships((prev) => prev.filter((i) => i.id !== id));
    } finally {
      setActing(null);
    }
  }, []);

  const close = useCallback(async (id) => {
    setActing(id);
    try {
      const updated = await companyService.closeInternship(id);
      setInternships((prev) => prev.map((i) => (i.id === id ? updated : i)));
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