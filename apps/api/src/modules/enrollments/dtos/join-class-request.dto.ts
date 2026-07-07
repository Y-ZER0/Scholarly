import { IsString } from "class-validator";

export class JoinClassRequestDto {
  @IsString()
  inviteCode!: string;
}
