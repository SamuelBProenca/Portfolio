import Image from "next/image";
import type { SelectedProject } from "@/content/projects";
import CurriculumPreview from "./curriculum-preview";
import styles from "./project-deck.module.css";

export default function ProjectDeckVisual({ project }: { project: SelectedProject }) {
  return (
    <figure className={styles.visual}>
      {project.id === "greatmaker" ? (
        <Image
          src="/images/greatmaker-reference-hub.png"
          alt="Biblioteca do DesignRef M1 com referências de código e ideia."
          width={1440}
          height={1091}
          sizes="(max-width: 760px) 90vw, 40vw"
          draggable={false}
        />
      ) : project.id === "curriculum" ? (
        <div aria-hidden="true">
          <CurriculumPreview steps={project.visual.lines} />
        </div>
      ) : (
        <ol className={styles.flow} aria-label={`Fluxo do ${project.title}`}>
          {project.visual.lines.map((line) => (
            <li key={line}>{line.replace(/^\d+ \/ /, "")}</li>
          ))}
        </ol>
      )}
      <figcaption>
        {project.id === "greatmaker"
          ? "Captura real / DesignRef M1"
          : "Esquema ilustrativo / implementação"}
      </figcaption>
    </figure>
  );
}
