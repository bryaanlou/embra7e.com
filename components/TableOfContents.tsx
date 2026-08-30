"use client";

import { useEffect, useState } from "react";
import type { TocItem } from "@/lib/articles";

type Props = {
  toc: TocItem[];
};

// Matches the anchors' `scroll-mt-24` offset, so a heading counts as
// "reached" once it's at the same line the sticky scroll target uses.
const ACTIVE_OFFSET = 100;

export function TableOfContents({ toc }: Props) {
  const [activeSlug, setActiveSlug] = useState<string | null>(null);

  // Scroll-spy: highlight the last heading/scenario we've scrolled past.
  // An IntersectionObserver "band" (the previous approach) picks whichever
  // overlapping element is geometrically topmost, which breaks for short
  // sections: the section you just left can still poke its bottom edge into
  // the band with a very negative `top`, beating the target you jumped to.
  // Walking elements in document order and keeping the last one whose top
  // has crossed the offset line is correct regardless of section height.
  useEffect(() => {
    if (toc.length === 0) return;
    const els = toc
      .map((item) => document.getElementById(item.slug))
      .filter((el): el is HTMLElement => el !== null);
    if (els.length === 0) return;

    let ticking = false;
    const update = () => {
      ticking = false;
      // At the bottom of the page, force the last heading active. A short
      // final section can't scroll its heading up to the offset line, so the
      // walk below would otherwise leave it stuck on the previous section.
      const atBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 2;
      if (atBottom) {
        setActiveSlug(els[els.length - 1].id);
        return;
      }
      let current: string | null = null;
      for (const el of els) {
        if (el.getBoundingClientRect().top <= ACTIVE_OFFSET) {
          current = el.id;
        } else {
          break;
        }
      }
      setActiveSlug(current);
    };
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
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
                className={`block rounded px-2 py-0.5 -mx-2 transition-colors ${
                  active
                    ? "bg-accent/10 text-accent"
                    : "text-muted hover:text-accent"
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
