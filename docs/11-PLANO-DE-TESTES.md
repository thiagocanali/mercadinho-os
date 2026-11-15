# 11 — Plano de testes

> **Classificações:** **DEFINIDO** = decisão explicitamente estabelecida; **PLANEJADO** = intenção ainda não implementada; **A VALIDAR** = depende de levantamento, prova técnica ou avaliação especializada.
> **Estado:** documentação inicial, não constitui evidência de implementação.

## Estratégia planejada
| Camada | Cenários mínimos | Evidência |
|---|---|---|
| Unitários | cálculos monetários, descontos, estoque, permissões | suíte automatizada |
| Integração | transação venda/itens/pagamentos/movimentos | banco de teste |
| Segurança | acesso cruzado entre tenants, escalonamento, sessão | testes negativos |
| PDV | busca, carrinho, quantidade, cancelamento, caixa | cenários E2E |
| Offline | retry, duplicidade, ordem, conflitos, queda de rede | simulações de falha |
| Infra | deploy, healthcheck, segredos, rollback | checklist de release |
| Recuperação | backup e restauração verificável | relatório de exercício |

## Casos críticos
- Mesmo `client_operation_id` enviado duas vezes deve produzir uma única venda confirmada.
- Operador de A não pode ler/alterar produtos, vendas ou arquivos de B.
- Falha após pagamento externo não pode criar cobrança duplicada.
- Ajuste de estoque exige motivo, identidade e trilha.
- Operação offline deve exibir estado local distinto de confirmação remota.

## Critérios de entrada/saída
Sem requisitos validados não há teste de aceite do cliente. Antes do piloto: regressão, fluxo ponta a ponta, revisão de segurança, recuperação e aprovação operacional. Cobertura percentual e ferramentas ainda **A VALIDAR**.

Ver `02-REQUISITOS.md`, `13-FLUXOS-OPERACIONAIS.md` e `16-BACKUP-E-DISASTER-RECOVERY.md`.
