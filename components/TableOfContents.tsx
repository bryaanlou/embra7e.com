"use client";

import { useEffect, useState } from "react";
import type { TocItem } from "@/lib/articles";

type Props = {
  toc: TocItem[];
};

export function TableOfContents({ toc }: Props) {
  const [activeSlug, setActiveSlug] = useState<string | null>(null);

  // Scroll-spy: highlight the section currently near the top of the viewport.
  // Observes the real heading/scenario elements (their id === the toc slug).
  useEffect(() => {
    if (toc.length === 0) return;
    const els = toc
      .map((item) => document.getElementById(item.slug))
      .filter((el): el is HTMLElement => el !== null);
    if (els.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Of the sections intersecting the top band, the topmost one wins.
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length > 0) setActiveSlug(visible[0].target.id);
      },
      // Active band = the top ~25% of the viewport. Starting at the very top
      // matters so a clicked TOC target (which lands at/near the top) registers
      // as active instead of leaving the previous section highlighted.
      { rootMargin: "0px 0px -75% 0px", threshold: 0 },
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [toc]);

  if (toc.length === 0) return null;
  return (
    <nav
      aria-label="Table of contents"
      className="rounded-lg border border-border bg-surface/40 px-5 py-4"
    >
      <p className="text-xs uppercase tracking-widest text-fg mb-3">
        Contents
      </p>
      <ol className="space-y-1.5 text-sm list-none p-0 m-0">
        {toc.map((item, i) => {
          const active = item.slug === activeSlug;
          return (
            <li
              key={`${item.slug}-${i}`}
              className={item.level === 3 ? "pl-4" : ""}
            >
              <a
                href={`#${item.slug}`}
                aria-current={active ? "location" : undefined}
                className={`transition-colors ${
                  active ? "text-accent" : "text-muted hover:text-accent"
                }`}
              >
                {item.text}
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
