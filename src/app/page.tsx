import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Hero } from "@/sections/Hero";
import { Facts } from "@/sections/Facts";
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
        {/* The hero's scroll scene now reveals the "hybrid software house"
            statement, description and About CTA that the Intro section used to
            carry, so Intro is no longer rendered here. The component still
            exists at src/sections/Intro.tsx if that block is ever wanted back. */}
        <Hero />
        <Facts />
        <Services />
        <TechIndustries />
        <MorphWork />
        <Statement />
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
