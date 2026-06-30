# project-overview.md — Scholarly

## About the Project & Problem Solved

**Scholarly** is a full-stack academic management platform for educational institutions. It eliminates the operational friction of managing departments, subjects, classes, faculty, and student enrollments across disconnected spreadsheets and email threads by consolidating everything into a single, role-aware web interface.

**Who uses it:**

- **Admins** — full control over all entities (CRUD on departments, subjects, classes, users)
- **Teachers** — create and manage their own classes, view assigned subjects and departments
- **Students** — discover classes, join via invite code, track their own enrollments

**Core value:** A teacher can create a class in under 60 seconds. A student can join it in under 30 seconds.

---

## Pages & Navigation

### Auth Routes (no sidebar)

| Route       | Page                                                 |
| ----------- | ---------------------------------------------------- |
| `/login`    | Sign In form + Google/GitHub OAuth                   |
| `/register` | Register form with role selector (Student / Teacher) |

### Protected Routes (sidebar always visible)

| Route                 | Page                                                                                   |
| --------------------- | -------------------------------------------------------------------------------------- |
| `/`                   | Dashboard — overview stats, charts, newest lists                                       |
| `/subjects`           | Subject list (paginated, searchable, filterable by department)                         |
| `/subjects/create`    | Create Subject form                                                                    |
| `/subjects/[id]`      | Subject detail — overview, department, classes, teachers, students                     |
| `/departments`        | Department list (paginated, searchable)                                                |
| `/departments/create` | Create Department form                                                                 |
| `/departments/[id]`   | Department detail — overview stats, subjects table, classes table, teachers & students |
| `/faculty`            | Faculty list — teachers only (paginated, searchable)                                   |
| `/faculty/[id]`       | Faculty detail — profile, departments, subjects, classes                               |
| `/enrollments`        | Enrollment list — student sees their classes; teacher sees class rosters               |
| `/classes`            | Class list (paginated, searchable, filterable by subject/teacher)                      |
| `/classes/create`     | Create Class form (with banner image upload)                                           |
| `/classes/[id]`       | Class detail — banner, instructor, department, subject, join flow, enrolled students   |

### Sidebar Navigation Order

```
Home (Dashboard)
Subjects
Departments
Faculty
Enrollments
Classes
```

---

## Core User Flow

### Teacher Flow

```
Register (role: Teacher)
  └→ Login
       └→ Dashboard (sees overall stats)
            └→ Departments → View detail
            └→ Subjects → View detail → Create Subject
            └→ Classes → Create Class (selects subject, sets capacity, uploads banner)
                 └→ Class Detail → share inviteCode with students
```

### Student Flow

```
Register (role: Student)
  └→ Login
       └→ Dashboard (sees overview)
            └→ Classes → browse list → View Class Detail
                 └→ "Join Class" → paste inviteCode → enrolled
            └→ Enrollments → view all joined classes
```

### Admin Flow

```
Login (admin account)
  └→ Full access to all CRUD on all entities
  └→ Dashboard with all metrics including Admins count
```

---

## Data Architecture

### Core Entities

| Entity         | Key Fields                                                                                                                           | Relationships                                                       |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------- |
| **User**       | id, name, email, passwordHash, role (student/teacher/admin), profilePhoto, createdAt                                                 | has many Classes (as teacher), has many Enrollments (as student)    |
| **Department** | id, code (unique), name, description, createdAt                                                                                      | has many Subjects                                                   |
| **Subject**    | id, code (unique), name, description, departmentId, createdAt                                                                        | belongs to Department, has many Classes                             |
| **Class**      | id, name, description, bannerImage, capacity, status (active/inactive), inviteCode (unique, 8-char), subjectId, teacherId, createdAt | belongs to Subject, belongs to User (teacher), has many Enrollments |
| **Enrollment** | id, classId, studentId, enrolledAt                                                                                                   | belongs to Class, belongs to User (student)                         |

### Derived / Computed Data (dashboard & detail pages)

These are computed server-side and never stored:

- Department → totalSubjects, totalClasses, enrolledStudents
- Subject → totalClasses, totalStudents
- Teacher (Faculty Detail) → departments (via classes taught), subjects (via classes taught)
- Dashboard stats → counts per role, newest 5 classes, newest 5 teachers, top departments by subject count, top subjects by class count

---

## Scope

### Features In Scope

- Email/password registration + login
- Google OAuth login
- GitHub OAuth login
- JWT-based session management
- Role-based access control (student / teacher / admin)
- Department CRUD (admin)
- Subject CRUD (admin / teacher)
- Class CRUD with banner image upload (admin / teacher)
- Student enrollment via invite code
- Student unenrollment
- Faculty directory (read-only for students)
- Dashboard analytics: stat cards, donut chart (users by role), bar charts (subjects per dept, classes per subject), ranked lists (newest classes, newest teachers, top departments, top subjects)
- tweakcn multi-theme support (dark default + multiple selectable themes)
- Responsive desktop layout (sidebar collapses at <768px)
- Paginated data tables with rows-per-page selector
- Search and filter on all list pages

### Features Out of Scope

- In-app messaging or announcements
- Grade tracking, assignments, or gradebooks
- Academic calendar or scheduling
- Payment processing or subscription tiers
- Email notifications
- Mobile-native app (React Native / Flutter)
- Bulk import via CSV
- Audit logs or activity history
- Multi-tenant/multi-institution support

---

## Target User & Success Criteria

**Target Users:** Educational institution admins, teachers, and students — small to mid-size institutions (10–500 users).

**Success Criteria:**
| Metric | Target |
|--------|--------|
| Auth round-trip (register → login → dashboard) | < 3 user actions |
| Teacher creates a class from scratch | < 60 seconds |
| Student finds and joins a class via invite code | < 30 seconds |
| Dashboard initial load (with caching) | < 2 seconds after first visit |
| All list pages searchable and filterable | 100% of list pages |
| Zero TypeScript errors at build time | Required for production |
| All 16 architecture invariants passing | Required for any PR merge |
