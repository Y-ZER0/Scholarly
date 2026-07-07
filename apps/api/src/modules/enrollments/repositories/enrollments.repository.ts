import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UserRole } from "@repo/shared";
import { Enrollment } from "../entities/enrollment.entity";
import { User } from "../../users/entities/user.entity";
import { Class } from "../../classes/entities/class.entity";

@Injectable()
export class EnrollmentsRepository {
  constructor(
    @InjectRepository(Enrollment)
    private readonly repo: Repository<Enrollment>,
  ) {}

  async findAllByTeacherId(
    teacherId: string,
    page: number,
    limit: number,
    classId?: string,
    search?: string,
  ): Promise<[Enrollment[], number]> {
    const qb = this.repo
      .createQueryBuilder("enrollment")
      .leftJoinAndSelect("enrollment.class", "class")
      .leftJoinAndSelect("enrollment.student", "student")
      .leftJoinAndSelect("class.subject", "subject")
      .where("class.teacherId = :teacherId", { teacherId });

    if (classId) {
      qb.andWhere("enrollment.classId = :classId", { classId });
    }

    if (search) {
      qb.andWhere(
        "(student.name ILIKE :search OR student.email ILIKE :search)",
        { search: `%${search}%` },
      );
    }

    return qb
      .orderBy("enrollment.enrolledAt", "DESC")
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();
  }

  async findByClassId(
    classId: string,
    page: number,
    limit: number,
  ): Promise<[Enrollment[], number]> {
    return this.repo.findAndCount({
      where: { classId },
      relations: { student: true },
      order: { enrolledAt: "DESC" },
      skip: (page - 1) * limit,
      take: limit,
    });
  }

  async findById(id: string): Promise<Enrollment | null> {
    return this.repo.findOne({
      where: { id },
      relations: { class: { subject: true, teacher: true }, student: true },
    });
  }

  async findOneByClassAndStudent(
    classId: string,
    studentId: string,
  ): Promise<Enrollment | null> {
    return this.repo.findOne({
      where: { classId, studentId },
    });
  }

  async countByClassId(classId: string): Promise<number> {
    return this.repo.count({ where: { classId } });
  }

  async create(data: Partial<Enrollment>): Promise<Enrollment> {
    return this.repo.save(this.repo.create(data));
  }

  async remove(id: string): Promise<void> {
    await this.repo.delete(id);
  }

  async findStudentByEmail(email: string): Promise<User | null> {
    return this.repo.manager.findOne(User, {
      where: { email, role: UserRole.STUDENT },
    });
  }

  async findClassById(id: string): Promise<Class | null> {
    return this.repo.manager.findOne(Class, { where: { id } });
  }

  async findByStudentId(
    studentId: string,
    page: number,
    limit: number,
  ): Promise<[Enrollment[], number]> {
    const qb = this.repo
      .createQueryBuilder("enrollment")
      .leftJoinAndSelect("enrollment.class", "class")
      .leftJoinAndSelect("class.subject", "subject")
      .leftJoinAndSelect("class.teacher", "teacher")
      .leftJoinAndSelect("subject.department", "department")
      .where("enrollment.studentId = :studentId", { studentId });

    return qb
      .orderBy("enrollment.enrolledAt", "DESC")
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();
  }

  async findClassByInviteCode(inviteCode: string): Promise<Class | null> {
    return this.repo.manager.findOne(Class, {
      where: { inviteCode },
    });
  }

  async findTeacherClasses(teacherId: string): Promise<Class[]> {
    return this.repo.manager
      .createQueryBuilder(Class, "class")
      .leftJoinAndSelect("class.subject", "subject")
      .where("class.teacherId = :teacherId", { teacherId })
      .orderBy("class.createdAt", "DESC")
      .getMany();
  }
}
