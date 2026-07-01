import { IsEmail, IsString, MinLength, IsOptional, IsBoolean } from "class-validator";

export class LoginRequestDto {
  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(1)
  password!: string;

  @IsOptional()
  @IsBoolean()
  rememberMe?: boolean;
}
