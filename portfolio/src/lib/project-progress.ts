import type { ProjectPlan, ProjectTask, TaskStatus } from "@/types/project-progress";

export function flattenTasks(tasks: readonly ProjectTask[]): ProjectTask[] {
  return tasks.flatMap((task) => [task, ...flattenTasks(task.subtasks ?? [])]);
}

export function leafTasks(tasks: readonly ProjectTask[]): ProjectTask[] {
  return tasks.flatMap((task) => (task.subtasks?.length ? leafTasks(task.subtasks) : [task]));
}

export function summarizeProgress(tasks: readonly ProjectTask[]) {
  const leaves = leafTasks(tasks);
  const counts: Record<TaskStatus, number> = {
    planned: 0,
    "in-progress": 0,
    completed: 0,
    blocked: 0,
  };
  for (const task of leaves) counts[task.status]++;
  return {
    total: leaves.length,
    counts,
    percent: leaves.length ? Math.round((100 * counts.completed) / leaves.length) : 0,
  };
}

export function aggregateStatus(tasks: readonly ProjectTask[]): TaskStatus {
  const statuses = leafTasks(tasks).map((task) => task.status);
  if (statuses.length && statuses.every((status) => status === "completed")) return "completed";
  if (statuses.includes("blocked")) return "blocked";
  if (statuses.includes("in-progress")) return "in-progress";
  // A mix of completed and planned work is not evidence of active development.
  return "planned";
}

export function planTasks(plan: ProjectPlan) {
  return plan.groups.flatMap((group) => group.tasks);
}

export function validatePlan(plan: ProjectPlan): void {
  const tasks = flattenTasks(planTasks(plan));
  const index = new Map(tasks.map((task) => [task.id, task]));
  if (index.size !== tasks.length) throw new Error("Duplicate task IDs");
  const visited = new Set<string>();
  function visit(task: ProjectTask, path: Set<string>) {
    if (path.has(task.id)) throw new Error("Cyclic task dependency");
    if (visited.has(task.id)) return;
    const next = new Set(path).add(task.id);
    for (const dependency of task.dependsOn ?? []) {
      const target = index.get(dependency);
      if (!target) throw new Error(`Unknown dependency: ${dependency}`);
      visit(target, next);
    }
    visited.add(task.id);
  }
  for (const task of tasks) visit(task, new Set());
}
