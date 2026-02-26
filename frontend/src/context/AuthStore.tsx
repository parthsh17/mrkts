import React, { createContext, useContext, useState, useEffect } from "react";
import type { User } from "../lib/types";

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: () => void;
  logout: () => Promise<void>;
}

export const AuthStoreContext = createContext<AuthContextType | null>(null);

const API_BASE = import.meta.env.VITE_API_URL || "";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE}/api/auth/me`, { credentials: "include" })
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
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  const login = () => {
    window.location.href = `${API_BASE}/api/auth/google`;
  };

  const logout = async () => {
    try {
      await fetch(`${API_BASE}/api/auth/logout`, { credentials: "include" });
    } finally {
      setUser(null);
    }
  };

  return (
    <AuthStoreContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthStoreContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthStoreContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}
