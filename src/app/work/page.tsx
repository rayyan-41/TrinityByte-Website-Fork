import type { Metadata } from "next";
import { Bot, Boxes, Globe, Palette, Smartphone } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PageHero } from "@/components/PageHero";
import { CTA } from "@/sections/CTA";
import { Reveal } from "@/components/anim/Reveal";
import { CategoryList, type Category } from "@/components/ui/category-list";
import { Scroll01, type Scroll01Item } from "@/components/ui/scroll-01";
import { projects } from "@/data/projects";
import { services } from "@/data/services";

export const metadata: Metadata = {
  title: "Work",
  description:
    "Selected builds from TrinityByte — custom software platforms, mobile applications, e-commerce experiences, and business automation systems.",
  alternates: { canonical: "/work" },
};

/** Projects drive the sticky-media scroll showcase. */
const projectItems: Scroll01Item[] = projects.map((project) => ({
  title: project.title,
  description: project.description,
  media: project.coverImage,
  href: `/work/${project.slug}`,
  eyebrow: `${project.category}  ·  ${project.industry}  ·  ${project.year}`,
}));

/** Same five services, same copy. */
const SERVICE_ICONS: Record<string, React.ReactNode> = {
  "custom-software": <Boxes className="h-7 w-7" />,
  "web-development": <Globe className="h-7 w-7" />,
  "mobile-apps": <Smartphone className="h-7 w-7" />,
  "ui-ux-design": <Palette className="h-7 w-7" />,
  "ai-automation": <Bot className="h-7 w-7" />,
};

const capabilityCategories: Category[] = services.map((service) => ({
  id: service.slug,
  title: service.title,
  subtitle: service.copy,
  icon: SERVICE_ICONS[service.slug],
}));

export default function WorkPage() {
  return (
    <>
      <Header />
      <main>
        <PageHero
          eyebrow="Featured projects"
          kicker="(01)"
          title="Selected builds."
          lead="Every project blends design and engineering — shaping bold ideas into sleek digital realities, built with intent, speed, and visual clarity."
        />

        {/* placeholder disclosure — honest about what these are */}
        <section className="container-site bg-bg pb-[clamp(40px,5vw,72px)]">
          <Reveal>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 rounded-2xl border border-gold/25 bg-gold/[0.06] px-6 py-4">
              <span className="label-mono text-gold">Portfolio in progress</span>
              <p className="text-[14px] leading-[1.55] text-ivory/75">
                TrinityByte launched in 2026. The builds below are representative of our delivery
                standards — client case studies will replace them as engagements complete and
                approvals come through.
              </p>
            </div>
          </Reveal>
        </section>

        {/* projects */}
        <section className="container-site bg-bg pb-[var(--section-gap)]" aria-label="All projects">
          <Scroll01 items={projectItems} />
        </section>

        {/* capabilities recap */}
        <section className="container-site bg-bg pb-[var(--section-gap)]" aria-label="What we can build">
          <div className="flex items-center justify-between border-t border-line-dark pt-5">
            <p className="label-mono text-muted-dark">
              <span className="text-gold">©</span> What we can build for you
            </p>
            <p className="label-mono text-muted-dark">(02)</p>
          </div>
          <Reveal y={26}>
            <div className="mt-[clamp(32px,4vw,56px)]">
              <CategoryList showHeader={false} categories={capabilityCategories} />
            </div>
          </Reveal>
        </section>

        <CTA />
      </main>
      <Footer />
    </>
  );
}
