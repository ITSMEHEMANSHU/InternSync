import { useState, useEffect, useCallback } from 'react';
import { COMPANY_KPIS, COMPANY_INTERNSHIPS } from '../data/mockData.js';

export const useCompanyInternships = () => {
  const [internships, setInternships] = useState([]);
  const [kpis, setKpis] = useState([]);
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);

  useEffect(() => {
    // TODO: companyService.getInternships(companyId)
    const t = setTimeout(() => { setInternships(COMPANY_INTERNSHIPS); setKpis(COMPANY_KPIS); setLoading(false); }, 450);
    return () => clearTimeout(t);
  }, []);

  const postInternship = useCallback(async (data) => {
    setPosting(true);
    // TODO: companyService.postInternship(companyId, data)
    await new Promise((r) => setTimeout(r, 800));
    setPosting(false);
    return true;
  }, []);

  return { internships, kpis, loading, posting, postInternship };
};
