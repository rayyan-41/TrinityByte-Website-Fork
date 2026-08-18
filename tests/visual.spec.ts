import { test, expect, Page } from "@playwright/test";
import { mkdirSync } from "node:fs";
import { join } from "node:path";

/**
 * Visual QA suite.
 *   npm run dev            # server must be running on :3003
 *   npx playwright test
 *
 * Screenshots land in /screenshots/final.
 */

const OUT = join(process.cwd(), "screenshots", "final");
mkdirSync(OUT, { recursive: true });

const shot = (name: string) => join(OUT, name);

/** Wait for fonts + let entrance animations finish. */
async function settle(page: Page, ms = 2600) {
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(ms);
}

/** Walk the page so every ScrollTrigger fires, then return to a target offset. */
async function sweepTo(page: Page, y: number | "top" | "bottom") {
  await page.evaluate(async () => {
    const total = document.body.scrollHeight;
    let cur = 0;
    while (cur < total) {
      cur += 600;
      window.scrollTo(0, cur);
      await new Promise((r) => setTimeout(r, 60));
    }
  });
  await page.waitForTimeout(900);
  const target =
    y === "top" ? 0 : y === "bottom" ? await page.evaluate(() => document.body.scrollHeight) : y;
  await page.evaluate((t) => window.scrollTo(0, t), target);
  await page.waitForTimeout(1400);
}

test.describe("desktop @ 1440x1000", () => {
  test.use({ viewport: { width: 1440, height: 1000 } });

  test("homepage sections", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(String(e)));
    page.on("console", (m) => {
      if (m.type() === "error") errors.push(m.text());
    });

    await page.goto("/");
    await settle(page, 4200);

    await expect(page.getByRole("heading", { level: 1 })).toContainText("Digital Products");
    await page.screenshot({ path: shot("desktop-hero.png") });

    // full page after a complete sweep
    await sweepTo(page, "top");
    await page.screenshot({ path: shot("desktop-home-full.png"), fullPage: true });

    const anchors: Array<[string, string]> = [
      ["desktop-services.png", "#services"],
      ["desktop-work.png", "#work"],
      ["desktop-process.png", "#process"],
      ["desktop-engagement.png", "#engagement"],
    ];
    for (const [file, sel] of anchors) {
      const y = await page.evaluate((s) => {
        const el = document.querySelector(s);
        return el ? el.getBoundingClientRect().top + window.scrollY : 0;
      }, sel);
      await sweepTo(page, Math.max(0, y - 40));
      await page.screenshot({ path: shot(file) });
    }

    const morphTarget = await page.evaluate(() => {
      const el = document.querySelector<HTMLElement>("[data-scroll-morph]");
      if (!el) return 0;
      const top = el.getBoundingClientRect().top + window.scrollY;
      return top + (el.offsetHeight - window.innerHeight) * 0.68;
    });
    await sweepTo(page, morphTarget);
    await expect(page.locator("[data-scroll-morph] a")).toHaveCount(12);
    await expect(page.locator("[data-scroll-morph] a").first()).toHaveAttribute(
      "aria-hidden",
      "false"
    );
    await page.screenshot({ path: shot("desktop-work-morph.png") });

    // CTA + footer
    await sweepTo(page, "bottom");
    await page.screenshot({ path: shot("desktop-footer.png") });
    const ctaY = await page.evaluate(() => document.body.scrollHeight - 1900);
    await sweepTo(page, Math.max(0, ctaY));
    await page.screenshot({ path: shot("desktop-cta.png") });

    expect(errors, `console errors:\n${errors.join("\n")}`).toHaveLength(0);
  });

  test("about page", async ({ page }) => {
    await page.goto("/about");
    await settle(page);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await sweepTo(page, "top");
    await page.screenshot({ path: shot("desktop-about.png"), fullPage: true });
  });

  test("work index and project detail", async ({ page }) => {
    await page.goto("/work");
    await settle(page);
    await sweepTo(page, "top");
    await page.screenshot({ path: shot("desktop-work-page.png"), fullPage: true });

    await page.getByRole("link", { name: /Custom Software Platform/i }).first().click();
    await page.waitForURL("**/work/custom-software-platform");
    await settle(page);
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Custom Software Platform");
    await sweepTo(page, "top");
    await page.screenshot({ path: shot("desktop-project.png"), fullPage: true });
  });

  test("contact form validates before submitting", async ({ page }) => {
    await page.goto("/contact");
    await settle(page);

    // empty submit surfaces field errors, no navigation
    await page.getByRole("button", { name: /Send Project Brief/i }).click();
    await expect(page.getByText("Please tell us your name.")).toBeVisible();
    await expect(page.getByText("Enter a valid email address.")).toBeVisible();
    await page.screenshot({ path: shot("desktop-contact-errors.png") });

    // valid input clears errors and reports the unconnected endpoint honestly
    await page.getByLabel("Name *").fill("Ada Lovelace");
    await page.getByLabel("Email *").fill("ada@example.com");
    await page.getByLabel("Project type *").selectOption("Custom Software");
    await page
      .getByLabel("Project details *")
      .fill("We need an internal operations platform with role-based dashboards and reporting.");
    await page.getByRole("button", { name: /Send Project Brief/i }).click();
    await expect(page.getByText(/delivery not yet connected/i)).toBeVisible();
    await page.screenshot({ path: shot("desktop-contact.png") });
  });

  test("menu overlay opens, navigates, and closes on Escape", async ({ page }) => {
    await page.goto("/");
    await settle(page);

    const menuBtn = page.getByRole("button", { name: /Menu/i });
    await menuBtn.click();
    await page.waitForTimeout(2600);
    const menu = page.locator("#site-menu");
    await expect(menu).toHaveAttribute("aria-hidden", "false");
    await page.screenshot({ path: shot("desktop-menu.png") });

    await page.keyboard.press("Escape");
    await page.waitForTimeout(900);
    await expect(menu).toHaveAttribute("aria-hidden", "true");

    await menuBtn.click();
    await page.waitForTimeout(2600);
    // accessible name is "0N Services" — the index sits inside the link
    await menu.locator('a[href="/services"]').click();
    await page.waitForURL("**/services");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  });

  test("every nav destination resolves", async ({ page }) => {
    for (const path of ["/", "/about", "/services", "/work", "/careers", "/contact"]) {
      const res = await page.goto(path);
      expect(res?.status(), `${path} status`).toBeLessThan(400);
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    }
  });

  test("keyboard focus reaches the primary CTA", async ({ page }) => {
    await page.goto("/");
    await settle(page);
    for (let i = 0; i < 12; i++) {
      await page.keyboard.press("Tab");
      const tag = await page.evaluate(() => document.activeElement?.tagName ?? "");
      if (tag === "A" || tag === "BUTTON") break;
    }
    const focused = await page.evaluate(() => document.activeElement?.tagName ?? "");
    expect(["A", "BUTTON"]).toContain(focused);
  });

  test("scroll-morph project frames open their project route", async ({ page }) => {
    await page.goto("/");
    await settle(page, 3600);
    const target = await page.evaluate(() => {
      const el = document.querySelector<HTMLElement>("[data-scroll-morph]");
      if (!el) return 0;
      return (
        el.getBoundingClientRect().top +
        window.scrollY +
        (el.offsetHeight - window.innerHeight) * 0.72
      );
    });
    await page.evaluate((y) => window.scrollTo(0, y), target);
    await page.waitForTimeout(1800);
    await page.locator('[data-scroll-morph] a[href="/work/custom-software-platform"]').first().click();
    await page.waitForURL("**/work/custom-software-platform");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Custom Software Platform");
  });
});

test.describe("mobile @ 390x844", () => {
  test.use({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
    userAgent:
      "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
  });

  test("homepage has no horizontal overflow", async ({ page }) => {
    await page.goto("/");
    await settle(page, 3600);
    await sweepTo(page, "top");
    const docW = await page.evaluate(() => document.documentElement.scrollWidth);
    expect(docW).toBeLessThanOrEqual(391);
    await page.screenshot({ path: shot("mobile-home-full.png"), fullPage: true });
  });

  test("mobile sections", async ({ page }) => {
    await page.goto("/");
    await settle(page, 3600);
    for (const [file, sel] of [
      ["mobile-services.png", "#services"],
      ["mobile-work.png", "#work"],
    ] as const) {
      const y = await page.evaluate((s) => {
        const el = document.querySelector(s);
        return el ? el.getBoundingClientRect().top + window.scrollY : 0;
      }, sel);
      await sweepTo(page, Math.max(0, y - 20));
      await page.screenshot({ path: shot(file) });
    }
    const morphTarget = await page.evaluate(() => {
      const el = document.querySelector<HTMLElement>("[data-scroll-morph]");
      if (!el) return 0;
      return (
        el.getBoundingClientRect().top +
        window.scrollY +
        (el.offsetHeight - window.innerHeight) * 0.72
      );
    });
    await sweepTo(page, morphTarget);
    await page.screenshot({ path: shot("mobile-work-morph.png") });
    await sweepTo(page, "bottom");
    await page.screenshot({ path: shot("mobile-footer.png") });
  });

  test("mobile menu opens full screen", async ({ page }) => {
    await page.goto("/");
    await settle(page);
    await page.getByRole("button", { name: /Menu/i }).click();
    await page.waitForTimeout(2600);
    await expect(page.locator("#site-menu")).toHaveAttribute("aria-hidden", "false");
    await page.screenshot({ path: shot("mobile-menu.png") });
  });
});

test.describe("reduced motion", () => {
  test.use({ viewport: { width: 1440, height: 1000 } });

  test("content is visible without animation", async ({ page }) => {
    // Set the media emulation explicitly rather than relying on the context
    // fixture — the fixture did not reach matchMedia in this Chromium build,
    // which silently turned this into a no-op test.
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    await page.waitForTimeout(2200);

    // guard: the emulation must actually be in effect or the assertion is meaningless
    expect(await page.evaluate(() => matchMedia("(prefers-reduced-motion: reduce)").matches)).toBe(
      true
    );
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    // headings further down must not stay stuck at opacity 0
    const diag = await page.evaluate(() => {
      const els = [...document.querySelectorAll("h2, h3")];
      return {
        mq: matchMedia("(prefers-reduced-motion: reduce)").matches,
        htmlCls: document.documentElement.className,
        hidden: els
          .filter((el) => {
            const cs = getComputedStyle(el);
            const r = el.getBoundingClientRect();
            return r.height > 0 && (cs.visibility === "hidden" || parseFloat(cs.opacity) < 0.05);
          })
          .map((el) => ({
            txt: (el.textContent || "").trim().slice(0, 40),
            vis: getComputedStyle(el).visibility,
            op: getComputedStyle(el).opacity,
          })),
      };
    });
    expect(diag, JSON.stringify(diag, null, 1)).toHaveProperty("hidden", []);
    await page.screenshot({ path: shot("desktop-reduced-motion.png") });
  });
});
