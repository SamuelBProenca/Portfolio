export type WritingCollection = {
  id: string;
  category: string;
  title: string;
  description: string;
};

export const writingCollections = [
  {
    id: "engenharia",
    category: "01 / Artigos técnicos",
    title: "Engenharia e prática",
    description: "Implementações, arquitetura, testes, automações e retrospectivas técnicas.",
  },
  {
    id: "ensaios",
    category: "02 / Ideias",
    title: "Ensaios e hipóteses",
    description: "Reflexões e conjecturas apresentadas como tal, com fontes quando necessário.",
  },
] satisfies WritingCollection[];
