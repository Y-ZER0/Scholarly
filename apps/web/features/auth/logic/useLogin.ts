'use client';

import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { login, setToken } from './auth.service';
import { useAuth } from '@/shared/context/AuthContext';
import type { AuthDto } from '@repo/shared';

interface LoginVariables {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export function useLogin() {
  const router = useRouter();
  const { setUser } = useAuth();

  return useMutation<AuthDto, Error, LoginVariables>({
    mutationFn: ({ email, password, rememberMe }) =>
      login(email, password, rememberMe),
    onSuccess: (data) => {
      setToken(data.accessToken);
      setUser(data.user);
      router.push('/');
    },
  });
}
