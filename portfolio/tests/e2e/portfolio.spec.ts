import { expect, test as base } from "@playwright/test";

const routes = [
  { path: "/", label: "Início", heading: /Desenvolvo aplicações completas/ },
  { path: "/projetos", label: "Projetos", heading: /Projetos/ },
  { path: "/sobre", label: "Sobre", heading: /Da infraestrutura/ },
  { path: "/escrita", label: "Escrita", heading: /Artigos, estudos e ensaios/ },
];

const test = base.extend<{ browserErrors: string[] }>({
  browserErrors: [
    async ({ page }, use) => {
      const errors: string[] = [];
      page.on("pageerror", (error) => errors.push(error.message));
      page.on("console", (message) => {
        if (message.type() === "error") errors.push(message.text());
      });
      await use(errors);
      expect(errors, "The browser should not report runtime or console errors").toEqual([]);
    },
    { auto: true },
  ],
});

for (const route of routes) {
  test(`${route.path} renders its content and assets without horizontal overflow`, async ({
    page,
    isMobile,
  }) => {
    const response = await page.goto(route.path);
    expect(response?.status()).toBe(200);
    await expect(page).toHaveTitle(/Samuel/);
    await expect(page.locator("html")).toHaveAttribute("lang", "pt-BR");
    await expect(page.getByRole("main")).toBeVisible();
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(route.heading);
    await expect(page.locator('meta[name="description"]')).toHaveAttribute("content", /\S+/);

    const images = page.locator("main img");
    for (const image of await images.all()) {
      await image.scrollIntoViewIfNeeded();
      await expect(image).toHaveAttribute("alt", /\S+/);
      await expect
        .poll(() =>
          image.evaluate(
            (element: HTMLImageElement) => element.complete && element.naturalWidth > 0,
          ),
        )
        .toBe(true);
    }

    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - window.innerWidth,
    );
    expect(overflow, "Content must fit the viewport").toBeLessThanOrEqual(1);

    if (isMobile) await page.getByRole("button", { name: "Abrir menu" }).click();
    const navigation = page.getByRole("navigation", {
      name: isMobile ? "Menu para celular" : "Menu principal",
    });
    await expect(navigation.getByRole("link", { name: route.label, exact: true })).toHaveAttribute(
      "aria-current",
      "page",
    );
    await expect(navigation.locator('[aria-current="page"]')).toHaveCount(1);
  });
}

test("primary navigation reaches every page and closes the mobile menu", async ({
  page,
  isMobile,
}) => {
  await page.goto("/");

  for (const route of [...routes.slice(1), routes[0]]) {
    if (isMobile) await page.getByRole("button", { name: "Abrir menu" }).click();
    const navigation = page.getByRole("navigation", {
      name: isMobile ? "Menu para celular" : "Menu principal",
    });
    await navigation.getByRole("link", { name: route.label, exact: true }).click();
    await expect(page).toHaveURL(new RegExp(`${route.path === "/" ? "/$" : `${route.path}$`}`));
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(route.heading);
    if (isMobile)
      await expect(page.getByRole("button", { name: "Abrir menu" })).toHaveAttribute(
        "aria-expanded",
        "false",
      );
  }
});

test("contact actions expose professional email, GitHub and section destinations", async ({
  page,
  isMobile,
}) => {
  await page.goto("/");
  const contact = page.locator("#contato");
  await expect(contact.getByRole("link", { name: "Enviar e-mail", exact: true })).toHaveAttribute(
    "href",
    "mailto:samuelbrito782@gmail.com",
  );
  const github = contact.getByRole("link", { name: /GitHub/ });
  await expect(github).toHaveAttribute("href", "https://github.com/SamuelBProenca");
  await expect(github).toHaveAttribute("rel", /noopener/);

  await page.goto("/sobre");
  if (isMobile) {
    await page.getByRole("button", { name: "Abrir menu" }).click();
    await page
      .getByRole("navigation", { name: "Menu para celular" })
      .getByRole("link", { name: "Contato", exact: true })
      .click();
    await expect(page.getByRole("button", { name: "Abrir menu" })).toHaveAttribute(
      "aria-expanded",
      "false",
    );
  } else {
    await page
      .locator(".site-header")
      .getByRole("link", { name: /Entrar em contato/ })
      .click();
  }
  await expect(page).toHaveURL(/\/#contato$/);
  await expect(contact).toBeInViewport();
});

test("mobile menu supports keyboard dismissal and restores focus", async ({ page, isMobile }) => {
  test.skip(!isMobile, "The desktop navigation is always visible.");
  await page.goto("/");
  const toggle = page.getByRole("button", { name: "Abrir menu" });
  await toggle.click();
  await expect(page.getByRole("button", { name: "Fechar menu" })).toHaveAttribute(
    "aria-expanded",
    "true",
  );
  const navigation = page.getByRole("navigation", { name: "Menu para celular" });
  await navigation.getByRole("link", { name: "Projetos", exact: true }).focus();
  await page.keyboard.press("Escape");
  await expect(toggle).toHaveAttribute("aria-expanded", "false");
  await expect(toggle).toBeFocused();
  await expect(navigation).toBeHidden();
  await expect(page.locator("body")).not.toHaveClass(/menu-open/);
});

for (const route of routes) {
  const legacyPath = route.path === "/" ? "/index.html" : `${route.path}/index.html`;
  test(`legacy ${legacyPath} redirects to ${route.path}`, async ({ page }) => {
    await page.goto(legacyPath);
    await expect(page).toHaveURL(new RegExp(`${route.path === "/" ? "/$" : `${route.path}$`}`));
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(route.heading);
  });
}

test("legacy URLs preserve bookmarked section anchors", async ({ page }) => {
  await page.goto("/projetos/index.html#curriculum");
  await expect(page).toHaveURL(/\/projetos#curriculum$/);
  await expect(page.locator("#curriculum")).toBeInViewport();
});

test("selected works switches one accordion panel at a time", async ({ page, isMobile }) => {
  await page.goto("/#projetos");
  if (isMobile) await page.setViewportSize({ width: 320, height: 800 });
  const works = page.locator(".project-accordion");
  await expect(works.getByRole("button", { name: /Curriculum Studio/ })).toHaveAttribute(
    "aria-expanded",
    "true",
  );

  for (const project of [
    {
      name: "GreatMaker",
      repository: "GreatMaker",
      headline: "Referências de design reunidas em um só projeto.",
    },
    {
      name: "OctoCards",
      repository: "OctoCards",
      headline: "Dados do GitHub prontos para alimentar suas próprias interfaces.",
    },
    {
      name: "LinkKeeper",
      repository: "LinkKeeper",
      headline: "Links classificados, com prazo e ciclo de vida.",
    },
  ]) {
    const trigger = works.getByRole("button", { name: new RegExp(project.name) });
    await trigger.click();
    await expect(trigger).toHaveAttribute("aria-expanded", "true");
    await expect(works.getByRole("region")).toHaveCount(1);
    const panel = works.getByRole("region", { name: new RegExp(project.name) });
    await expect(panel.getByRole("heading", { name: project.headline })).toBeVisible();
    await expect(panel.getByRole("link", { name: /Ver repositório/ })).toHaveAttribute(
      "href",
      `https://github.com/SamuelBProenca/${project.repository}`,
    );
    const box = await panel.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.x + box!.width).toBeLessThanOrEqual(page.viewportSize()!.width);
  }

  await expect(works.getByRole("button")).toHaveCount(4);
  const active = works.getByRole("button", { name: /LinkKeeper/ });
  await active.press("Enter");
  await expect(works.getByRole("region")).toHaveCount(0);
  await active.press("ArrowDown");
  const next = works.getByRole("button", { name: /Curriculum Studio/ });
  await expect(next).toBeFocused();
  await next.press("Space");
  await expect(next).toHaveAttribute("aria-expanded", "true");
});

test("contact keeps the number out of view and offers email until the real form is configured", async ({
  page,
}) => {
  const contactRequests: string[] = [];
  page.on("request", (request) => {
    if (new URL(request.url()).pathname === "/api/contact") contactRequests.push(request.url());
  });
  await page.goto("/#contato");
  const contact = page.getByRole("region", { name: /Tem uma aplicação para desenvolver/ });
  const action = contact.getByRole("link", { name: "Enviar e-mail", exact: true });
  await expect(action).toBeVisible();
  await expect(contact.getByText("samuelbrito782@gmail.com", { exact: true })).toBeVisible();
  await expect(contact.locator('a[href*="wa.me"]')).toHaveCount(0);
  await expect(contact.getByText(/98958/)).toHaveCount(0);
  await expect(contact.getByRole("link", { name: "Descrever meu projeto" })).toHaveCount(0);
  await expect(contact.getByRole("form")).toHaveCount(0);
  await expect(action).not.toHaveAttribute("target");
  await expect(action).toHaveAccessibleDescription(/Abre seu aplicativo de e-mail/);
  await expect(action).toHaveAttribute("href", "mailto:samuelbrito782@gmail.com");
  expect(contactRequests).toEqual([]);
  await expect(page.locator('#contato a[href^="https://www.linkedin.com/in/"]')).toBeVisible();
});

test("contact endpoint rejects invalid input and cross-site requests", async ({ request }) => {
  const invalid = await request.post("/api/contact", {
    data: { name: "", email: "invalid", subject: "", message: "short" },
  });
  expect(invalid.status()).toBe(400);
  expect(Object.keys((await invalid.json()).fields)).toHaveLength(4);
  const crossSite = await request.post("/api/contact", {
    headers: { origin: "https://attacker.example" },
    data: {},
  });
  expect(crossSite.status()).toBe(403);
});

test("engineering plan supports nested tasks, references, dependencies and reduced motion", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.getByRole("link", { name: "Consultar plano técnico", exact: true }).click();
  await expect(page).toHaveURL(/\/projetos\/octocards$/);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("DADOS COM");
  await expect(page.getByRole("progressbar")).toHaveAttribute("value", "16");
  await expect(page.getByRole("progressbar")).toHaveAttribute("max", "25");
  const groups = page.locator(".project-plan__group");
  await groups.nth(0).locator(":scope > summary").click();
  const reliability = groups.nth(1);
  await reliability.locator(":scope > summary").focus();
  await page.keyboard.press("Enter");
  await expect(reliability).toHaveAttribute("open", "");
  const validation = page.locator("#octocards-task-request-validation");
  await validation.locator(":scope > summary").click();
  const nested = page.locator("#octocards-task-validate-repository");
  await nested.locator(":scope > summary").focus();
  await page.keyboard.press("Space");
  await expect(nested.getByText(/Rejeitar valores vazios/)).toBeVisible();
  const duration = await reliability
    .locator(":scope > summary > .plan-toggle")
    .evaluate((element) => getComputedStyle(element).transitionDuration);
  expect(parseFloat(duration)).toBeLessThanOrEqual(0.01);
  await validation
    .locator(":scope > .project-task__body > .task-dependencies")
    .getByRole("link", { name: /Expor consultas/ })
    .click();
  await expect(groups.nth(0)).toHaveAttribute("open", "");
  const endpoint = page.locator("#octocards-task-card-endpoints");
  await expect(endpoint).toHaveAttribute("open", "");
  await expect(endpoint.locator(":scope > summary")).toBeFocused();
  const fallback = page.locator("#octocards-task-default-values");
  await fallback.locator(":scope > summary").click();
  await expect(fallback.getByRole("link", { name: /PR #5/ })).toHaveAttribute(
    "href",
    "https://github.com/SamuelBProenca/OctoCards/pull/5",
  );
  await expect(page.locator(".project-plan input, .project-plan select")).toHaveCount(0);
});

test("approved portrait and new sections fit tablet layouts", async ({ page }) => {
  await page.setViewportSize({ width: 820, height: 1180 });
  for (const route of ["/", "/sobre", "/projetos/octocards"]) {
    await page.goto(route);
    if (route === "/") {
      const portrait = page.locator(".hero-aside img");
      await expect(portrait).toHaveAttribute("src", /samuel-approved/);
      await expect(portrait).toHaveAttribute("width", "1122");
      expect(await portrait.evaluate((element) => getComputedStyle(element).objectFit)).toBe(
        "contain",
      );
    }
    await expect(page.locator('img[src*="samuel-hero"], img[src*="samuel-about"]')).toHaveCount(0);
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth),
    ).toBeLessThanOrEqual(1);
  }
});
