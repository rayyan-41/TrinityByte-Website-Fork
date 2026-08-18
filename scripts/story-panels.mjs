// Hero story panels are absolutely stacked in one spot, so exactly one may be
// painted at a time. Two painted at once shows two CTAs overlapping (they sit
// at different y while entering/exiting); zero painted leaves a blank beat.
// Sweeps the pinned range at several widths and reports both faults.
import { chromium } from "playwright";

const WIDTHS = [1024, 1062, 1280, 1440, 1920];
const browser = await chromium.launch();
let problems = 0;

for (const width of WIDTHS) {
  const page = await browser.newPage({ viewport: { width, height: 900 } });
  await page.goto("http://localhost:3003/", { waitUntil: "networkidle", timeout: 60000 }).catch(() => {});
  await page.waitForTimeout(3500);

  const pin = await page.evaluate(() => {
    const spacer = document.querySelector(".pin-spacer");
    if (!spacer) return null;
    const r = spacer.getBoundingClientRect();
    return { start: r.top + window.scrollY, end: r.top + window.scrollY + r.height - window.innerHeight };
  });

  if (!pin) {
    console.log(`— ${width}px: hero not pinned (expected below 1024px)`);
    await page.close();
    continue;
  }

  const doubles = [];
  const blanks = [];

  // the story sequence runs roughly 0.15 → 0.80 of the pinned range
  for (let prog = 0.15; prog <= 0.82; prog += 0.005) {
    const y = pin.start + (pin.end - pin.start) * prog;
    await page.evaluate((t) => window.scrollTo(0, t), y);
    await page.waitForTimeout(90);

    const state = await page.evaluate(() => {
      const panels = [...document.querySelectorAll("[data-story]")];
      const painted = panels
        .map((el) => {
          const cs = getComputedStyle(el);
          return { name: el.dataset.story, op: parseFloat(cs.opacity), hidden: cs.visibility === "hidden" };
        })
        .filter((p) => !p.hidden && p.op > 0.04);
      return painted;
    });

    const at = prog.toFixed(3);
    if (state.length > 1) {
      doubles.push(`${at} → ${state.map((s) => `${s.name}@${s.op.toFixed(2)}`).join(" + ")}`);
    } else if (state.length === 0) {
      blanks.push(at);
    }
  }

  const flags = [];
  if (doubles.length) flags.push(`TWO PANELS PAINTED (${doubles.length}): ${doubles.slice(0, 3).join(" | ")}`);
  // a couple of blank samples at the very start/end of the sequence is fine;
  // a run of them in the middle is the dead beat we fixed
  if (blanks.length > 6) flags.push(`BLANK BEAT (${blanks.length} samples): ${blanks.slice(0, 6).join(", ")}`);

  console.log(`${flags.length ? "✗" : "✓"} ${String(width).padStart(4)}px  doubles=${doubles.length} blanks=${blanks.length}`);
  flags.forEach((f) => {
    problems++;
    console.log("    " + f);
  });

  await page.close();
}

console.log(problems === 0 ? "\nALL CLEAN" : `\n${problems} issue(s)`);
await browser.close();
