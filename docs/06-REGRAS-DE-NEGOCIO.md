# 06 — Regras de negócio

> **Classificações:** **DEFINIDO** = decisão explicitamente estabelecida; **PLANEJADO** = intenção ainda não implementada; **A VALIDAR** = depende de levantamento, prova técnica ou avaliação especializada.
> **Estado:** documentação inicial, não constitui evidência de implementação.

| Área | Regra candidata (PLANEJADO) | A VALIDAR |
|---|---|---|
| Produto | Identificação única por estabelecimento e histórico de preço | SKU, barcode duplicado, unidade/peso |
| Venda | Itens e totais imutáveis após confirmação; ajustes via evento | Desconto, cancelamento, devolução |
| Estoque | Movimentação auditável para entrada/saída/ajuste | Estoque negativo, custo, validade |
| Caixa | Abertura, lançamentos, fechamento e diferença | Troco inicial, sangria, suprimento |
| Pagamento | Método, valor e estado por transação | Pix, cartão, pagamento misto, estorno |
| Operador | Permissões por papel e estabelecimento | Aprovação de descontos e cancelamentos |
| Tenant | Dados isolados em todas as operações | Matriz de papéis e filiais |

## Invariantes técnicas propostas
- Não duplicar venda em retry; idempotência por estabelecimento e operação.
- Não reescrever histórico financeiro; usar cancelamento/estorno auditável.
- Totais calculados e validados no backend; cliente não define autorização.
- Movimento de estoque associado a origem e operador.
- Separar estado de pagamento, venda e emissão fiscal.

## Casos ainda indefinidos
Venda sem internet, produto sem código, perda de conexão após pagamento, devolução parcial, divergência no fechamento e fechamento com operações offline pendentes. Registrar decisão com responsável antes de habilitar.

Ver `13-FLUXOS-OPERACIONAIS.md`, `15-CONTROLES-E-AUDITORIA.md` e `17-INTEGRACOES.md`.
