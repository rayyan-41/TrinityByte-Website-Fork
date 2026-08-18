"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { PillButton } from "@/components/ui/PillButton";

export type PricingPlan = {
  title: string;
  copy: string;
  points: string[];
};

type Props = {
  plans: PricingPlan[];
  ctaLabel: string;
  ctaHref: string;
  /** rendered under the panel; kept as a slot so no copy lives in this file */
  footnote?: React.ReactNode;
};

/**
 * Interactive plan picker: a selectable list on the left with an animated
 * highlight that slides between entries, and a live detail panel on the right
 * that swaps content as the selection changes.
 *
 * Implemented as the ARIA tabs pattern — the list is a tablist, the panel is a
 * tabpanel — so it is operable with arrow keys, Home and End, not just a mouse.
 */
export function Pricing13({ plans, ctaLabel, ctaHref, footnote }: Props) {
  const [active, setActive] = useState(0);
  const reduce = useReducedMotion();
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const selected = plans[active];

  const onKeyDown = (event: React.KeyboardEvent) => {
    const last = plans.length - 1;
    let next: number | null = null;
    if (event.key === "ArrowDown" || event.key === "ArrowRight") next = active === last ? 0 : active + 1;
    if (event.key === "ArrowUp" || event.key === "ArrowLeft") next = active === 0 ? last : active - 1;
    if (event.key === "Home") next = 0;
    if (event.key === "End") next = last;
    if (next === null) return;
    event.preventDefault();
    setActive(next);
    tabRefs.current[next]?.focus();
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-8">
      {/* ---------------- picker ---------------- */}
      <div
        role="tablist"
        aria-label="Engagement models"
        aria-orientation="vertical"
        onKeyDown={onKeyDown}
        className="flex flex-col gap-3"
      >
        {plans.map((plan, index) => {
          const isActive = index === active;
          return (
            <button
              key={plan.title}
              ref={(node) => {
                tabRefs.current[index] = node;
              }}
              role="tab"
              type="button"
              id={`plan-tab-${index}`}
              aria-selected={isActive}
              aria-controls="plan-panel"
              tabIndex={isActive ? 0 : -1}
              onClick={() => setActive(index)}
              className="group relative isolate w-full rounded-[20px] px-[clamp(20px,2.2vw,32px)] py-[clamp(18px,2vw,26px)] text-left outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-ivory"
            >
              {/* animated selection highlight — one element that slides */}
              {isActive && (
                <motion.span
                  layoutId="plan-highlight"
                  transition={
                    reduce ? { duration: 0 } : { type: "spring", stiffness: 380, damping: 34 }
                  }
                  className="absolute inset-0 -z-10 rounded-[20px] bg-gradient-to-b from-[#14120d] to-[#0a0908] shadow-[0_24px_60px_rgba(0,0,0,.22)] ring-1 ring-gold/45"
                  aria-hidden="true"
                />
              )}
              {!isActive && (
                <span
                  className="absolute inset-0 -z-10 rounded-[20px] border border-line-light bg-white transition-colors duration-300 group-hover:border-gold-deep/40"
                  aria-hidden="true"
                />
              )}

              <span className="flex items-baseline gap-4">
                <span
                  className={`font-display text-[clamp(28px,3vw,42px)] font-semibold leading-none tracking-[-0.03em] transition-colors duration-300 ${
                    isActive ? "text-gold" : "text-ink"
                  }`}
                >
                  0{index + 1}
                </span>
                <span
                  className={`font-display text-[clamp(17px,1.6vw,22px)] font-semibold tracking-[-0.02em] transition-colors duration-300 ${
                    isActive ? "text-ivory" : "text-ink"
                  }`}
                >
                  {plan.title}
                </span>
              </span>
            </button>
          );
        })}
      </div>

      {/* ---------------- live detail panel ---------------- */}
      <div
        role="tabpanel"
        id="plan-panel"
        aria-labelledby={`plan-tab-${active}`}
        tabIndex={0}
        className="relative flex min-h-[420px] flex-col rounded-[22px] border border-line-light bg-white p-[clamp(24px,2.6vw,40px)] outline-none focus-visible:ring-2 focus-visible:ring-gold"
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={selected.title}
            initial={reduce ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? { opacity: 1 } : { opacity: 0, y: -10 }}
            transition={{ duration: reduce ? 0 : 0.34, ease: [0.16, 1, 0.3, 1] }}
            className="flex h-full flex-col"
          >
            <h3 className="font-display text-[clamp(22px,2.2vw,30px)] font-semibold tracking-[-0.02em] text-ink">
              {selected.title}
            </h3>
            <p className="mt-3 max-w-[560px] text-[14.5px] leading-[1.6] text-muted-light">
              {selected.copy}
            </p>

            <ul className="mt-7 grid grid-cols-1 gap-x-8 gap-y-3 border-t border-line-light pt-6 text-[14px] text-ink/85 sm:grid-cols-2">
              {selected.points.map((point, i) => (
                <motion.li
                  key={point}
                  initial={reduce ? false : { opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: reduce ? 0 : 0.3, delay: reduce ? 0 : 0.06 + i * 0.05 }}
                  className="flex items-start gap-3"
                >
                  <svg
                    viewBox="0 0 14 14"
                    className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold-deep"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M2 7.5 5.5 11 12 3.5" />
                  </svg>
                  {point}
                </motion.li>
              ))}
            </ul>

            <div className="mt-auto pt-9">
              <PillButton href={ctaHref} size="md">
                {ctaLabel}
              </PillButton>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {footnote ? <div className="lg:col-span-2">{footnote}</div> : null}
    </div>
  );
}
