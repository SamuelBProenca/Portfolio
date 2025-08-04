"use client";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function About() {
  const [lang, setLang] = useState<"pt" | "en">("pt");

  useEffect(() => {
    const browserLang = navigator.language.slice(0, 2).toLowerCase();
    setLang(browserLang === "en" ? "en" : "pt");
  }, []);

  const content = {
    pt: {
      title: "Sobre Mim",
      paragraphs: [
        "Sou Samuel Proença, desenvolvedor com experiência prática em automação de processos, construção de aplicações web e criação de soluções sob medida para ambientes de rede e negócios. Tenho um olhar voltado para eficiência, clareza e impacto real — não apenas escrevo código, mas busco resolver problemas de verdade.",
        "Minha trajetória inclui desde o desenvolvimento de ferramentas em C# e scripts .BAT para ambientes Windows corporativos até a criação de interfaces modernas e interativas com tecnologias como Next.js. Já otimizei tarefas repetitivas no ambiente de trabalho, reduzindo o tempo de execução em até quatro vezes com soluções que também geram logs e registros para auditoria e manutenção.",
        "Atualmente, venho explorando a integração com bancos de dados, automações mais robustas, bots, aplicações REST e experiências de usuário refinadas. Trabalho com atenção ao detalhe, mesmo quando os recursos são limitados, e estou sempre em busca de melhorar a arquitetura, performance e usabilidade dos sistemas que crio.",
      ],
    },
    en: {
      title: "About Me",
      paragraphs: [
        "I'm Samuel Proença, a developer with hands-on experience in process automation, web application development, and tailored solutions for network environments and businesses. I focus on efficiency, clarity, and real-world impact — I don’t just write code, I solve real problems.",
        "My journey includes developing tools in C# and .BAT scripts for corporate Windows environments, as well as building modern and interactive interfaces with technologies like Next.js. I’ve optimized repetitive tasks, reducing execution time by up to four times with solutions that also generate logs and audit records.",
        "Currently, I’m diving deeper into database integration, robust automations, bots, REST APIs, and refined user experiences. I pay attention to detail even with limited resources, always aiming to improve architecture, performance, and usability in the systems I build.",
      ],
    },
  };

  const { title, paragraphs } = content[lang];

  return (
    <section id="about" className="mb-32 mt-20 px-4">
      <h3 className="text-2xl font-semibold mb-10 border-b border-neutral-800 pb-2">
        {title}
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 items-center">
        {/* Imagem à esquerda */}
        <div className="flex justify-center">
          <div className="w-[260px] h-[260px] rounded-xl overflow-hidden border border-neutral-800 shadow-lg">
            <Image
              src="/professional-test.jpg"
              alt="Foto de Samuel Proença"
              className="w-full h-full object-cover"
              width={260}
              height={260}
            />
          </div>
        </div>

        {/* Texto à direita */}
        <div className="md:col-span-2 self-start space-y-6 text-neutral-400 leading-relaxed">
          {paragraphs.map((text, i) => (
            <p key={i}>{text}</p>
          ))}
        </div>
      </div>
    </section>
  );
}
