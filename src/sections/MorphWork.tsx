import ScrollMorphHero from "@/components/ui/scroll-morph-hero";
import { PillButton } from "@/components/ui/PillButton";

export function MorphWork() {
  return (
    <section className="bg-bg pb-[var(--section-gap)]" aria-label="Featured work" id="work">
      <div className="container-site flex items-center border-t border-line-dark pt-5">
        <p className="label-mono label-lead text-muted-dark">
          <span className="text-gold">©</span> Featured projects
        </p>
      </div>

      <div className="container-site grid gap-10 pb-[clamp(52px,7vw,100px)] pt-[clamp(50px,7vw,104px)] md:grid-cols-12 md:items-end">
        <div className="md:col-span-8">
          <h2 className="font-display text-[clamp(64px,10.8vw,156px)] font-semibold leading-[0.84] tracking-[-0.055em] text-ivory">
            Featured
            <br />
            Works<span className="text-gold">©</span>
          </h2>
        </div>

        <div className="md:col-span-4 md:pb-2">
          <p className="max-w-[430px] text-[15px] leading-[1.7] text-ivory/68 sm:text-[16px]">
            Every project moves from fragments to one connected experience. Follow the scroll to
            see representative frames assemble into the systems TrinityByte is built to deliver.
          </p>
          <div className="mt-8">
            <PillButton href="/work" tone="light">
              See All Work
            </PillButton>
          </div>
        </div>
      </div>

      <ScrollMorphHero />
    </section>
  );
}
