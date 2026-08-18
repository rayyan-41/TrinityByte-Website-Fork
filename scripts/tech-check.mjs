/* Verify the Technologies section: same five groups, same tools, hover expand. */
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";

mkdirSync("screenshots/tech", { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
const errors = [];
page.on("pageerror", (e) => errors.push(String(e).slice(0, 150)));
page.on("console", (m) => m.type() === "error" && errors.push(m.text().slice(0, 150)));

await page.goto("http://localhost:3003/", { waitUntil: "networkidle", timeout: 60000 }).catch(() => {});
await page.waitForTimeout(3500);

const y = await page.evaluate(() => {
  const el = document.querySelector('[aria-label="Technologies and industries"]');
  return el.getBoundingClientRect().top + window.scrollY;
});

await page.evaluate(async (target) => {
  const start = window.scrollY;
  for (let i = 1; i <= 26; i++) {
    window.scrollTo(0, start + ((target - start) * i) / 26);
    await new Promise((r) => setTimeout(r, 26));
  }
}, y + 260);
await page.waitForTimeout(1600);
await page.screenshot({ path: "screenshots/tech/rows.png" });

const rows = await page.evaluate(() =>
  [...document.querySelectorAll("[data-tech-row] h3")].map((h) => ({
    title: h.textContent.trim(),
    tools: h.parentElement.querySelector("p")?.textContent.trim(),
  }))
);
console.log(JSON.stringify(rows, null, 1));

/* hover expands the row */
const firstRow = page.locator("[data-tech-row] h3").first();
const box = await firstRow.boundingBox();
const heightBefore = await page.evaluate(
  () => document.querySelector("[data-tech-row] h3").closest("div.relative").getBoundingClientRect().height
);
await page.mouse.move(box.x + 40, box.y + 10);
await page.waitForTimeout(700);
const heightAfter = await page.evaluate(
  () => document.querySelector("[data-tech-row] h3").closest("div.relative").getBoundingClientRect().height
);
await page.screenshot({ path: "screenshots/tech/rows-hover.png" });

console.log(`\nrow height: rest=${Math.round(heightBefore)} hovered=${Math.round(heightAfter)}`);
console.log(heightAfter > heightBefore ? "✓ row expands on hover" : "✗ row did not expand");
console.log("errors:", errors.length ? errors.join(" | ") : "none");

await browser.close();
