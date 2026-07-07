import { IsString, IsOptional, IsUUID } from "class-validator";
import { Transform } from "class-transformer";

export class UpdateSubjectRequestDto {
  @IsString()
  @IsOptional()
  @Transform(({ value }) => value?.toUpperCase?.() ?? value)
  code?: string;

  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsUUID()
  @IsOptional()
  departmentId?: string;
}
