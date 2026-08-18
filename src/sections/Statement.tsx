"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { TMark } from "@/components/ui/Logo";

gsap.registerPlugin(ScrollTrigger, SplitText);

const TEXT =
  "We partner with startups, established businesses, and ambitious entrepreneurs — combining startup agility with engineering discipline to turn bold ideas into products that matter.";

export function Statement() {
  const rootRef = useRef<HTMLElement>(null);
  const pRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;
    let split: SplitText | null = null;
    const ctx = gsap.context(() => {
      if (pRef.current) {
        split = new SplitText(pRef.current, { type: "words" });
        gsap.fromTo(
          split.words,
          { opacity: 0.13 },
          {
            opacity: 1,
            stagger: 0.045,
            ease: "none",
            scrollTrigger: { trigger: pRef.current, start: "top 74%", end: "bottom 40%", scrub: 0.5 },
          }
        );
      }
      // floating cards parallax
      gsap.utils.toArray<HTMLElement>("[data-float-card]").forEach((el, i) => {
        gsap.fromTo(
          el,
          { yPercent: [18, 34, 24, 40][i % 4] },
          {
            yPercent: [-14, -28, -18, -34][i % 4],
            ease: "none",
            scrollTrigger: { trigger: rootRef.current, start: "top bottom", end: "bottom top", scrub: true },
          }
        );
      });
    }, rootRef);
    return () => {
      split?.revert();
      ctx.revert();
    };
  }, []);

  return (
    <section ref={rootRef} className="relative bg-bg py-[calc(var(--section-gap)*0.9)]" aria-label="Who we work with">
      {/* floating brand cards */}
      <div data-float-card className="pointer-events-none absolute left-[4%] top-[2%] hidden w-[230px] overflow-hidden rounded-2xl lg:block">
        <Image
          src="/brand/t-mark-metallic.jpg"
          alt=""
          width={460}
          height={452}
          className="h-auto w-full object-cover"
        />
      </div>
      <div
        data-float-card
        className="grain pointer-events-none absolute right-[6%] top-[6%] hidden h-[300px] w-[240px] overflow-hidden rounded-2xl lg:block"
        style={{ background: "linear-gradient(160deg,#2a2417 0%,#131009 55%,#0b0a07 100%)" }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(80%_60%_at_70%_20%,rgba(200,171,114,0.4),transparent)]" />
        <TMark className="absolute bottom-5 left-5 h-8 w-8 text-gold/80" />
      </div>
      <div
        data-float-card
        className="pointer-events-none absolute bottom-[4%] left-[10%] hidden w-[210px] overflow-hidden rounded-2xl border border-white/10 bg-[#0d0d10] p-4 lg:block"
      >
        <p className="font-mono-brand text-[9px] uppercase tracking-[0.18em] text-white/40">deploy.log</p>
        <div className="mt-3 space-y-2">
          {["w-3/4", "w-1/2", "w-2/3", "w-1/3"].map((w, i) => (
            <div key={i} className={`h-1.5 rounded-sm ${w} ${i === 2 ? "bg-gold/60" : "bg-white/15"}`} />
          ))}
        </div>
        <p className="mt-3 font-mono-brand text-[10px] text-gold">✓ shipped</p>
      </div>
      <div
        data-float-card
        className="grain pointer-events-none absolute bottom-[8%] right-[9%] hidden h-[220px] w-[190px] overflow-hidden rounded-2xl lg:block"
        style={{ background: "linear-gradient(200deg,#1c1c22 0%,#0c0c10 70%)" }}
      >
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              "linear-gradient(rgba(242,239,233,0.14) 1px, transparent 1px), linear-gradient(90deg, rgba(242,239,233,0.14) 1px, transparent 1px)",
            backgroundSize: "26px 26px",
          }}
        />
        <span className="absolute bottom-4 left-4 font-mono-brand text-[9px] uppercase tracking-[0.2em] text-white/50">
          B2B · B2C · C2B
        </span>
      </div>

      <div className="container-site relative">
        <p
          ref={pRef}
          className="mx-auto max-w-[1060px] text-center font-display text-[clamp(30px,4.15vw,58px)] font-semibold leading-[1.14] tracking-[-0.03em] text-ivory"
        >
          {TEXT}
        </p>
      </div>
    </section>
  );
}
