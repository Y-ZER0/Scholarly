# architecture.md — ClassroomOS

## Tech Stack

| Layer                | Technology                          | Version        |
| -------------------- | ----------------------------------- | -------------- |
| Frontend Framework   | Next.js (App Router)                | 16.2.9         |
| UI Component Library | shadcn/ui                           | New York style |
| Styling              | Tailwind CSS                        | v4             |
| Theme System         | tweakcn                             | latest         |
| Server State         | TanStack Query                      | v5             |
| Client State         | React Context API                   | built-in       |
| Form Management      | React Hook Form + Zod               | latest         |
| Charts               | Recharts                            | latest         |
| HTTP Client          | Axios                               | latest         |
| Backend Framework    | NestJS                              | v10            |
| ORM                  | TypeORM                             | latest         |
| Database             | PostgreSQL 15+ (hosted on Supabase) | 15+            |
| Database Provider    | Supabase (cloud PostgreSQL)         | latest         |
| Auth                 | Passport.js (JWT + Google + GitHub) | latest         |
| File Storage         | Multer (dev) / Cloudinary (prod)    | —              |
| Monorepo Manager     | pnpm workspaces                     | latest         |
| Build Pipeline       | Turborepo                           | v2             |
| Shared Types         | @repo/shared workspace package      | —              |

---

## Monorepo Root Structure

```
/
├── apps/
│   ├── web/                          # Next.js 15 frontend
│   └── api/                          # NestJS backend
├── packages/
│   └── shared/                       # Shared TypeScript types ONLY — no runtime deps
│       ├── src/
│       │   ├── dtos/
│       │   │   ├── auth.dto.ts
│       │   │   ├── user.dto.ts
│       │   │   ├── department.dto.ts
│       │   │   ├── subject.dto.ts
│       │   │   ├── class.dto.ts
│       │   │   └── enrollment.dto.ts
│       │   ├── enums/
│       │   │   ├── user-role.enum.ts
│       │   │   └── class-status.enum.ts
│       │   └── index.ts
│       ├── package.json
│       └── tsconfig.json
├── context/                          # AI agent context files
├── package.json                      # Root workspace
├── pnpm-workspace.yaml
└── turbo.json
```

---

## Frontend Folder Structure (`apps/web/src/`)

```
app/
├── (auth)/                           # Public — no sidebar, no auth guard
│   ├── login/page.tsx
│   └── register/page.tsx
├── (protected)/                      # Auth-gated — requires valid JWT
│   ├── layout.tsx                    # AuthGuard + DashboardLayout
│   ├── page.tsx                      # /  → Dashboard
│   ├── subjects/
│   │   ├── page.tsx                  # /subjects
│   │   ├── create/page.tsx
│   │   └── [id]/page.tsx
│   ├── departments/
│   │   ├── page.tsx
│   │   ├── create/page.tsx
│   │   └── [id]/page.tsx
│   ├── faculty/
│   │   ├── page.tsx
│   │   └── [id]/page.tsx
│   ├── enrollments/
│   │   └── page.tsx
│   └── classes/
│       ├── page.tsx
│       ├── create/page.tsx
│       └── [id]/page.tsx
├── layout.tsx                        # Root layout — AppProviders
└── globals.css                       # Tailwind v4 + CSS variables

features/
├── auth/
│   ├── ui/
│   │   ├── LoginForm.tsx
│   │   ├── RegisterForm.tsx
│   │   └── AuthGuard.tsx
│   ├── context/
│   │   └── AuthContext.tsx           # CLIENT state: currentUser, token, isAuthenticated
│   ├── services/
│   │   └── auth.service.ts
│   ├── dtos/
│   │   ├── login-request.dto.ts
│   │   └── register-request.dto.ts
│   └── hooks/
│       ├── useAuth.ts
│       ├── useLogin.ts
│       └── useRegister.ts
├── dashboard/
│   ├── ui/
│   │   ├── DashboardOverview.tsx
│   │   └── DashboardInsights.tsx
│   ├── services/
│   │   └── dashboard.service.ts
│   └── hooks/
│       ├── dashboardKeys.ts
│       ├── useDashboardStats.ts
│       ├── useDashboardCharts.ts
│       └── useDashboardRecent.ts
├── departments/
│   ├── ui/
│   │   ├── DepartmentList.tsx
│   │   ├── DepartmentDetail.tsx
│   │   └── CreateDepartmentForm.tsx
│   ├── services/
│   │   └── department.service.ts
│   ├── dtos/
│   │   ├── create-department-request.dto.ts
│   │   └── update-department-request.dto.ts
│   └── hooks/
│       ├── departmentKeys.ts
│       ├── useDepartments.ts
│       ├── useDepartment.ts
│       ├── useCreateDepartment.ts
│       ├── useUpdateDepartment.ts
│       └── useDeleteDepartment.ts
├── subjects/
│   ├── ui/
│   │   ├── SubjectList.tsx
│   │   ├── SubjectDetail.tsx
│   │   └── CreateSubjectForm.tsx
│   ├── services/
│   │   └── subject.service.ts
│   ├── dtos/
│   │   ├── create-subject-request.dto.ts
│   │   └── update-subject-request.dto.ts
│   └── hooks/
│       ├── subjectKeys.ts
│       ├── useSubjects.ts
│       ├── useSubject.ts
│       ├── useCreateSubject.ts
│       ├── useUpdateSubject.ts
│       └── useDeleteSubject.ts
├── faculty/
│   ├── ui/
│   │   ├── FacultyList.tsx
│   │   └── FacultyDetail.tsx
│   ├── services/
│   │   └── faculty.service.ts
│   └── hooks/
│       ├── facultyKeys.ts
│       ├── useFaculty.ts
│       └── useFacultyMember.ts
├── classes/
│   ├── ui/
│   │   ├── ClassList.tsx
│   │   ├── ClassDetail.tsx
│   │   └── CreateClassForm.tsx
│   ├── services/
│   │   └── class.service.ts
│   ├── dtos/
│   │   ├── create-class-request.dto.ts
│   │   └── update-class-request.dto.ts
│   └── hooks/
│       ├── classKeys.ts
│       ├── useClasses.ts
│       ├── useClass.ts
│       ├── useCreateClass.ts
│       ├── useUpdateClass.ts
│       └── useDeleteClass.ts
└── enrollments/
    ├── ui/
    │   ├── EnrollmentList.tsx
    │   └── JoinClassModal.tsx
    ├── services/
    │   └── enrollment.service.ts
    ├── dtos/
    │   └── join-class-request.dto.ts
    └── hooks/
        ├── enrollmentKeys.ts
        ├── useEnrollments.ts
        ├── useJoinClass.ts
        └── useUnenroll.ts

shared/
├── ui/
│   ├── components/
│   │   ├── DataTable.tsx
│   │   ├── StatCard.tsx
│   │   ├── PageHeader.tsx
│   │   ├── DetailPageHeader.tsx
│   │   ├── Breadcrumb.tsx
│   │   ├── CodeBadge.tsx
│   │   ├── StatusBadge.tsx
│   │   ├── DepartmentChip.tsx
│   │   ├── FormCard.tsx
│   │   ├── FileUpload.tsx
│   │   ├── UserAvatar.tsx
│   │   ├── RankList.tsx
│   │   ├── EmptyState.tsx
│   │   └── LoadingSpinner.tsx
│   └── layouts/
│       ├── DashboardLayout.tsx
│       └── SidebarNav.tsx
├── context/
│   ├── AppProviders.tsx              # Root: QueryClient + ThemeProvider + AuthProvider + SidebarProvider
│   ├── ThemeContext.tsx              # CLIENT state: active theme name
│   └── SidebarContext.tsx            # CLIENT state: isOpen, toggle, close
├── hooks/
│   ├── useDebounce.ts
│   └── useLocalStorage.ts
├── lib/
│   ├── api-client.ts                 # Axios instance + interceptors
│   └── utils.ts                     # cn(), formatDate(), formatCount()
└── types/
    ├── api.types.ts                  # ApiResponse<T>, PaginatedResponse<T>
    └── common.types.ts               # PaginationState, FilterState

components/
└── ui/                               # shadcn auto-generated — NEVER EDIT MANUALLY
    ├── button.tsx
    ├── input.tsx
    ├── select.tsx
    ├── dialog.tsx
    ├── badge.tsx
    ├── avatar.tsx
    ├── table.tsx
    ├── textarea.tsx
    └── ...
```

---

## Backend Folder Structure (`apps/api/src/`)

```
modules/
├── auth/
│   ├── controllers/auth.controller.ts
│   ├── services/auth.service.ts
│   ├── strategies/
│   │   ├── jwt.strategy.ts
│   │   ├── google.strategy.ts
│   │   └── github.strategy.ts
│   ├── guards/jwt-auth.guard.ts
│   ├── dtos/
│   │   ├── login-request.dto.ts
│   │   └── register-request.dto.ts
│   └── auth.module.ts
├── users/
│   ├── controllers/users.controller.ts
│   ├── services/users.service.ts
│   ├── repositories/users.repository.ts
│   ├── entities/user.entity.ts
│   ├── dtos/
│   │   ├── create-user-request.dto.ts
│   │   └── update-user-request.dto.ts
│   └── users.module.ts
├── departments/
│   ├── controllers/departments.controller.ts
│   ├── services/departments.service.ts
│   ├── repositories/departments.repository.ts
│   ├── entities/department.entity.ts
│   ├── dtos/
│   │   ├── create-department-request.dto.ts
│   │   └── update-department-request.dto.ts
│   └── departments.module.ts
├── subjects/
│   ├── controllers/subjects.controller.ts
│   ├── services/subjects.service.ts
│   ├── repositories/subjects.repository.ts
│   ├── entities/subject.entity.ts
│   ├── dtos/
│   │   ├── create-subject-request.dto.ts
│   │   └── update-subject-request.dto.ts
│   └── subjects.module.ts
├── classes/
│   ├── controllers/classes.controller.ts
│   ├── services/classes.service.ts
│   ├── repositories/classes.repository.ts
│   ├── entities/class.entity.ts
│   ├── dtos/
│   │   ├── create-class-request.dto.ts
│   │   └── update-class-request.dto.ts
│   └── classes.module.ts
├── enrollments/
│   ├── controllers/enrollments.controller.ts
│   ├── services/enrollments.service.ts
│   ├── repositories/enrollments.repository.ts
│   ├── entities/enrollment.entity.ts
│   ├── dtos/join-class-request.dto.ts
│   └── enrollments.module.ts
├── dashboard/
│   ├── controllers/dashboard.controller.ts
│   ├── services/dashboard.service.ts
│   └── dashboard.module.ts
└── uploads/
    ├── controllers/uploads.controller.ts
    └── uploads.module.ts

shared/
├── filters/http-exception.filter.ts
├── interceptors/response-transform.interceptor.ts
├── guards/roles.guard.ts
├── decorators/
│   ├── public.decorator.ts
│   ├── roles.decorator.ts
│   └── current-user.decorator.ts
└── types/api-response.types.ts

database/
├── migrations/
└── database.module.ts

config/
├── database.config.ts
├── jwt.config.ts
└── app.config.ts

app.module.ts
main.ts
```

---

## Database Schema

```sql
-- Enum types
CREATE TYPE user_role    AS ENUM ('student', 'teacher', 'admin');
CREATE TYPE class_status AS ENUM ('active', 'inactive');

-- Tables
CREATE TABLE users (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name          VARCHAR(255) NOT NULL,
  email         VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255),                    -- NULL for OAuth-only accounts
  role          user_role NOT NULL DEFAULT 'student',
  profile_photo VARCHAR(500),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE departments (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code        VARCHAR(20) UNIQUE NOT NULL,
  name        VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE subjects (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code          VARCHAR(20) UNIQUE NOT NULL,
  name          VARCHAR(255) NOT NULL,
  description   TEXT NOT NULL,
  department_id UUID NOT NULL REFERENCES departments(id) ON DELETE RESTRICT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE classes (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name         VARCHAR(255) NOT NULL,
  description  TEXT NOT NULL,
  banner_image VARCHAR(500),
  capacity     INTEGER NOT NULL DEFAULT 30,
  status       class_status NOT NULL DEFAULT 'active',
  invite_code  VARCHAR(20) UNIQUE NOT NULL,        -- nanoid(8), generated on create
  subject_id   UUID NOT NULL REFERENCES subjects(id) ON DELETE RESTRICT,
  teacher_id   UUID NOT NULL REFERENCES users(id)  ON DELETE RESTRICT,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE enrollments (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id   UUID NOT NULL REFERENCES classes(id)  ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES users(id)    ON DELETE CASCADE,
  enrolled_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(class_id, student_id)                      -- prevent double-enrollment
);
```

---

## Supabase — Cloud PostgreSQL Provider

> ClassroomOS does **not** run a local PostgreSQL instance. All environments (development and production) connect to a Supabase-hosted PostgreSQL project.

### Why This Matters for the Agent

- `synchronize: false` is **permanently enforced** in TypeORM. Supabase manages the schema. The agent must never set `synchronize: true`.
- TypeORM connects via a **`DATABASE_URL` connection string** — not individual `DB_HOST / DB_PORT / DB_USER / DB_PASS / DB_NAME` variables. Those five variables do not exist in this project.
- SSL is required on every connection: `ssl: { rejectUnauthorized: false }`.
- Schema changes (new tables, migrations) go through the **Supabase SQL Editor** or TypeORM migration files — never via `synchronize`.

### Connection String Types

| Variable              | Port                        | When to Use                          |
| --------------------- | --------------------------- | ------------------------------------ |
| `DATABASE_URL`        | `6543` (Transaction Pooler) | App runtime — TypeORM `forRootAsync` |
| `DATABASE_URL_DIRECT` | `5432` (Direct)             | TypeORM migration CLI only           |

### Getting the Connection String (One-Time Setup)

1. Supabase Dashboard → your project → **Project Settings → Database**
2. Under **Connection String**, choose **URI** format
3. Copy the string — it looks like: `postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres`
4. Paste it as `DATABASE_URL` in `apps/api/.env`
5. For the direct URL (port 5432), use `DATABASE_URL_DIRECT`

### TypeORM `forRootAsync` — Canonical Configuration

```typescript
// apps/api/src/app.module.ts
TypeOrmModule.forRootAsync({
  imports:    [ConfigModule],
  inject:     [ConfigService],
  useFactory: (config: ConfigService): TypeOrmModuleOptions => ({
    type:        'postgres',
    url:          config.get<string>('DATABASE_URL'),   // Supabase Transaction Pooler
    ssl:         { rejectUnauthorized: false },          // Required by Supabase
    entities:    [__dirname + '/**/*.entity{.ts,.js}'],
    synchronize: false,                                  // NEVER true — schema is managed in Supabase
    logging:     config.get('NODE_ENV') === 'development',
    extra: {
      max: 5,  // Supabase free tier connection limit — do not raise above 10
    },
  }),
}),
```

### Schema Initialization

Run the full SQL block from `## Database Schema` in the **Supabase SQL Editor** on first project setup. Tables are created once; TypeORM only reads and writes to them — it never drops or alters them.

---

## Authentication & Core Patterns

### JWT Auth Flow

```
POST /api/auth/login  ←  { email, password }
                      →  { accessToken, user: UserDto }
                               ↓
            localStorage.setItem('access_token', token)
                               ↓
     Axios interceptor: Authorization: Bearer <token> on every request
                               ↓
    NestJS JwtAuthGuard validates token globally (except @Public() routes)
```

### OAuth Flow (Google / GitHub)

```
User clicks "Sign in with Google"
  → GET /api/auth/google
  → Passport redirects to Google consent screen
  → GET /api/auth/google/callback
  → Backend upserts user, issues JWT
  → Redirects to /api/auth/oauth-success?token=<jwt>
  → Frontend reads token from URL param → stores in localStorage → redirects to /
```

### Invite Code Flow

```
Teacher creates class → backend calls nanoid(8) → stores as inviteCode
Teacher shares code "xK9mRp2Q" with students
Student visits /classes/[id] → "Join Class" button → modal asks for code
POST /api/enrollments/join  ←  { inviteCode }  (+ JWT for studentId)
  → validate code exists
  → check class status === 'active'
  → check enrollment count < capacity
  → check no duplicate enrollment
  → create Enrollment record
  → return EnrollmentDto
```

### Role Guard Pattern

```typescript
// Controller methods that require specific roles:
@Roles(UserRole.ADMIN, UserRole.TEACHER)
@UseGuards(JwtAuthGuard, RolesGuard)
@Post()
async create(...) { ... }

// Globally public endpoints:
@Public()
@Post('login')
async login(...) { ... }
```

### File Upload Pattern

```
[UI] User selects file in FileUpload component
  → immediately POST /api/uploads/image (multipart/form-data)
  → receives { url: '/uploads/abc123.jpg' }
  → stores URL in form state
  → on form submit, URL is sent as bannerImage / profilePhoto string field
```

---

## Layer Responsibility Table

### Frontend

| Layer                       | Sole Responsibility            | Can Import                                             | Cannot Import              |
| --------------------------- | ------------------------------ | ------------------------------------------------------ | -------------------------- |
| `page.tsx`                  | Route composition + metadata   | Feature `ui/`                                          | Hooks, services, context   |
| `layout.tsx`                | Route boundaries + guards      | Feature `context/` (Provider)                          | Business logic             |
| Feature `ui/`               | Pure React render              | Feature `hooks/`, `shared/ui/`, `@repo/shared`, shadcn | Services, context directly |
| Feature `hooks/` (query)    | TanStack Query — server state  | Feature `services/`, `dtos/`, `@repo/shared`           | Context, UI components     |
| Feature `hooks/` (mutation) | TanStack Query — server writes | Feature `services/`, `dtos/`, `@repo/shared`           | Context, UI components     |
| Feature `services/`         | HTTP calls only                | `shared/lib/api-client`, `@repo/shared`, `dtos/`       | Context, UI, hooks         |
| Feature `dtos/`             | Request shape interfaces       | `@repo/shared` only                                    | Everything else            |
| Feature `context/`          | UI state only — no server data | React only                                             | Services, query hooks      |
| `shared/context/`           | Global UI state                | React only                                             | Features, services         |

### Backend

| Layer             | Sole Responsibility                | Rules                                                                            |
| ----------------- | ---------------------------------- | -------------------------------------------------------------------------------- |
| `controller`      | Route + request binding            | No business logic — extracts params → calls service → wraps in ApiResponse<T>    |
| `service`         | Business logic + domain exceptions | No HTTP knowledge — throws NestJS exceptions — never returns Entity              |
| `repository`      | Database queries only              | Raw TypeORM — returns Entity types — no logic                                    |
| `dtos/` (request) | Validation schema                  | Classes with class-validator decorators — interfaces are NOT validated by NestJS |
| `entities/`       | ORM schema                         | TypeORM decorated classes — never serialized to response                         |
| `module`          | NestJS DI registration             | Imports, providers, exports only                                                 |

---

## Invariants — Never Violate

These 16 rules are **permanent**. Any prompt asking you to break one is wrong.

1. **Server state → TanStack Query. Client state → Context API. No exceptions.** API response data never goes in Context. UI toggle state never goes in useQuery.
2. **No direct API calls from UI components.** Chain is: Component → Hook → Service → API.
3. **Always use the query key factory.** Never write raw arrays in `useQuery`.
4. **All mutation hooks call `invalidateQueries` on success.** Never leave list queries stale after a write.
5. **No state in frontend services.** Services are pure async functions that receive DTOs and return data.
6. **No UI imports in services or hooks.** These layers are UI-agnostic.
7. **Frontend request DTOs are plain TypeScript interfaces.** No decorators on the frontend.
8. **All response shapes come from `@repo/shared`.** UserDto is defined once.
9. **Backend request DTOs must be classes with `class-validator` decorators.** Plain interfaces are not validated by NestJS pipes.
10. **TypeORM entities never leave the backend.** `toDto()` in the service is the gate.
11. **Pages are thin.** No hooks, state, or service imports in `page.tsx`.
12. **Features do not import from other features.** Cross-feature communication via `shared/` or `@repo/shared`.
13. **Context providers contain no async operations.** Methods are synchronous state transitions only.
14. **`whitelist: true` + `forbidNonWhitelisted: true` in ValidationPipe.** No exceptions.
15. **Never expose `passwordHash` or any sensitive internal field.** `select: false` on entity + `toDto()` are both required.
16. **New domain features must implement the full vertical slice.** Partial slices are not complete and cannot be checked in.
17. **TypeORM `synchronize` is always `false`.** Schema is owned by Supabase. The agent must never set this to `true` under any circumstance — not in dev, not in test, never.
18. **Database connection always uses `DATABASE_URL` (the Supabase connection string).** Never use individual `DB_HOST / DB_PORT / DB_USER / DB_PASS / DB_NAME` variables. They do not exist in this project.
19. **SSL must always be `{ rejectUnauthorized: false }` on the TypeORM connection.** Supabase requires SSL. Omitting it causes a silent connection failure.
