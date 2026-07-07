import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Unique,
} from "typeorm";
import { Class } from "../../classes/entities/class.entity";
import { User } from "../../users/entities/user.entity";

@Entity("enrollments")
@Unique("UQ_enrollment_class_student", ["classId", "studentId"])
export class Enrollment {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ name: "class_id", type: "uuid" })
  classId!: string;

  @ManyToOne(() => Class, { onDelete: "CASCADE" })
  @JoinColumn({ name: "class_id" })
  class!: Class;

  @Column({ name: "student_id", type: "uuid" })
  studentId!: string;

  @ManyToOne(() => User, (user) => user.enrollments, { onDelete: "CASCADE" })
  @JoinColumn({ name: "student_id" })
  student!: User;

  @CreateDateColumn({ name: "enrolled_at", type: "timestamptz" })
  enrolledAt!: Date;
}
