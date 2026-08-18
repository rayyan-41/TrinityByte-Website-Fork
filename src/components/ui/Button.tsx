import { type ReactNode } from "react";
import { LiquidMetalButton } from "@/components/ui/liquid-metal-button";

type Props = {
  href: string;
  children: ReactNode;
  variant?: "solid-light" | "solid-dark" | "gold" | "outline-light" | "outline-dark";
  className?: string;
  size?: "md" | "lg";
};

/** Backwards-compatible link primitive using the site-wide liquid-metal style. */
export function Button({ href, children, className = "", size = "md" }: Props) {
  return (
    <LiquidMetalButton href={href} size={size} className={className}>
      {children}
    </LiquidMetalButton>
  );
}
