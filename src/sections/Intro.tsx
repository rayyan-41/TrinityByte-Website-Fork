"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { PillButton } from "@/components/ui/PillButton";
import { Reveal } from "@/components/anim/Reveal";

gsap.registerPlugin(ScrollTrigger, SplitText);

function TMarkOutline({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 96 96" className={className} fill="none" stroke="currentColor" strokeWidth="1.1" aria-hidden="true">
      <rect x="4" y="16" width="36" height="9" />
      <rect x="56" y="16" width="36" height="9" />
      <rect x="4" y="31" width="36" height="9" />
      <rect x="56" y="31" width="36" height="9" />
      <rect x="43" y="16" width="4.6" height="66" />
      <rect x="48.4" y="16" width="4.6" height="66" />
    </svg>
  );
}

const STATEMENT =
  "We're a hybrid software house built on one belief — every great idea deserves exceptional execution.";

export function Intro() {
  const rootRef = useRef<HTMLElement>(null);
  const stRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;
    let split: SplitText | null = null;
    const ctx = gsap.context(() => {
      if (stRef.current) {
        split = new SplitText(stRef.current, { type: "words" });
        gsap.fromTo(
          split.words,
          { opacity: 0.14 },
          {
            opacity: 1,
            stagger: 0.05,
            ease: "none",
            scrollTrigger: {
              trigger: stRef.current,
              start: "top 80%",
              end: "bottom 45%",
              scrub: 0.5,
            },
          }
        );
      }
      // slow-rotating outline mark
      gsap.to("[data-intro-mark]", {
        rotate: 8,
        yPercent: -12,
        ease: "none",
        scrollTrigger: { trigger: rootRef.current, start: "top bottom", end: "bottom top", scrub: true },
      });
    }, rootRef);
    return () => {
      split?.revert();
      ctx.revert();
    };
  }, []);

  return (
    <section ref={rootRef} className="container-site relative bg-bg pb-[clamp(60px,7vw,110px)] pt-[var(--section-gap)]" aria-label="About TrinityByte">
      <p
        ref={stRef}
        className="max-w-[1180px] font-display text-[clamp(34px,4.6vw,66px)] font-semibold leading-[1.08] tracking-[-0.035em] text-ivory"
      >
        {STATEMENT}
      </p>

      <div className="relative mt-[clamp(48px,6vw,96px)] grid grid-cols-1 gap-12 md:grid-cols-12">
        <Reveal className="md:col-span-4 lg:col-span-3">
          <div className="group relative aspect-[4/3] w-full max-w-[380px] overflow-hidden rounded-2xl">
            <Image
              src="/brand/t-mark-metallic.jpg"
              alt="The TrinityByte monogram — a brushed-metal triple-T mark in champagne gold"
              fill
              sizes="(max-width: 768px) 90vw, 380px"
              className="object-cover transition-transform duration-700 [transition-timing-function:var(--ease-out-expo)] group-hover:scale-[1.06]"
            />
          </div>
        </Reveal>

        <div className="md:col-span-5 lg:col-span-4 lg:col-start-5">
          <Reveal delay={0.08}>
            <p className="max-w-[430px] text-[15.5px] leading-[1.65] text-muted-dark">
              TrinityByte is a modern hybrid software house delivering innovative, scalable, and
              high-performance software for businesses across Pakistan and international markets —
              transforming ideas into digital products that solve real-world problems.
            </p>
            <div className="mt-10">
              <PillButton href="/about" tone="light">
                About TrinityByte
              </PillButton>
            </div>
          </Reveal>
        </div>

        <div
          data-intro-mark
          className="pointer-events-none absolute -right-4 -top-10 hidden text-gold/60 lg:block"
        >
          <TMarkOutline className="h-[190px] w-[190px]" />
        </div>
      </div>
    </section>
  );
}
