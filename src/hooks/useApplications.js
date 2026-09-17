import { useState, useEffect } from 'react';
import { APPLICATIONS_LIST } from '../data/mockData.js';

export const useApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    // TODO: applicationService.getAll(studentId)
    const t = setTimeout(() => { setApplications(APPLICATIONS_LIST); setLoading(false); }, 450);
    return () => clearTimeout(t);
  }, []);

  const filtered = activeTab === 'all' ? applications : applications.filter((a) => a.status === activeTab);

  return { applications: filtered, allApplications: applications, loading, activeTab, setActiveTab };
};
