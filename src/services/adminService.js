import { request } from './api.js';

export const adminService = {
    // Users
    getUsers: (params = {}) => {
        const qs = new URLSearchParams(
            Object.entries(params).filter(([, v]) => v != null && v !== '')
        ).toString();
        return request(`/admin/users${qs ? `?${qs}` : ''}`);
    },
    approveUser: (id) => request(`/admin/users/${id}/approve`, { method: 'POST' }),
    rejectUser: (id) => request(`/admin/users/${id}/reject`, { method: 'POST' }),

    // Companies
    getCompanies: (params = {}) => {
        const qs = new URLSearchParams(
            Object.entries(params).filter(([, v]) => v != null && v !== '')
        ).toString();
        return request(`/admin/companies${qs ? `?${qs}` : ''}`);
    },
    verifyCompany: (id) =>
        request(`/admin/companies/${id}/verify`, { method: 'POST' }),
    rejectCompany: (id) =>
        request(`/admin/companies/${id}/reject`, { method: 'POST' }),
};