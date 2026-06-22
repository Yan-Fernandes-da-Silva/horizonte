# Guia de Feedback — Como pedir ajustes no Horizonte

Este guia é para **você, Yan**. Ele mostra a melhor forma de me dizer o que precisa ser
corrigido, mudado, adicionado ou removido no site — em **linguagem normal**, sem precisar
de termos técnicos. Quanto mais claro o seu retorno, mais rápido e certeiro fica o ajuste.

---

## 1. A regra de ouro: **Onde + O quê + Como você quer**

Para cada coisa que notar, me diga três informações:

1. **Onde** — em que página/tela está (use os nomes da lista da Seção 4).
2. **O quê** — o que está acontecendo (o problema) ou o que está hoje.
3. **Como você quer** — o que deveria ser / como você gostaria que ficasse.

> **Exemplo bom:**
> "Na **página de resultados do teste vocacional**, o gráfico de barras está muito
> grande no celular. Queria que ele ficasse menor e coubesse na tela."

> **Exemplo vago (evite):**
> "O gráfico tá estranho." *(Qual gráfico? Em que página? Estranho como?)*

Não precisa acertar nomes técnicos — se não souber o nome da tela, descreva
("aquela tela com os 3 cards depois do login") que eu identifico.

---

## 2. Diga o **tipo** do pedido (ajuda a priorizar)

Use uma palavra para classificar — opcional, mas ajuda:

| Tipo | O que significa | Exemplo |
|---|---|---|
| 🐞 **Bug** | Algo quebrado / não funciona | "O botão Entrar não faz nada" |
| 🎨 **Visual** | Aparência (cor, tamanho, espaço, fonte) | "Esse título devia ser maior" |
| ✍️ **Texto** | Mudar uma palavra/frase | "Trocar 'Começar' por 'Iniciar teste'" |
| ⚙️ **Comportamento** | Como algo funciona | "Ao favoritar, queria um aviso na tela" |
| ➕ **Adicionar** | Um item/recurso novo | "Adicionar um campo de telefone no cadastro" |
| ➖ **Remover** | Tirar algo | "Tirar a seção X da página inicial" |
| 💡 **Ideia/Recurso** | Algo novo e maior | "Queria poder exportar o plano em PDF" |

---

## 3. Quando há **várias coisas em partes diferentes** (a sua pergunta)

A melhor abordagem é **organizar por tela e numerar**. Em vez de um texto corrido,
faça uma lista agrupada assim:

```
PÁGINA INICIAL
1. (Visual) O banner do topo está com pouco contraste — deixar o texto mais legível.
2. (Texto) Trocar o slogan para "..."

TESTE VOCACIONAL — RESULTADOS
3. (Bug) O botão "Favoritar" não muda de cor depois de clicar.
4. (Visual) As barras de inteligências estão grandes demais no celular.

MERCADO DE TRABALHO
5. (Comportamento) Ao trocar o estado no filtro, queria que rolasse a página pro topo.
```

Por que assim funciona melhor:
- **Eu trato item por item**, sem perder nada, e você confere pela numeração.
- **Mudanças pequenas e relacionadas eu agrupo** e faço de uma vez.
- Se um item for grande (um recurso novo), eu te mostro um plano antes de fazer.

> **Pode mandar tudo de uma vez** (uma lista grande) **ou aos poucos** (uma tela por
> mensagem) — o que for mais confortável. Os dois funcionam.

### Prioridade (opcional)
Se quiser, marque o que é mais urgente:
- 🔴 **Importante** (atrapalha o uso / precisa antes do deploy)
- 🟡 **Médio** (incomoda, mas dá pra esperar)
- 🟢 **Quando der** (melhoria/capricho)

Assim eu faço primeiro o que mais importa.

---

## 4. Ajuste só para **celular** ou só para **computador**

> **Esta é a sua dúvida principal.** Vale a pena ler com calma.

O Horizonte é **um único site que se adapta à tela** (chamamos isso de *responsivo*).
Não existe um "site do computador" e outro "site do celular" separados — é o **mesmo
conteúdo** que se reorganiza: no celular as coisas **empilham** e o menu vira
**"hambúrguer"**; no computador elas ficam **lado a lado** com mais espaço.

Por isso, quando for pedir um ajuste, a única coisa que preciso saber é: **a mudança
vale para os dois tamanhos, ou só para um?**

### Como me dizer (escolha uma frase)
- **"Nos dois"** (ou não diz nada) → eu mudo para celular **e** computador. *(é o padrão)*
- **"Só no celular"** (ou "no mobile", "na tela pequena") → mudo **apenas** quando a tela é estreita.
- **"Só no computador"** (ou "no desktop", "na tela grande") → mudo **apenas** quando a tela é larga.

### Quando os dois precisam de coisas **diferentes**
Se a mesma área deve ficar de um jeito no celular e de outro no computador, me diga as
**duas instruções juntas**, deixando claro qual é qual:

```
PÁGINA INICIAL — banner do topo
- No computador: o texto e a imagem lado a lado.
- No celular: o texto em cima e a imagem embaixo, e a imagem menor.
```

Outro exemplo:

```
MERCADO — dashboard
- No celular: as abas (Visão Geral, Mercado, Remuneração, Perfil) estão apertadas →
  deixar uma embaixo da outra ou permitir rolar de lado.
- No computador: pode deixar como está.
```

### Dicas para não se confundir
- Se você **não souber** se vale para os dois, é só mandar do jeito que viu — eu pergunto
  "isso é só no celular?" antes de mexer.
- O melhor jeito de **ver e comparar** as duas versões no seu notebook está no
  arquivo **`GUIA_TESTE_MOBILE.md`** (Opção 1: emular o celular pelo navegador com F12).
  Recomendo testar nos dois tamanhos antes de me mandar o feedback — assim você já me diz
  exatamente onde está cada problema.
- Quando mandar **print**, vale dizer se foi tirado **no celular** ou **no computador**
  (ou se foi na emulação do navegador) — isso me diz na hora qual tamanho ajustar.

> **Resumo:** diga **"nos dois"**, **"só no celular"** ou **"só no computador"**. Sem isso,
> eu assumo **os dois**. E se precisar ficar diferente em cada um, me dê as duas instruções.

---

## 5. Mapa do site (nomes para você apontar com precisão)

Use estes nomes para dizer "onde". O endereço (URL) é só referência.

| Tela | Como chamar | Endereço |
|---|---|---|
| Apresentação pública | **Página inicial** / Landing | `/` |
| Criar conta | **Cadastro** | `/register` |
| Entrar | **Login** | `/login` |
| Recuperar senha | **Esqueci a senha** | `/forgot-password` |
| Painel pós-login | **Início** (3 cards) | `/home` |
| Teste vocacional (entrada) | **Teste Vocacional** | `/vocational-test` |
| Perguntas do teste | **Teste — perguntas** | `/vocational-test/...` |
| Resultado do teste | **Teste — resultados** | `/vocational-test/results` |
| Busca de profissões | **Mercado de Trabalho** | `/labor-market` |
| Painel de uma profissão | **Mercado — dashboard** (abas: Visão Geral, Mercado, Remuneração, Perfil) | `/labor-market/[código]` |
| Lista de planos | **Plano de Carreira** | `/career-plan` |
| Questionário do plano | **Plano — questionário** | `/career-plan/start` |
| Roadmap do plano | **Plano — roadmap** | `/career-plan/[id]` |

---

## 6. Print/captura ajuda muito (se puder)

Se algo for visual ou difícil de descrever, **um print** vale mais que mil palavras.
Você pode descrever onde fica na tela ("no canto superior direito") que eu acho. Se
conseguir colar/anexar a imagem na conversa, melhor ainda.

---

## 7. O que acontece depois que você me manda

1. Eu **confirmo o que entendi** (e pergunto se algo ficou ambíguo).
2. Para mudanças pequenas, eu **já faço**. Para mudanças grandes, eu **mostro um plano** e
   espero seu "ok" (como combinamos no nosso jeito de trabalhar).
3. Eu testo o ajuste e te aviso.
4. Quando estivermos no deploy, cada mudança aprovada vira uma atualização no ar em ~2 min.

---

## 8. Modelo pronto para copiar e colar

```
[TELA / PÁGINA]
1. (tipo) [onde exatamente] — [o que está] → [como quero que fique]. [celular/computador/os dois] [prioridade]
2. ...
```

> O campo **[celular/computador/os dois]** é opcional. Se não preencher, eu assumo **os dois**.

Exemplo preenchido:
```
LOGIN
1. (Visual) O botão "Entrar" — está pálido demais → deixar com a cor de destaque (dourado). Os dois. 🟡
2. (Texto) O link "Esqueceu a senha?" → mudar para "Esqueci minha senha". Os dois. 🟢

PÁGINA INICIAL
3. (Visual) O banner do topo — a imagem fica grande demais → diminuir. Só no celular. 🟡
```

---

Qualquer dúvida sobre como relatar algo, é só me perguntar. Pode ser do seu jeito —
este guia é só para deixar mais fácil e rápido. 🚢
