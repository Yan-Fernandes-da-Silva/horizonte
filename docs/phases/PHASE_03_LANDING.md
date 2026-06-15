# Phase 03 — Landing Page (Pre-login)

**Status**: Pending
**Estimated time**: 3–5 hours
**Prerequisites**: Phase 02 complete

---

## What this phase accomplishes

Build the complete public landing page that presents Horizonte to new visitors and invites them to sign up.

---

## Page Sections (in order, top to bottom)

### Section 1 — Hero

Full-viewport-height section.

**Background**: Ocean-to-sky diagonal gradient with a subtle animated wave at the bottom.
Consider adding faint nautical map grid lines as a decorative overlay (low opacity).

**Content** (centered):
- Logo timão (SVG icon, large, gold color)
- "Horizonte" — large, bold, white
- Slogan: "Acompanhamento inteligente da sua carreira profissional" — white, medium weight
- CTA primary button: "Começar agora" → `/auth/register` (gold button, large)
- CTA secondary: "Já tenho conta" → `/auth/login` (outline white button)

**Wave divider** at the bottom separating from next section.

---

### Section 2 — "O que é o Horizonte?"

Background: white or sand.

**Content**:
- Section label (small caps, sky color): "NOSSA MISSÃO"
- Heading: "Seu copiloto de carreira profissional"
- Two-column layout:
  - Left: descriptive paragraph — explain who it's for (those starting out + those changing careers)
  - Right: an illustration or abstract graphic (ocean/compass motif)

---

### Section 3 — Features (3 cards)

Background: sand (`#FAF5EB`).

**Section heading**: "Tudo que você precisa para decolar na carreira"

Three cards in a row (stacked on mobile):

| Card | Icon | Title | Description |
|------|------|-------|-------------|
| 1 | 🧭 | Teste Vocacional | Descubra seu perfil, suas forças e as profissões mais compatíveis com quem você é. |
| 2 | 📊 | Mercado de Trabalho | Explore dados reais do mercado brasileiro: salários, demanda e tendências por profissão. |
| 3 | 🗺️ | Plano de Carreira | Receba um roadmap personalizado e acompanhe seu progresso com metas claras. |

Each card: white background, frosted glass effect, icon in sky/gold color, rounded-2xl, hover lift animation.

---

### Section 4 — "Como funciona?"

Background: ocean dark gradient.
Text: white.

**Section heading**: "Em 3 passos simples"

Three steps in a horizontal timeline (or vertical on mobile):

| Step | Number | Title | Description |
|------|--------|-------|-------------|
| 1 | ① | Faça o teste vocacional | Responda perguntas sobre seus interesses, habilidades e valores. Leva cerca de 10 minutos. |
| 2 | ② | Explore o mercado | Veja como está a demanda, salários e perfil profissional de cada área que te interessa. |
| 3 | ③ | Monte seu plano | Com base no seu perfil e no mercado, receba um roadmap personalizado para sua carreira. |

Step numbers: large, gold color.
Connecting arrows or dashed line between steps.

---

### Section 5 — Final CTA

Background: sky gradient.

**Content** (centered):
- Heading: "Pronto para encontrar seu caminho?"
- Subtext: "É grátis, sem complicação. Comece agora e descubra para onde seu horizonte aponta."
- CTA button: "Criar minha conta" → `/auth/register` (ocean button)

---

### Footer

As defined in Phase 01.

---

## Animation Guidelines

- Hero: text fades up on load (staggered, Framer Motion)
- Feature cards: fade in on scroll (IntersectionObserver or Framer Motion `whileInView`)
- Wave at hero bottom: gentle CSS keyframe animation
- CTA buttons: subtle scale on hover
- No aggressive or distracting animations

---

## Acceptance Criteria

- [ ] All 5 sections render correctly
- [ ] CTA buttons navigate to correct pages
- [ ] Page is fully responsive (mobile/tablet/desktop)
- [ ] Animations work smoothly
- [ ] No TypeScript or console errors
- [ ] Page loads fast (no unnecessary large assets)

---

## Terminal prompt for Yan to paste

```
Leia o CLAUDE.md e depois leia docs/phases/PHASE_03_LANDING.md.

Vamos executar a Fase 03 - Página de Apresentação.

Antes de implementar, me mostre:
1. A estrutura de cada seção em forma de esboço de texto (ASCII art ou descrição detalhada)
2. Quais animações serão usadas e onde
3. Como a página ficará no celular vs no computador

Aguarde minha aprovação antes de criar os arquivos.
```
