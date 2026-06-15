# Phase 01 — Design System & Layout Base

**Status**: Pending
**Estimated time**: 2–4 hours
**Prerequisites**: Phase 00 complete

---

## What this phase accomplishes

- Configure global CSS with Horizonte's design tokens
- Set up Inter font globally
- Create the Header component (pre-login and post-login variants)
- Create the Footer component
- Create the Layout wrapper (public and protected variants)
- Create a set of shared base components
- Create placeholder pages so navigation works
- Ensure the site is responsive (mobile + desktop)

---

## Design Reference

Read `docs/HORIZONTE.md` sections "2. Identidade Visual" before starting.

Key visual rules:
- Colors: ocean (`#0A2342`), sky (`#00B4D8`), gold (`#F4A261`), sand (`#FAF5EB`)
- Glassmorphism: `backdrop-blur-md` + semi-transparent backgrounds on cards
- Border radius: `rounded-xl` to `rounded-2xl`
- Motion: Framer Motion, subtle and smooth — nothing aggressive
- Font: Inter (Google Fonts via `next/font`)
- Background: pages use ocean → sky gradient or white/sand

---

## Components to Create

### 1. Global Styles (`src/app/globals.css`)

Configure CSS custom properties for all design tokens.
Add base styles for body, headings, links.
Import and apply Inter font.
Add a subtle animated wave/gradient keyframe for background use.

### 2. Header Component (`src/components/layout/Header.tsx`)

**Pre-login variant** (used on landing page):
- Left: Horizonte logo (a simple timão SVG icon) + "Horizonte" text in ocean color
- Right: "Entrar" (outline button) and "Criar conta" (filled gold button)

**Post-login variant** (used on dashboard pages):
- Left: Logo + "Horizonte"
- Center: Navigation links — "Teste Vocacional" | "Mercado de Trabalho" | "Plano de Carreira"
  - Each link underlines on hover, highlights if current route is active
- Right: User avatar (circular, with initials fallback) + user name + dropdown menu
  - Dropdown: "Meu perfil", "Configurações", divider, "Sair"
- Header has a frosted glass effect (`backdrop-blur` + semi-transparent ocean color)
- Sticky at the top on scroll
- Mobile: hamburger menu with slide-in drawer

### 3. Footer Component (`src/components/layout/Footer.tsx`)

Simple, minimal footer:
- Background: ocean dark (`#0A2342`)
- Text: white
- Left side: GitHub icon + link (text: "Código no GitHub")
- Right side: "Horizonte" (bold) + slogan ("Acompanhamento inteligente da sua carreira profissional")
- Centered vertically, full width
- Padding: comfortable (py-8)

### 4. Layout Wrappers

**`src/app/(public)/layout.tsx`** — wraps public pages:
- Header (pre-login variant)
- Main content
- Footer

**`src/app/(auth)/layout.tsx`** — wraps auth pages (login, register):
- Centered card layout
- Ocean gradient background
- No header nav or footer

**`src/app/(dashboard)/layout.tsx`** — wraps protected pages:
- Check authentication (redirect to login if not logged in)
- Header (post-login variant)
- Main content area
- Footer

### 5. Shared Components (`src/components/shared/`)

**`StatusBadge.tsx`** — badge with colored variants:
- Props: `variant` (`success` | `warning` | `danger` | `info` | `neutral`) + `label`
- Used in: Market dashboard indicators

**`SectionTitle.tsx`** — section heading with optional subtitle:
- Props: `title`, `subtitle?`, `align?` (`left` | `center`)

**`EmptyState.tsx`** — empty state with icon, title, description and CTA:
- Props: `icon`, `title`, `description`, `ctaLabel?`, `ctaHref?`
- Used in dashboard cards when user hasn't used a feature yet

**`LoadingSpinner.tsx`** — centered loading indicator:
- Use the sky color, smooth spin animation
- Variants: `sm` | `md` | `lg`

**`PageContainer.tsx`** — consistent page wrapper:
- Max width: `max-w-7xl`
- Horizontal padding: `px-4 sm:px-6 lg:px-8`
- Centered with `mx-auto`

### 6. Placeholder Pages

Create skeleton placeholder pages (just title + "Em breve") for:
- `src/app/(public)/page.tsx` — Landing page (full implementation in Phase 03)
- `src/app/(auth)/login/page.tsx` (full in Phase 02)
- `src/app/(auth)/register/page.tsx` (full in Phase 02)
- `src/app/(dashboard)/home/page.tsx` (full in Phase 04)
- `src/app/(dashboard)/vocational-test/page.tsx` (full in Phase 07)
- `src/app/(dashboard)/labor-market/page.tsx` (full in Phase 08)
- `src/app/(dashboard)/career-plan/page.tsx` (full in Phase 09)

Each placeholder shows: page title centered + "Esta página será implementada em breve." + back button.

---

## Visual Preview to Confirm with Yan

Before implementing, describe in words and ASCII art the layout so Yan can approve:

```
HEADER (pre-login):
┌─────────────────────────────────────────────────────────┐
│ ⚓ Horizonte                        [Entrar] [Criar conta]│
└─────────────────────────────────────────────────────────┘

HEADER (post-login):
┌─────────────────────────────────────────────────────────┐
│ ⚓ Horizonte   [Teste Vocacional] [Mercado] [Plano]   👤 │
└─────────────────────────────────────────────────────────┘

FOOTER:
┌─────────────────────────────────────────────────────────┐
│  GitHub ↗                    Horizonte                  │
│                    Acompanhamento inteligente...         │
└─────────────────────────────────────────────────────────┘
```

---

## Acceptance Criteria

- [ ] `npm run dev` starts without errors
- [ ] Header renders correctly in both pre-login and post-login variants
- [ ] Footer renders correctly
- [ ] All placeholder pages load without errors
- [ ] Navigation links in post-login header are active/highlighted when on the correct page
- [ ] Site is readable on mobile (375px) and desktop (1280px)
- [ ] Inter font is loading correctly
- [ ] Color tokens match the design system (ocean, sky, gold)
- [ ] No console errors or TypeScript errors

---

## Terminal prompt for Yan to paste

```
Leia o CLAUDE.md e depois leia docs/phases/PHASE_01_DESIGN_SYSTEM.md.

Vamos executar a Fase 01 - Design System e Layout Base.

Antes de criar qualquer arquivo, me mostre:
1. Um esboço em texto (ASCII art) de como ficarão o Header e o Footer
2. A lista de cores exatas que serão usadas com os nomes dos tokens
3. A lista de componentes que serão criados

Aguarde minha aprovação de cada item antes de implementar.
Após implementar, me diga em linguagem simples o que foi criado e como posso visualizar no navegador.
```
