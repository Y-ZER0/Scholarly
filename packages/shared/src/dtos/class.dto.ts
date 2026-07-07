import type { ClassStatus } from "../enums/class-status.enum";

export interface ClassDto {
  id: string;
  name: string;
  description: string;
  bannerImage?: string;
  capacity: number;
  status: ClassStatus;
  inviteCode: string;
  subjectId: string;
  teacherId: string;
  subject: {
    id: string;
    code: string;
    name: string;
    description: string;
  };
  department: {
    id: string;
    name: string;
    description: string;
  };
  teacher: {
    id: string;
    name: string;
    email: string;
    profilePhoto?: string;
  };
  enrollmentCount: number;
  spotsRemaining: number;
  createdAt: string;
}
