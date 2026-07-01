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
import { getToken, me as getMe, removeToken, setStoredUser, getStoredUser } from '@/features/auth/logic/auth.service';

interface AuthContextValue {
  currentUser: UserDto | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: UserDto | null) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<UserDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      setIsLoading(false);
      return;
    }

    const stored = getStoredUser();
    if (stored) {
      setCurrentUser(stored);
      setIsLoading(false);
      return;
    }

    getMe()
      .then((user) => {
        setCurrentUser(user);
        setStoredUser(user);
      })
      .catch(() => {
        removeToken();
      })
      .finally(() => {
        setIsLoading(false);
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
        isLoading,
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
