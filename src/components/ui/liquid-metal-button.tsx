"use client";

import Link from "next/link";
import {
  liquidMetalFragmentShader,
  ShaderMount,
} from "@paper-design/shaders";
import type React from "react";
import {
  type MouseEvent,
  type ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

type ButtonSize = "sm" | "md" | "lg";

interface LiquidMetalButtonProps {
  children?: ReactNode;
  label?: string;
  href?: string;
  external?: boolean;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  size?: ButtonSize;
  className?: string;
  /**
   * Render a non-interactive <span> that still carries the full liquid-metal
   * treatment. Use when the button sits inside an element that is already a
   * link — nesting an <a> inside an <a> is invalid and breaks hydration.
   * The wrapping link supplies the click target and the hover state.
   */
  presentational?: boolean;
  onClick?: (event: MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  "aria-label"?: string;
  "aria-expanded"?: boolean;
  "aria-controls"?: string;
}

const sizes: Record<ButtonSize, string> = {
  sm: "min-h-11 px-5 text-[13px]",
  md: "min-h-[48px] px-6 text-[14px]",
  lg: "min-h-[54px] px-8 text-[15px]",
};

export function LiquidMetalButton({
  children,
  label = "Get Started",
  href,
  external,
  type = "button",
  disabled = false,
  size = "md",
  className = "",
  presentational = false,
  onClick,
  onMouseEnter,
  onMouseLeave,
  ...ariaProps
}: LiquidMetalButtonProps) {
  const shaderRef = useRef<HTMLDivElement>(null);
  const shaderMount = useRef<ShaderMount | null>(null);
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const rippleId = useRef(0);
  const hovered = useRef(false);
  const [isPressed, setIsPressed] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [ripples, setRipples] = useState<Array<{ x: number; y: number; id: number }>>([]);

  /**
   * The shader is mounted ONLY while the button is hovered or focused.
   *
   * Each ShaderMount is a live WebGL context driving a fragment shader every
   * frame. Keeping one alive per button — even lazily, even offscreen —
   * measured at 17fps on the homepage versus 60fps with them off. At rest the
   * button therefore wears a static metal gradient (see `restingMetal` below),
   * which is visually near-identical to a paused shader frame, and the liquid
   * animation spins up on the one button you are actually interacting with.
   */
  useEffect(() => {
    const element = shaderRef.current;
    if (!element || !isVisible) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    try {
      shaderMount.current = new ShaderMount(
        element,
        liquidMetalFragmentShader,
        {
          u_repetition: 4,
          u_softness: 0.52,
          u_shiftRed: 0.22,
          u_shiftBlue: 0.2,
          u_distortion: 0,
          u_contour: 0,
          u_angle: 45,
          u_scale: 8,
          u_shape: 1,
          u_offsetX: 0.1,
          u_offsetY: -0.1,
        },
        { alpha: true, antialias: true },
        0.45,
        undefined,
        1,
        240_000
      );
      element.dataset.shaderReady = "true";
    } catch {
      element.dataset.shaderReady = "false";
    }

    return () => {
      shaderMount.current?.dispose();
      shaderMount.current = null;
      delete element.dataset.shaderReady;
    };
  }, [isVisible]);

  useEffect(
    () => () => {
      if (resetTimer.current) clearTimeout(resetTimer.current);
    },
    []
  );

  const setSpeed = useCallback((speed: number) => {
    shaderMount.current?.setSpeed(speed);
  }, []);

  /** keep the shader alive a moment after leaving so quick re-entry is seamless */
  const unmountTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const wake = useCallback(() => {
    if (unmountTimer.current) {
      clearTimeout(unmountTimer.current);
      unmountTimer.current = null;
    }
    setIsVisible(true);
  }, []);

  const sleep = useCallback(() => {
    if (unmountTimer.current) clearTimeout(unmountTimer.current);
    unmountTimer.current = setTimeout(() => {
      if (!hovered.current) setIsVisible(false);
    }, 900);
  }, []);

  useEffect(
    () => () => {
      if (unmountTimer.current) clearTimeout(unmountTimer.current);
    },
    []
  );

  const handleEnter = () => {
    hovered.current = true;
    wake();
    setSpeed(1.15);
    onMouseEnter?.();
  };

  const handleLeave = () => {
    hovered.current = false;
    setIsPressed(false);
    setSpeed(0.45);
    sleep();
    onMouseLeave?.();
  };

  const handleClick = (event: MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
    if (disabled) {
      event.preventDefault();
      return;
    }

    const rect = event.currentTarget.getBoundingClientRect();
    const ripple = {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
      id: rippleId.current++,
    };
    setRipples((current) => [...current, ripple]);
    window.setTimeout(
      () => setRipples((current) => current.filter((item) => item.id !== ripple.id)),
      650
    );

    setSpeed(2.2);
    if (resetTimer.current) clearTimeout(resetTimer.current);
    resetTimer.current = setTimeout(() => setSpeed(hovered.current ? 1 : 0.45), 320);
    onClick?.(event);
  };

  const content = children ?? label;
  const sharedProps = {
    className: `liquid-metal-button group relative isolate inline-flex w-fit items-center justify-center overflow-hidden rounded-full font-medium tracking-[-0.01em] text-ivory outline-none transition-[transform,opacity] duration-300 [transition-timing-function:var(--ease-out-expo)] hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-black active:translate-y-px active:scale-[0.985] ${sizes[size]} ${disabled ? "cursor-not-allowed opacity-55" : "cursor-pointer"} ${className}`,
    onMouseEnter: handleEnter,
    onMouseLeave: handleLeave,
    onMouseDown: () => !disabled && setIsPressed(true),
    onMouseUp: () => setIsPressed(false),
    onClick: handleClick,
    ...ariaProps,
  };

  const layers = (
    <>
      <span
        className={`pointer-events-none absolute inset-0 z-0 transition-transform duration-150 ${isPressed ? "scale-[0.985]" : "scale-100"}`}
        aria-hidden="true"
      >
        {/* static brushed-metal rim, always painted — this is what the button
            wears at rest, and what sits behind the shader while it fades in */}
        <span className="absolute inset-0 rounded-full bg-[conic-gradient(from_210deg_at_50%_50%,#6d6d70_0deg,#d8d5cd_58deg,#8a8a8d_128deg,#3f3f42_196deg,#c3bfb4_268deg,#75757a_320deg,#6d6d70_360deg)] opacity-90" />
        <span
          ref={shaderRef}
          className="liquid-metal-shader absolute inset-0 rounded-full opacity-0 transition-opacity duration-500 data-[shader-ready=true]:opacity-100"
        />
      </span>
      <span
        className={`pointer-events-none absolute inset-[2px] z-10 rounded-full border border-white/[0.08] bg-[linear-gradient(180deg,#252525_0%,#080808_56%,#000_100%)] shadow-[inset_0_1px_1px_rgba(255,255,255,.12),inset_0_-1px_2px_rgba(0,0,0,.75)] transition-transform duration-150 ${isPressed ? "translate-y-px scale-[0.99]" : ""}`}
        aria-hidden="true"
      />
      <span className="relative z-20 flex items-center justify-center gap-2.5 whitespace-nowrap text-shadow-sm">
        {content}
      </span>
      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          className="liquid-metal-ripple pointer-events-none absolute z-30 h-5 w-5 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,.58),rgba(255,255,255,0)_70%)]"
          style={{ left: ripple.x, top: ripple.y }}
          aria-hidden="true"
        />
      ))}
    </>
  );

  // Visual-only variant: the surrounding link owns the interaction.
  if (presentational) {
    return (
      <span
        className={`liquid-metal-button relative isolate inline-flex w-fit items-center justify-center overflow-hidden rounded-full font-medium tracking-[-0.01em] text-ivory transition-transform duration-300 [transition-timing-function:var(--ease-out-expo)] group-hover:-translate-y-0.5 ${sizes[size]} ${className}`}
      >
        {layers}
      </span>
    );
  }

  if (href) {
    if (external) {
      return (
        <a
          href={href}
          target={href.startsWith("mailto:") ? undefined : "_blank"}
          rel={href.startsWith("mailto:") ? undefined : "noreferrer"}
          aria-disabled={disabled || undefined}
          {...sharedProps}
        >
          {layers}
        </a>
      );
    }

    return (
      <Link href={href} aria-disabled={disabled || undefined} {...sharedProps}>
        {layers}
      </Link>
    );
  }

  return (
    <button type={type} disabled={disabled} {...sharedProps}>
      {layers}
    </button>
  );
}
