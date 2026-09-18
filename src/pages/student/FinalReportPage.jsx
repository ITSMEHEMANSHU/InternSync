import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../store/ToastContext.jsx';
import { ROUTES } from '../../constants/routes.js';
import PageHeader from '../../components/weekly-reports/PageHeader.jsx';
import StatCard from '../../components/common/StatCard.jsx';
import StatusBadge from '../../components/common/StatusBadge.jsx';
import FileUpload from '../../components/common/FileUpload.jsx';
import Modal from '../../components/common/Modal.jsx';

const FinalReportPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [reportContent, setReportContent] = useState('');
  const [files, setFiles] = useState([]);

  const handleSubmit = () => {
    setIsConfirmModalOpen(true);
  };

  const handleConfirmSubmit = () => {
    setIsConfirmModalOpen(false);
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success('Final report submitted for evaluation');
      navigate(ROUTES.STUDENT.MY_INTERNSHIP);
    }, 1000);
  };

  const handleFileUpload = (file) => {
    setFiles([...files, file]);
    toast.success('File uploaded successfully');
  };

  const handleRemoveFile = (index) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  return (
    <div className="flex flex-col w-full">
      <PageHeader
        title="Final Report"
        breadcrumb="My Internship / Final Report"
        badge={<StatusBadge status="In Progress" />}
        actions={[
          { label: 'Save Draft', onClick: () => toast.info('Draft saved successfully') },
          { label: 'Submit for Evaluation', onClick: handleSubmit, loading: isSubmitting, primary: true },
        ]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-start">
        {/* Left main column */}
        <div className="lg:col-span-8 flex flex-col gap-space-lg">
          <div className="bg-surface-container-lowest rounded-xl shadow-sm p-space-lg">
            <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface mb-4">Final Internship Report</h3>
            
            <div className="mb-6">
              <label className="block font-label-md text-label-md font-semibold text-on-surface mb-2">Report Content</label>
              <textarea
                value={reportContent}
                onChange={(e) => setReportContent(e.target.value)}
                rows={12}
                placeholder="Write your comprehensive final internship report including:
• Overview of the company and your role
• Projects worked on and technologies used
• Key learnings and skills acquired
• Challenges faced and how you overcame them
• Contribution to the organization
• Future career impact and recommendations"
                className="w-full px-4 py-3 rounded-lg border border-outline-variant bg-surface-container text-on-surface focus:outline-none focus:ring-2 focus:ring-primary resize-none font-body-md text-body-md"
              />
            </div>

            <div>
              <label className="block font-label-md text-label-md font-semibold text-on-surface mb-2">Supporting Documents</label>
              <FileUpload
                accept=".pdf,.doc,.docx,.ppt,.pptx"
                onUpload={handleFileUpload}
              />
              
              {files.length > 0 && (
                <div className="mt-4 space-y-2">
                  {files.map((file, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-surface-container rounded-lg">
                      <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-on-surface-variant">description</span>
                        <span className="font-body-md text-body-md text-on-surface">{file.name}</span>
                      </div>
                      <button
                        onClick={() => handleRemoveFile(idx)}
                        className="text-error hover:text-error-container"
                      >
                        <span className="material-symbols-outlined">delete</span>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="bg-surface-container-lowest rounded-xl shadow-sm p-space-lg">
            <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface mb-4">Report Guidelines</h3>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <span className="material-symbols-outlined text-primary text-[20px] mt-0.5">check_circle</span>
                <span className="font-body-md text-body-md text-on-surface">Minimum 3000 words</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="material-symbols-outlined text-primary text-[20px] mt-0.5">check_circle</span>
                <span className="font-body-md text-body-md text-on-surface">Include project screenshots and code snippets</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="material-symbols-outlined text-primary text-[20px] mt-0.5">check_circle</span>
                <span className="font-body-md text-body-md text-on-surface">Attach completion certificate from company</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="material-symbols-outlined text-primary text-[20px] mt-0.5">check_circle</span>
                <span className="font-body-md text-body-md text-on-surface">Submit in PDF format</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Right sidebar */}
        <div className="lg:col-span-4 flex flex-col gap-space-lg">
          <StatCard
            icon="schedule"
            label="Submission Deadline"
            value="Nov 30, 2024"
            iconBg="bg-secondary-fixed/50 text-secondary"
            trend="5 days remaining"
          />
          <StatCard
            icon="description"
            label="Word Count"
            value={reportContent.length.toString()}
            iconBg="bg-tertiary-fixed/60 text-tertiary"
            trend="Target: 3000+ words"
          />
          <div className="bg-surface-container-lowest rounded-xl shadow-sm p-space-lg">
            <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface mb-4">Evaluation Criteria</h3>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="font-body-sm text-body-sm text-on-surface">Content Quality</span>
                  <span className="font-label-sm text-label-sm text-primary font-semibold">30%</span>
                </div>
                <div className="w-full bg-surface-container rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full" style={{ width: '30%' }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="font-body-sm text-body-sm text-on-surface">Technical Depth</span>
                  <span className="font-label-sm text-label-sm text-primary font-semibold">25%</span>
                </div>
                <div className="w-full bg-surface-container rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full" style={{ width: '25%' }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="font-body-sm text-body-sm text-on-surface">Presentation</span>
                  <span className="font-label-sm text-label-sm text-primary font-semibold">20%</span>
                </div>
                <div className="w-full bg-surface-container rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full" style={{ width: '20%' }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="font-body-sm text-body-sm text-on-surface">Company Feedback</span>
                  <span className="font-label-sm text-label-sm text-primary font-semibold">25%</span>
                </div>
                <div className="w-full bg-surface-container rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full" style={{ width: '25%' }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal
        open={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        title="Confirm Submission"
        footer={
          <>
            <button
              onClick={() => setIsConfirmModalOpen(false)}
              className="px-4 py-2 bg-surface-container text-on-surface font-label-md text-label-md font-semibold rounded-lg hover:bg-surface-container-high"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmSubmit}
              className="px-4 py-2 bg-primary text-on-primary font-label-md text-label-md font-semibold rounded-lg hover:bg-primary/90"
            >
              Confirm Submit
            </button>
          </>
        }
      >
        <div className="space-y-4">
          <p className="font-body-md text-body-md text-on-surface">
            Are you sure you want to submit your final report for evaluation? This action cannot be undone.
          </p>
          <div className="p-4 bg-surface-container rounded-lg">
            <p className="font-label-sm text-label-sm text-on-surface-variant mb-1">Word Count</p>
            <p className="font-body-md text-body-md font-semibold text-on-surface">{reportContent.length} words</p>
          </div>
          <div className="p-4 bg-surface-container rounded-lg">
            <p className="font-label-sm text-label-sm text-on-surface-variant mb-1">Attachments</p>
            <p className="font-body-md text-body-md font-semibold text-on-surface">{files.length} files</p>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default FinalReportPage;