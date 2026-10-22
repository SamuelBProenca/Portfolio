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
        title="MAIS QUE"
        accent="CÓDIGO."
        description="Da infraestrutura ao backend, meu foco é simplificar rotinas e construir ferramentas claras. A experiência com operações me ajuda a entender o problema antes de propor uma solução."
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
            <h2 className="subheading">Da infraestrutura para a engenharia de software.</h2>
            <p style={{ color: "#bcb8b0", fontSize: "17px", lineHeight: "1.85" }}>
              Minha experiência em ambientes operacionais me ensinou a enxergar além do código: o
              custo de uma tarefa repetida, a fragilidade de um processo manual e a importância de
              ferramentas que funcionem mesmo quando o ambiente não é ideal.
            </p>
            <p style={{ color: "#bcb8b0", fontSize: "17px", lineHeight: "1.85" }}>
              A partir disso, aprofundei meu trabalho em automação, desenvolvimento backend e
              arquitetura. Estudo para construir sistemas mais claros e duráveis, sem confundir
              complexidade com qualidade.
            </p>
            <p style={{ marginTop: "30px" }}>
              <Link className="text-link" href="/projetos">
                Veja essa abordagem nos projetos{" "}
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
              <span>Hoje</span>
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
              <span>Em evolução</span>
              <strong>Engenharia de software</strong>
              <p>
                APIs, arquitetura backend, boas práticas de desenvolvimento e projetos próprios.
              </p>
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
