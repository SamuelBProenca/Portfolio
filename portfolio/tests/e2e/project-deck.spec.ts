import { expect, test } from "@playwright/test";

test("Motion is deferred until interaction and can be disabled during a transition", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  const scripts: string[] = [];
  page.on("request", (request) => {
    if (request.resourceType() === "script") scripts.push(request.url());
  });
  await page.goto("/experimentos/cards");
  const deck = page.getByRole("region", { name: "Projetos em cartas" });
  await page.waitForLoadState("networkidle");
  // Next may resolve its initial Image client reference outside HTML script tags.
  // The optional animator must still require a new download after actual intent.
  const initial = new Set(scripts);
  await expect(deck).toHaveAttribute("data-motion-ready", "false");
  const stage = deck.getByRole("group", { name: "Explorar projetos" });
  await stage.focus();
  await expect(deck).toHaveAttribute("data-motion-ready", "true");
  await page.waitForLoadState("networkidle");
  expect(scripts.filter((url) => !initial.has(url)).length).toBeGreaterThan(0);
  await stage.press("ArrowRight");
  await expect(deck.getByRole("heading", { name: "Curriculum Studio", exact: true })).toBeVisible();
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(deck).toHaveAttribute("data-motion-ready", "false");
  await expect
    .poll(() => stage.evaluate((element) => element.getAnimations({ subtree: true }).length))
    .toBe(0);
  await stage.press("End");
  await expect(deck.getByRole("heading", { name: "LinkKeeper", exact: true })).toBeVisible();
});

test("reduced motion avoids optional downloads and preserves the explicit site preference", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/experimentos/cards");
  await page.waitForLoadState("networkidle");
  const lateScripts: string[] = [];
  page.on("request", (request) => {
    if (request.resourceType() === "script") lateScripts.push(request.url());
  });
  const deck = page.getByRole("region", { name: "Projetos em cartas" });
  const stage = deck.getByRole("group", { name: "Explorar projetos" });
  await stage.focus();
  await stage.press("End");
  await page.waitForLoadState("networkidle");
  expect(lateScripts).toEqual([]);
  await expect(deck).toHaveAttribute("data-motion-ready", "false");
  await page.evaluate(() => {
    localStorage.setItem("portfolio:full-motion", "true");
    dispatchEvent(new StorageEvent("storage", { key: "portfolio:full-motion", newValue: "true" }));
  });
  await deck.getByRole("button", { name: "Projeto anterior" }).focus();
  await expect(deck).toHaveAttribute("data-motion-ready", "true");
});

test("failed animation downloads preserve selection and content", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/experimentos/cards");
  const deck = page.getByRole("region", { name: "Projetos em cartas" });
  await expect(deck).toHaveAttribute("data-enhanced", "true");
  await page.route("**/*.js", (route) => route.abort());
  await deck.getByRole("group", { name: "Explorar projetos" }).focus();
  await deck.getByRole("button", { name: "Selecionar OctoCards" }).click();
  await expect(deck.getByRole("heading", { name: "OctoCards", exact: true })).toBeVisible();
  await expect(deck).toHaveAttribute("data-motion-ready", "false");
  await expect(deck.getByRole("link", { name: "Ver documentação técnica" })).toHaveAttribute(
    "href",
    "/projetos/octocards",
  );
});

test("horizontal mouse gestures select once, short and cancelled gestures settle", async ({
  page,
}) => {
  await page.goto("/experimentos/cards");
  const deck = page.getByRole("region", { name: "Projetos em cartas" });
  const image = deck.getByRole("article").locator("figure img");
  await image.scrollIntoViewIfNeeded();
  const box = (await image.boundingBox())!;
  const x = box.x + box.width * 0.8;
  const y = box.y + box.height * 0.4;
  await page.mouse.move(x, y);
  await page.mouse.down();
  await page.mouse.move(x - 25, y, { steps: 4 });
  await page.mouse.up();
  await expect(deck.getByRole("heading", { name: "GreatMaker", exact: true })).toBeVisible();
  await page.mouse.move(x, y);
  await page.mouse.down();
  await page.mouse.move(x - 100, y, { steps: 6 });
  await deck
    .getByRole("group", { name: "Explorar projetos" })
    .dispatchEvent("pointercancel", { pointerId: 1 });
  await page.mouse.up();
  await expect(deck.getByRole("heading", { name: "GreatMaker", exact: true })).toBeVisible();
  await page.mouse.move(x, y);
  await page.mouse.down();
  await page.mouse.move(x - 120, y, { steps: 8 });
  await page.mouse.up();
  await expect(deck.getByRole("heading", { name: "Curriculum Studio", exact: true })).toBeVisible();
  await expect
    .poll(() => deck.locator('li[data-position="current"]').getAttribute("style"))
    .toBe("");
});

test("dragging a repository CTA does not navigate while a normal click still opens it", async ({
  page,
  context,
}) => {
  await context.route("https://github.com/**", (route) =>
    route.fulfill({ body: "Repository navigation test" }),
  );
  await page.goto("/experimentos/cards");
  const deck = page.getByRole("region", { name: "Projetos em cartas" });
  const link = deck.getByRole("link", { name: "Ver repositório de GreatMaker" });
  await link.scrollIntoViewIfNeeded();
  const box = (await link.boundingBox())!;
  const x = box.x + box.width * 0.8;
  const y = box.y + box.height / 2;
  await page.mouse.move(x, y);
  await page.mouse.down();
  await page.mouse.move(x - 90, y, { steps: 6 });
  await page.mouse.up();
  await page.waitForLoadState("networkidle");
  expect(context.pages()).toHaveLength(1);
  await expect(deck.getByRole("heading", { name: "GreatMaker", exact: true })).toBeVisible();
  const popup = page.waitForEvent("popup");
  await link.click();
  const repository = await popup;
  await expect(repository).toHaveURL("https://github.com/SamuelBProenca/GreatMaker");
  await repository.close();
});

test("rapid selection releases animation styles and details retain their natural height", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/experimentos/cards");
  const deck = page.getByRole("region", { name: "Projetos em cartas" });
  const stage = deck.getByRole("group", { name: "Explorar projetos" });
  await stage.focus();
  await expect(deck).toHaveAttribute("data-motion-ready", "true");
  await stage.press("ArrowRight");
  await stage.press("End");
  await stage.press("Home");
  await stage.press("ArrowRight");
  await expect(deck.getByRole("heading", { name: "Curriculum Studio", exact: true })).toBeVisible();
  await expect
    .poll(() =>
      stage.evaluate((element) => ({
        height: element.style.height,
        cardStyles: Array.from(element.querySelectorAll<HTMLElement>("li[data-position]"))
          .map((card) => card.style.cssText)
          .join(""),
      })),
    )
    .toEqual({ height: "", cardStyles: "" });
  const before = (await stage.boundingBox())!.height;
  await deck.getByRole("article").getByText("Detalhes do projeto", { exact: true }).click();
  await expect.poll(async () => (await stage.boundingBox())!.height).toBeGreaterThan(before);
  await stage.focus();
  await stage.press("End");
  const repository = deck.getByRole("link", { name: "Ver repositório de LinkKeeper" });
  await repository.focus();
  await repository.press("Home");
  await expect(stage).toBeFocused();
  await expect(deck.getByRole("link", { name: "Ver repositório de LinkKeeper" })).toHaveCount(0);
});

test("native touch preserves vertical scrolling and advances one project horizontally", async ({
  page,
  context,
  isMobile,
  hasTouch,
}) => {
  test.skip(!hasTouch, "Touch input requires a touch-enabled browser profile.");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/experimentos/cards");
  const deck = page.getByRole("region", { name: "Projetos em cartas" });
  const image = deck.getByRole("article").locator("figure img");
  await image.scrollIntoViewIfNeeded();
  const box = (await image.boundingBox())!;
  const x = box.x + box.width * 0.8;
  const y = Math.min(box.y + box.height / 2, isMobile ? 600 : 800);
  const session = await context.newCDPSession(page);
  async function touch(dx: number, dy: number) {
    await session.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x, y }] });
    for (let step = 1; step <= 8; step++)
      await session.send("Input.dispatchTouchEvent", {
        type: "touchMove",
        touchPoints: [{ x: x + (dx * step) / 8, y: y + (dy * step) / 8 }],
      });
    await session.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
  }
  await touch(-120, 0);
  await expect(deck.getByRole("heading", { name: "Curriculum Studio", exact: true })).toBeVisible();
  await deck.getByRole("article").scrollIntoViewIfNeeded();
  const before = await page.evaluate(() => scrollY);
  const stage = deck.getByRole("group", { name: "Explorar projetos" });
  const viewport = page.viewportSize()!;
  await session.send("Input.dispatchTouchEvent", {
    type: "touchStart",
    touchPoints: [{ x: viewport.width / 2, y: viewport.height * 0.75 }],
  });
  await session.send("Input.dispatchTouchEvent", {
    type: "touchMove",
    touchPoints: [{ x: viewport.width / 2, y: viewport.height * 0.45 }],
  });
  await session.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
  await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(before);
  await expect(deck.getByRole("heading", { name: "Curriculum Studio", exact: true })).toBeVisible();
  await expect(stage).toHaveCSS("touch-action", "pan-y pinch-zoom");
  await session.detach();
});

test("the experimental deck remains separate and supports bounded keyboard selection", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.locator(".project-accordion")).toBeVisible();
  await page.goto("/experimentos/cards");
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
  const deck = page.getByRole("region", { name: "Projetos em cartas" });
  await expect(deck).toHaveAttribute("data-enhanced", "true");
  await expect(deck.getByRole("article")).toHaveCount(1);
  await expect(deck.getByRole("heading", { name: "GreatMaker", exact: true })).toBeVisible();
  const stage = deck.getByRole("group", { name: "Explorar projetos" });
  await stage.focus();
  await stage.press("End");
  await expect(deck.getByRole("heading", { name: "LinkKeeper", exact: true })).toBeVisible();
  await expect(deck.getByRole("button", { name: "Próximo projeto" })).toHaveAttribute(
    "aria-disabled",
    "true",
  );
  await stage.press("Home");
  await stage.press("ArrowRight");
  await expect(deck.getByRole("link", { name: "Abrir Curriculum Studio" })).toHaveAttribute(
    "href",
    "/curriculumstudio",
  );
  await expect(deck.getByRole("link", { name: "Ver repositório de GreatMaker" })).toHaveCount(0);
});

test("all project content fits the supplied viewport widths", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const [width, height] of [
    [320, 900],
    [390, 844],
    [760, 1000],
    [1440, 900],
  ]) {
    await page.setViewportSize({ width, height });
    await page.goto("/experimentos/cards");
    const deck = page.getByRole("region", { name: "Projetos em cartas" });
    const initial = deck.getByRole("article");
    const firstRead = width === 1440 ? initial : initial.getByText(/^Guarde links, imagens/);
    const firstBox = (await firstRead.boundingBox())!;
    expect(firstBox.y + firstBox.height).toBeLessThanOrEqual(height);
    for (const name of ["GreatMaker", "Curriculum Studio", "OctoCards", "LinkKeeper"]) {
      await deck.getByRole("button", { name: `Selecionar ${name}`, exact: true }).click();
      const card = deck.getByRole("article");
      await expect(card.getByRole("heading", { name, exact: true })).toBeVisible();
      const box = await card.boundingBox();
      expect(box!.x).toBeGreaterThanOrEqual(0);
      expect(box!.x + box!.width).toBeLessThanOrEqual(width);
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth - innerWidth),
      ).toBeLessThanOrEqual(1);
    }
  }
});

test.describe("without JavaScript", () => {
  test.use({ javaScriptEnabled: false });
  test("all four projects and their real links are readable without enhancement", async ({
    page,
  }) => {
    await page.goto("/experimentos/cards");
    const deck = page.getByRole("region", { name: "Projetos em cartas" });
    await expect(deck).toHaveAttribute("data-enhanced", "false");
    await expect(deck.getByRole("article")).toHaveCount(4);
    for (const name of ["GreatMaker", "Curriculum Studio", "OctoCards", "LinkKeeper"])
      await expect(deck.getByRole("heading", { name, exact: true })).toBeVisible();
    await expect(deck.getByRole("link", { name: "Abrir Curriculum Studio" })).toHaveAttribute(
      "href",
      "/curriculumstudio",
    );
    await expect(deck.getByRole("link", { name: "Ver repositório de LinkKeeper" })).toHaveAttribute(
      "href",
      "https://github.com/SamuelBProenca/LinkKeeper",
    );
    await expect(deck.getByRole("button")).toHaveCount(0);
  });
});
