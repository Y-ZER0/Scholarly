# progress-tracker.md — ClassroomOS

> **Managed by the REMEMBER skill.** Updated at the end of every session.
> Never manually edit task status — always go through REMEMBER.
> Format: ✅ Complete | 🔄 In Progress | ⏳ Not Started | ❌ Blocked

---

## Phase 1: Foundation

| # | Task | Type | Status | Notes |
|---|------|------|--------|-------|
| 1.1 | Monorepo & Shared Package | LOGIC | ✅ | pnpm workspace + Turborepo + @repo/shared with enums/DTOs |
| 1.2 | NestJS Backend Bootstrap | LOGIC | ✅ | main.ts, app.module.ts, DatabaseModule (Supabase), AllExceptionsFilter, global ValidationPipe, CORS, /api prefix |
| 1.3 | File Upload Infrastructure | LOGIC | ✅ | UploadsModule with Multer + Supabase Storage, memoryStorage, image validation, public bucket |
| 1.4 | Next.js Bootstrap & Global Styles | UI | ✅ | shadcn/ui (base-nova), globals.css with HSL tokens, ThemeContext (data-theme), AppProviders, Inter font, all deps installed |
| 1.5 | Dashboard Shell Layout | UI | ✅ | SidebarContext, SidebarNav (240/60px collapsible), DashboardLayout, (protected)/layout.tsx, AppProviders updated |

---

## Phase 2: Authentication

| # | Task | Type | Status | Notes |
|---|------|------|--------|-------|
| 2.1 | Auth Backend Module (JWT + OAuth) | LOGIC | ✅ | User entity + UsersRepository/Service/Controller, AuthService with login/register/OAuth, JWT strategy, Google+GitHub strategies, JwtAuthGuard global, @Public/@Roles/@CurrentUser decorators, RolesGuard |
| 2.2 | Login Page | UI | ✅ | (auth)/layout.tsx + LoginForm.tsx + AuthIcons.tsx — centered card, email/password, show/hide toggle, remember me, forgot password link, Google/GitHub OAuth buttons, react-hook-form + Zod, shield logo SVG |
| 2.3 | Register Page | UI | ✅ | RegisterForm.tsx + /register/page.tsx — role selector (student/teacher), profile photo upload zone, name/email/password with validation, react-hook-form + Zod |
| 2.4 | Auth Client State (Context + Hooks) | LOGIC | ✅ | AuthContext, api-client, auth.service, useLogin/useRegister, AuthGuard, OAuthHandler, forgot/reset password pages |

---

## Phase 3: Departments Feature

| # | Task | Type | Status | Notes |
|---|------|------|--------|-------|
| 3.1 | Departments Backend | LOGIC | ✅ | Entity, Repository, Service, Controller, DTOs, Module registered in AppModule. CRUD + search + pagination. Admin-guarded mutations. Page/limit clamped to safe range. |
| 3.2 | Departments Client Logic | LOGIC | ✅ | department.service.ts (const-object pattern), departmentKeys.ts, 5 query hooks (useDepartments, useDepartment, useCreate, useUpdate, useDelete), request DTOs |
| 3.3 | Departments List Page | UI | ✅ | PageHeader, DataTable, CodeBadge, EmptyState created; DepartmentList built; route wired |
| 3.4 | Create Department Page | UI | ✅ | Breadcrumb, FormCard, CreateDepartmentForm created; route wired; sonner toast installed |
| 3.5 | Department Detail Page | UI | ✅ | DetailPageHeader, StatCard, StatusBadge, UserAvatar created; DepartmentDetail built; route wired; backend extended with related data queries |

---

## Phase 4: Subjects Feature

| # | Task | Type | Status | Notes |
|---|------|------|--------|-------|
| 4.1 | Subjects Backend | LOGIC | ✅ | Entity, Repository, Service, Controller, DTOs, Module. CRUD + search/pagination/departmentId filter. findById returns department + classes + teachers + students. Mutations guarded with ADMIN/TEACHER roles. |
| 4.2 | Subjects Client Logic | LOGIC | ✅ | subject.service.ts (const-object), subjectKeys.ts with departmentId, 5 hooks (useSubjects, useSubject, useCreateSubject, useUpdateSubject, useDeleteSubject), request DTOs |
| 4.3 | Subjects List Page | UI | ✅ | Breadcrumb, PageHeader with search + department filter, DataTable with Code/Name/Department/Description/View columns, DepartmentChip component |
| 4.4 | Create Subject Page | UI | ✅ | Breadcrumb, FormCard, department Select dropdown, code/name/description fields, react-hook-form + Zod, code auto-uppercase |
| 4.5 | Subject Detail Page | UI | ✅ | DetailPageHeader, Subject Overview card, Department card, Classes/Teachers/Students DataTables, subject-detail-columns.tsx |

---

## Phase 5: Faculty Feature

| # | Task | Type | Status | Notes |
|---|------|------|--------|-------|
| 5.1 | Faculty Backend | LOGIC | ✅ | FacultyModule, FacultyController, FacultyService, FacultyDetailDto. `GET /faculty` paginated+searchable, `GET /faculty/:id` with derived departments/subjects/classes. Reuses UsersService for list query. No new entity. |
| 5.2 | Faculty Client Logic | LOGIC | ✅ | faculty.service.ts (const-object), facultyKeys.ts, useFaculty.ts, useFacultyMember.ts. Read-only — no mutation hooks. Matches departments/subjects patterns. |
| 5.3 | Faculty List Page | UI | ✅ | FacultyList, faculty-list-columns, route page — Breadcrumb, PageHeader (search, no create), DataTable (Name/UserAvatar, Email, Role/StatusBadge, Details/ViewLink) |
| 5.4 | Faculty Detail Page | UI | ✅ | FacultyDetail, faculty-detail-columns, route page — Profile card, Departments/Subjects/Classes DataTables with subtitles |

---

## Phase 6: Classes Feature

| # | Task | Type | Status | Notes |
|---|------|------|--------|-------|
| 6.1 | Classes Backend | LOGIC | ✅ | Entity existed (stub). Created DTOs, Repository (paginated+filtered findAll, batch enrollment counts), Service (CRUD + nanoid(8) inviteCode via dynamic ESM import + toDto with enrollmentCount/spotsRemaining), Controller (standard CRUD). Updated Module. Type-check clean. |
| 6.2 | Classes Client Logic | LOGIC | ✅ | class.service.ts, classKeys.ts, 5 hooks (useClasses, useClass, useCreateClass, useUpdateClass, useDeleteClass), request DTOs, shared barrel re-export |
| 6.3 | Classes List Page | UI | ✅ | PageHeader with search + subject/teacher filter dropdowns, DataTable with Banner/Name/Status/Subject/Teacher/Capacity/Details columns, route wired |
| 6.4 | Create Class Page | UI | ✅ | FileUpload shared component, CreateClassForm with banner upload/name/subject+teacher grid/capacity+status grid/description, status field added to backend+frontend DTOs, route wired |
| 6.5 | Class Detail Page | UI | ✅ | ClassDetail, class-detail-columns, route wired; backend extended with subject.description + department; enrolled students table placeholder |

---

## Phase 7: Enrollment Feature

> **Design split**: Teacher manages their classes' enrollments (full CRUD). Student views their enrollments and browses active/available classes to join via invite code.
> The `/enrollments` route is role-gated — TeacherEnrollments or StudentEnrollments rendered based on `user.role`.

| # | Task | Type | Status | Notes |
|---|------|------|--------|-------|
| 7.1 | Enrollments Backend — Teacher Endpoints | LOGIC | ✅ | findAllByTeacherId, findByClassId, addStudent, removeEnrollment, getTeacherClasses. Teacher validates ownership of class before mutations. 10 repository methods, 4 service methods, 4 TEACHER-gated endpoints. All type-check clean. |
| 7.2 | Enrollments Backend — Student Endpoints | LOGIC | ✅ | joinByCode (inviteCode → validate active/capacity/duplicate), findMyEnrollments, unenroll. ClassesController addition: GET /classes/available (active + open spots, subquery excludes enrolled). |
| 7.3 | Enrollments Client Logic — Teacher | LOGIC | ✅ | 4 hooks (useTeacherEnrollments, useTeacherClasses, useAddStudent, useRemoveEnrollment) + enrollmentKeys with teacher prefix + enrollment.service teacher methods + dtos (AddStudentRequestDto, TeacherEnrollmentDto). Build-clean. |
| 7.4 | Enrollments Client Logic — Student | LOGIC | ✅ | 3 hooks (useMyEnrollments, useJoinClass, useUnenroll) + student prefix in enrollmentKeys + enrollment.service student methods. Available classes via class.service.getAvailableClasses + classKeys.availableList + useAvailableClasses hook. Build-clean. |
| 7.5 | Teacher Enrollment Management Page | UI | ✅ | Route: /enrollments (role-gated). TeacherEnrollments, AddStudentDialog, enrollment-list-columns, Remove confirmation dialog. Type-check clean. |
| 7.6 | Student Enrollments & Available Classes Pages | UI | ✅ | StudentEnrollments (My Enrollments, Browse Classes link, unenroll with confirmation). AvailableClasses (search, DataTable with class/subject/teacher/spots/status, View Details → /classes/[id]). Route /classes/available created. Enrollments page updated to render StudentEnrollments for students. Type-check clean. |
| 7.7 | Class Detail — Role-based Join & Enrolled Students | UI | ✅ | Backend: GET /enrollments/class/:classId endpoint. Frontend: useClassEnrollments hook + enrollmentKeys.classEnrollments. ClassDetail: teacher hides Join section, student not enrolled shows invite code input + green Join button, student enrolled shows "✓ You are enrolled" status. Enrolled Students DataTable wired to real API data. Type-check clean. |

---

## Phase 8: Dashboard Feature

| # | Task | Type | Status | Notes |
|---|------|------|--------|-------|
| 8.1 | Dashboard Backend | LOGIC | ✅ | DashboardModule + 3 @Public() endpoints under /api/dashboard: stats (7 count queries), charts (3 aggregation queries via createQueryBuilder), recent (newest 5 classes/teachers + top 5 depts/subjects). No repository layer — service injects User/Department/Subject/Class/Enrollment repositories directly using existing entities. Type-check clean. |
| 8.2 | Dashboard Client Logic | LOGIC | ✅ | dashboard.service.ts (object pattern with getStats/getCharts/getRecent), dashboardKeys.ts (stats/charts/recent key factory), 3 hooks (useDashboardStats, useDashboardCharts, useDashboardRecent) with staleTime: 60_000, DashboardStatsDto/DashboardChartsDto/DashboardRecentDto added to @repo/shared. Type-check clean. |
| 8.3 | Dashboard Overview Section | UI | ✅ | StatCard (iconColor), UsersByRoleChart (donut), DashboardOverview, (protected)/page.tsx route |
| 8.4 | Dashboard Insights Section | UI | ✅ | RankList, SubjectsPerDeptChart, ClassesPerSubjectChart, DashboardInsights |

---

## Phase 9: Theme & Polish

| # | Task | Type | Status | Notes |
|---|------|------|--------|-------|
| 9.1 | Search & Filter Backend Audit | LOGIC | ⏳ | |
| 9.2 | tweakcn Theme System Integration | UI | ⏳ | |
| 9.3 | Empty States, Loading, Error States | UI | ⏳ | |

---

## UI Component Registry Status

Track which shared components from `ui-registry.md` have been built:

| Component | Path | Status |
|-----------|------|--------|
| DashboardLayout | `shared/ui/layouts/DashboardLayout.tsx` | ✅ |
| SidebarNav | `shared/ui/layouts/SidebarNav.tsx` | ✅ |
| PageHeader | `shared/ui/components/PageHeader.tsx` | ✅ |
| DetailPageHeader | `shared/ui/components/DetailPageHeader.tsx` | ✅ |
| Breadcrumb | `shared/ui/components/Breadcrumb.tsx` | ✅ |
| DataTable | `shared/ui/components/DataTable.tsx` | ✅ |
| StatCard | `shared/ui/components/StatCard.tsx` | ✅ |
| RankList | `shared/ui/components/RankList.tsx` | ✅ |
| EmptyState | `shared/ui/components/EmptyState.tsx` | ✅ |
| LoadingSpinner | `shared/ui/components/LoadingSpinner.tsx` | ⏳ |
| CodeBadge | `shared/ui/components/CodeBadge.tsx` | ✅ |
| StatusBadge | `shared/ui/components/StatusBadge.tsx` | ✅ |
| DepartmentChip | `shared/ui/components/DepartmentChip.tsx` | ⏳ |
| FormCard | `shared/ui/components/FormCard.tsx` | ✅ |
| FileUpload | `shared/ui/components/FileUpload.tsx` | ⏳ |
| UserAvatar | `shared/ui/components/UserAvatar.tsx` | ✅ |

---

## Architectural Decisions Log

> Add entries here when a decision is made during a session that is NOT already covered by the context files.

| Decision | Rationale | Phase | Date |
|----------|-----------|-------|------|
| inviteCode generated via `nanoid(8)` on class creation | Short, URL-safe, 8-char codes are human-shareable and have negligible collision probability at this scale | 6.1 | — |
| Faculty is not a separate entity — it's `users WHERE role='teacher'` | Avoids duplicating user data; a separate FacultyProfile entity can be added later if bios/office hours are needed | 5.1 | — |
| Enrollment unique constraint enforced at DB level AND service level | DB constraint is the hard safety net; service check provides a user-friendly error message before hitting the DB | 7.1 / 7.2 | — |
| `/enrollments` route is role-gated — TeacherEnrollments vs StudentEnrollments | Single sidebar link, but Teacher and Student have completely different views and actions on enrollments. Role-gating avoids route duplication. | 7.5 / 7.6 | 2026-07-06 |
| Available classes (`/classes/available`) is a separate endpoint from the full classes list | Students should only see active classes with open spots — the full list includes inactive classes and is the teacher/admin management view | 7.6 | 2026-07-06 |
| `GET /api/classes/:id/enrollments` for enrolled students on class detail | Keeps class detail endpoint lightweight; paginated enrollment list is fetched separately when the user views the detail page | 7.7 | 2026-07-06 |
| Dashboard endpoints are NOT paginated | Dashboard is a summary view — all data is top-N and aggregate counts, never full lists | 8.1 | — |
| Create Class as a full page (`/classes/create`), not a modal | Banner image upload needs full-width space and the form is large enough to warrant its own route | 6.4 | — |
| tweakcn themes stored as `data-theme` attribute on `<html>` | Matches tweakcn's generated CSS selector pattern `[data-theme="dark"]` | 9.2 | — |
| Supabase Storage over local disk for file uploads | Production readiness — persists across redeploys, CDN-cached, no disk space concerns. Public bucket for simplicity (class banners/profile photos are not sensitive). | 1.3 | 2026-06-30 |

---

## Session Log

> One entry per work session. Updated by REMEMBER at session end.

| Session # | Date | Agent | Tasks Completed | Tasks In Progress | Issues Encountered | Key Decisions |
|-----------|------|-------|----------------|-------------------|-------------------|---------------|
| 1 | 2026-06-29 | DeepSeek | 1.1 Monorepo & Shared Package | — | — | Keep Next.js 16, migrate existing files, pnpm over npm |
| 2 | 2026-06-30 | DeepSeek | 1.2 NestJS Backend Bootstrap | — | — | Manual scaffold (not nest new), Supabase as pure PG host (no RLS) |
| 3 | 2026-06-30 | DeepSeek | 1.3 File Upload Infrastructure | — | — | Supabase Storage over local disk for production readiness |
| 4 | 2026-06-30 | Mimo | 1.4 Next.js Bootstrap & Global Styles | — | — | shadcn v4 uses base-nova (not New York), HSL tokens via data-theme attr, tweakcn npm is irrelevant (CSS themes in globals.css) |
| 5 | 2026-06-30 | Mimo | 1.5 Dashboard Shell Layout | — | — | Sidebar collapse via SidebarContext (not URL params), AuthGuard placeholder in (protected)/layout.tsx |
| 6 | 2026-07-01 | DeepSeek | 2.1 Auth Backend Module | — | — | Separate UsersModule + AuthModule; OAuth redirects direct to frontend FRONTEND_URL/login?token=; uploads endpoint @Public() for Register page |
| 7 | 2026-07-02 | DeepSeek | 2.5 Forgot/Reset Password pages | — | — | Forgot password success is intentionally vague (prevents email enumeration); reset password auto-redirects to /login after 2s |
| 8 | 2026-07-02 | Mimo | 3.3 Departments List Page | — | — | Created shared UI components (PageHeader, DataTable, CodeBadge, EmptyState); DataTable uses generic ColumnDef pattern; DepartmentList owns pagination state |
| 9 | 2026-07-03 | DeepSeek | 4.1 Subjects Backend, 4.2 Subjects Client Logic | — | — | Subject mutations allow ADMIN and TEACHER (not ADMIN-only like Departments); client logic follows const-object service pattern matching departments exactly |
| 10 | 2026-07-05 | Mimo | 5.3 Faculty List Page, 5.4 Faculty Detail Page | — | — | Faculty list has no create button (teachers self-register); Faculty detail uses Profile card + Departments/Subjects/Classes sections with subtitle text per design |
| 11 | 2026-07-06 | DeepSeek | 6.1 Classes Backend | — | nanoid v5 ESM-only, API uses CommonJS — solved with dynamic import | enrollmentCount batch-loaded via GROUP BY; nanoid imported dynamically; inviteCode never user-provided; status defaults to ACTIVE |
| 12 | 2026-07-06 | DeepSeek | 6.2 Classes Client Logic | — | — | Followed established const-object/hook patterns from departments/subjects — no new decisions needed |
| 13 | 2026-07-06 | Mimo | 6.3 Classes List Page | — | — | Reuses existing shared components (DepartmentChip for subject, StatusBadge for status); two filter dropdowns (subjects + teachers) use cross-feature hooks |
| 14 | 2026-07-06 | Mimo | 6.5 Class Detail Page | — | — | Extended ClassDto with subject.description and department; backend loads subject.department relation; enrolled students table placeholder for Phase 7 |
| 15 | 2026-07-06 | DeepSeek | 7.2 Enrollments Backend — Student Endpoints | — | — | Student routes in same controller after teacher routes (Express static segments match before param routes); available classes uses subquery to exclude enrolled; joinByCode validation: inviteCode → ACTIVE → capacity → duplicate; @Roles(STUDENT) enforced |
| 16 | 2026-07-06 | DeepSeek | 7.3 Enrollments Client Logic — Teacher, 7.4 Enrollments Client Logic — Student | — | — | Teacher and student hooks share same enrollmentKeys with separate prefixes (teacherLists/studentLists). Role-gated via useAuth() + enabled option. Available classes hook lives on classKeys (cross-feature). |
| 17 | 2026-07-06 | Mimo | 7.5 Teacher Enrollment Management Page | — | — | AddStudentDialog embedded in filter bar (not dedicated page); Remove uses confirmation dialog; role-gated page routes teacher→TeacherEnrollments, student→placeholder |
| 18 | 2026-07-06 | Mimo | 7.6 Student Enrollments & Available Classes Pages | — | — | StudentEnrollments uses useMyEnrollments + useUnenroll with confirmation dialog; "Browse Classes" outline button in filters slot; AvailableClasses uses useAvailableClasses with search; both follow established DataTable patterns; new /classes/available route |
| 19 | 2026-07-07 | Mimo | 7.7 Class Detail Role-based Join & Enrolled Students | — | — | Backend: GET /enrollments/class/:classId (no role guard — both teacher/student need enrolled list). ClassDetail: role-gated Join section (teacher=hide, student not enrolled=invite code input, student enrolled=status badge). useMyEnrollments with high limit for enrollment check. useClassEnrollments for enrolled students DataTable. |
| 20 | 2026-07-07 | DeepSeek | 8.1 Dashboard Backend | — | — | Dashboard endpoints are @Public() (no auth — MVP). No repository layer — service directly injects entity repos. stats uses 7 parallel count() queries. charts uses createQueryBuilder with relation joins + GROUP BY. recent uses find() for newest + cross-entity aggregation queries for top-N lists. Enrollment count for newestClasses uses batch query matching existing pattern. |

---

## Known Issues & Blockers

> Track anything that could block future tasks. Clear these when resolved.

| Issue | Affects | Severity | Status |
|-------|---------|----------|--------|
| — | — | — | — |

---

## Environment Checklist

Verify these are set up before starting each phase:

- [ ] PostgreSQL running locally on port 5432
- [ ] `classroomos` database created
- [x] `.env` in `apps/api` with all required variables (template created — user fills in values)
- [ ] `.env.local` in `apps/web` with `NEXT_PUBLIC_API_URL`
- [x] `pnpm install` run from root
- [x] `scholarly-uploads` bucket created in Supabase Storage (public bucket)
- [ ] `SUPABASE_SERVICE_ROLE_KEY` set in `apps/api/.env` (get from Supabase Dashboard → API)
- [ ] Google OAuth credentials configured (for Phase 2.1)
- [ ] GitHub OAuth credentials configured (for Phase 2.1)
