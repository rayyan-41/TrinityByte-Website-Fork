import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PageHero } from "@/components/PageHero";
import { CTA } from "@/sections/CTA";
import { Reveal } from "@/components/anim/Reveal";
import { WordScrub } from "@/components/anim/WordScrub";
import { PillButton } from "@/components/ui/PillButton";
import { TMark } from "@/components/ui/Logo";
import { careersPerks, values, roadmap } from "@/data/company";
import { site } from "@/data/site";
import { technologies } from "@/data/services";

export const metadata: Metadata = {
  title: "Careers",
  description:
    "Join TrinityByte — a growing technology company offering early career growth, hybrid work, modern technologies, and real client projects from day one.",
  alternates: { canonical: "/careers" },
};

/**
 * NOTE: No open positions have been supplied. Rather than fabricate roles,
 * this page invites speculative applications. Add a `positions` array here
 * (title, team, location, type, link) once real openings exist.
 */

export default function CareersPage() {
  return (
    <>
      <Header />
      <main>
        <PageHero
          eyebrow="Join the team"
          kicker="(TBX® — 01)"
          title="Build the company, not just the product."
          lead="At TrinityByte you're not simply accepting a job — you're becoming part of a company building its future from the ground up. The people who help build this from day one should grow with it."
        >
          <PillButton href="/contact" tone="light" size="lg">
            Introduce Yourself
          </PillButton>
        </PageHero>

        {/* quote */}
        <section className="container-site bg-bg pb-[var(--section-gap)]" aria-label="Our belief">
          <WordScrub
            text="Great companies are not built by one person. They are built by a team of people who believe in the mission and grow together to achieve extraordinary things."
            className="mx-auto max-w-[1020px] text-center font-display text-[clamp(27px,3.8vw,54px)] font-semibold leading-[1.16] tracking-[-0.03em] text-ivory"
          />
          <Reveal delay={0.2}>
            <p className="mt-8 text-center label-mono text-gold">— TrinityByte</p>
          </Reveal>
        </section>

        {/* what you get */}
        <section className="bg-ivory py-[var(--section-gap)] text-ink" aria-label="Why join TrinityByte">
          <div className="container-site">
            <div className="flex items-center justify-between border-t border-line-light pt-5">
              <p className="label-mono text-muted-light">
                <span className="text-gold-deep">©</span> Why join us
              </p>
              <p className="label-mono text-muted-light">(TBX® — 02)</p>
            </div>
            <h2 className="mt-[clamp(32px,4vw,60px)] max-w-[760px] font-display text-[clamp(40px,5.4vw,78px)] font-semibold leading-[1.02] tracking-[-0.04em] text-ink">
              What you get here.
            </h2>

            <ol className="mt-[clamp(40px,5vw,72px)] grid grid-cols-1 gap-x-14 md:grid-cols-2">
              {careersPerks.map((perk, i) => (
                <li key={perk}>
                  <Reveal delay={0.03 * i} y={24}>
                    <div className="group flex items-baseline gap-6 border-b border-line-light py-5">
                      <span className="font-mono-brand text-[12px] text-gold-deep">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <p className="font-display text-[clamp(19px,2vw,26px)] font-medium tracking-[-0.02em] text-ink transition-transform duration-500 [transition-timing-function:var(--ease-out-expo)] group-hover:translate-x-2">
                        {perk}
                      </p>
                    </div>
                  </Reveal>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* how we work + stack */}
        <section className="container-site bg-bg py-[var(--section-gap)]" aria-label="How we work">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <Reveal>
                <p className="label-mono text-gold">How we work</p>
                <h2 className="mt-6 font-display text-[clamp(30px,3.6vw,50px)] font-semibold leading-[1.08] tracking-[-0.035em] text-ivory">
                  Hybrid, remote-first, and genuinely collaborative.
                </h2>
                <p className="mt-6 max-w-[440px] text-[15.5px] leading-[1.65] text-muted-dark">
                  We&rsquo;re a hybrid workplace serving clients worldwide. You&rsquo;ll work on
                  real client projects from day one, with direct access to leadership and room to
                  take ownership early.
                </p>
                <div className="mt-9">
                  <PillButton href="/about" tone="light">
                    About TrinityByte
                  </PillButton>
                </div>
              </Reveal>
            </div>

            <div className="lg:col-span-6 lg:col-start-7">
              <Reveal delay={0.08}>
                <p className="label-mono text-muted-dark">The stack you&rsquo;ll work with</p>
                <div className="mt-6 space-y-0">
                  {technologies.map((g) => (
                    <div
                      key={g.group}
                      className="grid grid-cols-1 items-baseline gap-2 border-b border-line-dark py-4 sm:grid-cols-[110px_1fr]"
                    >
                      <p className="label-mono text-gold">{g.group}</p>
                      <p className="text-[15.5px] text-ivory/85">{g.items.join(" · ")}</p>
                    </div>
                  ))}
                </div>
              </Reveal>
              <Reveal delay={0.12}>
                <div className="mt-10 flex flex-wrap gap-2">
                  {values.map((v) => (
                    <span
                      key={v.title}
                      className="rounded-full border border-line-dark px-4 py-2 text-[13px] text-ivory/80 transition-colors duration-300 hover:border-gold/50 hover:text-gold"
                    >
                      {v.title}
                    </span>
                  ))}
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* open roles — honest empty state */}
        <section className="container-site bg-bg pb-[var(--section-gap)]" aria-label="Open positions">
          <div className="flex items-center justify-between border-t border-line-dark pt-5">
            <p className="label-mono text-muted-dark">
              <span className="text-gold">©</span> Open positions
            </p>
            <p className="label-mono text-muted-dark">(TBX® — 03)</p>
          </div>

          <Reveal y={40}>
            <div className="grain relative mt-[clamp(32px,4vw,56px)] overflow-hidden rounded-[var(--card-radius)] border border-gold/25 bg-gradient-to-br from-[#17140f] to-[#0a0a08] p-[clamp(30px,4.5vw,72px)] text-center">
              <div className="absolute -right-[8%] -top-[45%] h-[340px] w-[340px] rounded-full bg-[radial-gradient(closest-side,rgba(200,171,114,0.16),transparent)]" />
              <TMark className="relative mx-auto h-9 w-9 text-gold" />
              <p className="relative mt-8 font-display text-[clamp(26px,3.4vw,46px)] font-semibold leading-[1.15] tracking-[-0.03em] text-ivory">
                We&rsquo;re always interested in meeting talented people.
              </p>
              <p className="relative mx-auto mt-6 max-w-[540px] text-[15px] leading-[1.65] text-muted-dark">
                No formal openings are posted right now. If you&rsquo;re a developer, designer, or
                QA engineer who wants to grow with a company from its earliest days, send us your
                work — we read everything.
              </p>
              <div className="relative mt-10 flex flex-wrap items-center justify-center gap-4">
                <PillButton href="/contact" tone="gold" size="lg">
                  Send Your Portfolio
                </PillButton>
                <PillButton href={`mailto:${site.email}`} tone="dark" size="lg" external>
                  {site.email}
                </PillButton>
              </div>
            </div>
          </Reveal>
        </section>

        {/* growth path */}
        <section className="container-site bg-bg pb-[var(--section-gap)]" aria-label="Where we're heading">
          <div className="flex items-center justify-between border-t border-line-dark pt-5">
            <p className="label-mono text-muted-dark">
              <span className="text-gold">©</span> Where we&rsquo;re heading
            </p>
            <p className="label-mono text-muted-dark">(TBX® — 04)</p>
          </div>
          <div className="mt-[clamp(32px,4vw,56px)] grid grid-cols-1 gap-x-8 gap-y-8 md:grid-cols-4">
            {roadmap.map((r, i) => (
              <Reveal key={r.year} delay={0.05 * i}>
                <div className="border-t border-line-dark pt-5">
                  <div className="flex items-baseline justify-between">
                    <p className="font-display text-[clamp(26px,2.6vw,36px)] font-semibold leading-none tracking-[-0.03em] text-ivory">
                      {r.year}
                    </p>
                    <span className="label-mono text-gold">
                      {r.status === "now" ? "Current" : "Planned"}
                    </span>
                  </div>
                  <p className="mt-4 text-[15px] font-medium text-ivory/85">{r.phase}</p>
                  <p className="mt-2 text-[14px] leading-[1.55] text-muted-dark">
                    {r.points[0]}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        <CTA />
      </main>
      <Footer />
    </>
  );
}
