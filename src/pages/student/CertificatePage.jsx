import { useState } from 'react';
import { useToast } from '../../store/ToastContext.jsx';
import PageHeader from '../../components/weekly-reports/PageHeader.jsx';
import StatCard from '../../components/common/StatCard.jsx';
import StatusBadge from '../../components/common/StatusBadge.jsx';
import { CERTIFICATE_DATA } from '../../data/mockData.js';

const CertificatePage = () => {
  const { toast } = useToast();
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = () => {
    setIsDownloading(true);
    setTimeout(() => {
      setIsDownloading(false);
      toast.success('Certificate downloaded successfully');
    }, 1000);
  };

  const handleShare = () => {
    toast.info('Share link copied to clipboard');
  };

  return (
    <div className="flex flex-col w-full">
      <PageHeader
        title="Certificate"
        breadcrumb="My Internship / Certificate"
        badge={<StatusBadge status="Completed" />}
        actions={[
          { label: 'Download PDF', onClick: handleDownload, loading: isDownloading, primary: true },
          { label: 'Share', onClick: handleShare },
        ]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-start">
        {/* Left main column */}
        <div className="lg:col-span-8 flex flex-col gap-space-lg">
          {/* Celebration Card */}
          <div className="bg-gradient-to-r from-primary to-sky-600 rounded-xl shadow-lg p-8 text-white">
            <div className="flex items-center gap-4 mb-4">
              <span className="material-symbols-outlined text-5xl">emoji_events</span>
              <div>
                <h2 className="font-headline-lg text-headline-lg font-bold">Congratulations!</h2>
                <p className="font-body-md text-body-md opacity-90">You have successfully completed your internship</p>
              </div>
            </div>
          </div>

          {/* Certificate Preview */}
          <div className="bg-surface-container-lowest rounded-xl shadow-sm p-space-lg">
            <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface mb-6">Certificate Preview</h3>
            
            <div className="border-4 border-double border-outline-variant rounded-lg p-8 bg-white">
              <div className="text-center mb-8">
                <h4 className="font-headline-lg text-headline-lg font-bold text-on-surface mb-2">Certificate of Completion</h4>
                <p className="font-body-md text-body-md text-on-surface-variant">This is to certify that</p>
              </div>

              <div className="text-center mb-8">
                <h3 className="font-headline-xl text-headline-xl font-bold text-primary mb-2">{CERTIFICATE_DATA.studentName}</h3>
                <p className="font-body-md text-body-md text-on-surface-variant">has successfully completed the internship program</p>
              </div>

              <div className="grid grid-cols-2 gap-6 mb-8">
                <div className="text-center p-4 bg-surface-container rounded-lg">
                  <p className="font-label-sm text-label-sm text-on-surface-variant mb-1">Company</p>
                  <p className="font-body-md text-body-md font-semibold text-on-surface">{CERTIFICATE_DATA.company}</p>
                </div>
                <div className="text-center p-4 bg-surface-container rounded-lg">
                  <p className="font-label-sm text-label-sm text-on-surface-variant mb-1">Role</p>
                  <p className="font-body-md text-body-md font-semibold text-on-surface">{CERTIFICATE_DATA.role}</p>
                </div>
                <div className="text-center p-4 bg-surface-container rounded-lg">
                  <p className="font-label-sm text-label-sm text-on-surface-variant mb-1">Duration</p>
                  <p className="font-body-md text-body-md font-semibold text-on-surface">{CERTIFICATE_DATA.duration}</p>
                </div>
                <div className="text-center p-4 bg-surface-container rounded-lg">
                  <p className="font-label-sm text-label-sm text-on-surface-variant mb-1">Grade</p>
                  <p className="font-body-md text-body-md font-semibold text-primary">{CERTIFICATE_DATA.grade}</p>
                </div>
              </div>

              <div className="text-center">
                <p className="font-label-sm text-label-sm text-on-surface-variant mb-1">Certificate ID</p>
                <p className="font-body-md text-body-md font-mono text-on-surface">{CERTIFICATE_DATA.certificateId}</p>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-center gap-4">
              <a
                href={CERTIFICATE_DATA.verifyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary font-label-md text-label-md font-semibold hover:underline"
              >
                Verify Certificate
              </a>
              <span className="text-on-surface-variant">•</span>
              <span className="font-label-sm text-label-sm text-on-surface-variant">
                Issued: {CERTIFICATE_DATA.issueDate}
              </span>
            </div>
          </div>
        </div>

        {/* Right sidebar */}
        <div className="lg:col-span-4 flex flex-col gap-space-lg">
          <StatCard
            icon="school"
            label="Credits Earned"
            value={CERTIFICATE_DATA.credits.toString()}
            iconBg="bg-primary-fixed/60 text-primary"
            trend="Academic credits"
          />
          <StatCard
            icon="grade"
            label="CGPA Equivalent"
            value={CERTIFICATE_DATA.cgpaEquivalent.toString()}
            iconBg="bg-tertiary-fixed/60 text-tertiary"
            trend="Grade conversion"
          />
          <div className="bg-surface-container-lowest rounded-xl shadow-sm p-space-lg">
            <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface mb-4">Grade Summary</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-surface-container rounded-lg">
                <span className="font-body-md text-body-md text-on-surface">Final Report</span>
                <span className="font-label-md text-label-md font-semibold text-primary">A+</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-surface-container rounded-lg">
                <span className="font-body-md text-body-md text-on-surface">Weekly Reports</span>
                <span className="font-label-md text-label-md font-semibold text-primary">A</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-surface-container rounded-lg">
                <span className="font-body-md text-body-md text-on-surface">Company Evaluation</span>
                <span className="font-label-md text-label-md font-semibold text-primary">A+</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-surface-container rounded-lg">
                <span className="font-body-md text-body-md text-on-surface">Attendance</span>
                <span className="font-label-md text-label-md font-semibold text-primary">A</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CertificatePage;