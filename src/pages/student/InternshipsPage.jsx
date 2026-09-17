import { useNavigate } from 'react-router-dom';
import { useInternships } from '../../hooks/useInternships.js';
import { useToast } from '../../store/ToastContext.jsx';
import { ROUTES } from '../../constants/routes.js';
import SearchBar from '../../components/common/SearchBar.jsx';
import Skeleton from '../../components/common/Skeleton.jsx';
import EmptyState from '../../components/common/EmptyState.jsx';

const InternshipsPage = () => {
  const { internships, loading, error, filter, setFilter, apply } = useInternships();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleApply = async (e, id) => {
    e.stopPropagation();
    try {
      await apply(id);
      toast.success('Application submitted successfully!');
      navigate(ROUTES.STUDENT.APPLICATIONS);
    } catch (err) {
      toast.error(err?.message || 'Failed to apply');
    }
  };

  return (
    <div className="flex flex-col w-full gap-space-lg">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-headline-xl text-headline-xl font-bold text-on-surface">Discover Internships</h1>
          <p className="font-body-md text-body-md text-on-surface-variant mt-1">
            AI-matched opportunities based on your profile
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <SearchBar
          value={filter.search}
          onChange={(v) => setFilter((f) => ({ ...f, search: v }))}
          placeholder="Search by title..."
          className="flex-1"
        />
        <select
          value={filter.remote}
          onChange={(e) => setFilter((f) => ({ ...f, remote: e.target.value }))}
          className="h-9 px-3 rounded-lg border border-outline-variant/60 bg-surface-container-low font-body-sm text-body-sm text-on-surface focus:outline-none focus:border-primary transition-all"
        >
          <option value="">All Modes</option>
          <option value="remote">Remote</option>
          <option value="onsite">On-site</option>
        </select>
      </div>

      {loading && <Skeleton variant="row" count={4} />}

      {!loading && error && (
        <EmptyState
          icon="error"
          title="Could not load internships"
          description={error}
          action={{ label: 'Retry', icon: 'refresh', onClick: () => setFilter((f) => ({ ...f })) }}
        />
      )}

      {!loading && !error && internships.length === 0 && (
        <EmptyState
          icon="search_off"
          title="No internships found"
          description="Try adjusting your filters or check back later."
          action={{
            label: 'Clear Filters',
            icon: 'filter_alt_off',
            onClick: () => setFilter({ search: '', location: '', remote: '' }),
          }}
        />
      )}

      {!loading && !error && internships.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
          {internships.map((i) => (
            <div
              key={i.id}
              onClick={() => navigate(ROUTES.STUDENT.INTERNSHIP_DETAIL.replace(':id', i.id))}
              className="bg-surface-container-lowest rounded-xl shadow-sm p-space-md flex flex-col gap-3 hover:shadow-md transition-all cursor-pointer"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary-fixed flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[20px] text-primary">
                      business
                    </span>
                  </div>
                  <div>
                    <p className="font-headline-sm text-headline-sm font-bold text-on-surface">
                      {i.title}
                    </p>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      {i.company?.name}
                    </p>
                  </div>
                </div>
              </div>

              {i.description && (
                <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-2">
                  {i.description}
                </p>
              )}

              {Array.isArray(i.required_skills) && i.required_skills.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {i.required_skills.map((s) => (
                    <span
                      key={s}
                      className="px-2 py-0.5 rounded text-[10px] font-semibold bg-surface-container text-on-surface"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              )}

              <div className="flex items-center justify-between pt-1 border-t border-outline-variant/20">
                <div className="flex items-center gap-3 text-[12px] text-on-surface-variant">
                  {i.location && (
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">location_on</span>
                      {i.location}
                    </span>
                  )}
                  {i.duration_months && (
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">schedule</span>
                      {i.duration_months} months
                    </span>
                  )}
                  {typeof i.stipend === 'number' && (
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">currency_rupee</span>
                      {i.stipend.toLocaleString('en-IN')}/mo
                    </span>
                  )}
                </div>
                <button
                  onClick={(e) => handleApply(e, i.id)}
                  className="px-3 py-1.5 rounded-lg bg-primary text-on-primary font-label-sm text-label-sm font-semibold hover:opacity-90 transition-all"
                >
                  Apply
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default InternshipsPage;