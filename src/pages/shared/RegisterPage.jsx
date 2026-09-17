import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../store/AuthContext.jsx';
import { ROUTES } from '../../constants/routes.js';
import { roleDashboard } from '../../utils/roleGuard.js';
import { ROLES } from '../../constants/roles.js';
import { useToast } from '../../store/ToastContext.jsx';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const toast = useToast();
  const [selectedRole, setSelectedRole] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      const data = await register({
        email: formData.email,
        password: formData.password,
        name: formData.name,
        role: selectedRole,
      });
      toast.success(data?.session ? 'Account created! Welcome to InternSync.' : 'Account created! Please check your email or sign in.');
      navigate(roleDashboard(selectedRole));
    } catch (err) {
      toast.error(err?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const roleCards = [
    { role: ROLES.STUDENT, icon: 'school', title: 'Student', description: 'Apply for internships and track your progress' },
    { role: ROLES.FACULTY, icon: 'supervisor_account', title: 'Faculty', description: 'Monitor students and approve applications' },
    { role: ROLES.COMPANY, icon: 'business', title: 'Company', description: 'Post internships and manage interns' },
    { role: ROLES.ADMIN, icon: 'admin_panel_settings', title: 'Admin', description: 'Manage users and system settings' },
  ];

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary to-sky-600 flex-col justify-center items-center p-12">
        <div className="text-center text-white">
          <h1 className="font-headline-lg text-headline-lg font-bold mb-4">InternSync</h1>
          <p className="font-body-lg text-body-lg opacity-90">AI-Powered Internship Management Platform</p>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-surface-container-lowest">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h2 className="font-headline-md text-headline-md font-bold text-on-surface mb-2">Create Account</h2>
            <p className="font-body-md text-body-md text-on-surface-variant">Choose your role to get started</p>
          </div>

          {!selectedRole ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {roleCards.map((card) => (
                <button
                  key={card.role}
                  onClick={() => setSelectedRole(card.role)}
                  className="p-6 rounded-xl border-2 border-outline-variant hover:border-primary hover:bg-primary-container/5 transition-all text-left"
                >
                  <span className="material-symbols-outlined text-4xl text-primary mb-3">{card.icon}</span>
                  <h3 className="font-label-lg text-label-lg font-semibold text-on-surface mb-1">{card.title}</h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">{card.description}</p>
                </button>
              ))}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <button
                type="button"
                onClick={() => setSelectedRole(null)}
                className="flex items-center gap-2 text-primary font-label-md text-label-md hover:underline mb-2"
              >
                <span className="material-symbols-outlined text-[20px]">arrow_back</span>
                Change Role
              </button>

              <div>
                <label className="block font-label-md font-semibold text-on-surface mb-2">Full Name</label>
                <input name="name" value={formData.name} onChange={handleChange} required className="w-full px-4 py-3 rounded-lg border border-outline-variant bg-surface-container text-on-surface focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>
              <div>
                <label className="block font-label-md font-semibold text-on-surface mb-2">Email</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full px-4 py-3 rounded-lg border border-outline-variant bg-surface-container text-on-surface focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>
              <div>
                <label className="block font-label-md font-semibold text-on-surface mb-2">Password</label>
                <input type="password" name="password" value={formData.password} onChange={handleChange} required minLength={6} className="w-full px-4 py-3 rounded-lg border border-outline-variant bg-surface-container text-on-surface focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>
              <div>
                <label className="block font-label-md font-semibold text-on-surface mb-2">Confirm Password</label>
                <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required minLength={6} className="w-full px-4 py-3 rounded-lg border border-outline-variant bg-surface-container text-on-surface focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-primary text-on-primary font-label-md font-semibold rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-60"
              >
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