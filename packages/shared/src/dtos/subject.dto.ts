export interface SubjectDto {
  id: string;
  code: string;
  name: string;
  description: string;
  departmentId: string;
  department: {
    code: string;
    name: string;
  };
  createdAt: string;
  totalClasses?: number;
  totalStudents?: number;
}
