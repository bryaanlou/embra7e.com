/**
 * Per-benchmark rank computation. Each benchmark (Voltaic, Viscose, etc.) has
 * its own ranking algorithm — there is no single rule that works for all.
 *
 * - Voltaic: energy-based. Per-scenario energy is interpolated from score
 *   relative to the difficulty's rank thresholds, then each subcategory takes
 *   the max of its two scenarios' energies (capped at the next difficulty's
 *   first rank), and the overall energy is the floor of the harmonic mean of
 *   subcategory energies. Rank is the highest tier whose energy threshold the
 *   overall energy meets. "Complete" if every scenario meets its threshold at
 *   that rank.
 * - Viscose: each subcategory is ranked by its best-performing scenario,
 *   overall rank is the lowest of those subcategory ranks. "Complete" if
 *   every scenario meets or exceeds the overall rank.
 *
 * Both produce the same `ComputedRank` shape so callers don't care.
 */

import type {
  BenchmarkConfig,
  Difficulty,
  Tier,
} from "./benchmarks-config";
import type { KovaaksBenchmarkResponse } from "./kovaaks";

export type ComputedRank = {
  rankIndex: number;
  rankName: string;
  complete?: boolean;
};

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

function harmonicMean(values: number[]): number {
  if (values.length === 0) return 0;
  const denom = values.reduce((acc, v) => acc + 1 / v, 0);
  return values.length / denom + 0.00001;
}

// Per-scenario energy: piecewise linear interpolation between score thresholds
// (Plat, Diamond, Jade, Master) and the corresponding energy values, with the
// top band's slope extrapolated above Master and a "projected min" anchor at
// `2*plat - diamond` mapped to the previous difficulty's top energy. Mirrors
// voltaic-app's getTierSubcategoryTasksEnergy.
function scenarioEnergy(
  score: number,
  scoreThresholds: readonly number[],
  energyThresholds: readonly number[],
  prevDifficultyTopEnergy: number,
): number {
  const n = scoreThresholds.length;
  if (n === 0) return 0;

  const projectedMin = 2 * scoreThresholds[0] - scoreThresholds[1];
  const xs = [0, projectedMin, ...scoreThresholds];
  const ys = [0, prevDifficultyTopEnergy, ...energyThresholds];

  // Find the band [xs[i], xs[i+1]] containing score; if above the top, extrapolate.
  let i = xs.length - 1;
  while (i > 0 && xs[i] > score) i--;

  const x0 = xs[i];
  const x1 = i + 1 < xs.length ? xs[i + 1] : xs[i] + (xs[i] - xs[i - 1]);
  const y0 = ys[i];
  const y1 = i + 1 < ys.length ? ys[i + 1] : ys[i] + (ys[i] - ys[i - 1]);
  const span = x1 - x0;
  if (span === 0) return y0;
  return y0 + ((score - x0) / span) * (y1 - y0);
}

export function computeVoltaicRank(
  data: KovaaksBenchmarkResponse,
  config: BenchmarkConfig,
  difficulty: Difficulty,
): ComputedRank {
  const energyThresholds = difficulty.tiers
    .map((t) => t.energyThreshold)
    .filter((e): e is number => e !== undefined);
  if (energyThresholds.length !== difficulty.tiers.length) {
    return { rankIndex: 0, rankName: "Unranked" };
  }

  const difficulties = config.difficulties;
  const idx = difficulties.findIndex((d) => d.slug === difficulty.slug);
  const next = idx >= 0 ? difficulties[idx + 1] : undefined;
  const prev = idx > 0 ? difficulties[idx - 1] : undefined;

  // Cap: next difficulty's first energy threshold (so e.g. Intermediate energy
  // can't bleed into the Advanced band without playing Advanced scenarios).
  // No next → top difficulty, no cap.
  const cap =
    next?.tiers[0]?.energyThreshold ??
    energyThresholds[energyThresholds.length - 1];

  // Anchor for below-Plat extrapolation.
  const prevTopEnergy = prev?.tiers[prev.tiers.length - 1]?.energyThreshold ?? 0;

  const subcategoryEnergies: number[] = [];
  for (const cat of Object.values(data.categories)) {
    const scenarios = Object.values(cat.scenarios);
    for (let i = 0; i < scenarios.length; i += 2) {
      const s1 = scenarios[i];
      const s2 = scenarios[i + 1];
      if (!s1 || !s2) continue;
      const e1 = scenarioEnergy(
        s1.score / 100,
        s1.rank_maxes,
        energyThresholds,
        prevTopEnergy,
      );
      const e2 = scenarioEnergy(
        s2.score / 100,
        s2.rank_maxes,
        energyThresholds,
        prevTopEnergy,
      );
      subcategoryEnergies.push(Math.min(Math.max(e1, e2), cap));
    }
  }

  if (subcategoryEnergies.length === 0) {
    return { rankIndex: 0, rankName: "Unranked" };
  }

  const overallEnergy = Math.floor(harmonicMean(subcategoryEnergies));

  let rankIndex = 0;
  for (let i = 0; i < energyThresholds.length; i++) {
    if (overallEnergy >= energyThresholds[i]) rankIndex = i + 1;
  }
  if (rankIndex === 0) {
    return { rankIndex: 0, rankName: "Unranked" };
  }

  const rankName = difficulty.tiers[rankIndex - 1].name;

  let complete = true;
  for (const cat of Object.values(data.categories)) {
    for (const s of Object.values(cat.scenarios)) {
      const required = s.rank_maxes[rankIndex - 1];
      if (required === undefined) continue;
      if (s.score / 100 < required) {
        complete = false;
        break;
      }
    }
    if (!complete) break;
  }

  return { rankIndex, rankName, complete };
}

export function getRankForBenchmark(
  config: BenchmarkConfig,
  difficulty: Difficulty,
  data: KovaaksBenchmarkResponse | null,
): ComputedRank | null {
  if (!data) return null;
  if (config.rankingMethod === "viscose-min-of-max") {
    return computeViscoseRank(data, difficulty.tiers);
  }
  if (config.rankingMethod === "voltaic-energy") {
    return computeVoltaicRank(data, config, difficulty);
  }
  return null;
}
