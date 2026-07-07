import { IsString, IsNotEmpty, IsNumber, IsOptional, Min, IsEnum } from "class-validator";
import { IsUUID } from "class-validator";
import { ClassStatus } from "@repo/shared";

export class CreateClassRequestDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsNotEmpty()
  description!: string;

  @IsString()
  @IsOptional()
  bannerImage?: string;

  @IsNumber()
  @Min(1)
  capacity!: number;

  @IsEnum(ClassStatus)
  @IsOptional()
  status?: ClassStatus;

  @IsUUID()
  @IsNotEmpty()
  subjectId!: string;

  @IsUUID()
  @IsNotEmpty()
  teacherId!: string;
}
