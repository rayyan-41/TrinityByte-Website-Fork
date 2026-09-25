import { industries } from "@/data/services";

/** Industries we serve — pure CSS marquee, shared by the home overview and the tech section. */
export function IndustriesMarquee({ className = "" }: { className?: string }) {
  return (
    <div className={className}>
      <p className="label-mono label-lead container-site text-muted-dark">
        <span className="text-gold">©</span> Industries we serve
      </p>
      <div className="relative mt-7 overflow-hidden py-2 [mask-image:linear-gradient(90deg,transparent,black_8%,black_92%,transparent)]">
        <div className="marquee-track items-center gap-0" style={{ "--marquee-dur": "56s" } as React.CSSProperties}>
          {[0, 1].map((dup) => (
            <div key={dup} className="flex shrink-0 items-center" aria-hidden={dup === 1}>
              {industries.map((ind) => (
                <span key={`${dup}-${ind}`} className="flex items-center">
                  <span className="whitespace-nowrap px-6 font-display text-[clamp(34px,4.2vw,60px)] font-semibold tracking-[-0.03em] text-ivory/25 transition-colors duration-300 hover:text-ivory">
                    {ind}
                  </span>
                  <span aria-hidden="true" className="h-2 w-2 shrink-0 rounded-full bg-gold/70" />
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
