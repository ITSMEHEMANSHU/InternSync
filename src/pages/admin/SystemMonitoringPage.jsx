import { useEffect, useState } from 'react';
import { adminService } from '../../services/adminService.js';
import Skeleton from '../../components/common/Skeleton.jsx';
import StatCard from '../../components/common/StatCard.jsx';

const SystemMonitoringPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = (silent = false) => {
    if (!silent) setLoading(true);
    setError(null);
    adminService
      .getSystemMonitoring()
      .then((d) => setData(d))
      .catch((err) => setError(err?.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load(false);
    const id = setInterval(() => load(true), 30000);
    return () => clearInterval(id);
  }, []);

  if (loading && !data) return <Skeleton variant="card" count={4} />;
  if (error) return <div className="text-error p-4">Failed: {error}</div>;

  return (
    <div className="flex flex-col w-full gap-space-lg">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-headline-xl font-bold text-on-surface">System Monitoring</h1>
          <p className="font-body-md text-on-surface-variant mt-1">
            Live health of database and services — auto-refreshes every 30s
          </p>
        </div>
        <button
          onClick={load}
          className="px-4 py-2 rounded-lg bg-surface-container font-label-md font-semibold"
        >
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-space-md">
        <StatCard icon="cloud_done" label="API Status" value={data.status} iconBg="bg-tertiary-fixed/60 text-tertiary" />
        <StatCard icon="database" label="DB Connections" value={String(data.database.active_connections)} iconBg="bg-primary-fixed/60 text-primary" />
        <StatCard icon="group" label="Total Users" value={String(data.counts.users)} iconBg="bg-secondary-fixed/50 text-secondary" />
        <StatCard icon="send" label="Total Applications" value={String(data.counts.applications)} iconBg="bg-primary-fixed/60 text-primary" />
      </div>

      <div className="bg-surface-container-lowest rounded-xl shadow-sm p-space-lg">
        <h3 className="font-headline-sm font-bold text-on-surface mb-4">Database</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-surface-container rounded-lg">
            <p className="font-label-sm text-on-surface-variant mb-1">Version</p>
            <p className="font-body-md font-semibold text-on-surface">{data.database.version}</p>
          </div>
          <div className="p-4 bg-surface-container rounded-lg">
            <p className="font-label-sm text-on-surface-variant mb-1">Internships Tracked</p>
            <p className="font-body-md font-semibold text-on-surface">{data.counts.internships}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemMonitoringPage;