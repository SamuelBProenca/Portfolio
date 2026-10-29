import Image from "next/image";
import Link from "next/link";

import type { Metadata } from "next";
import PageHero from "@/components/page-hero";

export const metadata: Metadata = {
  title: "Sobre",
  description:
    "Conheça a trajetória de Samuel Proença, da infraestrutura à automação e à engenharia de software.",
};

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="Sobre / Trajetória"
        title="Da infraestrutura ao desenvolvimento full-stack."
        description="Minha formação em redes e minha experiência com sistemas operacionais deram origem ao interesse por automação e desenvolvimento de software."
      />
      <section className="content-section">
        <div className="container about-page-split">
          <div className="about-page-portrait" data-scroll-reveal>
            <Image
              src="/images/samuel-approved.webp"
              alt="Retrato de Samuel Proença"
              loading="eager"
              fill
              sizes="(max-width: 760px) 90vw, 45vw"
            />
          </div>
          <div>
            <div className="eyebrow">Prazer, Samuel.</div>
            <h2 className="subheading">Trabalhei primeiro com as restrições do ambiente.</h2>
            <p style={{ color: "#bcb8b0", fontSize: "17px", lineHeight: "1.85" }}>
              Na infraestrutura, lidei com equipamentos, sistemas legados e procedimentos que
              exigiam verificações frequentes. Parte do meu trabalho passou a ser criar ferramentas
              para tornar essas rotinas mais consistentes.
            </p>
            <p style={{ color: "#bcb8b0", fontSize: "17px", lineHeight: "1.85" }}>
              Com o tempo, ampliei minha atuação para a construção de aplicações web: componentes de
              interface, APIs, integração entre serviços, persistência e testes. Hoje utilizo IA
              para apoiar etapas do desenvolvimento e sigo estudando arquitetura e engenharia de
              software.
            </p>
            <p style={{ marginTop: "30px" }}>
              <Link className="text-link" href="/projetos">
                Explorar projetos{" "}
                <span className="arr" aria-hidden="true">
                  ↗
                </span>
              </Link>
            </p>
          </div>
        </div>
      </section>
      <section className="about-band">
        <div className="container">
          <div className="section-top dark-rule">
            <span className="eyebrow" style={{ color: "#777" }}>
              Percurso
            </span>
            <span className="section-index">ONDE APRENDI / ONDE APLICO</span>
          </div>
          <div className="chronology">
            <div className="chrono-row" data-scroll-reveal>
              <span>Experiência profissional</span>
              <strong>Infraestrutura e automação</strong>
              <p>
                Ferramentas internas, diagnósticos, redes e rotinas que exigem soluções aplicáveis à
                operação.
              </p>
            </div>
            <div className="chrono-row" data-scroll-reveal>
              <span>Formação</span>
              <strong>FATEC</strong>
              <p>
                Tecnólogo em Redes de Computadores, com base em infraestrutura, sistemas e
                fundamentos técnicos.
              </p>
            </div>
            <div className="chrono-row">
              <span>Projetos atuais</span>
              <strong>Desenvolvimento full-stack</strong>
              <p>Aplicações web, APIs, interfaces e ferramentas próprias.</p>
            </div>
          </div>
          <p style={{ marginTop: "36px" }}>
            <Link className="text-link paper-link" href="/#contato">
              Vamos conversar sobre sua equipe ou projeto
              <span className="arr" aria-hidden="true">
                ↗
              </span>
            </Link>
          </p>
        </div>
      </section>
    </>
  );
}
