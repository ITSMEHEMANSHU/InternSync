import { useState } from 'react';
import PageHeader from '../../components/weekly-reports/PageHeader.jsx';
import StatusBadge from '../../components/common/StatusBadge.jsx';
import Modal from '../../components/common/Modal.jsx';
import { useToast } from '../../store/ToastContext.jsx';

const INITIAL_JOININGS = [
  { id: 'JNG-001', studentName: 'Aarav Sharma', role: 'Backend Engineer Intern', college: 'Apex University', expectedDate: '2024-12-01', status: 'pending_verification' },
  { id: 'JNG-002', studentName: 'Priya Patel', role: 'SDE Intern', college: 'NIT Trichy', expectedDate: '2024-12-05', status: 'verified' },
];

const CompanyJoiningVerificationPage = () => {
  const { toast } = useToast();
  const [joinings, setJoinings] = useState(INITIAL_JOININGS);
  const [selectedJoining, setSelectedJoining] = useState(null);
  const [joiningDate, setJoiningDate] = useState('2024-12-01');

  const handleVerifyClick = (joining) => {
    setSelectedJoining(joining);
    setJoiningDate(joining.expectedDate);
  };

  const confirmVerification = () => {
    setJoinings(
      joinings.map((j) =>
        j.id === selectedJoining.id ? { ...j, status: 'verified', expectedDate: joiningDate } : j
      )
    );
    toast.success(`Joining verified for ${selectedJoining.studentName} on ${joiningDate}!`);
    setSelectedJoining(null);
  };

  return (
    <div className="flex flex-col w-full space-y-6">
      <PageHeader
        title="Joining Verification"
        breadcrumb="Company / Joining Verification"
        badge={<span className="text-xs font-semibold px-2.5 py-0.5 bg-primary-fixed/40 text-primary rounded-full">{joinings.length} Accepted Interns</span>}
      />

      <div className="bg-surface-container-lowest rounded-xl shadow-sm p-6 space-y-4">
        <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">Offer Accepted Candidates</h3>
        <p className="font-body-md text-body-md text-on-surface-variant">
          Verify physical or remote joining dates for interns to activate their portal access and weekly reporting schedules.
        </p>

        <div className="divide-y divide-surface-container-high pt-2">
          {joinings.map((j) => (
            <div key={j.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-title-md text-title-md font-bold text-on-surface">{j.studentName}</h4>
                  <StatusBadge status={j.status} />
                </div>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                  {j.role} • {j.college}
                </p>
                <p className="font-body-sm text-body-sm text-primary font-semibold mt-0.5">
                  Expected Date: {j.expectedDate}
                </p>
              </div>

              <div>
                {j.status === 'verified' ? (
                  <span className="inline-flex items-center gap-1 font-label-md text-label-md font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
                    <span className="material-symbols-outlined text-base">verified</span> Verified & Active
                  </span>
                ) : (
                  <button
                    onClick={() => handleVerifyClick(j)}
                    className="px-4 py-2 bg-primary text-on-primary font-label-md text-label-md font-bold rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    Confirm & Verify Joining
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Confirmation Modal */}
      {selectedJoining && (
        <Modal
          open={Boolean(selectedJoining)}
          onClose={() => setSelectedJoining(null)}
          title="Verify Candidate Joining"
          footer={
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setSelectedJoining(null)}
                className="px-4 py-2 border rounded-lg font-label-md text-label-md text-on-surface-variant"
              >
                Cancel
              </button>
              <button
                onClick={confirmVerification}
                className="px-6 py-2 bg-primary text-on-primary font-label-md text-label-md font-bold rounded-lg hover:bg-primary/90"
              >
                Confirm Verification
              </button>
            </div>
          }
        >
          <div className="space-y-4">
            <p className="font-body-md text-body-md text-on-surface">
              Confirming joining for <strong className="text-on-surface font-bold">{selectedJoining.studentName}</strong> ({selectedJoining.role}).
            </p>
            <div>
              <label className="block font-label-md text-label-md text-on-surface mb-1 font-semibold">
                Actual Joining Date
              </label>
              <input
                type="date"
                value={joiningDate}
                onChange={(e) => setJoiningDate(e.target.value)}
                className="w-full px-3 py-2 bg-surface-container rounded-lg border border-transparent focus:border-primary font-body-md text-body-md"
              />
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default CompanyJoiningVerificationPage;
