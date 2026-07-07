import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UserRole } from "@repo/shared";
import type { ClassDto, UserDto } from "@repo/shared";
import { User } from "../../users/entities/user.entity";
import { Department } from "../../departments/entities/department.entity";
import { Subject } from "../../subjects/entities/subject.entity";
import { Class } from "../../classes/entities/class.entity";
import { Enrollment } from "../../enrollments/entities/enrollment.entity";

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(User) private readonly usersRepo: Repository<User>,
    @InjectRepository(Department)
    private readonly deptsRepo: Repository<Department>,
    @InjectRepository(Subject)
    private readonly subjectsRepo: Repository<Subject>,
    @InjectRepository(Class)
    private readonly classesRepo: Repository<Class>,
    @InjectRepository(Enrollment)
    private readonly enrollmentsRepo: Repository<Enrollment>,
  ) {}

  async getStats() {
    const [
      totalUsers,
      teachers,
      students,
      admins,
      subjects,
      departments,
      classes,
    ] = await Promise.all([
      this.usersRepo.count(),
      this.usersRepo.count({ where: { role: UserRole.TEACHER } }),
      this.usersRepo.count({ where: { role: UserRole.STUDENT } }),
      this.usersRepo.count({ where: { role: UserRole.ADMIN } }),
      this.subjectsRepo.count(),
      this.deptsRepo.count(),
      this.classesRepo.count(),
    ]);

    return {
      totalUsers,
      teachers,
      students,
      admins,
      subjects,
      departments,
      classes,
    };
  }

  async getCharts() {
    const [usersByRole, subjectsPerDepartment, classesPerSubject] =
      await Promise.all([
        this.usersRepo
          .createQueryBuilder("user")
          .select("user.role", "role")
          .addSelect("COUNT(*)", "count")
          .groupBy("user.role")
          .orderBy("user.role")
          .getRawMany(),
        this.subjectsRepo
          .createQueryBuilder("subject")
          .leftJoinAndSelect("subject.department", "department")
          .select("department.name", "name")
          .addSelect("COUNT(subject.id)", "count")
          .groupBy("department.id")
          .addGroupBy("department.name")
          .orderBy("count", "DESC")
          .getRawMany(),
        this.classesRepo
          .createQueryBuilder("class")
          .leftJoinAndSelect("class.subject", "subject")
          .select("subject.name", "name")
          .addSelect("COUNT(class.id)", "count")
          .groupBy("subject.id")
          .addGroupBy("subject.name")
          .orderBy("count", "DESC")
          .getRawMany(),
      ]);

    return { usersByRole, subjectsPerDepartment, classesPerSubject };
  }

  async getRecent() {
    const [newestClasses, newestTeachers] = await Promise.all([
      this.classesRepo.find({
        relations: { subject: { department: true }, teacher: true },
        order: { createdAt: "DESC" },
        take: 5,
      }),
      this.usersRepo.find({
        where: { role: UserRole.TEACHER },
        order: { createdAt: "DESC" },
        take: 5,
      }),
    ]);

    const classIds = newestClasses.map((c) => c.id);
    const enrollmentMap =
      classIds.length > 0
        ? await this.enrollmentsRepo
            .createQueryBuilder("e")
            .select("e.classId", "classId")
            .addSelect("COUNT(*)", "count")
            .where("e.classId IN (:...classIds)", { classIds })
            .groupBy("e.classId")
            .getRawMany()
        : [];

    const enrollmentCounts = new Map(
      enrollmentMap.map((r: { classId: string; count: string }) => [
        r.classId,
        parseInt(r.count, 10),
      ]),
    );

    const [departmentsWithMostSubjects, subjectsWithMostClasses] =
      await Promise.all([
        this.subjectsRepo
          .createQueryBuilder("subject")
          .leftJoinAndSelect("subject.department", "department")
          .select("department.name", "name")
          .addSelect("COUNT(subject.id)", "subjectCount")
          .groupBy("department.id")
          .addGroupBy("department.name")
          .orderBy("subjectCount", "DESC")
          .limit(5)
          .getRawMany(),
        this.classesRepo
          .createQueryBuilder("class")
          .leftJoinAndSelect("class.subject", "subject")
          .select("subject.name", "name")
          .addSelect("COUNT(class.id)", "classCount")
          .groupBy("subject.id")
          .addGroupBy("subject.name")
          .orderBy("classCount", "DESC")
          .limit(5)
          .getRawMany(),
      ]);

    return {
      newestClasses: newestClasses.map((c) =>
        this.toClassDto(c, enrollmentCounts.get(c.id) ?? 0),
      ),
      newestTeachers: newestTeachers.map((u) => this.toUserDto(u)),
      departmentsWithMostSubjects: departmentsWithMostSubjects.map(
        (d: { name: string; subjectCount: string }) => ({
          name: d.name,
          subjectCount: parseInt(d.subjectCount, 10),
        }),
      ),
      subjectsWithMostClasses: subjectsWithMostClasses.map(
        (s: { name: string; classCount: string }) => ({
          name: s.name,
          classCount: parseInt(s.classCount, 10),
        }),
      ),
    };
  }

  private toClassDto(c: Class, enrollmentCount: number): ClassDto {
    return {
      id: c.id,
      name: c.name,
      description: c.description,
      bannerImage: c.bannerImage,
      capacity: c.capacity,
      status: c.status,
      inviteCode: c.inviteCode,
      subjectId: c.subjectId,
      teacherId: c.teacherId,
      subject: {
        id: c.subject.id,
        code: c.subject.code,
        name: c.subject.name,
        description: c.subject.description,
      },
      department: {
        id: c.subject.department.id,
        name: c.subject.department.name,
        description: c.subject.department.description,
      },
      teacher: {
        id: c.teacher.id,
        name: c.teacher.name,
        email: c.teacher.email,
        profilePhoto: c.teacher.profilePhoto,
      },
      enrollmentCount,
      spotsRemaining: c.capacity - enrollmentCount,
      createdAt: c.createdAt.toISOString(),
    };
  }

  private toUserDto(u: User): UserDto {
    return {
      id: u.id,
      name: u.name,
      email: u.email,
      role: u.role,
      profilePhoto: u.profilePhoto,
      createdAt: u.createdAt.toISOString(),
    };
  }
}
