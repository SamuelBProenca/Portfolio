import { expect, test } from "@playwright/test";

for (const legacyOptIn of [false, true]) {
  test(`sections visibly fade and rise at 300ms with ${legacyOptIn ? "the saved opt-in" : "automatic motion"}`, async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: legacyOptIn ? "reduce" : "no-preference" });
    if (legacyOptIn) {
      await page.addInitScript(() => localStorage.setItem("portfolio:full-motion", "true"));
    }
    await page.goto("/");
    await expect(page.locator("html")).toHaveAttribute("data-scroll-reveals", "ready");
    const target = page.locator(".about-content");
    await expect(target).toHaveCSS("opacity", "0");
    const frames = await target.evaluate(async (element) => {
      const height = document.documentElement.scrollHeight;
      const top = element.getBoundingClientRect().top + scrollY - 20;
      scrollTo({ top: top - innerHeight * 0.75, behavior: "instant" });
      const samples: { opacity: number; y: number }[] = [];
      const start = performance.now();
      while (performance.now() - start < 450) {
        await new Promise(requestAnimationFrame);
        const style = getComputedStyle(element);
        samples.push({
          opacity: Number(style.opacity),
          y: new DOMMatrixReadOnly(style.transform).f,
        });
      }
      return { samples, height, finalHeight: document.documentElement.scrollHeight };
    });
    expect(
      frames.samples.some(({ opacity, y }) => opacity > 0 && opacity < 1 && y > 0 && y < 20),
    ).toBe(true);
    expect(frames.samples.at(-1)).toEqual({ opacity: 1, y: 0 });
    expect(frames.finalHeight).toBe(frames.height);
    expect(await target.getAttribute("style")).not.toMatch(/opacity|transform/);
    await page.evaluate(() => scrollTo({ top: 0, behavior: "instant" }));
    await expect(target).toHaveCSS("opacity", "1");
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth - innerWidth),
    ).toBeLessThanOrEqual(1);
    await expect(page.locator(".intro-strip__track")).toHaveCSS("animation-name", "intro-marquee");
    await expect(page.locator(".button-primary")).toHaveCSS("transition-duration", "0.3s");
  });
}

test("system changes reveal content immediately and can enable future entrances", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("data-scroll-reveals", "ready");
  const target = page.locator(".about-content");
  await expect(target).toHaveCSS("opacity", "1");
  await expect(target).toHaveCSS("transform", "none");
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await expect(target).toHaveCSS("opacity", "0");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(target).toHaveCSS("opacity", "1");
  await expect(target).toHaveCSS("transform", "none");
});

test("keyboard focus never lands inside an invisible section", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("data-scroll-reveals", "ready");
  const section = page.locator(".writing-col").first();
  await expect(section).toHaveCSS("opacity", "0");
  const link = section.locator("a");
  await link.focus();
  await expect(link).toBeFocused();
  await expect(section).toHaveCSS("opacity", "1");
  await expect(section).toHaveCSS("transform", "none");
});

test("client navigation initializes entrances for the new page and restores them on return", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("data-scroll-reveals", "ready");
  await page.locator(".button-primary").click();
  await expect(page).toHaveURL(/\/projetos$/);
  await expect(page.locator(".empty-editorial")).toHaveCSS("opacity", "0");
  await page.locator(".empty-editorial").scrollIntoViewIfNeeded();
  await expect(page.locator(".empty-editorial")).toHaveCSS("opacity", "1");
  await page.locator(".wordmark").click();
  await expect(page).toHaveURL(/\/$/);
  await expect(page.locator(".about-content")).toHaveCSS("opacity", "0");
  await expect(page.locator(".hero-description")).toHaveCSS("opacity", "1");
});

test.describe("without JavaScript", () => {
  test.use({ javaScriptEnabled: false });

  test("section content remains visible without the enhancement", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator(".about-content")).toHaveCSS("opacity", "1");
    await expect(page.locator(".about-content")).toHaveCSS("transform", "none");
    await expect(page.locator(".writing-col").first()).toHaveCSS("opacity", "1");
  });
});
