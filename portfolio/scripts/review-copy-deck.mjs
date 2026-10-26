import { chromium } from "@playwright/test";
import { mkdir, writeFile } from "node:fs/promises";

const phase = process.argv[2] ?? "baseline";
if (!/^[a-z-]+$/.test(phase)) throw new Error("Use a named review phase.");
const origin = "http://127.0.0.1:3400";
const paths = phase.startsWith("deck") ? ["/", "/experimentos/cards"] : ["/"];
const folder = `.cache/copy-deck/${phase}`;
await mkdir(folder, { recursive: true });
const browser = await chromium.launch({ channel: process.env.PLAYWRIGHT_CHANNEL ?? "msedge" });
const samples = [];
try {
  for (const path of paths) {
    for (const [device, width, height] of [
      ["desktop", 1440, 900],
      ["mobile", 390, 844],
    ]) {
      for (let run = 1; run <= 3; run++) {
        const context = await browser.newContext({
          viewport: { width, height },
          reducedMotion: "no-preference",
        });
        const page = await context.newPage();
        const session = await context.newCDPSession(page);
        await session.send("Network.enable");
        await session.send("Network.setCacheDisabled", { cacheDisabled: true });
        await session.send("Network.emulateNetworkConditions", {
          offline: false,
          latency: 150,
          downloadThroughput: 200000,
          uploadThroughput: 100000,
        });
        await session.send("Emulation.setCPUThrottlingRate", { rate: 4 });
        await page.addInitScript(() => {
          window.__reviewLcp = 0;
          new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) window.__reviewLcp = entry.startTime;
          }).observe({ type: "largest-contentful-paint", buffered: true });
        });
        await page.goto(origin + path, { waitUntil: "load" });
        await page.waitForTimeout(3000);
        const result = await page.evaluate(() => {
          const resources = performance.getEntriesByType("resource");
          const navigation = performance.getEntriesByType("navigation")[0];
          return {
            resources: resources.length,
            scriptBytes: resources
              .filter((entry) => entry.initiatorType === "script")
              .reduce((total, entry) => total + entry.transferSize, 0),
            prefetchedPages: resources.filter((entry) =>
              new URL(entry.name).searchParams.has("_rsc"),
            ).length,
            lcpMs: Math.round(window.__reviewLcp),
            loadMs: Math.round(navigation.loadEventEnd),
            scrollY,
          };
        });
        samples.push({ path, device, run, ...result });
        await context.close();
      }
    }
  }
  for (const [device, width, height] of [
    ["desktop", 1440, 900],
    ["mobile", 390, 844],
    ["narrow", 320, 900],
    ["tablet", 760, 1000],
  ]) {
    const context = await browser.newContext({
      viewport: { width, height },
      reducedMotion: "reduce",
    });
    const page = await context.newPage();
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    for (const path of paths) {
      await page.goto(origin + path);
      await page.evaluate(() => scrollTo({ top: 0, behavior: "instant" }));
      const label = path === "/" ? "home" : "deck";
      await page.screenshot({ path: `${folder}/${label}-${device}.png`, fullPage: true });
      if ((await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)) > 1)
        throw new Error(`Overflow: ${path} at ${width}`);
    }
    if (errors.length) throw new Error(errors.join("; "));
    await context.close();
  }
  await writeFile(
    `${folder}/measurements.json`,
    JSON.stringify(
      {
        phase,
        methodology:
          "Three cold production visits per viewport; CPU 4x; latency 150ms; download 200000 B/s; observe load + 3s without scrolling. transferSize includes HTTP overhead. Edge desktop emulation, not a physical mobile device.",
        samples,
      },
      null,
      2,
    ) + "\n",
  );
  console.log(JSON.stringify(samples));
  console.log(`Captures and measurements: ${folder}`);
} finally {
  await browser.close();
}
