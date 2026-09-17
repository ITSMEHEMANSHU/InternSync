import { useState, useEffect } from 'react';
import { USERS_LIST, ADMIN_KPIS } from '../data/mockData.js';

export const useAdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [kpis, setKpis] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  useEffect(() => {
    // TODO: adminService.getUsers({})
    const t = setTimeout(() => { setUsers(USERS_LIST); setKpis(ADMIN_KPIS); setLoading(false); }, 450);
    return () => clearTimeout(t);
  }, []);

  const filtered = users.filter((u) => {
    if (search && !u.name.toLowerCase().includes(search.toLowerCase()) && !u.email.toLowerCase().includes(search.toLowerCase())) return false;
    if (roleFilter !== 'all' && u.role !== roleFilter) return false;
    return true;
  });

  return { users: filtered, kpis, loading, search, setSearch, roleFilter, setRoleFilter };
};
