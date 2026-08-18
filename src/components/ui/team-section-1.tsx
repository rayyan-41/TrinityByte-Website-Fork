import * as React from "react";
import Image from "next/image";
import { PillButton } from "@/components/ui/PillButton";

export interface TeamSectionMember {
  name: string;
  designation: string;
  description: string;
  initials?: string;
  imageSrc?: string;
  points?: string[];
}

interface TeamSectionProps extends React.HTMLAttributes<HTMLElement> {
  eyebrow?: string;
  title: string;
  description: string;
  members: TeamSectionMember[];
  actionHref?: string;
  actionLabel?: string;
  logo?: React.ReactNode;
}

export const TeamSection = React.forwardRef<HTMLElement, TeamSectionProps>(
  (
    {
      eyebrow = "Our",
      title,
      description,
      members,
      actionHref,
      actionLabel = "Start a Project",
      logo,
      className = "",
      ...props
    },
    ref
  ) => {
    return (
      <section
        ref={ref}
        className={`relative w-full overflow-hidden bg-bg py-[clamp(72px,9vw,132px)] ${className}`}
        {...props}
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(242,239,233,.65) 1px,transparent 1px),linear-gradient(90deg,rgba(242,239,233,.65) 1px,transparent 1px)",
            backgroundSize: "42px 42px",
          }}
        />
        <div className="pointer-events-none absolute left-1/2 top-[18%] h-[440px] w-[70%] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(200,171,114,.08),transparent)]" />

        <div className="container-site relative z-10">
          <div data-team-header className="grid gap-8 border-t border-line-dark pt-6 lg:grid-cols-[1fr_0.78fr] lg:items-end">
            <div>
              <p className="label-mono text-gold">{eyebrow}</p>
              <h2 className="mt-4 max-w-[900px] font-display text-[clamp(50px,8vw,116px)] font-semibold leading-[0.92] tracking-[-0.055em] text-ivory">
                {title}
              </h2>
            </div>
            <div className="flex flex-col items-start gap-7 pb-1 lg:items-end lg:text-right">
              {logo && <div className="hidden text-gold md:block">{logo}</div>}
              <p className="max-w-[570px] text-[clamp(15px,1.3vw,18px)] leading-[1.6] text-muted-dark">
                {description}
              </p>
              {actionHref && (
                <PillButton href={actionHref} tone="light">
                  {actionLabel}
                </PillButton>
              )}
            </div>
          </div>

          <div className="mt-[clamp(52px,7vw,96px)] grid gap-4 md:grid-cols-3 lg:gap-5">
            {members.map((member, index) => (
              <article
                key={member.name}
                data-team-card
                className={`group relative flex min-h-[540px] flex-col overflow-hidden rounded-[var(--card-radius)] border p-[clamp(24px,2.5vw,38px)] shadow-[0_34px_90px_rgba(0,0,0,.28)] transition-[transform,border-color] duration-500 [transition-timing-function:var(--ease-out-expo)] hover:-translate-y-2 focus-within:-translate-y-2 md:min-h-[620px] ${
                  index === 1
                    ? "border-black/10 bg-ivory text-ink"
                    : "border-white/10 bg-[#0d0d0f] text-ivory"
                }`}
              >
                <div
                  className={`absolute inset-x-0 bottom-0 h-[58%] origin-bottom scale-y-0 rounded-t-[50%] transition-transform duration-700 [transition-timing-function:var(--ease-out-expo)] group-hover:scale-y-100 group-focus-within:scale-y-100 ${
                    index === 1
                      ? "bg-gradient-to-t from-gold/35 to-transparent"
                      : "bg-gradient-to-t from-gold/[0.16] to-transparent"
                  }`}
                />

                <div className="relative z-10 flex items-start justify-between gap-4">
                  <p className={`label-mono ${index === 1 ? "text-ink/48" : "text-gold"}`}>
                    {member.designation}
                  </p>
                  <span className={`font-mono-brand text-[11px] ${index === 1 ? "text-ink/38" : "text-ivory/28"}`}>
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>

                <div
                  className={`relative z-10 mx-auto mt-9 flex h-[clamp(178px,16vw,236px)] w-[clamp(178px,16vw,236px)] items-center justify-center overflow-hidden rounded-full border transition-[transform,border-color] duration-700 [transition-timing-function:var(--ease-out-expo)] group-hover:scale-[1.05] ${
                    index === 1
                      ? "border-ink/15 bg-ink/[0.035] text-gold-deep group-hover:border-gold-deep/55"
                      : "border-white/12 bg-white/[0.025] text-gold group-hover:border-gold/50"
                  }`}
                >
                  {member.imageSrc ? (
                    <Image
                      src={member.imageSrc}
                      alt={`${member.name}, ${member.designation} at TrinityByte`}
                      fill
                      sizes="(max-width: 767px) 178px, 236px"
                      className="object-cover grayscale transition-[filter,transform] duration-700 group-hover:scale-105 group-hover:grayscale-0"
                    />
                  ) : (
                    <>
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_30%,rgba(200,171,114,.2),transparent_40%),linear-gradient(145deg,rgba(200,171,114,.08),transparent_60%)]" />
                      <span className="relative font-display text-[clamp(54px,6vw,86px)] font-semibold tracking-[-0.07em] text-current">
                        {member.initials}
                      </span>
                      <span className={`absolute bottom-5 font-mono-brand text-[7px] uppercase tracking-[0.22em] ${index === 1 ? "text-ink/34" : "text-ivory/30"}`}>
                        Portrait
                      </span>
                    </>
                  )}
                </div>

                <div className="relative z-10 mt-auto pt-10">
                  <h3 className="max-w-[390px] font-display text-[clamp(27px,2.7vw,41px)] font-semibold leading-[1.02] tracking-[-0.04em]">
                    {member.name}
                  </h3>
                  <p className={`mt-4 text-[14.5px] leading-[1.58] ${index === 1 ? "text-ink/62" : "text-ivory/62"}`}>
                    {member.description}
                  </p>
                  {member.points && (
                    <ul className={`mt-6 grid gap-2 border-t pt-5 ${index === 1 ? "border-black/10" : "border-white/10"}`}>
                      {member.points.slice(0, 2).map((point) => (
                        <li key={point} className="flex items-center gap-2.5 text-[12px] font-medium">
                          <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                          {point}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    );
  }
);

TeamSection.displayName = "TeamSection";
