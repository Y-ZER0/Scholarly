'use client';

import { useQuery } from '@tanstack/react-query';
import { departmentService } from '../services/department.service';
import { departmentKeys } from './departmentKeys';

interface UseDepartmentsOptions {
  page?: number;
  limit?: number;
  search?: string;
}

export function useDepartments(options: UseDepartmentsOptions = {}) {
  const { page = 1, limit = 10, search } = options;
  return useQuery({
    queryKey: departmentKeys.list({ page, limit, search }),
    queryFn: () => departmentService.getAll({ page, limit, search }),
    staleTime: 30_000,
  });
}
