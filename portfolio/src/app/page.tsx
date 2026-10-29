import Image from "next/image";
import Link from "next/link";
import SelectedWorks from "@/components/selected-works";
import IntroStrip from "@/components/intro-strip";
import ContactSection from "@/components/contact-section";
import EngineeringProgress from "@/components/project-progress/EngineeringProgress";
import { octocardsPlan } from "@/content/project-progress";
import { selectedProjects } from "@/content/projects";
import copyStyles from "@/styles/copy-v2.module.css";

export default function HomePage() {
  return (
    <>
      <section className="hero">
        <div className="container hero-grid">
          <div className="hero-copy">
            <div className={`hero-kicker eyebrow ${copyStyles.heroKicker}`}>
              <span>
                <span className="marker"></span>Samuel Proença / desenvolvedor full-stack
              </span>
              <span>São Paulo · Brasil</span>
            </div>
            <div>
              <h1 className={`hero-title ${copyStyles.heroTitle}`}>
                Desenvolvo aplicações completas,{" "}
                <span className="accent">da interface à lógica de negócio.</span>
              </h1>
              <p className="hero-description">
                Comecei trabalhando com infraestrutura, sistemas legados e rotinas operacionais.
                Hoje desenvolvo aplicações web, APIs e automações. Uso ferramentas de IA para
                pesquisar alternativas, prototipar, implementar e revisar mudanças.
              </p>
              <div className="hero-actions">
                <Link className="button-primary" href="/projetos" prefetch={false}>
                  Ver projetos{" "}
                  <span className="arr" aria-hidden="true">
                    ↗
                  </span>
                </Link>
                <Link className="button-secondary" href="/sobre" prefetch={false}>
                  Sobre mim{" "}
                  <span className="arr" aria-hidden="true">
                    ↗
                  </span>
                </Link>
              </div>
            </div>
          </div>
          <div className="hero-aside">
            <Image
              src="/images/samuel-approved.webp"
              alt="Retrato de Samuel Proença"
              preload
              width={1122}
              height={1402}
              sizes="(max-width: 760px) 90vw, 45vw"
            />
            <span className="portrait-note">SAMUEL / RETRATO EDITORIAL</span>
          </div>
        </div>
      </section>
      <IntroStrip />
      <section id="projetos" className="work-section">
        <div className="container">
          <div className="section-top" data-scroll-reveal>
            <span className="eyebrow">Projetos selecionados</span>
            <span className="section-index">
              PROJETOS / 01—{String(selectedProjects.length).padStart(2, "0")}
            </span>
          </div>
          <div className="work-intro" data-scroll-reveal>
            <h2 className="section-head">O que construí até aqui.</h2>
            <p>
              Aplicações web, APIs e ferramentas em estágios diferentes. Cada projeto explica o que
              foi implementado, quais decisões tomei e o que ainda está em desenvolvimento.
            </p>
          </div>
          <SelectedWorks projects={selectedProjects} />
          <div style={{ marginTop: "32px", textAlign: "right" }}>
            <Link className="text-link" href="/projetos">
              Ver todos os projetos <span className="arr">↗</span>
            </Link>
          </div>
        </div>
      </section>
      <EngineeringProgress plan={octocardsPlan} />
      <section id="sobre" className="about-band">
        <div className="container">
          <div className="section-top dark-rule" data-scroll-reveal>
            <span className="eyebrow" style={{ color: "#777" }}>
              Trajetória
            </span>
            <span className="section-index">SOBRE / SAMUEL</span>
          </div>
          <div className="about-layout">
            <div className="about-photo" data-scroll-reveal>
              <Image
                src="/images/samuel-approved.webp"
                alt="Retrato de Samuel Proença"
                fill
                sizes="(max-width: 760px) 90vw, 45vw"
              />
              <span className="photo-caption">ALÉM DO TERMINAL / UM POUCO DE MIM</span>
            </div>
            <div className="about-content" data-scroll-reveal>
              <h2 className={copyStyles.sectionHeading}>
                Minha experiência começou na infraestrutura.
              </h2>
              <p className="lead">
                Trabalhei com dispositivos, redes e sistemas que precisavam continuar operando em
                ambientes com limitações técnicas. A repetição de verificações e registros me levou
                a desenvolver ferramentas de automação.
              </p>
              <p className="secondary">
                Ampliei esse trabalho para aplicações web, APIs e interfaces. Hoje desenvolvo
                projetos full-stack e utilizo IA no processo de pesquisa, implementação e revisão,
                conferindo as decisões no código e nos testes.
              </p>
              <div className="about-details">
                <div>
                  <strong>Atuação</strong>Desenvolvimento full-stack, infraestrutura e automação.
                </div>
                <div>
                  <strong>Formação</strong>Tecnologia em Redes de Computadores · FATEC.
                </div>
              </div>
              <div style={{ marginTop: "39px" }}>
                <Link className="text-link paper-link" href="/sobre">
                  Ler minha trajetória <span className="arr">↗</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="stack-section">
        <div className="container">
          <div className="section-top">
            <span className="eyebrow">Ferramentas & abordagens</span>
            <span className="section-index">O QUE USO / COMO PENSO</span>
          </div>
          <h2 className={`section-head ${copyStyles.sectionHeading}`}>
            Frontend, backend e infraestrutura.
          </h2>
          <div className="stack-rows">
            <div className="stack-row" data-scroll-reveal>
              <h3>Interfaces</h3>
              <p>React, Next.js, HTML, CSS, Tailwind</p>
            </div>
            <div className="stack-row" data-scroll-reveal>
              <h3>Serviços e APIs</h3>
              <p>TypeScript, JavaScript, Node.js, Python, C#/.NET, PHP, Java</p>
            </div>
            <div className="stack-row" data-scroll-reveal>
              <h3>Dados e automação</h3>
              <p>SQL, SQLite, PostgreSQL, MySQL, scripts e integrações</p>
            </div>
            <div className="stack-row" data-scroll-reveal>
              <h3>Ambiente e qualidade</h3>
              <p>Git, Docker, Linux, Windows, testes automatizados</p>
            </div>
          </div>
        </div>
      </section>
      <section className={copyStyles.workflow} aria-labelledby="ai-workflow-title">
        <div className="container" data-scroll-reveal>
          <h2 id="ai-workflow-title">Como uso IA enquanto desenvolvo.</h2>
          <p>
            Uso IA para investigar bibliotecas, comparar soluções, prototipar telas, apoiar a
            implementação e revisar alterações. Verifico o comportamento no projeto, executo os
            testes disponíveis e examino as limitações antes de incorporar o resultado.
          </p>
        </div>
      </section>
      <section id="escrita" className="writing-section">
        <div className="container">
          <div className="section-top">
            <span className="eyebrow">Um espaço para pensar</span>
            <span className="section-index">ESCRITA / EM PREPARAÇÃO</span>
          </div>
          <div className="writing-intro" data-scroll-reveal>
            <h2 className={`section-head ${copyStyles.sectionHeading}`}>
              Estou documentando o que aprendo nos meus projetos.
            </h2>
            <p>
              Pretendo publicar artigos sobre implementações, decisões técnicas e problemas
              encontrados durante o desenvolvimento. Os textos ainda estão em preparação.
            </p>
          </div>
          <div className="writing-cols">
            <article className="writing-col" data-scroll-reveal>
              <span className="writing-category">01 / Engenharia</span>
              <h3>Engenharia de software</h3>
              <p>
                Estudos de caso, arquitetura, integrações e automações, com fontes e limitações
                documentadas.
              </p>
              <Link className="text-link" href="/escrita#engenharia">
                Ver temas planejados{" "}
                <span className="arr" aria-hidden="true">
                  ↗
                </span>
              </Link>
            </article>
            <article className="writing-col" data-scroll-reveal>
              <span className="writing-category">02 / Ensaios & hipóteses</span>
              <h3>Ensaios e hipóteses</h3>
              <p>Reflexões e ideias em investigação, diferenciadas dos relatos técnicos.</p>
              <Link className="text-link" href="/escrita#ensaios">
                Ver temas planejados{" "}
                <span className="arr" aria-hidden="true">
                  ↗
                </span>
              </Link>
            </article>
          </div>
          <p className="writing-label" style={{ marginTop: "24px" }}>
            Primeiros textos em preparação. As categorias apresentam os temas que pretendo explorar.
          </p>
        </div>
      </section>
      <ContactSection />
    </>
  );
}
