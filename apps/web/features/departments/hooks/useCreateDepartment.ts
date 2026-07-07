'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { departmentService } from '../services/department.service';
import { departmentKeys } from './departmentKeys';
import type { CreateDepartmentRequestDto } from '../dtos/create-department-request.dto';

export function useCreateDepartment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: CreateDepartmentRequestDto) => departmentService.create(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: departmentKeys.lists() });
    },
  });
}
