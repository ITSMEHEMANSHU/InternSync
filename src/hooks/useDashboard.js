import { useState, useEffect } from 'react';
import { STUDENT_KPIS, INTERNSHIPS_LIST, NOTIFICATIONS_LIST, ATTENDANCE_DATA } from '../data/mockData.js';

export const useDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  useEffect(() => {
    // TODO: replace with studentService.getKpiMetrics(studentId)
    const t = setTimeout(() => {
      setData({ kpis: STUDENT_KPIS, topMatches: INTERNSHIPS_LIST.slice(0, 3), notifications: NOTIFICATIONS_LIST.slice(0, 3), attendance: ATTENDANCE_DATA });
      setLoading(false);
    }, 500);
    return () => clearTimeout(t);
  }, []);

  return { data, loading, error: null };
};
