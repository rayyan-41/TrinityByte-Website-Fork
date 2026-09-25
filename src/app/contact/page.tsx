import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ContactForm } from "@/components/ContactForm";
import { SplitReveal } from "@/components/anim/SplitReveal";
import { Reveal } from "@/components/anim/Reveal";
import { TMark } from "@/components/ui/Logo";
import { site } from "@/data/site";
import { processSteps } from "@/data/services";

export const metadata: Metadata = {
  title: "Start a Project",
  description:
    "Tell TrinityByte about your project — custom software, web, mobile, UI/UX, or AI automation. Every engagement is scoped to your requirements.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <>
      <Header />
      <main>
        <section className="relative overflow-hidden bg-bg pb-[var(--section-gap)] pt-[clamp(140px,15vw,200px)]">
          <TMark className="pointer-events-none absolute -right-[3%] top-[14%] h-[62%] w-auto text-white opacity-[0.028]" />
          <div className="pointer-events-none absolute left-[-10%] top-[30%] h-[520px] w-[520px] rounded-full bg-[radial-gradient(closest-side,rgba(200,171,114,0.1),transparent)]" />

          <div className="container-site relative">
            <div className="flex items-center border-b border-line-dark pb-5">
              <p className="label-mono label-lead text-muted-dark">
                <span className="text-gold">©</span> Start a project
              </p>
            </div>

            <SplitReveal
              as="h1"
              immediate
              className="mt-[clamp(32px,4vw,60px)] max-w-[1000px] font-display text-[clamp(46px,7.6vw,108px)] font-semibold leading-[0.99] tracking-[-0.045em] text-ivory"
              stagger={0.09}
            >
              Have an idea? Let&rsquo;s build something extraordinary.
            </SplitReveal>

            <div className="mt-[clamp(48px,6vw,96px)] grid grid-cols-1 gap-14 lg:grid-cols-12 lg:gap-12">
              {/* form */}
              <div className="lg:col-span-7">
                <Reveal delay={0.15}>
                  <ContactForm />
                </Reveal>
              </div>

              {/* aside */}
              <aside className="lg:col-span-4 lg:col-start-9">
                <Reveal delay={0.2}>
                  <div className="border-t border-line-dark pt-5">
                    <p className="label-mono text-muted-dark">Direct contact</p>
                    <a
                      href={`mailto:${site.email}`}
                      className="link-underline mt-3 inline-flex min-h-[36px] items-center font-display text-[clamp(18px,1.9vw,24px)] font-medium tracking-[-0.02em] text-ivory"
                    >
                      {site.email}
                    </a>
                    <a
                      href={site.linkedin}
                      target="_blank"
                      rel="noreferrer"
                      className="link-underline mt-2 inline-flex min-h-[34px] items-center text-[15px] text-muted-dark hover:text-ivory"
                    >
                      {site.linkedinLabel}
                    </a>
                  </div>

                  <div className="mt-10 border-t border-line-dark pt-5">
                    <p className="label-mono text-muted-dark">Workplace</p>
                    <p className="mt-4 text-[15px] text-ivory/85">{site.workplace}</p>
                    <p className="mt-1.5 text-[14px] text-muted-dark">
                      Serving local and international clients.
                    </p>
                  </div>

                  <div className="mt-10 border-t border-line-dark pt-5">
                    <p className="label-mono text-muted-dark">What happens next</p>
                    <ol className="mt-5 space-y-4">
                      {processSteps.slice(0, 3).map((s) => (
                        <li key={s.index} className="flex gap-4">
                          <span className="font-mono-brand text-[12px] text-gold">{s.index}</span>
                          <div>
                            <p className="text-[15px] font-medium text-ivory">{s.title}</p>
                            <p className="mt-1 text-[13.5px] leading-[1.5] text-muted-dark">
                              {s.copy}
                            </p>
                          </div>
                        </li>
                      ))}
                    </ol>
                    <p className="mt-5 text-[13.5px] leading-[1.55] text-muted-dark">
                      Three of seven stages —{" "}
                      <Link href="/services#process" className="link-underline text-ivory">
                        see the full process
                      </Link>
                      , or{" "}
                      <Link href="/work" className="link-underline text-ivory">
                        browse recent builds
                      </Link>
                      .
                    </p>
                  </div>

                  <div className="grain relative mt-10 overflow-hidden rounded-2xl border border-gold/25 bg-gradient-to-br from-[#15130e] to-[#0a0a08] p-6">
                    <TMark className="h-6 w-6 text-gold" />
                    <p className="mt-5 font-display text-[17px] font-medium leading-[1.4] text-ivory">
                      {site.tagline}
                    </p>
                    <p className="mt-3 text-[13.5px] leading-[1.55] text-muted-dark">
                      Every project is scoped to your requirements, complexity, timeline, and team
                      composition.
                    </p>
                  </div>
                </Reveal>
              </aside>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
