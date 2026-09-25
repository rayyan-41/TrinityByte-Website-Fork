import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Hero } from "@/sections/Hero";
import { Overview } from "@/sections/Overview";
import { Services } from "@/sections/Services";
import { TechIndustries } from "@/sections/TechIndustries";
import { MorphWork } from "@/sections/MorphWork";
import { Statement } from "@/sections/Statement";
import { Partnership } from "@/sections/Partnership";
import { Process } from "@/sections/Process";
import { Ribbons } from "@/sections/Ribbons";
import { Engagement } from "@/sections/Engagement";
import { CTA } from "@/sections/CTA";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        {/* Intro is no longer rendered here; the component still exists at
            src/sections/Intro.tsx if that block is ever wanted back.
            Overview carries the services headline, the facts and the industries
            marquee, so Services and TechIndustries drop their own copies here. */}
        <Hero />
        <Overview />
        <Statement />
        <Services intro={false} />
        <TechIndustries showIndustries={false} />
        <MorphWork />
        <Partnership />
        <Process />
        <Ribbons />
        <Engagement />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
