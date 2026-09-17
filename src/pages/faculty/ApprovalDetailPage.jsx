import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useToast } from '../../store/ToastContext.jsx';
import PageHeader from '../../components/weekly-reports/PageHeader.jsx';
import StatusBadge from '../../components/common/StatusBadge.jsx';
import { APPROVALS_LIST } from '../../data/mockData.js';

const ApprovalDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  const approval = APPROVALS_LIST.find(a => a.id === id) || APPROVALS_LIST[0];

  const handleApprove = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      toast.success('Approval approved successfully');
      navigate('/faculty/approvals');
    }, 1000);
  };

  const handleReject = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      toast.info('Approval rejected');
      navigate('/faculty/approvals');
    }, 1000);
  };

  return (
    <div className="flex flex-col w-full">
      <PageHeader
        title={approval.type}
        breadcrumb={`Approvals / ${approval.studentName} / ${approval.type}`}
        badge={<StatusBadge status={approval.status} />}
        actions={[
          { label: 'Back', onClick: () => navigate(-1) },
        ]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Document Preview */}
        <div className="bg-surface-container-lowest rounded-xl shadow-sm p-6">
          <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface mb-4">Document Preview</h3>
          <div className="aspect-video bg-surface-container rounded-lg flex items-center justify-center">
            <div className="text-center">
              <span className="material-symbols-outlined text-6xl text-on-surface-variant/30 mb-2">description</span>
              <p className="font-body-md text-body-md text-on-surface-variant">Document preview</p>
            </div>
          </div>
        </div>

        {/* Extracted Fields */}
        <div className="bg-surface-container-lowest rounded-xl shadow-sm p-6">
          <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface mb-4">OCR Extracted Fields</h3>
          <div className="space-y-4">
            <div>
              <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1">Student Name</label>
              <div className="p-3 bg-surface-container rounded-lg">
                <p className="font-body-md text-body-md text-on-surface">{approval.studentName}</p>
                <div className="flex items-center gap-2 mt-1">
                  <div className="w-full bg-tertiary-container rounded-full h-1.5">
                    <div className="bg-tertiary h-1.5 rounded-full" style={{ width: '95%' }} />
                  </div>
                  <span className="font-label-sm text-label-sm text-tertiary font-semibold">95%</span>
                </div>
              </div>
            </div>
            <div>
              <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1">Company Name</label>
              <div className="p-3 bg-surface-container rounded-lg">
                <p className="font-body-md text-body-md text-on-surface">{approval.company}</p>
                <div className="flex items-center gap-2 mt-1">
                  <div className="w-full bg-tertiary-container rounded-full h-1.5">
                    <div className="bg-tertiary h-1.5 rounded-full" style={{ width: '92%' }} />
                  </div>
                  <span className="font-label-sm text-label-sm text-tertiary font-semibold">92%</span>
                </div>
              </div>
            </div>
            <div>
              <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1">Role/Position</label>
              <div className="p-3 bg-surface-container rounded-lg">
                <p className="font-body-md text-body-md text-on-surface">{approval.role}</p>
                <div className="flex items-center gap-2 mt-1">
                  <div className="w-full bg-tertiary-container rounded-full h-1.5">
                    <div className="bg-tertiary h-1.5 rounded-full" style={{ width: '88%' }} />
                  </div>
                  <span className="font-label-sm text-label-sm text-tertiary font-semibold">88%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-6 flex items-center gap-3">
        <button
          onClick={handleApprove}
          disabled={isProcessing || approval.status !== 'pending'}
          className="px-6 py-3 bg-tertiary-container text-on-tertiary-container font-label-md text-label-md font-semibold rounded-lg hover:bg-tertiary-container/80 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isProcessing ? 'Processing...' : 'Approve'}
        </button>
        <button
          onClick={handleReject}
          disabled={isProcessing || approval.status !== 'pending'}
          className="px-6 py-3 bg-error-container text-on-error-container font-label-md text-label-md font-semibold rounded-lg hover:bg-error-container/80 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isProcessing ? 'Processing...' : 'Reject'}
        </button>
      </div>
    </div>
  );
};

export default ApprovalDetailPage;