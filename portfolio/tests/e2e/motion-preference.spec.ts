import { expect, test } from "@playwright/test";

test("animations start automatically at 300ms without an activation control", async ({
  page,
  isMobile,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.addInitScript(() => localStorage.setItem("portfolio:full-motion", "false"));
  await page.goto("/");
  await expect(page.locator(".motion-control")).toHaveCount(0);
  const track = page.locator(".intro-strip__track");
  const motion = await track.evaluate(async (element) => {
    const before = new DOMMatrixReadOnly(getComputedStyle(element).transform).m41;
    for (let index = 0; index < 20; index++) await new Promise(requestAnimationFrame);
    return { before, after: new DOMMatrixReadOnly(getComputedStyle(element).transform).m41 };
  });
  expect(motion.after).toBeLessThan(motion.before - 1);
  const action = page.locator(".button-primary");
  expect(
    await action.evaluate((element) => getComputedStyle(element, "::before").transitionDuration),
  ).toBe("0.3s");
  if (isMobile) {
    await page.keyboard.press("Tab");
    await action.focus();
  } else {
    await action.hover();
  }
  const progress = await action.evaluate(async (element) => {
    const frames: number[] = [];
    const start = performance.now();
    while (performance.now() - start < 400) {
      await new Promise(requestAnimationFrame);
      frames.push(new DOMMatrixReadOnly(getComputedStyle(element, "::before").transform).a);
    }
    return frames;
  });
  expect(progress.some((scale) => scale > 0 && scale < 1)).toBe(true);
  expect(progress.at(-1)).toBe(1);
  await page.goto("/sobre");
  await page.reload();
  await expect(page.locator(".motion-control")).toHaveCount(0);
  expect(
    await page
      .locator(".contact-outline")
      .evaluate((element) => getComputedStyle(element, "::before").transitionDuration),
  ).toBe("0.3s");
});

test("system reduced motion applies immediately without a previous explicit opt-in", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.locator(".motion-control")).toHaveCount(0);
  const track = page.locator(".intro-strip__track");
  const animation = () => track.evaluate((element) => getComputedStyle(element).animationName);
  expect(await animation()).toBe("none");
  expect(
    await page
      .locator(".button-primary")
      .evaluate((element) => parseFloat(getComputedStyle(element, "::before").transitionDuration)),
  ).toBeLessThanOrEqual(0.01);
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await expect.poll(animation).toBe("intro-marquee");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect.poll(animation).toBe("none");
});

test("a previous explicit opt-in still animates without restoring the activation button", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.addInitScript(() => localStorage.setItem("portfolio:full-motion", "true"));
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("data-motion", "full");
  await expect(page.locator(".motion-control")).toHaveCount(0);
  const track = page.locator(".intro-strip__track");
  const movement = await track.evaluate(async (element) => {
    const before = new DOMMatrixReadOnly(getComputedStyle(element).transform).m41;
    for (let index = 0; index < 20; index++) await new Promise(requestAnimationFrame);
    return { before, after: new DOMMatrixReadOnly(getComputedStyle(element).transform).m41 };
  });
  expect(movement.after).toBeLessThan(movement.before - 1);
  const button = page.locator(".button-primary");
  await page.keyboard.press("Tab");
  await button.focus();
  const scales = await button.evaluate(async (element) => {
    const values: number[] = [];
    const start = performance.now();
    while (performance.now() - start < 400) {
      await new Promise(requestAnimationFrame);
      values.push(new DOMMatrixReadOnly(getComputedStyle(element, "::before").transform).a);
    }
    return values;
  });
  expect(scales.some((value) => value > 0 && value < 1)).toBe(true);
  expect(scales.at(-1)).toBe(1);
  await page.goto("/sobre");
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-motion", "full");
  expect(
    await page
      .locator(".contact-outline")
      .evaluate((element) => getComputedStyle(element, "::before").transitionDuration),
  ).toBe("0.3s");
});

for (const blocked of ["all", "writes"] as const) {
  test(`automatic motion needs no storage when ${blocked} storage operations fail`, async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await page.addInitScript((blocked) => {
      const methods = blocked === "all" ? ["getItem", "setItem", "removeItem"] : ["setItem"];
      for (const method of methods) {
        Object.defineProperty(Storage.prototype, method, {
          value: () => {
            throw new DOMException("Storage unavailable", "QuotaExceededError");
          },
        });
      }
    }, blocked);
    await page.goto("/");
    await expect(page.locator(".motion-control")).toHaveCount(0);
    const track = page.locator(".intro-strip__track");
    expect(await track.evaluate((element) => getComputedStyle(element).animationName)).toBe(
      "intro-marquee",
    );
    await page.emulateMedia({ reducedMotion: "reduce" });
    await expect
      .poll(() => track.evaluate((element) => getComputedStyle(element).animationName))
      .toBe("none");
  });
}
