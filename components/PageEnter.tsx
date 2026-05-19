"use client";

import { usePathname } from "next/navigation";
import type { CSSProperties, ReactNode } from "react";

type Props = {
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
  as?: "div" | "article";
};

export function PageEnter({
  className,
  style,
  children,
  as = "div",
}: Props) {
  const pathname = usePathname();
  const cls = `page-enter ${className ?? ""}`.trim();
  if (as === "article") {
    return (
      <article key={pathname} className={cls} style={style}>
        {children}
      </article>
    );
  }
  return (
    <div key={pathname} className={cls} style={style}>
      {children}
    </div>
  );
}
