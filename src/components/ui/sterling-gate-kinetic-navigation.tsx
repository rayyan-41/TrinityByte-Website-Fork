"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { CustomEase } from "gsap/CustomEase";
import { LiquidMetalButton } from "@/components/ui/liquid-metal-button";

if (typeof window !== "undefined") {
  gsap.registerPlugin(CustomEase);
  if (!gsap.parseEase("main")) {
    CustomEase.create("main", "0.65, 0.01, 0.05, 0.99");
  }
}

/* ============================================================
   Sterling Gate kinetic navigation, adapted for TrinityByte.

   Motion kept from the source:
     - panel slides in from the right behind three staggered backdrop layers
     - links rise with yPercent 140 → 0 and rotate 10 → 0
     - "main" CustomEase (0.65, 0.01, 0.05, 0.99)
     - toggle label swaps Menu → Close, plus glyph rotates 315°

   Adapted:
     - TrinityByte's own six routes, not the demo's links
     - Hover indicator: a gold S-wave that reveals from the top down to the
       hovered nav item via stroke-dashoffset; distance-based duration so
       adjacent steps are smooth and long jumps feel snappy
     - Tailwind + inline styles, since the source shipped no CSS
     - links leave the tab order while closed; Escape and backdrop close it
   ============================================================ */

export type NavItem = { label: string; href: string };

/* ---------------- toggle ---------------- */

export function KineticMenuToggle({
  open,
  onToggle,
  controls,
  className = "",
}: {
  open: boolean;
  onToggle: () => void;
  controls: string;
  className?: string;
}) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      const duration = reduced ? 0 : 0.55;
      gsap.to(root.querySelectorAll("[data-toggle-label]"), {
        yPercent: open ? -100 : 0,
        duration,
        stagger: reduced ? 0 : 0.08,
        ease: "main",
        overwrite: "auto",
      });
      gsap.to(root.querySelector("[data-toggle-icon]"), {
        rotate: open ? 315 : 0,
        duration,
        ease: "main",
        overwrite: "auto",
      });
    }, rootRef);

    return () => ctx.revert();
  }, [open]);

  return (
    <div ref={rootRef} className={className}>
      <LiquidMetalButton
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        aria-controls={controls}
        aria-label={open ? "Close menu" : "Open menu"}
        size="sm"
        className="pointer-events-auto"
      >
        <span className="relative block h-[18px] w-[42px] overflow-hidden text-left" aria-hidden="true">
          <span data-toggle-label className="absolute inset-x-0 top-0 block text-[14px] font-medium leading-[18px]">
            Menu
          </span>
          <span data-toggle-label className="absolute inset-x-0 top-full block text-[14px] font-medium leading-[18px]">
            Close
          </span>
        </span>
        <span data-toggle-icon className="inline-flex h-3.5 w-3.5 items-center justify-center">
          <svg viewBox="0 0 16 16" fill="none" className="h-full w-full" aria-hidden="true">
            <path d="M7.33333 16L7.33333 0L8.66667 0L8.66667 16L7.33333 16Z" fill="currentColor" />
            <path d="M16 8.66667L0 8.66667L0 7.33333L16 7.33333L16 8.66667Z" fill="currentColor" />
            <path d="M6 7.33333L7.33333 7.33333L7.33333 6C7.33333 6.73637 6.73638 7.33333 6 7.33333Z" fill="currentColor" />
            <path d="M10 7.33333L8.66667 7.33333L8.66667 6C8.66667 6.73638 9.26362 7.33333 10 7.33333Z" fill="currentColor" />
            <path d="M6 8.66667L7.33333 8.66667L7.33333 10C7.33333 9.26362 6.73638 8.66667 6 8.66667Z" fill="currentColor" />
            <path d="M10 8.66667L8.66667 8.66667L8.66667 10C8.66667 9.26362 9.26362 8.66667 10 8.66667Z" fill="currentColor" />
          </svg>
        </span>
      </LiquidMetalButton>
    </div>
  );
}

/* ---------------- curvy nav indicator ---------------- */

/**
 * Builds an S-wave SVG path through `n` items, each 100 viewBox units tall.
 * Even segments curve left (cpX = 3), odd segments curve right (cpX = 29),
 * all anchored at x = 16 (centre of a 32-wide viewBox).
 */
function buildSnakePath(n: number): string {
  let d = "M 16 0";
  for (let i = 0; i < n; i++) {
    const y0 = i * 100;
    const cpX = i % 2 === 0 ? 3 : 29;
    d += ` C ${cpX} ${y0 + 28},${cpX} ${y0 + 72},16 ${(i + 1) * 100}`;
  }
  return d;
}

/* ---------------- overlay ---------------- */

export function KineticMenuOverlay({
  id,
  open,
  onClose,
  items,
  activeHref,
  footer,
}: {
  id: string;
  open: boolean;
  onClose: () => void;
  items: NavItem[];
  activeHref?: string;
  footer?: React.ReactNode;
}) {
  const rootRef = useRef<HTMLDivElement>(null);

  /* open / close choreography */
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      const panel = root.querySelector("[data-menu-panel]");
      const scrim = root.querySelector("[data-menu-scrim]");
      const layers = root.querySelectorAll("[data-backdrop-layer]");
      const links = root.querySelectorAll("[data-nav-link]");
      const meta = root.querySelectorAll("[data-menu-fade]");
      const d = reduced ? 0 : undefined;

      const tl = gsap.timeline({ defaults: { ease: "main", duration: reduced ? 0 : 0.7 } });

      if (open) {
        tl.set(root, { display: "block" })
          .fromTo(scrim, { autoAlpha: 0 }, { autoAlpha: 1, duration: d ?? 0.5 }, 0)
          .fromTo(panel, { xPercent: 101 }, { xPercent: 0, duration: d ?? 0.7 }, 0)
          .fromTo(
            layers,
            { xPercent: 101 },
            { xPercent: 0, stagger: reduced ? 0 : 0.12, duration: d ?? 0.575 },
            0
          )
          .fromTo(
            links,
            { yPercent: 140, rotate: 10 },
            { yPercent: 0, rotate: 0, stagger: reduced ? 0 : 0.05 },
            reduced ? 0 : "<+=0.35"
          );

        if (meta.length) {
          tl.fromTo(
            meta,
            { autoAlpha: 0, yPercent: 50 },
            { autoAlpha: 1, yPercent: 0, stagger: reduced ? 0 : 0.04, clearProps: "all" },
            reduced ? 0 : "<+=0.2"
          );
        }
      } else {
        tl.to(scrim, { autoAlpha: 0, duration: d ?? 0.45 }, 0)
          .to(panel, { xPercent: 101, duration: d ?? 0.5 }, 0)
          .set(root, { display: "none" });
      }
    }, rootRef);

    return () => ctx.revert();
  }, [open]);

  /* curvy S-wave indicator — tracks the hovered nav item */
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const n = items.length;
    const iSvg  = root.querySelector<SVGSVGElement>("[data-indicator-svg]");
    const iPath = root.querySelector<SVGPathElement>("[data-indicator-path]");
    const iDot  = root.querySelector<HTMLElement>("[data-indicator-dot]");
    const navEl = root.querySelector<HTMLElement>("nav");
    if (!iSvg || !iPath || !iDot || !navEl) return;

    const prevIndex = { current: -1 };
    const cleanups: Array<() => void> = [];

    const show = (index: number) => {
      const prev = prevIndex.current;
      // Scale duration with distance so close steps feel smooth and
      // long jumps feel snappy (roughly constant apparent velocity).
      const distance = prev < 0 ? index + 1 : Math.abs(index - prev);
      const duration = 0.22 + Math.min(distance, 5) * 0.055;
      const targetOffset = 100 * (1 - (index + 1) / n);
      const targetTop    = `${((index + 1) / n) * 100}%`;

      prevIndex.current = index;

      gsap.to(iSvg, { autoAlpha: 1, duration: 0.18, overwrite: "auto" });
      gsap.to(iPath, {
        attr: { strokeDashoffset: targetOffset },
        duration,
        ease: "power2.out",
        overwrite: "auto",
      });
      gsap.to(iDot, {
        top: targetTop,
        autoAlpha: 1,
        duration,
        ease: "power2.out",
        overwrite: "auto",
      });
    };

    const hide = () => {
      prevIndex.current = -1;
      gsap.to([iSvg, iDot], { autoAlpha: 0, duration: 0.3, overwrite: "auto" });
    };

    root.querySelectorAll<HTMLElement>("[data-menu-item]").forEach((item) => {
      const idxStr = item.dataset.itemIndex;
      if (idxStr === undefined) return;
      const index = parseInt(idxStr, 10);
      const enter = () => show(index);
      item.addEventListener("mouseenter", enter);
      cleanups.push(() => item.removeEventListener("mouseenter", enter));
    });

    navEl.addEventListener("mouseleave", hide);
    cleanups.push(() => navEl.removeEventListener("mouseleave", hide));

    return () => cleanups.forEach((fn) => fn());
  // items.length is stable for this nav; include it so the closure stays fresh.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items.length]);

  return (
    <div
      ref={rootRef}
      id={id}
      aria-hidden={!open}
      className="fixed inset-0 z-40 hidden"
    >
      <div data-menu-scrim className="absolute inset-0 bg-black/65 opacity-0" onClick={onClose} />

      <div
        data-menu-panel
        className="absolute inset-y-0 right-0 w-full overflow-hidden md:w-[min(620px,86vw)]"
      >
        {/* staggered backdrop layers */}
        <div data-backdrop-layer className="absolute inset-0 bg-[#0f0f11]" aria-hidden="true" />
        <div data-backdrop-layer className="absolute inset-0 bg-[#0b0b0d]" aria-hidden="true" />
        <div data-backdrop-layer className="grain absolute inset-0 border-l border-gold/20 bg-bg-elev" aria-hidden="true" />

        <div className="relative flex h-full flex-col justify-between px-[clamp(24px,5vw,64px)] pb-10 pt-[clamp(96px,12vh,140px)]">
          {/* only the route links live in the nav landmark — contact meta sits
              outside it so screen-reader nav lists stay clean */}
          <nav aria-label="Site">
            {/* Relative wrapper lets the absolute indicator align to the list */}
            <div className="relative">
              {/* S-wave indicator — hidden until first hover */}
              <svg
                data-indicator-svg
                aria-hidden="true"
                className="pointer-events-none absolute inset-y-0 left-0 h-full w-8 opacity-0"
                viewBox={`0 0 32 ${items.length * 100}`}
                preserveAspectRatio="none"
              >
                {/* Ghost: full path, very faint, always visible while svg is shown */}
                <path
                  d={buildSnakePath(items.length)}
                  fill="none"
                  stroke="rgba(200,171,114,0.07)"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  vectorEffect="non-scaling-stroke"
                />
                {/* Active reveal — stroke-dashoffset driven by GSAP */}
                <path
                  data-indicator-path
                  d={buildSnakePath(items.length)}
                  fill="none"
                  stroke="rgba(200,171,114,0.80)"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  pathLength="100"
                  strokeDasharray="100"
                  strokeDashoffset="100"
                  vectorEffect="non-scaling-stroke"
                />
              </svg>

              {/* Glowing dot that rides to the current item boundary */}
              <div
                data-indicator-dot
                aria-hidden="true"
                className="pointer-events-none absolute left-4 h-[9px] w-[9px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold opacity-0 shadow-[0_0_8px_3px_rgba(200,171,114,0.45)]"
                style={{ top: `${(1 / items.length) * 100}%` }}
              />

              <ul className="flex flex-col">
              {items.map((item, i) => {
                const active = activeHref === item.href;
                return (
                  <li
                    key={item.href}
                    data-menu-item
                    data-item-index={i}
                    className="overflow-hidden border-b border-line-dark last:border-b-0"
                  >
                    <Link
                      href={item.href}
                      onClick={onClose}
                      tabIndex={open ? 0 : -1}
                      className="group relative flex items-baseline gap-5 py-2 outline-none"
                    >
                      <span
                        data-nav-link
                        className="inline-block font-mono-brand text-[11px] text-gold"
                      >
                        0{i + 1}
                      </span>
                      <span
                        data-nav-link
                        className={`inline-block font-display text-[clamp(32px,5vw,58px)] font-semibold leading-[1.14] tracking-[-0.04em] transition-colors duration-300 group-hover:text-gold group-focus-visible:text-gold ${
                          active ? "text-gold" : "text-ivory"
                        }`}
                      >
                        {item.label}
                      </span>
                    </Link>
                  </li>
                );
              })}
              </ul>
            </div>
          </nav>

          {footer ? <div className="mt-10">{footer}</div> : null}
        </div>
      </div>
    </div>
  );
}
