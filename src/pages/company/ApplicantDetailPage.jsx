import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageHeader from '../../components/weekly-reports/PageHeader.jsx';
import StatusBadge from '../../components/common/StatusBadge.jsx';
import AIMatchBadge from '../../components/common/AIMatchBadge.jsx';
import AIInsightCard from '../../components/common/AIInsightCard.jsx';
import { APPLICANTS_LIST } from '../../data/mockData.js';
import { ROUTES } from '../../constants/routes.js';
import { useToast } from '../../store/ToastContext.jsx';

const CompanyApplicantDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  const applicant = APPLICANTS_LIST.find((a) => a.id === id) || APPLICANTS_LIST[0];

  const handleStatusChange = (newStatus, msg) => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      toast.success(msg);
      navigate(ROUTES.COMPANY.APPLICANTS);
    }, 600);
  };

  return (
    <div className="flex flex-col w-full space-y-6">
      <PageHeader
        title={applicant.name}
        breadcrumb={`Applicants / ${applicant.name}`}
        badge={<StatusBadge status={applicant.status} />}
        actions={[
          { label: 'Back to Pipeline', onClick: () => navigate(-1) },
        ]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 8 Cols: Candidate Specs & AI Match Breakdown */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-surface-container-lowest rounded-xl shadow-sm p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-headline-sm text-headline-sm font-bold text-on-surface">{applicant.name}</h2>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  {applicant.college} • {applicant.branch} • CGPA {applicant.cgpa}
                </p>
              </div>
              <AIMatchBadge score={applicant.aiMatch} />
            </div>

            <div className="pt-4 border-t border-surface-container-high grid grid-cols-2 sm:grid-cols-3 gap-4 font-body-sm text-body-sm">
              <div>
                <span className="text-on-surface-variant block">Applied For:</span>
                <span className="font-semibold text-on-surface">{applicant.appliedFor}</span>
              </div>
              <div>
                <span className="text-on-surface-variant block">Applied Date:</span>
                <span className="font-semibold text-on-surface">{applicant.appliedAt}</span>
              </div>
              <div>
                <span className="text-on-surface-variant block">Resume Document:</span>
                <a href="#resume" onClick={(e) => { e.preventDefault(); toast.info('Opening candidate resume PDF preview...'); }} className="font-semibold text-primary hover:underline flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">picture_as_pdf</span> Download Resume
                </a>
              </div>
            </div>
          </div>

          <AIInsightCard
            title="AI Skill Alignment & Match Analysis"
            insight={`Candidate scored ${applicant.aiMatch}% alignment with ${applicant.appliedFor} position. Top matching skills: Go, Redis, and Microservices. Minor skill gap identified in Kubernetes production deployment experience.`}
            confidence={95}
          />

          <div className="bg-surface-container-lowest rounded-xl shadow-sm p-6 space-y-4">
            <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">Extracted Skill Profile</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { name: 'Golang / Backend API', score: '95%' },
                { name: 'Redis Caching & Data Structs', score: '90%' },
                { name: 'gRPC Interceptors', score: '88%' },
                { name: 'Docker Containerization', score: '85%' },
                { name: 'PostgreSQL Database Design', score: '82%' },
                { name: 'Kubernetes & Helm', score: '65%' },
              ].map((skill, idx) => (
                <div key={idx} className="p-3 bg-surface-container rounded-lg flex items-center justify-between">
                  <span className="font-body-md text-body-md text-on-surface font-medium">{skill.name}</span>
                  <span className="font-label-md text-label-md font-bold text-primary">{skill.score}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right 4 Cols: Decision Panel */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-surface-container-lowest rounded-xl shadow-sm p-6 space-y-4">
            <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">Review & Action</h3>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Select an action below to update candidate stage in the recruitment workflow.
            </p>

            <div className="space-y-3 pt-2">
              <button
                onClick={() => handleStatusChange('approved', `Candidate ${applicant.name} approved for internship!`)}
                disabled={isProcessing}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-label-md text-label-md font-bold rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-sm">check_circle</span> Approve & Extend Offer
              </button>
              <button
                onClick={() => handleStatusChange('shortlisted', `Candidate ${applicant.name} moved to Shortlisted.`)}
                disabled={isProcessing}
                className="w-full py-3 bg-primary text-on-primary font-label-md text-label-md font-bold rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-sm">star</span> Shortlist Candidate
              </button>
              <button
                onClick={() => handleStatusChange('rejected', `Candidate ${applicant.name} application rejected.`)}
                disabled={isProcessing}
                className="w-full py-3 bg-error-container text-on-error-container font-label-md text-label-md font-bold rounded-lg hover:bg-error-container/80 transition-colors flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-sm">cancel</span> Reject Application
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyApplicantDetailPage;
