import { IsString, IsNotEmpty, IsUUID } from "class-validator";
import { Transform } from "class-transformer";

export class CreateSubjectRequestDto {
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value?.toUpperCase?.() ?? value)
  code!: string;

  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsNotEmpty()
  description!: string;

  @IsUUID()
  @IsNotEmpty()
  departmentId!: string;
}
