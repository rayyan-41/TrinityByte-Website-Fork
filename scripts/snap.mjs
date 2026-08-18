// Quick screenshot utility for the implement→screenshot→compare loop.
// Usage: node scripts/snap.mjs <path-or-url> <outfile> [--w 1440] [--h 1000] [--y 0] [--full] [--mobile] [--wait 2500]
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";

const args = process.argv.slice(2);
const target = args[0] ?? "/";
const out = resolve(args[1] ?? "screenshots/trinity/snap.png");
const flag = (name, dflt) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 ? args[i + 1] : dflt;
};
const has = (name) => args.includes(`--${name}`);

const W = parseInt(flag("w", has("mobile") ? "390" : "1440"), 10);
const H = parseInt(flag("h", has("mobile") ? "844" : "1000"), 10);
const Y = parseInt(flag("y", "0"), 10);
const WAIT = parseInt(flag("wait", "2600"), 10);
const url = target.startsWith("http") ? target : `http://localhost:3003${target}`;

mkdirSync(dirname(out), { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: W, height: H },
  deviceScaleFactor: 1,
  ...(has("mobile")
    ? {
        userAgent:
          "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
        isMobile: true,
        hasTouch: true,
      }
    : {}),
});
page.on("console", (m) => {
  if (m.type() === "error") console.log("[console.error]", m.text().slice(0, 300));
});
page.on("pageerror", (e) => console.log("[pageerror]", String(e).slice(0, 400)));

await page.goto(url, { waitUntil: "networkidle", timeout: 60000 }).catch((e) => console.log("goto:", e.message));
await page.waitForTimeout(WAIT);

if (has("full")) {
  // walk the whole page first so every ScrollTrigger fires, then return to top
  await page.evaluate(async () => {
    const total = document.body.scrollHeight;
    let cur = 0;
    while (cur < total) {
      cur += 600;
      window.scrollTo(0, cur);
      await new Promise((r) => setTimeout(r, 70));
    }
  });
  await page.waitForTimeout(1200);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(900);
}

if (Y > 0) {
  // approach gradually so scroll-triggered animations fire
  await page.evaluate(async (targetY) => {
    let cur = 0;
    while (cur < targetY - 500) {
      cur += 500;
      window.scrollTo(0, cur);
      await new Promise((r) => setTimeout(r, 60));
    }
    window.scrollTo(0, targetY);
  }, Y);
  await page.waitForTimeout(1700);
}

await page.screenshot({ path: out, fullPage: has("full") });
console.log("saved", out, `${W}x${H}`, `y=${Y}`);
await browser.close();
