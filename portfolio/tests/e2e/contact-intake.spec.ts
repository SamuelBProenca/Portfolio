import { expect, test } from "@playwright/test";

test("email fallback works without JavaScript and never exposes the phone at narrow or desktop widths", async ({
  browser,
  baseURL,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  try {
    const page = await context.newPage();
    for (const width of [320, 390, 820, 1440]) {
      await page.setViewportSize({ width, height: 1000 });
      await page.goto(`${baseURL}/#contato`);
      const action = page.getByRole("link", { name: "Enviar e-mail", exact: true });
      await expect(action).toBeVisible();
      const box = await action.boundingBox();
      expect(box!.x).toBeGreaterThanOrEqual(0);
      expect(box!.x + box!.width).toBeLessThanOrEqual(width);
      expect(box!.height).toBeGreaterThanOrEqual(44);
      await expect(action).toHaveAttribute("href", "mailto:samuelbrito782@gmail.com");
      await expect(page.locator('#contato a[href*="wa.me"]')).toHaveCount(0);
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(
        width,
      );
    }
  } finally {
    await context.close();
  }
});
