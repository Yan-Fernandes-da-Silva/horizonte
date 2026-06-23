# 013 — June 2026 — Phase 10: Deploy (Vercel + Railway)

> Recorded after taking the site live. App em produção: **https://horizonte-one.vercel.app**.

---

## Decisions

1. **Vercel (app) + Railway (Postgres).** O app roda no Vercel (plano Hobby, auto-deploy a
   cada `git push` na branch `main`); o banco PostgreSQL fica num projeto do Railway.
2. **`DATABASE_URL` = string PÚBLICA do Railway** (`...@<host>.proxy.rlwy.net:<port>/railway`),
   **não** a interna (`*.railway.internal`). O Vercel é externo à rede do Railway, então
   precisa da URL pública.
3. **Schema via `prisma db push`** (não `migrate deploy`). As migrations versionadas só vão
   até a Fase 05; o `db push` aplica o `schema.prisma` **atual** inteiro. Resultado da
   verificação: "The database is already in sync with the Prisma schema."
4. **Dados via ETL contra o banco da nuvem** (rodado da máquina local apontando
   `DATABASE_URL` para o Railway): `etl:static` + `etl:market`. Já estava carregado.
5. **Variáveis de ambiente no Vercel (Production):**
   - `DATABASE_URL` = string pública do Railway
   - `NEXTAUTH_SECRET` = string aleatória forte (gerada com `crypto.randomBytes(32)`)
   - `NEXTAUTH_URL` = `https://horizonte-one.vercel.app`
   - `ANTHROPIC_API_KEY` = **vazia por enquanto** → o Plano de Carreira usa o modo básico
     (fallback). Lembrete de ativação em `feedbacks/lembrete-chave-ia.md` (local).
6. **Segredos fora do Git.** Nada hardcoded; tudo via `process.env.*`. `.env.local` e `data/`
   continuam no `.gitignore`.

## Estado do banco de produção (Railway)

| Tabela | Registros |
|--------|-----------|
| CBO | 2.725 · CNAE | 1.331 · QBQ habilidades | 104.311 · Cursos | 7.659 · Mercado (CAGED/RAIS) | 88.344 |

Usuários: 0 (produção limpa).

## Verification

Teste end-to-end automatizado contra o site no ar (`fetch`, com cookie jar do NextAuth) —
**18/18 OK**:
- Páginas públicas (`/`, `/login`, `/register`, `/forgot-password`) → 200; landing com conteúdo.
- Rotas protegidas sem login → redirecionam (307 → `/`) — middleware + `NEXTAUTH_SECRET` OK.
- `POST /api/auth/register` → 201 (escrita no banco a partir do Vercel).
- Login (CSRF + callback de credenciais) → cookie de sessão + `/api/auth/session` com usuário.
- Páginas logadas (`/home`, `/labor-market`, `/vocational-test`, `/career-plan`, `/profile`)
  → 200 (leitura do banco em produção).
- Landing no navegador (Edge headless/CDP): **0 erros/avisos** de console; visual correto.
- A conta de teste foi removida do banco ao final.

## Pendências

- **`ANTHROPIC_API_KEY`** ainda não configurada → IA do Plano de Carreira em modo básico.
  Passo a passo para ativar: `feedbacks/lembrete-chave-ia.md`.

## Docs relacionados

- Guia do deploy: `docs/phases/PHASE_10_DEPLOY.md`.
- Documentação geral do site: `README.md`.
