"use client";

import { useId, useRef, useState, type KeyboardEvent } from "react";
import type { SelectedProject } from "@/content/projects";
import Link from "next/link";

export default function SelectedWorks({ projects }: { projects: readonly SelectedProject[] }) {
  const [expandedId, setExpandedId] = useState<string | null>(projects[0]?.id ?? null);
  const accordionId = useId();
  const triggers = useRef<(HTMLButtonElement | null)[]>([]);

  function moveFocus(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let next: number;
    switch (event.key) {
      case "ArrowDown":
        next = (index + 1) % projects.length;
        break;
      case "ArrowUp":
        next = (index - 1 + projects.length) % projects.length;
        break;
      case "Home":
        next = 0;
        break;
      case "End":
        next = projects.length - 1;
        break;
      default:
        return;
    }
    event.preventDefault();
    triggers.current[next]?.focus();
  }

  return (
    <div className="project-accordion">
      <p className="project-accordion__hint">Selecione um projeto para explorar.</p>
      {projects.map((project, index) => {
        const expanded = expandedId === project.id;
        const triggerId = `${accordionId}-${project.id}-trigger`;
        const panelId = `${accordionId}-${project.id}-panel`;

        return (
          <article className="project-accordion__item" key={project.id}>
            <h3 className="project-accordion__heading">
              <button
                className="project-accordion__trigger"
                id={triggerId}
                type="button"
                aria-expanded={expanded}
                aria-controls={panelId}
                ref={(element) => {
                  triggers.current[index] = element;
                }}
                onClick={() => setExpandedId(expanded ? null : project.id)}
                onKeyDown={(event) => moveFocus(event, index)}
              >
                <span className="project-accordion__number" aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="project-accordion__title">{project.title}</span>
                <span className="project-accordion__summary">{project.summary}</span>
                <span className="project-accordion__icon" aria-hidden="true">
                  {expanded ? "−" : "+"}
                </span>
              </button>
            </h3>
            <div id={panelId} role="region" aria-labelledby={triggerId} hidden={!expanded}>
              <div className="featured project-accordion__panel">
                <div
                  className={`featured-visual project-visual project-visual--${project.visual.kind}`}
                  aria-hidden="true"
                >
                  <span className="project-visual__caption">{project.visual.caption}</span>
                  <div className="terminal">
                    <div className="terminal__bar">
                      <i />
                      <i />
                      <i />
                      <span>{project.visual.label}</span>
                    </div>
                    <div className="terminal__body">
                      {project.visual.kind === "api" && (
                        <div className="project-visual__endpoint">GET /api/cards/:repo</div>
                      )}
                      <div className="project-visual__lines">
                        {project.visual.lines.map((line) => (
                          <div key={line}>{line}</div>
                        ))}
                      </div>
                      <div className="dim project-visual__note">
                        {project.visual.kind === "terminal"
                          ? "[ ESCOPO DOCUMENTADO ]"
                          : project.visual.kind === "api"
                            ? "GitHub → JSON → Portfólio"
                            : "[ ESTUDAR / IMPLEMENTAR / REVISAR ]"}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="featured-copy">
                  <div>
                    <span className="project-type">{project.category}</span>
                    <h4>{project.headline}</h4>
                    <p>{project.description}</p>
                  </div>
                  <div className="project-bottom">
                    <span className="techline">{project.technologies}</span>
                    {project.detailsHref && (
                      <Link className="project-accordion__repository" href={project.detailsHref}>
                        Ver plano técnico <span aria-hidden="true">→</span>
                      </Link>
                    )}
                    <a
                      className="project-accordion__repository"
                      href={project.repository}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Ver repositório de ${project.title} no GitHub`}
                    >
                      Ver no GitHub <span aria-hidden="true">↗</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
