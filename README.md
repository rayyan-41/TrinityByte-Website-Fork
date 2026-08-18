# TrinityByte — Company Website

**Your Vision. Our Code. Real Results.**

A premium creative-agency website for TrinityByte, a hybrid software house established 2026.
Built with Next.js 16, React 19, TypeScript, Tailwind CSS v4, GSAP (ScrollTrigger + SplitText),
Framer Motion, Anime.js, and Lenis smooth scrolling. GSAP drives the existing page choreography;
Framer Motion powers the scroll-morph Featured Works scene. Anime.js is installed for future
self-contained timelines but is not currently used in production code.

---

## Quick start

```bash
npm install
```

Development server (http://localhost:3003):

```bash
npm run dev
```

Production build:

```bash
npm run build
```

Serve the production build:

```bash
npm start
```

Lint:

```bash
npm run lint
```

---

## Technology stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS v4 + CSS custom properties |
| Animation | GSAP 3 — ScrollTrigger, SplitText |
| Smooth scroll | Lenis |
| Fonts | Inter Display + Inter Variable + Intel One Mono, self-hosted via `next/font/local` |
| Testing | Playwright (visual QA + interaction tests) |

---

## Project structure

```
public/
  brand/            TrinityByte logo assets (metallic T mark)
  fonts/            Self-hosted woff2 files
screenshots/
  reference/        Reference captures used during design
  trinity/          Iteration screenshots
  final/            Playwright QA output
scripts/
  snap.mjs          Ad-hoc screenshot helper
  audit.mjs         Cross-breakpoint overflow / a11y / console audit
  capture-reference.mjs
src/
  app/              Routes, metadata, sitemap, robots, icon
    about/ services/ work/ work/[slug]/ careers/ contact/
  components/       Header, Footer, PageHero, ContactForm, SmoothScroll
    anim/           Reveal, SplitReveal, WordScrub
    ui/             Logo, buttons, clock, and the scroll-morph project showcase
  data/             All editable content lives here
  sections/         Homepage sections
tests/
  visual.spec.ts    Playwright suite
```

---

## Where to edit company information

Everything factual lives in `src/data/` — no copy is hard-coded in components.

| What | File |
|---|---|
| Name, tagline, email, LinkedIn, workplace, year, nav links, client types | `src/data/site.ts` |
| Services, tags, technologies, industries, 7-stage process | `src/data/services.ts` |
| Pillars, vision, mission, values, differentiators, startup advantage, leadership, roadmap, careers perks, engagement models | `src/data/company.ts` |
| Portfolio projects | `src/data/projects.ts` |

Changing `site.email` or `site.tagline`, for example, updates the header, footer, menu,
contact page, and structured data at once.

---

## Where to add portfolio projects

Open **`src/data/projects.ts`**. It ships with four clearly-labelled placeholder builds —
they carry no client names and no invented metrics, because no verified case studies were
supplied.

To add a real project:

1. Copy one of the existing objects in the `projects` array.
2. Fill in `title`, `slug`, `index`, `category`, `industry`, `year`, `description`,
   `services`, `technologies`, `coverImage`, `gallery`, `challenge`, `solution`, `outcome`,
   and optionally `url`.
3. Set `placeholder: false` — this removes the "representative build" badge on the card
   and the disclosure note on the detail page.
4. Add imagery (see below).

Routes are generated automatically: a new entry gets `/work/<slug>` with no extra wiring,
and it appears in the homepage scroll-morph showcase, the `/work` index, and the sitemap.

> **Only publish verified outcomes.** The `outcome` field is rendered as a claim about
> real results. Leave it descriptive until a client approves specific numbers.

---

## Where to replace images

| Asset | Location |
|---|---|
| Brand mark (metallic T) | `public/brand/t-mark-metallic.jpg` |
| Project covers / galleries | Create `public/work/<slug>/` and reference the paths from `projects.ts` |
| Favicon / app icon | `src/app/icon.svg` |

The homepage morph reads its frames from each project's `gallery` array. The bundled representative
images live in `public/work/morph/`; replace those paths with approved project media when available.

Project covers are currently generated as CSS/SVG art (`ART` components in
`src/sections/WorkGrid.tsx`) so the site looks finished without stock photography.
To swap in real photography, replace the `<CoverShell>` children with a `next/image`
and point it at your file in `public/work/<slug>/`.

The vector logo lives in `src/components/ui/Logo.tsx` (`TMark`) — it is a clean recreation
of the metallic mark and scales to any size without a raster asset.

---

## Where to add real testimonials

The reference layout has a testimonial section. TrinityByte has no published client
testimonials, so **no fake ones were invented**. That slot is filled by
`src/sections/Partnership.tsx`, which keeps the same pinned-marquee composition using
real commitments and real founder quotes from the Company Profile.

When genuine testimonials exist:

1. Add a `testimonials` array to `src/data/company.ts`:
   ```ts
   export const testimonials = [
     { quote: "…", name: "…", role: "…", company: "…", initials: "…" },
   ];
   ```
2. In `Partnership.tsx`, replace the `QUOTE_CARDS` constant (currently derived from
   `leadership`) with that array.
3. Update the section label from `Real commitments` to `Real feedback`.

The card component already handles quote, name, role, and avatar initials.

---

## How to connect the contact form

The form at `/contact` is fully validated client-side but **does not transmit anything
yet**, and it tells the user so rather than faking a success message.

Open **`src/components/ContactForm.tsx`** and set the endpoint constant near the top:

```ts
const ENDPOINT: string | null = "/api/contact";
```

Then create the route handler:

```ts
// src/app/api/contact/route.ts
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const data = await request.json();
  // send with Resend / SendGrid / Nodemailer, or forward to a form service
  return NextResponse.json({ ok: true });
}
```

The submit handler already POSTs the fields as JSON and renders success and error states —
no other change is required. Fields sent: `name`, `email`, `company`, `projectType`,
`budget`, `timeline`, `details`.

Alternatively point `ENDPOINT` at a hosted form service (Formspree, Basin, Web3Forms) —
they accept the same JSON POST.

---

## Screenshot QA

The Playwright suite captures the deliverable screenshots and asserts real behaviour —
no console errors, no mobile overflow, working menu, validated form, reduced-motion safety.

```bash
npm run test:visual
```

Output lands in `screenshots/final/`. The dev server starts automatically if it isn't
already running.

A separate sweep checks every page at 1920/1440/1280/1024/768/430/390/375 for horizontal
overflow, console errors, missing alt text, and undersized tap targets:

```bash
npm run audit
```

Ad-hoc screenshot of any route:

```bash
node scripts/snap.mjs /about screenshots/trinity/about.png --y 1200
```

Flags: `--w`, `--h`, `--y` (scroll offset), `--full` (full page), `--mobile`, `--wait`.

---

## Accessibility & motion

- Semantic landmarks throughout; every page has exactly one `<h1>`.
- Visible gold focus rings on all interactive elements.
- The menu overlay closes on `Escape` and removes its links from the tab order when closed.
- All decorative art is `aria-hidden`; every content image has descriptive alt text.
- `prefers-reduced-motion: reduce` disables Lenis, GSAP reveals, and marquees. Animated
  elements are pre-hidden only via `.anim-ready`, a class set by a pre-paint inline script,
  so content is never hidden when motion is reduced or JavaScript is unavailable.

---

## Content integrity

This site deliberately contains **no fabricated business claims**. There are no invented
client counts, revenue figures, conversion metrics, awards, reviews, partnerships, office
locations, or pricing. Where the reference layout uses such numbers, TrinityByte's version
uses verifiable facts instead (Est. 2026, five core services, seven-stage process, three
client models). Roadmap items beyond 2026 are labelled **Planned**, not presented as
achievements. Careers lists no fictional openings.

Keep it that way when editing `src/data/`.
