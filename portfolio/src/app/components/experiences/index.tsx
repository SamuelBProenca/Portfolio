"use client";

export default function Experiences() {
    const experiences = [
        {
            period: "Jun 2025 - Presente",
            title: "Suporte Tecnico - Empresa Viação Jundiaiense",
            description: `
                Suporte de TI em empresa de transportes Jundiense . Fui Responsável pelo desenvolvimento de scripts e automações em Bash Script e C#, otimizando rotinas diárias em até 4 vezes. 
                Criei uma ferramenta interna com geração de logs e integração planejada com banco de dados. 
                Atuação no suporte a sistemas embarcados, com diagnóstico e comunicação via antenas e dispositivos conectados.
            `,
            technologies: ["PHP", "JavaScript", "HTML", "CSS", "NoCode"],
        },
        {
            period: "Jun 2018 - Dez 2019",
            title: "Engenheiro de Software - icarusRoc",
            description: `
                Desenvolvimento de soluções de backend e frontend utilizando PHP, JavaScript, HTML e CSS e ferramentas NoCode. 
                - Criação de sites e plataformas interativas e visualmente agradáveis seguindo designs apresentados pelos clientes.
                - Colaboração com equipes de design e desenvolvimento para garantir a funcionalidade e a estética dos projetos.
                - Implementação de soluções de backend para suportar as funcionalidades dos sites e plataformas.
                - Integração de APIs e serviços externos para melhorar a funcionalidade e a experiência do usuário.
            `,
            technologies: ["PHP", "JavaScript", "HTML", "CSS", "NoCode"],
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
                        <div className="flex flex-col md:flex-row md:items-start md:gap-16">
                            <p className="text-sm text-neutral-400 md:w-40">{exp.period}</p>
                            <div className="md:flex-1">
                                <h4 className="text-lg font-semibold text-cyan-500">{exp.title}</h4>
                                <p className="mt-2 whitespace-pre-line">{exp.description.trim()}</p>
                                <div className="mt-2">
                                    <span className="text-sm text-neutral-400">Tecnologias: </span>
                                    <span className="text-sm text-cyan-500">{exp.technologies.join(", ")}</span>
                                </div>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        </section>
    );
}
