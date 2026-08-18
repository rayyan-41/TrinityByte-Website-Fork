"use client";

const ITEMS_A = [
  "Custom Software",
  "Web Development",
  "Mobile Apps",
  "UI/UX Design",
  "AI & Automation",
];
const ITEMS_B = [
  "Hybrid Software House",
  "Global Delivery",
  "Startup Agility",
  "Long-Term Partnerships",
  "Est. 2026",
];

function Ribbon({
  items,
  tone,
  rotate,
  reverse = false,
}: {
  items: string[];
  tone: "ivory" | "dark";
  rotate: string;
  reverse?: boolean;
}) {
  const surface =
    tone === "ivory"
      ? "bg-ivory text-ink"
      : "bg-[#101011] text-ivory border-y border-white/[0.06]";
  return (
    <div className={`absolute left-[-5%] right-[-5%] ${rotate}`}>
      <div className={`overflow-hidden py-4 ${surface}`}>
        <div
          className={`marquee-track items-center ${reverse ? "reverse" : ""}`}
          style={{ "--marquee-dur": "34s" } as React.CSSProperties}
        >
          {[0, 1].map((dup) => (
            <div key={dup} className="flex shrink-0 items-center" aria-hidden={dup === 1}>
              {items.map((item) => (
                <span key={`${dup}-${item}`} className="flex items-center">
                  <span className="whitespace-nowrap px-8 font-display text-[clamp(20px,2.2vw,32px)] font-medium tracking-[-0.02em]">
                    {item}
                  </span>
                  <span className="text-[13px] text-gold">◆</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/** Crossing diagonal marquee ribbons. */
export function Ribbons() {
  return (
    <section aria-hidden="true" className="relative h-[300px] overflow-hidden bg-bg sm:h-[340px]">
      <div className="absolute inset-0 flex items-center">
        <div className="relative h-full w-full">
          <Ribbon items={ITEMS_B} tone="dark" rotate="top-[42%] rotate-[4deg]" reverse />
          <Ribbon items={ITEMS_A} tone="ivory" rotate="top-[38%] -rotate-[3.4deg]" />
        </div>
      </div>
    </section>
  );
}
