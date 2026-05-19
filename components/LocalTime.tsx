"use client";

import { useEffect, useState } from "react";

type Props = {
  iso: string;
};

function format(iso: string, timeZone?: string): string {
  return new Date(iso).toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone,
  });
}

export function LocalTime({ iso }: Props) {
  const [formatted, setFormatted] = useState(() => format(iso, "UTC"));

  useEffect(() => {
    setFormatted(format(iso));
  }, [iso]);

  return (
    <time dateTime={iso} suppressHydrationWarning>
      {formatted}
    </time>
  );
}
