import { useEffect, useState } from 'react';
import { adminService } from '../services/adminService.js';

export const useAdminDashboard = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let mounted = true;
        adminService
            .getDashboard()
            .then((d) => mounted && setData(d))
            .catch((err) => mounted && setError(err?.message))
            .finally(() => mounted && setLoading(false));
        return () => {
            mounted = false;
        };
    }, []);

    return { data, loading, error };
};