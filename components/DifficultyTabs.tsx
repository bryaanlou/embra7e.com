"use client";

import Link from "next/link";
import { useLayoutEffect, useRef, useState } from "react";

type Tab = {
  slug: string;
  name: string;
};

type Props = {
  benchmarkSlug: string;
  difficulties: Tab[];
  active: string;
};

export function DifficultyTabs({
  benchmarkSlug,
  difficulties,
  active,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [indicator, setIndicator] = useState<{
    left: number;
    width: number;
  } | null>(null);

  useLayoutEffect(() => {
    if (!containerRef.current) return;
    const activeEl = containerRef.current.querySelector<HTMLElement>(
      `[data-tab-slug="${active}"]`,
    );
    if (!activeEl) return;
    setIndicator({
      left: activeEl.offsetLeft,
      width: activeEl.offsetWidth,
    });
  }, [active, difficulties]);

  return (
    <div
      ref={containerRef}
      className="relative flex items-center gap-1 border-b border-border"
    >
      {difficulties.map((d) => {
        const isActive = d.slug === active;
        return (
          <Link
            key={d.slug}
            href={`/benchmarks/${benchmarkSlug}/${d.slug}`}
            data-tab-slug={d.slug}
            className={`px-4 py-2 text-sm transition-colors ${
              isActive
                ? "text-accent"
                : "text-muted hover:text-fg"
            }`}
          >
            {d.name}
          </Link>
        );
      })}
      {indicator && (
        <span
          aria-hidden="true"
          className="absolute -bottom-px h-0.5 bg-accent transition-[left,width] duration-300 ease-out"
          style={{
            left: `${indicator.left}px`,
            width: `${indicator.width}px`,
          }}
        />
      )}
    </div>
  );
}
