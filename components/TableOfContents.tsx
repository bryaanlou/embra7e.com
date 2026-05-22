import type { TocItem } from "@/lib/articles";

type Props = {
  toc: TocItem[];
};

export function TableOfContents({ toc }: Props) {
  if (toc.length === 0) return null;
  return (
    <nav
      aria-label="Table of contents"
      className="rounded-lg border border-border bg-surface/40 px-5 py-4"
    >
      <p className="text-xs uppercase tracking-widest text-fg mb-3">
        Contents
      </p>
      <ol className="space-y-1.5 text-sm list-none p-0 m-0">
        {toc.map((item, i) => (
          <li
            key={`${item.slug}-${i}`}
            className={item.level === 3 ? "pl-4" : ""}
          >
            <a
              href={`#${item.slug}`}
              className="text-muted hover:text-accent transition-colors"
            >
              {item.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
