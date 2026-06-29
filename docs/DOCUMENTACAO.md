# Documentação Técnica — Horizonte

> Acompanhamento inteligente da sua carreira profissional.
> Projeto acadêmico, sem fins lucrativos. Interface em PT-BR; código em EN-US.

---

## 1. Resumo

O **Horizonte** é uma aplicação web que ajuda a pessoa a **se conhecer, entender o mercado de
trabalho brasileiro e montar um plano de carreira personalizado**. Ele combina três frentes:

1. **Teste Vocacional** — questionário interativo (interesses RIASEC, Inteligências Múltiplas e
   valores) que sugere profissões e cursos compatíveis com o perfil.
2. **Mercado de Trabalho** — dashboards por profissão a partir de dados oficiais do governo
   (CAGED e RAIS): salários, demanda por região e perfil ocupacional.
3. **Plano de Carreira** — roteiro personalizado (etapas, competências, cronograma e trilhas de
   estudo) gerado por inteligência artificial a partir dos objetivos do usuário.

O sistema é público (com cadastro/login) e está no ar em **https://horizonte-one.vercel.app**.

---

## 2. Arquitetura do Sistema

O Horizonte é uma aplicação **Next.js (App Router)** monolítica, em que front-end e back-end
convivem no mesmo projeto: as páginas são componentes React renderizados no servidor, e a lógica de
servidor fica em **API Routes** (`src/app/api/`). A persistência é um banco **PostgreSQL** acessado
via **Prisma ORM**. Os dados brutos do governo nunca entram no site em tempo real: são processados
**offline** por scripts de ETL que gravam apenas métricas agregadas no banco.

### Visão em camadas

```
┌─────────────────────────────────────────────────────────────┐
│  NAVEGADOR (usuário)                                          │
│  Páginas React (Server + Client Components) · Tailwind/shadcn │
└───────────────┬─────────────────────────────────────────────┘
                │  HTTP (mesma origem)
┌───────────────▼─────────────────────────────────────────────┐
│  SERVIDOR Next.js (Vercel)                                    │
│  • Páginas (src/app/(public|auth|dashboard))                 │
│  • API Routes (src/app/api/*)  ← regras de negócio           │
│  • Autenticação: NextAuth (sessão JWT)                       │
│  • Lógica de domínio: src/lib/* (vocational-test,            │
│    labor-market, career-plan, ai)                            │
└───────┬───────────────────────────────────┬─────────────────┘
        │ Prisma ORM                         │ HTTPS
┌───────▼─────────────────┐      ┌───────────▼─────────────────┐
│  PostgreSQL (Railway)   │      │  API da Claude (Anthropic)   │
│  • Usuários e dados     │      │  • Gera o plano de carreira  │
│  • Dados estáticos/ETL  │      │    (texto estruturado)       │
│  • Métricas de mercado  │      └──────────────────────────────┘
└───────▲─────────────────┘
        │ (grava só agregados, offline)
┌───────┴─────────────────────────────────────────────────────┐
│  ETL (scripts/etl/*) lê os arquivos brutos do governo em     │
│  data/ (CBO, CNAE, QBQ, CAGED, RAIS, cursos) — não versionado│
└─────────────────────────────────────────────────────────────┘
```

### Como os módulos se comunicam

- **Página → API Route:** as páginas/componentes chamam as rotas internas (`/api/...`) que validam
  a entrada (Zod), aplicam a regra de negócio (em `src/lib/`) e falam com o banco via Prisma.
- **Autenticação transversal:** o NextAuth protege as rotas do grupo `(dashboard)`; cada API
  confere a sessão antes de ler/gravar dados do usuário.
- **IA isolada:** só o Plano de Carreira chama a API da Claude, e por trás de uma camada
  (`src/lib/ai/`) com **fallback**: sem a chave `ANTHROPIC_API_KEY`, um plano básico é montado
  localmente — nada quebra.
- **Dados de mercado desacoplados:** o site lê apenas a tabela `MarketMetrics` (já agregada); o
  custo de processar ~1,8 GB de arquivos brutos fica no ETL, fora do caminho do usuário.

### Organização de pastas (resumo)

```
src/
  app/            Rotas: (public) landing · (auth) login/registro · (dashboard) áreas logadas · api
  components/     ui (shadcn) · layout · features (por funcionalidade) · shared
  lib/            auth · db · vocational-test · labor-market · career-plan · ai · validations
  hooks/  types/
prisma/           schema.prisma (modelos do banco)
scripts/etl/      Scripts que processam os dados do governo
data/             Arquivos brutos do governo (NÃO versionados — grandes)
docs/             Visão, fases e decisões do projeto
```

---

## 3. Tecnologias utilizadas

| Camada | Tecnologia |
|--------|-----------|
| Framework | Next.js 14 (App Router) |
| Linguagem | TypeScript (strict) |
| Estilo / UI | Tailwind CSS v3 + shadcn/ui (Radix UI) |
| Banco de dados | PostgreSQL (local em dev; Railway em produção) |
| ORM | Prisma |
| Autenticação | NextAuth.js v4 (e-mail + senha, sessão JWT) |
| Formulários / validação | React Hook Form + Zod |
| Gráficos e mapas | Recharts · react-simple-maps + d3-geo |
| Ícones / animações | Lucide React · Framer Motion |
| Inteligência Artificial | `@anthropic-ai/sdk` — modelo `claude-haiku-4-5` (saída estruturada) |
| ETL | Node.js + tsx · csv-parse |
| Hospedagem | Vercel (aplicação) + Railway (banco) |

---

## 4. Funcionamento dos componentes

### 4.1 Autenticação
Cadastro e login por e-mail e senha (senha protegida com bcrypt). O NextAuth mantém a sessão e
protege todas as páginas do grupo `(dashboard)`; quem não está logado é redirecionado ao login.

### 4.2 Início (dashboard)
Painel pós-login com três cards de acesso — Teste Vocacional, Mercado de Trabalho e Plano de
Carreira — além de atalhos e do estado atual do usuário.

### 4.3 Teste Vocacional
Questionário dividido em seções: **interesses (RIASEC)** num formato de ordenação, **Inteligências
Múltiplas** em cards e **valores** em ranking. As respostas são gravadas por sessão e, ao final, o
sistema calcula um perfil e exibe **profissões e cursos compatíveis**. O conteúdo é orientado a
dados (fácil de ajustar), pois as perguntas/resultados mudam com frequência.

### 4.4 Mercado de Trabalho
Busca de profissões e, para cada uma, um **dashboard**: mapa do Brasil com intensidade por região,
faixas salariais, demanda (admissões/desligamentos do CAGED) e perfil ocupacional (RAIS). Há
**filtro por período (mês)** e a possibilidade de **favoritar** profissões. Todos os números vêm da
tabela pré-agregada `MarketMetrics`.

### 4.5 Plano de Carreira
Um **questionário no formato SMART** coleta objetivo, prazo e contexto do usuário. Esses dados são
enviados à **API da Claude**, que devolve um plano estruturado (resumo, etapas, competências,
cronograma, trilhas e recomendações). O plano vira **tarefas editáveis com progresso**. Sem a chave
de IA, um **plano básico (fallback)** é gerado localmente.

### 4.6 Perfil
Edição dos dados da conta, troca de senha e escolha de avatar.

### 4.7 Camada de dados (ETL)
Scripts em `scripts/etl/` leem os arquivos brutos em `data/` e gravam **somente métricas
agregadas** no banco:

| Fonte | Conteúdo | Comando |
|-------|----------|---------|
| CBO | Classificação Brasileira de Ocupações | `npm run etl:cbo` |
| CNAE 2.0 | Atividades econômicas | `npm run etl:cnae` |
| QBQ | Competências por ocupação | `npm run etl:qbq` |
| Cursos | Técnicos e superiores | `npm run etl:courses` |
| CAGED | Movimentação mensal de emprego | `npm run etl:caged` |
| RAIS | Vínculos empregatícios anuais | `npm run etl:rais` |

Atalhos: `npm run etl:static` e `npm run etl:market`.

### 4.8 Modelos do banco (Prisma)

```
User ── VocationalTestSession · FavoriteProfession[] · CareerPlan[] ── CareerTask[]

Dados estáticos (ETL):  CboOccupation (+ hierarquia) · Cnae* · QbqKnowledge/Skill/Attitude · Course
Dados de mercado (ETL): MarketMetrics (por profissão + região + período)
```

---

## 5. Como executar o sistema

**Pré-requisitos:** Node.js 24.x, npm e PostgreSQL rodando em `localhost:5432`.

```bash
# 1. Instalar dependências (gera o Prisma Client via postinstall)
npm install

# 2. Criar o .env.local a partir do exemplo e preencher os valores
copy .env.example .env.local      # Windows / PowerShell

# 3. Criar as tabelas no banco
npx prisma db push

# 4. Carregar os dados (precisa dos arquivos em data/)
npm run etl:static
npm run etl:market

# 5. Subir o site
npm run dev
# abre em http://localhost:3000
```

**Variáveis de ambiente (`.env.local`):**

```
DATABASE_URL="postgresql://USUARIO:SENHA@localhost:5432/horizonte"
NEXTAUTH_SECRET="uma-string-aleatoria-forte"
NEXTAUTH_URL="http://localhost:3000"
ANTHROPIC_API_KEY=""   # opcional — sem ela, o Plano de Carreira usa o modo básico
```

O `.env.local` nunca é versionado (está no `.gitignore`). O deploy completo (Vercel + Railway)
está descrito no `README.md` e em `docs/phases/PHASE_10_DEPLOY.md`.

---

## 6. Considerações finais

O Horizonte demonstra, na prática, como **dados públicos brasileiros de trabalho e educação** podem
ser transformados em **orientação de carreira acessível**, somando a isso um auxílio de inteligência
artificial para o planejamento. A arquitetura privilegia a separação entre o **processamento pesado
de dados (ETL, offline)** e a **experiência do usuário (site, leve)**, o que mantém o aplicativo
rápido e o banco enxuto. O uso de IA é opcional e degrada com elegância (fallback), garantindo que o
sistema funcione mesmo sem a chave de API.

Como evoluções futuras possíveis: ampliar a cobertura temporal do CAGED, enriquecer o detalhamento
do plano de carreira e incluir novas fontes de dados. O projeto está organizado em fases
documentadas (`docs/phases/`) e decisões registradas (`docs/decisions/`), facilitando a manutenção
e a continuidade por novos colaboradores.

---

*Equipe: Yan Fernandes da Silva · Aline da Conceição Ferreira Lima · Daniel Ramos Maia · Victor Lima Frazão.
Desenvolvido com apoio de IA (Claude Code).*
