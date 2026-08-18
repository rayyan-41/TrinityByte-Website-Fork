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
     - ambient SVG shapes scale/rotate in on link hover (back.out easing)
     - "main" CustomEase (0.65, 0.01, 0.05, 0.99)
     - toggle label swaps Menu → Close, plus glyph rotates 315°

   Adapted:
     - TrinityByte's own six routes, not the demo's links
     - champagne/ivory shapes instead of the source's indigo/violet/pink
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

/* ---------------- ambient shapes (champagne / ivory) ---------------- */

const G1 = "rgba(200,171,114,0.20)";
const G2 = "rgba(217,196,150,0.15)";
const G3 = "rgba(242,239,233,0.10)";

function Shapes() {
  const common = "bg-shape pointer-events-none absolute inset-0 h-full w-full opacity-0";
  return (
    <div data-shapes className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* 1 — floating circles */}
      <svg data-shape="1" className={common} viewBox="0 0 400 400" fill="none" aria-hidden="true">
        <circle data-shape-el cx="80" cy="120" r="40" fill={G1} />
        <circle data-shape-el cx="300" cy="80" r="60" fill={G2} />
        <circle data-shape-el cx="200" cy="300" r="80" fill={G3} />
        <circle data-shape-el cx="350" cy="280" r="30" fill={G1} />
      </svg>
      {/* 2 — waves */}
      <svg data-shape="2" className={common} viewBox="0 0 400 400" fill="none" aria-hidden="true">
        <path data-shape-el d="M0 200 Q100 100, 200 200 T 400 200" stroke={G1} strokeWidth="60" fill="none" />
        <path data-shape-el d="M0 280 Q100 180, 200 280 T 400 280" stroke={G2} strokeWidth="40" fill="none" />
      </svg>
      {/* 3 — grid dots */}
      <svg data-shape="3" className={common} viewBox="0 0 400 400" fill="none" aria-hidden="true">
        {[50, 150, 250, 350].map((x) => (
          <circle key={`a${x}`} data-shape-el cx={x} cy="60" r="8" fill={G1} />
        ))}
        {[100, 200, 300].map((x) => (
          <circle key={`b${x}`} data-shape-el cx={x} cy="170" r="12" fill={G2} />
        ))}
        {[50, 150, 250, 350].map((x) => (
          <circle key={`c${x}`} data-shape-el cx={x} cy="280" r="10" fill={G3} />
        ))}
      </svg>
      {/* 4 — organic blobs */}
      <svg data-shape="4" className={common} viewBox="0 0 400 400" fill="none" aria-hidden="true">
        <path data-shape-el d="M100 100 Q150 50, 200 100 Q250 150, 200 200 Q150 250, 100 200 Q50 150, 100 100" fill={G1} />
        <path data-shape-el d="M250 200 Q300 150, 350 200 Q400 250, 350 300 Q300 350, 250 300 Q200 250, 250 200" fill={G3} />
      </svg>
      {/* 5 — diagonals */}
      <svg data-shape="5" className={common} viewBox="0 0 400 400" fill="none" aria-hidden="true">
        <line data-shape-el x1="0" y1="100" x2="300" y2="400" stroke={G1} strokeWidth="30" />
        <line data-shape-el x1="100" y1="0" x2="400" y2="300" stroke={G2} strokeWidth="25" />
        <line data-shape-el x1="200" y1="0" x2="400" y2="200" stroke={G3} strokeWidth="20" />
      </svg>
      {/* 6 — concentric rings */}
      <svg data-shape="6" className={common} viewBox="0 0 400 400" fill="none" aria-hidden="true">
        <circle data-shape-el cx="200" cy="200" r="60" stroke={G1} strokeWidth="18" fill="none" />
        <circle data-shape-el cx="200" cy="200" r="120" stroke={G2} strokeWidth="12" fill="none" />
        <circle data-shape-el cx="200" cy="200" r="175" stroke={G3} strokeWidth="8" fill="none" />
      </svg>
    </div>
  );
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

  /* hover-reactive ambient shapes */
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const cleanups: Array<() => void> = [];

    const ctx = gsap.context(() => {
      root.querySelectorAll<HTMLElement>("[data-menu-item][data-shape-key]").forEach((item) => {
        const key = item.dataset.shapeKey;
        const shape = root.querySelector<SVGElement>(`[data-shape="${key}"]`);
        if (!shape) return;
        const els = shape.querySelectorAll("[data-shape-el]");

        const enter = () => {
          gsap.to(shape, { autoAlpha: 1, duration: 0.2, overwrite: "auto" });
          gsap.fromTo(
            els,
            { scale: 0.5, opacity: 0, rotation: -10, transformOrigin: "50% 50%" },
            {
              scale: 1,
              opacity: 1,
              rotation: 0,
              duration: 0.6,
              stagger: 0.08,
              ease: "back.out(1.7)",
              overwrite: "auto",
            }
          );
        };

        const leave = () => {
          gsap.to(els, {
            scale: 0.8,
            opacity: 0,
            duration: 0.3,
            ease: "power2.in",
            overwrite: "auto",
            onComplete: () => gsap.set(shape, { autoAlpha: 0 }),
          });
        };

        item.addEventListener("mouseenter", enter);
        item.addEventListener("mouseleave", leave);
        item.addEventListener("focusin", enter);
        item.addEventListener("focusout", leave);
        cleanups.push(() => {
          item.removeEventListener("mouseenter", enter);
          item.removeEventListener("mouseleave", leave);
          item.removeEventListener("focusin", enter);
          item.removeEventListener("focusout", leave);
        });
      });
    }, rootRef);

    return () => {
      cleanups.forEach((fn) => fn());
      ctx.revert();
    };
  }, []);

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

        <Shapes />

        <div className="relative flex h-full flex-col justify-between px-[clamp(24px,5vw,64px)] pb-10 pt-[clamp(96px,12vh,140px)]">
          {/* only the route links live in the nav landmark — contact meta sits
              outside it so screen-reader nav lists stay clean */}
          <nav aria-label="Site">
            <ul className="flex flex-col">
            {items.map((item, i) => {
              const active = activeHref === item.href;
              return (
                <li
                  key={item.href}
                  data-menu-item
                  data-shape-key={i + 1}
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
          </nav>

          {footer ? <div className="mt-10">{footer}</div> : null}
        </div>
      </div>
    </div>
  );
}
