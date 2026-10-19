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
        description="Soluções, experimentos e ferramentas. Mais importante que o nome da tecnologia é o problema que motivou cada projeto."
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
              {"repository" in project ? (
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
          <div className="empty-editorial">
            <h3>Projetos com contexto, não apenas vitrines.</h3>
            <p>
              Na próxima etapa, cada projeto terá uma página própria com problema, restrições,
              arquitetura, alternativas consideradas, decisões, código e resultados verificáveis.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
