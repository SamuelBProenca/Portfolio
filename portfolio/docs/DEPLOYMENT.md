# GitHub e Vercel — publicação do portfólio

## Diagnóstico do contato

Na preparação local foram encontrados somente `.env.example` e, depois, um `.env.local` de configuração inicial. Nenhuma chave Resend ou credencial Redis estava configurada. Nesse estado, `POST /api/contact` retorna 503; a mensagem exibida pelo formulário é uma falha real, não uma confirmação de envio.

O destinatário permanece `samuelbrito782@gmail.com`. O proprietário confirmou uma conta Resend e um domínio verificado; ainda é necessário informar o endereço remetente exato e configurar as credenciais privadas.

```powershell
npm run contact:check
npm run contact:check:vercel
```

Esse diagnóstico local carrega os arquivos de ambiente do Next.js e mostra somente presença/validade, sem imprimir endereços ou tokens. A segunda forma verifica os requisitos de um deploy Vercel. Não consulta sua conta nem comprova que um domínio está verificado no Resend.

## Estrutura preparada

O repositório é [SamuelBProenca/Portfolio](https://github.com/SamuelBProenca/Portfolio). O design de `portfolio-design-v1` é o app ativo em `portfolio/`, mantendo a raiz usada pela integração Vercel. A cópia local `portfolio-design-v1/` fica ignorada pelo Git para evitar publicar dois aplicativos iguais.

```text
Portfolio/
  .github/workflows/ci.yml      Verificações no GitHub
  portfolio/                   App Next.js atual
    vercel.json
    package.json
    .env.example
    src/
    public/images/samuel-approved.webp
    docs/DEPLOYMENT.md
  legacy/pre-rework/portfolio/  Versão anterior preservada para referência
```

Os arquivos gerados, caches, node_modules, `.env.local`, diretórios `.vercel` e relatórios de execução não integram o código versionado. O histórico do repositório existente e a versão anterior do app são preservados.

As mudanças para `main` são propostas na branch `codex/promote-design-v1`, por Pull Request. Não substitua `main` com um novo `git init` ou force-push.

Para revisar a migração a partir da raiz do repositório:

```powershell
git status
git diff main --stat
```

O envio da branch pode criar um preview se o GitHub já estiver conectado ao Vercel. A integração do Pull Request em `main` pode atualizar o site de produção; revise o preview primeiro.

## Importação no Vercel

Use sua conta pessoal, importe `SamuelBProenca/Portfolio` e configure:

| Opção             | Valor                           |
| ----------------- | ------------------------------- |
| Framework         | Next.js                         |
| Root Directory    | `portfolio`                     |
| Node.js           | `22.x`                          |
| Install Command   | `npm ci`                        |
| Build Command     | `npm run build`                 |
| Output Directory  | Padrão do Next.js; sem override |
| Production Branch | `main`, depois da revisão       |

O `vercel.json` está dentro do app. Não selecione `out`, não use export estático e não adicione um rewrite geral de SPA: o formulário depende de uma função Node em `/api/contact`. O timeout da rota é 30 segundos.

Não fixe um slug `.vercel.app` inventado: escolha um nome disponível ao criar o projeto e utilize a URL retornada pelo Vercel. O domínio gratuito do site e o domínio remetente do Resend são configurações diferentes.

Referências oficiais: [Next.js no Vercel](https://vercel.com/docs/frameworks/full-stack/nextjs) e [versões Node suportadas](https://vercel.com/docs/functions/runtimes/node-js/node-js-versions).

## Variáveis de ambiente

Em Vercel → Project → Settings → Environment Variables, cadastre os valores nos ambientes **Production** e **Preview** que usarão o formulário. Para testar localmente, preencha o arquivo ignorado `.env.local`.

| Variável                   | Valor/configuração                                                                |
| -------------------------- | --------------------------------------------------------------------------------- |
| `RESEND_API_KEY`           | Chave privada da sua conta Resend com permissão de envio para o domínio escolhido |
| `CONTACT_TO_EMAIL`         | `samuelbrito782@gmail.com`                                                        |
| `CONTACT_FROM_EMAIL`       | Endereço simples no domínio que você verificou no Resend; sem `Nome <...>`        |
| `UPSTASH_REDIS_REST_URL`   | URL HTTPS do banco Redis de quotas                                                |
| `UPSTASH_REDIS_REST_TOKEN` | Token privado do mesmo banco, com permissão de escrita e EVAL                     |

Não use prefixo `NEXT_PUBLIC_`, não cadastre esses valores em `vercel.json`, não envie `.env.local` ao GitHub e não cole chaves em chat, issues ou comentários de PR. A chave Resend nunca deve ser enviada pelo navegador.

No Vercel, `CONTACT_RATE_LIMIT_MODE=memory` não libera envio: funções podem escalar ou reiniciar, por isso as quotas precisam ser compartilhadas. Crie/conecte um banco pelo [Upstash no Vercel](https://upstash.com/docs/redis/howto/vercelintegration) e confira os nomes das variáveis criadas. Se a integração usar outro prefixo, mapeie os valores REST para os dois nomes `UPSTASH_REDIS_REST_*` usados por este app. Não utilize um token somente de leitura.

Após adicionar ou alterar variáveis, crie um novo deploy. Variáveis locais não são automaticamente enviadas ao Vercel. Consulte [variáveis do Vercel](https://vercel.com/docs/environment-variables).

O endereço `onboarding@resend.dev` é destinado a testes e possui restrições de destinatário. Para este site use o domínio verificado confirmado pelo proprietário, conforme a [orientação do Resend](https://resend.com/docs/knowledge-base/403-error-resend-dev-domain).

## Teste após o deploy

1. Confirme que as verificações do GitHub passaram e abra o preview.
2. Navegue pelas páginas, confira o retrato, o accordion e `/projetos/octocards`.
3. Envie uma mensagem pelo formulário com seu próprio e-mail como visitante.
4. Confirme a aceitação no formulário, o registro correspondente no Resend e o recebimento no Gmail, incluindo spam. Aceitação do provedor não garante entrega na caixa de entrada.
5. Se houver erro, abra Vercel → Logs e filtre `[contact]` para a requisição. Os logs contêm códigos e status, sem chaves, textos enviados ou endereços dos visitantes.

| Código no log               | O que verificar                                                                                   |
| --------------------------- | ------------------------------------------------------------------------------------------------- |
| `CONTACT_CONFIGURATION`     | Chave, remetente ou destinatário ausente/inválido no ambiente desse deploy                        |
| `RATE_LIMIT_NOT_CONFIGURED` | Redis não configurado no Vercel                                                                   |
| `RATE_LIMIT_CONFIGURATION`  | Só uma credencial Redis presente ou URL sem HTTPS                                                 |
| `RATE_LIMIT_UNAVAILABLE`    | Token Redis inválido, indisponibilidade, timeout ou permissão para EVAL                           |
| `RESEND_REJECTED`           | Status HTTP e código seguro do Resend; para 401/403 confira chave, permissões e domínio remetente |
| `RESEND_INVALID_RESPONSE`   | Resposta do provedor sem ID válido; envio não confirmado                                          |
| `RESEND_NETWORK_FAILURE`    | Timeout/falha de rede ou resposta JSON inválida do Resend                                         |

Erros 429 são limites de tentativas; respeite `Retry-After`. Não desative as quotas para contornar uma configuração incompleta.

## O que já foi verificado e o que falta

A preparação inclui configuração Vercel, Node 22, arquivo lock, CI de tipos/lint/formatação/testes/build/browser e testes de diagnóstico sem vazamento de dados. O CI ainda não foi executado no GitHub antes do envio; os resultados locais são registrados na entrega.

O diagnóstico local verifica apenas a configuração. A aprovação dos testes com respostas simuladas não comprova envio real pelo Resend nem publicação no Vercel. Configure o remetente, as credenciais privadas e valide uma mensagem real após o deploy.
