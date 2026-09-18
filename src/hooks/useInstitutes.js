import { useEffect, useState } from 'react';
import { instituteService } from '../services/instituteService.js';

export const useInstitutes = () => {
    const [institutes, setInstitutes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let mounted = true;
        instituteService
            .list()
            .then((data) => mounted && setInstitutes(Array.isArray(data) ? data : []))
            .catch((err) => mounted && setError(err?.message))
            .finally(() => mounted && setLoading(false));
        return () => { mounted = false; };
    }, []);

    return { institutes, loading, error };
};