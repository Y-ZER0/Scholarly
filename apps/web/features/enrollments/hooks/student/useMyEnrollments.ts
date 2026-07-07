'use client';

import { useQuery } from '@tanstack/react-query';
import { UserRole } from '@repo/shared';
import { enrollmentService } from '../../services/enrollment.service';
import { enrollmentKeys } from '../enrollmentKeys';
import { useAuth } from '@/shared/context/AuthContext';

interface UseMyEnrollmentsOptions {
  page?: number;
  limit?: number;
}

export function useMyEnrollments(options: UseMyEnrollmentsOptions = {}) {
  const { page = 1, limit = 10 } = options;
  const { currentUser } = useAuth();

  return useQuery({
    queryKey: enrollmentKeys.studentList({ page, limit }),
    queryFn: () => enrollmentService.getMyEnrollments({ page, limit }),
    staleTime: 30_000,
    enabled: !!currentUser && currentUser.role === UserRole.STUDENT,
  });
}
