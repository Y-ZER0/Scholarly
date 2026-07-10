'use client';

import { useMutation } from '@tanstack/react-query';
import { login, setToken } from '../services/auth.service';
import type { AuthDto } from '@repo/shared';

interface LoginVariables {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export function useLogin() {
  return useMutation<AuthDto, Error, LoginVariables>({
    mutationFn: ({ email, password, rememberMe }) =>
      login(email, password, rememberMe),
    onSuccess: (data) => {
      setToken(data.accessToken);
      localStorage.setItem('auth_user', JSON.stringify(data.user));
      window.location.href = '/';
    },
  });
}
