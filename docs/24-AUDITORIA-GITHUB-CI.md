# Auditoria GitHub Actions e branch protection

## Estado verificado em 2026-11-19

- Há uma única PR aberta: #2, mantida em rascunho.
- `.github/workflows/docs.yml` tem dois jobs estáveis: `validate` e `postgres-smoke`.
- O workflow dispara em toda PR, push na `main` e manualmente, sem filtros de caminhos.
- O cancelamento por concorrência afeta apenas execuções de PR; não cancela a validação da `main`.
- Permissões do token do workflow: `contents: read`.
- O teste `tests/test_workflow_policy.py` impede regressões em gatilhos, permissões e jobs.
- **Sem evidência de CI aprovada**: a consulta disponível retorna somente runs associados ao SHA por evento pull_request e não lista todos os eventos; resultado vazio é inconclusivo.
- A integração tem mudanças de autenticação, RLS e PostgreSQL; requer testes executados e revisão de segurança.

## Verificações obrigatórias antes de qualquer mudança de proteção

No GitHub, consultar **Settings → Rules → Rulesets** e **Settings → Branches** (ou API com permissão de leitura equivalente), identificando:

1. Rulesets ativos para `main`, proteção de branch, exigência de PR e restrições de push.
2. Reviews exigidos, CODEOWNERS, aprovação do autor e bloqueio de reviews obsoletas.
3. **Nomes exatos** de status checks obrigatórios e se há exigência de branch atualizada.
4. Política de squash merge, auto-merge, merge queue e resolução de conversas.
5. Possíveis checks herdados do antigo nome do workflow ou filtros de paths.

**Não alterar as regras até obter a configuração efetiva.** Não reduzir o número de revisores, desativar checks, liberar bypass ou habilitar merge automático de PR em rascunho.

## Diagnóstico de CI ausente

1. Abrir `https://github.com/thiagocanali/mercadinho-os/actions` e confirmar se Actions está habilitado e se o workflow aparece.
2. Abrir a aba **Checks** da PR #2 e conferir jobs `validate` e `postgres-smoke` para o **HEAD atual**.
3. Se não houver runs, verificar sintaxe do YAML, permissões do repositório, regras de execução de workflows e eventos. Não inferir sucesso.
4. Se houver falha, examinar o log da etapa; corrigir no mesmo branch e atualizar a mesma PR.
5. Só depois de jobs concluídos com sucesso, revisão de segurança e demais proteções, considerar marcar a PR pronta.

## Economia de recursos

- Sem push-trigger para branches de trabalho: uma PR aberta gera um único conjunto de checks por atualização.
- `concurrency` cancela execuções obsoletas de PR, poupando minutos de Actions.
- CI não faz deploy, não acessa Neon/Vercel e usa PostgreSQL 16 efêmero.
- Previews Vercel dependem da configuração da integração Vercel, que **não foi auditada aqui**. Não presumir que este workflow controle previews.

## Pendências

- Verificar rulesets e branch protection com acesso apropriado.
- Obter execução real e logs da CI no HEAD.
- Confirmar os nomes dos checks exigidos antes de qualquer eventual alteração de configuração.
