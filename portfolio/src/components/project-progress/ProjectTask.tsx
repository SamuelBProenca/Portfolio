import type { ProjectTask as TaskData } from "@/types/project-progress";
import StatusIndicator from "./StatusIndicator";

type Props = {
  task: TaskData;
  prefix: string;
  tasksById: ReadonlyMap<string, TaskData>;
  onDependencyNavigate: (id: string) => void;
};

export default function ProjectTask({ task, prefix, tasksById, onDependencyNavigate }: Props) {
  return (
    <li>
      <details className="project-task" id={`${prefix}-task-${task.id}`}>
        <summary>
          <span className="project-task__title">{task.title}</span>
          <StatusIndicator status={task.status} />
          <span className="plan-toggle" aria-hidden="true">
            +
          </span>
        </summary>
        <div className="project-task__body">
          {task.description && <p>{task.description}</p>}
          {!!task.dependsOn?.length && (
            <div className="task-dependencies">
              <span>Depende de</span>
              <ul>
                {task.dependsOn.map((id) => (
                  <li key={id}>
                    <a
                      href={`#${prefix}-task-${id}`}
                      onClick={(event) => {
                        event.preventDefault();
                        onDependencyNavigate(id);
                      }}
                    >
                      {tasksById.get(id)?.title ?? id} <span aria-hidden="true">↑</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {!!task.references?.length && (
            <ul className="task-references" aria-label={`Referências de ${task.title}`}>
              {task.references.map((reference) => (
                <li key={reference.url}>
                  <a href={reference.url} target="_blank" rel="noopener noreferrer">
                    <span className="task-reference-kind">
                      {reference.kind === "pull-request"
                        ? "PR"
                        : reference.kind === "documentation"
                          ? "DOC"
                          : reference.kind === "code"
                            ? "CÓDIGO"
                            : reference.kind.toUpperCase()}
                    </span>
                    {reference.label}
                    <span aria-hidden="true">↗</span>
                  </a>
                </li>
              ))}
            </ul>
          )}
          {!!task.subtasks?.length && (
            <ul className="project-task-list project-task-list--nested">
              {task.subtasks.map((child) => (
                <ProjectTask
                  key={child.id}
                  task={child}
                  prefix={prefix}
                  tasksById={tasksById}
                  onDependencyNavigate={onDependencyNavigate}
                />
              ))}
            </ul>
          )}
        </div>
      </details>
    </li>
  );
}
