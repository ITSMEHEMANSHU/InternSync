import { useState, useEffect } from 'react';
import { AUDIT_LOGS } from '../data/mockData.js';

export const useAuditLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: adminService.getAuditLogs({})
    const t = setTimeout(() => { setLogs(AUDIT_LOGS); setLoading(false); }, 450);
    return () => clearTimeout(t);
  }, []);

  return { logs, loading };
};
