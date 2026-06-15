# Phase 04 — Home Dashboard (Post-login)

**Status**: Pending
**Estimated time**: 3–4 hours
**Prerequisites**: Phase 03 complete

---

## What this phase accomplishes

Build the home dashboard page that users see after logging in. This page shows a personalized overview of their activity and progress in each of the three main features.

---

## Page Layout

```
┌─────────────────────────────────────────────────────────────┐
│ HEADER (post-login — from Phase 01)                         │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ Bom dia, Yan! 👋                                            │
│ Aqui está um resumo da sua jornada no Horizonte.            │
└─────────────────────────────────────────────────────────────┘

┌──────────────────┐ ┌──────────────────┐ ┌──────────────────┐
│ 🧭               │ │ 📊               │ │ 🗺️               │
│ Teste Vocacional │ │ Mercado de       │ │ Plano de         │
│                  │ │ Trabalho         │ │ Carreira         │
│ [status card]    │ │ [status card]    │ │ [status card]    │
└──────────────────┘ └──────────────────┘ └──────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ Dica rápida do dia                                          │
│ (rotating tip about career, market, vocational)             │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ FOOTER                                                      │
└─────────────────────────────────────────────────────────────┘
```

---

## Welcome Section

- Greeting: "Bom dia/Boa tarde/Boa noite, [nome do usuário]! 👋" (time-based greeting)
- Subtitle: "Aqui está um resumo da sua jornada no Horizonte."
- Background: subtle ocean gradient header strip

---

## Status Cards (Dynamic)

Each card has 3 possible states. The data for each state comes from the database.

### Card 1 — Teste Vocacional

**State A — Not started** (`session = null`):
- Icon: 🧭 (compass)
- Title: "Descubra seu perfil profissional"
- Description: "Responda ao teste vocacional e saiba quais profissões combinam com você."
- CTA button: "Fazer o teste" → `/vocational-test/start`
- Card color accent: sky blue

**State B — In progress** (`session.status = 'in_progress'`):
- Icon: 🧭
- Title: "Seu teste está incompleto"
- Description: "Você parou na seção [nome da seção]. Continue de onde parou!"
- Progress bar showing % completed
- CTA button: "Continuar o teste" → `/vocational-test/[current-section]`
- Card accent: gold (attention)

**State C — Completed** (`session.status = 'completed'`):
- Icon: ✅
- Title: "Teste concluído!"
- Description: "Seus tipos dominantes são: [tipo1], [tipo2], [tipo3]" (from RIASEC results)
- Two CTAs: "Ver resultados" (primary) + "Refazer o teste" (secondary, outline)
- Card accent: green/success

---

### Card 2 — Mercado de Trabalho

**State A — No favorites** (`favoriteProfessions.length === 0`):
- Icon: 📊
- Title: "Explore o mercado de trabalho"
- Description: "Pesquise por profissão e veja salários, demanda e tendências no Brasil."
- CTA button: "Explorar agora" → `/labor-market`
- Card accent: sky blue

**State B — Has favorites** (`favoriteProfessions.length > 0`):
- Icon: 📊
- Title: "[nome da profissão mais recentemente favoritada]"
- Show: 3 quick stats (ex: Salário médio BR, Situação do mercado, Rotatividade)
- CTA primary: "Ver dashboard completo" → `/labor-market/[code]`
- CTA secondary: "Comparar profissões" → `/labor-market` (if > 1 favorite)
- Badge showing total number of favorites: "3 profissões salvas"
- Card accent: sky blue

---

### Card 3 — Plano de Carreira

**State A — No plan** (`careerPlans.length === 0`):
- Icon: 🗺️
- Title: "Monte seu plano de carreira"
- Description: "Responda algumas perguntas e receba um roadmap personalizado para sua carreira."
- CTA button: "Criar meu plano" → `/career-plan/start`
- Card accent: gold

**State B — Has plan** (`careerPlans.length > 0`):
- Icon: 🗺️
- Title: "Plano: [title of most recent active plan]"
- Progress bar: X% de tarefas concluídas
- Next pending task: "Próxima tarefa: [task title]"
- CTA primary: "Ver meu roadmap" → `/career-plan/[planId]`
- Small status: last updated X days ago
- Card accent: gold

---

## "Dica do Dia" Section

A rotating tip card at the bottom of the page.
Tips rotate daily (can be hardcoded array, pick by `Date.getDay() % tips.length`).

Example tips (write 7, one per day of week):
- "Networking não é sobre quantidade de contatos, mas sobre qualidade das relações."
- "Profissionalizar seu LinkedIn pode aumentar em até 40% suas chances de ser encontrado por recrutadores."
- "Dominar um segundo idioma pode aumentar seu salário em até 20% em algumas áreas."
- "Soft skills como comunicação e resolução de conflitos são cada vez mais valorizadas."
- "Atualizar seu portfólio a cada 3 meses mantém você competitivo no mercado."
- "Definir metas SMART ajuda a transformar sonhos profissionais em planos concretos."
- "Aprender novas ferramentas tecnológicas em sua área pode ser o diferencial que você precisa."

Display: icon (💡), tip text, source/author (optional — can be omitted).

---

## Data Fetching

This page requires server-side data fetching (Next.js Server Component or Server Action):

```typescript
// Data needed for the home page:
const session = await getServerSession(); // NextAuth session
const user = session.user; // { id, name, email }

// Fetch in parallel:
const [vocationalSession, favoriteProfessions, careerPlans] = await Promise.all([
  prisma.vocationalTestSession.findFirst({ where: { userId: user.id }, orderBy: { startedAt: 'desc' } }),
  prisma.favoriteProfession.findMany({ where: { userId: user.id } }),
  prisma.careerPlan.findFirst({ where: { userId: user.id, status: 'active' }, include: { tasks: true } }),
]);
```

---

## Acceptance Criteria

- [ ] Page loads correctly after login
- [ ] Welcome greeting uses the correct time of day (bom dia/tarde/noite)
- [ ] Each card correctly shows the right state based on actual user data
- [ ] For a brand new user: all cards show State A (not started)
- [ ] Cards are responsive (stack on mobile, 3 columns on desktop)
- [ ] CTA buttons navigate to the correct pages
- [ ] "Dica do dia" shows a different tip each day
- [ ] No TypeScript or console errors

---

## Terminal prompt for Yan to paste

```
Leia o CLAUDE.md e depois leia docs/phases/PHASE_04_HOME.md.

Vamos executar a Fase 04 - Página Inicial (Dashboard Pós-Login).

Antes de implementar, me mostre:
1. Um esboço de como ficará a página completa
2. Para cada card de funcionalidade, mostre como ficará em cada um dos 3 estados possíveis
3. Como a página buscará os dados do banco

Aguarde minha aprovação antes de criar os arquivos.
```
