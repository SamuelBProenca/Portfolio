import { describe, expect, it } from "vitest";
import {
  aggregateStatus,
  planTasks,
  summarizeProgress,
  validatePlan,
} from "@/lib/project-progress";
import { octocardsPlan } from "@/content/project-progress";

describe("project progress", () => {
  it("counts only leaf tasks and marks only evidenced OctoCards work complete", () => {
    const summary = summarizeProgress(planTasks(octocardsPlan));
    expect(summary).toEqual({
      total: 12,
      percent: 25,
      counts: { planned: 9, "in-progress": 0, blocked: 0, completed: 3 },
    });
    expect(() => validatePlan(octocardsPlan)).not.toThrow();
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
