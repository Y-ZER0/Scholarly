'use client';

import { useQuery } from '@tanstack/react-query';
import { UserRole } from '@repo/shared';
import { enrollmentService } from '../../services/enrollment.service';
import { enrollmentKeys } from '../enrollmentKeys';
import { useAuth } from '@/shared/context/AuthContext';

export function useTeacherClasses() {
  const { currentUser } = useAuth();

  return useQuery({
    queryKey: enrollmentKeys.teacherClasses(),
    queryFn: () => enrollmentService.getTeacherClasses(),
    staleTime: 60_000,
    enabled: !!currentUser && currentUser.role === UserRole.TEACHER,
  });
}
