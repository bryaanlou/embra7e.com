import Link from "next/link";
import { BENCHMARKS, STEAM_ID } from "@/lib/benchmarks-config";
import { getBenchmark } from "@/lib/kovaaks";

export const metadata = {
  title: "Benchmarks — embrace",
};

export const revalidate = 21600;

export default async function BenchmarksIndexPage() {
  const summaries = await Promise.all(
    BENCHMARKS.map(async (b) => ({
      config: b,
      data: await getBenchmark(b.benchmarkId, STEAM_ID),
    })),
  );

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">Benchmarks</h1>
        <p className="text-muted text-sm">
          Live KovaaK&apos;s scores, refreshed every 6 hours.
        </p>
      </header>

      <ul className="space-y-3">
        {summaries.map(({ config, data }) => (
          <li key={config.slug}>
            <Link
              href={`/benchmarks/${config.slug}`}
              className="group flex items-center justify-between gap-4 rounded-lg border border-border bg-surface px-5 py-4 hover:border-accent transition-colors"
            >
              <div className="space-y-1">
                <p className="font-medium group-hover:text-accent transition-colors">
                  {config.name}
                </p>
                {config.description && (
                  <p className="text-xs text-muted">{config.description}</p>
                )}
              </div>
              {data ? (
                <div className="text-right space-y-0.5 shrink-0">
                  <p className="text-sm">
                    Rank{" "}
                    <span className="text-accent font-medium">
                      {data.overall_rank}
                    </span>
                  </p>
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
