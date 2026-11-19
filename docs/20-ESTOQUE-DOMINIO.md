# 20 — Estoque: regras implementadas e lacunas

**DEFINIDO nesta prova de domínio:** `src/domain/inventory.mjs` calcula movimentos de entrada e saída de estoque para produtos contados em unidades inteiras. A operação é pura e não grava no banco.

## Regras verificáveis
- Entradas somam e saídas subtraem a quantidade.
- Quantidade zero é permitida; saldo negativo e overflow são rejeitados.
- Produto e estabelecimento do movimento devem corresponder ao saldo e ao escopo autorizado.
- O objeto de estoque original não é alterado.
- Os testes automatizados estão em `tests/inventory.test.mjs`.

## Limitações críticas
- **Não existe persistência, transação, bloqueio otimista, trilha de auditoria nem autorização server-side nesta etapa.**
- O escopo deve ser derivado de sessão autenticada no servidor, nunca de parâmetros enviados pelo navegador.
- Não é adequado para produção, estoque por peso, devoluções, perdas, inventário ou venda concorrente.
- Antes do primeiro PDV real, criar tabela de movimentos imutáveis e atualizar saldos em transação no banco, com idempotência e testes concorrentes.

**A VALIDAR:** unidade fracionária, política de estoque negativo, inventário, perdas e devoluções.
