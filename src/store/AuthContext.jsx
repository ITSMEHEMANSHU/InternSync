import { createContext, useContext, useState } from 'react';
import { ROLES } from '../constants/roles.js';

const AuthContext = createContext(null);

const DEMO_USERS = {
  [ROLES.STUDENT]: { id: 'STU-001', name: 'Aarav Sharma', email: 'aarav@apex.edu', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDJWs50yqA9fmxoiAas_G2fPF2JRt1URCexrc0mSoHGv2NCN31e-e9NqjnoOn6JB_KFLPx37XWsCtlqVrpJYE5yAANX0Wfzntmjv9ZRO42TdxPK7J51d2SqL5jhY26xziaEhZXGVL7oSQteLYo9h_hebARO305fImAobdStsyJ6WvQ0dXutU52qR2Thp2v5Xh1MRbNhDYkVlQs4vOskHAg7PwcVBlnv3NI5UYXr-ikjQYelxxdktDTl', academicYear: 'AY 2024-25', notificationCount: 3 },
  [ROLES.FACULTY]: { id: 'FAC-001', name: 'Dr. Meenakshi Sundaram', email: 'meenakshi@apex.edu', avatar: null, academicYear: 'AY 2024-25', notificationCount: 7 },
  [ROLES.COMPANY]: { id: 'CMP-001', name: 'Rajesh Iyer', email: 'rajesh@zoho.com', avatar: null, academicYear: 'AY 2024-25', notificationCount: 2 },
  [ROLES.ADMIN]:   { id: 'ADM-001', name: 'Suresh Kumar', email: 'suresh@apex.edu', avatar: null, academicYear: 'AY 2024-25', notificationCount: 5 },
};

export const AuthProvider = ({ children }) => {
  const [role, setRole] = useState(() => localStorage.getItem('is_role') || null);
  const [user, setUser] = useState(() => {
    const r = localStorage.getItem('is_role');
    return r ? DEMO_USERS[r] : null;
  });

  const login = (selectedRole) => {
    localStorage.setItem('is_role', selectedRole);
    setRole(selectedRole);
    setUser(DEMO_USERS[selectedRole]);
  };

  const logout = () => {
    localStorage.removeItem('is_role');
    setRole(null);
    setUser(null);
  };

  const switchRole = (newRole) => login(newRole);

  return (
    <AuthContext.Provider value={{ user, role, login, logout, switchRole, isAuthenticated: !!role }}>
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
