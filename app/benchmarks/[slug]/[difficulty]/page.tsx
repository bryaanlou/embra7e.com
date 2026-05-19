import Link from "next/link";
import { notFound } from "next/navigation";
import {
  BENCHMARKS,
  STEAM_ID,
  getBenchmarkConfig,
  getDifficulty,
} from "@/lib/benchmarks-config";
import { getBenchmark, normalizedScore } from "@/lib/kovaaks";

export const dynamicParams = false;
export const revalidate = 21600;

export function generateStaticParams() {
  return BENCHMARKS.flatMap((b) =>
    b.difficulties.map((d) => ({ slug: b.slug, difficulty: d.slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; difficulty: string }>;
}) {
  const { slug, difficulty: diffSlug } = await params;
  const config = getBenchmarkConfig(slug);
  if (!config) return {};
  const difficulty = getDifficulty(config, diffSlug);
  if (!difficulty) return {};
  return { title: `${config.name} ${difficulty.name} — embrace` };
}

export default async function BenchmarkDifficultyPage({
  params,
}: {
  params: Promise<{ slug: string; difficulty: string }>;
}) {
  const { slug, difficulty: diffSlug } = await params;
  const config = getBenchmarkConfig(slug);
  if (!config) notFound();
  const difficulty = getDifficulty(config, diffSlug);
  if (!difficulty) notFound();

  const data = await getBenchmark(difficulty.benchmarkId, STEAM_ID);
  const fetchedAt = new Date();

  const overallTierName =
    data && data.overall_rank > 0
      ? difficulty.tierNames[data.overall_rank - 1] ?? `Rank ${data.overall_rank}`
      : "Unranked";

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <Link
        href="/benchmarks"
        className="inline-block text-xs text-muted hover:text-accent transition-colors"
      >
        ← All benchmarks
      </Link>

      <header className="space-y-4">
        <h1 className="text-2xl font-semibold tracking-tight">{config.name}</h1>
        <div className="flex items-center gap-1 border-b border-border">
          {config.difficulties.map((d) => {
            const active = d.slug === diffSlug;
            return (
              <Link
                key={d.slug}
                href={`/benchmarks/${slug}/${d.slug}`}
                className={`px-4 py-2 text-sm transition-colors border-b-2 -mb-px ${
                  active
                    ? "border-accent text-accent"
                    : "border-transparent text-muted hover:text-fg"
                }`}
              >
                {d.name}
              </Link>
            );
          })}
        </div>
      </header>

      {!data ? (
        <p className="text-muted">Data unavailable for this difficulty.</p>
      ) : (
        <>
          <section className="flex items-baseline justify-between gap-4 rounded-lg border border-border bg-surface px-5 py-4">
            <div>
              <p className="text-xs uppercase tracking-widest text-muted">
                Overall rank
              </p>
              <p className="text-2xl font-semibold text-accent">
                {overallTierName}
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

          <div className="overflow-x-auto rounded-lg border border-border bg-surface">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-surface-hover/30">
                  <th className="px-2 py-3 w-10"></th>
                  <th className="px-4 py-3 text-left font-medium text-muted text-xs uppercase tracking-widest">
                    Scenario
                  </th>
                  <th className="px-4 py-3 text-right font-medium text-muted text-xs uppercase tracking-widest">
                    Score
                  </th>
                  {difficulty.tierNames.map((tier) => (
                    <th
                      key={tier}
                      className="px-3 py-3 text-center font-medium text-muted text-xs uppercase tracking-widest whitespace-nowrap"
                    >
                      {tier}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Object.entries(data.categories).flatMap(
                  ([categoryName, category]) => {
                    const scenarios = Object.entries(category.scenarios);
                    return scenarios.map(([scenarioName, scenario], i) => {
                      const score = normalizedScore(scenario.score);
                      return (
                        <tr
                          key={`${categoryName}-${scenarioName}`}
                          className="border-b border-border/40 last:border-0"
                        >
                          {i === 0 && (
                            <td
                              rowSpan={scenarios.length}
                              className="border-r border-border align-middle w-10"
                            >
                              <div
                                className="text-xs uppercase tracking-widest text-muted text-center"
                                style={{
                                  writingMode: "vertical-rl",
                                  transform: "rotate(180deg)",
                                  whiteSpace: "nowrap",
                                  margin: "0 auto",
                                }}
                              >
                                {categoryName}
                              </div>
                            </td>
                          )}
                          <td className="px-4 py-2 text-fg whitespace-nowrap">
                            {scenarioName}
                          </td>
                          <td className="px-4 py-2 text-right font-mono tabular-nums text-fg">
                            {score}
                          </td>
                          {scenario.rank_maxes.map((threshold, ti) => {
                            const achieved = scenario.scenario_rank > ti;
                            return (
                              <td
                                key={ti}
                                className={`px-3 py-2 text-center font-mono tabular-nums text-xs ${
                                  achieved
                                    ? "bg-accent/15 text-fg"
                                    : "text-muted/50"
                                }`}
                              >
                                {threshold}
                              </td>
                            );
                          })}
                        </tr>
                      );
                    });
                  },
                )}
              </tbody>
            </table>
          </div>

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
        </>
      )}
    </div>
  );
}
