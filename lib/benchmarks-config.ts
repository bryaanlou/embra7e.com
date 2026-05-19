export const STEAM_ID = "76561198069972050";

export type Tier = {
  name: string;
  color: string;
};

export type Difficulty = {
  slug: string;
  name: string;
  benchmarkId: number;
  tiers: Tier[];
};

export type RankingMethod = "voltaic-energy" | "viscose-min-of-max";

export type BenchmarkConfig = {
  slug: string;
  name: string;
  difficulties: Difficulty[];
  defaultDifficulty: string;
  rankingMethod: RankingMethod;
};

export const BENCHMARKS: BenchmarkConfig[] = [
  {
    slug: "voltaic-s5",
    name: "Voltaic S5",
    defaultDifficulty: "intermediate",
    rankingMethod: "voltaic-energy",
    difficulties: [
      {
        slug: "novice",
        name: "Novice",
        benchmarkId: 459,
        tiers: [
          { name: "Iron", color: "#999999" },
          { name: "Bronze", color: "#FF9900" },
          { name: "Silver", color: "#CBD9E6" },
          { name: "Gold", color: "#CAB148" },
        ],
      },
      {
        slug: "intermediate",
        name: "Intermediate",
        benchmarkId: 458,
        tiers: [
          { name: "Platinum", color: "#2FCFC2" },
          { name: "Diamond", color: "#B9F2FF" },
          { name: "Jade", color: "#85FA85" },
          { name: "Master", color: "#EC44CA" },
        ],
      },
      {
        slug: "advanced",
        name: "Advanced",
        benchmarkId: 460,
        tiers: [
          { name: "Grandmaster", color: "#FFD700" },
          { name: "Nova", color: "#B600FF" },
          { name: "Astra", color: "#FF3393" },
          { name: "Celestial", color: "#24DDD8" },
        ],
      },
    ],
  },
  {
    slug: "viscose-s2",
    name: "Viscose S2",
    defaultDifficulty: "medium",
    rankingMethod: "viscose-min-of-max",
    difficulties: [
      {
        slug: "easier",
        name: "Easier",
        benchmarkId: 2335,
        tiers: [
          { name: "Lemming", color: "#C5C3F2" },
          { name: "Hare", color: "#B2CBEA" },
          { name: "Ermine", color: "#BAF6FC" },
          { name: "Puffin", color: "#7BCAF0" },
          { name: "Penguin", color: "#6B94DF" },
          { name: "Fox", color: "#8084FF" },
          { name: "Mammoth", color: "#A55FE4" },
          { name: "Orca", color: "#C080E4" },
          { name: "Seal", color: "#F5BDE8" },
        ],
      },
      {
        slug: "medium",
        name: "Medium",
        benchmarkId: 2336,
        tiers: [
          { name: "Cinnabar", color: "#FB1A1B" },
          { name: "Vermillion", color: "#F85939" },
          { name: "Saffron", color: "#F1C338" },
          { name: "Celadon", color: "#9CFF91" },
          { name: "Viridian", color: "#51D18A" },
          { name: "Cerulean", color: "#03F6FF" },
          { name: "Lavender", color: "#C2C2FF" },
          { name: "Indigo", color: "#8A54E1" },
          { name: "Fuchsia", color: "#FF65B0" },
        ],
      },
      {
        slug: "hard",
        name: "Hard",
        benchmarkId: 2337,
        tiers: [
          { name: "Wool", color: "#F1ECEB" },
          { name: "Rayon", color: "#F1ECEB" },
          { name: "Linen", color: "#EED3CE" },
          { name: "Velvet", color: "#ECA1B0" },
          { name: "Chiffon", color: "#8FC7E7" },
          { name: "Tricot", color: "#5CA9C6" },
          { name: "Satin", color: "#5CA9C6" },
          { name: "Silk", color: "#45A7CF" },
        ],
      },
      {
        slug: "expert",
        name: "Expert",
        benchmarkId: 2338,
        tiers: [
          { name: "Interloper", color: "#F8C9F8" },
          { name: "Attuned", color: "#EF92EF" },
          { name: "Heroic", color: "#E967E9" },
          { name: "Mythic", color: "#CC91F0" },
          { name: "Ascension", color: "#B966EA" },
          { name: "Eclipse", color: "#931ED7" },
        ],
      },
    ],
  },
  {
    slug: "viscose-s1",
    name: "Viscose S1",
    defaultDifficulty: "medium",
    rankingMethod: "viscose-min-of-max",
    difficulties: [
      {
        slug: "easier",
        name: "Easier",
        benchmarkId: 686,
        tiers: [
          { name: "Lemming", color: "#C5C3F2" },
          { name: "Hare", color: "#B2CBEA" },
          { name: "Ermine", color: "#BAF6FC" },
          { name: "Penguin", color: "#6B94DF" },
          { name: "Fox", color: "#8084FF" },
          { name: "Mammoth", color: "#A55FE4" },
          { name: "Orca", color: "#C080E4" },
          { name: "Seal", color: "#F5BDE8" },
        ],
      },
      {
        slug: "medium",
        name: "Medium",
        benchmarkId: 687,
        tiers: [
          { name: "Cinnabar", color: "#FB1A1B" },
          { name: "Vermillion", color: "#F85939" },
          { name: "Saffron", color: "#F1C338" },
          { name: "Celadon", color: "#9CFF91" },
          { name: "Cerulean", color: "#03F6FF" },
          { name: "Lavender", color: "#C2C2FF" },
          { name: "Indigo", color: "#8A54E1" },
          { name: "Fuchsia", color: "#FF65B0" },
        ],
      },
      {
        slug: "hard",
        name: "Hard",
        benchmarkId: 688,
        tiers: [
          { name: "Wool", color: "#F1ECEB" },
          { name: "Linen", color: "#EED3CE" },
          { name: "Velvet", color: "#ECA1B0" },
          { name: "Chiffon", color: "#8FC7E7" },
          { name: "Satin", color: "#5CA9C6" },
          { name: "Silk", color: "#45A7CF" },
        ],
      },
    ],
  },
];

export function getBenchmarkConfig(
  slug: string,
): BenchmarkConfig | undefined {
  return BENCHMARKS.find((b) => b.slug === slug);
}

export function getDifficulty(
  benchmark: BenchmarkConfig,
  difficultySlug: string,
): Difficulty | undefined {
  return benchmark.difficulties.find((d) => d.slug === difficultySlug);
}

export function getDefaultDifficulty(benchmark: BenchmarkConfig): Difficulty {
  return (
    getDifficulty(benchmark, benchmark.defaultDifficulty) ??
    benchmark.difficulties[0]
  );
}

export function tierAt(
  difficulty: Difficulty,
  rank: number,
): Tier | undefined {
  if (rank < 1 || rank > difficulty.tiers.length) return undefined;
  return difficulty.tiers[rank - 1];
}
