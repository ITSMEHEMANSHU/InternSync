import { useState, useEffect, useCallback } from 'react';
import { companyService } from '../services/companyService.js';

export const useCompanyApplicants = (statusFilter = 'all') => {
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actingId, setActingId] = useState(null);

  const fetchApplicants = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await companyService.getApplicants({ status: statusFilter });
      setApplicants(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err?.message || 'Failed to load applicants');
      setApplicants([]);
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    fetchApplicants();
  }, [fetchApplicants]);

  const updateStatus = useCallback(async (id, status, extra = {}) => {
    setActingId(id);
    try {
      const updated = await companyService.updateApplicantStatus(id, {
        status,
        ...extra,
      });
      setApplicants((prev) =>
        prev.map((app) => (app.id === id ? updated : app))
      );
      return updated;
    } finally {
      setActingId(null);
    }
  }, []);

  return {
    applicants,
    loading,
    error,
    actingId,
    updateStatus,
    reload: fetchApplicants,
  };
};
