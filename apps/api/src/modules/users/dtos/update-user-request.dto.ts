import { IsString, IsEmail, IsEnum, IsOptional } from "class-validator";
import { UserRole } from "@repo/shared";

export class UpdateUserRequestDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole;

  @IsString()
  @IsOptional()
  profilePhoto?: string;
}
