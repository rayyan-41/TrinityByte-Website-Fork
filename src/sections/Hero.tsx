"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { PillButton } from "@/components/ui/PillButton";
import { TMark } from "@/components/ui/Logo";
import { HeroField } from "@/sections/hero/HeroField";

gsap.registerPlugin(ScrollTrigger, SplitText);

export function Hero() {
  const rootRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const html = document.documentElement;
    // The hero owns the first screen, so the site chrome steps aside while it is
    // in view. The attribute is set pre-paint on "/" (see layout.tsx) and then
    // driven by the trigger below; clearing it on cleanup keeps navigation to
    // other pages from ever leaving the header hidden.
    const setChrome = (hidden: boolean) =>
      hidden ? html.setAttribute("data-hero-active", "") : html.removeAttribute("data-hero-active");

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ctx = gsap.context(() => {
      let introSplit: SplitText | null = null;

      if (headingRef.current) {
        introSplit = new SplitText(headingRef.current, { type: "lines", mask: "lines" });
        headingRef.current.style.visibility = "visible";
      }

      // `top bottom` puts the start above scroll 0, so at the very top of the
      // page the trigger is unambiguously active rather than sitting on its edge.
      ScrollTrigger.create({
        trigger: root,
        start: "top bottom",
        end: "bottom 15%",
        onToggle: (self) => setChrome(self.isActive),
      });
      setChrome(window.scrollY < root.offsetHeight * 0.85);

      if (reduced) {
        gsap.set("[data-intro-logo], [data-hero-fade]", { autoAlpha: 1 });
        return () => introSplit?.revert();
      }

      // The entrance animates the elements; the scroll exit below animates their
      // wrappers. Keeping the two on separate nodes means neither can paint over
      // the other, however early the visitor starts scrolling.
      const intro = gsap.timeline();
      intro.fromTo(
        "[data-intro-logo]",
        { autoAlpha: 0, y: 30, scale: 0.94 },
        { autoAlpha: 1, y: 0, scale: 1, duration: 1.4, ease: "expo.out" },
        0.1
      );
      if (introSplit) {
        intro.fromTo(
          introSplit.lines,
          { yPercent: 118 },
          { yPercent: 0, duration: 1.25, stagger: 0.1, ease: "expo.out" },
          0.35
        );
      }
      intro.fromTo(
        "[data-hero-fade]",
        { autoAlpha: 0, y: 24 },
        { autoAlpha: 1, y: 0, duration: 0.95, stagger: 0.08, ease: "power3.out" },
        0.6
      );
      // Restored scroll or back nav: the hero is already on its way out, so skip
      // straight to the settled state instead of replaying the entrance.
      if (window.scrollY > 2) intro.progress(1);

      // No pin: the page scrolls normally and the intro recedes as it leaves.
      gsap
        .timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: root,
            start: "top top",
            end: "bottom top",
            scrub: 0.6,
            invalidateOnRefresh: true,
          },
        })
        .to("[data-logo-exit]", { scale: 0.82, y: () => root.clientHeight * 0.18, autoAlpha: 0.15, duration: 1 }, 0)
        .to("[data-text-exit]", { y: -40, autoAlpha: 0, duration: 0.6 }, 0)
        .to("[data-corner-exit]", { autoAlpha: 0, duration: 0.3 }, 0);

      document.fonts?.ready.then(() => ScrollTrigger.refresh());

      return () => introSplit?.revert();
    }, root);

    return () => {
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
      {/* atmosphere — a wide champagne bloom with a hotter core behind the mark */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-[36%] h-[125svh] w-[125svh] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(200,171,114,0.26),rgba(200,171,114,0.08)_55%,transparent)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-[33%] h-[48svh] w-[48svh] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(229,205,150,0.30),transparent)] blur-2xl"
      />
      {/* cursor-reactive grid, faded toward the edges */}
      <HeroField className="[mask-image:radial-gradient(ellipse_75%_70%_at_50%_45%,black,transparent)]" />
      <div aria-hidden="true" className="grain pointer-events-none absolute inset-0 opacity-60" />
      {/* the glow and grain would otherwise stop in a hard line where the next section begins */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[28svh] bg-gradient-to-b from-transparent to-bg"
      />

      <div className="pointer-events-none relative z-10 flex h-full flex-col items-center justify-center px-6 pb-16 text-center">
        <div data-logo-exit>
          <div
            data-intro-logo
            data-anim-fade
            className="relative aspect-[506/493] h-[clamp(120px,28svh,260px)] sm:h-[clamp(150px,38svh,440px)]"
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
                sizes="(max-width: 640px) 70vw, 560px"
                className="h-full w-full object-contain drop-shadow-[0_30px_60px_rgba(0,0,0,0.55)]"
              />
              <span aria-hidden="true" className="logo-sheen absolute inset-0" />
            </div>
          </div>
        </div>

        <div data-text-exit className="flex flex-col items-center">
          <p
            data-hero-fade
            data-anim-fade
            className="mt-6 font-mono-brand text-[10px] uppercase tracking-[0.22em] text-gold sm:text-[11px]"
          >
            Hybrid Software House — Est. 2026
          </p>

          <h1
            ref={headingRef}
            data-intro-heading
            data-anim-hidden
            className="mx-auto mt-4 max-w-[1000px] text-balance font-display text-[clamp(34px,5vw,74px)] font-semibold leading-[1.02] tracking-[-0.045em] text-ivory"
          >
            We Build Digital Products That Deliver Results.
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

      <div data-corner-exit className="pointer-events-none absolute inset-0 z-10">
        <div
          data-hero-fade
          data-anim-fade
          className="absolute bottom-[clamp(20px,3vw,38px)] left-[clamp(20px,3vw,38px)] hidden items-center gap-3 sm:flex"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/[0.04] backdrop-blur">
            <TMark className="h-4 w-4" />
          </div>
          <div>
            <p className="font-mono-brand text-[10px] uppercase tracking-[0.2em] text-white/44">Worldwide delivery</p>
            <p className="mt-1 text-[13px] text-white/76">Islamabad, Pakistan · Remote-first</p>
          </div>
        </div>

        <div
          data-hero-fade
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
