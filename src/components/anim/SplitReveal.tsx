"use client";

import { ElementType, ReactNode, useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(ScrollTrigger, SplitText);

type Props = {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  /** split by lines (mask rise) or words */
  mode?: "lines" | "words";
  delay?: number;
  stagger?: number;
  start?: string;
  /** play immediately on mount instead of on scroll */
  immediate?: boolean;
  /**
   * Selector for elements SplitText should fold into the adjacent word rather
   * than split around — an inline <img>/icon otherwise becomes its own line.
   */
  ignore?: string;
};

/** Masked line/word rise — the signature editorial text reveal. */
export function SplitReveal({
  children,
  as: Tag = "div",
  className,
  mode = "lines",
  delay = 0,
  stagger = 0.09,
  start = "top 86%",
  immediate = false,
  ignore,
}: Props) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      el.style.visibility = "visible";
      return;
    }

    let split: SplitText | null = null;
    const ctx = gsap.context(() => {
      split = new SplitText(el, {
        type: mode === "lines" ? "lines" : "words",
        linesClass: "split-line",
        ignore,
        mask: mode === "lines" ? "lines" : "words",
      });
      const targets = mode === "lines" ? split.lines : split.words;
      el.style.visibility = "visible";
      gsap.fromTo(
        targets,
        { yPercent: 115 },
        {
          yPercent: 0,
          duration: 1.15,
          delay,
          stagger,
          ease: "expo.out",
          ...(immediate
            ? {}
            : { scrollTrigger: { trigger: el, start, once: true } }),
        }
      );
    });
    return () => {
      split?.revert();
      ctx.revert();
    };
  }, [mode, delay, stagger, start, immediate, ignore]);

  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <Tag ref={ref as any} className={className} data-anim-hidden>
      {children}
    </Tag>
  );
}
