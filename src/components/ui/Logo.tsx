type MarkProps = { className?: string; style?: React.CSSProperties };

/** TrinityByte triple-T monogram (public/brand/TB_logo_no_bg.png). */
export function TMark({ className = "h-6 w-6", style }: MarkProps) {
  return (
    // A background-image span, not <img>: call sites size this with the same
    // `w-auto` / `h-*` classes the old inline <svg> used, and those collapse to
    // zero width on a replaced element. `aspect-` only applies where width is auto.
    <span
      aria-hidden="true"
      className={`inline-block shrink-0 aspect-[506/493] bg-contain bg-center bg-no-repeat ${className}`}
      // ponytail: raster mark, so `text-*`/`color` at call sites no longer tints
      // it — swap in an SVG export of the artwork if per-instance color returns.
      style={{ backgroundImage: "url(/brand/TB_logo_no_bg.png)", ...style }}
    />
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
      <TMark className={markClassName} />
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
