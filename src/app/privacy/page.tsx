import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/anim/Reveal";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "Privacy",
  description:
    "What TrinityByte collects, why, and who processes it. This site sets no cookies and stores nothing in your browser.",
  alternates: { canonical: "/privacy" },
};

/**
 * Every statement here was verified against the live site on the date below:
 * no Set-Cookie headers on any route, no cookies, no localStorage,
 * sessionStorage or IndexedDB, and no third-party requests. Re-check before
 * changing this page — adding an embed, a font CDN or a tracker makes the
 * "no cookies" claim false and would require a consent banner.
 */
const LAST_UPDATED = "7 September 2026";

type Section = { index: string; heading: string; body: React.ReactNode };

const sections: Section[] = [
  {
    index: "01",
    heading: "Who we are",
    body: (
      <>
        <p>
          TrinityByte is a hybrid software house based in Islamabad, Pakistan, working with clients
          worldwide. We are responsible for the personal data described on this page.
        </p>
        <p>
          For any question about this policy, or to exercise the rights in section 06, email{" "}
          <a href={`mailto:${site.email}`} className="link-underline text-gold">
            {site.email}
          </a>
          .
        </p>
      </>
    ),
  },
  {
    index: "02",
    heading: "This site sets no cookies",
    body: (
      <>
        <p>
          We set no cookies. We store nothing in your browser — no local storage, no session
          storage, no device identifiers. Nothing on this site is loaded from a third-party domain,
          and our fonts are served from our own servers rather than a font network.
        </p>
        <p>
          That is why you are not being asked to accept anything. There is no tracking here to
          switch off.
        </p>
      </>
    ),
  },
  {
    index: "03",
    heading: "What you send us",
    body: (
      <>
        <p>
          If you submit the form on our{" "}
          <Link href="/contact" className="link-underline text-gold">
            contact page
          </Link>
          , we receive your name, email address, and the project details you choose to share —
          company, project type, budget range, timeline, and your description of the work.
        </p>
        <p>
          We use it for one thing: to read your enquiry and reply to it. We do not sell it, share it
          for advertising, or add you to a marketing list.
        </p>
        <p>
          Your submission is delivered to our mailbox by email. It stays there while it is still
          relevant to your enquiry or our business records. You can ask us to delete it at any time
          and we will.
        </p>
      </>
    ),
  },
  {
    index: "04",
    heading: "Analytics and server logs",
    body: (
      <>
        <p>
          We use Vercel Web Analytics and Speed Insights to see which pages are read and how quickly
          they load. Both are cookieless: they set no identifier, cannot follow you to another site,
          and report only aggregated figures. We cannot identify you from them.
        </p>
        <p>
          Our host also keeps standard server logs, which include IP addresses and basic request
          details. These exist to keep the site running and secure.
        </p>
      </>
    ),
  },
  {
    index: "05",
    heading: "Who else processes your data",
    body: (
      <>
        <p>Three providers handle data on our behalf, under their own terms:</p>
        <ul className="mt-5 space-y-3">
          <li>
            <span className="text-ivory">Vercel</span> — hosting, analytics and server logs.
          </li>
          <li>
            <span className="text-ivory">Resend</span> — delivers contact form submissions to our
            mailbox as email.
          </li>
          <li>
            <span className="text-ivory">Google Workspace</span> — the mailbox those emails arrive
            in.
          </li>
        </ul>
        <p className="mt-5">
          All three are based in the United States, so data you send us is processed outside your
          country if you are writing from elsewhere.
        </p>
      </>
    ),
  },
  {
    index: "06",
    heading: "Your rights",
    body: (
      <>
        <p>
          Depending on where you live, you may have the right to ask for a copy of the personal data
          we hold about you, to have it corrected, to have it deleted, to restrict or object to how
          we use it, or to receive it in a portable form.
        </p>
        <p>
          Email{" "}
          <a href={`mailto:${site.email}`} className="link-underline text-gold">
            {site.email}
          </a>{" "}
          and we will action it. If you are in the UK or EU and are unhappy with our response, you
          may complain to your national data protection authority.
        </p>
      </>
    ),
  },
  {
    index: "07",
    heading: "Changes",
    body: (
      <p>
        If we add anything that collects more than what is described here, we will update this page
        before it goes live — and if it ever involves cookies or tracking, we will ask your
        permission first.
      </p>
    ),
  },
];

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <main>
        <PageHero
          eyebrow="Privacy"
          title="What we collect, and what we don't."
          lead="Most privacy policies are written to cover the company. This one is written so you can tell, in about two minutes, exactly what happens to anything you send us."
        />

        <section className="container-site bg-bg pb-[var(--section-gap)]" aria-label="Privacy policy">
          <Reveal>
            <p className="label-mono border-b border-line-dark pb-5 text-muted-dark">
              Last updated — {LAST_UPDATED}
            </p>
          </Reveal>

          <div className="mt-[clamp(40px,5vw,72px)] space-y-[clamp(44px,5vw,76px)]">
            {sections.map((section) => (
              <Reveal key={section.index} y={22}>
                <article className="grid grid-cols-1 gap-x-10 gap-y-5 md:grid-cols-12">
                  <div className="md:col-span-4">
                    <p className="label-mono text-gold">({section.index})</p>
                    <h2 className="mt-3 font-display text-[clamp(24px,2.6vw,36px)] font-medium leading-[1.1] tracking-[-0.03em] text-ivory">
                      {section.heading}
                    </h2>
                  </div>
                  <div className="space-y-4 text-[clamp(15px,1.25vw,17px)] leading-[1.65] text-muted-dark md:col-span-8">
                    {section.body}
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
