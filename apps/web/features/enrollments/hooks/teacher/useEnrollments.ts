'use client';

import { useQuery } from '@tanstack/react-query';
import { UserRole } from '@repo/shared';
import { enrollmentService } from '../../services/enrollment.service';
import { enrollmentKeys } from '../enrollmentKeys';
import { useAuth } from '@/shared/context/AuthContext';

interface UseTeacherEnrollmentsOptions {
  page?: number;
  limit?: number;
  classId?: string;
  search?: string;
}

export function useTeacherEnrollments(options: UseTeacherEnrollmentsOptions = {}) {
  const { page = 1, limit = 10, classId, search } = options;
  const { currentUser } = useAuth();

  return useQuery({
    queryKey: enrollmentKeys.teacherList({ page, limit, classId, search }),
    queryFn: () => enrollmentService.getTeacherEnrollments({ page, limit, classId, search }),
    staleTime: 30_000,
    enabled: !!currentUser && currentUser.role === UserRole.TEACHER,
  });
}
