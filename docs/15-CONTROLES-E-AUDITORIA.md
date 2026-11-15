# 15 — Controles e auditoria

> **Classificações:** **DEFINIDO** = decisão explicitamente estabelecida; **PLANEJADO** = intenção ainda não implementada; **A VALIDAR** = depende de levantamento, prova técnica ou avaliação especializada.
> **Estado:** documentação inicial, não constitui evidência de implementação.

## Eventos candidatos (PLANEJADO)
Login e falhas; criação/edição de produto; mudança de preço; entradas e ajustes de estoque; abertura/fechamento de caixa; sangria/suprimento; venda, cancelamento, estorno e devolução; mudanças de papéis e configurações.

## Campos de evento ilustrativos
`event_id`, `establishment_id`, `actor_id`, `action`, `entity_type`, `entity_id`, `occurred_at`, `correlation_id`, `before/after` sanitizados. **A VALIDAR:** retenção, minimização e campos permitidos.

## Controles
- Registro append-only para operações críticas, com acesso restrito.
- Idempotência para vendas e callbacks externos; chave única por tenant e operação.
- Autorizações de cancelamento/desconto no backend.
- Reconciliação entre vendas, pagamentos, movimentos de estoque e caixa.
- Alarmes para divergências, falhas de sincronização e acessos suspeitos.
- Não registrar senhas, tokens, dados de cartão ou conteúdo pessoal desnecessário.

## Aceite
Dada uma venda, localizar operador, caixa, itens, pagamentos, movimentos, eventos e tentativas de retry sem duplicidade. Ver `07-SEGURANCA-E-LGPD.md` e `11-PLANO-DE-TESTES.md`.
