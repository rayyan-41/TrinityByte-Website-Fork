import { chromium } from "playwright";
import { mkdirSync } from "node:fs";
import { join } from "node:path";

const args = process.argv.slice(2);
const flag = (name, fallback) => {
  const index = args.indexOf(`--${name}`);
  return index >= 0 ? args[index + 1] : fallback;
};
const width = Number(flag("w", "1440"));
const height = Number(flag("h", "1000"));
const out = join(process.cwd(), flag("out", "screenshots/trinity/partnership"));
mkdirSync(out, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width, height } });
const errors = [];
page.on("console", (message) => message.type() === "error" && errors.push(message.text()));
page.on("pageerror", (error) => errors.push(String(error)));

await page.goto("http://localhost:3003/", { waitUntil: "networkidle", timeout: 60000 });
await page.waitForTimeout(3500);
const section = page.locator('section[aria-label="How we partner"]');
await section.scrollIntoViewIfNeeded();
await page.waitForTimeout(1500);
await section.screenshot({ path: join(out, `partner-${width}.png`) });

if (width >= 768) {
  const firstCard = page.locator("[data-team-card]").first();
  await firstCard.hover();
  await page.waitForTimeout(800);
  await section.screenshot({ path: join(out, `partner-${width}-hover.png`) });
}

const report = await page.evaluate((viewportWidth) => ({
  documentWidth: document.documentElement.scrollWidth,
  viewportWidth,
  cards: [...document.querySelectorAll("[data-team-card]")].map((card) => {
    const rect = card.getBoundingClientRect();
    return { width: Math.round(rect.width), height: Math.round(rect.height) };
  }),
}), width);

console.log(JSON.stringify(report));
console.log(errors.length ? errors.join("\n") : "no console errors");
await browser.close();
