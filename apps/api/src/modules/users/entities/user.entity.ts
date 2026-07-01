import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from "typeorm";
import { UserRole } from "@repo/shared";

@Entity("users")
export class User {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ length: 255 })
  name!: string;

  @Column({ unique: true, length: 255 })
  email!: string;

  @Column({ name: "password_hash", length: 255, nullable: true, select: false })
  passwordHash!: string;

  @Column({
    type: "enum",
    enum: UserRole,
    default: UserRole.STUDENT,
  })
  role!: UserRole;

  @Column({ name: "profile_photo", length: 500, nullable: true })
  profilePhoto!: string;

  @Column({ name: "reset_token_hash", length: 255, nullable: true, select: false })
  resetTokenHash?: string;

  @Column({ name: "reset_token_expiry", type: "timestamptz", nullable: true, select: false })
  resetTokenExpiry?: Date;

  @CreateDateColumn({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;
}
