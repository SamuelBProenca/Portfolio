import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/page-hero";
import { projects } from "@/content/projects";

export const metadata: Metadata = {
  title: "Projetos",
  description:
    "Projetos de automação, APIs e engenharia de software de Samuel Proença, com seus contextos e tecnologias.",
};

export default function ProjectsPage() {
  return (
    <>
      <PageHero
        eyebrow="Projetos / Seleção"
        title="MEU"
        accent="TRABALHO."
        description="APIs, automação e estudos de arquitetura. Conheça o problema que orienta cada projeto, o que já está disponível e as decisões que sustentam sua evolução."
      />
      <section className="content-section">
        <div className="container">
          <div className="section-top">
            <span className="eyebrow">Arquivo de projetos</span>
            <span className="section-index">ORDEM EDITORIAL, NÃO CRONOLÓGICA</span>
          </div>
          {projects.map((project) => (
            <article
              className="project-entry"
              data-scroll-reveal
              id={"id" in project ? project.id : undefined}
              key={project.number}
            >
              <span className="num">{project.number}</span>
              <div>
                <h2>{project.title}</h2>
                <span className="project-entry__meta">{project.technologies}</span>
              </div>
              <p>
                {project.description}
                {project.detailsHref && (
                  <Link className="project-entry__detail" href={project.detailsHref}>
                    Ver plano técnico →
                  </Link>
                )}
              </p>
              {project.deployHref ? (
                <a className="arr" href={project.deployHref} aria-label={`Abrir ${project.title}`}>
                  <span aria-hidden="true">↗</span>
                </a>
              ) : project.repository ? (
                <a
                  className="arr"
                  href={project.repository}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Repositório de ${project.title}`}
                >
                  ↗
                </a>
              ) : (
                <span
                  className="eyebrow project-unavailable"
                  title="Repositório não confirmado publicamente"
                >
                  —
                </span>
              )}
            </article>
          ))}
          <div className="empty-editorial" data-scroll-reveal>
            <h3>Conheça as decisões por trás do código.</h3>
            <p>
              O plano técnico do OctoCards reúne a base implementada, as evidências no código e as
              próximas etapas propostas de validação, confiabilidade e testes.
            </p>
            <Link className="text-link" href="/projetos/octocards">
              Explore o plano do OctoCards{" "}
              <span className="arr" aria-hidden="true">
                ↗
              </span>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
