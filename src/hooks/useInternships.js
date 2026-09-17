import { useState, useEffect, useCallback } from 'react';
import { INTERNSHIPS_LIST } from '../data/mockData.js';

export const useInternships = () => {
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ search: '', location: '', remote: '' });

  useEffect(() => {
    // TODO: internshipService.getAll(filter)
    const t = setTimeout(() => { setInternships(INTERNSHIPS_LIST); setLoading(false); }, 450);
    return () => clearTimeout(t);
  }, []);

  const apply = useCallback(async (id) => {
    // TODO: internshipService.apply(id, {})
    await new Promise((r) => setTimeout(r, 600));
    return true;
  }, []);

  const filtered = internships.filter((i) => {
    if (filter.search && !i.title.toLowerCase().includes(filter.search.toLowerCase()) && !i.company.toLowerCase().includes(filter.search.toLowerCase())) return false;
    if (filter.location && i.location !== filter.location) return false;
    if (filter.remote === 'remote' && !i.remote) return false;
    if (filter.remote === 'onsite' && i.remote) return false;
    return true;
  });

  return { internships: filtered, loading, filter, setFilter, apply };
};
