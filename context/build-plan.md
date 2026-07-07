# build-plan.md — ClassroomOS

> **Absolute rule:** Every task is tagged `[UI]` or `[LOGIC]`. A single task never contains both.
> Implement tasks in phase order. Do not skip ahead. Do not combine tasks.
> Check `progress-tracker.md` before starting any task — never re-do completed work.

---

## Phase 1: Foundation

### 1.1 `[LOGIC]` Monorepo & Shared Package

- Initialize pnpm workspaces: `apps/web`, `apps/api`, `packages/shared`
- Configure `pnpm-workspace.yaml` and root `package.json`
- Configure Turborepo `turbo.json` with `build`, `dev`, `lint`, `type-check` tasks
- Create `packages/shared/src/enums/user-role.enum.ts` → `UserRole.STUDENT | TEACHER | ADMIN`
- Create `packages/shared/src/enums/class-status.enum.ts` → `ClassStatus.ACTIVE | INACTIVE`
- Create shared DTOs: `UserDto`, `DepartmentDto`, `SubjectDto`, `ClassDto`, `EnrollmentDto`, `AuthDto`
- Configure `@repo/shared` path alias in both `apps/web/tsconfig.json` and `apps/api/tsconfig.json`
- Barrel export from `packages/shared/src/index.ts`

### 1.2 `[LOGIC]` NestJS Backend Bootstrap

- Scaffold NestJS in `apps/api` with `pnpm --filter api exec nest new .`
- Install TypeORM, PostgreSQL driver (`pg`), ConfigModule, Passport, class-validator, class-transformer
- **Database is Supabase (cloud PostgreSQL) — there is no local PostgreSQL instance.**
  - `DatabaseModule` with TypeORM `forRootAsync` using `ConfigService`
  - Connection config uses `url: config.get('DATABASE_URL')` — not individual host/port/user/pass/name variables
  - Always set `ssl: { rejectUnauthorized: false }` — required by Supabase
  - Always set `synchronize: false` — schema is managed via Supabase SQL Editor, never by TypeORM
  - Set `extra: { max: 5 }` — respect Supabase free tier connection pool limit
  - See `architecture.md → Supabase — Cloud PostgreSQL Provider` for the canonical TypeORM config block
- `AllExceptionsFilter` registered globally — uniform error response shape
- `ValidationPipe` globally with `whitelist: true`, `forbidNonWhitelisted: true`, `transform: true`
- Global prefix `/api`
- CORS configured for `FRONTEND_URL` env variable
- `.env` file created with all required variables (see `code-standards.md`)
- **Schema initialization**: after the backend starts, run the SQL from `architecture.md → Database Schema` once in the **Supabase SQL Editor** to create all tables and enums

### 1.3 `[LOGIC]` File Upload Infrastructure

- Install `@nestjs/platform-express`, `multer`, `@types/multer`, `nanoid`
- `UploadsModule` with `POST /api/uploads/image` endpoint
- Multer config: 5MB limit, JPEG/PNG only, filename = `${nanoid()}-${originalname}`
- Files saved to `./uploads` directory in dev
- Static file serving configured on `/uploads` path
- Returns `{ url: string }` on success

### 1.4 `[UI]` Next.js Bootstrap & Global Styles

- Scaffold Next.js 16.2.9 in `apps/web` with App Router, TypeScript, Tailwind v4
- Install shadcn/ui: `npx shadcn@latest init` → New York style, Tailwind v4, no default components
- Add shadcn components: `button input select textarea dialog badge avatar table checkbox label`
- Install tweakcn: `pnpm --filter web add tweakcn`
- Install dependencies: TanStack Query v5, Axios, React Hook Form, Zod, Recharts, @hookform/resolvers
- `globals.css` — CSS variables from `ui-tokens.md`, Tailwind v4 imports, tweakcn custom-variant dark
- `components.json` configured with correct alias paths
- Path alias `@/*` configured in `tsconfig.json`
- `AppProviders.tsx` scaffold: QueryClientProvider + ThemeProvider (tweakcn) — placeholders for Auth and Sidebar

### 1.5 `[UI]` Dashboard Shell Layout

- `DashboardLayout.tsx` — `flex h-screen bg-background` with sidebar + main content
- `SidebarNav.tsx` — 240px wide, logo area, nav items with icons, active green highlight
  - Nav items: Home (house icon), Subjects (book icon), Departments (building icon), Faculty (users icon), Enrollments (clipboard icon), Classes (graduation-cap icon)
  - Active item: `bg-primary text-white rounded-lg`
  - Inactive item: `text-muted-foreground hover:bg-muted/40`
  - Collapse toggle button (top right of sidebar)
- Topbar area (top right of main): theme toggle icon, user avatar circle
- `(protected)/layout.tsx` wires up `AuthGuard` + `DashboardLayout`
- Sidebar open/closed state wired to `SidebarContext`

---

## Phase 2: Authentication

### 2.1 `[LOGIC]` Auth Backend Module

- `User` entity: id, name, email, passwordHash (`select: false`), role, profilePhoto, createdAt
- `UsersRepository`: findAll (paginated), findById, findByEmail, create, update, remove
- `UsersService`: toDto() always strips passwordHash; findByEmail for auth; create with bcrypt hash
- `AuthService`: login (validate credentials → issue JWT), register (check duplicate email → hash → create user → issue JWT)
- JWT Strategy: extracts `sub` (userId) and `role` from token payload
- `JwtAuthGuard` as global app guard
- `@Public()` decorator for open endpoints
- `POST /api/auth/login` → `LoginRequestDto` → `AuthDto`
- `POST /api/auth/register` → `RegisterRequestDto` → `AuthDto`
- Google OAuth strategy + callback route (upsert user on OAuth login)
- GitHub OAuth strategy + callback route
- Both OAuth callbacks issue JWT and redirect to `/api/auth/oauth-success?token=<jwt>`

### 2.2 `[UI]` Login Page

- Route: `/login` — no sidebar, centered layout
- App logo/icon centered at top (placeholder SVG if no asset yet)
- Card: "Sign in" heading, "Welcome back" subtitle
- `Email` input (type=email)
- `Password` input with show/hide toggle (eye icon)
- `Remember me` checkbox + "Forgot password?" link (right-aligned, green text)
- Full-width green "Sign in" button
- `"or"` horizontal rule divider
- "Sign in using" section with Google and GitHub outline buttons (side by side)
- "No account? **Sign up**" link below card (Sign up in bold, green)
- Form validated with react-hook-form + Zod
- Error state displayed below the submit button

### 2.3 `[UI]` Register Page

- Route: `/register` — no sidebar, centered layout
- App logo/icon at top
- "Register" heading, "Create an account to get started." subtitle
- **Role selector** — two card toggles side-by-side: "Student" (graduation cap icon) and "Teacher" (building icon)
  - Selected state: green border + green icon + green text
  - Unselected state: dark border, muted icon/text
- **Profile Photo** upload zone — dashed border, orange cloud-upload icon, "Click to upload photo" (orange), "PNG, JPG up to 5MB" (muted)
  - On click: opens file picker → uploads to `POST /api/uploads/image` → shows preview
- Full Name input
- Email input
- Password input with show/hide toggle
- Full-width green "Create Account" button
- "Already have an account? **Sign in**" link
- Form validated with react-hook-form + Zod

### 2.4 `[LOGIC]` Auth Client State

- `auth.service.ts` — `login(dto)`, `register(dto)` HTTP calls, `loginWithToken(token)` for OAuth
- `AuthContext.tsx` — CLIENT state only: `currentUser: UserDto | null`, `isAuthenticated: boolean`; `login()`, `logout()`, `setUser()` — NO async calls inside context methods
- `useAuth.ts` — context consumer with null guard throw
- `AuthGuard.tsx` — reads `isAuthenticated` from AuthContext; if false, `router.replace('/login')`
- `useLogin.ts` — `useMutation` calling `auth.service.login`, stores token in localStorage on success, calls `setUser()`
- `useRegister.ts` — `useMutation` calling `auth.service.register`
- `api-client.ts` — Axios instance, request interceptor attaches `Authorization: Bearer`, response interceptor handles 401 → clears token → redirects
- OAuth redirect handler: reads `?token=` from URL on `/login`, stores token, sets user, redirects to `/`

---

## Phase 3: Departments Feature

### 3.1 `[LOGIC]` Departments Backend

- `Department` entity: id, code (unique), name, description, createdAt
- `DepartmentsRepository`: findAll (paginated + search), findById, findByCode, create, update, remove
- `DepartmentsService`: CRUD + computed stats (totalSubjects, totalClasses, enrolledStudents via JOINs in findById), `toDto()`
- `DepartmentsController`: `GET /departments`, `GET /departments/:id`, `POST`, `PATCH /:id`, `DELETE /:id`
- `CreateDepartmentRequestDto`: code (required, uppercase, 2-10 chars), name (required), description (required)
- `UpdateDepartmentRequestDto`: all optional
- `DepartmentsModule` registered in `AppModule`
- `GET /departments` supports `?search=`, `?page=`, `?limit=` query params

### 3.2 `[LOGIC]` Departments Client Logic

- `DepartmentDto` already in `@repo/shared` (code, name, description, totalSubjects, totalClasses, enrolledStudents)
- `department.service.ts`: `getAll({ page, limit, search })`, `getById(id)`, `create(dto)`, `update(id, dto)`, `remove(id)`
- `departmentKeys.ts`: `all()`, `lists()`, `list(filters)`, `details()`, `detail(id)` factories
- `useDepartments.ts`: `useQuery` with `departmentKeys.list(filters)`, `staleTime: 30_000`
- `useDepartment.ts`: `useQuery` with `departmentKeys.detail(id)`, `enabled: !!id`
- `useCreateDepartment.ts`: `useMutation` → `invalidateQueries(lists())`
- `useUpdateDepartment.ts`: `useMutation` → `setQueryData(detail(id), updated)` + `invalidate(lists())`
- `useDeleteDepartment.ts`: `useMutation` → `removeQueries(detail(id))` + `invalidate(lists())`

### 3.3 `[UI]` Departments List Page

- Route: `/departments`
- `PageHeader`: title "Departments", description, search input (placeholder: "Search by name or code"), "+ Create" button (routes to `/departments/create`)
- `DataTable` columns: Code (CodeBadge), Name, Subjects count (number), Description, Details ("View" link → `/departments/[id]`)
- Pagination: rows-per-page selector (10/25/50) + page info + prev/next arrows
- Loading state: skeleton rows
- Empty state: `EmptyState` component

### 3.4 `[UI]` Create Department Page

- Route: `/departments/create`
- Breadcrumb: Home → Departments → Create
- Page heading: "Create a Department", subtitle: "Provide the required information below to add a department."
- "Go Back" outline button (top right)
- `FormCard` title: "Fill out form"
  - Department Code \* (input, placeholder: "CS", hint: "Uppercase letters only")
  - Department Name \* (input, placeholder: "Computer Science")
  - Description \* (textarea, placeholder: "Describe the department focus...", 4 rows)
  - "Create Department" green button (left-aligned, not full-width)
- On success: `router.push('/departments')` + toast notification

### 3.5 `[UI]` Department Detail Page

- Route: `/departments/[id]`
- Breadcrumb: Home → Departments → Show
- `DetailPageHeader`: back arrow, department name, Refresh button, Edit button
- **Overview card**: Total Subjects (book icon), Total Classes (layers icon), Enrolled Students (users icon) — three equal columns
- **Subjects section**: `DataTable` with Code (CodeBadge), Subject name, Description, Details ("View" → `/subjects/[id]`); count badge top-right; pagination arrows
- **Classes section**: `DataTable` with Class name, Subject (code badge + name), Teacher (UserAvatar), Status (StatusBadge), Details; pagination
- **Teachers section**: `DataTable` with User (UserAvatar + email), Role (StatusBadge), Details; side-by-side layout
- **Students section**: same as Teachers section

---

## Phase 4: Subjects Feature

### 4.1 `[LOGIC]` Subjects Backend

- `Subject` entity: id, code (unique), name, description, departmentId (FK), createdAt
- `SubjectsRepository`: findAll (paginated + search + departmentId filter), findById, findByCode, create, update, remove
- `SubjectsService`: CRUD + `toDto()` — SubjectDto includes department name/code
- `SubjectsController`: `GET /subjects`, `GET /subjects/:id`, `POST`, `PATCH /:id`, `DELETE /:id`
- `GET /subjects` supports `?search=`, `?departmentId=`, `?page=`, `?limit=`
- `SubjectsModule` — exports `SubjectsService` (needed by other modules for validation)
- `GET /subjects/:id` returns subject + related department + classes list + teachers + students

### 4.2 `[LOGIC]` Subjects Client Logic

- `SubjectDto` in `@repo/shared`: id, code, name, description, department (code + name), createdAt
- `subject.service.ts`: `getAll({ page, limit, search, departmentId })`, `getById(id)`, `create(dto)`, `update(id, dto)`, `remove(id)`
- `subjectKeys.ts`: includes `departmentId` in list filter key
- `useSubjects.ts`, `useSubject.ts`
- `useCreateSubject.ts`, `useUpdateSubject.ts`, `useDeleteSubject.ts`

### 4.3 `[UI]` Subjects List Page

- Route: `/subjects`
- `PageHeader`: title "Subjects", search input, "All Departments" filter dropdown (populated via `useDepartments`), "+ Create" button
- `DataTable` columns: Code (CodeBadge), Name, Department (DepartmentChip), Description, Details ("View")
- Pagination: rows-per-page + full pagination controls

### 4.4 `[UI]` Create Subject Page

- Route: `/subjects/create`
- Breadcrumb + "Go Back" button
- `FormCard` title: "Fill out form"
  - Department \* (Select dropdown — populated with all departments via `useDepartments`)
  - Subject Name \* (input with active green focus ring when typing)
  - Subject Code \* (input, placeholder: "CS101")
  - Description \* (textarea)
  - "Create Subject" green button (left-aligned)
- On success: `router.push('/subjects')`

### 4.5 `[UI]` Subject Detail Page

- Route: `/subjects/[id]`
- Breadcrumb + `DetailPageHeader` with subject name, Refresh, Edit
- **Subject Overview card**: description text + code CodeBadge (top-right corner)
- **Department card**: department name (bold), description
- **Classes section**: `DataTable` with Class name, Teacher (UserAvatar + email), Status (StatusBadge), Details; count badge top-right; pagination arrows
- **Teachers + Students** side by side: each a `DataTable` with User (UserAvatar), Role (StatusBadge), Details

---

## Phase 5: Faculty Feature

### 5.1 `[LOGIC]` Faculty Backend

- No new entity — Faculty = `users` WHERE `role = 'teacher'`
- Add query filter to `UsersController GET /users?role=teacher`
- `GET /users/:id` with role=teacher returns: profile + departments (derived from classes WHERE teacherId) + subjects (derived from classes WHERE teacherId) + classes list
- Separate `FacultyController GET /faculty` and `GET /faculty/:id` for clarity, internally calls `UsersService`
- `FacultyModule` registers FacultyController, imports UsersModule

### 5.2 `[LOGIC]` Faculty Client Logic

- `faculty.service.ts`: `getAll({ page, limit, search })`, `getById(id)`
- `facultyKeys.ts`: `all()`, `lists()`, `list(filters)`, `details()`, `detail(id)`
- `useFaculty.ts`: paginated list
- `useFacultyMember.ts`: single teacher with derived departments/subjects/classes

### 5.3 `[UI]` Faculty List Page

- Route: `/faculty`
- `PageHeader`: title "Faculty", description "Browse and manage faculty members.", search input (no Create button — teachers self-register)
- `DataTable` columns: Name (UserAvatar — 32px avatar + name), Email, Role (StatusBadge "teacher"), Details ("View" → `/faculty/[id]`)
- Pagination

### 5.4 `[UI]` Faculty Detail Page

- Route: `/faculty/[id]`
- Breadcrumb + `DetailPageHeader`: back arrow, teacher name, Refresh, Edit buttons
- **Profile card**: avatar (40px), name, email; role StatusBadge (top-right corner)
- **Departments section**: subtitle "Departments tied to [name] based on classes and enrollments"; `DataTable` Code (CodeBadge), Department, Description, Details; empty state if none
- **Subjects section**: subtitle "Subjects associated with [name] in this term."; `DataTable` Code, Subject, Department, Details
- **Classes section**: `DataTable` Class name, Subject, Status, Details

---

## Phase 6: Classes Feature

### 6.1 `[LOGIC]` Classes Backend

- `Class` entity: id, name, description, bannerImage, capacity, status, inviteCode (unique), subjectId (FK), teacherId (FK), createdAt
- On `create`: generate `inviteCode = nanoid(8)` — never user-provided
- `ClassesRepository`: findAll (paginated + search + subjectId filter + teacherId filter + status filter), findById (with subject + teacher + enrollment count), create, update, remove
- `ClassesService`: CRUD + `toDto()` returning ClassDto (includes subject.code, teacher.name, teacher.email, enrollmentCount, spotsRemaining)
- `ClassesController`: standard CRUD + `GET /classes/:id` returns full detail
- `GET /classes` supports `?search=`, `?subjectId=`, `?teacherId=`, `?status=`, `?page=`, `?limit=`
- `ClassesModule` — exports ClassesService

### 6.2 `[LOGIC]` Classes Client Logic

- `ClassDto` in `@repo/shared`: id, name, description, bannerImage, capacity, status, inviteCode, subject (id+code+name), teacher (id+name+email+profilePhoto), enrollmentCount, spotsRemaining, createdAt
- `class.service.ts`: `getAll(filters)`, `getById(id)`, `create(dto)`, `update(id, dto)`, `remove(id)`
- `classKeys.ts` with filter-aware list keys
- `useClasses.ts` accepts `{ page, search, subjectId, teacherId }`
- `useClass.ts`
- `useCreateClass.ts`, `useUpdateClass.ts`, `useDeleteClass.ts`

### 6.3 `[UI]` Classes List Page

- Route: `/classes`
- `PageHeader`: title "Classes", description, search input, "All Subjects" dropdown filter (from `useSubjects`), "All Teachers" dropdown filter (from `useFaculty`), "+ Create" button
- `DataTable` columns: Banner (32px thumbnail img, rounded-sm), Class Name, Status (StatusBadge), Subject (DepartmentChip), Teacher (name only), Capacity (number), Details ("View")
- Pagination

### 6.4 `[UI]` Create Class Page

- Route: `/classes/create`
- Breadcrumb (Home → Classes → Create) if needed, or modal-style centered layout
- `FormCard` title: "Fill out form"
  - **Banner Image** \* — full-width `FileUpload` zone (orange cloud icon, "Click to upload photo", "PNG, JPG up to 5MB")
  - Class Name \* (input, placeholder: "Introduction to Biology - Section A")
  - `grid grid-cols-2 gap-4`: Subject _ (Select from `useSubjects`) | Teacher _ (Select from `useFaculty`)
  - `grid grid-cols-2 gap-4`: Capacity _ (number input, default 30) | Status _ (Select: Active / Inactive, default Active)
  - Description \* (textarea, placeholder: "Brief description about the class")
  - "Create Class" green button (full-width)

### 6.5 `[UI]` Class Detail Page

- Route: `/classes/[id]`
- Breadcrumb: Home → Classes → Show
- `DetailPageHeader`: back arrow, "Class Details", Refresh + Edit buttons (top right)
- **Full-width banner image** (height ~200px, `object-cover`, rounded-lg or no radius)
- **Info card** (below banner, dark bg): class name (left, large bold), spots count + ACTIVE badge (right)
  - Description text (muted, smaller)
  - `grid grid-cols-2 gap-8`:
    - INSTRUCTOR section: emoji icon, "INSTRUCTOR" label, UserAvatar (name as green link, email)
    - DEPARTMENT section: emoji icon, "DEPARTMENT" label, department name (green bold), description
  - SUBJECT section (full width below grid): emoji icon, "SUBJECT" label, `Code: XXXXX` text, subject name (green link), description
- **Join Class section**: "JOIN CLASS" label with icon; numbered steps (1. Ask teacher for invite code, 2. Click "Join Class" button, 3. Paste the code and click "Join"); full-width green "Join Class" button → triggers `JoinClassModal`
- **Enrolled Students table**: "Enrolled Students" heading; `DataTable` with Student (UserAvatar), Details

---

## Phase 7: Enrollment Feature

> **Design principle**: The feature is separated into Teacher and Student perspectives.
> - **Teacher** manages enrollments for their own classes (full CRUD). The existing `/classes` list page (Phase 6.3) shows **all** classes (active + inactive) — this is the teacher/admin class management view.
> - **Student** views their current enrollments and browses **only** active classes with open spots (`enrollmentCount < capacity`) to join via invite code.
> - The `/enrollments` route is **role-gated**: renders TeacherEnrollments or StudentEnrollments based on `user.role`.

### 7.1 `[LOGIC]` Enrollments Backend — Teacher Endpoints

- **Repository**:
  - `findByClassId(classId, { page, limit })` — paginated enrollments for a specific class
  - `findAllByTeacherId(teacherId, { page, limit, classId?, search? })` — enrollments across teacher's classes, optionally filtered by classId and student name/email search
  - `create(data)` — insert enrollment
  - `remove(id)` — delete enrollment
  - `findByStudentEmail(email)` — lookup student by email for manual add
- **Service**:
  - `findTeacherEnrollments(teacherId, filters)`: returns paginated enrollment list across teacher's classes, with class/subject/student relations
  - `addStudent(dto, teacherId)`: validates class belongs to teacher → student exists → no duplicate → capacity check → create
  - `removeEnrollment(enrollmentId, teacherId)`: validates enrollment's class belongs to teacher → remove
  - `getTeacherClasses(teacherId)`: returns teacher's own classes for filter dropdown
- **Controller**:
  - `GET /api/enrollments/teacher` — paginated, `?classId=`, `?search=`, `?page=`, `?limit=`
  - `GET /api/enrollments/teacher/classes` — teacher's classes for dropdown
  - `POST /api/enrollments/teacher/add` — body `{ classId, studentEmail }`
  - `DELETE /api/enrollments/teacher/:id`
- **DTOs**: `AddStudentRequestDto` (`classId` uuid, `studentEmail` string), `TeacherEnrollmentDto`
- `EnrollmentsModule` — registers controller/service/repository, imports `ClassesModule`, `TypeOrmModule.forFeature([Enrollment])`

### 7.2 `[LOGIC]` Enrollments Backend — Student Endpoints

- **Repository additions**:
  - `findByStudentId(studentId, { page, limit })` with `class.subject.teacher` and `class.subject.department` relations
- **Service**:
  - `joinByCode(inviteCode, studentId)`: find class by inviteCode → validate `status=ACTIVE` → check `enrollmentCount < capacity` → check no duplicate → create enrollment → return EnrollmentDto
  - `findMyEnrollments(studentId, { page, limit })`: paginated with class/subject/teacher
  - `unenroll(enrollmentId, studentId)`: validate ownership → remove
- **Controller**:
  - `GET /api/enrollments` — student's own enrollments (paginated)
  - `POST /api/enrollments/join` — body `{ inviteCode }`
  - `DELETE /api/enrollments/:id` — self-unenroll
- **ClassesController addition**:
  - `GET /api/classes/available` — returns classes WHERE `status=ACTIVE` AND `enrollmentCount < capacity`, with `?search=`, `?page=`, `?limit=`
- **DTOs**: `JoinClassRequestDto` with `@IsString()` `inviteCode`

### 7.3 `[LOGIC]` Enrollments Client Logic — Teacher

- `enrollment.service.ts` additions: `getTeacherEnrollments({ page, limit, classId, search })`, `getTeacherClasses()`, `addStudent(dto)`, `removeEnrollment(id)`
- `enrollmentKeys.ts` additions: `teacherLists()`, `teacherList(filters)`, `teacherClasses()`
- `useTeacherEnrollments.ts`: `useQuery` with `enabled: !!user && user.role === 'teacher'`, `staleTime: 30_000`
- `useTeacherClasses.ts`: `useQuery` for dropdown options
- `useAddStudent.ts`: `useMutation` → `invalidateQueries(teacherLists())` + success toast
- `useRemoveEnrollment.ts`: `useMutation` → `invalidateQueries(teacherLists())` + success toast

### 7.4 `[LOGIC]` Enrollments Client Logic — Student

- `enrollment.service.ts` additions: `getMyEnrollments({ page, limit })`, `joinClass({ inviteCode })`, `unenroll(id)`
- `enrollmentKeys.ts` additions: `studentLists()`, `studentList(filters)`
- `useMyEnrollments.ts`: `useQuery` with `enabled: !!user && user.role === 'student'`, `staleTime: 30_000`
- `useJoinClass.ts`: `useMutation` → `invalidateQueries(studentLists())` + success toast
- `useUnenroll.ts`: `useMutation` → `invalidateQueries(studentLists())` + success toast
- `class.service.ts` addition: `getAvailableClasses({ page, limit, search })`
- `classKeys.ts` addition: `availableLists()`, `availableList(filters)`
- `useAvailableClasses.ts`: `useQuery` with `staleTime: 30_000`

### 7.5 `[UI]` Teacher Enrollment Management Page

- Route: `/enrollments` — **role-gated**: `user.role === TEACHER` renders `TeacherEnrollments`, `user.role === STUDENT` renders `StudentEnrollments`
- `PageHeader`: title "Enrollment Management", subtitle "Manage students enrolled in your classes."
- Filter bar: Class dropdown (populated via `useTeacherClasses`), search input (by student name/email)
- `DataTable` columns: Student (UserAvatar 32px + name + email), Class (name), Enrolled At (formatted date), Actions (Remove button — opens confirmation dialog)
- "+ Add Student" button (green) → opens `AddStudentDialog`:
  - Class \* (Select dropdown — populated via `useTeacherClasses`)
  - Student Email \* (email input)
  - "Add" green button → submit → on success toast + close dialog
  - Error states: student not found, duplicate, class full
- Pagination: rows-per-page + page info + prev/next arrows
- Empty state: "No students enrolled in your classes." / "No results match your search."
- Loading state: skeleton rows
- `EnrollmentDto` extended for teacher view: includes `student` (id, name, email, profilePhoto), `classId`, `className`

### 7.6 `[UI]` Student Enrollments & Available Classes Pages

- **`/enrollments`** (student view, role-gated):
  - `PageHeader`: title "My Enrollments", subtitle "Classes you're currently enrolled in."
  - "Browse Classes" green outline button (right-aligned) → navigates to `/classes/available`
  - `DataTable` columns: Class (name + bannerImage 32px thumbnail), Subject (code + name), Teacher (name), Enrolled At (formatted date), Actions ("View" → `/classes/[id]`, "Unenroll" with confirmation)
  - Pagination
  - Empty state: "You haven't joined any classes yet." + "Browse Available Classes" CTA button
  - Loading state: skeleton rows

- **`/classes/available`** (new route — student browsing):
  - `PageHeader`: title "Available Classes", subtitle "Browse classes with open spots remaining."
  - Search input (by class name)
  - `DataTable` columns: Class (name), Subject (code + name), Teacher (name), Spots (`enrolledCount / capacity`), Status (StatusBadge "Active"), Actions ("View Details" → `/classes/[id]`)
  - Pagination
  - Empty state: "No classes with open spots at this time. Check back later."
  - Loading state: skeleton rows

### 7.7 `[UI]` Class Detail — Role-based Join & Enrolled Students

- Update `ClassDetail.tsx`:
  - **Teacher viewing**: Hide "Join Class" section entirely. "Enrolled Students" DataTable shows real data from `GET /api/classes/:id/enrollments`. Teacher sees Remove button per student row.
  - **Student viewing (not enrolled)**: Show "Join Class" section with:
    - Numbered steps hint ("1. Ask your teacher for the invite code. 2. Enter it below and click Join.")
    - Invite code input + full-width green "Join" button
    - Error/success feedback inline
    - "Enrolled Students" DataTable shown below (read-only, no actions)
  - **Student viewing (already enrolled)**: Show "✓ You are enrolled" status message with `enrolledAt` date. No Join section. Enrolled Students DataTable shown below.
- Backend: add `GET /api/classes/:id/enrollments` — returns paginated enrolled students with UserAvatar data (name, email, profilePhoto, enrolledAt). Teacher can access any class's enrollments; student sees only confirm they're enrolled (basic read-only list).

---

## Phase 8: Dashboard Feature

### 8.1 `[LOGIC]` Dashboard Backend

- `DashboardModule` with single `DashboardController`, `DashboardService`
- `GET /api/dashboard/stats` → `{ totalUsers, teachers, students, admins, subjects, departments, classes }`
- `GET /api/dashboard/charts` → `{ usersByRole: [{role, count}], subjectsPerDepartment: [{name, count}], classesPerSubject: [{name, count}] }`
- `GET /api/dashboard/recent` → `{ newestClasses: ClassDto[5], newestTeachers: UserDto[5], departmentsWithMostSubjects: [{name, subjectCount}[5]], subjectsWithMostClasses: [{name, classCount}[5]] }`
- All via raw TypeORM queries/aggregations — no new entities
- All three endpoints are `@Public()` — no auth required (admin-only in production, but open for MVP)

### 8.2 `[LOGIC]` Dashboard Client Logic

- `dashboard.service.ts`: `getStats()`, `getCharts()`, `getRecent()`
- `dashboardKeys.ts`: `stats()`, `charts()`, `recent()`
- `useDashboardStats.ts`: `useQuery`, `staleTime: 60_000`
- `useDashboardCharts.ts`: `useQuery`, `staleTime: 60_000`
- `useDashboardRecent.ts`: `useQuery`, `staleTime: 60_000`

### 8.3 `[UI]` Dashboard Page — Overview Section

- Route: `/` (protected)
- Page heading: "Dashboard", subtitle: "A quick snapshot of the latest activity and key metrics."
- **Overview card** (full width, dark border):
  - Heading: "Overview"
  - 7 StatCards in a horizontal row: Total Users (blue person icon), Teachers (green), Admins (orange), Subjects (purple book), Departments (teal building), Classes (red/orange layers)
- **Two-column layout** below:
  - Left (larger): "Users by Role" donut chart (Recharts PieChart, innerRadius=80, orange=student, blue=teacher) with legend showing "student · N" and "teacher · N"
  - Right (smaller): "New Classes (last 5)" card (count + "Most recent classes added" subtitle) + "New Teachers (last 5)" card (count + subtitle)

### 8.4 `[UI]` Dashboard Page — Insights Section

- Scrollable section below Overview
- **Insights heading**
- **Two bar charts side by side** (Recharts BarChart):
  - "Subjects per Department" — orange bars (`#f97316`), x-axis = dept names
  - "Classes per Subject" — blue bars (`#3b82f6`), x-axis = subject names (may scroll via overflow)
- **Two RankList side by side**:
  - "Newest Classes" — ranked list #1–5 (name, "subject · teacher" subtitle, "New" badge)
  - "Newest Teachers" — ranked list #1–5 (name, email subtitle, "New" badge)
- **Two RankList side by side**:
  - "Departments with Most Subjects" — ranked list (name, "N subjects" subtitle, green count badge)
  - "Subjects with Most Classes" — ranked list (name, "N classes" subtitle, green count badge)

---

## Phase 9: Theme & Polish

### 9.1 `[LOGIC]` Ensure All Endpoints Support Search & Filters

- Audit all GET list endpoints: departments, subjects, classes, faculty
- Confirm `?search=` does case-insensitive ILIKE on name (and code where applicable)
- Confirm `?page=` and `?limit=` work correctly with 0-based offset: `skip = (page-1) * limit`
- Confirm filter params (`?departmentId=`, `?subjectId=`, `?teacherId=`, `?status=`) work independently and in combination
- Add `?role=` filter to users endpoint used by Faculty feature

### 9.2 `[UI]` tweakcn Theme System Integration

- Install tweakcn theme picker component: `pnpm --filter web dlx tweakcn@latest add theme-toggle`
- Register base themes: `dark` (default), `light`, `dark-blue`, `dark-purple`
- Mount theme picker in sidebar or topbar as icon button
- `ThemeContext.tsx` wraps tweakcn's provider, stores theme name in `localStorage`
- Confirm ALL CSS variables update on theme switch (verify primary, background, card, border)
- Test all 4 pages per theme: Dashboard, Subjects, Classes, Departments

### 9.3 `[UI]` Empty States, Loading States, Error States

- Confirm `EmptyState` component renders on all tables when data is empty: "No data to display" / "This table is empty for the time being."
- Confirm skeleton loading rows in `DataTable` when `isLoading === true` (3 shimmer rows minimum)
- `ErrorBoundary` wrapping each feature section on detail pages
- Failed fetch: replace table with `"Failed to load data. Try refreshing the page."` + Refresh button
- Toast notifications for: successful create, successful delete, failed mutation (red toast)
