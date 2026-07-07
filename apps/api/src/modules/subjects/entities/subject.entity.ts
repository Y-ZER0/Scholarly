import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Department } from "../../departments/entities/department.entity";

@Entity("subjects")
export class Subject {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ length: 20, unique: true })
  code!: string;

  @Column({ length: 255 })
  name!: string;

  @Column({ type: "text" })
  description!: string;

  @Column({ name: "department_id", type: "uuid" })
  departmentId!: string;

  @ManyToOne(() => Department, (department) => department.subjects, {
    onDelete: "RESTRICT",
  })
  @JoinColumn({ name: "department_id" })
  department!: Department;

  @CreateDateColumn({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;
}
