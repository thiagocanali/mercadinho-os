# 12 — Operação e implantação

> **Classificações:** **DEFINIDO** = decisão explicitamente estabelecida; **PLANEJADO** = intenção ainda não implementada; **A VALIDAR** = depende de levantamento, prova técnica ou avaliação especializada.
> **Estado:** documentação inicial, não constitui evidência de implementação.

## Pipeline planejado
PR → lint/typecheck/testes → build → revisão → deploy controlado em homologação → smoke test → aprovação → produção. Não fazer deploy a cada alteração intermediária nem repetir tentativas quando a cota gratuita acabar.

## Configuração
Segredos no provedor, nunca em commits. Separar URLs, credenciais, bancos e permissões por ambiente. Registrar migrações, rollback, logs e versão publicada.

## Checklist do piloto
- [ ] Requisitos e obrigações fiscais validados.
- [ ] Hardware, leitor, impressora, energia e internet inventariados.
- [ ] Operador treinado e permissões revisadas.
- [ ] Backup e restauração testados.
- [ ] Contingência para internet/energia/fiscal documentada.
- [ ] Teste de venda, caixa e reconciliação concluído.
- [ ] Canal de suporte e responsável definidos.

## Incidentes
Classificar severidade, registrar horário, impacto, estabelecimento, operações pendentes e recuperação; evitar correções destrutivas. Nunca assumir que offline resolve indisponibilidade de pagamento ou emissão fiscal.

## Rollback
Aplicação: voltar versão conhecida. Banco: plano de migração reversível ou restauração aprovada; nunca restaurar produção sem avaliação de perda de dados e autorização.

Ver `08-INFRAESTRUTURA-E-CUSTOS.md` e `16-BACKUP-E-DISASTER-RECOVERY.md`.
