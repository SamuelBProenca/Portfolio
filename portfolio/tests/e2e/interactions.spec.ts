import { expect, test } from "@playwright/test";

test("the hero headline stays within the canvas at narrow, tablet and desktop widths", async ({
  page,
}) => {
  for (const width of [320, 390, 820, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto("/");
    const right = await page.locator(".hero-title > span:last-child").evaluate((element) => {
      const range = document.createRange();
      range.selectNodeContents(element);
      return range.getBoundingClientRect().right;
    });
    expect(right).toBeLessThanOrEqual(width);
  }
});

test("project details identify the parent navigation section on desktop and touch", async ({
  page,
  isMobile,
}) => {
  await page.goto("/projetos/octocards");
  if (isMobile) await page.getByRole("button", { name: "Abrir menu" }).tap();
  const navigation = page.getByRole("navigation", {
    name: isMobile ? "Menu para celular" : "Menu principal",
  });
  const current = navigation.getByRole("link", { name: "Projetos", exact: true });
  await expect(current).toHaveAttribute("aria-current", "location");
  await expect(navigation.locator("[aria-current]")).toHaveCount(1);
  await expect
    .poll(() => current.evaluate((element) => getComputedStyle(element, "::after").transform))
    .toBe("matrix(1, 0, 0, 1, 0, 0)");
  await navigation.getByRole("link", { name: "Sobre", exact: true }).click();
  await expect(page).toHaveURL(/\/sobre$/);
  await page.getByRole("link", { name: "Vamos conversar sobre sua equipe ou projeto" }).click();
  await expect(page).toHaveURL(/\/#contato$/);
  await expect(page.getByRole("link", { name: "Enviar e-mail", exact: true })).toBeInViewport();
});

test("navigation underlines animate on hover and keyboard focus without moving links", async ({
  page,
  isMobile,
}) => {
  test.skip(
    isMobile,
    "Hover is reserved for fine pointers; touch navigation is tested separately.",
  );
  await page.goto("/");
  const navigation = page.getByRole("navigation", { name: "Menu principal" });
  const link = navigation.getByRole("link", { name: "Sobre", exact: true });
  const transform = () =>
    link.evaluate((element) => getComputedStyle(element, "::after").transform);
  await expect.poll(transform).toBe("matrix(0, 0, 0, 1, 0, 0)");
  const box = await link.boundingBox();
  const transition = await link.evaluate((element) => ({
    duration: parseFloat(getComputedStyle(element, "::after").transitionDuration),
    origin: getComputedStyle(element, "::after").transformOrigin,
  }));
  expect(transition.duration).toBe(0.3);
  expect(transition.origin).toMatch(/^0px /);
  await link.hover();
  await expect.poll(transform).toBe("matrix(1, 0, 0, 1, 0, 0)");
  expect(await link.boundingBox()).toEqual(box);
  await page.mouse.move(0, 0);
  await expect.poll(transform).toBe("matrix(0, 0, 0, 1, 0, 0)");
  await navigation.getByRole("link", { name: "Projetos", exact: true }).focus();
  await page.keyboard.press("Tab");
  await expect(link).toBeFocused();
  await expect.poll(transform).toBe("matrix(1, 0, 0, 1, 0, 0)");
  expect(await link.evaluate((element) => getComputedStyle(element).outlineStyle)).toBe("solid");
  await page.keyboard.press("Tab");
  await expect.poll(transform).toBe("matrix(0, 0, 0, 1, 0, 0)");
  await expect
    .poll(() =>
      navigation
        .getByRole("link", { name: "Início", exact: true })
        .evaluate((element) => getComputedStyle(element, "::after").transform),
    )
    .toBe("matrix(1, 0, 0, 1, 0, 0)");
});

test("CTA fills maintain contrast and geometry through hover, focus and press", async ({
  page,
  isMobile,
}) => {
  test.skip(isMobile, "Fine-pointer hover states are intentionally disabled on touch.");
  await page.goto("/");
  for (const selector of [".button-primary", ".contact-outline", "[data-contact-action]"]) {
    const button = page.locator(selector);
    await button.scrollIntoViewIfNeeded();
    const box = await button.boundingBox();
    const colors = await button.evaluate((element) => {
      const style = getComputedStyle(element);
      const luminance = (color: string) => {
        const channels = color
          .match(/[\d.]+/g)!
          .slice(0, 3)
          .map(Number)
          .map((value) => {
            const channel = value / 255;
            return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
          });
        return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
      };
      const text = luminance(style.color);
      return {
        text: style.color,
        ratios: [style.backgroundColor, getComputedStyle(element, "::before").backgroundColor].map(
          (color) => {
            // The header is transparent over the canvas.
            const background = luminance(
              color === "rgba(0, 0, 0, 0)"
                ? getComputedStyle(document.body).backgroundColor
                : color,
            );
            return (Math.max(text, background) + 0.05) / (Math.min(text, background) + 0.05);
          },
        ),
      };
    });
    for (const ratio of colors.ratios) expect(ratio).toBeGreaterThanOrEqual(4.5);
    await button.hover();
    await expect
      .poll(() => button.evaluate((element) => getComputedStyle(element, "::before").transform))
      .toBe("matrix(1, 0, 0, 1, 0, 0)");
    expect(await button.evaluate((element) => getComputedStyle(element).color)).toBe(colors.text);
    expect(await button.boundingBox()).toEqual(box);
    await page.mouse.down();
    await expect
      .poll(() => button.evaluate((element) => getComputedStyle(element).transform))
      .toBe("matrix(1, 0, 0, 1, 0, 1)");
    await page.mouse.move(0, 0);
    await page.mouse.up();
    await button.evaluate((element: HTMLElement) => element.blur());
    await expect
      .poll(() => button.evaluate((element) => getComputedStyle(element, "::before").transform))
      .toBe("matrix(0, 0, 0, 1, 0, 0)");
    await page.keyboard.press("Tab");
    await button.focus();
    await expect
      .poll(() => button.evaluate((element) => getComputedStyle(element, "::before").transform))
      .toBe("matrix(1, 0, 0, 1, 0, 0)");
    expect(await button.evaluate((element) => getComputedStyle(element).outlineStyle)).toBe(
      "solid",
    );
    await button.evaluate((element: HTMLElement) => element.blur());
  }
});

test("reduced motion preserves state feedback without animated movement", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const durations = await page
    .locator(".button-primary, .contact-outline, [data-contact-action], .text-link .arr")
    .evaluateAll((elements) =>
      elements.map((element) => getComputedStyle(element).transitionDuration),
    );
  for (const durationsList of durations) {
    for (const duration of durationsList.split(","))
      expect(parseFloat(duration)).toBeLessThanOrEqual(0.01);
  }
  expect(
    await page
      .locator(".desktop-nav a")
      .first()
      .evaluate((element) => parseFloat(getComputedStyle(element, "::after").transitionDuration)),
  ).toBeLessThanOrEqual(0.01);
  expect(
    await page.locator("html").evaluate((element) => getComputedStyle(element).scrollBehavior),
  ).toBe("auto");
  const action = page.locator(".button-primary");
  await page.keyboard.press("Tab");
  await action.focus();
  await expect
    .poll(() => action.evaluate((element) => getComputedStyle(element, "::before").transform))
    .toBe("matrix(1, 0, 0, 1, 0, 0)");
  expect(
    await action.locator(".arr").evaluate((element) => getComputedStyle(element).transform),
  ).toBe("none");
});

test("email action supports keyboard activation without sending mail (OS handoff intercepted)", async ({
  page,
}) => {
  await page.goto("/#contato");
  const action = page.getByRole("link", { name: "Enviar e-mail", exact: true });
  // Capture activation before the OS handler opens. This does not prove email delivery.
  await action.evaluate((element) => {
    element.addEventListener(
      "click",
      (event) => {
        event.preventDefault();
        element.setAttribute("data-activated-destination", element.getAttribute("href")!);
      },
      { once: true },
    );
  });
  await action.focus();
  await expect(action).toBeFocused();
  expect(await action.evaluate((element) => getComputedStyle(element).outlineStyle)).toBe("solid");
  await action.press("Enter");
  await expect(action).toHaveAttribute(
    "data-activated-destination",
    "mailto:samuelbrito782@gmail.com",
  );
  await expect(page).toHaveURL(/\/#contato$/);
});

test("writing previews keep bookmarked categories without suggesting available articles", async ({
  page,
}) => {
  for (const id of ["engenharia", "ensaios"]) {
    await page.goto(`/escrita#${id}`);
    const collection = page.locator(`#${id}`);
    await expect(collection).toBeInViewport();
    await expect(collection).toHaveAccessibleName(
      id === "engenharia" ? "Engenharia e prática" : "Ensaios e hipóteses",
    );
    await expect(collection.getByText("Publicações em preparação")).toBeVisible();
    await expect(collection.getByRole("link")).toHaveCount(0);
    await expect(
      page.getByText("Ainda não há artigos publicados aqui.", { exact: false }),
    ).toBeVisible();
  }
});
