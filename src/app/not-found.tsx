import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PageHero } from "@/components/PageHero";
import { PillButton } from "@/components/ui/PillButton";
import { Reveal } from "@/components/anim/Reveal";
import { nav } from "@/data/site";

/**
 * Catches every unmatched URL (Next serves this for the whole app).
 * Next injects `noindex` on 404 responses, so no robots directive is needed —
 * but the title and canonical are inherited from the root layout unless set
 * here, which would otherwise make every dead URL claim to be the home page.
 */
export const metadata: Metadata = {
  title: "Page not found",
  description: "That page doesn't exist. Browse TrinityByte's services, work, and team instead.",
  alternates: { canonical: null },
};

export default function NotFound() {
  // "Home" is already the primary CTA above, so the list offers the rest.
  const destinations = nav.filter((n) => n.href !== "/");

  return (
    <>
      <Header />
      <main>
        <PageHero
          eyebrow="Page not found"
          kicker="(404)"
          title="This page isn't part of the build."
          lead="The link may be mistyped, or the page may have moved since it was last shared. Everything else is exactly where you left it."
        >
          <PillButton href="/" tone="light" size="lg">
            Back to Home
          </PillButton>
        </PageHero>

        <section
          className="container-site bg-bg pb-[var(--section-gap)]"
          aria-label="Where to go instead"
        >
          <div className="flex items-center justify-between border-t border-line-dark pt-5">
            <p className="label-mono text-muted-dark">
              <span className="text-gold">©</span> Try one of these
            </p>
            <p className="label-mono hidden text-muted-dark md:block">
              {String(destinations.length).padStart(2, "0")} destinations
            </p>
          </div>

          <ol className="mt-[clamp(28px,3.5vw,48px)]">
            {destinations.map((item, i) => (
              <li key={item.href}>
                <Reveal delay={0.05 * i} y={22}>
                  <Link
                    href={item.href}
                    className="group grid grid-cols-[auto_1fr_auto] items-baseline gap-5 border-b border-line-dark py-6 sm:gap-8"
                  >
                    <span className="font-mono-brand text-[12px] text-gold">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="font-display text-[clamp(24px,3.2vw,44px)] font-semibold tracking-[-0.03em] text-ivory transition-transform duration-500 [transition-timing-function:var(--ease-out-expo)] group-hover:translate-x-2 group-focus-visible:translate-x-2">
                      {item.label}
                    </span>
                    <span
                      aria-hidden="true"
                      className="font-mono-brand text-[13px] text-muted-dark transition-colors duration-500 group-hover:text-gold group-focus-visible:text-gold"
                    >
                      &#8599;
                    </span>
                  </Link>
                </Reveal>
              </li>
            ))}
          </ol>
        </section>
      </main>
      <Footer />
    </>
  );
}
