import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/page-hero";
import ProjectPlan from "@/components/project-progress/ProjectPlan";
import { localProjectProgress } from "@/content/project-progress";
import { validatePlan } from "@/lib/project-progress";
import { loadProjectCatalog } from "@/lib/project-catalog";
import RepositoryEvidence from "@/components/repository-evidence";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "OctoCards — Plano de engenharia",
  description:
    "Implementação, decisões e próximos passos da API OctoCards, com referências ao código e um plano técnico verificável.",
};

export default async function OctocardsPage() {
  const plan = await localProjectProgress.load("octocards");
  if (!plan) throw new Error("OctoCards plan unavailable");
  validatePlan(plan);
  const octocards = (await loadProjectCatalog()).find((project) => project.id === "octocards");
  return (
    <>
      <PageHero
        eyebrow="Projeto / OctoCards"
        title="DADOS COM"
        accent="CONTEXTO."
        description={plan.description}
      />
      <section className="content-section project-detail" aria-labelledby="project-plan-title">
        <div className="container">
          <div className="project-detail__navigation">
            <Link className="text-link" href="/projetos">
              ← Todos os projetos
            </Link>
            <a
              className="text-link"
              href={plan.repository}
              target="_blank"
              rel="noopener noreferrer"
            >
              Repositório no GitHub ↗
            </a>
          </div>
          <RepositoryEvidence evidence={octocards?.evidence} />
          <div className="section-top">
            <h2 id="project-plan-title">Plano de engenharia</h2>
            <span className="section-index">IMPLEMENTAÇÃO / EVOLUÇÃO</span>
          </div>
          <p className="project-detail__intro">
            Os marcos concluídos têm referência no código revisado. As melhorias futuras são
            propostas, sem progresso simulado ou atualização automática de status.
          </p>
          <ProjectPlan plan={plan} />
        </div>
      </section>
    </>
  );
}
