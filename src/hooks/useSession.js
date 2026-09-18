import { useEffect, useState } from 'react';
import { supabase } from '../services/supabase.js';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';

export const useSession = () => {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const hydrate = async (s) => {
      if (!s) {
        setUser(null);
        setRole(null);
        return;
      }

      // Start with JWT data
      const base = {
        id: s.user.id,
        email: s.user.email,
        name: s.user.user_metadata?.name || s.user.email?.split('@')[0],
        role: s.user.user_metadata?.role || null,
        avatar: s.user.user_metadata?.avatar_url || null,
        academicYear: s.user.user_metadata?.academic_year || 'AY 2024-25',
        notificationCount: s.user.user_metadata?.notification_count || 0,
      };

      // Enrich from backend — this is authoritative
      try {
        const res = await fetch(`${API_BASE}/auth/me`, {
          headers: { Authorization: `Bearer ${s.access_token}` },
        });
        if (res.ok) {
          const enriched = await res.json();
          if (!mounted) return;
          const finalUser = {
            ...base,
            ...enriched,
            avatar: enriched.avatar || base.avatar,
          };
          setUser(finalUser);
          setRole(enriched.role);       // ← role from DB
          return;
        }
      } catch {
        /* fall through to JWT base */
      }

      if (mounted) {
        setUser(base);
        setRole(base.role);
      }
    };

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!mounted) return;
      setSession(session);
      hydrate(session).finally(() => mounted && setLoading(false));
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
      if (!mounted) return;
      setSession(s);
      hydrate(s);
    });

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  return { session, user, role, loading };
};