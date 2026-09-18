import { useState, useEffect, useCallback } from 'react';
import { assignmentService } from '../services/assignmentService.js';

export const useMyInternship = () => {
  const [assignment, setAssignment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAssignment = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await assignmentService.getMy();
      if (Array.isArray(data) && data.length > 0) {
        setAssignment(data[0]);
      } else {
        setAssignment(null);
      }
    } catch (err) {
      setError(err?.message || 'Failed to fetch internship details');
      setAssignment(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAssignment();
  }, [fetchAssignment]);

  const recordJoining = useCallback(async (joiningDate, letterUrl = null) => {
    if (!assignment) return;
    try {
      const updated = await assignmentService.recordJoining(assignment.id, {
        joining_date: joiningDate,
        joining_letter_url: letterUrl,
      });
      setAssignment(updated);
      return updated;
    } catch (err) {
      throw err;
    }
  }, [assignment]);

  return {
    assignment,
    loading,
    error,
    recordJoining,
    reload: fetchAssignment,
  };
};
