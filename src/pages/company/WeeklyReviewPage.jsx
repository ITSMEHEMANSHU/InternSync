import { useState } from 'react';
import PageHeader from '../../components/weekly-reports/PageHeader.jsx';
import StatusBadge from '../../components/common/StatusBadge.jsx';
import AIInsightCard from '../../components/common/AIInsightCard.jsx';
import { EVALUATED_REPORTS, STUDENTS_LIST } from '../../data/mockData.js';
import { useToast } from '../../store/ToastContext.jsx';

const CompanyWeeklyReviewPage = () => {
  const { toast } = useToast();
  const [selectedReport, setSelectedReport] = useState(EVALUATED_REPORTS[0] || null);
  const [feedback, setFeedback] = useState('');
  const [rating, setRating] = useState(9);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitEvaluation = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success(`Weekly Review for Week ${selectedReport.week} submitted with rating ${rating}/10!`);
      setFeedback('');
    }, 600);
  };

  return (
    <div className="flex flex-col w-full space-y-6">
      <PageHeader
        title="Weekly Review & Mentorship"
        breadcrumb="Company / Weekly Review"
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Submissions List */}
        <div className="lg:col-span-5 bg-surface-container-lowest rounded-xl shadow-sm p-6 space-y-4">
          <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface mb-2">
            Weekly Report Submissions
          </h3>
          <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
            {EVALUATED_REPORTS.map((rep) => {
              const isSelected = selectedReport?.id === rep.id;
              return (
                <div
                  key={rep.id}
                  onClick={() => setSelectedReport(rep)}
                  className={`p-4 rounded-xl border cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-primary-fixed/20 border-primary shadow-sm'
                      : 'bg-surface-container/30 border-transparent hover:bg-surface-container'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-title-md text-title-md font-bold text-on-surface">Week {rep.week} Report</span>
                    <StatusBadge status="approved" />
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                    Student: Aarav Sharma • Submitted {rep.submittedDate}
                  </p>
                  <div className="flex items-center justify-between text-body-sm text-on-surface-variant mt-2 pt-2 border-t border-surface-container-high">
                    <span>Hours logged: 42 hrs</span>
                    <span className="font-semibold text-primary">Score: {rep.gradeScore}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Detailed Inspector & Feedback Form */}
        <div className="lg:col-span-7 bg-surface-container-lowest rounded-xl shadow-sm p-6 space-y-6">
          {selectedReport ? (
            <>
              <div className="flex items-center justify-between border-b border-surface-container-high pb-4">
                <div>
                  <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">
                    Week {selectedReport.week} Submission Review
                  </h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    Submitted by Aarav Sharma on {selectedReport.submittedDate}
                  </p>
                </div>
                <StatusBadge status="approved" />
              </div>

              {/* Weekly Highlights */}
              <div className="space-y-3">
                <h4 className="font-title-md text-title-md font-bold text-on-surface">Key Accomplishments</h4>
                <div className="p-4 bg-surface-container rounded-lg space-y-2">
                  <p className="font-body-md text-body-md text-on-surface">
                    Implemented Redis connection pooling for telemetry pipelines. Optimized memory allocations by 24% under benchmark loads.
                  </p>
                </div>
              </div>

              <AIInsightCard
                title="AI Content Verification Audit"
                insight="Code commits and weekly log cross-referenced with GitHub repository history. 98% confidence matching actual committed lines of Go code."
                confidence={98}
              />

              {/* Feedback Form */}
              <form onSubmit={handleSubmitEvaluation} className="space-y-4 pt-2 border-t border-surface-container-high">
                <h4 className="font-title-md text-title-md font-bold text-on-surface">Industry Mentor Feedback & Rating</h4>

                <div>
                  <label className="block font-label-md text-label-md text-on-surface mb-1 font-semibold">
                    Weekly Performance Rating (1–10)
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={rating}
                      onChange={(e) => setRating(Number(e.target.value))}
                      className="w-full h-2 bg-surface-container-high rounded-lg appearance-none cursor-pointer accent-primary"
                    />
                    <span className="font-headline-sm text-headline-sm font-bold text-primary w-8 text-center">
                      {rating}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block font-label-md text-label-md text-on-surface mb-1 font-semibold">
                    Feedback & Comments for Intern
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Provide constructive feedback on progress, technical execution, and next week's expectations..."
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    required
                    className="w-full px-3 py-2 bg-surface-container rounded-lg border border-transparent focus:border-primary font-body-md text-body-md"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-2.5 bg-primary text-on-primary font-label-md text-label-md font-bold rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
                  >
                    {isSubmitting ? 'Saving Review...' : 'Submit Mentor Evaluation'}
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="flex items-center justify-center h-64 text-on-surface-variant font-body-md">
              Select a report submission from the list to review.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompanyWeeklyReviewPage;
