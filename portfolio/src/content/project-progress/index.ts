import { octocardsPlan } from "./octocards";
import type { ProjectProgressSource } from "@/types/project-progress";
export { octocardsPlan } from "./octocards";

export const localProjectProgress: ProjectProgressSource = {
  async load(projectId) {
    return projectId === octocardsPlan.id ? octocardsPlan : null;
  },
};
