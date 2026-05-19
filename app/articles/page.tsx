import Link from "next/link";
import { getAllArticles } from "@/lib/articles";

export const metadata = {
  title: "Articles — Bryan Lou",
};

export default function ArticlesPage() {
  const articles = getAllArticles();

  return (
    <div className="space-y-10">
      <h1 className="text-2xl font-semibold tracking-tight">Articles</h1>
      {articles.length === 0 ? (
        <p className="text-neutral-500">Nothing here yet.</p>
      ) : (
        <ul className="space-y-10">
          {articles.map((article) => (
            <li key={article.slug} className="border-b border-neutral-100 pb-10 last:border-0">
              <Link href={`/articles/${article.slug}`} className="group block space-y-2">
                <p className="font-medium text-lg group-hover:opacity-70 transition-opacity">
                  {article.title}
                </p>
                <p className="text-neutral-600 text-sm leading-relaxed">{article.description}</p>
                <div className="flex items-center gap-3 text-xs text-neutral-400">
                  <span>
                    {new Date(article.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                  <span>·</span>
                  <span>{article.readingTime}</span>
                  {article.tags.length > 0 && (
                    <>
                      <span>·</span>
                      <span>{article.tags.join(", ")}</span>
                    </>
                  )}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
