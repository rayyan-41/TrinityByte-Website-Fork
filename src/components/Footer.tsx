import Link from "next/link";
import { nav, site } from "@/data/site";
import { TMark } from "@/components/ui/Logo";
import { SplitReveal } from "@/components/anim/SplitReveal";

export function Footer() {
  return (
    <footer
      className="relative z-10 rounded-t-[var(--card-radius)] bg-ivory text-ink shadow-[0_-30px_80px_rgba(0,0,0,0.45)]"
      aria-label="Footer"
    >
      <div className="container-site pt-[clamp(48px,6vw,84px)]">
        <div className="grid grid-cols-1 gap-y-12 border-t border-line-light pt-[clamp(36px,4.5vw,64px)] md:grid-cols-12">
          {/* brand + contact */}
          <div className="md:col-span-5">
            <span className="inline-flex h-14 w-14 items-center justify-center rounded-full border border-line-light bg-white">
              <TMark className="h-6 w-6 text-ink" />
            </span>
            <div className="mt-6 text-[14.5px]">
              <p className="flex flex-wrap items-center">
                <span className="text-muted-light">Our Email:&nbsp;</span>
                <a
                  href={`mailto:${site.email}`}
                  className="link-underline inline-flex min-h-[34px] items-center font-semibold"
                >
                  {site.email}
                </a>
              </p>
              <p>
                <span className="text-muted-light">Workplace: </span>
                <span className="font-semibold">{site.workplace}</span>
              </p>
            </div>
            <p className="mt-8 text-[15.5px]">© {site.established} TrinityByte</p>
            <p className="mt-1.5 font-mono-brand text-[11.5px] uppercase tracking-[0.16em] text-gold-deep">
              {site.tagline}
            </p>
          </div>

          {/* links */}
          <nav className="md:col-span-3" aria-label="Footer navigation">
            <h3 className="font-display text-[17.5px] font-medium">Links</h3>
            <ul className="mt-4 text-[14px]">
              {nav.map((n) => (
                <li key={n.href}>
                  <Link
                    href={n.href}
                    className="link-underline inline-flex min-h-[34px] items-center text-ink/85 hover:text-ink"
                  >
                    {n.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* social */}
          <div className="md:col-span-4">
            <h3 className="font-display text-[17.5px] font-medium">Connect</h3>
            <ul className="mt-4 text-[14px]">
              <li>
                <a
                  href={site.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="link-underline inline-flex min-h-[34px] items-center text-ink/85 hover:text-ink"
                >
                  LinkedIn
                </a>
              </li>
              <li>
                <a
                  href={site.instagram}
                  target="_blank"
                  rel="noreferrer"
                  className="link-underline inline-flex min-h-[34px] items-center text-ink/85 hover:text-ink"
                >
                  Instagram
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${site.email}`}
                  className="link-underline inline-flex min-h-[34px] items-center text-ink/85 hover:text-ink"
                >
                  Email
                </a>
              </li>
              <li>
                <Link
                  href="/careers"
                  className="link-underline inline-flex min-h-[34px] items-center text-ink/85 hover:text-ink"
                >
                  Careers
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="link-underline inline-flex min-h-[34px] items-center text-ink/85 hover:text-ink"
                >
                  Privacy
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* giant wordmark — sized to run the full container width */}
      <div
        aria-hidden="true"
        className="container-site overflow-hidden pb-[clamp(18px,2.2vw,36px)] pt-[clamp(40px,6vw,90px)]"
      >
        <SplitReveal
          as="p"
          mode="lines"
          ignore=".wordmark-mark"
          className="select-none whitespace-nowrap text-center font-display text-[clamp(52px,19.1vw,300px)] font-semibold leading-[0.92] tracking-[-0.05em] text-ink"
        >
          {/* the mark stands in for the leading T, so it sizes off the font */}
          <TMark className="wordmark-mark inline-block h-[1.19em] -ml-[0.245em] -mr-[0.19em] align-[-0.213em]" />
          rinityByte
        </SplitReveal>
      </div>
    </footer>
  );
}
