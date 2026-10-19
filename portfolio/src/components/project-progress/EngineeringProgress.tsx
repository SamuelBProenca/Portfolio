import Link from "next/link";
import type { ProjectPlan } from "@/types/project-progress";
import { planTasks, summarizeProgress } from "@/lib/project-progress";

export default function EngineeringProgress({ plan }: { plan: ProjectPlan }) {
  const summary = summarizeProgress(planTasks(plan));
  return (
    <section className="engineering-progress" aria-labelledby="engineering-progress-title">
      <div className="container">
        <div className="section-top">
          <span className="eyebrow">Progresso de engenharia</span>
          <span className="section-index">PROCESSO / PRÓXIMOS PASSOS</span>
        </div>
        <div className="engineering-progress__layout">
          <h2 id="engineering-progress-title">
            O que já existe.
            <br />O que vem a seguir.
          </h2>
          <div className="engineering-progress__project">
            <span className="eyebrow">{plan.title} / Plano de evolução</span>
            <p>
              Uma base de API implementada. Próximas etapas propostas: validação, confiabilidade,
              testes e integração.
            </p>
            <div className="engineering-progress__meta">
              <span>
                {summary.counts.completed} de {summary.total} etapas concluídas no plano
              </span>
              <Link className="text-link" href="/projetos/octocards">
                Ver plano técnico <span aria-hidden="true">↗</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
