import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../../components/weekly-reports/PageHeader.jsx';
import { ROUTES } from '../../constants/routes.js';
import { useToast } from '../../store/ToastContext.jsx';

const CompanyPostInternshipPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPreview, setIsPreview] = useState(false);

  const [form, setForm] = useState({
    title: '',
    description: '',
    skills: '',
    duration: '6 months',
    stipend: 25000,
    location: 'Chennai, TN',
    remote: false,
    deadline: '2024-12-31',
  });

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm({ ...form, [e.target.name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title || !form.description) {
      toast.error('Please complete all required fields.');
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success('Internship opportunity published successfully!');
      navigate(ROUTES.COMPANY.INTERNSHIPS);
    }, 600);
  };

  return (
    <div className="flex flex-col w-full space-y-6">
      <PageHeader
        title="Post New Internship"
        breadcrumb="Company / Internships / New"
        actions={[
          {
            label: isPreview ? 'Edit Form' : 'Preview Listing',
            onClick: () => setIsPreview(!isPreview),
            variant: 'outline',
          },
        ]}
      />

      {isPreview ? (
        <div className="bg-surface-container-lowest rounded-xl shadow-sm p-6 space-y-6">
          <div className="border-b border-surface-container-high pb-4">
            <span className="text-xs uppercase font-bold tracking-wider text-primary">Preview Mode</span>
            <h2 className="font-headline-md text-headline-md font-bold text-on-surface mt-1">{form.title || 'Untitled Role'}</h2>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Zoho Corp • {form.location} {form.remote ? '(Remote Allowed)' : ''} • {form.duration} • ₹{Number(form.stipend).toLocaleString('en-IN')}/mo
            </p>
          </div>
          <div>
            <h4 className="font-title-md text-title-md font-bold text-on-surface mb-2">Job Description</h4>
            <p className="font-body-md text-body-md text-on-surface-variant whitespace-pre-line">{form.description || 'No description provided.'}</p>
          </div>
          <div>
            <h4 className="font-title-md text-title-md font-bold text-on-surface mb-2">Required Skills</h4>
            <div className="flex flex-wrap gap-2">
              {form.skills.split(',').map((skill, idx) => (
                <span key={idx} className="px-3 py-1 bg-surface-container-high rounded-full font-label-md text-label-md text-on-surface">
                  {skill.trim() || 'Skill'}
                </span>
              ))}
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <button
              onClick={() => setIsPreview(false)}
              className="px-4 py-2 border rounded-lg font-label-md text-label-md text-on-surface-variant hover:bg-surface-container"
            >
              Back to Editing
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-6 py-2 bg-primary text-on-primary font-label-md text-label-md font-bold rounded-lg hover:bg-primary/90"
            >
              Publish Now
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-surface-container-lowest rounded-xl shadow-sm p-6 space-y-4">
          <div>
            <label className="block font-label-md text-label-md text-on-surface mb-1 font-semibold">
              Internship Title *
            </label>
            <input
              type="text"
              name="title"
              placeholder="e.g. Backend Engineer Intern"
              value={form.title}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 bg-surface-container rounded-lg border border-transparent focus:border-primary font-body-md text-body-md"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-label-md text-label-md text-on-surface mb-1">Duration</label>
              <select
                name="duration"
                value={form.duration}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-surface-container rounded-lg border border-transparent focus:border-primary font-body-md text-body-md"
              >
                <option value="3 months">3 months</option>
                <option value="6 months">6 months</option>
                <option value="12 months">12 months</option>
              </select>
            </div>
            <div>
              <label className="block font-label-md text-label-md text-on-surface mb-1">Monthly Stipend (₹)</label>
              <input
                type="number"
                name="stipend"
                value={form.stipend}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-surface-container rounded-lg border border-transparent focus:border-primary font-body-md text-body-md"
              />
            </div>
            <div>
              <label className="block font-label-md text-label-md text-on-surface mb-1">Location</label>
              <input
                type="text"
                name="location"
                value={form.location}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-surface-container rounded-lg border border-transparent focus:border-primary font-body-md text-body-md"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="remote"
              name="remote"
              checked={form.remote}
              onChange={handleChange}
              className="w-4 h-4 text-primary rounded"
            />
            <label htmlFor="remote" className="font-body-md text-body-md text-on-surface">
              Allow Remote / Work-From-Home
            </label>
          </div>

          <div>
            <label className="block font-label-md text-label-md text-on-surface mb-1">
              Required Skills (comma-separated)
            </label>
            <input
              type="text"
              name="skills"
              placeholder="e.g. Go, Redis, Docker, gRPC"
              value={form.skills}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-surface-container rounded-lg border border-transparent focus:border-primary font-body-md text-body-md"
            />
          </div>

          <div>
            <label className="block font-label-md text-label-md text-on-surface mb-1 font-semibold">
              Detailed Description *
            </label>
            <textarea
              name="description"
              rows={6}
              placeholder="Describe roles, responsibilities, project scope, and learning opportunities..."
              value={form.description}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 bg-surface-container rounded-lg border border-transparent focus:border-primary font-body-md text-body-md"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-4 py-2 border rounded-lg font-label-md text-label-md text-on-surface-variant hover:bg-surface-container"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-primary text-on-primary font-label-md text-label-md font-bold rounded-lg hover:bg-primary/90 disabled:opacity-50"
            >
              {isSubmitting ? 'Publishing...' : 'Publish Internship'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default CompanyPostInternshipPage;
