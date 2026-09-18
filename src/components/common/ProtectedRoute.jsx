import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../store/AuthContext.jsx';
import { roleDashboard } from '../../utils/roleGuard.js';
import AppLayout from '../../layouts/AppLayout.jsx';
import Skeleton from './Skeleton.jsx';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { role, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  // Wait for /auth/me — never redirect while loading
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Skeleton variant="card" count={2} />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    return <Navigate to={roleDashboard(role)} replace />;
  }

  return <AppLayout>{children}</AppLayout>;
};

export default ProtectedRoute;