import { useState, useEffect, useCallback } from 'react';
import { companyService } from '../services/companyService.js';

export const useCompanyProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await companyService.getProfile();
      setProfile(data);
    } catch (err) {
      setError(err?.message || 'Failed to fetch company profile');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const updateProfile = useCallback(async (data) => {
    setSaving(true);
    try {
      const updated = await companyService.updateProfile(data);
      setProfile(updated);
      return updated;
    } finally {
      setSaving(false);
    }
  }, []);

  return {
    profile,
    loading,
    error,
    saving,
    updateProfile,
    reload: fetchProfile,
  };
};
