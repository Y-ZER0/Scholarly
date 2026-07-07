import { Injectable, NotFoundException } from "@nestjs/common";
import { ClassStatus } from "@repo/shared";
import type { ClassDto } from "@repo/shared";
import { ClassesRepository } from "../repositories/classes.repository";
import { CreateClassRequestDto } from "../dtos/create-class-request.dto";
import { UpdateClassRequestDto } from "../dtos/update-class-request.dto";
import { Class } from "../entities/class.entity";

@Injectable()
export class ClassesService {
  constructor(private readonly repo: ClassesRepository) {}

  private async generateInviteCode(): Promise<string> {
    const { nanoid } = await import("nanoid");
    return nanoid(8);
  }

  async findAll(
    page: number,
    limit: number,
    search?: string,
    subjectId?: string,
    teacherId?: string,
    status?: string,
  ) {
    page = Math.max(1, page);
    limit = Math.max(1, Math.min(limit, 100));

    const statusEnum = status ? (status as ClassStatus) : undefined;

    const [items, total] = await this.repo.findAll(
      page,
      limit,
      search,
      subjectId,
      teacherId,
      statusEnum,
    );

    const classIds = items.map((c) => c.id);
    const enrollmentCounts = await this.repo.countEnrollmentsBatch(classIds);

    const data = items.map((item) => {
      const enrollmentCount = enrollmentCounts.get(item.id) ?? 0;
      return this.toDto(item, enrollmentCount);
    });

    return {
      data,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async findById(id: string): Promise<ClassDto> {
    const classEntity = await this.repo.findById(id);
    if (!classEntity) throw new NotFoundException(`Class ${id} not found`);

    const enrollmentCounts = await this.repo.countEnrollmentsBatch([id]);
    const enrollmentCount = enrollmentCounts.get(id) ?? 0;

    return this.toDto(classEntity, enrollmentCount);
  }

  async create(dto: CreateClassRequestDto): Promise<ClassDto> {
    const inviteCode = await this.generateInviteCode();
    const classEntity = await this.repo.create({ ...dto, inviteCode });
    const loaded = await this.repo.findById(classEntity.id);
    if (!loaded) {
      throw new NotFoundException(
        `Class ${classEntity.id} not found after creation`,
      );
    }
    return this.toDto(loaded, 0);
  }

  async update(id: string, dto: UpdateClassRequestDto): Promise<ClassDto> {
    await this.findById(id);
    const updated = await this.repo.update(id, dto);
    if (!updated) {
      throw new NotFoundException(`Class ${id} not found after update`);
    }
    const enrollmentCounts = await this.repo.countEnrollmentsBatch([id]);
    const enrollmentCount = enrollmentCounts.get(id) ?? 0;
    return this.toDto(updated, enrollmentCount);
  }

  async getAvailableClasses(
    studentId: string,
    page: number,
    limit: number,
    search?: string,
  ) {
    page = Math.max(1, page);
    limit = Math.max(1, Math.min(limit, 100));

    const [items, total] = await this.repo.findAllAvailable(
      studentId,
      page,
      limit,
      search,
    );

    const classIds = items.map((c) => c.id);
    const enrollmentCounts = await this.repo.countEnrollmentsBatch(classIds);

    const available = items.filter((item) => {
      const count = enrollmentCounts.get(item.id) ?? 0;
      return count < item.capacity;
    });

    return {
      data: available.map((item) => {
        const enrollmentCount = enrollmentCounts.get(item.id) ?? 0;
        return this.toDto(item, enrollmentCount);
      }),
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async remove(id: string): Promise<void> {
    await this.findById(id);
    await this.repo.remove(id);
  }

  private toDto(classEntity: Class, enrollmentCount: number): ClassDto {
    return {
      id: classEntity.id,
      name: classEntity.name,
      description: classEntity.description,
      bannerImage: classEntity.bannerImage,
      capacity: classEntity.capacity,
      status: classEntity.status,
      inviteCode: classEntity.inviteCode,
      subjectId: classEntity.subjectId,
      teacherId: classEntity.teacherId,
      subject: {
        id: classEntity.subject.id,
        code: classEntity.subject.code,
        name: classEntity.subject.name,
        description: classEntity.subject.description,
      },
      department: {
        id: classEntity.subject.department.id,
        name: classEntity.subject.department.name,
        description: classEntity.subject.department.description,
      },
      teacher: {
        id: classEntity.teacher.id,
        name: classEntity.teacher.name,
        email: classEntity.teacher.email,
        profilePhoto: classEntity.teacher.profilePhoto,
      },
      enrollmentCount,
      spotsRemaining: classEntity.capacity - enrollmentCount,
      createdAt: classEntity.createdAt.toISOString(),
    };
  }
}
