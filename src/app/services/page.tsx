import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PageHero } from "@/components/PageHero";
import { Services } from "@/sections/Services";
import { TechIndustries } from "@/sections/TechIndustries";
import { Process } from "@/sections/Process";
import { Engagement } from "@/sections/Engagement";
import { CTA } from "@/sections/CTA";
import { PillButton } from "@/components/ui/PillButton";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Custom software development, web development, mobile apps, UI/UX design, and AI automation — five core services delivered by one accountable TrinityByte team.",
  alternates: { canonical: "/services" },
};

export default function ServicesPage() {
  return (
    <>
      <Header />
      <main>
        <PageHero
          eyebrow="What we build"
          kicker="(01)"
          title="Five services. One accountable team."
          lead="From the first discovery call to long-term support, TrinityByte covers the full product lifecycle — strategy, design, engineering, and automation under one roof."
        >
          <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
            <PillButton href="/contact" tone="light" size="lg">
              Request a Custom Quote
            </PillButton>
            <Link href="/work" className="link-underline text-[15px] text-muted-dark hover:text-ivory">
              See these services in practice
            </Link>
          </div>
        </PageHero>

        <Services />
        <TechIndustries />
        <Process />
        <Engagement />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
