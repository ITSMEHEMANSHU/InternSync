import { useState, useEffect, useCallback } from 'react';
import { facultyService } from '../services/facultyService.js';
import { STUDENTS_LIST, FACULTY_KPIS } from '../data/mockData.js';

export const useFacultyStudents = () => {
  const [students, setStudents] = useState(STUDENTS_LIST);
  const [kpis, setKpis] = useState(FACULTY_KPIS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [riskFilter, setRiskFilter] = useState('all');

  const fetchStudents = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await facultyService.getStudents(search);
      if (Array.isArray(data) && data.length > 0) {
        setStudents(data);
      }
    } catch (err) {
      setError(err?.message || 'Failed to fetch students');
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  const filtered = students.filter((s) => {
    if (search && !s.name?.toLowerCase().includes(search.toLowerCase())) return false;
    if (riskFilter !== 'all' && s.risk !== riskFilter) return false;
    return true;
  });

  return {
    students: filtered,
    kpis,
    loading,
    error,
    search,
    setSearch,
    riskFilter,
    setRiskFilter,
    reload: fetchStudents,
  };
};
