"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { PillButton } from "@/components/ui/PillButton";
import { TMark } from "@/components/ui/Logo";
import { HeroTechOverlay } from "@/sections/hero/HeroTechOverlay";

gsap.registerPlugin(ScrollTrigger, SplitText);

const metricBars = [34, 58, 44, 72, 52, 88, 64, 96, 78, 60, 90, 70, 82, 56];
const codeRows = [68, 47, 81, 55, 72, 38, 86, 62, 76];

function CoreSystemView() {
  return (
    <div data-scene-view="core" className="absolute inset-0 overflow-hidden bg-[#0b0b0e]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_22%,rgba(200,171,114,0.22),transparent_36%),linear-gradient(145deg,#141319_0%,#08080a_54%,#12100c_100%)]" />
      <div
        className="absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.3) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.3) 1px,transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />

      <div className="absolute inset-x-0 top-0 flex h-[11%] items-center border-b border-white/10 bg-black/20 px-[4%] backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <TMark className="h-5 w-5 text-gold" />
          <span className="font-mono-brand text-[clamp(8px,0.8vw,12px)] uppercase tracking-[0.24em] text-white/74">
            TrinityByte / Build Console
          </span>
        </div>
        <div className="ml-auto flex items-center gap-2 font-mono-brand text-[clamp(7px,0.65vw,10px)] uppercase tracking-[0.18em] text-white/45">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#70c991]" />
          Systems online
        </div>
      </div>

      <aside className="absolute bottom-0 left-0 top-[11%] hidden w-[18%] border-r border-white/10 bg-black/20 p-[2.2%]">
        <p className="font-mono-brand text-[clamp(7px,0.65vw,10px)] uppercase tracking-[0.2em] text-white/34">
          Workspace
        </p>
        <div className="mt-[14%] space-y-[8%]">
          {["Overview", "Architecture", "Releases", "Automation", "Quality"].map((item, index) => (
            <div
              key={item}
              className={`flex items-center gap-3 rounded-lg border px-[8%] py-[6%] font-mono-brand text-[clamp(7px,0.72vw,11px)] uppercase tracking-[0.14em] ${
                index === 0
                  ? "border-gold/30 bg-gold/10 text-gold"
                  : "border-transparent text-white/38"
              }`}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-current" />
              {item}
            </div>
          ))}
        </div>
      </aside>

      <div className="absolute bottom-[8%] left-[7%] right-[7%] top-[18%]">
        <div className="grid h-full grid-cols-12 gap-[2%]">
          <div className="col-span-12 flex flex-col rounded-[clamp(12px,1.4vw,22px)] border border-white/10 bg-white/[0.035] p-[4%] shadow-2xl backdrop-blur-md">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-mono-brand text-[clamp(7px,0.65vw,10px)] uppercase tracking-[0.2em] text-white/38">
                  Delivery velocity
                </p>
                <p className="mt-2 font-display text-[clamp(18px,2.5vw,42px)] font-semibold tracking-[-0.04em] text-white">
                  Build. Test. Ship.
                </p>
              </div>
              <span className="rounded-full border border-gold/25 bg-gold/10 px-3 py-1.5 font-mono-brand text-[clamp(6px,0.58vw,9px)] uppercase tracking-[0.16em] text-gold">
                Production ready
              </span>
            </div>
            <div className="mt-auto flex h-[48%] items-end gap-[1.5%] border-b border-white/10 px-[1%]">
              {metricBars.map((height, index) => (
                <span
                  key={index}
                  style={{ height: `${height}%` }}
                  className={`w-full rounded-t-sm ${index % 4 === 3 ? "bg-gold/85" : "bg-white/[0.13]"}`}
                />
              ))}
            </div>
          </div>

          <div className="col-span-4 hidden grid-rows-2 gap-[4%]">
            <div className="rounded-[clamp(12px,1.4vw,22px)] border border-white/12 bg-black/25 p-[8%] backdrop-blur-md">
              <p className="font-mono-brand text-[clamp(7px,0.65vw,10px)] uppercase tracking-[0.2em] text-white/38">
                Pipeline
              </p>
              <div className="mt-[10%] space-y-[8%]">
                {codeRows.slice(0, 4).map((width, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <span className="font-mono-brand text-[clamp(6px,0.55vw,8px)] text-white/24">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span style={{ width: `${width}%` }} className="h-1.5 rounded-full bg-white/24" />
                  </div>
                ))}
              </div>
            </div>
            <div className="relative overflow-hidden rounded-[clamp(12px,1.4vw,22px)] border border-gold/20 bg-gold/[0.08] p-[8%]">
              <div className="absolute -bottom-1/2 -right-1/3 h-[150%] w-[100%] rounded-full bg-gold/20 blur-3xl" />
              <p className="relative font-mono-brand text-[clamp(7px,0.65vw,10px)] uppercase tracking-[0.2em] text-gold/65">
                Next release
              </p>
              <p className="relative mt-[8%] font-display text-[clamp(15px,1.7vw,28px)] font-semibold leading-none text-white">
                Ready to deploy
              </p>
              <div className="relative mt-[14%] h-1.5 overflow-hidden rounded-full bg-white/10">
                <span className="block h-full w-[82%] rounded-full bg-gold" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProductSystemView() {
  return (
    <div data-scene-view="product" className="absolute inset-0 overflow-hidden bg-[#101114] opacity-0">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_25%,rgba(200,171,114,0.24),transparent_38%),linear-gradient(145deg,#17171c,#08090b)]" />
      <div className="absolute left-[7%] top-[9%] flex items-center gap-2">
        <TMark className="h-4 w-4 text-gold" />
        <span className="font-mono-brand text-[clamp(7px,0.72vw,10px)] uppercase tracking-[0.2em] text-white/54">
          Product interface
        </span>
      </div>
      <div className="absolute bottom-[10%] left-[7%] right-[7%] top-[20%] grid grid-cols-12 gap-[3%]">
        <div className="col-span-7 rounded-[clamp(10px,1.2vw,18px)] border border-white/14 bg-white/[0.07] p-[6%] backdrop-blur">
          <div className="flex items-center justify-between">
            <div className="h-2 w-[28%] rounded-full bg-white/45" />
            <div className="h-2 w-[12%] rounded-full bg-gold/70" />
          </div>
          <div className="mt-[10%] h-[48%] rounded-xl border border-white/10 bg-[linear-gradient(135deg,rgba(200,171,114,.22),rgba(255,255,255,.02))] p-[7%]">
            <div className="h-2 w-[42%] rounded-full bg-white/46" />
            <div className="mt-[6%] h-2 w-[68%] rounded-full bg-white/18" />
            <div className="mt-[4%] h-2 w-[55%] rounded-full bg-white/18" />
          </div>
          <div className="mt-[7%] grid grid-cols-3 gap-[3%]">
            {[0, 1, 2].map((item) => (
              <div key={item} className="h-10 rounded-lg border border-white/10 bg-white/[0.06]" />
            ))}
          </div>
        </div>
        <div className="col-span-5 rounded-[clamp(12px,1.5vw,24px)] border border-white/15 bg-[#19191f] p-[5%] shadow-2xl">
          <div className="mx-auto h-1.5 w-[30%] rounded-full bg-black/60" />
          <div className="mt-[10%] h-2 w-[50%] rounded-full bg-white/38" />
          <div className="mt-[7%] h-[42%] rounded-xl bg-[radial-gradient(circle_at_35%_30%,rgba(200,171,114,.48),rgba(200,171,114,.08)_55%,transparent)]" />
          <div className="mt-[8%] h-8 rounded-full bg-gold/80" />
        </div>
      </div>
    </div>
  );
}

function AutomationSystemView() {
  return (
    <div data-scene-view="automation" className="absolute inset-0 overflow-hidden bg-[#090a0c] opacity-0">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_48%,rgba(200,171,114,0.18),transparent_46%)]" />
      <div className="absolute left-[7%] top-[9%] flex items-center gap-2">
        <TMark className="h-4 w-4 text-gold" />
        <span className="font-mono-brand text-[clamp(7px,0.72vw,10px)] uppercase tracking-[0.2em] text-white/54">
          Automation map
        </span>
      </div>
      <svg className="absolute inset-[8%] h-[84%] w-[84%]" viewBox="0 0 800 430" fill="none" aria-hidden="true">
        <g stroke="rgba(242,239,233,.25)" strokeWidth="1">
          <path d="M88 220 C180 90 274 96 340 180 S502 322 708 132" />
          <path d="M90 220 C214 350 344 342 426 250 S596 126 708 132" />
          <path d="M208 114 L272 286 L426 250 L540 100 L612 292" strokeDasharray="5 8" />
        </g>
        {[
          [88, 220, 17],
          [208, 114, 11],
          [272, 286, 14],
          [340, 180, 19],
          [426, 250, 13],
          [540, 100, 16],
          [612, 292, 12],
          [708, 132, 18],
        ].map(([x, y, r], index) => (
          <g key={index}>
            <circle cx={x} cy={y} r={r + 8} fill="rgba(200,171,114,.06)" stroke="rgba(200,171,114,.18)" />
            <circle cx={x} cy={y} r={r} fill={index % 3 === 0 ? "rgba(200,171,114,.9)" : "#17171b"} stroke="rgba(242,239,233,.7)" />
          </g>
        ))}
      </svg>
      <div className="absolute bottom-[7%] left-[7%] flex gap-2">
        {["AI", "APIs", "WORKFLOWS"].map((tag) => (
          <span key={tag} className="rounded-full border border-white/15 bg-white/[0.05] px-3 py-1 font-mono-brand text-[clamp(6px,0.58vw,9px)] tracking-[0.15em] text-white/48">
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}

function WirePlane({ tone = "line" }: { tone?: "line" | "fill" | "gold" }) {
  const surface =
    tone === "fill"
      ? "border-white/20 bg-white/[0.025]"
      : tone === "gold"
        ? "border-gold/45 bg-gold/[0.025]"
        : "border-white/42 bg-transparent";

  return (
    <div className={`relative h-full w-full rounded-[18px] border ${surface}`}>
      {[
        "left-3 top-3 border-l border-t",
        "right-3 top-3 border-r border-t",
        "bottom-3 left-3 border-b border-l",
        "bottom-3 right-3 border-b border-r",
      ].map((position) => (
        <span key={position} className={`absolute h-3 w-3 border-white/55 ${position}`} />
      ))}
    </div>
  );
}

const stackSlots = [
  { x: -28, y: -18, z: -130, rotateY: -6, rotateZ: -2, alpha: 0.3 },
  { x: 22, y: -8, z: -70, rotateY: 5, rotateZ: 1.8, alpha: 0.14 },
  { x: -8, y: 14, z: 80, rotateY: -3, rotateZ: -0.8, alpha: 0.22 },
  { x: 0, y: 0, z: 125, rotateY: -2, rotateZ: -0.3, alpha: 0.62 },
];

export function Hero() {
  const rootRef = useRef<HTMLElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const card = cardRef.current;
    if (!root || !card) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ctx = gsap.context(() => {
      let introSplit: SplitText | null = null;

      if (headingRef.current) {
        introSplit = new SplitText(headingRef.current, { type: "lines", mask: "lines" });
        headingRef.current.style.visibility = "visible";
      }

      if (reduced) {
        gsap.set("[data-hero-fade]", { autoAlpha: 1 });
        return;
      }

      if (introSplit) {
        gsap.fromTo(
          introSplit.lines,
          { yPercent: 118 },
          { yPercent: 0, duration: 1.25, stagger: 0.1, ease: "expo.out", delay: 0.25 }
        );
      }
      gsap.fromTo(
        "[data-hero-fade]",
        { autoAlpha: 0, y: 24 },
        { autoAlpha: 1, y: 0, duration: 0.95, stagger: 0.08, ease: "power3.out", delay: 0.68 }
      );

      const media = root.querySelector<HTMLElement>("[data-media-plane]");
      const planes = gsap.utils.toArray<HTMLElement>("[data-stack-plane]");
      const paths = gsap.utils.toArray<SVGPathElement>("[data-tech-path]");
      const mm = gsap.matchMedia();

      paths.forEach((path) => {
        const length = path.getTotalLength();
        const authored = path.getAttribute("stroke-dasharray");
        gsap.set(path, {
          strokeDasharray: authored ? `${authored} ${length}` : length,
          strokeDashoffset: length,
        });
      });

      mm.add(
        {
          compact: "(max-width: 767px)",
          desktop: "(min-width: 768px)",
        },
        (matchContext) => {
          if (!media) return;
          const compact = Boolean(matchContext.conditions?.compact);

          const geometry = () => {
            const width = card.clientWidth;
            const height = card.clientHeight;
            const finalWidth = compact ? Math.min(width * 0.88, 360) : Math.min(width * 0.36, 510);
            return {
              width,
              height,
              finalWidth,
              finalHeight: finalWidth * 0.62,
              finalY: compact ? -height * 0.29 : -height * 0.245,
            };
          };

          const sizeScene = () => {
            const g = geometry();
            gsap.set(media, {
              width: g.width,
              height: g.height,
              xPercent: -50,
              yPercent: -50,
              x: 0,
              y: 0,
              z: 0,
              scale: 1,
              rotateX: 0,
              rotateY: 0,
              rotateZ: 0,
              borderRadius: 0,
            });
            planes.forEach((plane) => {
              gsap.set(plane, {
                width: g.finalWidth,
                height: g.finalHeight,
                xPercent: -50,
                yPercent: -50,
                x: 0,
                y: g.finalY,
                z: 0,
                rotateX: 0,
                rotateY: 0,
                rotateZ: 0,
                autoAlpha: 0,
              });
            });
          };

          sizeScene();
          ScrollTrigger.addEventListener("refreshInit", sizeScene);

          gsap.set("[data-light-field]", { autoAlpha: 0 });
          gsap.set("[data-story]", { autoAlpha: 0, y: 26 });
          gsap.set("[data-scene-view='core']", { autoAlpha: 1 });
          gsap.set("[data-scene-view='product'], [data-scene-view='automation']", { autoAlpha: 0 });
          gsap.set("[data-tech-node], [data-tech-marker]", { autoAlpha: 0, scale: 0, transformOrigin: "50% 50%" });

          const timeline = gsap.timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              trigger: root,
              start: "top top",
              end: compact ? "+=300%" : "+=410%",
              scrub: 0.8,
              pin: true,
              anticipatePin: 1,
              invalidateOnRefresh: true,
            },
          });

          // 01 — Scale-style opening hold, then the headline and navigation recede.
          timeline
            .to("[data-media-drift]", { scale: 1.025, duration: 0.035 }, 0)
            .to("[data-intro-badge]", { autoAlpha: 0, y: -20, duration: 0.025 }, 0.015)
            .to("[data-intro-heading]", { autoAlpha: 0, y: -40, scale: 0.97, duration: 0.035 }, 0.025)
            .to("[data-intro-copy]", { autoAlpha: 0, y: -24, duration: 0.025 }, 0.035)
            .to("[data-intro-cta], [data-intro-meta]", { autoAlpha: 0, y: 20, duration: 0.025 }, 0.04)
            .to("[data-scroll-cue]", { autoAlpha: 0, duration: 0.02 }, 0.02)
            .to("[data-intro-overlay]", { autoAlpha: 0, duration: 0.035 }, 0.035);

          // 02 — the full media frame contracts over a pale field before the black stage takes over.
          timeline
            .to("[data-light-field]", { autoAlpha: 1, duration: 0.03 }, 0.035)
            .to(
              media,
              {
                width: () => geometry().width * (compact ? 0.9 : 0.78),
                height: () => geometry().height * (compact ? 0.76 : 0.72),
                borderRadius: compact ? 15 : 22,
                duration: 0.05,
                ease: "power2.inOut",
              },
              0.04
            )
            .to("[data-light-field]", { autoAlpha: 0, duration: 0.035 }, 0.085);

          // 03 — pull the media surface into the compact upper stack and separate the wire planes.
          timeline.to(
            media,
            {
              width: () => geometry().finalWidth,
              height: () => geometry().finalHeight,
              y: () => geometry().finalY,
              z: 30,
              rotateX: compact ? 2 : 5,
              rotateY: compact ? -5 : -11,
              rotateZ: -0.8,
              borderRadius: compact ? 14 : 18,
              duration: 0.08,
              ease: "power2.inOut",
            },
            0.09
          );

          planes.forEach((plane, index) => {
            const slot = stackSlots[index];
            timeline.to(
              plane,
              {
                autoAlpha: slot.alpha,
                x: slot.x * (compact ? 0.55 : 1),
                y: () => geometry().finalY + slot.y * (compact ? 0.55 : 1),
                z: slot.z * (compact ? 0.55 : 1),
                rotateX: compact ? 2 : 5,
                rotateY: slot.rotateY * (compact ? 0.55 : 1),
                rotateZ: slot.rotateZ,
                duration: 0.08,
              },
              0.105 + index * 0.008
            );
          });

          timeline
            .to(paths, { strokeDashoffset: 0, duration: 0.08, stagger: 0.002 }, 0.12)
            .to("[data-tech-node], [data-tech-marker]", { autoAlpha: 1, scale: 1, duration: 0.05, stagger: 0.0015 }, 0.155);

          // 04 — first narrative: the engineering standard behind the visual.
          timeline
            .to("[data-story='standard']", { autoAlpha: 1, y: 0, duration: 0.045, ease: "power2.out" }, 0.17)
            .to("[data-story='standard']", { autoAlpha: 0, y: -20, duration: 0.04 }, 0.3);

          // 05 — product state and content swap.
          timeline
            .to("[data-scene-view='core']", { autoAlpha: 0, duration: 0.035 }, 0.305)
            .to("[data-scene-view='product']", { autoAlpha: 1, duration: 0.045 }, 0.315)
            .to(media, { rotateY: compact ? 5 : 10, rotateZ: 1.2, x: compact ? 5 : 18, duration: 0.09 }, 0.31)
            .to(planes[0], { x: compact ? -17 : -58, rotateZ: -6, duration: 0.09 }, 0.31)
            .to(planes[1], { x: compact ? 18 : 52, rotateZ: 4.5, duration: 0.09 }, 0.31)
            // Starts exactly where 'standard' finishes fading out (0.30 + 0.04).
            // Story panels are stacked in the same spot, so they must never
            // paint together: a gap leaves a blank beat, an overlap shows two
            // CTAs at once offset by their enter/exit y.
            .to("[data-story='products']", { autoAlpha: 1, y: 0, duration: 0.05, ease: "power2.out" }, 0.34)
            .to("[data-story='products']", { autoAlpha: 0, y: -20, duration: 0.045 }, 0.6);

          // 06 — automation state and final narrative.
          timeline
            .to("[data-scene-view='product']", { autoAlpha: 0, duration: 0.035 }, 0.605)
            .to("[data-scene-view='automation']", { autoAlpha: 1, duration: 0.045 }, 0.615)
            .to(media, { rotateY: compact ? -4 : -8, rotateZ: -1, x: compact ? -4 : -14, duration: 0.09 }, 0.61)
            .to(planes[0], { x: compact ? -11 : -36, y: () => geometry().finalY - (compact ? 18 : 34), rotateZ: -3.5, duration: 0.09 }, 0.61)
            .to(planes[1], { x: compact ? 12 : 38, y: () => geometry().finalY - (compact ? 5 : 12), rotateZ: 3, duration: 0.09 }, 0.61)
            // Starts exactly where 'products' finishes fading out (0.60 + 0.045).
            .to("[data-story='automation']", { autoAlpha: 1, y: 0, duration: 0.055, ease: "power2.out" }, 0.645)
            .to("[data-stack]", { y: compact ? -4 : -8, duration: 0.16 }, 0.8)
            .to({}, { duration: 0.12 }, 0.88);

          return () => {
            ScrollTrigger.removeEventListener("refreshInit", sizeScene);
          };
        }
      );

      document.fonts?.ready.then(() => ScrollTrigger.refresh());

      return () => {
        introSplit?.revert();
      };
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={rootRef} className="relative bg-ivory p-[var(--frame-pad)]" aria-label="TrinityByte introduction">
      <div
        ref={cardRef}
        className="relative flex min-h-[calc(100svh-2*var(--frame-pad))] flex-col overflow-hidden rounded-[var(--card-radius)] bg-[#050506]"
      >
        <div data-light-field className="pointer-events-none absolute inset-0 z-[1] bg-[#d9d8d3] opacity-0" />

        <div data-stack className="absolute inset-0 z-[2]" style={{ perspective: "1200px", perspectiveOrigin: "50% 36%" }}>
          <div
            data-media-plane
            data-media-drift
            className="absolute left-1/2 top-1/2 overflow-hidden border border-white/12 shadow-[0_50px_150px_rgba(0,0,0,.62)]"
            style={{ transformStyle: "preserve-3d" }}
          >
            <CoreSystemView />
            <ProductSystemView />
            <AutomationSystemView />
            <div className="grain absolute inset-0 opacity-20" />
          </div>

          <div data-stack-plane="back" className="pointer-events-none absolute left-1/2 top-1/2 opacity-0" style={{ transformStyle: "preserve-3d" }}>
            <WirePlane />
          </div>
          <div data-stack-plane="fill" className="pointer-events-none absolute left-1/2 top-1/2 opacity-0" style={{ transformStyle: "preserve-3d" }}>
            <WirePlane tone="fill" />
          </div>
          <div data-stack-plane="gold" className="pointer-events-none absolute left-1/2 top-1/2 opacity-0" style={{ transformStyle: "preserve-3d" }}>
            <WirePlane tone="gold" />
          </div>
          <div data-stack-plane="tech" className="pointer-events-none absolute left-1/2 top-1/2 opacity-0" style={{ transformStyle: "preserve-3d" }}>
            <HeroTechOverlay className="h-full w-full overflow-visible" />
          </div>
        </div>

        <div
          data-intro-overlay
          className="pointer-events-none absolute inset-0 z-[3] bg-[radial-gradient(ellipse_92%_62%_at_50%_58%,rgba(0,0,0,.78)_0%,rgba(0,0,0,.42)_60%,rgba(0,0,0,.12)_100%)] sm:bg-[radial-gradient(ellipse_66%_54%_at_50%_55%,rgba(0,0,0,.62)_0%,rgba(0,0,0,.26)_68%,rgba(0,0,0,.08)_100%)]"
        />

        <div data-intro-shell className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 pb-28 pt-28 text-center">
          <div
            data-intro-badge
            data-hero-fade
            className="mb-8 inline-flex max-w-full items-center gap-2.5 rounded-full bg-ivory/92 py-2.5 pl-3.5 pr-5 shadow-[0_18px_50px_rgba(0,0,0,.35)] backdrop-blur"
          >
            <TMark className="h-[15px] w-[15px] shrink-0 text-gold-deep" />
            <span className="whitespace-nowrap font-mono-brand text-[9px] font-medium uppercase tracking-[0.16em] text-ink sm:text-[11px] sm:tracking-[0.2em]">
              Hybrid Software House — Est. 2026
            </span>
          </div>

          <h1
            ref={headingRef}
            data-intro-heading
            data-anim-hidden
            className="mx-auto max-w-[1120px] text-balance font-display text-[clamp(42px,6.7vw,96px)] font-semibold leading-[1.02] tracking-[-0.045em] text-white"
          >
            We Build Digital Products That Deliver Results.
          </h1>

          <p
            data-intro-copy
            data-hero-fade
            className="mx-auto mt-6 max-w-[760px] text-balance text-[clamp(15px,1.35vw,19px)] leading-[1.55] text-white/82"
          >
            TrinityByte builds scalable, high-performance software for startups, businesses, and ambitious teams worldwide.
          </p>

          <div data-intro-cta data-hero-fade className="pointer-events-auto mt-9">
            <PillButton href="/contact" tone="light" size="lg">
              Start a Project
            </PillButton>
          </div>
        </div>

        <div data-intro-meta data-hero-fade className="absolute bottom-[clamp(20px,3vw,38px)] left-[clamp(20px,3vw,38px)] z-10 hidden items-center gap-3 sm:flex">
          <div className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-black/45 backdrop-blur">
            <TMark className="h-4 w-4 text-gold" />
          </div>
          <div>
            <p className="font-mono-brand text-[10px] uppercase tracking-[0.2em] text-white/44">Worldwide delivery</p>
            <p className="mt-1 text-[13px] text-white/76">Karachi, Pakistan · Remote-first</p>
          </div>
        </div>

        <div data-scroll-cue data-hero-fade className="absolute bottom-[clamp(22px,3vw,40px)] right-[clamp(20px,3vw,38px)] z-10 flex items-center gap-3 text-white/60">
          <span className="hidden font-mono-brand text-[9px] uppercase tracking-[0.2em] sm:block">Scroll to explore</span>
          <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/25 text-lg">↓</span>
        </div>

        <div className="pointer-events-none absolute inset-0 z-[6]">
          <div data-story="standard" className="absolute inset-x-5 top-[43%] mx-auto max-w-[920px] translate-y-6 text-center opacity-0 md:inset-x-10 md:top-[55%]">
            <p className="font-mono-brand text-[9px] uppercase tracking-[0.22em] text-gold md:text-[10px]">Our standard</p>
            <h2 className="mt-5 text-balance font-display text-[clamp(30px,3vw,46px)] font-medium leading-[1.04] tracking-[-0.04em] text-white">
              Reliable software has no shortcuts.
            </h2>
            <p className="mx-auto mt-5 max-w-[780px] text-balance text-[14px] leading-[1.55] text-white/62 md:text-[15px]">
              Discovery, design, engineering, and QA work as one system—because production-ready products are built end to end.
            </p>
          </div>

          <div data-story="products" className="absolute inset-x-5 top-[43%] mx-auto max-w-[980px] translate-y-6 text-center opacity-0 md:inset-x-10 md:top-[55%]">
            <p className="font-mono-brand text-[9px] uppercase tracking-[0.22em] text-gold md:text-[10px]">Digital products</p>
            <h2 className="mt-5 text-balance font-display text-[clamp(30px,3vw,46px)] font-medium leading-[1.04] tracking-[-0.04em] text-white">
              Software that actually works.
            </h2>
            <p className="mx-auto mt-5 max-w-[800px] text-balance text-[14px] leading-[1.55] text-white/62 md:text-[15px]">
              Custom platforms, web applications, and mobile products engineered for the way your business really operates.
            </p>
            <div className="pointer-events-auto mt-6">
              <PillButton href="/services" tone="gold" size="sm">
                Explore Services
              </PillButton>
            </div>
          </div>

          <div data-story="automation" className="absolute inset-x-5 top-[43%] mx-auto max-w-[980px] translate-y-6 text-center opacity-0 md:inset-x-10 md:top-[55%]">
            <p className="font-mono-brand text-[9px] uppercase tracking-[0.22em] text-gold md:text-[10px]">AI &amp; automation</p>
            <h2 className="mt-5 text-balance font-display text-[clamp(30px,3vw,46px)] font-medium leading-[1.04] tracking-[-0.04em] text-white">
              Systems that turn complexity into momentum.
            </h2>
            <p className="mx-auto mt-5 max-w-[820px] text-balance text-[14px] leading-[1.55] text-white/62 md:text-[15px]">
              Scalable architecture, intelligent automation, and reliable delivery for ambitious teams worldwide.
            </p>
            <div className="pointer-events-auto mt-6">
              <PillButton href="/contact" tone="gold" size="sm">
                Start a Project
              </PillButton>
            </div>
          </div>
        </div>

        <p className="sr-only">
          TrinityByte combines strategy, design, engineering, quality assurance, and automation to build reliable digital products for businesses worldwide.
        </p>
      </div>
    </section>
  );
}
