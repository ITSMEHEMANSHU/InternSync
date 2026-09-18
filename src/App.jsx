import { Routes, Route, Navigate } from 'react-router-dom';
import { ROUTES } from './constants/routes.js';
import { ROLES } from './constants/roles.js';
import ProtectedRoute from './components/common/ProtectedRoute.jsx';
import { useAuth } from './store/AuthContext.jsx';
import { roleDashboard } from './utils/roleGuard.js';

// Shared Pages
import LoginPage from './pages/shared/LoginPage.jsx';
import RegisterPage from './pages/shared/RegisterPage.jsx';
import ForgotPasswordPage from './pages/shared/ForgotPasswordPage.jsx';
import NotFoundPage from './pages/shared/NotFoundPage.jsx';
import NotificationsPage from './pages/shared/NotificationsPage.jsx';
import ProfilePage from './pages/shared/ProfilePage.jsx';

// Student Pages
import StudentDashboardPage from './pages/student/DashboardPage.jsx';
import StudentProfilePage from './pages/student/ProfilePage.jsx';
import StudentInternshipsPage from './pages/student/InternshipsPage.jsx';
import StudentInternshipDetailPage from './pages/student/InternshipDetailPage.jsx';
import StudentApplicationsPage from './pages/student/ApplicationsPage.jsx';
import StudentApplicationDetailPage from './pages/student/ApplicationDetailPage.jsx';
import StudentMyInternshipPage from './pages/student/MyInternshipPage.jsx';
import StudentAttendancePage from './pages/student/AttendancePage.jsx';
import StudentTasksPage from './pages/student/TasksPage.jsx';
import StudentWeeklyReportsPage from './pages/student/WeeklyReportsPage.jsx';
import StudentFinalReportPage from './pages/student/FinalReportPage.jsx';
import StudentCertificatePage from './pages/student/CertificatePage.jsx';

// Faculty Pages
import FacultyDashboardPage from './pages/faculty/DashboardPage.jsx';
import FacultyStudentsPage from './pages/faculty/StudentsPage.jsx';
import FacultyStudentDetailPage from './pages/faculty/StudentDetailPage.jsx';
import FacultyApprovalsPage from './pages/faculty/ApprovalsPage.jsx';
import FacultyApprovalDetailPage from './pages/faculty/ApprovalDetailPage.jsx';
import FacultyDocumentsPage from './pages/faculty/DocumentsPage.jsx';
import FacultyMentorAssignmentPage from './pages/faculty/MentorAssignmentPage.jsx';
import FacultyMonitoringPage from './pages/faculty/MonitoringPage.jsx';
import FacultyReportsPage from './pages/faculty/ReportsPage.jsx';
import FacultyRiskCenterPage from './pages/faculty/RiskCenterPage.jsx';
import FacultyAnalyticsPage from './pages/faculty/AnalyticsPage.jsx';

// Company Pages
import CompanyDashboardPage from './pages/company/DashboardPage.jsx';
import CompanyProfilePage from './pages/company/ProfilePage.jsx';
import CompanyPostInternshipPage from './pages/company/PostInternshipPage.jsx';
import CompanyManageInternshipsPage from './pages/company/ManageInternshipsPage.jsx';
import CompanyApplicantsPage from './pages/company/ApplicantsPage.jsx';
import CompanyJoiningVerificationPage from './pages/company/JoiningVerificationPage.jsx';
import CompanyInternsPage from './pages/company/InternsPage.jsx';
import CompanyTaskAssignmentPage from './pages/company/TaskAssignmentPage.jsx';
import CompanyWeeklyReviewPage from './pages/company/WeeklyReviewPage.jsx';
import CompanyEvaluationPage from './pages/company/EvaluationPage.jsx';

// Admin Pages
import AdminDashboardPage from './pages/admin/DashboardPage.jsx';
import AdminUsersPage from './pages/admin/UsersPage.jsx';
import AdminDepartmentsPage from './pages/admin/DepartmentsPage.jsx';
import AdminCompanyVerificationPage from './pages/admin/CompanyVerificationPage.jsx';
import AdminPoliciesPage from './pages/admin/PoliciesPage.jsx';
import AdminAccessControlPage from './pages/admin/AccessControlPage.jsx';
import AdminAuditLogsPage from './pages/admin/AuditLogsPage.jsx';
import AdminSystemMonitoringPage from './pages/admin/SystemMonitoringPage.jsx';

import CompanyApplicantDetailPage from './pages/company/ApplicantDetailPage.jsx';

// Placeholder components for pages not yet built
const PlaceholderPage = ({ title }) => (
  <div className="flex items-center justify-center h-64 text-on-surface-variant font-body-md">
    {title} — Coming Soon
  </div>
);

const RootRedirect = () => {
  const { isAuthenticated, role, loading } = useAuth();
  if (loading) return null;
  if (isAuthenticated && role) {
    return <Navigate to={roleDashboard(role)} replace />;
  }
  return <Navigate to={ROUTES.LOGIN} replace />;
};

const App = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path={ROUTES.LOGIN} element={<LoginPage />} />
      <Route path={ROUTES.REGISTER} element={<RegisterPage />} />
      <Route path={ROUTES.FORGOT_PASSWORD} element={<ForgotPasswordPage />} />

      {/* Student Routes */}
      <Route path={ROUTES.STUDENT.DASHBOARD} element={
        <ProtectedRoute allowedRoles={[ROLES.STUDENT]}>
          <StudentDashboardPage />
        </ProtectedRoute>
      } />
      <Route path={ROUTES.STUDENT.PROFILE} element={
        <ProtectedRoute allowedRoles={[ROLES.STUDENT]}>
          <StudentProfilePage />
        </ProtectedRoute>
      } />
      <Route path={ROUTES.STUDENT.INTERNSHIPS} element={
        <ProtectedRoute allowedRoles={[ROLES.STUDENT]}>
          <StudentInternshipsPage />
        </ProtectedRoute>
      } />
      <Route path={ROUTES.STUDENT.INTERNSHIP_DETAIL} element={
        <ProtectedRoute allowedRoles={[ROLES.STUDENT]}>
          <StudentInternshipDetailPage />
        </ProtectedRoute>
      } />
      <Route path={ROUTES.STUDENT.APPLICATIONS} element={
        <ProtectedRoute allowedRoles={[ROLES.STUDENT]}>
          <StudentApplicationsPage />
        </ProtectedRoute>
      } />
      <Route path={ROUTES.STUDENT.APPLICATION_DETAIL} element={
        <ProtectedRoute allowedRoles={[ROLES.STUDENT]}>
          <StudentApplicationDetailPage />
        </ProtectedRoute>
      } />
      <Route path={ROUTES.STUDENT.MY_INTERNSHIP} element={
        <ProtectedRoute allowedRoles={[ROLES.STUDENT]}>
          <StudentMyInternshipPage />
        </ProtectedRoute>
      } />
      <Route path={ROUTES.STUDENT.ATTENDANCE} element={
        <ProtectedRoute allowedRoles={[ROLES.STUDENT]}>
          <StudentAttendancePage />
        </ProtectedRoute>
      } />
      <Route path={ROUTES.STUDENT.TASKS} element={
        <ProtectedRoute allowedRoles={[ROLES.STUDENT]}>
          <StudentTasksPage />
        </ProtectedRoute>
      } />
      <Route path={ROUTES.STUDENT.WEEKLY_REPORTS} element={
        <ProtectedRoute allowedRoles={[ROLES.STUDENT]}>
          <StudentWeeklyReportsPage />
        </ProtectedRoute>
      } />
      <Route path={ROUTES.STUDENT.FINAL_REPORT} element={
        <ProtectedRoute allowedRoles={[ROLES.STUDENT]}>
          <StudentFinalReportPage />
        </ProtectedRoute>
      } />
      <Route path={ROUTES.STUDENT.CERTIFICATE} element={
        <ProtectedRoute allowedRoles={[ROLES.STUDENT]}>
          <StudentCertificatePage />
        </ProtectedRoute>
      } />

      {/* Faculty Routes */}
      <Route path={ROUTES.FACULTY.DASHBOARD} element={
        <ProtectedRoute allowedRoles={[ROLES.FACULTY]}>
          <FacultyDashboardPage />
        </ProtectedRoute>
      } />
      <Route path={ROUTES.FACULTY.STUDENTS} element={
        <ProtectedRoute allowedRoles={[ROLES.FACULTY]}>
          <FacultyStudentsPage />
        </ProtectedRoute>
      } />
      <Route path={ROUTES.FACULTY.STUDENT_DETAIL} element={
        <ProtectedRoute allowedRoles={[ROLES.FACULTY]}>
          <FacultyStudentDetailPage />
        </ProtectedRoute>
      } />
      <Route path={ROUTES.FACULTY.APPROVALS} element={
        <ProtectedRoute allowedRoles={[ROLES.FACULTY]}>
          <FacultyApprovalsPage />
        </ProtectedRoute>
      } />
      <Route path={ROUTES.FACULTY.APPROVAL_DETAIL} element={
        <ProtectedRoute allowedRoles={[ROLES.FACULTY]}>
          <FacultyApprovalDetailPage />
        </ProtectedRoute>
      } />
      <Route path={ROUTES.FACULTY.DOCUMENTS} element={
        <ProtectedRoute allowedRoles={[ROLES.FACULTY]}>
          <FacultyDocumentsPage />
        </ProtectedRoute>
      } />
      <Route path={ROUTES.FACULTY.MENTOR_ASSIGNMENT} element={
        <ProtectedRoute allowedRoles={[ROLES.FACULTY]}>
          <FacultyMentorAssignmentPage />
        </ProtectedRoute>
      } />
      <Route path={ROUTES.FACULTY.MONITORING} element={
        <ProtectedRoute allowedRoles={[ROLES.FACULTY]}>
          <FacultyMonitoringPage />
        </ProtectedRoute>
      } />
      <Route path={ROUTES.FACULTY.REPORTS} element={
        <ProtectedRoute allowedRoles={[ROLES.FACULTY]}>
          <FacultyReportsPage />
        </ProtectedRoute>
      } />
      <Route path={ROUTES.FACULTY.RISK_CENTER} element={
        <ProtectedRoute allowedRoles={[ROLES.FACULTY]}>
          <FacultyRiskCenterPage />
        </ProtectedRoute>
      } />
      <Route path={ROUTES.FACULTY.ANALYTICS} element={
        <ProtectedRoute allowedRoles={[ROLES.FACULTY]}>
          <FacultyAnalyticsPage />
        </ProtectedRoute>
      } />

      {/* Company Routes */}
      <Route path={ROUTES.COMPANY.DASHBOARD} element={
        <ProtectedRoute allowedRoles={[ROLES.COMPANY]}>
          <CompanyDashboardPage />
        </ProtectedRoute>
      } />
      <Route path={ROUTES.COMPANY.PROFILE} element={
        <ProtectedRoute allowedRoles={[ROLES.COMPANY]}>
          <CompanyProfilePage />
        </ProtectedRoute>
      } />
      <Route path={ROUTES.COMPANY.POST_INTERNSHIP} element={
        <ProtectedRoute allowedRoles={[ROLES.COMPANY]}>
          <CompanyPostInternshipPage />
        </ProtectedRoute>
      } />
      <Route path={ROUTES.COMPANY.INTERNSHIPS} element={
        <ProtectedRoute allowedRoles={[ROLES.COMPANY]}>
          <CompanyManageInternshipsPage />
        </ProtectedRoute>
      } />
      <Route path={ROUTES.COMPANY.APPLICANTS} element={
        <ProtectedRoute allowedRoles={[ROLES.COMPANY]}>
          <CompanyApplicantsPage />
        </ProtectedRoute>
      } />
      <Route path={ROUTES.COMPANY.APPLICANT_DETAIL} element={
        <ProtectedRoute allowedRoles={[ROLES.COMPANY]}>
          <CompanyApplicantDetailPage />
        </ProtectedRoute>
      } />
      <Route path={ROUTES.COMPANY.JOINING_VERIFICATION} element={
        <ProtectedRoute allowedRoles={[ROLES.COMPANY]}>
          <CompanyJoiningVerificationPage />
        </ProtectedRoute>
      } />
      <Route path={ROUTES.COMPANY.INTERNS} element={
        <ProtectedRoute allowedRoles={[ROLES.COMPANY]}>
          <CompanyInternsPage />
        </ProtectedRoute>
      } />
      <Route path={ROUTES.COMPANY.TASKS} element={
        <ProtectedRoute allowedRoles={[ROLES.COMPANY]}>
          <CompanyTaskAssignmentPage />
        </ProtectedRoute>
      } />
      <Route path={ROUTES.COMPANY.WEEKLY_REVIEW} element={
        <ProtectedRoute allowedRoles={[ROLES.COMPANY]}>
          <CompanyWeeklyReviewPage />
        </ProtectedRoute>
      } />
      <Route path={ROUTES.COMPANY.EVALUATION} element={
        <ProtectedRoute allowedRoles={[ROLES.COMPANY]}>
          <CompanyEvaluationPage />
        </ProtectedRoute>
      } />

      {/* Admin Routes */}
      <Route path={ROUTES.ADMIN.DASHBOARD} element={
        <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
          <AdminDashboardPage />
        </ProtectedRoute>
      } />
      <Route path={ROUTES.ADMIN.USERS} element={
        <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
          <AdminUsersPage />
        </ProtectedRoute>
      } />
      <Route path={ROUTES.ADMIN.DEPARTMENTS} element={
        <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
          <AdminDepartmentsPage />
        </ProtectedRoute>
      } />
      <Route path={ROUTES.ADMIN.COMPANY_VERIFICATION} element={
        <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
          <AdminCompanyVerificationPage />
        </ProtectedRoute>
      } />
      <Route path={ROUTES.ADMIN.POLICIES} element={
        <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
          <AdminPoliciesPage />
        </ProtectedRoute>
      } />
      <Route path={ROUTES.ADMIN.ACCESS_CONTROL} element={
        <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
          <AdminAccessControlPage />
        </ProtectedRoute>
      } />
      <Route path={ROUTES.ADMIN.AUDIT_LOGS} element={
        <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
          <AdminAuditLogsPage />
        </ProtectedRoute>
      } />
      <Route path={ROUTES.ADMIN.SYSTEM_MONITORING} element={
        <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
          <AdminSystemMonitoringPage />
        </ProtectedRoute>
      } />

      {/* Shared Routes */}
      <Route path={ROUTES.NOTIFICATIONS} element={
        <ProtectedRoute>
          <NotificationsPage />
        </ProtectedRoute>
      } />
      <Route path={ROUTES.PROFILE} element={
        <ProtectedRoute>
          <ProfilePage />
        </ProtectedRoute>
      } />

      {/* 404 */}
      <Route path={ROUTES.NOT_FOUND} element={<NotFoundPage />} />
      
      {/* Default redirect */}
      <Route path="/" element={<RootRedirect />} />
    </Routes>
  );
};

export default App;
