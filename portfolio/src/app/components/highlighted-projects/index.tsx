'use client';

import { useState, useEffect } from 'react';
import { FaGithub, FaExternalLinkAlt } from 'react-icons/fa';
import Image from 'next/image';

export default function HProjects() {
  const [lang, setLang] = useState<'pt' | 'en'>('pt');
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  useEffect(() => {
    const browserLang = navigator.language.slice(0, 2).toLowerCase();
    setLang(browserLang === 'en' ? 'en' : 'pt');
  }, []);

  const content = {
    pt: {
      title: 'Projetos em destaque',
      seeMore: 'Ver mais',
      seeLess: 'Mostrar menos',
      repo: 'Repositório',
      deploy: 'Deploy',
      projects: [
        {
          title: 'OctoCards',
          date: 'Mar 2024',
          description:
            "OctoCards é uma API que simplifica a criação de portfólios para desenvolvedores ao transformar dados brutos do GitHub em 'cards' estruturados e prontos para exibição. Com ela, é possível exibir automaticamente informações como descrição (README), linguagens, estrelas, forks e imagens.",
          link: 'https://github.com/SamuelBProenca/OctoCards',
          deploy:
            'https://portfolio-drino7ws7-sams-projects-c32da6ea.vercel.app/',
          image: '/assets/octocards.png',
        },
        {
          title: 'Automação de Processos com .BAT + C# + Logs',
          date: 'Fev 2024',
          description:
            'Desenvolvi uma ferramenta interna utilizando .BAT e C# que otimizou em até 4x a eficiência das minhas tarefas diárias. Mesmo sem acesso administrativo à rede, entreguei uma solução funcional, eficiente e segura. A geração de logs automáticos permite monitoramento, rastreabilidade e manutenção facilitada. Em andamento: integração com banco de dados e expansão de funcionalidades.',
          link: 'https://github.com/SamuelBProenca/network_monitoring',
          image: '/assets/octocards.png',
        },
      ],
    },
    en: {
      title: 'Featured Projects',
      seeMore: 'See more',
      seeLess: 'Show less',
      repo: 'Repository',
      deploy: 'Live Demo',
      projects: [
        {
          title: 'OctoCards',
          date: 'Mar 2024',
          description:
            "OctoCards is an API that simplifies portfolio creation for developers by transforming raw GitHub repository data into structured, display-ready 'cards'. It automatically showcases key details like description (README), languages, stars, forks, and preview images.",
          link: 'https://github.com/SamuelBProenca/OctoCards',
          deploy:
            'https://portfolio-drino7ws7-sams-projects-c32da6ea.vercel.app/',
          image: '/assets/octocards.png',
        },
        {
          title: 'Process Automation with .BAT + C# + Logs',
          date: 'Feb 2024',
          description:
            'I developed an internal tool using .BAT and C# that boosted daily task efficiency by up to 4x. Despite lacking administrative network access, I delivered a functional, secure, and efficient solution. Automatic log generation enables monitoring, traceability, and easier maintenance. In progress: database integration and feature expansion.',
          link: 'https://github.com/SamuelBProenca/network_monitoring',
          image: '/assets/octocards.png',
        },
      ],
    },
  };

  const { title, projects, seeMore, seeLess, repo, deploy } = content[lang];

  return (
    <section
      id="projects"
      className="mb-32 mt-40 px-4 md:px-0 overflow-x-hidden"
    >
      <h3 className="text-2xl font-semibold mb-10 border-b border-neutral-800 pb-2">
        {title}
      </h3>

      <div className="grid md:grid-cols-2 gap-8 mt-6">
        {projects.map((project, index) => (
          <div
            key={index}
            className="backdrop-blur-sm bg-white/5 border border-white/10 p-6 rounded-xl shadow-md hover:shadow-cyan-600/30 transition-all duration-300 overflow-hidden"
          >
            <p className="text-neutral-400 text-xs mb-3">{project.date}</p>

            <Image
              src={project.image}
              alt={`Imagem do projeto ${project.title}`}
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
              {expandedIndex === index ? seeLess : seeMore}
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
                  {repo}
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
                  {deploy}
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
