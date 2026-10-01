# embra7e.com

Personal site for peripheral reviews and notes. Live at [embra7e.com](https://embra7e.com).

Next.js 16 · Tailwind v4 · MDX · Vercel

## Develop

```bash
npm install
npm run dev     # localhost:3000
npm run build   # production build + type check
```

Pushing to `master` deploys to Vercel. DNS is managed at Squarespace and points at Vercel.

## Articles

One MDX file per article in `content/articles/<slug>.mdx`. The filename is the URL slug.

```yaml
---
title: "Article Title"
date: "2026-05-18"
description: "Short summary."      # list + OG metadata
tags: ["peripherals", "review"]
coverImage: "/media/articles/<slug>/cover.jpg"
accentColor: "#5E81AC"             # optional
wip: true                          # optional, shows a WIP badge
updated: "2026-06-01"              # optional, otherwise taken from git log
---
```

Media goes in `public/media/articles/<slug>/`. Images open in a lightbox automatically, and `##`/`###` headings build the table of contents.

Before committing images, compress them and strip EXIF (phone photos contain GPS):

```bash
exiftool -all= -overwrite_original <file>
```

## Where things live

| What | File |
| --- | --- |
| Theme tokens | `app/globals.css` |
| Social links | `components/Socials.tsx` |
| MDX element mapping | `mdx-components.tsx` |
| Security headers | `next.config.ts` |
| Crawler rules (blocks AI crawlers) | `public/robots.txt` |
| Sitemap | `app/sitemap.ts` |
