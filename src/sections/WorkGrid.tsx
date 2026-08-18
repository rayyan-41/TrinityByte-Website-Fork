"use client";

import Link from "next/link";
import { ReactNode, useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { projects, Project } from "@/data/projects";
import { TMark } from "@/components/ui/Logo";
import { PillButton } from "@/components/ui/PillButton";
import { Reveal } from "@/components/anim/Reveal";

gsap.registerPlugin(ScrollTrigger);

/* ---------- original cover art per project (CSS, no fake clients) ---------- */

function CoverShell({ p, children }: { p: Project; children: ReactNode }) {
  return (
    <div
      className="grain relative flex aspect-[1/1.02] w-full items-center justify-center overflow-hidden rounded-xl sm:aspect-[1.04/1]"
      style={{ background: `radial-gradient(120% 120% at 20% 10%, ${p.art.to} 0%, ${p.art.from} 55%, #050505 100%)` }}
    >
      <div
        className="absolute inset-0 opacity-60"
        style={{
          background: `radial-gradient(62% 48% at 50% 52%, ${p.art.accent}40 0%, transparent 72%)`,
        }}
      />
      <div className="transition-transform duration-700 [transition-timing-function:var(--ease-out-expo)] group-hover:scale-[1.045]">
        {children}
      </div>
      <span className="absolute left-5 top-5 font-mono-brand text-[10px] uppercase tracking-[0.2em] text-white/60">
        TBX® — Representative build
      </span>
      <span
        className="absolute bottom-5 right-5 rounded-full border px-3 py-1 font-mono-brand text-[10px] uppercase tracking-[0.16em]"
        style={{ borderColor: `${p.art.accent}55`, color: p.art.accent }}
      >
        {p.category}
      </span>
    </div>
  );
}

function DashArt({ accent }: { accent: string }) {
  return (
    <div className="w-[min(340px,68%)] min-w-[260px] overflow-hidden rounded-xl border border-white/25 bg-[#131318] shadow-[0_60px_140px_rgba(0,0,0,0.65)]">
      <div className="flex items-center gap-1.5 border-b border-white/[0.07] px-4 py-2.5">
        <span className="h-2 w-2 rounded-full bg-white/38" />
        <span className="h-2 w-2 rounded-full bg-white/38" />
        <span className="h-2 w-2 rounded-full bg-white/10" />
      </div>
      <div className="p-4">
        <div className="flex gap-3">
          <div className="w-1/3 space-y-2">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className={`h-6 rounded-md ${i === 1 ? "bg-white/32" : "bg-white/[0.11]"}`} />
            ))}
          </div>
          <div className="flex-1 space-y-2.5">
            <div className="flex gap-2">
              <div className="h-14 flex-1 rounded-lg bg-white/[0.13]" />
              <div className="h-14 flex-1 rounded-lg" style={{ background: `${accent}2e` }} />
              <div className="h-14 flex-1 rounded-lg bg-white/[0.13]" />
            </div>
            <div className="flex h-20 items-end gap-1.5 rounded-lg bg-white/[0.09] p-2.5">
              {[42, 66, 50, 84, 58, 92, 70, 100, 78].map((h, i) => (
                <span key={i} style={{ height: `${h}%`, background: i % 3 === 1 ? `${accent}b0` : "rgba(255,255,255,0.3)" }} className="w-full rounded-t-[3px]" />
              ))}
            </div>
            <div className="h-2.5 w-2/3 rounded-sm bg-white/38" />
          </div>
        </div>
      </div>
    </div>
  );
}

function PhoneArt({ accent }: { accent: string }) {
  return (
    <div className="w-[min(200px,52%)] min-w-[170px] rotate-[-4deg] overflow-hidden rounded-[28px] border border-white/15 bg-[#141419] p-2 shadow-[0_60px_140px_rgba(0,0,0,0.7)]">
      <div className="overflow-hidden rounded-[21px] bg-[#141419] p-4">
        <div className="flex justify-center">
          <span className="h-1 w-12 rounded-full bg-white/38" />
        </div>
        <div className="mt-3 flex items-center justify-between">
          <TMark className="h-4 w-4" style={{ color: accent } as React.CSSProperties} />
          <span className="h-2 w-9 rounded-sm bg-white/32" />
        </div>
        <div className="mt-4 h-20 rounded-xl" style={{ background: `linear-gradient(135deg, ${accent}66, ${accent}14)` }} />
        <div className="mt-3 space-y-2">
          <div className="h-2 w-3/4 rounded-sm bg-white/38" />
          <div className="h-2 w-1/2 rounded-sm bg-white/12" />
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2">
          <span className="h-12 rounded-lg bg-white/[0.13]" />
          <span className="h-12 rounded-lg bg-white/[0.13]" />
        </div>
        <div className="mt-4 h-8 rounded-full" style={{ background: accent }} />
      </div>
    </div>
  );
}

function StoreArt({ accent }: { accent: string }) {
  return (
    <div className="w-[min(340px,70%)] min-w-[260px] overflow-hidden rounded-xl border border-white/25 bg-[#141317] shadow-[0_60px_140px_rgba(0,0,0,0.65)]">
      <div className="flex items-center gap-1.5 border-b border-white/[0.07] px-4 py-2.5">
        <span className="h-2 w-2 rounded-full bg-white/38" />
        <span className="h-2 w-2 rounded-full bg-white/38" />
        <span className="mx-auto h-3.5 w-36 rounded-full bg-white/[0.13]" />
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between">
          <span className="h-2.5 w-16 rounded-sm bg-white/45" />
          <div className="flex gap-1.5">
            <span className="h-2 w-8 rounded-sm bg-white/38" />
            <span className="h-2 w-8 rounded-sm bg-white/38" />
            <span className="h-2 w-8 rounded-sm" style={{ background: `${accent}90` }} />
          </div>
        </div>
        <div className="mt-3 grid grid-cols-3 gap-2.5">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="overflow-hidden rounded-lg bg-white/[0.1]">
              <div className="h-14" style={{ background: i === 1 ? `${accent}38` : "rgba(255,255,255,0.07)" }} />
              <div className="space-y-1 p-2">
                <div className="h-1.5 w-3/4 rounded-sm bg-white/32" />
                <div className="h-1.5 w-1/3 rounded-sm" style={{ background: `${accent}88` }} />
              </div>
            </div>
          ))}
        </div>
        <div className="mt-3 flex justify-between">
          <span className="h-7 w-24 rounded-full" style={{ background: accent }} />
          <span className="h-7 w-16 rounded-full border border-white/20" />
        </div>
      </div>
    </div>
  );
}

function FlowArt({ accent }: { accent: string }) {
  return (
    <div className="w-[min(330px,68%)] min-w-[250px] overflow-hidden rounded-xl border border-white/25 bg-[#111511] shadow-[0_60px_140px_rgba(0,0,0,0.65)] p-5">
      <p className="font-mono-brand text-[10px] tracking-[0.18em] text-white/60">AUTOMATION.FLOW</p>
      <div className="mt-4 space-y-3">
        {["Document intake", "AI classification", "Smart routing", "Auto reporting"].map((s, i) => (
          <div key={s} className="flex items-center gap-3">
            <span
              className="flex h-7 w-7 items-center justify-center rounded-md border font-mono-brand text-[10px]"
              style={{
                borderColor: i === 1 ? accent : "rgba(255,255,255,0.15)",
                background: i === 1 ? `${accent}22` : "rgba(255,255,255,0.04)",
                color: i === 1 ? accent : "rgba(255,255,255,0.5)",
              }}
            >
              {i + 1}
            </span>
            <div className="flex-1 rounded-lg border border-white/[0.07] bg-white/[0.09] px-3 py-2.5">
              <span className="text-[12px] text-white/85">{s}</span>
            </div>
            {i === 1 && (
              <span className="font-mono-brand text-[9px] uppercase tracking-[0.14em]" style={{ color: accent }}>
                active
              </span>
            )}
          </div>
        ))}
      </div>
      <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/[0.13]">
        <div className="h-full w-3/4 rounded-full" style={{ background: accent }} />
      </div>
    </div>
  );
}

const ART = [DashArt, PhoneArt, StoreArt, FlowArt];

export function ProjectCard({ p, artIndex, eager = false }: { p: Project; artIndex: number; eager?: boolean }) {
  const Art = ART[artIndex % ART.length];
  return (
    <Link href={`/work/${p.slug}`} className="group block" data-work-card {...(eager ? {} : {})}>
      <CoverShell p={p}>
        <Art accent={p.art.accent} />
      </CoverShell>
      <div className="mt-4 flex items-baseline justify-between">
        <div>
          <p className="label-mono text-muted-dark">{p.industry}</p>
          <p className="link-underline mt-1 font-display text-[19px] font-medium text-ivory">
            {p.title}
          </p>
        </div>
        <span className="font-display text-[19px] font-medium text-ivory/70">({p.index})</span>
      </div>
    </Link>
  );
}

/* --------------------------------- section --------------------------------- */

export function WorkGrid() {
  const rootRef = useRef<HTMLElement>(null);
  const bandRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;
    const ctx = gsap.context(() => {
      // giant title slides with scroll
      if (bandRef.current) {
        gsap.fromTo(
          bandRef.current,
          { xPercent: 4 },
          {
            xPercent: -30,
            ease: "none",
            scrollTrigger: {
              trigger: bandRef.current,
              start: "top bottom",
              end: "bottom -60%",
              scrub: 0.4,
            },
          }
        );
      }
      gsap.utils.toArray<HTMLElement>("[data-work-card]").forEach((el, i) => {
        gsap.fromTo(
          el,
          { autoAlpha: 0, y: 90 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 1.25,
            delay: (i % 2) * 0.08,
            ease: "expo.out",
            scrollTrigger: { trigger: el, start: "top 88%", once: true },
          }
        );
      });
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={rootRef} className="bg-bg pb-[var(--section-gap)]" aria-label="Featured work" id="work">
      {/* label bar */}
      <div className="container-site flex items-center justify-between border-t border-line-dark pt-5">
        <p className="label-mono text-muted-dark">
          <span className="text-gold">©</span> Featured projects
        </p>
        <p className="label-mono hidden text-muted-dark md:block">(TBX® — 04)</p>
        <p className="label-mono text-muted-dark">Creative development</p>
      </div>

      {/* giant sliding title band */}
      <div className="overflow-hidden py-[clamp(28px,4vw,56px)]">
        <div ref={bandRef} className="whitespace-nowrap will-change-transform">
          <span className="select-none font-display text-[clamp(96px,14.5vw,212px)] font-semibold leading-[0.95] tracking-[-0.045em] text-ivory">
            Featured Works<span className="text-gold">©</span>&nbsp;&nbsp;Selected Builds&nbsp;&nbsp;Featured
          </span>
        </div>
      </div>

      <div className="container-site grid grid-cols-1 gap-16 md:grid-cols-12 md:gap-y-10">
        <div className="md:col-span-5">
          <Reveal delay={0.05}>
            <p className="max-w-[440px] text-[16px] leading-[1.65] text-ivory/85">
              Every project is a chance to blend design and engineering —{" "}
              <strong className="font-semibold text-ivory">shaping bold ideas</strong> into sleek
              digital realities, <strong className="font-semibold text-ivory">built with</strong>{" "}
              intent, speed, and visual clarity.
            </p>
            <div className="mt-9">
              <PillButton href="/work" tone="light">
                See Works
              </PillButton>
            </div>
          </Reveal>
        </div>

        {/* staggered grid */}
        <div className="md:col-span-6 md:col-start-7 md:-mt-6">
          <ProjectCard p={projects[0]} artIndex={0} />
        </div>
        <div className="md:col-span-5 md:col-start-1 md:mt-6">
          <ProjectCard p={projects[1]} artIndex={1} />
        </div>
        <div className="md:col-span-6 md:col-start-7 md:mt-2">
          <ProjectCard p={projects[2]} artIndex={2} />
        </div>
        <div className="md:col-span-5 md:col-start-2 md:mt-8">
          <ProjectCard p={projects[3]} artIndex={3} />
        </div>
      </div>
    </section>
  );
}
