import Link from "next/link";
import Image from "next/image";
import { getAllArticles } from "@/lib/articles";
import { PageEnter } from "@/components/PageEnter";

export default function Home() {
  const recent = getAllArticles().slice(0, 3);

  return (
    <PageEnter className="max-w-2xl mx-auto space-y-14 rounded-2xl border border-border/60 bg-surface/30 p-8 sm:p-12">
      <section className="space-y-4">
        <h1 className="text-3xl font-semibold tracking-tight">embrace</h1>
        <p className="text-muted leading-relaxed">
          Reviews and thought dumps on peripherals, aim training, and whatever
          else is on my mind.
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
                <Link
                  href={`/articles/${article.slug}`}
                  className="group flex gap-4"
                >
                  {article.coverImage && (
                    <div className="relative w-16 sm:w-20 aspect-square shrink-0 rounded-lg overflow-hidden ring-1 ring-border bg-surface/40">
                      <Image
                        src={article.coverImage}
                        alt={article.title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        sizes="(min-width: 640px) 80px, 64px"
                      />
                    </div>
                  )}
                  <div className="flex-1 min-w-0 space-y-1">
                    <p className="font-medium group-hover:text-accent transition-colors">
                      {article.title}
                    </p>
                    <p className="text-sm text-muted">{article.description}</p>
                    <p className="text-xs text-muted/70">
                      {new Date(article.date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        timeZone: "UTC",
                      })}{" "}
                      · {article.readingTime}
                    </p>
                  </div>
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
