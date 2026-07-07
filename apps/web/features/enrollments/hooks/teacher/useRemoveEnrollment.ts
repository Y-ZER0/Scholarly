'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { enrollmentService } from '../../services/enrollment.service';
import { enrollmentKeys } from '../enrollmentKeys';

export function useRemoveEnrollment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => enrollmentService.removeEnrollment(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: enrollmentKeys.teacherLists() });
    },
  });
}
