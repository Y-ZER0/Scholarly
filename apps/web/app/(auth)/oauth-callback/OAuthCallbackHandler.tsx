'use client';

import { useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import type { UserDto, UserRole } from '@repo/shared';
import { setToken, setStoredUser } from '@/features/auth/services/auth.service';

export function OAuthCallbackHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const handled = useRef(false);

  useEffect(() => {
    if (handled.current) return;
    handled.current = true;

    const token = searchParams.get('token');
    const name = searchParams.get('name');
    const email = searchParams.get('email');
    const role = searchParams.get('role');
    const id = searchParams.get('id');
    const photo = searchParams.get('photo');

    if (!token || !id || !email || !name || !role) {
      router.replace('/login');
      return;
    }

    const user: UserDto = {
      id,
      name,
      email,
      role: role as UserDto['role'],
      profilePhoto: photo || undefined,
      createdAt: new Date().toISOString(),
    };

    setToken(token);
    setStoredUser(user);
    window.location.href = '/';
  }, [searchParams, router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <p className="text-muted-foreground">Signing you in...</p>
    </div>
  );
}