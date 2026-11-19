# 22 — Banco de dados e movimentação transacional

**Estado:** MIGRATIONS TESTADAS EM POSTGRESQL EFÊMERO NO GITHUB ACTIONS; não aplicadas em Neon nem produção.

## Arquivos
- `database/migrations/0001_initial.sql`: tenants, usuários, associações e papéis, produtos, saldos, movimentos e constraints de isolamento por chave composta.
- `database/migrations/0002_stock_posting.sql`: função `post_stock_movement`, transação de atualização de saldo, idempotência e proteção contra saldo negativo/overflow.

## Invariantes
- `(tenant_id, product_id)` impede associar saldo/movimento a produto de outra empresa.
- `(tenant_id, actor_user_id)` exige associação do ator ao estabelecimento.
- `(tenant_id, idempotency_key)` impede duplicação de movimentos.
- Bloqueio `FOR UPDATE` serializa alterações por produto; reuso de chave com parâmetros diferentes é rejeitado.
- O lançamento exige papel `owner` ou `manager` na associação consultada.

## Bloqueios de segurança antes de uso real
**A função não autentica a identidade do ator.** Um cliente com acesso SQL direto poderia enviar o UUID de outro usuário autorizado. Por isso, não conceder EXECUTE a clientes não confiáveis; invocar somente por serviço server-side que valida sessão e associação. Implementar RLS/roles de banco e políticas de privilégios, revisar grants padrão de funções PostgreSQL e testar antes de exposição.

**Validado:** smoke SQL em PostgreSQL 16 efêmero no job `postgres-smoke` do workflow #38; inclui migrações, idempotência, permissões e FK multiempresa. **Não executado:** testes concorrentes, migração/rollback em Neon, backup ou deploy. Os scripts são propostas revisáveis; não declarar persistência funcional.

## Próximas validações
1. Banco PostgreSQL efêmero e execução de ambas migrations em CI.
2. Testes de constraints, idempotência, corrida concorrente e transações de rollback.
3. Serviço autenticado com identidade verificada e queries parametrizadas.
4. Revisão de RLS, grants e credenciais de menor privilégio.
5. Política de unidades fracionárias e auditoria fiscal.

## Validação adicional — 2026-11-16
- Migration `0003_lockdown.sql` revoga `EXECUTE` de `PUBLIC` na função de lançamento.
- CI #46: job `postgres-smoke` **success**, incluindo teste de ACL e 20 movimentos simultâneos sobre um mesmo produto.
- O teste de concorrência cobre entradas distintas; replay simultâneo, disputas de saída, RLS e papéis restritos permanecem pendentes.
- O serviço `src/server/stock-service.mjs` ainda é somente um contrato de segurança sem adaptador SQL, sem autenticação real e sem endpoint.
