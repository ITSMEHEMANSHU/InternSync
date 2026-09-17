import { useState, useEffect } from 'react';
import { STUDENTS_LIST, FACULTY_KPIS } from '../data/mockData.js';

export const useFacultyStudents = () => {
  const [students, setStudents] = useState([]);
  const [kpis, setKpis] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [riskFilter, setRiskFilter] = useState('all');

  useEffect(() => {
    // TODO: facultyService.getStudents(facultyId)
    const t = setTimeout(() => { setStudents(STUDENTS_LIST); setKpis(FACULTY_KPIS); setLoading(false); }, 500);
    return () => clearTimeout(t);
  }, []);

  const filtered = students.filter((s) => {
    if (search && !s.name.toLowerCase().includes(search.toLowerCase())) return false;
    if (riskFilter !== 'all' && s.risk !== riskFilter) return false;
    return true;
  });

  return { students: filtered, kpis, loading, search, setSearch, riskFilter, setRiskFilter };
};
