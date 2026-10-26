import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/page-hero";
import { loadProjectCatalog } from "@/lib/project-catalog";

export const metadata: Metadata = {
  title: "Projetos",
  description:
    "Produtos web, APIs, ferramentas e interfaces de Samuel Proença: Curriculum Studio, GreatMaker, OctoCards, LinkKeeper e outros projetos com contexto e tecnologias.",
};

export const revalidate = 3600;
export default async function ProjectsPage() {
  const projects = (await loadProjectCatalog()).map((project, index) => ({
    number: String(index + 1).padStart(2, "0"),
    ...project,
  }));
  return (
    <>
      <PageHero
        eyebrow="Projetos / Seleção"
        title="MEU"
        accent="TRABALHO."
        description="Produtos web, APIs, ferramentas e interfaces. Conheça o problema que orienta cada projeto, o que já está disponível e as decisões que sustentam sua evolução."
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
              id={project.id}
              key={project.number}
            >
              <span className="num">{project.number}</span>
              <div>
                <h2>{project.title}</h2>
                <span className="project-entry__meta">{project.technologies}</span>
                {project.evidence && (
                  <span className="repository-languages">
                    Linguagens no GitHub:{" "}
                    {project.evidence.card.principal_languages.join(", ") || "não informadas"}
                  </span>
                )}
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
              O plano técnico do OctoCards apresenta a alpha com cache e documentação, as evidências
              no código e os próximos passos de operação e integração.
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
