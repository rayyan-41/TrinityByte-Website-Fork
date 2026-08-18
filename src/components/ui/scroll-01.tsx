"use client";

import Image from "next/image";
import Link from "next/link";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent,
  useReducedMotion,
} from "framer-motion";
import { useRef, useState, type Dispatch, type SetStateAction } from "react";

/**
 * Sticky media panel paired with a scrolling text column: as each entry passes
 * the middle of the viewport it becomes active and the pinned image crossfades
 * to match. Below md the two collapse into a plain stacked list.
 *
 * Adapted from the source in three ways:
 *  - imports from framer-motion, which this project already ships. The original
 *    used "motion/react" — the same library under its newer name; installing it
 *    too would bundle a second copy.
 *  - next/image instead of a raw <img>, so the covers are optimised
 *  - optional href per item, so the work page can still reach its case studies
 */

export type Scroll01Item = {
  title: string;
  description: string;
  media: string;
  href?: string;
  eyebrow?: string;
};

export interface Scroll01Props {
  items: Scroll01Item[];
}

function ScrollItem({
  item,
  index,
  setActive,
}: {
  item: Scroll01Item;
  index: number;
  setActive: Dispatch<SetStateAction<number>>;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 90%", "end 15%"],
  });

  const y = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [20, -20]);

  const opacityValues = index === 0 ? [1, 0.7, 1, 0] : [0, 0.7, 1, 0];
  const opacity = useTransform(
    scrollYProgress,
    [0, 0.3, 0.7, 1],
    reduce ? [1, 1, 1, 1] : opacityValues
  );

  const isActive = useTransform(scrollYProgress, (v) => v > 0.4 && v < 0.6);

  useMotionValueEvent(isActive, "change", (v) => {
    if (v) setActive((prev) => (prev === index ? prev : index));
  });

  const body = (
    <>
      {item.eyebrow && <p className="label-mono mb-3 text-gold">{item.eyebrow}</p>}
      <h3 className="mb-3 font-display text-[clamp(24px,2.6vw,34px)] font-semibold tracking-[-0.02em] text-ivory">
        {item.title}
      </h3>
      <p className="mx-auto max-w-[420px] text-[15px] leading-[1.6] text-muted-dark">
        {item.description}
      </p>
    </>
  );

  return (
    <motion.article ref={ref} style={{ opacity, y }} className="flex flex-col items-center">
      <div className="text-center">
        {item.href ? (
          <Link
            href={item.href}
            className="group block outline-none transition-colors duration-300"
          >
            <span className="block group-hover:[&_h3]:text-gold group-focus-visible:[&_h3]:text-gold">
              {body}
            </span>
            <span className="label-mono mt-5 inline-flex items-center gap-2 text-gold opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
              View case study →
            </span>
          </Link>
        ) : (
          body
        )}
      </div>
    </motion.article>
  );
}

export function Scroll01({ items }: Readonly<Scroll01Props>) {
  const [activeIndex, setActiveIndex] = useState<number>(0);

  return (
    <>
      {/* stacked on small screens */}
      <div className="space-y-12 md:hidden">
        {items.map((item, index) => {
          const card = (
            <>
              <div className="space-y-2">
                {item.eyebrow && <p className="label-mono text-gold">{item.eyebrow}</p>}
                <h3 className="font-display text-[24px] font-semibold tracking-[-0.02em] text-ivory">
                  {item.title}
                </h3>
                <p className="text-[15px] leading-[1.6] text-muted-dark">{item.description}</p>
              </div>
              <div className="relative mt-4 h-72 w-full overflow-hidden rounded-2xl">
                <Image
                  src={item.media}
                  alt={item.title}
                  fill
                  sizes="100vw"
                  className="object-cover"
                />
              </div>
            </>
          );

          return (
            <article key={`${item.title}-${index}`} className="flex flex-col items-start">
              {item.href ? (
                <Link href={item.href} className="block w-full outline-none">
                  {card}
                </Link>
              ) : (
                card
              )}
            </article>
          );
        })}
      </div>

      {/* sticky media + scrolling copy from md up */}
      <div className="hidden gap-10 md:grid md:grid-cols-2">
        <div className="sticky top-24 h-[70vh] overflow-hidden rounded-2xl border border-line-dark">
          {items.map((item, index) => (
            <motion.div
              key={`${item.title}-${index}`}
              className="absolute inset-0"
              initial={{ opacity: index === 0 ? 1 : 0 }}
              animate={{ opacity: activeIndex === index ? 1 : 0 }}
              transition={{ duration: 0.25, ease: "linear" }}
              style={{ willChange: "opacity" }}
            >
              <Image
                src={item.media}
                alt={item.title}
                fill
                sizes="(max-width: 1024px) 50vw, 620px"
                className="object-cover"
                priority={index === 0}
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(6,6,7,0.15),rgba(6,6,7,0.55))]" />
            </motion.div>
          ))}
        </div>

        <div className="py-[35vh]">
          <div className="space-y-[30vh]">
            {items.map((item, index) => (
              <ScrollItem
                key={`${item.title}-${index}`}
                item={item}
                index={index}
                setActive={setActiveIndex}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default Scroll01;
