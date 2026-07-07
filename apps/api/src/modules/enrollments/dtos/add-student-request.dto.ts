import { IsUUID, IsEmail } from "class-validator";

export class AddStudentRequestDto {
  @IsUUID()
  classId!: string;

  @IsEmail()
  studentEmail!: string;
}
