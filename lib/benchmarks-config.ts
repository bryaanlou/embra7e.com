export const STEAM_ID = "76561198069972050";
export const EVXL_PROFILE = `https://evxl.app/u/${STEAM_ID}`;

export type BenchmarkConfig = {
  slug: string;
  name: string;
  benchmarkId: number;
  description?: string;
};

export const BENCHMARKS: BenchmarkConfig[] = [
  {
    slug: "voltaic-s5",
    name: "Voltaic S5",
    benchmarkId: 458,
    description: "Intermediate tier",
  },
  {
    slug: "viscose-s2",
    name: "Viscose S2",
    benchmarkId: 2336,
  },
  {
    slug: "viscose-s1",
    name: "Viscose S1",
    benchmarkId: 687,
  },
];

export function getBenchmarkConfig(slug: string): BenchmarkConfig | undefined {
  return BENCHMARKS.find((b) => b.slug === slug);
}
