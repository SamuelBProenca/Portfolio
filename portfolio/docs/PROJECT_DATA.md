# Dados dos projetos e curadoria comercial

## O que aparece em cada página

A home mostra apenas Curriculum Studio e OctoCards, nessa ordem. A escolha é explícita em `featuredProjectIds`, em `src/content/projects.ts`. Estrelas, nomes de repositório, data de atividade ou conteúdo do README não alteram títulos, argumentos comerciais, ilustrações ou a ordem dos destaques. O primeiro continua sendo o produto utilizável; o segundo demonstra uma API implementada. OpsCLI e Design Patterns Dojo continuam no catálogo, com a maturidade de proposta e estudo identificada.

A página `/projetos` conserva o catálogo editorial e acrescenta linguagens coletadas. A página técnica do OctoCards expõe linguagens, métricas, data e README em texto inerte. A capa automática não substitui as ilustrações comerciais. Nenhuma conclusão sobre estágio, conclusão ou qualidade é inferida de estrelas ou README.

## Fonte atual

A pedido do proprietário, a fonte atual é o GitHub público, consultado no servidor. O endereço SSH do repositório não é um endpoint de API. O consumidor usa o contrato de dados do OctoCards, mas a operação atual não é apresentada como consumo de uma API OctoCards publicada.

O servidor só consulta os repositórios já presentes na curadoria. Confere `private=false` antes de ler README e linguagens, valida identidade e dados recebidos, usa prazo de 2,5 segundos por consulta e cache Next.js de uma hora. O conteúdo de README nunca é executado ou interpretado como HTML. Tokens não chegam ao navegador e não são enviados para a API OctoCards.

Cada projeto tem fallback independente em `src/content/repository-snapshot.json`, coletado de verdade em 26/10/2026. Falha de rede, resposta inválida ou rate limit não removem o catálogo e não derrubam a home. A home usa exclusivamente os textos editoriais locais; os dados externos ficam no catálogo e no detalhe técnico. As páginas de dados têm revalidação de uma hora.

## Atualizar a referência salva

Na pasta `portfolio/`:

```sh
npm run projects:sync
```

O comando consulta os três repositórios públicos, valida todos os resultados e só então substitui o snapshot. Uma falha preserva o arquivo anterior. Revise o diff antes de registrar a atualização. Esse comando não altera a seleção comercial e não é um agendador instalado. Os scripts independentes leem variáveis do processo; não carregam arquivos .env automaticamente.

## Consumir a API OctoCards quando houver uma instância

Configure `OCTOCARDS_API_ORIGIN` com a origem HTTPS da instância, sem caminho, credenciais ou query, e gere um novo deploy. Localmente, HTTP só é aceito em loopback. Exemplo apenas ilustrativo: `https://cards.example.com`.

O adaptador consulta `/api/cards/:repo?owner=SamuelBProenca` por projeto, valida o contrato e conserva o mesmo fallback. Não use `git@github.com:...` nessa variável. Deixá-la vazia mantém a coleta direta do GitHub. `GITHUB_TOKEN` é opcional para leituras públicas e fica somente no servidor; não use prefixo `NEXT_PUBLIC_`. Nenhuma URL de instância publicada foi fornecida ou inventada nesta entrega.

## Revisão do OctoCards

O plano foi atualizado para o commit `6f9ec4bb8d0ebe6f7ac5c59bcd17bcfe86cd85c9`, integrado em 26/10/2026. Inclui coleta pública, capa, consultas individuais e em lote, entradas validadas, erros padronizados, timeout, cache por cinco minutos limitado a 500 entradas, playground opcional, guia e OpenAPI.

A execução da suíte publicada confirmou 12 casos aprovados nos arquivos do serviço e do controller. O comando completo `npm test` ainda falha ao incluir o arquivo legado vazio `backend/src/tests/gitCardService.test.ts`. Essa falha permanece explícita e pendente no plano. Limite de lote, retentativas e conexão de uma instância publicada também não foram marcados como concluídos.

## Verificação

Os testes do portfólio cobrem o consumidor GitHub e o contrato OctoCards, validação, rejeição de privados, timeout/erros com fallback, cota, respostas inválidas/grandes, texto inerte e preservação da curadoria. O navegador confere os dois destaques, o catálogo completo, o README e a ausência de chamadas ao GitHub no cliente. A confirmação de uma instância OctoCards em produção continua uma etapa separada.
