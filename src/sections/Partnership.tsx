"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TeamSection } from "@/components/ui/team-section-1";
import { TMark } from "@/components/ui/Logo";
import { PillButton } from "@/components/ui/PillButton";
import { leadership, startupAdvantage } from "@/data/company";

gsap.registerPlugin(ScrollTrigger);

const companyPartners = leadership.slice(0, 3).map((partner) => ({
  name: partner.name,
  designation: partner.role,
  description: partner.quote,
  initials: partner.initials,
  // Add `imageSrc: "/team/name.webp"` here when an approved portrait is supplied.
}));

export function Partnership() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const context = gsap.context(() => {
      gsap.fromTo(
        "[data-team-header] > *",
        { autoAlpha: 0, y: 42 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.9,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: {
            trigger: "[data-team-header]",
            start: "top 78%",
            once: true,
          },
        }
      );

      gsap.fromTo(
        "[data-team-card]",
        { autoAlpha: 0, y: 80, rotate: (index: number) => [-2.5, 1.5, 2.5][index] },
        {
          autoAlpha: 1,
          y: 0,
          rotate: 0,
          duration: 1.05,
          stagger: 0.13,
          ease: "expo.out",
          scrollTrigger: {
            trigger: "[data-team-card]",
            start: "top 82%",
            once: true,
          },
        }
      );
    }, rootRef);

    return () => context.revert();
  }, []);

  return (
    <section ref={rootRef} className="relative bg-bg" aria-label="How we partner">
      <TeamSection
        eyebrow="© Company partners · TBX 05"
        title="Built Together. Led With Purpose."
        description="Meet the founding partners shaping TrinityByte—combining product vision, technical craft, and a shared commitment to building technology that creates lasting value."
        members={companyPartners}
        featuredIndex={0}
        actionHref="/about"
        actionLabel="About TrinityByte"
        logo={<TMark className="h-10 w-10" />}
      >
        <PillButton href="/about#leadership" tone="light">
          Meet the Team
        </PillButton>
      </TeamSection>

      <div className="container-site pb-[var(--section-gap)]">
        <div className="grain relative overflow-hidden rounded-[var(--card-radius)] border border-gold/20 bg-gradient-to-br from-[#171410] to-[#0b0a08] p-[clamp(26px,3.5vw,52px)]">
          <div className="absolute -right-[10%] -top-[40%] h-[300px] w-[300px] rounded-full bg-[radial-gradient(closest-side,rgba(200,171,114,0.18),transparent)]" />
          <p className="label-mono text-gold">{startupAdvantage.title}</p>
          <p className="mt-4 max-w-[820px] font-display text-[clamp(22px,2.6vw,36px)] font-medium leading-[1.25] tracking-[-0.02em] text-ivory">
            {startupAdvantage.copy}
          </p>
          <ul className="mt-7 flex flex-wrap gap-x-8 gap-y-3">
            {startupAdvantage.points.map((point) => (
              <li key={point} className="flex items-center gap-2.5 text-[14px] text-ivory/80">
                <span className="h-1.5 w-1.5 rounded-full bg-gold" />
                {point}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
