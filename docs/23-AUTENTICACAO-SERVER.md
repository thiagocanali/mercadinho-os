# Autenticação server-only — etapa de desenvolvimento

## Implementado

`src/server/hmac-session.mjs` verifica tokens Bearer JWT HS256 **assinados por emissor confiável**. Verifica HMAC com comparação temporalmente segura, emissor, audiência, sujeito UUID, emissão, validade e duração máxima de 1 hora. O segredo precisa ter no mínimo 32 bytes e existir somente no servidor.

`src/server/stock-application.mjs` aceita um resolvedor de sessão configurado no backend. O usuário autenticado é consultado em `tenant_memberships` dentro da transação PostgreSQL; `actorUserId` fornecido no corpo não é usado. Há testes com assinatura válida e assinatura adulterada.

## Não implementado / não liberar para produção

- Não há emissor de tokens, cadastro/login, recuperação de conta, revogação de sessão, rotação de segredos, persistência de identidade ou endpoint HTTP.
- Não há rate limiting, auditoria de autenticação, CSRF para eventuais cookies, controle de origens ou autorização de administração.
- O emissor **deve** garantir que `sub` seja o UUID interno de `app_users.id`. Não usar identificadores externos diretamente.
- Tokens de portador podem ser roubados; exigir TLS e armazenamento seguro no cliente. Não colocar tokens em URLs.
- Segredos nunca devem ser incluídos no repositório, logs, resposta HTTP ou bundle do cliente.
- RLS baseada em `app.tenant_id` é defesa em profundidade, **não** prova de autenticação; clientes não podem executar SQL diretamente.
- Não existe conexão real com banco ou deploy neste ciclo. A integração exige role restrita e testes PostgreSQL 16 aprovados.

## Critérios antes de expor uma API

1. Escolher e integrar um emissor confiável com gestão de usuários e revogação.
2. Restringir grants PostgreSQL e comprovar RLS sob role não proprietária.
3. Validar claims, rate limiting, entrada, erros, logs e modelo de sessão.
4. Executar CI Node, typecheck, build e PostgreSQL e revisar ameaças.
