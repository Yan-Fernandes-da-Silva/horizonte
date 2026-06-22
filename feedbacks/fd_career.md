# Feedback — Plano de Carreira / Lista de planos (`/career-plan`)

Última atualização: 2026-06-22 · Origem: feedback do Yan (terminal)
Legenda — Status: ⬜ pendente · 🔄 em andamento · ✅ feito
Viabilidade — ✅ dá para fazer · ⚠️ dá para fazer, mas precisa de uma decisão sua

> Telas: **Lista de planos** ↔ rota `/career-plan`.
> Premissa nova do Yan: **o usuário terá apenas UM plano** (não vários).
> ✅ **Aprovado e executado pelo Yan em 2026-06-22.** Decisões: (A) **manter a tela de
> apresentação** quando não há plano (opção 1); (B) redireciona para o plano mais recente do
> usuário; (C) listagem de múltiplos planos e botão "Novo plano" removidos.

---

## 1. (⚙️ Comportamento · Ambos) **Viabilidade: ✅ (com 1 decisão — ver Dúvida A)**

Como cada usuário terá **um único plano**, a **lista de planos** não faz mais sentido:

- **Se o usuário JÁ tem plano** → a lista não deve existir (ver item 2, redireciona pro plano).
- **Se o usuário NÃO tem plano** → `/career-plan` é onde aparece a **opção de criar o plano**,
  apontando para `/career-plan/start`.

*(Na prática, a tela de "Meus planos de carreira" com a lista e o botão "Novo plano" deixa de
ser usada: ou redireciona pro plano existente, ou mostra o convite para criar.)*

Status: ✅

---

## 2. (⚙️ Comportamento · Ambos) **Viabilidade: ✅**

Com um plano **já criado**, ao acessar `/career-plan` o usuário deve ser **redirecionado
direto para o plano ativo** dele: `/career-plan/[id]`.

Status: ✅

---

## 🟠 Dúvidas / decisões do assistente

**A) Tela quando NÃO há plano.** Duas opções — qual prefere?
- **(1)** Manter em `/career-plan` a **tela de apresentação** atual (caixa com ícone, texto
  "Responda 6 perguntas..." e botão **"Criar meu plano"** → `/career-plan/start`). **(recomendada)**
- **(2)** `/career-plan` **redireciona direto** para `/career-plan/start`, sem tela intermediária.

**B) Definição de "plano ativo".** Hoje o sistema marca um plano como `status: "active"`. Vou
redirecionar para o plano com `status: "active"` (o mais recente, se houver mais de um por
histórico). Confirma?

**C) Botão "Novo plano".** Com a regra de plano único, removo o botão "Novo plano" / a listagem
de múltiplos planos (vira código morto). Confirma a remoção?

---

## 🔁 Ajustes — Rodada 2 (2026-06-22) — todos ✅

- **Apresentação (sem plano):** mesmo visual das outras apresentações — **fundo mar + caixas
  translúcidas**, ícone **dourado à esquerda do título** (como no teste vocacional), e botão
  **"Criar meu plano" sem ícone**.
- **Página interna (roteiro do plano):** moldura mar + títulos brancos; cartões de progresso,
  tarefas, trilhas e recomendações continuam claros (Opção A — ver `fd_home.md` Rodada 4).
- **Criação do plano (questionário):** moldura mar + cabeçalho/progresso brancos (barra
  dourada); cartões das perguntas continuam claros.
- 🧹 Removido o link **"Meus planos"** no topo do roteiro: com o modelo de plano único,
  `/career-plan` redireciona de volta para o próprio plano, então o link era um "loop" inútil.
