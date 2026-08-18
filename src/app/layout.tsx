import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { SmoothScroll } from "@/components/SmoothScroll";

const interDisplay = localFont({
  src: [
    { path: "../../public/fonts/InterDisplay-Regular.woff2", weight: "400", style: "normal" },
    { path: "../../public/fonts/InterDisplay-Medium.woff2", weight: "500", style: "normal" },
    { path: "../../public/fonts/InterDisplay-SemiBold.woff2", weight: "600", style: "normal" },
  ],
  variable: "--font-inter-display",
  display: "swap",
});

const interVariable = localFont({
  src: "../../public/fonts/InterVariable.woff2",
  variable: "--font-inter",
  display: "swap",
});

const intelMono = localFont({
  src: [
    { path: "../../public/fonts/IntelOneMono-Regular.woff2", weight: "400", style: "normal" },
    { path: "../../public/fonts/IntelOneMono-Medium.woff2", weight: "500", style: "normal" },
  ],
  variable: "--font-intel-mono",
  display: "swap",
});

const SITE_URL = "https://trinitybyte.org";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "TrinityByte — Custom Software, Web, Mobile & AI Development",
    template: "%s — TrinityByte",
  },
  description:
    "TrinityByte builds scalable custom software, high-performance web applications, mobile apps, UI/UX experiences, and AI automation solutions for businesses worldwide.",
  keywords: [
    "custom software development",
    "web development",
    "mobile app development",
    "UI/UX design",
    "AI automation",
    "software house",
    "TrinityByte",
  ],
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "TrinityByte",
    title: "TrinityByte — Custom Software, Web, Mobile & AI Development",
    description:
      "Your Vision. Our Code. Real Results. TrinityByte is a modern hybrid software house building scalable digital products for businesses worldwide.",
  },
  twitter: {
    card: "summary_large_image",
    title: "TrinityByte — Custom Software, Web, Mobile & AI Development",
    description:
      "Your Vision. Our Code. Real Results. TrinityByte builds scalable digital products for businesses worldwide.",
  },
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
};

const orgJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "TrinityByte",
  url: SITE_URL,
  email: "contact@trinitybyte.org",
  foundingDate: "2026",
  slogan: "Your Vision. Our Code. Real Results.",
  description:
    "TrinityByte is a modern hybrid software house delivering innovative, scalable, and high-performance software solutions for businesses across Pakistan and international markets.",
  sameAs: ["https://linkedin.com/company/trinitybyte"],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      // the head script below adds `anim-ready` before hydration, so the
      // client className intentionally differs from the server's
      suppressHydrationWarning
      className={`${interDisplay.variable} ${interVariable.variable} ${intelMono.variable}`}
    >
      <head>
        {/*
          Animated elements are pre-hidden so they can't flash before their reveal
          runs — but only once we know JS is available AND motion is wanted. This
          runs before first paint, so if scripting is off or the user prefers
          reduced motion the content simply renders visible and never depends on
          React hydration to appear.
        */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{if(!matchMedia('(prefers-reduced-motion: reduce)').matches){document.documentElement.classList.add('anim-ready')}}catch(e){}`,
          }}
        />
      </head>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
