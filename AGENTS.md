# Instruções permanentes para agentes — Mercadinho OS

> **DEFINIDO**: decisão estabelecida. **PLANEJADO**: intenção ainda não implementada. **A VALIDAR**: depende de confirmação técnica, operacional ou legal.

## Leitura obrigatória
1. Ler `PROJECT-CONTEXT.md`, `README.md`, `CODEX-WORKFLOW.md`.
2. Consultar documentação pertinente em `docs/` e verificar o estado real do código, branches e CI.
3. Consultar a fila de execução em `docs/10-STATUS-DO-PROJETO.md`.

## Desenvolvimento autônomo com proteção — política permanente
- Trabalhar em lotes de **5 a 10 tarefas relacionadas**, com critérios de aceite, riscos e testes definidos antes das alterações.
- Antes de abrir uma PR, consultar PRs abertas e **atualizar a PR existente da mesma frente**; manter no máximo uma PR ativa por frente, salvo justificativa técnica documentada.
- Fazer commits pequenos e rastreáveis dentro do lote; executar testes aplicáveis, corrigir falhas de CI e atualizar a mesma PR.
- Não abrir PR por tarefa, não fazer push direto na branch protegida e não usar force-push para contornar revisões.
- Priorizar squash merge e auto-merge **somente** quando permitidos, autorizados, com PR pronta, revisões obrigatórias e checks aprovados. Não mesclar rascunhos ou mudanças inseguras.
- Alterações em autenticação, permissões, banco, migrations e produção exigem revisão de segurança, testes adicionais e validação de impacto antes de merge ou aplicação.
- Nunca desabilitar, reduzir ou contornar branch protection, rulesets, checks obrigatórios ou revisões. Inspecionar as regras existentes antes de sugerir modificações.
- Evitar deploys de preview em commits intermediários; preferir GitHub Actions e testes locais, respeitando a cota gratuita da Vercel.
- Se CI estiver ausente, sem status ou não verificável, registrar o bloqueio; **não** interpretar ausência de resultado como sucesso.
- Continuar tarefas independentes durante a sessão ativa sem aguardar aprovação a cada etapa; não prometer trabalho em segundo plano.

## Execução autônoma
- Identificar a próxima tarefa segura e executável, implementar, testar, corrigir, fazer commit e push na branch adequada, verificar CI e atualizar a fila.
- Não solicitar confirmação para decisões técnicas rotineiras dentro do escopo já autorizado.
- Não afirmar continuidade em segundo plano: executar durante a sessão ativa e registrar o ponto de retomada.
- Priorizar problemas de segurança, integridade de dados e regressões antes de melhorias cosméticas.
- Manter mudanças pequenas e coesas, com testes proporcionais ao risco.
- Se uma tarefa depender de terceiros, registrar o bloqueio e avançar em outra tarefa independente.

## Restrições inegociáveis
- Não inventar requisitos do piloto nem declarar funcionalidades prontas sem evidência.
- Não alterar arquitetura silenciosamente: registrar ADR em `docs/09-DECISOES-TECNICAS.md`.
- Não adicionar serviços pagos, executar operações destrutivas, fazer merge ou deploy em produção sem autorização aplicável.
- Nunca publicar credenciais, dados pessoais ou senhas em texto puro.
- Validar permissões no servidor e garantir isolamento entre estabelecimentos.
- Revisar migrações e impacto sobre dados antes de aplicá-las.
- Não implementar emissão fiscal sem validação legal, contábil e técnica em Santa Catarina.
- Priorizar lint, typecheck, testes e build locais/CI; agrupar alterações para evitar previews e deploys desnecessários.
- Não repetir deploy quando a cota gratuita estiver esgotada.

## Relato e rastreabilidade
Atualizar `PROJECT-CONTEXT.md`, `docs/10-STATUS-DO-PROJETO.md` e documentação relacionada. Informar alterações, commit, testes realmente executados, falhas, riscos e próximo passo.
