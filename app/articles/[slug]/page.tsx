import { notFound } from "next/navigation";
import Image from "next/image";
import { getArticleBySlug, getArticleSlugs } from "@/lib/articles";

export const dynamicParams = false;

export function generateStaticParams() {
  return getArticleSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  try {
    const article = getArticleBySlug(slug);
    return {
      title: `${article.title} — embrace`,
      description: article.description,
    };
  } catch {
    return {};
  }
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const slugs = getArticleSlugs();
  if (!slugs.includes(slug)) notFound();

  const article = getArticleBySlug(slug);
  const { default: Post } = await import(`@/content/articles/${slug}.mdx`);

  const accentStyle = article.accentColor
    ? ({ "--color-accent": article.accentColor } as React.CSSProperties)
    : undefined;

  const cw = article.coverImageWidth;
  const ch = article.coverImageHeight;
  const isPortrait = cw && ch ? ch > cw : false;
  const coverAspectStyle: React.CSSProperties | undefined =
    cw && ch ? { aspectRatio: `${cw} / ${ch}` } : undefined;

  return (
    <article
      className="page-enter max-w-2xl mx-auto space-y-10"
      style={accentStyle}
    >
      <header
        className={
          isPortrait
            ? "flex flex-col sm:flex-row sm:gap-6 sm:items-center space-y-4 sm:space-y-0"
            : "space-y-4"
        }
      >
        {article.coverImage && (
          <a
            href={article.coverImage}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Open ${article.title} cover in new tab`}
            style={coverAspectStyle}
            className={`relative block rounded-lg ring-1 ring-accent/40 overflow-hidden cursor-zoom-in ${
              isPortrait
                ? "w-full max-w-xs sm:w-96 sm:shrink-0"
                : "w-full max-h-[480px] mx-auto"
            }`}
          >
            <Image
              src={article.coverImage}
              alt={article.title}
              fill
              className="object-cover"
              priority
              unoptimized
            />
          </a>
        )}
        <div className={isPortrait ? "flex-1 space-y-2" : "space-y-2"}>
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-3xl font-semibold tracking-tight">
              {article.title}
            </h1>
            {article.wip && (
              <span className="text-xs uppercase tracking-widest px-2 py-0.5 rounded border border-accent/40 text-accent font-medium">
                WIP
              </span>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted">
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

      {article.wip && (
        <div className="rounded-lg border border-accent/30 bg-accent/5 px-4 py-3 text-sm text-muted">
          <span className="text-accent font-medium">Work in progress.</span>{" "}
          This article is still being written — content may change.
        </div>
      )}

      <div className="prose max-w-none">
        <Post />
      </div>
    </article>
  );
}
