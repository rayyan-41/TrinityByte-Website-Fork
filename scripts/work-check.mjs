/* Verify the /work scroll showcase: sticky media crossfades to the active
   entry, entries link through, and the mobile stack renders. */
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";

mkdirSync("screenshots/tech", { recursive: true });

const browser = await chromium.launch();
let problems = 0;
const fail = (m) => {
  problems++;
  console.log("   ✗ " + m);
};

/* ---------------- desktop ---------------- */
{
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  const errors = [];
  page.on("pageerror", (e) => errors.push(String(e).slice(0, 150)));
  page.on("console", (m) => m.type() === "error" && errors.push(m.text().slice(0, 150)));

  await page.goto("http://localhost:3003/work", { waitUntil: "networkidle", timeout: 60000 }).catch(() => {});
  await page.waitForTimeout(3000);

  const sectionTop = await page.evaluate(
    () => document.querySelector('[aria-label="All projects"]').getBoundingClientRect().top + window.scrollY
  );

  const glide = async (target) => {
    await page.evaluate(async (t) => {
      const start = window.scrollY;
      for (let i = 1; i <= 22; i++) {
        window.scrollTo(0, start + ((t - start) * i) / 22);
        await new Promise((r) => setTimeout(r, 26));
      }
    }, target);
    await page.waitForTimeout(900);
  };

  const activeImage = () =>
    page.evaluate(() => {
      const panes = [...document.querySelectorAll('[aria-label="All projects"] .sticky > div')];
      const idx = panes.findIndex((d) => parseFloat(getComputedStyle(d).opacity) > 0.5);
      return { index: idx, src: panes[idx]?.querySelector("img")?.getAttribute("src") ?? null };
    });

  const seen = [];
  for (const [i, off] of [
    [1, 300],
    [2, 1100],
    [3, 1900],
    [4, 2700],
  ]) {
    await glide(sectionTop + off);
    const act = await activeImage();
    seen.push(act.index);
    await page.screenshot({ path: `screenshots/tech/scroll-${i}.png` });
    console.log(`offset +${off}px → active pane ${act.index}`);
  }

  const changed = new Set(seen).size;
  if (changed < 2) fail(`sticky media never changed (panes seen: ${seen.join(",")})`);
  else console.log(`✓ sticky media crossfaded across ${changed} panes`);

  /* entries link through */
  const links = await page.evaluate(() =>
    [...document.querySelectorAll('[aria-label="All projects"] a[href^="/work/"]')].map((a) =>
      a.getAttribute("href")
    )
  );
  console.log(`\nproject links: ${JSON.stringify([...new Set(links)])}`);
  if (new Set(links).size !== 4) fail(`expected 4 distinct project links, got ${new Set(links).size}`);

  if (errors.length) fail("console errors: " + errors.slice(0, 3).join(" | "));
  await page.close();
}

/* ---------------- mobile ---------------- */
{
  const page = await browser.newPage({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
  });
  await page.goto("http://localhost:3003/work", { waitUntil: "networkidle", timeout: 60000 }).catch(() => {});
  await page.waitForTimeout(2500);
  // both the mobile stack and the md-and-up column live in the DOM; only the
  // rendered one has an offsetParent
  const stacked = await page.evaluate(
    () =>
      [...document.querySelectorAll('[aria-label="All projects"] article')].filter(
        (el) => el.offsetParent !== null
      ).length
  );
  const docW = await page.evaluate(() => document.documentElement.scrollWidth);
  console.log(`\nmobile: ${stacked} stacked entries, docW=${docW}`);
  if (stacked !== 4) fail(`expected 4 stacked entries on mobile, got ${stacked}`);
  if (docW > 391) fail(`mobile horizontal overflow: ${docW}`);
  await page.screenshot({ path: "screenshots/tech/scroll-mobile.png" });
  await page.close();
}

console.log(problems === 0 ? "\nALL CLEAN" : `\n${problems} issue(s)`);
await browser.close();
