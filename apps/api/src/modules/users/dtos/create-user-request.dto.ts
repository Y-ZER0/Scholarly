import { IsString, IsEmail, IsEnum, IsOptional } from "class-validator";
import { UserRole } from "@repo/shared";

export class CreateUserRequestDto {
  @IsString()
  name!: string;

  @IsEmail()
  email!: string;

  @IsString()
  @IsOptional()
  passwordHash?: string;

  @IsEnum(UserRole)
  role!: UserRole;

  @IsString()
  @IsOptional()
  profilePhoto?: string;
}
