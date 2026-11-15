# 09 — Registro de decisões técnicas (ADR)

> **Classificações:** **DEFINIDO** = decisão explicitamente estabelecida; **PLANEJADO** = intenção ainda não implementada; **A VALIDAR** = depende de levantamento, prova técnica ou avaliação especializada.
> **Estado:** documentação inicial, não constitui evidência de implementação.

## Convenção
Cada ADR informa ID, estado, contexto, decisão, alternativas, consequências e gatilho de revisão. **DEFINIDO** não significa implementado.

| ADR | Estado | Decisão ou pergunta |
|---|---|---|
| ADR-001 | DEFINIDO | Produção cloud first, independente do computador doméstico |
| ADR-002 | PLANEJADO | Nuxt/Vue 3/TypeScript/Tailwind; validar compatibilidade |
| ADR-003 | PLANEJADO | Cloudflare Workers/Pages como hospedagem |
| ADR-004 | PLANEJADO | Neon PostgreSQL como banco remoto |
| ADR-005 | A VALIDAR | Drizzle versus Prisma no runtime escolhido |
| ADR-006 | DEFINIDO | Núcleo de gestão desacoplado da integração fiscal |
| ADR-007 | PLANEJADO | Isolamento multiempresa desde a fundação |
| ADR-008 | PLANEJADO | PWA com offline limitado e sincronização idempotente |
| ADR-009 | A VALIDAR | Autenticação, sessões, papéis e RLS complementar |
| ADR-010 | A VALIDAR | Estratégia de backup, RPO/RTO e observabilidade |
| ADR-011 | DEFINIDO | Priorizar baixo custo sem assumir SLA ou gratuidade ilimitada |
| ADR-012 | A VALIDAR | Escopo fiscal em Santa Catarina e fornecedor autorizado |

## Exemplo de ADR detalhada — ADR-006
**Contexto:** obrigações fiscais variam e dependem de validação. **Decisão:** separar operações comerciais do adaptador fiscal. **Alternativas:** acoplamento direto ao emissor (rejeitado como estratégia inicial). **Consequências:** estados e falhas fiscais próprios, sem promessa de substituição de emissor. **Revisão:** após análise contábil/jurídica/técnica.

## Processo
Mudança relevante exige nova ADR, revisão das referências e comunicação explícita; nunca alterar silenciosamente. Ver `03-ARQUITETURA.md`.
