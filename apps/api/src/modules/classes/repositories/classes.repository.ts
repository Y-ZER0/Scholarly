import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ClassStatus } from "@repo/shared";
import { Class } from "../entities/class.entity";
import { Enrollment } from "../../enrollments/entities/enrollment.entity";

@Injectable()
export class ClassesRepository {
  constructor(
    @InjectRepository(Class)
    private readonly repo: Repository<Class>,
  ) {}

  async findAll(
    page: number,
    limit: number,
    search?: string,
    subjectId?: string,
    teacherId?: string,
    status?: ClassStatus,
  ): Promise<[Class[], number]> {
    const qb = this.repo
      .createQueryBuilder("class")
      .leftJoinAndSelect("class.subject", "subject")
      .leftJoinAndSelect("subject.department", "department")
      .leftJoinAndSelect("class.teacher", "teacher");

    if (search) {
      qb.where(
        "(class.name ILIKE :search OR class.description ILIKE :search)",
        { search: `%${search}%` },
      );
    }

    if (subjectId) {
      qb.andWhere("class.subjectId = :subjectId", { subjectId });
    }

    if (teacherId) {
      qb.andWhere("class.teacherId = :teacherId", { teacherId });
    }

    if (status) {
      qb.andWhere("class.status = :status", { status });
    }

    return qb
      .orderBy("class.createdAt", "DESC")
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();
  }

  async findById(id: string): Promise<Class | null> {
    return this.repo.findOne({
      where: { id },
      relations: {
        subject: { department: true },
        teacher: true,
      },
    });
  }

  async findByInviteCode(inviteCode: string): Promise<Class | null> {
    return this.repo.findOne({ where: { inviteCode } });
  }

  async findAllAvailable(
    studentId: string,
    page: number,
    limit: number,
    search?: string,
  ): Promise<[Class[], number]> {
    const subQuery = this.repo
      .createQueryBuilder()
      .subQuery()
      .select("e.classId")
      .from(Enrollment, "e")
      .where("e.studentId = :studentId")
      .getQuery();

    const qb = this.repo
      .createQueryBuilder("class")
      .leftJoinAndSelect("class.subject", "subject")
      .leftJoinAndSelect("subject.department", "department")
      .leftJoinAndSelect("class.teacher", "teacher")
      .where("class.status = :status", { status: ClassStatus.ACTIVE })
      .andWhere(`class.id NOT IN ${subQuery}`, { studentId });

    if (search) {
      qb.andWhere(
        "(class.name ILIKE :search OR class.description ILIKE :search)",
        { search: `%${search}%` },
      );
    }

    return qb
      .orderBy("class.createdAt", "DESC")
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();
  }

  async countEnrollmentsBatch(classIds: string[]): Promise<Map<string, number>> {
    if (classIds.length === 0) return new Map();

    const result = await this.repo.manager
      .createQueryBuilder(Enrollment, "e")
      .select("e.classId", "classId")
      .addSelect("COUNT(*)", "count")
      .where("e.classId IN (:...classIds)", { classIds })
      .groupBy("e.classId")
      .getRawMany();

    return new Map(result.map((r) => [r.classId, parseInt(r.count, 10)]));
  }

  async create(data: Partial<Class>): Promise<Class> {
    return this.repo.save(this.repo.create(data));
  }

  async update(id: string, data: Partial<Class>): Promise<Class | null> {
    await this.repo.update(id, data);
    return this.findById(id);
  }

  async remove(id: string): Promise<void> {
    await this.repo.delete(id);
  }
}
