# Feedback — Página inicial / Landing (`/`)

Última atualização: 2026-06-21 · Origem: `meu_feedback.txt`
Legenda — Status: ✅ pendente · 🔄 em andamento · ✅ feito

> ✅ **Feedback aprovado pelo Yan em 2026-06-21.** Decisões das dúvidas:
> - (A) Ilustrações: **desenho em código (SVG/CSS), flat náutico**.
> - (B) GitHub: `https://github.com/Yan-Fernandes-da-Silva/horizonte`.
> - (C) Marrom da logo: cor sugerida pelo assistente (token `helm`, ~`#8B5A2B`).
> - (D) Cabeçalho: oculto na Hero, aparece da About em diante, **oculta ao voltar ao topo**.
> - (E) Passos da HowItWorks: **empilhar na vertical** ao longo da rota.
> - ➕ **Novo pedido:** botão flutuante de **voltar ao topo** (seta no canto inferior direito).

---

## 🔁 Ajustes — Rodada 4 (2026-06-21) — todos ✅

- **HowItWorks:** a rota pontilhada voltou a ser **reta e vertical** (mantendo o pontilhado).

---

## 🔁 Ajustes — Rodada 3 (2026-06-21) — todos ✅

- **Features:** fundo trocado para `#FFDCB6`; removida a onda branca da transição
  About→Features; caixas (Teste/Mercado/Plano) agora na cor `#D0B482`.
- **HowItWorks:** altura vertical de cada passo reduzida; rota em S mais curvada, passando
  por baixo dos números 1, 2 e 3.
- **FinalCta:** céu aumentado e mar reduzido; areia removida; textos e botão posicionados
  sobre o céu (com texto escuro para contraste).

---

## 🔁 Ajustes — Rodada 2 (2026-06-21) — todos ✅

- **Hero:** removidos o sol e o círculo branco borrado; nuvens reposicionadas para as
  laterais (fora do centro), com tamanhos/posições assimétricos; botão "Já tenho conta"
  agora com texto na cor azul-oceano (igual a "Começar agora").
- **Todas as seções (About, Features, HowItWorks, FinalCta):** agora ocupam a tela inteira
  (min-h-screen) e a **animação de surgimento foi removida** (conteúdo estático).
- **About:** bússola desenhada em código à esquerda, textos à direita justificados.
- **Features:** título em uma linha no desktop; caixas com fundo de areia mais saturado.
- **HowItWorks:** "Como funciona" maior que "3 passos simples" ("Em 3 passos simples" →
  "3 passos simples"); barco removido; rota pontilhada agora **curvada em S**
  (centro→direita→centro→esquerda→centro); cada passo ocupa uma tela com caixas maiores.
- **FinalCta:** fundo trocado pela combinação céu + mar + praia (mais céu/mar, menos praia).

---

## Cabeçalho (Header público)

1. (⚙️ Comportamento · Ambos) Hoje o cabeçalho aparece já na HeroSection (fixo no topo) →
   **Ocultar o cabeçalho na HeroSection** e fazê-lo **aparecer a partir da AboutSection em
   diante** (conforme o usuário rola para baixo).
   Status: ✅

2. (🎨 Visual · Ambos) Hoje é translúcido/branco (`bg-white/70` com desfoque) → Deixar com
   **cor sólida fixa, igual ao rodapé** (azul-oceano escuro), **não branco**.
   Status: ✅

3. (🎨 Visual · Ambos) Hoje a logo e o nome "Horizonte" no cabeçalho são azuis → A **logo**
   passa a ser **marrom** (cor de leme náutico real) e o **nome do site** passa a ser
   **branco** (ou preto conforme o fundo — provavelmente branco). Vale para **o cabeçalho em
   todas as páginas** que o têm, não só a inicial.
   Status: ✅

---

## Rodapé (Footer)

1. (➕ Adicionar · Ambos) Hoje o link "Código no GitHub" aponta para um endereço genérico
   (placeholder) → Apontar para o **link real do repositório do projeto no GitHub**, abrindo
   ao clicar na logo do GitHub ou no texto "Código no GitHub".
   Status: ✅  ·  ⚠️ **Preciso do endereço do repositório (ver Dúvidas).**

2. (🎨 Visual · Mobile) No celular os elementos (GitHub | nome + slogan) ficam **empilhados**
   → Deixar **lado a lado como no desktop**, apenas **menores**; se preciso, **quebrar a linha
   do slogan** para não reduzir demais.
   Status: ✅

---

## Seções (geral)

1. (🐞 Bug · Ambos) As seções **AboutSection, FeaturesSection, HowItWorksSection e
   FinalCtaSection não aparecem no primeiro acesso** ao site; só aparecem depois de visitar
   outra página e voltar.
   → **Diagnóstico:** as seções usam um efeito de "surgir ao rolar" (componente `Reveal`,
   Framer Motion `whileInView`) que, no primeiro carregamento, às vezes não dispara e deixa o
   conteúdo invisível (opacidade 0). É um bug conhecido desse efeito e **eu consigo corrigir**.
   Status: ✅

---

## Seção HeroSection

1. (🎨 Visual · Ambos) Fundo hoje: azul quadriculado + anel/alvo branco no canto + onda branca
   embaixo → Trocar por **céu ensolarado (quase ciano) com nuvens brancas**, de preferência
   **dinâmicas** (deslizando para os lados aleatoriamente); se não der, **fixas**.
   Status: ✅

2. (🎨 Visual · Ambos) Hoje: logo laranja pequena, nome pequeno, slogan branco semitransparente,
   botões "Começar agora →" e "Já tenho conta" largos →
   - Logo **um pouco maior** e na **mesma cor marrom** do cabeçalho.
   - Nome do site **um pouco maior**.
   - Slogan **branco sólido** (sem transparência), igual ao nome.
   - Botões **mais estreitos**.
   - **Remover a seta "→"** de "Começar agora".
   Status: ✅

---

## Seção AboutSection

1. (✍️ Texto · Ambos)
   - **Remover** o rótulo "Nossa Missão".
   - **Remover** o parágrafo "Nada de achismo: você descobre as suas forças, entende as
     oportunidades e recebe um caminho concreto para chegar aonde quer."
   - **Trocar** o parágrafo "O Horizonte foi feito para quem está dando os primeiros passos…
     decidir com clareza." por:
     > "Primeiro emprego ou transição de carreira? O Horizonte te guia. Combinamos o seu perfil
     > com dados reais do mercado de trabalho brasileiro para criar o seu plano de carreira ideal
     > e direcionar seu próximo passo profissional com clareza e segurança."
   - **Centralizar** os textos (como na HeroSection).
   Status: ✅

2. (🎨 Visual · Ambos) Hoje: círculo com a logo sobre fundo branco → Trocar por **fundo de mar
   azul forte com ondas leves** (dinâmicas se possível, senão fixas), como **continuação do céu
   da HeroSection**; a **transição entre as duas seções é o horizonte** (linha mar/céu).
   Status: ✅  ·  ⚠️ ver Dúvidas (estilo da arte).

---

## Seção FeaturesSection

1. (🎨 Visual · Ambos) Fundo hoje rosa/areia claro (`bg-sand`) → **Cor de areia de praia**:
   sólida com **leve textura** (não granulada/pixelada), como **continuação do mar da
   AboutSection**; a **transição é a onda morrendo na praia** (zona de espraiamento).
   Status: ✅  ·  ⚠️ ver Dúvidas (estilo da arte).

2. (✍️ Texto · Ambos) Trocar as descrições dos 3 cards:
   - Teste Vocacional → "Descubra seu perfil, interesses e objetivos relacionados com as
     qualificações e profissões mais compatíveis com quem você é"
   - Mercado de Trabalho → "Explore dados e tendências reais do mercado de trabalho brasileiro
     e analise como está as profissões de diferentes áreas."
   - Plano de Carreira → "Receba um itinerário personalizado e customizável para sua carreira
     profissional e acompanhe seu progresso com metas claras."
   Status: ✅

---

## Seção HowItWorksSection

1. (🎨 Visual · Ambos) Fundo hoje gradiente azul→ciano → **Mar azul visto de cima** com um
   **navio** seguindo uma **rota marítima** que sai de um **cais no topo** da seção descendo
   pelo mar. A rota é **pontilhada/tracejada** (traços "— — —"), com **espaços para os 3 passos**
   dispostos de cima para baixo. A **transição com a FeaturesSection** é a **areia da praia com
   um pequeno porto/cais** (o mesmo cais do topo).
   Status: ✅  ·  ⚠️ ver Dúvidas (estilo da arte + mudança de layout dos passos).

2. (✍️ Texto · Ambos)
   - "Explore o mercado" → "Explore o mercado de trabalho"
   - "Monte seu plano" → "Monte seu plano de carreira"
   - Passo 1 descrição → "Responda perguntas sobre interesses e objetivos. Leva cerca de 10 minutos"
   - Passo 2 descrição → "Veja como está a demanda, os salários e o perfil profissional de cada
     profissão que te interessa."
   - Passo 3 descrição → "Gerencie seu itinerário, customize metas e prazos, acompanhe o
     progresso do seu plano."
   Status: ✅

---

## Seção FinalCtaSection

1. (🎨 Visual · Ambos) Fundo hoje ciano → **Vista panorâmica da orla de uma cidade litorânea
   vista da proa de um navio**: mar em primeiro plano e horizonte urbano com arranha-céus
   modernos à beira da praia.
   Status: ✅  ·  ⚠️ ver Dúvidas (estilo da arte — cena mais realista).

2. (✍️ Texto · Ambos) Trocar "É grátis, sem complicação. Comece agora e descubra para onde o
   seu horizonte aponta." por "Comece agora e descubra para onde o seu horizonte aponta."
   Status: ✅

3. (➖ Remover · Ambos) Remover a seta "→" do botão "Criar minha conta →".
   Status: ✅

---

## 🟠 Dúvidas do assistente (preciso confirmar antes de implementar)

> Estas são as decisões que mudam bastante o resultado. As mais importantes estão no topo.

**A) Estilo das ilustrações de fundo (afeta Hero, About, Features, HowItWorks, FinalCta).**
Você descreveu uma cena náutica contínua e bonita (céu → mar → praia → rota do navio → cidade
litorânea). Dá para fazer, mas há dois caminhos com resultados bem diferentes:
- **Opção 1 — Desenho em código (SVG/CSS), estilo "flat" náutico.** Combina com o visual atual
  do site, é leve, animável (nuvens/ondas mexendo) e não depende de arquivos externos. Porém é
  **estilizado/ilustrativo**, não realista (a "cidade litorânea vista da proa" e o "farol à
  noite" ficariam como ilustração, não como foto).
- **Opção 2 — Imagens prontas (PNG/ilustração).** Permite cenas **mais realistas**, mas eu
  **não gero imagens**; você precisaria **fornecer/aprovar** as imagens (ou eu sugiro fontes
  gratuitas para você escolher). Mais "peso" e menos animação.
- **Opção 3 — Misto:** código para céu/mar/ondas/areia (Hero, About, Features, HowItWorks) e
  imagem só onde realismo importa (FinalCta cidade, e o farol do Cadastro/Login).
👉 **Qual caminho você prefere?** (minha recomendação: começar pela **Opção 1** para validar o
clima geral e, se faltar realismo em pontos específicos, partir para imagem só nesses.)

**B) GitHub (Rodapé 1).** Qual é o **endereço do repositório**? (algo como
`https://github.com/seu-usuario/horizonte`). Sem ele, deixo o link pronto mas apontando para um
placeholder.

**C) Tom de marrom da logo (Cabeçalho 3 / Hero 2).** Tem uma cor específica em mente? Se não,
proponho um marrom "leme de navio" (ex.: `#8B5A2B`, madeira) e te mostro na prática para ajustar.

**D) Cabeçalho some/aparece (Cabeçalho 1).** Confirmando o comportamento: cabeçalho **invisível
enquanto a Hero está na tela** e **visível assim que entra a AboutSection** (e dali para baixo).
Quando o usuário rolar de volta para o topo (Hero), ele **some de novo**? (eu assumiria que sim).

**E) Passos da HowItWorks (Visual 1).** Hoje os 3 passos ficam **lado a lado**. Sua descrição
(rota descendo o mar, passos "do topo para baixo") sugere **empilhar na vertical ao longo da
rota**. Confirma que posso mudar para **layout vertical** (no desktop também)?
