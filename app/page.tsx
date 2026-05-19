import Link from "next/link";
import { getAllArticles } from "@/lib/articles";
import { PageEnter } from "@/components/PageEnter";

export default function Home() {
  const recent = getAllArticles().slice(0, 3);

  return (
    <PageEnter className="max-w-2xl mx-auto space-y-14 rounded-2xl border border-border/60 bg-surface/30 p-8 sm:p-12">
      <section className="space-y-4">
        <h1 className="text-3xl font-semibold tracking-tight">embrace</h1>
        <p className="text-muted leading-relaxed">
          Reviews and notes on peripherals, aim training, and whatever else is
          on my mind.
        </p>
      </section>

      {recent.length > 0 && (
        <section className="space-y-6">
          <h2 className="text-sm font-medium uppercase tracking-widest text-accent">
            Recent
          </h2>
          <ul className="page-enter space-y-6">
            {recent.map((article) => (
              <li key={article.slug}>
                <Link href={`/articles/${article.slug}`} className="group block space-y-1">
                  <p className="font-medium group-hover:text-accent transition-colors">
                    {article.title}
                  </p>
                  <p className="text-sm text-muted">{article.description}</p>
                  <p className="text-xs text-muted/70">
                    {new Date(article.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}{" "}
                    · {article.readingTime}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
          <Link
            href="/articles"
            className="text-sm text-muted hover:text-accent transition-colors"
          >
            All articles →
          </Link>
        </section>
      )}
    </PageEnter>
  );
}
