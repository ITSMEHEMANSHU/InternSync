import { request } from './api.js';

export const reportService = {
  getMy: () => request('/weekly-reports/my'),
  saveDraft: (data) =>
    request('/weekly-reports/draft', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  submit: (id) =>
    request(`/weekly-reports/${id}/submit`, { method: 'POST' }),
  addFeedback: (id, data) =>
    request(`/weekly-reports/${id}/feedback`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};
