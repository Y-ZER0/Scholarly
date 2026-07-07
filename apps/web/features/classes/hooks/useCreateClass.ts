'use client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { classService } from '../services/class.service';
import { classKeys } from './classKeys';
import type { CreateClassRequestDto } from '../dtos/create-class-request.dto';

export function useCreateClass() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: CreateClassRequestDto) => classService.create(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: classKeys.lists() });
    },
  });
}
