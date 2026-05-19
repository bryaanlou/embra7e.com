export const STEAM_ID = "76561198069972050";

export type Difficulty = {
  slug: string;
  name: string;
  benchmarkId: number;
  tierNames: string[];
};

export type BenchmarkConfig = {
  slug: string;
  name: string;
  difficulties: Difficulty[];
  defaultDifficulty: string;
};

export const BENCHMARKS: BenchmarkConfig[] = [
  {
    slug: "voltaic-s5",
    name: "Voltaic S5",
    defaultDifficulty: "intermediate",
    difficulties: [
      {
        slug: "novice",
        name: "Novice",
        benchmarkId: 459,
        tierNames: ["Iron", "Bronze", "Silver", "Gold"],
      },
      {
        slug: "intermediate",
        name: "Intermediate",
        benchmarkId: 458,
        tierNames: ["Platinum", "Diamond", "Jade", "Master"],
      },
      {
        slug: "advanced",
        name: "Advanced",
        benchmarkId: 460,
        tierNames: ["Grandmaster", "Nova", "Astra", "Celestial"],
      },
    ],
  },
  {
    slug: "viscose-s2",
    name: "Viscose S2",
    defaultDifficulty: "medium",
    difficulties: [
      {
        slug: "easier",
        name: "Easier",
        benchmarkId: 2335,
        tierNames: [
          "Lemming",
          "Hare",
          "Ermine",
          "Puffin",
          "Penguin",
          "Fox",
          "Mammoth",
          "Orca",
          "Seal",
        ],
      },
      {
        slug: "medium",
        name: "Medium",
        benchmarkId: 2336,
        tierNames: [
          "Cinnabar",
          "Vermillion",
          "Saffron",
          "Celadon",
          "Viridian",
          "Cerulean",
          "Lavender",
          "Indigo",
          "Fuchsia",
        ],
      },
      {
        slug: "hard",
        name: "Hard",
        benchmarkId: 2337,
        tierNames: [
          "Wool",
          "Rayon",
          "Linen",
          "Velvet",
          "Chiffon",
          "Tricot",
          "Satin",
          "Silk",
        ],
      },
      {
        slug: "expert",
        name: "Expert",
        benchmarkId: 2338,
        tierNames: [
          "Interloper",
          "Attuned",
          "Heroic",
          "Mythic",
          "Ascension",
          "Eclipse",
        ],
      },
    ],
  },
  {
    slug: "viscose-s1",
    name: "Viscose S1",
    defaultDifficulty: "medium",
    difficulties: [
      {
        slug: "easier",
        name: "Easier",
        benchmarkId: 686,
        tierNames: [
          "Lemming",
          "Hare",
          "Ermine",
          "Penguin",
          "Fox",
          "Mammoth",
          "Orca",
          "Seal",
        ],
      },
      {
        slug: "medium",
        name: "Medium",
        benchmarkId: 687,
        tierNames: [
          "Cinnabar",
          "Vermillion",
          "Saffron",
          "Celadon",
          "Cerulean",
          "Lavender",
          "Indigo",
          "Fuchsia",
        ],
      },
      {
        slug: "hard",
        name: "Hard",
        benchmarkId: 688,
        tierNames: [
          "Wool",
          "Linen",
          "Velvet",
          "Chiffon",
          "Satin",
          "Silk",
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
