import { useState, useEffect, useCallback } from 'react';
import { facultyService } from '../services/facultyService.js';

export const useFacultyMonitoring = () => {
  const [monitoring, setMonitoring] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMonitoring = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await facultyService.getMonitoring();
      setMonitoring(data || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch monitoring data');
      setMonitoring([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMonitoring();
  }, [fetchMonitoring]);

  return { monitoring, loading, error, reload: fetchMonitoring };
};
