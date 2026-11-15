# 14 — UX/UI e design system

> **Classificações:** **DEFINIDO** = decisão explicitamente estabelecida; **PLANEJADO** = intenção ainda não implementada; **A VALIDAR** = depende de levantamento, prova técnica ou avaliação especializada.
> **Estado:** documentação inicial, não constitui evidência de implementação.

## Direção visual proposta (PLANEJADO)
Interface sóbria, legível e operacional, com hierarquia clara. Identidade visual, paleta e tipografia finais **A VALIDAR** com piloto. Preferir tokens semânticos (surface, text, primary, danger, success) em vez de cores fixas no código.

## Tokens candidatos
Escala de espaçamento 4/8/12/16/24/32 px; tipografia legível com tamanhos escalonados; estados de foco visíveis; contraste conforme WCAG aplicável. Valores são sugestões, não identidade aprovada.

## Componentes
Botões com estados loading/disabled; formulários com validação e erros próximos ao campo; tabelas com busca/filtros; modais apenas para ações críticas; alertas acionáveis e não dependentes só de cor.

## PDV prioritário
Busca e leitura de código rápidas; carrinho sempre visível; quantidade e total destacados; atalhos de teclado testados; poucas interações para venda; mensagens claras para rede, pagamento e sincronização. **A VALIDAR:** tamanho de tela, leitor, teclado, toque e impressora.

## Responsividade e acessibilidade
Desktop prioritário no piloto, sem bloquear telas menores; navegação por teclado, rótulos, foco, mensagens de erro e prevenção de ações irreversíveis.

## Critérios de aceite
Teste observado com operador real, tarefas cronometradas e sem confusão entre venda pendente e confirmada. Ver `13-FLUXOS-OPERACIONAIS.md`.
