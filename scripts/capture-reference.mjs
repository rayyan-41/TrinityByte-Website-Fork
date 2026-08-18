// Capture reference screenshots of vixels.dev for visual comparison.
// Usage: node scripts/capture-reference.mjs
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";
import { join } from "node:path";

const OUT = join(process.cwd(), "screenshots", "reference");
mkdirSync(OUT, { recursive: true });

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function settleScroll(page, y) {
  // approach the target gradually so scroll-triggered animations fire
  await page.evaluate(async (target) => {
    const step = 400;
    let cur = window.scrollY;
    const dir = target > cur ? 1 : -1;
    while (Math.abs(target - cur) > step) {
      cur += dir * step;
      window.scrollTo(0, cur);
      await new Promise((r) => setTimeout(r, 40));
    }
    window.scrollTo(0, target);
  }, y);
  await sleep(1600);
}

async function captureDesktop(browser) {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  await page.goto("https://vixels.dev/", { waitUntil: "networkidle", timeout: 90000 }).catch(() => {});
  await sleep(4000);

  // Full slow scroll first to trigger every lazy element
  const total = await page.evaluate(() => document.body.scrollHeight);
  for (let y = 0; y <= total; y += 700) {
    await page.evaluate((yy) => window.scrollTo(0, yy), y);
    await sleep(150);
  }
  await sleep(1000);

  const shots = [
    ["reference-home-hero.png", 0],
    ["reference-home-about.png", 1750],
    ["reference-home-stats.png", 2200],
    ["reference-home-services.png", 2900],
    ["reference-home-services-2.png", 3900],
    ["reference-home-work.png", 4780],
    ["reference-home-work-2.png", 5600],
    ["reference-home-work-3.png", 6400],
    ["reference-home-testimonials.png", 7600],
    ["reference-home-testimonials-2.png", 8800],
    ["reference-home-marquee.png", 9980],
    ["reference-home-pricing.png", 10350],
    ["reference-home-pricing-2.png", 11200],
    ["reference-home-cta.png", 11900],
    ["reference-home-footer.png", total],
  ];
  for (const [name, y] of shots) {
    await settleScroll(page, y);
    await page.screenshot({ path: join(OUT, name) });
    console.log("saved", name);
  }
  await page.close();
}

async function captureAbout(browser) {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  await page.goto("https://vixels.dev/about-us", { waitUntil: "networkidle", timeout: 90000 }).catch(() => {});
  await sleep(3500);
  const total = await page.evaluate(() => document.body.scrollHeight);
  for (let y = 0; y <= total; y += 700) {
    await page.evaluate((yy) => window.scrollTo(0, yy), y);
    await sleep(140);
  }
  const stops = [0, 0.22, 0.42, 0.62, 0.8, 1];
  for (let i = 0; i < stops.length; i++) {
    await settleScroll(page, Math.round((total - 1000) * stops[i]));
    await page.screenshot({ path: join(OUT, `reference-about-${i}.png`) });
    console.log("saved about", i);
  }
  await page.close();
}

async function captureWork(browser) {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  await page.goto("https://vixels.dev/work", { waitUntil: "networkidle", timeout: 90000 }).catch(() => {});
  await sleep(3500);
  const total = await page.evaluate(() => document.body.scrollHeight);
  for (let y = 0; y <= total; y += 700) {
    await page.evaluate((yy) => window.scrollTo(0, yy), y);
    await sleep(140);
  }
  const stops = [0, 0.35, 0.7, 1];
  for (let i = 0; i < stops.length; i++) {
    await settleScroll(page, Math.round((total - 1000) * stops[i]));
    await page.screenshot({ path: join(OUT, `reference-work-${i}.png`) });
    console.log("saved work", i);
  }
  // one project detail
  await page.goto("https://vixels.dev/work/calmerceuticals", { waitUntil: "networkidle", timeout: 90000 }).catch(() => {});
  await sleep(3000);
  const t2 = await page.evaluate(() => document.body.scrollHeight);
  for (let y = 0; y <= t2; y += 700) {
    await page.evaluate((yy) => window.scrollTo(0, yy), y);
    await sleep(120);
  }
  for (let i = 0; i < 3; i++) {
    await settleScroll(page, Math.round((t2 - 1000) * (i / 2)));
    await page.screenshot({ path: join(OUT, `reference-project-${i}.png`) });
    console.log("saved project", i);
  }
  await page.close();
}

async function captureMobile(browser) {
  const page = await browser.newPage({
    viewport: { width: 390, height: 844 },
    userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
    isMobile: true, hasTouch: true, deviceScaleFactor: 2,
  });
  await page.goto("https://vixels.dev/", { waitUntil: "networkidle", timeout: 90000 }).catch(() => {});
  await sleep(4000);
  const total = await page.evaluate(() => document.body.scrollHeight);
  for (let y = 0; y <= total; y += 500) {
    await page.evaluate((yy) => window.scrollTo(0, yy), y);
    await sleep(120);
  }
  const stops = [0, 0.12, 0.25, 0.38, 0.5, 0.62, 0.75, 0.88, 1];
  for (let i = 0; i < stops.length; i++) {
    await settleScroll(page, Math.round((total - 844) * stops[i]));
    await page.screenshot({ path: join(OUT, `reference-mobile-home-${i}.png`) });
    console.log("saved mobile", i);
  }
  await page.close();
}

const browser = await chromium.launch();
try {
  await captureDesktop(browser);
  await captureAbout(browser);
  await captureWork(browser);
  await captureMobile(browser);
} finally {
  await browser.close();
}
console.log("DONE");
