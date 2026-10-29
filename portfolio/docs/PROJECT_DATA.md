# Dados dos projetos e curadoria comercial

## O que aparece em cada página

A home mostra Curriculum Studio, GreatMaker, OctoCards e LinkKeeper, nessa ordem. A escolha é explícita em `featuredProjectIds`, em `src/content/projects.ts`. Estrelas, nomes de repositório, data de atividade ou conteúdo do README não alteram títulos, argumentos comerciais, ilustrações ou a ordem dos destaques. O catálogo reúne esses quatro, IcarusRoc, OpsCLI e Design Patterns Dojo, com implementação, proposta e estudo identificados nos textos.

GreatMaker apresenta o DesignRef M1 local, com uma captura real da biblioteca em sessão de teste. LinkKeeper apresenta o núcleo e a camada SQLite implementados; a CLI ainda executa somente validação. Seu README e o documento FOUNDATION ainda descrevem um incremento anterior: a apresentação foi conferida diretamente no código do commit `63ec801`, sem inferir API, autenticação ou WhatsApp. IcarusRoc acrescenta um exemplo de interface de serviços ao catálogo; não há promessa de conversão, envio de orçamento validado ou hospedagem verificada.

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

O comando deriva a lista do catálogo editorial e consulta seus seis repositórios públicos, valida todos os resultados e só então substitui o snapshot. O produto privado continua sem consulta externa. Uma falha preserva o arquivo anterior. Revise o diff antes de registrar a atualização. Esse comando não altera a seleção comercial e não é um agendador instalado. Os scripts independentes leem variáveis do processo; não carregam arquivos .env automaticamente.

## Consumir a API OctoCards quando houver uma instância

Configure `OCTOCARDS_API_ORIGIN` com a origem HTTPS da instância, sem caminho, credenciais ou query, e gere um novo deploy. Localmente, HTTP só é aceito em loopback. Exemplo apenas ilustrativo: `https://cards.example.com`.

O adaptador consulta `/api/cards/:repo?owner=SamuelBProenca` por projeto, valida o contrato e conserva o mesmo fallback. Não use `git@github.com:...` nessa variável. Deixá-la vazia mantém a coleta direta do GitHub. `GITHUB_TOKEN` é opcional para leituras públicas e fica somente no servidor; não use prefixo `NEXT_PUBLIC_`. Nenhuma URL de instância publicada foi fornecida ou inventada nesta entrega.

## Revisão do OctoCards

O plano foi atualizado em 28/10/2026 para o commit `b467160150a140bc1f6d19bc99f88fc0b4070333`, que integrou o PR #15. Além dos recursos anteriores, o código aplica dez entradas por lote, query de 2.048 caracteres, deduplicação e até três consultas simultâneas por lote. A API limita chamadas por IP (padrão de 12/minuto), com limite separado para documentação (120/minuto). Os limites e o cache continuam locais ao processo.

A cópia isolada desse commit passou no comando completo `npm test`: cinco suítes e 33 testes. Também passaram typecheck, build compilado, smoke HTTP e audit de produção. O arquivo legado vazio foi removido no próprio OctoCards pelo commit `12ab4bc`; não houve exclusão local de testes para obter esse resultado. Backend CI e CodeQL desse commit passaram no GitHub.

O plano preserva os IDs anteriores e acrescenta marcos de limite HTTP, build e CI, além das sete issues abertas #8–#14. Conta 16 de 25 tarefas-folha concluídas. Essa contagem não mede prontidão de produção. Retentativas, instância publicada, orçamento compartilhado, política global de lotes, privacidade de imagens, proteções de segredos, sincronização do contrato, script manual e advisory de desenvolvimento permanecem pendentes. O audit completo retorna sete alertas baixos na árvore Jest/deepmerge; isso não foi escondido nem corrigido com override/downgrade.

## Verificação

Os testes do portfólio cobrem o consumidor GitHub e o contrato OctoCards, validação, rejeição de privados, timeout/erros com fallback, cota, respostas inválidas/grandes, texto inerte e preservação da curadoria. O navegador confere os quatro destaques, o catálogo de sete projetos, a captura do GreatMaker, o estágio do LinkKeeper, o README e a ausência de chamadas ao GitHub no cliente. A confirmação de uma instância OctoCards em produção continua uma etapa separada.
