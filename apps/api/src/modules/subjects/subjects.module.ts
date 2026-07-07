import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Subject } from "./entities/subject.entity";
import { SubjectsRepository } from "./repositories/subjects.repository";
import { SubjectsService } from "./services/subjects.service";
import { SubjectsController } from "./controllers/subjects.controller";

@Module({
  imports: [TypeOrmModule.forFeature([Subject])],
  controllers: [SubjectsController],
  providers: [SubjectsRepository, SubjectsService],
  exports: [SubjectsService],
})
export class SubjectsModule {}
