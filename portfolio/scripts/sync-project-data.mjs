import { readFile, writeFile, rename } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import ts from "typescript";

async function syncProjects() {
  // Reuse the validated consumer, without adding another TypeScript runtime dependency.
  const source = await readFile(new URL("../src/lib/repository-data.ts", import.meta.url), "utf8");
  const compiled = ts.transpileModule(source, {
    compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ES2022 },
  }).outputText;
  const { fetchRepositoryCard } = await import(
    `data:text/javascript;base64,${Buffer.from(compiled).toString("base64")}`
  );
  const names = ["OctoCards", "OpsCLI", "DesignPatternsDojo"];
  const options = {
    apiOrigin: process.env.OCTOCARDS_API_ORIGIN,
    githubToken: process.env.GITHUB_TOKEN,
  };
  const cards = await Promise.all(
    names.map((name) => fetchRepositoryCard({ owner: "SamuelBProenca", name }, options)),
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
