export type TaskStatus = "planned" | "in-progress" | "completed" | "blocked";
export type ProjectReference = {
  kind: "issue" | "commit" | "pull-request" | "code" | "documentation";
  label: string;
  url: `https://github.com/${string}`;
};
export type ProjectTask = {
  id: string;
  title: string;
  status: TaskStatus;
  description?: string;
  dependsOn?: readonly string[];
  references?: readonly ProjectReference[];
  subtasks?: readonly ProjectTask[];
};
export type ProjectTaskGroup = {
  id: string;
  title: string;
  description?: string;
  tasks: readonly ProjectTask[];
};
export type ProjectPlan = {
  id: string;
  title: string;
  description: string;
  repository: `https://github.com/${string}`;
  reviewedAt: string;
  snapshotSha: string;
  groups: readonly ProjectTaskGroup[];
};
export interface ProjectProgressSource {
  load(projectId: string): Promise<ProjectPlan | null>;
}
