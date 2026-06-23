# 🧭 Horizonte

> **Acompanhamento inteligente da sua carreira profissional.**

Aplicação web (projeto acadêmico, sem fins lucrativos) que ajuda a pessoa a se conhecer, entender
o mercado de trabalho brasileiro e montar um plano de carreira personalizado — combinando um
**teste vocacional**, dados oficiais de **mercado de trabalho** e um **plano de carreira gerado
por IA**.

- **Idioma da interface:** Português do Brasil (PT-BR)
- **Logo/tema:** timão náutico / horizonte (azul oceano + céu, com toques dourados)

---

## ✨ Funcionalidades

| Funcionalidade | O que faz |
|----------------|-----------|
| **Landing page** | Apresentação pública do projeto. |
| **Autenticação** | Cadastro, login e proteção de rotas (NextAuth, e-mail + senha). |
| **Início (dashboard)** | Painel pós-login com 3 cards (teste, mercado, plano) e atalhos. |
| **Teste Vocacional** | Questionário interativo (tierlist de interesses RIASEC, cards de Inteligências Múltiplas, ranking de valores) → página de resultados com profissões e cursos compatíveis. |
| **Mercado de Trabalho** | Busca de profissão e dashboard por profissão (mapa do Brasil, salários, demanda, perfil) a partir de CAGED/RAIS; favoritar profissões. |
| **Plano de Carreira** | Questionário SMART → roadmap personalizado (resumo, etapas, competências, cronograma, trilhas, recomendações) gerado pela API da Claude, com tarefas editáveis e progresso. |
| **Perfil** | Edição de dados da conta, troca de senha e avatar. |

> **IA opcional:** o Plano de Carreira usa a API da Claude (`claude-haiku-4-5`). Sem a chave
> `ANTHROPIC_API_KEY`, o site cai automaticamente num **plano básico (fallback)** que preenche
> todas as seções — nada quebra.

---

## 🧱 Stack tecnológica

| Camada | Tecnologia |
|--------|-----------|
| Framework | Next.js 14 (App Router) + TypeScript (strict) |
| Estilo | Tailwind CSS v3 + shadcn/ui (Radix) |
| Banco | PostgreSQL (local em dev; Railway em produção) |
| ORM | Prisma |
| Autenticação | NextAuth.js v4 (CredentialsProvider) |
| Gráficos | Recharts · Mapa: react-simple-maps + d3-geo |
| Formulários | React Hook Form + Zod |
| Ícones | Lucide React · Animações: Framer Motion |
| IA | `@anthropic-ai/sdk` (modelo `claude-haiku-4-5`, saída estruturada) |
| Deploy | Vercel (app) + Railway (banco) |

---

## 🗺️ Mapa de rotas

### Páginas
```
/                         Landing (pública)
/login  /register  /forgot-password     Autenticação
/home                     Dashboard pós-login
/vocational-test          Entrada do teste vocacional
/vocational-test/[section]    Seções do teste (riasec, mi, gopc)
/vocational-test/results  Resultados
/labor-market             Busca de profissões + favoritas
/labor-market/[code]      Dashboard de uma profissão (CBO)
/career-plan              Apresentação (ou redireciona ao plano)
/career-plan/start        Questionário de criação do plano
/career-plan/[planId]     Roadmap do plano
/profile                  Perfil do usuário
```

### API (rotas internas)
```
/api/auth/[...nextauth]   /api/auth/register
/api/vocational-test/start · /[sessionId]/answer · /[sessionId]/complete · /status
/api/labor-market/search
/api/favorites
/api/career-plan/create · /[planId] · /[planId]/task · /[planId]/task/[taskId]
/api/user · /api/user/password
```

---

## 🗃️ Modelos do banco (Prisma)

```
User ── VocationalTestSession · FavoriteProfession[] · CareerPlan[] ── CareerTask[]

Dados estáticos (ETL):  CboOccupation (+ hierarquia) · Cnae* · QbqKnowledge/Skill/Attitude · Course
Dados de mercado (ETL): MarketMetrics (por profissão + região + período)
```

---

## 📊 Fontes de dados (governo) + ETL

Os arquivos brutos ficam em `data/` (**não versionados** — são grandes; ignorados no `.gitignore`).
Os scripts em `scripts/etl/` leem `data/` e gravam **métricas pré-agregadas** no banco.

| Fonte | Conteúdo | Script |
|-------|----------|--------|
| CBO | Classificação Brasileira de Ocupações | `npm run etl:cbo` |
| CNAE 2.0 | Atividades econômicas | `npm run etl:cnae` |
| QBQ | Competências por ocupação | `npm run etl:qbq` |
| Cursos | Técnicos e superiores | `npm run etl:courses` |
| CAGED | Movimentação mensal de emprego | `npm run etl:caged` |
| RAIS | Vínculos empregatícios anuais | `npm run etl:rais` |

Atalhos: `npm run etl:static` (CBO+CNAE+QBQ+cursos) · `npm run etl:market` (CAGED+RAIS).

---

## 🚀 Rodando localmente

**Pré-requisitos:** Node.js 24.x, npm, PostgreSQL rodando em `localhost:5432`.

```bash
# 1. Instalar dependências (gera o Prisma Client automaticamente via postinstall)
npm install

# 2. Criar o .env.local a partir do exemplo e preencher os valores
#    (veja "Variáveis de ambiente" abaixo)
copy .env.example .env.local      # PowerShell/Windows

# 3. Criar as tabelas no banco
npx prisma db push

# 4. Carregar os dados (precisa dos arquivos em data/)
npm run etl:static
npm run etl:market

# 5. Subir o site
npm run dev
# abre em http://localhost:3000
```

### Variáveis de ambiente (`.env.local`)
```
DATABASE_URL="postgresql://USUARIO:SENHA@localhost:5432/horizonte"
NEXTAUTH_SECRET="uma-string-aleatoria-forte"
NEXTAUTH_URL="http://localhost:3000"
ANTHROPIC_API_KEY=""   # opcional — sem ela, o Plano de Carreira usa o modo básico
```
> O `.env.local` **nunca** vai para o GitHub (está no `.gitignore`).

---

## ☁️ Deploy (Vercel + Railway)

> Resumo do passo a passo. O detalhamento completo está em `docs/phases/PHASE_10_DEPLOY.md`.
> O deploy exige **contas próprias** (GitHub, Vercel, Railway) e **logins interativos**.

1. **GitHub** — o código já está versionado; a cada `git push` na branch `main` o Vercel
   redeploya sozinho.
2. **Banco (Railway):** crie um projeto → *Add PostgreSQL* → copie a *connection string*
   (vira o `DATABASE_URL` de produção).
3. **Schema + dados na nuvem:**
   ```bash
   $env:DATABASE_URL="<connection-string-do-railway>"
   npx prisma db push        # aplica o schema atual (recomendado p/ este projeto)
   npm run etl:static
   npm run etl:market
   ```
4. **Vercel:** *Add New Project* → importar o repositório `horizonte` (preset Next.js) →
   adicionar as **variáveis de ambiente**:
   ```
   DATABASE_URL        = <connection-string-do-railway>
   NEXTAUTH_SECRET     = <string-aleatoria-forte>
   NEXTAUTH_URL        = https://<seu-dominio>.vercel.app
   ANTHROPIC_API_KEY   = <opcional>
   ```
   → **Deploy**.
5. **Pós-deploy:** testar cadastro → login → teste vocacional → mercado → plano de carreira.

**Custo esperado (tráfego baixo):** Vercel Hobby grátis · Railway ~US$5/mês · IA por uso
(fração de centavo por plano). Total < US$10/mês.

---

## 🧩 Scripts úteis

| Comando | O que faz |
|---------|-----------|
| `npm run dev` | Servidor de desenvolvimento (localhost:3000) |
| `npm run build` | Build de produção |
| `npm start` | Sobe o build de produção |
| `npm run lint` | ESLint |
| `npx prisma studio` | Interface visual do banco |
| `npx prisma db push` | Aplica o `schema.prisma` no banco |

---

## 📁 Estrutura (resumo)

```
src/
  app/            Rotas (App Router): (public) · (auth) · (dashboard) · api
  components/     ui (shadcn) · layout · features (por funcionalidade) · shared
  lib/            auth · db · vocational-test · labor-market · career-plan · ai
  hooks/  types/
prisma/           schema.prisma · migrations · seed
scripts/etl/      ETL dos dados do governo
data/             Arquivos brutos do governo (NÃO versionados)
docs/             Visão, fases e decisões do projeto
```

---

*Projeto acadêmico Horizonte — desenvolvido com apoio de IA (Claude Code).*
