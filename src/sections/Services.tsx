"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { services } from "@/data/services";
import { SplitReveal } from "@/components/anim/SplitReveal";
import { Reveal } from "@/components/anim/Reveal";
import { PillButton } from "@/components/ui/PillButton";
import { TMark } from "@/components/ui/Logo";

gsap.registerPlugin(ScrollTrigger);

const TAG_TINTS = [
  "bg-[#efe7d4] text-[#6b5a2e]",
  "bg-[#e4e9e0] text-[#44523c]",
  "bg-[#e3e7ee] text-[#3d4a60]",
  "bg-[#f0e2da] text-[#6b4a38]",
];

/* ---------------- service visuals (original CSS art) ---------------- */

function VisualFrame({
  children,
  from,
  to,
}: {
  children: React.ReactNode;
  from: string;
  to: string;
}) {
  return (
    <div
      className="grain relative flex h-full min-h-[260px] items-center justify-center overflow-hidden rounded-[var(--card-radius)] sm:min-h-[320px] lg:min-h-0"
      style={{ background: `linear-gradient(135deg, ${from}, ${to})` }}
    >
      {children}
    </div>
  );
}

function SoftwareVisual() {
  return (
    <VisualFrame from="#191713" to="#0b0a08">
      <div className="relative h-[72%] w-[74%]">
        {/* connective lines */}
        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 300 220" fill="none">
          <path d="M60 60 L150 110 L240 60 M150 110 L150 170" stroke="rgba(200,171,114,0.4)" strokeWidth="1" strokeDasharray="4 4" />
        </svg>
        {[
          { x: "8%", y: "8%", t: "AUTH", w: "w-[110px]" },
          { x: "62%", y: "8%", t: "API CORE", w: "w-[112px]" },
          { x: "32%", y: "40%", t: "WORKFLOW", w: "w-[122px]", gold: true },
          { x: "10%", y: "72%", t: "REPORTS", w: "w-[110px]" },
          { x: "60%", y: "72%", t: "BILLING", w: "w-[108px]" },
        ].map((n) => (
          <div
            key={n.t}
            style={{ left: n.x, top: n.y }}
            className={`absolute rounded-xl border px-4 py-3 backdrop-blur-sm ${n.w} ${
              n.gold
                ? "border-gold/50 bg-gold/15 shadow-[0_0_50px_rgba(200,171,114,0.25)]"
                : "border-white/20 bg-white/[0.05]"
            }`}
          >
            <span className={`font-mono-brand text-[10px] tracking-[0.16em] ${n.gold ? "text-gold" : "text-white/75"}`}>
              {n.t}
            </span>
            <div className={`mt-2 h-1.5 rounded-sm ${n.gold ? "bg-gold/60" : "bg-white/35"}`} />
            <div className={`mt-1 h-1.5 w-2/3 rounded-sm ${n.gold ? "bg-gold/35" : "bg-white/10"}`} />
          </div>
        ))}
      </div>
    </VisualFrame>
  );
}

function WebVisual() {
  return (
    <VisualFrame from="#14161c" to="#0a0b0e">
      <div className="w-[76%] overflow-hidden rounded-xl border border-white/20 bg-[#16171d] shadow-[0_50px_120px_rgba(0,0,0,0.5)]">
        <div className="flex items-center gap-1.5 border-b border-white/[0.07] px-4 py-2.5">
          <span className="h-2 w-2 rounded-full bg-white/35" />
          <span className="h-2 w-2 rounded-full bg-white/35" />
          <span className="h-2 w-2 rounded-full bg-white/10" />
          <span className="mx-auto h-4 w-40 rounded-full bg-white/[0.12]" />
        </div>
        <div className="p-5">
          <div className="flex items-center justify-between">
            <TMark className="h-4 w-4 text-gold" />
            <div className="flex gap-2">
              <span className="h-2 w-10 rounded-sm bg-white/40" />
              <span className="h-2 w-10 rounded-sm bg-white/40" />
              <span className="h-2 w-10 rounded-sm bg-gold/50" />
            </div>
          </div>
          <div className="mt-6 h-5 w-3/4 rounded-sm bg-white/40" />
          <div className="mt-2 h-5 w-1/2 rounded-sm bg-white/40" />
          <div className="mt-3 h-2 w-2/3 rounded-sm bg-white/40" />
          <div className="mt-5 flex gap-2.5">
            <span className="h-8 w-24 rounded-full bg-gold/80" />
            <span className="h-8 w-24 rounded-full border border-white/20" />
          </div>
          <div className="mt-5 grid grid-cols-3 gap-2.5">
            <div className="h-14 rounded-lg bg-white/[0.11]" />
            <div className="h-14 rounded-lg bg-white/[0.11]" />
            <div className="h-14 rounded-lg bg-gold/15" />
          </div>
        </div>
      </div>
    </VisualFrame>
  );
}

function MobileVisual() {
  return (
    <VisualFrame from="#1a1610" to="#0c0a07">
      <div className="flex items-center gap-6">
        <div className="w-[170px] overflow-hidden rounded-[26px] border border-white/15 bg-[#15151a] p-1.5 shadow-[0_50px_120px_rgba(0,0,0,0.55)]">
          <div className="overflow-hidden rounded-[20px] bg-[#1b1b21] p-3.5">
            <div className="flex justify-center">
              <span className="h-1 w-12 rounded-full bg-white/40" />
            </div>
            <div className="mt-3 flex items-center justify-between">
              <TMark className="h-3.5 w-3.5 text-gold" />
              <span className="h-1.5 w-8 rounded-sm bg-white/40" />
            </div>
            <div className="mt-3 h-16 rounded-xl bg-gradient-to-br from-gold/40 to-gold/10" />
            <div className="mt-2.5 space-y-1.5">
              <div className="h-1.5 w-3/4 rounded-sm bg-white/35" />
              <div className="h-1.5 w-1/2 rounded-sm bg-white/40" />
            </div>
            <div className="mt-3 grid grid-cols-2 gap-1.5">
              <span className="h-10 rounded-lg bg-white/[0.12]" />
              <span className="h-10 rounded-lg bg-white/[0.12]" />
            </div>
            <div className="mt-3 h-7 rounded-full bg-gold/85" />
          </div>
        </div>
        <div className="hidden w-[150px] rotate-6 opacity-70 xl:block">
          <div className="overflow-hidden rounded-[24px] border border-white/20 bg-[#101013] p-1.5">
            <div className="rounded-[18px] bg-[#17171b] p-3.5">
              <div className="h-12 rounded-lg bg-white/[0.14]" />
              <div className="mt-2 h-1.5 w-2/3 rounded-sm bg-white/40" />
              <div className="mt-1.5 h-1.5 w-1/2 rounded-sm bg-white/10" />
              <div className="mt-3 h-16 rounded-lg bg-gold/20" />
              <div className="mt-2 h-6 rounded-full bg-white/40" />
            </div>
          </div>
        </div>
      </div>
    </VisualFrame>
  );
}

function DesignVisual() {
  return (
    <VisualFrame from="#16151a" to="#0b0a0d">
      <div className="relative h-[70%] w-[74%] rounded-xl border border-dashed border-white/20 p-5">
        <span className="absolute -top-2 left-6 bg-[#121116] px-2 font-mono-brand text-[9px] tracking-[0.2em] text-white/75">
          ARTBOARD — 1440
        </span>
        <div className="flex h-full gap-3">
          <div className="flex w-1/3 flex-col gap-3">
            <div className="h-1/2 rounded-lg bg-gold/25 ring-1 ring-gold/50" />
            <div className="h-1/2 rounded-full bg-white/[0.14]" />
          </div>
          <div className="flex flex-1 flex-col gap-3">
            <div className="h-8 rounded-md bg-white/35" />
            <div className="h-2 w-3/4 rounded-sm bg-white/40" />
            <div className="h-2 w-1/2 rounded-sm bg-white/40" />
            <div className="mt-auto flex gap-2">
              <span className="h-8 w-8 rounded-full bg-gold/70" />
              <span className="h-8 w-8 rounded-full bg-white/35" />
              <span className="h-8 w-8 rounded-full bg-white/[0.16] ring-1 ring-white/25" />
            </div>
          </div>
        </div>
        {/* cursor */}
        <svg className="absolute bottom-6 right-8 h-5 w-5 text-gold drop-shadow" viewBox="0 0 24 24" fill="currentColor">
          <path d="M5 3l14 8-6.5 1.5L9 19z" />
        </svg>
        <span className="absolute bottom-3 right-14 rounded-md bg-gold px-2 py-0.5 font-mono-brand text-[9px] font-medium text-ink">
          trinity.design
        </span>
      </div>
    </VisualFrame>
  );
}

function AIVisual() {
  return (
    <VisualFrame from="#121712" to="#090b09">
      <div className="w-[76%] overflow-hidden rounded-xl border border-white/20 bg-[#111511] shadow-[0_50px_120px_rgba(0,0,0,0.5)]">
        <div className="flex items-center gap-2 border-b border-white/[0.07] px-4 py-2.5">
          <span className="h-2 w-2 rounded-full bg-white/35" />
          <span className="h-2 w-2 rounded-full bg-white/35" />
          <span className="ml-2 font-mono-brand text-[9px] uppercase tracking-[0.18em] text-white/85">
            automation — pipeline
          </span>
        </div>
        <div className="p-5 font-mono-brand text-[11px] leading-[2.1]">
          <p className="text-white/75">
            <span className="text-gold">$</span> intake --watch
          </p>
          <p className="text-white/85">→ documents scanned <span className="text-gold">·</span> 14 routed</p>
          <p className="text-white/85">→ approvals queued <span className="text-gold">·</span> 3 pending review</p>
          <p className="text-white/85">→ weekly report generated</p>
          <p className="text-gold">✓ pipeline healthy — 0 manual steps</p>
          <div className="mt-4 flex items-center gap-2">
            {["INTAKE", "CLASSIFY", "ROUTE", "REPORT"].map((s, i) => (
              <span key={s} className="flex items-center gap-2">
                <span
                  className={`rounded-md border px-2 py-1 text-[9px] tracking-[0.14em] ${
                    i === 1 ? "border-gold/60 bg-gold/15 text-gold" : "border-white/15 bg-white/[0.04] text-white/85"
                  }`}
                >
                  {s}
                </span>
                {i < 3 && <span className="text-white/30">→</span>}
              </span>
            ))}
          </div>
        </div>
      </div>
    </VisualFrame>
  );
}

const VISUALS = [SoftwareVisual, WebVisual, MobileVisual, DesignVisual, AIVisual];

/* -------------------------------------------------------------------- */

/** The section's headline. The home page lifts it into the At a glance block. */
export function ServicesIntro({ align = "center" }: { align?: "center" | "left" }) {
  const centred = align === "center";
  return (
    <>
      <SplitReveal
        as="h2"
        className={`text-display max-w-[1080px] text-ivory ${centred ? "mx-auto" : ""}`}
        stagger={0.1}
      >
        Everything you need to build it right.
      </SplitReveal>
      <Reveal delay={0.15} y={24}>
        <p className={`mt-6 max-w-[560px] text-balance text-[15.5px] text-muted-dark ${centred ? "mx-auto" : ""}`}>
          Strategy, design, development, and automation — five core services, one accountable team.
        </p>
      </Reveal>
    </>
  );
}

export function Services({
  /** false swaps the headline for a plain label bar (the home page shows it earlier). */
  intro = true,
}: {
  intro?: boolean;
}) {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;
    const mm = gsap.matchMedia();
    mm.add("(min-width: 1024px)", () => {
      // covered cards settle back slightly as the next row slides over
      gsap.utils.toArray<HTMLElement>("[data-service-row]").forEach((row, i, rows) => {
        if (i === rows.length - 1) return;
        const card = row.querySelector("[data-service-card]");
        const next = rows[i + 1];
        if (!card || !next) return;
        gsap.to(card, {
          scale: 0.965,
          transformOrigin: "center top",
          ease: "none",
          scrollTrigger: {
            trigger: next,
            start: "top bottom",
            end: "top top+=110",
            scrub: true,
          },
        });
      });
    });
    return () => mm.revert();
  }, []);

  return (
    <section ref={rootRef} className="bg-bg pb-[var(--section-gap)]" aria-label="Services" id="services">
      {intro ? (
        <div className="container-site pb-[clamp(40px,5vw,80px)] text-center">
          <ServicesIntro />
        </div>
      ) : (
        <div className="container-site pb-[clamp(36px,4.5vw,64px)]">
          <div className="flex items-center border-t border-line-dark pt-5">
            <p className="label-mono label-lead text-muted-dark">
              <span className="text-gold">©</span> What we build
            </p>
          </div>
        </div>
      )}

      <div className="px-[var(--frame-pad)]">
        {services.map((s, i) => {
          const Visual = VISUALS[i];
          return (
            <div key={s.slug} data-service-row className="mb-6 last:mb-0 lg:sticky lg:top-[96px]">
              <div data-service-card className="grid gap-6 lg:h-[470px] lg:grid-cols-[1.45fr_1fr]">
                {/* text card */}
                <article className="flex flex-col rounded-[var(--card-radius)] bg-gradient-to-br from-[#f5f2ec] to-[#e8e3d6] p-[clamp(24px,2.8vw,44px)]">
                  <p className="label-mono text-[#8a7c58]">
                    Service {s.index}
                  </p>
                  <h3 className="mt-3.5 font-display text-[clamp(27px,2.8vw,40px)] font-semibold leading-[1.05] tracking-[-0.03em] text-ink">
                    {s.title}
                  </h3>
                  <p className="mt-3.5 max-w-[540px] text-[15px] leading-[1.55] text-muted-light">
                    {s.copy}
                  </p>
                  <div className="mt-5 flex max-w-[600px] flex-wrap gap-2">
                    {s.tags.map((t, j) => (
                      <span
                        key={t}
                        className={`rounded-full px-3.5 py-1.5 text-[12.5px] font-medium ${TAG_TINTS[j % TAG_TINTS.length]}`}
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                  <div className="mt-auto pt-6">
                    <PillButton href="/contact" tone="dark" size="md">
                      {s.cta}
                    </PillButton>
                  </div>
                </article>

                {/* visual card */}
                <div>
                  <Visual />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
