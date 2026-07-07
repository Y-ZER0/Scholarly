import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  ConflictException,
  BadRequestException,
} from "@nestjs/common";
import { ClassStatus } from "@repo/shared";
import type { EnrollmentDto } from "@repo/shared";
import { EnrollmentsRepository } from "../repositories/enrollments.repository";
import { AddStudentRequestDto } from "../dtos/add-student-request.dto";
import { JoinClassRequestDto } from "../dtos/join-class-request.dto";
import type { TeacherEnrollmentDto } from "../dtos/teacher-enrollment.dto";
import { Enrollment } from "../entities/enrollment.entity";

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

@Injectable()
export class EnrollmentsService {
  constructor(private readonly repo: EnrollmentsRepository) {}

  async findTeacherEnrollments(
    teacherId: string,
    filters: {
      page: number;
      limit: number;
      classId?: string;
      search?: string;
    },
  ): Promise<{ data: TeacherEnrollmentDto[]; meta: PaginationMeta }> {
    let { page, limit } = filters;
    page = Math.max(1, page);
    limit = Math.max(1, Math.min(limit, 100));

    const [items, total] = await this.repo.findAllByTeacherId(
      teacherId,
      page,
      limit,
      filters.classId,
      filters.search,
    );

    return {
      data: items.map((e) => this.toTeacherEnrollmentDto(e)),
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async addStudent(
    dto: AddStudentRequestDto,
    teacherId: string,
  ): Promise<TeacherEnrollmentDto> {
    const classEntity = await this.repo.findClassById(dto.classId);
    if (!classEntity) throw new NotFoundException("Class not found");
    if (classEntity.teacherId !== teacherId) {
      throw new ForbiddenException("Class does not belong to you");
    }

    const student = await this.repo.findStudentByEmail(dto.studentEmail);
    if (!student) {
      throw new NotFoundException("Student not found");
    }

    const existing = await this.repo.findOneByClassAndStudent(
      dto.classId,
      student.id,
    );
    if (existing) {
      throw new ConflictException("Student is already enrolled in this class");
    }

    const count = await this.repo.countByClassId(dto.classId);
    if (count >= classEntity.capacity) {
      throw new BadRequestException("Class is full");
    }

    const enrollment = await this.repo.create({
      classId: dto.classId,
      studentId: student.id,
    });

    const loaded = await this.repo.findById(enrollment.id);
    if (!loaded) {
      throw new NotFoundException("Enrollment not found after creation");
    }

    return this.toTeacherEnrollmentDto(loaded);
  }

  async removeEnrollment(
    enrollmentId: string,
    teacherId: string,
  ): Promise<void> {
    const enrollment = await this.repo.findById(enrollmentId);
    if (!enrollment) throw new NotFoundException("Enrollment not found");

    if (enrollment.class.teacherId !== teacherId) {
      throw new ForbiddenException(
        "Enrollment does not belong to your class",
      );
    }

    await this.repo.remove(enrollmentId);
  }

  async getTeacherClasses(teacherId: string) {
    const classes = await this.repo.findTeacherClasses(teacherId);
    return classes.map((c) => ({
      id: c.id,
      name: c.name,
      subject: { name: c.subject.name, code: c.subject.code },
    }));
  }

  async joinByCode(
    dto: JoinClassRequestDto,
    studentId: string,
  ): Promise<EnrollmentDto> {
    const classEntity = await this.repo.findClassByInviteCode(dto.inviteCode);
    if (!classEntity) {
      throw new NotFoundException("Class not found with this invite code");
    }
    if (classEntity.status !== ClassStatus.ACTIVE) {
      throw new BadRequestException("Class is not active");
    }

    const existing = await this.repo.findOneByClassAndStudent(
      classEntity.id,
      studentId,
    );
    if (existing) {
      throw new ConflictException("You are already enrolled in this class");
    }

    const count = await this.repo.countByClassId(classEntity.id);
    if (count >= classEntity.capacity) {
      throw new BadRequestException("Class is full");
    }

    const enrollment = await this.repo.create({
      classId: classEntity.id,
      studentId,
    });

    const loaded = await this.repo.findById(enrollment.id);
    if (!loaded) {
      throw new NotFoundException("Enrollment not found after creation");
    }

    return this.toEnrollmentDto(loaded);
  }

  async findMyEnrollments(
    studentId: string,
    filters: { page: number; limit: number },
  ): Promise<{ data: EnrollmentDto[]; meta: PaginationMeta }> {
    let { page, limit } = filters;
    page = Math.max(1, page);
    limit = Math.max(1, Math.min(limit, 100));

    const [items, total] = await this.repo.findByStudentId(
      studentId,
      page,
      limit,
    );

    return {
      data: items.map((e) => this.toEnrollmentDto(e)),
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async findClassEnrollments(
    classId: string,
  ): Promise<{ data: { id: string; name: string; email: string; profilePhoto?: string; enrolledAt: string }[]; total: number }> {
    const [items, total] = await this.repo.findByClassId(classId, 1, 1000);
    return {
      data: items.map((e) => ({
        id: e.student.id,
        name: e.student.name,
        email: e.student.email,
        profilePhoto: e.student.profilePhoto,
        enrolledAt: e.enrolledAt.toISOString(),
      })),
      total,
    };
  }

  async unenroll(enrollmentId: string, studentId: string): Promise<void> {
    const enrollment = await this.repo.findById(enrollmentId);
    if (!enrollment) throw new NotFoundException("Enrollment not found");
    if (enrollment.studentId !== studentId) {
      throw new ForbiddenException("This enrollment does not belong to you");
    }
    await this.repo.remove(enrollmentId);
  }

  private toEnrollmentDto(e: Enrollment): EnrollmentDto {
    return {
      id: e.id,
      classId: e.classId,
      studentId: e.studentId,
      class: {
        id: e.class.id,
        name: e.class.name,
        bannerImage: e.class.bannerImage,
      },
      subject: {
        name: e.class.subject.name,
        code: e.class.subject.code,
      },
      teacher: {
        name: e.class.teacher.name,
      },
      enrolledAt: e.enrolledAt.toISOString(),
    };
  }

  private toTeacherEnrollmentDto(e: Enrollment): TeacherEnrollmentDto {
    return {
      id: e.id,
      classId: e.classId,
      className: e.class.name,
      student: {
        id: e.student.id,
        name: e.student.name,
        email: e.student.email,
        profilePhoto: e.student.profilePhoto,
      },
      subject: {
        name: e.class.subject.name,
        code: e.class.subject.code,
      },
      enrolledAt: e.enrolledAt.toISOString(),
    };
  }
}
