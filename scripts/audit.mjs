// Cross-breakpoint audit: horizontal overflow, console errors, tap targets, alt text.
// Usage: node scripts/audit.mjs
import { chromium } from "playwright";

const BASE = "http://localhost:3003";
const PAGES = ["/", "/about", "/services", "/work", "/work/custom-software-platform", "/careers", "/contact"];
const WIDTHS = [1920, 1440, 1280, 1024, 768, 430, 390, 375];

const browser = await chromium.launch();
let problems = 0;

for (const width of WIDTHS) {
  const height = width <= 500 ? 844 : 1000;
  for (const path of PAGES) {
    const page = await browser.newPage({
      viewport: { width, height },
      ...(width <= 500 ? { isMobile: true, hasTouch: true } : {}),
    });
    const errors = [];
    page.on("console", (m) => {
      if (m.type() === "error") errors.push(m.text().slice(0, 200));
    });
    page.on("pageerror", (e) => errors.push("PAGEERROR " + String(e).slice(0, 200)));

    await page.goto(BASE + path, { waitUntil: "networkidle", timeout: 60000 }).catch(() => {});
    await page.waitForTimeout(1800);

    // scroll through to trigger everything
    await page.evaluate(async () => {
      const total = document.body.scrollHeight;
      let cur = 0;
      while (cur < total) {
        cur += 900;
        window.scrollTo(0, cur);
        await new Promise((r) => setTimeout(r, 45));
      }
      window.scrollTo(0, 0);
    });
    await page.waitForTimeout(900);

    const report = await page.evaluate((vw) => {
      const docW = document.documentElement.scrollWidth;
      const offenders = [];
      if (docW > vw + 1) {
        document.querySelectorAll("body *").forEach((el) => {
          const r = el.getBoundingClientRect();
          if (r.width === 0 || r.height === 0) return;
          const right = r.right + window.scrollX;
          const left = r.left + window.scrollX;
          if (right > vw + 2 || left < -2) {
            const cs = getComputedStyle(el);
            // skip intentionally-clipped decorative marquees
            if (el.closest("[data-allow-overflow]")) return;
            if (cs.position === "fixed") return;
            offenders.push({
              tag: el.tagName,
              cls: (el.className || "").toString().slice(0, 70),
              left: Math.round(left),
              right: Math.round(right),
            });
          }
        });
      }
      // images missing alt
      const noAlt = [...document.querySelectorAll("img")]
        .filter((i) => !i.hasAttribute("alt"))
        .map((i) => i.src.slice(-40));
      // small tap targets among interactive elements.
      // WCAG 2.5.8 exempts links that sit inline within a sentence, so skip those.
      const small = [...document.querySelectorAll("a,button,select,input,textarea")]
        .filter((el) => {
          const r = el.getBoundingClientRect();
          if (r.width === 0 || r.height === 0) return false;
          const inSentence =
            el.tagName === "A" &&
            el.parentElement &&
            /^(P|LI|SPAN|CODE)$/.test(el.parentElement.tagName) &&
            (el.parentElement.textContent || "").trim().length >
              (el.textContent || "").trim().length + 4;
          if (inSentence) return false;
          return r.height < 30 || r.width < 30;
        })
        .map((el) => `${el.tagName}:${(el.textContent || "").trim().slice(0, 24)}`)
        .slice(0, 6);
      return { docW, offenders: offenders.slice(0, 6), noAlt, small };
    }, width);

    const flags = [];
    if (report.docW > width + 1) flags.push(`OVERFLOW docW=${report.docW}`);
    if (errors.length) flags.push(`CONSOLE(${errors.length}): ${errors[0]}`);
    if (report.noAlt.length) flags.push(`NO-ALT: ${report.noAlt.join(", ")}`);
    if (report.small.length) flags.push(`SMALL-TAP: ${report.small.join(" | ")}`);

    if (flags.length) {
      problems++;
      console.log(`\n[${width}px] ${path}`);
      flags.forEach((f) => console.log("   " + f));
      report.offenders.forEach((o) =>
        console.log(`   → <${o.tag}> ${o.cls} (${o.left}..${o.right})`)
      );
    }
    await page.close();
  }
  console.log(`✓ swept ${width}px`);
}

console.log(problems === 0 ? "\nALL CLEAN" : `\n${problems} page/width combos flagged`);
await browser.close();
