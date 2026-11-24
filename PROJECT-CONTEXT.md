# Contexto rápido — Mercadinho OS

> **Classificações:** **DEFINIDO** = decisão explicitamente estabelecida; **PLANEJADO** = intenção ainda não implementada; **A VALIDAR** = depende de levantamento, prova técnica ou avaliação especializada.
> **Estado:** documentação inicial, não constitui evidência de implementação.

**Objetivo:** sistema de gestão para pequeno mercado, validado primeiro com estabelecimento piloto e potencial expansão SaaS.

**Público:** mercadinhos de bairro; **proposta:** simplificar operações e melhorar visibilidade de vendas e estoque, sujeito a validação.

**DEFINIDO:** arquitetura cloud first; independência do computador doméstico; prioridade para custo inicial baixo; separar módulo fiscal do núcleo de gestão; projetar isolamento multiempresa.

**PLANEJADO:** Nuxt/Vue 3/TypeScript/Tailwind, Cloudflare Workers/Pages, Neon PostgreSQL, PWA/IndexedDB, GitHub Actions, eventual R2; produtos, estoque, caixa, PDV, relatórios e offline.

**A VALIDAR:** ORM, versões, autenticação, configuração e dispositivos do piloto, processos existentes, pagamentos, legislação de SC, preços e limites dos provedores.

**Implementado:** nenhuma funcionalidade confirmada por esta documentação. O estado do código deve ser inspecionado antes de cada tarefa.

**Próximos passos:** entrevista e visita técnica; mapear venda/estoque/caixa/fiscal; definir MVP; testar compatibilidade Cloudflare + Neon + ORM.

**Riscos:** indisponibilidade de internet/energia no piloto, custos de escala, inconsistência offline, falhas de isolamento e requisitos fiscais.

Ver `docs/05-ROADMAP.md`, `docs/09-DECISOES-TECNICAS.md` e `docs/10-STATUS-DO-PROJETO.md`.

A CI da PR #2 instala dependências com `npm ci` a partir do `package-lock.json` versionado.
