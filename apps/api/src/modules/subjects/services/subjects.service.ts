import {
  Injectable,
  NotFoundException,
  ConflictException,
} from "@nestjs/common";
import type { SubjectDto } from "@repo/shared";
import { SubjectsRepository } from "../repositories/subjects.repository";
import { CreateSubjectRequestDto } from "../dtos/create-subject-request.dto";
import { UpdateSubjectRequestDto } from "../dtos/update-subject-request.dto";
import { Subject } from "../entities/subject.entity";

@Injectable()
export class SubjectsService {
  constructor(private readonly repo: SubjectsRepository) {}

  async findAll(page: number, limit: number, search?: string, departmentId?: string) {
    page = Math.max(1, page);
    limit = Math.max(1, Math.min(limit, 100));
    const [items, total] = await this.repo.findAll(page, limit, search, departmentId);
    return {
      data: items.map(this.toDto),
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async findById(id: string): Promise<SubjectDto> {
    const subject = await this.repo.findById(id);
    if (!subject) throw new NotFoundException(`Subject ${id} not found`);

    const [classes, teachers, students] = await Promise.all([
      this.repo.findClassesBySubject(id),
      this.repo.findTeachersBySubject(id),
      this.repo.findStudentsBySubject(id),
    ]);

    return {
      ...this.toDto(subject),
      totalClasses: classes.length,
      totalStudents: students.length,
      classes,
      teachers,
      students,
    };
  }

  async create(dto: CreateSubjectRequestDto): Promise<SubjectDto> {
    const existing = await this.repo.findByCode(dto.code);
    if (existing) throw new ConflictException("Subject code already exists");
    const subject = await this.repo.create(dto);
    const loaded = await this.repo.findById(subject.id);
    if (!loaded) throw new NotFoundException(`Subject ${subject.id} not found after creation`);
    return this.toDto(loaded);
  }

  async update(id: string, dto: UpdateSubjectRequestDto): Promise<SubjectDto> {
    await this.findById(id);
    if (dto.code) {
      const existing = await this.repo.findByCode(dto.code);
      if (existing && existing.id !== id) {
        throw new ConflictException("Subject code already exists");
      }
    }
    const updated = await this.repo.update(id, dto);
    if (!updated) throw new NotFoundException(`Subject ${id} not found after update`);
    return this.toDto(updated);
  }

  async remove(id: string): Promise<void> {
    await this.findById(id);
    await this.repo.remove(id);
  }

  private toDto(subject: Subject): SubjectDto {
    return {
      id: subject.id,
      code: subject.code,
      name: subject.name,
      description: subject.description,
      departmentId: subject.departmentId,
      department: {
        code: subject.department.code,
        name: subject.department.name,
        description: subject.department.description,
      },
      createdAt: subject.createdAt.toISOString(),
    };
  }
}
