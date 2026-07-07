'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { departmentService } from '../services/department.service';
import { departmentKeys } from './departmentKeys';
import type { UpdateDepartmentRequestDto } from '../dtos/update-department-request.dto';
import type { DepartmentDto } from '@repo/shared';

export function useUpdateDepartment(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: UpdateDepartmentRequestDto) => departmentService.update(id, dto),
    onSuccess: (updatedDepartment) => {
      queryClient.setQueryData<DepartmentDto>(
        departmentKeys.detail(id),
        updatedDepartment,
      );
      queryClient.invalidateQueries({ queryKey: departmentKeys.lists() });
    },
  });
}
