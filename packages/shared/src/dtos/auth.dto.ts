import type { UserDto } from "./user.dto";

export interface AuthDto {
  user: UserDto;
  accessToken: string;
}
