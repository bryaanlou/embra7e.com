import fs from "fs";
import path from "path";
import { execFileSync } from "child_process";
import matter from "gray-matter";
import readingTime from "reading-time";
import { imageSize } from "image-size";
import GithubSlugger from "github-slugger";

const articlesDir = path.join(process.cwd(), "content/articles");

function lastGitChange(filePath: string): string | undefined {
  try {
    const iso = execFileSync(
      "git",
      ["log", "-1", "--format=%cI", "--", filePath],
      { encoding: "utf-8", stdio: ["ignore", "pipe", "ignore"] },
    ).trim();
    return iso || undefined;
  } catch {
    return undefined;
  }
}

/**
 * Extract the local calendar date (YYYY-MM-DD) from a git ISO timestamp.
 * Git's %cI format preserves the committer's timezone offset, so the first
 * 10 chars are the committer's local date — which is what we want to
 * compare against the frontmatter's calendar-date string.
 */
function gitLocalDate(iso: string): string {
  return iso.slice(0, 10);
}

export type TocItem = {
  level: 2 | 3;
  text: string;
  slug: string;
};

export type ArticleMeta = {
  slug: string;
  title: string;
  date: string;
  updated?: string;
  description: string;
  tags: string[];
  readingTime: string;
  coverImage?: string;
  coverImageWidth?: number;
  coverImageHeight?: number;
  accentColor?: string;
  wip?: boolean;
  toc: TocItem[];
};

/**
 * Pull h2/h3 headings out of the markdown body so we can render a
 * table-of-contents that links to the headings rehype-slug auto-ids.
 * Matches the same slugger (github-slugger) that rehype-slug uses
 * internally, so slugs stay in sync between this list and the DOM.
 */
function extractToc(content: string): TocItem[] {
  const slugger = new GithubSlugger();
  const items: TocItem[] = [];
  for (const line of content.split("\n")) {
    const match = /^(##{1,2})\s+(.+?)\s*$/.exec(line);
    if (!match) continue;
    const level = (match[1].length === 2 ? 2 : 3) as 2 | 3;
    const text = match[2].trim();
    items.push({ level, text, slug: slugger.slug(text) });
  }
  return items;
}

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

  const gitModified = lastGitChange(filePath);
  const gitDate = gitModified ? gitLocalDate(gitModified) : undefined;
  const autoUpdated =
    gitDate && data.date && gitDate > data.date ? gitDate : undefined;

  return {
    slug,
    title: data.title ?? "Untitled",
    date: data.date ?? "",
    updated: data.updated ?? autoUpdated,
    description: data.description ?? "",
    tags: data.tags ?? [],
    coverImage: data.coverImage,
    coverImageWidth: dim?.width,
    coverImageHeight: dim?.height,
    accentColor: data.accentColor,
    wip: data.wip === true,
    readingTime: stats.text,
    toc: extractToc(content),
  };
}

export function getAllArticles(): ArticleMeta[] {
  return getArticleSlugs()
    .map((slug) => getArticleBySlug(slug))
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}
