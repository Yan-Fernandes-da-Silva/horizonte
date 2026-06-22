# Feedback — Teste Vocacional (entrada) (`/vocational-test`)

Última atualização: 2026-06-22 · Origem: feedback do Yan (terminal)
Legenda — Status: ⬜ pendente · 🔄 em andamento · ✅ feito
Viabilidade — ✅ dá para fazer · ⚠️ dá para fazer, mas precisa de uma decisão sua

> Telas: **Teste Vocacional (entrada)** ↔ rota `/vocational-test`.
> ✅ **Aprovado e executado pelo Yan em 2026-06-22.** Decisões: (A) visual da home confirmado
> (fundo mar + caixas translúcidas + texto branco); (B) "GOPC" mantido conforme escrito.

---

## 1. (🎨 Visual · Ambos) **Viabilidade: ⚠️ (precisa de confirmação — ver Dúvida A)**

Deixar a página de entrada do Teste Vocacional com o **mesmo visual da página inicial
pós-login** (`/home`).

Hoje: fundo claro (areia) + caixa em **gradiente oceano** (hero) + caixa branca com o estado
do teste.
→ Passar para: **fundo mar full-bleed** (`bg-sea-top`) preenchendo a tela entre cabeçalho e
rodapé, com as caixas **translúcidas** (`bg-white/10`, borda `border-white/15`,
`backdrop-blur-sm`), **texto branco** e detalhes em **dourado** — igual à home.

Status: ✅

---

## 2. (➖ Remover · Ambos) **Viabilidade: ✅**

Remover os **4 painéis** que listam as seções do teste:

> 1 Interesses (RIASEC) — Como você gosta de trabalhar e com o quê.
> 2 Inteligências — Suas formas de pensar e aprender mais fortes.
> 3 Valores & Contexto — O que te motiva e o seu momento de carreira.
> 4 Análise Pessoal — Suas metas, obstáculos e disponibilidade.

⚠️ **Atenção:** o Yan quer esse conteúdo **de volta depois**, após rever o questionário.
Vou apenas **retirar a exibição** desses painéis (sem apagar a fonte de dados `SECTIONS`),
para ser fácil de reativar mais tarde.

Status: ✅

---

## 3. (✍️ Texto · Ambos) **Viabilidade: ✅**

Trocar a descrição do topo:

- **Hoje:** "Descubra seu perfil profissional combinando três frameworks: RIASEC (interesses),
  Inteligências Múltiplas e seus valores de carreira."
- **Novo:** "Descubra seu perfil profissional, objetivos e interesses combinando diferentes
  testes psicométricos: RIASEC, Inteligências Múltiplas e GOPC."

*(Corrigi o erro de digitação "Integigências" → "Inteligências". Sobre "GOPC" — ver Dúvida B.)*

Status: ✅

---

## 🟠 Dúvidas / decisões do assistente

**A) "Mesmo visual da home".** Confirmo o entendimento acima (fundo mar full-bleed + caixas
translúcidas + texto branco)? A caixa do hero (ícone bússola + título + descrição) e a caixa
de estado do teste passariam ao estilo translúcido da home. Confirma?

**B) "GOPC".** Vou escrever exatamente "GOPC" como você pediu. Só confirmando que é a sigla
correta do terceiro instrumento (e não, por exemplo, outro nome) — para eu não registrar
errado num texto que fica visível ao usuário.

---

## 🔁 Ajustes — Rodada 2 (2026-06-22) — todos ✅

- **Hero:** bússola agora **dourada**, **à esquerda do título**, **sem o quadrado branco**;
  título **"Teste vocacional"** (v minúsculo); painel mais **baixo**.
- **Barra de progresso dourada** (antes azul-escuro).
- **Botão "Começar teste" sem ícone.**
- **Botão "Recomeçar do zero"** agora **visível por padrão** (vidro translúcido) e só escurece
  no hover (antes ficava branco/invisível).
- **Progresso instantâneo:** a barra de progresso revalida sozinha ao abrir a página e ao
  voltar o foco à janela (endpoint `GET /api/vocational-test/status` + componente cliente),
  sem precisar recarregar.
- **Páginas internas (questionário e resultados):** moldura mar + cabeçalho/títulos brancos;
  cartões das perguntas e gráficos continuam claros (Opção A — ver `fd_home.md` Rodada 4).
