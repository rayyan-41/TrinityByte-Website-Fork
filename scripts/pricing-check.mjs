/* Verify the engagement plan picker: keyboard operation (ARIA tabs pattern),
   live panel swap, and reduced-motion safety. */
import { chromium } from "playwright";

const browser = await chromium.launch();
let problems = 0;

/* ---- keyboard ---- */
{
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto("http://localhost:3003/", { waitUntil: "networkidle", timeout: 60000 }).catch(() => {});
  await page.waitForTimeout(3000);
  const y = await page.evaluate(
    () => document.querySelector("#engagement").getBoundingClientRect().top + window.scrollY
  );
  await page.evaluate((t) => window.scrollTo(0, t), y + 430);
  await page.waitForTimeout(1200);

  const head = () => page.evaluate(() => document.querySelector("#plan-panel h3").innerText);

  await page.locator("[role=tab]").first().focus();
  const start = await head();

  await page.keyboard.press("ArrowDown");
  await page.waitForTimeout(450);
  const down = await head();

  await page.keyboard.press("End");
  await page.waitForTimeout(450);
  const end = await head();

  await page.keyboard.press("ArrowDown");
  await page.waitForTimeout(450);
  const wrapped = await head();

  const ok = down !== start && end !== down && wrapped === start;
  if (!ok) problems++;
  console.log(`${ok ? "✓" : "✗"} keyboard: start="${start}" ↓="${down}" End="${end}" wrap="${wrapped}"`);
  await page.close();
}

/* ---- reduced motion ---- */
{
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.emulateMedia({ reducedMotion: "reduce" });
  const errors = [];
  page.on("pageerror", (e) => errors.push(String(e).slice(0, 140)));
  page.on("console", (m) => m.type() === "error" && errors.push(m.text().slice(0, 140)));

  await page.goto("http://localhost:3003/", { waitUntil: "networkidle", timeout: 60000 }).catch(() => {});
  await page.waitForTimeout(2500);
  const y = await page.evaluate(
    () => document.querySelector("#engagement").getBoundingClientRect().top + window.scrollY
  );
  await page.evaluate((t) => window.scrollTo(0, t), y + 430);
  await page.waitForTimeout(1000);

  await page.locator("[role=tab]").nth(2).click();
  await page.waitForTimeout(600);

  const state = await page.evaluate(() => ({
    panel: document.querySelector("#plan-panel h3").innerText,
    gridOpacity: getComputedStyle(document.querySelector("[data-model-grid]")).opacity,
    points: document.querySelectorAll("#plan-panel li").length,
  }));

  const ok = state.panel.length > 0 && parseFloat(state.gridOpacity) > 0.9 && state.points > 0 && errors.length === 0;
  if (!ok) problems++;
  console.log(
    `${ok ? "✓" : "✗"} reduced motion: panel="${state.panel}" gridOpacity=${state.gridOpacity} points=${state.points} errors=${errors.length || "none"}`
  );
  await page.close();
}

console.log(problems === 0 ? "\nALL CLEAN" : `\n${problems} issue(s)`);
await browser.close();
