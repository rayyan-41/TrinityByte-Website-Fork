"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MapPin } from "lucide-react";
import { PillButton } from "@/components/ui/PillButton";
import { HeroField } from "@/sections/hero/HeroField";

gsap.registerPlugin(ScrollTrigger);

/** How much bigger the mark sits on landing than in its settled spot above the copy. */
const LANDING_SCALE = 1.25;
/** Swipe distance (px) that counts as one scroll on touch. */
const SWIPE = 30;
/** Extra hold after the reveal so trackpad momentum doesn't carry on past the hero. */
const SETTLE_MS = 350;

const DOWN_KEYS = new Set(["ArrowDown", "PageDown", "End", " "]);
const UP_KEYS = new Set(["ArrowUp", "PageUp", "Home"]);

export function Hero() {
  const rootRef = useRef<HTMLElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const logo = logoRef.current;
    if (!root || !logo) return;

    const html = document.documentElement;
    // The hero owns the first screen, so the site chrome steps aside while it is
    // in view. The attribute is set pre-paint on "/" (see layout.tsx) and then
    // driven by the trigger below; clearing it on cleanup keeps navigation to
    // other pages from ever leaving the header hidden.
    const setChrome = (hidden: boolean) =>
      hidden ? html.setAttribute("data-hero-active", "") : html.removeAttribute("data-hero-active");

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let detach = () => {};

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: root,
        start: "top bottom",
        end: "bottom 15%",
        onToggle: (self) => setChrome(self.isActive),
      });
      setChrome(root.getBoundingClientRect().bottom > window.innerHeight * 0.15);

      if (reduced) {
        gsap.set("[data-intro-logo], [data-hero-label], [data-hero-fade], [data-hero-cue]", { autoAlpha: 1 });
        return;
      }

      // Entrance: only the mark, its label and the scroll cue — the copy waits
      // for scroll. It animates the inner nodes; the reveal below moves the
      // wrapper, so the two never fight over the same transform.
      gsap
        .timeline()
        .fromTo(
          "[data-intro-logo]",
          { autoAlpha: 0, y: 30, scale: 0.94 },
          { autoAlpha: 1, y: 0, scale: 1, duration: 1.4, ease: "expo.out" },
          0.1
        )
        .fromTo("[data-hero-label]", { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 1, ease: "power3.out" }, 0.55)
        .fromTo("[data-hero-cue]", { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.8, ease: "power2.out" }, 0.9);

      // offsetTop ignores transforms, so this measures the settled position
      const centreOffset = () => logo.offsetParent!.clientHeight / 2 - (logo.offsetTop + logo.offsetHeight / 2);

      // The reveal is a timed step, not a scrub: one scroll plays it through —
      // the mark rises from dead centre and eases down in size, then the copy
      // arrives beneath it — and the next scroll leaves the hero as normal. The
      // scroll cue stays put through both steps, since there is always more below.
      const reveal = gsap
        .timeline({ paused: true })
        .fromTo(
          logo,
          { y: centreOffset, scale: LANDING_SCALE },
          { y: 0, scale: 1, duration: 1.05, ease: "power3.inOut" },
          0
        )
        .fromTo(
          "[data-hero-fade]",
          { autoAlpha: 0, y: 26 },
          { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.08, ease: "power3.out" },
          0.5
        );
      // a staggered fromTo pre-renders only its first target; set the rest now
      gsap.set("[data-hero-fade]", { autoAlpha: 0, y: 26 });

      // Scroll restored below the top (reload, back nav): arrive already revealed.
      let state: "landing" | "moving" | "revealed" = window.scrollY > 2 ? "revealed" : "landing";
      if (state === "revealed") reveal.progress(1);

      const play = (forward: boolean) => {
        state = "moving";
        if (forward) reveal.timeScale(1).play();
        else reveal.timeScale(1.4).reverse();
        reveal.eventCallback(forward ? "onComplete" : "onReverseComplete", () => {
          window.setTimeout(() => (state = forward ? "revealed" : "landing"), SETTLE_MS);
        });
      };

      // Page scroll is held while the hero is landing or mid-reveal. Listening in
      // the capture phase on window means Lenis never sees the held input either.
      const hold = (e: Event) => {
        e.preventDefault();
        e.stopPropagation();
      };
      const atTop = () => window.scrollY <= 2;

      const onWheel = (e: WheelEvent) => {
        if (state === "moving") return hold(e);
        if (state === "landing") {
          hold(e);
          if (e.deltaY > 0) play(true);
        } else if (e.deltaY < 0 && atTop()) {
          hold(e);
          play(false);
        }
      };

      let touchY: number | null = null;
      const onTouchStart = (e: TouchEvent) => {
        touchY = e.touches[0]?.clientY ?? null;
      };
      const onTouchMove = (e: TouchEvent) => {
        const y = e.touches[0]?.clientY;
        if (touchY === null || y === undefined) return;
        const dy = touchY - y; // > 0: finger moved up, page wants to scroll down
        if (state === "moving") return hold(e);
        if (state === "landing") {
          hold(e);
          if (dy > SWIPE) {
            touchY = null;
            play(true);
          }
        } else if (dy < -SWIPE && atTop()) {
          hold(e);
          touchY = null;
          play(false);
        }
      };

      const onKey = (e: KeyboardEvent) => {
        const t = e.target as HTMLElement | null;
        if (t?.closest("input, textarea, select, [contenteditable]")) return;
        const down = DOWN_KEYS.has(e.key) && !(e.key === " " && e.shiftKey);
        const up = UP_KEYS.has(e.key) || (e.key === " " && e.shiftKey);
        if (!down && !up) return;
        if (state === "moving") return hold(e);
        if (state === "landing" && down) {
          hold(e);
          play(true);
        } else if (state === "revealed" && up && atTop()) {
          hold(e);
          play(false);
        }
      };

      // anything that moves the page anyway (scrollbar drag, anchor jump) skips
      // straight to the revealed state rather than leaving the copy hidden
      const onScroll = () => {
        if (state === "landing" && !atTop()) {
          reveal.progress(1);
          state = "revealed";
        }
      };
      // the landing offset is measured, so re-measure it when the viewport changes
      const onResize = () => {
        if (state === "landing") gsap.set(logo, { y: centreOffset() });
      };

      const opts = { capture: true, passive: false } as const;
      window.addEventListener("wheel", onWheel, opts);
      window.addEventListener("touchstart", onTouchStart, { capture: true, passive: true });
      window.addEventListener("touchmove", onTouchMove, opts);
      window.addEventListener("keydown", onKey, { capture: true });
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", onResize);
      detach = () => {
        window.removeEventListener("wheel", onWheel, opts);
        window.removeEventListener("touchstart", onTouchStart, { capture: true });
        window.removeEventListener("touchmove", onTouchMove, opts);
        window.removeEventListener("keydown", onKey, { capture: true });
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener("resize", onResize);
      };
    }, root);

    return () => {
      detach();
      ctx.revert();
      setChrome(false);
    };
  }, []);

  return (
    <section
      ref={rootRef}
      data-hero
      className="relative h-svh min-h-[640px] overflow-hidden bg-bg"
      aria-label="TrinityByte introduction"
    >
      {/* dot lattice with a cursor trail of mono glyphs, faded toward the edges */}
      <HeroField className="[mask-image:radial-gradient(ellipse_75%_70%_at_50%_45%,black,transparent)]" />
      <div aria-hidden="true" className="grain pointer-events-none absolute inset-0 opacity-60" />
      {/* the glow and grain would otherwise stop in a hard line where the next section begins */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[28svh] bg-gradient-to-b from-transparent to-bg"
      />

      <div className="pointer-events-none relative z-10 flex h-full flex-col items-center justify-center px-6 pb-16 text-center">
        {/* the mark and its label land together and travel as one */}
        <div ref={logoRef} className="flex flex-col items-center">
          <div className="relative">
            {/* atmosphere rides with the mark — a wide champagne bloom with a hotter core */}
            <div
              aria-hidden="true"
              className="absolute left-1/2 top-1/2 h-[125svh] w-[125svh] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(200,171,114,0.26),rgba(200,171,114,0.08)_55%,transparent)]"
            />
            <div
              aria-hidden="true"
              className="absolute left-1/2 top-1/2 h-[48svh] w-[48svh] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(229,205,150,0.30),transparent)] blur-2xl"
            />
            <div
              data-intro-logo
              data-anim-fade
              className="relative aspect-[506/493] h-[clamp(110px,24svh,240px)] sm:h-[clamp(140px,32svh,380px)]"
            >
              {/* the PNG carries wide transparent margins; scaling the artwork (not the
                  box) makes the mark itself read bigger without pushing the copy down */}
              <div className="absolute inset-0 scale-[1.32]">
                <Image
                  src="/brand/TB_logo_no_bg.png"
                  alt="TrinityByte"
                  width={506}
                  height={493}
                  priority
                  sizes="(max-width: 640px) 70vw, 620px"
                  className="h-full w-full object-contain drop-shadow-[0_30px_60px_rgba(0,0,0,0.55)]"
                />
                <span aria-hidden="true" className="logo-sheen absolute inset-0" />
              </div>
            </div>
          </div>

          <p
            data-hero-label
            data-anim-fade
            className="relative mt-6 font-mono-brand text-[10px] uppercase tracking-[0.22em] text-gold sm:text-[11px]"
          >
            Hybrid Software House — Est. 2026
          </p>
        </div>

        <div className="flex flex-col items-center">
          <h1
            data-hero-fade
            data-anim-fade
            className="mx-auto mt-4 max-w-[1000px] text-balance font-display text-[clamp(34px,5vw,74px)] font-semibold leading-[1.02] tracking-[-0.045em] text-ivory"
          >
            Digital Products that Deliver Results.
          </h1>

          <p
            data-hero-fade
            data-anim-fade
            className="mx-auto mt-5 max-w-[640px] text-balance text-[clamp(15px,1.25vw,18px)] leading-[1.55] text-ivory/70"
          >
            TrinityByte builds scalable, high-performance software for startups, businesses, and ambitious teams worldwide.
          </p>

          <div data-hero-fade data-anim-fade className="pointer-events-auto mt-8">
            <PillButton href="/contact" tone="light" size="lg">
              Start a Project
            </PillButton>
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-0 z-10">
        <p
          data-hero-fade
          data-anim-fade
          className="absolute bottom-[clamp(20px,3vw,38px)] left-[clamp(20px,3vw,38px)] hidden items-center gap-2 text-[13px] text-white/76 sm:flex"
        >
          <MapPin className="h-4 w-4 text-gold" strokeWidth={1.6} aria-hidden="true" />
          Islamabad, Pakistan
        </p>

        <div
          data-hero-cue
          data-anim-fade
          className="absolute bottom-[clamp(22px,3vw,40px)] right-[clamp(20px,3vw,38px)] flex items-center gap-2 text-white/60"
        >
          <span className="hidden font-mono-brand text-[9px] uppercase tracking-[0.2em] sm:block">Scroll to explore</span>
          <svg
            viewBox="0 0 16 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="scroll-cue-arrow h-6 w-4 text-gold"
            aria-hidden="true"
          >
            <path d="M8 3v17M2.5 14.5 8 20l5.5-5.5" />
          </svg>
        </div>
      </div>

      <p className="sr-only">
        TrinityByte combines strategy, design, engineering, quality assurance, and automation to build reliable digital products for businesses worldwide.
      </p>
    </section>
  );
}
