# Fluxo de trabalho do Codex

> **Classificações:** **DEFINIDO** = decisão explicitamente estabelecida; **PLANEJADO** = intenção ainda não implementada; **A VALIDAR** = depende de levantamento, prova técnica ou avaliação especializada.
> **Estado:** documentação inicial, não constitui evidência de implementação.

## Antes
1. Ler `AGENTS.md` e `PROJECT-CONTEXT.md`.
2. Identificar documentos relacionados e critérios de aceite.
3. Verificar branch, commits, arquivos, CI, ambiente e estado real.
4. Descrever plano pequeno, dependências, riscos, migrações e custo.

## Durante
- Trabalhar em mudanças pequenas e coesas; respeitar contratos e isolamento multiempresa.
- Não expandir escopo sem aprovação; registrar novas dúvidas como A VALIDAR.
- Implementar testes unitários, integração e segurança adequados ao risco.
- Evitar deploy a cada commit; usar GitHub Actions quando possível.

## Depois
- Rodar lint, typecheck, testes e build aplicáveis; registrar comandos e resultados reais.
- Atualizar `PROJECT-CONTEXT.md`, `docs/10-STATUS-DO-PROJETO.md` e ADRs relevantes.
- Entregar resumo, evidências, arquivos, riscos, pendências e próximo passo.

## Modelo de tarefa
```md
Objetivo:
Contexto e documentos de referência:
Escopo permitido:
Fora do escopo:
Critérios de aceite:
Restrições de custo, segurança e deploy:
Validações esperadas:
```

## Critério de pronto
Código revisável, testes apropriados aprovados, documentação atualizada, sem segredos e sem mudança silenciosa de arquitetura. Não confundir commit com deploy ou validação no piloto.
