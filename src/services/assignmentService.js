import { request } from './api.js';

export const assignmentService = {
  create: (data) =>
    request('/assignments', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  getMy: () => request('/assignments/my'),
  getFaculty: () => request('/assignments/faculty'),
  getCompany: () => request('/assignments/company'),
  recordJoining: (id, data) =>
    request(`/assignments/${id}/join`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  verifyCompany: (id) =>
    request(`/assignments/${id}/verify-company`, { method: 'POST' }),
  verifyFaculty: (id) =>
    request(`/assignments/${id}/verify-faculty`, { method: 'POST' }),
  complete: (id) =>
    request(`/assignments/${id}/complete`, { method: 'POST' }),
};
