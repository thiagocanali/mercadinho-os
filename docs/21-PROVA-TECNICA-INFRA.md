# 21 — Prova técnica de infraestrutura

**Estado:** PARCIAL. Não existe deploy ou conexão real com Neon/Cloudflare.

## Evidências já obtidas
- Nuxt 4 inicial com build executado em GitHub Actions #16 (sucesso).
- Testes Python e Node no GitHub Actions.
- Typecheck foi adicionado, mas falhou no workflow #20 por ausência de tsconfig raiz; correção enviada com `tsconfig.json` e `nuxt prepare`, aguardando validação de CI.

## Próximos critérios de aceite
1. Typecheck e build Nuxt passam na mesma revisão.
2. Preparar build para Cloudflare Workers em CI sem publicar nem usar segredos.
3. Selecionar driver Postgres compatível com runtime Workers e conexão Neon (sem criar recursos).
4. Criar migrations para estabelecimento, usuários associados, produtos e movimentos com constraints e índices.
5. Testar autorização e isolamento entre duas empresas em ambiente efêmero; negar acesso sem sessão.

**Não afirmar** que o projeto está pronto para produção ou fiscalmente conforme.
