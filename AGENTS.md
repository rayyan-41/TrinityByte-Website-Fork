<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# TrinityByte website

Marketing site for TrinityByte, a hybrid software house in Karachi. Live at
trinitybyte.org on Vercel. Next.js 16 App Router, React 19, Tailwind v4,
TypeScript strict. Animation is GSAP (ScrollTrigger + SplitText) with Lenis
smooth scroll, plus framer-motion in a few components.

## Where things live

Copy splits in two, and knowing which half you need saves a lot of grep:

- **List data** — `src/data/`. `site.ts` (site facts, nav, metrics, client
  types), `company.ts` (vision, mission, values, leadership, roadmap,
  engagement models), `services.ts` (services, technologies, industries,
  process steps), `projects.ts` (portfolio).
- **Headings, section labels, hero copy** — inline in the component:
  `src/sections/*` for home-page sections, `src/app/*/page.tsx` for inner pages.

Pages compose as `<Header />` + `<main>` + `<Footer />`; the root layout only
supplies fonts, JSON-LD, and `SmoothScroll`. Inner pages open with `PageHero`.
Each section has a label bar with a `(NN)` index — those numbers are manual.

## Traps that cost real time

Every one of these was found the hard way. They are not obvious from the code.

**The in-app preview pane fires no `requestAnimationFrame` and no scroll
events.** Only timers run. Anything involving scroll position, animation
progress, hover, or `vw` units must be verified in real Chrome
(`mcp__claude-in-chrome__*`), not the Browser pane. The pane is still fine for
layout, computed styles, and DOM assertions. This once produced a convincing
phantom bug: Lenis looked permanently desynced from the window scroll, and the
"fix" was reverted after real Chrome showed it syncing correctly on its own.

**GSAP SplitText line masks clip descenders.** The masks clip to the line box,
and the display styles run `line-height` below 1, so `g`/`y`/`p` tails fall
outside it. The `.split-line-mask` padding rule at the bottom of `globals.css`
is load-bearing — it is not stray CSS to tidy up.

**SplitText puts inline-block children on their own line.** An icon or logo
placed inside a `SplitReveal` heading becomes its own stacked line. Pass
`SplitReveal`'s `ignore` selector prop so SplitText folds the element into the
adjacent word instead. This is what keeps the footer wordmark on one line.

**`TMark` is a background-image `<span>`, not an `<img>`.** Replaced elements
collapse Tailwind `w-*` and `w-auto` to zero width, so the ~25 call sites that
size it with `h-4 w-4` would silently render nothing. It also means `text-*`
and `color` no longer tint it — it is a raster.

**`ContainerScroll` drifts its title up 100px on scroll.** Anything above it
needs clearance or the heading rides over it. See the margin on `Process`.

**Lenis is exposed at `window.__lenis`.** Handy for driving scroll in tests,
but note that a programmatic Lenis scroll does not advance framer-motion's
`useScroll` progress — only real wheel input does.

**Satori cannot read woff2.** The OG image generator needs TrueType, so
`assets/InterDisplay-SemiBold.ttf` exists alongside the woff2 brand fonts.
Regenerate with `wawoff2` if the brand font changes.

## Brand and copy rules

- **No invented facts.** No client names, metrics, testimonials, or outcomes
  that were not supplied. `projects.ts` entries are labelled placeholders and
  `/work` says so on the page; keep that honesty if you touch them.
- **"TBX" and the ® symbol were deliberately removed site-wide.** Do not
  reintroduce either. The `(NN)` section indices stayed.
- Voice is declarative and ends in a period — "Selected builds.", "Pick a
  model. Scope it right." No apologies, no exclamation marks.

## Verifying and shipping

```bash
npm run dev            # port 3000
npx tsc --noEmit       # strict, must stay clean
npm run build          # always run before calling work done
```

**Deploys are blocked unless the commit author is `contact@trinitybyte.org`.**
The Vercel project is on Hobby with a private repo, so only the account owner
may trigger a build — a commit authored from any other address is rejected
before the build starts. Author the deploy commit with
`git -c user.email="contact@trinitybyte.org" commit ...`, then `vercel --prod`.

The `npm run audit` / `snap` / `test:visual` scripts in `package.json` predate
this work and are unverified — check `scripts/` before trusting them.

## Things that are deliberately unfinished

Check the source rather than trusting this list, which will age:

- `ENDPOINT` in `src/components/ContactForm.tsx` — if still `null`, the contact
  form validates but transmits nothing. The header comment explains the wiring.
- `placeholder: true` in `src/data/projects.ts` — the portfolio is illustrative,
  not real client work.
- `src/sections/Intro.tsx`, `src/sections/WorkGrid.tsx`,
  `src/components/ui/{ArrowCircle,SectionLabel,Button}.tsx` are unreferenced,
  and `animejs` is an unused dependency. Kept pending a decision to delete.
