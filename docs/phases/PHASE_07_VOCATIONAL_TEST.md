# Phase 07 — Vocational Test

**Status**: Pending
**Estimated time**: 8–12 hours
**Prerequisites**: Phase 05 complete (CBO and Courses must be seeded)

---

## What this phase accomplishes

Build the complete vocational test feature:
- The questionnaire (multi-section, mixed question types)
- Progress saving (user can pause and resume)
- Score calculation engine (RIASEC, MI, GOPC)
- Results page with charts and compatible professions/courses

---

## Test Structure

The test is divided into 4 sections:

| Section | Framework | Questions | Focus |
|---|---|---|---|
| 1 | RIASEC (Holland) | ~18 questions | 6 personality types × 3 questions each |
| 2 | Inteligências Múltiplas | ~16 questions | 8 intelligences × 2 questions each |
| 3 | GOPC | ~12 questions | Context, values, motivations, environment |
| 4 | Análise Pessoal | ~8 questions | Self-assessment, obstacles, time |
| **Total** | | **~54 questions** | |

---

## Question Types

The test must mix these types (do not use only Likert scale):

| Type | Code | Description | UI |
|---|---|---|---|
| Likert | `likert` | 5-point scale: Discordo totalmente → Concordo totalmente | 5 radio buttons |
| Multi-select | `multi_select` | Choose all that apply from a list | Checkboxes |
| Single-select | `single_select` | Choose one from a list | Radio buttons or option cards |
| Rank order | `rank` | Drag to order items by preference | Drag-and-drop list |
| Visual choice | `visual` | Choose images representing environments/activities | Image grid (2×2 or 3×2) |
| Like/Dislike | `like_dislike` | For each item: ❤️ Like / 👎 Dislike / ➡️ Neutral | Swipe-style or icon buttons |

---

## Complete Question Bank

Claude must design the full question bank. Use the examples from `docs/HORIZONTE.md` as inspiration.
The question bank should be stored as a TypeScript constant in `src/lib/vocational-test/questions.ts`.

Each question object:

```typescript
type Question = {
  id: string;                // unique identifier
  section: 'riasec' | 'mi' | 'gopc' | 'personal';
  type: QuestionType;
  text: string;              // the question text
  options?: Option[];        // for likert, single, multi, rank, like_dislike
  images?: ImageOption[];    // for visual type
  riasecType?: 'R'|'I'|'A'|'S'|'E'|'C';  // which RIASEC type this measures
  miType?: string;           // which intelligence this measures
  maxSelections?: number;    // for multi_select
  weight?: number;           // scoring weight (default 1)
};
```

**RIASEC types to measure:**
- R = Realista (likes working with hands, tools, machines)
- I = Investigativo (likes analyzing, researching, solving problems)
- A = Artístico (likes creativity, art, self-expression)
- S = Social (likes helping, teaching, caring for people)
- E = Empreendedor (likes leading, persuading, managing)
- C = Convencional (likes organizing, data, systems, following rules)

**MI types to measure:**
- Linguística, Lógico-Matemática, Espacial, Musical,
- Corporal-Cinestésica, Naturalista, Interpessoal, Intrapessoal

---

## RIASEC → CBO Occupation Mapping

A mapping table that links RIASEC profile combinations to CBO occupation families.
This is stored as a JSON constant or in the database.

Example mapping logic:
```
Profile: R (dominant) + I (secondary) → Occupations in families: 211x (scientists), 312x (technicians)...
Profile: S (dominant) + A (secondary) → Occupations in families: 231x (teachers), 261x (artists)...
```

Claude should build a complete mapping table based on CBO family descriptions and RIASEC theory.

---

## Scoring Engine (`src/lib/vocational-test/scoring.ts`)

```typescript
function calculateResults(answers: Answer[]): TestResults {
  // RIASEC score: for each type (R,I,A,S,E,C), sum weighted scores
  // MI score: for each intelligence, sum weighted scores
  // GOPC profile: map categorical answers to profile labels
  // Return: { riasec, mi, gopc, timestamp }
}

function getCompatibleOccupations(results: TestResults): CboOccupation[] {
  // Based on top 3 RIASEC types, query database for compatible occupation families
  // Return top 20-30 most compatible occupations
}

function getCompatibleCourses(results: TestResults): Course[] {
  // Based on top RIASEC + MI types, return compatible courses by type
  // Return: technical, technological, graduate grouped
}
```

---

## Pages to Create

### `/vocational-test` — Entry page
- If not started: intro + "Começar teste" button
- If in progress: "Continuar de onde parou" + % progress + "Recomeçar" option
- If completed: "Ver resultados" + "Refazer o teste"

### `/vocational-test/[section]` — Active test page

**Layout:**
```
┌─────────────────────────────────────────────────────────────┐
│ Teste Vocacional          [Seção 1/4: RIASEC]     45% ████ │  ← progress
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                                                             │
│ Questão 12 de 18                                           │
│                                                             │
│ Prefiro trabalhar com ferramentas e                         │
│ equipamentos do que com pessoas.                            │
│                                                             │
│  ○ Discordo totalmente                                     │
│  ○ Discordo                                                │
│  ○ Nem concordo nem discordo                               │
│  ○ Concordo                                                │
│  ● Concordo totalmente                                     │
│                                                             │
│               [← Anterior]        [Próxima →]              │
└─────────────────────────────────────────────────────────────┘
```

- Auto-save answer to database after each question
- "Next" button only activates after an answer is selected
- Can go back to previous questions
- Section name and progress bar update in real time
- On section complete: transition animation + "Iniciar próxima seção" screen

### `/vocational-test/results` — Results page

**Layout (top to bottom):**

1. **Hero**: "Seu perfil profissional está pronto! 🎉"

2. **RIASEC Results** (Radar/Spider Chart):
   - 6-axis chart with scores for each type
   - Below chart: top 3 types highlighted with name + description card each
   - Example: "Seu perfil dominante é **Investigativo** — você tem inclinação para análise, pesquisa e resolução de problemas complexos."

3. **Inteligências Múltiplas** (Horizontal Bar Chart):
   - 8 bars showing score for each intelligence
   - Top 3 highlighted with description

4. **Perfil GOPC** (Cards):
   - 3-4 cards summarizing context, values and motivations from GOPC answers

5. **Profissões Compatíveis** (List/Cards):
   - Heading: "Profissões mais compatíveis com seu perfil"
   - Cards showing: CBO code, occupation name, brief description
   - Each card: [❤️ Favoritar] button + [📊 Ver no Mercado] button
   - Filter by: area, education required
   - Sorted by compatibility score

6. **Qualificações Compatíveis** (Tabs):
   - Tab: Graduação | Tecnólogo | Técnico
   - List of compatible courses for each type

7. **CTA**: "Criar meu Plano de Carreira" → `/career-plan/start`

---

## Data Flow

```
User answers question → save to VocationalTestSession.answers (JSON)
User completes test → run scoring engine → save results to VocationalTestSession.results
Results page → fetch session → display charts and compatible professions
User clicks "Favoritar" → create FavoriteProfession record
```

---

## API Routes

- `POST /api/vocational-test/start` — create new session
- `PUT /api/vocational-test/[sessionId]/answer` — save answer
- `POST /api/vocational-test/[sessionId]/complete` — finalize and calculate results
- `GET /api/vocational-test/results` — get current user's latest completed session

---

## Acceptance Criteria

- [ ] All 54 questions display correctly across all 4 sections
- [ ] All 6 question types work correctly (likert, multi-select, rank, visual, like/dislike)
- [ ] Progress bar updates correctly
- [ ] User can pause the test and resume from where they left off
- [ ] Answers are saved to database after each question
- [ ] Scoring engine produces RIASEC and MI scores correctly
- [ ] Results page loads with all charts
- [ ] Radar chart shows 6 RIASEC dimensions
- [ ] Bar chart shows 8 MI dimensions
- [ ] Compatible professions list shows at least 10 results
- [ ] "Favoritar" button works and creates database record
- [ ] "Ver no Mercado" link navigates to labor market page for that occupation

---

## Terminal prompt for Yan to paste

```
Leia o CLAUDE.md e depois leia docs/phases/PHASE_07_VOCATIONAL_TEST.md.

Vamos executar a Fase 07 - Teste Vocacional.

IMPORTANTE: Esta é a fase mais complexa. Vamos fazê-la em etapas:

Etapa 7A - Banco de perguntas e motor de pontuação:
Antes de qualquer código, me apresente:
1. O banco completo de perguntas que você propõe (todas as ~54 perguntas com tipos e seções)
2. Como você calculará os resultados RIASEC e Inteligências Múltiplas
3. A lógica de correspondência entre o resultado e as profissões do CBO

Aguarde minha aprovação do banco de perguntas antes de continuar para o código.

Etapa 7B - Depois da aprovação do banco: desenvolva o questionário interativo.
Etapa 7C - Depois do questionário: desenvolva a página de resultados.
```
