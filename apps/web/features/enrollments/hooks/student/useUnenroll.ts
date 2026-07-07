'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { enrollmentService } from '../../services/enrollment.service';
import { enrollmentKeys } from '../enrollmentKeys';

export function useUnenroll() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => enrollmentService.unenroll(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: enrollmentKeys.studentLists() });
    },
  });
}
