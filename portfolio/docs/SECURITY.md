# Credenciais e proteção do repositório

Credenciais reais pertencem às variáveis de ambiente do servidor ou à configuração privada da hospedagem. Não devem entrar no Git, em `public/`, em dados enviados ao navegador, em relatórios, em capturas ou em logs. Use somente nomes de variáveis e valores vazios no `.env.example`; dados não sigilosos de exemplo usam domínios reservados para exemplos.

As credenciais do formulário são lidas pelos módulos do servidor. Não use `NEXT_PUBLIC_` para tokens, senhas ou chaves privadas, nem importe implementações do servidor em componentes cliente. A documentação pode explicar como configurar uma variável, sem registrar seu valor.

## Antes de commits e pushes

Instale o [Gitleaks oficial](https://github.com/gitleaks/gitleaks), versão de referência `8.30.1`, verificando o SHA-256 publicado. Deixe o executável no `PATH` ou em `.cache/security/gitleaks` (`gitleaks.exe` no Windows). Esse cache é ignorado pelo Git; o scanner não envia o código ou credenciais a serviços de verificação.

Na raiz do repositório, ative os hooks locais:

```sh
git config --local core.hooksPath .githooks
node portfolio/scripts/check-repository-security.mjs --history
```

O pre-commit examina o índice e o conteúdo staged. O pre-push examina todo o histórico disponível, incluindo merges. Ambos bloqueiam arquivos privados conhecidos e exigem campos sigilosos vazios nos templates. A falta do scanner ou uma falha interrompe a operação. Não use `--no-verify` para contornar uma detecção.

Os hooks precisam ser ativados em cada clone: o Git não transfere a configuração local. O CI executa a mesma proteção, com histórico completo e o scanner fixado por versão e hash. O scanner mantém as regras padrão, sem exclusões amplas, com redação integral dos valores e sem aceitar comentários `gitleaks:allow`.

## Auditoria de 22/10/2026

A análise inicial não encontrou segredos nas referências Git locais, incluindo merges, nem nos arquivos gerados para o navegador. Nenhum arquivo de credenciais foi encontrado nas listas de caminhos versionados atuais ou históricos. O `.env.example` contém campos sigilosos vazios. Nessa auditoria, o GitHub informou zero alertas abertos e as proteções de secret scanning e push protection ativas.

São detecções automatizadas e revisão estrutural, não uma garantia de detecção de qualquer dado sigiloso possível. Os resultados brutos ficam somente em diretórios locais ignorados; não publique achados ou valores de credenciais como evidência de auditoria.

Se houver uma detecção, interrompa o envio e identifique o achado sem copiar seu valor para o chat, issues ou PRs. Uma credencial já exposta deve ser revogada ou rotacionada no provedor; removê-la do arquivo atual não a remove do histórico. Qualquer reescrita do histórico deve ser planejada separadamente para preservar o trabalho dos colaboradores.
