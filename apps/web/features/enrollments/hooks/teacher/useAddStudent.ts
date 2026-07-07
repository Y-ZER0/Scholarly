'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { enrollmentService } from '../../services/enrollment.service';
import { enrollmentKeys } from '../enrollmentKeys';
import type { AddStudentRequestDto } from '../../dtos/add-student-request.dto';

export function useAddStudent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: AddStudentRequestDto) => enrollmentService.addStudent(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: enrollmentKeys.teacherLists() });
    },
  });
}
