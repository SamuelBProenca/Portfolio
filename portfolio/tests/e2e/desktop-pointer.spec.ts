import { expect, test } from "@playwright/test";

test("desktop mouse hover animates fills and navigation even with a coarse primary pointer", async ({
  page,
  isMobile,
}, testInfo) => {
  test.skip(
    isMobile,
    "Desktop layout regression; touch-to-mouse switching is verified separately.",
  );
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  if (testInfo.project.use.hasTouch) {
    expect(await page.evaluate(() => matchMedia("(pointer: coarse)").matches)).toBe(true);
    expect(await page.evaluate(() => matchMedia("(hover: hover)").matches)).toBe(false);
  }
  const action = page.locator(".button-primary");
  await action.hover();
  await expect(page.locator("html")).toHaveAttribute("data-input", "mouse");
  const fill = await action.evaluate(async (element) => {
    const samples: number[] = [];
    for (let index = 0; index < 40; index++) {
      await new Promise(requestAnimationFrame);
      samples.push(new DOMMatrixReadOnly(getComputedStyle(element, "::before").transform).a);
    }
    return samples;
  });
  expect(fill.some((value) => value > 0 && value < 1)).toBe(true);
  expect(fill.at(-1)).toBe(1);
  const link = page
    .getByRole("navigation", { name: "Menu principal" })
    .getByRole("link", { name: "Sobre", exact: true });
  await link.hover();
  const underline = await link.evaluate(async (element) => {
    const samples: number[] = [];
    for (let index = 0; index < 40; index++) {
      await new Promise(requestAnimationFrame);
      samples.push(new DOMMatrixReadOnly(getComputedStyle(element, "::after").transform).a);
    }
    return samples;
  });
  expect(underline.some((value) => value > 0 && value < 1)).toBe(true);
  expect(underline.at(-1)).toBe(1);
});

test("touch leaves no sticky hover and a subsequent mouse movement restores the fill", async ({
  page,
}, testInfo) => {
  test.skip(
    !testInfo.project.use.hasTouch,
    "This regression needs both touchscreen and mouse input.",
  );
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("data-motion", "system");
  const action = page.locator(".button-primary");
  await action.evaluate((element) =>
    element.addEventListener("click", (event) => event.preventDefault()),
  );
  await action.tap();
  await expect(page.locator("html")).toHaveAttribute("data-input", "touch");
  await expect
    .poll(() =>
      action.evaluate(
        (element) => new DOMMatrixReadOnly(getComputedStyle(element, "::before").transform).a,
      ),
    )
    .toBe(0);
  await action.hover();
  await expect(page.locator("html")).toHaveAttribute("data-input", "mouse");
  await expect
    .poll(() =>
      action.evaluate(
        (element) => new DOMMatrixReadOnly(getComputedStyle(element, "::before").transform).a,
      ),
    )
    .toBe(1);
  await page.mouse.move(0, 0);
  await expect
    .poll(() =>
      action.evaluate(
        (element) => new DOMMatrixReadOnly(getComputedStyle(element, "::before").transform).a,
      ),
    )
    .toBe(0);
});
