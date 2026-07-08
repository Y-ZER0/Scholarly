# Memory — Phase 8.3 + 8.4 Dashboard UI

Last updated: 2026-07-07

## What was built

**New files:**
- `apps/web/shared/ui/components/RankList.tsx` — numbered ranked list with "New" badge or green count badge
- `apps/web/features/dashboard/ui/UsersByRoleChart.tsx` — donut chart (PieChart, innerRadius=80, orange=student, blue=teacher)
- `apps/web/features/dashboard/ui/SubjectsPerDeptChart.tsx` — orange bar chart
- `apps/web/features/dashboard/ui/ClassesPerSubjectChart.tsx` — blue bar chart
- `apps/web/features/dashboard/ui/DashboardOverview.tsx` — 6 stat cards + donut chart + "New Classes/Teachers" summary cards
- `apps/web/features/dashboard/ui/DashboardInsights.tsx` — bar charts + 4 rank lists (newest classes, newest teachers, depts with most subjects, subjects with most classes)
- `apps/web/app/(protected)/page.tsx` — dashboard page composing Overview + Insights

**Modified files:**
- `apps/web/shared/ui/components/StatCard.tsx` — added `iconColor` prop for colored icons
- `context/ui-registry.md` — registered RankList, DashboardOverview, DashboardInsights, UsersByRoleChart, SubjectsPerDeptChart, ClassesPerSubjectChart
- `context/progress-tracker.md` — marked 8.3 ✅, 8.4 ✅, RankList ✅

## Decisions made

- **Dashboard types live in `@repo/shared`**: Response DTOs describe the API contract shared between API and frontend.
- **No mutations for dashboard**: Read-only summary data — no create/update/delete hooks.
- **StatCard icon colors match design exactly**: blue=Total Users, green=Teachers, orange=Admins, purple=Subjects, teal=Departments, rose=Classes.
- **Chart colors from `chart-colors.ts`**: All Recharts `fill` props use hex constants from the shared chart-colors file (never CSS variables).

## Current state

- Phase 8 complete: 8.1 ✅, 8.2 ✅, 8.3 ✅, 8.4 ✅
- Type-check clean (all 3 packages pass)
- Dashboard page is live at `/` (protected route)
- Backend: 3 endpoints (`GET /api/dashboard/{stats,charts,recent}`) — all `@Public()`
- Client: 3 service methods + 3 hooks (staleTime: 60_000)
- UI: Overview (6 stat cards + donut chart + summary cards) + Insights (2 bar charts + 4 rank lists)

## Next session starts with

**Phase 9: Theme & Polish:**
- 9.1 — Search & Filter Backend Audit (ensure all GET list endpoints support search/filters correctly)
- 9.2 — tweakcn Theme System Integration (theme picker component, 4 themes, ThemeContext wiring)
- 9.3 — Empty States, Loading States, Error States (confirm EmptyState on all tables, skeleton loading, ErrorBoundary)

## Open questions

- None.
