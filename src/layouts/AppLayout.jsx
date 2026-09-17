import { Outlet } from 'react-router-dom';
import Header from '../components/layout/Header.jsx';
import Sidebar from '../components/layout/Sidebar.jsx';
import { useAuth } from '../store/AuthContext.jsx';

const AppLayout = ({ children }) => {
  const { user, role } = useAuth();

  const needsApproval =
    (role === 'faculty' || role === 'company') && user?.status === 'inactive';

  return (
    <div className="bg-background font-body-md text-body-md text-on-surface antialiased min-h-screen">
      <Header />
      <Sidebar />
      <div className="pl-60 min-h-screen flex flex-col">
        <main className="pt-16 flex-1 w-full bg-background">
          {needsApproval && (
            <div className="bg-error-container text-on-error-container px-6 py-3 flex items-center gap-3 border-b border-error/30">
              <span className="material-symbols-outlined">pending</span>
              <div>
                <p className="font-label-md font-semibold">Account pending approval</p>
                <p className="font-body-sm">
                  Your account is under review by an administrator. You'll get access once approved.
                </p>
              </div>
            </div>
          )}
          <div className="max-w-7xl mx-auto px-space-lg py-space-md">
            {children || <Outlet />}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AppLayout;