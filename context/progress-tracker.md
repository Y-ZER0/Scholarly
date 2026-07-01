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
| 2.4 | Auth Client State (Context + Hooks) | LOGIC | ⏳ | |

---

## Phase 3: Departments Feature

| # | Task | Type | Status | Notes |
|---|------|------|--------|-------|
| 3.1 | Departments Backend | LOGIC | ⏳ | |
| 3.2 | Departments Client Logic | LOGIC | ⏳ | |
| 3.3 | Departments List Page | UI | ⏳ | |
| 3.4 | Create Department Page | UI | ⏳ | |
| 3.5 | Department Detail Page | UI | ⏳ | |

---

## Phase 4: Subjects Feature

| # | Task | Type | Status | Notes |
|---|------|------|--------|-------|
| 4.1 | Subjects Backend | LOGIC | ⏳ | |
| 4.2 | Subjects Client Logic | LOGIC | ⏳ | |
| 4.3 | Subjects List Page | UI | ⏳ | |
| 4.4 | Create Subject Page | UI | ⏳ | |
| 4.5 | Subject Detail Page | UI | ⏳ | |

---

## Phase 5: Faculty Feature

| # | Task | Type | Status | Notes |
|---|------|------|--------|-------|
| 5.1 | Faculty Backend | LOGIC | ⏳ | |
| 5.2 | Faculty Client Logic | LOGIC | ⏳ | |
| 5.3 | Faculty List Page | UI | ⏳ | |
| 5.4 | Faculty Detail Page | UI | ⏳ | |

---

## Phase 6: Classes Feature

| # | Task | Type | Status | Notes |
|---|------|------|--------|-------|
| 6.1 | Classes Backend | LOGIC | ⏳ | |
| 6.2 | Classes Client Logic | LOGIC | ⏳ | |
| 6.3 | Classes List Page | UI | ⏳ | |
| 6.4 | Create Class Page | UI | ⏳ | |
| 6.5 | Class Detail Page | UI | ⏳ | |

---

## Phase 7: Enrollments Feature

| # | Task | Type | Status | Notes |
|---|------|------|--------|-------|
| 7.1 | Enrollments Backend | LOGIC | ⏳ | |
| 7.2 | Enrollments Client Logic | LOGIC | ⏳ | |
| 7.3 | Enrollments Page | UI | ⏳ | |
| 7.4 | Join Class Modal | UI | ⏳ | |

---

## Phase 8: Dashboard Feature

| # | Task | Type | Status | Notes |
|---|------|------|--------|-------|
| 8.1 | Dashboard Backend | LOGIC | ⏳ | |
| 8.2 | Dashboard Client Logic | LOGIC | ⏳ | |
| 8.3 | Dashboard Overview Section | UI | ⏳ | |
| 8.4 | Dashboard Insights Section | UI | ⏳ | |

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
| PageHeader | `shared/ui/components/PageHeader.tsx` | ⏳ |
| DetailPageHeader | `shared/ui/components/DetailPageHeader.tsx` | ⏳ |
| Breadcrumb | `shared/ui/components/Breadcrumb.tsx` | ⏳ |
| DataTable | `shared/ui/components/DataTable.tsx` | ⏳ |
| StatCard | `shared/ui/components/StatCard.tsx` | ⏳ |
| RankList | `shared/ui/components/RankList.tsx` | ⏳ |
| EmptyState | `shared/ui/components/EmptyState.tsx` | ⏳ |
| LoadingSpinner | `shared/ui/components/LoadingSpinner.tsx` | ⏳ |
| CodeBadge | `shared/ui/components/CodeBadge.tsx` | ⏳ |
| StatusBadge | `shared/ui/components/StatusBadge.tsx` | ⏳ |
| DepartmentChip | `shared/ui/components/DepartmentChip.tsx` | ⏳ |
| FormCard | `shared/ui/components/FormCard.tsx` | ⏳ |
| FileUpload | `shared/ui/components/FileUpload.tsx` | ⏳ |
| UserAvatar | `shared/ui/components/UserAvatar.tsx` | ⏳ |

---

## Architectural Decisions Log

> Add entries here when a decision is made during a session that is NOT already covered by the context files.

| Decision | Rationale | Phase | Date |
|----------|-----------|-------|------|
| inviteCode generated via `nanoid(8)` on class creation | Short, URL-safe, 8-char codes are human-shareable and have negligible collision probability at this scale | 6.1 | — |
| Faculty is not a separate entity — it's `users WHERE role='teacher'` | Avoids duplicating user data; a separate FacultyProfile entity can be added later if bios/office hours are needed | 5.1 | — |
| Enrollment unique constraint enforced at DB level AND service level | DB constraint is the hard safety net; service check provides a user-friendly error message before hitting the DB | 7.1 | — |
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
