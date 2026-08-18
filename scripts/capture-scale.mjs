// Capture scale.com hero scroll states as a motion reference.
// Usage: node scripts/capture-scale.mjs
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";
import { join } from "node:path";

const OUT = join(process.cwd(), "screenshots", "reference-scale");
mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto("https://scale.com/", { waitUntil: "networkidle", timeout: 90000 }).catch(() => {});
await page.waitForTimeout(5000);

// hero pin range
const info = await page.evaluate(() => {
  const hero = document.querySelector(".HomeHero");
  const r = hero?.getBoundingClientRect();
  return {
    heroTop: (r?.top ?? 0) + window.scrollY,
    heroH: r?.height ?? 0,
    vh: window.innerHeight,
    scrollH: document.body.scrollHeight,
  };
});
console.log("hero info:", JSON.stringify(info));

const pinDistance = info.heroH - info.vh;

// smooth incremental scroll so scroll-linked animation engages naturally
async function glideTo(target) {
  await page.evaluate(async (t) => {
    const start = window.scrollY;
    const steps = Math.max(12, Math.min(70, Math.abs(t - start) / 40));
    for (let i = 1; i <= steps; i++) {
      window.scrollTo(0, start + ((t - start) * i) / steps);
      await new Promise((r) => setTimeout(r, 28));
    }
  }, target);
  await page.waitForTimeout(1000);
}

const stops = [0, 0.12, 0.25, 0.38, 0.5, 0.62, 0.75, 0.88, 1];
for (const p of stops) {
  const y = info.heroTop + pinDistance * p;
  await glideTo(y);
  const name = `scale-hero-${String(Math.round(p * 100)).padStart(3, "0")}.png`;
  await page.screenshot({ path: join(OUT, name) });
  console.log("saved", name, "at y=", Math.round(y));
}

// and a bit past the hero to see how it releases
await glideTo(info.heroTop + info.heroH + 200);
await page.screenshot({ path: join(OUT, "scale-hero-after.png") });
console.log("saved after");

await browser.close();
console.log("DONE");
