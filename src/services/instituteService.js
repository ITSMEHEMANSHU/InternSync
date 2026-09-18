import { request } from './api.js';

export const instituteService = {
    list: () => request('/institutes'),
    listAll: () => request('/institutes/all'),
    create: (data) =>
        request('/institutes', { method: 'POST', body: JSON.stringify(data) }),
    verify: (id) => request(`/institutes/${id}/verify`, { method: 'POST' }),
};