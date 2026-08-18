"use client";

import { ReactNode, useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type Props = {
  children: ReactNode;
  /** seconds */
  delay?: number;
  y?: number;
  duration?: number;
  className?: string;
  /** viewport entry point, e.g. "top 85%" */
  start?: string;
  once?: boolean;
};

/** Fade-and-rise reveal when the element enters the viewport. */
export function Reveal({
  children,
  delay = 0,
  y = 44,
  duration = 1.1,
  className,
  start = "top 88%",
  once = true,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // The element ships hidden so it can't flash before the reveal runs.
    // With reduced motion we skip the animation, so it must be un-hidden here
    // or the content would never appear at all.
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      el.style.visibility = "visible";
      return;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { autoAlpha: 0, y },
        {
          autoAlpha: 1,
          y: 0,
          duration,
          delay,
          ease: "expo.out",
          scrollTrigger: { trigger: el, start, once },
        }
      );
    });
    return () => ctx.revert();
  }, [delay, y, duration, start, once]);

  return (
    <div ref={ref} className={className} data-anim-hidden>
      {children}
    </div>
  );
}
