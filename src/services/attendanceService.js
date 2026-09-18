import { request } from './api.js';

export const attendanceService = {
  getMy: (month = '') =>
    request(`/attendance/my${month ? `?month=${month}` : ''}`),
  markToday: (data) =>
    request('/attendance/mark', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  getByAssignment: (assignmentId) =>
    request(`/attendance/assignment/${assignmentId}`),
};
