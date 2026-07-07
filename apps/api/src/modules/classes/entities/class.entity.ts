import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { ClassStatus } from "@repo/shared";
import { Subject } from "../../subjects/entities/subject.entity";
import { User } from "../../users/entities/user.entity";

@Entity("classes")
export class Class {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ length: 255 })
  name!: string;

  @Column({ type: "text" })
  description!: string;

  @Column({ name: "banner_image", length: 500, nullable: true })
  bannerImage?: string;

  @Column({ type: "integer", default: 30 })
  capacity!: number;

  @Column({
    type: "enum",
    enum: ClassStatus,
    default: ClassStatus.ACTIVE,
  })
  status!: ClassStatus;

  @Column({ name: "invite_code", length: 20, unique: true })
  inviteCode!: string;

  @Column({ name: "subject_id", type: "uuid" })
  subjectId!: string;

  @ManyToOne(() => Subject, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "subject_id" })
  subject!: Subject;

  @Column({ name: "teacher_id", type: "uuid" })
  teacherId!: string;

  @ManyToOne(() => User, (user) => user.classes, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "teacher_id" })
  teacher!: User;

  @CreateDateColumn({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;
}
