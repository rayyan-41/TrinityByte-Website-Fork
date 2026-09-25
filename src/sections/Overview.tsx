import { ServicesIntro } from "@/sections/Services";
import { Facts } from "@/sections/Facts";
import { IndustriesMarquee } from "@/sections/IndustriesMarquee";

/** First stop after the hero: what we do and the facts behind it, then who it is for. */
export function Overview() {
  return (
    <>
      <div className="bg-bg pt-[calc(var(--section-gap)*0.6)]">
        <Facts intro={<ServicesIntro align="left" />} />
      </div>
      <section className="bg-bg pb-[var(--section-gap)]" aria-label="Industries we serve">
        <IndustriesMarquee />
      </section>
    </>
  );
}
