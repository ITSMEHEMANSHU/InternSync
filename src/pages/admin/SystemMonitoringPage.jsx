import { useState } from 'react';
import PageHeader from '../../components/weekly-reports/PageHeader.jsx';
import StatusBadge from '../../components/common/StatusBadge.jsx';
import LineChartCard from '../../components/common/charts/LineChartCard.jsx';
import { useToast } from '../../store/ToastContext.jsx';

const SERVICES = [
  { name: 'Core REST API Gateway', status: 'active', uptime: '99.98%', latency: '14ms', icon: 'dns' },
  { name: 'PostgreSQL Primary DB', status: 'active', uptime: '99.99%', latency: '4ms', icon: 'database' },
  { name: 'Redis Cache Cluster', status: 'active', uptime: '100.0%', latency: '1ms', icon: 'memory' },
  { name: 'AI Audit & Skill Match Engine', status: 'active', uptime: '99.95%', latency: '120ms', icon: 'auto_awesome' },
  { name: 'Document Cloud Storage (S3)', status: 'active', uptime: '99.99%', latency: '35ms', icon: 'cloud' },
  { name: 'Email & Notification Queue', status: 'active', uptime: '99.90%', latency: '8ms', icon: 'mail' },
];

const LATENCY_DATA = [
  { time: '00:00', latency: 12 }, { time: '04:00', latency: 15 },
  { time: '08:00', latency: 28 }, { time: '12:00', latency: 34 },
  { time: '16:00', latency: 22 }, { time: '20:00', latency: 16 },
];

const AdminSystemMonitoringPage = () => {
  const { toast } = useToast();
  const [services, setServices] = useState(SERVICES);

  const handleRefresh = () => {
    toast.info('System diagnostics refreshed. All services healthy.');
  };

  return (
    <div className="flex flex-col w-full space-y-6">
      <PageHeader
        title="System Infrastructure & Health"
        breadcrumb="Admin / Monitoring"
        badge={<span className="inline-flex items-center gap-1 font-label-md text-label-md font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full"><span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span> Operational</span>}
        actions={[
          {
            label: 'Refresh Status',
            onClick: handleRefresh,
            variant: 'outline',
          },
        ]}
      />

      {/* Health Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((s, idx) => (
          <div key={idx} className="p-5 bg-surface-container-lowest rounded-xl shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-2xl text-primary">{s.icon}</span>
                <h4 className="font-title-md text-title-md font-bold text-on-surface">{s.name}</h4>
              </div>
              <StatusBadge status={s.status} />
            </div>
            <div className="pt-2 border-t border-surface-container-high flex justify-between font-body-sm text-body-sm text-on-surface-variant">
              <span>Uptime: <strong className="text-on-surface font-semibold">{s.uptime}</strong></span>
              <span>Avg Latency: <strong className="text-emerald-600 font-semibold">{s.latency}</strong></span>
            </div>
          </div>
        ))}
      </div>

      {/* Latency Chart & Queue Status */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8">
          <LineChartCard
            title="API Latency (ms) Over 24 Hours"
            data={LATENCY_DATA}
            xKey="time"
            lines={[{ key: 'latency', color: '#10b981', name: 'Latency (ms)' }]}
          />
        </div>

        <div className="lg:col-span-4 bg-surface-container-lowest rounded-xl shadow-sm p-6 space-y-4">
          <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">Queue & Worker Status</h3>
          <div className="space-y-3">
            <div className="p-3 bg-surface-container rounded-lg flex justify-between items-center">
              <span className="font-body-md text-body-md text-on-surface font-medium">Async Report Processing Queue</span>
              <span className="font-label-md text-label-md font-bold text-emerald-600">0 Pending</span>
            </div>
            <div className="p-3 bg-surface-container rounded-lg flex justify-between items-center">
              <span className="font-body-md text-body-md text-on-surface font-medium">AI OCR Extraction Jobs</span>
              <span className="font-label-md text-label-md font-bold text-primary">2 Active</span>
            </div>
            <div className="p-3 bg-surface-container rounded-lg flex justify-between items-center">
              <span className="font-body-md text-body-md text-on-surface font-medium">Notification Workers</span>
              <span className="font-label-md text-label-md font-bold text-emerald-600">4 Idle</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSystemMonitoringPage;
