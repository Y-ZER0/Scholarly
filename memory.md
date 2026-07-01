# Memory — Auth Phase Complete (Tasks 2.1–2.3)

Last updated: 2026-07-01

## What was built

### Task 2.1 Auth Backend Module (from prior session)
- `apps/api/src/modules/auth/` — User entity, AuthService (login/register/OAuth), JWT strategy, Google+GitHub strategies, JwtAuthGuard global, @Public/@Roles/@CurrentUser decorators
- `apps/api/src/modules/auth/services/auth.service.ts` — Remember Me (7d/1d JWT expiry), Forgot/Reset Password (SHA-256 hashed tokens, 1hr expiry, console-logged reset URL)
- `apps/api/src/modules/auth/dtos/` — login-request, forgot-password-request, reset-password-request DTOs
- `apps/api/src/modules/users/entities/user.entity.ts` — added `resetTokenHash` and `resetTokenExpiry` columns (`select: false`, `nullable: true`)
- `context/migrations/002-add-reset-token-columns.sql` — must run in Supabase SQL Editor

### Task 2.2 Login Page UI (from prior session)
- `apps/web/app/(auth)/layout.tsx` — centered auth layout
- `apps/web/app/(auth)/login/page.tsx` — thin page composing LoginForm
- `apps/web/features/auth/ui/LoginForm.tsx` — email/password, show/hide toggle, remember me, forgot password, Google/GitHub OAuth buttons, react-hook-form + Zod
- `apps/web/features/auth/ui/AuthIcons.tsx` — ShieldLogo, GoogleIcon, GitHubIcon SVGs

### Task 2.3 Register Page UI (this session)
- `apps/web/app/(auth)/register/page.tsx` — thin route composing RegisterForm
- `apps/web/features/auth/ui/RegisterForm.tsx` — full register form:
  - Role selector: Student (GraduationCap) / Teacher (Building2) card toggles with green border when selected
  - Profile photo upload zone: dashed border, orange Upload icon, uploads to POST /api/uploads/image, shows preview with hover-to-change overlay
  - Full Name, Email, Password inputs with show/hide toggle
  - React Hook Form + Zod validation (name required, email required + valid, password min 8 chars)
  - Full-width green "Create Account" button
  - "Already have an account? Sign in" link
- Updated `context/ui-registry.md` — RegisterForm component documented
- Updated `context/progress-tracker.md` — Task 2.3 marked complete

## Decisions made

- **Simple expiry-based Remember Me** (not refresh tokens) — `rememberMe = true` → 7d, `false` → 1d.
- **Forgot Password tokens stored hashed** — raw token logged to console, SHA-256 hash in DB. Generic response (no user enumeration).
- **No email sending in MVP** — reset link logged to console.
- **OAuth users get 7d expiry** — defaults to `rememberMe = true`.
- **TypeORM `null` for optional fields requires `as any` cast** — in `UsersRepository.updatePassword()`.
- **Role selector uses local useState, not watch()** — avoids React Compiler memoization warning; synced to form via `setValue` on button click.
- **Profile photo preview uses `next/image` Image with `unoptimized`** — user-uploaded images have dynamic URLs (localhost dev / Supabase prod), so domain-based optimization is not feasible.

## Problems solved

- **TypeORM `null` not assignable to optional fields** — Fixed with `as any` cast in `UsersRepository.updatePassword()`.
- **OAuth users losing 7d expiry** — `handleOAuthLogin()` initially called `generateAuthResponse(user)` without `rememberMe`. Fixed by passing `true`.
- **React Compiler memoization warning on watch()** — Replaced `watch("role")` with local `useState` + `setValue` in onClick handlers.
- **Next.js `<img>` LCP warning** — Replaced `<img>` with `<Image unoptimized />` from next/image.
- **`moduleResolution=node10` deprecation** — Project-level tsconfig issue, not introduced by this code. Not addressed.

## Current state

- Tasks 2.1, 2.2, and 2.3 complete
- Type-check passes clean for web package
- `.env` still needs real OAuth client IDs/secrets
- SQL migration for reset token columns needs to be run in Supabase SQL Editor

## Next session starts with

**Task 2.4 `[LOGIC]` Auth Client State** — `auth.service.ts` (login/register HTTP calls), `AuthContext.tsx` (client state), `useAuth.ts`, `AuthGuard.tsx`, `useLogin.ts`, `useRegister.ts`, `api-client.ts` (Axios interceptors), OAuth redirect handler.

## Open questions

- None
