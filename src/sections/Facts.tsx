"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const FACTS = [
  { value: "2026", suffix: "", count: false, label: ["Established — hybrid", "& remote-first"] },
  { value: "05", suffix: "", count: true, label: ["Core services", "under one roof"] },
  { value: "07", suffix: "", count: true, label: ["Stage development", "process"] },
];

export function Facts() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>("[data-fact-num]").forEach((el) => {
        const target = el.dataset.value ?? "0";
        const shouldCount = el.dataset.count === "true" && !reduced;
        if (shouldCount) {
          const obj = { n: 0 };
          gsap.to(obj, {
            n: parseInt(target, 10),
            duration: 1.6,
            ease: "power2.out",
            scrollTrigger: { trigger: el, start: "top 85%", once: true },
            onUpdate: () => {
              el.textContent = String(Math.round(obj.n)).padStart(target.length, "0");
            },
          });
        } else {
          el.textContent = target;
        }
      });
      if (!reduced) {
        gsap.fromTo(
          "[data-fact-cell]",
          { autoAlpha: 0, y: 46 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 1.1,
            stagger: 0.12,
            ease: "expo.out",
            scrollTrigger: { trigger: rootRef.current, start: "top 82%", once: true },
          }
        );
      } else {
        gsap.set("[data-fact-cell]", { autoAlpha: 1 });
      }
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={rootRef} className="container-site bg-bg pb-[var(--section-gap)]" aria-label="TrinityByte at a glance">
      <div className="flex items-center justify-between border-t border-line-dark pt-5">
        <p className="label-mono text-muted-dark">
          <span className="text-gold">©</span> At a glance
        </p>
        <p className="label-mono hidden text-muted-dark sm:block">Global delivery · Worldwide</p>
      </div>
      <div className="mt-[clamp(36px,5vw,72px)] grid grid-cols-1 gap-y-14 sm:grid-cols-3">
        {FACTS.map((f) => (
          <div key={f.value} data-fact-cell data-anim-fade>
            <p
              className="font-display text-[clamp(72px,8vw,116px)] font-semibold leading-none tracking-[-0.04em] text-ivory"
              style={{ fontFeatureSettings: '"zero" 1' }}
            >
              <span data-fact-num data-value={f.value} data-count={f.count}>
                {f.count ? "00" : f.value}
              </span>
              {f.suffix}
            </p>
            <p className="mt-5 text-[15.5px] font-medium leading-[1.4] text-ivory/80">
              {f.label[0]}
              <br />
              {f.label[1]}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
