'use client';

import { useState } from 'react';
import { FaGithub, FaExternalLinkAlt } from 'react-icons/fa';
import Image from 'next/image';

export default function HProjects() {
    const projects = [
        {
            title: 'OctoCards',
            date: 'Mar 2024',
            description:
                "OctoCards is an API that simplifies the creation of portfolios for developers by transforming raw data from GitHub repositories into structured and display-ready 'cards'. With it, you can automatically showcase relevant information—such as description (README), languages, stars, forks, and images.",
            link: 'https://github.com/SamuelBProenca/OctoCards',
            deploy: 'https://portfolio-drino7ws7-sams-projects-c32da6ea.vercel.app/',
            image: '/public/assets/VectorLogoPortfolioDark.svg',
        },
        {
            title: 'Automação de Processos com .BAT + C# + Logs',
            date: 'Fev 2024',
            description:
                'Desenvolvi uma ferramenta interna utilizando .BAT e C# que otimizou em até 4x a eficiência das minhas tarefas diárias. Mesmo sem acesso administrativo à rede, entreguei uma solução funcional, eficiente e segura. A geração de logs automáticos permite monitoramento, rastreabilidade e manutenção facilitada. Em andamento: integração com banco de dados e expansão de funcionalidades.',
            link: 'https://github.com/SamuelBProenca/network_monitoring',
            image: '/public/assets/VectorLogoPortfolioDark.svg',

        },
    ];

    const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

    return (
        <section id="projects" className="mb-20 mt-40">
            <h3 className="text-2xl font-semibold mb-6 border-b border-neutral-800 pb-2">
                Projetos em destaque
            </h3>

            <div className="grid md:grid-cols-2 gap-8 mt-4">
                {projects.map((project, index) => (
                    <div
                        key={index}
                        className="bg-neutral-900 p-6 rounded-xl shadow-md hover:shadow-cyan-600/30 transition relative"
                    >
                        <p className="text-neutral-500 text-xs mb-2">{project.date}</p>

                        <Image
                            src="/assets/octocards.png"
                            alt={`Imagem ilustrativa do projeto ${project.title}`}
                            width={400}
                            height={160}
                            className="w-full h-40 object-cover mb-4 rounded-lg"
                        />


                        <h4 className="text-xl font-semibold mb-2">{project.title}</h4>

                        <p className="text-neutral-400 text-sm">
                            {expandedIndex === index
                                ? project.description
                                : `${project.description.slice(0, 180)}...`}
                        </p>

                        <button
                            onClick={() =>
                                setExpandedIndex(expandedIndex === index ? null : index)
                            }
                            className="text-cyan-400 hover:underline mt-2 text-sm"
                        >
                            {expandedIndex === index ? 'Mostrar menos' : 'Ver mais'}
                        </button>

                        <div className="mt-4 flex flex-wrap items-center gap-4">
                            <a
                                href={project.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-neutral-300 flex items-center text-sm hover:text-cyan-400 transition"
                            >
                                <FaGithub className="mr-2" />
                                Repositório
                            </a>

                            {project.deploy && (
                                <a
                                    href={project.deploy}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-neutral-300 flex items-center text-sm hover:text-green-400 transition"
                                >
                                    <FaExternalLinkAlt className="mr-2" />
                                    Deploy
                                </a>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
