import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UserRole } from "@repo/shared";
import { Department } from "../entities/department.entity";
import { Subject } from "../../subjects/entities/subject.entity";
import { Class } from "../../classes/entities/class.entity";
import { Enrollment } from "../../enrollments/entities/enrollment.entity";
import { User } from "../../users/entities/user.entity";

@Injectable()
export class DepartmentsRepository {
  constructor(
    @InjectRepository(Department)
    private readonly repo: Repository<Department>,
  ) {}

  async findAll(
    page: number,
    limit: number,
    search?: string,
  ): Promise<[Department[], number]> {
    const qb = this.repo.createQueryBuilder("dept");

    if (search) {
      qb.where(
        "(dept.name ILIKE :search OR dept.code ILIKE :search)",
        { search: `%${search}%` },
      );
    }

    return qb
      .orderBy("dept.createdAt", "DESC")
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();
  }

  async findById(id: string): Promise<Department | null> {
    return this.repo.findOne({ where: { id } });
  }

  async findSubjectsByDepartment(departmentId: string) {
    const subjects = await this.repo.manager.find(Subject, {
      where: { departmentId },
      select: { id: true, code: true, name: true, description: true },
      order: { createdAt: "DESC" },
    });
    return subjects;
  }

  async findClassesByDepartment(departmentId: string) {
    const classes = await this.repo.manager.find(Class, {
      relations: { subject: true, teacher: true },
      order: { createdAt: "DESC" },
    });
    return classes
      .filter((c) => c.subject.departmentId === departmentId)
      .map((c) => ({
        id: c.id,
        name: c.name,
        status: c.status,
        subject: { id: c.subject.id, code: c.subject.code, name: c.subject.name },
        teacher: {
          id: c.teacher.id,
          name: c.teacher.name,
          email: c.teacher.email,
          profilePhoto: c.teacher.profilePhoto,
        },
      }));
  }

  async findTeachersByDepartment(departmentId: string) {
    const subjects = await this.repo.manager.find(Subject, {
      where: { departmentId },
      select: { id: true },
    });
    const subjectIds = subjects.map((s) => s.id);
    if (subjectIds.length === 0) return [];

    const classes = await this.repo.manager.find(Class, {
      where: subjectIds.map((id) => ({ subjectId: id })),
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

  async findStudentsByDepartment(departmentId: string) {
    const subjects = await this.repo.manager.find(Subject, {
      where: { departmentId },
      select: { id: true },
    });
    const subjectIds = subjects.map((s) => s.id);
    if (subjectIds.length === 0) return [];

    const classes = await this.repo.manager.find(Class, {
      where: subjectIds.map((id) => ({ subjectId: id })),
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

  async countStudentsByDepartment(departmentId: string): Promise<number> {
    const subjects = await this.repo.manager.find(Subject, {
      where: { departmentId },
      select: { id: true },
    });
    const subjectIds = subjects.map((s) => s.id);
    if (subjectIds.length === 0) return 0;

    const classes = await this.repo.manager.find(Class, {
      where: subjectIds.map((id) => ({ subjectId: id })),
      select: { id: true },
    });
    const classIds = classes.map((c) => c.id);
    if (classIds.length === 0) return 0;

    const enrollments = await this.repo.manager.find(Enrollment, {
      where: classIds.map((id) => ({ classId: id })),
      select: { studentId: true },
    });
    return new Set(enrollments.map((e) => e.studentId)).size;
  }

  async findByCode(code: string): Promise<Department | null> {
    return this.repo.findOne({ where: { code } });
  }

  async create(data: Partial<Department>): Promise<Department> {
    return this.repo.save(this.repo.create(data));
  }

  async update(id: string, data: Partial<Department>): Promise<Department | null> {
    await this.repo.update(id, data);
    return this.findById(id);
  }

  async remove(id: string): Promise<void> {
    await this.repo.delete(id);
  }
}
