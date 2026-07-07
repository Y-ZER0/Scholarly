import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import type { FacultyDetailDto } from "@repo/shared";
import { UsersService } from "../../users/services/users.service";
import { User } from "../../users/entities/user.entity";
import { Class } from "../../classes/entities/class.entity";

@Injectable()
export class FacultyService {
  constructor(
    private readonly usersService: UsersService,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async findAll(page: number, limit: number, search?: string) {
    return this.usersService.findAll(page, limit, "teacher", search);
  }

  async findById(id: string): Promise<FacultyDetailDto> {
    const user = await this.usersService.findById(id);

    const classes = await this.userRepo.manager.find(Class, {
      where: { teacherId: id },
      relations: { subject: { department: true } },
      order: { createdAt: "DESC" },
    });

    const deptMap = new Map<
      string,
      { id: string; code: string; name: string; description: string }
    >();
    const subjectMap = new Map<
      string,
      {
        id: string;
        code: string;
        name: string;
        department: { id: string; code: string; name: string };
      }
    >();

    for (const cls of classes) {
      if (cls.subject?.department) {
        const d = cls.subject.department;
        if (!deptMap.has(d.id)) {
          deptMap.set(d.id, {
            id: d.id,
            code: d.code,
            name: d.name,
            description: d.description,
          });
        }
      }
      if (cls.subject && !subjectMap.has(cls.subject.id)) {
        subjectMap.set(cls.subject.id, {
          id: cls.subject.id,
          code: cls.subject.code,
          name: cls.subject.name,
          department: cls.subject.department
            ? {
                id: cls.subject.department.id,
                code: cls.subject.department.code,
                name: cls.subject.department.name,
              }
            : { id: "", code: "", name: "" },
        });
      }
    }

    return {
      ...user,
      departments: Array.from(deptMap.values()),
      subjects: Array.from(subjectMap.values()),
      classes: classes.map((c) => ({
        id: c.id,
        name: c.name,
        subject: c.subject
          ? {
              id: c.subject.id,
              code: c.subject.code,
              name: c.subject.name,
            }
          : { id: "", code: "", name: "" },
        status: c.status,
        createdAt: c.createdAt.toISOString(),
      })),
    };
  }
}
