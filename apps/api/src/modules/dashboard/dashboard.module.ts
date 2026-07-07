import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "../users/entities/user.entity";
import { Department } from "../departments/entities/department.entity";
import { Subject } from "../subjects/entities/subject.entity";
import { Class } from "../classes/entities/class.entity";
import { Enrollment } from "../enrollments/entities/enrollment.entity";
import { DashboardController } from "./controllers/dashboard.controller";
import { DashboardService } from "./services/dashboard.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Department, Subject, Class, Enrollment]),
  ],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
