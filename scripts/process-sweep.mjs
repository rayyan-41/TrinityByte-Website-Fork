// Verify the Process perspective card finishes its rotation while it is still
// well inside the viewport — the fault being that the panel only becomes
// upright after it has scrolled past the fold, so you never see it flat on.
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";

mkdirSync("screenshots/process", { recursive: true });

/** decompose the rendered matrix3d back into an X rotation in degrees */
const READ_TILT = () => {
  const ol = document.querySelector("[data-process-list]");
  if (!ol) return null;
  const card = ol.closest("[style]");
  if (!card) return null;
  const m = new DOMMatrixReadOnly(getComputedStyle(card).transform);
  // rotateX shows up as m23/m33 in the 3D matrix
  const tiltRad = Math.atan2(m.m23, m.m33);
  const r = card.getBoundingClientRect();
  const items = [...ol.querySelectorAll("[data-step]")];
  const o = ol.getBoundingClientRect();
  return {
    tilt: Math.round((tiltRad * 180) / Math.PI * 10) / 10,
    top: Math.round(r.top),
    bottom: Math.round(r.bottom),
    vh: window.innerHeight,
    // only counts as a fault if the clipped step is actually on screen —
    // while the card is entering, its lower half is still below the fold
    clipped: items.filter((i) => {
      const b = i.getBoundingClientRect();
      const outsidePanel = b.bottom > o.bottom + 2 || b.top < o.top - 2;
      const onScreen = b.bottom > 0 && b.top < window.innerHeight;
      return outsidePanel && onScreen;
    }).length,
  };
};

const browser = await chromium.launch();
let problems = 0;

for (const [W, H, tag] of [
  [1440, 900, "d"],
  [1024, 800, "l"],
  [390, 844, "m"],
]) {
  const page = await browser.newPage({
    viewport: { width: W, height: H },
    ...(W < 500 ? { isMobile: true, hasTouch: true } : {}),
  });
  await page.goto("http://localhost:3003/", { waitUntil: "networkidle", timeout: 60000 }).catch(() => {});
  await page.waitForTimeout(3500);

  const base = await page.evaluate(
    () => document.querySelector("#process").getBoundingClientRect().top + window.scrollY
  );

  console.log(`\n--- ${W}x${H} ---`);
  let bestFramed = null;

  for (let off = -300; off <= 1200; off += 100) {
    await page.evaluate(async (t) => {
      const s = window.scrollY;
      for (let i = 1; i <= 12; i++) {
        window.scrollTo(0, s + ((t - s) * i) / 12);
        await new Promise((r) => setTimeout(r, 22));
      }
    }, base + off);
    await page.waitForTimeout(420);

    const g = await page.evaluate(READ_TILT);
    if (!g) continue;

    // "framed" = the card is essentially fully on screen below the header
    const framed = g.top > 70 && g.bottom < g.vh + 40;
    if (framed && (bestFramed === null || Math.abs(g.tilt) < Math.abs(bestFramed.tilt))) {
      bestFramed = { ...g, off };
    }
    if (g.clipped) {
      problems++;
      console.log(`  off ${String(off).padStart(5)} ✗ ${g.clipped} step(s) clipped`);
    }
  }

  if (!bestFramed) {
    problems++;
    console.log("  ✗ card is never fully framed on screen");
  } else {
    const flat = Math.abs(bestFramed.tilt) <= 4;
    if (!flat) problems++;
    console.log(
      `  ${flat ? "✓" : "✗"} flattest while framed: tilt=${bestFramed.tilt}° at off=${bestFramed.off} (top=${bestFramed.top}, bottom=${bestFramed.bottom})`
    );
    await page.evaluate(async (t) => {
      const s = window.scrollY;
      for (let i = 1; i <= 12; i++) {
        window.scrollTo(0, s + ((t - s) * i) / 12);
        await new Promise((r) => setTimeout(r, 22));
      }
    }, base + bestFramed.off);
    await page.waitForTimeout(600);
    await page.screenshot({ path: `screenshots/process/${tag}-flattest.png` });
  }

  await page.close();
}

console.log(problems === 0 ? "\nALL CLEAN" : `\n${problems} issue(s)`);
await browser.close();
