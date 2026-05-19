"use client";

import { usePathname } from "next/navigation";
import { useRef, type CSSProperties, type ReactNode } from "react";

type Props = {
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
  as?: "div" | "article";
};

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
  const prevPathnameRef = useRef<string | null>(null);

  const currentKey = structuralKey(pathname);
  const prevKey =
    prevPathnameRef.current !== null
      ? structuralKey(prevPathnameRef.current)
      : null;

  const shouldAnimate = prevKey === null || prevKey !== currentKey;

  prevPathnameRef.current = pathname;

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
