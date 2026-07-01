import { IsString, IsEmail, MinLength, IsEnum, IsOptional } from "class-validator";
import { UserRole } from "@repo/shared";

export class RegisterRequestDto {
  @IsString()
  name!: string;

  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(8)
  password!: string;

  @IsEnum(UserRole)
  role!: UserRole;

  @IsOptional()
  @IsString()
  profilePhoto?: string;
}
