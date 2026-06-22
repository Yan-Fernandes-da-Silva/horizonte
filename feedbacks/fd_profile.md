# Feedback — Página de Perfil (nova) (`/profile`)

Última atualização: 2026-06-21 · Origem: `meu_feedback.txt` (Header item 3)
Legenda — Status: ✅ pendente · 🔄 em andamento · ✅ feito
Viabilidade — ✅ dá para fazer · ⚠️ dá para fazer, mas precisa de uma decisão sua

> ⚠️ **Recurso novo, ainda não implementado.** É a maior parte deste feedback. Acessada pelo
> menu da conta → "Meu perfil". Rota protegida (só logado). Proponho o endereço `/profile`.

---

## O que a página permite

1. (➕ Adicionar · Ambos) **Avatar** — escolher entre **imagens fixas** de um acervo.
   Viabilidade: ⚠️ depende da **Dúvida A** do `fd_home.md` (de onde vêm os avatares).
   Status: ✅

2. (➕ Adicionar · Ambos) **Editar nome** — campo de texto (mínimo 2 caracteres).
   Viabilidade: ✅
   Status: ✅

3. (➕ Adicionar · Ambos) **Editar e-mail** — com verificação de formato e de **e-mail já em uso**
   por outra conta.
   Viabilidade: ✅
   Status: ✅

4. (➕ Adicionar · Ambos) **Trocar senha** — exigindo a **senha atual** + a nova senha (regra:
   8+ caracteres, 1 maiúscula, 1 número). Viabilidade: ✅ (ver Dúvida B do `fd_home.md`)
   Status: ✅

5. (➕ Adicionar · Ambos) **Excluir conta** — com **confirmação** antes de apagar. Apaga o
   usuário e tudo ligado a ele (testes, favoritos, planos) e faz logout.
   Viabilidade: ✅
   Status: ✅

---

## Como pretendo construir (resumo técnico)

- Página protegida em `/profile` (dentro da área logada, com o mesmo cabeçalho/rodapé).
- Endpoints de API: atualizar dados (nome/e-mail/avatar), trocar senha (com senha atual) e
  excluir conta. Tudo validado também no servidor (não só no navegador).
- Após excluir a conta, o usuário é deslogado e enviado à página inicial.
- O avatar escolhido aparece no cabeçalho (onde hoje aparecem as iniciais).

## 🟠 Decisões (ver `fd_home.md`)
- **A:** origem dos avatares (recomendo um conjunto que eu crio em `public/images/avatars/`).
- **B:** troca de senha exige a senha atual (recomendado).

---

## 🔁 Ajustes — Rodada 2 (2026-06-22) — ✅

- **"Moldura mar":** o Perfil passou a ter o **fundo mar + cabeçalho translúcido** (ícone
  dourado + "Meu perfil"), como as demais telas. Os **cartões do formulário** (dados da conta,
  trocar senha, excluir conta) continuam **claros e legíveis** (Opção A — ver `fd_home.md`
  Rodada 4).

---

## 🔁 Ajustes — Rodada 3 (2026-06-22) — ✅ feito

- (🎨 Visual · Ambos) Os **3 painéis** — **Dados da conta**, **Trocar senha** e **Excluir
  conta** — passam a ter o **mesmo visual da home** (caixas de **vidro translúcido**, texto
  branco), em vez dos cartões brancos atuais. *(Substitui a Opção A só nesta tela.)*
  Os **campos de formulário** (inputs) continuam em **fundo claro** para manter a leitura/edição.
  O painel "Excluir conta" mantém o **destaque de perigo** (borda/título avermelhados).
  Status: ✅
