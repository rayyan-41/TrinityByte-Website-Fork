/**
 * TrinityByte site-wide facts.
 * Source of truth: Company Profile (2026). Edit here to update everywhere.
 */
export const site = {
  name: "TrinityByte",
  tagline: "Your Vision. Our Code. Real Results.",
  positioning: "Building Innovative Digital Solutions for a Smarter Tomorrow",
  email: "contact@trinitybyte.org",
  linkedin: "https://linkedin.com/company/trinitybyte",
  linkedinLabel: "linkedin.com/company/trinitybyte",
  workplace: "Hybrid Workplace · Worldwide",
  established: "2026",
  url: "https://trinitybyte.org",
};

export const nav = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Work", href: "/work" },
  { label: "Careers", href: "/careers" },
  { label: "Contact", href: "/contact" },
];

/** Truthful facts used in the metrics strip (no invented numbers). */
export const facts = [
  { value: "2026", prefix: "EST.", label: "Founded as a hybrid software house" },
  { value: "05", prefix: "", label: "Core services under one roof" },
  { value: "07", prefix: "", label: "Stage development process" },
  { value: "3", prefix: "", label: "Client models — B2B · B2C · C2B" },
];

export const clientTypes = [
  {
    code: "B2B",
    name: "Business-to-Business",
    copy: "Helping organizations modernize operations and grow through technology — enterprise-grade tools, internal platforms, and automation systems that scale.",
  },
  {
    code: "B2C",
    name: "Business-to-Consumer",
    copy: "Engaging digital products that connect businesses with their customers — from e-commerce platforms to consumer mobile apps and beyond.",
  },
  {
    code: "C2B",
    name: "Customer-to-Business",
    copy: "Platforms that enable customer-driven interactions and services, turning user engagement into competitive business advantage.",
  },
];
