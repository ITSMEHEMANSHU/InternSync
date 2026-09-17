import { useState, useEffect, useCallback } from 'react';
import { internshipService } from '../services/api.js';

export const useInternships = () => {
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState({ search: '', location: '', remote: '' });

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);

    const params = {};
    if (filter.search) params.search = filter.search;
    if (filter.remote) params.remote = filter.remote === 'remote';

    internshipService
      .getAll(params)
      .then((data) => {
        if (!mounted) return;
        setInternships(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        if (!mounted) return;
        setError(err?.message || 'Failed to load internships');
        setInternships([]);
      })
      .finally(() => mounted && setLoading(false));

    return () => { mounted = false; };
  }, [filter.search, filter.remote]);

  const apply = useCallback(async (id, coverLetter = null) => {
    return internshipService.apply(id, { cover_letter: coverLetter });
  }, []);

  return { internships, loading, error, filter, setFilter, apply };
};