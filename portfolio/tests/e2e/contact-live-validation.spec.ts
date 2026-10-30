import { expect, test } from "@playwright/test";

test("a same-origin browser POST reaches real contact validation without sending email", async ({
  page,
}) => {
  await page.goto("/");
  // No route interception: exercise the actual browser headers and Next handler.
  // Empty input is rejected before quota consumption or provider delivery.
  const result = await page.evaluate(async () => {
    const response = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "{}",
    });
    return { status: response.status, body: await response.json() };
  });
  expect(result.status).toBe(400);
  expect(result.body.error).toBe("Revise os campos indicados.");
  expect(Object.keys(result.body.fields)).toEqual(["name", "email", "subject", "message"]);
});
