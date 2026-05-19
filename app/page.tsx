import Link from "next/link";
import { getAllArticles } from "@/lib/articles";

export default function Home() {
  const recent = getAllArticles().slice(0, 3);

  return (
    <div className="space-y-16">
      <section className="space-y-4">
        <h1 className="text-3xl font-semibold tracking-tight">embra7e</h1>
        <p className="text-neutral-600 leading-relaxed">
          Reviews and notes on peripherals, gear, and whatever else is on my mind.
        </p>
      </section>

      {recent.length > 0 && (
        <section className="space-y-6">
          <h2 className="text-sm font-medium uppercase tracking-widest text-neutral-400">
            Recent
          </h2>
          <ul className="space-y-8">
            {recent.map((article) => (
              <li key={article.slug}>
                <Link href={`/articles/${article.slug}`} className="group block space-y-1">
                  <p className="font-medium group-hover:opacity-70 transition-opacity">
                    {article.title}
                  </p>
                  <p className="text-sm text-neutral-500">{article.description}</p>
                  <p className="text-xs text-neutral-400">
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
            className="text-sm text-neutral-500 hover:text-neutral-900 transition-colors"
          >
            All articles →
          </Link>
        </section>
      )}
    </div>
  );
}
