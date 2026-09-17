import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../store/AuthContext.jsx';
import { ROUTES } from '../../constants/routes.js';
import { roleDashboard } from '../../utils/roleGuard.js';
import { useToast } from '../../store/ToastContext.jsx';

const LoginPage = () => {
  const { login } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { user } = await login(email, password);
      const role = user?.user_metadata?.role;
      toast.success('Welcome back!');
      navigate(roleDashboard(role));
    } catch (err) {
      toast.error(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary to-secondary flex-col items-center justify-center p-12 text-on-primary">
        <div className="max-w-md text-center">
          <div className="w-16 h-16 rounded-2xl bg-on-primary/20 flex items-center justify-center mx-auto mb-6">
            <span className="material-symbols-outlined text-[36px]">sync_alt</span>
          </div>
          <h1 className="font-headline-xl text-headline-xl font-bold mb-4">InternSync Portal</h1>
          <p className="font-body-lg text-body-lg opacity-80 leading-relaxed">
            AICTE-compliant internship management platform with AI-powered matching, real-time monitoring, and dual-mentor evaluation.
          </p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h2 className="font-headline-lg text-headline-lg font-bold text-on-surface">Welcome back</h2>
            <p className="font-body-md text-body-md text-on-surface-variant mt-1">Sign in to your InternSync account</p>
          </div>

          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-1.5">
              <label className="font-label-md text-label-md font-semibold text-on-surface">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@institution.edu"
                required
                className="h-10 px-3 rounded-lg border border-outline-variant/60 bg-surface-container-low font-body-md text-body-md focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="font-label-md text-label-md font-semibold text-on-surface">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="h-10 px-3 rounded-lg border border-outline-variant/60 bg-surface-container-low font-body-md text-body-md focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="h-10 rounded-lg bg-primary text-on-primary font-label-md text-label-md font-semibold hover:opacity-90 transition-all disabled:opacity-60"
            >
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>

          <div className="flex items-center justify-between mt-4">
            <Link to={ROUTES.FORGOT_PASSWORD} className="text-primary font-label-md text-label-md hover:underline">
              Forgot password?
            </Link>
            <Link to={ROUTES.REGISTER} className="text-primary font-label-md text-label-md hover:underline">
              Create account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;