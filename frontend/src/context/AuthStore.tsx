import React, { useState, useEffect } from "react";
import type { User } from "../lib/types";
import { AuthStoreContext } from "./AuthStoreContext";

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
