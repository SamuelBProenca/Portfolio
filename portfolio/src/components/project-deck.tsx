"use client";

import Link from "next/link";
import { useId, useSyncExternalStore, type KeyboardEvent } from "react";
import type { SelectedProject } from "@/content/projects";
import ProjectDeckVisual from "./project-deck-visual";
import useDeckInteraction from "./use-deck-interaction";
import styles from "./project-deck.module.css";

const subscribeHydration = () => () => {};
const hydrated = () => true;
const serverHydrated = () => false;

function Arrow({ next = false }: { next?: boolean }) {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden="true"
    >
      <path d={next ? "M5 12h14m-6-6 6 6-6 6" : "M19 12H5m6-6-6 6 6 6"} />
    </svg>
  );
}

export default function ProjectDeck({ projects }: { projects: readonly SelectedProject[] }) {
  const enhanced = useSyncExternalStore(subscribeHydration, hydrated, serverHydrated);
  const { current, select, stage, cards, deck, motionReady, prepareMotion, pointerHandlers } =
    useDeckInteraction(projects.length);
  const deckId = useId();

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.altKey || event.ctrlKey || event.metaKey) return;
    if (
      event.key === "ArrowRight" ||
      event.key === "ArrowLeft" ||
      event.key === "Home" ||
      event.key === "End"
    ) {
      event.preventDefault();
      select(
        event.key === "Home"
          ? 0
          : event.key === "End"
            ? projects.length - 1
            : current + (event.key === "ArrowRight" ? 1 : -1),
      );
    }
  }
  return (
    <section
      ref={deck}
      className={styles.deck}
      aria-label="Projetos em cartas"
      data-enhanced={enhanced}
      data-motion-ready={motionReady}
      onPointerEnter={prepareMotion}
      onFocusCapture={prepareMotion}
    >
      <div className={styles.controls} hidden={!enhanced}>
        <p id={`${deckId}-hint`}>Use as setas ou selecione um projeto.</p>
        <div className={styles.arrows}>
          <button
            type="button"
            aria-label="Projeto anterior"
            aria-disabled={current === 0}
            onClick={() => select(current - 1)}
          >
            <Arrow />
          </button>
          <button
            type="button"
            aria-label="Próximo projeto"
            aria-disabled={current === projects.length - 1}
            onClick={() => select(current + 1)}
          >
            <Arrow next />
          </button>
        </div>
      </div>
      <div
        className={styles.stage}
        ref={stage}
        tabIndex={enhanced ? 0 : undefined}
        role="group"
        aria-label="Explorar projetos"
        aria-describedby={enhanced ? `${deckId}-hint` : undefined}
        onKeyDown={onKeyDown}
        {...pointerHandlers}
      >
        <ol className={styles.cards}>
          {projects.map((project, index) => {
            const active = index === current;
            return (
              <li
                key={project.id}
                ref={(element) => {
                  cards.current[index] = element;
                }}
                className={styles.card}
                data-position={active ? "current" : index < current ? "previous" : "next"}
                aria-hidden={enhanced && !active ? true : undefined}
                inert={enhanced && !active}
              >
                <article aria-labelledby={`${deckId}-${project.id}`}>
                  <div className={styles.copy}>
                    <h3 id={`${deckId}-${project.id}`}>{project.title}</h3>
                    <p className={styles.category}>{project.category}</p>
                    <p className={styles.headline}>{project.headline}</p>
                    <p className={styles.summary}>{project.summary}</p>
                    <details>
                      <summary>Detalhes do projeto</summary>
                      <p>{project.description}</p>
                    </details>
                    <p className={styles.status}>{project.status}</p>
                    <p className={styles.tech}>{project.technologies}</p>
                    <div className={styles.links}>
                      {project.detailsHref && (
                        <Link href={project.detailsHref} prefetch={false}>
                          Ver documentação técnica
                        </Link>
                      )}
                      {project.deployHref && (
                        <a href={project.deployHref} draggable={false}>
                          Abrir {project.title}
                        </a>
                      )}
                      {project.repository && (
                        <a
                          href={project.repository}
                          target="_blank"
                          rel="noopener noreferrer"
                          draggable={false}
                        >
                          Ver repositório de {project.title}
                        </a>
                      )}
                    </div>
                  </div>
                  <ProjectDeckVisual project={project} />
                </article>
              </li>
            );
          })}
        </ol>
        {enhanced && current > 0 && (
          <button
            className={`${styles.neighbor} ${styles.previous}`}
            type="button"
            aria-label={`Mostrar ${projects[current - 1].title}`}
            onClick={() => select(current - 1)}
          >
            <Arrow />
          </button>
        )}
        {enhanced && current < projects.length - 1 && (
          <button
            className={`${styles.neighbor} ${styles.next}`}
            type="button"
            aria-label={`Mostrar ${projects[current + 1].title}`}
            onClick={() => select(current + 1)}
          >
            <Arrow next />
          </button>
        )}
      </div>
      <div className={styles.selection} hidden={!enhanced} aria-label="Selecionar projeto">
        {projects.map((project, index) => (
          <button
            key={project.id}
            type="button"
            aria-label={`Selecionar ${project.title}`}
            aria-current={index === current ? "true" : undefined}
            onClick={() => select(index)}
          >
            {String(index + 1).padStart(2, "0")}
          </button>
        ))}
      </div>
      <p className={styles.announcement} role="status" aria-live="polite" aria-atomic="true">
        {enhanced
          ? `Projeto ${current + 1} de ${projects.length}: ${projects[current].title}`
          : `${projects.length} projetos selecionados`}
      </p>
    </section>
  );
}
