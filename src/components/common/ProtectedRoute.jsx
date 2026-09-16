import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../store/AuthContext.jsx';
import { roleDashboard } from '../../constants/routes.js';
import AppLayout from '../../layouts/AppLayout.jsx';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { role, isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    return <Navigate to={roleDashboard(role)} replace />;
  }

  return <AppLayout>{children}</AppLayout>;
};

export default ProtectedRoute;