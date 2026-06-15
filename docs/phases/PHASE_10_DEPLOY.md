# Phase 10 — Deploy (Vercel + Railway)

**Status**: Pending
**Estimated time**: 2–4 hours
**Prerequisites**: All previous phases complete and working locally

---

## What this phase accomplishes

Make the Horizonte website publicly accessible on the internet:
- Push code to GitHub repository
- Set up cloud PostgreSQL database (Railway)
- Run ETL scripts against the cloud database
- Deploy the Next.js app to Vercel
- Configure all environment variables in production
- Verify the site works for external users

---

## Prerequisites Checklist

Before starting this phase, confirm with Yan:

- [ ] All features work correctly at `http://localhost:3000`
- [ ] Yan has a GitHub account (username: ?)
- [ ] Yan has a Vercel account at vercel.com (can sign up with GitHub)
- [ ] Yan has a Railway account at railway.app (can sign up with GitHub)
- [ ] The Anthropic API key is ready (for the Career Plan feature)

---

## Step 1 — Create GitHub Repository

```bash
# In PowerShell, from C:\Users\yanfe\Desktop\Horizonte\

# Initialize git (if not done already)
git init

# Create the .gitignore (should already exist from Phase 00)
# Verify data/ is gitignored — these files are too large for GitHub

# Add all files
git add .

# Final commit before deploy
git commit -m "feat: versão completa do Horizonte - pronto para deploy"

# Create repo on GitHub (Yan does this on github.com)
# Then link local to remote:
git remote add origin https://github.com/[YAN_USERNAME]/horizonte.git
git branch -M main
git push -u origin main
```

**Important**: The `data/` folder must be in `.gitignore`. These are large government data files that should never be pushed to GitHub.

---

## Step 2 — Set Up Railway Database

1. Go to railway.app → New Project → Deploy PostgreSQL
2. Copy the connection string (will look like `postgresql://postgres:password@host:port/railway`)
3. This becomes `DATABASE_URL` in production

After setting up Railway database:
```bash
# Apply migrations to production database
DATABASE_URL="[railway-connection-string]" npx prisma migrate deploy
```

---

## Step 3 — Run ETL on Production Database

The government data must be loaded into the production database.

**Important**: This step runs on Yan's local machine but targets the cloud database.

```bash
# Set the production DB URL temporarily
$env:DATABASE_URL="[railway-connection-string]"  # PowerShell syntax

# Run static ETL (CBO, CNAE, QBQ, Courses)
npm run etl:static

# Run market ETL (CAGED, RAIS)
npm run etl:market
```

> This may take a while depending on data size. RAIS is especially large.
> After this is done, the production database is seeded and does not need to be seeded again unless data updates.

---

## Step 4 — Deploy to Vercel

1. Go to vercel.com → Add New Project → Import from GitHub
2. Select the `horizonte` repository
3. Framework preset: **Next.js** (auto-detected)
4. Build settings: leave as default
5. **Environment Variables** — add all of these:

```
DATABASE_URL          = [railway postgres connection string]
NEXTAUTH_SECRET       = [generate a strong random string — use: openssl rand -base64 32]
NEXTAUTH_URL          = https://[your-vercel-domain].vercel.app
ANTHROPIC_API_KEY     = [your anthropic API key]
```

6. Click Deploy
7. Vercel will build and deploy automatically

---

## Step 5 — Configure Custom Domain (Optional)

If Yan wants a custom domain (e.g., `horizonte.com.br`):
1. Vercel dashboard → Project → Settings → Domains
2. Add the domain and follow DNS configuration instructions

---

## Step 6 — Post-Deploy Verification

After the deploy is complete, test the following:

- [ ] Landing page loads at the Vercel URL
- [ ] Can register a new account
- [ ] Can log in
- [ ] Vocational test works end-to-end
- [ ] Labor market search returns results
- [ ] Career plan generates roadmap via AI
- [ ] All pages are accessible and responsive

---

## Step 7 — Set Up Auto-Deploy (CI/CD)

Vercel automatically redeploys when you push to the `main` branch on GitHub.

Workflow for future updates:
```bash
# After making changes locally and testing at localhost:3000:
git add .
git commit -m "feat: [describe what was changed]"
git push origin main
# Vercel detects the push and automatically redeploys (takes ~2 minutes)
```

---

## Updating Data in the Future

When new CAGED or RAIS data is released:

1. Download new data files from gov.br
2. Place in `data/caged/YYYYMM/` or `data/rais/YYYY/`
3. Run ETL locally against production DB:
   ```bash
   $env:DATABASE_URL="[railway-connection-string]"
   npm run etl:caged  # or etl:rais
   ```
4. No redeployment needed — the data is in the database

---

## Cost Overview (Expected)

| Service | Plan | Cost |
|---|---|---|
| Vercel | Hobby (free) | $0/month |
| Railway | Starter | ~$5/month (usage-based) |
| Anthropic API | Pay-per-use | ~$0.01–0.05 per roadmap generated |

For an academic project with low traffic, total cost should be under $10/month.

---

## Acceptance Criteria

- [ ] Code is on GitHub at `github.com/[username]/horizonte`
- [ ] App is live at a Vercel URL
- [ ] Landing page loads for external users
- [ ] Full registration → login → features flow works in production
- [ ] `NEXTAUTH_URL` is correctly set to the production URL
- [ ] No environment variables are hardcoded in the code (all use `process.env.*`)
- [ ] The `data/` folder is not in the GitHub repository

---

## Terminal prompt for Yan to paste

```
Leia o CLAUDE.md e depois leia docs/phases/PHASE_10_DEPLOY.md.

Vamos executar a Fase 10 - Deploy.

Antes de começar, me diga:
1. O site está funcionando completamente em localhost:3000?
2. Tenho conta no GitHub? (usuário: ?)
3. Tenho conta no Vercel?
4. Tenho conta no Railway?

Vamos seguir o passo a passo da fase. Me peça confirmação antes de cada etapa.
Explique em linguagem simples o que cada passo faz antes de executá-lo.
```
