import { catalogProjects } from "@/content/projects";
import snapshot from "@/content/repository-snapshot.json";
import {
  fetchRepositoryCard,
  parseRepositoryCard,
  type DataOptions,
  type RepositoryCard,
} from "./repository-data";

export type RepositoryEvidence = {
  card: RepositoryCard;
  source: "github" | "octocards" | "snapshot";
  reviewedAt: string;
};

export async function loadProjectCatalog(
  options: DataOptions = {
    apiOrigin: process.env.OCTOCARDS_API_ORIGIN,
    githubToken: process.env.GITHUB_TOKEN,
  },
) {
  return Promise.all(
    catalogProjects.map(async (project) => {
      let evidence: RepositoryEvidence | undefined;
      if (project.repository) {
        const [owner, name] = new URL(project.repository).pathname.slice(1).split("/");
        const identity = { owner, name };
        try {
          evidence = {
            card: await fetchRepositoryCard(identity, options),
            source: options.apiOrigin ? "octocards" : "github",
            reviewedAt: new Date().toISOString(),
          };
        } catch {
          // Fail per project; a rate-limited source must not remove the rest of the catalog.
          const fallback = snapshot.cards.find((card) => card.name === name);
          if (fallback)
            evidence = {
              card: parseRepositoryCard(fallback, identity),
              source: "snapshot",
              reviewedAt: snapshot.reviewedAt,
            };
        }
      }
      return { ...project, evidence };
    }),
  );
}
