import Link from "next/link";
import {
  BENCHMARKS,
  STEAM_ID,
  getDefaultDifficulty,
} from "@/lib/benchmarks-config";
import { getBenchmarkRank } from "@/lib/rank";

export const metadata = {
  title: "Benchmarks — embrace",
};

export const revalidate = 21600;

export default async function BenchmarksIndexPage() {
  const summaries = await Promise.all(
    BENCHMARKS.map(async (b) => {
      const defaultDiff = getDefaultDifficulty(b);
      const rank = await getBenchmarkRank(defaultDiff.benchmarkId, STEAM_ID);
      return {
        config: b,
        defaultDiff,
        rankName: rank?.rankName ?? "Unranked",
      };
    }),
  );

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">Benchmarks</h1>
        <p className="text-muted text-sm">
          Live KovaaK&apos;s scores, refreshed every 6 hours.
        </p>
      </header>

      <ul className="space-y-3">
        {summaries.map(({ config, defaultDiff, rankName }) => (
          <li key={config.slug}>
            <Link
              href={`/benchmarks/${config.slug}/${config.defaultDifficulty}`}
              className="group flex items-center justify-between gap-4 rounded-lg border border-border bg-surface px-5 py-4 hover:border-accent transition-colors"
            >
              <div className="space-y-1">
                <p className="font-medium group-hover:text-accent transition-colors">
                  {config.name}
                </p>
                <p className="text-xs text-muted">
                  Showing {defaultDiff.name}
                </p>
              </div>
              <p className="text-sm text-accent font-medium shrink-0">
                {rankName}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
