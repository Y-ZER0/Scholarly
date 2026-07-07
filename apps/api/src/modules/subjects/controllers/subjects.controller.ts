import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Query,
  Body,
  DefaultValuePipe,
  ParseIntPipe,
  UseGuards,
} from "@nestjs/common";
import { UserRole } from "@repo/shared";
import { SubjectsService } from "../services/subjects.service";
import { CreateSubjectRequestDto } from "../dtos/create-subject-request.dto";
import { UpdateSubjectRequestDto } from "../dtos/update-subject-request.dto";
import { Roles } from "@/shared/decorators/roles.decorator";
import { RolesGuard } from "@/shared/guards/roles.guard";

@Controller("subjects")
export class SubjectsController {
  constructor(private readonly subjectsService: SubjectsService) {}

  @Get()
  async findAll(
    @Query("page", new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query("limit", new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query("search") search?: string,
    @Query("departmentId") departmentId?: string,
  ) {
    const result = await this.subjectsService.findAll(page, limit, search, departmentId);
    return { success: true, ...result };
  }

  @Get(":id")
  async findOne(@Param("id") id: string) {
    const data = await this.subjectsService.findById(id);
    return { success: true, data };
  }

  @Post()
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  @UseGuards(RolesGuard)
  async create(@Body() dto: CreateSubjectRequestDto) {
    const data = await this.subjectsService.create(dto);
    return { success: true, data };
  }

  @Patch(":id")
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  @UseGuards(RolesGuard)
  async update(
    @Param("id") id: string,
    @Body() dto: UpdateSubjectRequestDto,
  ) {
    const data = await this.subjectsService.update(id, dto);
    return { success: true, data };
  }

  @Delete(":id")
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  @UseGuards(RolesGuard)
  async remove(@Param("id") id: string) {
    await this.subjectsService.remove(id);
    return { success: true, data: null };
  }
}
