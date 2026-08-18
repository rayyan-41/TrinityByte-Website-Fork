import { type ReactNode } from "react";
import { LiquidMetalButton } from "@/components/ui/liquid-metal-button";

type Props = {
  href: string;
  children: ReactNode;
  tone?: "light" | "dark" | "gold";
  size?: "sm" | "md" | "lg";
  className?: string;
  external?: boolean;
};

/** Site-wide CTA link using the shared liquid-metal interaction. */
export function PillButton({ href, children, size = "md", className = "", external }: Props) {
  return (
    <LiquidMetalButton href={href} external={external} size={size} className={className}>
      {children}
      <svg
        viewBox="0 0 14 14"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-3.5 w-3.5 transition-transform duration-500 [transition-timing-function:var(--ease-out-expo)] group-hover:translate-x-0.5"
        aria-hidden="true"
      >
        <path d="M2.5 7h9M8 3.5 11.5 7 8 10.5" />
      </svg>
    </LiquidMetalButton>
  );
}
