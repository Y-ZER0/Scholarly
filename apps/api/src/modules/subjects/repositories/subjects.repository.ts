import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UserRole } from "@repo/shared";
import { Subject } from "../entities/subject.entity";
import { Class } from "../../classes/entities/class.entity";
import { Enrollment } from "../../enrollments/entities/enrollment.entity";
import { User } from "../../users/entities/user.entity";

@Injectable()
export class SubjectsRepository {
  constructor(
    @InjectRepository(Subject)
    private readonly repo: Repository<Subject>,
  ) {}

  async findAll(
    page: number,
    limit: number,
    search?: string,
    departmentId?: string,
  ): Promise<[Subject[], number]> {
    const qb = this.repo
      .createQueryBuilder("subj")
      .leftJoinAndSelect("subj.department", "dept");

    if (search) {
      qb.where(
        "(subj.name ILIKE :search OR subj.code ILIKE :search)",
        { search: `%${search}%` },
      );
    }

    if (departmentId) {
      qb.andWhere("subj.departmentId = :departmentId", { departmentId });
    }

    return qb
      .orderBy("subj.createdAt", "DESC")
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();
  }

  async findById(id: string): Promise<Subject | null> {
    return this.repo.findOne({
      where: { id },
      relations: { department: true },
    });
  }

  async findByCode(code: string): Promise<Subject | null> {
    return this.repo.findOne({ where: { code } });
  }

  async findClassesBySubject(subjectId: string) {
    const classes = await this.repo.manager.find(Class, {
      where: { subjectId },
      relations: { teacher: true },
      order: { createdAt: "DESC" },
    });
    return classes.map((c) => ({
      id: c.id,
      name: c.name,
      status: c.status,
      teacher: {
        id: c.teacher.id,
        name: c.teacher.name,
        email: c.teacher.email,
        profilePhoto: c.teacher.profilePhoto,
      },
    }));
  }

  async findTeachersBySubject(subjectId: string) {
    const classes = await this.repo.manager.find(Class, {
      where: { subjectId },
      select: { teacherId: true },
    });
    const teacherIds = [...new Set(classes.map((c) => c.teacherId))];
    if (teacherIds.length === 0) return [];

    return this.repo.manager.find(User, {
      where: teacherIds.map((id) => ({ id, role: UserRole.TEACHER })),
      select: { id: true, name: true, email: true, profilePhoto: true, role: true },
      order: { name: "ASC" },
    });
  }

  async findStudentsBySubject(subjectId: string) {
    const classes = await this.repo.manager.find(Class, {
      where: { subjectId },
      select: { id: true },
    });
    const classIds = classes.map((c) => c.id);
    if (classIds.length === 0) return [];

    const enrollments = await this.repo.manager.find(Enrollment, {
      where: classIds.map((id) => ({ classId: id })),
      select: { studentId: true },
    });
    const studentIds = [...new Set(enrollments.map((e) => e.studentId))];
    if (studentIds.length === 0) return [];

    return this.repo.manager.find(User, {
      where: studentIds.map((id) => ({ id, role: UserRole.STUDENT })),
      select: { id: true, name: true, email: true, profilePhoto: true, role: true },
      order: { name: "ASC" },
    });
  }

  async create(data: Partial<Subject>): Promise<Subject> {
    return this.repo.save(this.repo.create(data));
  }

  async update(id: string, data: Partial<Subject>): Promise<Subject | null> {
    await this.repo.update(id, data);
    return this.findById(id);
  }

  async remove(id: string): Promise<void> {
    await this.repo.delete(id);
  }
}
