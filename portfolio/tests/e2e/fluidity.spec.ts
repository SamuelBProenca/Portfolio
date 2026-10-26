import { expect, test } from "@playwright/test";

test("text links draw only a thin underline with 300ms hover and keyboard feedback", async ({
  page,
  isMobile,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  for (const route of [
    {
      path: "/",
      selectors: [
        ".button-secondary",
        ".work-section .text-link",
        ".project-accordion__repository",
        ".contact-links a",
        ".site-footer a",
      ],
    },
    { path: "/projetos", selectors: [".project-entry__detail"] },
    { path: "/projetos/octocards", selectors: [".project-plan__source a"] },
  ]) {
    await page.goto(route.path);
    for (const selector of route.selectors) {
      if (selector === ".project-accordion__repository") {
        await page.getByRole("button", { name: /OctoCards/ }).click();
        await page.locator(".project-accordion").evaluate(async (element) => {
          await new Promise(requestAnimationFrame);
          await Promise.all(
            element.getAnimations({ subtree: true }).map((animation) => animation.finished),
          );
        });
      }
      const link = page.locator(selector).first();
      await link.evaluate((element) =>
        element.scrollIntoView({ block: "center", behavior: "instant" }),
      );
      // Measure underline stability after the section's separate entrance has finished.
      await expect
        .poll(() =>
          link.evaluate((element) => {
            const section = element.closest("[data-scroll-reveal]");
            return section ? Number(getComputedStyle(section).opacity) : 1;
          }),
        )
        .toBe(1);
      const scale = () =>
        link.evaluate(
          (element) => new DOMMatrixReadOnly(getComputedStyle(element, "::after").transform).a,
        );
      await expect.poll(scale).toBe(0);
      const geometry = () =>
        link.evaluate((element) => {
          const bounds = element.getBoundingClientRect();
          return {
            x: bounds.x + scrollX,
            y: bounds.y + scrollY,
            width: bounds.width,
            height: bounds.height,
          };
        });
      const before = await geometry();
      const style = await link.evaluate((element) => {
        const underline = getComputedStyle(element, "::after");
        return {
          height: parseFloat(underline.height),
          duration: parseFloat(underline.transitionDuration),
          origin: underline.transformOrigin,
        };
      });
      expect(style.height).toBe(2);
      expect(style.duration).toBe(0.3);
      expect(style.origin).toMatch(/^0px /);
      if (isMobile) {
        await page.keyboard.press("Tab");
        await link.focus();
      } else {
        await link.hover();
      }
      await expect.poll(scale, { intervals: [16] }).toBeGreaterThan(0);
      expect(await scale()).toBeLessThan(1);
      await expect.poll(scale).toBe(1);
      expect(await geometry()).toEqual(before);
      await page.mouse.move(0, 0);
      await link.evaluate((element: HTMLElement) => element.blur());
      await expect.poll(scale).toBe(0);
    }
  }
});

test("accordion height and opacity progress in both directions without exposing closing links", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/#projetos");
  const item = page.locator(".project-accordion__item").first();
  expect(
    await item
      .locator(".project-accordion__reveal")
      .evaluate((element) => parseFloat(getComputedStyle(element).transitionDuration)),
  ).toBe(0.3);
  const samples = await item.evaluate(async (element) => {
    const panel = element.querySelector<HTMLElement>(".project-accordion__reveal")!;
    const trigger = element.querySelector<HTMLButtonElement>("button")!;
    const initialHeight = panel.getBoundingClientRect().height;
    async function toggle() {
      trigger.click();
      await new Promise(requestAnimationFrame);
      const inert = panel.inert;
      const frames: { height: number; opacity: number }[] = [];
      const start = performance.now();
      while (performance.now() - start < 450) {
        await new Promise(requestAnimationFrame);
        frames.push({
          height: panel.getBoundingClientRect().height,
          opacity: Number(getComputedStyle(panel).opacity),
        });
      }
      return { inert, frames };
    }
    const close = await toggle();
    const open = await toggle();
    return { initialHeight, close, open };
  });
  for (const direction of [samples.close, samples.open]) {
    expect(
      direction.frames.some(
        (frame) => frame.height > 1 && frame.height < samples.initialHeight - 1,
      ),
    ).toBe(true);
    expect(direction.frames.some((frame) => frame.opacity > 0 && frame.opacity < 1)).toBe(true);
  }
  expect(samples.close.inert).toBe(true);
  expect(samples.open.inert).toBe(false);
  expect(samples.close.frames.at(-1)!.height).toBe(0);
  expect(samples.open.frames.at(-1)!.height).toBeCloseTo(samples.initialHeight, 0);
  const trigger = item.getByRole("button");
  await trigger.click();
  await page.keyboard.press("Tab");
  await expect(page.getByRole("button", { name: /OctoCards/ })).toBeFocused();
});

test("accordion reverses interrupted transitions and accommodates content and viewport changes", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/#projetos");
  await page.locator(".project-accordion").evaluate(async (element) => {
    const buttons = element.querySelectorAll<HTMLButtonElement>(".project-accordion__trigger");
    for (const index of [1, 0, 1, 0, 1, 1, 1]) {
      buttons[index].click();
      await new Promise(requestAnimationFrame);
      await new Promise(requestAnimationFrame);
    }
  });
  const panel = page.getByRole("region", { name: /OctoCards/ });
  await expect(page.locator(".project-accordion").getByRole("region")).toHaveCount(1);
  await expect
    .poll(() => panel.evaluate((element) => Number(getComputedStyle(element).opacity)))
    .toBe(1);
  await expect
    .poll(() =>
      page
        .locator('.project-accordion__reveal[aria-hidden="true"]')
        .evaluateAll((elements) =>
          elements.every((element) => element.getBoundingClientRect().height === 0),
        ),
    )
    .toBe(true);
  const initialHeight = await panel.evaluate((element) => element.getBoundingClientRect().height);
  await panel.locator(".featured-copy p").evaluate((element) => {
    element.textContent += " Mais contexto sobre as decisões de engenharia.".repeat(90);
  });
  expect(await panel.evaluate((element) => element.getBoundingClientRect().height)).toBeGreaterThan(
    initialHeight,
  );
  await page.setViewportSize({ width: 320, height: 900 });
  const geometry = await panel.evaluate((element) => ({
    height: element.clientHeight,
    contentHeight: element.querySelector<HTMLElement>(".project-accordion__clip")!.scrollHeight,
  }));
  expect(Math.abs(geometry.height - geometry.contentHeight)).toBeLessThanOrEqual(1);
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth - innerWidth),
  ).toBeLessThanOrEqual(1);
});

test("the selected navigation underline draws progressively when the route changes", async ({
  page,
  isMobile,
}) => {
  test.skip(
    isMobile,
    "Mobile disclosure entry is covered by the current-section test; route continuity is visible on desktop.",
  );
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  const link = page.locator('.desktop-nav a[href="/projetos"]');
  await link.evaluate((element) => {
    const target = element as HTMLElement & { samples: number[] };
    target.samples = [];
    const observer = new MutationObserver(() => {
      if (!target.hasAttribute("aria-current")) return;
      observer.disconnect();
      const start = performance.now();
      function sample() {
        target.samples.push(new DOMMatrixReadOnly(getComputedStyle(target, "::after").transform).a);
        if (performance.now() - start < 450) requestAnimationFrame(sample);
      }
      sample();
    });
    observer.observe(target, { attributes: true, attributeFilter: ["aria-current"] });
  });
  await page.getByRole("link", { name: "Explore meus projetos" }).click();
  await expect(link).toHaveAttribute("aria-current", "page");
  await expect
    .poll(() =>
      link.evaluate((element) =>
        (element as HTMLElement & { samples: number[] }).samples.some(
          (value) => value > 0 && value < 1,
        ),
      ),
    )
    .toBe(true);
  await expect
    .poll(() =>
      link.evaluate(
        (element) => new DOMMatrixReadOnly(getComputedStyle(element, "::after").transform).a,
      ),
    )
    .toBe(1);
  const bounds = await link.evaluate((element) => ({
    underline: parseFloat(getComputedStyle(element, "::after").width),
    link: element.getBoundingClientRect().width,
  }));
  expect(bounds.underline).toBeCloseTo(bounds.link, 1);
});

test("button fills progress and reverse with transforms while preserving their text", async ({
  page,
  isMobile,
}) => {
  test.skip(isMobile, "Touch uses press and keyboard feedback, with hover intentionally disabled.");
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  const button = page.locator(".button-primary");
  const color = await button.evaluate((element) => getComputedStyle(element).color);
  const scale = () =>
    button.evaluate(
      (element) => new DOMMatrixReadOnly(getComputedStyle(element, "::before").transform).a,
    );
  await button.hover();
  await expect.poll(scale, { intervals: [16] }).toBeGreaterThan(0);
  expect(await scale()).toBeLessThan(1);
  await expect.poll(scale).toBe(1);
  await page.mouse.move(0, 0);
  await expect.poll(scale, { intervals: [16] }).toBeLessThan(1);
  expect(await scale()).toBeGreaterThan(0);
  await expect.poll(scale).toBe(0);
  expect(await button.evaluate((element) => getComputedStyle(element).color)).toBe(color);
});

test("marquee repeats seamlessly at every viewport and pauses without resetting position", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  for (const width of [320, 820, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
    const geometry = await page.locator(".intro-strip__track").evaluate(async (element) => {
      const animation = element.getAnimations()[0];
      animation.pause();
      await animation.ready;
      const timing = animation.effect!.getTiming();
      const duration = Number(timing.duration);
      animation.currentTime = 0;
      const groups = element.querySelectorAll<HTMLElement>("ul");
      const initial = groups[0].getBoundingClientRect();
      const viewport = element.parentElement!.clientWidth;
      animation.currentTime = duration - 0.01;
      const next = groups[1].getBoundingClientRect();
      animation.currentTime = duration;
      const reset = groups[0].getBoundingClientRect();
      animation.play();
      return {
        duration,
        easing: timing.easing,
        iterations: timing.iterations,
        firstWidth: initial.width,
        nextWidth: next.width,
        viewport,
        seamDelta: next.left - initial.left,
        resetDelta: reset.left - initial.left,
      };
    });
    expect(geometry.easing).toBe("linear");
    expect(geometry.iterations).toBe(Infinity);
    expect(geometry.firstWidth).toBe(geometry.nextWidth);
    expect(geometry.firstWidth).toBeGreaterThanOrEqual(geometry.viewport);
    expect(Math.abs(geometry.seamDelta)).toBeLessThan(1);
    expect(Math.abs(geometry.resetDelta)).toBeLessThan(1);
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth - innerWidth),
    ).toBeLessThanOrEqual(1);
  }
  // Timeline seeking above intentionally uses WAAPI play-state overrides.
  // Reload before verifying that the real UI controls the CSS animation.
  await page.reload();
  const button = page.getByRole("button", { name: "Pausar faixa de especialidades" });
  await button.click();
  const paused = await page.locator(".intro-strip__track").evaluate(async (element) => {
    const animation = element.getAnimations()[0];
    await animation.ready;
    const before = Number(animation.currentTime);
    await new Promise(requestAnimationFrame);
    await new Promise(requestAnimationFrame);
    return { before, after: Number(animation.currentTime), state: animation.playState };
  });
  expect(paused.state).toBe("paused");
  expect(paused.before).toBe(paused.after);
  await page.getByRole("button", { name: "Retomar faixa de especialidades" }).click();
  await expect
    .poll(() =>
      page
        .locator(".intro-strip__track")
        .evaluate((element) => Number(element.getAnimations()[0].currentTime)),
    )
    .toBeGreaterThan(paused.after);
});

test("reduced motion shows the full static strip and changes accordion state immediately", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 320, height: 900 });
  await page.goto("/");
  const strip = page.getByRole("region", { name: "Especialidades" });
  await expect(strip.getByRole("button")).toHaveCount(0);
  await expect(strip.getByRole("listitem")).toHaveCount(4);
  expect(
    await strip
      .locator(".intro-strip__track")
      .evaluate((element) => getComputedStyle(element).animationName),
  ).toBe("none");
  const viewport = await strip
    .locator(".intro-strip__viewport")
    .evaluate((element) => ({ client: element.clientWidth, content: element.scrollWidth }));
  expect(viewport.content).toBeLessThanOrEqual(viewport.client);
  const trigger = page.getByRole("button", { name: /Curriculum Studio/ });
  await trigger.click();
  const panel = page.locator(".project-accordion__reveal").first();
  await expect
    .poll(() => panel.evaluate((element) => element.getBoundingClientRect().height))
    .toBe(0);
  expect(
    await panel.evaluate((element) =>
      Math.max(...getComputedStyle(element).transitionDuration.split(",").map(parseFloat)),
    ),
  ).toBeLessThanOrEqual(0.01);
  expect(await panel.evaluate((element) => getComputedStyle(element).transitionDelay)).toBe("0s");
  await trigger.press("Enter");
  await expect(page.getByRole("region", { name: /Curriculum Studio/ })).toBeVisible();
});
