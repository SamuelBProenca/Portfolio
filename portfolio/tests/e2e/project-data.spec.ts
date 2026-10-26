import { test, expect } from "@playwright/test";

test("commercial highlights stay curated and the catalog exposes public repository data", async ({
  page,
}) => {
  const browserGithubRequests: string[] = [];
  page.on("request", (request) => {
    if (new URL(request.url()).hostname === "api.github.com")
      browserGithubRequests.push(request.url());
  });
  await page.goto("/#projetos");
  const works = page.locator(".project-accordion");
  await expect(works.getByRole("button")).toHaveCount(4);
  await expect(works.getByRole("button", { name: /Curriculum Studio/ })).toBeVisible();
  await expect(works.getByRole("button", { name: /OctoCards/ })).toBeVisible();
  await works.getByRole("button", { name: /GreatMaker/ }).click();
  const hub = works.getByRole("region", { name: /GreatMaker/ });
  await expect(hub.getByText(/M1 funciona localmente/)).toBeVisible();
  const screenshot = hub.locator('img[src*="greatmaker-reference-hub"]');
  await expect(screenshot).toBeVisible();
  await expect
    .poll(() => screenshot.evaluate((element: HTMLImageElement) => element.naturalWidth))
    .toBeGreaterThan(0);
  await works.getByRole("button", { name: /LinkKeeper/ }).click();
  const links = works.getByRole("region", { name: /LinkKeeper/ });
  await expect(links.getByText(/camada SQLite salva e consulta/)).toBeVisible();
  await expect(links.getByText(/CLI atual executa somente validação/)).toBeVisible();
  await expect(works.getByText("OpsCLI", { exact: true })).toHaveCount(0);
  await page.goto("/projetos");
  for (const title of [
    "Curriculum Studio",
    "GreatMaker",
    "OctoCards",
    "LinkKeeper",
    "IcarusRoc",
    "OpsCLI",
    "Design Patterns Dojo",
  ]) {
    await expect(page.getByRole("heading", { name: title, exact: true })).toBeVisible();
  }
  await expect(page.locator(".repository-languages")).toHaveCount(6);
  await expect(
    page.getByRole("link", { name: "Repositório de GreatMaker", exact: true }),
  ).toHaveAttribute("href", "https://github.com/SamuelBProenca/GreatMaker");
  await expect(
    page.getByRole("link", { name: "Repositório de LinkKeeper", exact: true }),
  ).toHaveAttribute("href", "https://github.com/SamuelBProenca/LinkKeeper");
  await page.goto("/projetos/octocards");
  await expect(page.getByRole("link", { name: /Código de referência 6f9ec4b/ })).toBeVisible();
  const source = page.getByRole("region", { name: "Dados do repositório OctoCards" });
  await source.locator("summary").click();
  await expect(source.locator("pre")).toContainText("# OctoCards");
  expect(browserGithubRequests).toEqual([]);
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth - innerWidth),
  ).toBeLessThanOrEqual(1);
});
