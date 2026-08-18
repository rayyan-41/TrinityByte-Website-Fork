// Closer look at scale.com's hero: what is INSIDE the planes, and how the
// pin releases into the next section.
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";
import { join } from "node:path";

const OUT = join(process.cwd(), "screenshots", "reference-scale");
mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto("https://scale.com/", { waitUntil: "networkidle", timeout: 90000 }).catch(() => {});
await page.waitForTimeout(5000);

const info = await page.evaluate(() => {
  const hero = document.querySelector(".HomeHero");
  const r = hero?.getBoundingClientRect();
  return { heroTop: (r?.top ?? 0) + window.scrollY, heroH: r?.height ?? 0, vh: window.innerHeight };
});
const pinDist = info.heroH - info.vh;

async function glideTo(t) {
  await page.evaluate(async (target) => {
    const start = window.scrollY;
    const steps = Math.max(14, Math.min(80, Math.abs(target - start) / 38));
    for (let i = 1; i <= steps; i++) {
      window.scrollTo(0, start + ((target - start) * i) / steps);
      await new Promise((r) => setTimeout(r, 26));
    }
  }, t);
  await page.waitForTimeout(1100);
}

// 1) What media lives inside the planes?
await glideTo(info.heroTop + pinDist * 0.3);
const media = await page.evaluate(() => {
  const out = { videos: [], images: [], planes: [] };
  document.querySelectorAll("video").forEach((v) => {
    const r = v.getBoundingClientRect();
    if (r.width > 40)
      out.videos.push({
        w: Math.round(r.width),
        h: Math.round(r.height),
        x: Math.round(r.x),
        y: Math.round(r.y),
        src: (v.currentSrc || v.src || "").slice(-60),
        cls: (v.className || "").toString().slice(0, 60),
      });
  });
  document.querySelectorAll("img").forEach((i) => {
    const r = i.getBoundingClientRect();
    if (r.width > 120)
      out.images.push({
        w: Math.round(r.width),
        h: Math.round(r.height),
        x: Math.round(r.x),
        y: Math.round(r.y),
        src: (i.currentSrc || i.src || "").slice(-55),
      });
  });
  // elements that look like the layered planes
  document.querySelectorAll("[class*='PullApart'], [class*='pull-apart']").forEach((e) => {
    const r = e.getBoundingClientRect();
    const cs = getComputedStyle(e);
    if (r.width > 60)
      out.planes.push({
        cls: (e.className || "").toString().slice(0, 70),
        w: Math.round(r.width),
        h: Math.round(r.height),
        x: Math.round(r.x),
        y: Math.round(r.y),
        radius: cs.borderRadius,
        border: cs.borderColor,
        bg: cs.backgroundColor,
        op: cs.opacity,
      });
  });
  return out;
});
console.log("MEDIA INSIDE HERO:\n", JSON.stringify(media, null, 1).slice(0, 3000));

// 2) Detailed frames through the pull-apart
for (const p of [0.05, 0.18, 0.3, 0.45]) {
  await glideTo(info.heroTop + pinDist * p);
  await page.screenshot({ path: join(OUT, `detail-${Math.round(p * 100)}.png`) });
  console.log("saved detail", p);
}

// 3) How the pin releases into the next section
for (const extra of [0, 300, 800, 1500]) {
  await glideTo(info.heroTop + info.heroH - info.vh + extra);
  await page.screenshot({ path: join(OUT, `release-${extra}.png`) });
  console.log("saved release +", extra);
}

await browser.close();
console.log("DONE");
