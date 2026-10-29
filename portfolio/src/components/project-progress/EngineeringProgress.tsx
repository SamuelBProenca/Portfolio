import Link from "next/link";
import type { ProjectPlan } from "@/types/project-progress";
import { planTasks, summarizeProgress } from "@/lib/project-progress";

export default function EngineeringProgress({ plan }: { plan: ProjectPlan }) {
  const summary = summarizeProgress(planTasks(plan));
  return (
    <section className="engineering-progress" aria-labelledby="engineering-progress-title">
      <div className="container">
        <div className="section-top">
          <span className="eyebrow">Em desenvolvimento / OctoCards</span>
          <span className="section-index">PROCESSO / PRÓXIMOS PASSOS</span>
        </div>
        <div className="engineering-progress__layout" data-scroll-reveal>
          <h2 id="engineering-progress-title">
            O que já funciona no OctoCards e o que falta implementar.
          </h2>
          <div className="engineering-progress__project">
            <span className="eyebrow">{plan.title} / Plano de evolução</span>
            <p>
              A alpha consulta repositórios públicos e oferece cache, limites de lote e por IP,
              documentação e testes automatizados. O plano detalha as entregas verificadas e as
              pendências de operação, segurança e integração com uma instância pública.
            </p>
            <div className="engineering-progress__meta">
              <span>
                {summary.counts.completed} de {summary.total} etapas concluídas no plano
              </span>
              <Link className="text-link" href="/projetos/octocards">
                Consultar plano técnico <span aria-hidden="true">↗</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
