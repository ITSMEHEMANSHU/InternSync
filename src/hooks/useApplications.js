import { useState, useEffect } from 'react';
import { applicationService } from '../services/api.js';

export const useApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);

    applicationService
      .getMyApplications()
      .then((data) => {
        if (!mounted) return;
        setApplications(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        if (!mounted) return;
        setError(err?.message || 'Failed to load applications');
        setApplications([]);
      })
      .finally(() => mounted && setLoading(false));

    return () => { mounted = false; };
  }, []);

  const filtered =
    activeTab === 'all'
      ? applications
      : applications.filter((a) => a.status === activeTab);

  return {
    applications: filtered,
    allApplications: applications,
    loading,
    error,
    activeTab,
    setActiveTab,
  };
};