"use client";

import type { ProjectPlan as PlanData } from "@/types/project-progress";
import { aggregateStatus, flattenTasks, planTasks } from "@/lib/project-progress";
import ProjectTask from "./ProjectTask";
import StatusIndicator from "./StatusIndicator";
import ProjectProgressSummary from "./ProjectProgressSummary";

export default function ProjectPlan({ plan }: { plan: PlanData }) {
  const tasks = planTasks(plan);
  const tasksById = new Map(flattenTasks(tasks).map((task) => [task.id, task]));

  function navigateDependency(id: string) {
    const target = document.getElementById(`${plan.id}-task-${id}`);
    if (!target) return;
    let details: HTMLDetailsElement | null = target as HTMLDetailsElement;
    while (details) {
      details.open = true;
      details = details.parentElement?.closest("details") ?? null;
    }
    const summary = target.querySelector<HTMLElement>(":scope > summary");
    summary?.focus({ preventScroll: true });
    target.scrollIntoView({
      block: "nearest",
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "instant"
        : "smooth",
    });
    window.history.replaceState(null, "", `#${target.id}`);
  }

  return (
    <div className="project-plan" id={`plano-${plan.id}`}>
      <ProjectProgressSummary tasks={tasks} title={plan.title} />
      <p className="project-plan__source">
        Revisão local de {plan.reviewedAt.split("-").reverse().join("/")} ·{" "}
        <a
          href={`${plan.repository}/commit/${plan.snapshotSha}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          Código de referência {plan.snapshotSha.slice(0, 7)} ↗
        </a>
      </p>
      <div className="project-plan__groups">
        {plan.groups.map((group, index) => (
          <details className="project-plan__group" key={group.id} open={index === 0}>
            <summary>
              <span className="project-plan__group-number" aria-hidden="true">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3>{group.title}</h3>
              <StatusIndicator status={aggregateStatus(group.tasks)} />
              <span className="plan-toggle" aria-hidden="true">
                +
              </span>
            </summary>
            <div className="project-plan__group-body">
              {group.description && (
                <p className="project-plan__group-description">{group.description}</p>
              )}
              <ul className="project-task-list">
                {group.tasks.map((task) => (
                  <ProjectTask
                    key={task.id}
                    task={task}
                    prefix={plan.id}
                    tasksById={tasksById}
                    onDependencyNavigate={navigateDependency}
                  />
                ))}
              </ul>
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}
