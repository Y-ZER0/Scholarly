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
} from "@nestjs/common";
import { ClassesService } from "../services/classes.service";
import { CurrentUser } from "../../../shared/decorators/current-user.decorator";
import { CreateClassRequestDto } from "../dtos/create-class-request.dto";
import { UpdateClassRequestDto } from "../dtos/update-class-request.dto";

@Controller("classes")
export class ClassesController {
  constructor(private readonly classesService: ClassesService) {}

  @Get("available")
  async findAvailable(
    @CurrentUser() user: { userId: string; role: string },
    @Query("page", new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query("limit", new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query("search") search?: string,
  ) {
    const result = await this.classesService.getAvailableClasses(
      user.userId,
      page,
      limit,
      search,
    );
    return { success: true, ...result };
  }

  @Get()
  async findAll(
    @Query("page", new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query("limit", new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query("search") search?: string,
    @Query("subjectId") subjectId?: string,
    @Query("teacherId") teacherId?: string,
    @Query("status") status?: string,
  ) {
    const result = await this.classesService.findAll(
      page,
      limit,
      search,
      subjectId,
      teacherId,
      status,
    );
    return { success: true, ...result };
  }

  @Get(":id")
  async findOne(@Param("id") id: string) {
    const data = await this.classesService.findById(id);
    return { success: true, data };
  }

  @Post()
  async create(@Body() dto: CreateClassRequestDto) {
    const data = await this.classesService.create(dto);
    return { success: true, data };
  }

  @Patch(":id")
  async update(@Param("id") id: string, @Body() dto: UpdateClassRequestDto) {
    const data = await this.classesService.update(id, dto);
    return { success: true, data };
  }

  @Delete(":id")
  async remove(@Param("id") id: string) {
    await this.classesService.remove(id);
    return { success: true, data: null };
  }
}
