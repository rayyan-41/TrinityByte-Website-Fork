"use client";

import Link from "next/link";
import {
  motion,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import type { MotionValue } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { projects, type Project } from "@/data/projects";

type SceneSize = { width: number; height: number };
type CardTarget = {
  x: number;
  y: number;
  rotation: number;
  scale: number;
  opacity: number;
};

type MorphCard = {
  src: string;
  project: Project;
  frame: string;
};

const FRAME_LABELS = ["System", "Interface", "Experience"] as const;

const clamp = (value: number, min = 0, max = 1) =>
  Math.min(Math.max(value, min), max);

const range = (value: number, start: number, end: number) =>
  clamp((value - start) / (end - start));

const lerp = (start: number, end: number, progress: number) =>
  start + (end - start) * progress;

const mixTarget = (from: CardTarget, to: CardTarget, progress: number): CardTarget => ({
  x: lerp(from.x, to.x, progress),
  y: lerp(from.y, to.y, progress),
  rotation: lerp(from.rotation, to.rotation, progress),
  scale: lerp(from.scale, to.scale, progress),
  opacity: lerp(from.opacity, to.opacity, progress),
});

function deterministicScatter(index: number, size: SceneSize): CardTarget {
  const angle = ((index * 137.508 + 18) * Math.PI) / 180;
  const ring = index % 3;
  const radius = Math.max(size.width, size.height) * (0.48 + ring * 0.18);

  return {
    x: Math.cos(angle) * radius,
    y: Math.sin(angle) * radius * 0.72,
    rotation: ((index * 47) % 150) - 75,
    scale: 0.54,
    opacity: 0,
  };
}

function lineTarget(index: number, total: number, size: SceneSize): CardTarget {
  const mobile = size.width < 768;
  const spacing = mobile ? 66 : Math.min(106, size.width / 12.5);

  return {
    x: (index - (total - 1) / 2) * spacing,
    y: mobile ? 48 : 42,
    rotation: 0,
    scale: mobile ? 0.84 : 0.92,
    opacity: 1,
  };
}

function circleTarget(index: number, total: number, size: SceneSize): CardTarget {
  const mobile = size.width < 768;
  const radius = Math.min(size.width * (mobile ? 0.34 : 0.28), size.height * 0.31);
  const angle = (index / total) * Math.PI * 2 - Math.PI / 2;

  return {
    x: Math.cos(angle) * radius,
    y: Math.sin(angle) * radius + (mobile ? 34 : 20),
    rotation: (angle * 180) / Math.PI + 90,
    scale: mobile ? 0.86 : 1,
    opacity: 1,
  };
}

function arcTarget(
  index: number,
  total: number,
  size: SceneSize,
  browseProgress: number
): CardTarget {
  const mobile = size.width < 768;
  const spread = mobile ? 112 : 138;
  const start = -90 - spread / 2;
  const step = spread / (total - 1);
  const sweep = browseProgress * (mobile ? 44 : 54);
  const angle = start + index * step - sweep;
  const radians = (angle * Math.PI) / 180;
  const radius = mobile
    ? Math.max(size.width * 0.88, 330)
    : Math.min(Math.max(size.width * 0.49, 620), 820);
  const centerY = radius + (mobile ? size.height * 0.13 : size.height * 0.04);

  return {
    x: Math.cos(radians) * radius,
    y: Math.sin(radians) * radius + centerY,
    rotation: angle + 90,
    scale: mobile ? 1.06 : 1.28,
    opacity: 1,
  };
}

function getTarget(index: number, total: number, progress: number, size: SceneSize) {
  const scatter = deterministicScatter(index, size);
  const line = lineTarget(index, total, size);
  const circle = circleTarget(index, total, size);
  const arc = arcTarget(index, total, size, range(progress, 0.78, 1));

  if (progress < 0.16) return mixTarget(scatter, line, range(progress, 0.02, 0.16));
  if (progress < 0.42) return mixTarget(line, circle, range(progress, 0.2, 0.42));
  if (progress < 0.72) return mixTarget(circle, arc, range(progress, 0.48, 0.72));
  return arc;
}

function FlipCard({
  card,
  index,
  total,
  progress,
  size,
  interactive,
}: {
  card: MorphCard;
  index: number;
  total: number;
  progress: MotionValue<number>;
  size: SceneSize;
  interactive: boolean;
}) {
  const x = useTransform(progress, (value) => getTarget(index, total, value, size).x);
  const y = useTransform(progress, (value) => getTarget(index, total, value, size).y);
  const rotate = useTransform(
    progress,
    (value) => getTarget(index, total, value, size).rotation
  );
  const scale = useTransform(progress, (value) => getTarget(index, total, value, size).scale);
  const opacity = useTransform(
    progress,
    (value) => getTarget(index, total, value, size).opacity
  );

  const spring = { stiffness: 90, damping: 24, mass: 0.55 };
  const springX = useSpring(x, spring);
  const springY = useSpring(y, spring);
  const springRotate = useSpring(rotate, spring);
  const springScale = useSpring(scale, spring);

  return (
    <motion.div
      className="absolute left-1/2 top-1/2 z-10"
      style={{
        x: springX,
        y: springY,
        rotate: springRotate,
        scale: springScale,
        opacity,
        transformStyle: "preserve-3d",
        perspective: 1000,
      }}
    >
      <Link
        href={`/work/${card.project.slug}`}
        aria-label={`View ${card.project.title} — ${card.frame}`}
        aria-hidden={!interactive}
        tabIndex={interactive ? 0 : -1}
        className={`group absolute left-1/2 top-1/2 block h-[clamp(82px,9vw,132px)] w-[clamp(58px,6.3vw,94px)] -translate-x-1/2 -translate-y-1/2 rounded-[13px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold ${
          interactive ? "pointer-events-auto" : "pointer-events-none"
        }`}
      >
        <motion.span
          className="relative block h-full w-full"
          style={{ transformStyle: "preserve-3d" }}
          whileHover={{ rotateY: 180, y: -8 }}
          transition={{ type: "spring", stiffness: 230, damping: 22 }}
        >
          <span
            className="absolute inset-0 block overflow-hidden rounded-[13px] border border-white/20 bg-[#171719] shadow-[0_22px_70px_rgba(0,0,0,0.48)]"
            style={{ backfaceVisibility: "hidden" }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={card.src}
              alt=""
              draggable={false}
              className="h-full w-full object-cover saturate-[0.72] transition duration-700 group-hover:saturate-100"
            />
            <span className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/5 to-black/10" />
            <span className="absolute bottom-2 left-2 right-2 flex items-end justify-between gap-1 text-[7px] font-medium uppercase tracking-[0.13em] text-white sm:text-[8px]">
              <span className="line-clamp-2">{card.project.title}</span>
              <span className="shrink-0 text-gold">{card.project.index}</span>
            </span>
          </span>

          <span
            className="absolute inset-0 flex flex-col items-center justify-center rounded-[13px] border border-gold/45 bg-[#101011] px-2 text-center shadow-[0_22px_70px_rgba(0,0,0,0.56)]"
            style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
          >
            <span className="font-mono-brand text-[7px] uppercase tracking-[0.18em] text-gold sm:text-[8px]">
              {card.frame}
            </span>
            <span className="mt-1.5 font-display text-[10px] font-medium leading-tight text-ivory sm:text-[12px]">
              {card.project.title}
            </span>
            <span className="mt-2 font-mono-brand text-[7px] uppercase tracking-[0.16em] text-ivory/50">
              View project ↗
            </span>
          </span>
        </motion.span>
      </Link>
    </motion.div>
  );
}

export default function ScrollMorphHero() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState<SceneSize>({ width: 1440, height: 900 });
  const [reducedMotion, setReducedMotion] = useState(false);
  const [interactive, setInteractive] = useState(false);
  const interactiveRef = useRef(false);
  const mouseX = useMotionValue(0);

  const cards = useMemo<MorphCard[]>(
    () =>
      projects.flatMap((project) =>
        project.gallery.map((src, index) => ({
          src,
          project,
          frame: FRAME_LABELS[index % FRAME_LABELS.length],
        }))
      ),
    []
  );

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const progress = useSpring(scrollYProgress, {
    stiffness: 78,
    damping: 24,
    mass: 0.52,
    restDelta: 0.0008,
  });

  const sceneProgress = useMotionValue(0);
  const introOpacity = useTransform(sceneProgress, [0.13, 0.25, 0.4], [0, 1, 0]);
  const introY = useTransform(sceneProgress, [0.13, 0.25, 0.4], [22, 0, -24]);
  const finalOpacity = useTransform(sceneProgress, [0.56, 0.72], [0, 1]);
  const finalY = useTransform(sceneProgress, [0.56, 0.72], [26, 0]);
  const orbitRotate = useTransform(mouseX, [-1, 1], [-3, 3]);

  useEffect(() => {
    if (reducedMotion) {
      sceneProgress.set(0.82);
      return;
    }

    sceneProgress.set(progress.get());
    return progress.on("change", (value) => sceneProgress.set(value));
  }, [progress, reducedMotion, sceneProgress]);

  useEffect(
    () =>
      sceneProgress.on("change", (value) => {
        const next = value >= 0.56;
        if (next !== interactiveRef.current) {
          interactiveRef.current = next;
          setInteractive(next);
        }
      }),
    [sceneProgress]
  );

  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;

    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotion = () => setReducedMotion(media.matches);
    updateMotion();
    media.addEventListener("change", updateMotion);

    const observer = new ResizeObserver(([entry]) => {
      setSize({ width: entry.contentRect.width, height: entry.contentRect.height });
    });
    observer.observe(scene);

    return () => {
      observer.disconnect();
      media.removeEventListener("change", updateMotion);
    };
  }, []);

  return (
    <div
      ref={sectionRef}
      className="relative h-[250svh] md:h-[310svh]"
      data-scroll-morph
    >
      <div
        ref={sceneRef}
        className="grain sticky top-0 h-svh min-h-[640px] overflow-hidden bg-[#080808]"
        onPointerMove={(event) => {
          if (reducedMotion) return;
          const rect = event.currentTarget.getBoundingClientRect();
          mouseX.set(clamp(((event.clientX - rect.left) / rect.width) * 2 - 1, -1, 1));
        }}
        onPointerLeave={() => mouseX.set(0)}
      >
        <div className="absolute inset-0 bg-[radial-gradient(58%_55%_at_50%_52%,rgba(200,171,114,0.105),transparent_72%)]" />
        <div className="absolute inset-x-0 top-0 h-px bg-white/10" />

        <motion.div className="absolute inset-0" style={{ rotate: orbitRotate }}>
          {cards.map((card, index) => (
            <FlipCard
              key={`${card.project.slug}-${card.frame}`}
              card={card}
              index={index}
              total={cards.length}
              progress={sceneProgress}
              size={size}
              interactive={interactive}
            />
          ))}
        </motion.div>

        <motion.div
          className="pointer-events-none absolute left-1/2 top-1/2 z-20 w-[min(88vw,680px)] -translate-x-1/2 -translate-y-1/2 text-center"
          style={{ opacity: introOpacity, y: introY }}
        >
          <p className="label-mono text-gold">Selected project frames</p>
          <h3 className="mt-4 font-display text-[clamp(26px,4.4vw,64px)] font-medium leading-[1.02] tracking-[-0.04em] text-ivory [text-shadow:0_3px_28px_rgba(0,0,0,0.95)]">
            Ideas take shape.
            <br /> Systems come alive.
          </h3>
          <p className="mx-auto mt-5 max-w-[480px] text-[13px] leading-relaxed text-ivory/62 [text-shadow:0_2px_18px_rgba(0,0,0,0.95)] sm:text-[15px]">
            Scroll to move from early fragments to one connected product experience.
          </p>
        </motion.div>

        <motion.div
          className="pointer-events-none absolute inset-x-0 top-[9%] z-20 px-5 text-center md:top-[8%]"
          style={{ opacity: finalOpacity, y: finalY }}
        >
          <p className="label-mono text-gold">TrinityByte selected builds</p>
          <h3 className="mx-auto mt-3 max-w-[920px] font-display text-[clamp(30px,5vw,72px)] font-medium leading-[0.98] tracking-[-0.045em] text-ivory">
            Explore the systems behind the work.
          </h3>
          <p className="mx-auto mt-4 max-w-[560px] text-[13px] leading-relaxed text-ivory/55 sm:text-[15px]">
            <span className="sm:hidden">Tap a frame to open its project. </span>
            <span className="hidden sm:inline">Hover a frame to reveal its project. </span>
            Continue scrolling to move through the collection.
          </p>
        </motion.div>

        <div className="pointer-events-none absolute bottom-5 left-5 right-5 z-30 flex items-end justify-between md:bottom-7 md:left-[var(--container-pad)] md:right-[var(--container-pad)]">
          <div>
            <p className="font-mono-brand text-[9px] uppercase tracking-[0.2em] text-ivory/42 sm:text-[10px]">
              Representative portfolio imagery
            </p>
            <p className="mt-1 hidden text-[12px] text-ivory/35 sm:block">
              Real case studies can replace these frames in one data source.
            </p>
          </div>
          <div className="flex items-center gap-2 font-mono-brand text-[9px] uppercase tracking-[0.18em] text-ivory/48 sm:text-[10px]">
            <span>Scroll</span>
            <span className="relative h-10 w-px overflow-hidden bg-white/15">
              <motion.span
                className="absolute inset-x-0 top-0 h-1/2 bg-gold"
                animate={reducedMotion ? undefined : { y: ["-100%", "200%"] }}
                transition={{ duration: 1.45, repeat: Infinity, ease: "easeInOut" }}
              />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
