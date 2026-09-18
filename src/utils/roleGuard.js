import { ROUTES } from '../constants/routes.js';

export const roleDashboard = (role) => {
  switch (role) {
    case 'student':
      return ROUTES.STUDENT.DASHBOARD;
    case 'faculty':
      return ROUTES.FACULTY.DASHBOARD;
    case 'company':
      return ROUTES.COMPANY.DASHBOARD;
    case 'admin':
      return ROUTES.ADMIN.DASHBOARD;
    default:
      return ROUTES.LOGIN;
  }
};

export const extractRole = (session) =>
  session?.user?.user_metadata?.role || null;

export const extractUser = (session) => {
  if (!session?.user) return null;
  const u = session.user;
  return {
    id: u.id,
    email: u.email,
    name: u.user_metadata?.name || u.email?.split('@')[0],
    role: u.user_metadata?.role || null,
    avatar: u.user_metadata?.avatar_url || null,
    academicYear: u.user_metadata?.academic_year || 'AY 2024-25',
    notificationCount: u.user_metadata?.notification_count || 0,
  };
};