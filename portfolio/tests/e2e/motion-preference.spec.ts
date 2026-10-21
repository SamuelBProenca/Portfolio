import { expect, test } from "@playwright/test";

test("explicit opt-in restores real animation under a reduced-motion browser and survives navigation", async ({
  page,
  isMobile,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const track = page.locator(".intro-strip__track");
  expect(await track.evaluate((element) => getComputedStyle(element).animationName)).toBe("none");
  await page.getByRole("button", { name: "Ativar animações" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-motion", "full");
  await expect(page.getByRole("button", { name: "Pausar faixa de especialidades" })).toBeVisible();
  const motion = await track.evaluate(async (element) => {
    const before = new DOMMatrixReadOnly(getComputedStyle(element).transform).m41;
    for (let index = 0; index < 20; index++) await new Promise(requestAnimationFrame);
    return { before, after: new DOMMatrixReadOnly(getComputedStyle(element).transform).m41 };
  });
  expect(motion.after).toBeLessThan(motion.before - 1);
  const action = page.locator(".button-primary");
  await action.scrollIntoViewIfNeeded();
  if (isMobile) {
    await page.keyboard.press("Tab");
    await action.focus();
  } else {
    await action.hover();
  }
  const progress = await action.evaluate(async (element) => {
    const frames: { elapsed: number; scale: number }[] = [];
    const start = performance.now();
    while (performance.now() - start < 560) {
      await new Promise(requestAnimationFrame);
      frames.push({
        elapsed: performance.now() - start,
        scale: new DOMMatrixReadOnly(getComputedStyle(element, "::before").transform).a,
      });
    }
    return frames;
  });
  expect(
    progress.some(
      (frame) => frame.elapsed > 100 && frame.elapsed < 250 && frame.scale > 0 && frame.scale < 0.8,
    ),
  ).toBe(true);
  expect(progress.at(-1)!.scale).toBe(1);
  await page.goto("/sobre");
  await expect(page.locator("html")).toHaveAttribute("data-motion", "full");
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-motion", "full");
  await page.getByRole("button", { name: "Reduzir movimento" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-motion", "system");
  expect(await page.evaluate(() => localStorage.getItem("portfolio:full-motion"))).toBeNull();
  await page.goto("/");
  await expect
    .poll(() => track.evaluate((element) => getComputedStyle(element).animationName))
    .toBe("none");
});

test("motion opt-in works during the visit when browser storage is blocked", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.addInitScript(() => {
    for (const method of ["getItem", "setItem", "removeItem"]) {
      Object.defineProperty(Storage.prototype, method, {
        value: () => {
          throw new DOMException("Storage blocked", "SecurityError");
        },
      });
    }
  });
  await page.goto("/");
  await page.getByRole("button", { name: "Ativar animações" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-motion", "full");
  await expect
    .poll(() =>
      page
        .locator(".intro-strip__track")
        .evaluate((element) => getComputedStyle(element).animationName),
    )
    .toBe("intro-marquee");
  await page.getByRole("button", { name: "Reduzir movimento" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-motion", "system");
  await expect
    .poll(() =>
      page
        .locator(".intro-strip__track")
        .evaluate((element) => getComputedStyle(element).animationName),
    )
    .toBe("none");
});
