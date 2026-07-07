export interface DepartmentDto {
  id: string;
  code: string;
  name: string;
  description: string;
  createdAt: string;
  totalSubjects?: number;
  totalClasses?: number;
  enrolledStudents?: number;
  subjects?: {
    id: string;
    code: string;
    name: string;
    description: string;
  }[];
  classes?: {
    id: string;
    name: string;
    status: string;
    subject: { id: string; code: string; name: string };
    teacher: { id: string; name: string; email: string; profilePhoto?: string };
  }[];
  teachers?: {
    id: string;
    name: string;
    email: string;
    profilePhoto?: string;
    role: string;
  }[];
  students?: {
    id: string;
    name: string;
    email: string;
    profilePhoto?: string;
    role: string;
  }[];
}
