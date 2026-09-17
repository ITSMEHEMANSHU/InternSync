import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useToast } from '../../store/ToastContext.jsx';
import { ROUTES } from '../../constants/routes.js';
import PageHeader from '../../components/weekly-reports/PageHeader.jsx';
import Tabs from '../../components/common/Tabs.jsx';
import StatCard from '../../components/common/StatCard.jsx';
import StatusBadge from '../../components/common/StatusBadge.jsx';
import Timeline from '../../components/common/Timeline.jsx';
import FileUpload from '../../components/common/FileUpload.jsx';
import { APPLICATIONS_LIST } from '../../data/mockData.js';

const TABS = {
  OVERVIEW: 'overview',
  DOCUMENTS: 'documents',
  TIMELINE: 'timeline',
};

const ApplicationDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState(TABS.OVERVIEW);

  const application = APPLICATIONS_LIST.find(a => a.id === id) || APPLICATIONS_LIST[0];

  const timelineSteps = [
    { label: 'Applied', status: 'completed', date: application.appliedAt, icon: 'send' },
    { label: 'Under Review', status: 'completed', date: '2024-10-16', icon: 'visibility' },
    { label: 'Faculty Approved', status: application.status === 'approved' || application.status === 'shortlisted' ? 'completed' : 'pending', date: '2024-10-17', icon: 'verified' },
    { label: 'Company Reviewed', status: application.status === 'approved' ? 'completed' : 'pending', date: '2024-10-18', icon: 'business' },
    { label: 'Offer Extended', status: application.status === 'approved' ? 'completed' : 'pending', date: '2024-10-19', icon: 'card_giftcard' },
    { label: 'Joined', status: application.status === 'approved' ? 'pending' : 'pending', date: null, icon: 'check_circle' },
  ];

  const tabs = [
    { id: TABS.OVERVIEW, label: 'Overview' },
    { id: TABS.DOCUMENTS, label: 'Documents' },
    { id: TABS.TIMELINE, label: 'Timeline' },
  ];

  return (
    <div className="flex flex-col w-full">
      <PageHeader
        title={application.title}
        breadcrumb={`Applications / ${application.company} / ${application.title}`}
        badge={<StatusBadge status={application.status} />}
        actions={[
          { label: 'Back', onClick: () => navigate(-1) },
        ]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-start">
        {/* Left main column */}
        <div className="lg:col-span-8 flex flex-col gap-space-lg">
          <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

          {activeTab === TABS.OVERVIEW && (
            <div className="bg-surface-container-lowest rounded-xl shadow-sm p-space-lg">
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <p className="font-label-sm text-label-sm text-on-surface-variant mb-1">Company</p>
                  <p className="font-body-md text-body-md font-semibold text-on-surface">{application.company}</p>
                </div>
                <div>
                  <p className="font-label-sm text-label-sm text-on-surface-variant mb-1">Applied On</p>
                  <p className="font-body-md text-body-md font-semibold text-on-surface">{application.appliedAt}</p>
                </div>
                <div>
                  <p className="font-label-sm text-label-sm text-on-surface-variant mb-1">Current Stage</p>
                  <p className="font-body-md text-body-md font-semibold text-on-surface">{application.stage}</p>
                </div>
                <div>
                  <p className="font-label-sm text-label-sm text-on-surface-variant mb-1">AI Match</p>
                  <p className="font-body-md text-body-md font-semibold text-primary">{application.aiMatch}%</p>
                </div>
              </div>

              <div className="p-4 bg-surface-container rounded-lg">
                <h4 className="font-label-lg text-label-lg font-semibold text-on-surface mb-2">Application Status</h4>
                <div className="flex items-center gap-3">
                  <StatusBadge status={application.status} />
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    {application.status === 'approved' && 'Congratulations! Your application has been approved.'}
                    {application.status === 'pending' && 'Your application is under review by the company.'}
                    {application.status === 'shortlisted' && 'You have been shortlisted for further consideration.'}
                    {application.status === 'rejected' && 'Unfortunately, your application was not selected.'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === TABS.DOCUMENTS && (
            <div className="bg-surface-container-lowest rounded-xl shadow-sm p-space-lg">
              <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface mb-4">Required Documents</h3>
              <div className="space-y-4">
                {[
                  { name: 'Resume/CV', status: 'uploaded', ocr: true },
                  { name: 'Offer Letter', status: 'pending', ocr: false },
                  { name: 'College ID', status: 'uploaded', ocr: true },
                  { name: 'Marksheets', status: 'pending', ocr: false },
                ].map((doc, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 bg-surface-container rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-2xl text-on-surface-variant">description</span>
                      <div>
                        <p className="font-body-md text-body-md font-semibold text-on-surface">{doc.name}</p>
                        <div className="flex items-center gap-2 mt-1">
                          {doc.ocr && (
                            <span className="px-2 py-0.5 bg-secondary-fixed text-on-secondary-fixed text-[10px] font-label-sm font-bold rounded">
                              OCR Verified
                            </span>
                          )}
                          <StatusBadge status={doc.status === 'uploaded' ? 'verified' : 'pending'} />
                        </div>
                      </div>
                    </div>
                    <FileUpload
                      accept=".pdf,.doc,.docx"
                      onUpload={(file) => toast.success(`${doc.name} uploaded successfully`)}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === TABS.TIMELINE && (
            <div className="bg-surface-container-lowest rounded-xl shadow-sm p-space-lg">
              <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface mb-6">Application Timeline</h3>
              <Timeline steps={timelineSteps} />
            </div>
          )}
        </div>

        {/* Right sidebar */}
        <div className="lg:col-span-4 flex flex-col gap-space-lg">
          <StatCard
            icon="auto_awesome"
            label="AI Match Score"
            value={`${application.aiMatch}%`}
            iconBg="bg-primary-fixed/60 text-primary"
            trend="Based on your skills"
          />
          <StatCard
            icon="schedule"
            label="Days Applied Ago"
            value="25"
            iconBg="bg-secondary-fixed/50 text-secondary"
            trend="Since application date"
          />
        </div>
      </div>
    </div>
  );
};

export default ApplicationDetailPage;