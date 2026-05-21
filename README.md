# embra7e.com

Personal site for writing reviews of peripherals and other notes. Live at [embra7e.com](https://embra7e.com).

## Stack

- **Next.js 16** (App Router, Turbopack) — SSG with ISR for benchmarks
- **Tailwind CSS v4** — theme tokens in `app/globals.css` (`@theme` block)
- **MDX** via `@next/mdx` — articles live in `content/articles/*.mdx`, dynamically imported
- **Deployed on Vercel** — auto-deploys on push to `master`

## Local development

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build (also runs type check)
npm run lint
```

## Writing an article

Articles are MDX files in `content/articles/<slug>.mdx`. The filename becomes the URL slug (`<slug>.mdx` → `/articles/<slug>`).

### Frontmatter

```yaml
---
title: "Article Title"
date: "2026-05-18"             # ISO date; controls sort order on /articles
description: "Short summary."  # shown on /articles list and in OG metadata
tags: ["peripherals", "review"]
coverImage: "/images/articles/<slug>/cover.jpg"
accentColor: "#5E81AC"         # optional; tints links/highlights on this article only
---
```

`accentColor` overrides the site's default accent (a cold pastel `#a8b8d5`) for that one article — set it to a color drawn from the cover image for a bespoke feel. Omit it to fall back to the site default.

### Images

Put images in `public/images/articles/<slug>/`, reference with absolute paths:

```mdx
![alt text](/images/articles/<slug>/whatever.jpg)
```

Compress before adding (Squoosh.app, TinyPNG). Targets: covers ~1600×900, inline shots ~1200px wide. `<img>` in MDX is auto-mapped to `ZoomableImage` (a `next/image` wrapper with click-to-lightbox) via [mdx-components.tsx](./mdx-components.tsx) — optimization, lazy loading, and responsive sizing handled automatically.

## Benchmarks page

`/benchmarks` lists every configured benchmark with a card showing the user's current rank; `/benchmarks/<slug>/<difficulty>` is the detail view with per-scenario scores and tier-threshold columns. Data is fetched at build time and revalidates every 60 seconds (Next.js ISR).

All benchmark config lives in [lib/benchmarks-config.ts](./lib/benchmarks-config.ts) as a single `BENCHMARKS: BenchmarkConfig[]`:

```ts
{
  slug: "viscose-s2",
  name: "Viscose S2",
  defaultDifficulty: "medium",
  rankingMethod: "viscose-min-of-max",
  difficulties: [
    {
      slug: "medium",
      name: "Medium",
      benchmarkId: 2336,
      tiers: [
        { name: "Cinnabar", color: "#FB1A1B" },
        { name: "Vermillion", color: "#F85939" },
        // ...
      ],
    },
  ],
}
```

Each difficulty defines its own ordered `tiers` array (`{ name, color }`) — tier color and tier name live together so a tier can't drift out of sync with its color. The helper `tierAt(difficulty, rank)` resolves a 1-based rank index back to its `Tier`.

Two ranking methods are supported via `rankingMethod`:

- **`viscose-min-of-max`** — for Viscose-style benchmarks. Each subcategory's rank is the max scenario rank within it; overall rank is the min across subcategories. "Complete" if every scenario meets or exceeds the overall rank. Computed locally in [lib/rank.ts](./lib/rank.ts) from the KovaaK's API response.
- **`voltaic-energy`** — for Voltaic benchmarks (energy-based, not derivable from per-scenario ranks). The rank is fetched from an external community leaderboard for that benchmark.

The KovaaK's response type lives in [lib/kovaaks.ts](./lib/kovaaks.ts). The user's selected difficulty persists in `localStorage` under `embrace:bench:<slug>` (see `benchmarkStorageKey`).

## Theming

Theme tokens are defined in [app/globals.css](./app/globals.css) under `@theme` — a cold-pastel palette (`--color-bg` `#1e2632`, `--color-accent` `#a8b8d5`, etc.). Tailwind v4 generates utilities (`bg-bg`, `text-fg`, `text-muted`, `text-accent`, `border-border`, `bg-surface`) from those tokens, so shifting the palette is a one-place edit. The body background is a multi-blob radial gradient mesh at golden-ratio positions, also defined in `globals.css`.

## Layout & navigation

- Header / footer: [app/layout.tsx](./app/layout.tsx) — nav (Articles, Benchmarks, About), social icons (inline SVGs from simple-icons), and the gearz.gg logo link.
- 404 page: [app/not-found.tsx](./app/not-found.tsx)
- About blurb: [app/about/page.tsx](./app/about/page.tsx)

## Deploy

`git push` to `master` triggers a Vercel deployment automatically. DNS for `embra7e.com` is managed at Squarespace; A record at the apex and CNAME for `www` point at Vercel.
