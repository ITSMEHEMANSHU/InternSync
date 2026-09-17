const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1';

const request = async (endpoint, options = {}) => {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });
  if (!res.ok) throw new Error(`API Error: ${res.status}`);
  return res.json();
};

// TODO: swap each method with real endpoint when backend is ready

export const weeklyReportsService = {
  getAll:     (studentId)             => request(`/students/${studentId}/weekly-reports`),
  getDraft:   (studentId, week)       => request(`/students/${studentId}/weekly-reports/draft/${week}`),
  saveDraft:  (studentId, data)       => request(`/students/${studentId}/weekly-reports/draft`, { method: 'POST', body: JSON.stringify(data) }),
  submit:     (studentId, week, data) => request(`/students/${studentId}/weekly-reports/${week}/submit`, { method: 'POST', body: JSON.stringify(data) }),
  getAiAudit: (studentId, week)       => request(`/students/${studentId}/weekly-reports/${week}/ai-audit`),
  export:     (studentId)             => request(`/students/${studentId}/weekly-reports/export`),
};

export const studentService = {
  getProfile:         (id) => request(`/students/${id}/profile`),
  updateProfile:      (id, data) => request(`/students/${id}/profile`, { method: 'PUT', body: JSON.stringify(data) }),
  getKpiMetrics:      (id) => request(`/students/${id}/kpi-metrics`),
  getCompetencyIndex: (id) => request(`/students/${id}/competency-index`),
  uploadResume:       (id, file) => request(`/students/${id}/resume`, { method: 'POST', body: file }),
  getCertificate:     (id) => request(`/students/${id}/certificate`),
};

export const internshipService = {
  getAll:    (params) => request(`/internships?${new URLSearchParams(params)}`),
  getById:   (id)     => request(`/internships/${id}`),
  apply:     (id, data) => request(`/internships/${id}/apply`, { method: 'POST', body: JSON.stringify(data) }),
  bookmark:  (id)     => request(`/internships/${id}/bookmark`, { method: 'POST' }),
};

export const applicationService = {
  getAll:    (studentId) => request(`/students/${studentId}/applications`),
  getById:   (id)        => request(`/applications/${id}`),
  withdraw:  (id)        => request(`/applications/${id}/withdraw`, { method: 'POST' }),
  uploadDoc: (id, data)  => request(`/applications/${id}/documents`, { method: 'POST', body: JSON.stringify(data) }),
};

export const attendanceService = {
  getMonthly: (studentId, month) => request(`/students/${studentId}/attendance?month=${month}`),
  markToday:  (studentId, data)  => request(`/students/${studentId}/attendance`, { method: 'POST', body: JSON.stringify(data) }),
};

export const taskService = {
  getAll:    (studentId) => request(`/students/${studentId}/tasks`),
  updateStatus: (id, status) => request(`/tasks/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
  addLog:    (id, data)  => request(`/tasks/${id}/logs`, { method: 'POST', body: JSON.stringify(data) }),
};

export const facultyService = {
  getStudents:    (facultyId) => request(`/faculty/${facultyId}/students`),
  getStudent:     (id)        => request(`/students/${id}`),
  getApprovals:   (facultyId) => request(`/faculty/${facultyId}/approvals`),
  approve:        (id, data)  => request(`/approvals/${id}/approve`, { method: 'POST', body: JSON.stringify(data) }),
  reject:         (id, data)  => request(`/approvals/${id}/reject`, { method: 'POST', body: JSON.stringify(data) }),
  getRiskCases:   (facultyId) => request(`/faculty/${facultyId}/risk-cases`),
  addIntervention:(id, data)  => request(`/risk-cases/${id}/interventions`, { method: 'POST', body: JSON.stringify(data) }),
  getAnalytics:   (facultyId) => request(`/faculty/${facultyId}/analytics`),
  assignMentor:   (studentId, mentorId) => request(`/students/${studentId}/mentor`, { method: 'PUT', body: JSON.stringify({ mentorId }) }),
};

export const companyService = {
  getProfile:     (id)    => request(`/companies/${id}/profile`),
  updateProfile:  (id, d) => request(`/companies/${id}/profile`, { method: 'PUT', body: JSON.stringify(d) }),
  getInternships: (id)    => request(`/companies/${id}/internships`),
  postInternship: (id, d) => request(`/companies/${id}/internships`, { method: 'POST', body: JSON.stringify(d) }),
  getApplicants:  (id)    => request(`/companies/${id}/applicants`),
  updateApplicant:(id, d) => request(`/applicants/${id}`, { method: 'PATCH', body: JSON.stringify(d) }),
  getInterns:     (id)    => request(`/companies/${id}/interns`),
  assignTask:     (d)     => request(`/tasks`, { method: 'POST', body: JSON.stringify(d) }),
  getWeeklyReports:(id)   => request(`/companies/${id}/weekly-reports`),
  submitEvaluation:(internId, d) => request(`/interns/${internId}/evaluation`, { method: 'POST', body: JSON.stringify(d) }),
};

export const adminService = {
  getUsers:       (params) => request(`/admin/users?${new URLSearchParams(params)}`),
  updateUser:     (id, d)  => request(`/admin/users/${id}`, { method: 'PATCH', body: JSON.stringify(d) }),
  getDepartments: ()       => request(`/admin/departments`),
  saveDepartment: (d)      => request(`/admin/departments`, { method: 'POST', body: JSON.stringify(d) }),
  getPendingCompanies: ()  => request(`/admin/companies/pending`),
  verifyCompany:  (id, d)  => request(`/admin/companies/${id}/verify`, { method: 'POST', body: JSON.stringify(d) }),
  getPolicies:    ()       => request(`/admin/policies`),
  savePolicies:   (d)      => request(`/admin/policies`, { method: 'PUT', body: JSON.stringify(d) }),
  getAuditLogs:   (params) => request(`/admin/audit-logs?${new URLSearchParams(params)}`),
  getSystemHealth:()       => request(`/admin/system/health`),
};

export const notificationService = {
  getAll:   (userId) => request(`/users/${userId}/notifications`),
  markRead: (id)     => request(`/notifications/${id}/read`, { method: 'PATCH' }),
  markAllRead: (userId) => request(`/users/${userId}/notifications/read-all`, { method: 'PATCH' }),
};
