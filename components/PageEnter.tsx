"use client";

import { usePathname } from "next/navigation";
import { useEffect, type CSSProperties, type ReactNode } from "react";

type Props = {
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
  as?: "div" | "article";
};

/**
 * Client-only module state. Survives PageEnter remounts within the same
 * browser tab so we can detect re-navigation to the same path and suppress
 * the page-enter animation in those cases. Written only in useEffect so
 * render stays pure (StrictMode double-invokes the function body — a
 * write-in-render would mismatch SSR).
 */
let clientLastKey: string | null = null;

export function PageEnter({
  className,
  style,
  children,
  as = "div",
}: Props) {
  const currentKey = usePathname();

  const shouldAnimate =
    typeof window === "undefined" ||
    clientLastKey === null ||
    clientLastKey !== currentKey;

  useEffect(() => {
    clientLastKey = currentKey;
  }, [currentKey]);

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
