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
import { CategoryList, type Category } from "@/components/ui/category-list";
import { SplitReveal } from "@/components/anim/SplitReveal";
import { IndustriesMarquee } from "@/sections/IndustriesMarquee";

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

      {showIndustries && <IndustriesMarquee className="mt-[clamp(56px,7vw,100px)]" />}
    </section>
  );
}
