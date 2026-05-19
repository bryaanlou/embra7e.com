"use client";

import { useEffect } from "react";

const storageKey = (benchmarkSlug: string) => `embrace:bench:${benchmarkSlug}`;

type Props = {
  benchmarkSlug: string;
  difficultySlug: string;
};

export function RememberDifficulty({ benchmarkSlug, difficultySlug }: Props) {
  useEffect(() => {
    try {
      localStorage.setItem(storageKey(benchmarkSlug), difficultySlug);
    } catch {
      /* localStorage blocked / disabled */
    }
  }, [benchmarkSlug, difficultySlug]);
  return null;
}
