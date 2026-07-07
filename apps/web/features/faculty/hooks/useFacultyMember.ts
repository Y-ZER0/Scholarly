'use client';
import { useQuery } from '@tanstack/react-query';
import { facultyService } from '../services/faculty.service';
import { facultyKeys } from './facultyKeys';

export function useFacultyMember(id: string) {
  return useQuery({
    queryKey: facultyKeys.detail(id),
    queryFn: () => facultyService.getById(id),
    enabled: !!id,
  });
}
