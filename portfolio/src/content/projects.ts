export type Project = {
  number: string;
  id?: string;
  title: string;
  technologies: string;
  description: string;
  status?: string;
  repository?: `https://github.com/${string}`;
  detailsHref?: `/projetos/${string}`;
  deployHref?: "/curriculumstudio";
};

export type SelectedProject = Omit<Project, "number" | "id"> & {
  id: string;
  summary: string;
  category: string;
  headline: string;
  visual: {
    kind: "terminal" | "api" | "patterns" | "curriculum" | "references" | "links" | "website";
    label: string;
    caption: string;
    lines: readonly string[];
    note?: string;
  };
};

// OctoCards reviewed on 2026-10-28; GreatMaker, LinkKeeper and IcarusRoc on 2026-10-26.
// Other public work reviewed on 2026-10-19; private product on 2026-10-23.
// See docs/PROJECT_SOURCES.md for evidence and publication limits.
export const catalogProjects = [
  {
    id: "curriculum",
    title: "Curriculum Studio",
    summary:
      "Relacione requisitos da vaga aos fatos do perfil e revise o conteúdo antes de gerar o PDF.",
    category: "Aplicação web · Currículos",
    headline: "Um currículo para cada vaga, sem inventar experiência.",
    technologies: "Python / Flask / ReportLab",
    status: "Implementação local verificada; acesso pelo portfólio",
    description:
      "O Curriculum Studio relaciona os requisitos da vaga aos fatos do perfil, identifica correspondências e lacunas e oferece revisão antes de gerar o currículo em PDF. O conteúdo das experiências é preservado. A página pública foi conferida nesta revisão; o fluxo de geração foi validado localmente na integração original.",
    deployHref: "/curriculumstudio",
    visual: {
      kind: "curriculum",
      label: "curriculum studio / produto",
      caption: "DO PERFIL AO PDF / ESQUEMA DO PRODUTO",
      lines: ["01 / Seu perfil", "02 / A oportunidade", "03 / Revisão e PDF"],
    },
  },
  {
    id: "greatmaker",
    title: "GreatMaker",
    summary: "Guarde links, imagens, códigos e ideias com notas, tags e decisões de design.",
    category: "Aplicação full-stack · M1 local",
    headline: "Referências de design reunidas em um só projeto.",
    status: "M1 implementado para uso local",
    technologies: "TypeScript / Next.js / React / SQLite / Zod",
    description:
      "O DesignRef reúne referências em uma sessão temporária, permite registrar o que preservar ou evitar, organizar um briefing e exportar as informações em JSON ou Markdown. O M1 funciona localmente com Next.js, TypeScript, SQLite e uploads privados, com testes de integração e de navegador documentados. A geração de interfaces por IA pertence ao planejamento futuro.",
    repository: "https://github.com/SamuelBProenca/GreatMaker",
    visual: {
      kind: "references",
      label: "greatmaker / designref",
      caption: "DESIGNREF M1 / CAPTURA REAL DA BIBLIOTECA",
      lines: [
        "Referências com origem",
        "Brief e escolhas explícitas",
        "Handoff em JSON e Markdown",
      ],
    },
  },
  {
    id: "octocards",
    detailsHref: "/projetos/octocards",
    title: "OctoCards",
    summary: "Consulte repositórios públicos e receba README, linguagens e metadados em JSON.",
    category: "API REST · Alpha",
    headline: "Dados do GitHub prontos para alimentar suas próprias interfaces.",
    status: "Alpha; sem instância pública confirmada",
    technologies: "TypeScript / Node.js / Express / API GitHub",
    description:
      "A API coleta informações públicas do GitHub e devolve JSON para portfólios e catálogos. Inclui cache em memória, lotes de até dez entradas, concorrência limitada por lote, cota por IP, OpenAPI e playground opcional. A suíte completa passou com 33 testes; build compilado e smoke HTTP também foram verificados. A operação de uma instância pública não foi confirmada.",
    repository: "https://github.com/SamuelBProenca/OctoCards",
    visual: {
      kind: "api",
      label: "octocards / api",
      caption: "DADOS QUE VIRAM INTERFACE",
      lines: [
        "01 / Repositórios do GitHub",
        "02 / Dados estruturados em JSON",
        "03 / A interface é sua",
      ],
    },
  },
  {
    id: "linkkeeper",
    title: "LinkKeeper",
    summary:
      "Um núcleo em C# com validação, registros SQLite e regras para expirar, arquivar e renovar links.",
    category: "Backend · Em desenvolvimento",
    headline: "Links classificados, com prazo e ciclo de vida.",
    status: "Núcleo e persistência implementados; produto em evolução",
    technologies: "C# / .NET 10 / SQLite / xUnit",
    description:
      "O núcleo do LinkKeeper define categorias, prazos e ciclo de vida dos links. A camada SQLite salva e consulta links por proprietário, além de regras para duplicatas e transições de estado. A CLI atual executa somente validação; API, autenticação e integrações externas continuam planejadas.",
    repository: "https://github.com/SamuelBProenca/LinkKeeper",
    visual: {
      kind: "links",
      label: "linkkeeper / storage",
      caption: "CICLO DO LINK / ESQUEMA DA CAMADA SQLITE",
      lines: [
        "URL + categoria + prazo",
        "SQLite / registros por proprietário",
        "Active → Expired / Archived",
      ],
      note: "CLI: validação / API: próxima etapa",
    },
  },
  {
    id: "icarusroc",
    title: "IcarusRoc",
    summary: "Uma interface para apresentar serviços e receber pedidos de orçamento.",
    category: "Landing page / Interface implementada",
    headline: "Serviços apresentados com contexto.",
    technologies: "TypeScript / Next.js / React / Tailwind CSS",
    description:
      "Landing page de serviços digitais com apresentação, processo de desenvolvimento, planos, perguntas frequentes e formulário de orçamento. O código organiza a interface em componentes Next.js e React com Tailwind CSS. O envio real do formulário e a operação pública não foram validados nesta revisão.",
    repository: "https://github.com/SamuelBProenca/IcarusRoc",
    visual: {
      kind: "website",
      label: "icarusroc / interface",
      caption: "INTERFACE DE SERVIÇOS / ESQUEMA",
      lines: ["Apresentação dos serviços", "Processo e planos", "Pedido de orçamento"],
      note: "Interface implementada / operação não validada",
    },
  },
  {
    id: "opscli",
    title: "OpsCLI",
    summary: "Verificações e logs em uma CLI. Proposta documentada.",
    category: "Automação operacional / Proposta documentada",
    headline: "Menos repetição. Mais organização.",
    technologies: "Batch / CLI / Logs",
    description:
      "Proposta de uma ferramenta modular em Batch para reunir verificações de dispositivos, checagens de conexão e geração de logs estruturados. O repositório público apresenta o escopo no README; o código da ferramenta ainda não está disponível nele.",
    repository: "https://github.com/SamuelBProenca/OpsCLI",
    visual: {
      kind: "terminal",
      label: "opscli / escopo",
      caption: "ROTINAS OPERACIONAIS",
      lines: [
        "Verificação de dispositivos",
        "Checagem de conexões",
        "Geração de logs estruturados",
      ],
    },
  },
  {
    id: "dojo",
    title: "Design Patterns Dojo",
    summary: "Padrões de projeto estudados na prática.",
    category: "Engenharia de software / Estudos",
    headline: "Entender o padrão. Exercitar a decisão.",
    technologies: "TypeScript / POO / Design Patterns",
    description:
      "Estudo prático de como distribuir responsabilidades e compor objetos em TypeScript. Reúne exercícios de Adapter, Builder, Decorator, Factory, Observer e Singleton, com desafios no README para exercitar as decisões por trás de cada padrão.",
    repository: "https://github.com/SamuelBProenca/DesignPatternsDojo",
    visual: {
      kind: "patterns",
      label: "design-patterns / dojo",
      caption: "UM PROBLEMA, DIFERENTES PADRÕES",
      lines: ["Adapter / interfaces", "Builder / construção", "Observer / comunicação"],
    },
  },
] satisfies readonly SelectedProject[];

// Commercial selection is explicit. Repository activity or stars never promote a project.
export const featuredProjectIds: readonly string[] = [
  "curriculum",
  "greatmaker",
  "octocards",
  "linkkeeper",
];
export function selectFeaturedProjects<T extends { id: string }>(catalog: readonly T[]): T[] {
  return featuredProjectIds.flatMap((id) => {
    const project = catalog.find((item) => item.id === id);
    return project ? [project] : [];
  });
}
export const selectedProjects = selectFeaturedProjects(catalogProjects);
export const projects: readonly Project[] = catalogProjects.map((project, index) => ({
  number: String(index + 1).padStart(2, "0"),
  ...project,
}));
