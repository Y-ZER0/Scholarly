import "reflect-metadata";
import { DataSource } from "typeorm";
import * as bcrypt from "bcrypt";
import * as dotenv from "dotenv";

dotenv.config();

import { User } from "./modules/users/entities/user.entity";
import { Department } from "./modules/departments/entities/department.entity";
import { Subject } from "./modules/subjects/entities/subject.entity";
import { Class } from "./modules/classes/entities/class.entity";
import { Enrollment } from "./modules/enrollments/entities/enrollment.entity";
import { UserRole, ClassStatus } from "@repo/shared";

async function main() {
  const dataSource = new DataSource({
    type: "postgres",
    url: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
    entities: [
      User,
      Department,
      Subject,
      Class,
      Enrollment,
    ],
    logging: false,
    extra: { max: 3 },
  });

  await dataSource.initialize();
  console.log("Connected to database");

  const userRepo = dataSource.getRepository(User);
  const deptRepo = dataSource.getRepository(Department);
  const subjectRepo = dataSource.getRepository(Subject);
  const classRepo = dataSource.getRepository(Class);
  const enrollmentRepo = dataSource.getRepository(Enrollment);

  console.log("Clearing existing data...");
  await dataSource.query('DELETE FROM enrollments');
  await dataSource.query('DELETE FROM classes');
  await dataSource.query('DELETE FROM subjects');
  await dataSource.query('DELETE FROM departments');
  await dataSource.query('DELETE FROM users');

  const passwordHash = await bcrypt.hash("password123", 10);

  const { nanoid } = await import("nanoid");

  // ── Departments ────────────────────────────────────────────────────
  const departments = await deptRepo.save([
    { code: "CSC", name: "Computer Science", description: "Study of computation, algorithms, and software systems" },
    { code: "MTH", name: "Mathematics", description: "Study of numbers, quantities, and spatial relationships" },
    { code: "PHY", name: "Physics", description: "Study of matter, energy, and fundamental forces" },
    { code: "ENG", name: "English", description: "Study of literature, composition, and language" },
    { code: "BIO", name: "Biology", description: "Study of living organisms and life processes" },
  ]);

  const deptMap = Object.fromEntries(departments.map((d) => [d.code, d.id]));
  console.log(`Created ${departments.length} departments`);

  // ── Subjects ───────────────────────────────────────────────────────
  const subjects = await subjectRepo.save([
    { code: "CSC101", name: "Introduction to Programming", description: "Fundamentals of programming using Python", departmentId: deptMap["CSC"] },
    { code: "CSC201", name: "Data Structures", description: "Abstract data types, trees, graphs, and algorithms", departmentId: deptMap["CSC"] },
    { code: "MTH101", name: "Calculus I", description: "Limits, derivatives, and integrals of single-variable functions", departmentId: deptMap["MTH"] },
    { code: "PHY101", name: "General Physics I", description: "Classical mechanics, thermodynamics, and waves", departmentId: deptMap["PHY"] },
    { code: "ENG101", name: "English Composition", description: "Academic writing, rhetoric, and critical analysis", departmentId: deptMap["ENG"] },
    { code: "BIO101", name: "General Biology", description: "Cell biology, genetics, and evolution", departmentId: deptMap["BIO"] },
  ]);

  const subjectMap = Object.fromEntries(subjects.map((s) => [s.code, s.id]));
  console.log(`Created ${subjects.length} subjects`);

  // ── Users ──────────────────────────────────────────────────────────
  const users = await userRepo.save([
    { name: "Dr. Sarah Johnson",  email: "sarah.johnson@example.com",  passwordHash, role: UserRole.TEACHER },
    { name: "Prof. Michael Chen", email: "michael.chen@example.com",   passwordHash, role: UserRole.TEACHER },
    { name: "Dr. Emily Williams", email: "emily.williams@example.com", passwordHash, role: UserRole.TEACHER },
    { name: "Alice Brown",        email: "alice.brown@example.com",    passwordHash, role: UserRole.STUDENT },
    { name: "Bob Davis",          email: "bob.davis@example.com",      passwordHash, role: UserRole.STUDENT },
    { name: "Carol Miller",       email: "carol.miller@example.com",   passwordHash, role: UserRole.STUDENT },
    { name: "David Wilson",       email: "david.wilson@example.com",   passwordHash, role: UserRole.STUDENT },
    { name: "Eva Garcia",         email: "eva.garcia@example.com",     passwordHash, role: UserRole.STUDENT },
  ]);

  const teachers = users.filter((u) => u.role === UserRole.TEACHER);
  const students = users.filter((u) => u.role === UserRole.STUDENT);
  const teacherMap: Record<string, string> = {};
  teacherMap["Sarah Johnson"] = teachers[0].id;
  teacherMap["Michael Chen"] = teachers[1].id;
  teacherMap["Emily Williams"] = teachers[2].id;

  console.log(`Created ${users.length} users (${teachers.length} teachers, ${students.length} students)`);

  // ── Classes ────────────────────────────────────────────────────────
  const classes = await classRepo.save([
    { name: "CSC101-A — Intro to Programming", description: "A practical introduction to programming concepts", capacity: 30, status: ClassStatus.ACTIVE, inviteCode: nanoid(8), subjectId: subjectMap["CSC101"], teacherId: teacherMap["Sarah Johnson"] },
    { name: "MTH101-A — Calculus I",           description: "First semester calculus for science majors",      capacity: 30, status: ClassStatus.ACTIVE, inviteCode: nanoid(8), subjectId: subjectMap["MTH101"], teacherId: teacherMap["Michael Chen"] },
    { name: "PHY101-A — General Physics",       description: "Introductory physics with lab component",         capacity: 30, status: ClassStatus.ACTIVE, inviteCode: nanoid(8), subjectId: subjectMap["PHY101"], teacherId: teacherMap["Emily Williams"] },
    { name: "BIO101-A — Biology Fundamentals",  description: "Foundations of biology for health sciences",      capacity: 30, status: ClassStatus.ACTIVE, inviteCode: nanoid(8), subjectId: subjectMap["BIO101"], teacherId: teacherMap["Emily Williams"] },
  ]);

  const classMap = Object.fromEntries(classes.map((c) => {
    const label = c.name.includes("CSC101") ? "CSC101" :
                  c.name.includes("MTH101") ? "MTH101" :
                  c.name.includes("PHY101") ? "PHY101" : "BIO101";
    return [label, c.id];
  }));

  console.log(`Created ${classes.length} classes`);

  // ── Enrollments ────────────────────────────────────────────────────
  const studentMap = Object.fromEntries(students.map((s) => {
    const name = s.name.split(" ")[0].toLowerCase();
    return [name, s.id];
  }));

  const enrollmentsData = [
    { classId: classMap["CSC101"], studentId: studentMap["alice"] },
    { classId: classMap["CSC101"], studentId: studentMap["bob"] },
    { classId: classMap["CSC101"], studentId: studentMap["carol"] },
    { classId: classMap["CSC101"], studentId: studentMap["david"] },
    { classId: classMap["CSC101"], studentId: studentMap["eva"] },
    { classId: classMap["MTH101"], studentId: studentMap["alice"] },
    { classId: classMap["MTH101"], studentId: studentMap["bob"] },
    { classId: classMap["PHY101"], studentId: studentMap["carol"] },
    { classId: classMap["PHY101"], studentId: studentMap["david"] },
    { classId: classMap["BIO101"], studentId: studentMap["eva"] },
    { classId: classMap["BIO101"], studentId: studentMap["alice"] },
  ];

  const enrollments = await enrollmentRepo.save(enrollmentsData);
  console.log(`Created ${enrollments.length} enrollments`);

  console.log("\n── Seed complete ──");
  console.log("All users have password: password123");

  await dataSource.destroy();
}

main().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
