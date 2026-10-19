import type { ProjectPlan, ProjectReference } from "@/types/project-progress";

const repository = "https://github.com/SamuelBProenca/OctoCards" as const;
const snapshotSha = "55bc8e8c9c01a193df87f57d631c7071fccfc7fc";
function code(path: string, label: string): ProjectReference {
  return { kind: "code", label, url: `${repository}/blob/${snapshotSha}/${path}` };
}

export const octocardsPlan: ProjectPlan = {
  id: "octocards",
  title: "OctoCards",
  repository,
  snapshotSha,
  reviewedAt: "2026-10-19",
  description:
    "Uma API para transformar repositórios do GitHub em dados para cards. Este plano distingue a base já implementada dos próximos passos propostos.",
  groups: [
    {
      id: "foundation",
      title: "Base implementada",
      description:
        "Recursos identificados no código público. Não representa uma validação de produção.",
      tasks: [
        {
          id: "card-contract",
          title: "Consultar o GitHub e compor os cards",
          status: "completed",
          description:
            "O serviço reúne metadados, README, linguagens e imagem em um objeto tipado para apresentação.",
          references: [
            code("backend/src/services/gitCardService.ts", "Serviço de cards"),
            code("backend/src/types/gitCardType.ts", "Contrato PropsGitCard"),
          ],
        },
        {
          id: "card-endpoints",
          title: "Expor consultas individuais e em lote",
          status: "completed",
          dependsOn: ["card-contract"],
          description:
            "As rotas e controllers expõem /api/cards/:repo e /api/cards?repos=...; o utilitário executa consultas em paralelo e remove resultados nulos.",
          references: [
            code("backend/src/routes/gitCardRoutes.ts", "Rotas da API"),
            code("backend/src/utils/getRepos.ts", "Consulta em lote"),
          ],
        },
        {
          id: "default-values",
          title: "Definir valores de fallback para os cards",
          status: "completed",
          dependsOn: ["card-contract"],
          description:
            "Há valores padrão para descrição, linguagens e imagem ausentes. A PR #5 foi integrada; isto não comprova cobertura de testes desses cenários.",
          references: [
            { kind: "pull-request", label: "PR #5 · valores padrão", url: `${repository}/pull/5` },
            { kind: "commit", label: "Commit 55bc8e8", url: `${repository}/commit/${snapshotSha}` },
          ],
        },
      ],
    },
    {
      id: "reliability",
      title: "Confiabilidade e limites",
      description:
        "Propostas após a leitura do serviço e dos controllers; ainda não implementadas nesta revisão.",
      tasks: [
        {
          id: "request-validation",
          title: "Validar entradas da API",
          status: "planned",
          description:
            "A consulta em lote verifica a presença de repos e divide a string. Falta definir um contrato de validação e alinhar o owner documentado com o owner usado no controller.",
          dependsOn: ["card-endpoints"],
          references: [code("backend/src/controllers/gitCardController.ts", "Controller atual")],
          subtasks: [
            {
              id: "validate-repository",
              title: "Validar owner e nomes de repositórios",
              status: "planned",
              description:
                "Rejeitar valores vazios ou formatos inválidos e documentar o comportamento do owner.",
            },
            {
              id: "batch-limits",
              title: "Limitar o tamanho dos lotes",
              status: "planned",
              description:
                "Definir limites, remover duplicatas e controlar a concorrência nas chamadas ao GitHub.",
            },
          ],
        },
        {
          id: "http-reliability",
          title: "Tratar falhas da integração com GitHub",
          status: "planned",
          dependsOn: ["card-contract"],
          description:
            "O serviço atual captura erros e devolve null. Diferenciar falhas permite orientar o consumidor sem expor detalhes internos.",
          references: [code("backend/src/services/gitCardService.ts", "Integração atual")],
          subtasks: [
            {
              id: "timeout-retries",
              title: "Definir timeout e retentativas limitadas",
              status: "planned",
              description:
                "Tratar indisponibilidade e limites do GitHub com uma política de tentativas explícita.",
            },
            {
              id: "safe-errors",
              title: "Padronizar respostas de erro",
              status: "planned",
              description:
                "Separar repositório inexistente, falha de upstream e limite de requisições; evitar interpolar o erro bruto no retorno HTTP.",
            },
          ],
        },
        {
          id: "cache-strategy",
          title: "Definir estratégia de cache",
          status: "planned",
          dependsOn: ["http-reliability"],
          description:
            "Avaliar TTL, invalidação e respostas antigas em caso de falha. Nenhum ganho de desempenho foi medido ou atribuído a esta proposta.",
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
            "O arquivo gitCardService.test.ts está vazio e o script test do package.json é um placeholder. O script test:repos faz uma consulta manual e não substitui testes com asserções.",
          references: [
            code("backend/src/tests/gitCardService.test.ts", "Arquivo de teste atual"),
            code("backend/package.json", "Scripts atuais"),
          ],
          subtasks: [
            {
              id: "service-tests",
              title: "Testar composição e fallbacks com mocks",
              status: "planned",
              dependsOn: ["card-contract"],
              description:
                "Cobrir README ausente, linguagens vazias e seleção de imagem sem depender de chamadas reais ao GitHub.",
            },
            {
              id: "api-tests",
              title: "Testar validação e falhas HTTP",
              status: "planned",
              dependsOn: ["request-validation", "http-reliability"],
              description:
                "Verificar entradas inválidas, lotes, timeout e respostas de erro consistentes.",
            },
          ],
        },
        {
          id: "api-documentation",
          title: "Alinhar documentação e comportamento",
          status: "planned",
          dependsOn: ["request-validation"],
          description:
            "Revisar exemplos de owner, limites e respostas; publicar um contrato de API verificável.",
          references: [
            {
              kind: "documentation",
              label: "README revisado",
              url: `${repository}/blob/${snapshotSha}/README.md`,
            },
          ],
        },
        {
          id: "portfolio-live",
          title: "Consumir a API no portfólio",
          status: "planned",
          dependsOn: ["api-tests", "cache-strategy"],
          description:
            "A seleção de projetos deste portfólio ainda usa conteúdo local revisado. A integração com a API OctoCards depende de limites, falhas e cache definidos.",
        },
      ],
    },
  ],
};
