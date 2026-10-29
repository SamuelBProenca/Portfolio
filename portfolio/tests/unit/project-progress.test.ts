import { describe, expect, it } from "vitest";
import {
  aggregateStatus,
  flattenTasks,
  planTasks,
  summarizeProgress,
  validatePlan,
} from "@/lib/project-progress";
import { octocardsPlan } from "@/content/project-progress";

describe("project progress", () => {
  it("counts only leaf tasks and marks only evidenced OctoCards work complete", () => {
    const summary = summarizeProgress(planTasks(octocardsPlan));
    expect(summary).toEqual({
      total: 25,
      percent: 64,
      counts: { planned: 9, "in-progress": 0, blocked: 0, completed: 16 },
    });
    expect(() => validatePlan(octocardsPlan)).not.toThrow();
  });
  it("keeps shared budgets, privacy, contract and upstream advisory open after local limits pass", () => {
    const tasks = new Map(flattenTasks(planTasks(octocardsPlan)).map((task) => [task.id, task]));
    expect(tasks.get("batch-limits")?.status).toBe("completed");
    expect(tasks.get("test-command")?.status).toBe("completed");
    for (const id of [
      "bounded-retries",
      "portfolio-live",
      "global-github-budget",
      "global-batch-policy",
      "external-image-privacy",
      "github-secret-scanning",
      "contract-sync",
      "manual-script",
      "dev-advisory",
    ])
      expect(tasks.get(id)?.status).toBe("planned");
  });
  it("does not infer active work from a mixture of complete and planned tasks", () => {
    expect(
      aggregateStatus([
        { id: "one", title: "One", status: "completed" },
        { id: "two", title: "Two", status: "planned" },
      ]),
    ).toBe("planned");
    expect(summarizeProgress([]).percent).toBe(0);
  });
  it("detects missing dependencies and cycles", () => {
    expect(() =>
      validatePlan({
        ...octocardsPlan,
        groups: [
          {
            id: "g",
            title: "G",
            tasks: [{ id: "a", title: "A", status: "planned", dependsOn: ["missing"] }],
          },
        ],
      }),
    ).toThrow("Unknown dependency");
    expect(() =>
      validatePlan({
        ...octocardsPlan,
        groups: [
          {
            id: "g",
            title: "G",
            tasks: [
              { id: "a", title: "A", status: "planned", dependsOn: ["b"] },
              { id: "b", title: "B", status: "planned", dependsOn: ["a"] },
            ],
          },
        ],
      }),
    ).toThrow("Cyclic");
  });
});
