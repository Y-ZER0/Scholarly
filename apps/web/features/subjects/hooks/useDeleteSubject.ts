'use client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { subjectService } from '../services/subject.service';
import { subjectKeys } from './subjectKeys';

export function useDeleteSubject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => subjectService.remove(id),
    onSuccess: (_, id) => {
      queryClient.removeQueries({ queryKey: subjectKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: subjectKeys.lists() });
    },
  });
}
