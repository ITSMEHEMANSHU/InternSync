import { useState, useEffect, useCallback } from 'react';
import { adminService } from '../services/adminService.js';

export const useAdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [acting, setActing] = useState(null);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {};
      if (roleFilter !== 'all') params.role = roleFilter;
      if (statusFilter !== 'all') params.status = statusFilter;
      const data = await adminService.getUsers(params);
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err?.message || 'Failed to load users');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, [roleFilter, statusFilter]);

  useEffect(() => {
    load();
  }, [load]);

  const approve = useCallback(async (id) => {
    setActing(id);
    try {
      await adminService.approveUser(id);
      setUsers((prev) =>
        prev.map((u) => (u.id === id ? { ...u, status: 'active' } : u))
      );
    } finally {
      setActing(null);
    }
  }, []);

  const reject = useCallback(async (id) => {
    setActing(id);
    try {
      await adminService.rejectUser(id);
      setUsers((prev) =>
        prev.map((u) => (u.id === id ? { ...u, status: 'suspended' } : u))
      );
    } finally {
      setActing(null);
    }
  }, []);

  const filtered = users.filter((u) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      u.name?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q)
    );
  });

  return {
    users: filtered,
    allUsers: users,
    loading,
    error,
    acting,
    approve,
    reject,
    search,
    setSearch,
    roleFilter,
    setRoleFilter,
    statusFilter,
    setStatusFilter,
    reload: load,
  };
};