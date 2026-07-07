import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from "typeorm";
import { Subject } from "../../subjects/entities/subject.entity";

@Entity("departments")
export class Department {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ length: 20, unique: true })
  code!: string;

  @Column({ length: 255 })
  name!: string;

  @Column({ type: "text" })
  description!: string;

  @OneToMany(() => Subject, (subject) => subject.department)
  subjects?: Subject[];

  @CreateDateColumn({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;
}
