"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import type { AuthUser } from "@/src/types/auth";
import { getAuthApiUrl, mapBackendUserToAuthUser } from "@/src/lib/auth-api";

export type { AuthUser };

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  isLoaded: boolean;
  login: (token: string, user: AuthUser) => void;
  logout: () => void;
  setUser: (user: AuthUser) => void;
}

const STORAGE_KEY = "comics-auth";

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

function loadStoredAuth(): { user: AuthUser; token: string } | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw) as { user: AuthUser; token: string };
    if (data?.user && data?.token) return data;
  } catch {
    // ignore
  }
  return null;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const stored = loadStoredAuth();
    if (!stored) {
      setIsLoaded(true);
      return;
    }
    setUserState(stored.user);
    setToken(stored.token);
    fetch(getAuthApiUrl("/api/auth/me"), {
      headers: { Authorization: `Bearer ${stored.token}` },
    })
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error("Invalid token");
      })
      .then((data) => {
        setUserState(mapBackendUserToAuthUser(data));
      })
      .catch(() => {
        setUserState(null);
        setToken(null);
      })
      .finally(() => setIsLoaded(true));
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (user && token) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ user, token }));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [user, token]);

  const login = (newToken: string, newUser: AuthUser) => {
    setToken(newToken);
    setUserState(newUser);
  };

  const logout = () => {
    setToken(null);
    setUserState(null);
  };

  const setUser = (updated: AuthUser) => {
    setUserState(updated);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoaded,
        login,
        logout,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
