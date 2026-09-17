import { createContext, useContext, useCallback } from 'react';
import { supabase } from '../services/supabase.js';
import { useSession } from '../hooks/useSession.js';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const { session, user, role, loading } = useSession();

  const login = useCallback(async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw new Error(error.message);
    return data;
  }, []);

  const register = useCallback(async ({ email, password, name, role, metadata }) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name, role, ...(metadata || {}) },
      },
    });
    if (error) throw new Error(error.message);
    if (data?.user && Array.isArray(data.user.identities) && data.user.identities.length === 0) {
      throw new Error('User already registered with this email address.');
    }
    return data;
  }, []);

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
  }, []);

  const resetPassword = useCallback(async (email) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/login`,
    });
    if (error) throw new Error(error.message);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        role,
        loading,
        isAuthenticated: !!session,
        login,
        register,
        logout,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};

export default AuthContext;