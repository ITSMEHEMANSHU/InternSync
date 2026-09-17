import { useState, useEffect, useCallback } from 'react';
import { TASKS_LIST } from '../data/mockData.js';

export const useTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: taskService.getAll(studentId)
    const t = setTimeout(() => { setTasks(TASKS_LIST); setLoading(false); }, 450);
    return () => clearTimeout(t);
  }, []);

  const updateStatus = useCallback(async (id, status) => {
    // TODO: taskService.updateStatus(id, status)
    await new Promise((r) => setTimeout(r, 400));
    setTasks((prev) => prev.map((t) => t.id === id ? { ...t, status } : t));
  }, []);

  const byStatus = (status) => tasks.filter((t) => t.status === status);

  return { tasks, loading, updateStatus, todo: byStatus('todo'), inprogress: byStatus('inprogress'), completed: byStatus('completed') };
};
