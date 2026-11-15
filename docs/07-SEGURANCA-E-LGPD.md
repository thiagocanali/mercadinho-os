# 07 — Segurança e LGPD

> **Classificações:** **DEFINIDO** = decisão explicitamente estabelecida; **PLANEJADO** = intenção ainda não implementada; **A VALIDAR** = depende de levantamento, prova técnica ou avaliação especializada.
> **Estado:** documentação inicial, não constitui evidência de implementação.

## Controles propostos
- Autenticação com provedor/implementação **A VALIDAR**; senhas sempre com hash robusto, nunca texto puro.
- Sessões protegidas, expiração, revogação e proteção contra CSRF conforme arquitetura.
- Autorização no backend com vínculo ativo entre usuário e estabelecimento.
- Toda consulta e gravação deve limitar tenant; testes negativos para leitura e escrita cruzadas.
- TLS, segredos fora do repositório, menor privilégio e rotação de credenciais.
- Auditoria de acessos, preços, estoque, vendas, cancelamentos e caixa; proteção contra adulteração.
- Rate limiting, validação de entrada, proteção contra injeção e revisão de dependências.

## LGPD
**PLANEJADO:** inventário de dados, base legal por finalidade, minimização, retenção proporcional, acesso restrito, resposta a incidentes e mecanismos para direitos dos titulares. **A VALIDAR:** papéis de controlador/operador, política de retenção, transferências internacionais, contratos e necessidade de RIPD.

## Offline
Dispositivo compartilhado exige expiração de sessão, minimização dos dados locais, limpeza segura e política de perda/roubo; não persistir segredos nem dados sensíveis desnecessários.

## Aceite
Testes de acesso entre tenants, revisão de logs e segredos, backup protegido e plano de incidentes antes do piloto. Boas práticas não equivalem a certificação de conformidade LGPD. Ver `11-PLANO-DE-TESTES.md`.
