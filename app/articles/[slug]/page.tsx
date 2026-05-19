import { notFound } from "next/navigation";
import Image from "next/image";
import { getArticleBySlug, getArticleSlugs } from "@/lib/articles";

export const dynamicParams = false;

export function generateStaticParams() {
  return getArticleSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  try {
    const article = getArticleBySlug(slug);
    return { title: `${article.title} — embrace`, description: article.description };
  } catch {
    return {};
  }
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const slugs = getArticleSlugs();
  if (!slugs.includes(slug)) notFound();

  const article = getArticleBySlug(slug);
  const { default: Post } = await import(`@/content/articles/${slug}.mdx`);

  const accentStyle = article.accentColor
    ? ({ "--color-accent": article.accentColor } as React.CSSProperties)
    : undefined;

  return (
    <article className="page-enter max-w-2xl mx-auto space-y-10" style={accentStyle}>
      <header className="space-y-4">
        {article.coverImage && (
          <div className="relative w-full aspect-video rounded-lg overflow-hidden ring-1 ring-accent/40">
            <Image
              src={article.coverImage}
              alt={article.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight">{article.title}</h1>
          <div className="flex items-center gap-3 text-sm text-muted">
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
                <span className="text-accent">{article.tags.join(", ")}</span>
              </>
            )}
          </div>
        </div>
      </header>

      <div className="prose max-w-none">
        <Post />
      </div>
    </article>
  );
}
