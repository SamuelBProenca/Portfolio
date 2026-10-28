import type { Metadata } from "next";
import Link from "next/link";
import ProjectDeck from "@/components/project-deck";
import { selectedProjects } from "@/content/projects";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Experimento de cards",
  robots: { index: false, follow: false },
};

export default function CardExperimentPage() {
  const order = ["greatmaker", "curriculum", "octocards", "linkkeeper"];
  const projects = order.flatMap((id) => selectedProjects.filter((project) => project.id === id));
  return (
    <div className={`container ${styles.experiment}`}>
      <header className={styles.intro}>
        <div>
          <h1>Projetos em cartas.</h1>
          <p>Explore os quatro destaques em um novo formato.</p>
        </div>
        <Link className="text-link" href="/#projetos" prefetch={false}>
          Comparar com a home
        </Link>
      </header>
      <ProjectDeck projects={projects} />
      <p className={styles.catalog}>
        <Link className="text-link" href="/projetos" prefetch={false}>
          Ver todos os projetos
        </Link>
      </p>
    </div>
  );
}
