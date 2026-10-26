import Image from "next/image";
import Link from "next/link";
import SelectedWorks from "@/components/selected-works";
import IntroStrip from "@/components/intro-strip";
import ContactSection from "@/components/contact-section";
import EngineeringProgress from "@/components/project-progress/EngineeringProgress";
import { octocardsPlan } from "@/content/project-progress";
import { selectedProjects } from "@/content/projects";

export default function HomePage() {
  return (
    <>
      <section className="hero">
        <div className="container hero-grid">
          <div className="hero-copy">
            <div className="hero-kicker eyebrow">
              <span>
                <span className="marker"></span>Portfólio / 2026
              </span>
              <span>São Paulo · Brasil</span>
            </div>
            <div>
              <h1 className="hero-title">
                <span>MENOS</span>
                <span>
                  RUÍDO<span className="accent">.</span>
                </span>
                <span>MAIS</span>
                <span>
                  SISTEMA<span className="accent">.</span>
                </span>
              </h1>
              <p className="hero-description">
                Sou Samuel Proença. Desenvolvo APIs, ferramentas e automações para organizar dados e
                simplificar rotinas. Minha base em infraestrutura orienta cada decisão.
              </p>
              <div className="hero-actions">
                <Link className="button-primary" href="/projetos" prefetch={false}>
                  Explore meus projetos{" "}
                  <span className="arr" aria-hidden="true">
                    ↗
                  </span>
                </Link>
                <Link className="button-secondary" href="/sobre" prefetch={false}>
                  Conheça minha trajetória{" "}
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
            <span className="eyebrow">Trabalhos selecionados</span>
            <span className="section-index">
              PROJETOS / 01—{String(selectedProjects.length).padStart(2, "0")}
            </span>
          </div>
          <div className="work-intro" data-scroll-reveal>
            <h2 className="section-head">Cada projeto, um problema para resolver.</h2>
            <p>
              Automação de rotinas, integração de dados e estudo de arquitetura. Explore o contexto,
              o código disponível e o estágio de cada projeto.
            </p>
          </div>
          <SelectedWorks projects={selectedProjects} />
          <div style={{ marginTop: "32px", textAlign: "right" }}>
            <Link className="text-link" href="/projetos">
              Todos os projetos <span className="arr">↗</span>
            </Link>
          </div>
        </div>
      </section>
      <EngineeringProgress plan={octocardsPlan} />
      <section id="sobre" className="about-band">
        <div className="container">
          <div className="section-top dark-rule" data-scroll-reveal>
            <span className="eyebrow" style={{ color: "#777" }}>
              A pessoa por trás do código
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
              <h2>
                Antes de escrever código, <em>entendo o problema.</em>
              </h2>
              <p className="lead">
                Meu trabalho começou próximo da infraestrutura, onde falhas, limitações e tarefas
                repetitivas deixam de ser abstrações.
              </p>
              <p className="secondary">
                Foi nesse contato com operações reais que desenvolvi meu interesse por automações,
                ferramentas internas e arquitetura de software. Gosto de soluções claras, bem
                estruturadas e sustentáveis, sem complexidade desnecessária.
              </p>
              <div className="about-details">
                <div>
                  <strong>Atuação</strong>Desenvolvimento backend, infraestrutura e ferramentas
                  operacionais.
                </div>
                <div>
                  <strong>Formação</strong>Tecnologia em Redes de Computadores · FATEC.
                </div>
              </div>
              <div style={{ marginTop: "39px" }}>
                <Link className="text-link paper-link" href="/sobre">
                  Conheça minha trajetória <span className="arr">↗</span>
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
          <h2 className="section-head">Tecnologias são meios. Clareza é parte do trabalho.</h2>
          <div className="stack-rows">
            <div className="stack-row" data-scroll-reveal>
              <h3>01 / Linguagens</h3>
              <p>TypeScript, JavaScript, Python, C#, PHP, Java</p>
            </div>
            <div className="stack-row" data-scroll-reveal>
              <h3>02 / Backend</h3>
              <p>Node.js, APIs REST, SQL, arquitetura de serviços</p>
            </div>
            <div className="stack-row" data-scroll-reveal>
              <h3>03 / Interfaces</h3>
              <p>React, Next.js, HTML, CSS, Tailwind</p>
            </div>
            <div className="stack-row" data-scroll-reveal>
              <h3>04 / Infraestrutura</h3>
              <p>Redes, Linux, Git, Docker, PowerShell, automação</p>
            </div>
          </div>
        </div>
      </section>
      <section id="escrita" className="writing-section">
        <div className="container">
          <div className="section-top">
            <span className="eyebrow">Um espaço para pensar</span>
            <span className="section-index">ESCRITA / EM PREPARAÇÃO</span>
          </div>
          <div className="writing-intro" data-scroll-reveal>
            <h2 className="section-head">Nem tudo termina em código.</h2>
            <p>
              Um espaço reservado para textos sobre tecnologia, raciocínio, hipóteses e outros
              assuntos que mereçam uma análise mais demorada.
            </p>
          </div>
          <div className="writing-cols">
            <article className="writing-col" data-scroll-reveal>
              <span className="writing-category">01 / Engenharia</span>
              <h3>O que aprendo construindo.</h3>
              <p>
                Vou compartilhar estudos técnicos, decisões de arquitetura e aprendizados dos
                projetos e da rotina de trabalho.
              </p>
              <Link className="text-link" href="/escrita#engenharia">
                Conheça a proposta{" "}
                <span className="arr" aria-hidden="true">
                  ↗
                </span>
              </Link>
            </article>
            <article className="writing-col" data-scroll-reveal>
              <span className="writing-category">02 / Ensaios & hipóteses</span>
              <h3>Ideias que ainda estão sendo pensadas.</h3>
              <p>
                Reflexões e especulações identificadas como tal, abertas ao contraponto e separadas
                dos textos de caráter técnico.
              </p>
              <Link className="text-link" href="/escrita#ensaios">
                Conheça a proposta{" "}
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
