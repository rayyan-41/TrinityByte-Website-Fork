"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { nav } from "@/data/site";
import { TMark } from "@/components/ui/Logo";
import { LiquidMetalButton } from "@/components/ui/liquid-metal-button";
import {
  KineticMenuToggle,
  KineticMenuOverlay,
} from "@/components/ui/sterling-gate-kinetic-navigation";

declare global {
  interface Window {
    __lenis?: { stop: () => void; start: () => void };
  }
}

export function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // The overlay owns its own choreography; the header only holds the state and
  // freezes page scrolling while it is open.
  const toggle = useCallback((next: boolean) => {
    setOpen(next);
    if (next) window.__lenis?.stop();
    else window.__lenis?.start();
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") toggle(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [toggle]);

  return (
    <>
      {/* Top-center notched brand badge */}
      <div data-site-chrome className="pointer-events-none fixed inset-x-0 top-0 z-[60] flex justify-center">
        <Link
          href="/"
          aria-label="TrinityByte — home"
          onClick={() => toggle(false)}
          className="brand-notch pointer-events-auto flex h-[42px] items-center bg-ivory px-5 pb-2 pt-1.5 sm:h-[46px] sm:px-7"
        >
          {/* the mark stands in for the leading T, so it sizes off the font */}
          <span className="font-display text-[15px] font-semibold leading-none tracking-[-0.02em] text-ink sm:text-[17px]">
            <TMark className="inline-block h-[1.19em] -ml-[0.16em] -mr-[0.18em] align-[-0.213em]" />
            RINITYBYTE
          </span>
        </Link>
      </div>

      <header data-site-chrome className="pointer-events-none fixed inset-x-0 top-0 z-50">
        <div className="flex items-center justify-between px-[clamp(12px,1.4vw,22px)] py-[clamp(12px,1.3vw,20px)]">
          {/* Start a Project + clock */}
          <div className="flex items-center gap-5">
            <div className="pointer-events-auto hidden sm:block">
              <LiquidMetalButton href="/contact" onClick={() => toggle(false)} size="sm">
                Start Project
                <svg
                  viewBox="0 0 14 14"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-3.5 w-3.5 transition-transform duration-500 [transition-timing-function:var(--ease-out-expo)] group-hover:translate-x-0.5"
                  aria-hidden="true"
                >
                  <path d="M2.5 7h9M8 3.5 11.5 7 8 10.5" />
                </svg>
              </LiquidMetalButton>
            </div>
          </div>

          {/* Kinetic menu toggle */}
          <KineticMenuToggle
            open={open}
            onToggle={() => toggle(!open)}
            controls="site-menu"
            className="pointer-events-auto"
          />
        </div>
      </header>

      {/* Sterling Gate kinetic overlay */}
      <KineticMenuOverlay
        id="site-menu"
        open={open}
        onClose={() => toggle(false)}
        items={nav}
        activeHref={pathname}
      />
    </>
  );
}
