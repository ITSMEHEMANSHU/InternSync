export const ROUTES = {
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  NOTIFICATIONS: '/notifications',
  PROFILE: '/profile',
  NOT_FOUND: '*',

  STUDENT: {
    DASHBOARD: '/student/dashboard',
    PROFILE: '/student/profile',
    INTERNSHIPS: '/student/internships',
    INTERNSHIP_DETAIL: '/student/internships/:id',
    APPLICATIONS: '/student/applications',
    APPLICATION_DETAIL: '/student/applications/:id',
    MY_INTERNSHIP: '/student/my-internship',
    ATTENDANCE: '/student/attendance',
    TASKS: '/student/tasks',
    WEEKLY_REPORTS: '/student/weekly-reports',
    FINAL_REPORT: '/student/final-report',
    CERTIFICATE: '/student/certificate',
  },

  FACULTY: {
    DASHBOARD: '/faculty/dashboard',
    STUDENTS: '/faculty/students',
    STUDENT_DETAIL: '/faculty/students/:id',
    APPROVALS: '/faculty/approvals',
    APPROVAL_DETAIL: '/faculty/approvals/:id',
    DOCUMENTS: '/faculty/documents',
    MENTOR_ASSIGNMENT: '/faculty/mentor-assignment',
    MONITORING: '/faculty/monitoring',
    REPORTS: '/faculty/reports',
    RISK_CENTER: '/faculty/risk-center',
    ANALYTICS: '/faculty/analytics',
  },

  COMPANY: {
    DASHBOARD: '/company/dashboard',
    PROFILE: '/company/profile',
    POST_INTERNSHIP: '/company/post-internship',
    INTERNSHIPS: '/company/internships',
    APPLICANTS: '/company/applicants',
    APPLICANT_DETAIL: '/company/applicants/:id',
    JOINING_VERIFICATION: '/company/joining-verification',
    INTERNS: '/company/interns',
    TASKS: '/company/tasks',
    WEEKLY_REVIEW: '/company/weekly-review',
    EVALUATION: '/company/evaluation',
  },

  ADMIN: {
    DASHBOARD: '/admin/dashboard',
    USERS: '/admin/users',
    DEPARTMENTS: '/admin/departments',
    COMPANY_VERIFICATION: '/admin/company-verification',
    POLICIES: '/admin/policies',
    ACCESS_CONTROL: '/admin/access-control',
    AUDIT_LOGS: '/admin/audit-logs',
    SYSTEM_MONITORING: '/admin/system-monitoring',
  },
};

export const roleDashboard = (role) => ({
  student: ROUTES.STUDENT.DASHBOARD,
  faculty: ROUTES.FACULTY.DASHBOARD,
  company: ROUTES.COMPANY.DASHBOARD,
  admin: ROUTES.ADMIN.DASHBOARD,
}[role] || ROUTES.LOGIN);
