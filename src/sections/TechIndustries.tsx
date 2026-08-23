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
import { technologies, industries } from "@/data/services";
import { CategoryList, type Category } from "@/components/ui/category-list";
import { SplitReveal } from "@/components/anim/SplitReveal";
import { TMark } from "@/components/ui/Logo";

gsap.registerPlugin(ScrollTrigger);

/** Same five groups and the same tools — the items become the row subtitle. */
const ICONS: Record<string, React.ReactNode> = {
  Frontend: <MonitorSmartphone className="h-7 w-7" />,
  Backend: <Server className="h-7 w-7" />,
  Databases: <Database className="h-7 w-7" />,
  Mobile: <Smartphone className="h-7 w-7" />,
  Tools: <Wrench className="h-7 w-7" />,
};

const techCategories: Category[] = technologies.map((group) => ({
  id: group.group,
  title: group.group,
  subtitle: group.items.join("  ·  "),
  icon: ICONS[group.group],
}));

export function TechIndustries() {
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
        <div className="flex items-center justify-between border-t border-line-dark pt-5">
          <p className="label-mono text-muted-dark">
            <span className="text-gold">©</span> Our stack
          </p>
          <p className="label-mono hidden text-muted-dark md:block">(03)</p>
          <p className="label-mono text-muted-dark">Battle-tested tools</p>
        </div>

        <SplitReveal
          as="h2"
          className="text-display mt-[clamp(36px,4.5vw,64px)] max-w-[900px] text-ivory"
          stagger={0.1}
        >
          Technologies we work with.
        </SplitReveal>

        {/* expanding stack rows — same five groups, same tools */}
        <div data-tech-row className="mt-[clamp(36px,4.5vw,64px)]">
          <CategoryList showHeader={false} categories={techCategories} />
        </div>
      </div>

      {/* industries marquee */}
      <div className="mt-[clamp(56px,7vw,100px)]">
        <p className="label-mono container-site text-muted-dark">
          <span className="text-gold">©</span> Industries we serve
        </p>
        <div className="relative mt-7 overflow-hidden py-2 [mask-image:linear-gradient(90deg,transparent,black_8%,black_92%,transparent)]">
          <div className="marquee-track items-center gap-0" style={{ "--marquee-dur": "56s" } as React.CSSProperties}>
            {[0, 1].map((dup) => (
              <div key={dup} className="flex shrink-0 items-center" aria-hidden={dup === 1}>
                {industries.map((ind) => (
                  <span key={`${dup}-${ind}`} className="flex items-center">
                    <span className="whitespace-nowrap px-6 font-display text-[clamp(34px,4.2vw,60px)] font-semibold tracking-[-0.03em] text-ivory/25 transition-colors duration-300 hover:text-ivory">
                      {ind}
                    </span>
                    <TMark className="h-4 w-4 shrink-0 text-gold/50" />
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
