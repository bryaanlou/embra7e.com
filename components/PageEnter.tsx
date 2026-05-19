"use client";

import { usePathname } from "next/navigation";
import type { CSSProperties, ReactNode } from "react";

type Props = {
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
  as?: "div" | "article";
};

function animationKey(pathname: string): string {
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
  const key = animationKey(pathname);
  const cls = `page-enter ${className ?? ""}`.trim();
  if (as === "article") {
    return (
      <article key={key} className={cls} style={style}>
        {children}
      </article>
    );
  }
  return (
    <div key={key} className={cls} style={style}>
      {children}
    </div>
  );
}
