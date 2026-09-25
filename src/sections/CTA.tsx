"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { site } from "@/data/site";
import { SplitReveal } from "@/components/anim/SplitReveal";
import { Reveal } from "@/components/anim/Reveal";
import { PillButton } from "@/components/ui/PillButton";
import { TMark } from "@/components/ui/Logo";

gsap.registerPlugin(ScrollTrigger);

export function CTA() {
  const rootRef = useRef<HTMLElement>(null);

  // The CTA closes every page it appears on, so rather than scrolling on to the
  // footer, the CTA holds still once its bottom meets the viewport and the footer
  // (z-10 in Footer.tsx) slides up over it. The pin is position:fixed, so it
  // escapes <main> — plain CSS sticky could not, since the footer sits outside.
  useEffect(() => {
    const root = rootRef.current;
    const footer = document.querySelector<HTMLElement>("body footer");
    if (!root || !footer || root.parentElement?.lastElementChild !== root) return;
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: root,
        start: "bottom bottom",
        end: () => `+=${footer.offsetHeight}`,
        pin: true,
        pinSpacing: false,
        invalidateOnRefresh: true,
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={rootRef} className="relative overflow-hidden bg-bg" aria-label="Start a project">
      {/* atmosphere */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[120%] w-[70%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(200,171,114,0.1),transparent)]" />
      <TMark className="pointer-events-none absolute -right-[4%] top-1/2 h-[72%] w-auto -translate-y-1/2 text-white opacity-[0.028]" />

      <div className="container-site relative py-[calc(var(--section-gap)*1.05)] text-center">
        <Reveal y={20}>
          <p className="label-mono text-muted-dark">
            <span className="text-gold">©</span> Have an idea?
          </p>
        </Reveal>

        <SplitReveal
          as="h2"
          className="mx-auto mt-8 max-w-[1150px] font-display text-[clamp(52px,8vw,116px)] font-semibold leading-[0.99] tracking-[-0.045em] text-ivory"
          stagger={0.09}
        >
          Let&rsquo;s build something extraordinary.
        </SplitReveal>

        <Reveal delay={0.2}>
          <p className="mx-auto mt-8 max-w-[520px] text-[15.5px] leading-[1.65] text-muted-dark">
            Tell us where you want to go — we&rsquo;ll bring the strategy, the design, and the code.
            {" "}
            <span className="text-ivory/80">{site.tagline}</span>
          </p>
        </Reveal>

        <Reveal delay={0.3}>
          <div className="mt-11 flex flex-wrap items-center justify-center gap-4">
            <PillButton href="/contact" tone="gold" size="lg">
              Start a Project
            </PillButton>
            <PillButton href={`mailto:${site.email}`} tone="dark" size="lg" external>
              {site.email}
            </PillButton>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
