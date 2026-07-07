'use client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { classService } from '../services/class.service';
import { classKeys } from './classKeys';
import type { UpdateClassRequestDto } from '../dtos/update-class-request.dto';
import type { ClassDto } from '@repo/shared';

export function useUpdateClass(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: UpdateClassRequestDto) => classService.update(id, dto),
    onSuccess: (updatedClass) => {
      queryClient.setQueryData<ClassDto>(classKeys.detail(id), updatedClass);
      queryClient.invalidateQueries({ queryKey: classKeys.lists() });
    },
  });
}
