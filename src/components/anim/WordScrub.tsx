"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(ScrollTrigger, SplitText);

type Props = {
  text: string;
  className?: string;
  /** dim color before the scrub brightens each word */
  dimOpacity?: number;
};

/** Word-by-word brightness scrub tied to scroll (the "growth engine" effect). */
export function WordScrub({ text, className, dimOpacity = 0.16 }: Props) {
  const ref = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    let split: SplitText | null = null;
    const ctx = gsap.context(() => {
      split = new SplitText(el, { type: "words" });
      gsap.fromTo(
        split.words,
        { opacity: dimOpacity },
        {
          opacity: 1,
          stagger: 0.06,
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "top 78%",
            end: "bottom 42%",
            scrub: 0.6,
          },
        }
      );
    });
    return () => {
      split?.revert();
      ctx.revert();
    };
  }, [dimOpacity]);

  return (
    <p ref={ref} className={className}>
      {text}
    </p>
  );
}
