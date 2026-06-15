# Phase 05 — ETL: Static Data (CBO, CNAE, QBQ, Qualifications)

**Status**: Pending
**Estimated time**: 4–6 hours
**Prerequisites**: Phase 04 complete

---

## What this phase accomplishes

Process and load static government data into the PostgreSQL database. These datasets rarely change and are the foundation for the Vocational Test results and Labor Market search features.

**Data processed in this phase:**
- CBO — Brazilian Occupations Classification
- CNAE 2.0 — National Economic Activities Classification
- QBQ — Skills and Competencies Framework
- Qualifications — Technical and higher education courses

> **Rule**: ETL scripts read from `data/` (read-only) and write to the database.
> Never modify files inside `data/`.
> Only necessary, cleaned data is stored — no raw data dumps.

---

## Prisma Schema — New Models

Add these models to `prisma/schema.prisma` and run `npx prisma migrate dev`:

```prisma
// ─── CBO Hierarchy ────────────────────────────────────────────────────────────

model CboLargeGroup {
  code  String           @id  // 1-digit
  title String
  subgroups CboMainSubgroup[]
}

model CboMainSubgroup {
  code       String       @id  // 2-digit
  title      String
  largeGroupCode String
  largeGroup CboLargeGroup @relation(fields: [largeGroupCode], references: [code])
  subgroups  CboSubgroup[]
}

model CboSubgroup {
  code          String          @id  // 3-digit
  title         String
  mainSubgroupCode String
  mainSubgroup  CboMainSubgroup @relation(fields: [mainSubgroupCode], references: [code])
  families      CboFamily[]
}

model CboFamily {
  code       String        @id  // 4-digit
  title      String
  subgroupCode String
  subgroup   CboSubgroup   @relation(fields: [subgroupCode], references: [code])
  occupations CboOccupation[]
}

model CboOccupation {
  code        String      @id  // 6-digit CBO code (key identifier across all features)
  title       String
  description String?
  familyCode  String
  family      CboFamily   @relation(fields: [familyCode], references: [code])

  // Relations
  favoritedBy       FavoriteProfession[]
  marketMetrics     MarketMetrics[]
  qbqKnowledges     QbqKnowledge[]
  qbqSkills         QbqSkill[]
  qbqAttitudes      QbqAttitude[]
  careerPlans       CareerPlan[]
}

// ─── CNAE Hierarchy ───────────────────────────────────────────────────────────

model CnaeSection {
  code      String        @id  // Letter (A-U)
  title     String
  divisions CnaeDivision[]
}

model CnaeDivision {
  code     String      @id  // 2-digit
  title    String
  sectionCode String
  section  CnaeSection @relation(fields: [sectionCode], references: [code])
  groups   CnaeGroup[]
}

model CnaeGroup {
  code       String       @id  // 3-digit
  title      String
  divisionCode String
  division   CnaeDivision @relation(fields: [divisionCode], references: [code])
  classes    CnaeClass[]
}

model CnaeClass {
  code     String       @id  // 5-digit
  title    String
  groupCode String
  group    CnaeGroup    @relation(fields: [groupCode], references: [code])
  subclasses CnaeSubclass[]
}

model CnaeSubclass {
  code     String    @id  // 7-digit (used in RAIS and CAGED)
  title    String
  classCode String
  class    CnaeClass @relation(fields: [classCode], references: [code])
}

// ─── QBQ ──────────────────────────────────────────────────────────────────────

model QbqKnowledge {
  id             Int           @id @default(autoincrement())
  occupationCode String
  occupation     CboOccupation @relation(fields: [occupationCode], references: [code])
  description    String
}

model QbqSkill {
  id             Int           @id @default(autoincrement())
  occupationCode String
  occupation     CboOccupation @relation(fields: [occupationCode], references: [code])
  description    String
}

model QbqAttitude {
  id             Int           @id @default(autoincrement())
  occupationCode String
  occupation     CboOccupation @relation(fields: [occupationCode], references: [code])
  description    String
}

// ─── Qualifications / Courses ─────────────────────────────────────────────────

model Course {
  id          Int    @id @default(autoincrement())
  name        String
  type        String // 'technical' | 'technological' | 'graduate' | 'postgraduate'
  area        String?
  subarea     String?
  institution String?
  duration    String? // ex: "4 anos" or "1800h"
  degree      String? // ex: "Bacharel", "Tecnólogo", "Técnico"
}

// ─── Market Metrics (placeholder model — will be populated in Phase 06) ───────

model MarketMetrics {
  id             Int    @id @default(autoincrement())
  occupationCode String
  occupation     CboOccupation @relation(fields: [occupationCode], references: [code])
  uf             String  // state abbreviation (AC, AM, SP, etc.)
  region         String  // N | NE | CO | SE | S
  period         String  // YYYYMM for CAGED, YYYY for RAIS
  source         String  // 'caged' | 'rais'

  // CAGED metrics (monthly)
  admissions     Int?
  dismissals     Int?
  balance        Int?

  // RAIS metrics (annual)
  avgSalary      Float?
  avgWeeklyHours Float?
  avgTenureMonths Float?
  stockTotal     Int?   // total active employment bonds

  // Distribution JSON fields (RAIS only)
  ageDistribution       Json?  // { "18-24": 120, "25-34": 340, ... }
  sexDistribution       Json?  // { "M": 500, "F": 300 }
  educationDistribution Json?  // { "Ensino Médio": 200, "Superior": 150, ... }
  raceDistribution      Json?  // { "Branca": 300, "Parda": 250, ... }
  disabilityCount       Int?

  @@index([occupationCode, uf, period, source])
}
```

---

## ETL Scripts to Create

All scripts go in `scripts/etl/`. They are run manually from the terminal.

### Script 1 — `scripts/etl/01-load-cbo.ts`

**Input files:**
- `data/cbo/1_large_groups.csv`
- `data/cbo/2_main_subgroups.csv`
- `data/cbo/3_subgroups.csv`
- `data/cbo/4_families.csv`
- `data/cbo/5_occupations.csv`

**Process:**
1. Read each CSV file in order
2. Clean and normalize text (trim whitespace, fix encoding issues)
3. Upsert into corresponding Prisma models (use `upsert` to be re-runnable)
4. Log progress: "Loaded X occupations from CBO"

**Expected output:** ~2,600 occupations seeded in `CboOccupation`

### Script 2 — `scripts/etl/02-load-cnae.ts`

**Input files:**
- `data/cnae/1_section.csv`
- `data/cnae/2_division.csv`
- `data/cnae/3_group.csv`
- `data/cnae/4_class.csv`
- `data/cnae/5_subclass.csv`

**Process:** Same pattern as CBO — read, clean, upsert hierarchy.

**Expected output:** ~1,300 subclasses seeded in `CnaeSubclass`

### Script 3 — `scripts/etl/03-load-qbq.ts`

**Input files:**
- `data/qbq/3_knowledges.csv`
- `data/qbq/4_skills.csv`
- `data/qbq/5_attitudes.csv`

**Process:**
1. Read each file
2. Validate that `occupationCode` exists in `CboOccupation` (skip orphan rows, log count)
3. Upsert into `QbqKnowledge`, `QbqSkill`, `QbqAttitude`

### Script 4 — `scripts/etl/04-load-courses.ts`

**Input files:**
- `data/qualification/course/superior/graduate/Curso Superior.csv`
- `data/qualification/course/technical/cnct.csv`
- `data/qualification/course/superior/technological/cncst.csv`
- `data/qualification/course/postgraduate/ppg.csv`

**Process:**
1. Read each file and normalize column names (files may have different structures)
2. Map to unified `Course` model with `type` field set accordingly
3. Upsert all records

**Note:** Before writing the script, inspect the first 5 rows of each file to understand the column structure. Log what columns are found.

### Script 5 — `scripts/etl/run-all-static.ts`

Master script that runs 01 → 02 → 03 → 04 in sequence.

---

## How to Run

Add to `package.json`:
```json
"scripts": {
  "etl:cbo": "npx ts-node scripts/etl/01-load-cbo.ts",
  "etl:cnae": "npx ts-node scripts/etl/02-load-cnae.ts",
  "etl:qbq": "npx ts-node scripts/etl/03-load-qbq.ts",
  "etl:courses": "npx ts-node scripts/etl/04-load-courses.ts",
  "etl:static": "npx ts-node scripts/etl/run-all-static.ts"
}
```

Install `ts-node` if not present:
```bash
npm install --save-dev ts-node
```

Run the full static ETL:
```bash
npm run etl:static
```

---

## Inspection Step (Before Writing ETL)

Before writing any ETL code, Claude must:
1. Read the first 10 lines of each source CSV file to understand the structure
2. Report to Yan: column names, separator, encoding, approximate row count
3. Wait for Yan's confirmation before writing the parsing code

This prevents wasted effort from incorrect assumptions about file structure.

---

## Acceptance Criteria

- [ ] `npm run etl:static` runs without errors
- [ ] `CboOccupation` table has records (verify in Prisma Studio)
- [ ] `CnaeSubclass` table has records
- [ ] `QbqSkill`, `QbqKnowledge`, `QbqAttitude` tables have records
- [ ] `Course` table has records of all 4 types
- [ ] Running the script twice doesn't create duplicates (upsert works)
- [ ] Progress logs are clear and show how many records were loaded from each file

---

## Terminal prompt for Yan to paste

```
Leia o CLAUDE.md e depois leia docs/phases/PHASE_05_ETL_STATIC.md.

Vamos executar a Fase 05 - ETL de Dados Estáticos.

ANTES DE QUALQUER COISA: Leia os primeiros 10 a 20 linhas de cada arquivo CSV listado na fase
e me mostre:
1. Os nomes das colunas de cada arquivo
2. O separador usado (vírgula, ponto-e-vírgula, tab?)
3. A codificação do arquivo (UTF-8, Latin-1?)
4. Quantas linhas aproximadas cada arquivo tem

Apenas depois que eu confirmar o entendimento dos arquivos, proponha o schema do banco e
os scripts ETL. Aguarde minha aprovação antes de implementar.
```
