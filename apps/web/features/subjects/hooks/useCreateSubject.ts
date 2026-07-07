'use client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { subjectService } from '../services/subject.service';
import { subjectKeys } from './subjectKeys';
import type { CreateSubjectRequestDto } from '../dtos/create-subject-request.dto';

export function useCreateSubject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: CreateSubjectRequestDto) => subjectService.create(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: subjectKeys.lists() });
    },
  });
}
