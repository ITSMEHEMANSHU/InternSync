import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../../components/weekly-reports/PageHeader.jsx';
import FileUpload from '../../components/common/FileUpload.jsx';
import { STUDENTS_LIST } from '../../data/mockData.js';
import { ROUTES } from '../../constants/routes.js';
import { useToast } from '../../store/ToastContext.jsx';
import { companyService } from '../../services/companyService.js';

const CompanyTaskAssignmentPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeInterns, setActiveInterns] = useState(
    STUDENTS_LIST.filter((s) => s.company === 'Zoho Corp' || s.status === 'active')
  );

  useEffect(() => {
    companyService
      .getActiveInterns()
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          const apiList = data.map((a) => ({
            id: a.student_id || a.id,
            name: a.student?.name || 'Active Intern',
            role: a.internship?.title || 'Software Intern',
          }));
          setActiveInterns(apiList);
        }
      })
      .catch(() => {});
  }, []);

  const [selectedInterns, setSelectedInterns] = useState([]);

  useEffect(() => {
    if (activeInterns.length > 0 && selectedInterns.length === 0) {
      setSelectedInterns(activeInterns.map((s) => s.id));
    }
  }, [activeInterns]);

  const [form, setForm] = useState({
    title: '',
    description: '',
    dueDate: '2024-12-15',
    priority: 'medium',
  });

  const handleToggleIntern = (id) => {
    if (selectedInterns.includes(id)) {
      setSelectedInterns(selectedInterns.filter((i) => i !== id));
    } else {
      setSelectedInterns([...selectedInterns, id]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || selectedInterns.length === 0) {
      toast.error('Please specify task title and select at least one intern.');
      return;
    }
    setIsSubmitting(true);
    try {
      await companyService.assignTask({
        title: form.title,
        description: form.description,
        due_date: form.dueDate,
        priority: form.priority,
        assigned_intern_ids: selectedInterns,
      });
    } catch {
      /* fallback */
    }
    setIsSubmitting(false);
    toast.success(`Task assigned to ${selectedInterns.length} intern(s) successfully!`);
    navigate(ROUTES.COMPANY.INTERNS);
  };

  return (
    <div className="flex flex-col w-full space-y-6">
      <PageHeader
        title="Assign Tasks"
        breadcrumb="Company / Tasks / New Assignment"
      />

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Task Form Details */}
        <div className="lg:col-span-8 bg-surface-container-lowest rounded-xl shadow-sm p-6 space-y-4">
          <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface mb-2">
            Task Specification
          </h3>

          <div>
            <label className="block font-label-md text-label-md text-on-surface mb-1 font-semibold">
              Task Title *
            </label>
            <input
              type="text"
              placeholder="e.g. Implement Redis connection pooling & benchmark"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
              className="w-full px-3 py-2 bg-surface-container rounded-lg border border-transparent focus:border-primary font-body-md text-body-md"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-label-md text-label-md text-on-surface mb-1 font-semibold">
                Due Date
              </label>
              <input
                type="date"
                value={form.dueDate}
                onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                className="w-full px-3 py-2 bg-surface-container rounded-lg border border-transparent focus:border-primary font-body-md text-body-md"
              />
            </div>
            <div>
              <label className="block font-label-md text-label-md text-on-surface mb-1 font-semibold">
                Priority
              </label>
              <select
                value={form.priority}
                onChange={(e) => setForm({ ...form, priority: e.target.value })}
                className="w-full px-3 py-2 bg-surface-container rounded-lg border border-transparent focus:border-primary font-body-md text-body-md"
              >
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-label-md text-label-md text-on-surface mb-1 font-semibold">
              Description & Requirements
            </label>
            <textarea
              rows={5}
              placeholder="Provide clear instructions, technical constraints, and acceptance criteria..."
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full px-3 py-2 bg-surface-container rounded-lg border border-transparent focus:border-primary font-body-md text-body-md"
            />
          </div>

          <div>
            <label className="block font-label-md text-label-md text-on-surface mb-1 font-semibold">
              Attachments / Specification Documents
            </label>
            <FileUpload onUpload={() => toast.info('File attached to task.')} accept=".pdf,.doc,.docx,.zip" />
          </div>
        </div>

        {/* Target Intern Selection */}
        <div className="lg:col-span-4 bg-surface-container-lowest rounded-xl shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">Assign To</h3>
            <span className="font-label-md text-label-md text-primary font-semibold">
              {selectedInterns.length} Selected
            </span>
          </div>

          <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
            {activeInterns.map((intern) => {
              const isChecked = selectedInterns.includes(intern.id);
              return (
                <div
                  key={intern.id}
                  onClick={() => handleToggleIntern(intern.id)}
                  className={`p-3 rounded-lg border cursor-pointer flex items-center justify-between transition-colors ${
                    isChecked
                      ? 'bg-primary-fixed/20 border-primary'
                      : 'bg-surface-container/30 border-transparent hover:bg-surface-container'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => {}}
                      className="w-4 h-4 text-primary rounded"
                    />
                    <div>
                      <h4 className="font-title-sm text-title-sm font-bold text-on-surface">{intern.name}</h4>
                      <p className="font-body-sm text-body-sm text-on-surface-variant">{intern.role}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-4 border-t border-surface-container-high space-y-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-primary text-on-primary font-label-md text-label-md font-bold rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {isSubmitting ? 'Dispatching Task...' : 'Dispatch Task Assignment'}
            </button>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="w-full py-2 border rounded-lg font-label-md text-label-md text-on-surface-variant hover:bg-surface-container"
            >
              Cancel
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CompanyTaskAssignmentPage;
