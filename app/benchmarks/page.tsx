import Link from "next/link";
import {
  BENCHMARKS,
  STEAM_ID,
  getDefaultDifficulty,
} from "@/lib/benchmarks-config";
import { getBenchmark } from "@/lib/kovaaks";

export const metadata = {
  title: "Benchmarks — embrace",
};

export const revalidate = 21600;

export default async function BenchmarksIndexPage() {
  const summaries = await Promise.all(
    BENCHMARKS.map(async (b) => {
      const defaultDiff = getDefaultDifficulty(b);
      const data = await getBenchmark(defaultDiff.benchmarkId, STEAM_ID);
      const tierName =
        data && data.overall_rank > 0
          ? defaultDiff.tierNames[data.overall_rank - 1] ??
            `Rank ${data.overall_rank}`
          : "Unranked";
      return { config: b, defaultDiff, data, tierName };
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
        {summaries.map(({ config, defaultDiff, data, tierName }) => (
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
              {data ? (
                <div className="text-right space-y-0.5 shrink-0">
                  <p className="text-sm text-accent font-medium">{tierName}</p>
                  <p className="text-xs font-mono text-muted">
                    {Math.round(data.benchmark_progress).toLocaleString()}
                  </p>
                </div>
              ) : (
                <p className="text-xs text-muted">N/A</p>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
