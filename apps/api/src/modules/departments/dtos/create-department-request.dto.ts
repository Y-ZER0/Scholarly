import { IsString, IsNotEmpty } from "class-validator";
import { Transform } from "class-transformer";

export class CreateDepartmentRequestDto {
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
}
