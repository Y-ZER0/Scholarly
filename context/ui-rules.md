# ui-rules.md — ClassroomOS

> Built directly from the 20 UI design screenshots provided.
> Mimo reads this before building any component. Rules here are derived from what is **actually in the designs** — not generic best practices.
> When a rule contradicts your instinct, the rule wins.

---

## Layout System

### Sidebar
- Fixed width **240px** when expanded. Collapses to **60px** (icons only) below 768px viewport.
- Always rendered — no hamburger overlay on desktop. The sidebar is a permanent fixture.
- Background: `bg-card` with `border-r border-border` separator.
- Logo area: top-left, `px-4 py-4`, app icon (pentagon shield shape) + "Refine Project" text + collapse toggle icon (right-aligned).
- Collapse toggle: `<PanelLeft>` icon, ghost button style.
- Nav items sit in `px-3 py-4` area with `space-y-1` between them.
- Active item: **full-width** green highlight `bg-primary` — the rounded-lg fills the entire nav item width, not just the text.
- Inactive item: muted text, transparent background, hover with very subtle `bg-muted/40`.
- Icons always left of label, `h-4 w-4`. Never icon-only on desktop.

### Main Content Area
- **Every protected page** has `px-8 py-6` as its root padding. No exceptions.
- Background is `bg-background` — the deep near-black from the screenshots.
- Content area is `flex-1 overflow-y-auto` — scrolls independently of sidebar.
- Max-width: none. Tables and content stretch to fill the full available width.

### Topbar
- Not a persistent bar across the top — it's just two floating controls anchored top-right of the main content area.
- Contains: dark/light theme toggle icon + circular user avatar (32px).
- These sit inside the main content area, positioned absolutely or flex-end at the page level.

### Page Layout Hierarchy
```
Protected Page:
  (protected)/layout.tsx → DashboardLayout
    └── SidebarNav (240px, fixed)
    └── <main overflow-y-auto>
          └── page.tsx content (px-8 py-6)
                └── [breadcrumb if detail page]
                └── [PageHeader or DetailPageHeader]
                └── [content sections]
```

---

## Breadcrumbs

- Shown on: all detail pages, all create pages.
- **Not shown** on list pages (title alone is sufficient there).
- Pattern: `Home icon > Category > Action` — e.g., `🏠 > Departments > Show`
- "Show" is used for detail pages (not the entity name — that's the `h1` below).
- "Create" is used for create pages.
- Text is `text-sm text-muted-foreground` with the final segment in `text-foreground`.
- Separator is `>` chevron icon (`h-3.5 w-3.5`), not a slash.

---

## Typography

| Element | Size | Weight | Color Token |
|---------|------|--------|-------------|
| List page title (h1) | `text-3xl` | `font-bold` | `text-foreground` |
| Detail page title (h1) | `text-2xl` | `font-bold` | `text-foreground` |
| Create page title (h1) | `text-2xl` | `font-bold` | `text-foreground` |
| Create page subtitle | `text-sm` | `font-normal` | `text-muted-foreground` |
| Section heading (Overview, Subjects, Classes…) | `text-base` | `font-semibold` | `text-foreground` |
| Table column header | `text-sm` | `font-medium` | `text-muted-foreground` |
| Table cell — primary data | `text-sm` | `font-normal` | `text-foreground` |
| Table cell — secondary/meta | `text-xs` | `font-normal` | `text-muted-foreground` |
| Sidebar app name | `text-sm` | `font-semibold` | `text-foreground` |
| Sidebar nav label | `text-sm` | `font-normal` | active: `text-white`, inactive: `text-muted-foreground` |
| Card stat value | `text-2xl` | `font-bold` | `text-foreground` |
| Card stat label | `text-xs` | `font-medium` | `text-muted-foreground` |
| Form label | `text-sm` | `font-medium` | `text-foreground` |
| Form placeholder | — | — | `text-muted-foreground` (via shadcn default) |
| Error message | `text-xs` | `font-normal` | `text-destructive` |
| Required asterisk | — | — | `text-destructive` |
| Instructor/Department names (linked) | `text-sm` or `text-base` | `font-medium` | `text-primary` |

### Linked Names Rule
Faculty names, department names, and subject names that are navigable appear as **green text** (`text-primary`), not underlined, not in a standard link style. No underline on default state. Underline appears only on hover.

---

## Colors — Usage Rules

- **Green** (`--primary`): primary buttons, active sidebar item, all CodeBadge fills, StatusBadge "active"/"teacher", "View" links, linked entity names, focus rings, count badges in RankList.
- **Orange** (`#f97316`): upload icon in FileUpload, bar chart "Subjects per Department", donut chart "student" slice. **Never use orange in component styles** — only in these specific visual elements.
- **Blue** (`#3b82f6`): bar chart "Classes per Subject", donut chart "teacher" slice. **Never use blue in component styles** — chart use only.
- **Muted** (`--muted`): input backgrounds, table cell hover, chip backgrounds, inactive badge backgrounds.
- **Destructive** (`--destructive`): error messages, required field asterisks.
- **Never hardcode** `#16a34a` or any hex value in component className strings. Use `bg-primary`, `text-primary`, `border-primary` etc. Hardcoded hex is only permitted inside Recharts `fill` and `stroke` props.

---

## Tables

- **No striped rows.** Single consistent row style. Alternating row backgrounds are forbidden.
- **Row border only** — `border-b border-border`. No cell borders, no outer table border via `<table>` element (the containing `<div>` has `border border-border rounded-lg overflow-hidden`).
- **Header row** has no background fill — only the bottom border separates it from the body.
- **Row hover** is very subtle: `hover:bg-muted/10`. Nothing bold.
- **"View" link** in the Details column: plain `text-primary text-sm font-medium cursor-pointer hover:underline`. Never styled as a button.
- **Pagination** is always rendered, even with only 1 page. Components: "Rows per page" label + `<Select>` (10/25/50) + "Page X of Y" text + first/prev/next/last arrows.
- **Avatar in tables**: always 32px (`h-8 w-8`), never larger. Name sits inline to the right.
- **Sub-tables on detail pages** (Subjects in Department Detail, Classes in Subject Detail): pagination uses left/right arrow buttons only — no rows-per-page selector. Count badge floats right of the section heading.
- **Banner image in Classes table**: small 32px square thumbnail, `rounded-sm`, `object-cover`. Sits in its own "Banner" column.

---

## Forms

### Form Card Layout
- All create/edit forms are centered on the page inside a `FormCard`.
- The `FormCard` has a dark card style: `bg-card border border-border rounded-xl`.
- Card title is always **"Fill out form"** — exactly this phrase in every design.
- There is vertical whitespace above and below the card — the page background is visible.

### Field Anatomy
```
[label] [required asterisk in destructive if required]
[input / select / textarea]
[error message if any]
```
- Label: `text-sm font-medium text-foreground mb-1`
- Asterisk: `<span className="text-destructive ml-0.5">*</span>`
- Input: `bg-muted border-border text-foreground h-10`
- Focused input border and ring: `border-primary ring-1 ring-primary`
- Textarea: same border/background as input, `min-h-[100px] resize-y`
- Select trigger: same height and background as input

### Two-Column Grid (used in Create Class form)
- `<div className="grid grid-cols-2 gap-4">`
- Subject + Teacher: one row
- Capacity + Status: second row
- Single-column at < 640px

### Submit Button
- **Always full-width** on modal forms: `w-full h-12 text-base`
- Left-aligned (not full-width) on standalone create pages: normal Button width, `h-10`
- Disabled with `{isPending ? 'Creating...' : 'Create [Entity]'}` label during mutation

### FileUpload Positioning
- Banner Image upload zone is always **full-width** inside the form card
- Profile Photo upload zone is the same full-width treatment on the Register page
- The upload area comes **before** the text fields on both forms
- Orange icon, orange "Click to upload photo" text — never green here

---

## Badges & Chips

- **CodeBadge** is always green (`bg-primary text-white`). No gray code badges. No outlined code badges.
- **StatusBadge** is always subtle/bordered — never solid fill (except CodeBadge for codes).
- **DepartmentChip** (e.g., "Computer Science", "Mathematics" in Subjects list) is always gray `bg-muted` — never green.
- "teacher" and "active" share the **same green style** in StatusBadge. This is intentional.
- "student" uses blue. "admin" uses orange. "inactive" uses gray muted.
- The role badge on Faculty Detail page (`teacher`) floats in the **top-right corner of the Profile card** — not inline with the name.

---

## Buttons

| Variant | When Used | Key Classes |
|---------|-----------|-------------|
| Primary (default) | Main CTA — Create, Join Class, Create Account, Sign in | `bg-primary text-white hover:bg-primary/90` |
| Outline | Go Back, navigation secondary actions | `border border-border text-foreground hover:bg-muted/40` |
| Ghost | Refresh, Edit (with icon) in detail page headers | `text-muted-foreground hover:text-foreground hover:bg-transparent` |
| Destructive | Delete actions | `bg-destructive text-white hover:bg-destructive/90` |

- **"+ Create" button** in PageHeader: uses primary variant. Label is `+ Create` with `<Plus>` icon.
- **"Go Back" button** on create pages: uses **green outline** (`variant="outline"` with green color). This is distinct from standard outline — it has a green border. Check the design screenshots.
- **Refresh / Edit** in detail page headers: ghost buttons with icon + text label — no border visible.
- Icon buttons (theme toggle, sidebar collapse): `size="icon"` variant — perfect square, `h-9 w-9`.

---

## Cards & Sections

### Overview Stats Card (Dashboard + Department Detail)
- Single dark card `bg-card border border-border rounded-lg p-4 md:p-6`
- Section heading "Overview" in `text-base font-semibold mb-4`
- Stats laid out as a horizontal row on desktop — `grid grid-cols-[repeat(auto-fit,minmax(100px,1fr))]` or simple flex
- Each stat: label on top (tiny muted), value large and bold below
- Icons right-aligned to each stat card

### Detail Page Section Cards
- Each section (Subjects, Classes, Teachers, Students in Department Detail) is a separate dark card: `bg-card border border-border rounded-lg`
- Section heading sits **outside** the card but **above** it, OR is a heading row inside the card with `px-4 py-4 border-b border-border`
- Count badge to the right of section heading: `bg-muted text-muted-foreground rounded text-xs px-2 py-0.5`

### Class Detail Banner
- Full-width banner image: `w-full h-48 md:h-56 object-cover rounded-lg` (or no rounded — matches design)
- The banner goes from left edge to right edge of the content area, below the breadcrumb
- Below the banner: a dark card with class info, NOT overlapping the banner

### Join Class Section (Class Detail)
- Background: `bg-card border border-border rounded-lg p-5`
- Label: `text-xs font-semibold text-muted-foreground uppercase tracking-wider` + flag emoji
- Steps: `ol` with `list-decimal` or manual `#1 #2 #3` numbering in `text-sm text-muted-foreground`
- "Join Class" button: **full-width** `w-full h-12 text-base bg-primary`

---

## Spacing Cheat Sheet (Quick Reference)

| Context | Value |
|---------|-------|
| Page root padding | `px-8 py-6` |
| Card inner padding | `p-4` to `p-6` |
| Form card padding | `p-8` |
| Section gap (vertical between cards) | `space-y-6` or `mt-6` |
| Table cell padding | `px-4 py-3.5` |
| Table header padding | `px-4 py-3` |
| Sidebar nav item | `px-4 py-2.5` |
| Gap between form fields | `space-y-5` |
| Gap in two-column form grid | `gap-4` |
| Gap between icon and label | `gap-2` to `gap-3` |

---

## Responsive Behavior

- **Desktop-first.** Target 1280px+ as the primary experience.
- Minimum supported: **1024px** (sidebar + content both visible).
- Below **768px**: sidebar collapses (icon-only mode). Main content expands.
- Below **640px**: two-column form grids collapse to single column.
- Tables: **never stack on mobile** — horizontal scroll instead: `overflow-x-auto` on the table wrapper.
- Charts: use `<ResponsiveContainer>` from Recharts — they scale down naturally.

---

## Accessibility

- All icon-only buttons must have `aria-label`: `<Button aria-label="Collapse sidebar">`.
- Focus rings are **always visible**: `focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background`.
- Color contrast: the `--foreground` on `--background` combination must pass WCAG AA (4.5:1).
- `role="navigation"` on `<aside>` sidebar element.
- Table: `<th scope="col">` on all header cells.
- Error messages linked to inputs with `aria-describedby`.
- `prefers-reduced-motion`: disable CSS animations and transitions when this media query fires.
