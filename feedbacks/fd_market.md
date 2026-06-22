# Feedback — Mercado de Trabalho / Busca de profissões (`/labor-market`)

Última atualização: 2026-06-22 · Origem: feedback do Yan (terminal)
Legenda — Status: ⬜ pendente · 🔄 em andamento · ✅ feito
Viabilidade — ✅ dá para fazer · ⚠️ dá para fazer, mas precisa de uma decisão sua

> Telas: **Busca de profissões** ↔ rota `/labor-market`.
> ✅ **Aprovado e executado pelo Yan em 2026-06-22.** Decisão (A): visual da home confirmado
> (fundo mar + caixas translúcidas + texto branco).

---

## 1. (🎨 Visual · Ambos) **Viabilidade: ⚠️ (precisa de confirmação — ver Dúvida A)**

Deixar a página de busca do Mercado de Trabalho com o **mesmo visual da página inicial
pós-login** (`/home`): **fundo mar full-bleed** (`bg-sea-top`), caixas **translúcidas**
(`bg-white/10`, borda `border-white/15`, `backdrop-blur-sm`), **texto branco** e detalhes em
**dourado** — no lugar do fundo claro + caixa em gradiente oceano atuais.

Status: ✅

---

## 2. (🐞 Bug · Ambos) **Viabilidade: ✅**

Na **barra de pesquisa**, o **texto digitado** aparece em **branco** (fica ilegível).
→ Deixar o texto digitado em **preto** (cor escura / `text-ocean`), mantendo o placeholder
legível.

*(Causa provável: o input herda `text-white` da caixa escura em volta.)*

Status: ✅

---

## 3. (✍️ Texto · Ambos) **Viabilidade: ✅**

Trocar a descrição do topo:

- **Hoje:** "Pesquise uma profissão e explore salários, demanda e perfil dos profissionais
  com dados reais do CAGED e da RAIS."
- **Novo:** "Pesquise profissões de acordo com a Classificação Brasileira de Ocupações (CBO)
  e explore as estatísticas e tendências do mercado de trabalho fundamentadas no Cadastro
  Geral de Empregados e Desempregados (CAGED) e na Relação Anual de Informações Sociais
  (RAIS)."

Status: ✅

---

## 4. (🐞 Bug · Ambos) **Viabilidade: ✅**

Na barra de pesquisa, a **lista de opções** (autocomplete) continua aparecendo mesmo quando o
usuário **clica fora** da barra (sem trocar de página).
→ A lista deve **se ocultar** ao clicar fora da barra/lista, e **voltar a aparecer** quando o
usuário clicar (focar) novamente na barra de pesquisa (havendo resultados).

*(Implementação: fechar ao clicar fora — detecção de clique externo — mantendo a reabertura no
foco que já existe.)*

Status: ✅

---

## 5. (🐞 Bug · Ambos) **Viabilidade: ✅**

O **ícone de carregando** à direita da barra fica **"pulando"** (desce um pouco e volta pra
cima, em loop) em vez de girar parado.
→ Deixá-lo **fixo no lugar**, **girando no próprio eixo** (sensação de carregamento).

*(Causa: a animação de giro (`animate-spin`) sobrescreve o ajuste de centralização vertical
(`-translate-y-1/2`), fazendo o ícone "saltar". Correção: separar a centralização do giro —
um elemento posiciona, o ícone interno gira.)*

Status: ✅

---

## 🟠 Dúvidas / decisões do assistente

**A) "Mesmo visual da home".** Confirmo o entendimento (fundo mar full-bleed + caixas
translúcidas + texto branco)? Obs.: este item interage com o **item 2** — se a caixa de busca
deixar de ser escura, o texto do input já tende a ficar escuro naturalmente; mesmo assim vou
garantir o texto preto explicitamente. Confirma o visual?

---

## 🔁 Ajustes — Rodada 2 (2026-06-22) — todos ✅

- **Descrição do topo** agora ocupa **toda a largura** do painel (antes limitada/estreita).
- **Ícones dourados:** o ícone do gráfico (ao lado do título) e o coração de "profissões
  favoritas" ficaram **dourados**, como na home.
- **Bug de sobreposição corrigido:** a lista de sugestões da busca agora aparece **acima** da
  seção de profissões favoritas (z-index do painel ajustado).
- **Cards de favoritas:** título com **2 linhas fixas** e **código CBO alinhado** entre os
  cards, como na home.
- **Página interna (dashboard da profissão):** moldura mar + cabeçalho translúcido; filtros,
  abas e gráficos continuam em superfícies claras (Opção A — ver `fd_home.md` Rodada 4).

---

## 🔁 Ajustes — Rodada 3 (2026-06-22) — ✅

- **Limite de 5 profissões favoritas.** Aplicado no servidor (`/api/favorites`): ao tentar
  favoritar a 6ª, a ação é bloqueada. Ao chegar no limite, aparece um **aviso no canto
  inferior direito, um pouco acima do rodapé**, com o **mesmo visual do cabeçalho/rodapé**
  (azul-oceano sólido, texto branco, ícone de alerta dourado) — some sozinho em ~5s ou pode
  ser fechado no "x". Mensagem: *"Você pode favoritar no máximo 5 profissões. Remova uma para
  adicionar outra."*

---

## 📋 Reformulação do Dashboard de Mercado (2026-06-22) — ✅ implementado (em 3 partes)

> Pacote grande de mudanças no **painel de uma profissão** (`/labor-market/[code]`) e na
> unificação com a busca. Itens marcados ⬜ (pendentes). Viabilidade: ✅ dá para fazer ·
> ⚠️ precisa de uma decisão sua (ver Dúvidas no fim).
>
> **✅ Decisões do Yan (2026-06-22):**
> - **A** → Voltar às favoritas com **botão "Ver minhas favoritas"** no topo.
> - **B** → Mapa real com **`react-simple-maps` + TopoJSON do Brasil** (nova dependência).
> - **C** → Filtros de atividade econômica como **2 seletores desabilitados ("em breve")**.
> - **D** → Gráficos/tabelas **recoloridos para o escuro** (texto/eixos brancos) nas caixas de vidro.

### M1. (🎨 Visual · Ambos) Caixas no estilo da home (vidro translúcido) — ⚠️ (ver Dúvida D)
Todas as caixas do dashboard devem adotar o visual da home (vidro translúcido `bg-white/10`,
texto branco, ícone dourado): **caixa de filtros**, **caixa de abas**, as **6 caixas da Visão
Geral** e, por consequência, **todas as caixas das outras abas** (Mercado, Remuneração, Perfil).
Fundo mar e painel do topo já estão certos.
⚠️ Implicação: gráficos e tabelas precisam ser **recoloridos** para ficar legíveis no escuro.
Status: ✅

### M2. (🎨 Layout · Ambos) Abas + filtros na mesma linha — ⚠️ (ver Dúvida C)
Unir o painel de **abas** (Visão Geral / Mercado / Remuneração / Perfil) com o painel de
**filtros** numa mesma faixa: **abas à esquerda**, **filtros à direita**.
Os filtros terão (futuramente) além de **Localidade** (região + estado) também **Atividade
econômica**, com **2 novos seletores**: **Subsetor econômico (IBGE)** e **Divisão (CNAE 2.0)**.
A atividade econômica **não será implementada agora** — só preciso **ajustar espaço e visual**
para comportar esses 2 seletores a mais.
Status: ✅

### M3. (🎨 Visual · Ambos) Visão Geral — ícones, tags e alinhamento
- Cada uma das **6 caixas** (Situação, Rotatividade, Concorrência, Mercado, Remuneração,
  Perfil) ganha um **ícone**, como as caixas pelo resto do site.
- **Tags à direita do título:** as tags **Alta/Moderada/Baixa** ficam ao lado direito do título
  em **Rotatividade** e **Concorrência**. Em **"Situação do mercado"** → renomear para só
  **"Situação"** e pôr a tag (Equilibrado etc.) **à direita do título** também.
- **Alinhar a frase** das 3 caixas (Situação, Rotatividade, Concorrência) fixando **2 linhas**.
- **Cores (mais fortes):** verde = Baixa · amarelo = Moderada · vermelho = Alta. Para a
  **Situação**, escala da esquerda→direita: **vermelho → laranja → amarelo → verde claro →
  verde escuro** (proponho: Queda `#DC2626`, Retração `#F4A261`/laranja, Equilibrado amarelo
  `#EAB308`, Crescendo verde claro `#4ADE80`, Aquecido verde escuro `#16A34A`).
Status: ✅

### M4. (✍️/🎨 · Ambos) Cabeçalho da profissão
- **Remover** o texto **"Dados de Brasil"** (e variações por região/estado).
- **Botão Favoritar:** quando **favoritado**, ficar **vermelho** (fundo vermelho suave + ícone
  vermelho mais forte/preenchido).
Status: ✅

### M5. (⚙️ Arquitetura · Ambos) Busca + dashboard numa única tela — ⚠️ (ver Dúvida A)
Hoje são 2 telas: a busca/apresentação (`/labor-market`) e o painel da profissão
(`/labor-market/[code]`). → Unir tudo **numa página só**: ao pesquisar e escolher uma profissão,
o dashboard aparece **abaixo** (no lugar das favoritas), a página **cresce para baixo**. Pode
**continuar separando por id** (`/labor-market/[code]`) como deep-link.
⚠️ Decisão em aberto: **como voltar para a lista de favoritas** (proponho alternativas na Dúvida A).
Status: ✅

### M6. (Aba Mercado) Limpeza + mapa real — ⚠️ (ver Dúvida B)
- **Remover a caixa "Disputa"** (é a mesma ideia da "Concorrência" da Visão Geral).
- **Mapa real do Brasil interativo** (no lugar do mapa de blocos atual): o usuário **clica na
  região** e depois **no estado**. A classificação por **mais admissões / mais desligamentos**
  no mapa fica **para depois** (mas já tenha em mente).
- Ao **filtrar por um estado**, **não exibir** a caixa "Por estado" (só haveria um).
Status: ✅ *(mapa real interativo feito; a coloração do mapa por mais admissões/desligamentos continua para depois, conforme combinado)*

### M7. (Aba Remuneração) Mapa real + ocultar caixa redundante — ⚠️ (ver Dúvida B)
- **Mesmo mapa real interativo** da aba Mercado, aqui classificado por **salário** (quem
  **paga mais** / quem **paga menos**).
- Ao **filtrar por um estado**, **não exibir** a caixa "Salário por estado".
Status: ✅

---

## 🟠 Dúvidas / decisões — Reformulação do Dashboard

**A) Voltar para as favoritas (página única).** Como você prefere voltar da profissão aberta
para a lista de favoritas? Opções:
- **(1)** Botão **"Ver minhas favoritas"** no topo (limpa a profissão atual e volta à lista). *(recomendada)*
- **(2)** Link/breadcrumb **"← Profissões favoritas"** acima do dashboard.
- **(3)** Manter as **favoritas sempre visíveis** acima do dashboard (sem precisar "voltar").

**B) Mapa real do Brasil.** Não há biblioteca de mapa instalada. Como construir o mapa
geográfico interativo? Opções:
- **(1)** Adicionar **`react-simple-maps` + TopoJSON do Brasil** (mapa de verdade, estados
  clicáveis, base sólida para a classificação por cor depois). *(recomendada)*
- **(2)** **SVG do Brasil desenhado** embutido (sem dependência nova, mas mais trabalhoso de
  manter e menos preciso).
- **(3)** Por enquanto **manter o mapa de blocos** (só melhorando o visual) e fazer o mapa real
  numa etapa posterior.

**C) Filtros de Atividade econômica (ainda não implementados).** Como reservar o espaço agora?
- **(1)** Já mostrar os **2 seletores desabilitados** ("em breve"), reservando o espaço. *(recomendada)*
- **(2)** Só **reservar o espaço** no layout, sem mostrar os seletores ainda.
- **(3)** Não mostrar nada agora; ajusto o layout quando formos implementar a atividade econômica.

**D) Vidro translúcido nos gráficos/tabelas.** Para as caixas ficarem com o visual da home sem
perder a leitura, como prefere? 
- **(1)** **Recolorir** gráficos e tabelas para o escuro (textos/eixos em branco) dentro das
  caixas de vidro. *(recomendada)*
- **(2)** Caixa de vidro por fora, mas um **miolo claro** atrás de cada gráfico/tabela para
  garantir contraste.

---

## 🔁 Ajustes pós-reformulação (2026-06-22) — todos ✅

**Favoritas**
- **Lista atualiza na hora**: novo endpoint `GET /api/favorites` + lista vira componente cliente
  que revalida ao abrir a página e ao voltar o foco — não precisa mais recarregar.
- **Limite 5 → 3** profissões favoritas (aviso ajustado para "máximo 3").
- Botão **"Ver minhas favoritas"** virou **"Lista de favoritas"** e foi para **ao lado esquerdo**
  do botão "Favoritar/Favoritada", ambos **centralizados verticalmente** (ícone de lista para não
  repetir o coração).
- **Favoritada** agora com **fundo vermelho** (suave, para contrastar) + **texto branco** e ícone
  vermelho forte.

**Abas / filtros**
- **"Visão Geral" → "Resumo"**.
- Num **único painel**: **filtros em cima, abas embaixo**. Nos filtros, **Atividade econômica à
  esquerda** e **Localidade à direita**.

**Aba Resumo**
- Títulos (Situação, Rotatividade, etc.) em **branco forte**.
- **Situação**: sem frase; **gráfico centralizado verticalmente** alinhado às frases das caixas
  Rotatividade/Concorrência.
- Caixa **Mercado**: "Menos admissões" trocado por **"Mais desligamentos"** (mostrando o estado
  com mais desligamentos).

**Mapa interativo**
- **Zoom por nível**: Brasil → ao passar o mouse destaca a **região** (clica = foca a região com
  zoom); na região → destaca o **estado** (clica = foca o estado com zoom).
- **"Desfazer"**: clicar no mapa **fora dos estados** (dentro do painel) volta um nível e desfaz o
  zoom (estado → região → Brasil).
- **Removidos** o **título do painel** e os textos de instrução; mantida só a **legenda** (mais o
  valor que aparece ao passar o mouse).

---

## 🔁 Ajustes de refino (2026-06-22) — todos ✅

**Topo / abas**
- Texto do painel de busca **justificado**.
- Abas (Resumo/Mercado/Remuneração/Perfil) **centralizadas**.
- Ícones de **Lista de favoritas**, **Atividade** e **Localidade** agora **dourados** (como o do
  cabeçalho "Mercado de Trabalho").

**Botão Favoritar**
- **Sem fundo** nos dois estados (opaco). Quando **favoritada**, o coração fica **dourado** (como
  os demais ícones). *(Optei pelo dourado conforme a última instrução, em vez do vermelho.)*

**Aba Resumo**
- Caixa **Saldo**: agora mostra **"Positivo"/"Negativo"** (texto branco) em vez do número.
- "Duração média" → **"Duração contratual média"**.

**Aba Remuneração**
- "Horas/semana" → **"Horas contratuais"** com subtítulo **"Horas por semana"**.
- "Duração média" → **"Duração contratual média"**.
- Títulos **brancos fortes**: Salário médio, Horas contratuais, Duração contratual média e
  Salário por estado.
- **Salário por estado**: filtro **↑↓ Mais/Menos pagos** alinhado ao título + botão **"Ver todos"**
  ao lado; mostra **5 estados** por padrão (o "Ver todos" só aparece quando há mais de 5).

**Mapa interativo**
- **Zoom mais forte** nos dois níveis (mostra só a região / só o estado); **Brasil mais de perto**
  e **painel mais baixo**.
- Aba **Mercado**: **chave (toggle)** dentro do painel para escolher **Admissões/Desligamentos**,
  com distribuição de cores em **espectro monocromático "oceano"** (cor do cabeçalho/rodapé),
  legenda **Menos → Mais**.
- Removido o **texto ao passar o mouse** ("[estado]: valor") nas abas Mercado e Remuneração.

**Aba Perfil**
- Gráficos coloridos em **espectro monocromático "oceano"** (Raça/cor, Escolaridade, Pirâmide).
- **Pirâmide etária**: centro das barras **alinhado ao centro** (domínio simétrico), e **removida**
  a nota de estimativa.
- **Escolaridade**: agora em **barras verticais**, centralizada no painel.
- **PCD**: **%** + frase "dos vínculos são de PCD" à **esquerda**; "Com/Sem deficiência" à
  **direita**; tudo **alinhado verticalmente**.
- Títulos **brancos fortes** (Pirâmide, Escolaridade, Raça/cor, PCD).
