import {
  Injectable,
  NotFoundException,
  ConflictException,
} from "@nestjs/common";
import { UserRole } from "@repo/shared";
import type { UserDto } from "@repo/shared";
import { UsersRepository } from "../repositories/users.repository";
import { CreateUserRequestDto } from "../dtos/create-user-request.dto";
import { UpdateUserRequestDto } from "../dtos/update-user-request.dto";
import { User } from "../entities/user.entity";

@Injectable()
export class UsersService {
  constructor(private readonly repo: UsersRepository) {}

  async findAll(
    page: number,
    limit: number,
    role?: string,
    search?: string,
  ) {
    const [items, total] = await this.repo.findAll(page, limit, role, search);
    return {
      data: items.map(this.toDto),
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findById(id: string): Promise<UserDto> {
    const user = await this.repo.findById(id);
    if (!user) throw new NotFoundException(`User ${id} not found`);
    return this.toDto(user);
  }

  async findByEmail(email: string): Promise<UserDto | null> {
    const user = await this.repo.findByEmail(email);
    return user ? this.toDto(user) : null;
  }

  async findAuthByEmail(email: string): Promise<{
    userDto: UserDto;
    passwordHash: string;
  } | null> {
    const user = await this.repo.findByEmailWithPassword(email);
    if (!user) return null;
    return { userDto: this.toDto(user), passwordHash: user.passwordHash };
  }

  async create(dto: CreateUserRequestDto): Promise<UserDto> {
    const existing = await this.repo.findByEmail(dto.email);
    if (existing)
      throw new ConflictException("Email already registered");
    const user = await this.repo.create(dto);
    return this.toDto(user);
  }

  async update(id: string, dto: UpdateUserRequestDto): Promise<UserDto> {
    await this.findById(id);
    const updated = await this.repo.update(id, dto);
    return this.toDto(updated!);
  }

  async findByResetTokenHash(hash: string): Promise<{
    id: string;
    resetTokenExpiry: Date;
  } | null> {
    const user = await this.repo.findByResetTokenHash(hash);
    if (!user || !user.resetTokenExpiry) return null;
    return { id: user.id, resetTokenExpiry: user.resetTokenExpiry };
  }

  async updateResetToken(
    id: string,
    hash: string,
    expiry: Date,
  ): Promise<void> {
    await this.repo.updateResetToken(id, hash, expiry);
  }

  async updatePassword(id: string, hash: string): Promise<void> {
    await this.repo.updatePassword(id, hash);
  }

  async remove(id: string): Promise<void> {
    await this.findById(id);
    await this.repo.remove(id);
  }

  private toDto(user: User): UserDto {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role as UserRole,
      profilePhoto: user.profilePhoto ?? undefined,
      createdAt: user.createdAt.toISOString(),
    };
  }
}
