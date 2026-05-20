"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { benchmarkStorageKey } from "@/lib/benchmarks-config";

export type DifficultySummary = {
  slug: string;
  name: string;
  rankName: string;
  rankColor?: string;
  complete: boolean;
};

type Props = {
  slug: string;
  name: string;
  defaultDifficulty: string;
  difficulties: DifficultySummary[];
};

export function BenchmarkCard({
  slug,
  name,
  defaultDifficulty,
  difficulties,
}: Props) {
  const [activeSlug, setActiveSlug] = useState(defaultDifficulty);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(benchmarkStorageKey(slug));
      if (stored && difficulties.find((d) => d.slug === stored)) {
        setActiveSlug(stored);
      }
    } catch {
      /* ignore */
    }
  }, [slug, difficulties]);

  const active =
    difficulties.find((d) => d.slug === activeSlug) ??
    difficulties.find((d) => d.slug === defaultDifficulty) ??
    difficulties[0];

  if (!active) return null;

  return (
    <Link
      href={`/benchmarks/${slug}/${active.slug}`}
      className="group flex items-center justify-between gap-4 rounded-lg border border-border bg-surface px-5 py-4 hover:border-accent transition-colors"
    >
      <div className="space-y-1">
        <p className="font-medium group-hover:text-accent transition-colors">
          {name}
        </p>
        <p className="text-xs text-muted">Showing {active.name}</p>
      </div>
      <p
        className="text-sm font-medium shrink-0"
        style={{ color: active.rankColor ?? "var(--color-accent)" }}
      >
        {active.rankName}
        {active.complete && (
          <span className="text-muted ml-1.5 font-normal">Complete</span>
        )}
      </p>
    </Link>
  );
}
