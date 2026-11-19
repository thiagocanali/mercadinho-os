# Fluxo de execução contínua do Codex

> **DEFINIDO:** este fluxo orienta tarefas autorizadas. **PLANEJADO:** funcionalidades do produto. **A VALIDAR:** requisitos do estabelecimento e integrações fiscais.

## Ciclo por tarefa
1. Ler `AGENTS.md`, `PROJECT-CONTEXT.md`, documentos pertinentes e fila em `docs/10-STATUS-DO-PROJETO.md`.
2. Inspecionar código, commits, PRs, testes e CI; não presumir implementação.
3. Priorizar segurança, dados, funcionamento básico, testes e manutenção.
4. Escolher tarefa executável sem exigir decisões externas ainda não tomadas.
5. Implementar mudança pequena, com testes e documentação.
6. Rodar verificações aplicáveis e corrigir falhas; nunca declarar aprovação sem execução.
7. Fazer commit descritivo e push na branch apropriada.
8. Verificar resultado da CI, registrar falhas e atualizar a fila.
9. Selecionar a próxima tarefa executável durante a sessão ativa.

## Limites de autonomia
Decisões técnicas comuns podem ser tomadas sem nova pergunta. Não fazer merge, deploy de produção, contratação paga ou alteração destrutiva sem autorização aplicável. Bloqueios externos não impedem tarefas independentes. Não prometer execução em segundo plano.

## Política de deploy
Preferir testes locais e GitHub Actions. Agrupar alterações relacionadas antes de previews. Não criar deploys intermediários desnecessários, nem insistir após bloqueio de cota.

## Definição de pronto
Código e documentação consistentes; testes aplicáveis executados com resultado registrado; nenhum segredo; isolamento multiempresa verificado quando pertinente; commit/push e estado de CI informados.

## Modelo de solicitação
```md
Objetivo:
Contexto:
Escopo permitido:
Critérios de aceite:
Restrições de segurança/custo:
Testes exigidos:
```

## Retomada
Se a sessão terminar, registrar tarefa concluída, próxima tarefa, branch, commit, evidências e bloqueios em `docs/10-STATUS-DO-PROJETO.md`.
