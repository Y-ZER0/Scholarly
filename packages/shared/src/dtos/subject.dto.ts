export interface SubjectDto {
  id: string;
  code: string;
  name: string;
  description: string;
  departmentId: string;
  department: {
    code: string;
    name: string;
    description: string;
  };
  createdAt: string;
  totalClasses?: number;
  totalStudents?: number;
  classes?: {
    id: string;
    name: string;
    status: string;
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
