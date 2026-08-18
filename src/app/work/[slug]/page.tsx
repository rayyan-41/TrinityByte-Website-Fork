import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CTA } from "@/sections/CTA";
import { Reveal } from "@/components/anim/Reveal";
import { SplitReveal } from "@/components/anim/SplitReveal";
import { TMark } from "@/components/ui/Logo";
import { LiquidMetalButton } from "@/components/ui/liquid-metal-button";
import { projects, getProject } from "@/data/projects";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return { title: "Project not found" };
  return {
    title: project.title,
    description: project.description,
    alternates: { canonical: `/work/${project.slug}` },
  };
}

export default async function ProjectPage({ params }: Params) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const index = projects.findIndex((p) => p.slug === project.slug);
  const next = projects[(index + 1) % projects.length];

  return (
    <>
      <Header />
      <main>
        {/* hero */}
        <section className="relative overflow-hidden bg-bg pb-[clamp(40px,5vw,72px)] pt-[clamp(140px,15vw,200px)]">
          <div
            className="pointer-events-none absolute inset-x-0 top-0 h-[70vh] opacity-40"
            style={{
              background: `radial-gradient(60% 60% at 50% 0%, ${project.art.accent}2e 0%, transparent 70%)`,
            }}
          />
          <div className="container-site relative">
            <div className="flex items-center justify-between border-b border-line-dark pb-5">
              <Link
                href="/work"
                className="link-underline label-mono inline-flex min-h-[34px] items-center text-muted-dark hover:text-ivory"
              >
                ← All work
              </Link>
              <p className="label-mono text-muted-dark">({project.index})</p>
            </div>

            <p className="mt-[clamp(28px,3.5vw,52px)] label-mono text-gold">
              {project.category} · {project.industry} · {project.year}
            </p>

            <SplitReveal
              as="h1"
              immediate
              className="mt-6 max-w-[1000px] font-display text-[clamp(42px,7vw,100px)] font-semibold leading-[1] tracking-[-0.045em] text-ivory"
              stagger={0.09}
            >
              {project.title}
            </SplitReveal>

            <Reveal delay={0.25}>
              <p className="mt-8 max-w-[620px] text-[clamp(15px,1.3vw,18px)] leading-[1.6] text-muted-dark">
                {project.description}
              </p>
            </Reveal>
          </div>
        </section>

        {/* cover */}
        <section className="px-[var(--frame-pad)] pb-[clamp(48px,6vw,90px)]">
          <Reveal y={50}>
            <div
              className="grain relative flex aspect-[16/9] w-full items-center justify-center overflow-hidden rounded-[var(--card-radius)]"
              style={{
                background: `radial-gradient(110% 110% at 22% 8%, ${project.art.to} 0%, ${project.art.from} 55%, #050505 100%)`,
              }}
            >
              <div
                className="absolute inset-0 opacity-60"
                style={{
                  background: `radial-gradient(50% 55% at 50% 50%, ${project.art.accent}38 0%, transparent 72%)`,
                }}
              />
              <TMark
                className="h-[42%] w-auto opacity-[0.14]"
                style={{ color: project.art.accent } as React.CSSProperties}
              />
              {project.placeholder ? (
                <span className="absolute bottom-6 left-6 rounded-full border border-white/20 bg-black/40 px-4 py-1.5 font-mono-brand text-[10px] uppercase tracking-[0.18em] text-white/70 backdrop-blur">
                  Placeholder cover — replace in /public/work/{project.slug}/
                </span>
              ) : null}
            </div>
          </Reveal>
        </section>

        {/* meta grid */}
        <section className="container-site pb-[var(--section-gap)]" aria-label="Project details">
          <div className="grid grid-cols-1 gap-x-10 gap-y-12 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <Reveal>
                <div className="border-t border-line-dark pt-5">
                  <p className="label-mono text-muted-dark">Services</p>
                  <ul className="mt-4 space-y-2">
                    {project.services.map((s) => (
                      <li key={s} className="text-[15px] text-ivory/85">
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mt-10 border-t border-line-dark pt-5">
                  <p className="label-mono text-muted-dark">Technologies</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {project.technologies.map((t) => (
                      <span
                        key={t}
                        className="rounded-full border border-line-dark px-3.5 py-1.5 text-[13px] text-ivory/85"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="mt-10 border-t border-line-dark pt-5">
                  <p className="label-mono text-muted-dark">Industry</p>
                  <p className="mt-4 text-[15px] text-ivory/85">{project.industry}</p>
                </div>
              </Reveal>
            </div>

            <div className="lg:col-span-7 lg:col-start-6">
              {[
                { label: "The challenge", body: project.challenge },
                { label: "Our solution", body: project.solution },
                { label: "Outcome", body: project.outcome },
              ].map((block, i) => (
                <Reveal key={block.label} delay={0.06 * i}>
                  <div className="mb-12 last:mb-0">
                    <p className="label-mono text-gold">{block.label}</p>
                    <p className="mt-5 text-[clamp(17px,1.7vw,23px)] font-medium leading-[1.5] tracking-[-0.015em] text-ivory">
                      {block.body}
                    </p>
                  </div>
                </Reveal>
              ))}

              {project.placeholder ? (
                <Reveal>
                  <div className="rounded-2xl border border-gold/25 bg-gold/[0.06] px-6 py-5">
                    <p className="label-mono text-gold">Note</p>
                    <p className="mt-2.5 text-[14px] leading-[1.6] text-ivory/75">
                      This is a representative build showing how TrinityByte approaches this kind
                      of product. Verified client case studies replace it in{" "}
                      <code className="rounded bg-black/40 px-1.5 py-0.5 font-mono-brand text-[12px] text-gold">
                        src/data/projects.ts
                      </code>
                      .
                    </p>
                  </div>
                </Reveal>
              ) : null}
            </div>
          </div>
        </section>

        {/* next project */}
        <section className="container-site pb-[var(--section-gap)]" aria-label="Next project">
          <Link href={`/work/${next.slug}`} className="group block border-t border-line-dark pt-8">
            <p className="label-mono text-muted-dark">Next project</p>
            <div className="mt-4 flex flex-wrap items-baseline justify-between gap-4">
              <h2 className="font-display text-[clamp(34px,5.2vw,72px)] font-semibold tracking-[-0.04em] text-ivory transition-transform duration-500 [transition-timing-function:var(--ease-out-expo)] group-hover:translate-x-3">
                {next.title}
              </h2>
              <span className="font-display text-[clamp(20px,2vw,28px)] text-ivory/60">
                ({next.index})
              </span>
            </div>
            <div className="mt-8">
              {/* visual only — the whole row is already the link */}
              <LiquidMetalButton presentational>
                View project
                <svg
                  viewBox="0 0 14 14"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-3.5 w-3.5 transition-transform duration-500 [transition-timing-function:var(--ease-out-expo)] group-hover:translate-x-0.5"
                  aria-hidden="true"
                >
                  <path d="M2.5 7h9M8 3.5 11.5 7 8 10.5" />
                </svg>
              </LiquidMetalButton>
            </div>
          </Link>
        </section>

        <CTA />
      </main>
      <Footer />
    </>
  );
}
