import { request } from './api.js';

export const facultyService = {
  getPendingApplications: () => request('/faculty/applications'),
  getAllApplications: () => request('/faculty/applications/all'),
  getApplicationDetail: (id) => request(`/faculty/applications/${id}`),
  approveApplication: (id) =>
    request(`/faculty/applications/${id}/approve`, { method: 'POST' }),
  rejectApplication: (id, reason) =>
    request(`/faculty/applications/${id}/reject`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    }),
  getInternshipApprovals: () => request('/faculty/internship-approvals'),
  approveInternship: (id) =>
    request(`/faculty/internship-approvals/${id}/approve`, { method: 'POST' }),
  rejectInternship: (id, reason) =>
    request(`/faculty/internship-approvals/${id}/reject`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    }),
  getDashboardStats: () => request('/faculty/dashboard/stats'),
  getStudents: (search = '') =>
    request(`/faculty/students${search ? `?search=${search}` : ''}`),
  getStudentDetail: (id) => request(`/faculty/students/${id}`),
  getMonitoring: () => request('/faculty/monitoring'),
  getRiskCases: () => request('/faculty/risk-cases'),
  getAnalytics: () => request('/faculty/analytics'),
  assignMentor: (studentId, data = {}) =>
    request(`/faculty/students/${studentId}/assign-mentor`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};
