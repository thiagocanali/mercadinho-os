# 19 — Fundação multiempresa e isolamento

**Estado:** PLANEJADO / prova de domínio, não autenticação funcional.

## Premissas de segurança
- O identificador da empresa **nunca** pode ser confiado diretamente do formulário, query string ou cabeçalho do navegador.
- A sessão autenticada no servidor deve determinar o estabelecimento ativo e verificar a associação do usuário.
- Cada consulta ao banco deve filtrar pelo estabelecimento autorizado. Operações de escrita devem validar a mesma associação.
- Políticas de banco, testes de isolamento e revisão de privilégios são obrigatórios antes de liberar dados reais.
- Negar acesso por padrão quando a sessão, o estabelecimento ou a associação estiverem ausentes.

## Implementação atual
`src/domain/tenant.mjs` fornece validação de identificadores e uma guarda de comparação de tenant para serviços de domínio. Ela **não** substitui autenticação, autorização, SQL parametrizado ou Row Level Security. Testes em `tests/tenant.test.mjs` cobrem isolamento básico e casos inválidos.

## Próximas provas
1. Escolher autenticação server-side compatível com Nuxt + Cloudflare Workers.
2. Definir esquema de usuários, estabelecimentos, associação e papéis no Neon.
3. Escrever testes de integração com duas empresas, incluindo leitura, escrita e alteração indevida de `tenantId`.
4. Proteger endpoints antes de expor operações comerciais.
5. Confirmar backup, migração e rollback sem usar produção.

**A VALIDAR:** modelo de usuários com acesso a múltiplos estabelecimentos e privilégios de operadores de caixa.
