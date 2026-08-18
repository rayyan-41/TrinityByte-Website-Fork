/**
 * Restrained systems overlay for the hero pull-apart scene.
 * The linework gives the stack technical depth without competing with the
 * product surface or the narrative below it.
 */
export function HeroTechOverlay({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 1200 760"
      fill="none"
      aria-hidden="true"
      className={className}
      preserveAspectRatio="xMidYMid meet"
    >
      <g
        stroke="rgba(242,239,233,0.62)"
        strokeWidth="1.15"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      >
        <path data-tech-path d="M90 264 H300 L350 314 H548" strokeDasharray="3 8" />
        <path data-tech-path d="M74 458 H278 L328 408 H502" strokeDasharray="3 8" />
        <path data-tech-path d="M516 210 H760 L816 266 H1100" />
        <path data-tech-path d="M606 546 H790 L846 490 H1118" />
        <path
          data-tech-path
          d="M342 382 C432 292 520 316 586 384 C652 452 748 446 842 354"
          stroke="rgba(200,171,114,0.68)"
        />
        <path data-tech-path d="M600 146 V226 M600 532 V618" strokeDasharray="2 7" />
      </g>

      <g fill="rgba(242,239,233,0.7)">
        <polygon data-tech-marker points="548,309 558,314 548,319" />
        <polygon data-tech-marker points="502,403 512,408 502,413" />
        <polygon data-tech-marker points="1100,261 1110,266 1100,271" />
        <polygon data-tech-marker points="1118,485 1128,490 1118,495" />
      </g>

      <g>
        {[
          [350, 314],
          [328, 408],
          [816, 266],
          [846, 490],
        ].map(([x, y], index) => (
          <circle
            key={index}
            data-tech-node
            cx={x}
            cy={y}
            r="3.4"
            fill="#09090b"
            stroke="rgba(242,239,233,0.72)"
            strokeWidth="1.15"
          />
        ))}
        <circle data-tech-node cx="586" cy="384" r="4" fill="rgba(200,171,114,0.92)" />
      </g>

      <g stroke="rgba(242,239,233,0.38)" strokeWidth="1.15" strokeLinecap="round">
        <path data-tech-marker d="M254 154 h20 M254 154 v20" />
        <path data-tech-marker d="M946 154 h-20 M946 154 v20" />
        <path data-tech-marker d="M254 606 h20 M254 606 v-20" />
        <path data-tech-marker d="M946 606 h-20 M946 606 v-20" />
      </g>
    </svg>
  );
}
