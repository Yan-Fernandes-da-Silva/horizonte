# Feedbacks — Horizonte

Esta pasta guarda o **feedback do Yan** organizado por tela, **interpretado e registrado
pelo assistente**. Serve para duas coisas:

1. **Confirmar entendimento** — antes de mexer no site, o assistente escreve aqui o que
   entendeu do feedback. O Yan confere se está certo.
2. **Registro do que foi feito** — cada item recebe um status (⬜ pendente / ✅ feito),
   então esta pasta vira o histórico das mudanças pedidas.

---

## Como funciona o fluxo

1. **Yan** escreve o feedback num arquivo `.txt` (sem limite de tamanho — o terminal corta,
   o arquivo não) e salva na pasta do projeto. Ex.: `meu_feedback.txt`.
2. **Yan** avisa no terminal: *"Li o feedback no meu_feedback.txt"*.
3. **Assistente** lê o `.txt` e cria/atualiza os arquivos `fd_*.md` desta pasta com o que
   entendeu — numerado, com alvo, prioridade e status.
4. **Yan** confere os `fd_*.md`. Se entendi certo → dá o "ok". Se errei algum item → corrige
   só aquele ponto.
5. **Assistente** implementa o que foi aprovado e marca cada item como ✅ feito aqui.

> O `.txt` do Yan é a **entrada bruta**; os `fd_*.md` são a **versão limpa e confirmada**.
> O Yan pode reaproveitar o mesmo `.txt` (apagar e colar um feedback novo) quando quiser.

---

## Nomes dos arquivos (um por tela)

| Arquivo | Tela | Endereço |
|---|---|---|
| `fd_landing.md` | Página inicial | `/` |
| `fd_register.md` | Cadastro | `/register` |
| `fd_login.md` | Login | `/login` |
| `fd_forgot.md` | Esqueci a senha | `/forgot-password` |
| `fd_home.md` | Início (pós-login) | `/home` |
| `fd_profile.md` | Perfil (página nova) | `/profile` |
| `fd_vocational.md` | Teste Vocacional | `/vocational-test` |
| `fd_market.md` | Mercado de Trabalho | `/labor-market` |
| `fd_career.md` | Plano de Carreira | `/career-plan` |

Um arquivo só é criado quando há feedback para aquela tela. Para feedbacks futuros, os
arquivos são **atualizados** (novos itens entram no fim da lista).

---

## Formato de cada item

```
N. (tipo) [onde exatamente] — [o que está] → [como quero que fique].
   Alvo: celular | computador | os dois   ·   Prioridade: 🔴 | 🟡 | 🟢   ·   Status: ⬜ | ✅
```

- **tipo**: Bug 🐞 · Visual 🎨 · Texto ✍️ · Comportamento ⚙️ · Adicionar ➕ · Remover ➖ · Ideia 💡
- **Alvo**: se não foi dito, assumo **os dois**.
- **Status**: ⬜ pendente · 🔄 em andamento · ✅ feito.

Veja `fd_login.md` como **exemplo de formato** (conteúdo fictício, só para ilustrar).
