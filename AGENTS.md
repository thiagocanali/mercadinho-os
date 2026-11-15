# Instruções permanentes para agentes — Mercadinho OS

> **Classificações:** **DEFINIDO** = decisão explicitamente estabelecida; **PLANEJADO** = intenção ainda não implementada; **A VALIDAR** = depende de levantamento, prova técnica ou avaliação especializada.
> **Estado:** documentação inicial, não constitui evidência de implementação.

## Ordem obrigatória de leitura
1. Ler `PROJECT-CONTEXT.md`, `README.md` e `CODEX-WORKFLOW.md`.
2. Consultar os documentos de `docs/` relevantes à tarefa.
3. Inspecionar o código e o histórico antes de afirmar que algo existe.

## Regras inegociáveis
- Não inventar requisitos do cliente piloto; classificar como DEFINIDO, PLANEJADO ou A VALIDAR.
- Não alterar arquitetura, banco ou contratos silenciosamente; documentar impactos e ADRs em `docs/09-DECISOES-TECNICAS.md`.
- Não adicionar serviços pagos, alterar produção ou executar operações destrutivas sem autorização explícita.
- Nunca publicar segredos, tokens, credenciais, dados pessoais ou senhas em texto puro; usar secret managers e hash seguro para senhas.
- Autorizar toda operação no servidor; jamais confiar apenas no frontend.
- Garantir isolamento multiempresa em consultas, gravações, arquivos, filas e relatórios; testar acessos cruzados.
- Escrever testes proporcionais ao risco, especialmente para vendas, caixa, estoque, pagamentos e sincronização.
- Fazer migrations reversíveis e revisadas; não apagar dados em produção.
- Não declarar funcionalidade pronta sem código, testes e evidência.
- Não implementar emissão fiscal própria sem validação jurídica, contábil e técnica de Santa Catarina.
- Atualizar contexto, status e documentação após mudanças relevantes; manter código modular, simples e sustentável.
- Evitar dependências desnecessárias e custos recorrentes não aprovados.
- Evitar deploys intermediários: priorizar testes locais/CI, agrupar mudanças e respeitar cotas gratuitas.

## Entrega de cada tarefa
Relatar escopo, arquivos modificados, testes executados, resultados, riscos, pendências e necessidade de decisão. Seguir `CODEX-WORKFLOW.md`.
