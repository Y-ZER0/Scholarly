'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { enrollmentService } from '../../services/enrollment.service';
import { enrollmentKeys } from '../enrollmentKeys';
import type { JoinClassRequestDto } from '../../dtos/join-class-request.dto';

export function useJoinClass() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: JoinClassRequestDto) => enrollmentService.joinClass(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: enrollmentKeys.studentLists() });
    },
  });
}
