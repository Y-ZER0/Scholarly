import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "../users/entities/user.entity";
import { UsersModule } from "../users/users.module";
import { FacultyController } from "./controllers/faculty.controller";
import { FacultyService } from "./services/faculty.service";

@Module({
  imports: [TypeOrmModule.forFeature([User]), UsersModule],
  controllers: [FacultyController],
  providers: [FacultyService],
})
export class FacultyModule {}
