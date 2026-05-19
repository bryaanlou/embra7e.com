"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import type { ArticleMeta } from "@/lib/articles";

type Props = {
  articles: ArticleMeta[];
  allTags: string[];
};

export function ArticlesList({ articles, allTags }: Props) {
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const filtered = activeTag
    ? articles.filter((a) => a.tags.includes(activeTag))
    : articles;

  return (
    <div className="space-y-8">
      {allTags.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <TagChip
            label="All"
            active={!activeTag}
            onClick={() => setActiveTag(null)}
            count={articles.length}
          />
          {allTags.map((tag) => {
            const count = articles.filter((a) => a.tags.includes(tag)).length;
            return (
              <TagChip
                key={tag}
                label={tag}
                active={activeTag === tag}
                onClick={() => setActiveTag(tag)}
                count={count}
              />
            );
          })}
        </div>
      )}

      {filtered.length === 0 ? (
        <p className="text-muted">
          {activeTag ? `No articles tagged "${activeTag}" yet.` : "Nothing here yet."}
        </p>
      ) : (
        <ul className="space-y-10">
          {filtered.map((article) => (
            <li
              key={article.slug}
              className="border-b border-border pb-10 last:border-0"
            >
              <Link
                href={`/articles/${article.slug}`}
                className="group flex gap-4 sm:gap-5"
              >
                {article.coverImage && (
                  <div className="relative w-24 sm:w-40 aspect-video shrink-0 rounded-lg overflow-hidden ring-1 ring-border">
                    <Image
                      src={article.coverImage}
                      alt={article.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      sizes="(min-width: 640px) 160px, 96px"
                    />
                  </div>
                )}
                <div className="flex-1 min-w-0 space-y-2">
                  <p className="font-medium text-lg group-hover:text-accent transition-colors">
                    {article.title}
                  </p>
                  <p className="text-muted text-sm leading-relaxed">
                    {article.description}
                  </p>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted/70">
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
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

type ChipProps = {
  label: string;
  active: boolean;
  count: number;
  onClick: () => void;
};

function TagChip({ label, active, count, onClick }: ChipProps) {
  return (
    <button
      onClick={onClick}
      className={`group flex items-center gap-1.5 px-3 py-1 text-xs uppercase tracking-widest rounded-full border transition-colors ${
        active
          ? "bg-accent/15 text-accent border-accent"
          : "text-muted border-border hover:text-fg hover:border-muted"
      }`}
    >
      <span>{label}</span>
      <span
        className={`text-[10px] tabular-nums ${
          active ? "text-accent/70" : "text-muted/50"
        }`}
      >
        {count}
      </span>
    </button>
  );
}
