import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../constants/routes.js';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-surface-container-lowest">
      <div className="w-full max-w-md">
        <div className="bg-surface-container rounded-xl shadow-lg p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-primary-container rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="material-symbols-outlined text-3xl text-primary">lock</span>
            </div>
            <h2 className="font-headline-md text-headline-md font-bold text-on-surface mb-2">Forgot Password?</h2>
            <p className="font-body-md text-body-md text-on-surface-variant">
              {!submitted 
                ? 'Enter your email address and we\'ll send you a link to reset your password.'
                : 'Check your email for a password reset link.'}
            </p>
          </div>

          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block font-label-md text-label-md font-semibold text-on-surface mb-2">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-outline-variant bg-surface-container-low text-on-surface focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Enter your email"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 bg-primary text-on-primary font-label-md text-label-md font-semibold rounded-lg hover:bg-primary/90 transition-colors"
              >
                Send Reset Link
              </button>
            </form>
          ) : (
            <div className="text-center">
              <div className="w-16 h-16 bg-tertiary-container rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="material-symbols-outlined text-3xl text-tertiary">check_circle</span>
              </div>
              <p className="font-body-md text-body-md text-on-surface mb-6">
                We've sent a password reset link to <strong>{email}</strong>
              </p>
              <button
                onClick={() => { setSubmitted(false); setEmail(''); }}
                className="w-full py-3 px-4 bg-surface-container-high text-on-surface font-label-md text-label-md font-semibold rounded-lg hover:bg-surface-container-high/80 transition-colors"
              >
                Send Another Link
              </button>
            </div>
          )}

          <div className="text-center mt-6">
            <Link to={ROUTES.LOGIN} className="text-primary font-label-md text-label-md font-semibold hover:underline">
              Back to Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;