"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";

/**
 * Scroll-driven perspective card: the panel starts tilted back and rotates
 * upright as the section passes through the viewport, while the title drifts up.
 *
 * Adapted from the original in two ways:
 *  - typed (the project runs strict TS + no-explicit-any)
 *  - honours prefers-reduced-motion by holding the resting values
 */

export const ContainerScroll = ({
  titleComponent,
  children,
  className = "",
  cardClassName = "",
  innerClassName = "",
}: {
  titleComponent: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  cardClassName?: string;
  innerClassName?: string;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  /**
   * Explicit offset. The default (["start start", "end end"]) only behaves when
   * the target is much taller than the viewport — otherwise the range collapses
   * and the card finishes rotating after it has already scrolled out of frame.
   * Mapping "enters the viewport" → "sits centred" keeps the panel upright
   * exactly while it is well inside the fold.
   */
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "center center"],
  });
  const [isMobile, setIsMobile] = useState(false);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  const scaleDimensions = (): [number, number] => (isMobile ? [0.7, 0.9] : [1.05, 1]);

  const rotate = useTransform(scrollYProgress, [0, 1], reduced ? [0, 0] : [20, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], reduced ? [1, 1] : scaleDimensions());
  const translate = useTransform(scrollYProgress, [0, 1], reduced ? [0, 0] : [0, -100]);

  return (
    <div
      ref={containerRef}
      className={`relative flex h-[58rem] items-center justify-center p-2 md:h-[54rem] md:p-20 ${className}`}
    >
      <div className="relative w-full py-6 md:py-16" style={{ perspective: "1000px" }}>
        <Header translate={translate} titleComponent={titleComponent} />
        <Card rotate={rotate} translate={translate} scale={scale} className={cardClassName} innerClassName={innerClassName}>
          {children}
        </Card>
      </div>
    </div>
  );
};

export const Header = ({
  translate,
  titleComponent,
}: {
  translate: MotionValue<number>;
  titleComponent: React.ReactNode;
}) => (
  <motion.div style={{ translateY: translate }} className="mx-auto max-w-5xl text-center">
    {titleComponent}
  </motion.div>
);

export const Card = ({
  rotate,
  scale,
  children,
  className = "",
  innerClassName = "",
}: {
  rotate: MotionValue<number>;
  scale: MotionValue<number>;
  translate: MotionValue<number>;
  children: React.ReactNode;
  className?: string;
  innerClassName?: string;
}) => (
  <motion.div
    style={{
      rotateX: rotate,
      scale,
      boxShadow:
        "0 0 #0000004d, 0 9px 20px #0000004a, 0 37px 37px #00000042, 0 84px 50px #00000026, 0 149px 60px #0000000a, 0 233px 65px #00000003",
    }}
    className={`mx-auto -mt-10 h-[44rem] w-full max-w-5xl rounded-[30px] border-4 border-[#2a2a2e] bg-[#171719] p-2 shadow-2xl md:h-[38rem] md:p-6 ${className}`}
  >
    <div className={`h-full w-full overflow-hidden rounded-2xl bg-[#0a0a0b] md:rounded-2xl md:p-4 ${innerClassName}`}>
      {children}
    </div>
  </motion.div>
);
