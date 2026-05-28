import Link from "next/link";
import { notFound } from "next/navigation";
import { LocalTime } from "@/components/LocalTime";
import { RememberDifficulty } from "@/components/RememberDifficulty";
import { PageEnter } from "@/components/PageEnter";
import { DifficultyTabs } from "@/components/DifficultyTabs";
import {
  BENCHMARKS,
  STEAM_ID,
  getBenchmarkConfig,
  getDifficulty,
  tierAt,
} from "@/lib/benchmarks-config";
import { getBenchmark, normalizedScore } from "@/lib/kovaaks";
import { getRankForBenchmark } from "@/lib/rank";

export const dynamicParams = false;
export const dynamic = "force-dynamic";

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
  const rank = await getRankForBenchmark(
    config.rankingMethod,
    difficulty,
    STEAM_ID,
    data,
  );
  const fetchedAt = new Date();

  const overallTierName = rank?.rankName ?? "Unranked";
  const completeSuffix = rank?.complete ? " Complete" : "";
  const overallColor = rank ? tierAt(difficulty, rank.rankIndex)?.color : undefined;

  return (
    <PageEnter className="max-w-7xl mx-auto space-y-8">
      <RememberDifficulty benchmarkSlug={slug} difficultySlug={diffSlug} />
      <Link
        href="/benchmarks"
        className="inline-block text-xs text-muted hover:text-accent transition-colors"
      >
        ← All benchmarks
      </Link>

      <header className="space-y-4">
        <h1 className="text-2xl font-semibold tracking-tight">{config.name}</h1>
        <DifficultyTabs
          benchmarkSlug={slug}
          difficulties={config.difficulties.map((d) => ({
            slug: d.slug,
            name: d.name,
          }))}
          active={diffSlug}
        />
      </header>

      {!data ? (
        <p className="text-muted">Data unavailable for this difficulty.</p>
      ) : (
        <div key={diffSlug} className="bench-content-swap space-y-8">
          <section className="rounded-lg border border-border bg-surface px-5 py-4">
            <p className="text-xs uppercase tracking-widest text-muted">
              Overall rank
            </p>
            <p
              className="text-2xl font-semibold"
              style={{ color: overallColor ?? "var(--color-accent)" }}
            >
              {overallTierName}
              {completeSuffix && (
                <span className="text-sm text-muted ml-2 font-normal tracking-wide">
                  {completeSuffix.trim()}
                </span>
              )}
            </p>
          </section>

          <div className="overflow-x-auto rounded-[2px] border border-border bg-surface">
            <table
              className="w-full text-sm table-fixed lg:!min-w-0"
              style={{
                minWidth: `${40 + 288 + 80 + difficulty.tiers.length * 130}px`,
              }}
            >
              <colgroup>
                <col style={{ width: "2.5rem" }} />
                <col style={{ width: "30%" }} />
                <col style={{ width: "5rem" }} />
                {difficulty.tiers.map((tier) => (
                  <col key={tier.name} />
                ))}
              </colgroup>
              <thead>
                <tr className="border-b border-border bg-surface-hover/30">
                  <th className="px-2 py-3 w-10"></th>
                  <th className="px-4 py-3 text-left font-medium text-muted text-xs uppercase tracking-widest">
                    Scenario
                  </th>
                  <th className="px-4 py-3 text-right font-medium text-muted text-xs uppercase tracking-widest">
                    Score
                  </th>
                  {difficulty.tiers.map((tier) => (
                    <th
                      key={tier.name}
                      className="px-3 py-3 text-center font-medium text-xs uppercase tracking-widest whitespace-nowrap shadow-[inset_1px_0_0_0_var(--color-border)]"
                      style={{ color: tier.color }}
                    >
                      {tier.name}
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
                      const scoreColor = tierAt(
                        difficulty,
                        scenario.scenario_rank,
                      )?.color;
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
                          <td
                            className="px-4 py-2 text-right tabular-nums"
                            style={{
                              color: scoreColor ?? "var(--color-fg)",
                            }}
                          >
                            {score}
                          </td>
                          {scenario.rank_maxes.map((threshold, ti) => {
                            const prev =
                              ti > 0 ? scenario.rank_maxes[ti - 1] : 0;
                            const span = threshold - prev;
                            const fillPct =
                              score >= threshold
                                ? 100
                                : span > 0
                                  ? Math.max(0, ((score - prev) / span) * 100)
                                  : 0;
                            const isFull = fillPct >= 100;
                            const tint = scoreColor ?? "var(--color-accent)";
                            const fillColor = `color-mix(in oklab, ${tint} 65%, transparent)`;
                            return (
                              <td
                                key={ti}
                                className={`relative px-3 py-2 text-center tabular-nums text-xs shadow-[inset_1px_0_0_0_var(--color-border)] ${
                                  fillPct > 0 ? "text-fg" : "text-muted/50"
                                }`}
                                style={isFull ? { background: fillColor } : undefined}
                              >
                                {!isFull && fillPct > 0 && (
                                  <span
                                    aria-hidden
                                    className="absolute top-0 bottom-0 left-px pointer-events-none rounded-r-[2px]"
                                    style={{
                                      width: `calc(${fillPct}% - 1px)`,
                                      background: fillColor,
                                    }}
                                  />
                                )}
                                <span className="relative">{threshold}</span>
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
            Last fetched <LocalTime iso={fetchedAt.toISOString()} />.
          </p>
        </div>
      )}
    </PageEnter>
  );
}
