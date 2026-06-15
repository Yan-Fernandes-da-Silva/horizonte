# Phase 08 — Labor Market (Mercado de Trabalho)

**Status**: Pending
**Estimated time**: 8–12 hours
**Prerequisites**: Phase 06 complete (MarketMetrics must be populated)

---

## What this phase accomplishes

Build the complete Labor Market feature: an interactive dashboard where users can search for any occupation and explore detailed market data from real government sources.

---

## Pages to Create

### `/labor-market` — Search page

Main search/discovery page.

**Layout:**
```
┌────────────────────────────────────────────────────────┐
│  Mercado de Trabalho                                   │
│  Pesquise uma profissão ou área de atuação             │
│                                                        │
│  ┌──────────────────────────────────┐ [Pesquisar]     │
│  │ 🔍 Ex: Analista de sistemas...   │                  │
│  └──────────────────────────────────┘                  │
│                                                        │
│  Buscar por: [● Profissão (CBO)] [○ Área de atuação]  │
└────────────────────────────────────────────────────────┘

📌 Suas profissões favoritas:
┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│ [Profissão 1]│ │ [Profissão 2]│ │ + Explorar   │
└──────────────┘ └──────────────┘ └──────────────┘
```

Features:
- Autocomplete search field (debounced, queries `CboOccupation` table)
- Toggle: search by Profissão (CBO) OR Área de atuação (CNAE Division)
- If user has favorites: show them as quick-access cards
- Recent searches (stored in localStorage... wait, storage not available in Claude.ai. Use database or URL state)

---

### `/labor-market/[code]` — Occupation dashboard page

The main feature page. URL: `/labor-market/2124-05` (CBO code with dashes).

**Page header:**
- Occupation name (large heading)
- CBO code
- [❤️ Favoritar / ✓ Favoritado] toggle button
- [📊 Comparar] button (opens comparison modal)

**Filter bar (sticky below header):**
```
Região: [Brasil ▼]    Estado: [Todos ▼]
```
These filters affect all 4 tabs.

**Tab navigation:**
```
[📊 Visão Geral] [🗺️ Mercado de Trabalho] [💰 Remuneração] [👤 Perfil Profissional]
```

---

## Tab 1 — Visão Geral (Overview)

Single column layout, 2 rows of 3 cards each:

**Row 1:**

| Card | Content | Visualization |
|---|---|---|
| Situação do Mercado | Level: Queda/Retração/Equilibrado/Crescendo/Aquecido | Linear Gauge Chart (5 steps) |
| Rotatividade | Alta/Moderada/Baixa + explanation | Colored badge + description |
| Concorrência | Alta/Moderada/Baixa + explanation | Colored badge + description |

**Row 2:**

| Card | Content |
|---|---|
| Mercado | Estado com + admissões: [X] / Estado com - admissões: [Y] |
| Remuneração | Salário médio BR: R$ X.XXX / Horas contratuais: Xh/sem / Duração média: X meses |
| Perfil | Distribuição resumida: sexo, escolaridade predominante, faixa etária modal |

**Indicator calculation rules** (same as in `HORIZONTE.md`):
- Situação: based on net balance (admissions - dismissals) relative to stock
- Rotatividade: based on median tenure compared to all occupations (percentile ranking)
- Concorrência: based on admission/dismissal ratio relative to all occupations

---

## Tab 2 — Mercado de Trabalho

Two-panel layout:

**Left panel (40%):** Interactive Brazil map
- Colored by indicator (green = positive balance, red = negative)
- Click region: filters the right panel to that region
- Click state: filters even further
- Map library: use `recharts` with custom SVG, or simple `d3` path rendering

**Right panel (60%):** Data tables and cards

| Section | Content |
|---|---|
| Saldo | Net balance bar (positive/negative), total admissions, total dismissals |
| Admissões | Top 5 states with most admissions (table) + bottom 5 |
| Desligamentos | Top 5 states with most dismissals + bottom 5 |
| Disputa | Classification: Bastante disputado / Levemente disputado (based on stock vs all occupations) |

---

## Tab 3 — Remuneração

Two-panel layout (same map + data structure as Tab 2):

**Right panel data:**
- Salário médio: R$ X.XXX (+ R$ XX,XX/hora calculado)
- Horas contratuais médias: X horas/semana
- Duração média do vínculo: X meses

**Dynamic table (sortable):**

| Rank | Estado | Salário Médio | Valor/hora |
|------|--------|---------------|------------|
| 1º | São Paulo | R$ 4.200 | R$ 26,25 |
| 2º | Rio de Janeiro | R$ 3.900 | R$ 24,38 |
| ... | ... | ... | ... |

Toggle sorting: Mais pagos → Menos pagos

---

## Tab 4 — Perfil Profissional

Two-panel layout:

**Charts panel (right side, scrollable):**

1. **Age-Sex Pyramid Chart**
   - X-axis: count (negative = male left, positive = female right)
   - Y-axis: age ranges (18-24, 25-34, 35-44, 45-54, 55-64, 65+)
   - Two mirrored bar series (male blue, female pink/gold)

2. **Educational Level Horizontal Bar Chart**
   - Y-axis: education levels (from lowest to highest)
   - X-axis: count of workers
   - Color: sky blue gradient

3. **Race/Color Donut Chart**
   - Slices per race group
   - Legend with percentages

4. **Disability Distribution**
   - Simple two-segment donut: Com deficiência vs Sem deficiência
   - Only show if disability data exists

---

## Habilidades (Skills) Tab — Secondary page

Route: `/labor-market/skills`

Different from the occupation dashboard — this is about economic activities (CNAE), not specific occupations.

**Layout:**
- Filter: Select CNAE Division (dropdown with all divisions)
- Filter: Localidade (same region/state filter)
- Display:
  - Word Cloud: Habilidades em alta (skills related to growing occupations in that division)
  - Word Cloud: Habilidades em baixa (skills related to declining occupations)
- Note below: "Fonte: QBQ — Quadro de Bases de Qualificações (MTE)"

---

## Comparison Feature (Bonus — implement if time allows)

Modal or split-screen to compare 2 occupations side by side.
All Visão Geral metrics shown in two columns.

---

## API Routes

- `GET /api/labor-market/search?q=[query]&type=[cbo|cnae]` — autocomplete search
- `GET /api/labor-market/occupation/[code]` — full metrics for one occupation
- `GET /api/labor-market/occupation/[code]/metrics?uf=[UF]&region=[region]` — filtered metrics
- `GET /api/labor-market/skills?cnaeDiv=[div]&uf=[UF]` — skills by CNAE division
- `POST /api/labor-market/favorite` — toggle favorite profession

---

## Acceptance Criteria

- [ ] Search works and returns relevant CBO occupations
- [ ] Dashboard loads correctly for an occupation with data
- [ ] All 4 tabs display correctly
- [ ] Region/state filters update the data on all tabs
- [ ] Gauge chart shows correct market situation
- [ ] Salary table sorts correctly
- [ ] Age-sex pyramid chart renders correctly
- [ ] Favorite button toggles and persists in database
- [ ] Page handles occupations with no data gracefully (shows "Dados não disponíveis")

---

## Terminal prompt for Yan to paste

```
Leia o CLAUDE.md e depois leia docs/phases/PHASE_08_LABOR_MARKET.md.

Vamos executar a Fase 08 - Mercado de Trabalho.

Esta fase também é complexa. Vamos fazê-la em etapas:

Etapa 8A: Antes de implementar, me mostre:
1. Um esboço detalhado de como ficará o dashboard de uma profissão
2. Como funcionará o mapa interativo do Brasil (qual biblioteca ou abordagem)
3. Como os filtros de região/estado afetarão os dados exibidos

Etapa 8B: Após aprovação, implemente a busca + página do dashboard com dados mock primeiro.
Etapa 8C: Depois substitua os dados mock pelas queries reais ao banco de dados.

Aguarde minha aprovação a cada etapa antes de continuar.
```
