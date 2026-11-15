# 10 — Status e fila de execução

**Atualizado:** 2026-11-15. **DEFINIDO:** documentação e diretrizes. **PLANEJADO:** implementação do produto. **A VALIDAR:** necessidades do piloto, fiscal e compatibilidade da stack.

## Estado verificado
- Documentação oficial existe no repositório.
- Nenhuma funcionalidade de PDV, estoque ou autenticação foi comprovada implementada nesta revisão documental.
- Branch de trabalho: `chore/agent-execution-workflow`.

## Fila priorizada
| Prioridade | Tarefa | Estado | Dependência |
|---|---|---|---|
| P0 | Formalizar execução autônoma, limites e retomada | Validada | Arquivos e PR #1; CI no commit 493863e: sucesso |
| P1 | Auditar árvore de código, scripts, dependências e CI | Em andamento | Repositório documental; package.json criado para testes Node, Nuxt ainda não configurado |
| P1 | Estabelecer CI mínimo de documentação/código conforme stack existente | Validada | Workflow #25 (43751117701) success: testes Python/Node, typecheck e build Nuxt |
| P1 | Validar arquitetura Cloudflare + Neon + ORM com prova técnica | Em andamento | Nuxt build validado no workflow #16; Cloudflare/Neon pendentes |
| P1 | Levantar processos e equipamentos do mercadinho | Bloqueada externamente | Entrevista/visita |
| P1 | Avaliar obrigações fiscais de SC | Bloqueada externamente | Especialista fiscal |
| P2 | Definir escopo de MVP com critérios de aceite | A validar | Descoberta |
| P2 | Implementar fundação multiempresa e autenticação | Em andamento | Migrations e RBAC puro criados; autenticação server-side ainda pendente |

## Regras de atualização
Registrar para cada tarefa: data, branch, commit, testes realmente executados, CI, riscos, pendências e próxima ação. Não declarar fases concluídas por mera documentação. Consultar `05-ROADMAP.md`.

## Riscos
Isolamento entre estabelecimentos, consistência offline, requisitos fiscais, custos de provedores e conectividade do piloto.

## Evidências da sessão
- Branch `chore/agent-execution-workflow`: adicionado `scripts/check_docs.py` e `.github/workflows/docs.yml`.
- Consulta ao HEAD `9ddefb6180ba7c357fdb9153b12802dcb889dfdb`: nenhuma execução de workflow e nenhum status de commit retornados; **não considerar CI aprovada**.
- Nenhum deploy ou alteração em produção.
- Próxima ação: verificar execução do workflow no GitHub e corrigir eventuais falhas; depois auditar demais arquivos e definir a fundação técnica conforme decisões pendentes.

## Retomada — 2026-11-15
- **Validado no GitHub:** execução Actions `43750265278`, job `validate` concluído com sucesso para o commit `493863e`.
- **Commits adicionais:** `711fce2` (testes unitários do validador) e `27843e5` (workflow executa testes).
- **CI do HEAD `27843e5`:** consulta inicial não retornou execução; **não afirmar testes aprovados nesse HEAD**.
- **Auditoria inicial:** `package.json` e `src/app.vue` não encontrados na branch principal; não presumir aplicação pronta. Issues abertas: nenhuma retornada na busca.
- **Próxima tarefa:** conferir execução dos novos testes no HEAD, corrigir falhas, completar inventário do repositório e preparar prova técnica da fundação.

## Execução adicional — domínio e CI
- CI `43750381101` no HEAD `0f45214`: **success**.
- Iniciado código de domínio em `src/domain/money.mjs`: centavos inteiros, multiplicação com BigInt e verificação de overflow; **não é PDV funcional**.
- Adicionados testes Node em `tests/money.test.mjs` e `package.json` mínimo sem dependências de terceiros; CI passou a executar `npm test`.
- **A VALIDAR:** política comercial de descontos, quantidades fracionárias/pesáveis, tributos e arredondamento. O módulo atual suporta apenas quantidades inteiras positivas.
- **Próxima ação:** confirmar CI do novo HEAD, corrigir falhas e iniciar a prova técnica do scaffold Nuxt/Cloudflare/Neon sem provisionamento de produção.

## Validação da fundação — evidência
- Workflow `43750516460` no commit `5d2d6aa`: **completed/success**; incluiu testes do validador, checagem documental e testes de domínio Node.
- A implementação monetária é isolada e ainda não está integrada a Nuxt, banco ou PDV. Regras fiscais e produtos por peso continuam **A VALIDAR**.
- Próxima prioridade: scaffold de aplicação, prova técnica Cloudflare/Neon e testes de autorização multiempresa, sem deploy de produção.

## Execução — scaffold Nuxt 4
- Criados `nuxt.config.ts`, `app/app.vue`, `app/pages/index.vue`, `app/assets/css/main.css`, `.gitignore` e `.env.example`.
- `package.json` atualizado para Nuxt 4.6.4, TypeScript e Vue TypeScript; Node >=22.21.0.
- Workflow configurado para instalar dependências e executar `npm run build` em CI, sem deploy.
- **Não validado:** instalação, build e compatibilidade Cloudflare/Neon; a página é apenas institucional, sem login, PDV ou armazenamento.
- **Próxima ação:** confirmar GitHub Actions do HEAD, corrigir erros de instalação/build e definir adapter Cloudflare após prova técnica.

## Retomada — CI Nuxt e guardas multiempresa
- GitHub Actions `43750712456` no commit `a6384c9`: **success**; testes Python, Node e build Nuxt aprovados.
- Implementado módulo de domínio `src/domain/tenant.mjs`, testes `tests/tenant.test.mjs` e documentação `docs/19-FUNDACAO-MULTITENANT.md`.
- CI passa a executar `npm run typecheck` antes de `npm run build`. **Ainda sem evidência de aprovação do novo HEAD**.
- **Limitação crítica:** guardas de domínio não são autenticação nem RLS; não disponibilizar endpoints multiempresa com dados reais.
- Próxima tarefa: confirmar typecheck e testes no novo HEAD; corrigir falhas; avançar para persistência e autorização server-side em ambiente de desenvolvimento.

## Ciclo em lote — 2026-11-15
- Auditoria: workflow #20 (`43750901624`) **failure** exclusivamente na etapa `Typecheck Nuxt`; testes Python, validação documental, instalação e testes Node passaram; build foi pulado.
- Correção: criado `tsconfig.json` e comando `nuxt prepare && nuxt typecheck`.
- Implementado domínio de estoque em `src/domain/inventory.mjs` com testes para entrada, saída, isolamento multiempresa, saldo insuficiente, overflow e dados inválidos.
- Criados `docs/20-ESTOQUE-DOMINIO.md` e `docs/21-PROVA-TECNICA-INFRA.md` para critérios e limitações.
- **Pendente:** confirmar testes, typecheck e build do HEAD atualizado; nenhuma migração, integração Neon, Cloudflare ou deploy.
- **Próximas 5 tarefas:** (1) validar CI do HEAD e corrigir erros; (2) verificar typecheck e build Nuxt; (3) estruturar esquema SQL multiempresa com constraints; (4) criar camada de repositório server-side com escopo derivado da sessão; (5) testar concorrência e idempotência de movimentos em banco de desenvolvimento.

## Fechamento de validação do lote
- Workflow #25 (`43751117701`) no commit `81cd5fa`: **completed/success**. Correção do typecheck confirmada no GitHub Actions.
- Nenhuma implantação ou alteração em produção. Próxima etapa permanece persistência transacional e autorização server-side; não confundir guardas puras com isolamento no banco.

## Ciclo de persistência — 2026-11-15
- Workflow #26 estava em execução na consulta inicial; conclusão não confirmada neste registro.
- Migrations `0001_initial.sql` e `0002_stock_posting.sql` criadas: entidades multiempresa, integridade referencial, função transacional de estoque com idempotência.
- Política RBAC pura e testes adicionados (`authorization.mjs`, `authorization.test.mjs`).
- Smoke SQL em `tests/postgres_smoke.sql` e job CI com PostgreSQL 16 efêmero; **aguardando resultado**.
- Segurança: a função SQL não autentica o ator. NÃO expor execução a clientes; requer sessão verificada no servidor, privilégio mínimo e revisão de RLS.
- Próximas cinco tarefas: (1) corrigir CI PostgreSQL e typecheck se falharem; (2) adicionar testes de concorrência SQL; (3) implementar sessão e autorização server-side; (4) testar RLS/grants de menor privilégio; (5) integrar serviço de estoque ao banco de desenvolvimento, sem deploy.
