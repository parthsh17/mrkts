import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User } from '../lib/types';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: () => void;
  logout: () => Promise<void>;
}

const API_BASE = import.meta.env.VITE_API_URL || '';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // On mount, check if there's an active session with the backend
  useEffect(() => {
    fetch(`${API_BASE}/api/auth/me`, { credentials: 'include' })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.success && data.user) {
          setUser({
            uid: data.user._id,
            displayName: data.user.displayName,
            email: data.user.email,
            photoURL: data.user.photoURL,
          });
        }
      })
      .catch(() => {
        // Not authenticated — that's fine
      })
      .finally(() => setIsLoading(false));
  }, []);

  // Redirect browser to Google OAuth — backend handles the rest
  const login = () => {
    window.location.href = `${API_BASE}/api/auth/google`;
  };

  // Hit the backend logout endpoint, then clear local state
  const logout = async () => {
    try {
      await fetch(`${API_BASE}/api/auth/logout`, { credentials: 'include' });
    } finally {
      setUser(null);
    }
  };


  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within <AuthProvider>');
  return ctx;
}
