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
import { DepartmentsService } from "../services/departments.service";
import { CreateDepartmentRequestDto } from "../dtos/create-department-request.dto";
import { UpdateDepartmentRequestDto } from "../dtos/update-department-request.dto";
import { Roles } from "@/shared/decorators/roles.decorator";
import { RolesGuard } from "@/shared/guards/roles.guard";

@Controller("departments")
export class DepartmentsController {
  constructor(private readonly departmentsService: DepartmentsService) {}

  @Get()
  async findAll(
    @Query("page", new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query("limit", new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query("search") search?: string,
  ) {
    const result = await this.departmentsService.findAll(page, limit, search);
    return { success: true, ...result };
  }

  @Get(":id")
  async findOne(@Param("id") id: string) {
    const data = await this.departmentsService.findById(id);
    return { success: true, data };
  }

  @Post()
  @Roles(UserRole.ADMIN)
  @UseGuards(RolesGuard)
  async create(@Body() dto: CreateDepartmentRequestDto) {
    const data = await this.departmentsService.create(dto);
    return { success: true, data };
  }

  @Patch(":id")
  @Roles(UserRole.ADMIN)
  @UseGuards(RolesGuard)
  async update(
    @Param("id") id: string,
    @Body() dto: UpdateDepartmentRequestDto,
  ) {
    const data = await this.departmentsService.update(id, dto);
    return { success: true, data };
  }

  @Delete(":id")
  @Roles(UserRole.ADMIN)
  @UseGuards(RolesGuard)
  async remove(@Param("id") id: string) {
    await this.departmentsService.remove(id);
    return { success: true, data: null };
  }
}
