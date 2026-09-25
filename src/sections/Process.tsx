"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { processSteps } from "@/data/services";
import { ContainerScroll } from "@/components/ui/container-scroll-animation";

gsap.registerPlugin(ScrollTrigger);

/**
 * Ivory editorial band. The seven stages sit inside a scroll-driven perspective
 * panel that rotates upright as the section passes — the panel reads as the
 * process itself coming into focus.
 *
 * Copy is unchanged: same heading, same supporting lines, same seven stages
 * straight from `processSteps`.
 */
export function Process() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        "[data-step]",
        { autoAlpha: 0, y: 22 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.06,
          ease: "power3.out",
          scrollTrigger: { trigger: "[data-process-list]", start: "top 88%", once: true },
        }
      );
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={rootRef}
      className="bg-ivory pb-[var(--section-gap)] pt-[var(--section-gap)] text-ink"
      aria-label="Development process"
      id="process"
    >
      <div className="container-site">
        <div className="flex items-center border-t border-line-light pt-5">
          <p className="label-mono label-lead text-muted-light">
            <span className="text-gold-deep">©</span> How we work
          </p>
        </div>
      </div>

      {/*
        The title block drifts up 100px on scroll (see ContainerScroll), which
        used to carry the heading over the label bar above it. This clears the
        drift with room to spare — mobile needs more because its resting gap is
        smaller and all three labels are visible there.
      */}
      <ContainerScroll
        className="mt-24 md:mt-16"
        titleComponent={
          <div className="px-5">
            <h2 className="mx-auto max-w-[760px] font-display text-[clamp(34px,4.5vw,64px)] font-semibold leading-[1.02] tracking-[-0.04em] text-ink">
              Our development process.
            </h2>
            <p className="mx-auto mt-6 max-w-[520px] text-[15.5px] leading-[1.65] text-muted-light">
              Seven stages, zero guesswork — a process built for clarity from the first
              conversation to long-term support.
            </p>
            <p className="mt-6 font-mono-brand text-[11.5px] uppercase tracking-[0.16em] text-gold-deep">
              Discovery → Launch → Beyond
            </p>
          </div>
        }
      >
        <ol
          data-process-list
          className="grid h-full grid-cols-1 gap-x-8 gap-y-1 overflow-hidden p-4 sm:grid-cols-2 md:p-2"
        >
          {processSteps.map((step) => (
            <li
              key={step.index}
              data-step
              className="flex items-baseline gap-3.5 border-b border-white/[0.07] py-2.5 last:border-b-0 sm:gap-4 sm:py-4"
            >
              <span className="font-mono-brand text-[11px] font-medium text-gold sm:text-[12px]">
                {step.index}
              </span>
              <div className="min-w-0">
                <h3 className="font-display text-[15px] font-semibold tracking-[-0.02em] text-ivory sm:text-[clamp(15px,1.35vw,19px)]">
                  {step.title}
                </h3>
                <p className="mt-1 text-[11.5px] leading-[1.45] text-muted-dark sm:mt-1.5 sm:text-[12.5px] sm:leading-[1.5] md:text-[13px]">
                  {step.copy}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </ContainerScroll>
    </section>
  );
}
