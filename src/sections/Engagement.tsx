"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { engagementModels } from "@/data/company";
import { Pricing13 } from "@/components/ui/pricing-13";
import { Reveal } from "@/components/anim/Reveal";

gsap.registerPlugin(ScrollTrigger, SplitText);

const STRIP = ["Custom Scoped", "Transparent", "Flexible", "Partnership-First"];

export function Engagement() {
  const rootRef = useRef<HTMLElement>(null);
  const headRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;
    let split: SplitText | null = null;
    const ctx = gsap.context(() => {
      if (headRef.current) {
        split = new SplitText(headRef.current, { type: "words,chars" });
        gsap.fromTo(
          split.chars,
          { opacity: 0.1 },
          {
            opacity: 1,
            stagger: 0.02,
            ease: "none",
            scrollTrigger: { trigger: headRef.current, start: "top 82%", end: "bottom 46%", scrub: 0.4 },
          }
        );
      }
      gsap.fromTo(
        "[data-model-grid]",
        { autoAlpha: 0, y: 60 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 1.1,
          ease: "expo.out",
          scrollTrigger: { trigger: "[data-model-grid]", start: "top 82%", once: true },
        }
      );
    }, rootRef);
    return () => {
      split?.revert();
      ctx.revert();
    };
  }, []);

  return (
    <section ref={rootRef} className="bg-bg" aria-label="Engagement models" id="engagement">
      {/* label bar */}
      <div className="container-site flex items-center justify-between border-t border-line-dark pt-5">
        <p className="label-mono text-muted-dark">
          <span className="text-gold">©</span> Engagement models{" "}
        </p>
        <p className="label-mono hidden text-muted-dark md:block">(TBX® — 07)</p>
        <p className="label-mono text-muted-dark">Custom quotes</p>
      </div>

      <div className="container-site pb-[clamp(40px,5vw,72px)] pt-[clamp(48px,6vw,90px)]">
        <h2
          ref={headRef}
          className="max-w-[1200px] font-display text-[clamp(52px,8.3vw,120px)] font-semibold leading-[1.02] tracking-[-0.045em] text-ivory"
        >
          Pick a model. Scope it right.
        </h2>
      </div>

      {/* strip */}
      <div className="bg-ivory py-3">
        <div className="container-site flex flex-wrap items-center justify-between gap-x-8 gap-y-1">
          {STRIP.map((s) => (
            <span key={s} className="text-[14.5px] font-semibold text-ink">
              {s}
            </span>
          ))}
        </div>
      </div>

      {/* model picker */}
      <div className="bg-ivory pb-[clamp(56px,7vw,100px)] pt-[clamp(40px,5vw,72px)] text-ink">
        <div className="container-site">
          <div data-model-grid>
            <Pricing13
              plans={engagementModels}
              ctaLabel="Request a Custom Quote"
              ctaHref="/contact"
            />
          </div>

          <Reveal delay={0.1}>
            <p className="mx-auto mt-12 max-w-[620px] text-center text-[14px] leading-[1.6] text-muted-light">
              Every project is scoped according to requirements, complexity, timeline, and team
              composition — you get a proposal built around your product, not a template.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
