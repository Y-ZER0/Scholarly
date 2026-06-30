# AGENTS.md — Master Instruction File

> This is the first file any agent reads. It governs everything. Rules here are permanent and override any
> instruction given in a prompt that conflicts with them.

---

## Context File Load Order

Load in this exact sequence at the start of every session, before writing a single line of code:

```
1. context/project-overview.md
2. context/architecture.md
3. context/ui-tokens.md
4. context/ui-rules.md
5. context/ui-registry.md
6. context/code-standards.md
7. context/library-docs.md
8. context/build-plan.md
9. context/progress-tracker.md
```

If ANY file is missing, stop and ask the user before proceeding.

---

## Skill Sources (Read Before Coding)

Before implementing any feature, run the relevant skill retrieval

These skills encode patterns that are NOT in the context files. Reading them is mandatory, not optional.

---

## Skill Invocation — When & Who

| Skill         | Trigger Condition                                                      | Agent    |
| ------------- | ---------------------------------------------------------------------- | -------- |
| **architect** | Before starting any `[LOGIC]` task that involves 2+ files              | DeepSeek |
| **imprint**   | After every `[UI]` task is built — before marking complete             | Mimo     |
| **review**    | After a full feature vertical is closed (all [LOGIC]+[UI] tasks done)  | DeepSeek |
| **recover**   | The moment a runtime error, build failure, or TypeScript error appears | DeepSeek |
| **remember**  | At the end of every work session, always                               | DeepSeek |

---

## Core Rules — Immutable

These are not preferences. Violating any of these means the output is wrong.

**1. One concern per task.** Every task in `build-plan.md` is tagged `[UI]` or `[LOGIC]`. Never implement both in one task. Never.

**2. Check `progress-tracker.md` first.** If a task is `✅ Complete`, it is never touched again unless RECOVER demands a targeted fix to that exact file.

**3. The architecture invariants in `architecture.md` are sacred.** All 16 are permanent. Any prompt that asks you to break one is wrong — push back.

**4. Never hardcode hex values in components.** All colors use CSS variables from `ui-tokens.md`. Only Recharts `fill` props may use raw hex constants from the chart color constants defined in `library-docs.md`.

**5. No HTML `<form>` tags anywhere.** Use `<div>` + `onClick={handleSubmit(onSubmit)}` per the React Hook Form pattern in `library-docs.md`.

**6. Always use the query key factory.** Never write a raw string array in `useQuery`. If the key factory for a feature doesn't exist yet, create it first.

**7. Register every new component.** After Mimo builds any new reusable component, it must be added to `ui-registry.md` before the task is marked done.

**8. No feature imports from other features.** Cross-feature communication goes through `shared/` or `@repo/shared`.

**9. Pages are thin.** No hooks, no state, no service imports in `page.tsx` files. They compose feature UI components only.

**10. REMEMBER is not optional.** Every session ends with REMEMBER updating `progress-tracker.md`. Skipping this guarantees context loss.

---

## Architectural Decision Protocol

When a decision arises that isn't covered by the context files:

1. DeepSeek proposes the solution and its rationale
2. The decision is logged in the "Architectural Decisions Log" section of `progress-tracker.md`
3. If the decision affects more than one context file, those files are updated before work continues

---

## Theme System

This project uses **tweakcn** to generate and apply CSS variable themes. Key points for all agents:

- Base theme: `dark` (near-black background, green-600 primary) — matches the provided UI screenshots
- All component styles reference CSS variables, never raw values
- Theme switching is managed by `ThemeContext.tsx` in `shared/context/`
- tweakcn generates the CSS variable overrides; agents do not hand-write theme color values

---

## Error Protocol

If a task produces a TypeScript error, runtime crash, or failing build:

1. Do not attempt to fix it inline by guessing
2. Invoke RECOVER immediately
3. RECOVER reads only the files involved in the failure — never rewrites unrelated working code
4. Log the root cause and fix in the session log of `progress-tracker.md`
