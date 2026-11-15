# 05 — Roadmap

> **Classificações:** **DEFINIDO** = decisão explicitamente estabelecida; **PLANEJADO** = intenção ainda não implementada; **A VALIDAR** = depende de levantamento, prova técnica ou avaliação especializada.
> **Estado:** documentação inicial, não constitui evidência de implementação.

Nenhuma fase está declarada concluída. O sequenciamento é **PLANEJADO** e depende de validação.

| Fase | Entrega principal | Dependência / aceite |
|---|---|---|
| 0 Descoberta | Entrevista, equipamentos, processos, fiscal | Requisitos do MVP aprovados |
| 1 Fundação | CI, ambientes, API, banco, auth, tenant | Testes de isolamento e deploy controlado |
| 2 Produtos/estoque | Cadastros e movimentos | Saldo reconciliável e trilha de auditoria |
| 3 PDV | Carrinho, vendas, pagamentos, caixa | Fluxo de venda testado ponta a ponta |
| 4 Gestão | Histórico, relatórios e indicadores | Métricas conferidas com transações |
| 5 Offline | PWA, IndexedDB, fila e reconciliação | Duplicidade/conflitos testados |
| 6 Fiscal | Avaliação regulatória e adaptador | Aprovação especializada e fornecedor adequado |
| 7 Piloto | Treinamento, operação acompanhada | Aceite do estabelecimento e contingência |
| 8 SaaS | Onboarding, suporte e expansão | Custos, segurança e suporte validados |

## Dependências críticas
Fase 0 precede compromisso de escopo; compatibilidade técnica precede escolha de ORM; exigências fiscais precedem qualquer promessa de emissão; offline depende de modelo idempotente e regras de reconciliação.

## Gestão de entregas
Cada fase terá issues pequenas, critérios de aceite, testes, documentação e avaliação de custo. Evitar previews Vercel/Cloudflare desnecessários; preferir CI e commits agrupados. Ver `10-STATUS-DO-PROJETO.md`.
