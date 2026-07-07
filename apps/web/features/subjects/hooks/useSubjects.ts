'use client';
import { useQuery } from '@tanstack/react-query';
import { subjectService } from '../services/subject.service';
import { subjectKeys } from './subjectKeys';

interface UseSubjectsOptions {
  page?: number;
  limit?: number;
  search?: string;
  departmentId?: string;
}

export function useSubjects(options: UseSubjectsOptions = {}) {
  const { page = 1, limit = 10, search, departmentId } = options;
  return useQuery({
    queryKey: subjectKeys.list({ page, limit, search, departmentId }),
    queryFn: () => subjectService.getAll({ page, limit, search, departmentId }),
    staleTime: 30_000,
  });
}
