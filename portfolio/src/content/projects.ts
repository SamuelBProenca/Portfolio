export type Project = {
  number: string;
  id?: string;
  title: string;
  technologies: string;
  description: string;
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
    kind: "terminal" | "api" | "patterns" | "curriculum";
    label: string;
    caption: string;
    lines: readonly string[];
  };
};

// Public repository evidence reviewed on 2026-10-19; private product on 2026-10-23.
// See docs/PROJECT_SOURCES.md for evidence and publication limits.
export const selectedProjects = [
  {
    id: "curriculum",
    title: "Curriculum Studio",
    summary: "Perfil e vaga, conectados por evidências reais.",
    category: "Produto web / Currículos e evidências",
    headline: "Da vaga ao currículo. Com evidências.",
    technologies: "Python / Flask / ReportLab / Redis opcional",
    description:
      "O desafio é adaptar um currículo a cada oportunidade sem inventar competências. O Curriculum Studio relaciona os requisitos da vaga aos fatos do perfil, mostra evidências e lacunas e gera o PDF após a revisão. Os dados são processados em memória e os textos das experiências são preservados.",
    deployHref: "/curriculumstudio",
    visual: {
      kind: "curriculum",
      label: "curriculum studio / produto",
      caption: "DO PERFIL AO PDF / ESQUEMA DO PRODUTO",
      lines: ["01 / Seu perfil", "02 / A oportunidade", "03 / Revisão e PDF"],
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
    id: "octocards",
    detailsHref: "/projetos/octocards",
    title: "OctoCards",
    summary: "Repositórios do GitHub, organizados em cards.",
    category: "Backend / Integração com GitHub",
    headline: "Do repositório para o portfólio.",
    technologies: "TypeScript / Node.js / Express / API GitHub",
    description:
      "API que reúne dados de repositórios do GitHub para montar cards de portfólio, com consultas individuais ou em lote. O backend TypeScript com Express separa rotas, controllers, serviços e tipos para organizar a integração e sua evolução.",
    repository: "https://github.com/SamuelBProenca/OctoCards",
    visual: {
      kind: "api",
      label: "octocards / api",
      caption: "DADOS QUE VIRAM INTERFACE",
      lines: [
        "01 / Repositórios do GitHub",
        "02 / Dados estruturados em JSON",
        "03 / Cards para o portfólio",
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

export const projects: readonly Project[] = selectedProjects.map((project, index) => ({
  number: String(index + 1).padStart(2, "0"),
  ...project,
}));
