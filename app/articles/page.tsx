import { getAllArticles } from "@/lib/articles";
import { ArticlesList } from "@/components/ArticlesList";

export const metadata = {
  title: "Articles — embrace",
};

export default function ArticlesPage() {
  const articles = getAllArticles();
  const allTags = Array.from(
    new Set(articles.flatMap((a) => a.tags)),
  ).sort();

  return (
    <div className="max-w-2xl mx-auto space-y-10">
      <h1 className="text-2xl font-semibold tracking-tight">Articles</h1>
      <ArticlesList articles={articles} allTags={allTags} />
    </div>
  );
}
