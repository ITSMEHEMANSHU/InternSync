import { request } from './api.js';

export const adminService = {
    // Dashboard
    getDashboard: () => request('/admin/dashboard'),

    // Users
    getUsers: (params = {}) => {
        const qs = new URLSearchParams(
            Object.entries(params).filter(
                ([, v]) => v != null && v !== '' && v !== 'all'
            )
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

    // Departments
    getDepartments: () => request('/admin/departments'),
    createDepartment: (data) =>
        request('/admin/departments', {
            method: 'POST',
            body: JSON.stringify(data),
        }),
    deleteDepartment: (id) =>
        request(`/admin/departments/${id}`, { method: 'DELETE' }),

    // Policies
    getPolicies: () => request('/admin/policies'),
    updatePolicies: (data) =>
        request('/admin/policies', { method: 'PUT', body: JSON.stringify(data) }),

    // Audit
    getAuditLogs: (limit = 100) => request(`/admin/audit-logs?limit=${limit}`),

    // Access control
    getAccessControl: () => request('/admin/access-control'),

    // System
    getSystemMonitoring: () => request('/admin/system-monitoring'),
};