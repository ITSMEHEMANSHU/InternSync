import { supabase } from './supabase.js';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';

export const request = async (endpoint, options = {}) => {
  const { data: { session } } = await supabase.auth.getSession();

  const headers = {
    'Content-Type': 'application/json',
    ...(session?.access_token && {
      Authorization: `Bearer ${session.access_token}`,
    }),
    ...options.headers,
  };

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    const errBody = await res.json().catch(() => ({}));
    throw new Error(errBody.detail || `API Error: ${res.status}`);
  }

  return res.json();
};

export const weeklyReportsService = {
  getAll: (studentId) => request(`/students/${studentId}/weekly-reports`),
  getDraft: (studentId, week) => request(`/students/${studentId}/weekly-reports/draft/${week}`),
  saveDraft: (studentId, data) => request(`/students/${studentId}/weekly-reports/draft`, { method: 'POST', body: JSON.stringify(data) }),
  submit: (studentId, week, data) => request(`/students/${studentId}/weekly-reports/${week}/submit`, { method: 'POST', body: JSON.stringify(data) }),
  getAiAudit: (studentId, week) => request(`/students/${studentId}/weekly-reports/${week}/ai-audit`),
  export: (studentId) => request(`/students/${studentId}/weekly-reports/export`),
};

export const studentService = {
  getProfile: (id) => request(`/students/${id}/profile`),
  updateProfile: (id, data) => request(`/students/${id}/profile`, { method: 'PUT', body: JSON.stringify(data) }),
  getKpiMetrics: (id) => request(`/students/${id}/kpi-metrics`),
  getCompetencyIndex: (id) => request(`/students/${id}/competency-index`),
  uploadResume: (id, file) => request(`/students/${id}/resume`, { method: 'POST', body: file }),
  getCertificate: (id) => request(`/students/${id}/certificate`),
};

export const internshipService = {
  getAll: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/internships${qs ? `?${qs}` : ''}`);
  },
  getById: (id) => request(`/internships/${id}`),
  apply: (id, data) =>
    request(`/internships/${id}/apply`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};

export const applicationService = {
  getMyApplications: () => request(`/applications/my`),
  getById: (id) => request(`/applications/${id}`),
};

export const attendanceService = {
  getMonthly: (studentId, month) => request(`/students/${studentId}/attendance?month=${month}`),
  markToday: (studentId, data) => request(`/students/${studentId}/attendance`, { method: 'POST', body: JSON.stringify(data) }),
};

export const taskService = {
  getAll: (studentId) => request(`/students/${studentId}/tasks`),
  updateStatus: (id, status) => request(`/tasks/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
  addLog: (id, data) => request(`/tasks/${id}/logs`, { method: 'POST', body: JSON.stringify(data) }),
};

export const facultyService = {
  getInternshipApprovals: () => request('/faculty/internship-approvals'),
  approveInternship: (id) =>
    request(`/faculty/internship-approvals/${id}/approve`, { method: 'POST' }),
  rejectInternship: (id, reason) =>
    request(`/faculty/internship-approvals/${id}/reject`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    }),
};

export const companyService = {
  getProfile: (id) => request(`/companies/${id}/profile`),
  updateProfile: (id, d) => request(`/companies/${id}/profile`, { method: 'PUT', body: JSON.stringify(d) }),
  getInternships: (id) => request(`/companies/${id}/internships`),
  postInternship: (id, d) => request(`/companies/${id}/internships`, { method: 'POST', body: JSON.stringify(d) }),
  getApplicants: (id) => request(`/companies/${id}/applicants`),
  updateApplicant: (id, d) => request(`/applicants/${id}`, { method: 'PATCH', body: JSON.stringify(d) }),
  getInterns: (id) => request(`/companies/${id}/interns`),
  assignTask: (d) => request(`/tasks`, { method: 'POST', body: JSON.stringify(d) }),
  getWeeklyReports: (id) => request(`/companies/${id}/weekly-reports`),
  submitEvaluation: (internId, d) => request(`/interns/${internId}/evaluation`, { method: 'POST', body: JSON.stringify(d) }),
};

export const adminService = {
  getUsers: (params) => request(`/admin/users?${new URLSearchParams(params)}`),
  updateUser: (id, d) => request(`/admin/users/${id}`, { method: 'PATCH', body: JSON.stringify(d) }),
  getDepartments: () => request(`/admin/departments`),
  saveDepartment: (d) => request(`/admin/departments`, { method: 'POST', body: JSON.stringify(d) }),
  getPendingCompanies: () => request(`/admin/companies/pending`),
  verifyCompany: (id, d) => request(`/admin/companies/${id}/verify`, { method: 'POST', body: JSON.stringify(d) }),
  getPolicies: () => request(`/admin/policies`),
  savePolicies: (d) => request(`/admin/policies`, { method: 'PUT', body: JSON.stringify(d) }),
  getAuditLogs: (params) => request(`/admin/audit-logs?${new URLSearchParams(params)}`),
  getSystemHealth: () => request(`/admin/system/health`),
};

export const notificationService = {
  getAll: (userId) => request(`/users/${userId}/notifications`),
  markRead: (id) => request(`/notifications/${id}/read`, { method: 'PATCH' }),
  markAllRead: (userId) => request(`/users/${userId}/notifications/read-all`, { method: 'PATCH' }),
};
