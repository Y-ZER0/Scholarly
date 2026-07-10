'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react';
import type { UserDto } from '@repo/shared';
import { getToken, setStoredUser, getStoredUser, removeToken, me } from '@/features/auth/services/auth.service';

interface AuthContextValue {
  currentUser: UserDto | null;
  isAuthenticated: boolean;
  loading: boolean;
  setUser: (user: UserDto | null) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<UserDto | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      setLoading(false);
      return;
    }

    const stored = getStoredUser();
    if (stored) {
      setCurrentUser(stored);
      setLoading(false);
      return;
    }

    me()
      .then((user) => {
        setCurrentUser(user);
        setStoredUser(user);
      })
      .catch(() => {
        removeToken();
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const setUser = useCallback((user: UserDto | null) => {
    setCurrentUser(user);
    if (user) {
      setStoredUser(user);
    }
  }, []);

  const logout = useCallback(() => {
    removeToken();
    setCurrentUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated: currentUser !== null,
        loading,
        setUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
