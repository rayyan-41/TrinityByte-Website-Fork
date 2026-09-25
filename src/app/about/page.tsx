import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PageHero } from "@/components/PageHero";
import { CTA } from "@/sections/CTA";
import { Reveal } from "@/components/anim/Reveal";
import { SplitReveal } from "@/components/anim/SplitReveal";
import { WordScrub } from "@/components/anim/WordScrub";
import { PillButton } from "@/components/ui/PillButton";
import { TMark } from "@/components/ui/Logo";
import { site, clientTypes } from "@/data/site";
import { vision, mission, values, leadership, roadmap, pillars } from "@/data/company";

export const metadata: Metadata = {
  title: "About",
  description:
    "TrinityByte is a modern hybrid software house building scalable, secure, production-ready software for businesses across Pakistan and international markets.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <>
      <Header />
      <main>
        <PageHero
          eyebrow="About us"
          title="Every great idea deserves exceptional execution."
          lead="TrinityByte is a modern hybrid software house dedicated to delivering innovative, scalable, and high-performance software solutions for businesses across Pakistan and international markets."
        >
          <PillButton href="/contact" tone="light" size="lg">
            Start a Project
          </PillButton>
        </PageHero>

        {/* who we are */}
        <section className="container-site bg-bg pb-[var(--section-gap)]" aria-label="Who we are">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
            <Reveal className="lg:col-span-5">
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[var(--card-radius)]">
                <Image
                  src="/brand/TB_logo_no_bg.png"
                  alt="The TrinityByte monogram rendered in brushed champagne metal"
                  fill
                  sizes="(max-width: 1024px) 90vw, 45vw"
                  className="object-contain p-12"
                />
              </div>
            </Reveal>
            <div className="lg:col-span-6 lg:col-start-7">
              <Reveal delay={0.08}>
                <p className="label-mono text-gold">Who we are</p>
                <p className="mt-6 text-[clamp(19px,1.9vw,26px)] font-medium leading-[1.45] tracking-[-0.02em] text-ivory">
                  We specialize in transforming ideas into digital products that solve real-world
                  problems — whether you&rsquo;re a startup, an established business, or an
                  entrepreneur with a bold vision.
                </p>
                <p className="mt-6 text-[15.5px] leading-[1.65] text-muted-dark">
                  Unlike traditional software agencies, we focus on building lasting relationships
                  rather than simply delivering projects. Your success is our success.
                </p>
              </Reveal>
              <div className="mt-12 grid grid-cols-1 gap-x-10 gap-y-8 sm:grid-cols-2">
                {pillars.map((p, i) => (
                  <Reveal key={p.title} delay={0.05 * i}>
                    <div className="border-t border-line-dark pt-5">
                      <h3 className="font-display text-[18px] font-semibold text-ivory">{p.title}</h3>
                      <p className="mt-2 text-[14.5px] leading-[1.55] text-muted-dark">{p.copy}</p>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* vision & mission */}
        <section className="bg-ivory py-[var(--section-gap)] text-ink" aria-label="Vision and mission">
          <div className="container-site">
            <div className="flex items-center border-t border-line-light pt-5">
              <p className="label-mono label-lead text-muted-light">
                <span className="text-gold-deep">©</span> Our foundation
              </p>
            </div>

            <div className="mt-[clamp(40px,5vw,72px)] grid grid-cols-1 gap-14 lg:grid-cols-2 lg:gap-20">
              <div>
                <p className="font-mono-brand text-[11.5px] uppercase tracking-[0.18em] text-gold-deep">
                  Our Vision
                </p>
                <SplitReveal
                  as="p"
                  className="mt-6 font-display text-[clamp(24px,2.7vw,38px)] font-medium leading-[1.25] tracking-[-0.025em] text-ink"
                  stagger={0.06}
                >
                  {vision}
                </SplitReveal>
              </div>
              <div>
                <p className="font-mono-brand text-[11.5px] uppercase tracking-[0.18em] text-gold-deep">
                  Our Mission
                </p>
                <SplitReveal
                  as="p"
                  className="mt-6 font-display text-[clamp(24px,2.7vw,38px)] font-medium leading-[1.25] tracking-[-0.025em] text-ink"
                  stagger={0.06}
                >
                  {mission}
                </SplitReveal>
              </div>
            </div>

            {/* values */}
            <div className="mt-[clamp(64px,8vw,120px)]">
              <p className="label-mono text-muted-light">
                <span className="text-gold-deep">©</span> What drives us
              </p>
              <h2 className="mt-6 font-display text-[clamp(40px,5.4vw,78px)] font-semibold leading-[1.02] tracking-[-0.04em] text-ink">
                Our core values.
              </h2>
              <ol className="mt-12">
                {values.map((v, i) => (
                  <li key={v.title}>
                    <Reveal delay={0.03 * i} y={26}>
                      <div className="group grid grid-cols-[auto_1fr] items-baseline gap-6 border-b border-line-light py-6 transition-colors duration-300 sm:grid-cols-[64px_minmax(0,300px)_1fr]">
                        <span className="font-mono-brand text-[12px] text-gold-deep">
                          0{i + 1}
                        </span>
                        <h3 className="font-display text-[clamp(22px,2.4vw,32px)] font-semibold tracking-[-0.025em] text-ink transition-transform duration-500 [transition-timing-function:var(--ease-out-expo)] group-hover:translate-x-2">
                          {v.title}
                        </h3>
                        <p className="col-span-2 text-[15px] text-muted-light sm:col-span-1">
                          {v.copy}
                        </p>
                      </div>
                    </Reveal>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        {/* statement */}
        <section className="container-site bg-bg py-[var(--section-gap)]" aria-label="Our approach">
          <WordScrub
            text="We believe every great idea deserves exceptional execution — and that the best software comes from teams who stay long after launch day."
            className="mx-auto max-w-[1060px] text-center font-display text-[clamp(28px,4vw,56px)] font-semibold leading-[1.16] tracking-[-0.03em] text-ivory"
          />
        </section>

        {/* leadership */}
        {/* scroll-mt clears the fixed brand badge when linked to via /about#leadership */}
        <section
          id="leadership"
          className="container-site scroll-mt-[clamp(72px,9vw,110px)] bg-bg pb-[var(--section-gap)]"
          aria-label="Leadership"
        >
          <div className="flex items-center border-t border-line-dark pt-5">
            <p className="label-mono label-lead text-muted-dark">
              <span className="text-gold">©</span> The team
            </p>
          </div>
          <h2 className="mt-[clamp(32px,4vw,60px)] font-display text-[clamp(42px,6vw,86px)] font-semibold leading-[1.02] tracking-[-0.04em] text-ivory">
            Our leadership.
          </h2>

          <div className="mt-[clamp(40px,5vw,72px)] grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {leadership.map((l, i) => (
              <Reveal key={l.name} delay={0.05 * i}>
                <article className="grain group relative flex h-full flex-col overflow-hidden rounded-[var(--card-radius)] border border-line-dark bg-gradient-to-br from-[#131210] to-[#0a0a09] p-7 transition-colors duration-500 hover:border-gold/35">
                  <div className="flex items-start justify-between">
                    <span className="flex h-16 w-16 items-center justify-center rounded-2xl border border-gold/25 bg-gradient-to-br from-[#282318] to-[#14120e] font-display text-[20px] font-semibold tracking-[-0.02em] text-gold">
                      {l.initials}
                    </span>
                    <TMark className="h-5 w-5 text-gold/30 transition-colors duration-500 group-hover:text-gold/70" />
                  </div>
                  <p className="mt-7 label-mono text-gold">{l.role}</p>
                  <h3 className="mt-2 font-display text-[clamp(21px,2vw,26px)] font-semibold tracking-[-0.02em] text-ivory">
                    {l.name}
                  </h3>
                  <p className="mt-5 border-t border-line-dark pt-5 text-[14.5px] leading-[1.6] text-muted-dark">
                    &ldquo;{l.quote}&rdquo;
                  </p>
                </article>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.1}>
            <p className="mt-[clamp(32px,4vw,56px)] max-w-[560px] text-[15.5px] leading-[1.65] text-muted-dark">
              This team is still being built.{" "}
              <Link href="/careers" className="link-underline font-medium text-ivory">
                See where you&rsquo;d fit
              </Link>
              .
            </p>
          </Reveal>
        </section>

        {/* who we serve */}
        <section className="container-site bg-bg pb-[var(--section-gap)]" aria-label="Who we serve">
          <div className="flex items-center border-t border-line-dark pt-5">
            <p className="label-mono label-lead text-muted-dark">
              <span className="text-gold">©</span> Client focus
            </p>
          </div>
          <h2 className="mt-[clamp(32px,4vw,60px)] font-display text-[clamp(42px,6vw,86px)] font-semibold leading-[1.02] tracking-[-0.04em] text-ivory">
            Who we serve.
          </h2>
          <div className="mt-[clamp(40px,5vw,72px)] grid grid-cols-1 gap-y-0 md:grid-cols-3 md:gap-8">
            {clientTypes.map((c, i) => (
              <Reveal key={c.code} delay={0.06 * i}>
                <div className="border-t border-line-dark py-8 md:border-t-0 md:pt-0">
                  <p className="font-display text-[clamp(48px,5.5vw,76px)] font-semibold leading-none tracking-[-0.04em] text-gold">
                    {c.code}
                  </p>
                  <h3 className="mt-5 font-display text-[19px] font-semibold text-ivory">{c.name}</h3>
                  <p className="mt-3 max-w-[380px] text-[14.5px] leading-[1.6] text-muted-dark">
                    {c.copy}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal delay={0.1}>
            <p className="mt-10 label-mono text-muted-dark">
              Serving local and international clients — {site.workplace}
            </p>
          </Reveal>
        </section>

        {/* roadmap */}
        <section className="bg-ivory py-[var(--section-gap)] text-ink" aria-label="Roadmap">
          <div className="container-site">
            <div className="flex items-center border-t border-line-light pt-5">
              <p className="label-mono label-lead text-muted-light">
                <span className="text-gold-deep">©</span> Our journey
              </p>
            </div>
            <h2 className="mt-[clamp(32px,4vw,60px)] max-w-[760px] font-display text-[clamp(40px,5.4vw,78px)] font-semibold leading-[1.02] tracking-[-0.04em] text-ink">
              Roadmap &amp; growth vision.
            </h2>
            <p className="mt-6 max-w-[520px] text-[15px] leading-[1.6] text-muted-light">
              2026 is where we are today. Everything beyond it is a plan we&rsquo;re building
              toward — stated openly, not dressed up as history.
            </p>

            <div className="mt-[clamp(44px,5.5vw,80px)] grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
              {roadmap.map((r, i) => (
                <Reveal key={r.year} delay={0.06 * i}>
                  <article
                    className={`flex h-full flex-col rounded-[22px] border p-7 ${
                      r.status === "now"
                        ? "border-gold/50 bg-gradient-to-b from-[#15130e] to-[#0a0908] text-ivory"
                        : "border-line-light bg-white"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <p
                        className={`font-display text-[clamp(30px,3vw,42px)] font-semibold leading-none tracking-[-0.03em] ${
                          r.status === "now" ? "text-gold" : "text-ink"
                        }`}
                      >
                        {r.year}
                      </p>
                      <span
                        className={`rounded-full border px-2.5 py-1 font-mono-brand text-[9.5px] uppercase tracking-[0.14em] ${
                          r.status === "now"
                            ? "border-gold/50 text-gold"
                            : "border-line-light text-muted-light"
                        }`}
                      >
                        {r.status === "now" ? "Current" : "Planned"}
                      </span>
                    </div>
                    <h3
                      className={`mt-5 font-display text-[19px] font-semibold ${
                        r.status === "now" ? "text-ivory" : "text-ink"
                      }`}
                    >
                      {r.phase}
                    </h3>
                    <ul
                      className={`mt-5 space-y-2.5 border-t pt-5 text-[14px] leading-[1.5] ${
                        r.status === "now"
                          ? "border-white/10 text-ivory/75"
                          : "border-line-light text-muted-light"
                      }`}
                    >
                      {r.points.map((p) => (
                        <li key={p} className="flex gap-2.5">
                          <span
                            className={`mt-[7px] h-1 w-1 shrink-0 rounded-full ${
                              r.status === "now" ? "bg-gold" : "bg-gold-deep"
                            }`}
                          />
                          {p}
                        </li>
                      ))}
                    </ul>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <CTA />
      </main>
      <Footer />
    </>
  );
}
