import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { DatabaseModule } from "./database/database.module";
import { UploadsModule } from "./modules/uploads/uploads.module";
import { UsersModule } from "./modules/users/users.module";
import { AuthModule } from "./modules/auth/auth.module";
import { DepartmentsModule } from "./modules/departments/departments.module";
import { SubjectsModule } from "./modules/subjects/subjects.module";
import { ClassesModule } from "./modules/classes/classes.module";
import { EnrollmentsModule } from "./modules/enrollments/enrollments.module";
import { FacultyModule } from "./modules/faculty/faculty.module";
import { DashboardModule } from "./modules/dashboard/dashboard.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    UploadsModule,
    UsersModule,
    AuthModule,
    DepartmentsModule,
    SubjectsModule,
    ClassesModule,
    EnrollmentsModule,
    FacultyModule,
    DashboardModule,
  ],
})
export class AppModule {}
