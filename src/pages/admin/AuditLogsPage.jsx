import { useState } from 'react';
import PageHeader from '../../components/weekly-reports/PageHeader.jsx';
import DataTable from '../../components/common/DataTable.jsx';
import SearchBar from '../../components/common/SearchBar.jsx';
import { AUDIT_LOGS } from '../../data/mockData.js';
import { useToast } from '../../store/ToastContext.jsx';

const AdminAuditLogsPage = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedLogId, setExpandedLogId] = useState(null);

  const filtered = AUDIT_LOGS.filter(
    (log) =>
      log.actor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.entity.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    { header: 'Timestamp', accessor: 'timestamp' },
    {
      header: 'Actor / User',
      accessor: 'actor',
      render: (r) => <span className="font-semibold text-on-surface">{r.actor}</span>,
    },
    {
      header: 'Action',
      accessor: 'action',
      render: (r) => (
        <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-primary-fixed/30 text-primary">
          {r.action}
        </span>
      ),
    },
    { header: 'Target Entity', accessor: 'entity' },
    {
      header: 'IP Address',
      accessor: 'ip',
      render: (r) => <span className="font-mono text-xs text-on-surface-variant">{r.ip}</span>,
    },
  ];

  const handleExport = () => {
    toast.success('Audit logs exported to CSV format.');
  };

  return (
    <div className="flex flex-col w-full space-y-6">
      <PageHeader
        title="Audit Logs & Compliance Trail"
        breadcrumb="Admin / Audit Logs"
        actions={[
          {
            label: 'Export CSV',
            onClick: handleExport,
            variant: 'outline',
          },
        ]}
      />

      <div className="bg-surface-container-lowest rounded-xl shadow-sm p-6 space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <SearchBar placeholder="Search by actor, action, or entity..." value={searchTerm} onChange={setSearchTerm} />
          <span className="font-body-sm text-body-sm text-on-surface-variant font-semibold">
            Showing {filtered.length} audit entries
          </span>
        </div>

        <DataTable
          columns={columns}
          data={filtered}
          onRowClick={(row) => {
            setExpandedLogId(expandedLogId === row.id ? null : row.id);
            toast.info(`Log details: ${row.action} on ${row.entity} by ${row.actor}`);
          }}
        />
      </div>
    </div>
  );
};

export default AdminAuditLogsPage;
