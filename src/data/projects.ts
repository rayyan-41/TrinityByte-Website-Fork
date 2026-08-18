/**
 * ============================================================
 * TRINITYBYTE PORTFOLIO
 * ============================================================
 * TODO — REPLACE PLACEHOLDER PROJECTS WITH REAL WORK.
 *
 * No verified client projects were supplied with the Company
 * Profile, so the entries below are clearly-labelled placeholder
 * case studies that demonstrate the layout. They deliberately
 * carry NO client names, NO invented metrics, and NO fake
 * testimonials.
 *
 * To add a real project:
 *  1. Duplicate one of the objects below.
 *  2. Fill in title / client / description / challenge /
 *     solution / outcome (only verified results).
 *  3. Drop cover + gallery images into /public/work/<slug>/
 *     and update the paths.
 *  4. Set `placeholder: false` so the "representative build"
 *     note disappears.
 * ============================================================
 */

export type Project = {
  index: string;
  slug: string;
  title: string;
  category: string;
  industry: string;
  year: string;
  description: string;
  services: string[];
  technologies: string[];
  coverImage: string;
  gallery: string[];
  /** tailwind gradient classes for the placeholder art */
  art: { from: string; to: string; accent: string; glyph: string };
  challenge: string;
  solution: string;
  outcome: string;
  placeholder: boolean;
  url?: string;
};

export const projects: Project[] = [
  {
    index: "01",
    slug: "custom-software-platform",
    title: "Custom Software Platform",
    category: "Custom Software",
    industry: "Logistics",
    year: "2026",
    description:
      "A representative enterprise platform build — operations dashboard, role-based access, and workflow automation for a logistics-style business.",
    services: ["Discovery", "System Architecture", "Custom Development", "QA & Deployment"],
    technologies: ["React", "Node.js", "PostgreSQL", "Docker"],
    coverImage: "/work/morph/01.jpg",
    gallery: ["/work/morph/01.jpg", "/work/morph/05.jpg", "/work/morph/09.jpg"],
    art: { from: "#241c10", to: "#54401f", accent: "#e5c179", glyph: "◳" },
    challenge:
      "Operations teams juggling spreadsheets and disconnected tools need one system that reflects how the business actually runs.",
    solution:
      "A tailored platform: process mapping first, then a modular architecture with role-based dashboards, automated workflows, and clean APIs ready for future integrations.",
    outcome:
      "A production-ready platform template demonstrating our 7-stage delivery process — placeholder entry awaiting a real, publishable case study.",
    placeholder: true,
  },
  {
    index: "02",
    slug: "mobile-application",
    title: "Mobile Application",
    category: "Mobile App",
    industry: "Consumer",
    year: "2026",
    description:
      "A representative cross-platform app build — Flutter UI, offline-first data layer, and a clean release pipeline for iOS and Android.",
    services: ["UX Research", "UI Design", "Cross-Platform Development", "Store Launch"],
    technologies: ["Flutter", "Node.js", "MongoDB", "Git"],
    coverImage: "/work/morph/02.jpg",
    gallery: ["/work/morph/02.jpg", "/work/morph/06.jpg", "/work/morph/10.jpg"],
    art: { from: "#101820", to: "#2b4257", accent: "#a9cbe8", glyph: "▤" },
    challenge:
      "Consumer apps live or die on first impressions: cold-start speed, fluid interaction, and a design language users trust instantly.",
    solution:
      "One Flutter codebase for both platforms, an offline-first architecture, and a design system tuned for accessibility and thumb-reach ergonomics.",
    outcome:
      "A launch-ready mobile product blueprint — placeholder entry awaiting a real, publishable case study.",
    placeholder: true,
  },
  {
    index: "03",
    slug: "ecommerce-experience",
    title: "E-Commerce Experience",
    category: "Web Development",
    industry: "Retail",
    year: "2026",
    description:
      "A representative storefront build — high-performance Next.js frontend, streamlined checkout, and a CMS the team can actually use.",
    services: ["UI/UX Design", "Frontend Development", "Backend Integration", "Performance"],
    technologies: ["Next.js", "React", "MySQL", "PHP"],
    coverImage: "/work/morph/03.jpg",
    gallery: ["/work/morph/03.jpg", "/work/morph/07.jpg", "/work/morph/11.jpg"],
    art: { from: "#201114", to: "#4d2830", accent: "#e8aeb4", glyph: "◈" },
    challenge:
      "Retail traffic is unforgiving — every slow page and confusing step in checkout is revenue walking out the door.",
    solution:
      "A performance-first storefront: server-rendered product pages, edge caching, an accessible design system, and a checkout flow reduced to essentials.",
    outcome:
      "A storefront architecture demonstrating our web delivery standards — placeholder entry awaiting a real, publishable case study.",
    placeholder: true,
  },
  {
    index: "04",
    slug: "business-automation-system",
    title: "Business Automation System",
    category: "AI & Automation",
    industry: "SMEs",
    year: "2026",
    description:
      "A representative automation build — AI-assisted document handling, workflow orchestration, and reporting that runs itself.",
    services: ["Process Audit", "AI Integration", "Workflow Automation", "Training & Support"],
    technologies: ["Python", "Node.js", "PostgreSQL", "Linux"],
    coverImage: "/work/morph/04.jpg",
    gallery: ["/work/morph/04.jpg", "/work/morph/08.jpg", "/work/morph/12.jpg"],
    art: { from: "#131a10", to: "#33481f", accent: "#bcd99a", glyph: "⌬" },
    challenge:
      "Growing teams drown in repetitive admin — data entry, routing, reporting — hours that should be spent on the business itself.",
    solution:
      "An automation layer that watches the busywork: AI-assisted document intake, rule-based routing, scheduled reporting, and human review only where it matters.",
    outcome:
      "An automation framework demonstrating our AI & automation practice — placeholder entry awaiting a real, publishable case study.",
    placeholder: true,
  },
];

export const getProject = (slug: string) => projects.find((p) => p.slug === slug);
