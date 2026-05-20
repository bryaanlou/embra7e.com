"use client";

import { useEffect } from "react";
import { benchmarkStorageKey } from "@/lib/benchmarks-config";

type Props = {
  benchmarkSlug: string;
  difficultySlug: string;
};

export function RememberDifficulty({ benchmarkSlug, difficultySlug }: Props) {
  useEffect(() => {
    try {
      localStorage.setItem(benchmarkStorageKey(benchmarkSlug), difficultySlug);
    } catch {
      /* localStorage blocked / disabled */
    }
  }, [benchmarkSlug, difficultySlug]);
  return null;
}
