# 006 — June 2026 — Phase 00 Setup: Version Pins & Adjustments

> Recorded during Phase 00 (Project Setup). Documents deviations from the literal
> phase-file commands that were necessary to honor the documented/stable stack.

---

## Decision: Pin tooling to the documented, Tailwind-v3-era stack

Approved by Yan: "follow the documentation / stable stack."

| Tool                | Installed            | Why not "latest"                                                                 |
|---------------------|----------------------|----------------------------------------------------------------------------------|
| `create-next-app`   | **14** (Next 14.2.35)| `@latest` installs Next 15 + Tailwind v4, contradicting Decision 001 + CLAUDE.md. |
| Tailwind CSS        | **v3.4** (default)   | All phase docs configure `tailwind.config.ts` (a v3 pattern). v4 is CSS-first.    |
| shadcn/ui CLI       | **2.1.8**            | `latest` is 4.11 (Tailwind-v4 oriented). 2.1.8 is the classic Radix + v3 release. |
| Prisma + Client     | **6.19.3**           | See "Prisma 7" below.                                                             |

## Decision: Prisma pinned to v6 (not v7)

`npm install prisma @prisma/client` pulled Prisma **7**, which introduced breaking changes
that conflict with the documented stack:
- New `prisma-client` generator outputting to `src/generated/prisma` (instead of the classic
  `@prisma/client` import used by Phase 00 Step 9 and every later phase).
- A `prisma.config.ts` + manual `dotenv` loading — Prisma 7 no longer auto-loads `.env`, which
  would break the simple `npx prisma migrate dev` / `npx prisma studio` workflow documented in
  `QUICK_REFERENCE.md`.

Pinned to Prisma 6.19.3 → classic `prisma-client-js` generator, `@prisma/client` import,
automatic `.env` loading. Removed the generated `prisma.config.ts`.

## Decision: `toast` component → `sonner`

The shadcn registry deprecated `toast` in favor of `sonner` (same purpose: notifications).
Installed `sonner` instead of `toast`; `next-themes` came along as its dependency.

## Fix: shadcn wrote OKLCH variables but the Tailwind config expects HSL

shadcn 2.1.8's `init` pulled OKLCH color variables from the (updated) registry, while the
generated `tailwind.config.ts` wraps them as `hsl(var(--token))` → `hsl(oklch(...))`, which is
invalid CSS and would leave all components unstyled. Rewrote `globals.css` with the canonical
**Slate** HSL values (which, by design, match CLAUDE.md's `muted` ≈ slate-500 `#64748B` and
`border` ≈ slate-200 `#E2E8F0`) and consolidated the Horizonte palette + Inter font in
`tailwind.config.ts`.

## Decision: Environment variable split

- `.env` (gitignored) → `DATABASE_URL`. Read automatically by both Prisma 6 and Next.js.
- `.env.local` (gitignored) → `NEXTAUTH_SECRET`, `NEXTAUTH_URL`, `ANTHROPIC_API_KEY`.
- `.env.example` (committed) → template with all four variables.

This keeps the documented `npx prisma migrate dev` / `npx prisma studio` commands working
without extra tooling (e.g., dotenv-cli).
