import { useState, useEffect, useCallback } from 'react';
import { adminService } from '../services/adminService.js';

export const useAdminCompanies = () => {
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [acting, setActing] = useState(null);
    const [filter, setFilter] = useState('pending'); // 'pending' | 'all' | 'verified'

    const load = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const params = {};
            if (filter === 'pending') params.verified = false;
            if (filter === 'verified') params.verified = true;
            const data = await adminService.getCompanies(params);
            setCompanies(Array.isArray(data) ? data : []);
        } catch (err) {
            setError(err?.message || 'Failed to load companies');
            setCompanies([]);
        } finally {
            setLoading(false);
        }
    }, [filter]);

    useEffect(() => {
        load();
    }, [load]);

    const verify = useCallback(async (id) => {
        setActing(id);
        try {
            await adminService.verifyCompany(id);
            setCompanies((prev) =>
                prev.map((c) => (c.id === id ? { ...c, verified: true } : c))
            );
        } finally {
            setActing(null);
        }
    }, []);

    const reject = useCallback(async (id) => {
        setActing(id);
        try {
            await adminService.rejectCompany(id);
            setCompanies((prev) => prev.filter((c) => c.id !== id));
        } finally {
            setActing(null);
        }
    }, []);

    return { companies, loading, error, acting, verify, reject, filter, setFilter, reload: load };
};