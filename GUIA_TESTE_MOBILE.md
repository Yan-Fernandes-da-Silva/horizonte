# Guia — Como testar o site no modo celular (mobile-first)

Este guia é para **você, Yan**, lembrar como testar a versão mobile do Horizonte
direto no seu notebook, mesmo com o site rodando só localmente (`http://localhost:3000`).

> O site foi feito **mobile-first**: no celular os layouts empilham, o menu vira
> "hambúrguer", e cards/gráficos se ajustam ao tamanho da tela.

---

## 📱 Opção 1 — Emular celular no navegador (recomendada, sem instalar nada)

A forma mais fácil e instantânea de ver como o site fica em telas de celular:

1. Abra o site em `http://localhost:3000` (peça para o assistente subir o servidor).
2. Pressione **F12** (abre as "Ferramentas do desenvolvedor").
3. Pressione **Ctrl + Shift + M** — ou clique no ícone de **celular/tablet** no topo do
   painel que abriu.
4. Na barra que aparece no topo da página, escolha um aparelho
   (ex.: **iPhone 14**, **Galaxy S20**) ou deixe em **"Responsivo"** e arraste as bordas
   para testar vários tamanhos.
5. Dá para **girar** a tela (retrato/paisagem) e ajustar o zoom.
6. Para sair: pressione **Ctrl + Shift + M** de novo e feche o F12.

Funciona igual no **Edge** e no **Chrome**. Esse é o jeito usado para conferir o
responsivo — cobre 100% do design mobile.

---

## 📲 Opção 2 — Abrir no celular de verdade (mesma rede Wi-Fi)

Funciona, mas tem alguns detalhes:

- Quando o servidor sobe, o Next mostra uma linha **"Network: http://192.168.x.x:3000"**.
  Esse endereço você abre no navegador do **celular**, desde que ele esteja na
  **mesma rede Wi-Fi** do notebook.
- ⚠️ Pode ser necessário **liberar a porta 3000 no Firewall do Windows**.
- ⚠️ O **login pode não funcionar** por esse caminho, porque a configuração de
  autenticação aponta para `localhost`. Para **navegar e ver o visual**, funciona bem;
  para **testar o login no celular físico**, o ideal é usar o site **publicado**
  (depois do deploy, a URL pública abre normalmente em qualquer aparelho).

---

## 💡 Recomendação

- Para a sua **avaliação do design** agora: use a **Opção 1** (emulação no navegador).
  É instantânea, cobre todo o responsivo e não tem pegadinhas.
- Para testar no **celular físico com login**: melhor depois do **deploy**
  (a URL pública resolve tudo).

> Para começar, é só pedir ao assistente: **"suba o servidor local"** — ele inicia o site
> em `http://localhost:3000` e aí você usa a Opção 1.
