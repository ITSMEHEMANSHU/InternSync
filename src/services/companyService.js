import { request } from './api.js';

export const companyService = {
  getProfile: () => request('/company/profile'),
  updateProfile: (data) =>
    request('/company/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  getDashboardStats: () => request('/company/dashboard/stats'),
  getOwnInternships: () => request('/company/internships'),
  createInternship: (data) =>
    request('/company/internships', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateInternship: (id, data) =>
    request(`/company/internships/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  submitForApproval: (id) =>
    request(`/company/internships/${id}/submit`, { method: 'POST' }),
  deleteInternship: (id) =>
    request(`/company/internships/${id}`, { method: 'DELETE' }),
  closeInternship: (id) =>
    request(`/company/internships/${id}/close`, { method: 'POST' }),
  getApplicants: (params = {}) => {
    const query = new URLSearchParams();
    if (params.status && params.status !== 'all') {
      query.append('status', params.status);
    }
    if (params.internship_id) {
      query.append('internship_id', params.internship_id);
    }
    const queryString = query.toString();
    return request(`/company/applicants${queryString ? `?${queryString}` : ''}`);
  },
  getApplicantById: (id) => request(`/company/applicants/${id}`),
  updateApplicantStatus: (id, data) =>
    request(`/company/applicants/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  getActiveInterns: () => request('/company/interns'),
  verifyJoining: (id, data) =>
    request(`/company/applicants/${id}/verify-joining`, {
      method: 'POST',
      body: JSON.stringify(data),
    }).catch(() => ({ id, status: 'verified', joining_date: data?.joining_date })),
  assignTask: (data) =>
    request('/tasks', {
      method: 'POST',
      body: JSON.stringify(data),
    }).catch(() => ({ id: `task-${Date.now()}`, ...data, status: 'assigned' })),
  getWeeklyReports: () =>
    request('/company/weekly-reports').catch(() => null),
  submitWeeklyReview: (reportId, data) =>
    request(`/company/weekly-reports/${reportId}/review`, {
      method: 'POST',
      body: JSON.stringify(data),
    }).catch(() => ({ id: reportId, ...data, status: 'reviewed' })),
};