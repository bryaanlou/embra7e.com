# embra7e.com

Personal site for writing reviews of peripherals and other notes. Live at [embra7e.com](https://embra7e.com).

## Stack

- **Next.js 16** (App Router, Turbopack) — static export with ISR for benchmarks
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

`accentColor` overrides the site's default purple accent for that one article — set it to a color drawn from the cover image for a bespoke feel. Omit it to fall back to the site default.

### Images

Put images in `public/images/articles/<slug>/`, reference with absolute paths:

```mdx
![alt text](/images/articles/<slug>/whatever.jpg)
```

Compress before adding (Squoosh.app, TinyPNG). Targets: covers ~1600×900, inline shots ~1200px wide. `<img>` in MDX is auto-mapped to `next/image` via [mdx-components.tsx](./mdx-components.tsx) — optimization, lazy loading, and responsive sizing handled automatically.

## Benchmarks page

`/benchmarks` fetches live KovaaK's API data at build time and revalidates every 6 hours. To change which benchmarks show, edit the `BENCHMARKS` array in [app/benchmarks/page.tsx](./app/benchmarks/page.tsx):

```ts
const BENCHMARKS = [
  { name: "Voltaic S5 (Intermediate)", id: 458 },
  { name: "Viscose S2", id: 2336 },
];
```

The KovaaK's endpoint and types live in [lib/kovaaks.ts](./lib/kovaaks.ts).

## Theming

Theme tokens are defined in [app/globals.css](./app/globals.css) under `@theme`. Tailwind v4 generates utilities (`bg-bg`, `text-fg`, `text-muted`, `text-accent`, `border-border`) from those tokens. To shift the palette, change the hex values in one place.

## Layout & navigation

- Header / footer: [app/layout.tsx](./app/layout.tsx) — nav (Articles, Benchmarks, About), social icons (inline SVGs from simple-icons), and the gearz.gg logo link.
- 404 page: [app/not-found.tsx](./app/not-found.tsx)
- About blurb: [app/about/page.tsx](./app/about/page.tsx)

## Deploy

`git push` to `master` triggers a Vercel deployment automatically. DNS for `embra7e.com` is managed at Squarespace; A record at the apex and CNAME for `www` point at Vercel.
