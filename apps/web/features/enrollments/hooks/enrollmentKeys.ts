export const enrollmentKeys = {
  all: () => ['enrollments'] as const,
  teacherLists: () => [...enrollmentKeys.all(), 'teacher', 'list'] as const,
  teacherList: (f: { page: number; limit: number; classId?: string; search?: string }) =>
    [...enrollmentKeys.teacherLists(), f] as const,
  teacherClasses: () => [...enrollmentKeys.all(), 'teacher', 'classes'] as const,
  studentLists: () => [...enrollmentKeys.all(), 'student', 'list'] as const,
  studentList: (f: { page: number; limit: number }) =>
    [...enrollmentKeys.studentLists(), f] as const,
  classEnrollments: (classId: string) =>
    [...enrollmentKeys.all(), 'class', classId] as const,
};
