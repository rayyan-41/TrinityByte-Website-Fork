"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Database,
  MonitorSmartphone,
  Server,
  Smartphone,
  Wrench,
} from "lucide-react";
import { technologies } from "@/data/services";
import { SplitReveal } from "@/components/anim/SplitReveal";
import { IndustriesMarquee } from "@/sections/IndustriesMarquee";

gsap.registerPlugin(ScrollTrigger);

const ICONS: Record<string, React.ReactNode> = {
  Frontend: <MonitorSmartphone className="h-full w-full" strokeWidth={1.4} />,
  Backend: <Server className="h-full w-full" strokeWidth={1.4} />,
  Databases: <Database className="h-full w-full" strokeWidth={1.4} />,
  Mobile: <Smartphone className="h-full w-full" strokeWidth={1.4} />,
  Tools: <Wrench className="h-full w-full" strokeWidth={1.4} />,
};

/**
 * One card per stack group. At rest it shows the group's icon; on hover (or
 * focus/tap — the card is focusable, which is what makes it work on touch) the
 * icon steps back and the tools pop out as floating bubbles. The tool list is
 * always in the DOM, so screen readers get it without interacting.
 */
function StackCard({ group, items }: { group: string; items: string[] }) {
  return (
    <li
      data-tech-item
      tabIndex={0}
      aria-label={`${group}: ${items.join(", ")}`}
      className="group relative flex h-[280px] flex-col overflow-hidden rounded-[var(--card-radius)] border border-line-dark bg-gradient-to-b from-[#0f0f11] to-[#08080a] p-6 outline-none transition-[border-color] duration-500 hover:border-gold/45 focus-visible:border-gold/60 sm:h-[300px] lg:aspect-[4/5] lg:h-auto"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(200,171,114,0.16),transparent_65%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-focus-within:opacity-100"
      />

      <div className="relative flex items-center justify-between">
        <span className="font-mono-brand text-[11px] uppercase tracking-[0.18em] text-muted-dark">
          {String(items.length).padStart(2, "0")} tools
        </span>
        <span className="h-1.5 w-1.5 rounded-full bg-gold/60 transition-colors duration-500 group-hover:bg-gold" />
      </div>

      {/* bubble stage */}
      <div className="relative flex flex-1 items-center justify-center">
        <span
          aria-hidden="true"
          className="absolute h-14 w-14 text-gold/70 transition-[transform,opacity] duration-500 [transition-timing-function:var(--ease-out-expo)] group-hover:scale-50 group-hover:opacity-0 group-focus-within:scale-50 group-focus-within:opacity-0"
        >
          {ICONS[group]}
        </span>
        <ul aria-hidden="true" className="relative flex flex-wrap content-center items-center justify-center gap-2">
          {items.map((item, i) => (
            <li
              key={item}
              style={{ transitionDelay: `${i * 55}ms` }}
              className="translate-y-4 scale-0 opacity-0 transition-[transform,opacity] duration-500 [transition-timing-function:cubic-bezier(0.34,1.56,0.64,1)] group-hover:translate-y-0 group-hover:scale-100 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:scale-100 group-focus-within:opacity-100"
            >
              <span
                className="tech-bubble block rounded-full border border-gold/30 bg-gold/[0.08] px-3.5 py-1.5 text-[13px] font-medium text-ivory backdrop-blur-sm"
                style={{ animationDelay: `${(i % 3) * -0.9}s` }}
              >
                {item}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <h3 className="relative font-display text-[clamp(22px,1.9vw,28px)] font-semibold tracking-[-0.03em] text-ivory transition-colors duration-500 group-hover:text-gold group-focus-within:text-gold">
        {group}
      </h3>
    </li>
  );
}

export function TechIndustries({
  /** The home page shows the industries marquee up in its overview instead. */
  showIndustries = true,
}: {
  showIndustries?: boolean;
}) {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>("[data-tech-row]").forEach((row) => {
        gsap.fromTo(
          row.querySelectorAll("[data-tech-item]"),
          { autoAlpha: 0, y: 24 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.05,
            ease: "power3.out",
            scrollTrigger: { trigger: row, start: "top 86%", once: true },
          }
        );
      });
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={rootRef} className="bg-bg pb-[var(--section-gap)]" aria-label="Technologies and industries">
      <div className="container-site">
        {/* label bar */}
        <div className="flex items-center border-t border-line-dark pt-5">
          <p className="label-mono label-lead text-muted-dark">
            <span className="text-gold">©</span> Our stack
          </p>
        </div>

        <SplitReveal
          as="h2"
          className="text-display mt-[clamp(36px,4.5vw,64px)] max-w-[1200px] text-ivory"
          stagger={0.1}
        >
          What we work with.
        </SplitReveal>

        {/* same five groups, same tools — hover a card to pop its tools out */}
        <ul data-tech-row className="mt-[clamp(36px,4.5vw,64px)] grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {technologies.map((t) => (
            <StackCard key={t.group} group={t.group} items={t.items} />
          ))}
        </ul>
      </div>

      {showIndustries && <IndustriesMarquee className="mt-[clamp(56px,7vw,100px)]" />}
    </section>
  );
}
