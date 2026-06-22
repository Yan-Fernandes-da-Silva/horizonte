# Feedback — Início / Painel pós-login (`/home`)

Última atualização: 2026-06-21 · Origem: `meu_feedback.txt`
Legenda — Status: ✅ pendente · 🔄 em andamento · ✅ feito
Viabilidade — ✅ dá para fazer · ⚠️ dá para fazer, mas precisa de uma decisão sua

> ✅ **Aprovado pelo Yan em 2026-06-21.** Decisões:
> - (A) Avatares: **conjunto náutico em SVG** criado em `public/images/avatars/`.
> - (B) Troca de senha: **exige a senha atual**.
> - (C) Clique no card: **destino conforme o estado** (ex.: teste concluído → resultados).
> - (D) Logado é bloqueado da landing/cadastro/login/recuperação → vai para `/home`.
> - (E) Os 3 cards ficam num **painel de fundo mar**; boas-vindas+dica (azul-escuro) acima.

---

## 🔁 Ajustes — Rodada 2 (2026-06-21) — todos ✅

- **Cabeçalho:** links centrais (Teste Vocacional / Mercado / Plano) agora **branco sólido**
  (sem transparência); **nome do usuário removido** do menu da conta (já aparece no cabeçalho).
- **Fundo único:** a home agora tem **um só fundo mar** (`bg-sea-top`) preenchendo a tela; o
  painel separado dos cards foi removido. A caixa de boas-vindas+dica passou a usar o **mesmo
  fundo translúcido dos cards**. A dica do dia ficou **sem subcaixa**, com a frase **abaixo do
  ícone e do título**.
- **Cards:** título **alinhado à esquerda, ao lado do ícone**; "estado atual" e "texto de apoio"
  com **espaço reservado de ~2 linhas** cada, alinhando os três cards verticalmente.
- 🧹 Componentes sem uso removidos (`FeatureStatusCard`, `DailyTip`).

---

## 🔁 Ajustes — Rodada 3 (2026-06-22) — todos ✅

- **Rodapé subiu (cabe numa tela só):** a home forçava `min-h-[calc(100vh-4rem)]` no fundo
  mar, reservando a tela inteira menos só o cabeçalho — sem descontar o rodapé, que era
  empurrado para uma "segunda tela". Trocado por um arranjo flex: o `main` do layout do
  dashboard virou `flex flex-col` e o fundo mar usa `flex-1`, ocupando exatamente o espaço
  entre cabeçalho e rodapé. Agora tudo cabe numa visão só, sem rolagem. ✅ **Página inicial
  pós-login concluída.**
- **Efeito "Reveal" removido (partes vazias no 1º acesso):** no primeiro carregamento o
  conteúdo embrulhado em `<Reveal>` (Framer Motion, inicia `opacity: 0`) às vezes não era
  revelado, deixando partes da tela em branco. Removido o `Reveal` da **home**, da
  **apresentação do Teste Vocacional** (`/vocational-test`) e do **Mercado de Trabalho**
  (`/labor-market`). Plano de Carreira, Perfil e os resultados do teste **não** foram
  alterados (funcionavam normalmente).

---

## 🔁 Ajustes — Rodada 4 (2026-06-22) — todos ✅

- **Rodapé mais fino:** o rodapé ganhou **altura fixa igual à do cabeçalho** (`h-16`),
  removendo o espaçamento vertical grande. Como o rodapé é um componente único, vale para
  **todas as telas** do site.
- **"Moldura mar" nas páginas internas + Perfil (Opção A):** as telas internas (questionário e
  resultados do teste, dashboard de uma profissão, criação e roteiro do plano) e o **Perfil**
  passaram a ter o **mesmo fundo mar + cabeçalhos translúcidos** da home, mantendo
  **gráficos, tabelas e formulários em cartões claros legíveis**.

---

## Geral — Controle de acesso (rotas)

1. (⚙️ Comportamento · Ambos) **Viabilidade: ✅ (com 1 decisão — ver Dúvida D)**
   Hoje: quem **não está logado** e tenta abrir uma página protegida (ex.: `/vocational-test`)
   é mandado para `/login?callbackUrl=%2Fvocational-test`.
   → Passar a redirecionar para a **página inicial** (`/`), sem `callbackUrl`, em qualquer
   tentativa de acessar área logada sem estar logado.
   → Além disso, quem **já está logado** não deve conseguir abrir a **página inicial**, o
   **cadastro**, o **login** nem a **recuperação de senha** (é redirecionado para `/home`).
   *(Hoje o sistema já bloqueia login/cadastro/recuperação para quem está logado; falta
   incluir a página inicial `/` nesse bloqueio e trocar o destino do não-logado para `/`.)*
   Status: ✅

---

## Cabeçalho (Header)

1. (🎨 Visual · Ambos) **Viabilidade: ✅**
   Cabeçalho da área logada hoje é azul translúcido (`bg-ocean/80`). → Deixar com a **mesma cor
   sólida do rodapé / da página inicial** (azul-oceano sólido).
   Status: ✅

2. (➖ Remover · Ambos) **Viabilidade: ✅**
   No menu da conta do usuário (avatar → Meu perfil / Configurações / Sair), **remover a opção
   "Configurações"** (e a respectiva página, que hoje nem existe de fato).
   Status: ✅

3. (➕ Adicionar · Ambos) **Viabilidade: ⚠️ (recurso novo — ver Dúvidas A, B)**
   Criar a **página de Perfil**, acessível por "Meu perfil", permitindo editar **nome, e-mail,
   senha**, **excluir a conta** e escolher um **avatar** (a partir de imagens fixas).
   *(Detalhes completos no arquivo `fd_profile.md`.)*
   Status: ✅

4. (🐞 Bug · Mobile) **Viabilidade: ✅**
   No celular, o menu (lista de funcionalidades + opções da conta) aparece **transparente/quase
   apagado**. → Fazer surgir com **fundo sólido**, como no desktop, mantendo as mesmas opções.
   Status: ✅

---

## Seção WelcomeBanner + DailyTip (juntar numa caixa só)

1. (🎨 Visual · Ambos) **Viabilidade: ✅**
   Hoje são **duas caixas separadas**. → Juntar **numa mesma caixa**: conteúdo do
   **WelcomeBanner à esquerda** e conteúdo do **DailyTip à direita**. Priorizar as cores do
   WelcomeBanner. Trocar o **fundo em gradiente por uma cor sólida** (o azul-escuro que fica
   à esquerda do gradiente). **Sem emojis** (remover o 👋).
   No celular: empilhar (boas-vindas em cima, dica embaixo).
   Status: ✅

---

## Seção dos 3 cards (Teste Vocacional, Mercado de Trabalho, Plano de Carreira)

1. (🎨 Visual · Ambos) **Viabilidade: ✅ (com decisões — ver Dúvidas C, E)**
   - **Cores:** o fundo da seção e os cards passam a usar as **mesmas cores da seção
     HowItWorksSection** da página inicial (fundo mar `bg-sea-top`; cards translúcidos
     `bg-white/10` com borda clara; ícone dourado; texto branco).
   - **Cada card inteiro vira um hiperlink** para a funcionalidade. **Sem** barra de progresso,
     **sem** botões e **sem** o selo "1 profissão salva".
   - **Layout de cada card:**
     - **Ícone** no canto **superior esquerdo** — só o ícone, **sem** o quadrado/tile externo.
       Cor/forma **fixas** (não mudam com o estado).
     - **Título** no canto **superior direito**, em paralelo ao ícone, **cor branca**, fixo.
     - **Estado atual** (linha que muda conforme o estado).
     - **Texto de apoio** (linha que muda conforme o estado).

   **Card Teste Vocacional** — ícone `ClipboardList` (o mesmo do passo 1 da HowItWorks) · link → `/vocational-test`
   | Estado | "Estado atual" | "Texto de apoio" |
   |---|---|---|
   | Sem teste | Responda algumas perguntas | Descubra quais profissões combinam com você |
   | Incompleto | Teste incompleto | Continue de onde parou ou recomece do zero |
   | Concluído | Teste concluído | Veja os resultados ou refaça o teste |

   **Card Mercado de Trabalho** — ícone `ChartColumnIncreasing` (o atual) · link → `/labor-market`
   | Estado | "Estado atual" | "Texto de apoio" |
   |---|---|---|
   | Sem favoritos | Pesquise por profissão | Veja dados e tendências no Brasil |
   | Com favoritos | [número] profissão(ões) favorita(s) | Veja a situação atual ou compare com outras profissões |

   **Card Plano de Carreira** — ícone `Target` (o mesmo do passo 3 da HowItWorks) · link → `/career-plan`
   | Estado | "Estado atual" | "Texto de apoio" |
   |---|---|---|
   | Sem plano | Monte seu plano | Com base nos resultados e profissões favoritas. |
   | Com plano | [Profissão] | Acompanhe seu progresso e revise objetivos e metas. |

   *("[Profissão]" usará o nome da profissão do plano; se não houver, uso o título do plano.)*
   Status: ✅

---

## 🟠 Dúvidas / decisões do assistente

**A) Origem dos avatares (página de Perfil).** Você citou "imagens fixas do acervo do Next ou
do Tailwind/CSS". Sendo transparente: **o Next e o Tailwind não têm uma biblioteca de avatares
pronta**. As alternativas viáveis são:
- **(1) Conjunto de avatares ilustrados que eu crio** (ex.: 6–12 avatares náuticos em SVG,
  guardados em `public/images/avatars/`). Combina com o tema, sem depender de serviços externos. **(recomendada)**
- **(2) Avatares gerados automaticamente** (estilo "iniciais coloridas" ou padrões) — sem
  imagens, leve, mas menos "ilustrado".
- **(3) Serviço externo** (ex.: DiceBear) — mais variedade, mas depende de internet/terceiros.
👉 Qual prefere? (sigo a **opção 1** se não disser nada.)

**B) Troca de senha no Perfil.** Por segurança, faço a troca **exigindo a senha atual** antes
de definir a nova (e a nova segue a regra: 8+ caracteres, 1 maiúscula, 1 número). Confirma?

**C) Destino do clique em cada card.** Cada card leva à **página principal** da funcionalidade
(`/vocational-test`, `/labor-market`, `/career-plan`), **independente do estado**. Confirma, ou
prefere que mude conforme o estado (ex.: concluído → direto para os resultados)?

**D) Bloquear a página inicial para quem está logado.** Confirmando: um usuário logado que tentar
abrir `/` (ou cadastro/login/recuperação) é **redirecionado para `/home`** — ou seja, enquanto
estiver logado ele não vê mais a página de apresentação. É isso mesmo?

**E) Fundo "mar" na seção dos cards.** Como o fundo da área logada hoje é claro (areia), os 3
cards passariam a ficar dentro de um **painel de fundo mar** (azul), com os cards translúcidos
claros por cima (igual à HowItWorks). A caixa de boas-vindas+dica (azul-escuro) fica acima desse
painel. Confirma esse arranjo?
