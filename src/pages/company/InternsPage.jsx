import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../../components/weekly-reports/PageHeader.jsx';
import ProgressRing from '../../components/common/ProgressRing.jsx';
import StatusBadge from '../../components/common/StatusBadge.jsx';
import SearchBar from '../../components/common/SearchBar.jsx';
import { STUDENTS_LIST } from '../../data/mockData.js';
import { ROUTES } from '../../constants/routes.js';
import { companyService } from '../../services/companyService.js';

const CompanyInternsPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [apiInterns, setApiInterns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    companyService
      .getActiveInterns()
      .then((data) => {
        if (isMounted && Array.isArray(data) && data.length > 0) {
          setApiInterns(data);
        }
      })
      .catch((err) => console.warn('Active interns API fallback:', err))
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const activeInterns =
    apiInterns.length > 0
      ? apiInterns.map((app) => ({
          id: app.id,
          name: app.student?.name || 'Intern Student',
          role: app.internship?.title || 'Software Intern',
          progress: 80,
          attendance: 98,
          lastReport: 'Submitted Week 4',
          status: 'active',
        }))
      : STUDENTS_LIST.filter(
          (s) =>
            s.company === 'Zoho Corp' ||
            s.name.toLowerCase().includes(searchTerm.toLowerCase())
        );

  const filtered = activeInterns.filter((intern) =>
    intern.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col w-full space-y-6">
      <PageHeader
        title="Active Interns"
        breadcrumb="Company / Interns"
        badge={
          <span className="text-xs font-semibold px-2.5 py-0.5 bg-primary-fixed/40 text-primary rounded-full">
            {filtered.length} Active
          </span>
        }
        actions={[
          {
            label: '+ Assign Task',
            onClick: () => navigate(ROUTES.COMPANY.TASKS),
            variant: 'primary',
          },
        ]}
      />

      <div className="bg-surface-container-lowest rounded-xl shadow-sm p-6 space-y-6">
        <SearchBar
          placeholder="Search active interns..."
          value={searchTerm}
          onChange={setSearchTerm}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((intern) => (
            <div
              key={intern.id}
              className="p-5 bg-surface-container/40 rounded-xl border border-surface-container-high space-y-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-primary-fixed/40 flex items-center justify-center font-bold text-primary text-lg">
                    {intern.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-title-md text-title-md font-bold text-on-surface">
                      {intern.name}
                    </h4>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      {intern.role}
                    </p>
                  </div>
                </div>
                <ProgressRing
                  value={intern.progress}
                  size={48}
                  label={`${intern.progress}%`}
                />
              </div>

              <div className="pt-2 border-t border-surface-container-high grid grid-cols-2 gap-2 font-body-sm text-body-sm">
                <div>
                  <span className="text-on-surface-variant block">Attendance:</span>
                  <span className="font-semibold text-emerald-600">
                    {intern.attendance}%
                  </span>
                </div>
                <div>
                  <span className="text-on-surface-variant block">Last Report:</span>
                  <span className="font-semibold text-on-surface">
                    {intern.lastReport || 'N/A'}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <StatusBadge status={intern.status} />
                <div className="flex gap-2">
                  <button
                    onClick={() => navigate(ROUTES.COMPANY.WEEKLY_REVIEW)}
                    className="px-3 py-1.5 text-xs bg-surface-container-high rounded-lg text-on-surface hover:bg-surface-container-highest font-medium"
                  >
                    Review Reports
                  </button>
                  <button
                    onClick={() => navigate(ROUTES.COMPANY.EVALUATION)}
                    className="px-3 py-1.5 text-xs bg-primary text-on-primary rounded-lg font-bold hover:bg-primary/90"
                  >
                    Evaluate
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CompanyInternsPage;
