'use client';
import { useQuery } from '@tanstack/react-query';
import { subjectService } from '../services/subject.service';
import { subjectKeys } from './subjectKeys';

export function useSubject(id: string) {
  return useQuery({
    queryKey: subjectKeys.detail(id),
    queryFn: () => subjectService.getById(id),
    enabled: !!id,
  });
}
