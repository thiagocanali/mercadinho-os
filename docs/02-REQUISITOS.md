# 02 — Requisitos

> **Classificações:** **DEFINIDO** = decisão explicitamente estabelecida; **PLANEJADO** = intenção ainda não implementada; **A VALIDAR** = depende de levantamento, prova técnica ou avaliação especializada.
> **Estado:** documentação inicial, não constitui evidência de implementação.

## Requisitos funcionais candidatos
| ID | Capacidade | Estado | Observação |
|---|---|---|---|
| RF-01 | Cadastro de produtos/categorias | PLANEJADO | Campos a validar |
| RF-02 | Fornecedores e entradas | PLANEJADO | Processo atual desconhecido |
| RF-03 | Estoque e movimentações | PLANEJADO | Política de ajuste pendente |
| RF-04 | PDV, carrinho e código de barras | PLANEJADO | Leitor não confirmado |
| RF-05 | Vendas e pagamentos | PLANEJADO | Meios e conciliação a validar |
| RF-06 | Abertura/fechamento de caixa | PLANEJADO | Apenas um operador conhecido |
| RF-07 | Permissões e auditoria | PLANEJADO | Papéis a definir |
| RF-08 | Indicadores e relatórios | PLANEJADO | Métricas a validar |
| RF-09 | Múltiplos estabelecimentos | PLANEJADO | Isolamento obrigatório no desenho |
| RF-10 | PWA e sincronização offline | PLANEJADO | Escopo offline limitado |
| RF-11 | Integração fiscal modular | A VALIDAR | Regulação de SC |

## Não funcionais
**DEFINIDO:** cloud first, segurança, não depender do PC doméstico e priorizar custo baixo. **PLANEJADO:** acessibilidade, desempenho de PDV, observabilidade, backup, idempotência e testes. **A VALIDAR:** metas de disponibilidade, RPO/RTO, dispositivos e limites gratuitos.

## Perguntas para levantamento
Como são registradas vendas e entradas hoje? Existe sistema fiscal? Internet é estável? Qual computador, leitor e impressora? Há venda por peso? Quais pagamentos? Como é o fechamento? Quais relatórios são realmente úteis?

**Aceite:** cada requisito do MVP precisa de responsável pela validação, prioridade, cenário de teste e evidência. Ver `06-REGRAS-DE-NEGOCIO.md` e `13-FLUXOS-OPERACIONAIS.md`.
