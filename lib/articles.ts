import fs from "fs";
import path from "path";
import matter from "gray-matter";
import readingTime from "reading-time";
import { imageSize } from "image-size";

const articlesDir = path.join(process.cwd(), "content/articles");

export type ArticleMeta = {
  slug: string;
  title: string;
  date: string;
  description: string;
  tags: string[];
  readingTime: string;
  coverImage?: string;
  coverImageWidth?: number;
  coverImageHeight?: number;
  accentColor?: string;
  wip?: boolean;
};

export function getArticleSlugs(): string[] {
  return fs
    .readdirSync(articlesDir)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => f.replace(/\.mdx$/, ""));
}

function readCoverDimensions(
  coverImage: string | undefined,
): { width: number; height: number } | undefined {
  if (!coverImage) return undefined;
  const fsPath = path.join(process.cwd(), "public", coverImage);
  if (!fs.existsSync(fsPath)) return undefined;
  try {
    const buffer = fs.readFileSync(fsPath);
    const dim = imageSize(buffer);
    if (dim.width && dim.height) {
      return { width: dim.width, height: dim.height };
    }
  } catch {
    /* ignore */
  }
  return undefined;
}

export function getArticleBySlug(slug: string): ArticleMeta {
  const filePath = path.join(articlesDir, `${slug}.mdx`);
  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);
  const stats = readingTime(content);
  const dim = readCoverDimensions(data.coverImage);

  return {
    slug,
    title: data.title ?? "Untitled",
    date: data.date ?? "",
    description: data.description ?? "",
    tags: data.tags ?? [],
    coverImage: data.coverImage,
    coverImageWidth: dim?.width,
    coverImageHeight: dim?.height,
    accentColor: data.accentColor,
    wip: data.wip === true,
    readingTime: stats.text,
  };
}

export function getAllArticles(): ArticleMeta[] {
  return getArticleSlugs()
    .map((slug) => getArticleBySlug(slug))
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}
