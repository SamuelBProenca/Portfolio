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
  await expect(works.getByRole("button")).toHaveCount(2);
  await expect(works.getByRole("button", { name: /Curriculum Studio/ })).toBeVisible();
  await expect(works.getByRole("button", { name: /OctoCards/ })).toBeVisible();
  await expect(works.getByText("OpsCLI", { exact: true })).toHaveCount(0);
  await page.goto("/projetos");
  for (const title of ["Curriculum Studio", "OctoCards", "OpsCLI", "Design Patterns Dojo"]) {
    await expect(page.getByRole("heading", { name: title, exact: true })).toBeVisible();
  }
  await expect(page.locator(".repository-languages")).toHaveCount(3);
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
