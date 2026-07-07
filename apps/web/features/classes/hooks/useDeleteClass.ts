'use client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { classService } from '../services/class.service';
import { classKeys } from './classKeys';

export function useDeleteClass() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => classService.remove(id),
    onSuccess: (_, id) => {
      queryClient.removeQueries({ queryKey: classKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: classKeys.lists() });
    },
  });
}
