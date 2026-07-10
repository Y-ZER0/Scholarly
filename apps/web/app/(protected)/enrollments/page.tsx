'use client';

import { useAuth } from '@/shared/context/AuthContext';
import { UserRole } from '@repo/shared';
import { TeacherEnrollments } from '@/features/enrollments/ui/teacher-enrollment-list/TeacherEnrollments';
import { StudentEnrollments } from '@/features/enrollments/ui/student-enrollment-list/StudentEnrollments';

export default function EnrollmentsPage() {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-muted border-t-primary" />
      </div>
    );
  }

  if (!currentUser) {
    return null;
  }

  if (currentUser.role === UserRole.TEACHER) {
    return <TeacherEnrollments />;
  }

  return <StudentEnrollments />;
}
