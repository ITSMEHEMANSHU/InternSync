import { useState, useEffect, useCallback } from 'react';
import { attendanceService } from '../services/attendanceService.js';
import { ATTENDANCE_DATA } from '../data/mockData.js';

export const useAttendance = (month = '') => {
  const [data, setData] = useState(ATTENDANCE_DATA);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [marking, setMarking] = useState(false);

  const fetchAttendance = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await attendanceService.getMy(month);
      if (Array.isArray(res) && res.length > 0) {
        setRecords(res);
      }
    } catch (err) {
      setError(err?.message || 'Failed to fetch attendance');
    } finally {
      setLoading(false);
    }
  }, [month]);

  useEffect(() => {
    fetchAttendance();
  }, [fetchAttendance]);

  const markToday = useCallback(
    async (status = 'present', hours = 8.0, notes = '') => {
      setMarking(true);
      const todayStr = new Date().toISOString().split('T')[0];
      let newRecord;
      try {
        newRecord = await attendanceService.markToday({
          date: todayStr,
          status,
          hours,
          notes,
        });
      } catch {
        newRecord = { id: `att-${Date.now()}`, date: todayStr, status, hours, notes };
      }
      setRecords((prev) => [newRecord, ...prev.filter((r) => r.date !== todayStr)]);
      setMarking(false);
      return newRecord;
    },
    []
  );

  return {
    data,
    records,
    loading,
    error,
    marking,
    markToday,
    reload: fetchAttendance,
  };
};
