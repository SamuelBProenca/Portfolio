import type { ProjectTask } from "@/types/project-progress";
import { summarizeProgress } from "@/lib/project-progress";

export default function ProjectProgressSummary({
  tasks,
  title,
}: {
  tasks: readonly ProjectTask[];
  title: string;
}) {
  const summary = summarizeProgress(tasks);
  return (
    <div className="progress-summary">
      <div className="progress-summary__numbers">
        <strong>
          {summary.counts.completed}
          <span> / {summary.total}</span>
        </strong>
        <p>etapas concluídas neste plano</p>
      </div>
      <div className="progress-summary__bar">
        <progress
          value={summary.counts.completed}
          max={Math.max(1, summary.total)}
          aria-label={`Etapas concluídas no plano de ${title}`}
        />
        <span>{summary.percent}% do plano revisado</span>
      </div>
      <p className="progress-summary__context">
        {summary.counts.planned} planejadas · {summary.counts["in-progress"]} em andamento ·{" "}
        {summary.counts.blocked} bloqueadas
      </p>
    </div>
  );
}
