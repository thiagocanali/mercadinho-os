# Mercadinho OS

> **Classificações:** **DEFINIDO** = decisão explicitamente estabelecida; **PLANEJADO** = intenção ainda não implementada; **A VALIDAR** = depende de levantamento, prova técnica ou avaliação especializada.
> **Estado:** documentação inicial, não constitui evidência de implementação.

Sistema de gestão **PLANEJADO** para mercadinhos de bairro: produtos, estoque, frente de caixa (PDV), operadores, relatórios e evolução para SaaS multiempresa. Primeiro alvo: um estabelecimento piloto próximo ao idealizador; requisitos ainda não validados com o responsável.

## Diretrizes
- **DEFINIDO:** cloud first, sem depender do computador doméstico; segurança e separação entre estabelecimentos desde a fundação.
- **PLANEJADO:** Nuxt/Vue 3/TypeScript/Tailwind, Cloudflare Workers e Pages, Neon PostgreSQL, PWA, GitHub Actions e R2 se necessário.
- **A VALIDAR:** ORM (Prisma/Drizzle), versões, viabilidade gratuita, hardware, leitor, impressora, conectividade, processos e obrigações fiscais.

## Documentação
- `AGENTS.md`: regras do Codex.
- `CODEX-WORKFLOW.md`: ciclo de trabalho.
- `PROJECT-CONTEXT.md`: resumo vivo.
- `docs/01` a `docs/18`: produto, requisitos, arquitetura, dados, roadmap, negócio, segurança, infraestrutura, decisões, status, testes, operação, fluxos, UX, auditoria, recuperação, integrações e comercial.

## Começar
1. Levantar necessidades reais do estabelecimento (ver `docs/02-REQUISITOS.md`).
2. Validar obrigações fiscais com especialistas.
3. Fazer prova de compatibilidade técnica e custos.
4. Só então aprovar escopo de MVP e iniciar implementação.

**Não há funcionalidades declaradas implementadas nesta documentação.**
