import { useState } from 'react';
import { useToast } from '../../store/ToastContext.jsx';
import PageHeader from '../../components/weekly-reports/PageHeader.jsx';
import StatusBadge from '../../components/common/StatusBadge.jsx';

const DocumentsPage = () => {
  const { toast } = useToast();
  const [selectedDoc, setSelectedDoc] = useState(null);

  const documents = [
    { id: 'DOC-001', student: 'Aarav Sharma', type: 'Offer Letter', status: 'verified', ocrConfidence: 95 },
    { id: 'DOC-002', student: 'Priya Patel', type: 'NOC', status: 'pending', ocrConfidence: 88 },
    { id: 'DOC-003', student: 'Rohan Verma', type: 'Insurance', status: 'pending', ocrConfidence: 92 },
    { id: 'DOC-004', student: 'Sneha Reddy', type: 'Offer Letter', status: 'verified', ocrConfidence: 97 },
  ];

  const handleVerify = (id) => {
    toast.success('Document verified successfully');
  };

  const handleReject = (id) => {
    toast.info('Document rejected');
  };

  return (
    <div className="flex flex-col w-full">
      <PageHeader
        title="Document Verification"
        breadcrumb="Documents"
        badge={<StatusBadge status="In Progress" />}
        actions={[
          { label: 'Export Report', primary: false },
        ]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Document List */}
        <div className="bg-surface-container-lowest rounded-xl shadow-sm p-6">
          <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface mb-4">Pending Verification</h3>
          <div className="space-y-3">
            {documents.filter(d => d.status === 'pending').map((doc) => (
              <div
                key={doc.id}
                onClick={() => setSelectedDoc(doc)}
                className={`p-4 rounded-lg cursor-pointer transition-colors ${
                  selectedDoc?.id === doc.id ? 'bg-primary-container text-on-primary' : 'bg-surface-container hover:bg-surface-container-high'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <p className="font-body-md text-body-md font-semibold">{doc.student}</p>
                  <StatusBadge status={doc.status} />
                </div>
                <p className="font-label-sm text-label-sm opacity-80">{doc.type}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Document Preview & OCR */}
        <div className="bg-surface-container-lowest rounded-xl shadow-sm p-6">
          {selectedDoc ? (
            <>
              <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface mb-4">Document Details</h3>
              <div className="aspect-video bg-surface-container rounded-lg flex items-center justify-center mb-4">
                <div className="text-center">
                  <span className="material-symbols-outlined text-6xl text-on-surface-variant/30 mb-2">description</span>
                  <p className="font-body-md text-body-md text-on-surface-variant">{selectedDoc.type}</p>
                </div>
              </div>
              
              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between p-3 bg-surface-container rounded-lg">
                  <span className="font-label-sm text-label-sm text-on-surface-variant">OCR Confidence</span>
                  <span className="font-label-md text-label-md font-semibold text-tertiary">{selectedDoc.ocrConfidence}%</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-surface-container rounded-lg">
                  <span className="font-label-sm text-label-sm text-on-surface-variant">Student</span>
                  <span className="font-body-md text-body-md font-semibold text-on-surface">{selectedDoc.student}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleVerify(selectedDoc.id)}
                  className="flex-1 px-4 py-2 bg-tertiary-container text-on-tertiary-container font-label-sm text-label-sm font-semibold rounded-lg hover:bg-tertiary-container/80"
                >
                  Verify
                </button>
                <button
                  onClick={() => handleReject(selectedDoc.id)}
                  className="flex-1 px-4 py-2 bg-error-container text-on-error-container font-label-sm text-label-sm font-semibold rounded-lg hover:bg-error-container/80"
                >
                  Reject
                </button>
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <span className="material-symbols-outlined text-6xl text-on-surface-variant/30 mb-4">description</span>
              <p className="font-body-md text-body-md text-on-surface-variant">Select a document to review</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DocumentsPage;