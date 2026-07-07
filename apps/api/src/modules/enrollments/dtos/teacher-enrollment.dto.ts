export interface TeacherEnrollmentDto {
  id: string;
  classId: string;
  className: string;
  student: {
    id: string;
    name: string;
    email: string;
    profilePhoto?: string;
  };
  subject: {
    name: string;
    code: string;
  };
  enrolledAt: string;
}
