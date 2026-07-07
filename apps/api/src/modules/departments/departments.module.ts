import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Department } from "./entities/department.entity";
import { DepartmentsRepository } from "./repositories/departments.repository";
import { DepartmentsService } from "./services/departments.service";
import { DepartmentsController } from "./controllers/departments.controller";

@Module({
  imports: [TypeOrmModule.forFeature([Department])],
  controllers: [DepartmentsController],
  providers: [DepartmentsRepository, DepartmentsService],
  exports: [DepartmentsService],
})
export class DepartmentsModule {}
