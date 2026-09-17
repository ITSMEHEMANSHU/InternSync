import { useState } from 'react';
import PageHeader from '../../components/weekly-reports/PageHeader.jsx';
import StatusBadge from '../../components/common/StatusBadge.jsx';
import Modal from '../../components/common/Modal.jsx';
import { useToast } from '../../store/ToastContext.jsx';

const INITIAL_QUEUE = [
  { id: 'CMP-002', name: 'Freshworks Inc', industry: 'SaaS / CRM', location: 'Chennai', website: 'https://freshworks.com', status: 'pending', submittedAt: '2024-11-08' },
  { id: 'CMP-003', name: 'Razorpay Technologies', industry: 'Fintech', location: 'Bengaluru', website: 'https://razorpay.com', status: 'pending', submittedAt: '2024-11-09' },
  { id: 'CMP-001', name: 'Zoho Corporation', industry: 'Software', location: 'Chennai', website: 'https://zoho.com', status: 'verified', submittedAt: '2024-10-01' },
];

const AdminCompanyVerificationPage = () => {
  const { toast } = useToast();
  const [queue, setQueue] = useState(INITIAL_QUEUE);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [rejectReason, setRejectReason] = useState('');

  const handleAction = (id, newStatus) => {
    setQueue(queue.map((c) => (c.id === id ? { ...c, status: newStatus } : c)));
    toast.success(`Company ${newStatus === 'verified' ? 'verified & approved' : 'rejected'}.`);
    setSelectedCompany(null);
    setRejectReason('');
  };

  return (
    <div className="flex flex-col w-full space-y-6">
      <PageHeader
        title="Company Verification Queue"
        breadcrumb="Admin / Company Verification"
        badge={<span className="text-xs font-semibold px-2.5 py-0.5 bg-amber-100 text-amber-800 rounded-full">{queue.filter(q => q.status === 'pending').length} Pending</span>}
      />

      <div className="bg-surface-container-lowest rounded-xl shadow-sm p-6 space-y-4">
        <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">Verification Requests</h3>

        <div className="divide-y divide-surface-container-high">
          {queue.map((company) => (
            <div key={company.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-title-md text-title-md font-bold text-on-surface">{company.name}</h4>
                  <StatusBadge status={company.status} />
                </div>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                  {company.industry} • {company.location} • Submitted: {company.submittedAt}
                </p>
                <a href={company.website} target="_blank" rel="noreferrer" className="font-body-sm text-body-sm text-primary hover:underline">
                  {company.website}
                </a>
              </div>

              <div className="flex items-center gap-2">
                {company.status === 'pending' ? (
                  <>
                    <button
                      onClick={() => handleAction(company.id, 'verified')}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-label-md text-label-md font-bold rounded-lg transition-colors"
                    >
                      Verify & Approve
                    </button>
                    <button
                      onClick={() => setSelectedCompany(company)}
                      className="px-4 py-2 bg-error-container text-on-error-container font-label-md text-label-md font-bold rounded-lg hover:bg-error-container/80 transition-colors"
                    >
                      Reject
                    </button>
                  </>
                ) : (
                  <span className="font-label-md text-label-md text-emerald-600 font-bold flex items-center gap-1">
                    <span className="material-symbols-outlined text-base">verified</span> Verified
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Reject Reason Modal */}
      {selectedCompany && (
        <Modal
          open={Boolean(selectedCompany)}
          onClose={() => setSelectedCompany(null)}
          title="Reject Company Partner Registration"
          footer={
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setSelectedCompany(null)}
                className="px-4 py-2 border rounded-lg font-label-md text-label-md text-on-surface-variant"
              >
                Cancel
              </button>
              <button
                onClick={() => handleAction(selectedCompany.id, 'rejected')}
                className="px-6 py-2 bg-error-container text-on-error-container font-label-md text-label-md font-bold rounded-lg hover:bg-error-container/80"
              >
                Confirm Rejection
              </button>
            </div>
          }
        >
          <div className="space-y-4">
            <p className="font-body-md text-body-md text-on-surface">
              Provide reason for rejecting <strong className="font-bold">{selectedCompany.name}</strong>:
            </p>
            <textarea
              rows={3}
              placeholder="e.g. Incomplete corporate GST registration / Invalid website details..."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="w-full px-3 py-2 bg-surface-container rounded-lg border border-transparent focus:border-primary font-body-md text-body-md"
            />
          </div>
        </Modal>
      )}
    </div>
  );
};

export default AdminCompanyVerificationPage;
