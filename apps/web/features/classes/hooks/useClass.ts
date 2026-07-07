'use client';
import { useQuery } from '@tanstack/react-query';
import { classService } from '../services/class.service';
import { classKeys } from './classKeys';

export function useClass(id: string) {
  return useQuery({
    queryKey: classKeys.detail(id),
    queryFn: () => classService.getById(id),
    enabled: !!id,
  });
}
