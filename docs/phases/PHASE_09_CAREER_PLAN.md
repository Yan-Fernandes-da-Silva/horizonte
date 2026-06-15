# Phase 09 — Career Plan (Plano de Carreira)

**Status**: Pending
**Estimated time**: 6–10 hours
**Prerequisites**: Phase 07 and 08 complete

---

## What this phase accomplishes

Build the complete Career Plan feature:
- A short SMART questionnaire (6 questions)
- AI-powered roadmap generation (using Anthropic Claude API)
- An interactive, editable roadmap view
- Task management (CRUD: add, edit, complete, remove tasks)
- Progress dashboard and gamification elements

---

## Anthropic API Integration

This feature uses the Anthropic Claude API to generate personalized roadmaps.

Add to `.env.local`:
```
ANTHROPIC_API_KEY=sk-ant-...
```

Install the SDK:
```bash
npm install @anthropic-ai/sdk
```

Create `src/lib/ai/generate-roadmap.ts`:
```typescript
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic();

async function generateCareerRoadmap(context: RoadmapContext): Promise<RoadmapData> {
  // Build a detailed prompt including:
  // - User's questionnaire answers (6 SMART questions)
  // - Top 3 RIASEC types (if vocational test completed)
  // - Target occupation name and code (if selected)
  // - Current date for timeline calculation

  // Request structured JSON output from Claude
  // Parse and validate the response
  // Return typed RoadmapData
}
```

**Prompt structure for the AI:**
```
Você é um especialista em orientação profissional e carreira.
Com base nas informações abaixo, gere um roadmap de carreira personalizado.

PERFIL DO USUÁRIO:
- Momento profissional: [resposta pergunta 1]
- Prazo para decisão: [resposta pergunta 2]
- Principal objetivo: [resposta pergunta 3]
- Principais obstáculos: [resposta pergunta 4]
- Situação atual: [resposta pergunta 5]
- Tempo disponível por semana: [resposta pergunta 6]
- Perfil vocacional (RIASEC): [tipos dominantes, se disponível]
- Profissão alvo: [nome da profissão, se selecionada]

Gere um roadmap no seguinte formato JSON:
{
  "summary": "Uma ou duas frases descrevendo o contexto do usuário",
  "startingPoint": "Onde o usuário está hoje",
  "destination": "Onde quer chegar",
  "shortTerm": [
    { "title": "...", "description": "...", "category": "short_term", "durationLabel": "Semanas 1-4" }
  ],
  "mediumTerm": [...],
  "longTerm": [...],
  "learningTrails": {
    "courses": [...],
    "books": [...],
    "projects": [...],
    "certifications": [...]
  },
  "recommendations": {
    "networking": "...",
    "languages": "...",
    "portfolio": "...",
    "habits": "..."
  },
  "futureCareers": ["Cargo futuro 1", "Cargo futuro 2", "Cargo futuro 3"]
}

Seja específico, realista e motivador. Use o contexto do mercado de trabalho brasileiro.
Responda APENAS com o JSON, sem texto adicional.
```

---

## Pages to Create

### `/career-plan` — Entry / list page

- If no plans: full-page CTA with explanation + "Criar meu plano" button
- If has plans: list of plans (cards) + "Criar novo plano" button
  - Each plan card: title, creation date, % complete, "Ver plano" button

### `/career-plan/start` — Questionnaire page

6-question form (one question per step or all at once):

```
┌──────────────────────────────────────────────────────┐
│ Plano de Carreira    [━━━━━━━━━━░░░░░░░░]  Passo 3/6 │
│                                                      │
│ O que você mais busca em uma nova carreira?          │
│                                                      │
│  ○ Mais satisfação / propósito                      │
│  ○ Mais dinheiro                                    │
│  ○ Mais estabilidade                                │
│  ○ Mais flexibilidade (horário / remoto)            │
│  ○ Crescimento rápido                               │
│  ○ Mais autonomia                                   │
│                                                      │
│          [← Voltar]          [Próximo →]             │
└──────────────────────────────────────────────────────┘
```

See full 6 questions in `docs/HORIZONTE.md` under "CARREIRA PROFISSIONAL → Questionário".

After the 6th question:
- Show: "Gerando seu roadmap personalizado..." (loading screen with animation)
- Call Anthropic API with the user's answers + vocational test results (if available)
- On completion: redirect to `/career-plan/[planId]`

### `/career-plan/[planId]` — Roadmap view & edit page

**Layout:**
```
┌──────────────────────────────────────────────────────┐
│ Meu Plano de Carreira                    [⚙️ Editar] │
│ "Transição para Análise de Dados"                    │
│                                                      │
│ ──── Sua jornada ────────────────────────────────── │
│ Onde você está: [summary card]                       │
│ Onde quer chegar: [destination card]                 │
└──────────────────────────────────────────────────────┘

Progresso geral: 7/24 tarefas  ████░░░░░░░  29%

┌─── Curto Prazo (0-12 meses) ──────────────────────┐
│ ✅ [Tarefa 1 concluída]                            │
│ ✅ [Tarefa 2 concluída]                            │
│ 🔵 [Tarefa 3 em andamento]           [✏️] [🗑️]  │
│ ○  [Tarefa 4 pendente]               [✏️] [🗑️]  │
│ [+ Adicionar tarefa]                               │
└───────────────────────────────────────────────────┘

┌─── Médio Prazo (1-3 anos) ────────────────────────┐
│ ...                                               │
└───────────────────────────────────────────────────┘

┌─── Longo Prazo (3+ anos) ─────────────────────────┐
│ ...                                               │
└───────────────────────────────────────────────────┘

┌─── Trilhas de Aprendizado ─────────────────────────┐
│ Cursos │ Livros │ Projetos │ Certificações          │
│ [tab content]                                      │
└───────────────────────────────────────────────────┘

┌─── Recomendações Estratégicas ─────────────────────┐
│ 🤝 Networking: ...                                 │
│ 🌍 Idiomas: ...                                    │
│ 💼 Portfólio: ...                                  │
│ 💡 Hábitos: ...                                    │
└───────────────────────────────────────────────────┘

┌─── Cargos Futuros Possíveis ───────────────────────┐
│ [Badge] Cargo 1  [Badge] Cargo 2  [Badge] Cargo 3  │
└───────────────────────────────────────────────────┘
```

**Task interactions:**
- Click task: mark as completed/pending (toggle)
- [✏️] icon: inline edit — click to edit title/description in place
- [🗑️] icon: delete task (with confirmation dialog)
- [+ Adicionar tarefa]: opens small inline form to add task to that section
- Task drag-and-drop reordering (within same section)

**Gamification elements:**
- Progress bar: total tasks completed / total tasks
- Streak counter: "X dias seguidos com atividade" (tracked by last interaction date)
- Achievement badges: "Primeiros passos" (first task done), "Meio caminho" (50%), "Destino alcançado" (100%)

---

## API Routes

- `POST /api/career-plan/create` — save questionnaire answers + call AI + save roadmap
- `GET /api/career-plan/[planId]` — get plan with all tasks
- `PUT /api/career-plan/[planId]/task/[taskId]` — update task (status, title, description)
- `POST /api/career-plan/[planId]/task` — add new task
- `DELETE /api/career-plan/[planId]/task/[taskId]` — delete task

---

## Error Handling for AI Generation

If the Anthropic API call fails:
- Show error message: "Houve um problema ao gerar seu roadmap. Tente novamente."
- Retry button
- Fallback: offer a generic template roadmap based on questionnaire answers (no AI needed)

---

## Acceptance Criteria

- [ ] Questionnaire completes in 6 steps with progress indicator
- [ ] Loading screen shows while AI generates the roadmap
- [ ] Roadmap page renders with all sections (short/medium/long term)
- [ ] Tasks can be marked as complete/incomplete
- [ ] Tasks can be edited inline
- [ ] Tasks can be deleted (with confirmation)
- [ ] New tasks can be added to any section
- [ ] Progress percentage updates in real time
- [ ] Learning trails section displays courses, books, projects, certifications
- [ ] Strategic recommendations section displays
- [ ] If API fails, user sees a friendly error with retry option

---

## Terminal prompt for Yan to paste

```
Leia o CLAUDE.md e depois leia docs/phases/PHASE_09_CAREER_PLAN.md.

Vamos executar a Fase 09 - Plano de Carreira.

Antes de implementar, me mostre:
1. O prompt exato que será enviado para a API da IA (Claude) para gerar o roadmap
2. Um exemplo de roadmap que a IA poderia gerar (simule uma resposta)
3. Como ficará a página de edição de tarefas

Aguarde minha aprovação antes de implementar.
IMPORTANTE: Preciso configurar a variável ANTHROPIC_API_KEY antes de testar esta fase.
Me lembre disso antes de começar.
```
