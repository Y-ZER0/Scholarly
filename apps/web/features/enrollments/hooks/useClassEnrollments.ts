'use client';

import { useQuery } from '@tanstack/react-query';
import { enrollmentService } from '../services/enrollment.service';
import { enrollmentKeys } from './enrollmentKeys';

export function useClassEnrollments(classId: string) {
  return useQuery({
    queryKey: enrollmentKeys.classEnrollments(classId),
    queryFn: () => enrollmentService.getClassEnrollments(classId),
    staleTime: 30_000,
    enabled: !!classId,
  });
}
