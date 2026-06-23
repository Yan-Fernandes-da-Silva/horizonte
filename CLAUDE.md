# Horizonte — Claude Code Briefing

> **This file is read automatically by Claude Code at the start of every session.**
> Do NOT delete, rename or move this file. It must stay at the project root.

---

## Project Identity

| Field       | Value                                                    |
|-------------|----------------------------------------------------------|
| Name        | Horizonte                                                |
| Slogan      | "Acompanhamento inteligente da sua carreira profissional"|
| Logo        | Timão (ship's wheel / nautical compass)                  |
| Type        | Academic project — non-profit, public web application    |
| UI Language | Brazilian Portuguese (PT-BR)                             |
| Code Language | American English (EN-US)                               |

---

## Developer & Working Dynamic

**Yan** is the project owner. He does not program. He guides, evaluates, and approves.
This project follows a **vibe coding** dynamic:

| Yan does                                     | Claude does                                          |
|----------------------------------------------|------------------------------------------------------|
| Orient and request improvements               | Propose solutions with options before implementing   |
| Provide base material and data                | Implement after approval                             |
| Evaluate if the site meets expectations       | Ask for feedback on architectural decisions          |
| Approve or reject implementations             | Adapt quickly to changes                             |
| Clarify doubts about architecture             | Document decisions in `docs/decisions/`              |

---

## Mandatory Working Rules

1. **Propose before implementing** — On any architectural decision, show a plan/structure and wait for Yan's approval.
2. **Never change what already works** without explicit approval from Yan.
3. **One phase at a time** — Only implement what the current phase file specifies.
4. **Explain in plain Portuguese** — At the end of each task, summarize what was done in simple, non-technical language.
5. **Ask when unsure** — Never assume Yan's intent on UX/UI or business logic decisions.
6. **Document decisions** — Save important decisions in `docs/decisions/` with date and rationale.
7. **Check the phase file** — Before starting any session, read the corresponding `docs/phases/PHASE_XX_*.md`.
8. **Show before creating** — For new components or pages, describe the visual/structure in words or pseudocode before writing real code.
9. **Git commits** — After completing a phase or major step, create a descriptive git commit in Portuguese.

---

## Tech Stack

> Do NOT change any technology without Yan's explicit approval.

| Layer              | Technology                          | Notes                                  |
|--------------------|-------------------------------------|----------------------------------------|
| Framework          | Next.js 14 (App Router)             | TypeScript, strict mode                |
| Language           | TypeScript                          | Strict mode enabled                    |
| Styling            | Tailwind CSS v3                     | Custom design tokens configured        |
| UI Components      | shadcn/ui                           | Built on Radix UI + Tailwind           |
| Database (dev)     | PostgreSQL (local)                  | Running on localhost:5432              |
| Database (prod)    | Railway (PostgreSQL)                | Configured in Phase 10                 |
| ORM                | Prisma                              | Schema at `prisma/schema.prisma`       |
| Authentication     | NextAuth.js v4                      | CredentialsProvider — email/password   |
| Charts             | Recharts                            | For dashboards and data visualizations |
| Forms              | React Hook Form + Zod               | Validation and type-safe forms         |
| Icons              | Lucide React                        | Included with shadcn/ui                |
| Animations         | Framer Motion                       | Subtle wave-like and fade animations   |
| Node.js            | v24.16.0                            | Do not change                          |
| Package Manager    | npm                                 | Do not use yarn or pnpm                |
| Version Control    | Git + GitHub                        | Remote repo at Yan's GitHub            |
| Dev Deployment     | localhost:3000                      |                                        |
| Prod Deployment    | Vercel (frontend) + Railway (DB)    | Configured in Phase 10                 |
| OS                 | Windows 11 (PowerShell)             | Use PowerShell-compatible commands     |

---

## Project Folder Structure

```
C:\Users\yanfe\Desktop\Horizonte\        ← Project root (run Claude Code from here)
├── CLAUDE.md                             ← This file (DO NOT MOVE)
├── .env.local                            ← Local secrets (never commit)
├── .env.example                          ← Template for env vars (commit this)
├── .gitignore
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── next.config.ts
│
├── docs/                                 ← Project documentation (READ-ONLY for Claude)
│   ├── HORIZONTE.md                      ← Full project vision
│   ├── QUICK_REFERENCE.md                ← Yan's cheat sheet
│   ├── phases/                           ← One file per development phase
│   │   ├── PHASE_00_SETUP.md
│   │   ├── PHASE_01_DESIGN_SYSTEM.md
│   │   └── ...
│   └── decisions/                        ← Architectural decisions log (Claude writes here)
│
├── data/                                 ← Raw government data files (READ-ONLY, never import)
│   ├── cbo/
│   ├── cnae/
│   ├── caged/
│   ├── rais/
│   ├── qbq/
│   └── qualification/
│
├── scripts/
│   └── etl/                              ← ETL scripts to process data/  → prisma/seed
│
├── prisma/
│   ├── schema.prisma                     ← Database schema
│   └── seed.ts                           ← Database seeder
│
├── public/
│   ├── images/
│   └── fonts/
│
└── src/
    ├── app/                              ← Next.js App Router
    │   ├── (public)/                     ← Routes accessible without login
    │   │   └── page.tsx                  ← Landing page
    │   ├── (auth)/                       ← Auth pages (login, register, forgot)
    │   │   ├── login/
    │   │   ├── register/
    │   │   └── forgot-password/
    │   ├── (dashboard)/                  ← Protected routes (require login)
    │   │   ├── home/
    │   │   ├── vocational-test/
    │   │   ├── labor-market/
    │   │   └── career-plan/
    │   ├── api/                          ← API route handlers
    │   │   ├── auth/
    │   │   └── [...]/
    │   ├── layout.tsx
    │   └── globals.css
    │
    ├── components/
    │   ├── ui/                           ← shadcn/ui components (auto-generated)
    │   ├── layout/                       ← Header, Footer, Sidebar
    │   ├── features/                     ← Feature-specific components
    │   │   ├── vocational-test/
    │   │   ├── labor-market/
    │   │   └── career-plan/
    │   └── shared/                       ← Reusable components used across features
    │
    ├── lib/
    │   ├── auth.ts                       ← NextAuth config
    │   ├── db.ts                         ← Prisma client singleton
    │   ├── utils.ts                      ← shadcn/ui utilities (cn function)
    │   └── validations/                  ← Zod schemas
    │
    ├── types/
    │   └── index.ts                      ← Global TypeScript type definitions
    │
    └── hooks/
        └── *.ts                          ← Custom React hooks
```

---

## Design System

### Color Palette

| Token      | Hex       | Usage                                   |
|------------|-----------|----------------------------------------|
| `ocean`    | `#0A2342` | Primary — dark deep ocean blue          |
| `sky`      | `#00B4D8` | Primary — light blue / cyan             |
| `sky-light`| `#90E0EF` | Primary light variant                   |
| `gold`     | `#F4A261` | Accent / CTA highlight                  |
| `sun`      | `#E76F51` | Secondary accent / warnings             |
| `white`    | `#FFFFFF` | Base background                         |
| `sand`     | `#FAF5EB` | Secondary background / sections         |
| `muted`    | `#64748B` | Muted text / subtitles                  |
| `border`   | `#E2E8F0` | Borders / dividers                      |

### Visual Style Guidelines

- **Glassmorphism**: Subtle frosted glass effect on cards (`backdrop-blur-md`, semi-transparent backgrounds)
- **Motion**: Smooth, wave-like subtle animations (Framer Motion); nothing aggressive
- **Typography**: Inter (primary) — clean, modern, professional
- **Border radius**: `rounded-xl` (12px) to `rounded-2xl` (16px) — soft and friendly
- **Shadows**: Multi-layered soft shadows — no hard/sharp shadows
- **Gradients**: Ocean-to-sky natural gradients (horizontal or diagonal)
- **Illustrations**: Semi-flat style with nautical/horizon motifs

### Visual Concept

The visual language follows a **nautical horizon** theme:
- Ocean blue as the anchor color
- Sky blue for highlights and interactive elements
- Gold for CTAs and progress indicators
- Wave motifs and smooth motion throughout
- Mapas náuticos minimalistas as decorative background elements

---

## Data Sources Overview

| Source       | Description                          | Type      | Update   | Location               |
|--------------|--------------------------------------|-----------|----------|------------------------|
| CBO          | Brazilian Occupations Classification  | Static    | Rare     | `data/cbo/`            |
| CNAE 2.0     | National Economic Activities         | Static    | Rare     | `data/cnae/`           |
| QBQ          | Skills & Competencies Framework      | Static    | Rare     | `data/qbq/`            |
| CAGED        | Monthly job movement data            | Monthly   | Monthly  | `data/caged/`          |
| RAIS         | Annual employment records            | Annual    | Annual   | `data/rais/`           |
| Qualification| Technical & higher education courses | Static    | Periodic | `data/qualification/`  |

> **Important**: The `data/` folder contains raw government files. Claude must NEVER modify these files.
> ETL scripts in `scripts/etl/` read from `data/` and write to the database.
> Only pre-aggregated/calculated metrics are stored in the database — NOT raw data.

---

## Database Models Overview

```
User ─────────────────────────────────────────────────
  ├── VocationalTestSession (0 or 1 active + history)
  ├── FavoriteProfession[] (list of saved CBO codes)
  └── CareerPlan[]
        └── CareerTask[]

Static Data (seeded from ETL) ────────────────────────
  ├── CboOccupation (6-digit code + hierarchy)
  ├── CnaeActivity (subclass code + hierarchy)
  ├── QbqSkill (knowledge/skills/attitudes by occupation)
  └── Course (technical + higher education)

Market Data (pre-aggregated from CAGED + RAIS) ───────
  └── MarketMetrics (per occupation + region + period)
```

---

## Site Map

```
/ (Landing Page — public)
│
├── /auth/login
├── /auth/register
├── /auth/forgot-password
│
└── /home (requires login)
    ├── /vocational-test
    │   ├── /vocational-test/start
    │   ├── /vocational-test/[section]
    │   └── /vocational-test/results
    ├── /labor-market
    │   └── /labor-market/[occupationCode]
    └── /career-plan
        ├── /career-plan/start
        └── /career-plan/[planId]
```

---

## Phase Roadmap

| Phase | Name                         | Status  |
|-------|------------------------------|---------|
| 00    | Project Setup                | Concluída |
| 01    | Design System & Layout Base  | Concluída |
| 02    | Authentication               | Concluída |
| 03    | Landing Page                 | Concluída |
| 04    | Home Dashboard               | Concluída |
| 05    | ETL — Static Data            | Concluída |
| 06    | ETL — Market Data            | Concluída |
| 07    | Vocational Test              | Concluída |
| 08    | Labor Market                 | Concluída |
| 09    | Career Plan                  | Concluída |
| 10    | Deploy                       | Concluída |

---

## Current Phase

**Todas as 10 fases concluídas.** Site no ar: **https://horizonte-one.vercel.app** (Vercel + Railway).

**Last completed: PHASE 10 — Deploy** — app no Vercel (auto-deploy a cada `git push` na `main`), banco PostgreSQL no Railway (schema via `prisma db push`, dados via ETL). Variáveis de produção configuradas (`DATABASE_URL` público, `NEXTAUTH_SECRET`, `NEXTAUTH_URL=https://horizonte-one.vercel.app`). Verificado por teste e2e 18/18 (público, redirecionamentos, cadastro, login, páginas logadas) + 0 erros de console na landing. Detalhes em `docs/decisions/013-phase10-deploy.md`.

> **Pendência opcional:** `ANTHROPIC_API_KEY` ainda não configurada no Vercel → o Plano de Carreira roda em **modo básico (fallback)** até a chave ser adicionada. Passo a passo: `feedbacks/lembrete-chave-ia.md`.

Para mudanças futuras: editar o código → testar em `localhost:3000` → `git push origin main` → o Vercel redeploya sozinho (~2 min).
