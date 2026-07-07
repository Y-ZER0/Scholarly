import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Query,
  Body,
  DefaultValuePipe,
  ParseIntPipe,
  UseGuards,
} from "@nestjs/common";
import { UserRole } from "@repo/shared";
import { EnrollmentsService } from "../services/enrollments.service";
import { AddStudentRequestDto } from "../dtos/add-student-request.dto";
import { JoinClassRequestDto } from "../dtos/join-class-request.dto";
import { Roles } from "../../../shared/decorators/roles.decorator";
import { RolesGuard } from "../../../shared/guards/roles.guard";
import { CurrentUser } from "../../../shared/decorators/current-user.decorator";

@Controller("enrollments")
export class EnrollmentsController {
  constructor(private readonly enrollmentsService: EnrollmentsService) {}

  @Get("teacher")
  @Roles(UserRole.TEACHER)
  @UseGuards(RolesGuard)
  async findTeacherEnrollments(
    @CurrentUser() user: { userId: string; role: UserRole },
    @Query("page", new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query("limit", new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query("classId") classId?: string,
    @Query("search") search?: string,
  ) {
    const result = await this.enrollmentsService.findTeacherEnrollments(
      user.userId,
      { page, limit, classId, search },
    );
    return { success: true, ...result };
  }

  @Get("teacher/classes")
  @Roles(UserRole.TEACHER)
  @UseGuards(RolesGuard)
  async getTeacherClasses(
    @CurrentUser() user: { userId: string; role: UserRole },
  ) {
    const data = await this.enrollmentsService.getTeacherClasses(user.userId);
    return { success: true, data };
  }

  @Post("teacher/add")
  @Roles(UserRole.TEACHER)
  @UseGuards(RolesGuard)
  async addStudent(
    @CurrentUser() user: { userId: string; role: UserRole },
    @Body() dto: AddStudentRequestDto,
  ) {
    const data = await this.enrollmentsService.addStudent(dto, user.userId);
    return { success: true, data };
  }

  @Delete("teacher/:id")
  @Roles(UserRole.TEACHER)
  @UseGuards(RolesGuard)
  async removeEnrollment(
    @CurrentUser() user: { userId: string; role: UserRole },
    @Param("id") id: string,
  ) {
    await this.enrollmentsService.removeEnrollment(id, user.userId);
    return { success: true, data: null };
  }

  @Get("class/:classId")
  async findClassEnrollments(@Param("classId") classId: string) {
    const result = await this.enrollmentsService.findClassEnrollments(classId);
    return { success: true, ...result };
  }

  @Get()
  @Roles(UserRole.STUDENT)
  @UseGuards(RolesGuard)
  async findMyEnrollments(
    @CurrentUser() user: { userId: string; role: UserRole },
    @Query("page", new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query("limit", new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    const result = await this.enrollmentsService.findMyEnrollments(
      user.userId,
      { page, limit },
    );
    return { success: true, ...result };
  }

  @Post("join")
  @Roles(UserRole.STUDENT)
  @UseGuards(RolesGuard)
  async joinByCode(
    @CurrentUser() user: { userId: string; role: UserRole },
    @Body() dto: JoinClassRequestDto,
  ) {
    const data = await this.enrollmentsService.joinByCode(dto, user.userId);
    return { success: true, data };
  }

  @Delete(":id")
  @Roles(UserRole.STUDENT)
  @UseGuards(RolesGuard)
  async unenroll(
    @CurrentUser() user: { userId: string; role: UserRole },
    @Param("id") id: string,
  ) {
    await this.enrollmentsService.unenroll(id, user.userId);
    return { success: true, data: null };
  }
}
