import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "../entities/user.entity";

@Injectable()
export class UsersRepository {
  constructor(
    @InjectRepository(User)
    private readonly repo: Repository<User>,
  ) {}

  async findAll(
    page: number,
    limit: number,
    role?: string,
    search?: string,
  ): Promise<[User[], number]> {
    const qb = this.repo.createQueryBuilder("user");

    if (role) {
      qb.where("user.role = :role", { role });
    }

    if (search) {
      qb.andWhere(
        "(user.name ILIKE :search OR user.email ILIKE :search)",
        { search: `%${search}%` },
      );
    }

    return qb
      .orderBy("user.createdAt", "DESC")
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();
  }

  async findById(id: string): Promise<User | null> {
    return this.repo.findOne({ where: { id } });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.repo.findOne({ where: { email } });
  }

  async findByEmailWithPassword(email: string): Promise<User | null> {
    return this.repo
      .createQueryBuilder("user")
      .addSelect("user.passwordHash")
      .where("user.email = :email", { email })
      .getOne();
  }

  async findByResetTokenHash(hash: string): Promise<User | null> {
    return this.repo
      .createQueryBuilder("user")
      .addSelect("user.resetTokenHash")
      .addSelect("user.resetTokenExpiry")
      .where("user.resetTokenHash = :hash", { hash })
      .getOne();
  }

  async updateResetToken(
    id: string,
    hash: string,
    expiry: Date,
  ): Promise<void> {
    await this.repo.update(id, {
      resetTokenHash: hash,
      resetTokenExpiry: expiry,
    });
  }

  async updatePassword(id: string, hash: string): Promise<void> {
    await this.repo.update(id, {
      passwordHash: hash,
      resetTokenHash: null,
      resetTokenExpiry: null,
    } as any);
  }

  async create(data: Partial<User>): Promise<User> {
    return this.repo.save(this.repo.create(data));
  }

  async update(id: string, data: Partial<User>): Promise<User | null> {
    await this.repo.update(id, data);
    return this.findById(id);
  }

  async remove(id: string): Promise<void> {
    await this.repo.delete(id);
  }
}
