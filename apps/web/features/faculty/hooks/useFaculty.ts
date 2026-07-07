'use client';
import { useQuery } from '@tanstack/react-query';
import { facultyService } from '../services/faculty.service';
import { facultyKeys } from './facultyKeys';

interface UseFacultyOptions {
  page?: number;
  limit?: number;
  search?: string;
}

export function useFaculty(options: UseFacultyOptions = {}) {
  const { page = 1, limit = 10, search } = options;
  return useQuery({
    queryKey: facultyKeys.list({ page, limit, search }),
    queryFn: () => facultyService.getAll({ page, limit, search }),
    staleTime: 30_000,
  });
}
