import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../store/AuthContext.jsx';
import { ROUTES, roleDashboard } from '../../constants/routes.js';
import { ROLES } from '../../constants/roles.js';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [selectedRole, setSelectedRole] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // For demo, just login with selected role
    login(selectedRole);
    navigate(roleDashboard(selectedRole));
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const roleCards = [
    { role: ROLES.STUDENT, icon: 'school', title: 'Student', description: 'Apply for internships and track your progress' },
    { role: ROLES.FACULTY, icon: 'supervisor_account', title: 'Faculty', description: 'Monitor students and approve applications' },
    { role: ROLES.COMPANY, icon: 'business', title: 'Company', description: 'Post internships and manage interns' },
    { role: ROLES.ADMIN, icon: 'admin_panel_settings', title: 'Admin', description: 'Manage users and system settings' },
  ];

  return (
    <div className="min-h-screen flex">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary to-sky-600 flex-col justify-center items-center p-12">
        <div className="text-center text-white">
          <h1 className="font-headline-lg text-headline-lg font-bold mb-4">InternSync</h1>
          <p className="font-body-lg text-body-lg opacity-90">AI-Powered Internship Management Platform</p>
          <div className="mt-8 flex justify-center gap-4">
            <span className="material-symbols-outlined text-6xl opacity-80">auto_awesome</span>
            <span className="material-symbols-outlined text-6xl opacity-80">verified</span>
            <span className="material-symbols-outlined text-6xl opacity-80">groups</span>
          </div>
        </div>
      </div>

      {/* Right Panel */}
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
                  onClick={() => handleRoleSelect(card.role)}
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
              <div className="mb-6">
                <button
                  type="button"
                  onClick={() => setSelectedRole(null)}
                  className="flex items-center gap-2 text-primary font-label-md text-label-md hover:underline"
                >
                  <span className="material-symbols-outlined text-[20px]">arrow_back</span>
                  Change Role
                </button>
              </div>

              <div>
                <label className="block font-label-md text-label-md font-semibold text-on-surface mb-2">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-outline-variant bg-surface-container text-on-surface focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div>
                <label className="block font-label-md text-label-md font-semibold text-on-surface mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-outline-variant bg-surface-container text-on-surface focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div>
                <label className="block font-label-md text-label-md font-semibold text-on-surface mb-2">Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-outline-variant bg-surface-container text-on-surface focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Create a password"
                  required
                />
              </div>

              <div>
                <label className="block font-label-md text-label-md font-semibold text-on-surface mb-2">Confirm Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-outline-variant bg-surface-container text-on-surface focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Confirm your password"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 bg-primary text-on-primary font-label-md text-label-md font-semibold rounded-lg hover:bg-primary/90 transition-colors"
              >
                Create Account
              </button>

              <div className="text-center mt-6">
                <span className="font-body-md text-body-md text-on-surface-variant">Already have an account? </span>
                <Link to={ROUTES.LOGIN} className="text-primary font-label-md text-label-md font-semibold hover:underline">
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