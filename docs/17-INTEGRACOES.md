# 17 — Integrações

**DEFINIDO:** separar núcleo de gestão de adaptadores externos. **PLANEJADO:** contratos versionados, idempotência, retries e tratamento explícito de falhas.

| Integração | Estado | Pendências |
|---|---|---|
| Fiscal/NFC-e | A VALIDAR | legislação SC, PAF-NFC-e, credenciamento, fornecedor, contador |
| Pix | PLANEJADO | provedor, confirmação, conciliação, custos |
| Cartão | PLANEJADO | adquirente/TEF, estorno, segurança, taxas |
| Impressora | A VALIDAR | equipamento, driver, formato do comprovante |
| Leitor de barras | A VALIDAR | disponibilidade e protocolo |
| Mensageria e APIs | PLANEJADO | finalidade, privacidade, cotas e custos |

## Invariantes
Venda, pagamento e documento fiscal possuem estados distintos; callback repetido não pode duplicar cobrança; integração indisponível não implica funcionamento offline. Não afirmar autorização para emissão fiscal nem dispensa de obrigações legais. Ver `03-ARQUITETURA.md` e `06-REGRAS-DE-NEGOCIO.md`.
