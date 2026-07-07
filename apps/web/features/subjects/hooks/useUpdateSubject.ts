'use client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { subjectService } from '../services/subject.service';
import { subjectKeys } from './subjectKeys';
import type { UpdateSubjectRequestDto } from '../dtos/update-subject-request.dto';
import type { SubjectDto } from '@repo/shared';

export function useUpdateSubject(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: UpdateSubjectRequestDto) => subjectService.update(id, dto),
    onSuccess: (updatedSubject) => {
      queryClient.setQueryData<SubjectDto>(
        subjectKeys.detail(id),
        updatedSubject,
      );
      queryClient.invalidateQueries({ queryKey: subjectKeys.lists() });
    },
  });
}
