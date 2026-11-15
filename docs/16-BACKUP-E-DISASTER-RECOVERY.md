# 16 — Backup e recuperação de desastres

> **Classificações:** **DEFINIDO** = decisão explicitamente estabelecida; **PLANEJADO** = intenção ainda não implementada; **A VALIDAR** = depende de levantamento, prova técnica ou avaliação especializada.
> **Estado:** documentação inicial, não constitui evidência de implementação.

## Premissas
**DEFINIDO:** produção cloud first, sem dependência do PC doméstico. **A VALIDAR:** capacidades de backup/restore do plano Neon, retenção, custos e garantias. Não presumir PITR ou SLA gratuitos.

## Estratégia proposta
Backups periódicos consistentes do PostgreSQL, com armazenamento separado, acesso restrito, criptografia e testes de restauração. Frequência **PLANEJADA**, sujeita a volume, orçamento e objetivos de recuperação. Incluir configurações e procedimentos de infraestrutura, sem exportar segredos para o repositório.

## RPO e RTO
**A VALIDAR** com o piloto. RPO = perda máxima tolerável de dados; RTO = tempo máximo aceitável para restabelecer. Não atribuir números sem acordo e prova operacional.

## Procedimento de incidente
1. Detectar e delimitar indisponibilidade ou corrupção.
2. Proteger evidências e interromper gravações arriscadas.
3. Avaliar dados já confirmados e operações locais pendentes.
4. Selecionar backup e ambiente de restauração.
5. Validar integridade, isolamento e conciliação.
6. Autorizar retorno, comunicar impacto e registrar lições.

## Exercícios
Restaurar em ambiente isolado, verificar contagens, vendas, estoque, caixa e permissões; registrar tempo, perda estimada e falhas. Ver `12-OPERACAO-E-IMPLANTACAO.md`.
