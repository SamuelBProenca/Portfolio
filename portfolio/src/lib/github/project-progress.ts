import type { ProjectTask, TaskStatus } from "@/types/project-progress";

// Pure adapter contract for a future GitHub source. No network calls or fake
// integrations run today; UI components consume the same ProjectTask shape.
export type GitHubIssueSnapshot = {
  number: number;
  title: string;
  body?: string | null;
  html_url: `https://github.com/${string}`;
  state: "open" | "closed";
  state_reason?: "completed" | "not_planned" | "reopened" | null;
  labels: readonly { name: string }[];
};

export function adaptGitHubIssue(issue: GitHubIssueSnapshot): ProjectTask {
  let status: TaskStatus = "planned";
  if (issue.state === "closed" && issue.state_reason === "completed") status = "completed";
  else if (issue.state === "closed" && issue.state_reason === "not_planned") status = "blocked";
  else if (issue.state === "open") {
    if (issue.labels.some((label) => label.name === "status:blocked")) status = "blocked";
    else if (issue.labels.some((label) => label.name === "status:in-progress"))
      status = "in-progress";
  }
  return {
    id: `issue-${issue.number}`,
    title: issue.title,
    description:
      issue.state_reason === "not_planned"
        ? "Issue encerrada sem implementação; requer revisão do plano."
        : (issue.body ?? undefined),
    status,
    references: [{ kind: "issue", label: `Issue #${issue.number}`, url: issue.html_url }],
  };
}
