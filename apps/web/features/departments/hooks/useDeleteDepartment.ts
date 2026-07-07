'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { departmentService } from '../services/department.service';
import { departmentKeys } from './departmentKeys';

export function useDeleteDepartment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => departmentService.remove(id),
    onSuccess: (_, id) => {
      queryClient.removeQueries({ queryKey: departmentKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: departmentKeys.lists() });
    },
  });
}
