'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchApi } from '@/lib/api';

export interface UserInfo {
  userId: number;
  email: string;
  fullName: string;
  countryCode: string;
  primaryCurrencyCode: string;
  primaryCurrencySymbol: string;
  onboardingCompleted: boolean;
}

interface AuthContextType {
  user: UserInfo | null;
  token: string | null;
  loading: boolean;
  login: (token: string, user: UserInfo) => void;
  logout: () => void;
  refreshUser: () => Promise<void>;
  updateUserContext: (updates: Partial<UserInfo>) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  loading: true,
  login: () => {},
  logout: () => {},
  refreshUser: async () => {},
  updateUserContext: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem('kanjoo_token');
    const savedUser = localStorage.getItem('kanjoo_user');

    if (savedToken && savedUser) {
      setToken(savedToken);
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem('kanjoo_user');
      }
    }
    setLoading(false);
  }, []);

  const login = (newToken: string, newUser: UserInfo) => {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem('kanjoo_token', newToken);
    localStorage.setItem('kanjoo_user', JSON.stringify(newUser));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('kanjoo_token');
    localStorage.removeItem('kanjoo_user');
    window.location.href = '/login';
  };

  const updateUserContext = (updates: Partial<UserInfo>) => {
    if (!user) return;
    const updated = { ...user, ...updates };
    setUser(updated);
    localStorage.setItem('kanjoo_user', JSON.stringify(updated));
  };

  const refreshUser = async () => {
    if (!token) return;
    try {
      const data = await fetchApi<UserInfo>('/auth/me');
      if (data) {
        updateUserContext(data);
      }
    } catch {
      // ignore
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, refreshUser, updateUserContext }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
