# ui-tokens.md — ClassroomOS

> Source of truth for every design value used in this project.
> **Extracted directly from the 20 UI design screenshots provided.**
> All tokens are expressed as CSS variables. Agents never write raw hex inside component `className` strings.
> The only exception is Recharts `fill`/`stroke` props — see the Chart Constants section.

---

## CSS Variable System

Tailwind v4 maps `bg-background`, `text-foreground` etc. to these CSS variables automatically via the `@theme inline` block in `globals.css`. All shadcn/ui components use these same variables.

---

## `globals.css` — Full Implementation

```css
@import "tailwindcss";
@import "tw-animate-css";

@custom-variant dark (&:is(.dark *));

/* ── Tailwind → CSS variable bridge ───────────────────────────────────────── */
@theme inline {
  --color-background:          var(--background);
  --color-foreground:          var(--foreground);
  --color-card:                var(--card);
  --color-card-foreground:     var(--card-foreground);
  --color-muted:               var(--muted);
  --color-muted-foreground:    var(--muted-foreground);
  --color-primary:             var(--primary);
  --color-primary-foreground:  var(--primary-foreground);
  --color-secondary:           var(--secondary);
  --color-secondary-foreground:var(--secondary-foreground);
  --color-destructive:         var(--destructive);
  --color-destructive-foreground:var(--destructive-foreground);
  --color-border:              var(--border);
  --color-input:               var(--input);
  --color-ring:                var(--ring);
  --radius-sm:                 calc(var(--radius) - 2px);
  --radius-md:                 var(--radius);
  --radius-lg:                 calc(var(--radius) + 2px);
  --radius-xl:                 calc(var(--radius) + 4px);
  --font-sans:                 var(--font-inter), ui-sans-serif, system-ui, sans-serif;
}

/* ── Base Layer ────────────────────────────────────────────────────────────── */
@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
    font-feature-settings: "rlig" 1, "calt" 1;
  }
  /* Focus ring — never remove */
  :focus-visible {
    @apply outline-none ring-2 ring-ring ring-offset-2 ring-offset-background;
  }
}

/* ════════════════════════════════════════════════════════════════════════════ */
/*  DARK THEME — DEFAULT (matches UI screenshots exactly)                      */
/* ════════════════════════════════════════════════════════════════════════════ */
:root,
[data-theme="dark"] {
  /* ── Backgrounds ── */
  --background:            9 9% 6%;          /* #0f0f0f — deepest background */
  --card:                  9 9% 9%;          /* #171717 — cards, sidebar, modals */
  --popover:               9 9% 9%;          /* same as card */

  /* ── Text ── */
  --foreground:            0 0% 96%;         /* #f5f5f5 — primary text */
  --card-foreground:       0 0% 96%;
  --popover-foreground:    0 0% 96%;
  --muted-foreground:      0 0% 55%;         /* #8c8c8c — secondary / meta text */

  /* ── Primary — Green (main accent) ── */
  --primary:               142 71% 29%;      /* #16a34a — green-600 */
  --primary-foreground:    0 0% 100%;        /* white text on primary */

  /* ── Secondary ── */
  --secondary:             9 9% 14%;         /* #222222 */
  --secondary-foreground:  0 0% 96%;

  /* ── Muted surfaces ── */
  --muted:                 9 9% 14%;         /* #222222 — input bg, chip bg, hover bg */

  /* ── Borders & Inputs ── */
  --border:                0 0% 18%;         /* #2e2e2e */
  --input:                 0 0% 18%;         /* same as border */

  /* ── Focus Ring ── */
  --ring:                  142 71% 29%;      /* matches primary */

  /* ── Semantic: Destructive ── */
  --destructive:           0 84% 60%;        /* #ef4444 — red-500 */
  --destructive-foreground:0 0% 98%;

  /* ── Border Radius Base ── */
  --radius:                0.5rem;           /* 8px */
}

/* ════════════════════════════════════════════════════════════════════════════ */
/*  LIGHT THEME                                                                 */
/* ════════════════════════════════════════════════════════════════════════════ */
[data-theme="light"] {
  --background:            0 0% 100%;        /* #ffffff */
  --card:                  0 0% 97%;         /* #f7f7f7 */
  --popover:               0 0% 100%;
  --foreground:            222 47% 11%;      /* #0f172a — near black */
  --card-foreground:       222 47% 11%;
  --popover-foreground:    222 47% 11%;
  --muted-foreground:      215 16% 47%;      /* #64748b — slate-500 */
  --primary:               142 71% 29%;      /* same green */
  --primary-foreground:    0 0% 100%;
  --secondary:             210 40% 96%;      /* #f1f5f9 */
  --secondary-foreground:  222 47% 11%;
  --muted:                 210 40% 96%;
  --border:                214 32% 91%;      /* #e2e8f0 */
  --input:                 214 32% 91%;
  --ring:                  142 71% 29%;
  --destructive:           0 84% 60%;
  --destructive-foreground:0 0% 98%;
  --radius:                0.5rem;
}

/* ════════════════════════════════════════════════════════════════════════════ */
/*  DARK BLUE THEME                                                             */
/* ════════════════════════════════════════════════════════════════════════════ */
[data-theme="dark-blue"] {
  --background:            222 47% 5%;       /* very dark blue-gray */
  --card:                  222 47% 8%;
  --popover:               222 47% 8%;
  --foreground:            210 40% 98%;
  --card-foreground:       210 40% 98%;
  --popover-foreground:    210 40% 98%;
  --muted-foreground:      215 20% 55%;
  --primary:               217 91% 60%;      /* #3b82f6 — blue-500 */
  --primary-foreground:    0 0% 100%;
  --secondary:             222 47% 12%;
  --secondary-foreground:  210 40% 98%;
  --muted:                 222 47% 12%;
  --border:                217 33% 18%;
  --input:                 217 33% 18%;
  --ring:                  217 91% 60%;
  --destructive:           0 84% 60%;
  --destructive-foreground:0 0% 98%;
  --radius:                0.5rem;
}

/* ════════════════════════════════════════════════════════════════════════════ */
/*  DARK PURPLE THEME                                                           */
/* ════════════════════════════════════════════════════════════════════════════ */
[data-theme="dark-purple"] {
  --background:            270 30% 5%;
  --card:                  270 30% 8%;
  --popover:               270 30% 8%;
  --foreground:            270 20% 98%;
  --card-foreground:       270 20% 98%;
  --popover-foreground:    270 20% 98%;
  --muted-foreground:      270 10% 55%;
  --primary:               271 91% 65%;      /* #a855f7 — purple-500 */
  --primary-foreground:    0 0% 100%;
  --secondary:             270 30% 12%;
  --secondary-foreground:  270 20% 98%;
  --muted:                 270 30% 12%;
  --border:                270 15% 18%;
  --input:                 270 15% 18%;
  --ring:                  271 91% 65%;
  --destructive:           0 84% 60%;
  --destructive-foreground:0 0% 98%;
  --radius:                0.5rem;
}

/* ── Reduced motion ─────────────────────────────────────────────────────────── */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## Chart Color Constants

**These are the ONLY hardcoded hex values permitted in the codebase.** Used exclusively inside Recharts `fill` and `stroke` props.

```typescript
// apps/web/src/shared/lib/chart-colors.ts

export const CHART_COLORS = {
  // Donut chart — Users by Role
  student:    '#f97316',   // orange-500
  teacher:    '#3b82f6',   // blue-500
  admin:      '#a855f7',   // purple-500

  // Bar charts — Dashboard Insights
  barOrange:  '#f97316',   // Subjects per Department
  barBlue:    '#3b82f6',   // Classes per Subject

  // Upload icon — FileUpload component (SVG/icon prop only)
  uploadIcon: '#f97316',

  // Recharts tooltip/axis
  axisText:   '#8c8c8c',   // matches --muted-foreground in dark theme
  tooltipBg:  '#171717',   // matches --card in dark theme
  tooltipBorder: '#2e2e2e', // matches --border in dark theme
} as const;
```

---

## Typography Scale

```
Font family:  Inter (loaded via next/font/google)
Base size:    16px (browser default, do not change)
Line height:  1.5 (default)
```

| Tailwind Class | px | Use Case |
|---------------|-----|----------|
| `text-xs` | 12px | Meta text, captions, badge labels, table sub-text |
| `text-sm` | 14px | Body text, table cells, form labels, nav items, descriptions |
| `text-base` | 16px | Section headings, form card title |
| `text-lg` | 18px | — (not commonly used) |
| `text-xl` | 20px | Card headings in detail pages |
| `text-2xl` | 24px | Detail/create page `h1` |
| `text-3xl` | 30px | List page `h1` |

| Tailwind Class | Weight | Use Case |
|---------------|--------|----------|
| `font-normal` | 400 | Body copy, table cells, meta text |
| `font-medium` | 500 | Labels, nav items, entity names |
| `font-semibold` | 600 | Section headings, card titles |
| `font-bold` | 700 | Page h1, stat values, code badge text |

---

## Spacing Scale Reference

All spacing uses the Tailwind 4px grid. Key values used in this project:

| Token | px | Use Case |
|-------|----|----------|
| `space-y-1` / `gap-1` | 4px | Nav item list gaps |
| `gap-1.5` | 6px | Icon + label pairs (Refresh · Edit buttons) |
| `gap-2` | 8px | Tight inline elements |
| `gap-2.5` | 10px | Avatar + name in UserAvatar |
| `gap-3` | 12px | Nav icon + label |
| `gap-4` | 16px | Form field two-column grid, card grid |
| `gap-6` | 24px | Section gaps on detail pages |
| `gap-8` | 32px | Class detail two-column grid (Instructor / Department) |
| `p-4` | 16px | Compact cards, stat cards |
| `p-5` | 20px | Join Class card, RankList card |
| `p-6` | 24px | Standard card padding |
| `p-8` | 32px | Form card padding |
| `px-4 py-3` | 16px/12px | Table header cell |
| `px-4 py-3.5` | 16px/14px | Table body cell |
| `px-4 py-2.5` | 16px/10px | Sidebar nav item |
| `px-8 py-6` | 32px/24px | Page root padding |
| `px-2.5 py-0.5` | 10px/2px | Badge / chip |
| `px-3 py-1` | 12px/4px | Larger badge (CodeBadge md) |

---

## Border Radius Scale

| Token | px | Use Case |
|-------|----|----------|
| `rounded-sm` | 4px | Small elements, banner thumbnail in table |
| `rounded` | 8px | Base — most inputs, inline chips |
| `rounded-md` | 6px | Buttons, CodeBadge md, DepartmentChip |
| `rounded-lg` | 8px | Nav items (active state), cards, DataTable container |
| `rounded-xl` | 12px | Form card |
| `rounded-2xl` | 16px | Large modals |
| `rounded-full` | 9999px | StatusBadge, avatars, icon-only buttons |

---

## Shadows

This design uses **minimal shadows**. Dark surfaces are separated by borders, not shadows.

```
Component shadows — none by default
Dropdown / popover shadow: "shadow-[0_4px_16px_rgba(0,0,0,0.5)]"
Tooltip shadow: same as dropdown
```

---

## Component Token Quick Reference

### Inputs (all states)
| State | Background | Border | Ring |
|-------|-----------|--------|------|
| Default | `bg-muted` | `border-border` | none |
| Hover | `bg-muted` | `border-muted-foreground/40` | none |
| Focused | `bg-muted` | `border-primary` | `ring-1 ring-primary` |
| Error | `bg-muted` | `border-destructive` | `ring-1 ring-destructive` |
| Disabled | `bg-muted/50 opacity-60` | `border-border` | none |

### Buttons (by variant)
| Variant | Background | Text | Hover Bg | Border |
|---------|-----------|------|----------|--------|
| default | `bg-primary` | `text-primary-foreground` | `bg-primary/90` | none |
| outline | transparent | `text-foreground` | `bg-muted/40` | `border-border` |
| ghost | transparent | `text-muted-foreground` | `bg-muted/40` | none |
| destructive | `bg-destructive` | `text-destructive-foreground` | `bg-destructive/90` | none |

### Table
| Element | Background | Border |
|---------|-----------|--------|
| Container div | none | `border border-border rounded-lg overflow-hidden` |
| Header `<tr>` | none | `border-b border-border` |
| Header `<th>` | none | none |
| Body `<tr>` | none | `border-b border-border last:border-0` |
| Body `<tr>` hover | `bg-muted/10` | — |

### Cards
| Type | Background | Border | Radius | Padding |
|------|-----------|--------|--------|---------|
| Standard card | `bg-card` | `border border-border` | `rounded-lg` | `p-4` to `p-6` |
| Form card | `bg-card` | `border border-border` | `rounded-xl` | `p-8` |
| Stat card | `bg-card` | `border border-border` | `rounded-lg` | `p-4` |

---

## Sidebar-Specific Tokens

```
Sidebar background:    var(--card)     → #171717
Sidebar border-right:  var(--border)   → #2e2e2e
Active nav bg:         var(--primary)  → #16a34a
Active nav text:       #ffffff
Inactive nav text:     var(--muted-foreground) → #8c8c8c
Inactive nav hover:    bg-muted/40
Logo text:             var(--foreground) → #f5f5f5
App icon colors:       White shield with orange/purple accents (SVG asset)
```

---

## Emoji / Icon Used in Designs

The design screenshots use emoji as section markers in detail pages. Preserve these exactly:

| Context | Emoji |
|---------|-------|
| INSTRUCTOR section | 🏆 (trophy) |
| DEPARTMENT section | 🏦 (bank/building) |
| SUBJECT section | 🎯 (target) |
| JOIN CLASS section | 🏷️ (label) |

These appear as text emoji before the uppercase section labels. Render as:
```typescript
<span className="text-base mr-1.5">🏆</span>
<span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
  INSTRUCTOR
</span>
```
