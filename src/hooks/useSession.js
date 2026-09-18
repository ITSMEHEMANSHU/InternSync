import { useEffect, useState, useRef } from 'react';
import { supabase } from '../services/supabase.js';

const API_BASE =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';

export const useSession = () => {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const isHydratedRef = useRef(false);

  useEffect(() => {
    let mounted = true;

    const hydrate = async (s, isInitial = false) => {
      if (!s) {
        if (mounted) {
          setSession(null);
          setUser(null);
          setRole(null);
          setLoading(false);
          isHydratedRef.current = true;
        }
        return;
      }

      const base = {
        id: s.user.id,
        email: s.user.email,
        name: s.user.user_metadata?.name || s.user.email?.split('@')[0],
        role: s.user.user_metadata?.role || null,
        avatar: s.user.user_metadata?.avatar_url || null,
        academicYear: s.user.user_metadata?.academic_year || 'AY 2024-25',
        notificationCount: s.user.user_metadata?.notification_count || 0,
      };

      if (mounted) {
        setSession(s);
        setUser((prev) => (prev ? { ...prev, ...base } : base));
        setRole((prev) => prev || base.role);

        if (isInitial && base.role) {
          setLoading(false);
          isHydratedRef.current = true;
        }
      }

      // Get authoritative role from DB — update state seamlessly
      try {
        const res = await fetch(`${API_BASE}/auth/me`, {
          headers: { Authorization: `Bearer ${s.access_token}` },
        });
        if (res.ok) {
          const enriched = await res.json();
          if (mounted) {
            setUser((prev) => ({
              ...(prev || base),
              ...enriched,
              avatar: enriched.avatar || base.avatar,
            }));
            if (enriched.role) {
              setRole(enriched.role);
            }
          }
        }
      } catch {
        /* fall back to JWT role */
      }

      if (mounted) {
        setLoading(false);
        isHydratedRef.current = true;
      }
    };

    supabase.auth.getSession().then(({ data: { session: initialSession } }) => {
      if (!mounted) return;
      if (!isHydratedRef.current) {
        hydrate(initialSession, true);
      }
    });

    const { data: sub } = supabase.auth.onAuthStateChange((event, s) => {
      if (!mounted) return;

      if (event === 'SIGNED_OUT' || !s) {
        setSession(null);
        setUser(null);
        setRole(null);
        setLoading(false);
        isHydratedRef.current = true;
      } else if (event === 'TOKEN_REFRESHED' || event === 'USER_UPDATED') {
        // Silent token update — DO NOT set loading to true
        setSession(s);
      } else {
        if (!isHydratedRef.current) {
          hydrate(s, true);
        } else {
          setSession(s);
        }
      }
    });

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  return { session, user, role, loading };
};