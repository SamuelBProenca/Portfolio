import { expect, test, type Page } from "@playwright/test";

function progress(page: Page) {
  return page.locator(".scroll-progress__fill").evaluate((element) => {
    const root = document.documentElement;
    return {
      actual: new DOMMatrixReadOnly(getComputedStyle(element).transform).a,
      expected: scrollY / Math.max(1, root.scrollHeight - innerHeight),
    };
  });
}

async function expectSynchronized(page: Page) {
  await expect
    .poll(async () => {
      const { actual, expected } = await progress(page);
      return Math.abs(actual - expected);
    })
    .toBeLessThan(0.005);
}

async function scrollWithKeyboard(page: Page, edge: "top" | "bottom") {
  const finished = page.evaluate(
    (edge) =>
      new Promise<void>((resolve) => {
        function onEnd() {
          const target = edge === "top" ? 0 : document.documentElement.scrollHeight - innerHeight;
          if (Math.abs(scrollY - target) >= 1) return;
          document.removeEventListener("scrollend", onEnd);
          resolve();
        }
        document.addEventListener("scrollend", onEnd);
      }),
    edge,
  );
  await page.keyboard.press(edge === "top" ? "Control+Home" : "Control+End");
  await finished;
}

test("the themed indicator follows wheel and keyboard scrolling without shifting the layout", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("data-scroll-progress", "ready");
  const track = page.locator(".scroll-progress__track");
  await expect(track).toBeVisible();
  await expect(page.locator(".scroll-progress")).toHaveAttribute("aria-hidden", "true");
  const appearance = await track.evaluate((element) => ({
    top: element.getBoundingClientRect().top,
    height: element.getBoundingClientRect().height,
    position: getComputedStyle(element).position,
    fill: getComputedStyle(element.firstElementChild!).backgroundColor,
    accent: getComputedStyle(document.documentElement).getPropertyValue("--accent").trim(),
    scrollbar: getComputedStyle(document.documentElement).scrollbarColor,
  }));
  expect(appearance).toMatchObject({ top: 0, height: 4, position: "fixed" });
  expect(appearance.fill).toBe("rgb(201, 78, 55)");
  expect(appearance.accent).toBe("#c94e37");
  expect(appearance.scrollbar).toBe("rgba(0, 0, 0, 0) rgba(0, 0, 0, 0)");
  const width = await page.locator(".hero-grid").evaluate((element) => {
    const ready = element.getBoundingClientRect().width;
    delete document.documentElement.dataset.scrollProgress;
    const native = element.getBoundingClientRect().width;
    document.documentElement.dataset.scrollProgress = "ready";
    return { ready, native };
  });
  expect(width.ready).toBe(width.native);
  await expectSynchronized(page);
  await page.mouse.move(200, 200);
  await page.mouse.wheel(0, 650);
  await expect.poll(async () => (await progress(page)).actual).toBeGreaterThan(0);
  await expectSynchronized(page);
  await scrollWithKeyboard(page, "bottom");
  // Finish the native smooth scroll before issuing the opposite keyboard command.
  await expect.poll(async () => (await progress(page)).expected).toBe(1);
  await expect.poll(async () => (await progress(page)).actual).toBe(1);
  await expectSynchronized(page);
  await scrollWithKeyboard(page, "top");
  await expect.poll(async () => (await progress(page)).expected).toBe(0);
  await expect.poll(async () => (await progress(page)).actual).toBe(0);
  expect(await track.evaluate((element) => element.getBoundingClientRect().top)).toBe(0);
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth - innerWidth),
  ).toBeLessThanOrEqual(1);
});

test("progress recalculates after accordion changes, dynamic content and client navigation", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("data-scroll-progress", "ready");
  await page.evaluate(() => scrollTo({ top: 800, behavior: "instant" }));
  await expectSynchronized(page);
  const trigger = page.locator(".project-accordion__trigger").first();
  for (const expanded of [false, true]) {
    await trigger.evaluate((element: HTMLButtonElement) => element.click());
    await expect(trigger).toHaveAttribute("aria-expanded", String(expanded));
    await expect
      .poll(() =>
        page
          .locator(".project-accordion__reveal")
          .first()
          .evaluate((element) => Number(getComputedStyle(element).opacity)),
      )
      .toBe(expanded ? 1 : 0);
    await expectSynchronized(page);
  }
  await page.locator(".work-intro p").evaluate((element) => {
    element.textContent += " Contexto adicional de engenharia.".repeat(150);
  });
  await expectSynchronized(page);
  await page.getByRole("link", { name: "Sobre mim", exact: true }).click();
  await expect(page).toHaveURL(/\/sobre$/);
  // URL updates can precede the new page's commit and Next's scroll restoration.
  await expect(page.locator(".page-hero")).toBeVisible();
  await expect.poll(() => page.evaluate(() => scrollY)).toBe(0);
  await expect(page.locator(".scroll-progress__fill")).toHaveCount(1);
  await scrollWithKeyboard(page, "bottom");
  await expect.poll(async () => (await progress(page)).expected).toBeGreaterThan(0.99);
  await expect.poll(async () => (await progress(page)).actual).toBeGreaterThan(0.99);
  await expectSynchronized(page);
  await page.locator(".wordmark").click();
  await expect(page).toHaveURL(/\/$/);
  await expect(page.locator(".scroll-progress__fill")).toHaveCount(1);
  await expectSynchronized(page);
});

test("native smooth scrolling survives content height changes in both directions", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("data-scroll-progress", "ready");

  for (const edge of ["bottom", "top"] as const) {
    await page.evaluate((edge) => {
      scrollTo({
        top: edge === "bottom" ? document.documentElement.scrollHeight : 0,
        behavior: "smooth",
      });
      // A late layout change must not cancel the browser's active smooth scroll.
      window.setTimeout(() => {
        document.body.style.paddingBottom = edge === "bottom" ? "4px" : "8px";
      }, 80);
    }, edge);
    if (edge === "bottom") {
      await expect.poll(async () => (await progress(page)).expected).toBeGreaterThan(0.99);
    } else {
      await expect.poll(async () => (await progress(page)).expected).toBe(0);
    }
    await expectSynchronized(page);
  }
});

test("reduced motion keeps progress tied directly to the user's scroll position", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("data-scroll-progress", "ready");
  await expect(page.locator(".scroll-progress__track")).toBeVisible();
  expect(
    await page
      .locator(".intro-strip__track")
      .evaluate((element) => getComputedStyle(element).animationName),
  ).toBe("none");
  await page.evaluate(() => scrollTo({ top: 900, behavior: "instant" }));
  await expect.poll(async () => (await progress(page)).actual).toBeGreaterThan(0);
  await expectSynchronized(page);
});

test("forced colors retains the native scrollbar", async ({ page }) => {
  await page.emulateMedia({ forcedColors: "active" });
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("data-scroll-progress", "ready");
  await expect(page.locator(".scroll-progress__track")).toBeHidden();
  expect(
    await page.locator("html").evaluate((element) => getComputedStyle(element).scrollbarColor),
  ).toBe("auto");
});

test("existing animations survive ScrollTrigger initialization, refresh and route changes", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.addInitScript(() => localStorage.setItem("portfolio:full-motion", "true"));
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("data-scroll-progress", "ready");

  async function expectExistingMotion() {
    await expect(page.locator("html")).toHaveAttribute("data-motion", "full");
    const button = page.locator(".button-primary");
    await page.keyboard.press("Tab");
    await button.focus();
    const frames = await button.evaluate(async (element) => {
      const strip = document.querySelector(".intro-strip__track")!;
      const before = new DOMMatrixReadOnly(getComputedStyle(strip).transform).e;
      const scales: number[] = [];
      const start = performance.now();
      while (performance.now() - start < 400) {
        await new Promise(requestAnimationFrame);
        scales.push(new DOMMatrixReadOnly(getComputedStyle(element, "::before").transform).a);
      }
      return {
        scales,
        before,
        after: new DOMMatrixReadOnly(getComputedStyle(strip).transform).e,
      };
    });
    expect(frames.scales.some((scale) => scale > 0 && scale < 1)).toBe(true);
    expect(frames.scales.at(-1)).toBe(1);
    expect(frames.after).toBeLessThan(frames.before - 1);
    await button.evaluate((element: HTMLElement) => element.blur());
    await page.mouse.move(0, 0);
    await expect
      .poll(() =>
        button.evaluate(
          (element) => new DOMMatrixReadOnly(getComputedStyle(element, "::before").transform).a,
        ),
      )
      .toBe(0);
  }

  await expectExistingMotion();
  await page
    .locator(".project-accordion__trigger")
    .first()
    .evaluate((element: HTMLButtonElement) => element.click());
  await expect
    .poll(() =>
      page
        .locator(".project-accordion__reveal")
        .first()
        .evaluate((element) => element.getBoundingClientRect().height),
    )
    .toBe(0);
  await expectExistingMotion();
  await page.getByRole("link", { name: "Sobre mim", exact: true }).click();
  await expect(page).toHaveURL(/\/sobre$/);
  await page.locator(".wordmark").click();
  await expect(page).toHaveURL(/\/$/);
  await expectExistingMotion();
});

test.describe("without JavaScript", () => {
  test.use({ javaScriptEnabled: false });

  test("the native scrollbar and page remain usable", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("html")).not.toHaveAttribute("data-scroll-progress");
    await expect(page.locator(".scroll-progress__track")).toBeHidden();
    expect(
      await page.locator("html").evaluate((element) => getComputedStyle(element).scrollbarColor),
    ).toBe("auto");
    await page.keyboard.press("Control+End");
    await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(0);
  });
});
