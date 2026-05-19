"use client";

import { usePathname } from "next/navigation";
import type { CSSProperties, ReactNode } from "react";

type Props = {
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
  as?: "div" | "article";
};

/**
 * Client-only module state. Survives PageEnter remounts within the same
 * browser tab so we can detect tab-swap navigation (same structural path)
 * and suppress the page-enter animation in those cases. Not used on the
 * server (would leak between requests).
 */
let clientLastKey: string | null = null;

function structuralKey(pathname: string): string {
  const segments = pathname.split("/").filter(Boolean);
  if (segments[0] === "benchmarks" && segments.length >= 3) {
    return `/${segments[0]}/${segments[1]}`;
  }
  return pathname;
}

export function PageEnter({
  className,
  style,
  children,
  as = "div",
}: Props) {
  const pathname = usePathname();
  const currentKey = structuralKey(pathname);

  let shouldAnimate = true;
  if (typeof window !== "undefined") {
    shouldAnimate =
      clientLastKey === null || clientLastKey !== currentKey;
    clientLastKey = currentKey;
  }

  const cls = `${shouldAnimate ? "page-enter " : ""}${className ?? ""}`.trim();

  if (as === "article") {
    return (
      <article className={cls} style={style}>
        {children}
      </article>
    );
  }
  return (
    <div className={cls} style={style}>
      {children}
    </div>
  );
}
