'use client';

import { useState } from 'react';
import { FaGithub, FaExternalLinkAlt } from 'react-icons/fa';
import Image from 'next/image';

export default function Projects() {
    const projects = [
        {
            title: 'OctoCards',
            date: 'Mar 2024',
            description:
                "OctoCards is an API that simplifies the creation of portfolios for developers by transforming raw GitHub data into display-ready 'cards'. It automatically showcases info like README, languages, stars, forks, and images.",
            link: 'https://github.com/SamuelBProenca/OctoCards',
            deploy:
                'https://portfolio-drino7ws7-sams-projects-c32da6ea.vercel.app/',
            image: '/assets/octocards.png',
        },
        {
            title: 'Automação de Processos com .BAT + C# + Logs',
            date: 'Fev 2024',
            description:
                'Ferramenta interna para automação de tarefas com .BAT e C#, aumentando eficiência em até 4x. Sem acesso admin à rede, inclui geração automática de logs e expansão futura com banco de dados.',
            link: 'https://github.com/SamuelBProenca/network_monitoring',
            image: '/assets/octocards.png',
        },
        {
            title: 'Gerador de Currículos Personalizados',
            date: '2025',
            description: 'Aplicação dinâmica para gerar currículos em PDF adaptados a vagas específicas. Inclui validação de dados, casamento de requisitos e exportação estilizada. Desenvolvido com foco em modularidade, SOLID e usabilidade.',
            link: 'https://github.com/SamuelBProenca/resume-generator', // se houver
            image: '/assets/curriculo.png',
        },
        {
            title: 'Design Patterns Dojo',
            date: '2025',
            description: 'Repositório com implementações dos 23 principais Design Patterns. Código didático, comentado, e com exemplos práticos. Ideal para estudo e referência.',
            link: 'https://github.com/SamuelBProenca/design-patterns-dojo',
            image: '/assets/designpatterns.png',
        },
        {
            title: 'Ebook: Fundamentos da Programação',
            date: '2025 (em andamento)',
            description: 'Ebook que explora os fundamentos da programação com exemplos práticos e funções que replicam comportamentos nativos, como lógica condicional sem `if`, e uso de funções lambda.',
            link: 'https://github.com/SamuelBProenca/programming-foundations-ebook',
            image: '/assets/ebook.png',
        },
        {
            title: 'Plataforma de Cursos Híbrida',
            date: '2025',
            description: 'Desenvolvida com stack híbrida (No-code + code), integra áreas de vídeo, materiais, progressão de usuários e dashboards. Inclui backend customizado e integrações com Airtable.',
            link: '',
            image: '/assets/curso.png',
        }, {
            title: 'Scripts de Diagnóstico de Rede',
            date: '2024',
            description: 'Scripts automáticos em .BAT e C# para diagnóstico, monitoramento e automação de tarefas de rede corporativa. Inclui geração de logs, alertas, e ferramentas CLI customizadas.',
            link: 'https://github.com/SamuelBProenca/network_monitoring',
            image: '/assets/network.png',
        }





        // Outros projetos reais virão aqui
    ];

    const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

    return (
        <section id="projects" className="mb-32 mt-40">
            <h3 className="text-2xl font-semibold mb-10 border-b border-neutral-800 pb-2">
                Projetos em destaque
            </h3>

            <div className="grid md:grid-cols-2 gap-10 mt-6">
                {projects.map((project, index) => (
                    <div
                        key={index}
                        className="bg-neutral-900 p-6 rounded-xl shadow-md hover:shadow-cyan-600/30 transition"
                    >
                        <p className="text-neutral-500 text-xs mb-3">{project.date}</p>

                        <Image
                            src={project.image}
                            alt={`Imagem ilustrativa do projeto ${project.title}`}
                            width={400}
                            height={160}
                            className="w-full h-40 object-cover mb-5 rounded-lg"
                        />

                        <h4 className="text-xl font-semibold mb-3">{project.title}</h4>

                        <p className="text-neutral-400 text-sm leading-relaxed">
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
                            {expandedIndex === index ? 'Mostrar menos' : 'Ver mais'}
                        </button>

                        <div className="mt-5 flex flex-wrap items-center gap-4">
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
