import { useState, useEffect, useCallback } from 'react';
import { ATTENDANCE_DATA } from '../data/mockData.js';

export const useAttendance = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [marking, setMarking] = useState(false);

  useEffect(() => {
    // TODO: attendanceService.getMonthly(studentId, currentMonth)
    const t = setTimeout(() => { setData(ATTENDANCE_DATA); setLoading(false); }, 450);
    return () => clearTimeout(t);
  }, []);

  const markToday = useCallback(async () => {
    setMarking(true);
    // TODO: attendanceService.markToday(studentId, { date: today, status: 'present' })
    await new Promise((r) => setTimeout(r, 700));
    setMarking(false);
    return true;
  }, []);

  return { data, loading, marking, markToday };
};
