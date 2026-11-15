# 08 — Infraestrutura e custos

> **Classificações:** **DEFINIDO** = decisão explicitamente estabelecida; **PLANEJADO** = intenção ainda não implementada; **A VALIDAR** = depende de levantamento, prova técnica ou avaliação especializada.
> **Estado:** documentação inicial, não constitui evidência de implementação.

## Serviços candidatos
| Camada | Proposta | Estado / risco |
|---|---|---|
| Interface/API | Cloudflare Pages e/ou Workers | PLANEJADO; validar compatibilidade e cotas |
| PostgreSQL | Neon | PLANEJADO; limites, conexão e recuperação A VALIDAR |
| Arquivos | Cloudflare R2 | PLANEJADO somente se necessário |
| Código/CI | GitHub + Actions | DEFINIDO como ferramentas desejadas; cotas A VALIDAR |
| DNS/domínio | A escolher | A VALIDAR; pode ter custo |

## Estratégia de custo
Não presumir gratuidade ilimitada, SLA, backup garantido ou ausência de cobrança por tráfego. Antes de contratar: verificar limites oficiais vigentes, alertas de uso, retenção, egress, concorrência, armazenamento, CI e política de suspensão.

## Ambientes
**PLANEJADO:** desenvolvimento, homologação e produção separados quando viável; segredos e bancos independentes. Se o plano gratuito limitar ambientes, documentar compensações sem misturar dados reais e testes.

## Resiliência
Produção não depende do PC doméstico; a operação física ainda depende de energia, internet e equipamentos locais. Definir monitoramento, backups externos, restauração e contingência em `16-BACKUP-E-DISASTER-RECOVERY.md`.

## Controle de deploys
CI para lint/testes/build; agrupar commits; previews apenas quando necessários; não repetir deploy com cota esgotada. **A VALIDAR:** preços e limites na data de implementação.
