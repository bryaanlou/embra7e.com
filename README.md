# embra7e.com

Personal site for writing reviews of peripherals and other notes. Live at [embra7e.com](https://embra7e.com).

## Stack

- **Next.js 16** (App Router, Turbopack) — SSG with ISR for benchmarks
- **Tailwind CSS v4** — theme tokens in `app/globals.css` under `@theme`
- **MDX** via `@next/mdx` — articles in `content/articles/*.mdx`
- **Cabinet Grotesk** site-wide via Fontshare; Inter Tight as `next/font` fallback
- **Deployed on Vercel** — auto-deploys on push to `master`

## Local development

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build (also runs type check)
```

## Writing an article

Articles are MDX files in `content/articles/<slug>.mdx`. Filename becomes the URL slug.

### Frontmatter

```yaml
---
title: "Article Title"
date: "2026-05-18"             # ISO date; sorts /articles
description: "Short summary."  # /articles list + OG metadata
tags: ["peripherals", "review"]
coverImage: "/media/articles/<slug>/cover.jpg"
accentColor: "#5E81AC"         # optional; per-article accent override
wip: true                      # optional; renders a "WIP" badge
updated: "2026-06-01"          # optional; manual override for "Updated"
---
```

`updated` is otherwise auto-derived from `git log` for the article's `.mdx` file — any commit on a later calendar day than `date:` shows as the "Updated" timestamp.

### Media

Put images and videos in `public/media/articles/<slug>/`:

```mdx
![alt text](/media/articles/<slug>/whatever.jpg)
```

Compress before adding (Squoosh, TinyPNG). `<img>` in MDX is auto-mapped to `ZoomableImage` (click-to-lightbox via `next/image`) in [mdx-components.tsx](./mdx-components.tsx).

**Strip EXIF before commit** — phone photos embed GPS coordinates. Use `exiftool -all= -overwrite_original <file>`.

### Table of contents

`lib/articles.ts` extracts `##`/`###` headings from the markdown and renders an auto-TOC above the article body via [components/TableOfContents.tsx](./components/TableOfContents.tsx). Heading anchors come from `rehype-slug`.

## SEO & privacy

- **Sitemap** at `/sitemap.xml` via [app/sitemap.ts](./app/sitemap.ts).
- **OG / Twitter Card** metadata per-article via `generateMetadata` in [app/articles/[slug]/page.tsx](./app/articles/%5Bslug%5D/page.tsx). Verify previews at [opengraph.xyz](https://www.opengraph.xyz).
- **`public/robots.txt`** allows social card crawlers full access for unfurls, blocks `/media/` for general crawlers, and disallows known AI training crawlers site-wide.
- **`X-Robots-Tag`** and security headers (`X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`, HSTS, `X-Content-Type-Options`) applied via [next.config.ts](./next.config.ts).
- **Vercel Analytics** enabled in [app/layout.tsx](./app/layout.tsx); toggle on in the Vercel project dashboard.

## Deploy

`git push` to `master` triggers a Vercel deployment. DNS for `embra7e.com` is managed at Squarespace; A record at the apex and CNAME for `www` point at Vercel.
