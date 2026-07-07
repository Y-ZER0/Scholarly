import { IsString, IsOptional } from "class-validator";
import { Transform } from "class-transformer";

export class UpdateDepartmentRequestDto {
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
}
