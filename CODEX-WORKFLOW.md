# Fluxo de execução contínua do Codex

> **DEFINIDO:** este fluxo orienta tarefas autorizadas. **PLANEJADO:** funcionalidades do produto. **A VALIDAR:** requisitos do estabelecimento e integrações fiscais.

## Ciclo por lote (5 a 10 tarefas)
1. Ler `AGENTS.md`, `PROJECT-CONTEXT.md`, documentos pertinentes e fila em `docs/10-STATUS-DO-PROJETO.md`.
2. Inspecionar código, commits, PRs, testes e CI; não presumir implementação.
3. Priorizar segurança, dados, funcionamento básico, testes e manutenção.
4. Selecionar de 5 a 10 tarefas relacionadas e executáveis, sem exigir decisões externas ainda não tomadas.
5. Implementar tarefas do lote em commits coesos, com testes e documentação.
6. Rodar verificações aplicáveis e corrigir falhas; nunca declarar aprovação sem execução.
7. Consultar PRs abertas da frente, reutilizar a PR correspondente e fazer commits descritivos/push na branch apropriada.
8. Verificar resultado da CI, registrar falhas e atualizar a fila.
9. Concluir o lote ou registrar bloqueios e avançar nas tarefas independentes durante a sessão ativa.

## Política de Pull Requests e integração
- No máximo uma PR ativa por frente, salvo justificativa técnica documentada.
- Não criar uma PR por tarefa; agrupar 5 a 10 tarefas relacionadas.
- Não mesclar PRs em rascunho, com CI não confirmada, pendências de segurança ou revisões obrigatórias não concluídas.
- Preferir squash merge e auto-merge quando suportados e autorizados; não modificar branch protection/rulesets sem auditoria e avaliação de impacto.
- Alterações de autenticação, banco, permissões e produção precisam de validação adicional antes da integração.
- Não usar ausência de resultados no conector como evidência de sucesso de CI.

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
