# Horizonte — Guia Rápido para Yan

> Este é o seu guia de consulta rápida. Guarde-o bem!

---

## Como iniciar o Claude Code

1. Abra o **PowerShell** (ou o terminal integrado do VS Code)
2. Navegue até a pasta do projeto:
   ```
   cd C:\Users\yanfe\Desktop\Horizonte
   ```
3. Inicie o Claude Code:
   ```
   claude
   ```
4. O Claude lerá o `CLAUDE.md` automaticamente e estará pronto

---

## Prompt para iniciar cada fase

Quando quiser começar uma fase, cole este texto no terminal:

```
Leia o arquivo docs/phases/PHASE_XX_NOME.md e execute as instruções desta fase.
Antes de criar qualquer arquivo, me mostre o plano e aguarde minha aprovação.
```

Substitua `XX_NOME` pelo número e nome da fase desejada:

| Fase | Arquivo a pedir                       |
|------|---------------------------------------|
| 00   | `docs/phases/PHASE_00_SETUP.md`       |
| 01   | `docs/phases/PHASE_01_DESIGN_SYSTEM.md` |
| 02   | `docs/phases/PHASE_02_AUTH.md`        |
| 03   | `docs/phases/PHASE_03_LANDING.md`     |
| 04   | `docs/phases/PHASE_04_HOME.md`        |
| 05   | `docs/phases/PHASE_05_ETL_STATIC.md`  |
| 06   | `docs/phases/PHASE_06_ETL_MARKET.md`  |
| 07   | `docs/phases/PHASE_07_VOCATIONAL_TEST.md` |
| 08   | `docs/phases/PHASE_08_LABOR_MARKET.md` |
| 09   | `docs/phases/PHASE_09_CAREER_PLAN.md` |
| 10   | `docs/phases/PHASE_10_DEPLOY.md`      |

---

## Prompts úteis do dia a dia

### Retomar uma sessão depois de fechar o terminal
```
Leia o CLAUDE.md e me diga em qual fase estamos, o que já foi feito e o que falta.
```

### Ver o que foi feito recentemente
```
Me mostre um resumo do que foi implementado até agora, baseando-se nos arquivos existentes e commits do git.
```

### Pedir uma correção visual
```
O [componente/página X] não está ficando como eu esperava. 
O problema é: [descreva o que está errado].
Eu queria que ficasse: [descreva como deveria ser].
Não mexa em nada mais, apenas corrija isso.
```

### Pedir explicação de algo
```
Me explique em linguagem simples, sem termos técnicos, o que é [termo/arquivo/função X] 
e qual é o seu papel no projeto.
```

### Quando algo quebrou
```
O site parou de funcionar / está dando erro. 
O erro que aparece é: [cole o erro aqui].
Por favor, identifique a causa e me proponha uma solução antes de implementar.
```

### Pedir sugestão de melhoria
```
Estou pensando em [ideia X]. O que você acha? Quais são as opções disponíveis para implementar isso?
Me dê as vantagens e desvantagens de cada opção antes de implementar qualquer coisa.
```

### Salvar progresso no GitHub
```
Salve o progresso atual no GitHub. Crie um commit descritivo em português com tudo que foi feito.
```

---

## Comandos Git para usar no terminal (por conta própria)

```bash
# Ver o que mudou
git status

# Ver o histórico de commits
git log --oneline

# Desfazer mudanças não salvas em um arquivo
git checkout -- nome-do-arquivo

# Ver o site rodando localmente
npm run dev
# Depois abra: http://localhost:3000

# Parar o servidor local
# Pressione Ctrl + C no terminal
```

---

## Comandos do banco de dados (Prisma)

> Peça ao Claude para rodar esses comandos quando necessário.
> Eles são executados no terminal do projeto.

```bash
# Aplicar mudanças do schema ao banco de dados
npx prisma migrate dev

# Abrir interface visual do banco de dados
npx prisma studio

# Popular o banco com dados iniciais
npx prisma db seed
```

---

## Estrutura das pastas (onde fica cada coisa)

```
Horizonte/
├── CLAUDE.md              ← Briefing do Claude (não mexa)
├── docs/                  ← Documentação do projeto
│   ├── HORIZONTE.md       ← Visão completa do projeto
│   ├── QUICK_REFERENCE.md ← Este arquivo
│   ├── phases/            ← Prompts de cada fase
│   └── decisions/         ← Decisões técnicas que foram tomadas
├── data/                  ← Arquivos de dados do governo (não mexa)
├── scripts/               ← Scripts automáticos (ETL)
├── prisma/                ← Configuração do banco de dados
├── src/                   ← Código do site
│   ├── app/               ← Páginas do site
│   ├── components/        ← Partes visuais reutilizáveis
│   └── lib/               ← Configurações e utilitários
└── public/                ← Imagens, ícones e fontes
```

---

## O que fazer se o Claude não entender o que você quer

1. **Seja específico sobre o que está errado**: "O botão está azul, eu queria verde" é melhor que "não ficou certo"
2. **Mencione onde está o problema**: "Na página de login, o campo de email..." é melhor que "no site..."
3. **Descreva o resultado esperado**: "Deveria mostrar uma mensagem de erro abaixo do campo" é melhor que "deveria funcionar"
4. **Se for visual**: Tente descrever em palavras como você imagina: "Quero que o card tenha bordas arredondadas, uma cor mais escura e o texto centralizado"

---

## Contatos e Links úteis

| Recurso | Link |
|---|---|
| Site em desenvolvimento | `http://localhost:3000` |
| Banco de dados (visual) | `http://localhost:5555` (via `npx prisma studio`) |
| Repositório GitHub | (será definido na Fase 10) |
| Site em produção | (será definido na Fase 10) |
