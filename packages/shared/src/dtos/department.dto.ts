export interface DepartmentDto {
  id: string;
  code: string;
  name: string;
  description: string;
  createdAt: string;
  totalSubjects?: number;
  totalClasses?: number;
  enrolledStudents?: number;
}
