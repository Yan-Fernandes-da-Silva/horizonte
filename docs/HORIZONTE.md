# Horizonte — Documento de Visão do Projeto

> Este documento é a referência completa da visão do projeto.
> Qualquer dúvida sobre o que o site deve fazer, consulte este arquivo.
> Última atualização: 2026-06

---

## 1. Visão Geral

**Horizonte** é uma plataforma web de copiloto de carreira profissional.
Seu objetivo é ajudar dois tipos de usuário:

1. **Quem está começando** — jovens e pessoas sem clareza sobre o que querem fazer da vida profissional
2. **Quem quer mudar** — pessoas que desejam migrar de carreira, mudar de área, função ou cargo

O site oferece orientação baseada em dados reais do mercado de trabalho brasileiro, combinando testes psicométricos validados com dados abertos do governo federal.

---

## 2. Identidade Visual

### Conceito
A identidade visual segue a metáfora do **horizonte náutico**:
- Oceano azul profundo como âncora visual
- Céu claro e ensolarado como aspiração
- Linha do horizonte como destino a alcançar
- Bússola / timão como guia e direção
- Ondas suaves como movimento progressivo

### Paleta de Cores
| Papel       | Cor                   | Hex       |
|-------------|----------------------|-----------|
| Primária    | Azul oceano profundo  | `#0A2342` |
| Primária 2  | Azul claro / ciano    | `#00B4D8` |
| Destaque    | Dourado suave         | `#F4A261` |
| Destaque 2  | Laranja solar         | `#E76F51` |
| Base        | Branco                | `#FFFFFF` |
| Base 2      | Areia clara           | `#FAF5EB` |
| Texto muted | Cinza azulado         | `#64748B` |

### Referências Visuais
- Glassmorphism leve em cards
- Ondas abstratas como elementos decorativos de fundo
- Gradientes naturais oceano → céu
- Ilustrações semi-flat com motivos náuticos
- Motion suave simulando água e ondas
- Mapas náuticos minimalistas como padrão de fundo

### Tipografia
- **Fonte principal**: Inter
- **Hierarquia**: títulos bold, subtítulos medium, corpo regular
- **Tom**: profissional mas acessível e encorajador

---

## 3. Funcionalidades Principais

### 3.1 Teste Vocacional

**Objetivo**: O usuário responde a um questionário e descobre suas tendências profissionais, habilidades e profissões compatíveis.

#### Bases Teóricas do Teste
O teste integra três frameworks validados:
- **RIASEC** (Holland) — 6 tipos: Realista, Investigativo, Artístico, Social, Empreendedor, Convencional
- **Inteligências Múltiplas** (Gardner) — 8 inteligências: Linguística, Lógico-Matemática, Espacial, Musical, Corporal-Cinestésica, Naturalista, Interpessoal, Intrapessoal
- **GOPC** (Guia de Orientação Profissional e de Carreira) — contexto, valores, obstáculos, motivações

#### Questionário
- Dividido em seções: RIASEC → Inteligências Múltiplas → GOPC → Análise Pessoal
- Barra de progresso mostrando seção atual e % concluída
- **Tipos de questão misturados** (não apenas escala Likert):
  - Escala de concordância (Discordo Totalmente → Concordo Totalmente)
  - Múltipla escolha (marcar várias opções)
  - Ordenação de preferência (rankear opções por arrastar)
  - Seleção visual (escolher imagens que representam ambientes/atividades)
  - Seleção de "gosto / não gosto" em listas
- Total estimado: ~60 perguntas divididas em 4 seções
- O usuário pode pausar e retomar depois

#### Resultado
Após completar o teste, o usuário recebe:

**Seção RIASEC**
- Radar/spider chart com os 6 tipos e pontuação de cada um
- Descrição dos 3 tipos dominantes
- Características, pontos fortes e áreas de desenvolvimento

**Seção Inteligências Múltiplas**
- Gráfico de barras horizontais com os 8 tipos
- Descrição das 3 inteligências mais fortes

**Seção GOPC**
- Resumo de valores, motivações e contexto atual
- Perfil narrativo gerado a partir das respostas

**Profissões Compatíveis**
- Lista de ocupações do CBO compatíveis com o perfil
- Filtráveis por área, nível de educação exigido
- Cada ocupação com: nome, descrição curta, botão de favoritar, botão de ver no Mercado de Trabalho

**Qualificações Compatíveis**
- Lista de cursos técnicos, tecnológicos e de graduação compatíveis
- Com informações de área, tipo, carga horária

---

### 3.2 Mercado de Trabalho

**Objetivo**: O usuário pesquisa uma profissão e obtém um dashboard interativo com dados reais do mercado de trabalho brasileiro.

**Fonte de dados**: CAGED (mensal) + RAIS (anual) + CBO + QBQ + CNAE

> **Importante sobre os dados**: Os dados brutos são processados via ETL e apenas métricas pré-calculadas são armazenadas no banco. Não há consulta em tempo real — os dados refletem a última atualização disponível (CAGED: abril/2026; RAIS: 2025).

#### Pesquisa
- Campo de busca por profissão (autocomplete baseado no CBO)
- Ou busca por área de atuação (divisão do CNAE 2.0)
- Possibilidade de comparar 2 profissões

#### Dashboard por Profissão

**Abas disponíveis:**

**📊 Visão Geral** (nível Brasil — sem filtros de localidade)

| Card | Indicador | Visualização |
|------|-----------|--------------|
| Situação do mercado | Queda / Retração / Equilibrado / Crescendo / Aquecido | Linear Gauge Chart |
| Rotatividade | Alta / Moderada / Baixa | Badge colorido + explicação |
| Concorrência | Alta / Moderada / Baixa | Badge colorido + explicação |
| Mercado | Onde mais/menos admitiram e demitiram | Mapa mini + texto |
| Remuneração | Salário médio BR, horas contratuais, duração média | 3 cards numéricos |
| Perfil | Idade, sexo, escolaridade, raça-cor, deficiência | Chips informativos |

---

**🗺️ Mercado de Trabalho** (com filtros de localidade)

Filtros: Brasil → Região → Estado

Painel esquerdo: Mapa interativo do Brasil (clicável por região e estado)
Painel direito: Dados filtrados

| Visualização | Dado |
|---|---|
| Mapa dinâmico com cores | Saldo de movimentação por localidade |
| Tabela | Mais/menos admissões e desligamentos por estado |
| Cards | Saldo total, total admitido, total desligado |

Definições:
- **Bastante disputado**: estoque baixo em comparação às outras ocupações
- **Levemente disputado**: estoque alto em comparação às outras ocupações

---

**💰 Remuneração** (com filtros de localidade)

Filtros: Brasil → Região → Estado

| Card | Dado |
|---|---|
| Salário médio (+ valor/hora) | Média ponderada de todos os vínculos |
| Menor salário (onde?) | Estado com menor remuneração média |
| Maior salário (onde?) | Estado com maior remuneração média |
| Horas contratuais médias | Média de horas por semana |
| Duração média do vínculo | Em meses |

Tabela dinâmica: ranking de estados por remuneração (mais → menos pagos)

---

**👤 Perfil Profissional** (com filtros de localidade)

Filtros: Brasil → Região → Estado

| Visualização | Dado |
|---|---|
| Age-Sex Pyramid Chart | Distribuição por faixa etária e sexo |
| Horizontal bar chart | Distribuição por escolaridade |
| Donut chart | Distribuição por raça-cor |
| Donut chart | Com / sem deficiência |

---

**🛠️ Habilidades** (por área de atuação CNAE)

Diferente das outras abas, aqui o filtro é por **área de atuação (divisão CNAE)** e não por profissão.

- Word Cloud Chart das habilidades em alta (profissões crescendo → habilidades do QBQ relacionadas)
- Word Cloud Chart das habilidades em baixa (profissões em queda → habilidades do QBQ relacionadas)
- Filtro de localidade disponível

---

#### Lógica de Cálculo dos Indicadores

**Situação do mercado:**
Baseado no saldo (admissões - desligamentos) relativo ao estoque:
- Queda: saldo muito negativo
- Retração: saldo levemente negativo
- Equilibrado: saldo próximo de zero
- Crescendo: saldo positivo moderado
- Aquecido: saldo muito positivo

**Rotatividade:**
Baseada na duração média do vínculo ativo comparada às outras ocupações:
- Alta: duração está no tercil inferior (< 33% das profissões)
- Moderada: duração está no tercil médio (33% a 66%)
- Baixa: duração está no tercil superior (> 66%)

**Concorrência:**
Baseada no ratio admissões/desligamentos comparado às outras ocupações:
- Alta: muitos desligamentos, poucas admissões (> 66% das profissões)
- Moderada: equilíbrio relativo (33% a 66%)
- Baixa: muitas admissões, poucos desligamentos (< 33%)

---

### 3.3 Plano de Carreira

**Objetivo**: O usuário completa um questionário rápido baseado em metas SMART e recebe um roadmap personalizado, editável e acompanhável.

**Pré-requisito**: O usuário idealmente já completou o teste vocacional e/ou favoritou uma profissão no Mercado de Trabalho. Pode também acessar diretamente.

#### Questionário (6 perguntas)

| # | Pergunta | Tipo |
|---|---|---|
| 1 | Em que momento da sua trajetória profissional você está? | Seleção única |
| 2 | Qual é o prazo que você tem para tomar uma decisão? | Seleção única |
| 3 | O que você mais busca em uma nova carreira? | Seleção única |
| 4 | Quais são os principais obstáculos que você enfrenta? | Seleção múltipla (máx. 2) |
| 5 | Qual frase descreve melhor sua situação atual? | Seleção única |
| 6 | Quanto tempo você tem disponível por semana? | Seleção única |

#### Resultado — Roadmap Personalizado

Gerado via API da IA (Claude), personalizado com:
- Resultado do teste vocacional do usuário (se disponível)
- Profissão favoritada (se disponível)
- Respostas do questionário SMART

**Seções do Roadmap:**

**1. Ponto de partida e destino**
- Onde você está hoje (contexto atual)
- Onde quer chegar (objetivo)
- O que separa esses dois pontos

**2. Trilhas de aprendizado**
- Conteúdo recomendado
- Cursos (gratuitos e pagos)
- Livros
- Projetos práticos
- Certificações

**3. Cronograma**
- Curto prazo: 30 dias a 12 meses
- Médio prazo: 1 ano a 3 anos
- Longo prazo: 3 anos ou mais

**4. Recomendações Estratégicas**
- Networking (como e onde)
- Idiomas (necessidade e prioridade)
- Portfólio (o que construir)
- Hábitos (o que desenvolver)

**5. Dashboard de Evolução**
- % de tarefas concluídas
- Streak de dias ativos
- Gamificação simples (badges por marcos)

#### Customização do Roadmap
Após gerado, o usuário pode:
- ✅ Marcar tarefas como concluídas
- ✏️ Editar título e descrição de tarefas
- ➕ Adicionar novas tarefas
- 🗑️ Remover tarefas que não fazem sentido
- 📅 Alterar datas e prazos
- 📌 Reorganizar a ordem das tarefas

---

## 4. Funcionalidades Secundárias

### 4.1 Página de Apresentação (pré-login)

Página pública para apresentar o Horizonte a novos visitantes.

**Seções:**
1. **Hero**: Logo + nome + slogan + CTA de cadastro
2. **O que é o Horizonte**: Descrição curta e envolvente
3. **Funcionalidades**: Cards para Teste Vocacional, Mercado de Trabalho e Plano de Carreira
4. **Como funciona**: Passos numerados (Faça o teste → Explore o mercado → Monte seu plano)
5. **CTA Final**: Botão de cadastro + opção de login para quem já tem conta

**Header (pré-login)**: Logo à esquerda + botões "Entrar" e "Cadastrar" à direita

---

### 4.2 Página Inicial / Home Dashboard (pós-login)

Painel de boas-vindas que mostra o resumo de atividade do usuário.

**Header (pós-login)**:
- Esquerda: Logo + "Horizonte"
- Centro: Links para "Teste Vocacional", "Mercado de Trabalho", "Plano de Carreira"
- Direita: Avatar do usuário + nome + dropdown de configurações/logout

**Footer**:
- Centro-esquerda: Link do GitHub
- Centro-direita: "Horizonte — Acompanhamento inteligente da sua carreira profissional"

**Cards de Status das Funcionalidades:**

| Funcionalidade | Estado | Card exibe |
|---|---|---|
| Teste Vocacional | Não iniciado | "Descubra seu perfil profissional" + CTA de iniciar |
| Teste Vocacional | Incompleto | "Continue de onde parou" + % de progresso + CTA de continuar |
| Teste Vocacional | Concluído | Resumo dos 3 tipos dominantes + CTAs de rever ou refazer |
| Mercado de Trabalho | Sem favoritos | "Explore o mercado de trabalho" + CTA de explorar |
| Mercado de Trabalho | Com favoritos | Profissão favoritada principal + mini-resumo + CTA de comparar |
| Plano de Carreira | Não iniciado | "Monte seu plano de carreira" + CTA de iniciar |
| Plano de Carreira | Com plano | % de conclusão + próxima tarefa pendente + CTA de atualizar |

---

### 4.3 Autenticação (CRUD de Usuário)

| Ação | Rota | Descrição |
|---|---|---|
| Cadastro | `/auth/register` | Nome, email, senha, confirmação de senha |
| Login | `/auth/login` | Email e senha |
| Recuperar senha | `/auth/forgot-password` | Email → link de recuperação (apenas visual para o MVP) |
| Editar perfil | `/settings` | Nome, avatar, alterar senha |
| Excluir conta | `/settings` | Com confirmação |

**Regras de senha**: Mínimo 8 caracteres, ao menos 1 número e 1 letra maiúscula.
**Segurança**: Senha armazenada com hash bcrypt.

---

## 5. Arquitetura de Dados

### 5.1 Dados Estáticos (ETL → Seed → PostgreSQL)

Esses dados são importados uma vez e raramente mudam:

**CBO — Classificação Brasileira de Ocupações**
- Hierarquia: Grande Grupo → Subgrupo Principal → Subgrupo → Família → Ocupação
- Chave: código CBO de 6 dígitos (ex: 211105 = Astrônomo)
- Usado em: Mercado de Trabalho, Teste Vocacional (resultado), Plano de Carreira

**CNAE 2.0 — Classificação Nacional de Atividades Econômicas**
- Hierarquia: Seção → Divisão → Grupo → Classe → Subclasse
- Chave: código de subclasse (7 dígitos)
- Usado em: Mercado de Trabalho (área de atuação), ETL CAGED/RAIS

**QBQ — Quadro de Bases de Qualificações**
- Relaciona ocupações CBO com conhecimentos, habilidades e atitudes
- Usado em: Mercado de Trabalho (aba Habilidades)

**Qualificações — Cursos**
- Cursos técnicos (CNCT)
- Cursos superiores de graduação
- Cursos tecnológicos (CNCST)
- Pós-graduação (PPG)
- Usado em: Teste Vocacional (resultado — qualificações compatíveis)

---

### 5.2 Dados de Mercado (ETL → Métricas Pré-Calculadas → PostgreSQL)

Os dados brutos do CAGED e RAIS são grandes. A ETL processa e grava apenas métricas resumidas:

**Do CAGED (mensal) — colunas relevantes:**
- `cbo2002ocupação` → código CBO da ocupação
- `região` → código de região (1-5)
- `uf` → código do estado (11-53)
- `saldomovimentação` → saldo do período (+/-)
- `competenciadec` → mês de referência (AAAAMM)
- `indicadordeexclusão` → se a movimentação foi excluída

**Da RAIS (anual) — colunas relevantes:**
- `CBO Ocupação 2002` → código CBO
- `SubClasse CNAE 2.0` → para cruzar com CNAE
- `Mun Trab` → município de trabalho
- `Remun Med` → remuneração média
- `Horas Contratuais Semanais` → horas por semana
- `Tempo Emprego` → duração do vínculo em meses
- `Grau de Instrução` → escolaridade
- `Faixa Etária` → faixa etária do trabalhador
- `Sexo` → 1=Masculino, 2=Feminino
- `Raça Cor` → raça/cor declarada
- `Ind Portador Defic` → deficiência (S/N)

**Métricas pré-calculadas armazenadas** (por ocupação CBO + UF + período):
- Total de admissões
- Total de desligamentos
- Saldo (admissões - desligamentos)
- Salário médio
- Horas contratuais médias
- Duração média do vínculo
- Distribuição por faixa etária (JSON)
- Distribuição por sexo (JSON)
- Distribuição por escolaridade (JSON)
- Distribuição por raça-cor (JSON)
- % com deficiência

---

## 6. Fluxo do Usuário

```
Usuário novo
    │
    ▼
Página de Apresentação → Cadastro → Login
    │
    ▼
Home Dashboard (cards de status)
    │
    ├─► Teste Vocacional
    │       │
    │       ├─ Seção RIASEC
    │       ├─ Seção Inteligências Múltiplas
    │       ├─ Seção GOPC
    │       └─ Resultado → Lista de profissões → [favoritar] → Mercado de Trabalho
    │
    ├─► Mercado de Trabalho
    │       │
    │       ├─ Pesquisar profissão ou área
    │       ├─ Dashboard (Visão Geral / Mercado / Remuneração / Perfil / Habilidades)
    │       └─ [favoritar profissão] → aparece no Home
    │
    └─► Plano de Carreira
            │
            ├─ Questionário SMART (6 perguntas)
            ├─ Geração do roadmap via IA
            └─ Roadmap editável e acompanhável
```

---

## 7. Notas Importantes para o Desenvolvimento

1. **MVP First**: Começar com a versão mínima funcional. O Chatbot é opcional e deve ser deixado para o final.
2. **ETL separada**: Os scripts de ETL são utilitários de terminal, não parte da interface.
3. **Dados sensíveis**: Nunca commitar `.env.local`. O `.env.example` deve ter todos os campos sem valores.
4. **Acessibilidade**: Usar labels corretos em formulários, contraste adequado, foco visível.
5. **Responsividade**: O site deve funcionar em mobile e desktop.
6. **Dados mockados inicialmente**: Durante o desenvolvimento da UI, usar dados mockados. ETL vem depois.
