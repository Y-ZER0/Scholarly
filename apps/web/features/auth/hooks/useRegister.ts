'use client';

import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { register, setToken } from '../services/auth.service';
import { useAuth } from '@/shared/context/AuthContext';
import type { AuthDto } from '@repo/shared';

interface RegisterVariables {
  name: string;
  email: string;
  password: string;
  role: 'student' | 'teacher';
  profilePhoto?: string;
}

export function useRegister() {
  const router = useRouter();
  const { setUser } = useAuth();

  return useMutation<AuthDto, Error, RegisterVariables>({
    mutationFn: ({ name, email, password, role, profilePhoto }) =>
      register(name, email, password, role, profilePhoto),
    onSuccess: (data) => {
      setToken(data.accessToken);
      setUser(data.user);
      router.push('/');
    },
  });
}
