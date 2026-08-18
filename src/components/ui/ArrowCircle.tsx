type Props = {
  className?: string;
  tone?: "dark" | "light" | "gold";
};

/** Signature trailing arrow chip used inside pill buttons. */
export function ArrowCircle({ className = "", tone = "dark" }: Props) {
  const tones = {
    dark: "bg-ink text-ivory",
    light: "bg-ivory text-ink",
    gold: "bg-gold text-ink",
  };
  return (
    <span
      className={`inline-flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-[10px] ${tones[tone]} ${className}`}
      aria-hidden="true"
    >
      <span className="relative flex h-3.5 w-3.5 items-center justify-center">
        <svg
          viewBox="0 0 14 14"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-3.5 w-3.5 transition-transform duration-500 [transition-timing-function:var(--ease-out-expo)] group-hover:translate-x-[18px]"
        >
          <path d="M2.5 7h9M8 3.5 11.5 7 8 10.5" />
        </svg>
        <svg
          viewBox="0 0 14 14"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="absolute h-3.5 w-3.5 -translate-x-[18px] transition-transform duration-500 [transition-timing-function:var(--ease-out-expo)] group-hover:translate-x-0"
        >
          <path d="M2.5 7h9M8 3.5 11.5 7 8 10.5" />
        </svg>
      </span>
    </span>
  );
}
