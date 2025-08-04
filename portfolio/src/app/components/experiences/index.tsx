"use client";
import { useEffect, useState } from "react";

export default function Experiences() {
    const [lang, setLang] = useState<"pt" | "en">("pt");

    useEffect(() => {
        const browserLang = navigator.language.slice(0, 2).toLowerCase();
        setLang(browserLang === "en" ? "en" : "pt");
    }, []);

    const content = {
        pt: {
            title: "Experiências",
            items: [
                {
                    period: "Jun 2025 - Presente",
                    title: "Suporte Técnico - Viação Jundiaiense",
                    description: `
            Atuo como suporte de TI em empresa de transportes. Desenvolvi scripts e automações em Bash Script e C#, otimizando rotinas internas em até 4 vezes.
            Criei ferramentas com geração de logs e integração planejada com banco de dados.
            Dou suporte a sistemas embarcados, realizando diagnósticos e comunicação via antenas e dispositivos conectados.
          `,
                    technologies: ["Bash", "C#", "Banco de Dados", "Redes", "Logs"],
                },
                {
                    period: "Jun 2018 - Dez 2019",
                    title: "Engenheiro de Software - icarusRoc",
                    description: `
            Desenvolvimento de soluções completas em backend e frontend com PHP, JavaScript e ferramentas NoCode.
            - Criação de sites e plataformas visuais e funcionais, baseadas nos designs dos clientes.
            - Colaboração com equipe de design e desenvolvimento para garantir entrega de alta qualidade.
            - Integração de APIs e serviços para ampliar funcionalidades e usabilidade.
          `,
                    technologies: ["PHP", "JavaScript", "HTML", "CSS", "NoCode"],
                },
            ],
        },
        en: {
            title: "Experiences",
            items: [
                {
                    period: "Jun 2025 - Present",
                    title: "Technical Support - Viação Jundiaiense",
                    description: `
            Working in IT support at a transport company. I developed scripts and automations using Bash Script and C#, optimizing daily routines by up to 4x.
            Created internal tools with log generation and planned database integration.
            I provide support for embedded systems, handling diagnostics and communication via antennas and connected devices.
          `,
                    technologies: ["Bash", "C#", "Database", "Networking", "Logging"],
                },
                {
                    period: "Jun 2024 - Present",
                    title: "Software Engineer - icarusRoc",
                    description: `
            Full-stack development using PHP, JavaScript, HTML, CSS, and NoCode tools.
            - Built visual and functional websites and platforms based on client design specs.
            - Worked closely with design and dev teams to ensure seamless project delivery.
            - Integrated APIs and external services to enhance user experience and functionality.
          `,
                    technologies: ["PHP", "JavaScript", "HTML", "CSS", "NoCode"],
                },
                {
                    period: "Fev 2024 - Dez 2024",
                    title: navigator.language.startsWith("en")
                        ? "Volunteer Programming Logic Mentor"
                        : "Mentor Voluntário de Lógica de Programação",
                    description: navigator.language.startsWith("en")
                        ? `
      Provided private volunteer lessons in programming logic and algorithms to students interested in starting their tech journey.
      Focused on building a solid foundation in logical reasoning and problem-solving, with weekly exercises and personalized support.
      Many students went on to pursue further studies in languages such as JavaScript and Python after this introductory course.
    `
                        : `
      Ministrei aulas particulares voluntárias de lógica de programação e algoritmos para estudantes interessados em iniciar na área de tecnologia.
      Foquei em construir uma base sólida de raciocínio lógico e resolução de problemas, com acompanhamento personalizado e exercícios práticos semanais.
      Muitos dos alunos seguiram para estudos em linguagens como JavaScript e Python após o curso introdutório.
    `,
                    technologies: ["Lógica", "Algoritmos", "JavaScript (básico)", "Python (básico)"],
                }


            ],
        },
    };

    const { title, items } = content[lang];

    return (
        <section id="experiences" className="mb-32">
            <h3 className="text-2xl font-semibold mb-10 border-b border-neutral-800 pb-2">
                {title}
            </h3>

            <ul className="space-y-6">
                {items.map((exp, index) => (
                    <li key={index} className="bg-neutral-900 p-6 rounded-lg shadow-md">
                        <div className="flex flex-col md:flex-row md:items-start md:gap-16">
                            <p className="text-sm text-neutral-400 md:w-40">{exp.period}</p>
                            <div className="md:flex-1">
                                <h4 className="text-lg font-semibold text-cyan-500">{exp.title}</h4>
                                <p className="mt-4 whitespace-pre-line leading-relaxed text-neutral-300">
                                    {exp.description.trim()}
                                </p>
                                <div className="mt-4">
                                    <span className="text-sm text-neutral-400">Tecnologias: </span>
                                    <span className="text-sm text-cyan-400">
                                        {exp.technologies.join(", ")}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        </section>
    );
}
