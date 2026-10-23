import { expect, test } from "@playwright/test";

for (const path of ["/#projetos", "/projetos#curriculum"]) {
  test(`Curriculum Studio opens the application with document navigation from ${path}`, async ({
    page,
  }) => {
    await page.route(/\/curriculumstudio(?:\?.*)?$/, async (route) => {
      // The Flask application owns this route; it must receive a document, not an RSC prefetch.
      expect(route.request().resourceType()).toBe("document");
      await route.fulfill({
        contentType: "text/html; charset=utf-8",
        body: "<!doctype html><html lang='pt-BR'><meta charset='utf-8'><title>Curriculum Studio</title><main>Editor do currículo</main></html>",
      });
    });
    await page.goto(path);
    const scope = path.startsWith("/#")
      ? page.getByRole("region", { name: /Curriculum Studio/ })
      : page.locator("#curriculum");
    const action = scope.getByRole("link", { name: "Abrir Curriculum Studio" });
    await expect(action).toHaveAttribute("href", "/curriculumstudio");
    await expect(page.locator('a[href*="Curriculim_Service"]')).toHaveCount(0);
    await action.click();
    await expect(page).toHaveURL(/\/curriculumstudio$/);
    await expect(page).toHaveTitle("Curriculum Studio");
    await expect(page.getByRole("main")).toHaveText("Editor do currículo");
  });
}
