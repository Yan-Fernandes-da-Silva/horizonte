# Phase 02 — Authentication (Register / Login / Password Recovery)

**Status**: Pending
**Estimated time**: 3–5 hours
**Prerequisites**: Phase 01 complete

---

## What this phase accomplishes

- Complete Prisma schema for User model with all needed fields
- Configure NextAuth.js v4 with CredentialsProvider (email + password)
- Create Register page with form validation
- Create Login page with form validation
- Create Forgot Password page (UI only — no real email sending for now)
- Set up protected route middleware
- Set up API routes for registration
- Test that the full auth flow works end-to-end

---

## Prisma Schema Update

Update `prisma/schema.prisma` — expand the User model:

```prisma
model User {
  id        String   @id @default(cuid())
  name      String
  email     String   @unique
  password  String   // bcrypt hashed
  avatar    String?  // URL or null (initials used as fallback)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // Relations (to be expanded in later phases)
  vocationalSessions  VocationalTestSession[]
  favoriteProfessions FavoriteProfession[]
  careerPlans         CareerPlan[]
}

// Placeholder models for future relations (empty for now)
model VocationalTestSession {
  id        String   @id @default(cuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  status    String   @default("not_started") // not_started | in_progress | completed
  answers   Json?
  results   Json?
  startedAt DateTime @default(now())
  completedAt DateTime?
}

model FavoriteProfession {
  id             String   @id @default(cuid())
  userId         String
  user           User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  occupationCode String
  createdAt      DateTime @default(now())

  @@unique([userId, occupationCode])
}

model CareerPlan {
  id             String   @id @default(cuid())
  userId         String
  user           User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  title          String
  occupationCode String?
  questionnaire  Json?
  roadmap        Json?
  status         String   @default("active")
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt

  tasks CareerTask[]
}

model CareerTask {
  id          String     @id @default(cuid())
  planId      String
  plan        CareerPlan @relation(fields: [planId], references: [id], onDelete: Cascade)
  title       String
  description String?
  category    String     // short_term | medium_term | long_term
  status      String     @default("pending") // pending | in_progress | completed
  dueDate     DateTime?
  sortOrder   Int        @default(0)
  createdAt   DateTime   @default(now())
  updatedAt   DateTime   @updatedAt
}
```

Run migration after schema update:
```bash
npx prisma migrate dev --name add-auth-and-relations
```

---

## Files to Create / Modify

### `src/lib/auth.ts` — NextAuth configuration

```typescript
// Configure NextAuth with:
// - CredentialsProvider
// - Authorize function: find user by email, compare bcrypt password
// - Session strategy: "jwt"
// - Custom pages: signIn: '/auth/login'
// - Callbacks: include user id in JWT and session
```

### `src/lib/validations/auth.ts` — Zod schemas

```typescript
// RegisterSchema: name (min 2), email (valid), password (min 8, 1 uppercase, 1 number), confirmPassword (must match)
// LoginSchema: email (valid), password (required)
// ForgotPasswordSchema: email (valid)
```

### `src/app/api/auth/[...nextauth]/route.ts` — NextAuth handler

### `src/app/api/auth/register/route.ts` — Registration endpoint

```typescript
// POST /api/auth/register
// 1. Validate body with RegisterSchema
// 2. Check if email already exists
// 3. Hash password with bcrypt (saltRounds: 12)
// 4. Create user in database
// 5. Return user (without password)
```

### `src/app/(auth)/login/page.tsx` — Login page

Visual layout:
```
┌─────────────────────────────────────────┐
│  ⚓ Horizonte                           │  ← centered logo + name
│                                         │
│  Bem-vindo de volta                     │  ← heading
│  Entre na sua conta para continuar      │  ← subtitle
│                                         │
│  ┌─────────────────────────────────┐    │
│  │ E-mail                          │    │
│  └─────────────────────────────────┘    │
│  ┌─────────────────────────────────┐    │
│  │ Senha                      👁   │    │  ← toggle show/hide
│  └─────────────────────────────────┘    │
│  [Esqueceu a senha?]                    │  ← link right-aligned
│                                         │
│  [      Entrar      ]                   │  ← gold button full width
│                                         │
│  Não tem conta? [Criar conta]           │
└─────────────────────────────────────────┘
```

Background: ocean → sky gradient.
Card: white with frosted glass effect, rounded-2xl, shadow.

### `src/app/(auth)/register/page.tsx` — Register page

Visual layout: similar card style.
Fields: Nome completo, E-mail, Senha, Confirmar senha.
Real-time validation (show errors below each field).
Submit: "Criar conta" gold button.
Already have account? Link to login.

### `src/app/(auth)/forgot-password/page.tsx` — Forgot password page

Single email field.
On submit: show a success message ("Se este e-mail estiver cadastrado, você receberá as instruções em breve.") — no actual email sent in MVP.

### `src/middleware.ts` — Route protection

```typescript
// Protected paths: /home/*, /vocational-test/*, /labor-market/*, /career-plan/*
// If not authenticated: redirect to /auth/login
// If authenticated and on /auth/*: redirect to /home
```

---

## UX Details

- All form errors displayed below the relevant field in red
- Loading state on submit buttons (spinner + disabled)
- Password field has show/hide toggle icon
- "Enter" key submits forms
- After successful register: redirect to login with a success message
- After successful login: redirect to `/home`
- After logout: redirect to `/`

---

## Acceptance Criteria

- [ ] Can register a new user with name, email and password
- [ ] Password is stored as bcrypt hash (verify in Prisma Studio)
- [ ] Cannot register with an email that already exists (shows error)
- [ ] Can log in with correct credentials
- [ ] Wrong credentials show error message (do not specify which field is wrong — security)
- [ ] After login, redirected to `/home`
- [ ] Visiting `/home` without login redirects to `/auth/login`
- [ ] Visiting `/auth/login` while logged in redirects to `/home`
- [ ] Header shows user name and avatar (initials) after login
- [ ] Logout works (clears session, redirects to `/`)
- [ ] All form validations work correctly
- [ ] No TypeScript errors or console errors

---

## Terminal prompt for Yan to paste

```
Leia o CLAUDE.md e depois leia docs/phases/PHASE_02_AUTH.md.

Vamos executar a Fase 02 - Autenticação.

Antes de criar qualquer arquivo, me mostre:
1. Um esboço visual das telas de login e cadastro
2. As regras de validação que serão aplicadas nos formulários
3. Como a senha do usuário será protegida no banco

Aguarde minha aprovação antes de implementar.
Ao finalizar, me mostre como posso testar que o login está funcionando corretamente.
```
