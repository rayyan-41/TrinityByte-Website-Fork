type MarkProps = { className?: string; style?: React.CSSProperties };

/**
 * TrinityByte triple-T monogram — flat vector recreation of the
 * brushed-metal mark from the Company Profile (public/brand/t-mark-metallic.jpg).
 */
export function TMark({ className = "h-6 w-6", style }: MarkProps) {
  return (
    <svg viewBox="0 0 96 96" className={className} style={style} fill="currentColor" aria-hidden="true">
      <rect x="4" y="16" width="36" height="9" />
      <rect x="56" y="16" width="36" height="9" />
      <rect x="4" y="31" width="36" height="9" />
      <rect x="56" y="31" width="36" height="9" />
      <rect x="43" y="16" width="4.6" height="66" />
      <rect x="48.4" y="16" width="4.6" height="66" />
    </svg>
  );
}

type WordmarkProps = {
  className?: string;
  markClassName?: string;
  tone?: "light" | "dark";
};

export function Wordmark({ className = "", markClassName = "h-[22px] w-[22px]", tone = "light" }: WordmarkProps) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <TMark className={`${markClassName} text-gold`} />
      <span
        className={`font-display text-[19px] font-semibold tracking-[-0.02em] leading-none ${
          tone === "light" ? "text-ivory" : "text-ink"
        }`}
      >
        TRINITY<span className="text-gold">BYTE</span>
      </span>
    </span>
  );
}
