import type { ProjectPlan, ProjectReference } from "@/types/project-progress";

const repository = "https://github.com/SamuelBProenca/OctoCards" as const;
const snapshotSha = "b467160150a140bc1f6d19bc99f88fc0b4070333";
function code(path: string, label: string): ProjectReference {
  return { kind: "code", label, url: `${repository}/blob/${snapshotSha}/${path}` };
}
function issue(number: number, label: string): ProjectReference {
  return { kind: "issue", label, url: `${repository}/issues/${number}` };
}
const service = code("backend/src/services/gitCardService.ts", "Serviço de cards");
const controller = code("backend/src/controllers/gitCardController.ts", "Controller da API");
const serviceTests = code("backend/src/services/gitCardService.test.ts", "Testes do serviço");
const controllerTests = code(
  "backend/src/controllers/gitCardController.test.ts",
  "Testes do controller",
);

export const octocardsPlan: ProjectPlan = {
  id: "octocards",
  title: "OctoCards",
  repository,
  snapshotSha,
  reviewedAt: "2026-10-28",
  description:
    "API em alpha para coletar dados públicos do GitHub e alimentar interfaces próprias. Inclui cache, lotes limitados, cota por IP, playground opcional e build compilado. O plano distingue entregas verificadas das pendências de operação e segurança.",
  groups: [
    {
      id: "foundation",
      title: "Base implementada",
      description:
        "Recursos conferidos no código da alpha. Implementação não equivale a operação pública validada.",
      tasks: [
        {
          id: "card-contract",
          title: "Consultar o GitHub e compor os cards",
          status: "completed",
          description:
            "Reúne nome, README, linguagens, estrelas, forks, link e capa. A seleção de imagem consulta a árvore e o README, prioriza capas e ignora badges.",
          references: [service, code("backend/src/types/gitCardType.ts", "Contrato PropsGitCard")],
        },
        {
          id: "card-endpoints",
          title: "Expor consultas individuais e em lote",
          status: "completed",
          dependsOn: ["card-contract"],
          description:
            "As rotas aceitam owner explícito ou padrão. A coleção preserva a ordem pedida e falha por inteiro se algum item falhar; não devolve uma coleção parcial.",
          references: [
            code("backend/src/routes/gitCardRoutes.ts", "Rotas da API"),
            code("backend/src/utils/getRepos.ts", "Consulta em lote"),
            controller,
          ],
        },
        {
          id: "default-values",
          title: "Definir valores de fallback para os cards",
          status: "completed",
          dependsOn: ["card-contract"],
          description:
            "README ausente recebe um valor padrão. Linguagens vazias e ausência de capa têm alternativas explícitas. Outras falhas de README não são disfarçadas como ausência de conteúdo.",
          references: [
            service,
            serviceTests,
            { kind: "pull-request", label: "PR #5 · valores padrão", url: `${repository}/pull/5` },
          ],
        },
        {
          id: "public-only",
          title: "Restringir a coleta a repositórios públicos",
          status: "completed",
          description:
            "O serviço verifica private=false antes de ler README ou arquivos, mesmo quando o token do servidor possui acesso privado. Repositórios privados e ausentes recebem 404.",
          references: [service, serviceTests],
        },
      ],
    },
    {
      id: "reliability",
      title: "Confiabilidade e limites",
      description:
        "Cache, validação e limites por lote e por IP implementados. Retentativas e orçamento compartilhado continuam pendentes.",
      tasks: [
        {
          id: "request-validation",
          title: "Validar entradas da API",
          status: "completed",
          dependsOn: ["card-endpoints"],
          references: [controller],
          subtasks: [
            {
              id: "validate-repository",
              title: "Validar owner e nomes de repositórios",
              status: "completed",
              description:
                "Rejeitar valores vazios, tipos repetidos e segmentos de caminho inválidos já faz parte dos controllers. O owner informado na consulta substitui o padrão.",
              references: [controller, controllerTests],
            },
            {
              id: "batch-limits",
              title: "Limitar o tamanho dos lotes",
              status: "completed",
              description:
                "Até dez entradas por lote, query de até 2.048 caracteres e deduplicação preservando ordem. A coleta permite até três repositórios simultâneos por lote, interrompendo novos agendamentos após falha; não é um limite global.",
              references: [
                controller,
                code("backend/src/utils/getRepos.ts", "Concorrência por lote"),
                code("backend/src/utils/getRepos.test.ts", "Testes da concorrência"),
              ],
            },
          ],
        },
        {
          id: "http-reliability",
          title: "Tratar falhas da integração com GitHub",
          status: "planned",
          dependsOn: ["card-contract"],
          references: [service],
          subtasks: [
            {
              id: "timeout-retries",
              title: "Definir timeout e política de tentativas",
              status: "planned",
              subtasks: [
                {
                  id: "upstream-timeout",
                  title: "Limitar o tempo das consultas ao GitHub",
                  status: "completed",
                  description:
                    "GITHUB_TIMEOUT_MS configura o timeout, com padrão de dez segundos. Falhas de tempo recebem código e HTTP próprios.",
                  references: [
                    service,
                    code("backend/src/config/octoConfig.ts", "Configuração do timeout"),
                    serviceTests,
                  ],
                },
                {
                  id: "bounded-retries",
                  title: "Definir retentativas limitadas",
                  status: "planned",
                  description:
                    "A alpha não implementa uma política de retentativas com espera, teto de tentativas e respeito ao rate limit.",
                  references: [service],
                },
              ],
            },
            {
              id: "safe-errors",
              title: "Padronizar respostas de erro",
              status: "completed",
              description:
                "Distingue autenticação, permissão, repositório ausente, cota, timeout e falha de upstream. O controller devolve error.code e error.message sem detalhes internos.",
              references: [service, controller, controllerTests],
            },
          ],
        },
        {
          id: "client-budget",
          title: "Limitar chamadas por IP e proteger a documentação",
          status: "completed",
          description:
            "A API aplica 12 requisições por minuto por IP como padrão configurável. A documentação tem limite separado de 120 por minuto. Excesso retorna 429 e Retry-After; cache e limites permanecem locais ao processo.",
          references: [
            code("backend/src/app.ts", "Limitadores HTTP"),
            code("backend/src/config/octoConfig.ts", "Configuração e proxies confiáveis"),
            code("backend/src/routes/app.test.ts", "Testes HTTP de rate limit"),
          ],
        },
        {
          id: "cache-strategy",
          title: "Aplicar cache de curta duração",
          status: "completed",
          dependsOn: ["safe-errors"],
          description:
            "Cache em memória por cinco minutos, limitado a 500 cards, compartilhando consultas simultâneas iguais. Não é persistente ou compartilhado entre processos.",
          references: [service, serviceTests],
        },
      ],
    },
    {
      id: "quality",
      title: "Qualidade e integração",
      tasks: [
        {
          id: "automated-tests",
          title: "Construir uma suíte automatizada",
          status: "completed",
          description:
            "O comando npm test completo passou com cinco suítes e 33 testes no commit revisado: serviço, controller, HTTP, configuração e concorrência. A integração GitHub usa mocks; o resultado não certifica disponibilidade pública.",
          references: [code("backend/package.json", "Comando Jest"), serviceTests, controllerTests],
          subtasks: [
            {
              id: "service-tests",
              title: "Testar composição e fallbacks com mocks",
              status: "completed",
              dependsOn: ["card-contract"],
              description:
                "Casos cobrem composição, seleção de capa, bloqueio de privados, cache, README ausente, rate limit e timeout.",
              references: [serviceTests],
            },
            {
              id: "api-tests",
              title: "Testar validação e falhas HTTP",
              status: "completed",
              dependsOn: ["validate-repository", "safe-errors"],
              description:
                "Asserções verificam owner, entradas vazias ou repetidas e rejeição da coleção completa em caso de falha. Não comprovam uma implantação em produção.",
              references: [controllerTests],
            },
          ],
        },
        {
          id: "test-command",
          title: "Retirar o arquivo de testes vazio legado",
          status: "completed",
          description:
            "O commit 12ab4bc removeu o arquivo legado de zero bytes. A suíte completa publicada agora descobre os cinco arquivos de teste existentes e passa sem exclusões locais ou mudança de comando nesta revisão.",
          references: [
            {
              kind: "commit",
              label: "Remoção do arquivo vazio",
              url: `${repository}/commit/12ab4bcaa0b1dc2137dafa1da96e5cd787dfde94`,
            },
            code("backend/package.json", "Seleção de testes pelo Jest"),
          ],
        },
        {
          id: "compiled-production",
          title: "Compilar e verificar o servidor de produção",
          status: "completed",
          description:
            "O build compila TypeScript e copia os assets. O comando npm start usa JavaScript compilado; o smoke test verifica API headless, documentação, Swagger e validação de entrada.",
          references: [
            code("backend/package.json", "Build e start"),
            code("backend/scripts/smoke-build.js", "Smoke de produção"),
          ],
        },
        {
          id: "continuous-checks",
          title: "Executar CI e análise de código no GitHub",
          status: "completed",
          description:
            "Backend CI e CodeQL passaram no commit revisado. O pipeline cobre testes, tipos, smoke do build e audit de produção. Configurar Secret Scanning e Push Protection é uma pendência separada.",
          references: [
            code(".github/workflows/backend-ci.yml", "Workflow de backend"),
            code(".github/workflows/codeql.yml", "Workflow CodeQL"),
          ],
        },
        {
          id: "api-documentation",
          title: "Documentar a API e separar o playground",
          status: "completed",
          dependsOn: ["validate-repository"],
          description:
            "Guia, /docs/ e OpenAPI descrevem campos, parâmetros, erros e exemplos. PLAYGROUND_ENABLED permite executar só a API; o leitor de README e a cópia de JSON pertencem ao playground opcional.",
          references: [
            code("backend/public/GUIA_DO_OCTOCARDS.md", "Guia de uso"),
            code("backend/public/swagger.yaml", "OpenAPI"),
            code("backend/src/app.ts", "API e playground opcionais"),
          ],
        },
        {
          id: "portfolio-live",
          title: "Conectar uma instância publicada ao portfólio",
          status: "planned",
          dependsOn: ["api-tests", "cache-strategy"],
          description:
            "Nesta etapa o portfólio consulta o GitHub diretamente e mantém uma referência local. O adaptador do contrato OctoCards está preparado; ativar a API como fonte depende de uma URL publicada e da verificação dessa operação.",
        },
      ],
    },
    {
      id: "operational-backlog",
      title: "Pendências da auditoria",
      description:
        "Sete issues abertas no GitHub em 28/10/2026. O total do plano inclui essas pendências; não é uma porcentagem de prontidão para produção.",
      tasks: [
        {
          id: "global-github-budget",
          title: "Definir orçamento compartilhado de consultas ao GitHub",
          status: "planned",
          description:
            "O limite por IP e o cache são locais ao processo. Ainda falta um orçamento compartilhado para múltiplas instâncias e clientes.",
          references: [issue(8, "Issue #8 · orçamento compartilhado")],
        },
        {
          id: "global-batch-policy",
          title: "Decidir falha parcial e concorrência global de lotes",
          status: "planned",
          description:
            "O lote atual preserva ordem e falha por inteiro. Até três consultas por lote não limitam consultas de outros lotes.",
          references: [issue(9, "Issue #9 · política global de lotes")],
        },
        {
          id: "external-image-privacy",
          title: "Definir privacidade para imagens externas",
          status: "planned",
          description:
            "Imagens HTTPS de terceiros podem expor a conexão do visitante. A política de carregamento e privacidade continua pendente.",
          references: [issue(10, "Issue #10 · imagens externas")],
        },
        {
          id: "github-secret-scanning",
          title: "Confirmar Secret Scanning e Push Protection",
          status: "planned",
          description:
            "CodeQL aprovado não confirma a configuração dessas proteções do repositório. A verificação administrativa permanece aberta.",
          references: [issue(11, "Issue #11 · proteção de segredos")],
        },
        {
          id: "contract-sync",
          title: "Sincronizar TypeScript e OpenAPI",
          status: "planned",
          description:
            "O contrato é mantido em dois formatos. A semântica de description como README e a detecção de divergências em CI ainda exigem decisão.",
          references: [issue(12, "Issue #12 · contrato da API")],
        },
        {
          id: "manual-script",
          title: "Remover ou documentar o script manual com placeholders",
          status: "planned",
          description:
            "O script manual com nomes de exemplo não faz parte da suíte automatizada e ainda precisa de propósito e parâmetros definidos.",
          references: [issue(13, "Issue #13 · script manual")],
        },
        {
          id: "dev-advisory",
          title: "Acompanhar o advisory de desenvolvimento do deepmerge",
          status: "planned",
          description:
            "O audit completo registra sete alertas baixos na árvore de desenvolvimento do Jest. O audit de produção passou sem vulnerabilidades; a atualização transitiva segue acompanhada na issue.",
          references: [issue(14, "Issue #14 · advisory de desenvolvimento")],
        },
      ],
    },
  ],
};
