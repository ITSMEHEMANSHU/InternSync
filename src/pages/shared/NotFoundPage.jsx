import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../constants/routes.js';

const NotFoundPage = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-8">
      <div className="text-center max-w-md">
        <div className="w-24 h-24 rounded-3xl bg-surface-container flex items-center justify-center mx-auto mb-6">
          <span className="material-symbols-outlined text-[48px] text-on-surface-variant">search_off</span>
        </div>
        <h1 className="font-headline-xl text-headline-xl font-bold text-on-surface mb-2">404 — Page Not Found</h1>
        <p className="font-body-md text-body-md text-on-surface-variant mb-8">The page you are looking for does not exist or has been moved.</p>
        <button onClick={() => navigate(ROUTES.LOGIN)} className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-primary text-on-primary font-label-md text-label-md font-semibold hover:opacity-90 transition-all">
          <span className="material-symbols-outlined text-[18px]">home</span>
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default NotFoundPage;
