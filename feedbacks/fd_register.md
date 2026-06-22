# Feedback — Cadastro / Criar conta (`/register`)

Última atualização: 2026-06-21 · Origem: `meu_feedback.txt`
Legenda — Status: ✅ pendente · 🔄 em andamento · ✅ feito

> Observação: a página de Cadastro e a de Login **compartilham o mesmo fundo/layout**
> (`(auth)/layout.tsx`). As mudanças de fundo/posição aqui valem também para o Login
> (ver `fd_login.md`).

---

## 🔁 Ajustes — Rodada 4 (2026-06-21) — todos ✅

- Removido o título "Criar conta"; caixa de cadastro reduzida (mais estreita).

---

## 🔁 Ajustes — Rodada 2 (2026-06-21) — todos ✅

- Placeholder do nome: "Ex: João da Silva" → "João da Silva".
- Logo + nome dentro do card agora são **clicáveis e levam à página inicial**.
- Farol corrigido: sem o círculo no topo, **feixe de luz único**, e torre/rochas
  **apoiadas no solo** (não mais flutuando).

---

## Fundo

1. (🎨 Visual · Desktop) Fundo hoje é azul sólido animado → Trocar por **um Farol de Mar à
   noite, à esquerda**, com **ondas ao longo de toda a parte de baixo** do fundo.
   Status: ✅  ·  ⚠️ ver Dúvidas (estilo da arte) e nota de responsivo.

---

## Caixa de criar conta

1. (🎨 Visual · Desktop) Hoje a caixa fica **centralizada** → Movê-la para a **direita**, para
   harmonizar com o farol à esquerda.
   Status: ✅

2. (➖ Remover · Ambos) Remover o texto "Comece a planejar sua carreira com o Horizonte."
   (subtítulo abaixo de "Criar conta").
   Status: ✅

3. (✍️ Texto · Ambos) Ajustar rótulos e placeholders:
   - Rótulo "Nome completo" → **"Nome"**
   - Placeholder "Seu nome" → **"Ex: João da Silva"**
   - Placeholder do e-mail "voce@exemplo.com" → **"joao@dominio.com"**
   - Campo Senha: adicionar placeholder **"Digite a senha"**
   - Campo Confirmar senha: adicionar placeholder **"Digite a senha novamente"**
   Status: ✅

---

## Logo e nome do site

1. (🎨 Visual · Ambos) Hoje a logo + nome ficam **centralizados no topo, fora da caixa** →
   Movê-los para **dentro da caixa de criar conta, acima do título "Criar conta"**. A **logo**
   na **mesma cor marrom** da página inicial; o **nome "Horizonte" em azul-escuro** (já que o
   fundo da caixa é claro).
   Status: ✅

---

## 🟠 Dúvidas do assistente

**A) Estilo do farol/ondas (Fundo 1).** Mesmo dilema da landing: faço o **farol à noite + ondas**
como **desenho em código (SVG, estilo flat)** ou você prefere **imagem pronta** (mais realista,
mas você precisa fornecer/aprovar)? Ver Dúvida "A" em `fd_landing.md` — vale a mesma decisão para
manter o site coerente.

**B) Responsivo do fundo (Fundo 1 e Caixa 1 — marcados "Desktop").** Você pediu farol + caixa à
direita **no desktop**. **No celular**, o que prefere para o fundo?
- (1) Manter um fundo simples (azul/ondas) com a caixa **centralizada** — mais legível em tela
  estreita; **(recomendado)** ou
- (2) Tentar mostrar farol + ondas também no celular (fica apertado atrás do formulário).
👉 Se não responder, sigo a opção (1) no celular.
