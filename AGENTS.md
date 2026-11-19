# Instruções permanentes para agentes — Mercadinho OS

> **DEFINIDO**: decisão estabelecida. **PLANEJADO**: intenção ainda não implementada. **A VALIDAR**: depende de confirmação técnica, operacional ou legal.

## Leitura obrigatória
1. Ler `PROJECT-CONTEXT.md`, `README.md`, `CODEX-WORKFLOW.md`.
2. Consultar documentação pertinente em `docs/` e verificar o estado real do código, branches e CI.
3. Consultar a fila de execução em `docs/10-STATUS-DO-PROJETO.md`.

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
