# library-docs.md — ClassroomOS

> Integration patterns for every external dependency used in this project.
> Read the relevant section before using any library. Do not guess API signatures.

---

## TanStack Query v5

### QueryClient Configuration

```typescript
// apps/web/src/shared/context/AppProviders.tsx
// Created OUTSIDE the component to survive re-renders
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000, // 1 minute — override per hook as needed
      retry: 1,
      refetchOnWindowFocus: true,
    },
  },
});
```

### Query Key Factory — The Only Correct Pattern

Every feature defines its keys in `features/[domain]/hooks/[domain]Keys.ts`.
**Never write a raw array inside `useQuery` or `invalidateQueries`.**

```typescript
// features/subjects/hooks/subjectKeys.ts
export const subjectKeys = {
  all: () => ["subjects"] as const,
  lists: () => [...subjectKeys.all(), "list"] as const,
  list: (f: {
    page: number;
    limit: number;
    departmentId?: string;
    search?: string;
  }) => [...subjectKeys.lists(), f] as const,
  details: () => [...subjectKeys.all(), "detail"] as const,
  detail: (id: string) => [...subjectKeys.details(), id] as const,
};
```

### useQuery Pattern

```typescript
// features/subjects/hooks/useSubjects.ts
import { useQuery } from "@tanstack/react-query";
import { subjectService } from "../services/subject.service";
import { subjectKeys } from "./subjectKeys";

interface UseSubjectsOptions {
  page?: number;
  limit?: number;
  departmentId?: string;
  search?: string;
}

export function useSubjects(options: UseSubjectsOptions = {}) {
  const { page = 1, limit = 10, departmentId, search } = options;
  return useQuery({
    queryKey: subjectKeys.list({ page, limit, departmentId, search }),
    queryFn: () => subjectService.getAll({ page, limit, departmentId, search }),
    staleTime: 30_000, // override default for this feature
    enabled: true, // always runs; use !!id for detail queries
  });
}

// Single record — always guard with enabled: !!id
export function useSubject(id: string) {
  return useQuery({
    queryKey: subjectKeys.detail(id),
    queryFn: () => subjectService.getById(id),
    enabled: !!id,
  });
}
```

### useMutation Pattern — Full Lifecycle

```typescript
// features/subjects/hooks/useCreateSubject.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { subjectService } from "../services/subject.service";
import { subjectKeys } from "./subjectKeys";
import type { CreateSubjectRequestDto } from "../dtos/create-subject-request.dto";

export function useCreateSubject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: CreateSubjectRequestDto) => subjectService.create(dto),
    onSuccess: () => {
      // Invalidate all list queries — they will refetch with new record included
      queryClient.invalidateQueries({ queryKey: subjectKeys.lists() });
    },
    onError: (error) => {
      // Errors are handled by the calling component via isPending/isError
      console.error("Create subject failed:", error);
    },
  });
}

// useUpdateSubject — updates detail cache immediately, then invalidates list
export function useUpdateSubject(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: UpdateSubjectRequestDto) =>
      subjectService.update(id, dto),
    onSuccess: (updatedSubject) => {
      queryClient.setQueryData(subjectKeys.detail(id), updatedSubject); // instant update
      queryClient.invalidateQueries({ queryKey: subjectKeys.lists() }); // refresh lists
    },
  });
}

// useDeleteSubject — removes detail cache entry, invalidates lists
export function useDeleteSubject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => subjectService.remove(id),
    onSuccess: (_, id) => {
      queryClient.removeQueries({ queryKey: subjectKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: subjectKeys.lists() });
    },
  });
}
```

### Consuming in a Component

```typescript
const { data, isLoading, isError } = useSubjects({ page, departmentId });
const { mutate: createSubject, isPending } = useCreateSubject();

// isPending = mutation in flight (disable submit button)
// isLoading = query fetching for first time (show skeleton)
// isFetching = query fetching in background (can show subtle indicator)
// isError = query or mutation failed (show error UI)
```

---

## shadcn/ui (New York Style, Tailwind v4)

### Installation — One-time Setup

```bash
# Initialize (already done in Phase 1.4)
pnpm --filter web dlx shadcn@latest init
# Style: New York | Base color: Neutral | CSS variables: yes | Tailwind v4: yes

# Add individual components as needed
pnpm --filter web dlx shadcn@latest add button input select textarea dialog badge avatar table checkbox label separator toast
```

### ⚠️ Never Edit `src/components/ui/`

These files are managed by the shadcn CLI. Any customization belongs in the consuming component via `className` prop and the `cn()` utility.

### Components Used in This Project

**Button**

```typescript
import { Button } from '@/components/ui/button';

// Primary CTA (green)
<Button>Create Department</Button>

// Outline (secondary)
<Button variant="outline">Go Back</Button>

// Ghost (icon+text actions like Refresh, Edit)
<Button variant="ghost" size="sm">
  <RefreshCcw className="h-4 w-4 mr-1.5" /> Refresh
</Button>

// Destructive
<Button variant="destructive">Delete</Button>

// Disabled while mutation is in flight
<Button disabled={isPending}>
  {isPending ? 'Creating...' : 'Create Class'}
</Button>
```

**Input**

```typescript
import { Input } from '@/components/ui/input';

// Controlled by react-hook-form
<Input {...register('name')} placeholder="Computer Science" />

// With error state
<Input
  {...register('code')}
  className={cn(errors.code && 'border-destructive ring-destructive')}
/>
```

**Select** (for all dropdowns: Subject, Teacher, Status, Department)

```typescript
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '@/components/ui/select';

// Uncontrolled (shadcn handles value internally)
<Select onValueChange={(value) => setValue('departmentId', value)}>
  <SelectTrigger>
    <SelectValue placeholder="Select a department" />
  </SelectTrigger>
  <SelectContent>
    {departments.map((d) => (
      <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>
    ))}
  </SelectContent>
</Select>
```

**Dialog** (for Join Class modal)

```typescript
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription
} from '@/components/ui/dialog';

<Dialog open={isOpen} onOpenChange={setIsOpen}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Join a Class</DialogTitle>
      <DialogDescription>Enter the invite code from your teacher.</DialogDescription>
    </DialogHeader>
    {/* form content */}
  </DialogContent>
</Dialog>
```

**Table** (base — usually consumed via DataTable wrapper)

```typescript
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
```

**Avatar**

```typescript
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

<Avatar className="h-8 w-8">
  <AvatarImage src={user.profilePhoto ?? undefined} alt={user.name} />
  <AvatarFallback className="text-xs bg-muted">
    {user.name.slice(0, 2).toUpperCase()}
  </AvatarFallback>
</Avatar>
```

---

## tweakcn

### What It Is

tweakcn is a **CSS variable theme generator** for shadcn/ui. It produces sets of CSS variable overrides that swap the visual identity of the entire app. It is NOT a runtime library in the traditional sense — it generates static CSS that is stored and applied by the `ThemeContext`.

### How Themes Are Applied at Runtime

```typescript
// apps/web/src/shared/context/ThemeContext.tsx
'use client';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type ThemeName = 'dark' | 'light' | 'dark-blue' | 'dark-purple';

interface ThemeContextValue {
  theme: ThemeName;
  setTheme: (t: ThemeName) => void;
  availableThemes: ThemeName[];
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

const THEMES: ThemeName[] = ['dark', 'light', 'dark-blue', 'dark-purple'];

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeName>('dark');

  useEffect(() => {
    const stored = localStorage.getItem('theme') as ThemeName | null;
    if (stored && THEMES.includes(stored)) setThemeState(stored);
  }, []);

  const setTheme = (t: ThemeName) => {
    setThemeState(t);
    localStorage.setItem('theme', t);
    // Apply theme class to <html> — tweakcn uses data-theme attribute
    document.documentElement.setAttribute('data-theme', t);
  };

  // Apply on first mount
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, availableThemes: THEMES }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
```

### CSS Theme Definitions in `globals.css`

Each theme overrides the CSS variables. See `ui-tokens.md` for the full token list.

```css
/* Dark (default — matches UI screenshots) */
[data-theme="dark"] {
  --background: 9 9% 6%;
  --primary: 142 72% 29%;
  /* ... all tokens from ui-tokens.md dark section ... */
}

/* Light variant */
[data-theme="light"] {
  --background: 0 0% 100%;
  --primary: 142 72% 29%;
  /* ... */
}
```

### Theme Toggle Component (Topbar)

```typescript
'use client';
import { useTheme } from '@/shared/context/ThemeContext';
import { Button }   from '@/components/ui/button';
import { Moon, Sun } from 'lucide-react';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const isDark = theme.startsWith('dark');
  return (
    <Button variant="ghost" size="icon" onClick={() => setTheme(isDark ? 'light' : 'dark')}>
      {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </Button>
  );
}
```

---

## React Hook Form + Zod

### Always Use These Together

```typescript
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
```

### Schema Patterns by Field Type

```typescript
const schema = z.object({
  // Short text required
  code: z.string().min(2, "Min 2 chars").max(10, "Max 10 chars"),

  // Long text required
  description: z.string().min(10, "Min 10 characters"),

  // Email
  email: z.string().email("Invalid email address"),

  // Password
  password: z.string().min(8, "Min 8 characters"),

  // Number (select returns string — coerce to number)
  capacity: z.coerce.number().min(1).max(500),

  // UUID foreign key from select
  departmentId: z.string().uuid("Please select a department"),

  // Enum
  role: z.enum(["student", "teacher"]),
  status: z.enum(["active", "inactive"]).default("active"),

  // Optional field
  bannerImage: z.string().url().optional(),
});
```

### Error Display Pattern

```typescript
// Always show errors directly below the field they belong to
{errors.name && (
  <p className="mt-1 text-xs text-destructive">{errors.name.message}</p>
)}
```

### File Upload Integration with react-hook-form

```typescript
// FileUpload is uncontrolled — use setValue to push URL into form state
const { setValue, watch } = useForm<FormValues>({ resolver: zodResolver(schema) });
const bannerUrl = watch('bannerImage');

<FileUpload
  onUpload={(url) => setValue('bannerImage', url, { shouldValidate: true })}
  currentUrl={bannerUrl}
/>
```

---

## Recharts

### Donut Chart — Users by Role (Dashboard)

```typescript
'use client';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// ⚠️ Use hardcoded hex ONLY here — Recharts does not read CSS variables
const ROLE_COLORS: Record<string, string> = {
  student: '#f97316',  // orange-500
  teacher: '#3b82f6',  // blue-500
  admin:   '#a855f7',  // purple-500
};

interface RoleData { role: string; count: number; }

export function UsersByRoleChart({ data }: { data: RoleData[] }) {
  const chartData = data.map((d) => ({ name: d.role, value: d.count }));
  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          innerRadius={80}
          outerRadius={130}
          dataKey="value"
          paddingAngle={2}
        >
          {chartData.map((entry) => (
            <Cell key={entry.name} fill={ROLE_COLORS[entry.name] ?? '#6b7280'} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{ backgroundColor: '#111', border: '1px solid #2e2e2e', borderRadius: 8 }}
          labelStyle={{ color: '#fff' }}
        />
        <Legend
          formatter={(value, entry) =>
            `${value} · ${(entry.payload as { value: number }).value}`
          }
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
```

### Bar Chart — Insights (Dashboard)

```typescript
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

// Orange variant — "Subjects per Department"
export function SubjectsPerDeptChart({ data }: { data: { name: string; count: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data} margin={{ left: -10 }}>
        <XAxis dataKey="name" tick={{ fill: '#8c8c8c', fontSize: 12 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill: '#8c8c8c', fontSize: 12 }} axisLine={false} tickLine={false} />
        <Tooltip
          contentStyle={{ backgroundColor: '#111', border: '1px solid #2e2e2e', borderRadius: 8 }}
        />
        <Bar dataKey="count" fill="#f97316" radius={[3, 3, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

// Blue variant — "Classes per Subject"
export function ClassesPerSubjectChart({ data }: { data: { name: string; count: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data}>
        <XAxis dataKey="name" tick={{ fill: '#8c8c8c', fontSize: 12 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill: '#8c8c8c', fontSize: 12 }} axisLine={false} tickLine={false} />
        <Tooltip
          contentStyle={{ backgroundColor: '#111', border: '1px solid #2e2e2e', borderRadius: 8 }}
        />
        <Bar dataKey="count" fill="#3b82f6" radius={[3, 3, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
```

---

## Axios API Client

### Full Setup (Already Built in Phase 2.4)

```typescript
// apps/web/src/shared/lib/api-client.ts
import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001/api",
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

// Attach JWT on every request
apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("access_token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth expiry globally
apiClient.interceptors.response.use(
  (res) => res,
  (error: AxiosError) => {
    if (error.response?.status === 401 && typeof window !== "undefined") {
      localStorage.removeItem("access_token");
      window.location.replace("/login");
    }
    return Promise.reject(error);
  },
);
```

### Service Layer Pattern — All Features

```typescript
// apps/web/src/features/subjects/services/subject.service.ts
import { apiClient } from "@/shared/lib/api-client";
import type { ApiResponse, PaginatedResponse } from "@/shared/types/api.types";
import type { SubjectDto } from "@repo/shared";
import type { CreateSubjectRequestDto } from "../dtos/create-subject-request.dto";
import type { UpdateSubjectRequestDto } from "../dtos/update-subject-request.dto";

export const subjectService = {
  getAll: async (params: {
    page?: number;
    limit?: number;
    departmentId?: string;
    search?: string;
  }): Promise<PaginatedResponse<SubjectDto>> => {
    const { data } = await apiClient.get<PaginatedResponse<SubjectDto>>(
      "/subjects",
      { params },
    );
    return data;
  },

  getById: async (id: string): Promise<SubjectDto> => {
    const { data } = await apiClient.get<ApiResponse<SubjectDto>>(
      `/subjects/${id}`,
    );
    return data.data;
  },

  create: async (dto: CreateSubjectRequestDto): Promise<SubjectDto> => {
    const { data } = await apiClient.post<ApiResponse<SubjectDto>>(
      "/subjects",
      dto,
    );
    return data.data;
  },

  update: async (
    id: string,
    dto: UpdateSubjectRequestDto,
  ): Promise<SubjectDto> => {
    const { data } = await apiClient.patch<ApiResponse<SubjectDto>>(
      `/subjects/${id}`,
      dto,
    );
    return data.data;
  },

  remove: async (id: string): Promise<void> => {
    await apiClient.delete(`/subjects/${id}`);
  },
};
```

### Multipart Upload (FileUpload Component → UploadsModule)

```typescript
// Inside FileUpload component — separate from the form service
const uploadFile = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("file", file);
  const { data } = await apiClient.post<{ url: string }>(
    "/uploads/image",
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    },
  );
  return data.url;
};
```

---

## Supabase + TypeORM — Database Configuration

> ClassroomOS uses Supabase as its cloud PostgreSQL provider. TypeORM connects via a `DATABASE_URL` connection string. There is no local database. `synchronize` is always `false`.

### Package to Install

```bash
pnpm --filter api add @nestjs/typeorm typeorm pg
```

### `database.module.ts` — Canonical Implementation

```typescript
// apps/api/src/database/database.module.ts
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModuleOptions } from "@nestjs/typeorm";

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService): TypeOrmModuleOptions => ({
        type: "postgres",
        url: config.get<string>("DATABASE_URL"), // Supabase Transaction Pooler (port 6543)
        ssl: { rejectUnauthorized: false }, // Required — Supabase enforces SSL
        entities: [__dirname + "/../**/*.entity{.ts,.js}"],
        synchronize: false, // PERMANENT. Never change this. Schema lives in Supabase.
        logging: config.get("NODE_ENV") === "development",
        extra: {
          max: 5, // Supabase free tier: stay at or below this — never raise above 10
        },
      }),
    }),
  ],
})
export class DatabaseModule {}
```

### `app.module.ts` — How DatabaseModule Plugs In

```typescript
// apps/api/src/app.module.ts
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { DatabaseModule } from "./database/database.module";
import { UsersModule } from "./modules/users/users.module";
import { AuthModule } from "./modules/auth/auth.module";
// ... other feature modules

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // Loads .env globally — must be first
    DatabaseModule, // Supabase connection established here
    UsersModule,
    AuthModule,
    // ... DepartmentsModule, SubjectsModule, etc.
  ],
})
export class AppModule {}
```

### Supabase Connection String Reference

| Variable              | Port   | Purpose                                            |
| --------------------- | ------ | -------------------------------------------------- |
| `DATABASE_URL`        | `6543` | App runtime — used in `TypeOrmModule.forRootAsync` |
| `DATABASE_URL_DIRECT` | `5432` | TypeORM migration CLI (`typeorm migration:run`)    |

```env
# Get from: Supabase Dashboard → Project Settings → Database → Connection String → URI
# Transaction Pooler (runtime):
DATABASE_URL=postgresql://postgres.[REF]:[PASS]@aws-0-[REGION].pooler.supabase.com:6543/postgres

# Direct connection (migrations only):
DATABASE_URL_DIRECT=postgresql://postgres.[REF]:[PASS]@db.[REF].supabase.co:5432/postgres
```

### TypeORM Migration CLI — `datasource.ts`

Use `DATABASE_URL_DIRECT` (direct connection) when running migrations from the CLI. The pooler connection does not support the migration protocol.

```typescript
// apps/api/src/database/datasource.ts  (used by CLI only, not imported by the app)
import { DataSource } from "typeorm";
import * as dotenv from "dotenv";
dotenv.config({ path: ".env" });

export default new DataSource({
  type: "postgres",
  url: process.env.DATABASE_URL_DIRECT, // Direct connection for migrations
  ssl: { rejectUnauthorized: false },
  entities: ["src/**/*.entity.ts"],
  migrations: ["src/database/migrations/*.ts"],
  synchronize: false,
});
```

### Common Supabase TypeORM Pitfalls — Agent Must Avoid

| Mistake                                       | Why It Breaks                                                           | Correct Approach                               |
| --------------------------------------------- | ----------------------------------------------------------------------- | ---------------------------------------------- |
| `synchronize: true`                           | Drops/alters Supabase tables on startup                                 | Always `false` — run SQL in Supabase Editor    |
| Using `DB_HOST`, `DB_PORT`, etc.              | Those variables don't exist in this project                             | Use `url: config.get('DATABASE_URL')`          |
| Omitting `ssl: { rejectUnauthorized: false }` | Supabase rejects non-SSL connections silently                           | Always include the ssl config                  |
| Connecting to port 5432 at runtime            | Bypasses connection pooler — connection limits hit immediately          | Use port 6543 (Transaction Pooler) for runtime |
| Setting `extra.max > 10`                      | Exceeds Supabase free tier connection limit — other connections refused | Keep `max: 5`                                  |

---

## NestJS — Passport JWT + OAuth

### JWT Strategy

```typescript
// apps/api/src/modules/auth/strategies/jwt.strategy.ts
import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { ConfigService } from "@nestjs/config";
import { UserRole } from "@repo/shared";

interface JwtPayload {
  sub: string;
  role: UserRole;
  email: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.get<string>("JWT_SECRET"),
    });
  }

  async validate(payload: JwtPayload) {
    // This return value is attached to request.user
    return { userId: payload.sub, role: payload.role, email: payload.email };
  }
}
```

### @CurrentUser() Decorator

```typescript
// apps/api/src/shared/decorators/current-user.decorator.ts
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => ctx.switchToHttp().getRequest().user,
);

// Usage in controller:
@Get('me')
getProfile(@CurrentUser() user: { userId: string; role: UserRole }) {
  return this.usersService.findById(user.userId);
}
```

### @Roles() + RolesGuard

```typescript
// apps/api/src/shared/decorators/roles.decorator.ts
import { SetMetadata } from "@nestjs/common";
import { UserRole } from "@repo/shared";
export const ROLES_KEY = "roles";
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);

// apps/api/src/shared/guards/roles.guard.ts
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!requiredRoles) return true;
    const { user } = context.switchToHttp().getRequest();
    return requiredRoles.includes(user.role);
  }
}
```

---

## Multer (File Uploads — NestJS)

```typescript
// apps/api/src/modules/uploads/uploads.controller.ts
import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { nanoid } from "nanoid";
import * as path from "path";

@Controller("uploads")
export class UploadsController {
  @Post("image")
  @UseInterceptors(
    FileInterceptor("file", {
      storage: diskStorage({
        destination: process.env.UPLOAD_DIR ?? "./uploads",
        filename: (_req, file, cb) => {
          const ext = path.extname(file.originalname);
          cb(null, `${nanoid()}-${Date.now()}${ext}`);
        },
      }),
      limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
      fileFilter: (_req, file, cb) => {
        const allowed = ["image/jpeg", "image/png", "image/webp"];
        if (!allowed.includes(file.mimetype)) {
          return cb(
            new BadRequestException("Only JPEG, PNG, WEBP allowed"),
            false,
          );
        }
        cb(null, true);
      },
    }),
  )
  uploadImage(@UploadedFile() file: Express.Multer.File) {
    if (!file) throw new BadRequestException("No file uploaded");
    return { url: `/uploads/${file.filename}` };
  }
}
```

---

## Lucide React (Icons)

```typescript
// All icons from lucide-react — import only what you use
import {
  Home,
  BookOpen,
  Building2,
  Users,
  ClipboardList,
  GraduationCap, // Sidebar nav
  RefreshCcw,
  Pencil,
  ArrowLeft,
  ChevronLeft,
  ChevronRight, // Detail page actions
  Search,
  Plus, // List page header
  Eye,
  EyeOff, // Password toggle
  CloudUpload, // File upload
  Moon,
  Sun, // Theme toggle
  Layers,
  BookMarked,
  School, // Stat card icons
} from "lucide-react";

// Standard sizes used in this project:
// Sidebar icons:          h-4 w-4  (16px)
// Action button icons:    h-4 w-4  (16px)
// Stat card icons:        h-5 w-5  (20px)
// Upload icon:            h-8 w-8  (32px) — rendered in orange
// Empty state icon:       h-10 w-10 (40px)
```

---

## Shared Type Interfaces (Frontend)

```typescript
// apps/web/src/shared/types/api.types.ts

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  meta: PaginationMeta;
}
```
