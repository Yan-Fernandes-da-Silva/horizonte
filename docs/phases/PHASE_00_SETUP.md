# Phase 00 — Project Setup

**Status**: Concluída
**Estimated time**: 30–60 minutes
**Prerequisites**: None (this is the first phase)

---

## What this phase accomplishes

- Initialize Next.js 14 project with TypeScript and App Router in the current directory
- Install and configure all core dependencies
- Set up Tailwind CSS
- Set up shadcn/ui component library
- Configure Prisma with a local PostgreSQL database
- Create the full folder structure
- Create `.env.example` and `.env.local` template
- Set up the initial Prisma schema (User model only)
- Initialize Git and create first commit

---

## Important notes before starting

- The current directory (`C:\Users\yanfe\Desktop\Horizonte\`) already contains `data/` and `docs/` folders. These must NOT be deleted or moved.
- Run `npx create-next-app@latest .` with a dot (current directory). Confirm overwrite if prompted (it will only touch configuration files, not `data/` or `docs/`).
- Use **npm** as the package manager (not yarn or pnpm).
- All prompts from `create-next-app` should be answered as follows:
  - TypeScript: **Yes**
  - ESLint: **Yes**
  - Tailwind CSS: **Yes**
  - `src/` directory: **Yes**
  - App Router: **Yes**
  - Customize default import alias: **No**

---

## Step-by-step tasks

### Step 1 — Initialize Next.js

```bash
npx create-next-app@latest . --typescript --eslint --tailwind --src-dir --app --no-import-alias
```

### Step 2 — Install additional dependencies

```bash
npm install next-auth@4 @prisma/client prisma bcryptjs framer-motion recharts react-hook-form zod @hookform/resolvers lucide-react clsx tailwind-merge class-variance-authority

npm install --save-dev @types/bcryptjs
```

### Step 3 — Install and initialize shadcn/ui

```bash
npx shadcn@latest init
```

When prompted:
- Style: **Default**
- Base color: **Slate**
- CSS variables: **Yes**

Then install the initial set of components:

```bash
npx shadcn@latest add button card badge avatar input label textarea select tabs progress toast dialog dropdown-menu separator skeleton
```

### Step 4 — Initialize Prisma

```bash
npx prisma init --datasource-provider postgresql
```

### Step 5 — Create folder structure

Create all folders and placeholder files as defined in `CLAUDE.md` under "Project Folder Structure".
Key folders to create manually:
- `src/components/layout/`
- `src/components/features/vocational-test/`
- `src/components/features/labor-market/`
- `src/components/features/career-plan/`
- `src/components/shared/`
- `src/lib/validations/`
- `src/types/`
- `src/hooks/`
- `scripts/etl/`
- `public/images/`

Each empty folder should contain a `.gitkeep` file.

### Step 6 — Configure Tailwind with design tokens

Edit `tailwind.config.ts` to extend the theme with Horizonte's color palette:

```typescript
// Colors to add under theme.extend.colors:
ocean: {
  DEFAULT: '#0A2342',
  50: '#E8EEF5',
  100: '#C5D4E6',
  500: '#1B4F8A',
  900: '#0A2342',
},
sky: {
  DEFAULT: '#00B4D8',
  light: '#90E0EF',
  lighter: '#CAF0F8',
},
gold: {
  DEFAULT: '#F4A261',
  dark: '#E76F51',
},
sand: {
  DEFAULT: '#FAF5EB',
  dark: '#F0E6C8',
},
```

Also configure:
- Font family: Inter (via `next/font/google`)
- Border radius: extend with `2xl: '16px'` and `3xl: '24px'`

### Step 7 — Set up initial Prisma schema

Write the initial `prisma/schema.prisma` with:

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        String   @id @default(cuid())
  name      String
  email     String   @unique
  password  String
  avatar    String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

### Step 8 — Configure NextAuth.js

Create `src/lib/auth.ts` with NextAuth v4 configuration using CredentialsProvider.
Create `src/app/api/auth/[...nextauth]/route.ts`.

### Step 9 — Create Prisma client singleton

Create `src/lib/db.ts` with the Prisma client singleton pattern for Next.js.

### Step 10 — Configure environment files

Create `.env.example`:
```env
# Database
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/horizonte"

# NextAuth
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"

# AI (used in Phase 09)
ANTHROPIC_API_KEY=""
```

Create `.env.local` (same content with actual local values — this file is gitignored).
The local PostgreSQL database should be named `horizonte`.

### Step 11 — Configure .gitignore

Ensure these are in `.gitignore`:
```
.env.local
.env*.local
node_modules/
.next/
data/
```

> **Important**: The `data/` folder must be gitignored because the files are too large for GitHub.

### Step 12 — Run database migration

```bash
npx prisma migrate dev --name init
```

### Step 13 — Verify the setup

```bash
npm run dev
```

The site should start at `http://localhost:3000` with the default Next.js page.

### Step 14 — Initialize Git and first commit

```bash
git init
git add .
git commit -m "feat: configuração inicial do projeto Horizonte"
```

---

## Acceptance Criteria

Before considering this phase complete, verify:

- [ ] `npm run dev` starts without errors
- [ ] Site opens at `http://localhost:3000`
- [ ] `npx prisma studio` opens the database viewer
- [ ] The `User` model exists in the database
- [ ] `data/` and `docs/` folders are intact and untouched
- [ ] `.env.local` exists and is not tracked by git (`git status` should not show it)
- [ ] All folders from the structure in `CLAUDE.md` exist
- [ ] `shadcn/ui` components are installed (check `src/components/ui/` folder)
- [ ] First git commit exists (`git log --oneline`)

---

## Terminal prompt for Yan to paste

```
Leia o CLAUDE.md para entender o projeto e depois leia docs/phases/PHASE_00_SETUP.md.

Vamos executar a Fase 00 - Configuração Inicial.

IMPORTANTE:
- Estamos na pasta C:\Users\yanfe\Desktop\Horizonte\ que já contém as pastas data/ e docs/. Não as toque.
- Use npm (não yarn nem pnpm).
- Node.js v24.16.0 está instalado.
- PostgreSQL está rodando localmente.

Antes de executar qualquer passo, me mostre:
1. A lista completa de dependências que vai instalar e por que cada uma é necessária
2. A estrutura de pastas que será criada
3. O conteúdo do arquivo .env.example

Aguarde minha aprovação antes de prosseguir.
```
