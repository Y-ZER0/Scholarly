import {
  Injectable,
  NotFoundException,
  ConflictException,
} from "@nestjs/common";
import type { DepartmentDto } from "@repo/shared";
import { DepartmentsRepository } from "../repositories/departments.repository";
import { CreateDepartmentRequestDto } from "../dtos/create-department-request.dto";
import { UpdateDepartmentRequestDto } from "../dtos/update-department-request.dto";
import { Department } from "../entities/department.entity";

@Injectable()
export class DepartmentsService {
  constructor(private readonly repo: DepartmentsRepository) {}

  async findAll(page: number, limit: number, search?: string) {
    page = Math.max(1, page);
    limit = Math.max(1, Math.min(limit, 100));
    const [items, total] = await this.repo.findAll(page, limit, search);
    return {
      data: items.map(this.toDto),
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async findById(id: string): Promise<DepartmentDto> {
    const department = await this.repo.findById(id);
    if (!department) throw new NotFoundException(`Department ${id} not found`);

    const [subjects, classes, teachers, students] = await Promise.all([
      this.repo.findSubjectsByDepartment(id),
      this.repo.findClassesByDepartment(id),
      this.repo.findTeachersByDepartment(id),
      this.repo.findStudentsByDepartment(id),
    ]);

    return {
      ...this.toDto(department),
      totalSubjects: subjects.length,
      totalClasses: classes.length,
      enrolledStudents: await this.repo.countStudentsByDepartment(id),
      subjects,
      classes,
      teachers,
      students,
    };
  }

  async create(dto: CreateDepartmentRequestDto): Promise<DepartmentDto> {
    const existing = await this.repo.findByCode(dto.code);
    if (existing) throw new ConflictException("Department code already exists");
    const department = await this.repo.create(dto);
    return this.toDto(department);
  }

  async update(id: string, dto: UpdateDepartmentRequestDto): Promise<DepartmentDto> {
    await this.findById(id);
    if (dto.code) {
      const existing = await this.repo.findByCode(dto.code);
      if (existing && existing.id !== id) {
        throw new ConflictException("Department code already exists");
      }
    }
    const updated = await this.repo.update(id, dto);
    if (!updated) throw new NotFoundException(`Department ${id} not found after update`);
    return this.toDto(updated);
  }

  async remove(id: string): Promise<void> {
    await this.findById(id);
    await this.repo.remove(id);
  }

  private toDto(department: Department): DepartmentDto {
    return {
      id: department.id,
      code: department.code,
      name: department.name,
      description: department.description,
      createdAt: department.createdAt.toISOString(),
    };
  }


}
