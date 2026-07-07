'use client';
import { useQuery } from '@tanstack/react-query';
import { classService } from '../services/class.service';
import { classKeys } from './classKeys';

interface UseClassesOptions {
  page?: number;
  limit?: number;
  search?: string;
  subjectId?: string;
  teacherId?: string;
  status?: string;
}

export function useClasses(options: UseClassesOptions = {}) {
  const { page = 1, limit = 10, search, subjectId, teacherId, status } = options;
  return useQuery({
    queryKey: classKeys.list({ page, limit, search, subjectId, teacherId, status }),
    queryFn: () => classService.getAll({ page, limit, search, subjectId, teacherId, status }),
    staleTime: 30_000,
  });
}
