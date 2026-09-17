import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useToast } from '../../store/ToastContext.jsx';
import { ROUTES } from '../../constants/routes.js';
import PageHeader from '../../components/weekly-reports/PageHeader.jsx';
import Tabs from '../../components/common/Tabs.jsx';
import StatCard from '../../components/common/StatCard.jsx';
import StatusBadge from '../../components/common/StatusBadge.jsx';
import AIMatchBadge from '../../components/common/AIMatchBadge.jsx';
import AIInsightCard from '../../components/common/AIInsightCard.jsx';
import { INTERNSHIPS_LIST } from '../../data/mockData.js';

const TABS = {
  OVERVIEW: 'overview',
  REQUIREMENTS: 'requirements',
  COMPANY: 'company',
  AI_MATCH: 'ai_match',
};

const InternshipDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState(TABS.OVERVIEW);
  const [isApplying, setIsApplying] = useState(false);

  const internship = INTERNSHIPS_LIST.find(i => i.id === id) || INTERNSHIPS_LIST[0];

  const handleApply = () => {
    setIsApplying(true);
    setTimeout(() => {
      setIsApplying(false);
      toast.success('Application submitted successfully!');
      navigate(ROUTES.STUDENT.APPLICATIONS);
    }, 1000);
  };

  const tabs = [
    { id: TABS.OVERVIEW, label: 'Overview' },
    { id: TABS.REQUIREMENTS, label: 'Requirements' },
    { id: TABS.COMPANY, label: 'Company' },
    { id: TABS.AI_MATCH, label: 'AI Match Analysis' },
  ];

  return (
    <div className="flex flex-col w-full">
      <PageHeader
        title={internship.title}
        breadcrumb={`Internships / ${internship.company} / ${internship.title}`}
        badge={<StatusBadge status={internship.status} />}
        actions={[
          { label: 'Apply Now', onClick: handleApply, loading: isApplying, primary: true },
          { label: 'Save', onClick: () => toast.info('Internship saved to bookmarks') },
        ]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-start">
        {/* Left main column */}
        <div className="lg:col-span-8 flex flex-col gap-space-lg">
          <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

          {activeTab === TABS.OVERVIEW && (
            <div className="bg-surface-container-lowest rounded-xl shadow-sm p-space-lg">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-16 h-16 bg-primary-container rounded-lg flex items-center justify-center">
                  <span className="material-symbols-outlined text-3xl text-primary">business</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-headline-md text-headline-md font-bold text-on-surface mb-1">{internship.company}</h3>
                  <p className="font-body-md text-body-md text-on-surface-variant">{internship.location}</p>
                </div>
                <AIMatchBadge match={internship.aiMatch} />
              </div>

              <p className="font-body-md text-body-md text-on-surface mb-6 leading-relaxed">
                {internship.description}
              </p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="p-4 bg-surface-container rounded-lg">
                  <p className="font-label-sm text-label-sm text-on-surface-variant mb-1">Duration</p>
                  <p className="font-body-md text-body-md font-semibold text-on-surface">{internship.duration}</p>
                </div>
                <div className="p-4 bg-surface-container rounded-lg">
                  <p className="font-label-sm text-label-sm text-on-surface-variant mb-1">Stipend</p>
                  <p className="font-body-md text-body-md font-semibold text-on-surface">₹{internship.stipend.toLocaleString()}/mo</p>
                </div>
                <div className="p-4 bg-surface-container rounded-lg">
                  <p className="font-label-sm text-label-sm text-on-surface-variant mb-1">Type</p>
                  <p className="font-body-md text-body-md font-semibold text-on-surface">{internship.remote ? 'Remote' : 'On-site'}</p>
                </div>
                <div className="p-4 bg-surface-container rounded-lg">
                  <p className="font-label-sm text-label-sm text-on-surface-variant mb-1">Deadline</p>
                  <p className="font-body-md text-body-md font-semibold text-on-surface">{internship.deadline}</p>
                </div>
              </div>

              <div>
                <h4 className="font-label-lg text-label-lg font-semibold text-on-surface mb-3">Required Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {internship.skills.map((skill, idx) => (
                    <span key={idx} className="px-3 py-1.5 bg-primary-container text-on-primary font-label-sm text-label-sm font-semibold rounded-full">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === TABS.REQUIREMENTS && (
            <div className="bg-surface-container-lowest rounded-xl shadow-sm p-space-lg">
              <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface mb-4">Requirements</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-primary text-[20px] mt-0.5">check_circle</span>
                  <span className="font-body-md text-body-md text-on-surface">Currently pursuing B.Tech/B.E. in Computer Science or related field</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-primary text-[20px] mt-0.5">check_circle</span>
                  <span className="font-body-md text-body-md text-on-surface">Strong programming skills in required technologies</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-primary text-[20px] mt-0.5">check_circle</span>
                  <span className="font-body-md text-body-md text-on-surface">Good communication and problem-solving skills</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-primary text-[20px] mt-0.5">check_circle</span>
                  <span className="font-body-md text-body-md text-on-surface">Available for full-time internship (6 months)</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-primary text-[20px] mt-0.5">check_circle</span>
                  <span className="font-body-md text-body-md text-on-surface">Minimum CGPA of 7.5</span>
                </li>
              </ul>
            </div>
          )}

          {activeTab === TABS.COMPANY && (
            <div className="bg-surface-container-lowest rounded-xl shadow-sm p-space-lg">
              <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface mb-4">About {internship.company}</h3>
              <p className="font-body-md text-body-md text-on-surface mb-6 leading-relaxed">
                {internship.company} is a leading technology company known for its innovative solutions and excellent work culture. 
                Join our team to work on cutting-edge projects and learn from industry experts.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-surface-container rounded-lg">
                  <p className="font-label-sm text-label-sm text-on-surface-variant mb-1">Industry</p>
                  <p className="font-body-md text-body-md font-semibold text-on-surface">Software / SaaS</p>
                </div>
                <div className="p-4 bg-surface-container rounded-lg">
                  <p className="font-label-sm text-label-sm text-on-surface-variant mb-1">Employees</p>
                  <p className="font-body-md text-body-md font-semibold text-on-surface">10,000+</p>
                </div>
                <div className="p-4 bg-surface-container rounded-lg">
                  <p className="font-label-sm text-label-sm text-on-surface-variant mb-1">Founded</p>
                  <p className="font-body-md text-body-md font-semibold text-on-surface">2005</p>
                </div>
                <div className="p-4 bg-surface-container rounded-lg">
                  <p className="font-label-sm text-label-sm text-on-surface-variant mb-1">Headquarters</p>
                  <p className="font-body-md text-body-md font-semibold text-on-surface">{internship.location}</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === TABS.AI_MATCH && (
            <div className="space-y-4">
              <AIInsightCard
                title="Why this internship matches you"
                insight="Your profile aligns strongly with this role based on your skills in Go, Redis, and Kubernetes. The AI match score considers your academic performance, skill relevance, and project experience."
              />
              <div className="bg-surface-container-lowest rounded-xl shadow-sm p-space-lg">
                <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface mb-4">Skill Gap Analysis</h3>
                <div className="space-y-4">
                  {internship.skills.map((skill, idx) => (
                    <div key={idx}>
                      <div className="flex justify-between mb-1">
                        <span className="font-body-md text-body-md text-on-surface">{skill}</span>
                        <span className="font-label-sm text-label-sm text-primary font-semibold">{85 + Math.random() * 15}%</span>
                      </div>
                      <div className="w-full bg-surface-container rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full transition-all"
                          style={{ width: `${85 + Math.random() * 15}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right sidebar */}
        <div className="lg:col-span-4 flex flex-col gap-space-lg">
          <StatCard
            icon="auto_awesome"
            label="AI Match Score"
            value={`${internship.aiMatch}%`}
            iconBg="bg-primary-fixed/60 text-primary"
            trend="Based on your profile"
          />
          <StatCard
            icon="schedule"
            label="Application Deadline"
            value={internship.deadline}
            iconBg="bg-secondary-fixed/50 text-secondary"
            trend="Apply before deadline"
          />
        </div>
      </div>
    </div>
  );
};

export default InternshipDetailPage;