import { IsString, IsOptional, IsNumber, IsEnum, Min } from "class-validator";
import { IsUUID } from "class-validator";
import { ClassStatus } from "@repo/shared";

export class UpdateClassRequestDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  bannerImage?: string;

  @IsNumber()
  @IsOptional()
  @Min(1)
  capacity?: number;

  @IsEnum(ClassStatus)
  @IsOptional()
  status?: ClassStatus;

  @IsUUID()
  @IsOptional()
  subjectId?: string;

  @IsUUID()
  @IsOptional()
  teacherId?: string;
}
