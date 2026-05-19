import Link from "next/link";
import { notFound } from "next/navigation";
import {
  BENCHMARKS,
  STEAM_ID,
  getBenchmarkConfig,
} from "@/lib/benchmarks-config";
import { getBenchmark, normalizedScore, tierForScore } from "@/lib/kovaaks";

export const dynamicParams = false;
export const revalidate = 21600;

export function generateStaticParams() {
  return BENCHMARKS.map((b) => ({ slug: b.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const config = getBenchmarkConfig(slug);
  if (!config) return {};
  return { title: `${config.name} — embrace` };
}

const TIER_COLORS = ["#7a8294", "#c9ad8f", "#d4d4d4", "#fbbf24", "#a3e635"];

function nextTarget(score: number, thresholds: number[]): number | null {
  for (const t of thresholds) {
    if (t > score) return t;
  }
  return null;
}

export default async function BenchmarkDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const config = getBenchmarkConfig(slug);
  if (!config) notFound();

  const data = await getBenchmark(config.benchmarkId, STEAM_ID);
  const fetchedAt = new Date();

  return (
    <div className="space-y-10">
      <Link
        href="/benchmarks"
        className="inline-block text-xs text-muted hover:text-accent transition-colors"
      >
        ← All benchmarks
      </Link>

      <header className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">{config.name}</h1>
        {config.description && (
          <p className="text-muted text-sm">{config.description}</p>
        )}
        <p className="text-xs text-muted/60">
          Last fetched{" "}
          <time dateTime={fetchedAt.toISOString()}>
            {fetchedAt.toLocaleString("en-US", {
              dateStyle: "medium",
              timeStyle: "short",
            })}
          </time>
          .
        </p>
      </header>

      {!data ? (
        <p className="text-muted">Data unavailable.</p>
      ) : (
        <>
          <section className="flex items-baseline justify-between gap-4 rounded-lg border border-border bg-surface px-5 py-4">
            <div>
              <p className="text-xs uppercase tracking-widest text-muted">
                Overall rank
              </p>
              <p className="text-2xl font-semibold text-accent">
                {data.overall_rank}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs uppercase tracking-widest text-muted">
                Progress
              </p>
              <p className="text-lg font-mono">
                {Math.round(data.benchmark_progress).toLocaleString()}
              </p>
            </div>
          </section>

          {Object.entries(data.categories).map(([categoryName, category]) => (
            <div key={categoryName} className="space-y-2">
              <div className="flex items-center justify-between text-xs uppercase tracking-widest text-muted">
                <span>{categoryName}</span>
                <span>Rank {category.category_rank}</span>
              </div>
              <ul className="rounded-lg border border-border bg-surface divide-y divide-border">
                {Object.entries(category.scenarios).map(
                  ([scenarioName, scenario]) => {
                    const score = normalizedScore(scenario.score);
                    const tier = tierForScore(
                      scenario.score,
                      scenario.rank_maxes,
                    );
                    const tierColor =
                      TIER_COLORS[Math.min(tier, TIER_COLORS.length - 1)];
                    const next = nextTarget(score, scenario.rank_maxes);
                    return (
                      <li
                        key={scenarioName}
                        className="flex items-center justify-between gap-4 px-4 py-3 text-sm"
                      >
                        <span className="text-fg truncate">{scenarioName}</span>
                        <div className="flex items-baseline gap-3 shrink-0">
                          {next !== null && (
                            <span className="text-xs font-mono text-muted/60">
                              next {next}
                            </span>
                          )}
                          <span
                            className="font-mono font-medium tabular-nums"
                            style={{ color: tierColor }}
                          >
                            {score}
                          </span>
                        </div>
                      </li>
                    );
                  },
                )}
              </ul>
            </div>
          ))}
        </>
      )}
    </div>
  );
}
