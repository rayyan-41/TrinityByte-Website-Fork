/* Full audit of the fullscreen menu overlay: open/close state, links,
   focus management, Escape, backdrop click, and mobile. */
import { chromium } from "playwright";

const browser = await chromium.launch();
let problems = 0;
const fail = (msg) => {
  problems++;
  console.log("   ✗ " + msg);
};

const snapshot = (page) =>
  page.evaluate(() => {
    const overlay = document.querySelector("#site-menu");
    const cs = getComputedStyle(overlay);
    return {
      ariaHidden: overlay.getAttribute("aria-hidden"),
      // the overlay hides via display, so that is what "closed" must assert on
      display: cs.display,
      opacity: cs.opacity,
      pointerEvents: cs.pointerEvents,
      navLinks: [...overlay.querySelectorAll("nav a")].map((a) => ({
        text: a.innerText.replace(/\s+/g, " ").trim(),
        href: a.getAttribute("href"),
        tab: a.tabIndex,
      })),
      metaLinks: [...overlay.querySelectorAll("a")]
        .filter((a) => !a.closest("nav"))
        .map((a) => ({ text: a.innerText.replace(/\s+/g, " ").trim(), tab: a.tabIndex })),
      toggleLabel: document.querySelector("[aria-controls=site-menu]").getAttribute("aria-label"),
      toggleExpanded: document.querySelector("[aria-controls=site-menu]").getAttribute("aria-expanded"),
    };
  });

/* ---------------- desktop ---------------- */
{
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const errors = [];
  page.on("pageerror", (e) => errors.push("PAGEERROR " + String(e).slice(0, 140)));
  page.on("console", (m) => m.type() === "error" && errors.push(m.text().slice(0, 140)));

  await page.goto("http://localhost:3003/", { waitUntil: "networkidle", timeout: 60000 }).catch(() => {});
  await page.waitForTimeout(3500);

  console.log("=== CLOSED ===");
  const closed = await snapshot(page);
  console.log(
    JSON.stringify({
      ariaHidden: closed.ariaHidden,
      display: closed.display,
      navLinks: closed.navLinks.length,
      metaLinks: closed.metaLinks.length,
    })
  );
  if (closed.ariaHidden !== "true") fail("closed: aria-hidden should be true");
  if (closed.display !== "none") fail(`closed: overlay still rendered (display: ${closed.display})`);
  if (closed.navLinks.some((l) => l.tab !== -1)) fail("closed: nav links still tabbable");
  if (closed.toggleExpanded !== "false") fail("closed: aria-expanded should be false");

  console.log("\n=== OPEN ===");
  await page.click("[aria-controls=site-menu]");
  await page.waitForTimeout(2200);
  const open = await snapshot(page);
  console.log(JSON.stringify(open, null, 1));
  await page.screenshot({ path: "screenshots/header/menu-open-full.png" });

  if (open.ariaHidden !== "false") fail("open: aria-hidden should be false");
  if (open.display === "none") fail("open: overlay not displayed");
  if (open.navLinks.some((l) => l.tab === -1)) fail("open: nav links not tabbable");
  if (open.toggleExpanded !== "true") fail("open: aria-expanded should be true");
  if (open.navLinks.length !== 6) fail(`open: expected 6 nav links, got ${open.navLinks.length}`);

  /* hover-reactive ambient shapes */
  const shapeOpacity = (key) =>
    page.evaluate((k) => {
      const el = document.querySelector(`[data-shape="${k}"]`);
      return el ? parseFloat(getComputedStyle(el).opacity) : -1;
    }, key);

  const restShape3 = await shapeOpacity("3");
  await page.hover('[data-shape-key="3"]');
  await page.waitForTimeout(900);
  const hoverShape3 = await shapeOpacity("3");
  await page.screenshot({ path: "screenshots/header/menu-hover-shape.png" });

  await page.hover('[data-shape-key="1"]');
  await page.waitForTimeout(900);
  const shape1 = await shapeOpacity("1");

  console.log(
    `\nshapes: #3 rest=${restShape3} hovered=${hoverShape3} | #1 after moving=${shape1}`
  );
  if (!(restShape3 === 0 && hoverShape3 > 0.5)) fail("ambient shape did not react to hover");
  if (shape1 <= 0.5) fail("ambient shape did not follow to the next item");

  /* Escape closes */
  await page.keyboard.press("Escape");
  await page.waitForTimeout(1200);
  const afterEsc = await snapshot(page);
  if (afterEsc.ariaHidden !== "true") fail("Escape did not close the menu");
  else console.log("\n✓ Escape closes");

  /* backdrop click closes */
  await page.click("[aria-controls=site-menu]");
  await page.waitForTimeout(1800);
  await page.mouse.click(720, 870);
  await page.waitForTimeout(1200);
  const afterBackdrop = await snapshot(page);
  if (afterBackdrop.ariaHidden !== "true") fail("backdrop click did not close the menu");
  else console.log("✓ backdrop click closes");

  /* link navigates */
  await page.click("[aria-controls=site-menu]");
  await page.waitForTimeout(1800);
  await page.locator('#site-menu a[href="/work"]').click();
  await page.waitForURL("**/work", { timeout: 10000 }).catch(() => fail("nav link did not navigate to /work"));
  await page.waitForTimeout(1500);
  const afterNav = await snapshot(page);
  if (afterNav.ariaHidden !== "true") fail("menu stayed open after navigating");
  else console.log("✓ link navigates and menu closes");

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
  await page.goto("http://localhost:3003/", { waitUntil: "networkidle", timeout: 60000 }).catch(() => {});
  await page.waitForTimeout(3000);
  await page.click("[aria-controls=site-menu]");
  await page.waitForTimeout(2000);
  const m = await snapshot(page);
  console.log("\n=== MOBILE OPEN ===");
  console.log(JSON.stringify({ ariaHidden: m.ariaHidden, opacity: m.opacity, navLinks: m.navLinks.length }));
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth);
  if (m.ariaHidden !== "false") fail("mobile: menu did not open");
  if (overflow > 391) fail(`mobile: horizontal overflow ${overflow}`);
  await page.screenshot({ path: "screenshots/header/menu-open-mobile.png" });
  await page.close();
}

console.log(problems === 0 ? "\nALL CLEAN" : `\n${problems} issue(s)`);
await browser.close();
