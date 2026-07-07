import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Enrollment } from "./entities/enrollment.entity";
import { EnrollmentsController } from "./controllers/enrollments.controller";
import { EnrollmentsService } from "./services/enrollments.service";
import { EnrollmentsRepository } from "./repositories/enrollments.repository";

@Module({
  imports: [TypeOrmModule.forFeature([Enrollment])],
  controllers: [EnrollmentsController],
  providers: [EnrollmentsService, EnrollmentsRepository],
})
export class EnrollmentsModule {}
