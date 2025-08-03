"use client";

export default function Experiences() {
  const experiences = [
    {
      title: "Desenvolvedor Full Stack - Empresa XYZ",
      period: "Jan 2020 - Presente",
      description:
        "Desenvolvimento de aplicações web utilizando Next.js e Node.js, com foco em performance e escalabilidade.",
    },
    {
      title: "Engenheiro de Software - Empresa icarusRoc",
      period: "Jun 2018 - Dez 2019",
      description:
        "Implementação de soluções de backend em PHP e automação de processos com scripts em Shell.",
    },
  ];

  return (
    <section id="experiences" className="mb-20">
      <h3 className="text-2xl font-semibold mb-6 border-b border-neutral-800 pb-2">
        Experiências
      </h3>
      <ul className="space-y-4">
        {experiences.map((exp, index) => (
          <li key={index} className="bg-neutral-900 p-4 rounded-lg">
            <h4 className="text-lg font-semibold">{exp.title}</h4>
            <p className="text-sm text-neutral-400">{exp.period}</p>
            <p className="mt-2">{exp.description}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
