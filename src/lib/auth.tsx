'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react';
import { apiClient } from './api';

interface AuthContextType {
  user: { email: string } | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

function parseJwt(token: string): { exp?: number; sub?: string } | null {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

function isTokenExpired(token: string): boolean {
  const payload = parseJwt(token);
  if (!payload?.exp) return true;
  return Date.now() >= payload.exp * 1000;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<{ email: string } | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem('admin_token');
    const savedEmail = localStorage.getItem('admin_email');

    if (savedToken && !isTokenExpired(savedToken) && savedEmail) {
      setToken(savedToken);
      setUser({ email: savedEmail });
    } else {
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_email');
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const data = await apiClient('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    const accessToken = data.access_token;
    localStorage.setItem('admin_token', accessToken);
    localStorage.setItem('admin_email', email);
    setToken(accessToken);
    setUser({ email });
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_email');
    setToken(null);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
