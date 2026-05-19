import { getBenchmark, normalizedScore, tierForScore } from "@/lib/kovaaks";

export const metadata = {
  title: "Benchmarks — embrace",
};

export const revalidate = 21600;

const STEAM_ID = "76561198069972050";
const EVXL_PROFILE = `https://evxl.app/u/${STEAM_ID}`;

const BENCHMARKS = [
  { name: "Voltaic S5 (Intermediate)", id: 458 },
  { name: "Viscose S2", id: 2336 },
];

const TIER_COLORS = ["#7a8294", "#c9ad8f", "#d4d4d4", "#fbbf24", "#a3e635"];

function nextTarget(score: number, thresholds: number[]): number | null {
  for (const t of thresholds) {
    if (t > score) return t;
  }
  return null;
}

export default async function BenchmarksPage() {
  const results = await Promise.all(
    BENCHMARKS.map(async (b) => ({
      meta: b,
      data: await getBenchmark(b.id, STEAM_ID),
    })),
  );

  const fetchedAt = new Date();

  return (
    <div className="space-y-12">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">Benchmarks</h1>
        <p className="text-muted text-sm">
          Live KovaaK&apos;s scores, refreshed every 6 hours.{" "}
          <a
            href={EVXL_PROFILE}
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent hover:underline"
          >
            Full breakdown on evxl →
          </a>
        </p>
        <p className="text-xs text-muted/60">
          Last fetched{" "}
          <time dateTime={fetchedAt.toISOString()}>
            {fetchedAt.toLocaleString("en-US", {
              dateStyle: "medium",
              timeStyle: "short",
            })}
          </time>
        </p>
      </header>

      {results.map(({ meta, data }) => (
        <section key={meta.id} className="space-y-6">
          <div className="flex items-baseline justify-between gap-4 pb-2 border-b border-border">
            <h2 className="text-lg font-medium">{meta.name}</h2>
            {data ? (
              <div className="text-sm text-muted flex items-baseline gap-3">
                <span>
                  Rank{" "}
                  <span className="text-accent font-medium">{data.overall_rank}</span>
                </span>
                <span className="text-muted/50">·</span>
                <span className="font-mono text-xs">
                  {Math.round(data.benchmark_progress).toLocaleString()}
                </span>
              </div>
            ) : (
              <div className="text-sm text-muted">Data unavailable</div>
            )}
          </div>

          {data &&
            Object.entries(data.categories).map(([categoryName, category]) => (
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
                        TIER_COLORS[
                          Math.min(tier, TIER_COLORS.length - 1)
                        ];
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
        </section>
      ))}
    </div>
  );
}
