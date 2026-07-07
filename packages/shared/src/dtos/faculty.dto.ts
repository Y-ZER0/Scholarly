import type { UserDto } from "./user.dto";

export interface FacultyDetailDto extends UserDto {
  departments: Array<{
    id: string;
    code: string;
    name: string;
    description: string;
  }>;
  subjects: Array<{
    id: string;
    code: string;
    name: string;
    department: {
      id: string;
      code: string;
      name: string;
    };
  }>;
  classes: Array<{
    id: string;
    name: string;
    subject: {
      id: string;
      code: string;
      name: string;
    };
    status: string;
    createdAt: string;
  }>;
}
