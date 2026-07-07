import apiClient from '@/shared/lib/api-client';
import type { AuthDto, UserDto } from '@repo/shared';

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

export async function login(
  email: string,
  password: string,
  rememberMe?: boolean,
): Promise<AuthDto> {
  const { data } = await apiClient.post<ApiResponse<AuthDto>>('/auth/login', {
    email,
    password,
    rememberMe,
  });
  return data.data;
}

export async function register(
  name: string,
  email: string,
  password: string,
  role: 'student' | 'teacher',
  profilePhoto?: string,
): Promise<AuthDto> {
  const { data } = await apiClient.post<ApiResponse<AuthDto>>(
    '/auth/register',
    { name, email, password, role, profilePhoto },
  );
  return data.data;
}

export async function me(): Promise<UserDto> {
  const { data } = await apiClient.get<ApiResponse<UserDto>>('/auth/me');
  return data.data;
}

export async function loginWithToken(token: string): Promise<UserDto> {
  setToken(token);
  const user = await me();
  return user;
}

export async function forgotPassword(email: string): Promise<void> {
  await apiClient.post('/auth/forgot-password', { email });
}

export async function resetPassword(
  token: string,
  newPassword: string,
): Promise<void> {
  await apiClient.post('/auth/reset-password', { token, newPassword });
}

export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('access_token');
}

export function setToken(token: string): void {
  localStorage.setItem('access_token', token);
}

export function removeToken(): void {
  localStorage.removeItem('access_token');
  localStorage.removeItem('auth_user');
}

export function logout(): void {
  removeToken();
}

export function getStoredUser(): UserDto | null {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem('auth_user');
  if (!raw) return null;
  try {
    return JSON.parse(raw) as UserDto;
  } catch {
    return null;
  }
}

export function setStoredUser(user: UserDto): void {
  localStorage.setItem('auth_user', JSON.stringify(user));
}
