import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../constants/routes.js';
import { useAuth } from '../../store/AuthContext.jsx';
import { useToast } from '../../store/ToastContext.jsx';

const ForgotPasswordPage = () => {
  const { resetPassword } = useAuth();
  const toast = useToast();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await resetPassword(email);
      setSubmitted(true);
    } catch (err) {
      toast.error(err.message || 'Failed to send reset link');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-surface-container-lowest">
      <div className="w-full max-w-md">
        <div className="bg-surface-container rounded-xl shadow-lg p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-primary-container rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="material-symbols-outlined text-3xl text-primary">lock</span>
            </div>
            <h2 className="font-headline-md font-bold text-on-surface mb-2">Forgot Password?</h2>
            <p className="font-body-md text-on-surface-variant">
              {!submitted
                ? "Enter your email and we'll send a reset link."
                : 'Check your email for the reset link.'}
            </p>
          </div>

          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block font-label-md font-semibold text-on-surface mb-2">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-outline-variant bg-surface-container-low text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-primary text-on-primary font-label-md font-semibold rounded-lg hover:bg-primary/90 disabled:opacity-60"
              >
                {loading ? 'Sending…' : 'Send Reset Link'}
              </button>
            </form>
          ) : (
            <div className="text-center">
              <div className="w-16 h-16 bg-tertiary-container rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="material-symbols-outlined text-3xl text-tertiary">check_circle</span>
              </div>
              <p className="font-body-md text-on-surface mb-6">
                Sent to <strong>{email}</strong>
              </p>
              <button
                onClick={() => { setSubmitted(false); setEmail(''); }}
                className="w-full py-3 bg-surface-container-high text-on-surface font-label-md font-semibold rounded-lg"
              >
                Send Another
              </button>
            </div>
          )}

          <div className="text-center mt-6">
            <Link to={ROUTES.LOGIN} className="text-primary font-label-md font-semibold hover:underline">
              Back to Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;