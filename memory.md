# Memory — Dashboard Shell Layout (1.5)

Last updated: 2026-06-30

## What was built

- **`shared/context/SidebarContext.tsx`** — `isOpen`, `toggle`, `close` state for sidebar collapse. Global via SidebarProvider in AppProviders.
- **`shared/ui/layouts/SidebarNav.tsx`** — 240px/60px collapsible sidebar. 6 nav items: Home (house), Subjects (book), Departments (building), Faculty (users), Enrollments (clipboard), Classes (graduation-cap). Active route highlighting via `usePathname`. Logo area + collapse toggle.
- **`shared/ui/layouts/DashboardLayout.tsx`** — flex shell: sidebar + scrollable main content. Top-right: theme toggle (cycles through 4 themes) + user avatar placeholder.
- **`app/(protected)/layout.tsx`** — wraps children in DashboardLayout. **AuthGuard not wired yet** — placeholder only.
- **`shared/context/AppProviders.tsx`** — updated to include `SidebarProvider` wrapper.

## Decisions made

- **Sidebar collapse uses context, not URL params** — sidebar state is global UI, not route-specific. `SidebarContext` wraps the entire app.
- **(protected)/layout.tsx is a thin wrapper** — just imports DashboardLayout. AuthGuard will be added in task 2.4 when AuthContext is built.
- **Theme toggle cycles through all 4 themes** — simple click cycles: dark → light → dark-blue → dark-purple → dark. No dropdown needed for now.

## Current state

- Task 1.5 complete — dashboard shell layout with sidebar, topbar controls, and route structure ready
- Dev server starts clean, build passes, type-check clean
- No feature components built yet — only the bootstrap infrastructure
- Sidebar is always rendered (no hamburger overlay on desktop per ui-rules)
- Nav items route to placeholder pages (no page.tsx files in (protected) yet)

## Build plan sequence — next tasks in order

**2.1 `[LOGIC]` Auth Backend Module** — User entity, JWT strategy, login/register endpoints, OAuth (Google + GitHub).

## Open questions

- None
