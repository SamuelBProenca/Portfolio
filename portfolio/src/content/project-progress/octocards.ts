import type { ProjectPlan, ProjectReference } from "@/types/project-progress";

const repository = "https://github.com/SamuelBProenca/OctoCards" as const;
const snapshotSha = "6f9ec4bb8d0ebe6f7ac5c59bcd17bcfe86cd85c9";
function code(path: string, label: string): ProjectReference {
  return { kind: "code", label, url: `${repository}/blob/${snapshotSha}/${path}` };
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
  reviewedAt: "2026-10-26",
  description:
    "API em alpha para coletar dados públicos do GitHub e alimentar interfaces próprias. A versão atual inclui cache, seleção de capas, playground opcional e documentação de uso; o plano separa essa implementação dos próximos passos de operação.",
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
        "Cache e falhas já têm tratamento. Limites de lote e retentativas continuam como propostas.",
      tasks: [
        {
          id: "request-validation",
          title: "Validar entradas da API",
          status: "planned",
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
              status: "planned",
              description:
                "Ainda faltam teto de itens, remoção de duplicatas e uma política explícita de concorrência. A coleta atual percorre os itens em sequência.",
              references: [code("backend/src/utils/getRepos.ts", "Comportamento atual dos lotes")],
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
          status: "planned",
          description:
            "Os 12 casos do serviço e do controller passaram na revisão. O comando npm test ainda falha porque também encontra o arquivo vazio legado em src/tests.",
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
          status: "planned",
          description:
            "O comando Jest inclui src/tests/gitCardService.test.ts, que está vazio e faz a execução completa falhar. Os 12 casos dos outros dois arquivos passam; a correção do comando ou do arquivo continua pendente no OctoCards.",
          references: [
            code("backend/src/tests/gitCardService.test.ts", "Arquivo legado vazio"),
            code("backend/package.json", "Seleção de testes pelo Jest"),
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
            code("backend/src/index.ts", "API e playground opcionais"),
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
  ],
};
