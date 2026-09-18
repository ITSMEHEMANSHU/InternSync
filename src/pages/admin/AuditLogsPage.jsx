import { useEffect, useState } from 'react';
import { adminService } from '../../services/adminService.js';
import DataTable from '../../components/common/DataTable.jsx';
import EmptyState from '../../components/common/EmptyState.jsx';

const AuditLogsPage = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = () => {
    setLoading(true);
    setError(null);
    adminService
      .getAuditLogs(200)
      .then((d) => setLogs(Array.isArray(d) ? d : []))
      .catch((err) => setError(err?.message || 'Failed to load'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const columns = [
    {
      key: 'created_at',
      label: 'Timestamp',
      render: (r) =>
        r.created_at ? new Date(r.created_at).toLocaleString('en-IN') : '—',
    },
    {
      key: 'actor_name',
      label: 'Actor',
      render: (r) => (
        <div>
          <p className="font-semibold text-on-surface">{r.actor_name}</p>
          {r.actor_role && (
            <p className="text-xs text-on-surface-variant uppercase">
              {r.actor_role}
            </p>
          )}
        </div>
      ),
    },
    {
      key: 'action',
      label: 'Action',
      render: (r) => (
        <span className="px-2 py-0.5 rounded bg-primary-fixed text-on-primary-fixed text-xs font-semibold">
          {r.action}
        </span>
      ),
    },
    {
      key: 'entity_type',
      label: 'Target Entity',
      render: (r) => (
        <div>
          <p className="text-sm text-on-surface">{r.entity_type || '—'}</p>
          {r.entity_id && (
            <p className="text-xs text-on-surface-variant font-mono">
              {r.entity_id.slice(0, 8)}…
            </p>
          )}
        </div>
      ),
    },
    {
      key: 'metadata',
      label: 'Details',
      render: (r) =>
        r.metadata && Object.keys(r.metadata).length > 0 ? (
          <details className="text-xs">
            <summary className="cursor-pointer text-primary">View</summary>
            <pre className="mt-1 p-2 bg-surface-container rounded text-[10px] overflow-auto max-w-xs">
              {JSON.stringify(r.metadata, null, 2)}
            </pre>
          </details>
        ) : (
          '—'
        ),
    },
  ];

  return (
    <div className="flex flex-col w-full gap-space-lg">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-headline-xl font-bold text-on-surface">
            Audit Logs
          </h1>
          <p className="font-body-md text-on-surface-variant mt-1">
            Every approval, verification, and policy change — auto-logged
          </p>
        </div>
        <button
          onClick={load}
          className="px-4 py-2 rounded-lg bg-surface-container font-label-md font-semibold"
        >
          Refresh
        </button>
      </div>

      {!loading && !error && logs.length === 0 ? (
        <EmptyState
          icon="history"
          title="No audit events yet"
          description="Actions like approvals, verifications, and policy updates will appear here."
        />
      ) : (
        <DataTable
          columns={columns}
          data={logs}
          loading={loading}
          emptyIcon="history"
          emptyTitle={error ? 'Could not load logs' : 'No audit events'}
          emptyDescription={error || ''}
        />
      )}
    </div>
  );
};

export default AuditLogsPage;