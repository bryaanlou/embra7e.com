/**
 * Per-benchmark rank computation. Each benchmark (Voltaic, Viscose, etc.) has
 * its own ranking algorithm — there is no single rule that works for all.
 *
 * - Voltaic: energy-based. We don't compute it ourselves; we fetch the
 *   resulting rank from evxl.app's leaderboard endpoint as a convenient
 *   data source.
 * - Viscose: each subcategory is ranked by its best-performing scenario,
 *   overall rank is the lowest of those subcategory ranks. "Complete" if
 *   every scenario meets or exceeds the overall rank.
 *
 * Both produce the same `ComputedRank` shape so callers don't care.
 */

import type { Difficulty, RankingMethod, Tier } from "./benchmarks-config";
import type { KovaaksBenchmarkResponse } from "./kovaaks";

export type ComputedRank = {
  rankIndex: number;
  rankName: string;
  complete?: boolean;
};

type EvxlEntry = {
  steamId: string;
  benchmarkId: number;
  difficultyName: string;
  rank: number;
  rankName: string;
  energy: number;
  progress: number;
  position: number;
  benchmarkName: string;
};

const EVXL_BASE = "https://api.evxl.app/leaderboard";

async function fetchEvxlEntry(
  benchmarkId: number,
  steamId: string,
): Promise<EvxlEntry | null> {
  const url = `${EVXL_BASE}?benchmarkId=${benchmarkId}&page=0&max=1&steamIdSearch=${steamId}`;
  try {
    const res = await fetch(url, {
      next: { revalidate: 60 },
      headers: {
        Accept: "application/json",
        "User-Agent": "Mozilla/5.0 (compatible; embra7e.com static build)",
      },
    });
    if (!res.ok) return null;
    const json = (await res.json()) as { data?: EvxlEntry[] };
    return json.data?.[0] ?? null;
  } catch {
    return null;
  }
}

export function computeViscoseRank(
  data: KovaaksBenchmarkResponse,
  tiers: Tier[],
): ComputedRank {
  const subcategoryMaxes = Object.values(data.categories).map((cat) => {
    const ranks = Object.values(cat.scenarios).map((s) => s.scenario_rank);
    return ranks.length > 0 ? Math.max(...ranks) : 0;
  });

  const overall =
    subcategoryMaxes.length > 0 ? Math.min(...subcategoryMaxes) : 0;

  const allCategories = Object.values(data.categories);
  const complete =
    overall > 0 &&
    allCategories.every((cat) =>
      Object.values(cat.scenarios).every((s) => s.scenario_rank >= overall),
    );

  return {
    rankIndex: overall,
    rankName:
      overall > 0
        ? tiers[overall - 1]?.name ?? `Rank ${overall}`
        : "Unranked",
    complete: overall > 0 ? complete : undefined,
  };
}

export async function getRankForBenchmark(
  method: RankingMethod,
  difficulty: Difficulty,
  steamId: string,
  data: KovaaksBenchmarkResponse | null,
): Promise<ComputedRank | null> {
  if (method === "viscose-min-of-max") {
    if (!data) return null;
    return computeViscoseRank(data, difficulty.tiers);
  }
  if (method === "voltaic-energy") {
    const entry = await fetchEvxlEntry(difficulty.benchmarkId, steamId);
    if (!entry) return null;
    const completeMatch = entry.rankName.match(/^(.+?)\s+Complete$/i);
    if (completeMatch) {
      return {
        rankIndex: entry.rank,
        rankName: completeMatch[1],
        complete: true,
      };
    }
    return {
      rankIndex: entry.rank,
      rankName: entry.rankName,
    };
  }
  return null;
}
