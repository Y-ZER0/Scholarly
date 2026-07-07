'use client';

import { useQuery } from '@tanstack/react-query';
import { classService } from '../services/class.service';
import { classKeys } from './classKeys';

interface UseAvailableClassesOptions {
  page?: number;
  limit?: number;
  search?: string;
}

export function useAvailableClasses(options: UseAvailableClassesOptions = {}) {
  const { page = 1, limit = 10, search } = options;

  return useQuery({
    queryKey: classKeys.availableList({ page, limit, search }),
    queryFn: () => classService.getAvailableClasses({ page, limit, search }),
    staleTime: 30_000,
  });
}
