import { expect, test, type Page } from "@playwright/test";

async function observeFirstLoad(page: Page) {
  const scripts: string[] = [];
  const prefetches: string[] = [];
  page.on("request", (request) => {
    if (request.resourceType() === "script") scripts.push(request.url());
    if (new URL(request.url()).searchParams.has("_rsc")) prefetches.push(request.url());
  });
  const response = await page.goto("/");
  expect(response?.status()).toBe(200);
  const html = await response!.text();
  const initialScripts = new Set(
    [...html.matchAll(/(?:src|href)="([^"]+\.js(?:\?[^"]*)?)"/g)].map(
      (match) => new URL(match[1].replaceAll("&amp;", "&"), page.url()).href,
    ),
  );
  return { extraScripts: () => scripts.filter((url) => !initialScripts.has(url)), prefetches };
}

test("first load needs no animation downloads or speculative page requests", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  const requests = await observeFirstLoad(page);
  await expect(page.locator("html")).toHaveAttribute("data-scroll-progress", "ready");
  await expect(page.locator("html")).toHaveAttribute("data-scroll-reveals", "deferred");
  await page.waitForLoadState("networkidle");
  expect(requests.extraScripts()).toEqual([]);
  expect(requests.prefetches).toEqual([]);
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

  await page.evaluate(() => scrollTo({ top: 600, behavior: "instant" }));
  await expect(page.locator("html")).toHaveAttribute("data-scroll-reveals", "ready");
  expect(requests.extraScripts().length).toBeGreaterThan(0);
});

test("reduced motion does not download the animation library even when scrolling", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  const requests = await observeFirstLoad(page);
  await expect(page.locator("html")).toHaveAttribute("data-scroll-reveals", "ready");
  await page.evaluate(() => scrollTo({ top: 700, behavior: "instant" }));
  await page.waitForLoadState("networkidle");
  expect(requests.extraScripts()).toEqual([]);
  await expect(page.locator(".work-intro")).toHaveCSS("opacity", "1");
});

test("failed optional animation chunks leave content and native scrolling usable", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("data-scroll-reveals", "deferred");
  await page.route("**/*.js", (route) => route.abort());
  await page.evaluate(() => scrollTo({ top: 700, behavior: "instant" }));
  await expect(page.locator("html")).not.toHaveAttribute("data-scroll-reveals");
  await expect(page.locator("html")).toHaveAttribute("data-scroll-progress", "ready");
  await expect(page.locator(".work-intro")).toHaveCSS("opacity", "1");
  expect(await page.evaluate(() => scrollY)).toBeGreaterThan(0);
  expect(
    await page
      .locator("[data-scroll-reveal]")
      .evaluateAll((elements) =>
        elements.every((element) => Number(getComputedStyle(element).opacity) === 1),
      ),
  ).toBe(true);
});

test.describe("without JavaScript", () => {
  test.use({ javaScriptEnabled: false });

  test("the first screen and project links work without waiting for hydration", async ({
    page,
  }) => {
    const response = await page.goto("/");
    expect(response?.status()).toBe(200);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.locator(".hero-description")).toBeVisible();
    await expect(page.locator("html")).not.toHaveAttribute("data-scroll-progress");
    await page.getByRole("link", { name: "Explore meus projetos", exact: true }).click();
    await expect(page).toHaveURL(/\/projetos$/);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  });
});
