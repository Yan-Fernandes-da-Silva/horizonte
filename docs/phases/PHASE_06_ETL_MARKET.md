# Phase 06 — ETL: Market Data (CAGED + RAIS)

**Status**: Pending
**Estimated time**: 6–10 hours
**Prerequisites**: Phase 05 complete (CBO and CNAE must be seeded)

---

## What this phase accomplishes

Process the raw CAGED and RAIS government data files and store pre-calculated market metrics in the database. This feeds the entire "Mercado de Trabalho" feature.

> **Critical performance note**: RAIS files are large (potentially multiple GB when extracted from .7z). 
> The ETL strategy is: process in chunks, calculate aggregates, store ONLY summaries.
> Never store raw rows in the database.

---

## Available Data Files

### CAGED (Monthly — April 2026)
```
data/caged/202604/CAGEDMOV202604/CAGEDMOV202604.txt   ← Main movement file
data/caged/202604/CAGEDEXC202604/CAGEDEXC202604.txt   ← Exclusions (records cancelled)
data/caged/202604/CAGEDFOR202604/CAGEDFOR202604.txt   ← Complementary data
```

Layout reference: `data/caged/explanatory-notes/Layout Não-identificado Novo Caged Movimentação.xlsx`

**Key columns from CAGEDMOV:**

| Column | Description |
|---|---|
| `competênciamov` | Reference month (AAAAMM) |
| `região` | Region code (1=N, 2=NE, 3=CO, 4=SE, 5=S) |
| `uf` | State code (IBGE code — 11=RO, 12=AC, ... 53=DF) |
| `município` | Municipality IBGE code |
| `cbo2002ocupação` | CBO occupation code (6 digits) |
| `subclasse` | CNAE subclass code |
| `saldomovimentação` | Movement balance (1=admission, -1=dismissal) |
| `salário` | Salary (decimal) |
| `horascontratuais` | Contractual weekly hours |
| `tipomovimentação` | Type of movement |
| `indicadoraprendiz` | Apprentice indicator |
| `indicadordeexclusão` | Exclusion flag (should be filtered out: only process records where this = 0) |

### RAIS 2025 (Annual)
```
data/rais/2025/RAIS_VINC_PUB_NORTE.7z        ← North region (must be extracted)
data/rais/2025/RAIS_VINC_PUB_NORDESTE.7z     ← Northeast
data/rais/2025/RAIS_VINC_PUB_CENTRO_OESTE.7z ← Center-West
data/rais/2025/RAIS_VINC_PUB_MG_ES_RJ.7z    ← Southeast (MG, ES, RJ)
data/rais/2025/RAIS_VINC_PUB_SP.7z           ← São Paulo
data/rais/2025/RAIS_VINC_PUB_SUL.7z          ← South
data/rais/2025/RAIS_VINC_PUB_NI.7z           ← Non-identified
data/rais/2025/RAIS_ESTAB_PUB.7z             ← Establishments (not needed for our metrics)
```

Layout reference: `data/rais/vinculos/RAIS_vinculos_layout2020.xls`

**Key columns from RAIS VINC:**

| Column | Description |
|---|---|
| `CBO Ocupação 2002` | CBO occupation code (6 digits) |
| `Município` | Municipality IBGE code |
| `UF` | State abbreviation |
| `Subclasse CNAE 2.0` | CNAE subclass (7 digits) |
| `Grau de Instrução` | Education level (coded) |
| `Horas Contratuais` | Weekly contractual hours |
| `Idade` | Age of worker |
| `Sexo Trabalhador` | Sex (1=Male, 2=Female) |
| `Raça Cor` | Race/color (coded) |
| `Tempo de Emprego` | Duration of employment in months |
| `Remuneração Média Nominal` | Average salary |
| `Ind Portador Defic` | Disability indicator |
| `Faixa Etária` | Age range (coded) |
| `Faixa Remun Média (SM)` | Salary range in minimum wages |

---

## ETL Strategy

### Phase 6 Approach: Aggregate-only ETL

For each occupation (CBO code) × UF × period, calculate and store:

**From CAGED (per occupation × UF × YYYYMM):**
- Total admissions (count of rows where `saldomovimentação = 1`)
- Total dismissals (count of rows where `saldomovimentação = -1`)
- Net balance (admissions - dismissals)

**From RAIS (per occupation × UF × YYYY):**
- Average salary
- Average weekly hours
- Average tenure (months)
- Total active bonds (stock)
- Age distribution (count per age range)
- Sex distribution (count per sex)
- Education distribution (count per education level)
- Race distribution (count per race)
- Disability count

---

## ETL Scripts to Create

### `scripts/etl/05-inspect-caged.ts`
Read and display the first 5 rows of CAGEDMOV file. Show all column names.
This is a diagnostic script to understand the file structure before processing.

### `scripts/etl/06-load-caged.ts`

```typescript
// Process CAGEDMOV202604.txt (pipe-separated or semicolon-separated, likely Latin-1)
// 1. Read file line by line (streaming — don't load all into memory)
// 2. Filter: skip rows where indicadordeexclusão != 0
// 3. Parse: extract occupationCode, uf, region, salary, hours, movementType
// 4. Map UF IBGE codes to abbreviations (11→RO, 12→AC, 13→AM, ... 53→DF)
// 5. Map region codes: 1→N, 2→NE, 3→CO, 4→SE, 5→S
// 6. Group by: occupationCode + uf + period (202604)
// 7. Calculate per group: admissions, dismissals, balance
// 8. Upsert into MarketMetrics (source='caged')
// 9. Log: how many records processed, how many groups created
```

### `scripts/etl/07-inspect-rais.ts`
Check if .7z files are extracted. If not, instruct Yan to extract them manually using 7-Zip.
Read and display first 5 rows of one RAIS file. Show column names.

> **Important note for Yan**: The RAIS .7z files need to be extracted manually before the ETL can process them.
> Right-click the .7z file → "Extract here" (using 7-Zip software).
> The extracted .txt files may be several GB each. Make sure you have enough disk space.

### `scripts/etl/08-load-rais.ts`

```typescript
// Process each extracted RAIS_VINC_PUB_*.txt file
// Uses streaming to avoid memory overflow
// 1. Read file line by line
// 2. Parse columns (likely semicolon-separated, Latin-1 encoded)
// 3. Filter: skip rows with missing CBO or UF
// 4. Group by: occupationCode + UF + '2025'
// 5. Calculate per group:
//    - avgSalary (mean of Remuneração Média Nominal)
//    - avgWeeklyHours (mean of Horas Contratuais)
//    - avgTenureMonths (mean of Tempo de Emprego)
//    - stockTotal (count of rows)
//    - ageDistribution (count per Faixa Etária)
//    - sexDistribution (count per Sexo Trabalhador)
//    - educationDistribution (count per Grau de Instrução)
//    - raceDistribution (count per Raça Cor)
//    - disabilityCount (count where Ind Portador Defic = 'S')
// 6. Upsert into MarketMetrics (source='rais')
// Log progress every 100,000 rows
```

### `scripts/etl/run-all-market.ts`

Runs scripts 06 and 08 in sequence.
Includes preflight check: verifies CboOccupation table has data before proceeding.

---

## Reference Maps for ETL

### UF IBGE Code → Abbreviation
```
11=RO, 12=AC, 13=AM, 14=RR, 15=PA, 16=AP, 17=TO   (Norte)
21=MA, 22=PI, 23=CE, 24=RN, 25=PB, 26=PE, 27=AL, 28=SE, 29=BA   (Nordeste)
31=MG, 32=ES, 33=RJ, 35=SP   (Sudeste)
41=PR, 42=SC, 43=RS   (Sul)
50=MS, 51=MT, 52=GO, 53=DF   (Centro-Oeste)
```

### Region Code → Name
```
1=Norte, 2=Nordeste, 3=Centro-Oeste, 4=Sudeste, 5=Sul
```

### RAIS Education Level Codes
```
1=Analfabeto, 2=Até 5ª Inc, 3=5ª Completo, 4=6ª a 9ª Inc,
5=Fund Completo, 6=Médio Inc, 7=Médio Completo, 8=Sup Inc,
9=Superior Completo, 10=Mestrado, 11=Doutorado
```

### RAIS Race Color Codes
```
1=Indígena, 2=Branca, 4=Negra, 6=Amarela, 8=Parda, 9=Não identificada
```

### RAIS Sex Codes
```
1=Masculino, 2=Feminino
```

---

## Add npm scripts

```json
"etl:caged": "npx ts-node scripts/etl/06-load-caged.ts",
"etl:rais": "npx ts-node scripts/etl/08-load-rais.ts",
"etl:market": "npx ts-node scripts/etl/run-all-market.ts"
```

---

## Acceptance Criteria

- [ ] CAGED script runs without errors and populates `MarketMetrics` with `source='caged'`
- [ ] RAIS script runs without errors and populates `MarketMetrics` with `source='rais'`
- [ ] Metrics look reasonable (verify 2-3 occupations in Prisma Studio)
- [ ] Running scripts twice does not create duplicate rows (upsert works)
- [ ] At least 200+ occupation codes have market data

---

## Terminal prompt for Yan to paste

```
Leia o CLAUDE.md e depois leia docs/phases/PHASE_06_ETL_MARKET.md.

Vamos executar a Fase 06 - ETL de Dados de Mercado (CAGED e RAIS).

ANTES DE QUALQUER COISA:
1. Crie o script de inspeção para o CAGED e me mostre as primeiras linhas e nomes de colunas
2. Verifique se os arquivos RAIS .7z já foram extraídos
3. Me diga se preciso instalar alguma ferramenta extra (como 7-Zip) para extrair os arquivos

Apenas depois da minha aprovação, crie os scripts de ETL.

IMPORTANTE: Os arquivos RAIS podem ser muito grandes. Use leitura em stream (linha por linha)
e nunca carregue o arquivo inteiro na memória.
```
