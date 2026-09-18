import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../store/AuthContext.jsx';
import { ROUTES } from '../../constants/routes.js';
import { roleDashboard } from '../../utils/roleGuard.js';
import { ROLES } from '../../constants/roles.js';
import { useToast } from '../../store/ToastContext.jsx';
import { useInstitutes } from '../../hooks/useInstitutes.js';
import SearchableSelect from '../../components/common/SearchableSelect.jsx';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const { toast } = useToast();
  const { institutes, loading: instLoading } = useInstitutes();

  const [step, setStep] = useState(1);
  const [selectedRole, setSelectedRole] = useState(null);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '', email: '', password: '', confirmPassword: '',
    institute_id: '',
    roll_no: '', branch: '', semester: '', cgpa: '',
    department: '', designation: '',
    company_name: '', company_email: '', company_website: '',
    company_industry: '', company_location: '',
    hr_spoc_name: '', hr_spoc_email: '', hr_spoc_phone: '',
  });

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if ((selectedRole === ROLES.STUDENT || selectedRole === ROLES.FACULTY) && !form.institute_id) {
      toast.error('Please select your institute');
      return;
    }

    setLoading(true);
    try {
      const metadata = {};
      if (form.institute_id) metadata.institute_id = form.institute_id;

      if (selectedRole === ROLES.STUDENT) {
        Object.assign(metadata, {
          roll_no: form.roll_no,
          branch: form.branch,
          semester: form.semester,
          cgpa: form.cgpa,
        });
      } else if (selectedRole === ROLES.FACULTY) {
        Object.assign(metadata, {
          department: form.department,
          designation: form.designation,
        });
      } else if (selectedRole === ROLES.COMPANY) {
        Object.assign(metadata, {
          company_name: form.company_name,
          company_email: form.company_email,
          company_website: form.company_website,
          company_industry: form.company_industry,
          company_location: form.company_location,
          hr_spoc_name: form.hr_spoc_name || form.name,
          hr_spoc_email: form.hr_spoc_email || form.email,
          hr_spoc_phone: form.hr_spoc_phone,
        });
      }

      const data = await register({
        email: form.email,
        password: form.password,
        name: form.name,
        role: selectedRole,
        metadata,
      });

      if (selectedRole === ROLES.FACULTY || selectedRole === ROLES.COMPANY) {
        toast.success('Account created! Awaiting admin approval. Please log in.');
        navigate(ROUTES.LOGIN);
      } else if (!data?.session) {
        toast.success('Account created successfully! Please log in to your account.');
        navigate(ROUTES.LOGIN);
      } else {
        toast.success('Account created successfully!');
        navigate(roleDashboard(selectedRole));
      }
    } catch (err) {
      toast.error(err?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const roleCards = [
    { role: ROLES.STUDENT, icon: 'school', title: 'Student', description: 'Apply for internships' },
    { role: ROLES.FACULTY, icon: 'supervisor_account', title: 'Faculty / TPO', description: 'Approve and monitor students' },
    { role: ROLES.COMPANY, icon: 'business', title: 'Company', description: 'Post internships and mentor' },
  ];

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary to-sky-600 flex-col justify-center items-center p-12">
        <div className="text-center text-white">
          <h1 className="font-headline-lg font-bold mb-4">InternSync</h1>
          <p className="font-body-lg opacity-90">AI-Powered Internship Management</p>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-surface-container-lowest overflow-y-auto">
        <div className="w-full max-w-lg">
          <div className="text-center mb-8">
            <h2 className="font-headline-md font-bold text-on-surface mb-2">Create Account</h2>
            <p className="font-body-md text-on-surface-variant">
              {step === 1 ? 'Choose your role' : `Registering as ${selectedRole}`}
            </p>
          </div>

          {step === 1 && (
            <div className="grid grid-cols-1 gap-4">
              {roleCards.map((card) => (
                <button
                  key={card.role}
                  onClick={() => { setSelectedRole(card.role); setStep(2); }}
                  className="p-6 rounded-xl border-2 border-outline-variant hover:border-primary hover:bg-primary-container/5 transition-all text-left flex items-center gap-4"
                >
                  <span className="material-symbols-outlined text-4xl text-primary">{card.icon}</span>
                  <div>
                    <h3 className="font-label-lg font-semibold text-on-surface mb-1">{card.title}</h3>
                    <p className="font-body-sm text-on-surface-variant">{card.description}</p>
                  </div>
                </button>
              ))}
            </div>
          )}

          {step === 2 && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex items-center gap-2 text-primary font-label-md hover:underline mb-2"
              >
                <span className="material-symbols-outlined text-[20px]">arrow_back</span>
                Change Role
              </button>

              <div>
                <label className="block font-label-md font-semibold text-on-surface mb-2">Full Name</label>
                <input value={form.name} onChange={(e) => set('name', e.target.value)} required
                  className="w-full px-4 py-3 rounded-lg border border-outline-variant bg-surface-container" />
              </div>
              <div>
                <label className="block font-label-md font-semibold text-on-surface mb-2">Email</label>
                <input type="email" value={form.email} onChange={(e) => set('email', e.target.value)} required
                  className="w-full px-4 py-3 rounded-lg border border-outline-variant bg-surface-container" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-label-md font-semibold text-on-surface mb-2">Password</label>
                  <input type="password" value={form.password} onChange={(e) => set('password', e.target.value)} required minLength={6}
                    className="w-full px-4 py-3 rounded-lg border border-outline-variant bg-surface-container" />
                </div>
                <div>
                  <label className="block font-label-md font-semibold text-on-surface mb-2">Confirm</label>
                  <input type="password" value={form.confirmPassword} onChange={(e) => set('confirmPassword', e.target.value)} required minLength={6}
                    className="w-full px-4 py-3 rounded-lg border border-outline-variant bg-surface-container" />
                </div>
              </div>

              {(selectedRole === ROLES.STUDENT || selectedRole === ROLES.FACULTY) && (
                <div>
                  <label className="block font-label-md font-semibold text-on-surface mb-2">
                    Institute
                  </label>
                  <SearchableSelect
                    options={institutes.map((i) => ({
                      value: i.id,
                      label: i.name,
                      sublabel: [i.city, i.state].filter(Boolean).join(', '),
                    }))}
                    value={form.institute_id}
                    onChange={(v) => set('institute_id', v)}
                    placeholder={instLoading ? 'Loading institutes…' : 'Search your institute…'}
                    disabled={instLoading}
                    emptyMessage="No institutes found"
                  />
                  {!instLoading && institutes.length === 0 && (
                    <p className="text-xs text-on-surface-variant mt-1">
                      No institutes yet. Contact admin.
                    </p>
                  )}
                </div>
              )}

              {selectedRole === ROLES.STUDENT && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block font-label-md font-semibold text-on-surface mb-2">Roll No</label>
                      <input value={form.roll_no} onChange={(e) => set('roll_no', e.target.value)} required
                        className="w-full px-4 py-3 rounded-lg border border-outline-variant bg-surface-container" />
                    </div>
                    <div>
                      <label className="block font-label-md font-semibold text-on-surface mb-2">Branch</label>
                      <input value={form.branch} onChange={(e) => set('branch', e.target.value)} required placeholder="CSE"
                        className="w-full px-4 py-3 rounded-lg border border-outline-variant bg-surface-container" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block font-label-md font-semibold text-on-surface mb-2">Semester</label>
                      <input type="number" min="1" max="12" value={form.semester} onChange={(e) => set('semester', e.target.value)} required
                        className="w-full px-4 py-3 rounded-lg border border-outline-variant bg-surface-container" />
                    </div>
                    <div>
                      <label className="block font-label-md font-semibold text-on-surface mb-2">CGPA</label>
                      <input type="number" step="0.01" min="0" max="10" value={form.cgpa} onChange={(e) => set('cgpa', e.target.value)} required
                        className="w-full px-4 py-3 rounded-lg border border-outline-variant bg-surface-container" />
                    </div>
                  </div>
                </>
              )}

              {selectedRole === ROLES.FACULTY && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-label-md font-semibold text-on-surface mb-2">Department</label>
                    <input value={form.department} onChange={(e) => set('department', e.target.value)} required placeholder="CSE"
                      className="w-full px-4 py-3 rounded-lg border border-outline-variant bg-surface-container" />
                  </div>
                  <div>
                    <label className="block font-label-md font-semibold text-on-surface mb-2">Designation</label>
                    <input value={form.designation} onChange={(e) => set('designation', e.target.value)} required placeholder="HoD / TPO"
                      className="w-full px-4 py-3 rounded-lg border border-outline-variant bg-surface-container" />
                  </div>
                </div>
              )}

              {selectedRole === ROLES.COMPANY && (
                <>
                  <div>
                    <label className="block font-label-md font-semibold text-on-surface mb-2">Company Name</label>
                    <input value={form.company_name} onChange={(e) => set('company_name', e.target.value)} required
                      className="w-full px-4 py-3 rounded-lg border border-outline-variant bg-surface-container" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block font-label-md font-semibold text-on-surface mb-2">Company Email</label>
                      <input type="email" value={form.company_email} onChange={(e) => set('company_email', e.target.value)} required
                        className="w-full px-4 py-3 rounded-lg border border-outline-variant bg-surface-container" />
                    </div>
                    <div>
                      <label className="block font-label-md font-semibold text-on-surface mb-2">Website</label>
                      <input value={form.company_website} onChange={(e) => set('company_website', e.target.value)}
                        className="w-full px-4 py-3 rounded-lg border border-outline-variant bg-surface-container" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block font-label-md font-semibold text-on-surface mb-2">Industry</label>
                      <input value={form.company_industry} onChange={(e) => set('company_industry', e.target.value)} required placeholder="Software"
                        className="w-full px-4 py-3 rounded-lg border border-outline-variant bg-surface-container" />
                    </div>
                    <div>
                      <label className="block font-label-md font-semibold text-on-surface mb-2">Location</label>
                      <input value={form.company_location} onChange={(e) => set('company_location', e.target.value)} required
                        className="w-full px-4 py-3 rounded-lg border border-outline-variant bg-surface-container" />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block font-label-md font-semibold text-on-surface mb-2">HR Name</label>
                      <input value={form.hr_spoc_name} onChange={(e) => set('hr_spoc_name', e.target.value)}
                        className="w-full px-4 py-3 rounded-lg border border-outline-variant bg-surface-container" />
                    </div>
                    <div>
                      <label className="block font-label-md font-semibold text-on-surface mb-2">HR Email</label>
                      <input type="email" value={form.hr_spoc_email} onChange={(e) => set('hr_spoc_email', e.target.value)}
                        className="w-full px-4 py-3 rounded-lg border border-outline-variant bg-surface-container" />
                    </div>
                    <div>
                      <label className="block font-label-md font-semibold text-on-surface mb-2">HR Phone</label>
                      <input value={form.hr_spoc_phone} onChange={(e) => set('hr_spoc_phone', e.target.value)}
                        className="w-full px-4 py-3 rounded-lg border border-outline-variant bg-surface-container" />
                    </div>
                  </div>
                </>
              )}

              <button type="submit" disabled={loading}
                className="w-full py-3 bg-primary text-on-primary font-label-md font-semibold rounded-lg hover:bg-primary/90 disabled:opacity-60">
                {loading ? 'Creating…' : 'Create Account'}
              </button>

              <div className="text-center mt-4">
                <span className="font-body-md text-on-surface-variant">Already have an account? </span>
                <Link to={ROUTES.LOGIN} className="text-primary font-label-md font-semibold hover:underline">
                  Sign In
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;