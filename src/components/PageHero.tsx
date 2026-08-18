import { ReactNode } from "react";
import { SplitReveal } from "@/components/anim/SplitReveal";
import { Reveal } from "@/components/anim/Reveal";
import { TMark } from "@/components/ui/Logo";

type Props = {
  eyebrow: string;
  kicker?: string;
  title: string;
  lead?: string;
  children?: ReactNode;
};

/** Shared editorial page header for inner pages. */
export function PageHero({ eyebrow, kicker, title, lead, children }: Props) {
  return (
    <section className="relative overflow-hidden bg-bg pb-[clamp(48px,6vw,90px)] pt-[clamp(140px,15vw,210px)]">
      <TMark className="pointer-events-none absolute -right-[3%] top-1/2 h-[70%] w-auto -translate-y-1/2 text-white opacity-[0.028]" />
      <div className="pointer-events-none absolute right-[-8%] top-[-15%] h-[560px] w-[560px] rounded-full bg-[radial-gradient(closest-side,rgba(200,171,114,0.08),transparent)]" />
      <div className="container-site relative">
        <div className="flex items-center justify-between border-b border-line-dark pb-5">
          <p className="label-mono text-muted-dark">
            <span className="text-gold">©</span> {eyebrow}
          </p>
          {kicker ? <p className="label-mono text-muted-dark">{kicker}</p> : null}
        </div>

        <SplitReveal
          as="h1"
          immediate
          className="mt-[clamp(32px,4vw,60px)] max-w-[1100px] font-display text-[clamp(46px,7.6vw,110px)] font-semibold leading-[0.99] tracking-[-0.045em] text-ivory"
          stagger={0.09}
        >
          {title}
        </SplitReveal>

        {lead ? (
          <Reveal delay={0.25} y={26}>
            <p className="mt-8 max-w-[620px] text-[clamp(15px,1.3vw,18px)] leading-[1.6] text-muted-dark">
              {lead}
            </p>
          </Reveal>
        ) : null}

        {children ? (
          <Reveal delay={0.35} y={22}>
            <div className="mt-10">{children}</div>
          </Reveal>
        ) : null}
      </div>
    </section>
  );
}
