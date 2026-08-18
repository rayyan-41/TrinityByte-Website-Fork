// Capture the hero scroll scene at progress checkpoints.
// Usage: node scripts/hero-scroll.mjs [outdir] [--w 1440] [--h 900]
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";
import { join } from "node:path";

const args = process.argv.slice(2);
const outDir = args[0] && !args[0].startsWith("--") ? args[0] : "screenshots/hero";
const flag = (n, d) => {
  const i = args.indexOf(`--${n}`);
  return i >= 0 ? args[i + 1] : d;
};
const W = parseInt(flag("w", "1440"), 10);
const H = parseInt(flag("h", "900"), 10);
const OUT = join(process.cwd(), outDir);
mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: W, height: H } });
const errors = [];
page.on("console", (m) => m.type() === "error" && errors.push(m.text().slice(0, 200)));
page.on("pageerror", (e) => errors.push("PAGEERROR " + String(e).slice(0, 200)));

await page.goto("http://localhost:3003/", { waitUntil: "networkidle", timeout: 60000 }).catch(() => {});
await page.waitForTimeout(4500);

// Derive the pin range from the pin-spacer ScrollTrigger injects: its extra
// padding IS the scroll distance the scene is pinned for.
const info = await page.evaluate(() => {
  const spacer = document.querySelector(".pin-spacer");
  if (!spacer) return { start: 0, end: window.innerHeight * 3, found: false };
  const pinned = spacer.firstElementChild;
  const spacerH = spacer.getBoundingClientRect().height;
  const pinnedH = pinned ? pinned.getBoundingClientRect().height : window.innerHeight;
  const start = spacer.getBoundingClientRect().top + window.scrollY;
  return { start, end: start + (spacerH - pinnedH), found: true, spacerH, pinnedH };
});
console.log("pin range:", JSON.stringify(info));
if (!info.found) console.log("WARNING: no pin-spacer found — hero is not pinned");

async function glideTo(target) {
  await page.evaluate(async (t) => {
    const start = window.scrollY;
    const steps = Math.max(14, Math.min(80, Math.abs(t - start) / 35));
    for (let i = 1; i <= steps; i++) {
      window.scrollTo(0, start + ((t - start) * i) / steps);
      await new Promise((r) => setTimeout(r, 26));
    }
  }, target);
  await page.waitForTimeout(1500);
}

const stops = args.includes("--detailed")
  ? [0, 0.12, 0.25, 0.38, 0.5, 0.62, 0.75, 0.88, 1]
  : [0, 0.25, 0.5, 0.75, 1];
for (const p of stops) {
  const y = info.start + (info.end - info.start) * p;
  await glideTo(y);
  const name = `hero-${String(Math.round(p * 100)).padStart(3, "0")}.png`;
  await page.screenshot({ path: join(OUT, name) });
  console.log("saved", name, "y=", Math.round(y));
}

// reverse back to the top to confirm it unwinds
await glideTo(0);
await page.screenshot({ path: join(OUT, "hero-reversed.png") });
const docW = await page.evaluate(() => document.documentElement.scrollWidth);
console.log("after reverse, docW =", docW, "viewport =", W);

console.log(errors.length ? "CONSOLE ERRORS:\n" + errors.join("\n") : "no console errors");
await browser.close();
