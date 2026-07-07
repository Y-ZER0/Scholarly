'use client';

import { useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { loginWithToken } from '../../services/auth.service';
import { useAuth } from '@/shared/context/AuthContext';

export function OAuthHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setUser } = useAuth();
  const handled = useRef(false);

  useEffect(() => {
    const token = searchParams.get('token');
    if (!token || handled.current) return;

    handled.current = true;

    loginWithToken(token)
      .then((user) => {
        setUser(user);
        router.replace('/');
      })
      .catch(() => {
        router.replace('/login');
      });
  }, [searchParams, setUser, router]);

  return null;
}
