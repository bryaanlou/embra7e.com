import { notFound } from "next/navigation";
import Image from "next/image";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getArticleBySlug, getArticleSlugs } from "@/lib/articles";
import remarkGfm from "remark-gfm";

export async function generateStaticParams() {
  return getArticleSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  try {
    const article = getArticleBySlug(slug);
    return { title: `${article.title} — Bryan Lou`, description: article.description };
  } catch {
    return {};
  }
}

const mdxComponents = {
  img: (props: { src?: string; alt?: string }) => (
    <span className="block my-8">
      <Image
        src={props.src ?? ""}
        alt={props.alt ?? ""}
        width={800}
        height={500}
        className="rounded-lg w-full h-auto"
      />
    </span>
  ),
};

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  let article;
  try {
    article = getArticleBySlug(slug);
  } catch {
    notFound();
  }

  return (
    <article className="space-y-10">
      <header className="space-y-4">
        {article.coverImage && (
          <div className="relative w-full aspect-video rounded-lg overflow-hidden">
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
          <div className="flex items-center gap-3 text-sm text-neutral-400">
            <span>
              {new Date(article.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
            <span>·</span>
            <span>{article.readingTime}</span>
          </div>
        </div>
      </header>

      <div className="prose prose-neutral max-w-none">
        <MDXRemote
          source={article.content}
          components={mdxComponents}
          options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }}
        />
      </div>
    </article>
  );
}
