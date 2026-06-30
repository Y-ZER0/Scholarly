import type { UserRole } from "../enums/user-role.enum";

export interface UserDto {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  profilePhoto?: string;
  createdAt: string;
}
