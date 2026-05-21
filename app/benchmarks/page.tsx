import {
  BENCHMARKS,
  STEAM_ID,
  tierAt,
} from "@/lib/benchmarks-config";
import { getBenchmark } from "@/lib/kovaaks";
import { getRankForBenchmark } from "@/lib/rank";
import { BenchmarkCard } from "@/components/BenchmarkCard";
import { PageEnter } from "@/components/PageEnter";

export const metadata = {
  title: "Benchmarks — embrace",
};

export const revalidate = 60;

export default async function BenchmarksIndexPage() {
  const summaries = await Promise.all(
    BENCHMARKS.map(async (b) => {
      const difficulties = await Promise.all(
        b.difficulties.map(async (d) => {
          const data = await getBenchmark(d.benchmarkId, STEAM_ID);
          const rank = await getRankForBenchmark(
            b.rankingMethod,
            d,
            STEAM_ID,
            data,
          );
          return {
            slug: d.slug,
            name: d.name,
            rankName: rank?.rankName ?? "Unranked",
            rankColor: rank ? tierAt(d, rank.rankIndex)?.color : undefined,
            complete: rank?.complete ?? false,
          };
        }),
      );
      return { config: b, difficulties };
    }),
  );

  return (
    <PageEnter className="max-w-2xl mx-auto space-y-8">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">Benchmarks</h1>
        <p className="text-muted text-sm">
          My current progress across a few KovaaK&apos;s aim training
          benchmarks. Refreshed every minute.
        </p>
      </header>

      <ul className="page-enter space-y-3">
        {summaries.map(({ config, difficulties }) => (
          <li key={config.slug}>
            <BenchmarkCard
              slug={config.slug}
              name={config.name}
              defaultDifficulty={config.defaultDifficulty}
              difficulties={difficulties}
            />
          </li>
        ))}
      </ul>
    </PageEnter>
  );
}
