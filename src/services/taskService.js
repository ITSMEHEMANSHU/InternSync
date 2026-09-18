import { request } from './api.js';

export const taskService = {
  getMy: () => request('/tasks/my'),
  create: (data) =>
    request('/tasks', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateStatus: (id, status) =>
    request(`/tasks/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),
  addLog: (id, data) =>
    request(`/tasks/${id}/logs`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  getLogs: (id) => request(`/tasks/${id}/logs`),
};
