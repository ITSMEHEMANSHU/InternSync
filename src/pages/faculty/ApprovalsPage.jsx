import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../store/ToastContext.jsx';
import PageHeader from '../../components/weekly-reports/PageHeader.jsx';
import Tabs from '../../components/common/Tabs.jsx';
import StatusBadge from '../../components/common/StatusBadge.jsx';
import { APPROVALS_LIST } from '../../data/mockData.js';

const TABS = {
  ALL: 'all',
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
};

const ApprovalsPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState(TABS.PENDING);

  const tabs = [
    { id: TABS.ALL, label: 'All', count: APPROVALS_LIST.length },
    { id: TABS.PENDING, label: 'Pending', count: APPROVALS_LIST.filter(a => a.status === 'pending').length },
    { id: TABS.APPROVED, label: 'Approved', count: APPROVALS_LIST.filter(a => a.status === 'approved').length },
    { id: TABS.REJECTED, label: 'Rejected', count: APPROVALS_LIST.filter(a => a.status === 'rejected').length },
  ];

  const filteredApprovals = APPROVALS_LIST.filter(approval => {
    if (activeTab === TABS.ALL) return true;
    return approval.status === activeTab;
  });

  const handleApprove = (id) => {
    toast.success('Approval request approved');
  };

  const handleReject = (id) => {
    toast.info('Approval request rejected');
  };

  const handleRequestInfo = (id) => {
    toast.info('Information request sent');
  };

  return (
    <div className="flex flex-col w-full">
      <PageHeader
        title="Approvals"
        breadcrumb="Approvals"
        badge={<StatusBadge status="Pending" />}
        actions={[
          { label: 'Export Report', primary: false },
        ]}
      />

      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      <div className="space-y-4">
        {filteredApprovals.map((approval) => (
          <div key={approval.id} className="bg-surface-container-lowest rounded-xl shadow-sm p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">{approval.studentName}</h3>
                  <StatusBadge status={approval.status} />
                  {approval.urgency === 'high' && (
                    <span className="px-2 py-0.5 bg-error-container text-on-error-container text-[10px] font-label-sm font-bold rounded">
                      Urgent
                    </span>
                  )}
                </div>
                <p className="font-body-md text-body-md text-on-surface-variant mb-2">{approval.type}</p>
                <div className="flex items-center gap-4 text-sm">
                  <span className="font-label-sm text-label-sm text-on-surface-variant">
                    Company: {approval.company}
                  </span>
                  <span className="font-label-sm text-label-sm text-on-surface-variant">
                    Submitted: {approval.submittedAt}
                  </span>
                </div>
              </div>
              <button
                onClick={() => navigate(`/faculty/approvals/${approval.id}`)}
                className="px-4 py-2 bg-surface-container text-on-surface font-label-sm text-label-sm font-semibold rounded-lg hover:bg-surface-container-high"
              >
                View Details
              </button>
            </div>

            <div className="flex items-center gap-2">
              <span className="font-label-sm text-label-sm text-on-surface-variant">Documents:</span>
              {approval.documents.map((doc, idx) => (
                <span key={idx} className="px-2 py-1 bg-surface-container text-on-surface-variant font-label-sm text-label-sm rounded">
                  {doc}
                </span>
              ))}
            </div>

            {approval.status === 'pending' && (
              <div className="flex items-center gap-3 mt-4 pt-4 border-t border-outline-variant/20">
                <button
                  onClick={() => handleApprove(approval.id)}
                  className="px-4 py-2 bg-tertiary-container text-on-tertiary-container font-label-sm text-label-sm font-semibold rounded-lg hover:bg-tertiary-container/80"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleRequestInfo(approval.id)}
                  className="px-4 py-2 bg-secondary-container text-on-secondary-container font-label-sm text-label-sm font-semibold rounded-lg hover:bg-secondary-container/80"
                >
                  Request Info
                </button>
                <button
                  onClick={() => handleReject(approval.id)}
                  className="px-4 py-2 bg-error-container text-on-error-container font-label-sm text-label-sm font-semibold rounded-lg hover:bg-error-container/80"
                >
                  Reject
                </button>
              </div>
            )}
          </div>
        ))}

        {filteredApprovals.length === 0 && (
          <div className="bg-surface-container-lowest rounded-xl shadow-sm p-12 text-center">
            <span className="material-symbols-outlined text-6xl text-on-surface-variant/30 mb-4">inbox</span>
            <p className="font-body-md text-body-md text-on-surface-variant">No approvals in this category</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApprovalsPage;