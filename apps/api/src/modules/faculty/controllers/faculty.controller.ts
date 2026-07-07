import {
  Controller,
  Get,
  Param,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
} from "@nestjs/common";
import type { FacultyDetailDto } from "@repo/shared";
import { FacultyService } from "../services/faculty.service";

@Controller("faculty")
export class FacultyController {
  constructor(private readonly facultyService: FacultyService) {}

  @Get()
  async findAll(
    @Query("page", new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query("limit", new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query("search") search?: string,
  ) {
    const result = await this.facultyService.findAll(page, limit, search);
    return { success: true, ...result };
  }

  @Get(":id")
  async findOne(
    @Param("id") id: string,
  ): Promise<{ success: boolean; data: FacultyDetailDto }> {
    const data = await this.facultyService.findById(id);
    return { success: true, data };
  }
}
