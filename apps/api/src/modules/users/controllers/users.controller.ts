import {
  Controller,
  Get,
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
import type { UserDto } from "@repo/shared";
import { UsersService } from "../services/users.service";
import { UpdateUserRequestDto } from "../dtos/update-user-request.dto";
import { Roles } from "@/shared/decorators/roles.decorator";
import { RolesGuard } from "@/shared/guards/roles.guard";

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async findAll(
    @Query("page", new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query("limit", new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query("role") role?: string,
    @Query("search") search?: string,
  ) {
    const result = await this.usersService.findAll(page, limit, role, search);
    return { success: true, ...result };
  }

  @Get(":id")
  async findOne(@Param("id") id: string) {
    const data = await this.usersService.findById(id);
    return { success: true, data };
  }

  @Patch(":id")
  @Roles(UserRole.ADMIN)
  @UseGuards(RolesGuard)
  async update(
    @Param("id") id: string,
    @Body() dto: UpdateUserRequestDto,
  ) {
    const data = await this.usersService.update(id, dto);
    return { success: true, data };
  }

  @Delete(":id")
  @Roles(UserRole.ADMIN)
  @UseGuards(RolesGuard)
  async remove(@Param("id") id: string) {
    await this.usersService.remove(id);
    return { success: true, data: null };
  }
}
