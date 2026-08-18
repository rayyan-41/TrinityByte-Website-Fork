// Audit the site-wide liquid-metal buttons: coverage, WebGL context pressure,
// accessible names, and console health.
import { chromium } from "playwright";

const PAGES = ["/", "/about", "/services", "/work", "/work/custom-software-platform", "/careers", "/contact"];
const browser = await chromium.launch();
let problems = 0;

for (const path of PAGES) {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const errors = [];
  page.on("pageerror", (e) => errors.push("PAGEERROR " + String(e).slice(0, 160)));
  page.on("console", (m) => {
    const t = m.text();
    // "GL Driver Message (…Performance…)" is a one-time headless software-GL
    // notice, not a page fault — only genuine errors and context loss matter.
    const isError = m.type() === "error";
    const isContextLoss = /context lost|too many active webgl/i.test(t);
    if (isError || isContextLoss) errors.push(`[${m.type()}] ${t.slice(0, 150)}`);
  });

  await page.goto("http://localhost:3003" + path, { waitUntil: "networkidle", timeout: 60000 }).catch(() => {});
  await page.waitForTimeout(2500);

  // walk the page so every lazily-mounted shader gets its turn
  let peakCanvases = 0;
  const total = await page.evaluate(() => document.body.scrollHeight);
  for (let y = 0; y <= total; y += 700) {
    await page.evaluate((yy) => window.scrollTo(0, yy), y);
    await page.waitForTimeout(120);
    const c = await page.evaluate(() => document.querySelectorAll("canvas").length);
    if (c > peakCanvases) peakCanvases = c;
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(800);

  const report = await page.evaluate(() => {
    const btns = [...document.querySelectorAll(".liquid-metal-button")];
    const names = btns.map((b) => (b.getAttribute("aria-label") || b.innerText || "").trim().replace(/\s+/g, " "));
    // an accessible name that repeats itself is the old flip-label duplication
    const duped = names.filter((n) => {
      const half = n.length / 2;
      return n.length > 6 && n.slice(0, Math.floor(half)).trim() === n.slice(Math.ceil(half)).trim();
    });
    // anything still using the previous pill styling.
    // The header brand badge is an ivory <a> by design, not a button — skip it.
    const legacy = [...document.querySelectorAll("a,button")].filter((el) => {
      const cs = getComputedStyle(el);
      const bg = cs.backgroundColor;
      return (
        !el.closest(".liquid-metal-button") &&
        !el.classList.contains("liquid-metal-button") &&
        !el.matches('a[aria-label*="home"]') &&
        /^rgb\(242, 239, 233\)|^rgb\(200, 171, 114\)/.test(bg) &&
        el.getBoundingClientRect().height > 28
      );
    }).map((el) => (el.innerText || "").trim().slice(0, 30));
    return { buttons: btns.length, names: names.slice(0, 3), duped, legacy };
  });

  const flags = [];
  if (peakCanvases > 14) flags.push(`WEBGL PRESSURE peak=${peakCanvases} contexts`);
  if (report.duped.length) flags.push(`DUPLICATED LABEL: ${report.duped.join(" | ")}`);
  if (report.legacy.length) flags.push(`LEGACY PILL STYLE: ${report.legacy.join(" | ")}`);
  if (errors.length) flags.push(`CONSOLE(${errors.length}): ${errors[0]}`);

  console.log(
    `${flags.length ? "✗" : "✓"} ${path.padEnd(34)} buttons=${String(report.buttons).padStart(2)} peakCanvas=${String(peakCanvases).padStart(2)}`
  );
  flags.forEach((f) => {
    problems++;
    console.log("    " + f);
  });

  await page.close();
}

console.log(problems === 0 ? "\nALL CLEAN" : `\n${problems} issue(s)`);
await browser.close();
