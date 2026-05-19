export const metadata = {
  title: "Benchmarks — embrace",
};

type Scenario = { name: string; score: number };
type Benchmark = {
  name: string;
  rank: string;
  url: string;
  scenarios: Scenario[];
};

const lastUpdated = "2026-05-18";

const benchmarks: Benchmark[] = [
  {
    name: "Voltaic S5",
    rank: "TBD",
    url: "https://voltaic.gg/benchmarks/season5",
    scenarios: [
      { name: "Pasu Track Smoothbot", score: 0 },
      { name: "B180T", score: 0 },
      { name: "Tile Frenzy Mini Strafing", score: 0 },
    ],
  },
  {
    name: "Viscose S2",
    rank: "TBD",
    url: "https://viscose.gg",
    scenarios: [
      { name: "Scenario 1", score: 0 },
      { name: "Scenario 2", score: 0 },
    ],
  },
];

export default function BenchmarksPage() {
  return (
    <div className="space-y-10">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">Benchmarks</h1>
        <p className="text-muted text-sm">
          Snapshot of my current KovaaK&apos;s aim training scores. Last updated{" "}
          <time dateTime={lastUpdated}>
            {new Date(lastUpdated).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </time>
          .
        </p>
      </header>

      {benchmarks.map((benchmark) => (
        <section key={benchmark.name} className="space-y-4">
          <div className="flex items-baseline justify-between gap-4">
            <a
              href={benchmark.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-lg font-medium hover:text-accent transition-colors"
            >
              {benchmark.name} →
            </a>
            <span className="text-sm text-accent">{benchmark.rank}</span>
          </div>
          <ul className="divide-y divide-border rounded-lg border border-border bg-surface">
            {benchmark.scenarios.map((scenario) => (
              <li
                key={scenario.name}
                className="flex items-center justify-between px-4 py-3 text-sm"
              >
                <span className="text-fg">{scenario.name}</span>
                <span className="font-mono text-muted">
                  {scenario.score === 0 ? "—" : scenario.score}
                </span>
              </li>
            ))}
          </ul>
        </section>
      ))}

      <p className="text-xs text-muted/70">
        Edit{" "}
        <code className="bg-surface px-1.5 py-0.5 rounded">app/benchmarks/page.tsx</code>{" "}
        to update scores. Set <code className="bg-surface px-1.5 py-0.5 rounded">lastUpdated</code>{" "}
        when you refresh the data.
      </p>
    </div>
  );
}
