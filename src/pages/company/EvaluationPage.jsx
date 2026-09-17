import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../../components/weekly-reports/PageHeader.jsx';
import Modal from '../../components/common/Modal.jsx';
import { STUDENTS_LIST } from '../../data/mockData.js';
import { ROUTES } from '../../constants/routes.js';
import { useToast } from '../../store/ToastContext.jsx';

const CompanyEvaluationPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedStudentId, setSelectedStudentId] = useState('STU-001');
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLocked, setIsLocked] = useState(false);

  const activeInterns = STUDENTS_LIST.filter((s) => s.company === 'Zoho Corp' || s.status === 'active');
  const selectedStudent = activeInterns.find((s) => s.id === selectedStudentId) || activeInterns[0];

  const [form, setForm] = useState({
    ratingTech: 5,
    ratingPunctuality: 5,
    ratingTeamwork: 4,
    ratingInitiative: 5,
    strengths: 'Exceptional problem-solving capabilities, quick learner, excellent Go programming standards.',
    areasToImprove: 'Could enhance technical documentation detail for edge cases.',
    recommendation: 'hired',
  });

  const handleSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsConfirmOpen(false);
      setIsLocked(true);
      toast.success(`Final evaluation submitted & certificate unlocked for ${selectedStudent.name}!`);
    }, 600);
  };

  return (
    <div className="flex flex-col w-full space-y-6">
      <PageHeader
        title="Final Internship Evaluation"
        breadcrumb="Company / Final Evaluation"
        badge={isLocked ? <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">Completed & Locked</span> : <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800">Draft</span>}
      />

      <div className="bg-surface-container-lowest rounded-xl shadow-sm p-6 space-y-6">
        {/* Student Selector */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-surface-container-high pb-4">
          <div>
            <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1 font-semibold">Select Intern to Evaluate</label>
            <select
              value={selectedStudentId}
              onChange={(e) => {
                setSelectedStudentId(e.target.value);
                setIsLocked(false);
              }}
              className="px-3 py-2 bg-surface-container rounded-lg border border-transparent focus:border-primary font-title-sm text-title-sm font-bold text-on-surface"
            >
              {activeInterns.map((intern) => (
                <option key={intern.id} value={intern.id}>
                  {intern.name} — {intern.role}
                </option>
              ))}
            </select>
          </div>
          <div className="text-right">
            <span className="font-body-sm text-body-sm text-on-surface-variant">Internship Duration:</span>
            <p className="font-title-sm text-title-sm font-bold text-on-surface">6 Months (Completed)</p>
          </div>
        </div>

        {isLocked ? (
          <div className="p-8 text-center space-y-4">
            <span className="material-symbols-outlined text-6xl text-emerald-600">verified</span>
            <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">
              Evaluation Submitted & Verified
            </h3>
            <p className="font-body-md text-body-md text-on-surface-variant max-w-md mx-auto">
              The final evaluation report for {selectedStudent.name} has been signed and locked. The AICTE compliant certificate has been generated.
            </p>
            <button
              onClick={() => navigate(ROUTES.COMPANY.INTERNS)}
              className="px-6 py-2.5 bg-primary text-on-primary font-label-md text-label-md font-bold rounded-lg hover:bg-primary/90"
            >
              Back to Interns List
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">
              Competency Ratings (1 to 5 Stars)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block font-label-md text-label-md text-on-surface mb-1 font-semibold">Technical Proficiency (Go, Redis, Systems)</label>
                <select
                  value={form.ratingTech}
                  onChange={(e) => setForm({ ...form, ratingTech: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-surface-container rounded-lg font-body-md text-body-md"
                >
                  <option value={5}>5 Stars — Outstanding</option>
                  <option value={4}>4 Stars — Exceeds Expectations</option>
                  <option value={3}>3 Stars — Meets Expectations</option>
                  <option value={2}>2 Stars — Needs Improvement</option>
                </select>
              </div>
              <div>
                <label className="block font-label-md text-label-md text-on-surface mb-1 font-semibold">Punctuality & Attendance</label>
                <select
                  value={form.ratingPunctuality}
                  onChange={(e) => setForm({ ...form, ratingPunctuality: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-surface-container rounded-lg font-body-md text-body-md"
                >
                  <option value={5}>5 Stars — Excellent (92%+ Attendance)</option>
                  <option value={4}>4 Stars — Good</option>
                  <option value={3}>3 Stars — Average</option>
                </select>
              </div>
              <div>
                <label className="block font-label-md text-label-md text-on-surface mb-1 font-semibold">Team Collaboration</label>
                <select
                  value={form.ratingTeamwork}
                  onChange={(e) => setForm({ ...form, ratingTeamwork: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-surface-container rounded-lg font-body-md text-body-md"
                >
                  <option value={5}>5 Stars — Outstanding</option>
                  <option value={4}>4 Stars — Very Good</option>
                  <option value={3}>3 Stars — Satisfactory</option>
                </select>
              </div>
              <div>
                <label className="block font-label-md text-label-md text-on-surface mb-1 font-semibold">Initiative & Problem Solving</label>
                <select
                  value={form.ratingInitiative}
                  onChange={(e) => setForm({ ...form, ratingInitiative: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-surface-container rounded-lg font-body-md text-body-md"
                >
                  <option value={5}>5 Stars — Highly Proactive</option>
                  <option value={4}>4 Stars — Proactive</option>
                  <option value={3}>3 Stars — Adequate</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-label-md text-label-md text-on-surface mb-1 font-semibold">Key Strengths</label>
              <textarea
                rows={3}
                value={form.strengths}
                onChange={(e) => setForm({ ...form, strengths: e.target.value })}
                className="w-full px-3 py-2 bg-surface-container rounded-lg border border-transparent focus:border-primary font-body-md text-body-md"
              />
            </div>

            <div>
              <label className="block font-label-md text-label-md text-on-surface mb-1 font-semibold">Areas to Improve</label>
              <textarea
                rows={3}
                value={form.areasToImprove}
                onChange={(e) => setForm({ ...form, areasToImprove: e.target.value })}
                className="w-full px-3 py-2 bg-surface-container rounded-lg border border-transparent focus:border-primary font-body-md text-body-md"
              />
            </div>

            <div>
              <label className="block font-label-md text-label-md text-on-surface mb-1 font-semibold">Hiring / PPO Recommendation</label>
              <select
                value={form.recommendation}
                onChange={(e) => setForm({ ...form, recommendation: e.target.value })}
                className="w-full px-3 py-2 bg-surface-container rounded-lg font-body-md text-body-md font-semibold text-primary"
              >
                <option value="hired">Highly Recommended for Pre-Placement Offer (PPO)</option>
                <option value="consider">Consider for Future Full-Time Hiring</option>
                <option value="completed">Internship Completed (No PPO)</option>
              </select>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-surface-container-high">
              <button
                type="button"
                onClick={() => setIsConfirmOpen(true)}
                className="px-6 py-3 bg-primary text-on-primary font-label-md text-label-md font-bold rounded-lg hover:bg-primary/90 transition-colors"
              >
                Submit Final Evaluation
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      {isConfirmOpen && (
        <Modal
          open={isConfirmOpen}
          onClose={() => setIsConfirmOpen(false)}
          title="Confirm Final Evaluation Submission"
          footer={
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsConfirmOpen(false)}
                className="px-4 py-2 border rounded-lg font-label-md text-label-md text-on-surface-variant"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="px-6 py-2 bg-primary text-on-primary font-label-md text-label-md font-bold rounded-lg hover:bg-primary/90"
              >
                {isSubmitting ? 'Locking Evaluation...' : 'Confirm & Lock Evaluation'}
              </button>
            </div>
          }
        >
          <p className="font-body-md text-body-md text-on-surface">
            Are you sure you want to submit final evaluation for <strong className="font-bold">{selectedStudent.name}</strong>?
            This will lock the evaluation form and issue the digital completion certificate.
          </p>
        </Modal>
      )}
    </div>
  );
};

export default CompanyEvaluationPage;
