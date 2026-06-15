# Architectural Decisions Log

> This file records key decisions made during the development of Horizonte.
> Claude updates this file when significant choices are made.
> Format: date, decision, rationale, alternatives considered.

---

## 001 — June 2026 — Tech Stack

**Decision**: Next.js 14 (App Router) + TypeScript + PostgreSQL + Prisma + NextAuth v4

**Rationale**:
- Next.js App Router is the current standard for full-stack React apps
- TypeScript prevents bugs and improves code quality
- PostgreSQL is ideal for structured, relational government data
- Prisma provides type-safe database queries and easy migrations
- NextAuth v4 is stable and well-documented for email/password auth

**Alternatives considered**:
- Supabase: Rejected because it introduces lock-in and we want full control over the DB schema
- MongoDB: Rejected because our data is highly structured and relational (CBO hierarchy, CNAE, etc.)
- Clerk: Rejected because it's a third-party auth service; we want email/password from our own DB

---

## 002 — June 2026 — ETL Strategy

**Decision**: Pre-calculate aggregated metrics; store only summaries in the database

**Rationale**:
- Raw RAIS files are potentially multiple GB — cannot store raw data
- Pre-calculated metrics are fast to query (no heavy computation at request time)
- The dataset doesn't change frequently (monthly for CAGED, annually for RAIS)

**Alternatives considered**:
- Store raw data: Rejected due to storage cost and query performance
- Real-time government API: Rejected because it doesn't exist in a suitable form

---

## 003 — June 2026 — UI Component Library

**Decision**: shadcn/ui (built on Radix UI + Tailwind CSS)

**Rationale**:
- shadcn/ui is the current industry standard for Next.js + Tailwind projects
- Components are accessible by default (Radix UI handles keyboard navigation, ARIA)
- Components are customizable (code is copied into the project, not a black box)
- Works seamlessly with Tailwind's utility classes

**Alternatives considered**:
- Material UI: Rejected due to its own styling system conflicting with Tailwind
- Pure Tailwind (no component library): Rejected to avoid reinventing common UI patterns

---

## 004 — June 2026 — AI for Career Plan

**Decision**: Use Anthropic Claude API (claude-sonnet model) for roadmap generation

**Rationale**:
- The project already uses Claude (via Claude Code), maintaining the same ecosystem
- Claude is excellent at structured output (JSON) and career advice
- Pay-per-use pricing is cost-effective for an academic project

**Alternatives considered**:
- OpenAI GPT: Rejected — no strong reason to switch, Claude is the chosen tool
- Template-based roadmap (no AI): Kept as fallback in case API fails

---

## 005 — June 2026 — Database Hosting

**Decision**: Local PostgreSQL for development; Railway for production

**Rationale**:
- Railway has a generous free tier for small projects
- Simple setup via web UI
- Easy to connect from both local ETL scripts and Vercel

**Alternatives considered**:
- Supabase: Good option but slightly more complex than needed
- Vercel Postgres (Neon): Good option, consider if Railway costs are too high
- PlanetScale: MySQL-based, Prisma works but requires different syntax

---

_New decisions are added below as the project progresses._
