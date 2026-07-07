# code-standards.md — ClassroomOS

> Every agent reads this before writing any code. These are not preferences — they are the law of this codebase.
> Deviations create drift. Drift creates bugs. Bugs create RECOVER sessions.

---

## Naming Conventions

### Files & Folders

| Artifact            | Convention                  | Example                                   |
| ------------------- | --------------------------- | ----------------------------------------- |
| Feature folder      | `kebab-case`                | `subjects/`, `faculty/`, `class-details/` |
| Page file           | always `page.tsx`           | `page.tsx`                                |
| Layout file         | always `layout.tsx`         | `layout.tsx`                              |
| UI component file   | `PascalCase.tsx`            | `SubjectList.tsx`, `UserAvatar.tsx`       |
| Hook file           | `camelCase.ts`              | `useSubjects.ts`, `useCreateClass.ts`     |
| Service file        | `kebab-case.service.ts`     | `subject.service.ts`, `auth.service.ts`   |
| Frontend DTO file   | `kebab-case-request.dto.ts` | `create-subject-request.dto.ts`           |
| Query key file      | `camelCase.ts`              | `subjectKeys.ts`, `classKeys.ts`          |
| Context file        | `PascalCase.tsx`            | `AuthContext.tsx`, `SidebarContext.tsx`   |
| Backend entity file | `kebab-case.entity.ts`      | `user.entity.ts`, `class.entity.ts`       |
| Backend DTO file    | `kebab-case-request.dto.ts` | `create-class-request.dto.ts`             |
| Backend repository  | `kebab-case.repository.ts`  | `departments.repository.ts`               |
| Backend service     | `kebab-case.service.ts`     | `subjects.service.ts`                     |
| Backend controller  | `kebab-case.controller.ts`  | `classes.controller.ts`                   |
| Backend module      | `kebab-case.module.ts`      | `enrollments.module.ts`                   |
| Backend strategy    | `kebab-case.strategy.ts`    | `jwt.strategy.ts`, `google.strategy.ts`   |
| Backend guard       | `kebab-case.guard.ts`       | `jwt-auth.guard.ts`, `roles.guard.ts`     |
| Backend filter      | `kebab-case.filter.ts`      | `http-exception.filter.ts`                |
| Backend decorator   | `kebab-case.decorator.ts`   | `current-user.decorator.ts`               |

### TypeScript Identifiers

| Type                            | Convention                    | Example                                        |
| ------------------------------- | ----------------------------- | ---------------------------------------------- |
| Frontend request DTO interface  | `PascalCase` + `RequestDto`   | `CreateSubjectRequestDto`                      |
| Shared response interface       | `PascalCase` + `Dto`          | `SubjectDto`, `ClassDto`, `UserDto`            |
| Frontend service (const object) | `camelCase` const             | `export const subjectService = { ... }`        |
| Backend DTO class               | `PascalCase` + `RequestDto`   | `CreateClassRequestDto`                        |
| Backend entity class            | `PascalCase` singular         | `Department`, `Subject`, `Class`, `Enrollment` |
| Backend repository class        | `PascalCase` + `Repository`   | `ClassesRepository`                            |
| Backend service class           | `PascalCase` + `Service`      | `SubjectsService`                              |
| Backend controller class        | `PascalCase` + `Controller`   | `DepartmentsController`                        |
| Backend module class            | `PascalCase` + `Module`       | `EnrollmentsModule`                            |
| Guard class                     | `PascalCase` + `Guard`        | `JwtAuthGuard`, `RolesGuard`                   |
| Strategy class                  | `PascalCase` + `Strategy`     | `JwtStrategy`, `GoogleStrategy`                |
| Filter class                    | `PascalCase` + `Filter`       | `AllExceptionsFilter`                          |
| Query key factory object        | `camelCase` + `Keys`          | `subjectKeys`, `classKeys`, `departmentKeys`   |
| Query hook                      | `use` + `PascalCase` noun     | `useSubjects`, `useClass`, `useFaculty`        |
| Mutation hook                   | `use` + verb + `PascalCase`   | `useCreateSubject`, `useDeleteClass`           |
| Context value interface         | `PascalCase` + `ContextValue` | `AuthContextValue`, `SidebarContextValue`      |
| Context consumer hook           | `use` + `PascalCase`          | `useAuth`, `useSidebar`, `useTheme`            |
| Provider component              | `PascalCase` + `Provider`     | `AuthProvider`, `SidebarProvider`              |
| Enum values                     | `SCREAMING_SNAKE_CASE`        | `UserRole.TEACHER`, `ClassStatus.ACTIVE`       |
| React component                 | `PascalCase`                  | `UserAvatar`, `CodeBadge`, `DataTable`         |
| Page-level component in feature | `PascalCase` + noun           | `SubjectList`, `ClassDetail`, `DepartmentList` |
| CSS variable reference          | `var(--color-*)`              | `var(--color-primary)`, `var(--border)`        |

---

## Component Structure

Every component follows this exact internal order. No exceptions.

```typescript
'use client'; // Only when using hooks, event handlers, or browser APIs

// ─── 1. External library imports ───────────────────────────────────────────
import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';

// ─── 2. shadcn/ui component imports ────────────────────────────────────────
import { Button } from '@/components/ui/button';
import { Input }  from '@/components/ui/input';

// ─── 3. Shared utility imports ──────────────────────────────────────────────
import { DataTable }   from '@/shared/ui/components/DataTable';
import { CodeBadge }   from '@/shared/ui/components/CodeBadge';
import { EmptyState }  from '@/shared/ui/components/EmptyState';

// ─── 4. Feature imports ─────────────────────────────────────────────────────
import { useSubjects }       from '../hooks/useSubjects';
import { useDeleteSubject }  from '../hooks/useDeleteSubject';
import type { SubjectDto }   from '@repo/shared';

// ─── 5. Local type / interface definitions ───────────────────────────────────
interface SubjectListProps {
  departmentId?: string;
}

// ─── 6. Component ────────────────────────────────────────────────────────────
export function SubjectList({ departmentId }: SubjectListProps) {
  // 6a. Hooks (all at top — React rules)
  const [page, setPage] = useState(1);
  const { data, isLoading, isError } = useSubjects({ page, departmentId });
  const { mutate: deleteSubject } = useDeleteSubject();
  const router = useRouter();

  // 6b. Derived values
  const totalPages = data?.meta.totalPages ?? 1;

  // 6c. Event handlers (useCallback for handlers passed as props)
  const handleView = useCallback((id: string) => {
    router.push(`/subjects/${id}`);
  }, [router]);

  // 6d. Early returns (loading, error)
  if (isLoading) return <SubjectListSkeleton />;
  if (isError)   return <p className="text-sm text-destructive">Failed to load subjects.</p>;

  // 6e. Main render
  return (
    <DataTable
      columns={columns}
      data={data?.data ?? []}
      pagination={{ page, totalPages }}
      onPaginationChange={setPage}
    />
  );
}
```

---

## Import Aliases

```typescript
// Always use these. Never use relative paths climbing more than one level.
@/*          → apps/web/src/*
@repo/shared → packages/shared/src

// CORRECT
import { Button }   from '@/components/ui/button';
import { UserDto }  from '@repo/shared';
import { useAuth }  from '@/features/auth/hooks/useAuth';

// WRONG — never do this
import { Button }   from '../../../components/ui/button';
import { UserDto }  from '../../../../packages/shared/src';
```

---

## Environment Variables

### `apps/web/.env.local`

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id
NEXT_PUBLIC_GITHUB_CLIENT_ID=your-github-client-id
```

### `apps/api/.env`

```env
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# ─── Database — Supabase (cloud PostgreSQL) ──────────────────────────────────
# NO local PostgreSQL. All environments connect to the Supabase-hosted project.
#
# Transaction Pooler (port 6543) — used by TypeORM forRootAsync at runtime
# Get from: Supabase Dashboard → Project Settings → Database → Connection String (URI)
DATABASE_URL=postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres
#
# Direct connection (port 5432) — used by TypeORM migration CLI only
DATABASE_URL_DIRECT=postgresql://postgres.[PROJECT-REF]:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
#
# ⚠️  Never add DB_HOST, DB_PORT, DB_USER, DB_PASS, or DB_NAME — they are not used in this project.

# Auth
JWT_SECRET=replace-with-long-random-secret
JWT_EXPIRY=7d

# OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret

# File Storage
UPLOAD_DIR=./uploads
MAX_FILE_SIZE_MB=5
```

### Dependency Management

```bash
# Add to frontend
pnpm --filter web add <package>
pnpm --filter web add -D <dev-package>

# Add to backend
pnpm --filter api add <package>
pnpm --filter api add -D <dev-package>

# Add to shared types package
pnpm --filter shared add -D <dev-package>

# Run from root (Turborepo)
pnpm dev         # starts both apps concurrently
pnpm build       # builds all apps in dependency order
pnpm type-check  # type-checks all workspaces
```

---

## Frontend Patterns

### No `<form>` Tags — Ever

```typescript
// WRONG — will break in React artifacts and causes submit interference
<form onSubmit={handleSubmit(onSubmit)}>
  <button type="submit">Create</button>
</form>

// CORRECT — always use div + onClick
<div>
  <Input {...register('name')} />
  <Button onClick={handleSubmit(onSubmit)} disabled={isPending}>
    Create Department
  </Button>
</div>
```

### Form Validation Pattern (React Hook Form + Zod)

```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const createDepartmentSchema = z.object({
  code:        z.string().min(2).max(10).toUpperCase(),
  name:        z.string().min(2, 'Name must be at least 2 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
});

type CreateDepartmentValues = z.infer<typeof createDepartmentSchema>;

export function CreateDepartmentForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<CreateDepartmentValues>({
    resolver: zodResolver(createDepartmentSchema),
  });

  const { mutate, isPending } = useCreateDepartment();

  const onSubmit = (data: CreateDepartmentValues) => {
    mutate(data, {
      onSuccess: () => {
        reset();
        router.push('/departments');
      },
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium text-foreground">
          Department Code <span className="text-destructive">*</span>
        </label>
        <Input {...register('code')} placeholder="CS" className="mt-1" />
        {errors.code && (
          <p className="mt-1 text-xs text-destructive">{errors.code.message}</p>
        )}
      </div>
      {/* ...other fields... */}
      <Button onClick={handleSubmit(onSubmit)} disabled={isPending || isSubmitting}>
        {isPending ? 'Creating...' : 'Create Department'}
      </Button>
    </div>
  );
}
```

### Date Display

```typescript
// All dates arrive from API as ISO strings — display with:
const formatted = new Date(isoString).toLocaleDateString("en-US", {
  year: "numeric",
  month: "short",
  day: "numeric",
});
// → "Jun 29, 2026"

// Never use Date objects in DTOs. Never pass Date across the wire.
```

### Tailwind Class Composition

```typescript
import { cn } from '@/shared/lib/utils';

// cn() merges and deduplicates Tailwind classes (uses clsx + twMerge)
<div className={cn('base-class another-class', condition && 'conditional-class', className)} />
```

---

## Backend Patterns

### Controller — Thin, No Logic

```typescript
@Controller("departments")
@UseGuards(JwtAuthGuard)
export class DepartmentsController {
  constructor(private readonly deptService: DepartmentsService) {}

  @Get()
  async findAll(
    @Query("page", new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query("limit", new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query("search") search?: string,
  ): Promise<PaginatedApiResponse<DepartmentDto>> {
    const result = await this.deptService.findAll(page, limit, search);
    return { success: true, ...result };
  }

  @Get(":id")
  async findOne(@Param("id") id: string): Promise<ApiResponse<DepartmentDto>> {
    const data = await this.deptService.findById(id);
    return { success: true, data };
  }

  @Post()
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  @UseGuards(RolesGuard)
  async create(
    @Body() dto: CreateDepartmentRequestDto,
  ): Promise<ApiResponse<DepartmentDto>> {
    const data = await this.deptService.create(dto);
    return { success: true, data };
  }

  @Patch(":id")
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  @UseGuards(RolesGuard)
  async update(
    @Param("id") id: string,
    @Body() dto: UpdateDepartmentRequestDto,
  ): Promise<ApiResponse<DepartmentDto>> {
    const data = await this.deptService.update(id, dto);
    return { success: true, data };
  }

  @Delete(":id")
  @Roles(UserRole.ADMIN)
  @UseGuards(RolesGuard)
  async remove(@Param("id") id: string): Promise<ApiResponse<null>> {
    await this.deptService.remove(id);
    return { success: true, data: null };
  }
}
```

### Service — Business Logic Gate

```typescript
@Injectable()
export class DepartmentsService {
  constructor(private readonly repo: DepartmentsRepository) {}

  async findAll(page: number, limit: number, search?: string) {
    const [items, total] = await this.repo.findAll(page, limit, search);
    return {
      data: items.map(this.toDto),
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async findById(id: string): Promise<DepartmentDto> {
    const dept = await this.repo.findById(id);
    if (!dept) throw new NotFoundException(`Department ${id} not found`);
    return this.toDto(dept);
  }

  async create(dto: CreateDepartmentRequestDto): Promise<DepartmentDto> {
    const existing = await this.repo.findByCode(dto.code);
    if (existing)
      throw new ConflictException(`Code "${dto.code}" already exists`);
    const dept = await this.repo.create(dto);
    return this.toDto(dept);
  }

  async update(
    id: string,
    dto: UpdateDepartmentRequestDto,
  ): Promise<DepartmentDto> {
    await this.findById(id); // throws NotFoundException if missing
    const updated = await this.repo.update(id, dto);
    return this.toDto(updated);
  }

  async remove(id: string): Promise<void> {
    await this.findById(id);
    await this.repo.remove(id);
  }

  // ── The Gate: only what is listed here reaches the client ─────────────────
  private toDto(dept: Department): DepartmentDto {
    return {
      id: dept.id,
      code: dept.code,
      name: dept.name,
      description: dept.description,
      createdAt: dept.createdAt.toISOString(),
    };
  }
}
```

### Repository — Raw TypeORM, No Logic

#### Basic CRUD

```typescript
@Injectable()
export class DepartmentsRepository {
  constructor(
    @InjectRepository(Department)
    private readonly repo: Repository<Department>,
  ) {}

  async findAll(
    page: number,
    limit: number,
    search?: string,
  ): Promise<[Department[], number]> {
    const qb = this.repo
      .createQueryBuilder("dept")
      .orderBy("dept.createdAt", "DESC");
    if (search) {
      qb.where("dept.name ILIKE :s OR dept.code ILIKE :s", {
        s: `%${search}%`,
      });
    }
    return qb
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();
  }

  async findById(id: string): Promise<Department | null> {
    return this.repo.findOne({ where: { id } });
  }

  async findByCode(code: string): Promise<Department | null> {
    return this.repo.findOne({ where: { code } });
  }

  async create(data: Partial<Department>): Promise<Department> {
    return this.repo.save(this.repo.create(data));
  }

  async update(id: string, data: Partial<Department>): Promise<Department> {
    await this.repo.update(id, data);
    return this.findById(id) as Promise<Department>;
  }

  async remove(id: string): Promise<void> {
    await this.repo.delete(id);
  }
}
```

#### Cross-Entity Queries — Native Array Method Approach

When a repository needs data from related tables, **never use `this.repo.query()` with raw SQL strings.** Instead:

1. Create TypeORM entity stubs for related tables (with `@ManyToOne` / `@OneToMany` decorators)
2. Use `this.repo.manager.find(RelatedEntity, { where, relations, order, select })` to load data
3. Use native JavaScript array methods (`.filter()`, `.map()`, `.find()`, `.reduce()`, `.sort()`) for in-memory joins and transformations

```typescript
import { UserRole } from "@repo/shared";
import { Subject } from "../../subjects/entities/subject.entity";
import { Class } from "../../classes/entities/class.entity";
import { Enrollment } from "../../enrollments/entities/enrollment.entity";
import { User } from "../../users/entities/user.entity";

@Injectable()
export class DepartmentsRepository {
  constructor(
    @InjectRepository(Department)
    private readonly repo: Repository<Department>,
  ) {}

  // Simple filtered query — TypeORM select + native sort
  async findSubjectsByDepartment(departmentId: string) {
    return this.repo.manager.find(Subject, {
      where: { departmentId },
      select: { id: true, code: true, name: true, description: true },
      order: { createdAt: "DESC" },
    });
  }

  // Load with relations, then filter + map in memory
  async findClassesByDepartment(departmentId: string) {
    const classes = await this.repo.manager.find(Class, {
      relations: { subject: true, teacher: true },
      order: { createdAt: "DESC" },
    });
    return classes
      .filter((c) => c.subject.departmentId === departmentId)
      .map((c) => ({
        id: c.id,
        name: c.name,
        status: c.status,
        subject: { id: c.subject.id, code: c.subject.code, name: c.subject.name },
        teacher: {
          id: c.teacher.id,
          name: c.teacher.name,
          email: c.teacher.email,
          profilePhoto: c.teacher.profilePhoto,
        },
      }));
  }

  // Multi-step chain: load A → extract IDs → load B → native Set for uniqueness
  async findStudentsByDepartment(departmentId: string) {
    const subjects = await this.repo.manager.find(Subject, {
      where: { departmentId },
      select: { id: true },
    });
    const subjectIds = subjects.map((s) => s.id);
    if (subjectIds.length === 0) return [];

    const classes = await this.repo.manager.find(Class, {
      where: subjectIds.map((id) => ({ subjectId: id })),
      select: { id: true },
    });
    const classIds = classes.map((c) => c.id);
    if (classIds.length === 0) return [];

    const enrollments = await this.repo.manager.find(Enrollment, {
      where: classIds.map((id) => ({ classId: id })),
      select: { studentId: true },
    });
    const studentIds = [...new Set(enrollments.map((e) => e.studentId))];
    if (studentIds.length === 0) return [];

    return this.repo.manager.find(User, {
      where: studentIds.map((id) => ({ id, role: UserRole.STUDENT })),
      select: { id: true, name: true, email: true, profilePhoto: true, role: true },
      order: { name: "ASC" },
    });
  }

  // Aggregate with native Set.size instead of COUNT(DISTINCT ...)
  async countStudentsByDepartment(departmentId: string): Promise<number> {
    // ... same chain as findStudentsByDepartment ...
    return new Set(enrollments.map((e) => e.studentId)).size;
  }
}
```

**Rules:**
- Every cross-entity query must use TypeORM's entity manager or query builder. **Zero tolerance for raw SQL strings.**
- Every table referenced in a join must have a TypeORM entity file with relationship decorators.
- Use `this.repo.manager.find()` to query entities not owned by this repository (avoids injecting extra repos).
- Use native `Set` for deduplication (replaces `SELECT DISTINCT`).
- Use `.filter()` + `.map()` for in-memory joins (replaces `JOIN ... ON ...`).
- Use `.sort()` or `order` option for ordering (replaces `ORDER BY`).
- Chain multiple `find()` calls with early returns when intermediate arrays are empty.

### Error Handling — Throw at Service Level

```typescript
// Services throw these — controllers catch nothing
NotFoundException; // 404 — entity not found
ConflictException; // 409 — duplicate code/email/invite
BadRequestException; // 400 — invalid input that Zod didn't catch
ForbiddenException; // 403 — wrong role for this action
UnauthorizedException; // 401 — used by JwtAuthGuard automatically

// AllExceptionsFilter converts all of the above into:
// { success: false, statusCode: 404, message: '...', path: '/api/...', timestamp: '...' }
```

### `ValidationPipe` Configuration (in `main.ts`)

```typescript
app.useGlobalPipes(
  new ValidationPipe({
    whitelist: true, // strip unknown properties silently
    forbidNonWhitelisted: true, // throw 400 on unknown properties
    transform: true, // auto-cast "1" → 1 for query params
    transformOptions: {
      enableImplicitConversion: true,
    },
  }),
);
```

### Backend DTO Decorators (always use class, not interface)

```typescript
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsInt,
  Min,
  Max,
  IsEmail,
  MinLength,
} from "class-validator";
import { Transform } from "class-transformer";

export class CreateDepartmentRequestDto {
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value?.toUpperCase?.() ?? value)
  code: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;
}
```

---

## Shared Package Standards

```typescript
// packages/shared/src/dtos/department.dto.ts
// Plain interfaces ONLY — no classes, no decorators, no runtime imports

export interface DepartmentDto {
  id: string;
  code: string;
  name: string;
  description: string;
  createdAt: string; // Always ISO string
  // Computed fields (populated by service when needed)
  totalSubjects?: number;
  totalClasses?: number;
  enrolledStudents?: number;
}
```

---

## `cn()` Utility (Always Available)

```typescript
// apps/web/src/shared/lib/utils.ts
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(isoString: string): string {
  return new Date(isoString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function formatCount(n: number): string {
  return new Intl.NumberFormat("en-US").format(n);
}
```
