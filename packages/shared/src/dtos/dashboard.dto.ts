import type { ClassDto } from "./class.dto";
import type { UserDto } from "./user.dto";

export interface DashboardStatsDto {
  totalUsers: number;
  teachers: number;
  students: number;
  admins: number;
  subjects: number;
  departments: number;
  classes: number;
}

export interface DashboardChartsDto {
  usersByRole: { role: string; count: number }[];
  subjectsPerDepartment: { name: string; count: number }[];
  classesPerSubject: { name: string; count: number }[];
}

export interface DashboardRecentDto {
  newestClasses: ClassDto[];
  newestTeachers: UserDto[];
  departmentsWithMostSubjects: { name: string; subjectCount: number }[];
  subjectsWithMostClasses: { name: string; classCount: number }[];
}
