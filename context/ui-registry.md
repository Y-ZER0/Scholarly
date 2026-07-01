# ui-registry.md — ClassroomOS

> **Mimo reads this before building any UI.** Check here first — if a component exists, use it.
> Never recreate what is already here. After building a new reusable component, register it below.
> Classes documented here are the canonical, approved implementations — do not deviate without updating this file.

---

## Layout Components

---

### `DashboardLayout`
**Path:** `shared/ui/layouts/DashboardLayout.tsx`  
**Created:** 2026-06-30  
**Purpose:** Root wrapper for all protected pages. Renders sidebar left + scrollable main content right + topbar controls.

```typescript
interface DashboardLayoutProps {
  children: ReactNode;
}
```

**Structure & Classes:**
```
<div className="flex h-screen bg-background">
  <SidebarNav />
  <main className="flex-1 overflow-y-auto">
    {/* Topbar — floating top-right */}
    <div className="flex items-center justify-end gap-2 px-8 py-4">
      <button className="inline-flex size-9 items-center justify-center rounded-lg
                         text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
        {/* Moon or Sun icon, h-4 w-4 */}
      </button>
      <div className="flex size-8 items-center justify-center rounded-full bg-primary
                      text-xs font-bold text-primary-foreground">
        U
      </div>
    </div>
    {/* Page content */}
    <div className="px-8 py-6">{children}</div>
  </main>
</div>
```

**Rules:**
- `overflow-y-auto` on `<main>` enables per-page scroll within the content area
- Topbar controls (theme toggle + avatar) sit inside `<main>`, not a separate bar
- Page-level padding is `px-8 py-6` applied to the children wrapper div
- Theme toggle cycles through dark → light → dark-blue → dark-purple

---

### `SidebarNav`
**Path:** `shared/ui/layouts/SidebarNav.tsx`  
**Created:** 2026-06-30  
**Purpose:** Left sidebar with app logo, navigation items, and collapse toggle. Reads SidebarContext for open/closed state.

```typescript
// No props — reads router path for active state, reads SidebarContext for open/closed
```

**Structure & Classes:**
```
<aside role="navigation"
       className="flex h-screen flex-col border-r border-border bg-card
                  transition-all duration-200"
       style: width toggles between w-[240px] and w-[60px]>

  {/* Logo bar */}
  <div className="flex items-center justify-between px-4 py-4">
    {isOpen && <span className="text-sm font-semibold text-foreground">Scholarly</span>}
    <button className="ml-auto inline-flex size-8 shrink-0 items-center justify-center
                       rounded-lg text-muted-foreground transition-colors
                       hover:bg-muted hover:text-foreground">
      <PanelLeftClose className="h-4 w-4" />  {/* or PanelLeft when collapsed */}
    </button>
  </div>

  {/* Nav list */}
  <nav className="flex-1 space-y-1 px-3 py-4">
    {navItems.map(item => (
      <Link key={item.href} href={item.href}
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-normal
                       transition-colors">
        <item.icon className="h-4 w-4 shrink-0" />
        {isOpen && <span>{item.label}</span>}
      </Link>
    ))}
  </nav>
</aside>
```

**NavItem Classes:**
```
// Active
"flex items-center gap-3 px-3 py-2.5 rounded-lg bg-primary text-white text-sm font-normal"

// Inactive
"flex items-center gap-3 px-3 py-2.5 rounded-lg text-muted-foreground text-sm font-normal
 hover:bg-muted/40 hover:text-foreground transition-colors"
```

**Nav Items Array:**
```typescript
const NAV_ITEMS = [
  { label: 'Home',        href: '/',            icon: Home },
  { label: 'Subjects',    href: '/subjects',    icon: BookOpen },
  { label: 'Departments', href: '/departments', icon: Building2 },
  { label: 'Faculty',     href: '/faculty',     icon: Users },
  { label: 'Enrollments', href: '/enrollments', icon: ClipboardList },
  { label: 'Classes',     href: '/classes',     icon: GraduationCap },
];
```

**Collapse Behavior:**
- Expanded: `w-[240px]` — shows icon + label for each nav item
- Collapsed: `w-[60px]` — shows icon only, labels hidden
- Toggle button changes between `PanelLeftClose` and `PanelLeft` icons
- State managed by `SidebarContext` (isOpen, toggle, close)

---

## Page-Level Components

---

### `PageHeader`
**Path:** `src/shared/ui/components/PageHeader.tsx`  
**Created:** ⏳  
**Purpose:** Top section on all list pages. Contains title, description, optional search, optional filters, optional create button.

```typescript
interface PageHeaderProps {
  title:             string;
  description:       string;
  searchPlaceholder?: string;
  onSearch?:          (value: string) => void;
  filters?:           ReactNode;         // Pass Select dropdowns for Subject/Dept filters
  createHref?:        string;            // Routes to create page
  createLabel?:       string;            // Default: "+ Create"
}
```

**Structure & Classes:**
```
<div className="mb-6">
  {/* Row 1: title + controls */}
  <div className="flex items-start justify-between">
    <div>
      <h1 className="text-3xl font-bold text-foreground">{title}</h1>
      <p className="mt-1 text-sm text-muted-foreground">{description}</p>
    </div>
    <div className="flex items-center gap-2 mt-1">
      {searchPlaceholder && (
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={searchPlaceholder}
            className="pl-8 h-9 w-[200px] bg-muted border-border"
            onChange={(e) => onSearch?.(e.target.value)}
          />
        </div>
      )}
      {filters}
      {createHref && (
        <Link href={createHref}>
          <Button className="h-9 gap-1.5">
            <Plus className="h-4 w-4" /> {createLabel ?? 'Create'}
          </Button>
        </Link>
      )}
    </div>
  </div>
</div>
```

---

### `DetailPageHeader`
**Path:** `src/shared/ui/components/DetailPageHeader.tsx`  
**Created:** ⏳  
**Purpose:** Header for all detail pages (`/subjects/[id]`, `/departments/[id]`, etc.).

```typescript
interface DetailPageHeaderProps {
  title:      string;
  onBack?:    () => void;       // if undefined, uses router.back()
  onRefresh?: () => void;       // calls refetch on the detail query
  editHref?:  string;           // link to edit page/modal
}
```

**Structure & Classes:**
```
<div className="flex items-center justify-between mb-6">
  <div className="flex items-center gap-3">
    <button
      onClick={handleBack}
      className="text-muted-foreground hover:text-foreground transition-colors"
    >
      <ArrowLeft className="h-5 w-5" />
    </button>
    <h1 className="text-2xl font-bold text-foreground">{title}</h1>
  </div>
  <div className="flex items-center gap-4">
    {onRefresh && (
      <button
        onClick={onRefresh}
        className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <RefreshCcw className="h-4 w-4" /> Refresh
      </button>
    )}
    {editHref && (
      <Link
        href={editHref}
        className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <Pencil className="h-4 w-4" /> Edit
      </Link>
    )}
  </div>
</div>
```

---

### `Breadcrumb`
**Path:** `src/shared/ui/components/Breadcrumb.tsx`  
**Created:** ⏳  
**Purpose:** Breadcrumb trail shown at top of detail pages and create pages.

```typescript
interface BreadcrumbItem { label: string; href?: string; }
interface BreadcrumbProps { items: BreadcrumbItem[]; }
```

**Structure & Classes:**
```
<nav className="flex items-center gap-1.5 text-sm text-muted-foreground mb-4">
  <Home className="h-3.5 w-3.5" />
  {items.map((item, i) => (
    <Fragment key={i}>
      <ChevronRight className="h-3.5 w-3.5" />
      {item.href
        ? <Link href={item.href} className="hover:text-foreground transition-colors">{item.label}</Link>
        : <span className="text-foreground">{item.label}</span>
      }
    </Fragment>
  ))}
</nav>
```

---

## Data Display Components

---

### `DataTable`
**Path:** `src/shared/ui/components/DataTable.tsx`  
**Created:** ⏳  
**Purpose:** Universal paginated data table. Used on EVERY list page and detail sub-table. Do not build ad-hoc tables — always use this.

```typescript
interface DataTableProps<T> {
  columns:           ColumnDef<T>[];    // TanStack Table column definitions
  data:              T[];
  isLoading?:        boolean;           // shows skeleton rows
  isError?:          boolean;           // shows error message row
  emptyMessage?:     string;            // overrides default EmptyState text
  totalCount?:       number;            // for pagination display
  page?:             number;
  pageSize?:         number;
  totalPages?:       number;
  onPageChange?:     (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  showPagination?:   boolean;           // default: true
}
```

**Classes:**
```
Container:      "w-full rounded-lg border border-border overflow-hidden"
Table:          "w-full"
Header row:     "border-b border-border bg-transparent"
Header cell:    "px-4 py-3 text-left text-sm font-medium text-muted-foreground"
Body row:       "border-b border-border hover:bg-muted/10 transition-colors last:border-0"
Body cell:      "px-4 py-3.5 text-sm text-foreground"
Pagination bar: "flex items-center justify-end gap-3 px-4 py-3 border-t border-border"
Page info text: "text-sm text-muted-foreground"
Page btn:       "h-8 w-8 p-0" (outline variant, disabled when at boundary)
Rows per page:  <Select> with options 10/25/50, "text-sm"
```

**Skeleton Loading State (3 rows minimum):**
```
<TableRow>
  {columns.map((_, i) => (
    <TableCell key={i}>
      <div className="h-4 bg-muted/50 rounded animate-pulse" style={{ width: '80%' }} />
    </TableCell>
  ))}
</TableRow>
```

**Empty State:** Renders `<EmptyState />` spanning all columns when `data.length === 0` and not loading.

**Count Badge (detail sub-tables):**
- A `<span className="text-xs font-medium bg-muted text-muted-foreground px-2 py-0.5 rounded">N</span>` placed to the right of the section heading by the parent component, not DataTable itself.

---

### `StatCard`
**Path:** `src/shared/ui/components/StatCard.tsx`  
**Created:** ⏳  
**Purpose:** Metric card for dashboard overview and department/subject detail pages.

```typescript
interface StatCardProps {
  label:      string;
  value:      number | string;
  icon:       ReactNode;
  iconColor?: string;   // Tailwind text color class, e.g. "text-blue-400"
}
```

**Classes:**
```
Outer:  "flex items-center justify-between p-4 border border-border rounded-lg bg-card"
Left:   "flex flex-col gap-0.5"
Label:  "text-xs text-muted-foreground uppercase tracking-wide font-medium"
Value:  "text-2xl font-bold text-foreground"
Icon:   "h-5 w-5 {iconColor}"
```

**Icon Color Map (Dashboard):**
```typescript
const ICON_COLORS: Record<string, string> = {
  'Total Users': 'text-blue-400',
  'Teachers':    'text-primary',       // green
  'Admins':      'text-orange-400',
  'Subjects':    'text-purple-400',
  'Departments': 'text-teal-400',
  'Classes':     'text-rose-400',
};
```

---

### `RankList`
**Path:** `src/shared/ui/components/RankList.tsx`  
**Created:** ⏳  
**Purpose:** Numbered ranked list for dashboard sections. Supports "New" badge or green count badge.

```typescript
interface RankItem {
  rank:        number;
  title:       string;
  subtitle:    string;
  newBadge?:   boolean;   // renders grey "New" pill
  countBadge?: number;    // renders green count pill
}

interface RankListProps {
  title: string;
  items: RankItem[];
}
```

**Classes:**
```
Container:    "bg-card border border-border rounded-lg p-5"
Heading:      "text-base font-semibold text-foreground mb-4"
Item row:     "flex items-center gap-3 py-2.5 border-b border-border/40 last:border-0"
Rank number:  "text-xs text-muted-foreground w-6 shrink-0 font-medium"
Text block:   "flex-1 min-w-0"
Title:        "text-sm font-medium text-foreground truncate"
Subtitle:     "text-xs text-muted-foreground truncate"
"New" badge:  "text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded shrink-0"
Count badge:  "text-xs bg-primary text-white px-2.5 py-0.5 rounded font-semibold shrink-0"
```

---

### `EmptyState`
**Path:** `src/shared/ui/components/EmptyState.tsx`  
**Created:** ⏳  
**Purpose:** Empty table/section placeholder. Spans full table width via `colSpan`.

```typescript
interface EmptyStateProps {
  message?:  string;   // default: "No data to display"
  subtitle?: string;   // default: "This table is empty for the time being."
}
```

**Classes:**
```
Container:  "flex flex-col items-center justify-center py-12 text-center w-full"
Message:    "text-base font-semibold text-foreground"
Subtitle:   "mt-1 text-sm text-muted-foreground"
```

---

### `LoadingSpinner`
**Path:** `src/shared/ui/components/LoadingSpinner.tsx`  
**Created:** ⏳  
**Purpose:** Full-section loading indicator. Used as page-level fallback before DataTable renders.

```typescript
interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
}
```

**Classes:**
```
sm: "h-4 w-4 border-2"
md: "h-6 w-6 border-2"    ← default
lg: "h-8 w-8 border-[3px]"

Spinner div: "animate-spin rounded-full border-muted border-t-primary"
Wrapper:     "flex items-center justify-center py-12"
```

---

## Badge & Chip Components

---

### `CodeBadge`
**Path:** `src/shared/ui/components/CodeBadge.tsx`  
**Created:** ⏳  
**Purpose:** Green filled badge for entity codes. Used for department codes (BIO, CS, MATH, BUS) and subject codes (CS101, BUS301, BIO101).

```typescript
interface CodeBadgeProps {
  code: string;
  size?: 'sm' | 'md';   // default: 'md'
}
```

**Classes:**
```
sm:  "inline-flex items-center px-2 py-0.5 text-xs font-bold bg-primary text-white rounded"
md:  "inline-flex items-center px-3 py-1 text-sm font-bold bg-primary text-white rounded-md"
```

**Examples from designs:**
- `BIO`, `MATH`, `CS`, `BUS` → use `md`
- `BIO101`, `CS401`, `MATH201`, `BUS301` → use `md`
- Codes inside compact table sub-rows → use `sm`

---

### `StatusBadge`
**Path:** `src/shared/ui/components/StatusBadge.tsx`  
**Created:** ⏳  
**Purpose:** Status and role indicator. Subtle bordered pill — not solid fill.

```typescript
type StatusVariant = 'active' | 'inactive' | 'teacher' | 'student' | 'admin';

interface StatusBadgeProps {
  status: StatusVariant;
}
```

**Classes per variant:**
```typescript
const variants: Record<StatusVariant, string> = {
  active:   "text-xs font-medium px-2.5 py-0.5 rounded-full bg-primary/15 text-primary border border-primary/30",
  teacher:  "text-xs font-medium px-2.5 py-0.5 rounded-full bg-primary/15 text-primary border border-primary/30",
  student:  "text-xs font-medium px-2.5 py-0.5 rounded-full bg-blue-500/15 text-blue-400 border border-blue-500/30",
  admin:    "text-xs font-medium px-2.5 py-0.5 rounded-full bg-orange-500/15 text-orange-400 border border-orange-500/30",
  inactive: "text-xs font-medium px-2.5 py-0.5 rounded-full bg-muted text-muted-foreground border border-border",
};
```

---

### `DepartmentChip`
**Path:** `src/shared/ui/components/DepartmentChip.tsx`  
**Created:** ⏳  
**Purpose:** Gray rounded chip for department or subject names inside table cells. Not for codes — that's `CodeBadge`.

```typescript
interface DepartmentChipProps {
  label: string;
}
```

**Classes:**
```
"inline-flex items-center px-3 py-1 text-xs bg-muted text-muted-foreground rounded-md font-medium"
```

**Examples from designs:**
- "Computer Science", "Mathematics", "Biology", "Finance Basics", "Intro to Business"
- Used in Subjects list → Department column; Classes list → Subject column

---

## Form Components

---

### `FormCard`
**Path:** `src/shared/ui/components/FormCard.tsx`  
**Created:** ⏳  
**Purpose:** Wrapper for all create/edit forms. Centers the form card and provides consistent card styling.

```typescript
interface FormCardProps {
  title?:    string;       // default: "Fill out form"
  children:  ReactNode;
  maxWidth?: string;       // default: "max-w-2xl"
}
```

**Structure & Classes:**
```
<div className="mx-auto {maxWidth}">
  <div className="bg-card border border-border rounded-xl p-8">
    <h2 className="text-xl font-bold text-foreground mb-6">{title ?? 'Fill out form'}</h2>
    <div className="space-y-5">
      {children}
    </div>
  </div>
</div>
```

---

### `FileUpload`
**Path:** `src/shared/ui/components/FileUpload.tsx`  
**Created:** ⏳  
**Purpose:** Image upload zone with preview. Used for Banner Image (Create Class) and Profile Photo (Register). Handles uploading to backend internally.

```typescript
interface FileUploadProps {
  onUpload:    (url: string) => void;  // called with the returned URL after successful upload
  currentUrl?: string;                 // shows preview if provided
  label?:      string;                 // section label above the zone
  required?:   boolean;
  maxSizeMB?:  number;                 // default: 5
  accept?:     string;                 // default: "image/jpeg,image/png"
  height?:     string;                 // default: "h-40" for profile, "h-56" for banner
}
```

**Default State Classes (no file selected):**
```
Zone:    "border-2 border-dashed border-border rounded-lg flex flex-col items-center
          justify-center cursor-pointer hover:border-primary/50 hover:bg-muted/20
          transition-colors bg-muted/10 {height}"
Icon:    "h-8 w-8 text-orange-500 mb-2"         ← CloudUpload icon, always orange
Label:   "text-sm font-medium text-orange-500"   ← "Click to upload photo"
Hint:    "text-xs text-muted-foreground mt-1"    ← "PNG, JPG up to 5MB"
```

**Preview State (file uploaded):**
```
Zone:    same container class with "relative overflow-hidden"
Preview: <img> with "w-full h-full object-cover"
Overlay: "absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100"
         with "Click to change" text on hover
```

**Internal Behavior:**
1. `<input type="file" hidden>` ref attached to zone click
2. On file select → validate size + type → call `POST /api/uploads/image` via `apiClient`
3. Show inline loading spinner during upload
4. On success → call `onUpload(url)` → show preview
5. On error → show inline error text in destructive color

---

### `UserAvatar`
**Path:** `src/shared/ui/components/UserAvatar.tsx`  
**Created:** ⏳  
**Purpose:** Avatar circle + name + optional email combo. Used in all tables and detail page profile cards.

```typescript
interface UserAvatarProps {
  name:      string;
  email?:    string;       // shows below name when provided
  photoUrl?: string;
  size?:     'sm' | 'md'; // sm = 32px, md = 40px (default: sm)
  nameAsLink?: string;     // if provided, wraps name in green link pointing to this href
}
```

**Classes:**
```
Wrapper:       "flex items-center gap-2.5"
Avatar sm:     "h-8 w-8 rounded-full"
Avatar md:     "h-10 w-10 rounded-full"
AvatarFallback:"text-xs bg-muted text-muted-foreground"
Name (default):"text-sm font-medium text-foreground"
Name (as link): "text-sm font-medium text-primary hover:underline"
Email:         "text-xs text-muted-foreground"
```

---

## Feature Components (Non-Reusable)

> These are feature-specific components. Documented to prevent duplication across agents.
> Check this table before building any feature component.

| Component | Path | Status |
|-----------|------|--------|
| `LoginForm` | `features/auth/ui/LoginForm.tsx` | ✅ |
| `RegisterForm` | `features/auth/ui/RegisterForm.tsx` | ✅ |
| `AuthGuard` | `features/auth/ui/AuthGuard.tsx` | ⏳ |
| `ThemeToggle` | `shared/ui/components/ThemeToggle.tsx` | ⏳ |
| `DashboardOverview` | `features/dashboard/ui/DashboardOverview.tsx` | ⏳ |
| `DashboardInsights` | `features/dashboard/ui/DashboardInsights.tsx` | ⏳ |
| `UsersByRoleChart` | `features/dashboard/ui/UsersByRoleChart.tsx` | ⏳ |
| `SubjectsPerDeptChart` | `features/dashboard/ui/SubjectsPerDeptChart.tsx` | ⏳ |
| `ClassesPerSubjectChart` | `features/dashboard/ui/ClassesPerSubjectChart.tsx` | ⏳ |
| `DepartmentList` | `features/departments/ui/DepartmentList.tsx` | ⏳ |
| `DepartmentDetail` | `features/departments/ui/DepartmentDetail.tsx` | ⏳ |
| `CreateDepartmentForm` | `features/departments/ui/CreateDepartmentForm.tsx` | ⏳ |
| `SubjectList` | `features/subjects/ui/SubjectList.tsx` | ⏳ |
| `SubjectDetail` | `features/subjects/ui/SubjectDetail.tsx` | ⏳ |
| `CreateSubjectForm` | `features/subjects/ui/CreateSubjectForm.tsx` | ⏳ |
| `FacultyList` | `features/faculty/ui/FacultyList.tsx` | ⏳ |
| `FacultyDetail` | `features/faculty/ui/FacultyDetail.tsx` | ⏳ |
| `ClassList` | `features/classes/ui/ClassList.tsx` | ⏳ |
| `ClassDetail` | `features/classes/ui/ClassDetail.tsx` | ⏳ |
| `CreateClassForm` | `features/classes/ui/CreateClassForm.tsx` | ⏳ |
| `EnrollmentList` | `features/enrollments/ui/EnrollmentList.tsx` | ⏳ |
| `JoinClassModal` | `features/enrollments/ui/JoinClassModal.tsx` | ⏳ |

---

### `LoginForm`

**Path:** `features/auth/ui/LoginForm.tsx`
**Created:** 2026-07-01
**Purpose:** Login form for `/login` route. Centered card layout with email/password, remember me, forgot password, OAuth buttons.

**Structure & Classes:**
```
Outer wrapper:    "w-full max-w-[420px]"
Logo wrapper:     "flex flex-col items-center" (ShieldLogo SVG, mb-6)
Card:             "rounded-xl border border-border bg-card p-8"
Heading:          "text-2xl font-bold text-card-foreground"
Subtitle:         "mb-6 mt-1 text-sm text-muted-foreground"
Form:             "space-y-4"
Label:            "text-sm text-muted-foreground"
Input:            "h-10 bg-secondary text-foreground placeholder:text-muted-foreground"
Password input:   same + "pr-10" for eye icon
Eye toggle:       "absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
Remember me row:  "flex items-center justify-between pt-1"
Checkbox label:   "text-sm text-muted-foreground cursor-pointer"
Forgot link:      "flex items-center gap-1 text-sm text-primary hover:text-primary/80 transition-colors"
Submit button:    "h-11 w-full rounded-lg text-base font-semibold"
Divider:          "my-6 flex items-center gap-3" + "h-px flex-1 bg-border" + "text-sm text-muted-foreground"
OAuth label:      "mb-3 text-sm text-muted-foreground"
OAuth grid:       "grid grid-cols-2 gap-3"
OAuth buttons:    "h-10 gap-2" (outline variant)
Footer:           "mt-6 text-center text-sm text-muted-foreground"
Sign up link:     "font-semibold text-foreground hover:underline"
```

**Pattern notes:**
- Inputs use `bg-secondary` (not `bg-muted`) for the dark input background
- Card uses `rounded-xl` (not `rounded-lg`) for larger radius
- Submit button is `h-11` (taller than default) with `text-base` font
- OAuth buttons are `h-10` with outline variant
- Eye icon is positioned absolutely inside the password input wrapper
- Divider uses flex with horizontal lines (`h-px flex-1 bg-border`) and centered "or" text
- Sign up link uses `text-foreground` (not `text-primary`) for the bold link text

---

### `RegisterForm`

**Path:** `features/auth/ui/RegisterForm.tsx`
**Created:** 2026-07-01
**Purpose:** Registration form for `/register` route. Centered card layout with role selector, profile photo upload, name/email/password fields.

**Structure & Classes:**
```
Outer wrapper:    "w-full max-w-[420px]"
Logo wrapper:     "flex flex-col items-center" (ShieldLogo SVG, mb-6)
Card:             "rounded-xl border border-border bg-card p-8"
Heading:          "text-2xl font-bold text-card-foreground"
Subtitle:         "mb-6 mt-1 text-sm text-muted-foreground"
Form:             "space-y-4"
Label:            "text-sm text-muted-foreground"
Input:            "h-10 bg-secondary text-foreground placeholder:text-muted-foreground"
Password input:   same + "pr-10" for eye icon
Eye toggle:       "absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
Required asterisk: "text-destructive" inside Label
Submit button:    "h-11 w-full rounded-lg text-base font-semibold"
Footer:           "mt-6 text-center text-sm text-muted-foreground"
Sign in link:     "font-semibold text-foreground hover:underline"
```

**Role Selector:**
```
Grid:             "grid grid-cols-2 gap-3"
Selected state:   "border-primary bg-primary/10 text-primary"
Unselected state: "border-border bg-secondary text-muted-foreground hover:border-border/80"
Icon:             "h-6 w-6" (GraduationCap for student, Building2 for teacher)
Label:            "text-sm font-medium"
```

**Profile Photo Upload Zone:**
```
Default state:    "border-2 border-dashed border-border bg-muted/10 h-40 hover:border-primary/50 hover:bg-muted/20"
Preview state:    "border-border overflow-hidden" with img "h-full w-full object-cover"
Hover overlay:    "absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 hover:opacity-100"
Upload icon:      "h-8 w-8 text-orange-500" (lucide Upload)
Upload label:     "text-sm font-medium text-orange-500"
Hint:             "text-xs text-muted-foreground"
```

**Pattern notes:**
- Same card/input/button patterns as LoginForm for consistency
- Role selector uses card-toggle pattern (two side-by-side buttons)
- Profile photo uploads to `POST /api/uploads/image` via FormData
- Shows preview after upload with hover-to-change overlay
- `hidden` file input triggered by button click
- Upload validation: 5MB max, JPEG/PNG only
- Submit disabled while uploading
