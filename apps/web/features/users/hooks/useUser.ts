'use client';
import { useQuery } from '@tanstack/react-query';
import { userService } from '../services/user.service';
import { userKeys } from './userKeys';

export function useUser(id: string) {
  return useQuery({
    queryKey: userKeys.detail(id),
    queryFn: () => userService.getById(id),
    enabled: !!id,
  });
}
