import { ROUTES } from '../constants/routes.js';

export const roleDashboard = (role) => {
  switch (role) {
    case 'student': return ROUTES.STUDENT.DASHBOARD;
    case 'faculty': return ROUTES.FACULTY.DASHBOARD;
    case 'company': return ROUTES.COMPANY.DASHBOARD;
    case 'admin': return ROUTES.ADMIN.DASHBOARD;
    default: return ROUTES.LOGIN;
  }
};