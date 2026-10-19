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
    title: "Engenharia & prática",
    description:
      "Relatos verificáveis, estudos de caso, arquitetura, automações e análises técnicas. Fontes e limitações claras.",
  },
  {
    id: "ensaios",
    category: "02 / Ideias",
    title: "Ensaios & hipóteses",
    description:
      "Reflexões, perguntas e especulações apresentadas sem confundi-las com fatos demonstrados.",
  },
] satisfies WritingCollection[];
