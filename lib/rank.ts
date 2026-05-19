/**
 * Energy-based benchmark rank for a player.
 *
 * The rank itself is defined by each benchmark's creator (Voltaic, Viscose,
 * etc.) — every benchmark has its own scenarios, thresholds, and energy
 * formula. We just need to read the resulting rank for a given player.
 *
 * Data source: evxl.app's public leaderboard endpoint, which exposes the
 * computed rank/energy values. They handle the per-benchmark math.
 */

export type BenchmarkRank = {
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

const BASE = "https://api.evxl.app/leaderboard";

export async function getBenchmarkRank(
  benchmarkId: number,
  steamId: string,
): Promise<BenchmarkRank | null> {
  const url = `${BASE}?benchmarkId=${benchmarkId}&page=0&max=1&steamIdSearch=${steamId}`;
  try {
    const res = await fetch(url, {
      next: { revalidate: 21600 },
      headers: {
        Accept: "application/json",
        "User-Agent": "Mozilla/5.0 (compatible; embra7e.com static build)",
      },
    });
    if (!res.ok) return null;
    const json = (await res.json()) as { data?: BenchmarkRank[] };
    return json.data?.[0] ?? null;
  } catch {
    return null;
  }
}
