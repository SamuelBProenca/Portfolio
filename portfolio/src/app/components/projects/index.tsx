"use client";

import { useState, useEffect } from "react";
import { FaGithub, FaExternalLinkAlt } from "react-icons/fa";
import Image from "next/image";

export default function Projects() {
  const projectsPT = [
    {
      title: "OctoCards",
      date: "Mar 2024",
      description:
        "OctoCards é uma API que simplifica a criação de portfólios para desenvolvedores transformando dados brutos do GitHub em 'cards' prontos para exibição. Mostra automaticamente README, linguagens, estrelas, forks e imagens.",
      link: "https://github.com/SamuelBProenca/OctoCards",
      deploy:
        "https://portfolio-drino7ws7-sams-projects-c32da6ea.vercel.app/",
      Image: "/assets/OctoCards.png",
    },
    {
      title: "Automação de Processos com .BAT + C# + Logs",
      date: "Fev 2024",
      description:
        "Ferramenta interna para automação de tarefas com .BAT e C#, aumentando eficiência em até 4x. Sem acesso admin à rede, inclui geração automática de logs e expansão futura com banco de dados.",
      link: "https://github.com/SamuelBProenca/network_monitoring",
      Image: "/assets/Automation.png",
    },
    {
      title: "Gerador de Currículos Personalizados",
      date: "2025",
      description:
        "Aplicação dinâmica para gerar currículos em PDF adaptados a vagas específicas. Inclui validação de dados, casamento de requisitos e exportação estilizada. Desenvolvido com foco em modularidade, SOLID e usabilidade.",
      link: "https://github.com/SamuelBProenca/resume-generator",
      Image: "/assets/CurriculumService.png",
    },
    {
      title: "Design Patterns Dojo",
      date: "2025",
      description:
        "Repositório com implementações dos 23 principais Design Patterns. Código didático, comentado, e com exemplos práticos. Ideal para estudo e referência.",
      link: "https://github.com/SamuelBProenca/design-patterns-dojo",
      Image: "/assets/DesignPatternsDojo.png",
    },
    {
      title: "Ebook: Fundamentos da Programação",
      date: "2025 (em andamento)",
      description:
        "Ebook que explora os fundamentos da programação com exemplos práticos e funções que replicam comportamentos nativos, como lógica condicional sem `if`, e uso de funções lambda.",
      link: "https://github.com/SamuelBProenca/programming-foundations-ebook",
      Image: "/assets/Ebook.png",
    },
    {
      title: "Plataforma de Cursos Híbrida",
      date: "2025",
      description:
        "Desenvolvida com stack híbrida (No-code + code), integra áreas de vídeo, materiais, progressão de usuários e dashboards. Inclui backend customizado e integrações com Airtable.",
      link: "",
      Image: "/assets/Sites.png",
    },
    {
      title: "Scripts de Diagnóstico de Rede",
      date: "2024",
      description:
        "Scripts automáticos em .BAT e C# para diagnóstico, monitoramento e automação de tarefas de rede corporativa. Inclui geração de logs, alertas, e ferramentas CLI customizadas.",
      link: "https://github.com/SamuelBProenca/network_monitoring",
      Image: "/assets/NotasFiscaisPHP.png",
    },
  ];

  const projectsEN = [
    {
      title: "OctoCards",
      date: "Mar 2024",
      description:
        "OctoCards is an API that simplifies creating developer portfolios by turning raw GitHub data into ready-to-display 'cards'. It automatically shows README, languages, stars, forks, and images.",
      link: "https://github.com/SamuelBProenca/OctoCards",
      deploy:
        "https://portfolio-drino7ws7-sams-projects-c32da6ea.vercel.app/",
      Image: "/assets/OctoCards.png",
    },
    {
      title: "Process Automation with .BAT + C# + Logs",
      date: "Feb 2024",
      description:
        "Internal tool for automating tasks with .BAT and C#, increasing efficiency up to 4x. Works without admin access to the network, includes automatic log generation, and future expansion with a database.",
      link: "https://github.com/SamuelBProenca/network_monitoring",
      Image: "/assets/Automation.png",
    },
    {
      title: "Custom Resume Generator",
      date: "2025",
      description:
        "Dynamic application to generate PDF resumes tailored to specific job openings. Includes data validation, requirement matching, and styled export. Built with a focus on modularity, SOLID, and usability.",
      link: "https://github.com/SamuelBProenca/resume-generator",
      Image: "/assets/CurriculumService.png",
    },
    {
      title: "Design Patterns Dojo",
      date: "2025",
      description:
        "Repository with implementations of the 23 main Design Patterns. Educational, commented code with practical examples. Perfect for study and reference.",
      link: "https://github.com/SamuelBProenca/design-patterns-dojo",
      Image: "/assets/DesignPatternsDojo.png",
    },
    {
      title: "Ebook: Programming Foundations",
      date: "2025 (in progress)",
      description:
        "Ebook exploring programming fundamentals with practical examples and functions replicating native behavior, like conditional logic without `if` and the use of lambda functions.",
      link: "https://github.com/SamuelBProenca/programming-foundations-ebook",
      Image: "/assets/Ebook.png",
    },
    {
      title: "Hybrid Course Platform",
      date: "2025",
      description:
        "Built with a hybrid stack (No-code + code), it integrates video areas, materials, user progress, and dashboards. Includes a custom backend and integrations with Airtable.",
      link: "",
      Image: "/assets/Sites.png",
    },
    {
      title: "Network Diagnostic Scripts",
      date: "2024",
      description:
        "Automated .BAT and C# scripts for diagnosing, monitoring, and automating corporate network tasks. Includes log generation, alerts, and custom CLI tools.",
      link: "https://github.com/SamuelBProenca/network_monitoring",
      Image: "/assets/NotasFiscaisPHP.png",
    },
  ];

  const [lang, setLang] = useState<"pt" | "en">("pt");
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  useEffect(() => {
    const browserLang = navigator.language || navigator.languages?.[0] || "pt";
    setLang(browserLang.startsWith("pt") ? "pt" : "en");
  }, []);

  const projects = lang === "pt" ? projectsPT : projectsEN;

  return (
    <section
      id="projects"
      className="mb-32 mt-40 px-4 md:px-0 overflow-x-hidden"
    >
      <h3 className="text-2xl font-semibold mb-10 border-b border-neutral-800 pb-2">
        {lang === "pt" ? "Projetos" : "Projects"}
      </h3>

      <div className="grid md:grid-cols-2 gap-10 mt-6">
        {projects.map((project, index) => (
          <div
            key={index}
            className="backdrop-blur-sm bg-white/5 border border-white/10 p-6 rounded-xl shadow-md hover:shadow-cyan-600/30 transition-all duration-300 overflow-hidden"
          >
            <p className="text-neutral-400 text-xs mb-3">{project.date}</p>

            <Image
              src={project.Image}
              alt={`Imagem ilustrativa do projeto ${project.title}`}
              width={400}
              height={160}
              className="w-full h-40 object-cover mb-5 rounded-lg"
            />

            <h4 className="text-xl font-semibold mb-3 text-white">
              {project.title}
            </h4>

            <p className="text-neutral-300 text-sm leading-relaxed">
              {expandedIndex === index
                ? project.description
                : `${project.description.slice(0, 180)}...`}
            </p>

            <button
              onClick={() =>
                setExpandedIndex(expandedIndex === index ? null : index)
              }
              className="text-cyan-400 hover:underline mt-3 text-sm"
            >
              {expandedIndex === index
                ? lang === "pt"
                  ? "Mostrar menos"
                  : "Show less"
                : lang === "pt"
                ? "Ver mais"
                : "Read more"}
            </button>

            <div className="mt-5 flex flex-wrap items-center gap-4">
              {project.link && (
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-neutral-300 flex items-center text-sm hover:text-cyan-400 transition"
                >
                  <FaGithub className="mr-2" />
                  {lang === "pt" ? "Repositório" : "Repository"}
                </a>
              )}

              {project.deploy && (
                <a
                  href={project.deploy}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-neutral-300 flex items-center text-sm hover:text-green-400 transition"
                >
                  <FaExternalLinkAlt className="mr-2" />
                  {lang === "pt" ? "Deploy" : "Live Demo"}
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
