export interface EnrollmentDto {
  id: string;
  classId: string;
  studentId: string;
  class: {
    id: string;
    name: string;
    bannerImage?: string;
  };
  subject: {
    name: string;
    code: string;
  };
  teacher: {
    name: string;
  };
  enrolledAt: string;
}
