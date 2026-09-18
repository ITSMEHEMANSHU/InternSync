import { useState, useEffect, useCallback } from 'react';
import { taskService } from '../services/taskService.js';
import { TASKS_LIST } from '../data/mockData.js';

export const useTasks = () => {
  const [tasks, setTasks] = useState(TASKS_LIST);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await taskService.getMy();
      if (Array.isArray(data) && data.length > 0) {
        setTasks(data);
      }
    } catch (err) {
      setError(err?.message || 'Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const updateStatus = useCallback(async (id, status) => {
    try {
      await taskService.updateStatus(id, status);
    } catch {
      /* fallback */
    }
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status } : t))
    );
  }, []);

  const addLog = useCallback(async (taskId, logText, hoursSpent) => {
    let log;
    try {
      log = await taskService.addLog(taskId, { log_text: logText, hours_spent: hoursSpent });
    } catch {
      log = { id: `log-${Date.now()}`, task_id: taskId, log_text: logText, hours_spent: hoursSpent, created_at: new Date().toISOString() };
    }
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId
          ? { ...t, logs: [log, ...(t.logs || [])] }
          : t
      )
    );
    return log;
  }, []);

  const byStatus = (status) => tasks.filter((t) => t.status === status);

  return {
    tasks,
    loading,
    error,
    updateStatus,
    addLog,
    reload: fetchTasks,
    todo: byStatus('todo'),
    inprogress: byStatus('inprogress'),
    completed: byStatus('completed'),
  };
};
