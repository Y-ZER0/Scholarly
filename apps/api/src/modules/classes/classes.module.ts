import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Class } from "./entities/class.entity";
import { ClassesRepository } from "./repositories/classes.repository";
import { ClassesService } from "./services/classes.service";
import { ClassesController } from "./controllers/classes.controller";

@Module({
  imports: [TypeOrmModule.forFeature([Class])],
  controllers: [ClassesController],
  providers: [ClassesRepository, ClassesService],
  exports: [ClassesService],
})
export class ClassesModule {}
