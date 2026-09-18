import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCompanyInternships } from '../../hooks/useCompanyInternships.js';
import { useToast } from '../../store/ToastContext.jsx';
import { ROUTES } from '../../constants/routes.js';
import PageHeader from '../../components/weekly-reports/PageHeader.jsx';

const PostInternshipPage = () => {
  const { create } = useCompanyInternships();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [skillsInput, setSkillsInput] = useState('');
  const [form, setForm] = useState({
    title: '',
    description: '',
    duration_months: '',
    stipend: '',
    location: '',
    remote: false,
    openings: 1,
    deadline: '',
    start_date: '',
    end_date: '',
  });

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const skills = skillsInput
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      await create({
        title: form.title,
        description: form.description || null,
        required_skills: skills,
        duration_months: form.duration_months
          ? parseInt(form.duration_months)
          : null,
        stipend: form.stipend ? parseFloat(form.stipend) : null,
        location: form.location || null,
        remote: form.remote,
        openings: parseInt(form.openings) || 1,
        deadline: form.deadline || null,
        start_date: form.start_date || null,
        end_date: form.end_date || null,
      });

      toast.success('Internship created as draft');
      navigate(ROUTES.COMPANY.INTERNSHIPS);
    } catch (err) {
      toast.error(err?.message || 'Failed to create');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col w-full">
      <PageHeader
        title="Post Internship"
        breadcrumb="Company / Post Internship"
        actions={[{ label: 'Cancel', onClick: () => navigate(-1) }]}
      />

      <form
        onSubmit={handleSubmit}
        className="bg-surface-container-lowest rounded-xl shadow-sm p-space-lg max-w-3xl flex flex-col gap-4"
      >
        <div>
          <label className="block font-label-md font-semibold text-on-surface mb-2">
            Internship Title *
          </label>
          <input
            value={form.title}
            onChange={(e) => set('title', e.target.value)}
            required
            placeholder="e.g. Backend Engineer Intern"
            className="w-full px-4 py-3 rounded-lg border border-outline-variant bg-surface-container"
          />
        </div>

        <div>
          <label className="block font-label-md font-semibold text-on-surface mb-2">
            Description *
          </label>
          <textarea
            value={form.description}
            onChange={(e) => set('description', e.target.value)}
            required
            rows={5}
            placeholder="Describe roles, responsibilities, and project scope..."
            className="w-full px-4 py-3 rounded-lg border border-outline-variant bg-surface-container resize-none"
          />
        </div>

        <div>
          <label className="block font-label-md font-semibold text-on-surface mb-2">
            Required Skills (comma-separated)
          </label>
          <input
            value={skillsInput}
            onChange={(e) => setSkillsInput(e.target.value)}
            placeholder="React, Node.js, PostgreSQL"
            className="w-full px-4 py-3 rounded-lg border border-outline-variant bg-surface-container"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-label-md font-semibold text-on-surface mb-2">
              Duration (months)
            </label>
            <input
              type="number"
              min="1"
              value={form.duration_months}
              onChange={(e) => set('duration_months', e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-outline-variant bg-surface-container"
            />
          </div>
          <div>
            <label className="block font-label-md font-semibold text-on-surface mb-2">
              Stipend (₹/month)
            </label>
            <input
              type="number"
              min="0"
              value={form.stipend}
              onChange={(e) => set('stipend', e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-outline-variant bg-surface-container"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-label-md font-semibold text-on-surface mb-2">
              Location
            </label>
            <input
              value={form.location}
              onChange={(e) => set('location', e.target.value)}
              placeholder="Chennai, TN"
              className="w-full px-4 py-3 rounded-lg border border-outline-variant bg-surface-container"
            />
          </div>
          <div>
            <label className="block font-label-md font-semibold text-on-surface mb-2">
              Openings
            </label>
            <input
              type="number"
              min="1"
              value={form.openings}
              onChange={(e) => set('openings', e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-outline-variant bg-surface-container"
            />
          </div>
        </div>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={form.remote}
            onChange={(e) => set('remote', e.target.checked)}
          />
          <span className="font-body-md text-on-surface">
            Remote internship
          </span>
        </label>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block font-label-md font-semibold text-on-surface mb-2">
              Deadline
            </label>
            <input
              type="date"
              value={form.deadline}
              onChange={(e) => set('deadline', e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-outline-variant bg-surface-container"
            />
          </div>
          <div>
            <label className="block font-label-md font-semibold text-on-surface mb-2">
              Start Date
            </label>
            <input
              type="date"
              value={form.start_date}
              onChange={(e) => set('start_date', e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-outline-variant bg-surface-container"
            />
          </div>
          <div>
            <label className="block font-label-md font-semibold text-on-surface mb-2">
              End Date
            </label>
            <input
              type="date"
              value={form.end_date}
              onChange={(e) => set('end_date', e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-outline-variant bg-surface-container"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3 bg-primary text-on-primary font-label-md font-semibold rounded-lg hover:bg-primary/90 disabled:opacity-60"
        >
          {loading ? 'Creating…' : 'Create Draft'}
        </button>
      </form>
    </div>
  );
};

export default PostInternshipPage;