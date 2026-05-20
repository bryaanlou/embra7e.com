export type KovaaksScenario = {
  score: number;
  leaderboard_rank: number;
  scenario_rank: number;
  rank_maxes: number[];
};

export type KovaaksCategory = {
  benchmark_progress: number;
  category_rank: number;
  rank_maxes: number[];
  scenarios: Record<string, KovaaksScenario>;
};

export type KovaaksRank = {
  icon: string;
  name: string;
  color: string;
  frame: string;
  description: string;
  playercard_large: string;
  playercard_small: string;
};

export type KovaaksBenchmarkResponse = {
  benchmark_progress: number;
  overall_rank: number;
  categories: Record<string, KovaaksCategory>;
  ranks: KovaaksRank[];
};

const BASE = "https://kovaaks.com/webapp-backend/benchmarks/player-progress-rank-benchmark";

export async function getBenchmark(
  benchmarkId: number,
  steamId: string,
): Promise<KovaaksBenchmarkResponse | null> {
  const url = `${BASE}?benchmarkId=${benchmarkId}&steamId=${steamId}`;
  try {
    const res = await fetch(url, {
      next: { revalidate: 21600 },
      headers: { Accept: "application/json" },
    });
    if (!res.ok) return null;
    return (await res.json()) as KovaaksBenchmarkResponse;
  } catch {
    return null;
  }
}

export function normalizedScore(rawScore: number): number {
  return Math.round((rawScore / 100) * 100) / 100;
}
