import { readFile, writeFile, rename } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import ts from "typescript";

// Load trusted local modules without adding another TypeScript runtime dependency.
async function loadLocalModule(path) {
  const source = await readFile(new URL(path, import.meta.url), "utf8");
  const compiled = ts.transpileModule(source, {
    compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ES2022 },
  }).outputText;
  return import(`data:text/javascript;base64,${Buffer.from(compiled).toString("base64")}`);
}

async function syncProjects() {
  const [{ fetchRepositoryCard }, { catalogProjects }] = await Promise.all([
    loadLocalModule("../src/lib/repository-data.ts"),
    loadLocalModule("../src/content/projects.ts"),
  ]);
  const options = {
    apiOrigin: process.env.OCTOCARDS_API_ORIGIN,
    githubToken: process.env.GITHUB_TOKEN,
  };
  const cards = await Promise.all(
    catalogProjects
      .filter((project) => project.repository)
      .map((project) => {
        const [owner, name] = new URL(project.repository).pathname.slice(1).split("/");
        return fetchRepositoryCard({ owner, name }, options);
      }),
  );
  const target = fileURLToPath(new URL("../src/content/repository-snapshot.json", import.meta.url));
  await writeFile(
    `${target}.tmp`,
    JSON.stringify(
      {
        reviewedAt: new Date().toISOString(),
        source: options.apiOrigin ? "octocards" : "github",
        cards,
      },
      null,
      2,
    ) + "\n",
  );
  await rename(`${target}.tmp`, target);
  console.log(
    `Updated ${cards.length} public repository snapshots via ${options.apiOrigin ? "OctoCards" : "GitHub"}.`,
  );
}

await syncProjects().catch((error) => {
  console.error(
    "Project data sync failed; previous snapshot kept:",
    error instanceof Error ? error.message : "unknown error",
  );
  process.exitCode = 1;
});
