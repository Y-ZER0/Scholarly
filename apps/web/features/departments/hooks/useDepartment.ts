'use client';

import { useQuery } from '@tanstack/react-query';
import { departmentService } from '../services/department.service';
import { departmentKeys } from './departmentKeys';

export function useDepartment(id: string) {
  return useQuery({
    queryKey: departmentKeys.detail(id),
    queryFn: () => departmentService.getById(id),
    enabled: !!id,
  });
}
